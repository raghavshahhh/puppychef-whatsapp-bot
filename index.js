// PUPPYCHEF WhatsApp Order Bot
// Main Express server + WhatsApp webhook handler

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

// Choose mode: 'ai' for full LLM agent, 'state' for rule-based
const BOT_MODE = process.env.BOT_MODE || 'ai';

const MENU = require('./src/config/menu');
const orderFlow = require('./src/handlers/orderFlow');
const aiAgent = require('./src/handlers/aiAgent');
const { getMenuShort, getItemDetails } = require('./src/config/menuEnhanced');

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// WhatsApp API configuration
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'puppychef_verify_token_123';

// ============================================
// WEBHOOK ENDPOINTS
// ============================================

// Verification endpoint (GET) - Meta webhook verification
app.get('/webhook', (req, res) => {
  const mode = req.query['hub.mode'];
  const token = req.query['hub.verify_token'];
  const challenge = req.query['hub.challenge'];

  console.log('Webhook verification attempt:', { mode, token });

  if (mode === 'subscribe' && token === VERIFY_TOKEN) {
    console.log('✅ Webhook verified successfully!');
    res.status(200).send(challenge);
  } else {
    console.error('❌ Webhook verification failed');
    res.sendStatus(403);
  }
});

// Webhook receiver (POST) - Handle incoming messages
const recentWelcomes = new Set(); // Prevent duplicate welcomes

app.post('/webhook', async (req, res) => {
  console.log('📩 Webhook received:', JSON.stringify(req.body, null, 2));

  try {
    const body = req.body;

    // Check if it's a WhatsApp message
    if (body.object === 'whatsapp_business_account') {
      const entry = body.entry?.[0];
      const changes = entry?.changes?.[0];
      const value = changes?.value;
      const messages = value?.messages;

      if (messages && messages.length > 0) {
        const message = messages[0];
        const from = message.from;
        const text = message.text?.body || '';
        const msgId = message.id; // Unique message ID for deduplication

        console.log(`📱 Message from ${from}: ${text} (ID: ${msgId})`);

        // Skip if duplicate welcome in last 5 seconds
        const isGreeting = ['hi', 'hello', 'hey', 'start', 'menu', 'namaste', 'hii', 'help'].includes(text.toLowerCase());
        if (isGreeting) {
          const welcomeKey = `${from}:welcome`;
          if (recentWelcomes.has(welcomeKey)) {
            console.log(`[GUARD] Skipping duplicate welcome for ${from}`);
            return res.status(200).send('OK');
          }
          recentWelcomes.add(welcomeKey);
          setTimeout(() => recentWelcomes.delete(welcomeKey), 5000);
        }

        // Process message with AI Agent (smart) or OrderFlow (structured)
        let response;
        let imageToSend = null;

        if (BOT_MODE === 'ai') {
          response = await aiAgent.handleMessage(from, text, msgId);

          // Check if user wants to see product image
          if (aiAgent.isAskingForImage(text)) {
            imageToSend = aiAgent.getImageForItem(text);
          }
        } else {
          response = await orderFlow.handleMessage(from, text, msgId);
        }

        // Send text response
        if (response) {
          await sendWhatsAppMessage(from, response);
        } else {
          console.log(`[SKIP] No text response for ${from}`);
        }

        // Send image if requested
        if (imageToSend) {
          console.log(`[IMAGE] Sending image to ${from}: ${imageToSend.url}`);
          await sendWhatsAppImage(from, imageToSend.url, imageToSend.caption);
        }
      }
    }

    res.status(200).send('OK');
  } catch (error) {
    console.error('❌ Webhook error:', error);
    res.status(200).send('OK'); // Always return 200 to Meta
  }
});

// ============================================
// WHATSAPP MESSAGE SENDER
// ============================================

// Send text message
async function sendWhatsAppMessage(to, message) {
  try {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      console.log('⚠️ WhatsApp credentials not configured. Message would be sent:');
      console.log(`To: ${to}`);
      console.log(`Message: ${message}`);
      return;
    }

    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'text',
      text: {
        preview_url: false,
        body: message
      }
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Message sent:', response.data?.messages?.[0]?.id);
  } catch (error) {
    console.error('❌ Failed to send message:', error.response?.data || error.message);
  }
}

// Send image message
async function sendWhatsAppImage(to, imageUrl, caption = '') {
  try {
    if (!WHATSAPP_TOKEN || !PHONE_NUMBER_ID) {
      console.log('⚠️ WhatsApp credentials not configured. Image would be sent:');
      console.log(`To: ${to}`);
      console.log(`Image: ${imageUrl}`);
      return;
    }

    const url = `https://graph.facebook.com/v18.0/${PHONE_NUMBER_ID}/messages`;

    const payload = {
      messaging_product: 'whatsapp',
      recipient_type: 'individual',
      to: to,
      type: 'image',
      image: {
        link: imageUrl,
        caption: caption
      }
    };

    const response = await axios.post(url, payload, {
      headers: {
        'Authorization': `Bearer ${WHATSAPP_TOKEN}`,
        'Content-Type': 'application/json'
      }
    });

    console.log('✅ Image sent:', response.data?.messages?.[0]?.id);
  } catch (error) {
    console.error('❌ Failed to send image:', error.response?.data || error.message);
  }
}

// ============================================
// API ENDPOINTS
// ============================================

// Health check
app.get('/', (req, res) => {
  res.json({
    status: 'running',
    name: 'Puppychef WhatsApp Bot',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Get menu
app.get('/api/menu', (req, res) => {
  res.json(MENU.categories);
});

// Get orders
app.get('/api/orders', (req, res) => {
  const orders = orderFlow.getAllOrders();
  res.json(orders);
});

// Manual send message endpoint (for testing)
app.post('/api/send', async (req, res) => {
  const { phone, message } = req.body;

  if (!phone || !message) {
    return res.status(400).json({ error: 'Phone and message required' });
  }

  await sendWhatsAppMessage(phone, message);
  res.json({ success: true, message: 'Sent' });
});

// Test endpoint (simulate incoming message)
app.post('/api/test', async (req, res) => {
  try {
    const { phone, message } = req.body;

    if (!phone || !message) {
      return res.status(400).json({ error: 'Phone and message required' });
    }

    // Use AI Agent if enabled
    const response = BOT_MODE === 'ai'
      ? await aiAgent.handleMessage(phone, message)
      : await orderFlow.handleMessage(phone, message);

    res.json({
      phone,
      received: message,
      reply: response,
      mode: BOT_MODE
    });
  } catch (error) {
    console.error('Test endpoint error:', error);
    res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// Debug endpoint to check conversation state
app.get('/api/debug/:phone', (req, res) => {
  const conv = orderFlow.getConversation(req.params.phone);
  res.json({
    state: conv.state,
    currentCategory: conv.currentCategory,
    tempItemName: conv.tempItem?.name,
    orderItemsCount: conv.order.items.length
  });
});

// ============================================
// SERVER START
// ============================================

app.listen(PORT, () => {
  console.log('╔════════════════════════════════════════════════╗');
  console.log('║   🐕 PUPPYCHEF WhatsApp Order Bot 🐕           ║');
  console.log('╠════════════════════════════════════════════════╣');
  console.log(`║  Server running on port: ${PORT}                  ║`);
  console.log(`║  Webhook URL: http://localhost:${PORT}/webhook     ║`);
  console.log('║                                                ║');
  console.log('║  API Endpoints:                                ║');
  console.log('║  • GET  /              - Health check         ║');
  console.log('║  • GET  /api/menu      - Get menu             ║');
  console.log('║  • GET  /api/orders    - Get orders           ║');
  console.log('║  • POST /api/test      - Test bot             ║');
  console.log('║                                                ║');
  console.log('║  WhatsApp Setup:                               ║');
  console.log('║  1. Verify token:', VERIFY_TOKEN.slice(0, 15) + '...', '  ║');
  console.log('║  2. Webhook URL needs ngrok tunnel            ║');
  console.log('║  3. Add credentials to .env                   ║');
  console.log('╚════════════════════════════════════════════════╝');
});

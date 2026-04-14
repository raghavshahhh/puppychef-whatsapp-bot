// RAGSPRO WhatsApp AI Agent
// Acts as Founder (Raghav) to talk with potential clients, book calls, convert leads

const express = require('express');
const bodyParser = require('body-parser');
const axios = require('axios');
require('dotenv').config();

// Choose agent: 'ragspro' for RAGSPRO founder mode, 'puppychef' for old mode
const BOT_MODE = process.env.BOT_MODE || 'ragspro';

const ragsproAgent = require('./src/handlers/ragsproAgent');
const aiAgent = require('./src/handlers/aiAgent'); // Legacy PUPPYCHEF

const app = express();
const PORT = process.env.PORT || 3000;

// Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// WhatsApp API configuration
const WHATSAPP_TOKEN = process.env.WHATSAPP_TOKEN;
const PHONE_NUMBER_ID = process.env.PHONE_NUMBER_ID;
const VERIFY_TOKEN = process.env.VERIFY_TOKEN || 'puppychef_verify_token_123';

// LIVE LINKS
const RAGSPRO_WEBSITE = 'https://ragspro.com';
const LAW_AI_URL = 'https://lawai.ragspro.com';
const RENDER_URL = 'https://puppychef-whatsapp-bot.onrender.com'; // Same Render URL
const GITHUB_URL = 'https://github.com/raghavshahhh/ragspro-whatsapp-agent';

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

        // Process message with RAGSPRO Agent or Legacy PUPPYCHEF
        let response;

        if (BOT_MODE === 'ragspro') {
          // RAGSPRO Founder Mode - handles sales, calls, lead conversion
          response = await ragsproAgent.handleMessage(from, text, msgId);
        } else if (BOT_MODE === 'ai') {
          // Legacy PUPPYCHEF AI Mode
          response = await aiAgent.handleMessage(from, text, msgId);
        } else {
          // Legacy PUPPYCHEF rule-based
          response = await orderFlow.handleMessage(from, text, msgId);
        }

        // Send text response
        if (response) {
          await sendWhatsAppMessage(from, response);
        } else {
          console.log(`[SKIP] No text response for ${from}`);
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
    name: BOT_MODE === 'ragspro' ? 'RAGSPRO WhatsApp AI Agent' : 'Puppychef WhatsApp Bot',
    mode: BOT_MODE,
    version: '2.0.0',
    founder: 'Raghav Shah',
    website: 'https://ragspro.com',
    timestamp: new Date().toISOString()
  });
});

// Get services
app.get('/api/services', (req, res) => {
  const { SERVICES, PORTFOLIO } = require('./src/config/ragsproConfig');
  res.json({ services: SERVICES, portfolio: PORTFOLIO });
});

// Get bookings
app.get('/api/bookings', (req, res) => {
  const bookings = ragsproAgent.getAllBookings ? ragsproAgent.getAllBookings() : [];
  res.json(bookings);
});

// Get leads (n8n integration)
app.get('/api/leads', (req, res) => {
  const n8nIntegration = require('./src/handlers/n8nIntegration');
  res.json(n8nIntegration.getAllLeads());
});

// Webhook for n8n to send messages back
app.post('/api/n8n/send', async (req, res) => {
  const { phone, message } = req.body;
  if (!phone || !message) {
    return res.status(400).json({ error: 'Phone and message required' });
  }
  await sendWhatsAppMessage(phone, message);
  res.json({ success: true, sent: true });
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

    // Use RAGSPRO agent or fallback to legacy
    let response;
    if (BOT_MODE === 'ragspro') {
      response = await ragsproAgent.handleMessage(phone, message);
    } else if (BOT_MODE === 'ai') {
      response = await aiAgent.handleMessage(phone, message);
    } else {
      response = await orderFlow.handleMessage(phone, message);
    }

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
  const isRagspro = BOT_MODE === 'ragspro';
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

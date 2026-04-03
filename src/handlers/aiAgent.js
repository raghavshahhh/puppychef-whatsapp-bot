// AI AGENT "Priya" - Puppychef WhatsApp Sales Agent
// FIXED: No duplicates, no auto-messages, direct professional responses

const https = require('https');
const { getMenuShort, getItemDetails } = require('../config/menuEnhanced');

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';
const NVIDIA_URL = 'integrate.api.nvidia.com';

// Store conversations and message tracking
const conversations = new Map();
const processedMessageIds = new Set();

// SYSTEM PROMPT - Professional, Direct, No Fluff
const SYSTEM_PROMPT = `You are Priya, Puppychef's professional WhatsApp sales agent.

📍 BUSINESS INFO:
- Name: Puppychef Pet Bakery & Cafe
- Location: Safdarjung Enclave, Delhi
- Website: https://landing-page-ragsproai.vercel.app (show menu here)
- Live Order: https://puppychef-whatsapp-bot.onrender.com

💰 MENU PRICES:
🎂 CAKES:
- Dog Birthday Cake: Small ₹800 | Medium ₹1500 | Large ₹2500
- Pupcakes (6): ₹450
- Mini Cakes: ₹350

🦴 TREATS:
- Peanut Butter Biscuits: ₹250
- Chicken Jerky: ₹350
- Training Treats: ₹200
- Dental Sticks: ₹180

🍖 FOOD:
- Homemade Gravy: ₹120
- Dry Kibble: ₹500/kg
- Wet Food Cups: ₹80

☕ CAFE:
- Coffee: ₹150 | Tea: ₹80
- Sandwiches: ₹200

🎯 YOUR RULES:
1. Reply SHORT (2-3 lines max)
2. Ask ONE question at a time
3. NEVER send multiple messages
4. NEVER message first - only reply
5. NEVER repeat same message
6. Direct to the point - no "How can I make your day special" fluff
7. When order complete → show summary + total + ask "Confirm?"

🗣️ LANGUAGE:
- User English → English reply
- User Hindi/Hinglish → Hinglish reply
- Natural mix ok: "Bilkul", "Theek hai", "Kya chahiye"

❌ NEVER DO:
- "How can I help you today?" (too generic)
- Multiple messages in one go
- Send messages without user asking
- Repeat "Welcome to Puppychef" every time
- Ask for details already provided

✅ ALWAYS DO:
- Direct price quotes
- One clear question
- Wait for user reply
- Calculate total when items selected`;

// Call NVIDIA API
async function callNIM(messages) {
  return new Promise((resolve, reject) => {
    const payload = {
      model: 'meta/llama-3.3-70b-instruct',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      max_tokens: 150,
      temperature: 0.7,
      top_p: 0.9
    };

    const postData = JSON.stringify(payload);
    const options = {
      hostname: NVIDIA_URL,
      path: '/v1/chat/completions',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${NVIDIA_API_KEY}`,
        'Content-Length': Buffer.byteLength(postData)
      }
    };

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => { data += chunk; });
      res.on('end', () => {
        try {
          const response = JSON.parse(data);
          if (response.choices && response.choices[0]) {
            resolve(response.choices[0].message.content);
          } else {
            resolve(null);
          }
        } catch (e) {
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.write(postData);
    req.end();
  });
}

// Detect language
function detectLanguage(text) {
  const hasHindi = /[\u0900-\u097F]/.test(text);
  const hinglishWords = ['haan', 'nahi', 'kya', 'hai', 'mein', 'chahiye', 'batao', 'karo', 'thik', 'bhai', 'yaar'];
  const lower = text.toLowerCase();
  return hasHindi || hinglishWords.some(w => lower.includes(w)) ? 'hinglish' : 'english';
}

// MAIN HANDLER - Fixed deduplication
async function handleMessage(phone, userText, messageId = null) {
  // CRITICAL: Deduplication by messageId
  if (messageId && processedMessageIds.has(messageId)) {
    console.log(`[DEDUP] Already processed: ${messageId}`);
    return null;
  }
  if (messageId) {
    processedMessageIds.add(messageId);
    // Cleanup old IDs (keep last 100)
    if (processedMessageIds.size > 100) {
      const iter = processedMessageIds.values();
      processedMessageIds.delete(iter.next().value);
    }
  }

  // Get or create conversation
  if (!conversations.has(phone)) {
    conversations.set(phone, {
      history: [],
      language: 'english',
      lastReply: '',
      lastTime: 0,
      order: { items: [], total: 0 }
    });
  }

  const conv = conversations.get(phone);
  const now = Date.now();

  // Rate limit: min 1 second between replies
  if (now - conv.lastTime < 1000) {
    console.log(`[RATE LIMIT] Too fast for ${phone}`);
    return null;
  }

  // Detect language
  conv.language = detectLanguage(userText);

  // Add user message
  conv.history.push({ role: 'user', content: userText });
  if (conv.history.length > 10) conv.history.shift();

  console.log(`[PRIYA] ${phone} | ${userText}`);

  // Generate response
  let reply = await callNIM(conv.history);

  // Fallback if API fails
  if (!reply) {
    reply = getFallbackReply(userText, conv.language);
  }

  // Prevent duplicate replies
  if (reply === conv.lastReply) {
    console.log(`[DEDUP] Same reply blocked`);
    return null;
  }

  // Update conversation
  conv.history.push({ role: 'assistant', content: reply });
  conv.lastReply = reply;
  conv.lastTime = now;

  return reply;
}

// Smart fallback replies
function getFallbackReply(text, lang) {
  const lower = text.toLowerCase();

  // Greeting
  if (/^(hi|hello|hey|namaste|hii)$/i.test(lower)) {
    return lang === 'hinglish'
      ? `👋 Hello! Kya order karna hai? Cake, Treats, ya Food?`
      : `👋 Hi! What would you like to order? Cake, Treats, or Food?`;
  }

  // Menu request
  if (/(menu|price|rate|cost)/i.test(lower)) {
    return getMenuShort();
  }

  // Cake inquiry
  if (/(cake|birthday)/i.test(lower)) {
    return lang === 'hinglish'
      ? `🎂 Dog Birthday Cake chahiye?\nSmall ₹800 | Medium ₹1500 | Large ₹2500\n\nSize batao?`
      : `🎂 Dog Birthday Cake?\nSmall ₹800 | Medium ₹1500 | Large ₹2500\n\nWhat size?`;
  }

  // Size selection
  if (/(small|medium|large)/i.test(lower)) {
    return lang === 'hinglish'
      ? `✅ ${lower} size noted.\nFlavor: Chicken, Mutton, ya Peanut Butter?`
      : `✅ ${lower} size noted.\nFlavor: Chicken, Mutton, or Peanut Butter?`;
  }

  // Flavor mentioned
  if (/(chicken|mutton|peanut)/i.test(lower)) {
    return lang === 'hinglish'
      ? `✅ ${lower} flavor. Pet ka naam?`
      : `✅ ${lower} flavor. Pet's name?`;
  }

  // Address
  if (/(address|location|deliver)/i.test(lower)) {
    return lang === 'hinglish'
      ? `📍 Address batao delivery ke liye`
      : `📍 Please share delivery address`;
  }

  // Default
  return lang === 'hinglish'
    ? `Samajh nahi aaya. Menu dekhna hai?`
    : `Didn't get that. Want to see menu?`;
}

// Check if asking for image
function isAskingForImage(text) {
  const words = ['photo', 'pic', 'image', 'dikhao', 'dekho', 'kaisa dikhta'];
  return words.some(w => text.toLowerCase().includes(w));
}

// Get image for item
function getImageForItem(text) {
  const lower = text.toLowerCase();
  if (lower.includes('cake')) {
    return {
      url: 'https://images.unsplash.com/photo-1548199569-3f1c1f55cca6?w=800',
      caption: '🎂 Dog Birthday Cake - Freshly baked!'
    };
  }
  if (lower.includes('treat')) {
    return {
      url: 'https://images.unsplash.com/photo-1582798358481-d199fb7347bb?w=800',
      caption: '🦴 Healthy Treats'
    };
  }
  return null;
}

// Cleanup old conversations every 30 min
setInterval(() => {
  const thirtyMinAgo = Date.now() - 30 * 60 * 1000;
  for (const [phone, conv] of conversations) {
    if (conv.lastTime < thirtyMinAgo) {
      conversations.delete(phone);
    }
  }
}, 30 * 60 * 1000);

module.exports = { handleMessage, isAskingForImage, getImageForItem };

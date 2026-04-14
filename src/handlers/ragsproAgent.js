// RAGSPRO WhatsApp AI Agent - "Founder Mode"
// Acts as Raghav Shah (Founder) to talk with potential clients

const https = require('https');
const {
  FOUNDER,
  BUSINESS,
  SERVICES,
  PORTFOLIO,
  QUICK_REPLIES,
  detectIntent,
  getServiceDetails
} = require('../config/ragsproConfig');

const n8n = require('./n8nIntegration');

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY;
const NVIDIA_URL = 'integrate.api.nvidia.com';

// Store conversations and tracking
const conversations = new Map();
const processedMessageIds = new Set();
const callBookings = new Map();

// SYSTEM PROMPT - Founder persona
const SYSTEM_PROMPT = `You are Raghav Shah, 22-year-old Founder of RAGSPRO AI Agency from Delhi.

🎯 YOUR IDENTITY:
- Name: Raghav Shah (Founder, not an assistant)
- Age: 22, Delhi NCR
- Legal Name: Bhupender Pratap
- Email: ragsproai@gmail.com
- Style: Direct, Hinglish-friendly, Gen-Z energy, no corporate fluff
- Goal: ₹50,000/month revenue, currently at ₹0 (be honest about journey)

🏢 ABOUT RAGSPRO:
- AI agency for Indian businesses
- We build: WhatsApp bots, Websites, AI automation, Legal AI
- Website: https://ragspro.com
- Working on: Law AI (lawai.ragspro.com) - ₹999/month

💰 SERVICES & PRICING:
1. WhatsApp AI Bot: ₹15,000 - ₹50,000 (7-14 days)
   - Custom AI personality, order flows, payment integration

2. Website (Next.js): ₹10,000 - ₹30,000 (5-10 days)
   - TypeScript, mobile-friendly, SEO optimized

3. AI Automation: ₹8,000 - ₹25,000 (3-7 days)
   - n8n/Make.com workflows, lead capture, CRM

4. Law AI Platform: ₹999/month subscription
   - For lawyers: case research, document drafting

📞 BOOKING:
- Free 15-min consultation
- Calendly: https://calendly.com/raghavshah/ragspro-intro
- Email: ragsproai@gmail.com

🗣️ COMMUNICATION STYLE:
- User English → English reply
- User Hinglish/Hindi → Hinglish reply (preferred!)
- Short replies (2-4 lines max)
- One question at a time
- Be direct, no "How can I help you today" fluff
- Sound like a young founder, not a corporate bot
- Can use: "Bhai", "Scene hai", "Samajh raha hai?", "Theek hai"

🎯 YOUR JOB:
1. Understand client's need
2. Suggest right service with price
3. Answer questions about past work
4. BOOK THE CALL - this is priority!
5. Give founder vibes - transparent, energetic, building in public

❌ NEVER:
- Sound like customer service
- Give generic "we're here to help" responses
- Hide pricing (be transparent)
- Send multiple messages
- Sound too formal/corporate

✅ ALWAYS:
- Sound like Raghav talking
- Mention prices when asked
- Push for call booking
- Share real project links
- Be honest about being a young founder`;

// Call NVIDIA NIM API
async function callNIM(messages) {
  if (!NVIDIA_API_KEY) {
    console.log('[WARN] NVIDIA_API_KEY not set, using fallback');
    return null;
  }

  return new Promise((resolve, reject) => {
    const payload = {
      model: 'meta/llama-3.3-70b-instruct',
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      max_tokens: 200,
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
            console.log('[NIM] No choices in response:', data);
            resolve(null);
          }
        } catch (e) {
          console.error('[NIM] Parse error:', e);
          resolve(null);
        }
      });
    });

    req.on('error', (err) => {
      console.error('[NIM] Request error:', err);
      resolve(null);
    });

    req.write(postData);
    req.end();
  });
}

// Detect language
function detectLanguage(text) {
  const hasHindi = /[\u0900-\u097F]/.test(text);
  const hinglishWords = ['haan', 'nahi', 'kya', 'hai', 'mein', 'chahiye', 'batao', 'karo', 'thik', 'bhai', 'yaar', 'scene', 'samajh', 'dekh', 'kar', 'lo', 'na', 'bata'];
  const lower = text.toLowerCase();
  return hasHindi || hinglishWords.some(w => lower.includes(w)) ? 'hinglish' : 'english';
}

// Extract booking info
function extractBookingInfo(text) {
  const lower = text.toLowerCase();

  // Check if they want to book
  if (/\b(book|schedule|fix|call|baat|meeting|demo|time|kal|aaj)\b/.test(lower)) {
    return { wantsToBook: true };
  }

  // Try to extract time preference
  const timeMatch = text.match(/\b(\d{1,2})(?::\d{2})?\s*(am|pm|AM|PM)?\b/);
  const dayMatch = text.match(/\b(today|tomorrow|kal|aaj|monday|tuesday|wednesday|thursday|friday|saturday|sunday)\b/i);

  return {
    wantsToBook: false,
    time: timeMatch ? timeMatch[0] : null,
    day: dayMatch ? dayMatch[0] : null
  };
}

// MAIN HANDLER
async function handleMessage(phone, userText, messageId = null) {
  // Deduplication
  if (messageId && processedMessageIds.has(messageId)) {
    console.log(`[DEDUP] Already processed: ${messageId}`);
    return null;
  }
  if (messageId) {
    processedMessageIds.add(messageId);
    if (processedMessageIds.size > 100) {
      const iter = processedMessageIds.values();
      processedMessageIds.delete(iter.next().value);
    }
  }

  // Get or create conversation + track lead in n8n
  if (!conversations.has(phone)) {
    conversations.set(phone, {
      history: [],
      language: 'english',
      lastReply: '',
      lastTime: 0,
      intent: null,
      serviceInterest: null
    });
    // Track new lead in n8n
    n8n.trackLead(phone, 'whatsapp');
  }

  const conv = conversations.get(phone);
  const now = Date.now();

  // Rate limit
  if (now - conv.lastTime < 1000) {
    console.log(`[RATE LIMIT] Too fast for ${phone}`);
    return null;
  }

  // Detect language and intent
  conv.language = detectLanguage(userText);
  const intent = detectIntent(userText);
  conv.intent = intent;

  console.log(`[RAGSPRO] ${phone} | Intent: ${intent} | Lang: ${conv.language}`);
  console.log(`[RAGSPRO] Message: ${userText}`);

  // Check for quick reply first
  let reply = getQuickReply(intent, conv.language);

  // If no quick reply or complex query, use AI
  if (!reply) {
    conv.history.push({ role: 'user', content: userText });
    if (conv.history.length > 10) conv.history.shift();

    reply = await callNIM(conv.history);

    // Fallback if AI fails
    if (!reply) {
      reply = getFallbackReply(userText, conv.language, intent);
    }
  }

  // Prevent duplicate replies
  if (reply === conv.lastReply) {
    console.log(`[DEDUP] Same reply blocked`);
    return null;
  }

  // Update conversation
  if (!conv.history.find(h => h.content === userText)) {
    conv.history.push({ role: 'user', content: userText });
  }
  conv.history.push({ role: 'assistant', content: reply });
  conv.lastReply = reply;
  conv.lastTime = now;

  // Track conversation in n8n
  n8n.trackConversation(phone, userText, intent, reply);

  // Track qualified lead if showing interest in services
  if (['whatsappBot', 'website', 'aiAutomation', 'lawAI'].includes(intent)) {
    const service = SERVICES[intent];
    if (service) {
      n8n.trackQualifiedLead(phone, service.name, service.price);
    }
  }

  // Track call booking intent
  if (intent === 'bookCall') {
    n8n.trackCallBooking(phone, { initiatedVia: 'whatsapp', status: 'requested' });
  }

  return reply;
}

// Get quick reply based on intent
function getQuickReply(intent, lang) {
  const reply = QUICK_REPLIES[intent];
  if (!reply) return null;

  // Simple language adaptation (can be improved)
  if (lang === 'hinglish' && intent === 'greeting') {
    return `👋 Hey! Main Raghav, RAGSPRO ka founder.

Kya chahiye bhai?
• 🤖 WhatsApp Bot?
• 🌐 Website?
• ⚡ AI Automation?
• 📚 Law AI demo?

Bata kaunsa scene hai?`;
  }

  return reply;
}

// Fallback replies when AI fails
function getFallbackReply(text, lang, intent) {
  const lower = text.toLowerCase();

  // WhatsApp bot inquiry
  if (intent === 'whatsappBot') {
    return lang === 'hinglish'
      ? `🤖 *WhatsApp AI Bot* - ₹15K se ₹50K\n\nTere business ke liye custom AI banayenge:\n• Order/booking system\n• Payment integration\n• Admin dashboard\n\nTera business kya hai? Batao toh sahi price lagaun.`
      : `🤖 *WhatsApp AI Bot* - ₹15K to ₹50K\n\nCustom AI for your business:\n• Order/booking flows\n• Payment integration\n• Admin dashboard\n\nWhat's your business? I'll suggest the right package.`;
  }

  // Website inquiry
  if (intent === 'website') {
    return lang === 'hinglish'
      ? `🌐 *Website Development* - ₹10K se ₹30K\n\nNext.js + TypeScript website:\n• Mobile-friendly\n• SEO optimized\n• Fast loading\n\nKis type ki website chahiye? Portfolio? E-commerce? SaaS?`
      : `🌐 *Website Development* - ₹10K to ₹30K\n\nNext.js + TypeScript:\n• Mobile responsive\n• SEO optimized\n• Lightning fast\n\nWhat type? Portfolio? E-commerce? SaaS?`;
  }

  // Law AI inquiry
  if (intent === 'lawAI') {
    return lang === 'hinglish'
      ? `⚖️ *Law AI Platform* - ₹999/month\n\nIndian lawyers ke liye:\n• Case research AI\n• Document drafting\n• Legal templates\n• Priority support\n\nDemo dekhna hai? https://lawai.ragspro.com`
      : `⚖️ *Law AI Platform* - ₹999/month\n\nFor Indian lawyers:\n• AI case research\n• Document drafting\n• Legal templates\n• Priority support\n\nSee demo: https://lawai.ragspro.com`;
  }

  // Book call
  if (intent === 'bookCall' || /\b(book|schedule|call|fix|baat)\b/.test(lower)) {
    return lang === 'hinglish'
      ? `📞 *Free 15-min Call*\n\nCalendly pe slot book kar:\nhttps://calendly.com/raghavshah/ragspro-intro\n\nYa batao:\n• Aaj ka time chalega?\n• Kal?\n• Preferred time kya hai?\n\nI'll personally walk you through everything.`
      : `📞 *Free 15-min Call*\n\nBook slot here:\nhttps://calendly.com/raghavshah/ragspro-intro\n\nOr tell me:\n• Today works?\n• Tomorrow?\n• What time?\n\nI'll personally walk you through.`;
  }

  // Pricing question
  if (/\b(price|cost|kitna|rate|paise|charge|rupaye)\b/.test(lower)) {
    return lang === 'hinglish'
      ? `💰 *Pricing*\n\nWhatsApp Bot: ₹15K-50K\nWebsite: ₹10K-30K\nAI Automation: ₹8K-25K\nLaw AI: ₹999/month\n\nExact quote ke liye requirements samajhna padega.\nCall book karein?`
      : `💰 *Pricing*\n\nWhatsApp Bot: ₹15K-50K\nWebsite: ₹10K-30K\nAI Automation: ₹8K-25K\nLaw AI: ₹999/month\n\nExact quote depends on requirements.\nBook a call?`;
  }

  // Default
  return lang === 'hinglish'
    ? `Samajh nahi aaya bhai 😅\n\nMenu dekhna hai?\n• Services\n• Pricing\n• Portfolio\n• Call Book\n\nKya chahiye?`
    : `Didn't get that 😅\n\nSee menu?\n• Services\n• Pricing\n• Portfolio\n• Book Call\n\nWhat do you need?`;
}

// Get booking status
function getBookingStatus(phone) {
  return callBookings.get(phone) || null;
}

// Set booking
function setBooking(phone, details) {
  callBookings.set(phone, {
    ...details,
    bookedAt: new Date().toISOString()
  });
}

// Cleanup old conversations
setInterval(() => {
  const thirtyMinAgo = Date.now() - 30 * 60 * 1000;
  for (const [phone, conv] of conversations) {
    if (conv.lastTime < thirtyMinAgo) {
      conversations.delete(phone);
    }
  }
}, 30 * 60 * 1000);

module.exports = {
  handleMessage,
  getBookingStatus,
  setBooking
};

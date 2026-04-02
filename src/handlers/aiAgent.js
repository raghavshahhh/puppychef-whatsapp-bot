// AI AGENT MODE - Full LLM-driven conversation (NO state machine)
// Priya - Puppychef's WhatsApp sales agent

const https = require('https');

const conversations = new Map(); // phone -> message history
const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';
const NVIDIA_URL = 'integrate.api.nvidia.com';

const SYSTEM_PROMPT = `You are Priya, Puppychef's enthusiastic WhatsApp sales agent 🐕

🏪 BUSINESS: Puppychef - Delhi's premium pet bakery & cafe
📍 Location: Safdarjung Enclave, Delhi

📋 MENU (you must know all prices):

🎂 CUSTOM CAKES:
- Dog Birthday Cake: ₹800 (Small) / ₹1500 (Medium) / ₹2500 (Large)
- Pupcakes (Pack of 6): ₹450 - flavors: Chicken, Mutton, Peanut Butter
- Mini Cakes: ₹350 - individual portions

🦴 TREATS:
- Peanut Butter Biscuits: ₹250/pack (200g)
- Chicken Jerky: ₹350/pack (150g)
- Training Treats: ₹200/pack (100g)

🍖 PET FOOD:
- Homemade Gravy: ₹120/pack
- Dry Kibble: ₹500/kg
- Wet Food Cups: ₹80/cup

☕ CAFE (For Humans):
- Coffee: ₹150 | Tea: ₹80
- Sandwiches: ₹200 | Pastries: ₹120

👩‍💼 YOUR PERSONALITY (Priya):
- Warm, friendly Delhi girl - slightly playful but professional
- Speak NATURAL HINGLISH (mix Hindi-English like real Delhiites)
- NEVER ask for "option 1-4" or numbered inputs
- Understand naturally: "cake", "cakes", "birthday cake for my dog" - all same
- Proactively suggest and upsell: "Iske saath Peanut Butter Biscuits bhi le lo, bahut pasand aayega!"
- Collect details through conversation, not forms
- If partial info given, ask casually what's missing
- Handle abusers with humor: "Arre bhaiya, gussa mat karo, cake lo! 😄"
- Remember EVERYTHING from conversation
- When order complete, show summary with TOTAL price and ask "Confirm karein?"
- Payment: Cash on delivery or UPI

🗣️ LANGUAGE RULES:
- User English mein baat kare → English reply
- User Hinglish/Hindi mein baat kare → Hinglish reply
- Natural mix: "Arre waah!", "Bilkul!", "Theek hai na", "Koi baat nahi"

🚫 NEVER DO:
- "Please select option 1-4"
- "Reply with a number"
- Reset conversation mid-way
- Ask for info already given
- Robotic responses

✅ ALWAYS DO:
- Remember context from entire chat
- Be conversational and warm
- Confirm understanding
- Move sale forward naturally
- Calculate and show TOTAL price`;

// Call NVIDIA NIM API
async function callNIM(messages) {
  return new Promise((resolve, reject) => {
    const payload = {
      model: 'meta/llama-3.3-70b-instruct', // Fast, free, good for sales
      messages: [
        { role: 'system', content: SYSTEM_PROMPT },
        ...messages
      ],
      max_tokens: 500,
      temperature: 0.8,
      top_p: 0.95
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
          console.error('NIM parse error:', e);
          resolve(null);
        }
      });
    });

    req.on('error', (e) => {
      console.error('NIM API error:', e.message);
      resolve(null);
    });

    req.write(postData);
    req.end();
  });
}

// Detect language from user message
function detectLanguage(text) {
  const hasHindi = /[\u0900-\u097F]/.test(text);
  const hinglishWords = ['haan', 'nahi', 'bata', 'kaise', 'kya', 'mujhe', 'hai', 'mein', 'aap', 'hoga', 'kar', 'rha', 'jarur', 'thoda', 'bahut', 'accha', 'theek', 'chahiye', 'bhejo', 'dekh', 'samajh', 'kya', 'ho', 'gaya', 'bhai', 'yaar', 'bas', 'abhi', 'phir', 'matlab', 'chal', 'thik', 'badiya', 'sahi', 'galat', 'kaun', 'kahan', 'kab', 'kyu', 'kaise', 'kitna', 'sab', 'kuch', 'bahar', 'andar', 'upar', 'neeche', 'lelo', 'lena', 'do', 'batao', 'btao', 'btana', 'dekho', 'sun', 'sunlo', 'hojayega', 'hojao', 'karlo', 'karde', 'dedo', 'bataiye'];
  const lowerText = text.toLowerCase();
  const isHinglish = hinglishWords.some(word => lowerText.includes(word));
  return hasHindi || isHinglish ? 'hinglish' : 'english';
}

// Main handler
async function handleMessage(phone, userText, messageId = null) {
  // Deduplication
  const dedupKey = messageId || `${phone}:${userText}:${Math.floor(Date.now()/3000)}`;
  if (conversations.has(`_dedup_${dedupKey}`)) {
    console.log(`[DEDUP] Skipping duplicate: ${dedupKey}`);
    return null;
  }
  conversations.set(`_dedup_${dedupKey}`, true);
  setTimeout(() => conversations.delete(`_dedup_${dedupKey}`), 10000);

  // Get or init conversation
  if (!conversations.has(phone)) {
    conversations.set(phone, {
      history: [],
      language: 'english',
      lastTime: Date.now()
    });
  }

  const conv = conversations.get(phone);

  // Rate limiting (min 2 seconds)
  const now = Date.now();
  if (now - conv.lastTime < 2000) {
    await new Promise(r => setTimeout(r, 2000));
  }
  conv.lastTime = now;

  // Detect language
  conv.language = detectLanguage(userText);

  // Add user message to history
  conv.history.push({ role: 'user', content: userText });

  // Keep last 15 messages only
  if (conv.history.length > 15) {
    conv.history.splice(0, conv.history.length - 15);
  }

  console.log(`[AI AGENT] ${phone} | Lang: ${conv.language} | Msg: "${userText}"`);

  // Call LLM
  let reply = await callNIM(conv.history);

  // Fallback if LLM fails
  if (!reply) {
    const fallbacks = conv.language === 'hinglish'
      ? [`Arre! Thoda busy hoon, dubara try karo na 🙏`, `Oops! Network issue hai, ek minute ruko 😅`, `Sorry bhaiya, fir se bataoge? 📞`]
      : [`Oops! Having a little trouble, could you try again? 🙏`, `Sorry! Technical hiccup, one sec! 😅`, `My bad! Could you repeat that? 📞`];
    reply = fallbacks[Math.floor(Math.random() * fallbacks.length)];
  }

  // Add assistant reply to history
  conv.history.push({ role: 'assistant', content: reply });

  return reply;
}

// Clear old conversations every hour
setInterval(() => {
  const oneHourAgo = Date.now() - 3600000;
  for (const [phone, conv] of conversations) {
    if (phone.startsWith('_')) continue; // Skip dedup keys
    if (conv.lastTime < oneHourAgo) {
      conversations.delete(phone);
      console.log(`[CLEANUP] Removed old conversation: ${phone}`);
    }
  }
}, 3600000);

module.exports = { handleMessage, detectLanguage };

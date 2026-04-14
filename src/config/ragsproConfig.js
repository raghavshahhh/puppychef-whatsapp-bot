// RAGSPRO Agency Configuration
// Business info, services, pricing for WhatsApp AI Agent

const FOUNDER = {
  name: 'Raghav Shah',
  age: 22,
  location: 'Delhi, India',
  role: 'Founder & Lead Developer',
  email: 'ragsproai@gmail.com',
  legalName: 'Bhupender Pratap'
};

const BUSINESS = {
  name: 'RAGSPRO',
  tagline: 'AI Agency for Indian Businesses',
  description: 'We build AI-powered solutions - WhatsApp bots, websites, automation, and legal AI tools',
  website: 'https://ragspro.com',
  location: 'Delhi, India',
  founded: '2024'
};

const SERVICES = {
  whatsappBot: {
    name: 'WhatsApp AI Bot',
    description: 'Custom AI agents for your business on WhatsApp',
    price: '₹15,000 - ₹50,000',
    timeline: '7-14 days',
    includes: ['Custom AI personality', 'Order/booking flow', 'Payment integration', 'Admin dashboard']
  },
  website: {
    name: 'Website Development',
    description: 'Next.js websites with AI features',
    price: '₹10,000 - ₹30,000',
    timeline: '5-10 days',
    includes: ['Next.js + TypeScript', 'Mobile responsive', 'SEO optimized', 'Fast loading']
  },
  aiAutomation: {
    name: 'AI Automation',
    description: 'n8n/Make.com workflows with AI',
    price: '₹8,000 - ₹25,000',
    timeline: '3-7 days',
    includes: ['Lead auto-capture', 'CRM integration', 'Email sequences', 'AI responses']
  },
  lawAI: {
    name: 'Law AI Platform',
    description: 'AI legal assistant for lawyers (SaaS)',
    price: '₹999/month subscription',
    timeline: 'Instant access',
    includes: ['Case research AI', 'Document drafting', 'Legal templates', 'Priority support']
  }
};

const PORTFOLIO = {
  lawAI: {
    name: 'Law AI',
    url: 'https://lawai.ragspro.com',
    description: 'AI legal assistant for Indian lawyers'
  },
  agencyOS: {
    name: 'Agency OS',
    url: 'https://agency.ragspro.com',
    description: 'Lead management system'
  },
  puppychef: {
    name: 'PuppyChef',
    url: 'https://puppychef-v2.vercel.app',
    description: 'WhatsApp order bot for pet bakery'
  }
};

const PRICING = {
  consultation: 'FREE',
  call: 'Book 15-min free call',
  whatsapp: '+91 (WhatsApp Business)'
};

// Quick replies for common questions
const QUICK_REPLIES = {
  greeting: `👋 Hey! Main RAGSPRO ka AI hu - Raghav (founder) ki tarah baat kar sakta hu!

Kya chahiye tujhe?
• 🤖 WhatsApp Bot banwana hai?
• 🌐 Website chahiye?
• ⚡ AI Automation setup?
• 📚 Law AI demo dekhna hai?

Bata, kaunsa project discuss kare?`,

  services: `🚀 RAGSPRO Services:

1️⃣ *WhatsApp AI Bot* - ₹15K-50K
   Custom AI agent for your business

2️⃣ *Website Dev* - ₹10K-30K
   Next.js + AI features

3️⃣ *AI Automation* - ₹8K-25K
   n8n/Make.com workflows

4️⃣ *Law AI* - ₹999/month
   For lawyers/legal teams

Konsa explore karna hai?`,

  founder: `👨‍💻 *Raghav Shah* - Founder

• Age: 22, Delhi
• 2+ years building AI products
• Ex-Full Stack Dev
• Specializes: WhatsApp bots, Legal AI, Automation

Goal: Indian businesses ko AI-powered banana 🚀

Website: ragspro.com`,

  contact: `📞 *Contact RAGSPRO*

Email: ragsproai@gmail.com
Website: ragspro.com
Founder: Raghav Shah

Free consultation ke liye:
"CALL" likh ke bhejo - hum schedule kar lenge!`,

  portfolio: `🎯 *Our Projects:*

1. *Law AI* → lawai.ragspro.com
   AI for Indian lawyers

2. *Agency OS* → agency.ragspro.com
   Lead management system

3. *PuppyChef* → puppychef-v2.vercel.app
   WhatsApp order bot

Demo dekhna hai kisi ka?`};

// Detect intent from user message
function detectIntent(text) {
  const lower = text.toLowerCase();

  if (/\b(hi|hello|hey|namaste|hii|start)\b/.test(lower)) return 'greeting';
  if (/\b(service|price|pricing|cost|rate|kitna|charge)\b/.test(lower)) return 'services';
  if (/\b(founder|raghav|owner|kaun|tum kaun|about)\b/.test(lower)) return 'founder';
  if (/\b(contact|call|phone|email|reach|baat|number)\b/.test(lower)) return 'contact';
  if (/\b(portfolio|work|project|client|example|demo)\b/.test(lower)) return 'portfolio';
  if (/\b(whatsapp|bot|ai|automation)\b/.test(lower)) return 'whatsappBot';
  if (/\b(website|site|web)\b/.test(lower)) return 'website';
  if (/\b(law|legal|lawyer|court|case)\b/.test(lower)) return 'lawAI';
  if (/\b(book|schedule|call|meeting|baat)\b/.test(lower)) return 'bookCall';

  return 'general';
}

// Get service details
function getServiceDetails(serviceKey) {
  const service = SERVICES[serviceKey];
  if (!service) return null;

  return `*${service.name}* - ${service.price}

${service.description}

⏱️ Timeline: ${service.timeline}

✅ Includes:
${service.includes.map(i => `• ${i}`).join('\n')}

Aur details chahiye? Ya call book karein?`;
}

module.exports = {
  FOUNDER,
  BUSINESS,
  SERVICES,
  PORTFOLIO,
  PRICING,
  QUICK_REPLIES,
  detectIntent,
  getServiceDetails
};

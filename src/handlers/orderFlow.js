// Order Flow with NVIDIA NIM AI Integration + Deduplication + Rate Limiting

const MENU = require('../config/menu');
const nvidia = require('./nvidiaNim');
const fs = require('fs');
const path = require('path');

// Storage
const conversations = new Map();
const processedMessages = new Set();
const ORDERS_FILE = path.join(__dirname, '../models/orders.json');
const STATE_FILE = path.join(__dirname, '../models/conversations.json');

// Rate limiting config
const RATE_LIMIT_MS = 3000;
const MESSAGE_EXPIRY_MS = 60000;

// Load saved conversations
function loadConversations() {
  try {
    if (fs.existsSync(STATE_FILE)) {
      const data = JSON.parse(fs.readFileSync(STATE_FILE, 'utf8'));
      for (const [phone, conv] of Object.entries(data)) {
        conversations.set(phone, conv);
      }
    }
  } catch (e) {
    console.log('No saved conversations found');
  }
}

function saveConversations() {
  try {
    const data = {};
    for (const [phone, conv] of conversations) {
      data[phone] = conv;
    }
    fs.writeFileSync(STATE_FILE, JSON.stringify(data, null, 2));
  } catch (e) {
    console.error('Error saving conversations:', e);
  }
}

loadConversations();

// Ensure orders file exists
if (!fs.existsSync(path.dirname(ORDERS_FILE))) {
  fs.mkdirSync(path.dirname(ORDERS_FILE), { recursive: true });
}
if (!fs.existsSync(ORDERS_FILE)) {
  fs.writeFileSync(ORDERS_FILE, '[]');
}

// Detect language from text
function detectLanguage(text) {
  const hasHindi = /[\u0900-\u097F]/.test(text);
  const hinglishWords = ['haan', 'nahi', 'bata', 'kaise', 'kya', 'mujhe', 'hai', 'mein', 'aap', 'hoga', 'kar', 'rha', 'jarur', 'thoda', 'bahut', 'accha', 'theek', 'chahiye', 'bhejo', 'dekh', 'samajh', 'kya', 'ho', 'gaya', 'bhai', 'yaar', 'bas', 'abhi', 'phir', 'matlab', 'chal', 'thik', 'badiya', 'sahi', 'galat', 'kaun', 'kahan', 'kab', 'kyu', 'kaise', 'kitna', 'sab', 'kuch', 'bahar', 'andar', 'upar', 'neeche'];
  const lowerText = text.toLowerCase();
  const isHinglish = hinglishWords.some(word => lowerText.includes(word));
  return hasHindi || isHinglish ? 'hinglish' : 'english';
}

// Response templates - English
const RESPONSES_EN = {
  greetings: [
    `Hello! Welcome to Puppychef 🐕\n\nDelhi's favourite pet bakery - where we craft fresh, healthy cakes & treats for your furry companions 🎂🦴\n\nHow may I help you today?`,
    `Hi there! 👋 Thank you for reaching out to Puppychef.\n\nWe specialize in custom pet cakes, treats, and nutritious meals for your beloved pets 🐾\n\nWhat would you like to order?`
  ],
  menuPrompt: `Please take a look at our menu and let us know what interests you 😊`,
  invalidCategory: `Please select a valid option (1-4) 😊`,
  invalidItem: `Please select a, b, c, or d. Or type 'back' to see categories again.`,
  quantityAsk: `How many would you like? 😊`,
  addressAsk: `Perfect! 🛒 Please share your delivery address:\n\n(Full address with pincode)\n\nOr type "pickup" if you'd prefer to collect from our Safdarjung Enclave store 📍`,
  restart: `No problem! Let's start fresh 😊 How may I help you?`,
  confirmHelp: `Please reply YES ✅ to confirm your order or NO ❌ to cancel`
};

// Response templates - Hinglish
const RESPONSES_HI = {
  greetings: [
    `Namaste! Puppychef mein aapka swagat hai 🐕\n\nDelhi ki favourite pet bakery - fresh cakes aur treats for your furry friends 🎂🦴\n\nMain aapki kya help kar sakta hu?`,
    `Hello bhai! 👋 Puppychef se baat kar rahe ho.\n\nHum banate hain custom pet cakes, treats, aur healthy food 🐾\n\nKya order karna hai?`
  ],
  menuPrompt: `Menu dekh lo please, kya pasand aaya? 😊`,
  invalidCategory: `1-4 mein se select karo 😊`,
  invalidItem: `a, b, c, ya d select karo. "back" likho categories dekhne ke liye.`,
  quantityAsk: `Kitne chahiye? 😊`,
  addressAsk: `Perfect! 🛒 Address batao:\n\n(Pura address with pincode)\n\nYa "pickup" likho agar Safdarjung se collect karna hai 📍`,
  restart: `Koi baat nahi! Fresh start karte hain 😊 Kya chahiye?`,
  confirmHelp: `YES ✅ likho confirm karne ke liye ya NO ❌ cancel karne ke liye`
};

function getResponses(lang) {
  return lang === 'hinglish' ? RESPONSES_HI : RESPONSES_EN;
}

const random = (arr) => arr[Math.floor(Math.random() * arr.length)];

class OrderFlow {
  constructor() {
    this.states = {
      IDLE: 'idle',
      GREETING: 'greeting',
      SELECTING_CATEGORY: 'selecting_category',
      SELECTING_ITEM: 'selecting_item',
      CUSTOMIZING: 'customizing',
      QUANTITY: 'quantity',
      ADDRESS: 'address',
      CONFIRM: 'confirm',
      COMPLETED: 'completed'
    };
  }

  getConversation(phone) {
    if (!conversations.has(phone)) {
      conversations.set(phone, {
        phone,
        state: this.states.IDLE,
        messages: [],
        lastResponseTime: 0,
        language: 'english',
        order: { items: [], customerName: '', address: '', phone: phone },
        tempItem: null
      });
    }
    // Ensure loaded conversations have all required fields
    const conv = conversations.get(phone);
    if (conv.lastResponseTime === undefined) conv.lastResponseTime = 0;
    if (conv.language === undefined) conv.language = 'english';
    return conv;
  }

  addMessage(phone, role, content) {
    const conv = this.getConversation(phone);
    conv.messages.push({ role, content, timestamp: new Date() });
  }

  // Main handler - with DEDUPLICATION + RATE LIMITING
  async handleMessage(phone, message, messageId = null) {
    const text = message.trim();
    
    // DEDUPLICATION: Skip if already processed
    const dedupKey = messageId || `${phone}:${text}:${Math.floor(Date.now()/5000)}`;
    if (processedMessages.has(dedupKey)) {
      console.log(`[DEDUP] Skipping duplicate: ${dedupKey}`);
      return null;
    }
    processedMessages.add(dedupKey);
    
    // Cleanup old messages
    if (processedMessages.size > 500) {
      setTimeout(() => processedMessages.clear(), MESSAGE_EXPIRY_MS);
    }

    const conv = this.getConversation(phone);
    
    // RATE LIMITING: Max 1 response per 3 seconds
    const now = Date.now();
    if (conv.lastResponseTime && (now - conv.lastResponseTime) < RATE_LIMIT_MS) {
      console.log(`[RATE LIMIT] Too fast for ${phone}, waiting...`);
      return null;
    }
    
    // LANGUAGE DETECTION
    conv.language = detectLanguage(text);
    const R = getResponses(conv.language);

    console.log(`[DEBUG] ${phone} | ${text} | lang=${conv.language} | state=${conv.state}`);

    this.addMessage(phone, 'user', text);

    // Reset commands
    if (['hi', 'hello', 'hey', 'start', 'menu', 'namaste', 'hii', 'help'].includes(text.toLowerCase())) {
      conv.state = this.states.GREETING;
      const greeting = await this.generateGreeting(conv);
      this.addMessage(phone, 'assistant', greeting);
      conv.lastResponseTime = Date.now();
      return greeting;
    }

    let response;
    switch (conv.state) {
      case this.states.IDLE:
      case this.states.GREETING:
        response = await this.handleGreeting(conv, text, R);
        break;
      case this.states.SELECTING_CATEGORY:
        response = await this.handleCategorySelection(conv, text, R);
        break;
      case this.states.SELECTING_ITEM:
        response = await this.handleItemSelection(conv, text, R);
        break;
      case this.states.CUSTOMIZING:
        response = await this.handleCustomization(conv, text, R);
        break;
      case this.states.QUANTITY:
        response = await this.handleQuantity(conv, text, R);
        break;
      case this.states.ADDRESS:
        response = await this.handleAddress(conv, text, R);
        break;
      case this.states.CONFIRM:
        response = await this.handleConfirmation(conv, text, R);
        break;
      default:
        response = random(R.greetings);
    }

    this.addMessage(phone, 'assistant', response);
    conv.lastResponseTime = Date.now();
    saveConversations();
    return response;
  }

  async generateGreeting(conv) {
    const R = getResponses(conv.language);
    try {
      const aiResponse = await nvidia.generateGreeting();
      if (aiResponse) return aiResponse;
    } catch (e) {
      console.log('NVIDIA API failed:', e.message);
    }
    return random(R.greetings);
  }

  async handleGreeting(conv, text, R) {
    conv.state = this.states.SELECTING_CATEGORY;
    return await this.handleCategorySelection(conv, text, R);
  }

  async handleCategorySelection(conv, text, R) {
    const categoryId = parseInt(text);
    if (isNaN(categoryId) || categoryId < 1 || categoryId > 4) {
      return R.invalidCategory + "\n\n" + MENU.getMenuText();
    }
    const category = MENU.getCategoryById(categoryId);
    conv.currentCategory = categoryId;
    conv.state = this.states.SELECTING_ITEM;
    return R.menuPrompt + "\n\n" + MENU.getCategoryItemsText(categoryId);
  }

  async handleItemSelection(conv, text, R) {
    const category = MENU.getCategoryById(conv.currentCategory);
    const letter = text.toLowerCase().charAt(0);
    const itemIndex = letter.charCodeAt(0) - 97;
    if (itemIndex < 0 || itemIndex >= category.items.length) {
      return R.invalidItem;
    }
    const item = category.items[itemIndex];
    conv.tempItem = { ...item, category: category.name };
    if (item.customizations && item.customizations.length > 0) {
      conv.state = this.states.CUSTOMIZING;
      return conv.language === 'hinglish' 
        ? `Bahut badhiya! 🎂 Cake customize karna hai:\n\n1️⃣ Pet ka naam\n2️⃣ Flavor (Chicken/Mutton/Peanut Butter)\n3️⃣ Size (Small/Medium/Large)\n4️⃣ Cake pe message (optional)`
        : `Wonderful choice! 🎂 To customize your cake:\n\n1️⃣ Pet's name\n2️⃣ Flavor (Chicken/Mutton/Peanut Butter)\n3️⃣ Size (Small/Medium/Large)\n4️⃣ Message on cake (optional)`;
    }
    conv.state = this.states.QUANTITY;
    return R.quantityAsk;
  }

  async handleCustomization(conv, text, R) {
    const item = conv.tempItem;
    if (!conv.tempItem.customization) {
      conv.tempItem.customization = {};
    }
    const lines = text.split(/[\n,\.]/);
    lines.forEach(line => {
      if (line.toLowerCase().includes('name')) {
        conv.tempItem.customization.petName = line.split(/[:\-]/).pop().trim();
      }
      if (line.toLowerCase().includes('flavor') || item.flavors?.some(f => line.toLowerCase().includes(f.toLowerCase()))) {
        const flavor = item.flavors?.find(f => line.toLowerCase().includes(f.toLowerCase()));
        if (flavor) conv.tempItem.customization.flavor = flavor;
      }
      if (line.toLowerCase().includes('size') || ['small', 'medium', 'large'].some(s => line.toLowerCase().includes(s))) {
        const size = ['small', 'medium', 'large'].find(s => line.toLowerCase().includes(s));
        if (size) {
          conv.tempItem.customization.size = size;
          conv.tempItem.finalPrice = typeof item.price === 'object' ? item.price[size] : item.price;
        }
      }
      if (line.toLowerCase().includes('message') || line.toLowerCase().includes('write')) {
        conv.tempItem.customization.message = line.split(/[:\-]/).pop().trim();
      }
    });
    const hasName = conv.tempItem.customization.petName;
    const hasFlavor = conv.tempItem.customization.flavor;
    const hasSize = conv.tempItem.customization.size || typeof item.price !== 'object';
    if (hasName && hasFlavor && hasSize) {
      conv.state = this.states.QUANTITY;
      const petName = conv.tempItem.customization.petName;
      return conv.language === 'hinglish'
        ? `Perfect! 🐶 ${petName} ko bahut pasand aayega!\n\nKitne ${item.name} chahiye?`
        : `Perfect! 🐶 ${petName} is going to love it!\n\nHow many ${item.name}s would you like?`;
    }
    const missing = [];
    if (!hasName) missing.push(conv.language === 'hinglish' ? "pet ka naam" : "pet's name");
    if (!hasFlavor) missing.push(conv.language === 'hinglish' ? "flavor" : "flavor");
    if (!hasSize) missing.push(conv.language === 'hinglish' ? "size" : "size");
    return conv.language === 'hinglish'
      ? `Thoda aur info chahiye: ${missing.join(', ')} 🐾`
      : `Almost there! Please also provide: ${missing.join(', ')} 🐾`;
  }

  async handleQuantity(conv, text, R) {
    const qty = parseInt(text.match(/\d+/)?.[0]);
    if (!qty || qty < 1) {
      return R.quantityAsk + (conv.language === 'hinglish' ? " (jaise: '2' ya 'just 1')" : " (e.g., '2' or 'just 1')");
    }
    conv.tempItem.quantity = qty;
    conv.state = this.states.ADDRESS;
    return R.addressAsk;
  }

  async handleAddress(conv, text, R) {
    conv.tempItem.address = text;
    conv.order.items.push({ ...conv.tempItem });
    conv.state = this.states.CONFIRM;
    const total = conv.order.items.reduce((sum, item) => {
      const price = item.finalPrice || item.price;
      return sum + (price * item.quantity);
    }, 0);
    const orderSummary = conv.order.items.map(item =>
      `• ${item.name} x${item.quantity} = ₹${(item.finalPrice || item.price) * item.quantity}`
    ).join('\n');
    return conv.language === 'hinglish'
      ? `📋 Order Summary:\n\n${orderSummary}\n\n💰 Total: ₹${total}\n\nSahi hai?\n\n✅ YES likho confirm karne ke liye\n❌ NO likho cancel karne ke liye`
      : `📋 Order Summary:\n\n${orderSummary}\n\n💰 Total: ₹${total}\n\nDoes everything look correct?\n\n✅ Reply YES to confirm\n❌ Reply NO to cancel`;
  }

  async handleConfirmation(conv, text, R) {
    if (['yes', 'confirm', 'yeah', 'yep', 'haan', 'yup', 'sure', 'h'].includes(text.toLowerCase())) {
      const orderId = `PC-${Date.now().toString(36).toUpperCase().slice(-6)}`;
      const total = conv.order.items.reduce((sum, item) => {
        const price = item.finalPrice || item.price;
        return sum + (price * item.quantity);
      }, 0);
      const order = {
        id: orderId,
        phone: conv.phone,
        items: conv.order.items,
        total: total,
        address: conv.order.items[0]?.address || '',
        status: 'confirmed',
        timestamp: new Date().toISOString()
      };
      this.saveOrder(order);
      conversations.set(conv.phone, {
        phone: conv.phone,
        state: this.states.IDLE,
        messages: [],
        lastResponseTime: 0,
        language: conv.language,
        order: { items: [], customerName: '', address: '', phone: conv.phone },
        tempItem: null
      });
      return conv.language === 'hinglish'
        ? `✅ Order Confirmed! Puppychef pe bharosa karne ke liye dhanyawaad 🎉\n\n🔖 Order ID: ${orderId}\n💰 Total: ₹${total}\n\nHum jaldi contact karenge delivery ke liye.\n\nAapke pet ko bahut pasand aayega! 🐕🎂\n\nKuch aur chahiye? "Hi" likho 👋`
        : `✅ Order Confirmed! Thank you for choosing Puppychef 🎉\n\n🔖 Order ID: ${orderId}\n💰 Total: ₹${total}\n\nWe'll contact you shortly for delivery.\n\nYour pet is going to love it! 🐕🎂\n\nNeed anything else? Just say "Hi" 👋`;
    }
    if (['no', 'cancel', 'nope', 'nahi', 'stop'].includes(text.toLowerCase())) {
      conv.state = this.states.GREETING;
      return R.restart;
    }
    return R.confirmHelp;
  }

  saveOrder(order) {
    try {
      const orders = JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
      orders.push(order);
      fs.writeFileSync(ORDERS_FILE, JSON.stringify(orders, null, 2));
    } catch (e) {
      console.error('Error saving order:', e);
    }
  }

  getAllOrders() {
    try {
      return JSON.parse(fs.readFileSync(ORDERS_FILE, 'utf8'));
    } catch (e) {
      return [];
    }
  }

  getConversationExport(phone) {
    return conversations.get(phone);
  }
}

module.exports = new OrderFlow();

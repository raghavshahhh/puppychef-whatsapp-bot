// NVIDIA NIM API Integration
// Using Kimi K2.5 model for AI responses

const https = require('https');

const NVIDIA_API_KEY = process.env.NVIDIA_API_KEY || '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';
const NVIDIA_URL = 'integrate.api.nvidia.com';

class NvidiaHandler {
  constructor() {
    this.model = 'moonshotai/kimi-k2.5';
  }

  // Generate a warm, professional response
  async generateResponse(promptText, context = {}) {
    return new Promise((resolve, reject) => {
      const payload = {
        model: this.model,
        messages: [
          {
            role: 'system',
            content: `You are a friendly, professional WhatsApp ordering assistant for Puppychef, a pet bakery and cafe in Delhi.

Business Details:
- Name: Puppychef
- Location: Safdarjung Enclave / Hauz Khas, Delhi
- Speciality: Custom dog cakes, treats, pet food, and a cafe for humans

Your style:
- Professional yet warm and friendly
- Use natural emojis occasionally
- Keep responses concise (WhatsApp style, 2-4 lines)
- Be helpful and enthusiastic about pets
- Always be polite and courteous

EXTRACTION RULES (CRITICAL):
- Users often provide multiple details in one message like "Jerry / Peanut Butter / Medium"
- Extract ALL fields from user input in ONE pass
- If user provides name, flavor, and size together, capture all at once
- Never ask for a field that was already provided in the same message
- Accept formats: "Name: Jerry", "Jerry / Peanut", or just "Jerry" (standalone)
- Split input by / , or newline to find multiple fields

Current context: ${JSON.stringify(context)}`
          },
          {
            role: 'user',
            content: promptText
          }
        ],
        max_tokens: 1024,
        temperature: 0.7,
        top_p: 0.9,
        stream: false
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

        res.on('data', (chunk) => {
          data += chunk;
        });

        res.on('end', () => {
          try {
            const response = JSON.parse(data);
            if (response.choices && response.choices[0]) {
              resolve(response.choices[0].message.content);
            } else {
              resolve(null);
            }
          } catch (e) {
            console.error('NVIDIA API parse error:', e);
            resolve(null);
          }
        });
      });

      req.on('error', (e) => {
        console.error('NVIDIA API error:', e.message);
        resolve(null);
      });

      req.write(postData);
      req.end();
    });
  }

  // Generate greeting
  async generateGreeting() {
    const prompt = 'Generate a warm, professional WhatsApp greeting for Puppychef pet bakery. Welcome the customer and ask what they would like to order. Keep it under 3 lines.';
    const response = await this.generateResponse(prompt, { type: 'greeting' });
    return response || this.getFallbackGreeting();
  }

  // Generate menu prompt
  async generateMenuPrompt(category) {
    const prompt = `A customer just selected ${category}. Generate an enthusiastic response acknowledging their choice and encouraging them to pick an item.`;
    const response = await this.generateResponse(prompt, { type: 'category_selection', category });
    return response || `Excellent choice! 🎉`;
  }

  // Generate order confirmation
  async generateOrderConfirmation(orderId, total) {
    const prompt = `An order has been confirmed. Order ID: ${orderId}, Total: ₹${total}. Generate a warm, excited confirmation message thanking the customer.`;
    const response = await this.generateResponse(prompt, { type: 'order_confirmation', orderId, total });
    return response || this.getFallbackConfirmation(orderId, total);
  }

  getFallbackGreeting() {
    const greetings = [
      `Hello! Welcome to Puppychef 🐕\n\nDelhi's favourite pet bakery - where we craft fresh, healthy cakes & treats for your furry companions 🎂🦴\n\nHow may I help you today?`,
      `Hi there! 👋 Thank you for reaching out to Puppychef.\n\nWe specialize in custom pet cakes, treats, and nutritious meals for your beloved pets 🐾\n\nWhat would you like to order?`,
      `Welcome to Puppychef! 🎂\n\nFreshly baked with love for your pets ❤️\n\nPlease let me know what you're looking for - cakes, treats, or pet food?`,
      `Good day! 🐕 Puppychef at your service.\n\nWe'd love to make something special for your pet!\n\nHow can we assist you today?`
    ];
    return greetings[Math.floor(Math.random() * greetings.length)];
  }

  getFallbackConfirmation(orderId, total) {
    return `✅ Order Confirmed! Thank you for choosing Puppychef 🎉\n\n🔖 Order ID: ${orderId}\n💰 Total: ₹${total}\n\nWe'll contact you shortly to confirm delivery timing.\n\nYour pet is going to love it! 🐕🎂`;
  }
}

module.exports = new NvidiaHandler();

// Google Gemini AI Integration
// Handles natural language understanding and response generation

const { GoogleGenerativeAI } = require("@google/generative-ai");
require('dotenv').config();

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

// Order context prompt template
const ORDER_CONTEXT_PROMPT = `You are a friendly WhatsApp ordering assistant for Puppychef, a pet bakery and cafe in Delhi.

Business Details:
- Name: Puppychef
- Location: Safdarjung Enclave / Hauz Khas, Delhi
- Speciality: Custom dog cakes, treats, pet food, and a cafe for humans
- Google Rating: 4.6 stars

Your job:
1. Help customers place orders
2. Extract order details: item, quantity, customizations, address
3. Be friendly and use emojis occasionally
4. Keep responses concise (WhatsApp style)

Menu Categories:
1. Custom Cakes (Dog Birthday Cakes, Pupcakes, Mini Cakes)
2. Treats & Biscuits (Peanut Butter Biscuits, Chicken Jerky, etc.)
3. Pet Food (Gravy, Kibble, Wet Food)
4. Cafe Items (Coffee, Tea, Snacks for humans)

Conversation Flow:
- Greet and show menu
- Ask what they'd like to order
- Ask for customizations (flavor, size, pet name for cakes)
- Ask for quantity
- Ask for delivery address
- Confirm order with summary
- Provide order number

Always be helpful, friendly, and professional.`;

class GeminiHandler {
  constructor() {
    this.model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });
  }

  // Analyze user message to understand intent
  async analyzeIntent(userMessage, conversationHistory = []) {
    try {
      // Ensure conversationHistory is an array
      const historyArray = Array.isArray(conversationHistory) ? conversationHistory : [];

      const chat = this.model.startChat({
        history: [
          {
            role: "user",
            parts: [{ text: ORDER_CONTEXT_PROMPT }]
          },
          {
            role: "model",
            parts: [{ text: "Understood! I'm ready to help customers order from Puppychef." }]
          },
          ...historyArray.map(msg => ({
            role: msg.role,
            parts: [{ text: msg.content }]
          }))
        ]
      });

      const prompt = `Analyze this customer message: "${userMessage}"

Respond with JSON only (no markdown):
{
  "intent": "greeting|menu_request|order_selection|customization|address|confirmation|question|other",
  "extracted_data": {
    "item": "item name if mentioned",
    "quantity": number,
    "customizations": {},
    "address": "if provided"
  },
  "response": "your reply to customer"
}`;

      const result = await chat.sendMessage(prompt);
      const text = result.response.text();

      // Parse JSON response
      try {
        const jsonMatch = text.match(/\{[\s\S]*\}/);
        if (jsonMatch) {
          return JSON.parse(jsonMatch[0]);
        }
      } catch (e) {
        console.log("JSON parse error, using fallback");
      }

      // Fallback
      return {
        intent: "other",
        extracted_data: {},
        response: text
      };
    } catch (error) {
      console.error("Gemini API error:", error);
      return {
        intent: "error",
        extracted_data: {},
        response: "Sorry, I'm having trouble understanding. Could you try again?"
      };
    }
  }

  // Generate natural response
  async generateResponse(context, userMessage) {
    try {
      const prompt = `${ORDER_CONTEXT_PROMPT}

Current context:
${JSON.stringify(context, null, 2)}

Customer just said: "${userMessage}"

Generate a friendly, helpful response (keep it under 3-4 lines for WhatsApp):`;

      const result = await this.model.generateContent(prompt);
      return result.response.text();
    } catch (error) {
      console.error("Gemini response error:", error);
      return "I'm sorry, could you please rephrase that? 🐕";
    }
  }

  // Extract order details from conversation
  async extractOrderDetails(messages) {
    try {
      const conversation = messages.map(m => `${m.role}: ${m.content}`).join("\n");

      const prompt = `Extract order details from this conversation:

${conversation}

Respond with JSON only:
{
  "has_complete_order": true/false,
  "order": {
    "items": [{"name": "", "quantity": 0, "price": 0, "customizations": {}}],
    "total_amount": 0,
    "customer_name": "",
    "address": "",
    "phone": ""
  }
}`;

      const result = await this.model.generateContent(prompt);
      const text = result.response.text();

      const jsonMatch = text.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        return JSON.parse(jsonMatch[0]);
      }
    } catch (error) {
      console.error("Order extraction error:", error);
    }

    return { has_complete_order: false, order: null };
  }
}

module.exports = new GeminiHandler();
module.exports.GeminiHandler = GeminiHandler;

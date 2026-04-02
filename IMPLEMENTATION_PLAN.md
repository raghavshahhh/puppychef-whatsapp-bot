# PUPPYCHEF WhatsApp Order Bot - Implementation Plan

## Overview
Building a WhatsApp-based order collection system for Puppychef (Pet Bakery + Cafe, Delhi)
Client: Harjeet Makhija
Demo Date: 2026-04-02

---

## Tech Stack (NEW - Clean Build)

| Component | Technology | Why |
|-----------|------------|-----|
| **Backend** | Node.js + Express | Lightweight, fast, easy to deploy |
| **WhatsApp** | Meta WhatsApp Business API | Official, reliable, free tier |
| **AI** | Google Gemini Flash | Free tier, fast, good for conversations |
| **Storage** | JSON files (for demo) | No DB setup needed, portable |
| **Webhook** | ngrok | Free tunneling for local dev |
| **Hosting** | Render (later) | Free tier for demo |

---

## Architecture

```
Customer WhatsApp
      ↓
Meta WhatsApp API
      ↓
Webhook (Express)
      ↓
Gemini AI (intent + response)
      ↓
Order Processor
      ↓
JSON Storage
      ↓
Admin Dashboard (optional)
```

---

## Menu Structure (Puppychef Specific)

### Category 1: Custom Cakes
| Item | Price | Customizations |
|------|-------|----------------|
| Dog Birthday Cake | ₹800-2500 | Flavor, Size, Pet name, Message |
| Pupcake (Pack of 6) | ₹450 | Flavor mix |
| Mini Cakes | ₹350 | Individual portions |

### Category 2: Treats
| Item | Price |
|------|-------|
| Peanut Butter Biscuits | ₹250/200g |
| Chicken Jerky | ₹350/150g |
| Training Treats | ₹200/100g |
| Dental Sticks | ₹180/pack |

### Category 3: Food
| Item | Price |
|------|-------|
| Homemade Gravy | ₹120/pack |
| Dry Kibble | ₹500/kg |
| Wet Food Cups | ₹80/cup |

### Category 4: Cafe (Humans)
| Item | Price |
|------|-------|
| Coffee | ₹150 |
| Tea | ₹80 |
| Sandwiches | ₹200 |
| Pastries | ₹120 |

---

## Conversation Flow

### Step 1: Welcome
```
Customer: "Hi" / "Hello" / "Order"
Bot: "🐕 Welcome to Puppychef!

I'm your ordering assistant. Here's our menu:

1️⃣ Custom Cakes (Birthday, Pupcakes)
2️⃣ Treats & Biscuits
3️⃣ Pet Food (Gravy, Kibble)
4️⃣ Cafe Items (Coffee, Snacks)
5️⃣ View Full Menu

Reply with a number to order!"
```

### Step 2: Item Selection
```
Customer: "1"
Bot: "🎂 Custom Cakes!

Available options:
a) Dog Birthday Cake - ₹800-2500
b) Pupcakes (Pack of 6) - ₹450
c) Mini Cakes - ₹350

Reply a/b/c to select..."
```

### Step 3: Customization (for cakes)
```
Bot: "Great choice! A few questions:

1. What's your pet's name?
2. Which flavor? (Chicken/Mutton/Peanut Butter)
3. What size? (Small/Medium/Large)
4. Any message on the cake?

Reply like: Name: Bruno, Flavor: Chicken, Size: Medium, Message: Happy Birthday"
```

### Step 4: Quantity & Address
```
Bot: "Perfect! How many would you like?

Also, please share your delivery address..."
```

### Step 5: Confirmation
```
Bot: "📋 Order Summary:

Item: Dog Birthday Cake
Pet: Bruno
Flavor: Chicken
Size: Medium
Message: Happy Birthday
Quantity: 1
Price: ₹1,200
Address: [Address]

✅ Confirm? Reply YES to place order"
```

### Step 6: Order Placed
```
Bot: "✅ Order Received!

Order #: PC-240402-001
Total: ₹1,200

We'll prepare your order and contact you for delivery confirmation.

⏰ Expected delivery: Tomorrow 2-6 PM

Questions? Call us at +91-XXXXXXXXXX"
```

---

## File Structure

```
01_PUPPYCHEF/
├── package.json
├── .env.example
├── index.js              # Main server + webhook
├── src/
│   ├── config/
│   │   └── menu.js       # Menu data
│   ├── handlers/
│   │   ├── webhook.js    # WhatsApp webhook handler
│   │   ├── orderFlow.js  # Conversation state machine
│   │   └── gemini.js     # AI integration
│   ├── models/
│   │   └── orders.json   # Order storage
│   └── utils/
│       └── logger.js     # Simple logging
├── README.md
└── IMPLEMENTATION_PLAN.md (this file)
```

---

## Setup Checklist

### Prerequisites
- [ ] Meta Business Account
- [ ] WhatsApp Business API test number
- [ ] Google Gemini API key
- [ ] ngrok account
- [ ] Node.js installed

### Environment Variables
```env
# WhatsApp Business API
WHATSAPP_TOKEN=your_token_here
PHONE_NUMBER_ID=your_phone_number_id
VERIFY_TOKEN=your_webhook_verify_token

# Google Gemini
GEMINI_API_KEY=your_gemini_key

# Server
PORT=3000
NODE_ENV=development
```

---

## Timeline (4 Hours)

| Time | Task | Status |
|------|------|--------|
| 0:00-0:30 | Setup project + install deps | ⬜ |
| 0:30-1:00 | WhatsApp webhook + verification | ⬜ |
| 1:00-1:30 | Menu system + basic replies | ⬜ |
| 1:30-2:30 | Order flow + state management | ⬜ |
| 2:30-3:00 | Gemini AI integration | ⬜ |
| 3:00-3:30 | Order storage + testing | ⬜ |
| 3:30-4:00 | Polish + demo video | ⬜ |

---

## Success Criteria

- [ ] Bot responds to "Hi" with menu
- [ ] Can navigate through order flow
- [ ] Order details saved to file
- [ ] Confirmation message sent
- [ ] Tested on real WhatsApp number
- [ ] Demo video recorded (2-3 min)

---

## Next Steps After Demo

1. **Client Approval**
   - Show demo to Harjeet Makhija
   - Get feedback
   - Finalize pricing (₹25,000)

2. **Production Setup**
   - Deploy to Render
   - Setup real WhatsApp Business number
   - Connect Puppychef's phone
   - Staff training

3. **Phase 2 Features**
   - Payment links (Razorpay)
   - Order status updates
   - Admin dashboard
   - Repeat customer recognition

---

**Status:** Planning Complete | Ready to Build
**Last Updated:** 2026-04-02

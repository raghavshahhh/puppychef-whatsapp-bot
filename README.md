# 🐕 PUPPYCHEF WhatsApp Order Bot

WhatsApp-based order collection system for Puppychef Pet Bakery & Cafe, Delhi.

---

## Features

✅ **Interactive Menu** - Browse categories and items
✅ **Order Collection** - Custom cakes, treats, pet food
✅ **Smart Flow** - Natural conversation with state management
✅ **Order Storage** - Saved to JSON file
✅ **AI-Powered** - Google Gemini for natural responses
✅ **Test Mode** - Works without WhatsApp credentials

---

## Quick Start

### 1. Install Dependencies
```bash
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
# Edit .env with your credentials (or leave blank for test mode)
```

### 3. Run Server
```bash
npm start
```

Server starts on `http://localhost:3000`

---

## Testing Without WhatsApp

The bot works in **test mode** without Meta credentials!

### Test via API:
```bash
# Send a test message
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{
    "phone": "+919999999999",
    "message": "hi"
  }'
```

### Test via Browser:
1. Open: `http://localhost:3000/api/test`
2. Use Postman or curl with POST method
3. Body: `{"phone": "+91xxxxxxxxxx", "message": "hi"}`

---

## WhatsApp Setup (Optional)

To connect with real WhatsApp:

### Step 1: Create Meta App
1. Go to: https://developers.facebook.com/apps
2. Create app → Business → WhatsApp
3. Note down:
   - Phone Number ID
   - Access Token

### Step 2: Setup Webhook
1. Install ngrok: `npm install -g ngrok`
2. Run: `ngrok http 3000`
3. Copy the HTTPS URL
4. In Meta dashboard:
   - Webhook URL: `https://YOUR_NGROK_URL/webhook`
   - Verify Token: `puppychef_verify_token_123`

### Step 3: Add to .env
```env
WHATSAPP_TOKEN=your_actual_token
PHONE_NUMBER_ID=your_phone_number_id
```

### Step 4: Test
1. Send message to your test number
2. Bot should auto-reply!

---

## API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/` | Health check |
| GET | `/api/menu` | Get full menu |
| GET | `/api/orders` | Get all orders |
| POST | `/api/test` | Test bot locally |
| POST | `/api/send` | Send message to user |
| GET | `/webhook` | WhatsApp verification |
| POST | `/webhook` | Receive WhatsApp messages |

---

## Menu Structure

### Categories
1. 🎂 **Custom Cakes** - Birthday cakes, pupcakes
2. 🦴 **Treats** - Biscuits, jerky, training treats
3. 🍖 **Pet Food** - Gravy, kibble, wet food
4. ☕ **Cafe** - Coffee, tea, snacks for humans

### Sample Items
- Dog Birthday Cake: ₹800-2500
- Pupcakes (6 pack): ₹450
- Peanut Butter Biscuits: ₹250
- Chicken Jerky: ₹350
- Homemade Gravy: ₹120

---

## Conversation Flow

```
Customer: "Hi"
Bot: Shows menu with 4 categories

Customer: "1" (Custom Cakes)
Bot: Shows cake options (a, b, c)

Customer: "a" (Dog Birthday Cake)
Bot: Asks for flavor, size, pet name, message

Customer: Provides details
Bot: Asks for quantity

Customer: "1"
Bot: Asks for address

Customer: Provides address
Bot: Shows order summary

Customer: "YES"
Bot: Confirms with order number!
```

---

## File Structure

```
puppychef-whatsapp-bot/
├── index.js              # Main server
├── package.json          # Dependencies
├── .env.example          # Config template
├── README.md            # This file
├── src/
│   ├── config/
│   │   └── menu.js      # Menu data
│   ├── handlers/
│   │   ├── orderFlow.js # State machine
│   │   └── gemini.js    # AI integration
│   └── data/
│       └── orders.json  # Order storage
```

---

## Demo Mode

Without WhatsApp credentials, the bot:
- ✅ Responds via API endpoint
- ✅ Saves orders to JSON file
- ✅ Shows all menus
- ❌ Can't send real WhatsApp messages

For demo purposes, this is sufficient to show the client!

---

## Production Deployment

### Option 1: Render (Free)
1. Push to GitHub
2. Connect to Render
3. Add environment variables
4. Auto-deploys!

### Option 2: Railway (Free)
Similar process to Render.

### Option 3: VPS (DigitalOcean/AWS)
1. `git clone`
2. `npm install`
3. `npm start`
4. Use PM2 for process management

---

## Client Pricing

| Package | Price | Features |
|---------|-------|----------|
| **Starter** | ₹15,000 | WhatsApp bot + JSON storage |
| **Professional** | ₹25,000 | + Google Sheets + Payment links |
| **Full Setup** | ₹40,000 | + Website + 3 months support |

---

## Troubleshooting

### Server won't start
```bash
# Check if port 3000 is free
lsof -i :3000

# Or use different port
PORT=3001 npm start
```

### Orders not saving
- Check `data/` folder exists
- Check write permissions
- Check logs for errors

### WhatsApp messages not sending
- Verify WHATSAPP_TOKEN is correct
- Verify PHONE_NUMBER_ID is correct
- Check ngrok tunnel is running
- Check webhook is verified in Meta dashboard

---

## Support

RAGSPRO AI Agency
Contact: ragsproai@gmail.com

---

**Built for:** Puppychef Pet Bakery & Cafe, Delhi
**Client:** Harjeet Makhija
**Date:** April 2026

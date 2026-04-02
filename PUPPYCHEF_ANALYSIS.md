# PUPPYCHEF ANALYSIS

## Client Information
- **Name:** Harjeet Makhija (Puppy Chef)
- **Business:** Pet Bakery + Cafe
- **Location:** Safdarjung Enclave / Hauz Khas, New Delhi
- **Google Rating:** 4.6 ⭐
- **Instagram:** @puppychefindia (3,756 followers, 1,935 posts)
- **Current Platform:** dotpe.in (basic third-party ordering)

---

## Business Background
- 6+ years old pet bakery and cafe
- Petfed Award winner - Best Pet Chef
- Active on Instagram with regular posts
- No dedicated website (only dotpe link)

---

## Pain Points

| Problem | Current Reality |
|---------|----------------|
| Order Management | WhatsApp + Instagram DMs - scattered |
| Custom Cake Details | Lost in different chat threads |
| Repeat Customers | Manually tracked |
| Online Ordering | Only dotpe - no customization, no branding |
| Website | No dedicated website |

---

## Recommended Solution

**WhatsApp Automation System**

Why not website/app:
- Client already comfortable on WhatsApp
- Customers already message on WhatsApp
- Small business - needs simple solution
- Fast implementation, no learning curve

---

## Solution Architecture

```
Customer WhatsApp Message
    ↓
Meta WhatsApp Business API
    ↓
n8n Webhook
    ↓
Claude LLM (extract order details)
    ↓
Google Sheets (order database)
    ↓
WhatsApp Reply (confirmation)
```

---

## Implementation Phases

### Phase 1: Core WhatsApp Bot (Week 1)
- WhatsApp Business API setup
- n8n automation workflow
- Claude API integration
- Google Sheets connection
- Basic order collection flow

### Phase 2: Smart Features (Week 2)
- Repeat customer detection
- One-click reorder
- Order status updates
- Daily summary reports

---

## Pricing Options

| Package | Price | Includes |
|---------|-------|----------|
| Starter | ₹15,000 | WhatsApp bot + Google Sheets + Basic replies |
| Professional | ₹25,000 | + Repeat customer + Order tracking |
| Full Setup | ₹40,000 | + Website + Payment + 3 months support |

---

## Next Actions

- [ ] Create demo video
- [ ] Setup n8n locally
- [ ] Draft client follow-up message
- [ ] Schedule demo call

---

## Technical Implementation (RagsPro AI System)

**Source Repository:** `https://github.com/raghavshahhh/ai.git`

### System Architecture
```
┌─────────────────────────────────────────────────────────────┐
│ Node.js + Express Backend                                  │
├─────────────────────────────────────────────────────────────┤
│ WhatsApp Business API (Meta) ←→ Webhook                    │
├─────────────────────────────────────────────────────────────┤
│ Google Gemini AI (LLM)                                       │
├─────────────────────────────────────────────────────────────┤
│ MongoDB (Data Persistence)                                   │
├─────────────────────────────────────────────────────────────┤
│ Admin Dashboard (EJS/HTML)                                   │
├─────────────────────────────────────────────────────────────┤
│ Razorpay (Payments) | Telegram (Alerts) | Twilio (Voice)    │
└─────────────────────────────────────────────────────────────┘
```

### API Keys Required

**MANDATORY:**
| Key | Source | Purpose |
|-----|--------|---------|
| `GEMINI_API_KEY` | makersuite.google.com/app/apikey | AI replies generation |
| `WHATSAPP_TOKEN` | Meta Developer Dashboard → WhatsApp | Send WhatsApp messages |
| `PHONE_NUMBER_ID` | Meta Developer Dashboard → WhatsApp | Phone number ID |

**OPTIONAL:**
| Key | Purpose |
|-----|---------|
| `MONGODB_URI` | Data persistence (fallback: in-memory) |
| `TELEGRAM_BOT_TOKEN` | Hot lead alerts |
| `RAZORPAY_KEY_ID` | Payment links |
| `TWILIO_*` | Voice calls |

### How to Run

```bash
# Clone
git clone https://github.com/raghavshahhh/ai.git ragspro-ai
cd ragspro-ai

# Install
npm install

# Environment
cp .env.example .env
# Edit .env with your API keys

# Run
node index.js

# Dashboard
http://localhost:3000/dashboard
Username: admin
Password: ragspro123
```

### Security Issues Found

| Issue | Severity | Location |
|-------|----------|----------|
| Hardcoded webhook token | 🔴 HIGH | index.js:32 |
| Hardcoded session secret | 🔴 HIGH | dashboard-complete.js:19 |
| Default admin password | 🔴 HIGH | dashboard-complete.js:15 |
| No rate limiting | 🟡 MEDIUM | webhook endpoint |
| No input sanitization | 🟡 MEDIUM | dashboard |

### File Breakdown

| File | Lines | Purpose |
|------|-------|---------|
| `index.js` | 302 | Main server + webhook |
| `gemini.js` | 49 | AI API calls |
| `prompt.js` | 263 | Sales system prompt |
| `qualifier.js` | 218 | Lead scoring |
| `memory.js` | 254 | Chat history |
| `dashboard-complete.js` | 60,000+ | Admin UI |
| `payments.js` | 105 | Razorpay integration |
| `multi-agent-system.js` | 165 | Multi-business routing |

### For PuppyChef Adaptation

**Current System:** Built for RagsPro lead generation (sales conversation)
**PuppyChef Need:** Order management system (cake ordering)

**Required Changes:**
1. Replace `ragspro-knowledge.js` → `puppychef-knowledge.js`
2. Update `prompt.js` → Order collection instead of sales
3. Add Google Sheets integration (for orders)
4. Configure menu items (cakes, treats)
5. Add order status tracking

---

**Created:** 2026-04-02
**Status:** Analysis Complete | Demo Pending

# PUPPYCHEF Bot Testing Guide

## Quick Test Commands

### 1. Start Server
```bash
cd ~/02_BUSINESS/03_CLIENTS/01_PUPPYCHEF
npm start
```

### 2. Test Basic Flow (in another terminal)

#### Test 1: Welcome Message
```bash
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919999999999", "message": "hi"}'
```

**Expected:** Menu with 4 categories

---

#### Test 2: Select Category
```bash
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919999999999", "message": "1"}'
```

**Expected:** Custom Cakes menu with items a, b, c

---

#### Test 3: Select Item
```bash
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919999999999", "message": "a"}'
```

**Expected:** Asks for flavor, size, pet name

---

#### Test 4: Complete Order Flow
```bash
# Flavor
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919999999999", "message": "1"}'

# Pet name
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919999999999", "message": "Bruno"}'

# Message
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919999999999", "message": "Happy Birthday"}'

# Quantity
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919999999999", "message": "1"}'

# Address
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919999999999", "message": "123 Safdarjung Enclave, New Delhi - 110029"}'

# Confirm
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919999999999", "message": "yes"}'
```

**Expected:** Order confirmation with order number

---

### 3. Check Saved Orders
```bash
curl http://localhost:3000/api/orders
```

**Expected:** JSON array with saved orders

---

### 4. Check Menu
```bash
curl http://localhost:3000/api/menu
```

**Expected:** Full menu with all categories and items

---

## Expected Conversation Flow

```
USER: hi
BOT:
🐕 *Welcome to Puppychef!*

Freshly baked treats for your furry friends 🐾

*Select a category:*

1️⃣ 🎂 Custom Cakes
   Freshly baked cakes for your furry friends

2️⃣ 🦴 Treats & Biscuits
   Healthy homemade treats

3️⃣ 🍖 Pet Food
   Nutritious meals for pets

4️⃣ ☕ Cafe (For Humans)
   While your pet enjoys their treat

Reply with a number (1-4) to order!
Or type "MENU" anytime to see this again.

---

USER: 1
BOT:
🐕 *🎂 Custom Cakes*

a) Dog Birthday Cake
   Special birthday cake with pet-safe ingredients
   💰 ₹800-₹2500

b) Pupcakes (Pack of 6)
   Cupcakes sized for dogs
   💰 ₹450

c) Mini Cakes
   Individual portion cakes
   💰 ₹350

Reply with a letter (a, b, c...) to select!
Or type "BACK" to return to main menu.

---

USER: a
BOT:
Great choice! 🎉

*Dog Birthday Cake* selected!

Available flavors:
1. Chicken
2. Mutton
3. Peanut Butter
4. Banana
5. Apple

Also, what size?
1. Small - ₹800
2. Medium - ₹1500
3. Large - ₹2500

Reply with the flavor number!

---

USER: 1
BOT:
Perfect! Chicken flavor selected! 🍰

What's your pet's name? (This will be on the cake)

---

USER: Bruno
BOT:
Cute name! 🐕

Any message for the cake? (e.g., "Happy Birthday", or type "none")

---

USER: Happy Birthday
BOT:
Perfect! 🎂

How many would you like? (Reply with a number)

---

USER: 1
BOT:
Great! 1 item(s) added! 💰
Subtotal: ₹1500

Now, please share your delivery address:
(House no, Street, Locality, Pincode)

---

USER: 123, Safdarjung Enclave, New Delhi - 110029
BOT:
📋 *Order Summary*

Item: Dog Birthday Cake
Quantity: 1
Flavor: Chicken
Pet Name: Bruno
Message: Happy Birthday
Size: medium

💰 Total: ₹1500
📍 Address: 123, Safdarjung Enclave, New Delhi - 110029

Confirm order?
Reply YES to place order
Reply CANCEL to start over

---

USER: yes
BOT:
✅ *Order Confirmed!*

Order #: PC-ABC123XYZ
Total: ₹1500

We'll prepare your order and contact you for delivery confirmation.

⏰ Expected delivery: Tomorrow 2-6 PM

Questions? Call: +91-XXXXXXXXXX

Type MENU to place another order! 🐕
```

---

## Troubleshooting

### Server not responding
```bash
# Check if running
curl http://localhost:3000/

# Should return: {"status": "running", ...}
```

### Orders not saving
```bash
# Check data folder
ls -la data/

# Should show: orders.json

# Check file permissions
chmod 755 data/
```

### Menu not showing
```bash
# Test menu endpoint
curl http://localhost:3000/api/menu | jq

# Should return JSON array
```

---

## Demo Script for Client

### Step 1: Show Server Running
```bash
echo "Bot server is running..."
curl -s http://localhost:3000/ | jq
```

### Step 2: Simulate Customer Order
```bash
echo "Customer places order..."
curl -X POST http://localhost:3000/api/test \
  -H "Content-Type: application/json" \
  -d '{"phone": "+919876543210", "message": "hi"}' | jq
```

### Step 3: Show Orders
```bash
echo "All orders saved..."
curl -s http://localhost:3000/api/orders | jq
```

---

## Success Criteria

- [ ] Server starts without errors
- [ ] `/api/menu` returns full menu
- [ ] Complete order flow works
- [ ] Order saved to JSON file
- [ ] Order confirmation shows order number
- [ ] Can start new order after completion

---

Ready to demo! 🎉

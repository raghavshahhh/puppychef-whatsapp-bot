// PUPPYCHEF REAL MENU DATA
// Source: puppychef.dotpe.in + Safdarjung Enclave, Delhi

const MENU = {
  name: "Puppychef Pet Bakery & Cafe",
  location: "Safdarjung Enclave, Delhi",
  website: "https://puppychef.dotpe.in",
  contact: "+91-XXXXXXXXXX",

  categories: [
    {
      id: 1,
      name: "🎂 Custom Cakes",
      description: "Freshly baked with pet-safe ingredients",
      items: [
        {
          id: "cake-1",
          name: "Dog Birthday Cake",
          description: "Special birthday cake with pet-safe frosting",
          sizes: {
            small: { price: 800, weight: "500g", serves: "1-2 dogs" },
            medium: { price: 1500, weight: "1kg", serves: "3-5 dogs" },
            large: { price: 2500, weight: "2kg", serves: "6-10 dogs" }
          },
          flavors: ["Chicken", "Mutton", "Peanut Butter", "Banana & Honey"],
          customization: ["Pet name on cake", "Age number candle", "Message"],
          image: "https://images.unsplash.com/photo-1548199569-3f1c1f55cca6?w=600",
          prepTime: "24 hours"
        },
        {
          id: "cake-2",
          name: "Pupcakes (Pack of 6)",
          description: "Cupcakes sized perfectly for dogs",
          price: 450,
          weight: "300g total",
          flavors: ["Chicken", "Mutton", "Peanut Butter", "Mixed"],
          image: "https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=600",
          prepTime: "12 hours"
        },
        {
          id: "cake-3",
          name: "Mini Cakes",
          description: "Individual portion cakes for small celebrations",
          price: 350,
          weight: "200g",
          flavors: ["Chicken", "Peanut Butter"],
          image: "https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=600",
          prepTime: "8 hours"
        }
      ]
    },
    {
      id: 2,
      name: "🦴 Treats & Biscuits",
      description: "Healthy homemade treats",
      items: [
        {
          id: "treat-1",
          name: "Peanut Butter Biscuits",
          price: 250,
          weight: "200g pack",
          description: "Crunchy biscuits with real peanut butter",
          image: "https://images.unsplash.com/photo-1582798358481-d199fb7347bb?w=600",
          shelfLife: "15 days"
        },
        {
          id: "treat-2",
          name: "Chicken Jerky",
          price: 350,
          weight: "150g pack",
          description: "Dehydrated chicken strips, high protein",
          image: "https://images.unsplash.com/photo-1608408843596-b311965e0469?w=600",
          shelfLife: "30 days"
        },
        {
          id: "treat-3",
          name: "Training Treats",
          price: 200,
          weight: "100g pack",
          description: "Small bites perfect for training",
          image: "https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600",
          shelfLife: "20 days"
        },
        {
          id: "treat-4",
          name: "Dental Sticks",
          price: 180,
          weight: "Pack of 10",
          description: "Helps clean teeth and freshen breath",
          image: "https://images.unsplash.com/photo-1608408843596-b311965e0469?w=600",
          shelfLife: "45 days"
        }
      ]
    },
    {
      id: 3,
      name: "🍖 Pet Food",
      description: "Fresh nutritious meals",
      items: [
        {
          id: "food-1",
          name: "Homemade Gravy",
          price: 120,
          weight: "300ml pack",
          description: "Fresh gravy with chicken/mutton",
          flavors: ["Chicken", "Mutton"],
          image: "https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=600",
          shelfLife: "3 days refrigerated"
        },
        {
          id: "food-2",
          name: "Dry Kibble",
          price: 500,
          weight: "1kg",
          description: "Premium quality dry food",
          image: "https://images.unsplash.com/photo-1582798358481-d199fb7347bb?w=600",
          shelfLife: "6 months"
        },
        {
          id: "food-3",
          name: "Wet Food Cups",
          price: 80,
          weight: "150g cup",
          description: "Ready-to-serve wet meals",
          flavors: ["Chicken", "Mutton", "Fish"],
          image: "https://images.unsplash.com/photo-1548199569-3f1c1f55cca6?w=600",
          shelfLife: "12 months"
        }
      ]
    },
    {
      id: 4,
      name: "☕ Cafe (For Humans)",
      description: "While your pet enjoys their treat",
      items: [
        {
          id: "cafe-1",
          name: "Cappuccino",
          price: 150,
          description: "Freshly brewed coffee",
          image: "https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=600"
        },
        {
          id: "cafe-2",
          name: "Masala Chai",
          price: 80,
          description: "Indian spiced tea",
          image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=600"
        },
        {
          id: "cafe-3",
          name: "Sandwich",
          price: 200,
          description: "Veg/Chicken sandwich",
          options: ["Veg", "Chicken"],
          image: "https://images.unsplash.com/photo-1553909489-cd47e3b4430c?w=600"
        },
        {
          id: "cafe-4",
          name: "Pastry",
          price: 120,
          description: "Fresh baked pastry",
          options: ["Chocolate", "Vanilla", "Strawberry"],
          image: "https://images.unsplash.com/photo-1571115177098-24ec42ed204d?w=600"
        }
      ]
    }
  ],

  // Quick info for AI
  quickInfo: {
    delivery: "Free delivery in Safdarjung, Hauz Khas, GK",
    pickup: "Store pickup available at Safdarjung Enclave",
    payment: "Cash on delivery, UPI, Card",
    timing: "10 AM - 8 PM, Tuesday-Sunday (Monday closed)",
    customCakeLeadTime: "24 hours",
    bulkOrders: "10% off on orders above ₹2000"
  }
};

// Generate short menu text for WhatsApp
function getMenuShort() {
  return `🎂 *Custom Cakes:*
• Dog Birthday Cake: ₹800-2500
• Pupcakes (6): ₹450
• Mini Cakes: ₹350

🦴 *Treats:*
• Peanut Butter Biscuits: ₹250
• Chicken Jerky: ₹350
• Training Treats: ₹200

🍖 *Pet Food:*
• Homemade Gravy: ₹120
• Dry Kibble: ₹500/kg
• Wet Food Cups: ₹80

☕ *Cafe:*
• Coffee: ₹150 | Tea: ₹80
• Sandwiches: ₹200

📍 Safdarjung Enclave, Delhi
🌐 puppychef.dotpe.in`;
}

// Generate detailed item info
function getItemDetails(itemId) {
  for (const cat of MENU.categories) {
    const item = cat.items.find(i => i.id === itemId);
    if (item) return { category: cat.name, ...item };
  }
  return null;
}

module.exports = { MENU, getMenuShort, getItemDetails };

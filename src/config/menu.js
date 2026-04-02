// PUPPYCHEF Menu Configuration
// Complete menu with prices and options

const MENU = {
  categories: [
    {
      id: 1,
      name: "🎂 Custom Cakes",
      description: "Freshly baked cakes for your furry friends",
      items: [
        {
          id: "cake_1",
          name: "Dog Birthday Cake",
          price: { small: 800, medium: 1500, large: 2500 },
          description: "Special birthday cake with pet-safe ingredients",
          customizations: ["flavor", "size", "message", "pet_name"],
          flavors: ["Chicken", "Mutton", "Peanut Butter", "Banana", "Apple"]
        },
        {
          id: "cake_2",
          name: "Pupcakes (Pack of 6)",
          price: 450,
          description: "Cupcakes sized for dogs",
          customizations: ["flavor_mix"],
          flavors: ["Mixed", "Chicken Only", "Sweet Potato"]
        },
        {
          id: "cake_3",
          name: "Mini Cakes",
          price: 350,
          description: "Individual portion cakes",
          customizations: ["flavor"],
          flavors: ["Chicken", "Peanut Butter"]
        }
      ]
    },
    {
      id: 2,
      name: "🦴 Treats & Biscuits",
      description: "Healthy homemade treats",
      items: [
        {
          id: "treat_1",
          name: "Apple Bread Slice",
          price: 150,
          description: "Fresh apple bread, perfect for dogs"
        },
        {
          id: "treat_2",
          name: "Banana Bread Slice",
          price: 150,
          description: "Moist banana bread, pet-safe ingredients"
        },
        {
          id: "treat_3",
          name: "KFC Chicken Leg",
          price: 200,
          description: "1 piece - Crispy chicken leg treat"
        },
        {
          id: "treat_4",
          name: "Chicken & Beetroot Kebabs",
          price: 350,
          unit: "10 pieces",
          description: "Grilled kebabs with chicken and beetroot"
        },
        {
          id: "treat_5",
          name: "Pumpkin Chicken Pasta",
          price: 350,
          description: "Rice flour pasta with pumpkin and chicken"
        },
        {
          id: "treat_6",
          name: "Chicken Vegetable Pizza",
          price: { small: 350, large: 450 },
          description: "Pet-friendly pizza with chicken and veggies"
        }
      ]
    },
    {
      id: 3,
      name: "🍖 Pet Food",
      description: "Nutritious meals for pets",
      items: [
        {
          id: "food_1",
          name: "Homemade Gravy",
          price: 120,
          unit: "300ml pack",
          description: "Fresh gravy with meat chunks",
          flavors: ["Chicken", "Mutton", "Fish"]
        },
        {
          id: "food_2",
          name: "Dry Kibble",
          price: 500,
          unit: "per kg",
          description: "Premium quality dry food"
        },
        {
          id: "food_3",
          name: "Wet Food Cups",
          price: 80,
          unit: "per cup",
          description: "Ready-to-serve meals",
          flavors: ["Chicken", "Lamb", "Salmon"]
        }
      ]
    },
    {
      id: 4,
      name: "☕ Cafe (For Humans)",
      description: "While your pet enjoys their treat",
      items: [
        {
          id: "cafe_1",
          name: "Cappuccino",
          price: 150,
          description: "Freshly brewed coffee"
        },
        {
          id: "cafe_2",
          name: "Masala Chai",
          price: 80,
          description: "Indian spiced tea"
        },
        {
          id: "cafe_3",
          name: "Veg Sandwich",
          price: 200,
          description: "Grilled vegetable sandwich"
        },
        {
          id: "cafe_4",
          name: "Croissant",
          price: 120,
          description: "Butter croissant"
        }
      ]
    }
  ],

  // Helper functions
  getCategoryById(id) {
    return this.categories.find(c => c.id === id);
  },

  getItemById(id) {
    for (const category of this.categories) {
      const item = category.items.find(i => i.id === id);
      if (item) return { ...item, category: category.name };
    }
    return null;
  },

  getAllItems() {
    const items = [];
    for (const category of this.categories) {
      for (const item of category.items) {
        items.push({ ...item, category: category.name });
      }
    }
    return items;
  },

  // Format menu for WhatsApp
  getMenuText() {
    let text = "🐕 *Welcome to Puppychef!*\n\n";
    text += "Freshly baked treats for your furry friends 🐾\n\n";
    text += "*Select a category:*\n\n";

    for (const category of this.categories) {
      text += `${category.id}️⃣ ${category.name}\n`;
      text += `   ${category.description}\n\n`;
    }

    text += "Reply with a number (1-4) to order!\n";
    text += "Or type \"MENU\" anytime to see this again.";

    return text;
  },

  // Format category items
  getCategoryItemsText(categoryId) {
    const category = this.getCategoryById(categoryId);
    if (!category) return "Category not found.";

    let text = `🐕 *${category.name}*\n\n`;

    const letters = ['a', 'b', 'c', 'd', 'e', 'f'];
    category.items.forEach((item, index) => {
      const letter = letters[index] || (index + 1);
      const priceText = typeof item.price === 'object'
        ? `₹${item.price.small}-₹${item.price.large}`
        : `₹${item.price}`;

      text += `${letter}) ${item.name}\n`;
      text += `   ${item.description}\n`;
      text += `   💰 ${priceText}${item.unit ? ` (${item.unit})` : ''}\n\n`;
    });

    text += "Reply with a letter (a, b, c...) to select!\n";
    text += "Or type \"BACK\" to return to main menu.";

    return text;
  }
};

module.exports = MENU;

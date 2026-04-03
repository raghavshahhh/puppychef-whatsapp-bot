'use client';

import { useState } from 'react';
import Image from 'next/image';
import { Phone, MessageCircle, MapPin, Clock, ShoppingCart, X, Plus, Minus, Instagram, Star } from 'lucide-react';

// Optimized static data
const menuCategories = [
  {
    id: 'cakes',
    name: 'Custom Cakes',
    icon: '🎂',
    items: [
      { id: 'c1', name: 'Dog Birthday Cake', price: 1500, sizes: 'Small ₹800 | Med ₹1500 | Large ₹2500', popular: true },
      { id: 'c2', name: 'Pupcakes (Pack of 6)', price: 450, sizes: '₹450' },
      { id: 'c3', name: 'Mini Cakes', price: 350, sizes: '₹350' },
    ]
  },
  {
    id: 'treats',
    name: 'Treats & Biscuits',
    icon: '🦴',
    items: [
      { id: 't1', name: 'Peanut Butter Biscuits', price: 250, sizes: '200g pack', popular: true },
      { id: 't2', name: 'Chicken Jerky', price: 350, sizes: '150g pack' },
      { id: 't3', name: 'Training Treats', price: 200, sizes: '100g pack' },
      { id: 't4', name: 'Dental Sticks', price: 180, sizes: 'Pack of 10' },
    ]
  },
  {
    id: 'food',
    name: 'Pet Food',
    icon: '🍖',
    items: [
      { id: 'f1', name: 'Homemade Gravy', price: 120, sizes: '300ml' },
      { id: 'f2', name: 'Dry Kibble', price: 500, sizes: '1kg' },
      { id: 'f3', name: 'Wet Food Cups', price: 80, sizes: '150g' },
    ]
  },
  {
    id: 'cafe',
    name: 'Cafe (Humans)',
    icon: '☕',
    items: [
      { id: 'ca1', name: 'Cappuccino', price: 150 },
      { id: 'ca2', name: 'Masala Chai', price: 80 },
      { id: 'ca3', name: 'Veg Sandwich', price: 200 },
      { id: 'ca4', name: 'Chicken Sandwich', price: 250 },
    ]
  }
];

const highlights = [
  { icon: '✨', title: 'Fresh Daily', desc: 'Baked fresh every morning' },
  { icon: '🌿', title: 'Natural', desc: 'No preservatives, all natural' },
  { icon: '🚚', title: 'Free Delivery', desc: 'Within 5km of Safdarjung' },
];

export default function LandingPage() {
  const [cart, setCart] = useState<{id: string, name: string, price: number, qty: number}[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState('cakes');

  const addToCart = (item: {id: string, name: string, price: number}) => {
    setCart(prev => {
      const existing = prev.find(i => i.id === item.id);
      if (existing) {
        return prev.map(i => i.id === item.id ? {...i, qty: i.qty + 1} : i);
      }
      return [...prev, {...item, qty: 1}];
    });
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => i.id === id ? {...i, qty: Math.max(0, i.qty + delta)} : i).filter(i => i.qty > 0));
  };

  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.price * i.qty, 0);

  const whatsappLink = `https://wa.me/15551817070?text=${encodeURIComponent(
    `Hi Puppychef! I want to order:\n${cart.map(i => `• ${i.name} x${i.qty} = ₹${i.price * i.qty}`).join('\n')}\n\nTotal: ₹${totalPrice}\n\nPlease confirm my order.`
  )}`;

  return (
    <div className="min-h-screen bg-gradient-to-b from-amber-50 to-orange-50">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-white/90 backdrop-blur border-b border-amber-100">
        <div className="max-w-5xl mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="text-2xl">🐕</span>
            <h1 className="text-xl font-bold text-amber-800">Puppychef</h1>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="flex items-center gap-2 bg-amber-500 text-white px-4 py-2 rounded-full text-sm font-medium hover:bg-amber-600 transition"
          >
            <ShoppingCart size={18} />
            {totalItems > 0 && <span>{totalItems}</span>}
          </button>
        </div>
      </header>

      {/* Hero */}
      <section className="bg-amber-500 text-white py-12 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="inline-flex items-center gap-1 bg-amber-400/50 px-3 py-1 rounded-full text-sm mb-4">
            <Star size={14} fill="currentColor" />
            <span>4.6 ★ on Google</span>
          </div>
          <h2 className="text-3xl md:text-4xl font-bold mb-3">Delhi&apos;s Premium Pet Bakery</h2>
          <p className="text-amber-100 mb-6">Custom cakes, treats & meals for your furry friends 🐾</p>
          <div className="flex flex-col sm:flex-row gap-3 justify-center">
            <a
              href="https://wa.me/15551817070"
              className="flex items-center justify-center gap-2 bg-white text-amber-600 px-6 py-3 rounded-full font-semibold hover:bg-amber-50 transition"
            >
              <MessageCircle size={20} />
              Order on WhatsApp
            </a>
            <a
              href="tel:+15551817070"
              className="flex items-center justify-center gap-2 bg-amber-600 text-white px-6 py-3 rounded-full font-semibold hover:bg-amber-700 transition"
            >
              <Phone size={20} />
              Call Now
            </a>
          </div>
        </div>
      </section>

      {/* Highlights */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-5xl mx-auto grid grid-cols-3 gap-4">
          {highlights.map(h => (
            <div key={h.title} className="text-center p-4">
              <div className="text-2xl mb-1">{h.icon}</div>
              <div className="font-semibold text-gray-800 text-sm">{h.title}</div>
              <div className="text-xs text-gray-500">{h.desc}</div>
            </div>
          ))}
        </div>
      </section>

      {/* Menu */}
      <section className="py-8 px-4" id="menu">
        <div className="max-w-5xl mx-auto">
          <h3 className="text-2xl font-bold text-gray-800 mb-6 text-center">Our Menu</h3>

          {/* Category Tabs */}
          <div className="flex gap-2 overflow-x-auto pb-4 mb-4 scrollbar-hide">
            {menuCategories.map(cat => (
              <button
                key={cat.id}
                onClick={() => setActiveCategory(cat.id)}
                className={`flex items-center gap-2 px-4 py-2 rounded-full whitespace-nowrap font-medium transition ${
                  activeCategory === cat.id
                    ? 'bg-amber-500 text-white'
                    : 'bg-white text-gray-600 border border-gray-200 hover:border-amber-300'
                }`}
              >
                <span>{cat.icon}</span>
                {cat.name}
              </button>
            ))}
          </div>

          {/* Menu Items */}
          <div className="bg-white rounded-2xl shadow-sm border border-gray-100 overflow-hidden">
            {menuCategories.find(c => c.id === activeCategory)?.items.map((item, idx) => (
              <div
                key={item.id}
                className={`flex items-center justify-between p-4 ${idx !== 0 ? 'border-t border-gray-100' : ''}`}
              >
                <div className="flex-1">
                  <div className="flex items-center gap-2">
                    <span className="font-semibold text-gray-800">{item.name}</span>
                    {item.popular && (
                      <span className="bg-amber-100 text-amber-700 text-xs px-2 py-0.5 rounded-full">Popular</span>
                    )}
                  </div>
                  <div className="text-sm text-gray-500">{item.sizes}</div>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-bold text-amber-600">₹{item.price}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-amber-500 text-white p-2 rounded-full hover:bg-amber-600 transition"
                  >
                    <Plus size={16} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Info */}
      <section className="py-8 px-4 bg-amber-50">
        <div className="max-w-5xl mx-auto">
          <div className="bg-white rounded-2xl p-6 shadow-sm">
            <h3 className="text-xl font-bold text-gray-800 mb-4">Visit Our Store</h3>
            <div className="grid md:grid-cols-2 gap-4">
              <div className="flex items-start gap-3">
                <MapPin className="text-amber-500 mt-1" size={20} />
                <div>
                  <div className="font-medium">Safdarjung Enclave</div>
                  <div className="text-sm text-gray-500">Block C, New Delhi - 110029</div>
                </div>
              </div>
              <div className="flex items-start gap-3">
                <Clock className="text-amber-500 mt-1" size={20} />
                <div>
                  <div className="font-medium">10 AM - 8 PM</div>
                  <div className="text-sm text-gray-500">Tuesday - Sunday</div>
                </div>
              </div>
            </div>
            <div className="mt-4 pt-4 border-t border-gray-100 flex gap-3">
              <a
                href="https://wa.me/15551817070"
                className="flex-1 bg-amber-500 text-white text-center py-3 rounded-xl font-medium hover:bg-amber-600 transition"
              >
                WhatsApp
              </a>
              <a
                href="tel:+15551817070"
                className="flex-1 bg-gray-100 text-gray-800 text-center py-3 rounded-xl font-medium hover:bg-gray-200 transition"
              >
                Call Now
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-gray-900 text-white py-8 px-4">
        <div className="max-w-5xl mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-2">
            <span className="text-2xl">🐕</span>
            <span className="font-bold text-xl">Puppychef</span>
          </div>
          <p className="text-gray-400 text-sm mb-4">Made with ♥ for your pets</p>
          <div className="flex justify-center gap-4">
            <a href="#" className="text-gray-400 hover:text-white transition"><Instagram size={20} /></a>
          </div>
          <p className="text-gray-500 text-xs mt-4">© 2024 Puppychef. All rights reserved.</p>
        </div>
      </footer>

      {/* Cart Drawer */}
      {showCart && (
        <div className="fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/50" onClick={() => setShowCart(false)} />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-md bg-white shadow-2xl">
            <div className="flex items-center justify-between p-4 border-b">
              <h3 className="font-bold text-lg">Your Cart ({totalItems})</h3>
              <button onClick={() => setShowCart(false)} className="p-2 hover:bg-gray-100 rounded-full">
                <X size={20} />
              </button>
            </div>
            <div className="p-4 flex-1 overflow-y-auto">
              {cart.length === 0 ? (
                <div className="text-center py-12 text-gray-500">
                  <ShoppingCart size={48} className="mx-auto mb-4 opacity-30" />
                  <p>Your cart is empty</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="flex items-center justify-between bg-gray-50 p-3 rounded-xl">
                      <div>
                        <div className="font-medium">{item.name}</div>
                        <div className="text-amber-600 font-semibold">₹{item.price * item.qty}</div>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-8 h-8 bg-white border rounded-full flex items-center justify-center hover:bg-gray-100"
                        >
                          <Minus size={14} />
                        </button>
                        <span className="w-6 text-center font-medium">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-8 h-8 bg-amber-500 text-white rounded-full flex items-center justify-center hover:bg-amber-600"
                        >
                          <Plus size={14} />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
            {cart.length > 0 && (
              <div className="p-4 border-t">
                <div className="flex justify-between mb-4">
                  <span className="text-gray-600">Total</span>
                  <span className="text-2xl font-bold text-amber-600">₹{totalPrice}</span>
                </div>
                <a
                  href={whatsappLink}
                  className="block w-full bg-amber-500 text-white text-center py-4 rounded-xl font-bold hover:bg-amber-600 transition"
                >
                  Order on WhatsApp
                </a>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

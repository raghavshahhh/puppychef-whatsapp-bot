'use client';

import { useState, useEffect } from 'react';
import {
  Phone,
  MessageCircle,
  MapPin,
  Clock,
  ShoppingCart,
  X,
  Plus,
  Minus,
  Star,
  Heart,
  Truck,
  Award,
  Leaf,
  Cake,
  Bone,
  Beef,
  Coffee,
  Grid3X3,
  ChefHat,
  Store,
  Camera,
  ArrowRight,
  Sparkles
} from 'lucide-react';

// Image fallback component
const ImageWithFallback = ({ src, alt, className }: { src: string; alt: string; className?: string }) => {
  const [error, setError] = useState(false);

  if (error) {
    return (
      <div className={`${className} bg-gradient-to-br from-blue-100 to-orange-100 flex items-center justify-center`}>
        <ChefHat className="w-1/3 h-1/3 text-slate-400" />
      </div>
    );
  }

  return (
    <img
      src={src}
      alt={alt}
      className={className}
      loading="lazy"
      onError={() => setError(true)}
    />
  );
};

// Real menu data from PUPPYCHEF
const menuCategories = [
  { id: 'all', name: 'All', icon: Grid3X3 },
  { id: 'cakes', name: 'Cakes', icon: Cake },
  { id: 'treats', name: 'Treats', icon: Bone },
  { id: 'food', name: 'Food', icon: Beef },
  { id: 'cafe', name: 'Cafe', icon: Coffee },
];

const menuItems = [
  // Custom Cakes
  {
    id: 'cake-1',
    category: 'cakes',
    name: 'Dog Birthday Cake',
    price: 1500,
    sizes: 'Small ₹800 | Medium ₹1500 | Large ₹2500',
    description: 'Special birthday cake with pet-safe frosting',
    popular: true,
    prepTime: '24 hours',
    flavors: ['Chicken', 'Mutton', 'Peanut Butter', 'Banana & Honey'],
    image: 'https://images.unsplash.com/photo-1548199569-3f1c1f55cca6?w=400&h=400&fit=crop'
  },
  {
    id: 'cake-2',
    category: 'cakes',
    name: 'Pupcakes (6 Pack)',
    price: 450,
    sizes: '300g total',
    description: 'Cupcakes sized perfectly for dogs',
    flavors: ['Chicken', 'Mutton', 'Peanut Butter', 'Mixed'],
    image: 'https://images.unsplash.com/photo-1576618148400-f54bed99fcfd?w=400&h=400&fit=crop'
  },
  {
    id: 'cake-3',
    category: 'cakes',
    name: 'Mini Cakes',
    price: 350,
    sizes: '200g each',
    description: 'Individual portion cakes',
    flavors: ['Chicken', 'Peanut Butter'],
    image: 'https://images.unsplash.com/photo-1568571780765-9276ac8b75a2?w=400&h=400&fit=crop'
  },
  // Treats
  {
    id: 'treat-1',
    category: 'treats',
    name: 'Peanut Butter Biscuits',
    price: 250,
    sizes: '200g pack',
    description: 'Crunchy biscuits with real peanut butter',
    popular: true,
    shelfLife: '15 days',
    image: 'https://images.unsplash.com/photo-1582798358481-d199fb7347bb?w=400&h=400&fit=crop'
  },
  {
    id: 'treat-2',
    category: 'treats',
    name: 'Chicken Jerky',
    price: 350,
    sizes: '150g pack',
    description: 'Dehydrated chicken strips, high protein',
    shelfLife: '30 days',
    image: 'https://images.unsplash.com/photo-1608408843596-b311965e0469?w=400&h=400&fit=crop'
  },
  {
    id: 'treat-3',
    category: 'treats',
    name: 'Training Treats',
    price: 200,
    sizes: '100g pack',
    description: 'Small bites perfect for training',
    shelfLife: '20 days',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop'
  },
  {
    id: 'treat-4',
    category: 'treats',
    name: 'Dental Sticks',
    price: 180,
    sizes: 'Pack of 10',
    description: 'Helps clean teeth and freshen breath',
    shelfLife: '45 days',
    image: 'https://images.unsplash.com/photo-1589924691995-400dc9ecc119?w=400&h=400&fit=crop'
  },
  // Pet Food
  {
    id: 'food-1',
    category: 'food',
    name: 'Homemade Gravy',
    price: 120,
    sizes: '300ml pack',
    description: 'Fresh gravy with chicken/mutton',
    flavors: ['Chicken', 'Mutton'],
    shelfLife: '3 days refrigerated',
    image: 'https://images.unsplash.com/photo-1546069901-ba9599a7e63c?w=400&h=400&fit=crop'
  },
  {
    id: 'food-2',
    category: 'food',
    name: 'Dry Kibble',
    price: 500,
    sizes: '1kg',
    description: 'Premium quality dry food',
    shelfLife: '6 months',
    image: 'https://images.unsplash.com/photo-1582798358481-d199fb7347bb?w=400&h=400&fit=crop'
  },
  {
    id: 'food-3',
    category: 'food',
    name: 'Wet Food Cups',
    price: 80,
    sizes: '150g cup',
    description: 'Ready-to-serve wet meals',
    flavors: ['Chicken', 'Mutton', 'Fish'],
    shelfLife: '12 months',
    image: 'https://images.unsplash.com/photo-1548199569-3f1c1f55cca6?w=400&h=400&fit=crop'
  },
  // Cafe
  {
    id: 'cafe-1',
    category: 'cafe',
    name: 'Cappuccino',
    price: 150,
    sizes: 'Hot coffee',
    description: 'Freshly brewed coffee',
    image: 'https://images.unsplash.com/photo-1572442388796-11668a67e53d?w=400&h=400&fit=crop'
  },
  {
    id: 'cafe-2',
    category: 'cafe',
    name: 'Masala Chai',
    price: 80,
    sizes: 'Indian spiced',
    description: 'Indian spiced tea',
    image: 'https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?w=400&h=400&fit=crop'
  },
  {
    id: 'cafe-3',
    category: 'cafe',
    name: 'Veg Sandwich',
    price: 200,
    sizes: 'Grilled fresh',
    description: 'Grilled vegetable sandwich',
    image: 'https://images.unsplash.com/photo-1553909489-cd47e3b4430c?w=400&h=400&fit=crop'
  },
  {
    id: 'cafe-4',
    category: 'cafe',
    name: 'Chicken Sandwich',
    price: 250,
    sizes: 'Protein rich',
    description: 'Grilled chicken sandwich',
    image: 'https://images.unsplash.com/photo-1601758124510-52d02ddb7cbd?w=400&h=400&fit=crop'
  },
];

const highlights = [
  { icon: Heart, title: 'Made with Love', desc: 'Handcrafted daily', color: 'text-rose-500', bg: 'bg-rose-50' },
  { icon: Leaf, title: '100% Natural', desc: 'No preservatives', color: 'text-emerald-500', bg: 'bg-emerald-50' },
  { icon: Truck, title: 'Free Delivery', desc: 'Within 5km radius', color: 'text-blue-500', bg: 'bg-blue-50' },
  { icon: Award, title: '4.6 Star Rated', desc: 'On Google Reviews', color: 'text-amber-500', bg: 'bg-amber-50' },
];

export default function LandingPage() {
  const [cart, setCart] = useState<{id: string, name: string, price: number, qty: number, image: string}[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [activeCategory, setActiveCategory] = useState('all');
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 50);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const addToCart = (item: {id: string, name: string, price: number, image: string}) => {
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

  const filteredItems = activeCategory === 'all'
    ? menuItems
    : menuItems.filter(item => item.category === activeCategory);

  const whatsappLink = `https://wa.me/15551817070?text=${encodeURIComponent(
    `Hi Puppychef! 👋\n\nI want to order:\n${cart.map(i => `• ${i.name} x${i.qty} = ₹${i.price * i.qty}`).join('\n')}\n\n*Total: ₹${totalPrice}*\n\nPlease confirm my order.`
  )}`;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Sticky Header with Claymorphism */}
      <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 safe-top ${
        isScrolled ? 'bg-white/90 backdrop-blur-xl shadow-lg' : 'bg-transparent'
      }`}>
        <div className="max-w-lg mx-auto px-4 py-3 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg shadow-blue-500/30">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <div>
              <h1 className="text-lg font-bold text-slate-900 leading-tight font-['Varela_Round']">Puppychef</h1>
              <p className="text-xs text-slate-500">Pet Bakery Delhi</p>
            </div>
          </div>
          <button
            onClick={() => setShowCart(true)}
            className="relative w-12 h-12 bg-white rounded-2xl flex items-center justify-center tap-target active:scale-95 transition-all duration-200 shadow-md hover:shadow-lg"
            style={{ border: '2px solid rgba(255,255,255,0.8)' }}
          >
            <ShoppingCart className="w-5 h-5 text-slate-700" />
            {totalItems > 0 && (
              <span className="absolute -top-1 -right-1 w-5 h-5 bg-orange-500 text-white text-xs font-bold rounded-full flex items-center justify-center shadow-lg">
                {totalItems}
              </span>
            )}
          </button>
        </div>
      </header>

      {/* Hero Section with Soft Gradient */}
      <section className="pt-28 pb-8 px-4 bg-soft-gradient">
        <div className="max-w-lg mx-auto">
          {/* Rating Badge */}
          <div className="flex justify-center mb-4">
            <div className="inline-flex items-center gap-1.5 bg-white px-4 py-2 rounded-full shadow-md" style={{ border: '2px solid rgba(255,255,255,0.8)' }}>
              <Star className="w-4 h-4 text-amber-500 fill-amber-500" />
              <span className="text-sm font-bold text-slate-800">4.6</span>
              <span className="text-xs text-slate-500">(127 reviews)</span>
            </div>
          </div>

          {/* Hero Image with Claymorphism */}
          <div className="relative mb-6">
            <div className="aspect-square rounded-[2rem] overflow-hidden shadow-2xl bg-gradient-to-br from-amber-100 to-orange-100" style={{ border: '4px solid rgba(255,255,255,0.9)' }}>
              <ImageWithFallback
                src="https://images.unsplash.com/photo-1548199569-3f1c1f55cca6?w=800&h=800&fit=crop"
                alt="Dog Birthday Cake"
                className="w-full h-full object-cover"
              />
            </div>
            <div className="absolute -bottom-4 left-1/2 -translate-x-1/2 bg-white px-5 py-2.5 rounded-full shadow-lg flex items-center gap-2" style={{ border: '2px solid rgba(255,255,255,0.8)' }}>
              <Sparkles className="w-4 h-4 text-orange-500" />
              <p className="text-sm font-bold text-slate-800">Fresh Daily</p>
            </div>
          </div>

          {/* Hero Text */}
          <h2 className="text-3xl font-bold text-center text-slate-900 mb-3 font-['Varela_Round']">
            Premium Pet Bakery
          </h2>
          <p className="text-center text-slate-600 mb-6 px-4 leading-relaxed">
            Custom cakes, healthy treats & nutritious meals for your furry friends in Delhi
          </p>

          {/* CTA Buttons with Claymorphism */}
          <div className="flex gap-3">
            <a
              href="https://wa.me/15551817070"
              className="flex-1 clay-button bg-gradient-to-r from-blue-500 to-blue-600 text-white py-4 flex items-center justify-center gap-2 tap-target"
            >
              <MessageCircle className="w-5 h-5" />
              Order on WhatsApp
            </a>
            <a
              href="tel:+15551817070"
              className="clay-button-secondary w-14 flex items-center justify-center tap-target"
            >
              <Phone className="w-5 h-5" />
            </a>
          </div>
        </div>
      </section>

      {/* Highlights with Clay Cards */}
      <section className="py-8 px-4 bg-white">
        <div className="max-w-lg mx-auto grid grid-cols-2 gap-3">
          {highlights.map((h, i) => (
            <div key={i} className="clay-card p-4 text-center">
              <div className={`w-12 h-12 mx-auto mb-2 ${h.bg} rounded-2xl flex items-center justify-center`}>
                <h.icon className={`w-6 h-6 ${h.color}`} />
              </div>
              <p className="text-sm font-bold text-slate-800">{h.title}</p>
              <p className="text-xs text-slate-500">{h.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* Menu Section */}
      <section className="py-8 px-4" id="menu">
        <div className="max-w-lg mx-auto">
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-xl font-bold text-slate-900 font-['Varela_Round']">Our Menu</h3>
            <span className="text-sm text-slate-500">{filteredItems.length} items</span>
          </div>

          {/* Category Tabs with Clay Style */}
          <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-4 -mx-4 px-4">
            {menuCategories.map(cat => {
              const IconComponent = cat.icon;
              const isActive = activeCategory === cat.id;
              return (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`clay-tab flex items-center gap-2 tap-target ${
                    isActive ? 'clay-tab-active' : 'bg-white text-slate-600'
                  }`}
                >
                  <IconComponent className="w-4 h-4" />
                  {cat.name}
                </button>
              );
            })}
          </div>

          {/* Menu Grid with Product Cards */}
          <div className="grid grid-cols-2 gap-3">
            {filteredItems.map((item, index) => (
              <div key={item.id} className="product-card animate-slide-up" style={{ animationDelay: `${index * 50}ms` }}>
                {/* Image */}
                <div className="relative aspect-square bg-gradient-to-br from-slate-100 to-slate-200">
                  <ImageWithFallback
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover"
                  />
                  {item.popular && (
                    <div className="absolute top-2 left-2 badge-popular flex items-center gap-1">
                      <Star className="w-3 h-3 fill-white" />
                      POPULAR
                    </div>
                  )}
                </div>

                {/* Content */}
                <div className="p-3">
                  <h4 className="font-bold text-slate-900 text-sm leading-tight mb-1 line-clamp-2">
                    {item.name}
                  </h4>
                  <p className="text-xs text-slate-500 mb-2">{item.sizes}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-lg font-bold text-orange-500">₹{item.price}</span>
                    <button
                      onClick={() => addToCart(item)}
                      className="fab-add tap-target"
                    >
                      <Plus className="w-5 h-5" />
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Store Info with Clay Card */}
      <section className="py-8 px-4 bg-slate-100">
        <div className="max-w-lg mx-auto">
          <div className="clay-card p-5">
            <div className="flex items-center gap-2 mb-4">
              <div className="w-10 h-10 bg-blue-50 rounded-xl flex items-center justify-center">
                <Store className="w-5 h-5 text-blue-600" />
              </div>
              <h3 className="text-lg font-bold text-slate-900 font-['Varela_Round']">Visit Our Store</h3>
            </div>

            <div className="space-y-3 mb-5">
              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-rose-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <MapPin className="w-5 h-5 text-rose-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">Safdarjung Enclave</p>
                  <p className="text-sm text-slate-500">Block C, New Delhi - 110029</p>
                </div>
              </div>

              <div className="flex items-start gap-3">
                <div className="w-10 h-10 bg-emerald-50 rounded-xl flex items-center justify-center flex-shrink-0">
                  <Clock className="w-5 h-5 text-emerald-500" />
                </div>
                <div>
                  <p className="font-bold text-slate-900">10 AM - 8 PM</p>
                  <p className="text-sm text-slate-500">Tuesday - Sunday</p>
                </div>
              </div>
            </div>

            <a
              href="https://wa.me/15551817070"
              className="clay-button bg-gradient-to-r from-green-500 to-green-600 text-white py-3.5 w-full flex items-center justify-center gap-2 tap-target"
            >
              <MessageCircle className="w-5 h-5" />
              Chat on WhatsApp
              <ArrowRight className="w-4 h-4" />
            </a>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-8 px-4 bg-slate-900 text-white safe-bottom">
        <div className="max-w-lg mx-auto text-center">
          <div className="flex items-center justify-center gap-2 mb-3">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center shadow-lg">
              <ChefHat className="w-7 h-7 text-white" />
            </div>
            <span className="font-bold text-2xl font-['Varela_Round']">Puppychef</span>
          </div>
          <p className="text-slate-400 text-sm mb-4">Made with love for your pets</p>
          <div className="flex justify-center gap-4 mb-4">
            <a href="#" className="w-11 h-11 bg-slate-800 rounded-xl flex items-center justify-center tap-target active:scale-95 hover:bg-slate-700 transition-colors">
              <Camera className="w-5 h-5" />
            </a>
          </div>
          <p className="text-slate-500 text-xs">© 2024 Puppychef. All rights reserved.</p>
        </div>
      </footer>

      {/* Cart Drawer with Claymorphism */}
      {showCart && (
        <div className="fixed inset-0 z-50">
          <div
            className="absolute inset-0 bg-black/50 backdrop-blur-sm"
            onClick={() => setShowCart(false)}
          />
          <div className="absolute right-0 top-0 bottom-0 w-full max-w-sm bg-slate-50 shadow-2xl">
            {/* Header */}
            <div className="flex items-center justify-between p-4 bg-white shadow-sm">
              <div className="flex items-center gap-2">
                <ShoppingCart className="w-5 h-5 text-slate-700" />
                <h3 className="font-bold text-lg text-slate-900">Your Cart ({totalItems})</h3>
              </div>
              <button
                onClick={() => setShowCart(false)}
                className="w-10 h-10 flex items-center justify-center tap-target hover:bg-slate-100 rounded-full transition-colors"
              >
                <X className="w-6 h-6 text-slate-600" />
              </button>
            </div>

            {/* Cart Items */}
            <div className="p-4" style={{ maxHeight: 'calc(100vh - 220px)', overflowY: 'auto' }}>
              {cart.length === 0 ? (
                <div className="text-center py-12">
                  <div className="w-20 h-20 mx-auto mb-4 bg-slate-100 rounded-2xl flex items-center justify-center">
                    <ShoppingCart className="w-10 h-10 text-slate-300" />
                  </div>
                  <p className="text-slate-500 font-medium">Your cart is empty</p>
                  <button
                    onClick={() => setShowCart(false)}
                    className="mt-4 text-blue-500 font-bold flex items-center justify-center gap-1 mx-auto"
                  >
                    Browse Menu
                    <ArrowRight className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map(item => (
                    <div key={item.id} className="clay-card p-3 flex items-center gap-3">
                      <div className="w-14 h-14 rounded-xl overflow-hidden bg-gradient-to-br from-slate-100 to-slate-200 flex-shrink-0">
                        <ImageWithFallback src={item.image} alt={item.name} className="w-full h-full object-cover" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-bold text-slate-900 text-sm truncate">{item.name}</h4>
                        <p className="text-orange-500 font-bold">₹{item.price * item.qty}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => updateQty(item.id, -1)}
                          className="w-8 h-8 bg-slate-100 rounded-full flex items-center justify-center tap-target active:scale-90"
                        >
                          <Minus className="w-4 h-4" />
                        </button>
                        <span className="w-6 text-center font-bold">{item.qty}</span>
                        <button
                          onClick={() => updateQty(item.id, 1)}
                          className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center tap-target active:scale-90"
                        >
                          <Plus className="w-4 h-4" />
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Footer */}
            {cart.length > 0 && (
              <div className="absolute bottom-0 left-0 right-0 p-4 bg-white border-t border-slate-100 safe-bottom">
                <div className="flex justify-between mb-4">
                  <span className="text-slate-600 font-medium">Total</span>
                  <span className="text-2xl font-bold text-orange-500">₹{totalPrice}</span>
                </div>
                <a
                  href={whatsappLink}
                  className="clay-button bg-gradient-to-r from-green-500 to-green-600 text-white py-4 w-full flex items-center justify-center gap-2 tap-target"
                >
                  <MessageCircle className="w-5 h-5" />
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

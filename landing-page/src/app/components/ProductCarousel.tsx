'use client';

import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence, PanInfo } from 'framer-motion';
import { Plus, Minus, ShoppingBag, ChevronLeft, ChevronRight } from 'lucide-react';

interface MenuItem {
  id: string;
  name: string;
  desc: string;
  price: number;
  image: string;
  category: string;
  badge?: string;
}

interface ProductCarouselProps {
  items: MenuItem[];
  onAddToCart: (item: MenuItem) => void;
}

const categories = ['All', 'Cakes', 'Treats', 'Food', 'Cafe'];

const categoryMap: { [key: string]: string[] } = {
  'All': [],
  'Cakes': ['Custom Cakes'],
  'Treats': ['Treats'],
  'Food': ['Pet Food'],
  'Cafe': ['Cafe'],
};

export default function ProductCarousel({ items, onAddToCart }: ProductCarouselProps) {
  const [activeCategory, setActiveCategory] = useState('All');
  const [cart, setCart] = useState<{ item: MenuItem; qty: number }[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);
  const [canScrollLeft, setCanScrollLeft] = useState(false);
  const [canScrollRight, setCanScrollRight] = useState(true);

  const filteredItems = activeCategory === 'All'
    ? items
    : items.filter(item => categoryMap[activeCategory].includes(item.category));

  const checkScroll = () => {
    if (scrollRef.current) {
      const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
      setCanScrollLeft(scrollLeft > 0);
      setCanScrollRight(scrollLeft < scrollWidth - clientWidth - 10);
    }
  };

  useEffect(() => {
    checkScroll();
    const el = scrollRef.current;
    if (el) {
      el.addEventListener('scroll', checkScroll);
      return () => el.removeEventListener('scroll', checkScroll);
    }
  }, [filteredItems]);

  const scroll = (direction: 'left' | 'right') => {
    if (scrollRef.current) {
      const scrollAmount = 320;
      scrollRef.current.scrollBy({
        left: direction === 'left' ? -scrollAmount : scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  const handleDragEnd = (event: MouseEvent | TouchEvent | PointerEvent, info: PanInfo) => {
    if (scrollRef.current) {
      const velocity = info.velocity.x;
      if (Math.abs(velocity) > 500) {
        scrollRef.current.scrollBy({
          left: velocity > 0 ? -300 : 300,
          behavior: 'smooth',
        });
      }
    }
  };

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(i => i.item.id === item.id);
      if (existing) {
        return prev.map(i => i.item.id === item.id ? { ...i, qty: i.qty + 1 } : i);
      }
      return [...prev, { item, qty: 1 }];
    });
    onAddToCart(item);
  };

  const updateQty = (id: string, delta: number) => {
    setCart(prev => prev.map(i => {
      if (i.item.id === id) {
        return { ...i, qty: Math.max(0, i.qty + delta) };
      }
      return i;
    }).filter(i => i.qty > 0));
  };

  const getQty = (id: string) => cart.find(i => i.item.id === id)?.qty || 0;
  const totalItems = cart.reduce((sum, i) => sum + i.qty, 0);
  const totalPrice = cart.reduce((sum, i) => sum + i.item.price * i.qty, 0);

  return (
    <section className="relative py-8">
      {/* Header */}
      <div className="px-4 mb-6">
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-white mb-2"
          style={{ fontFamily: 'Bodoni Moda, serif' }}
        >
          Our Menu
        </motion.h2>
        <motion.p
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="text-white/50 text-sm"
        >
          Swipe to explore our handcrafted delights
        </motion.p>
      </div>

      {/* Category Tabs */}
      <div className="px-4 mb-6">
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-2 -mx-4 px-4">
          {categories.map((cat) => (
            <motion.button
              key={cat}
              onClick={() => setActiveCategory(cat)}
              className={`px-5 py-2.5 rounded-full text-sm font-medium whitespace-nowrap transition-all duration-300 ${
                activeCategory === cat
                  ? 'bg-gradient-to-r from-amber-500 to-amber-600 text-white shadow-lg shadow-amber-500/30'
                  : 'bg-white/5 text-white/60 border border-white/10 hover:bg-white/10'
              }`}
              whileTap={{ scale: 0.95 }}
            >
              {cat}
            </motion.button>
          ))}
        </div>
      </div>

      {/* Horizontal Scroll Container */}
      <div className="relative">
        {/* Navigation Arrows */}
        <AnimatePresence>
          {canScrollLeft && (
            <motion.button
              initial={{ opacity: 0, x: -10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -10 }}
              onClick={() => scroll('left')}
              className="absolute left-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/80 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 shadow-xl"
            >
              <ChevronLeft className="w-5 h-5 text-white" />
            </motion.button>
          )}
        </AnimatePresence>

        <AnimatePresence>
          {canScrollRight && (
            <motion.button
              initial={{ opacity: 0, x: 10 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 10 }}
              onClick={() => scroll('right')}
              className="absolute right-2 top-1/2 -translate-y-1/2 z-20 w-10 h-10 bg-black/80 backdrop-blur-xl rounded-full flex items-center justify-center border border-white/10 shadow-xl"
            >
              <ChevronRight className="w-5 h-5 text-white" />
            </motion.button>
          )}
        </AnimatePresence>

        {/* Product Cards */}
        <motion.div
          ref={scrollRef}
          className="flex gap-4 overflow-x-auto scrollbar-hide px-4 pb-4 snap-x snap-mandatory"
          style={{ scrollbarWidth: 'none', msOverflowStyle: 'none' }}
          drag="x"
          dragConstraints={{ left: 0, right: 0 }}
          dragElastic={0.1}
          onDragEnd={handleDragEnd}
        >
          {filteredItems.map((item, index) => {
            const qty = getQty(item.id);
            return (
              <motion.div
                key={item.id}
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                viewport={{ once: true }}
                className="flex-shrink-0 w-[280px] snap-start"
              >
                <div className="group relative bg-gradient-to-br from-white/[0.08] to-white/[0.02] backdrop-blur-xl rounded-3xl overflow-hidden border border-white/[0.08] hover:border-amber-500/30 transition-all duration-500">
                  {/* Image Container */}
                  <div className="relative h-40 overflow-hidden bg-gradient-to-br from-amber-500/10 to-rose-500/10">
                    <motion.img
                      src={item.image}
                      alt={item.name}
                      className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                    />
                    {item.badge && (
                      <div className="absolute top-3 left-3 px-3 py-1 bg-amber-500 text-white text-xs font-bold rounded-full">
                        {item.badge}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />
                  </div>

                  {/* Content */}
                  <div className="p-5">
                    <div className="flex items-start justify-between mb-2">
                      <div>
                        <h3 className="text-white font-semibold text-lg leading-tight mb-1">
                          {item.name}
                        </h3>
                        <p className="text-white/50 text-sm">{item.desc}</p>
                      </div>
                    </div>

                    <div className="flex items-center justify-between mt-4">
                      <span className="text-2xl font-bold text-amber-400">
                        ₹{item.price}
                      </span>

                      {qty > 0 ? (
                        <div className="flex items-center gap-3 bg-white/10 rounded-full px-2 py-1">
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => updateQty(item.id, -1)}
                            className="w-8 h-8 flex items-center justify-center bg-white/10 rounded-full text-white hover:bg-white/20 transition-colors"
                          >
                            <Minus className="w-4 h-4" />
                          </motion.button>
                          <span className="text-white font-semibold w-6 text-center">
                            {qty}
                          </span>
                          <motion.button
                            whileTap={{ scale: 0.9 }}
                            onClick={() => addToCart(item)}
                            className="w-8 h-8 flex items-center justify-center bg-amber-500 rounded-full text-white hover:bg-amber-600 transition-colors"
                          >
                            <Plus className="w-4 h-4" />
                          </motion.button>
                        </div>
                      ) : (
                        <motion.button
                          whileTap={{ scale: 0.95 }}
                          whileHover={{ scale: 1.05 }}
                          onClick={() => addToCart(item)}
                          className="flex items-center gap-2 px-4 py-2.5 bg-gradient-to-r from-amber-500 to-amber-600 rounded-full text-white text-sm font-semibold shadow-lg shadow-amber-500/25"
                        >
                          <Plus className="w-4 h-4" />
                          Add
                        </motion.button>
                      )}
                    </div>
                  </div>
                </div>
              </motion.div>
            );
          })}
        </motion.div>
      </div>

      {/* Cart Summary Bar */}
      <AnimatePresence>
        {totalItems > 0 && (
          <motion.div
            initial={{ y: 100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed bottom-4 left-4 right-4 z-50"
          >
            <div className="bg-gradient-to-r from-amber-600 to-amber-700 backdrop-blur-xl rounded-2xl p-4 shadow-2xl shadow-amber-500/30 border border-amber-400/30">
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center">
                    <ShoppingBag className="w-6 h-6 text-white" />
                  </div>
                  <div>
                    <p className="text-white/80 text-sm">{totalItems} items</p>
                    <p className="text-white text-xl font-bold">₹{totalPrice}</p>
                  </div>
                </div>
                <motion.a
                  href={`https://wa.me/15551817070?text=Hi%2C%20I%20want%20to%20order%3A%20${encodeURIComponent(
                    cart.map(i => `${i.item.name} x${i.qty} (₹${i.item.price * i.qty})`).join(', ')
                  )}`}
                  target="_blank"
                  rel="noopener noreferrer"
                  whileTap={{ scale: 0.95 }}
                  className="px-6 py-3 bg-white text-amber-700 rounded-xl font-semibold shadow-lg hover:bg-white/90 transition-colors"
                >
                  Order Now
                </motion.a>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
}

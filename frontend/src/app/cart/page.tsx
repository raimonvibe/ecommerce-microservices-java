'use client';

import { useState, useEffect } from 'react';
import { Trash2, Plus, Minus, ShoppingBag } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { CartItem, Product } from '@/types';
import { dummyProducts } from '@/data/dummyData';
import Image from 'next/image';

export default function CartPage() {
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadCart = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        const dummyCartItems: CartItem[] = [
          { id: 1, product: dummyProducts[0], quantity: 1, userId: 1 },
          { id: 2, product: dummyProducts[2], quantity: 2, userId: 1 },
          { id: 3, product: dummyProducts[4], quantity: 1, userId: 1 },
        ];
        setCartItems(dummyCartItems);
      } catch (error) {
        console.error('Error loading cart:', error);
      } finally {
        setLoading(false);
      }
    };

    loadCart();
  }, []);

  const updateQuantity = (id: number, newQuantity: number) => {
    if (newQuantity <= 0) {
      removeItem(id);
      return;
    }
    setCartItems(items =>
      items.map(item =>
        item.id === id ? { ...item, quantity: newQuantity } : item
      )
    );
  };

  const removeItem = (id: number) => {
    setCartItems(items => items.filter(item => item.id !== id));
  };

  const getTotalPrice = () => {
    return cartItems.reduce((total, item) => total + (item.product.price * item.quantity), 0);
  };

  const getTotalItems = () => {
    return cartItems.reduce((total, item) => total + item.quantity, 0);
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-4xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Shopping Cart</h1>
          <p className="text-xl text-silver-400">Review your selected items</p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : cartItems.length === 0 ? (
          <div className="text-center py-12">
            <ShoppingBag className="mx-auto text-silver-400 mb-4" size={64} />
            <h2 className="text-2xl font-semibold text-white mb-2">Your cart is empty</h2>
            <p className="text-silver-400 mb-6">Add some products to get started</p>
            <a
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-gold-600 hover:bg-gold-500 text-white font-semibold rounded-lg transition-colors"
            >
              Browse Products
            </a>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <div className="space-y-4">
                {cartItems.map((item) => (
                  <div
                    key={item.id}
                    className="glass-effect rounded-xl p-6 hover:border-gold-400/40 transition-all duration-300"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="flex-shrink-0">
                        <div className="w-20 h-20 rounded-lg overflow-hidden">
                          <Image
                            src={item.product.imageUrl || '/placeholder-product.jpg'}
                            alt={item.product.productName}
                            width={80}
                            height={80}
                            className="w-full h-full object-cover"
                          />
                        </div>
                      </div>
                      
                      <div className="flex-1">
                        <h3 className="text-lg font-semibold text-white mb-1">
                          {item.product.productName}
                        </h3>
                        <p className="text-silver-400 text-sm mb-2">
                          {item.product.category}
                        </p>
                        <p className="text-gold-400 font-semibold">
                          ${item.product.price.toFixed(2)}
                        </p>
                      </div>
                      
                      <div className="flex items-center space-x-3">
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity - 1)}
                          className="p-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
                        >
                          <Minus size={16} />
                        </button>
                        
                        <span className="text-white font-semibold w-8 text-center">
                          {item.quantity}
                        </span>
                        
                        <button
                          onClick={() => updateQuantity(item.id, item.quantity + 1)}
                          className="p-2 bg-dark-700 hover:bg-dark-600 text-white rounded-lg transition-colors"
                        >
                          <Plus size={16} />
                        </button>
                      </div>
                      
                      <div className="text-right">
                        <p className="text-lg font-semibold text-white mb-2">
                          ${(item.product.price * item.quantity).toFixed(2)}
                        </p>
                        <button
                          onClick={() => removeItem(item.id)}
                          className="p-2 text-red-400 hover:text-red-300 hover:bg-red-600/10 rounded-lg transition-colors"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
            
            <div className="lg:col-span-1">
              <div className="glass-effect rounded-xl p-6 sticky top-8">
                <h2 className="text-xl font-semibold text-white mb-4">Order Summary</h2>
                
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-silver-400">
                    <span>Items ({getTotalItems()})</span>
                    <span>${getTotalPrice().toFixed(2)}</span>
                  </div>
                  <div className="flex justify-between text-silver-400">
                    <span>Shipping</span>
                    <span>Free</span>
                  </div>
                  <div className="flex justify-between text-silver-400">
                    <span>Tax</span>
                    <span>${(getTotalPrice() * 0.08).toFixed(2)}</span>
                  </div>
                  <div className="border-t border-gold-600/20 pt-3">
                    <div className="flex justify-between text-lg font-semibold text-white">
                      <span>Total</span>
                      <span>${(getTotalPrice() * 1.08).toFixed(2)}</span>
                    </div>
                  </div>
                </div>
                
                <button className="w-full bg-gold-600 hover:bg-gold-500 text-white font-semibold py-3 rounded-lg transition-colors mb-3">
                  Proceed to Checkout
                </button>
                
                <button className="w-full bg-transparent border border-gold-600 hover:bg-gold-600/10 text-gold-400 font-semibold py-3 rounded-lg transition-colors">
                  Continue Shopping
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

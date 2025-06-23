'use client';

import { useState, useEffect } from 'react';
import Link from 'next/link';
import { ArrowRight, Package, Users, Star, ShoppingCart } from 'lucide-react';
import ProductCard from '@/components/ProductCard';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Product } from '@/types';
import { dummyProducts } from '@/data/dummyData';

export default function HomePage() {
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadFeaturedProducts = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setFeaturedProducts(dummyProducts.slice(0, 4));
      } catch (error) {
        console.error('Error loading featured products:', error);
        setFeaturedProducts(dummyProducts.slice(0, 4));
      } finally {
        setLoading(false);
      }
    };

    loadFeaturedProducts();
  }, []);

  const handleAddToCart = (product: Product) => {
    console.log('Adding to cart:', product);
  };

  return (
    <div className="min-h-screen">
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto text-center">
          <div className="mb-8">
            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="gradient-text">RainbowForest</span>
            </h1>
            <h2 className="text-2xl md:text-4xl font-semibold text-white mb-6">
              E-commerce Microservices Platform
            </h2>
            <p className="text-xl text-silver-400 max-w-3xl mx-auto mb-8">
              Experience the future of online shopping with our professional microservices architecture. 
              Discover premium products, personalized recommendations, and seamless shopping experiences.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Link
              href="/products"
              className="inline-flex items-center px-8 py-4 bg-gold-600 hover:bg-gold-500 text-white font-semibold rounded-lg transition-all duration-200 hover:shadow-lg hover:shadow-gold-400/25"
            >
              Browse Products
              <ArrowRight className="ml-2" size={20} />
            </Link>
            <Link
              href="/recommendations"
              className="inline-flex items-center px-8 py-4 bg-transparent border-2 border-gold-600 hover:bg-gold-600/10 text-gold-400 font-semibold rounded-lg transition-all duration-200"
            >
              View Reviews
              <Star className="ml-2" size={20} />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-16">
            <div className="glass-effect rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gold-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Package className="text-gold-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Premium Products</h3>
              <p className="text-silver-400">Curated selection of high-quality products across multiple categories</p>
            </div>
            
            <div className="glass-effect rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gold-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="text-gold-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">User Management</h3>
              <p className="text-silver-400">Secure user registration, authentication, and profile management</p>
            </div>
            
            <div className="glass-effect rounded-xl p-6 text-center">
              <div className="w-16 h-16 bg-gold-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <ShoppingCart className="text-gold-400" size={32} />
              </div>
              <h3 className="text-xl font-semibold text-white mb-2">Smart Shopping</h3>
              <p className="text-silver-400">Intelligent cart management and personalized recommendations</p>
            </div>
          </div>
        </div>
      </section>

      <section className="py-16 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-12">
            <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">Featured Products</h2>
            <p className="text-xl text-silver-400">Discover our most popular and highly-rated items</p>
          </div>

          {loading ? (
            <LoadingSpinner />
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {featuredProducts.map((product) => (
                <ProductCard
                  key={product.id}
                  product={product}
                  onAddToCart={handleAddToCart}
                />
              ))}
            </div>
          )}

          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center px-6 py-3 bg-transparent border border-gold-600 hover:bg-gold-600/10 text-gold-400 font-semibold rounded-lg transition-all duration-200"
            >
              View All Products
              <ArrowRight className="ml-2" size={18} />
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}

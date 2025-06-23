'use client';

import { Product } from '@/types';
import { ShoppingCart, Star } from 'lucide-react';
import Image from 'next/image';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
}

export default function ProductCard({ product, onAddToCart }: ProductCardProps) {
  return (
    <div className="group relative bg-dark-800/50 backdrop-blur-sm rounded-xl border border-gold-600/20 overflow-hidden hover:border-gold-400/40 transition-all duration-300 hover:shadow-lg hover:shadow-gold-400/10">
      <div className="relative h-48 overflow-hidden">
        <Image
          src={product.imageUrl || '/placeholder-product.jpg'}
          alt={product.productName}
          fill
          className="object-cover group-hover:scale-105 transition-transform duration-300"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-dark-900/60 to-transparent" />
        <div className="absolute top-3 right-3">
          <span className={`px-2 py-1 rounded-full text-xs font-medium ${
            product.availability > 10 
              ? 'bg-green-600/20 text-green-400 border border-green-600/30'
              : product.availability > 0
              ? 'bg-yellow-600/20 text-yellow-400 border border-yellow-600/30'
              : 'bg-red-600/20 text-red-400 border border-red-600/30'
          }`}>
            {product.availability > 0 ? `${product.availability} left` : 'Out of stock'}
          </span>
        </div>
      </div>

      <div className="p-4">
        <div className="mb-2">
          <span className="text-xs font-medium text-gold-400 bg-gold-600/20 px-2 py-1 rounded-full">
            {product.category}
          </span>
        </div>
        
        <h3 className="text-lg font-semibold text-white mb-2 group-hover:text-gold-400 transition-colors">
          {product.productName}
        </h3>
        
        <p className="text-silver-400 text-sm mb-3 line-clamp-2">
          {product.discription}
        </p>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <span className="text-2xl font-bold text-gold-400">
              ${product.price.toFixed(2)}
            </span>
          </div>
          
          <button
            onClick={() => onAddToCart?.(product)}
            disabled={product.availability === 0}
            className="flex items-center space-x-2 px-4 py-2 bg-gold-600 hover:bg-gold-500 disabled:bg-gray-600 disabled:cursor-not-allowed text-white rounded-lg transition-colors duration-200 font-medium"
          >
            <ShoppingCart size={16} />
            <span>Add</span>
          </button>
        </div>
      </div>
    </div>
  );
}

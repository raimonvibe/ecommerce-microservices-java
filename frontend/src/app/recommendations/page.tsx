'use client';

import { useState, useEffect } from 'react';
import { Star, User } from 'lucide-react';
import LoadingSpinner from '@/components/LoadingSpinner';
import { Recommendation } from '@/types';
import { dummyRecommendations } from '@/data/dummyData';
import Image from 'next/image';

export default function RecommendationsPage() {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadRecommendations = async () => {
      try {
        await new Promise(resolve => setTimeout(resolve, 1000));
        setRecommendations(dummyRecommendations);
      } catch (error) {
        console.error('Error loading recommendations:', error);
        setRecommendations(dummyRecommendations);
      } finally {
        setLoading(false);
      }
    };

    loadRecommendations();
  }, []);

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, index) => (
      <Star
        key={index}
        size={16}
        className={index < rating ? 'text-gold-400 fill-current' : 'text-gray-600'}
      />
    ));
  };

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto">
        <div className="mb-8">
          <h1 className="text-4xl font-bold text-white mb-4">Product Reviews & Recommendations</h1>
          <p className="text-xl text-silver-400">See what our customers are saying about our products</p>
        </div>

        {loading ? (
          <LoadingSpinner />
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {recommendations.map((recommendation) => (
              <div
                key={recommendation.id}
                className="glass-effect rounded-xl p-6 hover:border-gold-400/40 transition-all duration-300"
              >
                <div className="flex items-start space-x-4">
                  <div className="flex-shrink-0">
                    <div className="w-16 h-16 bg-gold-600/20 rounded-full flex items-center justify-center">
                      <User className="text-gold-400" size={24} />
                    </div>
                  </div>
                  
                  <div className="flex-1">
                    <div className="flex items-center justify-between mb-2">
                      <h3 className="text-lg font-semibold text-white">
                        {recommendation.user.userDetails?.firstName} {recommendation.user.userDetails?.lastName}
                      </h3>
                      <div className="flex items-center space-x-1">
                        {renderStars(recommendation.rating)}
                      </div>
                    </div>
                    
                    <p className="text-silver-400 text-sm mb-4">@{recommendation.user.userName}</p>
                  </div>
                </div>

                <div className="mt-4 p-4 bg-dark-800/30 rounded-lg">
                  <div className="flex items-start space-x-4">
                    <div className="flex-shrink-0">
                      <div className="w-16 h-16 rounded-lg overflow-hidden">
                        <Image
                          src={recommendation.product.imageUrl || '/placeholder-product.jpg'}
                          alt={recommendation.product.productName}
                          width={64}
                          height={64}
                          className="w-full h-full object-cover"
                        />
                      </div>
                    </div>
                    
                    <div className="flex-1">
                      <h4 className="text-white font-semibold mb-1">
                        {recommendation.product.productName}
                      </h4>
                      <p className="text-silver-400 text-sm mb-2">
                        {recommendation.product.category}
                      </p>
                      <p className="text-gold-400 font-semibold">
                        ${recommendation.product.price.toFixed(2)}
                      </p>
                    </div>
                  </div>
                  
                  <div className="mt-3 pt-3 border-t border-gold-600/20">
                    <p className="text-silver-300 text-sm">
                      {recommendation.product.discription}
                    </p>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <span className="text-xs text-silver-500">
                      Rated {recommendation.rating} out of 5 stars
                    </span>
                  </div>
                  
                  <button className="text-gold-400 hover:text-gold-300 text-sm font-medium transition-colors">
                    View Product
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

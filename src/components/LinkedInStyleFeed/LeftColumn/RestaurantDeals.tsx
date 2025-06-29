"use client";

import React, { useState } from 'react';
import Card from '../../Card';
import { FaBookmark } from 'react-icons/fa';

interface Deal {
  id: string;
  restaurant: string;
  deal: string;
  price: string;
  originalPrice?: string;
  expiresAt: Date | string;
  saved?: boolean;
}

interface RestaurantDealsProps {
  deals?: Deal[];
}

const RestaurantDeals: React.FC<RestaurantDealsProps> = ({
  deals = [
    {
      id: '1',
      restaurant: 'Campus Café',
      deal: 'Coffee & Bagel Combo',
      price: '$3.99',
      originalPrice: '$6.99',
      expiresAt: new Date(Date.now() + 43200000), // 12 hours from now
      saved: false
    },
    {
      id: '2',
      restaurant: 'Pizza Palace',
      deal: 'Large 2-Topping Pizza',
      price: '$8.99',
      originalPrice: '$14.99',
      expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
      saved: false
    },
    {
      id: '3',
      restaurant: 'Sushi Station',
      deal: 'California Roll Combo',
      price: '$7.50',
      originalPrice: '$12.99',
      expiresAt: new Date(Date.now() + 64800000), // 18 hours from now
      saved: false
    }
  ]
}) => {
  const [savedDeals, setSavedDeals] = useState<Record<string, boolean>>({});
  
  const toggleSave = (id: string) => {
    setSavedDeals(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Format expiration date
  const formatExpiration = (date: Date | string) => {
    if (!date) return '';
    
    const expirationDate = typeof date === 'string' ? new Date(date) : date;
    const now = new Date();
    const diffMs = expirationDate.getTime() - now.getTime();
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
    
    if (diffHours < 1) return 'Expires soon';
    if (diffHours < 24) return `Expires in ${diffHours}h`;
    
    const diffDays = Math.floor(diffHours / 24);
    return `Expires in ${diffDays}d`;
  };

  return (
    <Card className="mb-4">
      <h3 className="text-lg font-bold text-white mb-3">Today's Restaurant Deals</h3>
      <div className="space-y-3">
        {deals.map((deal) => (
          <div key={deal.id} className="p-2 border-b border-accent-30 last:border-0">
            <div className="flex justify-between">
              <span className="font-medium text-white">{deal.restaurant}</span>
              <span className="text-accent">{deal.price}</span>
            </div>
            <p className="text-sm text-text-secondary">{deal.deal}</p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-accent line-through">{deal.originalPrice}</p>
              <span className="text-xs text-text-secondary">{formatExpiration(deal.expiresAt)}</span>
            </div>
            <button 
              onClick={() => toggleSave(deal.id)}
              className={`text-xs flex items-center gap-1 mt-1 ${
                savedDeals[deal.id] ? 'text-accent' : 'text-text-secondary hover:text-accent'
              }`}
            >
              <FaBookmark size={12} /> {savedDeals[deal.id] ? 'Saved' : 'Save'}
            </button>
          </div>
        ))}
      </div>
    </Card>
  );
};

export default RestaurantDeals;

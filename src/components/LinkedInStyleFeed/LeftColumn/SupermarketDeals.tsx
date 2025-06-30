"use client";

import React, { useState, useEffect } from 'react';
import Card from '../../Card';
import { FaBookmark } from 'react-icons/fa';

interface Deal {
  id: string;
  store: string;
  item: string;
  price: string;
  originalPrice?: string;
  expiresAt: Date | string;
  saved?: boolean;
}

interface SupermarketDealsProps {
  deals?: Deal[];
}

const SupermarketDeals: React.FC<SupermarketDealsProps> = ({
  deals = [
    {
      id: '1',
      store: 'Campus Market',
      item: 'Ramen Noodles (5-pack)',
      price: '$2.99',
      originalPrice: '$4.99',
      expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
      saved: false
    },
    {
      id: '2',
      store: 'Concordia Grocery',
      item: 'Energy Drinks (6-pack)',
      price: '$7.99',
      originalPrice: '$10.99',
      expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
      saved: false
    },
    {
      id: '3',
      store: 'Student Pantry',
      item: 'Frozen Pizza',
      price: '$3.50',
      originalPrice: '$5.99',
      expiresAt: new Date(Date.now() + 86400000), // 24 hours from now
      saved: false
    }
  ]
}) => {
  const [savedDeals, setSavedDeals] = useState<Record<string, boolean>>({});
  const [isClient, setIsClient] = useState(false);
  
  // This ensures we only render time-based content on the client
  useEffect(() => {
    setIsClient(true);
  }, []);
  
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
      <h3 className="text-lg font-bold text-white mb-3">Today's Supermarket Deals</h3>
      <div className="space-y-3">
        {deals.map((deal) => (
          <div key={deal.id} className="p-2 border-b border-accent-30 last:border-0">
            <div className="flex justify-between">
              <span className="font-medium text-white">{deal.store}</span>
              <span className="text-accent">{deal.price}</span>
            </div>
            <p className="text-sm text-text-secondary">{deal.item}</p>
            <div className="flex justify-between items-center mt-1">
              <p className="text-xs text-accent line-through">{deal.originalPrice}</p>
              <span className="text-xs text-text-secondary">
                {isClient ? formatExpiration(deal.expiresAt) : 'Loading...'}
              </span>
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

export default SupermarketDeals;

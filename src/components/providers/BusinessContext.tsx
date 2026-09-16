'use client';

import React, { createContext, useContext, useState, useEffect } from 'react';

export interface CurrentUser {
  _id: string;
  name: string;
  email: string;
  role: 'owner' | 'member';
}

interface BusinessContextType {
  businessId: string;
  businessName: string;
  currentUser: CurrentUser;
  switchUserRole: (role: 'owner' | 'member') => void;
  refreshTrigger: number;
  triggerRefresh: () => void;
}

const BusinessContext = createContext<BusinessContextType | undefined>(undefined);

export function BusinessProvider({ children }: { children: React.ReactNode }) {
  const [businessId] = useState('biz_quickcart');
  const [businessName] = useState('QuickCart Online Store');
  const [currentUser, setCurrentUser] = useState<CurrentUser>({
    _id: 'user_sarah',
    name: 'Sarah Lin',
    email: 'sarah@quickcart.demo',
    role: 'owner',
  });
  const [refreshTrigger, setRefreshTrigger] = useState(0);

  const switchUserRole = (role: 'owner' | 'member') => {
    if (role === 'owner') {
      setCurrentUser({
        _id: 'user_sarah',
        name: 'Sarah Lin',
        email: 'sarah@quickcart.demo',
        role: 'owner',
      });
    } else {
      setCurrentUser({
        _id: 'user_alex',
        name: 'Alex Chen',
        email: 'alex@quickcart.demo',
        role: 'member',
      });
    }
  };

  const triggerRefresh = () => setRefreshTrigger(prev => prev + 1);

  return (
    <BusinessContext.Provider
      value={{
        businessId,
        businessName,
        currentUser,
        switchUserRole,
        refreshTrigger,
        triggerRefresh,
      }}
    >
      {children}
    </BusinessContext.Provider>
  );
}

export function useBusiness() {
  const context = useContext(BusinessContext);
  if (!context) {
    throw new Error('useBusiness must be used within a BusinessProvider');
  }
  return context;
}

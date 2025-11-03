'use client';

import React from 'react';
import { useLoading } from '@/contexts/LoadingContext';
import LoadingSpinner from './LoadingSpinner';

const LoadingManager: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const { isLoading } = useLoading();

  return (
    <>
      {isLoading && <LoadingSpinner />}
      {!isLoading && children}
    </>
  );
};

export default LoadingManager;

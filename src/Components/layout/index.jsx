import React from 'react';

export default function Layout({ children }) {
  return (
    <div className='container mt-4'>
      {children}
    </div>
  );
}
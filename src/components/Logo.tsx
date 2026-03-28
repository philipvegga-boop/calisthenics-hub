import React from 'react';

export const Logo = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img 
        src="/logo-cancha.png" 
        alt="Logo" 
        style={{ width: '40px', height: '40px', borderRadius: '50%' }} 
      />
      <span style={{ fontSize: '20px', fontWeight: 'bold', color: 'white' }}>
        PODER ESTOICO
      </span>
    </div>
  );
};

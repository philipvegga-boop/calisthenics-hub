import React from 'react';

export const Logo = () => {
  return (
    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
      <img 
        src="/logo.png" 
        alt="Logo Poder Estoico" 
        style={{ width: '40px', height: '40px', borderRadius: '50%', objectFit: 'cover' }} 
      />
      <span style={{ fontSize: '18px', fontWeight: 'bold', color: 'white' }}>
        PODER ESTOICO
      </span>
    </div>
  );
};

import React from 'react';

const Navbar: React.FC = () => {
  const navItems = [
    'Browse', 'Syllabus', 'Model Papers', 'PYQs', 'Labs', 'Upload', 'Calculators', 'Resources'
  ];

  return (
    <nav className="glass sticky-top" style={{
      position: 'sticky',
      top: 0,
      zIndex: 1000,
      padding: '1rem 2rem',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      borderBottom: '1px solid rgba(255, 215, 0, 0.1)'
    }}>
      <div className="logo" style={{
        display: 'flex',
        alignItems: 'center',
        gap: '0.5rem'
      }}>
        <img src="/edtech.png" alt="Techmiya" style={{ height: '32px', borderRadius: '4px' }} />
        <span style={{ 
          fontSize: '1.2rem', 
          fontWeight: 800, 
          color: 'var(--primary)', 
          letterSpacing: '-0.5px' 
        }}>VTU</span>
      </div>
      
      <ul style={{
        display: 'flex',
        listStyle: 'none',
        gap: '1.5rem',
        alignItems: 'center'
      }}>
        {navItems.map((item) => (
          <li key={item}>
            <a href={`#${item.toLowerCase().replace(' ', '-')}`} style={{
              textDecoration: 'none',
              color: 'var(--text-muted)',
              fontSize: '0.9rem',
              fontWeight: 500,
              transition: 'all 0.3s ease',
              position: 'relative'
            }}
            onMouseOver={(e) => {
              e.currentTarget.style.color = 'var(--primary)';
            }}
            onMouseOut={(e) => {
              e.currentTarget.style.color = 'var(--text-muted)';
            }}
            >
              {item}
            </a>
          </li>
        ))}
      </ul>

      <button className="yellow-glow" style={{
        background: 'var(--primary)',
        color: '#000',
        border: 'none',
        padding: '0.6rem 1.2rem',
        borderRadius: '8px',
        fontWeight: 600,
        cursor: 'pointer',
        transition: 'all 0.3s ease'
      }}>
        Login
      </button>
    </nav>
  );
};

export default Navbar;

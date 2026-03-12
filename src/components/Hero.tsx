import React from 'react';

const Hero: React.FC = () => {
  return (
    <div style={{
      padding: '6rem 2rem',
      textAlign: 'center',
      background: 'radial-gradient(circle at center, rgba(255, 215, 0, 0.05) 0%, transparent 70%)',
      minHeight: '60vh',
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      alignItems: 'center'
    }}>
      <div className="animate-fade-in" style={{ maxWidth: '800px' }}>
        <h1 style={{
          fontSize: '4.5rem',
          marginBottom: '1rem',
          lineHeight: 1.1,
          letterSpacing: '-1.5px'
        }}>
          Techmiya <span style={{ color: 'var(--primary)' }}>Ed-Tech</span>
        </h1>
        <p style={{
          fontSize: '1.25rem',
          color: 'var(--text-muted)',
          marginBottom: '2.5rem',
          maxWidth: '600px',
          marginInline: 'auto'
        }}>
          The ultimate resource hub for VTU Engineering students. Stay updated with notifications, model papers, and comprehensive study materials.
        </p>
        <div style={{ display: 'flex', gap: '1rem', justifyContent: 'center' }}>
          <button style={{
            background: 'var(--primary)',
            color: '#000',
            border: 'none',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontWeight: 700,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            Explore Resources
          </button>
          <button style={{
            background: 'transparent',
            color: '#fff',
            border: '1px solid rgba(255,255,255,0.1)',
            padding: '1rem 2rem',
            borderRadius: '12px',
            fontWeight: 600,
            fontSize: '1rem',
            cursor: 'pointer',
            transition: 'all 0.3s ease'
          }}>
            View Notifications
          </button>
        </div>
      </div>
    </div>
  );
};

export default Hero;

import React from 'react';

interface NotificationProps {
  title: string;
  date: string;
  category: string;
  description: string;
}

const NotificationCard: React.FC<NotificationProps> = ({ title, date, category, description }) => (
  <div className="glass-yellow" style={{
    padding: '2rem',
    borderRadius: '24px',
    transition: 'all 0.3s ease',
    cursor: 'pointer',
    position: 'relative',
    overflow: 'hidden'
  }}
  onMouseOver={(e) => {
    e.currentTarget.style.transform = 'translateY(-5px)';
    e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.3)';
  }}
  onMouseOut={(e) => {
    e.currentTarget.style.transform = 'translateY(0)';
    e.currentTarget.style.borderColor = 'rgba(255, 215, 0, 0.1)';
  }}
  >
    <div style={{
      fontSize: '0.75rem',
      textTransform: 'uppercase',
      color: 'var(--primary)',
      fontWeight: 700,
      marginBottom: '0.5rem',
      letterSpacing: '1px'
    }}>{category}</div>
    <h3 style={{ fontSize: '1.25rem', marginBottom: '1rem' }}>{title}</h3>
    <p style={{ color: 'var(--text-muted)', fontSize: '0.9rem', marginBottom: '1.5rem' }}>{description}</p>
    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
      <span style={{ fontSize: '0.8rem', color: '#555' }}>{date}</span>
      <span style={{ color: 'var(--primary)', fontWeight: 600 }}>Read More →</span>
    </div>
  </div>
);

const Notifications: React.FC = () => {
  const notifications = [
    {
      title: 'Jan/Feb 2024 Exam Results Declared',
      date: 'March 15, 2024',
      category: 'Results',
      description: 'VTU has announced results for 1st-8th Semester BE/B.Tech exams. Check your USN now.'
    },
    {
      title: 'Model Question Papers for 2022 Scheme',
      date: 'March 12, 2024',
      category: 'Exam Update',
      description: 'New set of model question papers for 3rd and 4th semester engineering students released.'
    },
    {
      title: 'Revised Academic Calendar for Even Semesters',
      date: 'March 10, 2024',
      category: 'Academic',
      description: 'The academic calendar for even semesters (2, 4, 6, 8) has been updated with new dates.'
    }
  ];

  return (
    <section style={{ padding: '4rem 2rem', background: '#080808' }}>
      <div style={{ maxWidth: '1200px', margin: '0 auto' }}>
        <h2 style={{ fontSize: '2.5rem', marginBottom: '3rem', textAlign: 'center' }}>
          Latest <span style={{ color: 'var(--primary)' }}>VTU Updates</span>
        </h2>
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))',
          gap: '2rem'
        }}>
          {notifications.map((notif, index) => (
            <NotificationCard key={index} {...notif} />
          ))}
        </div>
      </div>
    </section>
  );
};

export default Notifications;

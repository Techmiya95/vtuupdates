import Navbar from './components/Navbar';
import Hero from './components/Hero';
import Notifications from './components/Notifications';

function App() {
  return (
    <div className="app">
      <Navbar />
      <main>
        <Hero />
        <Notifications />
      </main>
      <footer style={{
        padding: '3rem 2rem',
        textAlign: 'center',
        borderTop: '1px solid rgba(255, 215, 0, 0.1)',
        color: 'var(--text-muted)',
        fontSize: '0.9rem'
      }}>
        <p>&copy; {new Date().getFullYear()} Techmiya Ed-Tech. All rights reserved.</p>
      </footer>
    </div>
  );
}

export default App;

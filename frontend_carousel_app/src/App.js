import React, { useState, useEffect } from 'react';
import './App.css';
import Carousel from './components/Carousel/Carousel';

// PUBLIC_INTERFACE
function App() {
  const [theme, setTheme] = useState('light');

  // Effect to apply theme to document element
  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme);
  }, [theme]);

  // PUBLIC_INTERFACE
  const toggleTheme = () => {
    setTheme(prevTheme => prevTheme === 'light' ? 'dark' : 'light');
  };

  // Sample images (external placeholders)
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1512496015851-a90fb38ba796?q=80&w=1600&auto=format&fit=crop',
      alt: 'Elegant wristwatch on a stand'
    },
    {
      src: 'https://images.unsplash.com/photo-1516728778615-2d590ea1856f?q=80&w=1600&auto=format&fit=crop',
      alt: 'Modern headphones on a table'
    },
    {
      src: 'https://images.unsplash.com/photo-1549298916-b41d501d3772?q=80&w=1600&auto=format&fit=crop',
      alt: 'Minimalist sneaker product shot'
    },
    {
      src: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop',
      alt: 'Stylish camera on desk'
    }
  ];

  return (
    <div className="App">
      <header className="App-header" style={{ paddingTop: 80, paddingBottom: 60 }}>
        <button 
          className="theme-toggle" 
          onClick={toggleTheme}
          aria-label={`Switch to ${theme === 'light' ? 'dark' : 'light'} mode`}
        >
          {theme === 'light' ? '🌙 Dark' : '☀️ Light'}
        </button>

        <div className="hero" style={{ width: '100%', display: 'grid', placeItems: 'center', gap: 24 }}>
          <h1 style={{ margin: 0, fontSize: 'clamp(22px, 2vw, 28px)' }}>
            Explore the Product Gallery
          </h1>
          <p style={{ margin: 0, opacity: 0.85, fontSize: 'clamp(14px, 2vw, 16px)' }}>
            Centered carousel covering the top portion of the product page with navigation dots at the bottom.
          </p>
          <div style={{ width: 'min(100%, 1150px)' }}>
            <Carousel
              images={images}
              autoPlay={true}
              interval={4000}
              showDots={true}
              initialIndex={0}
              ariaLabel="Product image carousel"
              loop={true}
            />
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;

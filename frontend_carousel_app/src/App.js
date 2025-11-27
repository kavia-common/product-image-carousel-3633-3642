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

  // Product-focused images (phone, laptop, headphones, smartwatch, camera)
  // Using Unsplash CDN with parameters for consistent sizing/perf.
  const images = [
    {
      src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?q=80&w=1600&auto=format&fit=crop',
      alt: 'Modern smartphone angled on a dark background'
    },
    {
      src: 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?q=80&w=1600&auto=format&fit=crop',
      alt: 'Professional DSLR camera on a desk'
    },
    {
      src: 'https://images.unsplash.com/photo-1517331156700-3c241d2b4d83?q=80&w=1600&auto=format&fit=crop',
      alt: 'Sleek laptop open on a workspace'
    },
    {
      src: 'https://images.unsplash.com/photo-1518443744133-6d5b0b2c9140?q=80&w=1600&auto=format&fit=crop',
      alt: 'Over-ear wireless headphones in close-up'
    },
    {
      src: 'https://images.unsplash.com/photo-1516574187841-cb9cc2ca948b?q=80&w=1600&auto=format&fit=crop',
      alt: 'Smartwatch with health metrics on screen'
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
          <div style={{ width: 'min(100%, 1200px)' }}>
            <Carousel
              images={images}
              autoPlay={true}
              interval={4500}
              showDots={true}
              initialIndex={0}
              ariaLabel="Product image carousel"
              loop={true}
              /* Example: override maximum height if needed
                 maxHeightVh={58} */
            />
          </div>
        </div>
      </header>
    </div>
  );
}

export default App;

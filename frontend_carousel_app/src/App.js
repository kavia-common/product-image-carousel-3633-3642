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
  // Switched to local assets under CRA public/images for stable offline-friendly delivery.
  // In CRA, assets placed in public are available at "/images/..." at runtime.
  const images = [
    {
      src: '/images/phone.jpg',
      alt: 'Modern smartphone angled on a dark background'
    },
    {
      src: '/images/camera.jpg',
      alt: 'Professional DSLR camera on a desk'
    },
    {
      src: '/images/laptop.jpg',
      alt: 'Sleek laptop open on a workspace'
    },
    {
      src: '/images/headphones.jpg',
      alt: 'Over-ear wireless headphones in close-up'
    },
    {
      src: '/images/smartwatch.jpg',
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

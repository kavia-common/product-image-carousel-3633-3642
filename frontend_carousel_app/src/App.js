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

  // Product-focused images with reliable primary URLs and local public fallbacks.
  // Note: In CRA, public assets must be referenced with absolute paths like "/images/asset.jpg".
  // We keep alt text present so it renders while the images load.
  const images = [
    {
      // Smartphone
      src: 'https://images.unsplash.com/photo-1511707171634-5f897ff02aa9?auto=format&fit=crop&w=1600&q=80',
      fallback: '/images/phone.jpg',
      alt: 'Modern smartphone angled on a dark background'
    },
    {
      // Camera
      src: 'https://images.unsplash.com/photo-1519183071298-a2962be96f83?auto=format&fit=crop&w=1600&q=80',
      fallback: '/images/camera.jpg',
      alt: 'Professional DSLR camera on a desk'
    },
    {
      // Laptop
      src: 'https://images.unsplash.com/photo-1518779578993-ec3579fee39f?auto=format&fit=crop&w=1600&q=80',
      fallback: '/images/laptop.jpg',
      alt: 'Sleek laptop open on a workspace'
    },
    {
      // Headphones
      src: 'https://images.unsplash.com/photo-1518443078884-bc1df95c9fe6?auto=format&fit=crop&w=1600&q=80',
      fallback: '/images/headphones.jpg',
      alt: 'Over-ear wireless headphones in close-up'
    },
    {
      // Smartwatch
      src: 'https://images.unsplash.com/photo-1517433670267-08bbd4be890f?auto=format&fit=crop&w=1600&q=80',
      fallback: '/images/smartwatch.jpg',
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

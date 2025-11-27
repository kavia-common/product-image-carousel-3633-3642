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

  // Text-based slides for the carousel
  const slides = [
    {
      subtitle: 'Featured Collection',
      title: 'Modern Essentials for Everyday Productivity',
      description: 'Streamlined tools designed with precision. Explore laptops, headsets, and accessories that elevate your daily workflow.',
      ctaLabel: 'Shop Essentials',
      ctaHref: '#essentials'
    },
    {
      subtitle: 'Work Anywhere',
      title: 'Lightweight. Powerful. Truly Portable.',
      description: 'From coffee shop sprints to cross-country trips—performance that follows you. Discover our ultraportable lineup.',
      ctaLabel: 'View Ultraportables',
      ctaHref: '#ultraportables'
    },
    {
      subtitle: 'Creator’s Corner',
      title: 'Cameras & Audio for High-Fidelity Content',
      description: 'Capture detail and deliver immersive sound. Gear made for storytellers, streamers, and creators.',
      ctaLabel: 'Browse Creator Gear',
      ctaHref: '#creator'
    },
    // Simple string slide is also supported
    'Exclusive offers this week: member pricing and fast shipping on select items.'
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
              slides={slides}
              autoPlay={true}
              interval={5500}
              showDots={true}
              initialIndex={0}
              ariaLabel="Promotional content carousel"
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

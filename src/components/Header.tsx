import React, { useState, useEffect } from "react";

export function Header() {
  const [opacity, setOpacity] = useState(1);
  
  useEffect(() => {
    const handleScroll = () => {
      const bakeryMenu = document.getElementById('bakery-menu');
      
      if (bakeryMenu) {
        // Distancia desde la parte superior de la sección hasta la parte superior de la ventana
        const distance = bakeryMenu.getBoundingClientRect().top;
        
        // Definir una zona de transición (200px antes de llegar a la sección)
        const transitionZone = 200;
        
        if (distance < transitionZone && distance > -bakeryMenu.offsetHeight) {
          // Calculamos la opacidad basada en la posición
          const newOpacity = Math.max(0, distance / transitionZone);
          setOpacity(newOpacity);
        } else if (distance >= transitionZone) {
          setOpacity(1);
        }
      }
    };
    
    window.addEventListener('scroll', handleScroll);
    
    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);
  
  // Convertir la opacidad a un valor de estilo
  const headerStyle = {
    opacity: opacity,
  };
  
  return (
    <header 
      className={`fixed top-0 left-0 right-0 z-50 bg-crave-pastel backdrop-blur-md transition-opacity duration-300 ease-in-out ${
        opacity === 0 ? 'pointer-events-none' : ''
      }`}
      style={headerStyle}
    >
      <nav className="flex justify-between items-center gap-x-10 px-20 py-10">
        <div>
          <p className="text-xs">2024 CRAVE / COFFE SHOP & BAKERY</p>
        </div>
        <ul className="flex gap-x-4 items-center justify-center">
          <li>
            <a href="/">Home</a>
          </li>
          <li>
            <a href="#bakery-menu">Menu</a>
          </li>
          <li>
            <a href="#">Contact</a>
          </li>
        </ul>
        <div className="hidden md:block">
          <p className="text-xs max-w-50">
            VISUAL BRAND DESIGN / ART DIRECTION: LEANDRA RANGEL
          </p>
        </div>
      </nav>
    </header>
  );
}
import React, { useState, useEffect } from "react";

export function Header() {
  const [opacity, setOpacity] = useState(1);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  
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
  
  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
  };
  
  // Cerrar menú móvil al hacer clic en un enlace
  const handleLinkClick = () => {
    setIsMobileMenuOpen(false);
  };
  
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
      <nav className="flex justify-between items-center gap-x-2 sm:gap-x-4 md:gap-x-10 px-4 sm:px-8 md:px-12 lg:px-20 py-4 sm:py-6 md:py-8 lg:py-10">
        <div className="text-center sm:text-left">
          <p className="text-xs sm:text-sm">2024 CRAVE / COFFE SHOP & BAKERY</p>
        </div>
        
        {/* Botón de menú para móvil */}
        <button 
          className="md:hidden flex flex-col justify-center items-center w-8 h-8"
          onClick={toggleMobileMenu}
          aria-label="Toggle menu"
        >
          <span className={`block w-6 h-0.5 bg-crave-night mb-1.5 transition-transform ${isMobileMenuOpen ? 'transform rotate-45 translate-y-2' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-crave-night mb-1.5 transition-opacity ${isMobileMenuOpen ? 'opacity-0' : ''}`}></span>
          <span className={`block w-6 h-0.5 bg-crave-night transition-transform ${isMobileMenuOpen ? 'transform -rotate-45 -translate-y-2' : ''}`}></span>
        </button>
        
        {/* Menú para pantallas medianas y grandes */}
        <ul className="hidden md:flex gap-x-4 items-center justify-center">
          <li>
            <a href="/" className="hover:text-crave-rosa transition-colors">Home</a>
          </li>
          <li>
            <a href="#bakery-menu" className="hover:text-crave-rosa transition-colors">Menu</a>
          </li>
          <li>
            <a href="#" className="hover:text-crave-rosa transition-colors">Contact</a>
          </li>
        </ul>
        
        <div className="hidden md:block text-right">
          <p className="text-xs max-w-[200px] lg:max-w-none">
            VISUAL BRAND DESIGN / ART DIRECTION: LEANDRA RANGEL
          </p>
        </div>
      </nav>
      
      {/* Menú móvil desplegable */}
      <div className={`md:hidden transition-all duration-300 ease-in-out overflow-hidden ${
        isMobileMenuOpen ? 'min-h-screen opacity-100' : 'max-h-0 opacity-0'
      } bg-crave-pastel`}>
        <ul className="flex flex-col items-center py-2 px-4">
          <li className="w-full border-b border-crave-night/10 py-2">
            <a 
              href="/" 
              className="block text-center hover:text-crave-rosa transition-colors"
              onClick={handleLinkClick}
            >
              Home
            </a>
          </li>
          <li className="w-full border-b border-crave-night/10 py-2">
            <a 
              href="#bakery-menu" 
              className="block text-center hover:text-crave-rosa transition-colors"
              onClick={handleLinkClick}
            >
              Menu
            </a>
          </li>
          <li className="w-full py-2">
            <a 
              href="#" 
              className="block text-center hover:text-crave-rosa transition-colors"
              onClick={handleLinkClick}
            >
              Contact
            </a>
          </li>
        </ul>
        <div className="text-center py-2 px-4 text-xs">
          VISUAL BRAND DESIGN / ART DIRECTION: LEANDRA RANGEL
        </div>
      </div>
    </header>
  );
}
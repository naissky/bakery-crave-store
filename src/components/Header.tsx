import React from "react";

export function Header() {
  return (
    <header className="fixed top-0 left-0 right-0 z-50 bg-crave-pastel backdrop-blur-md">
      <nav className="flex justify-between items-center gap-x-10 px-20 py-10">
        <div>
          <p className="text-xs">2024 CRAVE / COFFE SHOP & BAKERY</p>
        </div>
        <ul className="flex gap-x-4 items-center justify-center">
          <li>
            <a href="#">Home</a>
          </li>
          <li>
            <a href="#">About</a>
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

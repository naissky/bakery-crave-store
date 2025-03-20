import React, { useState, useEffect } from 'react';
import bakeryAPI, { type MenuCategory, type MenuItem, type SpecialOffer } from '../lib/api';

const BakeryMenuDisplay: React.FC = () => {
  const [categories, setCategories] = useState<MenuCategory[]>([]);
  const [specialOffers, setSpecialOffers] = useState<SpecialOffer[]>([]);
  const [bakeryInfo, setBakeryInfo] = useState<{bakeryName: string, description: string}>();
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [activeCategory, setActiveCategory] = useState<string | null>(null);
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [searchResults, setSearchResults] = useState<MenuItem[]>([]);
  const [isSearching, setIsSearching] = useState<boolean>(false);
  
  // Filtros dietéticos
  const [veganOnly, setVeganOnly] = useState<boolean>(false);
  const [glutenFreeOnly, setGlutenFreeOnly] = useState<boolean>(false);

  useEffect(() => {
    const fetchBakeryData = async () => {
      try {
        setLoading(true);
        
        // Obtener datos básicos de la panadería
        const info = await bakeryAPI.getBakeryInfo();
        setBakeryInfo({
          bakeryName: info.bakeryName,
          description: info.description
        });
        
        // Obtener categorías del menú
        const menuCategories = await bakeryAPI.getCategories();
        setCategories(menuCategories);
        
        if (menuCategories.length > 0) {
          setActiveCategory(menuCategories[0].id);
        }
        
        // Obtener ofertas especiales
        const offers = await bakeryAPI.getSpecialOffers();
        setSpecialOffers(offers);
        
        setLoading(false);
      } catch (err) {
        if (err instanceof Error) {
          setError(`Error al cargar los datos: ${err.message}`);
        } else {
          setError('Error desconocido al cargar los datos');
        }
        setLoading(false);
      }
    };

    fetchBakeryData();
  }, []);

  // Efecto para la búsqueda
  useEffect(() => {
    const handleSearch = async () => {
      if (searchQuery.trim().length > 0) {
        setIsSearching(true);
        try {
          const results = await bakeryAPI.searchItems(searchQuery);
          setSearchResults(results);
        } catch (err) {
          console.error("Error en la búsqueda:", err);
        }
      } else {
        setIsSearching(false);
        setSearchResults([]);
      }
    };

    const searchTimeout = setTimeout(handleSearch, 500);
    
    return () => {
      clearTimeout(searchTimeout);
    };
  }, [searchQuery]);

  // Efecto para los filtros dietéticos
  useEffect(() => {
    const applyFilters = async () => {
      if (veganOnly || glutenFreeOnly) {
        try {
          const filteredItems = await bakeryAPI.filterByDietaryPreferences(
            veganOnly, 
            glutenFreeOnly
          );
          
          setSearchResults(filteredItems);
          setIsSearching(true);
        } catch (err) {
          console.error("Error al aplicar filtros:", err);
        }
      } else if (!searchQuery) {
        setIsSearching(false);
      }
    };
    
    applyFilters();
  }, [veganOnly, glutenFreeOnly]);

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-lg font-medium text-gray-700">Cargando menú de la panadería...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="p-4 bg-red-100 border border-red-400 text-red-700 rounded">
        {error}
      </div>
    );
  }

  const renderMenuItem = (item: MenuItem) => (
    <div 
      key={item.id} 
      className="rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300"
    >
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <img 
          src={item.imageUrl} 
          alt={item.name} 
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <div className="flex justify-between">
          <h2 className="text-xl font-semibold">{item.name}</h2>
          <div className="flex gap-2">
            {item.isVegan && (
              <span className="bg-green-100 text-green-800 text-xs px-2 py-1 rounded">Vegano</span>
            )}
            {item.isGlutenFree && (
              <span className="bg-blue-100 text-blue-800 text-xs px-2 py-1 rounded">Sin Gluten</span>
            )}
          </div>
        </div>
        
        <p className="text-gray-600 my-2">{item.description}</p>
        
        <div className="text-sm text-gray-500 mt-2">
          <p>Alérgenos: {item.allergens.join(', ') || 'Ninguno'}</p>
          <p>Disponible: {item.availableDays.join(', ')}</p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-green-600">${item.price.toFixed(2)}</span>
          <button className="bg-crave-rosa/40 hover:bg-crave-rosa text-crave-night px-4 py-2 rounded">
            Ver detalles
          </button>
        </div>
      </div>
    </div>
  );

  const renderSpecialOffer = (offer: SpecialOffer) => (
    <div 
      key={offer.id} 
      className="rounded-lg overflow-hidden shadow-sm hover:shadow-lg transition-shadow duration-300 bg-crave-pastel"
    >
      <div className="h-48 bg-gray-200 flex items-center justify-center">
        <img 
          src="/api/placeholder/400/320" 
          alt={offer.name} 
          className="h-full w-full object-cover"
        />
      </div>
      
      <div className="p-4">
        <h2 className="text-xl font-semibold text-crave-night">{offer.name}</h2>
        <p className="text-gray-600 my-2">{offer.description}</p>
        <div className="text-sm text-gray-500 mt-2">
          <p>Incluye: {offer.contents.join(', ')}</p>
          <p>Disponible: {offer.availableDays.join(', ')}</p>
        </div>
        
        <div className="flex justify-between items-center mt-4">
          <span className="text-lg font-bold text-green-600">${offer.price.toFixed(2)}</span>
          <button className="bg-crave-rosa hover:bg-crave-rosa/80 text-crave-night px-4 py-2 rounded">
            Ver oferta
          </button>
        </div>
      </div>
    </div>
  );

  return (
    <div className="container mx-auto p-4">
      {bakeryInfo && (
        <div className="mb-8 text-center">
          <h1 className="text-3xl font-bold mb-2">{bakeryInfo.bakeryName}</h1>
          <p className="text-gray-600">{bakeryInfo.description}</p>
        </div>
      )}
      
      <div className="mb-6">
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-4">
          <div className="relative w-full md:w-1/2">
            <input
              type="text"
              placeholder="Buscar productos..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full p-2 border rounded-md pl-10"
            />
            <span className="absolute left-3 top-2.5 text-gray-400">🔍</span>
          </div>
          
          <div className="flex items-center gap-4">
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={veganOnly}
                onChange={() => setVeganOnly(!veganOnly)}
              />
              Vegano
            </label>
            <label className="flex items-center gap-2">
              <input
                type="checkbox"
                checked={glutenFreeOnly}
                onChange={() => setGlutenFreeOnly(!glutenFreeOnly)}
              />
              Sin Gluten
            </label>
          </div>
        </div>
      </div>
      
      {isSearching ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">Resultados de búsqueda</h2>
          {searchResults.length > 0 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {searchResults.map(item => renderMenuItem(item))}
            </div>
          ) : (
            <div className="text-center py-8 text-gray-500">
              No se encontraron productos que coincidan con tu búsqueda.
            </div>
          )}
        </div>
      ) : (
        <>
          {specialOffers.length > 0 && (
            <div className="mb-8">
              <h2 className="text-2xl font-semibold mb-4">Ofertas Especiales</h2>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {specialOffers.map(offer => renderSpecialOffer(offer))}
              </div>
            </div>
          )}
          
          <div className="mb-6">
            <h2 className="text-2xl font-semibold mb-4">Nuestro Menú</h2>
            <div className="flex overflow-x-auto space-x-2 pb-2 mb-4">
              {categories.map(category => (
                <button
                  key={category.id}
                  onClick={() => setActiveCategory(category.id)}
                  className={`transition duration-200 ease-in-out px-4 py-2 rounded-full whitespace-nowrap ${
                    activeCategory === category.id
                      ? 'bg-crave-rosa text-crave-night'
                      : 'bg-crave-pastel hover:bg-crave-rosa/30'
                  }`}
                >
                  {category.name}
                </button>
              ))}
            </div>
            
            {activeCategory && (
              <div>
                {categories
                  .filter(cat => cat.id === activeCategory)
                  .map(category => (
                    <div key={category.id}>
                      <h3 className="text-xl font-medium mb-2">{category.name}</h3>
                      <p className="text-gray-600 mb-4">{category.description}</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                        {category.items.length > 0 ? (
                          category.items.map(item => renderMenuItem(item))
                        ) : (
                          <div className="col-span-full text-center py-4 text-gray-500">
                            No hay productos disponibles en esta categoría.
                          </div>
                        )}
                      </div>
                    </div>
                  ))}
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
};

export default BakeryMenuDisplay;
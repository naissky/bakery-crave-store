// api.ts - Interfaz de API para usar el mockup de panadería

// Definición de tipos para la estructura de datos
export interface NutritionalInfo {
    calories: number;
    protein: number;
    carbs: number;
    fat: number;
  }
  
  export interface MenuItem {
    id: string;
    name: string;
    description: string;
    price: number;
    allergens: string[];
    isVegan: boolean;
    isGlutenFree: boolean;
    nutritionalInfo: NutritionalInfo;
    imageUrl: string;
    availableDays: string[];
  }
  
  export interface MenuCategory {
    id: string;
    name: string;
    description: string;
    items: MenuItem[];
  }
  
  export interface SpecialOffer {
    id: string;
    name: string;
    description: string;
    price: number;
    contents: string[];
    imageUrl: string;
    availableDays: string[];
  }
  
  export interface StoreLocation {
    address: string;
    city: string;
    state: string;
    zip: string;
    phone: string;
    coordinates: {
      latitude: number;
      longitude: number;
    };
  }
  
  export interface BakeryMenu {
    bakeryName: string;
    description: string;
    categories: MenuCategory[];
    specialOffers: SpecialOffer[];
    storeHours: Record<string, string>;
    location: StoreLocation;
  }
  
  export interface BakeryData {
    menu: BakeryMenu;
  }
  
  // Importar el mockup de datos (si estamos en un entorno Node.js)
  // En un entorno de navegador, podrías cargar esto con fetch
  import mockupData from '../api/mockup.json';
  const bakeryData: BakeryData = mockupData as unknown as BakeryData;
  
  // Clase principal de la API
  export class BakeryAPI {
    private data: BakeryData;
    private delayMs: number;
  
    /**
     * Constructor de la API de panadería
     * @param mockData Datos de mockup a utilizar (opcional)
     * @param simulatedDelayMs Retraso simulado para imitar una API real (por defecto 300ms)
     */
    constructor(mockData: BakeryData = bakeryData, simulatedDelayMs: number = 300) {
      this.data = mockData;
      this.delayMs = simulatedDelayMs;
    }
  
    /**
     * Método auxiliar para simular el retraso de una API real
     */
    private async simulateDelay(): Promise<void> {
      return new Promise(resolve => setTimeout(resolve, this.delayMs));
    }
  
    /**
     * Obtiene el menú completo de la panadería
     */
    async getFullMenu(): Promise<BakeryMenu> {
      await this.simulateDelay();
      return { ...this.data.menu };
    }
  
    /**
     * Obtiene información básica de la panadería
     */
    async getBakeryInfo(): Promise<{
      bakeryName: string;
      description: string;
      storeHours: Record<string, string>;
      location: StoreLocation;
    }> {
      await this.simulateDelay();
      const { bakeryName, description, storeHours, location } = this.data.menu;
      return { bakeryName, description, storeHours, location };
    }
  
    /**
     * Obtiene todas las categorías del menú
     */
    async getCategories(): Promise<MenuCategory[]> {
      await this.simulateDelay();
      return [...this.data.menu.categories];
    }
  
    /**
     * Obtiene una categoría específica por ID
     * @param categoryId ID de la categoría
     */
    async getCategoryById(categoryId: string): Promise<MenuCategory | null> {
      await this.simulateDelay();
      const category = this.data.menu.categories.find(cat => cat.id === categoryId);
      return category ? { ...category } : null;
    }
  
    /**
     * Obtiene un producto específico por ID
     * @param itemId ID del producto
     */
    async getItemById(itemId: string): Promise<MenuItem | null> {
      await this.simulateDelay();
      for (const category of this.data.menu.categories) {
        const item = category.items.find(item => item.id === itemId);
        if (item) {
          return { ...item };
        }
      }
      return null;
    }
  
    /**
     * Obtiene todas las ofertas especiales
     */
    async getSpecialOffers(): Promise<SpecialOffer[]> {
      await this.simulateDelay();
      return [...this.data.menu.specialOffers];
    }
  
    /**
     * Busca productos por nombre o descripción
     * @param query Texto de búsqueda
     */
    async searchItems(query: string): Promise<MenuItem[]> {
      await this.simulateDelay();
      const searchResults: MenuItem[] = [];
      const lowerQuery = query.toLowerCase();
  
      for (const category of this.data.menu.categories) {
        for (const item of category.items) {
          if (
            item.name.toLowerCase().includes(lowerQuery) ||
            item.description.toLowerCase().includes(lowerQuery)
          ) {
            searchResults.push({ ...item });
          }
        }
      }
  
      return searchResults;
    }
  
    /**
     * Filtra productos por criterios dietéticos
     * @param isVegan Si es verdadero, filtra productos veganos
     * @param isGlutenFree Si es verdadero, filtra productos sin gluten
     */
    async filterByDietaryPreferences(isVegan?: boolean, isGlutenFree?: boolean): Promise<MenuItem[]> {
      await this.simulateDelay();
      const filteredItems: MenuItem[] = [];
  
      for (const category of this.data.menu.categories) {
        for (const item of category.items) {
          let includeItem = true;
  
          if (isVegan !== undefined && item.isVegan !== isVegan) {
            includeItem = false;
          }
  
          if (isGlutenFree !== undefined && item.isGlutenFree !== isGlutenFree) {
            includeItem = false;
          }
  
          if (includeItem) {
            filteredItems.push({ ...item });
          }
        }
      }
  
      return filteredItems;
    }
  
    /**
     * Obtiene los productos disponibles en un día específico
     * @param day Día de la semana (Lunes, Martes, etc.)
     */
    async getItemsByAvailability(day: string): Promise<MenuItem[]> {
      await this.simulateDelay();
      const availableItems: MenuItem[] = [];
  
      for (const category of this.data.menu.categories) {
        for (const item of category.items) {
          if (item.availableDays.includes(day)) {
            availableItems.push({ ...item });
          }
        }
      }
  
      return availableItems;
    }
  
    /**
     * Obtiene los horarios de la tienda
     */
    async getStoreHours(): Promise<Record<string, string>> {
      await this.simulateDelay();
      return { ...this.data.menu.storeHours };
    }
  }
  
  // Ejemplos de uso
  async function ejemplosDeUso() {
    // Crear una instancia de la API
    const bakeryAPI = new BakeryAPI();
  
    // Ejemplo 1: Obtener todo el menú
    const fullMenu = await bakeryAPI.getFullMenu();
    console.log('Menú completo:', fullMenu.bakeryName);
  
    // Ejemplo 2: Buscar productos con "chocolate"
    const chocolateItems = await bakeryAPI.searchItems('chocolate');
    console.log('Productos con chocolate:', chocolateItems.map(item => item.name));
  
    // Ejemplo 3: Obtener productos veganos
    const veganItems = await bakeryAPI.filterByDietaryPreferences(true);
    console.log('Productos veganos:', veganItems.map(item => item.name));
  
    // Ejemplo 4: Obtener productos disponibles los domingos
    const sundayItems = await bakeryAPI.getItemsByAvailability('Domingo');
    console.log('Disponibles los domingos:', sundayItems.length);
  }
  
  // Exportar una instancia por defecto para facilitar el uso
  export default new BakeryAPI();
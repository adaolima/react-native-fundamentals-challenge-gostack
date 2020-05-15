import React, {
  createContext,
  useState,
  useCallback,
  useContext,
  useEffect,
} from 'react';

import AsyncStorage from '@react-native-community/async-storage';

interface Product {
  id: string;
  title: string;
  image_url: string;
  price: number;
  quantity: number;
}

interface CartContext {
  products: Product[];
  addToCart(item: Product): void;
  increment(id: string): void;
  decrement(id: string): void;
}

const CartContext = createContext<CartContext | null>(null);

const CartProvider: React.FC = ({ children }) => {
  const [products, setProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function loadProducts(): Promise<void> {
      const items = await AsyncStorage.getItem('@GoMarketplace:items');
      if (items) {
        setProducts(JSON.parse(items));
      }
    }
    loadProducts();
  }, []);

  useEffect(() => {
    async function productsUpdate(): Promise<void> {
      await AsyncStorage.setItem(
        '@GoMarketplace:items',
        JSON.stringify(products),
      );
    }
    productsUpdate();
  }, [products]);

  const addToCart = useCallback(
    async product => {
      const productExist = products.find(
        findedProduct => findedProduct.id === product.id,
      );

      if (productExist) {
        const productsUpdated = products.map(findedProduct => {
          if (product.id === findedProduct.id) {
            return { ...findedProduct, quantity: findedProduct.quantity + 1 };
          }
          return findedProduct;
        });
        setProducts(productsUpdated);
      } else {
        const newProduct = product;
        newProduct.quantity += 1;
        setProducts([...products, newProduct]);
      }
    },
    [products],
  );

  const increment = useCallback(
    async id => {
      const productsUpdated = products.map(product => {
        if (product.id === id) {
          return { ...product, quantity: product.quantity + 1 };
        }
        return product;
      });
      setProducts(productsUpdated);
    },
    [products],
  );

  const decrement = useCallback(
    async id => {
      const productFinded = products.find(product => product.id === id);
      if (productFinded?.quantity === 1) {
        const productsUpdated = products.filter(product => product.id !== id);
        setProducts(productsUpdated);
      } else {
        const productsUpdated = products.map(product => {
          if (product.id === id) {
            return { ...product, quantity: product.quantity - 1 };
          }
          return product;
        });
        setProducts(productsUpdated);
      }
    },
    [products],
  );

  const value = React.useMemo(
    () => ({ addToCart, increment, decrement, products }),
    [products, addToCart, increment, decrement],
  );

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>;
};

function useCart(): CartContext {
  const context = useContext(CartContext);

  if (!context) {
    throw new Error(`useCart must be used within a CartProvider`);
  }

  return context;
}

export { CartProvider, useCart };

import { useContext, createContext, useState } from 'react';

const LocalStateContext = createContext();
const LocalStateProvider = LocalStateContext.Provider;

function CartStateProvider({ children }) {
  // This is our own custom provider we will store data ( state ) abd functionality (updates) in here and anyone can access it via the consumer

  // Closed Cart by default
  const [cartOpen, setCartOpen] = useState(false);

  function toggleCart() {
    setCartOpen(!cartOpen);
  }

  function closeCart() {
    setCartOpen(false);
  }

  function openCart() {
    setCartOpen(true);
  }

  return (
    <LocalStateProvider
      value={{ cartOpen, setCartOpen, toggleCart, closeCart, openCart }}
    >
      {children}
    </LocalStateProvider>
  );
}

// Make a custom hook for accessing the cart state

function useCart() {
  // we use a consumer here to access the local state

  const all = useContext(LocalStateContext);
  return all;
}

export { CartStateProvider, useCart };

import { useState, useEffect } from 'react'
import type { CartItem, Guitar } from '../types/type'
import { db } from '../data/db'

export function useCart() {
    // obtiene el carrito q es de tipo CartItem[]
    const initialCart = (): CartItem[] => {
    const cartFromStorage = localStorage.getItem('cart');
    return cartFromStorage ? JSON.parse(cartFromStorage) : [];
  }


  const [data, setData] = useState(db)
  const [cart, setCart] = useState(initialCart());
  const MAX_QUANTITY = 5;
  const MIN_QUANTITY = 1;

  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart));
  },[cart])


  function addToCart(item: Guitar) {
    const itemExists = cart.findIndex((cartItem) => cartItem.id === item.id);
    if (itemExists >= 0) {
      if (cart[itemExists].quantity >= MAX_QUANTITY) {return}
      // Si el item ya existe en el carrito, actualiza la cantidad
      // debo hacer esto porque el estado no lo puedo modificar en si mismo
      // debo crear una copia y modificarla ...cart realiza una copia
      const updatedCart = [...cart];
      updatedCart[itemExists].quantity += 1;
      setCart(updatedCart);
    }
    else {
      const newItem: CartItem = { ...item, quantity: 1 }; // Crear un nuevo objeto con quantity
      // Si el item no existe, agregarlo al carrito con cantidad 1
      // spread saca los elementos del cart y agregamos uno nuevo newItem
      setCart([...cart, newItem]);
    }}
  function removeFromCart(guitar_id: Guitar['id']) {
    // al pasar una funcion a un set internammente react pasa
    // el valor del estado como parametro de esa funcion
    // crea un array nuevo sin el item que quiero eliminar
    // se usa filter porq no modifica el array original sino q crea uno nuevo
    setCart(oldValue => oldValue.filter(item => item.id !== guitar_id));
  }
  function increaseQuantity(guitar_id: Guitar['id']) {
    const updatedCart = cart.map(item => {
      if (item.id === guitar_id && item.quantity < MAX_QUANTITY) {
        return { ...item,
                quantity: item.quantity + 1
              };
      }
      return item;
    });
    setCart(updatedCart);
  }
  function decreaseQuantity(guitar_id: Guitar['id']) {
    const updatedCart = cart.map(item => {
      if (item.id === guitar_id && item.quantity > MIN_QUANTITY) {
        return { ...item,
                quantity: item.quantity - 1
              };
      }
      return item;
    });
    setCart(updatedCart);
  }
  function clearCart() {
    setCart([]);
  }
  const cartTotal = () => cart.reduce((total, item) => total + (item.quantity * item.price), 0)
    return {data, cart, addToCart,
            removeFromCart, increaseQuantity,
            decreaseQuantity, clearCart,cartTotal
        };
}
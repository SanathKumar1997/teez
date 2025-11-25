import React, { createContext, useContext, useState, useEffect } from 'react';

const CartContext = createContext();

export const useCart = () => useContext(CartContext);

export const CartProvider = ({ children }) => {
    const [cart, setCart] = useState(() => {
        const savedCart = localStorage.getItem('teez_cart');
        return savedCart ? JSON.parse(savedCart) : [];
    });

    useEffect(() => {
        localStorage.setItem('teez_cart', JSON.stringify(cart));
    }, [cart]);

    const addToCart = (product, quantity, size, color) => {
        setCart(prevCart => {
            const existingItemIndex = prevCart.findIndex(
                item => item.id == product.id && item.size === size && item.color === color
            );

            if (existingItemIndex > -1) {
                const newCart = [...prevCart];
                newCart[existingItemIndex] = {
                    ...newCart[existingItemIndex],
                    quantity: newCart[existingItemIndex].quantity + quantity
                };
                return newCart;
            } else {
                return [...prevCart, { ...product, quantity, size, color }];
            }
        });
    };

    const removeFromCart = (id, size, color) => {
        setCart(prevCart => prevCart.filter(
            item => !(item.id === id && item.size === size && item.color === color)
        ));
    };

    const updateQuantity = (id, size, color, delta) => {
        setCart(prevCart => prevCart.map(item => {
            if (item.id === id && item.size === size && item.color === color) {
                const newQuantity = Math.max(1, item.quantity + delta);
                return { ...item, quantity: newQuantity };
            }
            return item;
        }));
    };

    const clearCart = () => setCart([]);

    const cartTotal = cart.reduce((total, item) => total + (item.price * item.quantity), 0);
    const cartCount = cart.reduce((count, item) => count + item.quantity, 0);

    return (
        <CartContext.Provider value={{ cart, addToCart, removeFromCart, updateQuantity, clearCart, cartTotal, cartCount }}>
            {children}
        </CartContext.Provider>
    );
};

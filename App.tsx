import React, { JSX, useState, useEffect } from "react";
import { Product, CartItem } from "./product";
import { MenuList } from "./MenuList";
import { Cart } from "./Cart";

export function App(): JSX.Element {
    const [products, setProducts] = useState<Product[]>([]);
    const [cart, setCart] = useState<CartItem[]>([]);

    useEffect(() => {
        fetch("/product.json")
            .then((res) => res.json())
            .then((data: Product[]) => setProducts(data))
            .catch((err) => console.error("Ошибка загрузки товаров:", err));
    }, []);

    const handleAddToCart = (product: Product) => {
        setCart((prevCart) => {
            const existingItem = prevCart.find((item) => item.id === product.id);
            if (existingItem) {
                return prevCart.map((item) =>
                    item.id === product.id
                        ? { ...item, quantity: item.quantity + 1 }
                        : item
                );
            }
            return [...prevCart, { ...product, quantity: 1 }];
        });
    };

    const handleUpdateQuantity = (id: number, delta: number) => {
        setCart((prevCart) =>
            prevCart
                .map((item) => {
                    if (item.id === id) {
                        const newQuantity = item.quantity + delta;
                        return newQuantity > 0 ? { ...item, quantity: newQuantity } : null;
                    }
                    return item;
                })
                .filter((item): item is CartItem => item !== null)
        );
    };

    const handleRemoveItem = (id: number) => {
        setCart((prevCart) => prevCart.filter((item) => item.id !== id));
    };

    const handleClearCart = () => {
        setCart([]);
    };

    return (
        <div className="container">
            <h1>McDonald's Menu</h1>
            <div className="main-content">
                <MenuList products={products} onAddToCart={handleAddToCart} />
                <Cart
                    items={cart}
                    onUpdateQuantity={handleUpdateQuantity}
                    onRemoveItem={handleRemoveItem}
                    onClearCart={handleClearCart}
                />
            </div>
        </div>
    );
}
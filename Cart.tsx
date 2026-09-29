import React, { JSX, useState } from "react";
import { CartItem } from "./product";
import { CheckoutForm } from "./CheckoutFom";

interface CartProps {
    items: CartItem[];
    onUpdateQuantity: (id: number, delta: number) => void;
    onRemoveItem: (id: number) => void;
    onClearCart: () => void;
}

export function Cart({ items, onUpdateQuantity, onRemoveItem, onClearCart }: CartProps): JSX.Element {
    const [isCheckingOut, setIsCheckingOut] = useState(false);

    const totalPrice = items.reduce(
        (sum, item) => sum + item.price * item.quantity,
        0
    );

    const handleOrderSubmit = (formData: { name: string; phone: string; address: string }) => {
        alert(`Спасибо за заказ, ${formData.name}! Доставим по адресу: ${formData.address}`);
        onClearCart();
        setIsCheckingOut(false);
    };

    return (
        <div className="cart">
            <h2>Shopping Cart</h2>
            {items.length === 0 ? (
                <p className="cart__empty">Your cart is empty.</p>
            ) : isCheckingOut ? (
                <CheckoutForm
                    onSubmitOrder={handleOrderSubmit}
                    onCancel={() => setIsCheckingOut(false)}
                />
            ) : (
                <div className="cart__content">
                    <ul className="cart__list">
                        {items.map((item) => (
                            <li key={item.id} className="cart__item">
                                <span className="cart__item-title">{item.title}</span>
                                <div className="cart__controls">
                                    <button
                                        className="cart__btn"
                                        onClick={() => onUpdateQuantity(item.id, -1)}
                                    >
                                        -
                                    </button>
                                    <span className="cart__quantity">{item.quantity}</span>
                                    <button
                                        className="cart__btn"
                                        onClick={() => onUpdateQuantity(item.id, 1)}
                                    >
                                        +
                                    </button>
                                </div>
                                <span className="cart__item-price">
                                    {(item.price * item.quantity).toFixed(2)}$
                                </span>
                                <button
                                    className="cart__remove-btn"
                                    onClick={() => onRemoveItem(item.id)}
                                >
                                    Remove
                                </button>
                            </li>
                        ))}
                    </ul>
                    <div className="cart__footer">
                        <span>Total:</span>
                        <strong>{totalPrice.toFixed(2)}$</strong>
                    </div>
                    <button
                        className="cart__checkout-btn"
                        onClick={() => setIsCheckingOut(true)}
                    >
                        Deliver food
                    </button>
                </div>
            )}
        </div>
    );
}
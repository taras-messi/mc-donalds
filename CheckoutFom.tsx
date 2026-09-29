import React, { JSX, useState } from "react";

interface CheckoutFormProps {
    onSubmitOrder: (formData: { name: string; phone: string; address: string }) => void;
    onCancel: () => void;
}

export function CheckoutForm({ onSubmitOrder, onCancel }: CheckoutFormProps): JSX.Element {
    const [formData, setFormData] = useState({
        name: "",
        phone: "",
        address: ""
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!formData.name || !formData.phone || !formData.address) {
            alert("Заполните все поля!");
            return;
        }
        onSubmitOrder(formData);
    };

    return (
        <form className="checkout-form" onSubmit={handleSubmit}>
            <h3>Оформление заказа</h3>
            <div className="form-group">
                <label>Имя:</label>
                <input
                    type="text"
                    name="name"
                    value={formData.name}
                    onChange={handleChange}
                    placeholder="Тарас"
                    required
                />
            </div>
            <div className="form-group">
                <label>Телефон:</label>
                <input
                    type="tel"
                    name="phone"
                    value={formData.phone}
                    onChange={handleChange}
                    placeholder="+380..."
                    required
                />
            </div>
            <div className="form-group">
                <label>Адрес доставки:</label>
                <input
                    type="text"
                    name="address"
                    value={formData.address}
                    onChange={handleChange}
                    placeholder="Улица, дом, квартира"
                    required
                />
            </div>
            <div className="form-actions">
                <button type="submit" className="cart__checkout-btn">
                    Подтвердить заказ
                </button>
                <button type="button" className="cart__remove-btn" onClick={onCancel}>
                    Отмена
                </button>
            </div>
        </form>
    );
}
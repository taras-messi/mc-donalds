import React, { JSX } from 'react';
import { Product } from "./product";

interface ProductCardProps {
    product: Product;
    onAddToCart: (product: Product) => void;
}

export function ProductCard({ product, onAddToCart }: ProductCardProps): JSX.Element {
    return (
        <div className="card">
            <img src={product.image} alt={product.title} className="card__img" />
            <h2 className="card__title">{product.title}</h2>
            <div className="card__price-box">
                <span className="card__price">{product.price}$</span>
                <button 
                    className="card__button" 
                    onClick={() => onAddToCart(product)}
                >
                    Buy
                </button>
            </div>
        </div>
    );
}
import React, { JSX } from 'react';
import { Product } from "./product";
import { ProductCard } from "./ProductCard";

interface MenuListProps {
    products: Product[];
    onAddToCart: (product: Product) => void;
}

export function MenuList({ products, onAddToCart }: MenuListProps): JSX.Element {
    return (
        <div className="menu-grid">
            {products.map((item) => (
                <ProductCard 
                    key={item.id} 
                    product={item} 
                    onAddToCart={onAddToCart} 
                />
            ))}
        </div>
    );
}
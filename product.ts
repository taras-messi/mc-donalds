import React from 'react';
export interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    category: string;
}

export interface CartItem extends Product {
    quantity: number;
}
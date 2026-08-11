"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
// Глобальное состояние
let products = [];
let cart = [];
// DOM-элементы с приведением типов
const menuGrid = document.querySelector(".menu-grid");
const cartItemsContainer = document.querySelector(".cart-items");
const cartCount = document.querySelector(".header__cart-count");
const cartTotal = document.querySelector(".header__cart-total");
const clearCartBtn = document.querySelector(".clear-cart-btn");
const loader = document.getElementById("loader");
const categoryButtons = document.querySelectorAll(".categories button");
// === 1. ЗАГРУЗКА ИЗ PRODUCT.JSON ===
async function fetchProducts() {
    if (loader)
        loader.style.display = "flex";
    try {
        const response = await fetch("./product.json");
        products = await response.json();
        renderMenu(products);
    }
    catch (error) {
        console.error("Ошибка при загрузке product.json:", error);
    }
    finally {
        if (loader)
            loader.style.display = "none";
    }
}
// === 2. ОТРИСОВКА МЕНЮ В .MENU-GRID ===
function renderMenu(items) {
    if (!menuGrid)
        return;
    menuGrid.innerHTML = "";
    items.forEach((item) => {
        const card = document.createElement("div");
        card.className = "card";
        card.innerHTML = `
      <img src="${item.image}" alt="${item.title}" class="card__img">
      <h3 class="card__title">${item.title}</h3>
      <div class="card__price-box">
        <span class="card__price">${item.price}$</span>
        <button class="card__button" data-id="${item.id}">Buy</button>
      </div>
    `;
        menuGrid.appendChild(card);
    });
    // Навешиваем клики на кнопки Buy
    const buyButtons = menuGrid.querySelectorAll(".card__button");
    buyButtons.forEach((btn) => {
        btn.addEventListener("click", () => {
            const id = Number(btn.getAttribute("data-id"));
            addToCart(id);
        });
    });
}
// === 3. ЛОГИКА КОРЗИНЫ ===
function addToCart(id) {
    const product = products.find((p) => p.id === id);
    if (!product)
        return;
    const existingItem = cart.find((item) => item.product.id === id);
    if (existingItem) {
        existingItem.quantity += 1;
    }
    else {
        cart.push({ product, quantity: 1 });
    }
    updateCart();
}
function changeQuantity(id, delta) {
    const item = cart.find((i) => i.product.id === id);
    if (!item)
        return;
    item.quantity += delta;
    if (item.quantity <= 0) {
        cart = cart.filter((i) => i.product.id !== id);
    }
    updateCart();
}
// === 4. ОБНОВЛЕНИЕ КОРЗИНЫ В ХЕДЕРЕ И СЕКЦИИ CART ===
function updateCart() {
    if (!cartItemsContainer)
        return;
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.product.price * item.quantity, 0);
    if (cartCount)
        cartCount.textContent = totalCount.toString();
    if (cartTotal)
        cartTotal.textContent = totalPrice.toString();
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-text">Your cart is empty...</p>`;
        return;
    }
    cartItemsContainer.innerHTML = "";
    cart.forEach((item) => {
        const cartItem = document.createElement("div");
        cartItem.className = "cart-item";
        cartItem.innerHTML = `
      <p class="cart-item__title">${item.product.title}</p>
      <div class="cart-item__controls">
        <button class="cart-item__btn btn-minus" data-id="${item.product.id}">-</button>
        <span class="cart-item__quantity">${item.quantity}</span>
        <button class="cart-item__btn btn-plus" data-id="${item.product.id}">+</button>
        <span class="cart-item__price">${item.product.price * item.quantity}$</span>
      </div>
    `;
        cartItemsContainer.appendChild(cartItem);
    });
    // Кнопки + и - внутри корзины
    cartItemsContainer.querySelectorAll(".btn-minus").forEach((btn) => {
        btn.addEventListener("click", () => changeQuantity(Number(btn.dataset.id), -1));
    });
    cartItemsContainer.querySelectorAll(".btn-plus").forEach((btn) => {
        btn.addEventListener("click", () => changeQuantity(Number(btn.dataset.id), 1));
    });
}
// Очистить всю корзину
if (clearCartBtn) {
    clearCartBtn.addEventListener("click", () => {
        cart = [];
        updateCart();
    });
}
// === 5. ФИЛЬТРАЦИЯ КАТЕГОРИЙ ===
categoryButtons.forEach((btn) => {
    btn.addEventListener("click", () => {
        const category = btn.getAttribute("data-category");
        if (category === "all") {
            renderMenu(products);
        }
        else {
            const filtered = products.filter((p) => p.category === category);
            renderMenu(filtered);
        }
    });
});
// Старт работы
fetchProducts();
//# sourceMappingURL=app.js.map
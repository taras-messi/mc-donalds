// ===============================
// TYPES
// ===============================
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
// ===============================
// STATE & DOM ELEMENTS
// ===============================
let allProducts = [];
let cart = [];
const menuGridContainer = document.querySelector(".menu-grid");
const cartCountElement = document.querySelector(".header__cart-count");
const cartTotalElement = document.querySelector(".header__cart-total");
const cartItemsContainer = document.querySelector(".cart-items");
const loader = document.getElementById("loader");
const clearOption = document.querySelector(".clear-cart-btn");
const categoryButtons = document.querySelectorAll(".categories button");
const regForm = document.querySelector(".registration-form");
const usernameInput = document.getElementById("username");
const emailInput = document.getElementById("email");
// ===============================
// FETCH PRODUCTS & RENDER MENU
// ===============================
function fetchProducts() {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            if (loader)
                loader.style.display = "flex";
            const response = yield fetch("product.json");
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            allProducts = yield response.json();
            // Задержка 2 секунды для демонстрации лоадера
            yield new Promise((resolve) => setTimeout(resolve, 2000));
            renderMenu(allProducts);
        }
        catch (error) {
            console.error("Error fetching products:", error);
        }
        finally {
            if (loader)
                loader.style.display = "none";
        }
    });
}
function renderMenu(productsArray) {
    if (!menuGridContainer)
        return;
    let htmlResult = "";
    productsArray.forEach((product) => {
        htmlResult += `
        <div class="card">
            <img src="${product.image}" alt="${product.title}" class="card__img">
            <h2 class="card__title">${product.title}</h2>
            <div class="card__price-box">
                <span class="card__price">${product.price}$</span>
                <button class="card__button" data-id="${product.id}">Buy</button> 
            </div>
        </div>
        `;
    });
    menuGridContainer.innerHTML = htmlResult;
}
// ===============================
// CART LOGIC & RENDER
// ===============================
function updateHeaderData() {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);
    if (cartCountElement)
        cartCountElement.textContent = totalCount.toString();
    if (cartTotalElement)
        cartTotalElement.textContent = totalPrice.toFixed(2);
}
function renderCart() {
    if (!cartItemsContainer)
        return;
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `<p class="empty-cart-text">Your cart is empty...</p>`;
        return;
    }
    let htmlResult = "";
    cart.forEach((item) => {
        htmlResult += `
        <div class="cart-item">
            <p class="cart-item__title">${item.title}</p>
            <div class="cart-item__controls">
                <button class="cart-item__btn minus-btn" data-id="${item.id}">-</button>
                <span class="cart-item__quantity">${item.quantity}</span>
                <button class="cart-item__btn plus-btn" data-id="${item.id}">+</button>
            </div>
            <span class="cart-item__price">${(item.price * item.quantity).toFixed(2)}$</span>
        </div>`;
    });
    cartItemsContainer.innerHTML = htmlResult;
}
// Делегирование событий для кнопок "Buy" в меню
if (menuGridContainer) {
    menuGridContainer.addEventListener("click", (e) => {
        const target = e.target;
        const buyBtn = target.closest(".card__button");
        if (!buyBtn)
            return;
        const productId = Number(buyBtn.dataset.id);
        const productData = allProducts.find((product) => product.id === productId);
        if (!productData)
            return;
        const productInCart = cart.find((item) => item.id === productId);
        if (productInCart) {
            productInCart.quantity++;
        }
        else {
            cart.push(Object.assign(Object.assign({}, productData), { quantity: 1 }));
        }
        updateHeaderData();
        renderCart();
    });
}
// Делегирование событий для кнопок "+" и "-" в корзине
if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", (e) => {
        const target = e.target;
        const btn = target.closest(".cart-item__btn");
        if (!btn)
            return;
        const productId = Number(btn.dataset.id);
        const productInCart = cart.find((item) => item.id === productId);
        if (!productInCart)
            return;
        if (btn.classList.contains("plus-btn")) {
            productInCart.quantity++;
        }
        else if (btn.classList.contains("minus-btn")) {
            if (productInCart.quantity > 1) {
                productInCart.quantity--;
            }
            else {
                cart = cart.filter((item) => item.id !== productId);
            }
        }
        updateHeaderData();
        renderCart();
    });
}
// ===============================
// CATEGORIES & CLEAR CART
// ===============================
categoryButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const selectedCategory = button.dataset.category;
        if (selectedCategory === "all") {
            renderMenu(allProducts);
        }
        else {
            const filteredProducts = allProducts.filter((product) => product.category === selectedCategory);
            renderMenu(filteredProducts);
        }
    });
});
if (clearOption) {
    clearOption.addEventListener("click", () => {
        cart = [];
        updateHeaderData();
        renderCart();
        const activeButtons = document.querySelectorAll(".card__button");
        activeButtons.forEach((btn) => {
            btn.textContent = "Buy";
            btn.classList.remove("card__button--disabled");
            btn.disabled = false;
        });
    });
}
// ===============================
// FORM & API REQUEST
// ===============================
function sendDataToTestServer(name, email) {
    return __awaiter(this, void 0, void 0, function* () {
        try {
            const response = yield fetch("https://jsonplaceholder.typicode.com/posts", {
                method: "POST",
                body: JSON.stringify({
                    title: name,
                    body: email,
                    userId: 1,
                }),
                headers: {
                    "Content-type": "application/json; charset=UTF-8",
                },
            });
            const data = yield response.json();
            console.log("Answer test server:", data);
            alert(`Congratulations! Id is back: ${data.id}`);
        }
        catch (error) {
            console.error("Error:", error);
            alert("Data do not send");
        }
    });
}
if (regForm) {
    regForm.addEventListener("submit", (e) => __awaiter(void 0, void 0, void 0, function* () {
        e.preventDefault();
        if (!usernameInput || !emailInput)
            return;
        const usernameValue = usernameInput.value.trim();
        const emailValue = emailInput.value.trim();
        let isFormValid = true;
        if (usernameValue.length < 2) {
            usernameInput.style.border = "2px solid red";
            isFormValid = false;
        }
        else {
            usernameInput.style.border = "2px solid green";
        }
        if (emailValue === "") {
            emailInput.style.border = "2px solid red";
            isFormValid = false;
        }
        else {
            emailInput.style.border = "2px solid green";
        }
        if (isFormValid) {
            yield sendDataToTestServer(usernameValue, emailValue);
            alert(`Congratulations! You're subscribed, ${usernameValue}!`);
            regForm.reset();
            usernameInput.style.borderColor = "";
            emailInput.style.borderColor = "";
        }
    }));
    regForm.addEventListener("input", (e) => {
        const target = e.target;
        if (target.tagName === "INPUT") {
            target.style.border = "";
        }
    });
}
// ===============================
// INIT
// ===============================
fetchProducts();
export {};
//# sourceMappingURL=app.js.map
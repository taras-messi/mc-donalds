// ===============================
// TYPES
// ===============================

interface Product {
    id: number;
    title: string;
    price: number;
    image: string;
    category: string;
}

interface CartItem extends Product {
    quantity: number;
}

interface ServerResponse {
    id: number;
    title: string;
    body: string;
    userId: number;
}

// ===============================
// STATE & DOM ELEMENTS
// ===============================

let allProducts: Product[] = [];
let cart: CartItem[] = [];

const menuGridContainer = document.querySelector(".menu-grid") as HTMLDivElement | null;
const cartCountElement = document.querySelector(".header__cart-count") as HTMLSpanElement | null;
const cartTotalElement = document.querySelector(".header__cart-total") as HTMLSpanElement | null;
const cartItemsContainer = document.querySelector(".cart-items") as HTMLDivElement | null;
const loader = document.getElementById("loader") as HTMLDivElement | null;
const clearOption = document.querySelector(".clear-cart-btn") as HTMLButtonElement | null;
const categoryButtons = document.querySelectorAll<HTMLButtonElement>(".categories button");

const regForm = document.querySelector(".registration-form") as HTMLFormElement | null;
const usernameInput = document.getElementById("username") as HTMLInputElement | null;
const emailInput = document.getElementById("email") as HTMLInputElement | null;

// ===============================
// FETCH PRODUCTS & RENDER MENU
// ===============================

async function fetchProducts(): Promise<void> {
    try {
        if (loader) loader.style.display = "flex";

        const response = await fetch("product.json");

        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }

        allProducts = await response.json();
        
        // Задержка 2 секунды для демонстрации лоадера
        await new Promise((resolve) => setTimeout(resolve, 2000));

        renderMenu(allProducts);
    } catch (error) {
        console.error("Error fetching products:", error);
    } finally {
        if (loader) loader.style.display = "none";
    }
}

function renderMenu(productsArray: Product[]): void {
    if (!menuGridContainer) return;

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

function updateHeaderData(): void {
    const totalCount = cart.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.reduce((sum, item) => sum + item.price * item.quantity, 0);

    if (cartCountElement) cartCountElement.textContent = totalCount.toString();
    if (cartTotalElement) cartTotalElement.textContent = totalPrice.toFixed(2);
}

function renderCart(): void {
    if (!cartItemsContainer) return;

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
    menuGridContainer.addEventListener("click", (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const buyBtn = target.closest(".card__button") as HTMLButtonElement | null;
        if (!buyBtn) return;

        const productId = Number(buyBtn.dataset.id);
        const productData = allProducts.find((product) => product.id === productId);
        if (!productData) return;

        const productInCart = cart.find((item) => item.id === productId);

        if (productInCart) {
            productInCart.quantity++;
        } else {
            cart.push({
                ...productData,
                quantity: 1,
            });
        }

        updateHeaderData();
        renderCart();
    });
}

// Делегирование событий для кнопок "+" и "-" в корзине
if (cartItemsContainer) {
    cartItemsContainer.addEventListener("click", (e: MouseEvent) => {
        const target = e.target as HTMLElement;
        const btn = target.closest(".cart-item__btn") as HTMLButtonElement | null;
        if (!btn) return;

        const productId = Number(btn.dataset.id);
        const productInCart = cart.find((item) => item.id === productId);

        if (!productInCart) return;

        if (btn.classList.contains("plus-btn")) {
            productInCart.quantity++;
        } else if (btn.classList.contains("minus-btn")) {
            if (productInCart.quantity > 1) {
                productInCart.quantity--;
            } else {
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
        } else {
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

        const activeButtons = document.querySelectorAll<HTMLButtonElement>(".card__button");
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

async function sendDataToTestServer(name: string, email: string): Promise<void> {
    try {
        const response = await fetch("https://jsonplaceholder.typicode.com/posts", {
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

        const data: ServerResponse = await response.json();
        console.log("Answer test server:", data);
        alert(`Congratulations! Id is back: ${data.id}`);
    } catch (error) {
        console.error("Error:", error);
        alert("Data do not send");
    }
}

if (regForm) {
    regForm.addEventListener("submit", async (e: Event) => {
        e.preventDefault();

        if (!usernameInput || !emailInput) return;

        const usernameValue = usernameInput.value.trim();
        const emailValue = emailInput.value.trim();
        let isFormValid = true;

        if (usernameValue.length < 2) {
            usernameInput.style.border = "2px solid red";
            isFormValid = false;
        } else {
            usernameInput.style.border = "2px solid green";
        }

        if (emailValue === "") {
            emailInput.style.border = "2px solid red";
            isFormValid = false;
        } else {
            emailInput.style.border = "2px solid green";
        }

        if (isFormValid) {
            await sendDataToTestServer(usernameValue, emailValue);
            alert(`Congratulations! You're subscribed, ${usernameValue}!`);
            regForm.reset();
            usernameInput.style.borderColor = "";
            emailInput.style.borderColor = "";
        }
    });

    regForm.addEventListener("input", (e: Event) => {
        const target = e.target as HTMLElement;
        if (target.tagName === "INPUT") {
            target.style.border = "";
        }
    });
}

// ===============================
// INIT
// ===============================

fetchProducts();
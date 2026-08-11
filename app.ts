// 1. Интерфейс под твой product.json
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


// ===============================
// PRODUCTS
// ===============================

const products: Product[] = [
    {
        id: 1,
        title: "Royal Cheesburger",
        price: 13,
        image: "royal-cheesburger.jpeg",
        category: "burgers"
    },
    {
        id: 3,
        title: "Big-mac",
        price: 12,
        image: "big-mac.jpeg",
        category: "burgers"
    },
    {
        id: 4,
        title: "French fries",
        price: 8,
        image: "fries.jpeg",
        category: "snacks"
    },
    {
        id: 5,
        title: "Nuggets",
        price: 6,
        image: "nuggets.jpeg",
        category: "snacks"
    },
    {
        id: 6,
        title: "Apple juice",
        price: 3,
        image: "apple-juice.jpeg",
        category: "drinks"
    },
    {
        id: 7,
        title: "Coke",
        price: 5,
        image: "coke.jpeg",
        category: "drinks"
    },
    {
        id: 2,
        title: "Americano",
        price: 4,
        image: "americano.jpeg",
        category: "drinks"
    },
    {
        id: 8,
        title: "Ice latte",
        price: 6,
        image: "ice-latte.jpeg",
        category: "drinks"
    },
    {
        id: 9,
        title: "Latte",
        price: 5,
        image: "latte.jpeg",
        category: "drinks"
    }
];


// ===============================
// CART
// ===============================

let cart: CartItem[] = [];


// ===============================
// DOM ELEMENTS
// ===============================

const menuGrid = document.querySelector(".menu-grid") as HTMLDivElement;

const cartItemsContainer =
    document.querySelector(".cart-items") as HTMLDivElement;

const cartCount =
    document.querySelector(".header__cart-count") as HTMLSpanElement;

const cartTotal =
    document.querySelector(".header__cart-total") as HTMLSpanElement;

const clearCartButton =
    document.querySelector(".clear-cart-btn") as HTMLButtonElement;

const checkoutButton =
    document.querySelector(".checkout-btn") as HTMLButtonElement;

const loader =
    document.querySelector("#loader") as HTMLDivElement;

const categoryButtons =
    document.querySelectorAll(".categories button");

const registrationForm =
    document.querySelector(".registration-form") as HTMLFormElement;


// ===============================
// RENDER PRODUCTS
// ===============================

function renderProducts(productsToRender: Product[]): void {

    menuGrid.innerHTML = "";

    productsToRender.forEach((product) => {

        const isInCart = cart.some((item) => item.id === product.id);

        const card = document.createElement("article");

        card.className = "card";

        card.innerHTML = `
            <img
                class="card__img"
                src="${product.image}"
                alt="${product.title}"
            >

            <h3 class="card__title">
                ${product.title}
            </h3>

            <div class="card__price-box">

                <div class="card__price">
                    ${product.price}$
                </div>

                <button
                    class="card__button ${isInCart ? "card__button--disabled" : ""}"
                    data-id="${product.id}"
                    ${isInCart ? "disabled" : ""}
                >
                    ${isInCart ? "Added" : "Add to cart"}
                </button>

            </div>
        `;

        menuGrid.appendChild(card);
    });
}


// ===============================
// ADD PRODUCT TO CART
// ===============================

function addToCart(productId: number): void {

    const product = products.find(
        (product) => product.id === productId
    );

    if (!product) {
        return;
    }

    const existingItem = cart.find(
        (item) => item.id === productId
    );

    if (existingItem) {

        existingItem.quantity += 1;

    } else {

        cart.push({
            ...product,
            quantity: 1
        });

    }

    updateCart();

    renderProducts(products);
}


// ===============================
// REMOVE ONE PRODUCT
// ===============================

function removeFromCart(productId: number): void {

    const item = cart.find(
        (item) => item.id === productId
    );

    if (!item) {
        return;
    }

    item.quantity -= 1;

    if (item.quantity <= 0) {

        cart = cart.filter(
            (item) => item.id !== productId
        );

    }

    updateCart();

    renderProducts(products);
}


// ===============================
// CLEAR CART
// ===============================

function clearCart(): void {

    cart = [];

    updateCart();

    renderProducts(products);
}


// ===============================
// UPDATE CART
// ===============================

function updateCart(): void {

    cartItemsContainer.innerHTML = "";

    if (cart.length === 0) {

        cartItemsContainer.innerHTML = `
            <p class="empty-cart-text">
                Your cart is empty...
            </p>
        `;

        cartCount.textContent = "0";
        cartTotal.textContent = "0";

        checkoutButton.disabled = true;

        return;
    }

    checkoutButton.disabled = false;


    // Количество всех товаров
    const totalQuantity = cart.reduce(
        (total, item) => total + item.quantity,
        0
    );


    // Общая стоимость
    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );


    cartCount.textContent = totalQuantity.toString();

    cartTotal.textContent = totalPrice.toFixed(2);


    // Рисуем товары в корзине
    cart.forEach((item) => {

        const cartItem = document.createElement("div");

        cartItem.className = "cart-item";

        cartItem.innerHTML = `
            <p class="cart-item__title">
                ${item.title}
            </p>

            <div class="cart-item__controls">

                <button
                    class="cart-item__btn cart-item__minus"
                    data-id="${item.id}"
                >
                    −
                </button>

                <span class="cart-item__quantity">
                    ${item.quantity}
                </span>

                <button
                    class="cart-item__btn cart-item__plus"
                    data-id="${item.id}"
                >
                    +
                </button>

            </div>

            <div class="cart-item__price">
                ${(item.price * item.quantity).toFixed(2)}$
            </div>
        `;

        cartItemsContainer.appendChild(cartItem);
    });
}


// ===============================
// PRODUCT BUTTONS
// ===============================

menuGrid.addEventListener("click", (event) => {

    const target = event.target as HTMLElement;

    const button = target.closest(".card__button") as HTMLButtonElement | null;

    if (!button) {
        return;
    }

    const productId = Number(button.dataset.id);

    addToCart(productId);
});


// ===============================
// CART BUTTONS
// ===============================

cartItemsContainer.addEventListener("click", (event) => {

    const target = event.target as HTMLElement;

    const button = target.closest(
        ".cart-item__btn"
    ) as HTMLButtonElement | null;

    if (!button) {
        return;
    }

    const productId = Number(button.dataset.id);

    if (button.classList.contains("cart-item__plus")) {

        addToCart(productId);

    }

    if (button.classList.contains("cart-item__minus")) {

        removeFromCart(productId);

    }
});


// ===============================
// CLEAR CART BUTTON
// ===============================

clearCartButton.addEventListener("click", () => {

    clearCart();

});


// ===============================
// CATEGORIES
// ===============================

categoryButtons.forEach((button) => {

    button.addEventListener("click", () => {

        const category = button.getAttribute("data-category");

        if (!category) {
            return;
        }


        if (category === "all") {

            renderProducts(products);

            return;
        }


        const filteredProducts = products.filter(
            (product) => product.category === category
        );

        renderProducts(filteredProducts);

    });

});


// ===============================
// LOADER
// ===============================

function showLoader(): void {

    loader.style.display = "flex";
}

function hideLoader(): void {

    loader.style.display = "none";
}


// ===============================
// CHECKOUT
// ===============================

checkoutButton.addEventListener("click", () => {

    if (cart.length === 0) {
        alert("Your cart is empty!");
        return;
    }

    const totalPrice = cart.reduce(
        (total, item) => total + item.price * item.quantity,
        0
    );

    alert(
        `Order accepted!\nTotal: ${totalPrice.toFixed(2)}$`
    );

    clearCart();

});


// ===============================
// REGISTRATION FORM
// ===============================

registrationForm.addEventListener("submit", (event) => {

    event.preventDefault();

    const usernameInput =
        document.querySelector("#username") as HTMLInputElement;

    const emailInput =
        document.querySelector("#email") as HTMLInputElement;

    const username = usernameInput.value.trim();

    const email = emailInput.value.trim();

    if (!username || !email) {
        alert("Please fill in all fields.");
        return;
    }

    alert(
        `Thank you, ${username}!\nYour email: ${email}`
    );

    registrationForm.reset();

});


// ===============================
// INITIALIZATION
// ===============================

function init(): void {

    showLoader();

    setTimeout(() => {

        renderProducts(products);

        updateCart();

        hideLoader();

    }, 500);

}

init();
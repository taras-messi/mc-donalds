let allProducts = [];

async function fetchProducts() {
    const loader = document.getElementById('loader');
    console.log('Loader element:', loader); // Debugging line
    if (loader) loader.style.display = 'flex';
    try {
        const response = await fetch('product.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);

        }

        allProducts = await response.json();
        await new Promise(resolve => setTimeout(resolve, 2000)); // ИСПРАВЛЕНО: Добавлена задержка для демонстрации лоадера

        renderMenu(allProducts);

    } catch (error) {
        console.error('Error fetching products:', error);
    } finally {
        if (loader) loader.style.display = 'none';
    }
}

const menuGridContainer = document.querySelector('.menu-grid');
const cartCountElement = document.querySelector('.header__cart-count');
const cartTotalElement = document.querySelector('.header__cart-total');
const cartItemsContainer = document.querySelector('.cart-items');

let currentCartCount = 0;
let totalOrderPrice = 0;
let cart = [];

// 1. Функция рендеринга меню
function renderMenu(productsArray) {
    let htmlResult = '';

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
        `; // ИСПРАВЛЕНО: Добавили data-id="${product.id}" кнопке Buy
    });

    menuGridContainer.innerHTML = htmlResult;

    initCartLogic();
}

// 2. Функция рендеринга корзины (теперь она отдельная и независимая!)
function renderCart() {
    if (cart.length === 0) { // ИСПРАВЛЕНО: lentgh -> length
        cartItemsContainer.innerHTML = `<p class="empty-cart-text">Your cart is empty...</p>`;
        return;
    }



    let htmlResult = '';

    cart.forEach((item) => {
        htmlResult += `
        <div class="cart-item">
            <p class="cart-item__title">${item.title}</p>
            <div class="cart-item__controls">
                <button class="cart-item__btn minus-btn" data-id="${item.id}">-</button>
                <span class="cart-item__quantity">${item.quantity}</span>
                <button class="cart-item__btn plus-btn" data-id="${item.id}">+</button>
            </div>
            <span class="cart-item__price">${item.price * item.quantity}$</span>
        </div>`; // ИСПРАВЛЕНО: Закрыли тег </div> для cart-item
    });

    cartItemsContainer.innerHTML = htmlResult;

    initCartChangeLogic();
}

// 3. Функция логики кнопок корзины
function initCartLogic() {
    const allButtons = document.querySelectorAll('.card__button');
    
    allButtons.forEach((btn) => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.dataset.id);
            const productData = allProducts.find(product => product.id === productId);
            const productInCart = cart.find(item => item.id === productId);

            if (productInCart) {
                productInCart.quantity++;
            } else {
                cart.push({
                    ...productData,
                    quantity: 1
                });
            }

            totalOrderPrice += productData.price;
            currentCartCount++;

            cartCountElement.textContent = currentCartCount;
            cartTotalElement.textContent = totalOrderPrice;

            renderCart();
        });
    });
}

// 4. Логика кнопок категорий
const categoryButtons = document.querySelectorAll('.categories button');

categoryButtons.forEach((button) => {
    button.addEventListener('click', () => {
        const selectedCategory = button.dataset.category;

        if (selectedCategory === 'all') {
            renderMenu(allProducts);
        } else {
            const filteredProducts = allProducts.filter((product) => product.category === selectedCategory);
            renderMenu(filteredProducts);
        }
    });
});

// 5. Кнопка очистки корзины
const clearOption = document.querySelector('.clear-cart-btn');
clearOption.addEventListener('click', () => {
    currentCartCount = 0;
    totalOrderPrice = 0;
    cart = []; // Очищаем массив корзины тоже!

    cartCountElement.textContent = currentCartCount;
    cartTotalElement.textContent = totalOrderPrice;
    
    renderCart(); // Перерисовываем пустую корзину

    const activeButtons = document.querySelectorAll('.card__button');
    activeButtons.forEach(btn => {
        btn.textContent = 'Buy';
        btn.classList.remove('card__button--disabled');
        btn.disabled = false;
    });
});

function initCartChangeLogic() {
    const minusButtons = document.querySelectorAll('.minus-btn');
    const plusButtons = document.querySelectorAll('.plus-btn');

    plusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.dataset.id);

            const productInCart = cart.find(item => item.id === productId);

            if (productInCart) {
                productInCart.quantity++;
                currentCartCount++;
                totalOrderPrice += productInCart.price;

                updateHeaderData();
                renderCart();
            }
        });
    });

    minusButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            const productId = parseInt(btn.dataset.id);
            const productInCart = cart.find(item => item.id === productId);

            if(productInCart) {
                if (productInCart.quantity > 1){
                    productInCart.quantity--;
                } else {
                    cart = cart.filter(item => item.id !== productId);
                }

                currentCartCount--;
                totalOrderPrice -= productInCart.price;

                updateHeaderData()
                renderCart();
            }
        });
    });
}

    function updateHeaderData() {
        cartCountElement.textContent = currentCartCount;
        cartTotalElement.textContent = totalOrderPrice;

    }

     function updateHeaderData() {
            cartCountElement.textContent = currentCartCount;
            cartTotalElement.textContent = totalOrderPrice;

        }

        const regForm = document.querySelector('.registration-form');
        const usernameInput = document.getElementById('username');
        const emailInput = document.getElementById('email');

        regForm.addEventListener('submit', async (e) => {
            e.preventDefault();
            const usernameValue = usernameInput.value.trim();
            const emailValue = emailInput.value.trim();
            let isFormValid = true;

            if (usernameValue.length < 2) {
                usernameInput.style.border = " 2px solid red";
                isFormValid = false;
            } else {
                usernameInput.style.border = "2px solid green";
            }

            if (emailValue === '') {
                emailInput.style.border = "2px solid red";
                isFormValid = false;
            } else {
                emailInput.style.border = "2px solid green";
            }

            if (isFormValid) {
                await 
                sendDataToTestServer(usernameValue, emailValue);
                alert(`Congratulations!You're subscried, ${usernameValue}!`);
                regForm.reset();
                usernameInput.style.borderColor = '';
                emailInput.style.borderColor = '';

            }

            async function sendDataToTestServer(name, email) {
                try {
                    const response = await fetch('https://jsonplaceholder.typicode.com/posts'
                        ,{method:'POST',
                            body: JSON.stringify({
                                title: name,
                                body: email,
                                userId: 1,
                            }),
                            headers: {
                                'Content-type': 'application/json; charset=UTF-8',
                            },
                        });

                        const data = await response.json();
                        console.log('Answer test server:',data);
                        alert(`Congratulations!Id is back: ${data.id}`);
                            
                } catch (error) {
                    console.error('Error:', error);
                    alert('Data do not send');
                }
            }
        });

        regForm.addEventListener('input', (e) => {
            if (e.target.tagName === 'INPUT') {
                e.target.style.border = '';
            }
        });

const checkoutBtn = document.querySelector('.checkout-btn');

if (checkoutBtn) {
    checkoutBtn.addEventListener('click', async () => {
        if (cart.length === 0) {
            alert('Your cart is empty! Add some products first.');
            return;
        }

        checkoutBtn.disabled = true;
        checkoutBtn.textContent = 'Sending...';

        const orderData = {
            orderItems: cart,
            totalPrice: totalOrderPrice,
            date: new Date().toISOString()
        };

        try {
            const response = await fetch('https://jsonplaceholder.typicode.com/posts', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(orderData)
            });

            if (!response.ok) {
                throw new Error(`Server error: ${response.status}`);
            }

            const data=await response.json();
            console.log(`Order #${data.id} placed successfully! Total: ${totalOrderPrice}$`);

            cart = [];
            currentCartCount = 0;
            totalOrderPrice = 0;

            updateHeaderData();
            renderCart();
        } catch (error) {
            console.error('Failed to process order:', error);
            alert('Something went wrong. Please try again.');
        } finally {
            checkoutBtn.disabled = false;
            checkoutBtn.textContent = 'Checkout Order';
        }
    });
}

// Первый запуск программы
fetchProducts();
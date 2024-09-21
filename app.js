
// Variable global para almacenar los productos obtenidos de la API
let productsData = [];

// Función para mostrar productos
const displayProducts = (products) => {
    const productsContainer = document.getElementById('products');
    productsContainer.innerHTML = ''; // Limpiar el contenedor antes de agregar nuevos productos

    products.forEach(product => {
        const productDiv = document.createElement('div');
        productDiv.className = 'product';

        const productHTML = `
            <img src="${product.image}" alt="${product.title}">
            <h2>${product.title}</h2>
            <p>Precio: $${product.price}</p>
            <button onclick="addToCart(${product.id})">Agregar al carrito</button>
        `;

        productDiv.innerHTML = productHTML;
        productsContainer.appendChild(productDiv);
    });
};

// Función para filtrar y ordenar productos
const filterAndSortProducts = () => {
    const searchInput = document.getElementById('search').value.toLowerCase();
    const categorySelect = document.getElementById('category').value;
    const sortSelect = document.getElementById('sort').value;

    let filteredProducts = productsData.filter(product => {
        const matchesCategory = categorySelect === '' || product.category === categorySelect;
        const matchesSearch = product.title.toLowerCase().includes(searchInput);
        return matchesCategory && matchesSearch;
    });

    // Ordenar productos
    if (sortSelect === 'price-asc') {
        filteredProducts.sort((a, b) => a.price - b.price);
    } else if (sortSelect === 'price-desc') {
        filteredProducts.sort((a, b) => b.price - a.price);
    }

    displayProducts(filteredProducts);
};

// Obtener productos de la API
fetch('https://fakestoreapi.com/products')
    .then(response => response.json())
    .then(data => {
        productsData = data; // Guardar los productos obtenidos
        displayProducts(productsData); // Mostrar productos al cargar la página
    })
    .catch(error => {
        console.error('Error:', error);
    });

// Eventos para el filtro de búsqueda, categoría y ordenación
document.getElementById('search').addEventListener('input', filterAndSortProducts);
document.getElementById('category').addEventListener('change', filterAndSortProducts);
document.getElementById('sort').addEventListener('change', filterAndSortProducts);

// Función para agregar productos al carrito
function addToCart(id) {
    let cart = JSON.parse(localStorage.getItem('cart')) || [];

    const existingProduct = cart.find(product => product.id === id);
    if (existingProduct) {
        existingProduct.quantity += 1; // Si ya existe, aumenta la cantidad
    } else {
        const product = productsData.find(p => p.id === id);
        if (product) {
            cart.push({ id: product.id, title: product.title, price: product.price, image: product.image, quantity: 1 });
        }
    }

    localStorage.setItem('cart', JSON.stringify(cart));
    updateCartCount(); // Actualizar el contador del carrito
}

// Función para actualizar el contador del carrito
function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const cartButton = document.getElementById('cartButton');
    cartButton.innerHTML = `🛒 (${cart.reduce((acc, item) => acc + item.quantity, 0)})`;
}

// Actualizar el contador del carrito al cargar la página
document.addEventListener('DOMContentLoaded', () => {
    updateCartCount();
});

// Redirigir al carrito de compras
document.getElementById('cartButton').addEventListener('click', () => {
    window.location.href = 'templates/carrito.html'; 
});



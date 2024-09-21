document.addEventListener('DOMContentLoaded', async () => {
    const cartItemsContainer = document.getElementById('cart-items');
    const totalPriceContainer = document.getElementById('total-price');

    // Obtener los productos del localStorage
    const cart = JSON.parse(localStorage.getItem('cart')) || [];

    if (cart.length === 0) {
        cartItemsContainer.innerHTML = '<p>Tu carrito está vacío</p>';
        return;
    }

    // Función para obtener los detalles del producto desde la API
    const fetchProduct = async (id) => {
        const response = await fetch(`https://fakestoreapi.com/products/${id}`);
        const product = await response.json();
        return product;
    };

    let totalPrice = 0;
    let totalQuantity = 0;  
    
    // Función para actualizar el total del carrito
    const updateTotal = () => {
        totalPrice = 0;
        totalQuantity = 0;  // Reiniciar el contador de cantidad

        cart.forEach(item => {
            // Obtenemos el producto desde la API
            fetchProduct(item.id).then(product => {
                if (product && !isNaN(product.price)) {
                    totalPrice += product.price * item.quantity;
                    totalQuantity += item.quantity;  // Sumar la cantidad de productos
                } else {
                    console.error(`Producto con ID ${item.id} tiene un precio inválido.`);
                }

                // Mostrar tanto el precio total como la cantidad total de productos
                totalPriceContainer.innerHTML = `
                    <p class="total-productos">Total de productos: ${totalQuantity}</p>
                    <p class="total-precio">Precio total: $${totalPrice.toFixed(2)}</p>
                `;
            }).catch(error => console.error('Error al obtener el producto:', error));
        });
    };

    // Crear los elementos del carrito
    for (const item of cart) {
        const product = await fetchProduct(item.id);  // Obtener detalles del producto por ID
        const productDiv = document.createElement('div');
        productDiv.className = 'cart-item';

        const productHTML = `
            <div>
                <img src="${product.image}" alt="${product.title}">
            </div>
            <div>
                <h2>${product.title}</h2>
                <p>Precio: $${product.price}</p>
                <label for="quantity-${product.id}">Cantidad: </label>
                <input type="number" id="quantity-${product.id}" min="1" value="${item.quantity}">
            </div>
        `;

        productDiv.innerHTML = productHTML;
        cartItemsContainer.appendChild(productDiv);

        // Evento para cambiar la cantidad y actualizar el total
        const quantityInput = document.getElementById(`quantity-${product.id}`);
        quantityInput.addEventListener('change', (event) => {
            const newQuantity = parseInt(event.target.value);
            item.quantity = newQuantity;
            localStorage.setItem('cart', JSON.stringify(cart));  // Guardar cambios en localStorage
            updateTotal();  // Actualizar el total
        });
    }

    // Mostrar el total inicial
    updateTotal();
});

// Función para vaciar el carrito
function clearCart() {
    localStorage.removeItem('cart');
    location.reload(); // Recargar la página para actualizar el carrito
}

// Función para regresar a la página anterior
function goToStore() {
    window.history.back(); // Volver a la página anterior en el historial
}


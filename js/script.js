// Shopping Cart Functionality
let cart = JSON.parse(localStorage.getItem('cart')) || [];

// Update cart count in the header
function updateCartCount() {
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.reduce((total, item) => total + item.quantity, 0);
    }
}

// Add to cart functionality
function setupAddToCartButtons() {
    const addToCartButtons = document.querySelectorAll('.add-to-cart');
    
    addToCartButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const productName = button.getAttribute('data-name');
            const productPrice = parseFloat(button.getAttribute('data-price'));
            
            // Check if product is already in cart
            const existingItemIndex = cart.findIndex(item => item.id === productId);
            
            if (existingItemIndex > -1) {
                // Increase quantity if product already exists
                cart[existingItemIndex].quantity += 1;
            } else {
                // Add new product to cart
                cart.push({
                    id: productId,
                    name: productName,
                    price: productPrice,
                    quantity: 1
                });
            }
            
            // Save cart to localStorage
            localStorage.setItem('cart', JSON.stringify(cart));
            
            // Update cart count
            updateCartCount();
            
            // Show notification
            showNotification(`${productName} added to cart!`);
        });
    });
}

// Show notification
function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    
    // Add notification to the DOM
    document.body.appendChild(notification);
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = '#d35400';
    notification.style.color = 'white';
    notification.style.padding = '10px 20px';
    notification.style.borderRadius = '5px';
    notification.style.boxShadow = '0 3px 10px rgba(0, 0, 0, 0.2)';
    notification.style.zIndex = '1000';
    notification.style.opacity = '0';
    notification.style.transform = 'translateY(20px)';
    notification.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
    
    // Trigger animation
    setTimeout(() => {
        notification.style.opacity = '1';
        notification.style.transform = 'translateY(0)';
    }, 10);
    
    // Remove notification after 3 seconds
    setTimeout(() => {
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(20px)';
        
        setTimeout(() => {
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Cart page functionality
function setupCartPage() {
    const cartTableBody = document.querySelector('.cart-table tbody');
    const subtotalElement = document.getElementById('cart-subtotal');
    const taxElement = document.getElementById('cart-tax');
    const totalElement = document.getElementById('cart-total');
    
    if (cartTableBody) {
        // Clear existing cart items
        cartTableBody.innerHTML = '';
        
        if (cart.length === 0) {
            // Display empty cart message
            const emptyRow = document.createElement('tr');
            emptyRow.innerHTML = `<td colspan="5" style="text-align: center;">Your cart is empty</td>`;
            cartTableBody.appendChild(emptyRow);
            
            // Update summary
            if (subtotalElement) subtotalElement.textContent = '$0.00';
            if (taxElement) taxElement.textContent = '$0.00';
            if (totalElement) totalElement.textContent = '$0.00';
        } else {
            // Add cart items to table
            let subtotal = 0;
            
            cart.forEach(item => {
                const row = document.createElement('tr');
                const itemTotal = item.price * item.quantity;
                subtotal += itemTotal;
                
                row.innerHTML = `
                    <td data-label="Product">
                        <div class="product-info">
                            <img src="images/${item.name.toLowerCase().replace(/ /g, '-')}.jpg" alt="${item.name}">
                            <div>
                                <h4>${item.name}</h4>
                                <p>$${item.price.toFixed(2)}</p>
                            </div>
                        </div>
                    </td>
                    <td data-label="Price">$${item.price.toFixed(2)}</td>
                    <td data-label="Quantity">
                        <div class="quantity-control">
                            <button class="decrease-qty" data-id="${item.id}">-</button>
                            <input type="number" value="${item.quantity}" min="1" data-id="${item.id}">
                            <button class="increase-qty" data-id="${item.id}">+</button>
                        </div>
                    </td>
                    <td data-label="Total">$${itemTotal.toFixed(2)}</td>
                    <td data-label="Action">
                        <button class="remove-btn" data-id="${item.id}">Remove</button>
                    </td>
                `;
                
                cartTableBody.appendChild(row);
            });
            
            // Calculate tax and total
            const tax = subtotal * 0.1; // 10% tax
            const total = subtotal + tax;
            
            // Update summary
            if (subtotalElement) subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
            if (taxElement) taxElement.textContent = `$${tax.toFixed(2)}`;
            if (totalElement) totalElement.textContent = `$${total.toFixed(2)}`;
            
            // Setup quantity controls
            setupQuantityControls();
            
            // Setup remove buttons
            setupRemoveButtons();
        }
    }
}

// Setup quantity controls
function setupQuantityControls() {
    // Decrease quantity
    const decreaseButtons = document.querySelectorAll('.decrease-qty');
    decreaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const itemIndex = cart.findIndex(item => item.id === productId);
            
            if (itemIndex > -1 && cart[itemIndex].quantity > 1) {
                cart[itemIndex].quantity -= 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                setupCartPage(); // Refresh cart page
                updateCartCount();
            }
        });
    });
    
    // Increase quantity
    const increaseButtons = document.querySelectorAll('.increase-qty');
    increaseButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const itemIndex = cart.findIndex(item => item.id === productId);
            
            if (itemIndex > -1) {
                cart[itemIndex].quantity += 1;
                localStorage.setItem('cart', JSON.stringify(cart));
                setupCartPage(); // Refresh cart page
                updateCartCount();
            }
        });
    });
    
    // Manual quantity input
    const quantityInputs = document.querySelectorAll('.quantity-control input');
    quantityInputs.forEach(input => {
        input.addEventListener('change', () => {
            const productId = input.getAttribute('data-id');
            const newQuantity = parseInt(input.value);
            const itemIndex = cart.findIndex(item => item.id === productId);
            
            if (itemIndex > -1 && newQuantity > 0) {
                cart[itemIndex].quantity = newQuantity;
                localStorage.setItem('cart', JSON.stringify(cart));
                setupCartPage(); // Refresh cart page
                updateCartCount();
            }
        });
    });
}

// Setup remove buttons
function setupRemoveButtons() {
    const removeButtons = document.querySelectorAll('.remove-btn');
    removeButtons.forEach(button => {
        button.addEventListener('click', () => {
            const productId = button.getAttribute('data-id');
            const itemIndex = cart.findIndex(item => item.id === productId);
            
            if (itemIndex > -1) {
                const removedItem = cart[itemIndex];
                cart.splice(itemIndex, 1);
                localStorage.setItem('cart', JSON.stringify(cart));
                setupCartPage(); // Refresh cart page
                updateCartCount();
                showNotification(`${removedItem.name} removed from cart!`);
            }
        });
    });
}

// Newsletter form submission
function setupNewsletterForm() {
    const newsletterForm = document.getElementById('newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', (e) => {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('input[type="email"]');
            const email = emailInput.value;
            
            // In a real application, you would send this to a server
            console.log(`Newsletter subscription for: ${email}`);
            
            // Show success message
            showNotification('Thank you for subscribing to our newsletter!');
            
            // Reset form
            newsletterForm.reset();
        });
    }
}

// Initialize all functionality
function init() {
    updateCartCount();
    setupAddToCartButtons();
    setupCartPage();
    setupNewsletterForm();
}

// Run initialization when DOM is fully loaded
document.addEventListener('DOMContentLoaded', init);
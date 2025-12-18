// Checkout Page Script

function getCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return { ...product, quantity: item.quantity };
    }).filter(item => item.id);
}

function calculateTotals(items) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
}

function renderOrderSummary() {
    const orderItemsEl = document.getElementById('order-items');
    const items = getCartItems();
    
    if (items.length === 0) {
        window.location.href = 'cart.html';
        return;
    }
    
    if (orderItemsEl) {
        orderItemsEl.innerHTML = items.map(item => `
            <div class="order-item">
                <img src="${item.image}" alt="${item.name}" class="order-item-image">
                <div class="order-item-info">
                    <p class="order-item-title">${item.name}</p>
                    <p class="order-item-qty">Qty: ${item.quantity}</p>
                </div>
                <span class="order-item-price">$${(item.price * item.quantity).toFixed(2)}</span>
            </div>
        `).join('');
    }
    
    const totals = calculateTotals(items);
    
    document.getElementById('subtotal').textContent = `$${totals.subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${totals.tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${totals.total.toFixed(2)}`;
}

function formatCardNumber(input) {
    let value = input.value.replace(/\s/g, '').replace(/\D/g, '');
    let formatted = value.match(/.{1,4}/g)?.join(' ') || value;
    input.value = formatted;
}

function formatExpiry(input) {
    let value = input.value.replace(/\D/g, '');
    if (value.length >= 2) {
        value = value.slice(0, 2) + '/' + value.slice(2, 4);
    }
    input.value = value;
}

document.addEventListener('DOMContentLoaded', function() {
    renderOrderSummary();
    
    // Format card number
    const cardInput = document.getElementById('cardNumber');
    if (cardInput) {
        cardInput.addEventListener('input', function() {
            formatCardNumber(this);
        });
    }
    
    // Format expiry
    const expiryInput = document.getElementById('expiry');
    if (expiryInput) {
        expiryInput.addEventListener('input', function() {
            formatExpiry(this);
        });
    }
    
    // Handle form submission
    const checkoutForm = document.getElementById('checkout-form');
    if (checkoutForm) {
        checkoutForm.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Clear cart
            localStorage.removeItem('cart');
            
            // Redirect to success page
            window.location.href = 'success.html';
        });
    }
});
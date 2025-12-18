// Cart Page Script

function getCartItems() {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    return cart.map(item => {
        const product = products.find(p => p.id === item.id);
        return { ...product, quantity: item.quantity };
    }).filter(item => item.id);
}

function updateQuantity(productId, change) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const item = cart.find(i => i.id === productId);
    
    if (item) {
        item.quantity += change;
        if (item.quantity <= 0) {
            const index = cart.indexOf(item);
            cart.splice(index, 1);
        }
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }
}

function removeItem(productId) {
    const cart = JSON.parse(localStorage.getItem('cart') || '[]');
    const index = cart.findIndex(i => i.id === productId);
    
    if (index > -1) {
        cart.splice(index, 1);
        localStorage.setItem('cart', JSON.stringify(cart));
        renderCart();
        updateCartCount();
    }
}

function calculateTotals(items) {
    const subtotal = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = subtotal > 50 ? 0 : 5.99;
    const tax = subtotal * 0.08;
    const total = subtotal + shipping + tax;
    
    return { subtotal, shipping, tax, total };
}

function renderCart() {
    const cartItemsEl = document.getElementById('cart-items');
    const cartSummaryEl = document.getElementById('cart-summary');
    const emptyCartEl = document.getElementById('empty-cart');
    
    const items = getCartItems();
    
    if (items.length === 0) {
        if (cartItemsEl) cartItemsEl.style.display = 'none';
        if (cartSummaryEl) cartSummaryEl.style.display = 'none';
        if (emptyCartEl) emptyCartEl.style.display = 'block';
        return;
    }
    
    if (cartItemsEl) cartItemsEl.style.display = 'flex';
    if (cartSummaryEl) cartSummaryEl.style.display = 'block';
    if (emptyCartEl) emptyCartEl.style.display = 'none';
    
    if (cartItemsEl) {
        cartItemsEl.innerHTML = items.map(item => `
            <div class="cart-item">
                <img src="${item.image}" alt="${item.name}" class="cart-item-image">
                <div class="cart-item-info">
                    <h3 class="cart-item-title">${item.name}</h3>
                    <p class="cart-item-price">$${item.price.toFixed(2)}</p>
                    <div class="cart-item-actions">
                        <div class="quantity-control">
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, -1)">-</button>
                            <span class="quantity-value">${item.quantity}</span>
                            <button class="quantity-btn" onclick="updateQuantity(${item.id}, 1)">+</button>
                        </div>
                        <button class="remove-btn" onclick="removeItem(${item.id})">Remove</button>
                    </div>
                </div>
            </div>
        `).join('');
    }
    
    const totals = calculateTotals(items);
    
    document.getElementById('subtotal').textContent = `$${totals.subtotal.toFixed(2)}`;
    document.getElementById('shipping').textContent = totals.shipping === 0 ? 'Free' : `$${totals.shipping.toFixed(2)}`;
    document.getElementById('tax').textContent = `$${totals.tax.toFixed(2)}`;
    document.getElementById('total').textContent = `$${totals.total.toFixed(2)}`;
}

document.addEventListener('DOMContentLoaded', function() {
    renderCart();
});
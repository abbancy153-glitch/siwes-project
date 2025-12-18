// Products Page Script

let currentCategory = 'all';

function renderProducts(category = 'all') {
    const grid = document.getElementById('products-grid');
    if (!grid) return;
    
    const filteredProducts = category === 'all' 
        ? products 
        : products.filter(p => p.category === category);
    
    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card">
            <img src="${product.image}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <span class="product-category">${product.category}</span>
                <h3 class="product-title">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-footer">
                    <span class="product-price">$${product.price.toFixed(2)}</span>
                    <button class="btn btn-primary btn-sm" onclick="addToCart(${product.id})">
                        Add to Cart
                    </button>
                </div>
            </div>
        </div>
    `).join('');
}

function setupFilters() {
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            filterBtns.forEach(b => b.classList.remove('active'));
            this.classList.add('active');
            
            const category = this.dataset.category;
            currentCategory = category;
            renderProducts(category);
        });
    });
    
    // Check URL for category parameter
    const urlParams = new URLSearchParams(window.location.search);
    const categoryParam = urlParams.get('category');
    
    if (categoryParam) {
        const categoryBtn = document.querySelector(`[data-category="${categoryParam}"]`);
        if (categoryBtn) {
            document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
            categoryBtn.classList.add('active');
            currentCategory = categoryParam;
        }
    }
}

document.addEventListener('DOMContentLoaded', function() {
    setupFilters();
    renderProducts(currentCategory);
});
// Mobile Navbar Toggle
function toggleMenu() {
    const navbar = document.getElementById('navbar');
    navbar.classList.toggle('active');
}

// ------ CART LOGIC ------ //

const CartManager = {
    key: 'marsCart',
    
    getItems() {
        const cartStr = localStorage.getItem(this.key);
        return cartStr ? JSON.parse(cartStr) : [];
    },
    
    saveItems(items) {
        localStorage.setItem(this.key, JSON.stringify(items));
        this.updateBadge();
        
        // If we are on the cart page, re-render
        if(document.querySelector('.cart-items')) {
            renderCartPage();
        }
    },
    
    addItem(product) {
        let items = this.getItems();
        let existing = items.find(i => i.name === product.name);
        
        if (existing) {
            existing.quantity += 1;
        } else {
            items.push({...product, quantity: 1});
        }
        
        this.saveItems(items);
        
        // Quick visual feedback
        alert(`Added ${product.name} to cart!`);
    },
    
    updateQuantity(name, change) {
        let items = this.getItems();
        let existing = items.find(i => i.name === name);
        if(existing) {
            existing.quantity += change;
            if(existing.quantity <= 0) {
                items = items.filter(i => i.name !== name);
            }
            this.saveItems(items);
        }
    },
    
    removeItem(name) {
        let items = this.getItems();
        items = items.filter(i => i.name !== name);
        this.saveItems(items);
    },
    
    getTotal() {
        return this.getItems().reduce((sum, item) => sum + (item.price * item.quantity), 0);
    },
    
    updateBadge() {
        const count = this.getItems().reduce((sum, item) => sum + item.quantity, 0);
        
        // Find all cart bag links (desktop and mobile)
        const bagLinks = document.querySelectorAll('#lg-bag a, #mobil a:first-child');
        
        bagLinks.forEach(link => {
            let badge = link.querySelector('.cart-badge');
            if(!badge) {
                badge = document.createElement('span');
                badge.className = 'cart-badge';
                // Add some inline style or class for the badge
                badge.style.background = 'var(--accent-color)';
                badge.style.color = '#fff';
                badge.style.fontSize = '12px';
                badge.style.padding = '2px 6px';
                badge.style.borderRadius = '50%';
                badge.style.position = 'absolute';
                badge.style.top = '-8px';
                badge.style.right = '-8px';
                link.style.position = 'relative';
                link.appendChild(badge);
            }
            badge.textContent = count;
            badge.style.display = count > 0 ? 'flex' : 'none';
        });
    }
};

// Initialize listeners on DOM load
document.addEventListener("DOMContentLoaded", () => {
    
    CartManager.updateBadge();
    
    // Attach event listeners to Add to Cart buttons
    const cartButtons = document.querySelectorAll('.pro .cart');
    
    cartButtons.forEach(btn => {
        btn.addEventListener('click', (e) => {
            e.preventDefault(); // prevent anchor default
            e.stopPropagation(); // prevent triggering the parent .pro card navigation
            
            // Traverse DOM to get product details
            const card = btn.closest('.pro');
            const imgEl = card.querySelector('img');
            const titleEl = card.querySelector('.des h5');
            const priceEl = card.querySelector('.des h4');
            
            if(imgEl && titleEl && priceEl) {
                const imgUrl = imgEl.src;
                const name = titleEl.innerText;
                // Parse price strings like "EGP 1499.00" -> 1499.00
                const price = parseFloat(priceEl.innerText.replace(/[^0-9.]/g, ''));
                
                CartManager.addItem({
                    name: name,
                    price: price,
                    image: imgUrl
                });
            }
        });
    });
    
    // If we are on the cart page
    if(document.querySelector('.cart-items')) {
        renderCartPage();
    }
});

function renderCartPage() {
    const container = document.querySelector('.cart-items');
    const totalEl = document.getElementById('total');
    const subtotalEl = document.getElementById('subtotal');
    if(!container) return;
    
    container.innerHTML = '';
    const items = CartManager.getItems();
    
    if(items.length === 0) {
        container.innerHTML = `
            <div class="cart-empty">
                <i class="fas fa-shopping-bag"></i>
                <p>Your cart is empty.</p>
                <a href="index.html">Start Shopping</a>
            </div>`;
        if(totalEl) totalEl.textContent = '0.00';
        if(subtotalEl) subtotalEl.textContent = 'EGP 0.00';
        return;
    }
    
    items.forEach(item => {
        const div = document.createElement('div');
        div.className = 'cart-item';
        div.innerHTML = `
            <div class="cart-item-info">
                <img src="${item.image}" alt="${item.name}">
                <span class="item-name">${item.name}</span>
            </div>
            <div class="cart-item-price">EGP ${item.price.toFixed(2)}</div>
            <div class="cart-item-qty">
                <button class="qty-btn" onclick="CartManager.updateQuantity('${item.name}', -1)">−</button>
                <span class="qty-count">${item.quantity}</span>
                <button class="qty-btn" onclick="CartManager.updateQuantity('${item.name}', 1)">+</button>
            </div>
            <div class="cart-item-subtotal">EGP ${(item.price * item.quantity).toFixed(2)}</div>
            <div class="cart-item-remove">
                <button class="remove-btn" onclick="CartManager.removeItem('${item.name}')" title="Remove">
                    <i class="fas fa-times"></i>
                </button>
            </div>
        `;
        container.appendChild(div);
    });
    
    const total = CartManager.getTotal();
    if(totalEl) totalEl.textContent = total.toFixed(2);
    if(subtotalEl) subtotalEl.textContent = 'EGP ' + total.toFixed(2);
}

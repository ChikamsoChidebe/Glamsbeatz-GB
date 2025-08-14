// Cart Component - Full Functionality
class CartManager {
    constructor() {
        this.cart = JSON.parse(localStorage.getItem('glamsbeatz_cart') || '[]');
        this.init();
    }

    init() {
        this.updateCartCount();
        this.setupCartButton();
    }

    setupCartButton() {
        const cartBtn = document.getElementById('cart-btn');
        if (cartBtn) {
            cartBtn.addEventListener('click', () => {
                window.location.href = 'cart.html';
            });
        }
    }

    addToCart(product) {
        if (!this.cart.find(item => item.id === product.id)) {
            this.cart.push(product);
            this.saveCart();
            this.updateCartCount();
            this.showNotification('Added to cart!', 'success');
            return true;
        } else {
            this.showNotification('Item already in cart', 'info');
            return false;
        }
    }

    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.saveCart();
        this.updateCartCount();
    }

    clearCart() {
        this.cart = [];
        this.saveCart();
        this.updateCartCount();
    }

    saveCart() {
        localStorage.setItem('glamsbeatz_cart', JSON.stringify(this.cart));
    }

    updateCartCount() {
        const cartCount = document.getElementById('cart-count');
        if (cartCount) {
            cartCount.textContent = this.cart.length;
        }
    }

    showNotification(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.textContent = message;
        
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            background: ${type === 'success' ? '#27ae60' : type === 'error' ? '#e74c3c' : '#3498db'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            z-index: 10000;
            animation: slideInRight 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOutRight 0.3s ease';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 3000);
    }
}

// Global cart functions
function addToCart(productId) {
    const product = products.find(p => p.id === productId);
    if (product && window.cartManager) {
        window.cartManager.addToCart(product);
    }
}

// Initialize cart manager
if (typeof products !== 'undefined') {
    window.cartManager = new CartManager();
}

console.log('Cart component loaded');
// Wishlist Component - Full Functionality
class WishlistManager {
    constructor() {
        this.wishlist = JSON.parse(localStorage.getItem('glamsbeatz_wishlist') || '[]');
        this.init();
    }

    init() {
        this.updateWishlistCount();
        this.setupWishlistButton();
    }

    setupWishlistButton() {
        const wishlistBtn = document.getElementById('wishlist-btn');
        if (wishlistBtn) {
            wishlistBtn.addEventListener('click', () => {
                window.location.href = 'wishlist.html';
            });
        }
    }

    addToWishlist(product) {
        if (!this.wishlist.find(item => item.id === product.id)) {
            this.wishlist.push(product);
            this.saveWishlist();
            this.updateWishlistCount();
            this.showNotification('Added to wishlist!', 'success');
            return true;
        } else {
            this.showNotification('Item already in wishlist', 'info');
            return false;
        }
    }

    removeFromWishlist(productId) {
        this.wishlist = this.wishlist.filter(item => item.id !== productId);
        this.saveWishlist();
        this.updateWishlistCount();
    }

    toggleWishlist(productId) {
        const product = products.find(p => p.id === productId);
        if (!product) return;

        const existingIndex = this.wishlist.findIndex(item => item.id === productId);
        
        if (existingIndex > -1) {
            this.removeFromWishlist(productId);
            this.showNotification('Removed from wishlist', 'info');
            return false;
        } else {
            this.addToWishlist(product);
            return true;
        }
    }

    saveWishlist() {
        localStorage.setItem('glamsbeatz_wishlist', JSON.stringify(this.wishlist));
    }

    updateWishlistCount() {
        const wishlistCount = document.getElementById('wishlist-count');
        if (wishlistCount) {
            wishlistCount.textContent = this.wishlist.length;
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

// Global wishlist functions
function toggleWishlist(productId) {
    if (window.wishlistManager) {
        return window.wishlistManager.toggleWishlist(productId);
    }
}

// Initialize wishlist manager
if (typeof products !== 'undefined') {
    window.wishlistManager = new WishlistManager();
}

console.log('Wishlist component loaded');
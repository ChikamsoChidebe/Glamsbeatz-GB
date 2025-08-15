// Product Slider Component
class ProductSlider {
    constructor() {
        this.sliders = new Map();
        this.init();
    }

    init() {
        document.addEventListener('DOMContentLoaded', () => {
            this.loadAllSliders();
        });
    }

    loadAllSliders() {
        // Load featured products
        this.loadSlider('featured-slider', this.getFeaturedProducts(), true);
        
        // Load shoes
        this.loadSlider('shoes-slider', this.getShoeProducts(), true);
        
        // Load bags
        this.loadSlider('bags-slider', this.getBagProducts(), true);
        
        // Load new arrivals
        this.loadSlider('new-slider', this.getNewProducts(), true);
        
        // Load popular products
        this.loadSlider('popular-slider', this.getPopularProducts(), true);
    }

    loadSlider(sliderId, products, autoSlide = false) {
        const slider = document.getElementById(sliderId);
        if (!slider || !products.length) return;

        // Clear existing content
        slider.innerHTML = '';
        
        // Duplicate products for seamless loop
        const duplicatedProducts = [...products, ...products];
        
        // Create product cards
        duplicatedProducts.forEach(product => {
            const card = this.createProductCard(product);
            slider.appendChild(card);
        });

        // Store slider reference
        this.sliders.set(sliderId, {
            element: slider,
            products: products,
            autoSlide: autoSlide
        });

        // Start auto-slide if enabled
        if (autoSlide) {
            this.startAutoSlide(sliderId);
        }
    }

    createProductCard(product) {
        const card = document.createElement('div');
        card.className = 'product-card';
        card.setAttribute('data-product-id', product.id);

        // Generate star rating
        const fullStars = Math.floor(product.rating);
        const hasHalfStar = product.rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '★'.repeat(fullStars);
        if (hasHalfStar) starsHTML += '☆';
        starsHTML += '☆'.repeat(emptyStars);

        // Generate badges
        let badgeHTML = '';
        if (product.isNew) badgeHTML += '<span class="product-badge new">New</span>';
        else if (product.isFeatured) badgeHTML += '<span class="product-badge featured">Featured</span>';
        else if (product.isPopular) badgeHTML += '<span class="product-badge popular">Popular</span>';

        // Generate tags
        const tagsHTML = product.tags.slice(0, 3).map(tag => 
            `<span class="product-tag">${tag}</span>`
        ).join('');

        card.innerHTML = `
            ${badgeHTML}
            <img src="${product.images[0]}" alt="${product.name}" class="product-image">
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-brand">${product.brand}</p>
                <div class="product-rating">
                    <span class="stars">${starsHTML}</span>
                    <span class="rating-count">(${product.reviewCount})</span>
                </div>
                <div class="product-tags">
                    ${tagsHTML}
                </div>
                <div class="product-actions">
                    <button class="product-whatsapp-btn" onclick="sendProductToWhatsApp(${product.id})">
                        <i class="fab fa-whatsapp"></i>
                        Contact on WhatsApp
                    </button>
                    <button class="product-cart-btn" onclick="addToCart(${product.id})">
                        <i class="fas fa-shopping-cart"></i>
                    </button>
                    <button class="product-wishlist-btn" onclick="toggleWishlist(${product.id})">
                        <i class="fas fa-heart"></i>
                    </button>
                </div>
            </div>
        `;

        // Add click event for product details
        card.addEventListener('click', (e) => {
            if (!e.target.closest('.product-actions')) {
                this.showProductDetails(product);
            }
        });

        return card;
    }

    startAutoSlide(sliderId) {
        const sliderData = this.sliders.get(sliderId);
        if (!sliderData) return;

        const slider = sliderData.element;
        
        // Reset animation
        slider.style.animation = 'none';
        slider.offsetHeight; // Trigger reflow
        slider.style.animation = 'slideLeft 60s linear infinite';
        
        // Restart animation when it ends
        slider.addEventListener('animationend', () => {
            this.startAutoSlide(sliderId);
        });
    }

    pauseSlider(sliderId) {
        const sliderData = this.sliders.get(sliderId);
        if (sliderData) {
            sliderData.element.style.animationPlayState = 'paused';
        }
    }

    resumeSlider(sliderId) {
        const sliderData = this.sliders.get(sliderId);
        if (sliderData) {
            sliderData.element.style.animationPlayState = 'running';
        }
    }

    showProductDetails(product) {
        // Send detailed product info to WhatsApp
        if (whatsappManager) {
            whatsappManager.sendProductInquiry(product);
        } else {
            sendProductToWhatsApp(product.id);
        }
    }

    // Product filter methods
    getFeaturedProducts() {
        return products.filter(p => p.isFeatured).slice(0, 12);
    }

    getShoeProducts() {
        return products.filter(p => p.type === 'shoes').slice(0, 15);
    }

    getBagProducts() {
        return products.filter(p => p.type === 'bags').slice(0, 15);
    }

    getNewProducts() {
        return products.filter(p => p.isNew).slice(0, 12);
    }

    getPopularProducts() {
        return products.filter(p => p.isPopular).slice(0, 12);
    }
}

// Wishlist functionality
function toggleWishlist(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;

    let wishlist = JSON.parse(localStorage.getItem('glamsbeatz_wishlist') || '[]');
    const existingIndex = wishlist.findIndex(item => item.id === productId);

    if (existingIndex > -1) {
        wishlist.splice(existingIndex, 1);
        showNotification('Removed from wishlist', 'info');
    } else {
        wishlist.push(product);
        showNotification('Added to wishlist', 'success');
    }

    localStorage.setItem('glamsbeatz_wishlist', JSON.stringify(wishlist));
    updateWishlistUI();
}

// Update wishlist UI
function updateWishlistUI() {
    const wishlist = JSON.parse(localStorage.getItem('glamsbeatz_wishlist') || '[]');
    const wishlistButtons = document.querySelectorAll('.product-wishlist-btn');
    
    wishlistButtons.forEach(btn => {
        const card = btn.closest('.product-card');
        const productId = parseInt(card.dataset.productId);
        
        if (wishlist.some(item => item.id === productId)) {
            btn.classList.add('active');
        } else {
            btn.classList.remove('active');
        }
    });

    // Update wishlist count
    const wishlistCount = document.getElementById('wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}

// Notification system
function showNotification(message, type = 'info') {
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
            document.body.removeChild(notification);
        }, 300);
    }, 3000);
}

// Global function to send product to WhatsApp
function sendProductToWhatsApp(productId) {
    const product = products.find(p => p.id === productId);
    if (!product) return;
    
    if (whatsappManager) {
        whatsappManager.sendProductInquiry(product);
    } else {
        // Fallback with basic product info
        const baseUrl = window.location.origin + window.location.pathname.replace(/\/[^/]*$/, '');
        const imageUrl = `${baseUrl}/${product.images[0]}`;
        
        const message = `🛍️ *GLAMSBEATZ INQUIRY*

Hello! I'm interested in this product:

📦 *Product:* ${product.name}
🏷️ *Brand:* ${product.brand}
📂 *Category:* ${product.category.charAt(0).toUpperCase() + product.category.slice(1)}
⭐ *Rating:* ${product.rating}/5 (${product.reviewCount} reviews)
🎨 *Colors:* ${product.colors.join(', ')}
📏 *Sizes:* ${product.sizes.join(', ')}

🖼️ *Product Image:* ${imageUrl}

💬 Could you please provide:
• Current pricing
• Availability status
• Delivery options

Thank you!`;
        
        const whatsappUrl = `https://wa.me/2348057882114?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
}

// Make function globally available
window.sendProductToWhatsApp = sendProductToWhatsApp;

// Initialize product slider
const productSlider = new ProductSlider();
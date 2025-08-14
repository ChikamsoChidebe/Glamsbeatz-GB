// Product Loader - Ensures products display correctly
document.addEventListener('DOMContentLoaded', function() {
    // Force load products immediately
    if (typeof products !== 'undefined' && products.length > 0) {
        console.log('Products loaded:', products.length);
        
        // Initialize product sliders
        if (typeof ProductSlider !== 'undefined') {
            const productSlider = new ProductSlider();
        }
        
        // Update cart and wishlist counts
        updateCartCount();
        updateWishlistCount();
    } else {
        console.error('Products not loaded');
    }
});

function updateCartCount() {
    const cart = JSON.parse(localStorage.getItem('glamsbeatz_cart') || '[]');
    const cartCount = document.getElementById('cart-count');
    if (cartCount) {
        cartCount.textContent = cart.length;
    }
}

function updateWishlistCount() {
    const wishlist = JSON.parse(localStorage.getItem('glamsbeatz_wishlist') || '[]');
    const wishlistCount = document.getElementById('wishlist-count');
    if (wishlistCount) {
        wishlistCount.textContent = wishlist.length;
    }
}
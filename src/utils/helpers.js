// Helper utility functions
const helpers = {
    // Format currency (placeholder since we use WhatsApp for pricing)
    formatPrice: (price) => {
        return `Contact for Price`;
    },

    // Generate star rating HTML
    generateStars: (rating) => {
        const fullStars = Math.floor(rating);
        const hasHalfStar = rating % 1 !== 0;
        const emptyStars = 5 - fullStars - (hasHalfStar ? 1 : 0);
        
        let starsHTML = '★'.repeat(fullStars);
        if (hasHalfStar) starsHTML += '☆';
        starsHTML += '☆'.repeat(emptyStars);
        
        return starsHTML;
    },

    // Debounce function for search
    debounce: (func, wait) => {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    },

    // Smooth scroll to element
    scrollToElement: (elementId) => {
        const element = document.getElementById(elementId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    },

    // Get URL parameters
    getUrlParameter: (name) => {
        const urlParams = new URLSearchParams(window.location.search);
        return urlParams.get(name);
    },

    // Set URL parameter
    setUrlParameter: (name, value) => {
        const url = new URL(window.location);
        url.searchParams.set(name, value);
        window.history.pushState({}, '', url);
    },

    // Capitalize first letter
    capitalize: (str) => {
        return str.charAt(0).toUpperCase() + str.slice(1);
    },

    // Truncate text
    truncateText: (text, maxLength) => {
        if (text.length <= maxLength) return text;
        return text.substr(0, maxLength) + '...';
    },

    // Check if element is in viewport
    isInViewport: (element) => {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    },

    // Local storage helpers
    storage: {
        set: (key, value) => {
            try {
                localStorage.setItem(key, JSON.stringify(value));
            } catch (e) {
                console.error('Error saving to localStorage:', e);
            }
        },
        
        get: (key, defaultValue = null) => {
            try {
                const item = localStorage.getItem(key);
                return item ? JSON.parse(item) : defaultValue;
            } catch (e) {
                console.error('Error reading from localStorage:', e);
                return defaultValue;
            }
        },
        
        remove: (key) => {
            try {
                localStorage.removeItem(key);
            } catch (e) {
                console.error('Error removing from localStorage:', e);
            }
        }
    },

    // Image loading helper
    loadImage: (src) => {
        return new Promise((resolve, reject) => {
            const img = new Image();
            img.onload = () => resolve(img);
            img.onerror = reject;
            img.src = src;
        });
    },

    // Mobile detection
    isMobile: () => {
        return /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
    },

    // Touch device detection
    isTouchDevice: () => {
        return 'ontouchstart' in window || navigator.maxTouchPoints > 0;
    }
};

// Global scroll to section function
function scrollToSection(sectionId) {
    if (typeof helpers !== 'undefined' && helpers.scrollToElement) {
        helpers.scrollToElement(sectionId);
    } else {
        // Fallback implementation
        const element = document.getElementById(sectionId);
        if (element) {
            element.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    }
}

// Ensure global availability
window.helpers = helpers;
window.scrollToSection = scrollToSection;
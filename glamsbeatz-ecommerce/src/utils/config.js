// Configuration settings for Glamsbeatz
const CONFIG = {
    // WhatsApp Configuration
    whatsapp: {
        phoneNumber: '2348057882114',
        defaultMessage: 'Hello! I\'m interested in your premium shoes and bags collection from Glamsbeatz. Could you please provide more information and pricing?'
    },
    
    // Site Configuration
    site: {
        name: 'Glamsbeatz',
        tagline: 'Premium Collection',
        description: 'Your premier destination for luxury shoes and designer bags',
        email: 'info@glamsbeatz.com'
    },
    
    // Product Configuration
    products: {
        itemsPerPage: 12,
        itemsPerRow: 4,
        autoSlideInterval: 2000, // 2 seconds
        categories: {
            shoes: ['formal', 'casual', 'sneakers', 'boots', 'sandals', 'heels', 'athletic', 'flats'],
            bags: ['handbags', 'backpacks', 'clutches', 'tote', 'crossbody', 'wallets', 'briefcase', 'messenger', 'laptop', 'sports', 'satchel', 'travel']
        }
    },
    
    // Animation Configuration
    animations: {
        scrollSpeed: 50, // pixels per second
        fadeInDuration: 300,
        slideTransition: 500
    }
};

// Backward compatibility - ensure existing code still works
window.CONFIG = CONFIG;

// Export configuration
if (typeof module !== 'undefined' && module.exports) {
    module.exports = CONFIG;
}
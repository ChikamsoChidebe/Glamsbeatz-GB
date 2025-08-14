// WhatsApp Integration Utilities
class WhatsAppManager {
    constructor() {
        // Use CONFIG if available, otherwise fallback to defaults
        this.phoneNumber = (typeof CONFIG !== 'undefined' && CONFIG.whatsapp) ? CONFIG.whatsapp.phoneNumber : '2348057882114';
        this.defaultMessage = (typeof CONFIG !== 'undefined' && CONFIG.whatsapp) ? CONFIG.whatsapp.defaultMessage : 'Hello! I\'m interested in your premium shoes and bags collection from Glamsbeatz. Could you please provide more information and pricing?';
        this.initializeWhatsAppButtons();
    }

    // Initialize all WhatsApp buttons
    initializeWhatsAppButtons() {
        // Use both DOMContentLoaded and immediate execution for compatibility
        const initButtons = () => {
            // WhatsApp contact buttons
            const whatsappButtons = document.querySelectorAll('.whatsapp-contact, .whatsapp-btn, .whatsapp-float');
            whatsappButtons.forEach(button => {
                // Remove existing listeners to prevent duplicates
                button.removeEventListener('click', this.handleWhatsAppClick);
                button.addEventListener('click', (e) => {
                    e.preventDefault();
                    this.openWhatsApp();
                });
            });

            // Product-specific WhatsApp buttons
            document.removeEventListener('click', this.handleProductClick);
            document.addEventListener('click', (e) => {
                if (e.target.closest('[data-whatsapp-product]')) {
                    const productName = e.target.closest('[data-whatsapp-product]').dataset.whatsappProduct;
                    this.openWhatsApp(productName);
                }
            });

            // Contact form WhatsApp integration
            const contactForm = document.getElementById('contact-form');
            if (contactForm) {
                contactForm.removeEventListener('submit', this.handleContactFormSubmit);
                contactForm.addEventListener('submit', (e) => {
                    e.preventDefault();
                    this.handleContactForm(contactForm);
                });
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initButtons);
        } else {
            initButtons();
        }
    }

    // Open WhatsApp with custom message
    openWhatsApp(productName = '', customMessage = '') {
        let message = customMessage || this.defaultMessage;
        
        if (productName && !customMessage) {
            message = `🛍️ *GLAMSBEATZ INQUIRY*

Hello! I'm interested in the "${productName}" from your Glamsbeatz collection.

💬 Could you please provide:
• Current pricing
• Availability status
• Product details
• Delivery options

Thank you!`;
        }

        const whatsappUrl = `https://wa.me/${this.phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }

    // Handle contact form submission
    handleContactForm(form) {
        const formData = new FormData(form);
        const name = formData.get('name');
        const email = formData.get('email');
        const phone = formData.get('phone');
        const interest = formData.get('interest');
        const message = formData.get('message');

        let whatsappMessage = `Hello! I'm ${name} and I'm interested in your products.\n\n`;
        whatsappMessage += `Email: ${email}\n`;
        if (phone) whatsappMessage += `Phone: ${phone}\n`;
        whatsappMessage += `Interest: ${interest}\n\n`;
        whatsappMessage += `Message: ${message}`;

        this.openWhatsApp('', whatsappMessage);
    }

    // Send product inquiry with detailed information
    sendProductInquiry(product) {
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
        
        this.openWhatsApp('', message);
    }

    // Send cart inquiry
    sendCartInquiry(cartItems) {
        let message = 'Hello! I\'m interested in the following products from Glamsbeatz:\n\n';
        cartItems.forEach((item, index) => {
            message += `${index + 1}. ${item.name} by ${item.brand}\n`;
        });
        message += '\nCould you please provide pricing and availability for these items?';
        this.openWhatsApp('', message);
    }

    // Send wishlist inquiry
    sendWishlistInquiry(wishlistItems) {
        let message = 'Hello! I\'m interested in these products from my wishlist:\n\n';
        wishlistItems.forEach((item, index) => {
            message += `${index + 1}. ${item.name} by ${item.brand}\n`;
        });
        message += '\nCould you please provide pricing and availability information?';
        this.openWhatsApp('', message);
    }
}

// Initialize WhatsApp Manager safely
let whatsappManager;
try {
    whatsappManager = new WhatsAppManager();
} catch (error) {
    console.warn('WhatsApp Manager initialization failed:', error);
}

// Global function for easy access - with fallback
function contactWhatsApp(productName = '', customMessage = '') {
    if (whatsappManager) {
        whatsappManager.openWhatsApp(productName, customMessage);
    } else {
        // Fallback direct WhatsApp opening
        const phoneNumber = '2348057882114';
        let message = customMessage || 'Hello! I\'m interested in your premium shoes and bags collection from Glamsbeatz. Could you please provide more information and pricing?';
        
        if (productName) {
            message = `Hello! I'm interested in the "${productName}" from your Glamsbeatz collection. Could you please provide more information and pricing?`;
        }
        
        const whatsappUrl = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
        window.open(whatsappUrl, '_blank');
    }
}

// Ensure global availability
window.contactWhatsApp = contactWhatsApp;
if (whatsappManager) {
    window.whatsappManager = whatsappManager;
}
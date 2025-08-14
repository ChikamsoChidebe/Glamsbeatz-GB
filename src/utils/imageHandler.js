// Image Handler Utility
class ImageHandler {
    constructor() {
        this.fallbackImage = 'images/product-001.jpeg';
        this.imageCache = new Set();
        this.init();
    }

    init() {
        // Set up global image error handling
        document.addEventListener('error', this.handleImageError.bind(this), true);
        
        // Preload critical images
        this.preloadCriticalImages();
    }

    handleImageError(event) {
        if (event.target.tagName === 'IMG') {
            const img = event.target;
            
            // Prevent infinite loop
            if (img.src.includes(this.fallbackImage)) {
                console.warn('Fallback image also failed to load:', img.src);
                this.setPlaceholderImage(img);
                return;
            }
            
            // Try fallback image
            console.warn('Image failed to load, using fallback:', img.src);
            img.src = this.fallbackImage;
        }
    }

    setPlaceholderImage(img) {
        // Create a simple placeholder using canvas
        const canvas = document.createElement('canvas');
        canvas.width = 300;
        canvas.height = 300;
        const ctx = canvas.getContext('2d');
        
        // Draw placeholder
        ctx.fillStyle = '#f0f0f0';
        ctx.fillRect(0, 0, 300, 300);
        
        ctx.fillStyle = '#999';
        ctx.font = '16px Arial';
        ctx.textAlign = 'center';
        ctx.fillText('Image Not Available', 150, 140);
        ctx.fillText('Glamsbeatz', 150, 160);
        
        img.src = canvas.toDataURL();
    }

    preloadCriticalImages() {
        const criticalImages = [
            'images/product-001.jpeg',
            'images/product-021.jpeg',
            'images/product-025.jpeg'
        ];

        criticalImages.forEach(src => {
            const img = new Image();
            img.onload = () => this.imageCache.add(src);
            img.onerror = () => console.warn('Failed to preload critical image:', src);
            img.src = src;
        });
    }

    // Utility method to safely set image source
    setSafeImageSrc(imgElement, src) {
        if (!imgElement || !src) return;
        
        imgElement.onerror = () => {
            if (!imgElement.src.includes(this.fallbackImage)) {
                imgElement.src = this.fallbackImage;
            } else {
                this.setPlaceholderImage(imgElement);
            }
        };
        
        imgElement.src = src;
    }

    // Method to validate image URLs
    validateImageUrl(url) {
        return new Promise((resolve) => {
            const img = new Image();
            img.onload = () => resolve(true);
            img.onerror = () => resolve(false);
            img.src = url;
        });
    }
}

// Initialize image handler
const imageHandler = new ImageHandler();

// Export for use in other modules
if (typeof module !== 'undefined' && module.exports) {
    module.exports = ImageHandler;
}
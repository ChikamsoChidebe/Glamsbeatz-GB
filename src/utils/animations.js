// Animation utilities
const animations = {
    // Fade in animation
    fadeIn: (element, duration = 300) => {
        element.style.opacity = '0';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            
            element.style.opacity = Math.min(progress / duration, 1);
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    },

    // Slide in from right
    slideInRight: (element, duration = 300) => {
        element.style.transform = 'translateX(100%)';
        element.style.display = 'block';
        
        let start = null;
        const animate = (timestamp) => {
            if (!start) start = timestamp;
            const progress = timestamp - start;
            const percentage = Math.min(progress / duration, 1);
            
            element.style.transform = `translateX(${100 - (percentage * 100)}%)`;
            
            if (progress < duration) {
                requestAnimationFrame(animate);
            }
        };
        
        requestAnimationFrame(animate);
    }
};

// Add CSS for animations
const style = document.createElement('style');
style.textContent = `
    @keyframes slideInRight {
        from { transform: translateX(100%); }
        to { transform: translateX(0); }
    }
    
    @keyframes slideOutRight {
        from { transform: translateX(0); }
        to { transform: translateX(100%); }
    }
    
    .fade-in {
        animation: fadeIn 0.6s ease-in-out;
    }
    
    @keyframes fadeIn {
        from { opacity: 0; transform: translateY(20px); }
        to { opacity: 1; transform: translateY(0); }
    }
`;
document.head.appendChild(style);
// Main application initialization
class GlamsbeatzApp {
    constructor() {
        this.init();
    }

    init() {
        // Use both DOMContentLoaded and immediate execution for compatibility
        const initApp = () => {
            try {
                this.setupNavigation();
                this.setupHeroSlider();
                this.setupScrollEffects();
                this.setupMobileMenu();
                this.setupBackToTop();
                this.setupLoadingScreen();
                this.initializeWishlist();
            } catch (error) {
                console.warn('Some app features failed to initialize:', error);
            }
        };

        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', initApp);
        } else {
            initApp();
        }
    }

    setupNavigation() {
        // Smooth scrolling for navigation links
        const navLinks = document.querySelectorAll('a[href^="#"]');
        navLinks.forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                const targetId = link.getAttribute('href').substring(1);
                helpers.scrollToElement(targetId);
            });
        });

        // Active navigation highlighting
        window.addEventListener('scroll', () => {
            const sections = document.querySelectorAll('section[id]');
            const navLinks = document.querySelectorAll('.nav-link');
            
            let current = '';
            sections.forEach(section => {
                const sectionTop = section.offsetTop;
                const sectionHeight = section.clientHeight;
                if (window.pageYOffset >= sectionTop - 200) {
                    current = section.getAttribute('id');
                }
            });

            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${current}`) {
                    link.classList.add('active');
                }
            });
        });
    }

    setupHeroSlider() {
        const slides = document.querySelectorAll('.hero-slide');
        const indicators = document.querySelectorAll('.indicator');
        const prevBtn = document.getElementById('hero-prev');
        const nextBtn = document.getElementById('hero-next');
        
        if (!slides.length) return;

        let currentSlide = 0;
        const totalSlides = slides.length;

        const showSlide = (index) => {
            slides.forEach(slide => slide.classList.remove('active'));
            indicators.forEach(indicator => indicator.classList.remove('active'));
            
            slides[index].classList.add('active');
            indicators[index].classList.add('active');
        };

        const nextSlide = () => {
            currentSlide = (currentSlide + 1) % totalSlides;
            showSlide(currentSlide);
        };

        const prevSlide = () => {
            currentSlide = (currentSlide - 1 + totalSlides) % totalSlides;
            showSlide(currentSlide);
        };

        // Event listeners
        if (nextBtn) nextBtn.addEventListener('click', nextSlide);
        if (prevBtn) prevBtn.addEventListener('click', prevSlide);

        indicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                currentSlide = index;
                showSlide(currentSlide);
            });
        });

        // Auto-slide
        setInterval(nextSlide, 5000);
    }

    setupScrollEffects() {
        // Header scroll effect
        const header = document.getElementById('header');
        if (header) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 100) {
                    header.classList.add('scrolled');
                } else {
                    header.classList.remove('scrolled');
                }
            });
        }

        // Fade in animation for elements
        const observerOptions = {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        };

        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('fade-in');
                }
            });
        }, observerOptions);

        // Observe elements for fade-in animation
        const elementsToObserve = document.querySelectorAll('.feature-card, .collection-card, .product-card, .about-feature');
        elementsToObserve.forEach(el => observer.observe(el));
    }

    setupMobileMenu() {
        const hamburger = document.getElementById('hamburger');
        const navMenu = document.getElementById('nav-menu');
        
        if (hamburger && navMenu) {
            hamburger.addEventListener('click', () => {
                hamburger.classList.toggle('active');
                navMenu.classList.toggle('active');
            });

            // Close menu when clicking on a link
            const navLinks = navMenu.querySelectorAll('.nav-link');
            navLinks.forEach(link => {
                link.addEventListener('click', () => {
                    hamburger.classList.remove('active');
                    navMenu.classList.remove('active');
                });
            });
        }
    }

    setupBackToTop() {
        const backToTopBtn = document.getElementById('back-to-top');
        
        if (backToTopBtn) {
            window.addEventListener('scroll', () => {
                if (window.scrollY > 300) {
                    backToTopBtn.classList.add('visible');
                } else {
                    backToTopBtn.classList.remove('visible');
                }
            });

            backToTopBtn.addEventListener('click', () => {
                window.scrollTo({
                    top: 0,
                    behavior: 'smooth'
                });
            });
        }
    }

    setupLoadingScreen() {
        const loadingScreen = document.getElementById('loading-screen');
        
        if (loadingScreen) {
            window.addEventListener('load', () => {
                setTimeout(() => {
                    loadingScreen.style.opacity = '0';
                    setTimeout(() => {
                        loadingScreen.style.display = 'none';
                    }, 500);
                }, 1000);
            });
        }
    }

    initializeWishlist() {
        // Initialize wishlist count
        const wishlistCount = document.getElementById('wishlist-count');
        if (wishlistCount) {
            const wishlist = helpers.storage.get('glamsbeatz_wishlist', []);
            wishlistCount.textContent = wishlist.length;
        }
    }
}

// Search functionality
class SearchManager {
    constructor() {
        this.setupSearch();
    }

    setupSearch() {
        const searchInput = document.getElementById('search-input');
        const searchBtn = document.querySelector('.search-btn');
        
        if (searchInput) {
            const debouncedSearch = helpers.debounce(this.performSearch.bind(this), 300);
            searchInput.addEventListener('input', debouncedSearch);
            
            if (searchBtn) {
                searchBtn.addEventListener('click', () => this.performSearch(searchInput.value));
            }
        }
    }

    performSearch(query) {
        if (!query.trim()) return;
        
        // Redirect to products page with search query
        window.location.href = `products.html?search=${encodeURIComponent(query)}`;
    }
}

// Initialize application with Supabase
document.addEventListener('DOMContentLoaded', async () => {
    // Load products from Supabase if available
    if (typeof productManager !== 'undefined') {
        try {
            const supabaseProducts = await productManager.loadProducts();
            if (typeof products !== 'undefined' && supabaseProducts.length > 0) {
                products.length = 0;
                products.push(...supabaseProducts);
            }
        } catch (error) {
            console.warn('Failed to load from Supabase:', error);
        }
    }
});

// Initialize application
const app = new GlamsbeatzApp();
const searchManager = new SearchManager();

// Global utility functions
window.scrollToSection = (sectionId) => {
    helpers.scrollToElement(sectionId);
};

// Handle URL parameters on products page
if (window.location.pathname.includes('products.html')) {
    document.addEventListener('DOMContentLoaded', () => {
        const urlParams = new URLSearchParams(window.location.search);
        const filter = urlParams.get('filter');
        const search = urlParams.get('search');
        
        if (filter) {
            const filterBtn = document.querySelector(`[data-filter="${filter}"]`);
            if (filterBtn) {
                filterBtn.click();
            }
        }
        
        if (search) {
            const searchInput = document.getElementById('product-search');
            if (searchInput) {
                searchInput.value = search;
                searchInput.dispatchEvent(new Event('input'));
            }
        }
    });
}
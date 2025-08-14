// Supabase Configuration and API
class SupabaseClient {
    constructor() {
        // Replace with your Supabase credentials
        this.supabaseUrl = 'https://ctgywhojariodwlhzrbu.supabase.co';
        this.supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImN0Z3l3aG9qYXJpb2R3bGh6cmJ1Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NTUxNTk2MDksImV4cCI6MjA3MDczNTYwOX0.xdCgxAWejAGaVn_PSDbAnFAwxdptS_Mx95gCvr2SMig';
        this.headers = {
            'Content-Type': 'application/json',
            'apikey': this.supabaseKey,
            'Authorization': `Bearer ${this.supabaseKey}`
        };
    }

    // Fetch all products from Supabase
    async getProducts() {
        try {
            const response = await fetch(`${this.supabaseUrl}/rest/v1/products?select=*`, {
                method: 'GET',
                headers: this.headers
            });
            
            if (!response.ok) throw new Error('Failed to fetch products');
            return await response.json();
        } catch (error) {
            console.error('Error fetching products:', error);
            return [];
        }
    }

    // Add new product to Supabase
    async addProduct(product) {
        try {
            const response = await fetch(`${this.supabaseUrl}/rest/v1/products`, {
                method: 'POST',
                headers: this.headers,
                body: JSON.stringify(product)
            });
            
            if (!response.ok) {
                const errorText = await response.text();
                throw new Error(`Failed to add product: ${response.status} ${errorText}`);
            }
            
            const responseText = await response.text();
            return responseText ? JSON.parse(responseText) : product;
        } catch (error) {
            console.error('Error adding product:', error);
            throw error;
        }
    }

    // Update existing product
    async updateProduct(id, product) {
        try {
            const response = await fetch(`${this.supabaseUrl}/rest/v1/products?id=eq.${id}`, {
                method: 'PATCH',
                headers: this.headers,
                body: JSON.stringify(product)
            });
            
            if (!response.ok) throw new Error('Failed to update product');
            return await response.json();
        } catch (error) {
            console.error('Error updating product:', error);
            throw error;
        }
    }

    // Delete product from Supabase
    async deleteProduct(id) {
        try {
            const response = await fetch(`${this.supabaseUrl}/rest/v1/products?id=eq.${id}`, {
                method: 'DELETE',
                headers: this.headers
            });
            
            if (!response.ok) throw new Error('Failed to delete product');
            return true;
        } catch (error) {
            console.error('Error deleting product:', error);
            throw error;
        }
    }

    // Upload image to Supabase Storage
    async uploadImage(file, fileName) {
        try {
            const formData = new FormData();
            formData.append('file', file);
            
            const response = await fetch(`${this.supabaseUrl}/storage/v1/object/product-images/${fileName}`, {
                method: 'POST',
                headers: {
                    'Authorization': `Bearer ${this.supabaseKey}`
                },
                body: formData
            });
            
            if (!response.ok) throw new Error('Failed to upload image');
            
            // Return public URL
            return `${this.supabaseUrl}/storage/v1/object/public/product-images/${fileName}`;
        } catch (error) {
            console.error('Error uploading image:', error);
            throw error;
        }
    }
}

// Initialize Supabase client
const supabase = new SupabaseClient();

// Product Manager with Supabase integration
class ProductManager {
    constructor() {
        this.products = [];
        this.isOnline = navigator.onLine;
        this.setupOfflineHandling();
    }

    // Setup offline/online handling
    setupOfflineHandling() {
        window.addEventListener('online', () => {
            this.isOnline = true;
            this.syncOfflineChanges();
        });
        
        window.addEventListener('offline', () => {
            this.isOnline = false;
        });
    }

    // Load products (from Supabase or localStorage fallback)
    async loadProducts() {
        if (this.isOnline) {
            try {
                this.products = await supabase.getProducts();
                // Cache in localStorage for offline use
                localStorage.setItem('glamsbeatz_products_cache', JSON.stringify(this.products));
                return this.products;
            } catch (error) {
                console.warn('Failed to load from Supabase, using cache:', error);
                return this.loadFromCache();
            }
        } else {
            return this.loadFromCache();
        }
    }

    // Load from localStorage cache
    loadFromCache() {
        const cached = localStorage.getItem('glamsbeatz_products_cache');
        this.products = cached ? JSON.parse(cached) : [];
        return this.products;
    }

    // Add product
    async addProduct(productData) {
        const product = {
            ...productData,
            id: Date.now().toString(),
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString()
        };

        if (this.isOnline) {
            try {
                await supabase.addProduct(product);
                this.products.push(product);
                this.updateCache();
                return product;
            } catch (error) {
                // Store for later sync
                this.storeOfflineChange('add', product);
                throw error;
            }
        } else {
            // Store offline
            this.storeOfflineChange('add', product);
            this.products.push(product);
            this.updateCache();
            return product;
        }
    }

    // Update product
    async updateProduct(id, updates) {
        const product = { ...updates, updated_at: new Date().toISOString() };
        
        if (this.isOnline) {
            try {
                await supabase.updateProduct(id, product);
                const index = this.products.findIndex(p => p.id === id);
                if (index > -1) {
                    this.products[index] = { ...this.products[index], ...product };
                }
                this.updateCache();
                return product;
            } catch (error) {
                this.storeOfflineChange('update', { id, ...product });
                throw error;
            }
        } else {
            this.storeOfflineChange('update', { id, ...product });
            const index = this.products.findIndex(p => p.id === id);
            if (index > -1) {
                this.products[index] = { ...this.products[index], ...product };
            }
            this.updateCache();
            return product;
        }
    }

    // Delete product
    async deleteProduct(id) {
        if (this.isOnline) {
            try {
                await supabase.deleteProduct(id);
                this.products = this.products.filter(p => p.id !== id);
                this.updateCache();
                return true;
            } catch (error) {
                this.storeOfflineChange('delete', { id });
                throw error;
            }
        } else {
            this.storeOfflineChange('delete', { id });
            this.products = this.products.filter(p => p.id !== id);
            this.updateCache();
            return true;
        }
    }

    // Upload images
    async uploadImages(files) {
        const uploadPromises = files.map(async (file, index) => {
            const fileName = `${Date.now()}-${index}-${file.name}`;
            return await supabase.uploadImage(file, fileName);
        });
        
        return await Promise.all(uploadPromises);
    }

    // Store offline changes
    storeOfflineChange(action, data) {
        const offlineChanges = JSON.parse(localStorage.getItem('glamsbeatz_offline_changes') || '[]');
        offlineChanges.push({ action, data, timestamp: Date.now() });
        localStorage.setItem('glamsbeatz_offline_changes', JSON.stringify(offlineChanges));
    }

    // Sync offline changes when back online
    async syncOfflineChanges() {
        const offlineChanges = JSON.parse(localStorage.getItem('glamsbeatz_offline_changes') || '[]');
        
        for (const change of offlineChanges) {
            try {
                switch (change.action) {
                    case 'add':
                        await supabase.addProduct(change.data);
                        break;
                    case 'update':
                        await supabase.updateProduct(change.data.id, change.data);
                        break;
                    case 'delete':
                        await supabase.deleteProduct(change.data.id);
                        break;
                }
            } catch (error) {
                console.error('Failed to sync change:', change, error);
            }
        }
        
        // Clear offline changes after sync
        localStorage.removeItem('glamsbeatz_offline_changes');
        
        // Reload products to get latest state
        await this.loadProducts();
    }

    // Update cache
    updateCache() {
        localStorage.setItem('glamsbeatz_products_cache', JSON.stringify(this.products));
    }

    // Get products by type
    getProductsByType(type) {
        return this.products.filter(p => p.type === type);
    }

    // Search products
    searchProducts(query) {
        const searchTerm = query.toLowerCase();
        return this.products.filter(p => 
            p.name.toLowerCase().includes(searchTerm) ||
            p.brand.toLowerCase().includes(searchTerm) ||
            p.tags.some(tag => tag.toLowerCase().includes(searchTerm))
        );
    }
}

// Initialize global product manager
const productManager = new ProductManager();

// Export for use in other files
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { supabase, productManager, ProductManager };
}
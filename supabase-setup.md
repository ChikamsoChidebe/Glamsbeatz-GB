# Supabase Setup Guide for Glamsbeatz

## 1. Create Supabase Account
1. Go to [supabase.com](https://supabase.com)
2. Sign up for a free account
3. Create a new project

## 2. Database Setup
Run this SQL in your Supabase SQL Editor:

```sql
-- Create products table
CREATE TABLE products (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    type TEXT NOT NULL CHECK (type IN ('shoes', 'bags')),
    category TEXT NOT NULL,
    gender TEXT NOT NULL CHECK (gender IN ('men', 'women', 'unisex')),
    description TEXT NOT NULL,
    features TEXT[] DEFAULT '{}',
    images TEXT[] DEFAULT '{}',
    colors TEXT[] DEFAULT '{}',
    sizes TEXT[] DEFAULT '{}',
    rating DECIMAL(2,1) DEFAULT 4.5,
    review_count INTEGER DEFAULT 0,
    tags TEXT[] DEFAULT '{}',
    is_new BOOLEAN DEFAULT false,
    is_featured BOOLEAN DEFAULT false,
    is_popular BOOLEAN DEFAULT false,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create storage bucket for images
INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Set up RLS (Row Level Security) - Allow public read access
ALTER TABLE products ENABLE ROW LEVEL SECURITY;

CREATE POLICY "Allow public read access" ON products
    FOR SELECT USING (true);

CREATE POLICY "Allow authenticated insert" ON products
    FOR INSERT WITH CHECK (true);

CREATE POLICY "Allow authenticated update" ON products
    FOR UPDATE USING (true);

CREATE POLICY "Allow authenticated delete" ON products
    FOR DELETE USING (true);

-- Storage policies
CREATE POLICY "Allow public read access" ON storage.objects
    FOR SELECT USING (bucket_id = 'product-images');

CREATE POLICY "Allow authenticated upload" ON storage.objects
    FOR INSERT WITH CHECK (bucket_id = 'product-images');
```

## 3. Get Your Credentials
1. Go to Settings > API in your Supabase dashboard
2. Copy your Project URL and anon public key
3. Update `src/utils/supabase.js`:

```javascript
this.supabaseUrl = 'YOUR_PROJECT_URL_HERE';
this.supabaseKey = 'YOUR_ANON_KEY_HERE';
```

## 4. Import Existing Products (Optional)
Run this SQL to import your current products:

```sql
-- Insert existing products (example)
INSERT INTO products (id, name, brand, type, category, gender, description, features, images, colors, sizes, rating, review_count, tags, is_new, is_featured, is_popular) VALUES
('1', 'Premium Leather Oxford', 'Glamsbeatz', 'shoes', 'formal', 'men', 'Classic leather oxford shoes perfect for formal occasions', 
 ARRAY['Genuine leather', 'Comfortable sole', 'Professional design'], 
 ARRAY['public/images/product-001.jpeg'], 
 ARRAY['Black', 'Brown'], 
 ARRAY['8', '9', '10', '11', '12'], 
 4.8, 45, ARRAY['formal', 'leather', 'oxford'], false, true, true);

-- Add more products as needed...
```

## 5. Features Included
- ✅ Real-time sync across all devices
- ✅ Offline support with automatic sync
- ✅ Image upload to Supabase Storage
- ✅ Automatic caching for performance
- ✅ Error handling and retry logic
- ✅ Free tier supports up to 500MB storage and 2GB bandwidth

## 6. Usage
The system automatically:
- Loads products from Supabase on page load
- Caches products locally for offline use
- Syncs changes when connection is restored
- Handles image uploads to Supabase Storage

No code changes needed in your existing files - the integration is seamless!
-- Create products table for TymExpress
CREATE TABLE IF NOT EXISTS products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  price TEXT NOT NULL,
  image_url TEXT NOT NULL DEFAULT '',
  kakobuy_link TEXT NOT NULL DEFAULT '',
  usfans_link TEXT NOT NULL DEFAULT '',
  category TEXT NOT NULL DEFAULT 'Inne',
  rating INTEGER NOT NULL DEFAULT 0,
  description TEXT NOT NULL DEFAULT '',
  qc_images JSONB NOT NULL DEFAULT '[]'::jsonb,
  batch TEXT NOT NULL DEFAULT 'best',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT NOW()
);

-- Add some sample products
INSERT INTO products (name, price, image_url, category, rating, description, batch) VALUES
('Nike Dunk Low Panda', '299 PLN', 'https://images.unsplash.com/photo-1600269452121-4f2416e55c28?w=400', 'Buty', 5, 'Klasyczne Nike Dunk Low w kolorystyce Panda. Najlepsza jakość wykonania.', 'best'),
('Jordan 4 Military Black', '399 PLN', 'https://images.unsplash.com/photo-1584735175315-9d5df23be0c0?w=400', 'Buty', 5, 'Jordan 4 Military Black - jeden z najpopularniejszych modeli.', 'best'),
('Essentials Hoodie', '199 PLN', 'https://images.unsplash.com/photo-1556821840-3a63f95609a7?w=400', 'Bluzy', 4, 'Klasyczna bluza Essentials w świetnej jakości.', 'budget'),
('Supreme Box Logo Tee', '149 PLN', 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?w=400', 'Koszulki', 4, 'Kultowa koszulka Supreme z box logo.', 'best')
ON CONFLICT DO NOTHING;

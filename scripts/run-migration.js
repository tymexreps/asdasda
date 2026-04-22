import pg from 'pg';

const { Pool } = pg;

const pool = new Pool({
  connectionString: process.env.POSTGRES_URL,
  ssl: { rejectUnauthorized: false },
});

async function runMigration() {
  const client = await pool.connect();
  try {
    await client.query(`
      CREATE TABLE IF NOT EXISTS products (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        description TEXT NOT NULL,
        price NUMERIC(10, 2) NOT NULL,
        stock INTEGER NOT NULL DEFAULT 0,
        category TEXT NOT NULL,
        image_url TEXT,
        created_at TIMESTAMP DEFAULT NOW()
      );
    `);
    console.log('Products table created successfully!');
    
    // Check if table is empty and seed with sample data
    const result = await client.query('SELECT COUNT(*) FROM products');
    if (parseInt(result.rows[0].count) === 0) {
      await client.query(`
        INSERT INTO products (name, description, price, stock, category, image_url) VALUES
        ('iPhone 15 Pro', 'Najnowszy smartfon Apple z chipem A17 Pro', 5499.00, 25, 'Elektronika', 'https://images.unsplash.com/photo-1695048133142-1a20484d2569?w=400'),
        ('MacBook Air M3', 'Ultralekki laptop z chipem M3', 6299.00, 15, 'Komputery', 'https://images.unsplash.com/photo-1517336714731-489689fd1ca8?w=400'),
        ('AirPods Pro 2', 'Słuchawki bezprzewodowe z aktywną redukcją szumów', 1299.00, 50, 'Akcesoria', 'https://images.unsplash.com/photo-1600294037681-c80b4cb5b434?w=400'),
        ('Samsung Galaxy S24', 'Flagowy smartfon Samsung z AI', 4299.00, 30, 'Elektronika', 'https://images.unsplash.com/photo-1610945265064-0e34e5519bbf?w=400'),
        ('Sony WH-1000XM5', 'Słuchawki nauszne z najlepszą redukcją szumów', 1799.00, 20, 'Akcesoria', 'https://images.unsplash.com/photo-1618366712010-f4ae9c647dcb?w=400');
      `);
      console.log('Sample products inserted!');
    }
  } finally {
    client.release();
    await pool.end();
  }
}

runMigration().catch(console.error);

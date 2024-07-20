const { createPool } = require('@vercel/postgres');
require('dotenv').config({ path: '.env.development.local' }); // Load environment variables from .env.development.local

const pool = createPool({
  connectionString: process.env.POSTGRES_URL,
  ssl: {
    rejectUnauthorized: false
  }
});

const createUsersTableQuery = `
  CREATE TABLE IF NOT EXISTS users (
    id SERIAL PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) UNIQUE NOT NULL,
    password VARCHAR(100) NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
  );
`;

const createMessagesTableQuery = `
  CREATE TABLE IF NOT EXISTS message (
    id SERIAL PRIMARY KEY,
    message TEXT NOT NULL,
    image TEXT
  );
`;

async function connectDB() {
  try {
    const client = await pool.connect();
    console.log('Connected to Vercel PostgreSQL');

    // Execute the createUsersTableQuery
    await client.query(createUsersTableQuery);
    console.log('Table "users" created or already exists');

    // Execute the createMessagesTableQuery
    await client.query(createMessagesTableQuery);
    console.log('Table "message" created or already exists');

    client.release(); // Release the client back to the pool
  } catch (err) {
    console.error('Error connecting to Vercel PostgreSQL:', err);
  }
}

module.exports = {
  pool,
  connectDB
};

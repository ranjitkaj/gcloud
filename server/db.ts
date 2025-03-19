import { drizzle } from 'drizzle-orm/node-postgres';
import { migrate } from 'drizzle-orm/node-postgres/migrator';
import * as schema from '@shared/schema';
import { Pool } from 'pg';
import { log } from './vite';

// Create a PostgreSQL connection pool
export const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

// Create a drizzle instance with the schema
export const db = drizzle(pool, { schema });

// Run migrations (this should be done once when the app starts)
export async function runMigrations() {
  try {
    log('Running database migrations...', 'database');
    // Uncomment this when there are actual migrations in the migrations folder
    // await migrate(db, { migrationsFolder: './migrations' });
    log('Database migrations completed successfully', 'database');
  } catch (error) {
    log(`Error running migrations: ${error}`, 'database');
    throw error;
  }
}

// Initialize the database (create tables if they don't exist)
export async function initializeDatabase() {
  try {
    log('Initializing database...', 'database');

    // Manually create tables if they don't exist
    // This is a temporary solution until we have proper migrations
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        username TEXT NOT NULL UNIQUE,
        password TEXT NOT NULL,
        name TEXT NOT NULL,
        email TEXT NOT NULL UNIQUE,
        phone TEXT,
        role TEXT NOT NULL DEFAULT 'buyer',
        avatar TEXT,
        bio TEXT,
        verified BOOLEAN DEFAULT FALSE,
        email_verified BOOLEAN DEFAULT FALSE,
        phone_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS otps (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        otp TEXT NOT NULL,
        type TEXT NOT NULL,
        expires_at TIMESTAMP NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        verified BOOLEAN DEFAULT FALSE
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        property_id INTEGER NOT NULL,
        agent_id INTEGER,
        booking_date TIMESTAMP NOT NULL,
        status TEXT NOT NULL DEFAULT 'pending',
        verification_code TEXT,
        message TEXT,
        is_verified BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS companies (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        logo TEXT,
        description TEXT,
        address TEXT,
        city TEXT,
        state TEXT,
        zip TEXT,
        phone TEXT,
        email TEXT,
        website TEXT,
        founded_year INTEGER,
        employee_count INTEGER,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS agents (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        company_id INTEGER,
        license_number TEXT,
        specialization TEXT,
        years_of_experience INTEGER,
        areas_served TEXT[],
        average_rating DOUBLE PRECISION DEFAULT 0,
        review_count INTEGER DEFAULT 0,
        featured BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS properties (
        id SERIAL PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        price DOUBLE PRECISION NOT NULL,
        property_type TEXT NOT NULL,
        status TEXT NOT NULL DEFAULT 'available',
        rent_or_sale TEXT NOT NULL,
        bedrooms INTEGER,
        bathrooms INTEGER,
        area DOUBLE PRECISION,
        address TEXT,
        city TEXT,
        state TEXT,
        zip TEXT,
        latitude DOUBLE PRECISION,
        longitude DOUBLE PRECISION,
        images TEXT[],
        amenities TEXT[],
        features TEXT[],
        user_id INTEGER NOT NULL,
        agent_id INTEGER,
        company_id INTEGER,
        featured BOOLEAN DEFAULT FALSE,
        premium BOOLEAN DEFAULT FALSE,
        approved TEXT DEFAULT 'pending',
        subscription_level TEXT DEFAULT 'free',
        expires_at TIMESTAMP,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS property_recommendations (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        property_id INTEGER NOT NULL,
        score DOUBLE PRECISION NOT NULL,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS property_views (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        property_id INTEGER NOT NULL,
        viewed_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS saved_properties (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        property_id INTEGER NOT NULL,
        saved_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS inquiries (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        property_id INTEGER NOT NULL,
        recipient_id INTEGER NOT NULL,
        message TEXT NOT NULL,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS agent_reviews (
        id SERIAL PRIMARY KEY,
        agent_id INTEGER NOT NULL,
        user_id INTEGER NOT NULL,
        rating INTEGER NOT NULL,
        review TEXT,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );

      CREATE TABLE IF NOT EXISTS notifications (
        id SERIAL PRIMARY KEY,
        user_id INTEGER NOT NULL,
        title TEXT NOT NULL,
        message TEXT NOT NULL,
        type TEXT NOT NULL,
        reference_id INTEGER,
        reference_type TEXT,
        is_read BOOLEAN DEFAULT FALSE,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    log('Database initialized successfully', 'database');
  } catch (error) {
    log(`Error initializing database: ${error}`, 'database');
    throw error;
  }
}
import { users, properties, type User, type InsertUser, type Property, type InsertProperty } from "@shared/schema";
import session from "express-session";
import createMemoryStore from "memorystore";

const MemoryStore = createMemoryStore(session);

export interface IStorage {
  // User operations
  getUser(id: number): Promise<User | undefined>;
  getUserByUsername(username: string): Promise<User | undefined>;
  getUserByEmail(email: string): Promise<User | undefined>;
  createUser(user: InsertUser): Promise<User>;

  // Property operations
  createProperty(property: InsertProperty): Promise<Property>;
  getProperty(id: number): Promise<Property | undefined>;
  getAllProperties(): Promise<Property[]>;
  getPropertiesByUser(userId: number): Promise<Property[]>;
  getFeaturedProperties(limit?: number): Promise<Property[]>;
  getPropertiesByType(propertyType: string): Promise<Property[]>;
  searchProperties(query: {
    city?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
  }): Promise<Property[]>;
  
  // Session store
  sessionStore: session.SessionStore;
}

export class MemStorage implements IStorage {
  private users: Map<number, User>;
  private properties: Map<number, Property>;
  sessionStore: session.SessionStore;
  userIdCounter: number;
  propertyIdCounter: number;

  constructor() {
    this.users = new Map();
    this.properties = new Map();
    this.userIdCounter = 1;
    this.propertyIdCounter = 1;
    this.sessionStore = new MemoryStore({
      checkPeriod: 86400000, // prune expired entries every 24h
    });
  }

  async getUser(id: number): Promise<User | undefined> {
    return this.users.get(id);
  }

  async getUserByUsername(username: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.username === username,
    );
  }

  async getUserByEmail(email: string): Promise<User | undefined> {
    return Array.from(this.users.values()).find(
      (user) => user.email === email,
    );
  }

  async createUser(insertUser: InsertUser): Promise<User> {
    const id = this.userIdCounter++;
    const now = new Date();
    const user: User = { ...insertUser, id, createdAt: now };
    this.users.set(id, user);
    return user;
  }

  async createProperty(insertProperty: InsertProperty): Promise<Property> {
    const id = this.propertyIdCounter++;
    const now = new Date();
    const property: Property = { ...insertProperty, id, createdAt: now };
    this.properties.set(id, property);
    return property;
  }

  async getProperty(id: number): Promise<Property | undefined> {
    return this.properties.get(id);
  }

  async getAllProperties(): Promise<Property[]> {
    return Array.from(this.properties.values());
  }

  async getPropertiesByUser(userId: number): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.userId === userId,
    );
  }

  async getFeaturedProperties(limit: number = 6): Promise<Property[]> {
    const featured = Array.from(this.properties.values())
      .filter((property) => property.featured)
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
      
    return featured.slice(0, limit);
  }

  async getPropertiesByType(propertyType: string): Promise<Property[]> {
    return Array.from(this.properties.values()).filter(
      (property) => property.propertyType === propertyType,
    );
  }

  async searchProperties(query: {
    city?: string;
    propertyType?: string;
    minPrice?: number;
    maxPrice?: number;
    minBedrooms?: number;
  }): Promise<Property[]> {
    return Array.from(this.properties.values()).filter((property) => {
      if (query.city && !property.city.toLowerCase().includes(query.city.toLowerCase())) {
        return false;
      }
      
      if (query.propertyType && property.propertyType !== query.propertyType) {
        return false;
      }
      
      if (query.minPrice && property.price < query.minPrice) {
        return false;
      }
      
      if (query.maxPrice && property.price > query.maxPrice) {
        return false;
      }
      
      if (query.minBedrooms && (!property.bedrooms || property.bedrooms < query.minBedrooms)) {
        return false;
      }
      
      return true;
    });
  }
}

export const storage = new MemStorage();

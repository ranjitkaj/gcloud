import { pgTable, text, serial, integer, boolean, timestamp, doublePrecision, uniqueIndex } from "drizzle-orm/pg-core";
import { createInsertSchema } from "drizzle-zod";
import { z } from "zod";

// User roles
export const userRoles = [
  "buyer",
  "seller",
  "agent",
  "company_admin",
] as const;

export const users = pgTable("users", {
  id: serial("id").primaryKey(),
  username: text("username").notNull().unique(),
  password: text("password").notNull(),
  name: text("name").notNull(),
  email: text("email").notNull().unique(),
  phone: text("phone"),
  role: text("role").notNull().default("buyer"),
  avatar: text("avatar"),
  bio: text("bio"),
  verified: boolean("verified").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

// Companies (Real Estate Agencies)
export const companies = pgTable("companies", {
  id: serial("id").primaryKey(),
  name: text("name").notNull(),
  description: text("description").notNull(),
  logo: text("logo"),
  website: text("website"),
  address: text("address").notNull(),
  city: text("city").notNull(),
  phone: text("phone").notNull(),
  email: text("email").notNull().unique(),
  establishedYear: integer("established_year"),
  verified: boolean("verified").default(false),
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
  adminId: integer("admin_id").notNull(), // References the user who administers this company
});

// Agents
export const agents = pgTable("agents", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull().unique(), // References the user entity
  companyId: integer("company_id"), // Optional company association
  licenseNumber: text("license_number").notNull().unique(),
  specializations: text("specializations").array(),
  yearsOfExperience: integer("years_of_experience").default(0),
  rating: doublePrecision("rating"),
  reviewCount: integer("review_count").default(0),
  areas: text("areas").array(), // Areas/neighborhoods the agent specializes in
  featured: boolean("featured").default(false),
  createdAt: timestamp("created_at").defaultNow(),
});

export const propertyTypes = [
  "apartment",
  "house",
  "villa",
  "plot",
  "commercial",
  "office",
  "retail",
  "warehouse",
  "farmland",
] as const;

export const propertyStatus = [
  "for_sale",
  "for_rent",
  "sold",
  "rented",
  "under_contract",
] as const;

export const properties = pgTable("properties", {
  id: serial("id").primaryKey(),
  title: text("title").notNull(),
  description: text("description").notNull(),
  price: integer("price").notNull(),
  rentOrSale: text("rent_or_sale").notNull().default("for_sale"),
  status: text("status").notNull().default("for_sale"), 
  location: text("location").notNull(),
  city: text("city").notNull(),
  address: text("address").notNull(),
  propertyType: text("property_type").notNull(),
  bedrooms: integer("bedrooms"),
  bathrooms: integer("bathrooms"),
  area: integer("area").notNull(),
  yearBuilt: integer("year_built"),
  userId: integer("user_id").notNull(), // Owner/seller
  agentId: integer("agent_id"), // Optional assigned agent
  companyId: integer("company_id"), // Optional company listing
  featured: boolean("featured").default(false),
  verified: boolean("verified").default(false),
  premium: boolean("premium").default(false), // Premium listing (paid promotion)
  amenities: text("amenities").array(),
  imageUrls: text("image_urls").array(),
  virtualTourUrl: text("virtual_tour_url"),
  floorPlanUrl: text("floor_plan_url"),
  createdAt: timestamp("created_at").defaultNow(),
  expiresAt: timestamp("expires_at"),
  latitude: doublePrecision("latitude"),
  longitude: doublePrecision("longitude"),
});

// Property Recommendations
export const propertyRecommendations = pgTable("property_recommendations", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
  score: doublePrecision("score").notNull(),
  createdAt: timestamp("created_at").defaultNow(),
});

// Property Views (for tracking user behavior and recommendations)
export const propertyViews = pgTable("property_views", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
  viewedAt: timestamp("viewed_at").defaultNow(),
});

// Saved Properties (favorites/bookmarks)
export const savedProperties = pgTable("saved_properties", {
  id: serial("id").primaryKey(),
  userId: integer("user_id").notNull(),
  propertyId: integer("property_id").notNull(),
  savedAt: timestamp("saved_at").defaultNow(),
});

// Property Inquiries/Messages
export const inquiries = pgTable("inquiries", {
  id: serial("id").primaryKey(),
  propertyId: integer("property_id").notNull(),
  fromUserId: integer("from_user_id").notNull(),
  toUserId: integer("to_user_id").notNull(),
  message: text("message").notNull(),
  status: text("status").default("unread"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Reviews for agents
export const agentReviews = pgTable("agent_reviews", {
  id: serial("id").primaryKey(),
  agentId: integer("agent_id").notNull(),
  userId: integer("user_id").notNull(),
  rating: integer("rating").notNull(),
  review: text("review"),
  createdAt: timestamp("created_at").defaultNow(),
});

// Insert schemas
export const insertUserSchema = createInsertSchema(users).pick({
  username: true,
  password: true,
  name: true,
  email: true,
  phone: true,
  role: true,
  avatar: true,
  bio: true,
});

export const insertCompanySchema = createInsertSchema(companies).omit({
  id: true,
  createdAt: true,
});

export const insertAgentSchema = createInsertSchema(agents).omit({
  id: true,
  createdAt: true,
});

export const insertPropertySchema = createInsertSchema(properties).omit({
  id: true,
  createdAt: true,
  expiresAt: true,
});

export const insertInquirySchema = createInsertSchema(inquiries).omit({
  id: true,
  createdAt: true,
});

export const insertAgentReviewSchema = createInsertSchema(agentReviews).omit({
  id: true,
  createdAt: true,
});

// Export types
export type InsertUser = z.infer<typeof insertUserSchema>;
export type User = typeof users.$inferSelect;

export type InsertCompany = z.infer<typeof insertCompanySchema>;
export type Company = typeof companies.$inferSelect;

export type InsertAgent = z.infer<typeof insertAgentSchema>;
export type Agent = typeof agents.$inferSelect;

export type InsertProperty = z.infer<typeof insertPropertySchema>;
export type Property = typeof properties.$inferSelect;

export type InsertInquiry = z.infer<typeof insertInquirySchema>;
export type Inquiry = typeof inquiries.$inferSelect;

export type InsertAgentReview = z.infer<typeof insertAgentReviewSchema>;
export type AgentReview = typeof agentReviews.$inferSelect;

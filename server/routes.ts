import type { Express, Request, Response } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { setupAuth } from "./auth";
import { 
  insertPropertySchema, 
  insertAgentSchema, 
  insertCompanySchema, 
  insertInquirySchema,
  insertAgentReviewSchema,
  userRoles
} from "@shared/schema";
import { z } from "zod";
import * as express from 'express';


// Helper to catch errors in async routes
const asyncHandler = (fn: (req: Request, res: Response) => Promise<any>) => 
  (req: Request, res: Response) => {
    Promise.resolve(fn(req, res)).catch(error => {
      if (error instanceof z.ZodError) {
        return res.status(400).json({ 
          message: "Invalid data", 
          errors: error.errors 
        });
      }
      console.error(error);
      res.status(500).json({ message: "Internal server error" });
    });
  };

// Helper to check authentication
const isAuthenticated = (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "You must be logged in to access this resource" });
  }
  next();
};

// Helper to check user role
const hasRole = (roles: string[]) => (req: Request, res: Response, next: Function) => {
  if (!req.isAuthenticated()) {
    return res.status(401).json({ message: "You must be logged in to access this resource" });
  }

  if (!roles.includes(req.user.role)) {
    return res.status(403).json({ 
      message: `Access denied. Required role: ${roles.join(' or ')}`
    });
  }

  next();
};

const createCheckoutSession = async (req: Request, res: Response) => {
  // This is a placeholder.  Replace with actual Stripe checkout session creation.
  try {
    //  Your Stripe checkout session creation logic here.  This will require
    //  Stripe API calls and handling of price IDs, subscription plans etc.
    const session = {id: 'temp-session-id'}; // Replace with actual session
    res.json({sessionId: session.id});
  } catch (error) {
    console.error("Error creating checkout session:", error);
    res.status(500).json({error: "Failed to create checkout session"});
  }
};

export async function registerRoutes(app: Express): Promise<Server> {
  // Setup authentication
  setupAuth(app);

  app.use(express.json());

  app.post('/api/create-checkout-session', isAuthenticated, asyncHandler(async (req, res) => {
    await createCheckoutSession(req, res);
  }));

  // =========== Property Routes ===========

  // Get all properties
  app.get("/api/properties", asyncHandler(async (req, res) => {
    const properties = await storage.getAllProperties();
    res.json(properties);
  }));

  // Get featured properties
  app.get("/api/properties/featured", asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    const properties = await storage.getFeaturedProperties(limit);
    res.json(properties);
  }));

  // Get premium properties
  app.get("/api/properties/premium", asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    const properties = await storage.getPremiumProperties(limit);
    res.json(properties);
  }));

  // Get recent properties
  app.get("/api/properties/recent", asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const properties = await storage.getRecentProperties(limit);
    res.json(properties);
  }));

  // Search properties
  app.get("/api/properties/search", asyncHandler(async (req, res) => {
    const { 
      city, propertyType, minPrice, maxPrice, 
      minBedrooms, maxBedrooms, minArea, maxArea,
      rentOrSale, status, amenities
    } = req.query;

    const query: any = {};
    if (city) query.city = city as string;
    if (propertyType) query.propertyType = propertyType as string;
    if (minPrice) query.minPrice = parseInt(minPrice as string);
    if (maxPrice) query.maxPrice = parseInt(maxPrice as string);
    if (minBedrooms) query.minBedrooms = parseInt(minBedrooms as string);
    if (maxBedrooms) query.maxBedrooms = parseInt(maxBedrooms as string);
    if (minArea) query.minArea = parseInt(minArea as string);
    if (maxArea) query.maxArea = parseInt(maxArea as string);
    if (rentOrSale) query.rentOrSale = rentOrSale as string;
    if (status) query.status = status as string;
    if (amenities) query.amenities = (amenities as string).split(',');

    const properties = await storage.searchProperties(query);
    res.json(properties);
  }));

  // Get properties by type
  app.get("/api/properties/type/:type", asyncHandler(async (req, res) => {
    const properties = await storage.getPropertiesByType(req.params.type);
    res.json(properties);
  }));

  // Get properties by status
  app.get("/api/properties/status/:status", asyncHandler(async (req, res) => {
    const properties = await storage.getPropertiesByStatus(req.params.status);
    res.json(properties);
  }));

  // Get properties by rent or sale
  app.get("/api/properties/category/:rentOrSale", asyncHandler(async (req, res) => {
    const properties = await storage.getPropertiesByRentOrSale(req.params.rentOrSale);
    res.json(properties);
  }));

  // Get property by ID
  app.get("/api/properties/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const property = await storage.getProperty(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // If user is logged in, track the view for recommendations
    if (req.isAuthenticated()) {
      await storage.addPropertyView(req.user.id, id);
    }

    res.json(property);
  }));

  // Create a property
  app.post("/api/properties", isAuthenticated, asyncHandler(async (req, res) => {
    const propertyData = insertPropertySchema.parse({
      ...req.body,
      userId: req.user.id
    });

    const property = await storage.createProperty(propertyData);
    res.status(201).json(property);
  }));

  // Update a property
  app.patch("/api/properties/:id", isAuthenticated, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const property = await storage.getProperty(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if user owns this property or is an agent/admin
    if (property.userId !== req.user.id && 
        req.user.role !== 'agent' && 
        req.user.role !== 'company_admin') {
      return res.status(403).json({ message: "You don't have permission to update this property" });
    }

    const updatedProperty = await storage.updateProperty(id, req.body);
    res.json(updatedProperty);
  }));

  // Get current user's properties
  app.get("/api/user/properties", isAuthenticated, asyncHandler(async (req, res) => {
    const properties = await storage.getPropertiesByUser(req.user.id);
    res.json(properties);
  }));

  // =========== Agent Routes ===========

  // Get all agents
  app.get("/api/agents", asyncHandler(async (req, res) => {
    const agents = await storage.getAllAgents();
    res.json(agents);
  }));

  // Get featured agents
  app.get("/api/agents/featured", asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    const agents = await storage.getFeaturedAgents(limit);
    res.json(agents);
  }));

  // Search agents
  app.get("/api/agents/search", asyncHandler(async (req, res) => {
    const { specialization, area, minExperience, minRating } = req.query;

    const query: any = {};
    if (specialization) query.specialization = specialization as string;
    if (area) query.area = area as string;
    if (minExperience) query.minExperience = parseInt(minExperience as string);
    if (minRating) query.minRating = parseFloat(minRating as string);

    const agents = await storage.searchAgents(query);
    res.json(agents);
  }));

  // Get agent by ID
  app.get("/api/agents/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid agent ID" });
    }

    const agent = await storage.getAgent(id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    res.json(agent);
  }));

  // Get agent's properties
  app.get("/api/agents/:id/properties", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid agent ID" });
    }

    const agent = await storage.getAgent(id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    const properties = await storage.getPropertiesByAgent(id);
    res.json(properties);
  }));

  // Get agent reviews
  app.get("/api/agents/:id/reviews", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid agent ID" });
    }

    const agent = await storage.getAgent(id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    const reviews = await storage.getAgentReviews(id);
    res.json(reviews);
  }));

  // Create agent profile (for existing user)
  app.post("/api/agents", isAuthenticated, hasRole(['agent']), asyncHandler(async (req, res) => {
    // Check if user already has an agent profile
    const existingAgent = await storage.getAgentByUserId(req.user.id);
    if (existingAgent) {
      return res.status(400).json({ message: "You already have an agent profile" });
    }

    const agentData = insertAgentSchema.parse({
      ...req.body,
      userId: req.user.id
    });

    const agent = await storage.createAgent(agentData);
    res.status(201).json(agent);
  }));

  // Update agent profile
  app.patch("/api/agents/:id", isAuthenticated, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid agent ID" });
    }

    const agent = await storage.getAgent(id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    // Check if user owns this agent profile or is an admin
    if (agent.userId !== req.user.id && req.user.role !== 'company_admin') {
      return res.status(403).json({ message: "You don't have permission to update this agent profile" });
    }

    const updatedAgent = await storage.updateAgent(id, req.body);
    res.json(updatedAgent);
  }));

  // Add a review for an agent
  app.post("/api/agents/:id/reviews", isAuthenticated, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid agent ID" });
    }

    const agent = await storage.getAgent(id);
    if (!agent) {
      return res.status(404).json({ message: "Agent not found" });
    }

    const reviewData = insertAgentReviewSchema.parse({
      ...req.body,
      agentId: id,
      userId: req.user.id
    });

    const review = await storage.createAgentReview(reviewData);
    res.status(201).json(review);
  }));

  // =========== Company Routes ===========

  // Get all companies
  app.get("/api/companies", asyncHandler(async (req, res) => {
    const companies = await storage.getAllCompanies();
    res.json(companies);
  }));

  // Get featured companies
  app.get("/api/companies/featured", asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 6;
    const companies = await storage.getFeaturedCompanies(limit);
    res.json(companies);
  }));

  // Search companies
  app.get("/api/companies/search", asyncHandler(async (req, res) => {
    const { city } = req.query;

    const query: any = {};
    if (city) query.city = city as string;

    const companies = await storage.searchCompanies(query);
    res.json(companies);
  }));

  // Get company by ID
  app.get("/api/companies/:id", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    const company = await storage.getCompany(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    res.json(company);
  }));

  // Get company's properties
  app.get("/api/companies/:id/properties", asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    const company = await storage.getCompany(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    const properties = await storage.getPropertiesByCompany(id);
    res.json(properties);
  }));

  // Create company (for existing user)
  app.post("/api/companies", isAuthenticated, hasRole(['company_admin']), asyncHandler(async (req, res) => {
    const companyData = insertCompanySchema.parse({
      ...req.body,
      adminId: req.user.id
    });

    const company = await storage.createCompany(companyData);
    res.status(201).json(company);
  }));

  // Update company
  app.patch("/api/companies/:id", isAuthenticated, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid company ID" });
    }

    const company = await storage.getCompany(id);
    if (!company) {
      return res.status(404).json({ message: "Company not found" });
    }

    // Check if user is the company admin
    if (company.adminId !== req.user.id) {
      return res.status(403).json({ message: "You don't have permission to update this company" });
    }

    const updatedCompany = await storage.updateCompany(id, req.body);
    res.json(updatedCompany);
  }));

  // =========== User & Recommendation Routes ===========

  // Get recommended properties for current user
  app.get("/api/recommendations", isAuthenticated, asyncHandler(async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit as string) : 10;
    const recommendations = await storage.getRecommendedProperties(req.user.id, limit);
    res.json(recommendations);
  }));

  // Get current user's saved properties
  app.get("/api/user/saved", isAuthenticated, asyncHandler(async (req, res) => {
    const savedProperties = await storage.getSavedProperties(req.user.id);
    res.json(savedProperties);
  }));

  // Save a property
  app.post("/api/properties/:id/save", isAuthenticated, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const property = await storage.getProperty(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    await storage.saveProperty(req.user.id, id);
    res.status(201).json({ message: "Property saved successfully" });
  }));

  // Unsave a property
  app.delete("/api/properties/:id/save", isAuthenticated, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    await storage.unsaveProperty(req.user.id, id);
    res.json({ message: "Property removed from saved list" });
  }));

  // =========== Inquiry & Messaging Routes ===========

  // Create an inquiry for a property
  app.post("/api/inquiries", isAuthenticated, asyncHandler(async (req, res) => {
    const inquiryData = insertInquirySchema.parse({
      ...req.body,
      fromUserId: req.user.id
    });

    // Check if property exists
    const property = await storage.getProperty(inquiryData.propertyId);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    const inquiry = await storage.createInquiry(inquiryData);
    res.status(201).json(inquiry);
  }));

  // Get inquiries for a property
  app.get("/api/properties/:id/inquiries", isAuthenticated, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid property ID" });
    }

    const property = await storage.getProperty(id);
    if (!property) {
      return res.status(404).json({ message: "Property not found" });
    }

    // Check if user owns this property or is the agent/company managing it
    if (property.userId !== req.user.id && 
        (property.agentId === null || property.agentId !== req.user.id)) {
      return res.status(403).json({ message: "You don't have permission to view these inquiries" });
    }

    const inquiries = await storage.getInquiriesByProperty(id);
    res.json(inquiries);
  }));

  // Get inquiries sent by current user
  app.get("/api/user/inquiries/sent", isAuthenticated, asyncHandler(async (req, res) => {
    const inquiries = await storage.getInquiriesByUser(req.user.id, false);
    res.json(inquiries);
  }));

  // Get inquiries received by current user
  app.get("/api/user/inquiries/received", isAuthenticated, asyncHandler(async (req, res) => {
    const inquiries = await storage.getInquiriesByUser(req.user.id, true);
    res.json(inquiries);
  }));

  // Mark an inquiry as read
  app.patch("/api/inquiries/:id/read", isAuthenticated, asyncHandler(async (req, res) => {
    const id = parseInt(req.params.id);
    if (isNaN(id)) {
      return res.status(400).json({ message: "Invalid inquiry ID" });
    }

    const inquiry = await storage.getInquiry(id);
    if (!inquiry) {
      return res.status(404).json({ message: "Inquiry not found" });
    }

    // Check if user is the recipient
    if (inquiry.toUserId !== req.user.id) {
      return res.status(403).json({ message: "You don't have permission to update this inquiry" });
    }

    const updatedInquiry = await storage.markInquiryAsRead(id);
    res.json(updatedInquiry);
  }));

  // Create HTTP server
  const httpServer = createServer(app);

  return httpServer;
}
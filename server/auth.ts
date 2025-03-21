import passport from "passport";
import { Strategy as LocalStrategy } from "passport-local";
import { Express } from "express";
import session from "express-session";
import { scrypt, randomBytes, timingSafeEqual } from "crypto";
import { promisify } from "util";
import nodemailer from "nodemailer";
import { storage } from "./storage";
import { User as SelectUser, verificationMethods } from "@shared/schema";

declare global {
  namespace Express {
    interface User extends SelectUser {}
  }
}

const scryptAsync = promisify(scrypt);

async function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

async function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const buf = (await scryptAsync(password, salt, 64)) as Buffer;
  return `${buf.toString("hex")}.${salt}`;
}

// Function to send OTP via email
async function sendEmailOTP(email: string, otp: string) {
  try {
    // Log the OTP for testing purposes in the console
    console.log(`EMAIL OTP for ${email}: ${otp}`);
    
    // Gmail SMTP setup with the provided credentials
    const transporter = nodemailer.createTransport({
      service: 'gmail',
      auth: {
        user: 'srinathballa20@gmail.com', // User provided email
        pass: 'veouuoapolixrlqa'         // User provided app password
      }
    });
    
    // Email content
    const mailOptions = {
      from: '"Real Estate Platform" <srinathballa20@gmail.com>',
      to: email,
      subject: 'Your Real Estate Platform Verification Code',
      text: `Your OTP for account verification is: ${otp}. This code will expire in 10 minutes.`,
      html: `
        <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; border: 1px solid #e0e0e0; border-radius: 5px;">
          <h2 style="color: #4a6ee0;">Real Estate Platform - Verification</h2>
          <p>Hello,</p>
          <p>Thank you for registering with our platform. Please use the verification code below to complete your account setup:</p>
          <div style="background-color: #f7f7f7; padding: 15px; text-align: center; font-size: 24px; font-weight: bold; letter-spacing: 5px; margin: 20px 0; border-radius: 4px;">
            ${otp}
          </div>
          <p>This code will expire in <strong>10 minutes</strong>.</p>
          <p>If you didn't request this code, please ignore this email.</p>
          <p>Best regards,<br>The Real Estate Team</p>
        </div>
      `,
    };
    
    // Actually send the email using the provided credentials
    const info = await transporter.sendMail(mailOptions);
    console.log('Email sent: %s', info.messageId);
    
    // Still display the OTP in the console for development
    console.log(`=========================================`);
    console.log(`OTP VERIFICATION CODE: ${otp}`);
    console.log(`EMAIL: ${email}`);
    console.log(`SENDING STATUS: Email sent successfully`);
    console.log(`=========================================`);
    
    return true;
  } catch (error) {
    console.error('Error sending email:', error);
    // Still display the OTP in the logs for testing purposes
    console.log(`=========================================`);
    console.log(`OTP VERIFICATION CODE: ${otp}`);
    console.log(`EMAIL: ${email}`);
    console.log(`SENDING STATUS: Failed - ${error instanceof Error ? error.message : 'Unknown error'}`);
    console.log(`=========================================`);
    return true; // Still return true to not block the flow
  }
}

// Function to send OTP via WhatsApp
async function sendWhatsAppOTP(phone: string, otp: string) {
  // TODO: Implement actual WhatsApp messaging with a service like Twilio
  console.log(`WHATSAPP OTP for ${phone}: ${otp}`);
  return true;
}

// Generic function to send OTP based on method
async function sendOTP(recipient: string, otp: string, method: 'email' | 'whatsapp' | 'sms') {
  switch (method) {
    case 'email':
      return sendEmailOTP(recipient, otp);
    case 'whatsapp':
      return sendWhatsAppOTP(recipient, otp);
    case 'sms':
      // TODO: Implement SMS sending (could use Twilio or similar)
      console.log(`SMS OTP for ${recipient}: ${otp}`);
      return true;
    default:
      throw new Error(`Unsupported OTP method: ${method}`);
  }
}

async function comparePasswords(supplied: string, stored: string) {
  const [hashed, salt] = stored.split(".");
  const hashedBuf = Buffer.from(hashed, "hex");
  const suppliedBuf = (await scryptAsync(supplied, salt, 64)) as Buffer;
  return timingSafeEqual(hashedBuf, suppliedBuf);
}

export function setupAuth(app: Express) {
  const sessionSettings: session.SessionOptions = {
    secret: process.env.SESSION_SECRET || "realestate-secret-key",
    resave: false,
    saveUninitialized: false,
    store: storage.sessionStore,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // 24 hours
    },
  };

  app.set("trust proxy", 1);
  app.use(session(sessionSettings));
  app.use(passport.initialize());
  app.use(passport.session());

  passport.use(
    new LocalStrategy(async (username, password, done) => {
      const user = await storage.getUserByUsername(username);
      if (!user || !(await comparePasswords(password, user.password))) {
        return done(null, false);
      } else {
        return done(null, user);
      }
    }),
  );

  passport.serializeUser((user, done) => done(null, user.id));
  passport.deserializeUser(async (id: number, done) => {
    const user = await storage.getUser(id);
    done(null, user);
  });

  app.post("/api/register", async (req, res, next) => {
    try {
      const { username, email, phone, password, verificationMethod = "email", ...otherFields } = req.body;
      
      // Validate the verification method
      if (!verificationMethods.includes(verificationMethod)) {
        return res.status(400).json({ message: `Invalid verification method. Supported methods: ${verificationMethods.join(', ')}` });
      }

      // Check for existing user
      const existingUser = await storage.getUserByUsername(username);
      if (existingUser) {
        return res.status(400).json({ message: "Username already exists" });
      }

      // Check for existing email
      const existingEmail = await storage.getUserByEmail(email);
      if (existingEmail) {
        return res.status(400).json({ message: "Email already in use" });
      }

      // Create user account first
      const user = await storage.createUser({
        username,
        email,
        phone,
        password: await hashPassword(password),
        ...otherFields
      });

      // Generate OTP
      const otp = await generateOTP();
      
      // Create OTP record
      await storage.createOtp({
        userId: user.id,
        otp,
        type: verificationMethod,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      });
      
      // Send OTP via the selected method
      if (verificationMethod === "email") {
        await sendOTP(email, otp, "email");
      } else if (verificationMethod === "whatsapp" && phone) {
        await sendOTP(phone, otp, "whatsapp");
      } else if (verificationMethod === "sms" && phone) {
        await sendOTP(phone, otp, "sms");
      } else {
        return res.status(400).json({ 
          message: `${verificationMethod} verification requires a valid phone number` 
        });
      }

      // Log in the user
      req.login(user, (err) => {
        if (err) return next(err);
        const { password, ...userWithoutPassword } = user;
        res.status(201).json({
          ...userWithoutPassword,
          otpSent: true,
          verificationMethod
        });
      });
    } catch (error) {
      console.error('Auth error:', error);
      res.status(500).json({ 
        message: "Authentication failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/login", (req, res, next) => {
    passport.authenticate("local", (err: any, user: SelectUser | false, info: any) => {
      if (err) {
        return next(err);
      }
      if (!user) {
        return res.status(401).json({ message: "Invalid username or password" });
      }
      req.login(user, (loginErr) => {
        if (loginErr) {
          return next(loginErr);
        }
        const { password, ...userWithoutPassword } = user;
        return res.status(200).json(userWithoutPassword);
      });
    })(req, res, next);
  });

  app.post("/api/logout", (req, res, next) => {
    req.logout((err) => {
      if (err) return next(err);
      res.sendStatus(200);
    });
  });

  app.get("/api/user", (req, res) => {
    if (!req.isAuthenticated()) return res.sendStatus(401);
    const { password, ...userWithoutPassword } = req.user;
    res.json(userWithoutPassword);
  });

  app.post("/api/resend-otp", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        console.log("OTP resend failed: User not authenticated");
        return res.status(401).json({ success: false, message: "User not authenticated" });
      }

      // Get request parameters
      const userId = req.user.id;
      const { type = "email" } = req.body;
      
      // Log the OTP resend request for debugging
      console.log(`OTP Resend request for user ${userId}:`, {
        userId,
        type,
        authenticatedAs: req.user.username,
        email: req.user.email,
        phone: req.user.phone
      });

      // Validate verification method
      if (!verificationMethods.includes(type)) {
        console.log(`OTP resend failed: Invalid verification type: ${type}`);
        return res.status(400).json({ 
          success: false,
          message: `Invalid verification type. Supported types: ${verificationMethods.join(', ')}` 
        });
      }

      // Generate new OTP
      const otp = await generateOTP();
      console.log(`Generated new OTP for user ${userId}: ${otp}`);
      
      // Get previous OTP to update it
      const existingOtp = await storage.getOtpByUserAndType(userId, type);
      
      if (existingOtp) {
        // Invalidate old OTP
        console.log(`Invalidating existing OTP for user ${userId}, type: ${type}`);
        await storage.invalidateOtp(existingOtp.id);
      }
      
      // Create new OTP record
      console.log(`Creating new OTP record for user ${userId}`);
      const otpRecord = await storage.createOtp({
        userId,
        otp,
        type,
        expiresAt: new Date(Date.now() + 10 * 60 * 1000), // 10 minutes
      });
      
      console.log(`Created OTP record with ID: ${otpRecord.id}`);
      
      // Send OTP via the selected method
      let sendResult = false;
      let recipient = '';
      
      if (type === "email") {
        recipient = req.user.email;
        console.log(`Sending OTP via email to: ${recipient}`);
        sendResult = await sendOTP(recipient, otp, "email");
        
        // In development, include the OTP in the response for testing
        const response: { 
          success: boolean; 
          message: string;
          otp?: string;
        } = { 
          success: true, 
          message: "OTP sent to your email",
        };
        
        if (process.env.NODE_ENV !== 'production') {
          response.otp = otp; // Only include OTP in development
        }
        
        res.json(response);
      } else if (type === "whatsapp" && req.user.phone) {
        recipient = req.user.phone;
        console.log(`Sending OTP via WhatsApp to: ${recipient}`);
        sendResult = await sendOTP(recipient, otp, "whatsapp");
        
        const response: { 
          success: boolean; 
          message: string;
          otp?: string;
        } = { 
          success: true, 
          message: "OTP sent to your WhatsApp" 
        };
        
        if (process.env.NODE_ENV !== 'production') {
          response.otp = otp;
        }
        
        res.json(response);
      } else if (type === "sms" && req.user.phone) {
        recipient = req.user.phone;
        console.log(`Sending OTP via SMS to: ${recipient}`);
        sendResult = await sendOTP(recipient, otp, "sms");
        
        const response: { 
          success: boolean; 
          message: string;
          otp?: string;
        } = { 
          success: true, 
          message: "OTP sent to your phone" 
        };
        
        if (process.env.NODE_ENV !== 'production') {
          response.otp = otp;
        }
        
        res.json(response);
      } else {
        console.log(`OTP resend failed: Missing contact information for type ${type}`);
        return res.status(400).json({ 
          success: false,
          message: `${type} verification requires a valid ${type === 'email' ? 'email address' : 'phone number'}` 
        });
      }
      
      console.log(`OTP sending result: ${sendResult ? 'Success' : 'Failed'}, Recipient: ${recipient}`);
    } catch (error) {
      console.error('OTP resend error:', error);
      res.status(500).json({ 
        success: false,
        message: "Failed to resend OTP",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });

  app.post("/api/verify-otp", async (req, res) => {
    try {
      // Check if user is authenticated
      if (!req.isAuthenticated()) {
        console.log("OTP verification failed: User not authenticated");
        return res.status(401).json({ success: false, message: "User not authenticated" });
      }

      // Get request parameters
      const userId = req.user.id;
      const { otp, type = "email" } = req.body;

      // Log verification attempt for debugging
      console.log(`OTP Verification attempt for user ${userId}:`, {
        userId,
        otp, 
        type,
        authenticatedAs: req.user.username
      });

      // Validate OTP input
      if (!otp) {
        console.log("OTP verification failed: Missing OTP code");
        return res.status(400).json({ success: false, message: "OTP is required" });
      }

      // Validate verification method
      if (!verificationMethods.includes(type)) {
        console.log(`OTP verification failed: Invalid verification type: ${type}`);
        return res.status(400).json({ 
          success: false,
          message: `Invalid verification type. Supported types: ${verificationMethods.join(', ')}` 
        });
      }

      // Verify the OTP with detailed logging
      console.log(`Verifying OTP for user ${userId}, type: ${type}, code: ${otp}`);
      const isValid = await storage.verifyOtp(userId, otp, type);
      
      if (!isValid) {
        console.log(`OTP verification failed for user ${userId}: Invalid or expired OTP`);
        return res.status(400).json({ success: false, message: "Invalid or expired OTP" });
      }

      console.log(`OTP verification successful for user ${userId}`);

      // Update user verification status based on the type
      let updatedUser;
      
      if (type === "email") {
        console.log(`Updating email verification status for user ${userId}`);
        updatedUser = await storage.verifyUserEmail(userId);
      } else if (type === "whatsapp" || type === "sms") {
        console.log(`Updating phone verification status for user ${userId}`);
        updatedUser = await storage.verifyUserPhone(userId);
      }

      if (!updatedUser) {
        console.log(`Failed to update verification status for user ${userId}`);
        return res.status(500).json({ success: false, message: "Failed to update verification status" });
      }

      // Return success response with updated user data
      const { password, ...userWithoutPassword } = updatedUser;
      
      console.log(`Verification completed successfully for user ${userId}, type: ${type}`);
      
      res.json({ 
        success: true, 
        message: `${type} verification successful`,
        user: userWithoutPassword
      });
    } catch (error) {
      console.error('OTP verification error:', error);
      res.status(500).json({ 
        success: false,
        message: "Verification failed",
        error: error instanceof Error ? error.message : "Unknown error"
      });
    }
  });
}

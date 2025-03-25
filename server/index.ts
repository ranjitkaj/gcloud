import express, { type Request, Response, NextFunction } from "express";
import { registerRoutes } from "./routes";
import { setupVite, serveStatic, log } from "./vite";
import { initializeDatabase } from "./db";
import { setupAuth } from "./auth";
import path from "path";
import fs from "fs";

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use((req, res, next) => {
  const start = Date.now();
  const path = req.path;
  let capturedJsonResponse: Record<string, any> | undefined = undefined;

  const originalResJson = res.json;
  res.json = function (bodyJson, ...args) {
    capturedJsonResponse = bodyJson;
    return originalResJson.apply(res, [bodyJson, ...args]);
  };

  res.on("finish", () => {
    const duration = Date.now() - start;
    if (path.startsWith("/api")) {
      let logLine = `${req.method} ${path} ${res.statusCode} in ${duration}ms`;
      if (capturedJsonResponse) {
        logLine += ` :: ${JSON.stringify(capturedJsonResponse)}`;
      }

      if (logLine.length > 80) {
        logLine = logLine.slice(0, 79) + "…";
      }

      log(logLine);
    }
  });

  next();
});

(async () => {
  // Initialize DB if we have a connection
  if (process.env.DATABASE_URL) {
    try {
      // Initialize the database
      await initializeDatabase();
      log("Database initialized successfully", "database");
    } catch (error) {
      log(`Database initialization error: ${error}`, "database");
    }
  }

  // Set up authentication
  setupAuth(app);
  
  // Create uploads directory if it doesn't exist
  const uploadsDir = path.join(process.cwd(), 'uploads');
  if (!fs.existsSync(uploadsDir)) {
    fs.mkdirSync(uploadsDir, { recursive: true });
  }
  
  // Serve static files from uploads directory
  app.use('/uploads', express.static(uploadsDir));
  
  // Register API routes
  const server = await registerRoutes(app);

  app.use((err: any, _req: Request, res: Response, _next: NextFunction) => {
    const status = err.status || err.statusCode || 500;
    const message = err.message || "Internal Server Error";

    res.status(status).json({ message });
    throw err;
  });

  // importantly only setup vite in development and after
  // setting up all the other routes so the catch-all route
  // doesn't interfere with the other routes
  if (app.get("env") === "development") {
    await setupVite(app, server);
  } else {
    serveStatic(app);
  }

  // ALWAYS serve the app on port 5000
 
  const PORT = process.env.PORT || 8080;

  // server.listen( process.env.PORT || PORT, () => {
  //   // log(`Server is running on http://127.0.0.1:${PORT}`);
    
  // });

  // app.get('/a', (req, res) => {
  //   res.send('Hello from Cloud Run!');
  // });
  


  app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
  });

  

  server.on('error', (err) => {
    log(`Server error: ${err}`);
  });
})();


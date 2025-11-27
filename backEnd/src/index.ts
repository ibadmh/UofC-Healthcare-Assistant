import express from "express";
import cors from "cors";
import helmet from "helmet";
import { config } from "./config/env.js";
import { apiLimiter } from "./middleware/rateLimit.js";
import { errorHandler } from "./middleware/errorHandler.js";
import chatbotRoutes from "./routes/chatbot.routes.js";
import resourceRoutes from "./routes/resources.routes.js";

const app = express();

// Security middleware
app.use(helmet());
app.use(cors());
app.use(express.json());

// Rate limiting
app.use("/api/", apiLimiter);

// Routes
app.get("/", (req, res) => {
  res.json({
    message: "UofC Healthcare Assistant API",
    version: "2.0.0",
    endpoints: {
      chatbot: "/api/chat",
      resources: "/api/resources",
    },
  });
});

app.use("/api/chat", chatbotRoutes);
app.use("/api/resources", resourceRoutes);

// Health check endpoint
app.get("/api/health", (req, res) => {
  res.json({
    status: "ok",
    timestamp: new Date().toISOString(),
  });
});

// Error handling
app.use(errorHandler);

app.listen(config.port, () => {
  console.log(`✅ Server running on port ${config.port}`);
  console.log(`📍 Environment: ${config.nodeEnv}`);
});
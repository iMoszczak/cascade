import type { Express } from "express";
import { createServer, type Server } from "http";
import { storage } from "./storage";
import { insertMessageSchema, cipherRequestSchema } from "@shared/schema";
import { cascadeCipher } from "./services/cipher";

export async function registerRoutes(app: Express): Promise<Server> {
  // Get all chat messages
  app.get("/api/messages", async (req, res) => {
    try {
      const messages = await storage.getMessages();
      res.json(messages);
    } catch (error) {
      res.status(500).json({ message: "Failed to fetch messages" });
    }
  });

  // Create a new chat message
  app.post("/api/messages", async (req, res) => {
    try {
      const result = insertMessageSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: result.error.issues 
        });
      }

      const message = await storage.createMessage(result.data);
      res.status(201).json(message);
    } catch (error) {
      console.error("Error creating message:", error);
      res.status(500).json({ message: "Failed to create message" });
    }
  });

  // Delete a message
  app.delete("/api/messages/:id", async (req, res) => {
    try {
      const { id } = req.params;
      const success = await storage.deleteMessage(id);
      if (success) {
        res.json({ message: "Message deleted successfully" });
      } else {
        res.status(404).json({ message: "Message not found" });
      }
    } catch (error) {
      res.status(500).json({ message: "Failed to delete message" });
    }
  });

  // Cipher operations endpoint
  app.post("/api/cipher", async (req, res) => {
    try {
      const result = cipherRequestSchema.safeParse(req.body);
      if (!result.success) {
        return res.status(400).json({ 
          message: "Validation error", 
          errors: result.error.issues 
        });
      }

      const { text, key, startNumber, reverseGroups, operation } = result.data;

      let output: string;
      if (operation === "encrypt") {
        output = cascadeCipher.encrypt(text, key, startNumber, reverseGroups);
      } else {
        output = cascadeCipher.decrypt(text, key, startNumber, reverseGroups);
      }

      res.json({ result: output });
    } catch (error) {
      console.error("Cipher operation error:", error);
      res.status(400).json({ 
        message: error instanceof Error ? error.message : "Cipher operation failed" 
      });
    }
  });

  const httpServer = createServer(app);
  return httpServer;
}

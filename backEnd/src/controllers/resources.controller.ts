import { Request, Response } from "express";
import { UCalgaryService } from "../services/ucalgary.service.js";
import { AHSService } from "../services/ahs.service.js";
import { StudentUnionService } from "../services/studentUnion.service.js";

const ucalgaryService = new UCalgaryService();
const ahsService = new AHSService();
const suService = new StudentUnionService();

export class ResourcesController {
  async getAllResources(req: Request, res: Response) {
    try {
      const [ucalgary, ahs, su] = await Promise.all([
        ucalgaryService.getWellnessResources(),
        ahsService.getResources(),
        Promise.resolve(suService.getResources()),
      ]);

      res.json({
        ucalgary,
        ahs,
        studentUnion: su,
      });
    } catch (error) {
      console.error("Error fetching resources:", error);
      res.status(500).json({ error: "Failed to fetch resources" });
    }
  }

  async getUCalgaryResources(req: Request, res: Response) {
    try {
      const resources = await ucalgaryService.getWellnessResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch UCalgary resources" });
    }
  }

  async getAHSResources(req: Request, res: Response) {
    try {
      const resources = await ahsService.getResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch AHS resources" });
    }
  }

  async getSUResources(req: Request, res: Response) {
    try {
      const resources = suService.getResources();
      res.json(resources);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch SU resources" });
    }
  }
}
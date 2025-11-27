import express from "express";
import { ResourcesController } from "../controllers/resources.controller.js";

const router = express.Router();
const controller = new ResourcesController();

router.get("/", (req, res) => controller.getAllResources(req, res));
router.get("/ucalgary", (req, res) => controller.getUCalgaryResources(req, res));
router.get("/ahs", (req, res) => controller.getAHSResources(req, res));
router.get("/su", (req, res) => controller.getSUResources(req, res));

export default router;
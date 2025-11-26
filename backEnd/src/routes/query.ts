import express, { Request, Response, Router } from "express";

const router: Router = express.Router();

router.post("/", (req: Request, res: Response) => {
  // Your query logic here
  res.json({ message: "Query endpoint working!" });
});

export default router;
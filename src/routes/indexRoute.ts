import express, { Request, Response } from "express";
import httpStatus from "http-status";

const router = express.Router();

router.get("/", (req: Request, res: Response) => {
  res
    .status(httpStatus.OK)
    .redirect("https://documenter.getpostman.com/view/21657944/2s83zguQSW");
});

export default router;

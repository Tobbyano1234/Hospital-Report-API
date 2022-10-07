import express from "express";
import {
  RegisterDoctor,
  LoginDoctor,
  getDoctor,
} from "../controller/doctorController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/register", RegisterDoctor);
router.post("/login", LoginDoctor);
router.get("/alldoctors", auth, getDoctor);

export default router;

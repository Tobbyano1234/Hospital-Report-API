import express from "express";
import {
  RegisterDoctor,
  LoginDoctor,
  getDoctor,
  getAllDoctor,
} from "../controller/doctorController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/register", RegisterDoctor);
router.post("/login", LoginDoctor);
router.get("/alldoctors", auth, getAllDoctor);
router.get("/getdoctor", auth, getDoctor);

export default router;

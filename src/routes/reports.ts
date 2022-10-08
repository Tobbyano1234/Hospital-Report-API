import express from "express";
import {
  PatientRecord,
  getPatientRecord,
  getSinglePatientRecord,
  updatePatientRecord,
  deletePatientRecord,
} from "../controller/reportController";
import { auth } from "../middleware/auth";

const router = express.Router();

router.post("/create", auth, PatientRecord);
router.get("/read", auth, getPatientRecord);
router.get("/read", auth, getSinglePatientRecord);
router.patch("/update", auth, updatePatientRecord);
router.delete("/delete/:patientId", auth, deletePatientRecord);

export default router;

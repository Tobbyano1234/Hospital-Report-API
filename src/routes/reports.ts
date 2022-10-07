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
router.get("/read", getPatientRecord);
router.get("/read/:patientId", auth, getSinglePatientRecord);
router.patch("/update/:patientId", auth, updatePatientRecord);
router.delete("/delete/:patientId", auth, deletePatientRecord);

export default router;

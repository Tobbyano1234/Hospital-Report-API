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
router.get("/allrecords", auth, getPatientRecord);
router.get("/getrecord", auth, getSinglePatientRecord);
router.patch("/update", auth, updatePatientRecord);
router.delete("/delete/:patientId", auth, deletePatientRecord);

export default router;

import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { patientInstance } from "../model/reportModel";
import {
  createPatientSchema,
  options,
  updatePatientSchema,
} from "../utils/utils";
import { DoctorsInstance } from "../model/doctorModel";

export async function PatientRecord(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  const id = uuidv4();

  try {
    const verified = req.user;

    const validateResult = createPatientSchema.validate(req.body, options);
    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }

    let patient = { patientId: id, ...req.body, DoctorId: verified.id };

    const record = await patientInstance.create(patient);
    res
      .status(201)
      .json({ msg: "You have successfully created a patient report", record });
  } catch (err) {
    res.status(500).json({
      msg: "Failed to create patient report",
      route: "/create",
    });
  }
}

export async function getPatientRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = req.query?.limit as number | undefined;
    const offset = req.query?.offset as number | undefined;
    const record = await patientInstance.findAndCountAll({
      limit,
      offset,
      include: [
        {
          model: DoctorsInstance,
          attributes: [
            "id",
            "DoctorsName",
            "email",
            "specialization",
            "phoneNumber",
          ],
          as: "Doctors",
        },
      ],
    });
    res.status(200).json({
      msg: "You have successfully fetch all patient reports",
      count: record.count,
      record: record.rows,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Failed to fetch all patient reports",
      route: "/read",
    });
  }
}

export async function getSinglePatientRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { patientId } = req.params;
    console.log(patientId);
    console.log("before");
    const record = await patientInstance.findOne({
      where: { patientId },
    });
    console.log("after");
    res
      .status(200)
      .json({ msg: "You have successfully find your patient report", record });
  } catch (err) {
    console.log(err);
    res.status(500).json({
      msg: "Failed to read single patient report",
      route: "/read/:id",
    });
  }
}

export async function updatePatientRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const id = uuidv4();
  try {
    const { patientId } = req.params;
    const {
      patientName,
      age,
      hospitalName,
      weight,
      height,
      bloodGroup,
      genotype,
      bloodPressure,
      HIV_status,
      hepatitis,
    } = req.body;
    const validateResult = updatePatientSchema.validate(req.body, options);
    if (validateResult.error) {
      return res
        .status(400)
        .json({ Error: validateResult.error.details[0].message });
    }

    const record = await patientInstance.findOne({ where: { patientId } });
    if (!record) {
      return res.status(404).json({
        Error: "Cannot find existing patient report",
      });
    }
    const updatedRecord = await record.update({
      patientName: patientName,
      age: age,
      hospitalName: hospitalName,
      weight: weight,
      height: height,
      bloodGroup: bloodGroup,
      genotype: genotype,
      bloodPressure: bloodPressure,
      HIV_status: HIV_status,
      hepatitis: hepatitis,
    });
    res.status(202).json({
      msg: "You have successfully updated your patient report",
      record: updatedRecord,
    });
  } catch (err) {
    res.status(500).json({
      msg: "Failed to update patient report",
      route: "/update/:id",
    });
  }
}

export async function deletePatientRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const { patientId } = req.params;
    const record = await patientInstance.findOne({ where: { patientId } });
    if (!record) {
      return res.status(404).json({ msg: "Can not find patient report" });
    }
    const deletedRecord = await record.destroy();
    return res
      .status(200)
      .json({ msg: "Successfully deleted patient report", deletedRecord });
  } catch (err) {
    res.status(500).json({
      msg: "Failed to delete patient report",
      route: "/delete/:id",
    });
  }
}

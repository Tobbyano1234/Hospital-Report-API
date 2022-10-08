import { Request, Response, NextFunction } from "express";
import { v4 as uuidv4 } from "uuid";
import { patientInstance } from "../model/reportModel";
import {
  createPatientSchema,
  options,
  updatePatientSchema,
} from "../utils/utils";
import { DoctorsInstance } from "../model/doctorModel";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

const jwtsecret = process.env.JWT_SECRET as string;

interface jwtPayload {
  id: string;
}

export async function PatientRecord(
  req: Request | any,
  res: Response,
  next: NextFunction
) {
  try {
    const token = req.headers.token as string;
    const { id } = jwt.verify(token, jwtsecret) as jwtPayload;

    const validateResult = createPatientSchema.validate(req.body, options);
    if (validateResult.error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ Error: validateResult.error.details[0].message });
    }

    const doctor = DoctorsInstance.findOne({ where: { id } });
    if (!doctor) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Doctor not found",
      });
    }

    let patient = { patientId: id, ...req.body, doctorId: id };

    const record = await patientInstance.create(patient);
    return res.status(httpStatus.CREATED).json({
      message: "Patient report created successfully",
      record,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Failed to create patient report",
    });
  }
}

export async function getPatientRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const verified = req.headers.token as string;

    const token = jwt.verify(verified, jwtsecret) as jwtPayload;

    const { id } = token;

    const patient = await patientInstance.findOne({ where: { doctorId: id } });

    const patientId = patient?.getDataValue("patientId");

    const limit = req.query?.limit as number | undefined;
    const offset = req.query?.offset as number | undefined;
    const record = await patientInstance.findAndCountAll({
      where: { patientId, doctorId: id },
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
    return res.status(httpStatus.OK).json({
      msg: "Patient reports fetched successfully",
      count: record.count,
      record: record.rows,
    });
  } catch (error) {
    return res.status(500).json({
      message: "Failed to fetch all patient reports",
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
    const verified = req.headers.token as string;

    const token = jwt.verify(verified, jwtsecret) as jwtPayload;

    const { id } = token;

    const record = await patientInstance.findOne({
      where: { doctorId: id, patientId },
    });

    return res
      .status(httpStatus.OK)
      .json({ message: "Patient report fetched successfully", record });
  } catch (error) {
    console.log(error);
    res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch patient report",
    });
  }
}

export async function updatePatientRecord(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const verified = req.headers.token as string;
    const token = jwt.verify(verified, jwtsecret) as jwtPayload;

    const { id } = token;

    const user = await DoctorsInstance.findOne({ where: { id } });

    if (!user) {
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Doctor not found" });
    }
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
        .status(httpStatus.BAD_REQUEST)
        .json({ Error: validateResult.error.details[0].message });
    }

    const record = await patientInstance.findOne({
      where: { doctorId: id, patientId },
    });
    if (!record) {
      return res.status(httpStatus.NOT_FOUND).json({
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
    return res.status(httpStatus.OK).json({
      message: "Patient report successfully updated",
      record: updatedRecord,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Failed to update patient report",
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
      return res
        .status(httpStatus.NOT_FOUND)
        .json({ message: "Can not find patient report" });
    }
    const deletedRecord = await record.destroy();
    return res
      .status(httpStatus.OK)
      .json({ msg: "Patient report deleted successfully" });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Failed to delete patient report",
    });
  }
}

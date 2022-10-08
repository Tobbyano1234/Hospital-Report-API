import { Request, Response, NextFunction } from "express";
import { v4 as UUID4 } from "uuid";
import { DoctorsInstance } from "../model/doctorModel";
import {
  registerSchema,
  loginSchema,
  options,
  generateToken,
} from "../utils/utils";
import bcrypt from "bcryptjs";
import { patientInstance } from "../model/reportModel";
import httpStatus from "http-status";
import jwt from "jsonwebtoken";

const jwtsecret = process.env.JWT_SECRET;

interface jwtPayload {
  email: string;
  id: string;
}

export async function RegisterDoctor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  const doctorId = UUID4();

  try {
    const validateResult = registerSchema.validate(req.body, options);
    if (validateResult.error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ Error: validateResult.error.details[0].message });
    }

    const duplicateEmail = await DoctorsInstance.findOne({
      where: { email: req.body.email },
    });
    if (duplicateEmail) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ msg: "Email already exit" });
    }

    const duplicatePhoneNumber = await DoctorsInstance.findOne({
      where: { phoneNumber: req.body.phoneNumber },
    });

    if (duplicatePhoneNumber) {
      return res
        .status(httpStatus.CONFLICT)
        .json({ msg: "Phone number already exit" });
    }

    const passwordHash = await bcrypt.hash(req.body.password, 8);

    const { DoctorsName, email, specialization, gender, phoneNumber } =
      req.body;

    const doctors = {
      id: doctorId,
      DoctorsName,
      email,
      specialization,
      gender,
      phoneNumber,
      password: passwordHash,
    };

    const record = await DoctorsInstance.create(doctors);

    return res
      .status(httpStatus.CREATED)
      .json({ message: "You have successfully created a user", record });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Failed to create user",
    });
  }
}

export async function LoginDoctor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  // const doctorId = UUID4();

  try {
    const validateResult = loginSchema.validate(req.body, options);
    if (validateResult.error) {
      return res
        .status(httpStatus.BAD_REQUEST)
        .json({ Error: validateResult.error.details[0].message });
    }

    const doctor = (await DoctorsInstance.findOne({
      where: { email: req.body.email },
    })) as unknown as { [key: string]: string };

    if (!doctor) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Incorrect credentials",
      });
    }

    const { id } = doctor;

    const token = generateToken({ id });

    const validUser = await bcrypt.compare(req.body.password, doctor.password);

    if (!validUser) {
      return res.status(httpStatus.BAD_REQUEST).json({
        message: "Incorrect credentials",
      });
    }

    return res.status(httpStatus.OK).json({
      message: "Login Successfully",
      token,
      doctor,
    });
  } catch (error) {
    console.log(error);
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Failed to login",
    });
  }
}

export async function getDoctor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const verified = req.headers.token;

    const token = jwt.verify(verified, jwtsecret) as unknown | jwtPayload;

    const { id } = token as jwtPayload;

    const record = await DoctorsInstance.findOne({
      where: { id },
      include: [{ model: patientInstance, as: "Patient Report" }],
    });
    if (!record) {
      return res.status(httpStatus.NOT_FOUND).json({
        message: "Doctor does not exist",
      });
    }

    return res.status(httpStatus.OK).json({
      message: "Doctor's details fetched successfully",
      record,
    });
  } catch (error) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch doctor profiles",
    });
  }
}
export async function getAllDoctor(
  req: Request,
  res: Response,
  next: NextFunction
) {
  try {
    const limit = req.query?.limit as number | undefined;
    const offset = req.query?.offset as number | undefined;

    const record = await DoctorsInstance.findAndCountAll({
      limit,
      offset,
      include: [{ model: patientInstance, as: "Patient Report" }],
    });

    return res.status(httpStatus.OK).json({
      message: "Doctors profiles fetched successfully",
      count: record.count,
      record: record.rows,
    });
  } catch (err) {
    return res.status(httpStatus.INTERNAL_SERVER_ERROR).json({
      message: "Failed to fetch all Doctors profiles",
    });
  }
}

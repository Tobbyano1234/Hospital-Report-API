import Joi from "joi";
import jwt from "jsonwebtoken";

export const createDoctorSchema = Joi.object().keys({
  DoctorsName: Joi.string().lowercase().required(),
  email: Joi.string().required(),
  specialization: Joi.string().required(),
  gender: Joi.string().required(),
  phone: Joi.string().required(),
});

export const updateDoctorSchema = Joi.object().keys({
  DoctorsName: Joi.string().lowercase().required(),
  email: Joi.string().required(),
  specialization: Joi.string().required(),
  gender: Joi.string().required(),
  phone: Joi.string().required(),
});

export const registerSchema = Joi.object()
  .keys({
    DoctorsName: Joi.string().required(),
    email: Joi.string().trim().lowercase().required(),
    specialization: Joi.string().required(),
    gender: Joi.string().required(),
    phoneNumber: Joi.string()
      .length(11)
      .pattern(/^[0-9]+$/)
      .required(),
    password: Joi.string()
      .regex(/^[a-zA-Z0-9]{3,30}$/)
      .required(),
    confirm_password: Joi.ref("password"),
  })
  .with("password", "confirm_password");

export const loginSchema = Joi.object().keys({
  email: Joi.string().trim().lowercase().required(),
  password: Joi.string()
    .regex(/^[a-zA-Z0-9]{3,30}$/)
    .required(),
});

export const generateToken = (doctor: { [key: string]: unknown }): unknown => {
  const pass = process.env.JWT_SECRET as string;
  return jwt.sign(doctor, pass, { expiresIn: "7d" });
};

export const createPatientSchema = Joi.object().keys({
  patientName: Joi.string().required(),
  age: Joi.number().required(),
  hospitalName: Joi.string().required(),
  weight: Joi.string(),
  height: Joi.string(),
  bloodGroup: Joi.string(),
  genotype: Joi.string(),
  bloodPressure: Joi.string(),
  HIV_status: Joi.string(),
  hepatitis: Joi.string(),
});

export const updatePatientSchema = Joi.object().keys({
  patientName: Joi.string().required(),
  age: Joi.number().required(),
  hospitalName: Joi.string().required(),
  weight: Joi.string().required(),
  height: Joi.string().required(),
  bloodGroup: Joi.string().required(),
  genotype: Joi.string().required(),
  bloodPressure: Joi.string().required(),
  HIV_status: Joi.string().required(),
  hepatitis: Joi.string().required(),
});

export const options = {
  abortEarly: false,
  errors: {
    wrap: {
      label: "",
    },
  },
};

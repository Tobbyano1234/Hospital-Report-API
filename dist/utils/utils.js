"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.options = exports.updatePatientSchema = exports.createPatientSchema = exports.generateToken = exports.loginSchema = exports.registerSchema = exports.updateDoctorSchema = exports.createDoctorSchema = void 0;
const joi_1 = __importDefault(require("joi"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
exports.createDoctorSchema = joi_1.default.object().keys({
    DoctorsName: joi_1.default.string().lowercase().required(),
    email: joi_1.default.string().required(),
    specialization: joi_1.default.string().required(),
    gender: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
});
exports.updateDoctorSchema = joi_1.default.object().keys({
    DoctorsName: joi_1.default.string().lowercase().required(),
    email: joi_1.default.string().required(),
    specialization: joi_1.default.string().required(),
    gender: joi_1.default.string().required(),
    phone: joi_1.default.string().required(),
});
exports.registerSchema = joi_1.default.object()
    .keys({
    DoctorsName: joi_1.default.string().required(),
    email: joi_1.default.string().trim().lowercase().required(),
    specialization: joi_1.default.string().required(),
    gender: joi_1.default.string().required(),
    phoneNumber: joi_1.default.string()
        .length(13)
        .pattern(/^[0-9]+$/)
        .required(),
    password: joi_1.default.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
    confirm_password: joi_1.default.ref("password"),
})
    .with("password", "confirm_password");
exports.loginSchema = joi_1.default.object().keys({
    email: joi_1.default.string().trim().lowercase().required(),
    password: joi_1.default.string()
        .regex(/^[a-zA-Z0-9]{3,30}$/)
        .required(),
});
const generateToken = (doctor) => {
    const pass = process.env.JWT_SECRET;
    return jsonwebtoken_1.default.sign(doctor, pass, { expiresIn: "7d" });
};
exports.generateToken = generateToken;
exports.createPatientSchema = joi_1.default.object().keys({
    patientName: joi_1.default.string().required(),
    age: joi_1.default.number().required(),
    hospitalName: joi_1.default.string().required(),
    weight: joi_1.default.string(),
    height: joi_1.default.string(),
    bloodGroup: joi_1.default.string(),
    genotype: joi_1.default.string(),
    bloodPressure: joi_1.default.string(),
    HIV_status: joi_1.default.string(),
    hepatitis: joi_1.default.string(),
});
exports.updatePatientSchema = joi_1.default.object().keys({
    patientName: joi_1.default.string().required(),
    age: joi_1.default.number().required(),
    hospitalName: joi_1.default.string().required(),
    weight: joi_1.default.string().required(),
    height: joi_1.default.string().required(),
    bloodGroup: joi_1.default.string().required(),
    genotype: joi_1.default.string().required(),
    bloodPressure: joi_1.default.string().required(),
    HIV_status: joi_1.default.string().required(),
    hepatitis: joi_1.default.string().required(),
});
exports.options = {
    abortEarly: false,
    errors: {
        wrap: {
            label: "",
        },
    },
};

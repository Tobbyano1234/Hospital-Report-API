"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.getAllDoctor = exports.getDoctor = exports.LoginDoctor = exports.RegisterDoctor = void 0;
const uuid_1 = require("uuid");
const doctorModel_1 = require("../model/doctorModel");
const utils_1 = require("../utils/utils");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const reportModel_1 = require("../model/reportModel");
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtsecret = process.env.JWT_SECRET;
async function RegisterDoctor(req, res, next) {
    const doctorId = (0, uuid_1.v4)();
    try {
        const validateResult = utils_1.registerSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .json({ Error: validateResult.error.details[0].message });
        }
        const duplicateEmail = await doctorModel_1.DoctorsInstance.findOne({
            where: { email: req.body.email },
        });
        if (duplicateEmail) {
            return res
                .status(http_status_1.default.CONFLICT)
                .json({ msg: "Email already exit" });
        }
        const duplicatePhoneNumber = await doctorModel_1.DoctorsInstance.findOne({
            where: { phoneNumber: req.body.phoneNumber },
        });
        if (duplicatePhoneNumber) {
            return res
                .status(http_status_1.default.CONFLICT)
                .json({ msg: "Phone number already exit" });
        }
        const passwordHash = await bcryptjs_1.default.hash(req.body.password, 8);
        const { DoctorsName, email, specialization, gender, phoneNumber } = req.body;
        const doctors = {
            id: doctorId,
            DoctorsName,
            email,
            specialization,
            gender,
            phoneNumber,
            password: passwordHash,
        };
        const record = await doctorModel_1.DoctorsInstance.create(doctors);
        return res
            .status(http_status_1.default.CREATED)
            .json({ message: "You have successfully created a user", record });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Failed to create user",
        });
    }
}
exports.RegisterDoctor = RegisterDoctor;
async function LoginDoctor(req, res, next) {
    try {
        const validateResult = utils_1.loginSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .json({ Error: validateResult.error.details[0].message });
        }
        const doctor = (await doctorModel_1.DoctorsInstance.findOne({
            where: { email: req.body.email },
        }));
        if (!doctor) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                message: "Incorrect credentials",
            });
        }
        const { id } = doctor;
        const token = (0, utils_1.generateToken)({ id });
        const validUser = await bcryptjs_1.default.compare(req.body.password, doctor.password);
        if (!validUser) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                message: "Incorrect credentials",
            });
        }
        return res.status(http_status_1.default.OK).json({
            message: "Login Successfully",
            token,
            doctor,
        });
    }
    catch (error) {
        console.log(error);
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Failed to login",
        });
    }
}
exports.LoginDoctor = LoginDoctor;
async function getDoctor(req, res, next) {
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { id } = token;
        const record = await doctorModel_1.DoctorsInstance.findOne({
            where: { id },
            include: [{ model: reportModel_1.patientInstance, as: "Patient Report" }],
        });
        if (!record) {
            return res.status(http_status_1.default.NOT_FOUND).json({
                message: "Doctor does not exist",
            });
        }
        return res.status(http_status_1.default.OK).json({
            message: "Doctor's details fetched successfully",
            record,
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Failed to fetch doctor profiles",
        });
    }
}
exports.getDoctor = getDoctor;
async function getAllDoctor(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        const record = await doctorModel_1.DoctorsInstance.findAndCountAll({
            limit,
            offset,
            include: [{ model: reportModel_1.patientInstance, as: "Patient Report" }],
        });
        return res.status(http_status_1.default.OK).json({
            message: "Doctors profiles fetched successfully",
            count: record.count,
            record: record.rows,
        });
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Failed to fetch all Doctors profiles",
        });
    }
}
exports.getAllDoctor = getAllDoctor;

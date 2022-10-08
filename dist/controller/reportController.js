"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatientRecord = exports.updatePatientRecord = exports.getSinglePatientRecord = exports.getPatientRecord = exports.PatientRecord = void 0;
const reportModel_1 = require("../model/reportModel");
const utils_1 = require("../utils/utils");
const doctorModel_1 = require("../model/doctorModel");
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const jwtsecret = process.env.JWT_SECRET;
async function PatientRecord(req, res, next) {
    // const id = uuidv4();
    try {
        const token = req.headers.token;
        const { id } = jsonwebtoken_1.default.verify(token, jwtsecret);
        const validateResult = utils_1.createPatientSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .json({ Error: validateResult.error.details[0].message });
        }
        const doctor = doctorModel_1.DoctorsInstance.findOne({ where: { id } });
        if (!doctor) {
            return res.status(http_status_1.default.BAD_REQUEST).json({
                message: "Doctor not found",
            });
        }
        let patient = { patientId: id, ...req.body, doctorId: id };
        const record = await reportModel_1.patientInstance.create(patient);
        return res.status(http_status_1.default.CREATED).json({
            message: "Patient report created successfully",
            record,
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Failed to create patient report",
        });
    }
}
exports.PatientRecord = PatientRecord;
async function getPatientRecord(req, res, next) {
    try {
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { id } = token;
        const patient = await reportModel_1.patientInstance.findOne({ where: { doctorId: id } });
        const patientId = patient?.getDataValue("patientId");
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        const record = await reportModel_1.patientInstance.findAndCountAll({
            where: { patientId, doctorId: id },
            limit,
            offset,
            include: [
                {
                    model: doctorModel_1.DoctorsInstance,
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
        return res.status(http_status_1.default.OK).json({
            msg: "Patient reports fetched successfully",
            count: record.count,
            record: record.rows,
        });
    }
    catch (error) {
        return res.status(500).json({
            message: "Failed to fetch all patient reports",
        });
    }
}
exports.getPatientRecord = getPatientRecord;
async function getSinglePatientRecord(req, res, next) {
    try {
        const { patientId } = req.params;
        const verified = req.headers.token;
        const token = jsonwebtoken_1.default.verify(verified, jwtsecret);
        const { id } = token;
        const record = await reportModel_1.patientInstance.findOne({
            where: { doctorId: id, patientId },
        });
        return res
            .status(http_status_1.default.OK)
            .json({ message: "Patient report fetched successfully", record });
    }
    catch (error) {
        console.log(error);
        res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Failed to fetch patient report",
        });
    }
}
exports.getSinglePatientRecord = getSinglePatientRecord;
async function updatePatientRecord(req, res, next) {
    try {
        const { patientId } = req.params;
        const { patientName, age, hospitalName, weight, height, bloodGroup, genotype, bloodPressure, HIV_status, hepatitis, } = req.body;
        const validateResult = utils_1.updatePatientSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res
                .status(http_status_1.default.BAD_REQUEST)
                .json({ Error: validateResult.error.details[0].message });
        }
        const record = await reportModel_1.patientInstance.findOne({ where: { patientId } });
        if (!record) {
            return res.status(http_status_1.default.NOT_FOUND).json({
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
        return res.status(http_status_1.default.OK).json({
            message: "Patient report successfully updated",
            record: updatedRecord,
        });
    }
    catch (error) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Failed to update patient report",
        });
    }
}
exports.updatePatientRecord = updatePatientRecord;
async function deletePatientRecord(req, res, next) {
    try {
        const { patientId } = req.params;
        const record = await reportModel_1.patientInstance.findOne({ where: { patientId } });
        if (!record) {
            return res
                .status(http_status_1.default.NOT_FOUND)
                .json({ message: "Can not find patient report" });
        }
        const deletedRecord = await record.destroy();
        return res
            .status(http_status_1.default.OK)
            .json({ msg: "Patient report deleted successfully" });
    }
    catch (err) {
        return res.status(http_status_1.default.INTERNAL_SERVER_ERROR).json({
            message: "Failed to delete patient report",
        });
    }
}
exports.deletePatientRecord = deletePatientRecord;

"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.deletePatientRecord = exports.updatePatientRecord = exports.getSinglePatientRecord = exports.getPatientRecord = exports.PatientRecord = void 0;
const uuid_1 = require("uuid");
const reportModel_1 = require("../model/reportModel");
const utils_1 = require("../utils/utils");
const doctorModel_1 = require("../model/doctorModel");
async function PatientRecord(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const verified = req.user;
        const validateResult = utils_1.createPatientSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res
                .status(400)
                .json({ Error: validateResult.error.details[0].message });
        }
        let patient = { patientId: id, ...req.body, DoctorId: verified.id };
        const record = await reportModel_1.patientInstance.create(patient);
        res
            .status(201)
            .json({ msg: "You have successfully created a patient report", record });
    }
    catch (err) {
        res.status(500).json({
            msg: "Failed to create patient report",
            route: "/create",
        });
    }
}
exports.PatientRecord = PatientRecord;
async function getPatientRecord(req, res, next) {
    try {
        const limit = req.query?.limit;
        const offset = req.query?.offset;
        const record = await reportModel_1.patientInstance.findAndCountAll({
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
        res.status(200).json({
            msg: "You have successfully fetch all patient reports",
            count: record.count,
            record: record.rows,
        });
    }
    catch (err) {
        res.status(500).json({
            msg: "Failed to fetch all patient reports",
            route: "/read",
        });
    }
}
exports.getPatientRecord = getPatientRecord;
async function getSinglePatientRecord(req, res, next) {
    try {
        const { patientId } = req.params;
        console.log(patientId);
        console.log("before");
        const record = await reportModel_1.patientInstance.findOne({
            where: { patientId },
        });
        console.log("after");
        res
            .status(200)
            .json({ msg: "You have successfully find your patient report", record });
    }
    catch (err) {
        console.log(err);
        res.status(500).json({
            msg: "Failed to read single patient report",
            route: "/read/:id",
        });
    }
}
exports.getSinglePatientRecord = getSinglePatientRecord;
async function updatePatientRecord(req, res, next) {
    const id = (0, uuid_1.v4)();
    try {
        const { patientId } = req.params;
        const { patientName, age, hospitalName, weight, height, bloodGroup, genotype, bloodPressure, HIV_status, hepatitis, } = req.body;
        const validateResult = utils_1.updatePatientSchema.validate(req.body, utils_1.options);
        if (validateResult.error) {
            return res
                .status(400)
                .json({ Error: validateResult.error.details[0].message });
        }
        const record = await reportModel_1.patientInstance.findOne({ where: { patientId } });
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
    }
    catch (err) {
        res.status(500).json({
            msg: "Failed to update patient report",
            route: "/update/:id",
        });
    }
}
exports.updatePatientRecord = updatePatientRecord;
async function deletePatientRecord(req, res, next) {
    try {
        const { patientId } = req.params;
        const record = await reportModel_1.patientInstance.findOne({ where: { patientId } });
        if (!record) {
            return res.status(404).json({ msg: "Can not find patient report" });
        }
        const deletedRecord = await record.destroy();
        return res
            .status(200)
            .json({ msg: "Successfully deleted patient report", deletedRecord });
    }
    catch (err) {
        res.status(500).json({
            msg: "Failed to delete patient report",
            route: "/delete/:id",
        });
    }
}
exports.deletePatientRecord = deletePatientRecord;

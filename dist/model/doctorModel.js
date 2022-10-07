"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DoctorsInstance = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
const reportModel_1 = require("../model/reportModel");
class DoctorsInstance extends sequelize_1.Model {
}
exports.DoctorsInstance = DoctorsInstance;
DoctorsInstance.init({
    id: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    DoctorsName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        validate: {
            notNull: {
                msg: "Full name is required",
            },
            notEmpty: {
                msg: "Provide the full name",
            },
        },
    },
    email: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "Email is required",
            },
            isEmail: {
                msg: "Provide the valid email",
            },
        },
    },
    specialization: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: false,
        validate: {
            notNull: {
                msg: "specialization is required",
            },
            isAlpha: {
                msg: "Provide the valid specialization",
            },
        },
    },
    gender: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    phoneNumber: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
        unique: true,
        validate: {
            notNull: {
                msg: "Phone number is required",
            },
            isNumeric: {
                msg: "Provide the valid phone number",
            },
        },
    },
    password: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
        unique: true,
    },
}, {
    sequelize: database_config_1.default,
    tableName: "Doctors",
});
// Linking doctor to all patient report
DoctorsInstance.hasMany(reportModel_1.patientInstance, {
    foreignKey: "doctorId",
    as: "Patient Report",
});
reportModel_1.patientInstance.belongsTo(DoctorsInstance, {
    foreignKey: "doctorId",
    as: "Doctors",
});

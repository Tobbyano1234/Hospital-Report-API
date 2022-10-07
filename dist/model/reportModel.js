"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.patientInstance = void 0;
const sequelize_1 = require("sequelize");
const database_config_1 = __importDefault(require("../config/database.config"));
class patientInstance extends sequelize_1.Model {
}
exports.patientInstance = patientInstance;
patientInstance.init({
    patientId: {
        type: sequelize_1.DataTypes.UUIDV4,
        primaryKey: true,
        allowNull: false,
    },
    doctorId: {
        type: sequelize_1.DataTypes.STRING,
        primaryKey: true,
        allowNull: false,
    },
    patientName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    age: {
        type: sequelize_1.DataTypes.NUMBER,
        allowNull: false,
    },
    hospitalName: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    weight: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    height: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bloodGroup: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    genotype: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    bloodPressure: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    HIV_status: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
    hepatitis: {
        type: sequelize_1.DataTypes.STRING,
        allowNull: false,
    },
}, {
    sequelize: database_config_1.default,
    tableName: "Patient Report",
});

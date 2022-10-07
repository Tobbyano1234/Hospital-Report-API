import { DataTypes, Model } from "sequelize";
import db from "../config/database.config";
import { patientInstance } from "../model/reportModel";

export interface DoctorsAttributes {
  id: string;
  DoctorsName: string;
  email: string; // no duplicates allowed.
  specialization: string;
  gender: string;
  phoneNumber: number;
  password: string;
}

export class DoctorsInstance extends Model<DoctorsAttributes> {}

DoctorsInstance.init(
  {
    id: {
      type: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    DoctorsName: {
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
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
      type: DataTypes.STRING,
      allowNull: false,
    },
    phoneNumber: {
      type: DataTypes.NUMBER,
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
      type: DataTypes.STRING,
      allowNull: false,
      unique: true,
    },
  },
  {
    sequelize: db,
    tableName: "Doctors",
  }
);

// Linking doctor to all patient report
DoctorsInstance.hasMany(patientInstance, {
  foreignKey: "doctorId",
  as: "Patient Report",
});

patientInstance.belongsTo(DoctorsInstance, {
  foreignKey: "doctorId",
  as: "Doctors",
});

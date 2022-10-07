import express from "express";

import {
  dashboard,
  doctorRegister,
  doctorLogin,
  loginAdmin,
  doctorProfile,
  loginPanel,
  contact,
} from "../controller/routerController";

const router = express.Router();

// rendering mainpage/dashboard
router.get("/dashboard", dashboard);

// rendering doctors-register page
router.get("/doctors/register", doctorRegister);

// rendering doctor login page
router.get("/doctors/login", doctorLogin);

// router.get("/doctors/login/profile", doctorProfile);

// rendering login_admin page
router.get("/login_admin", loginAdmin);

// render login panel
router.get("/", loginPanel);

// render contact page
router.get("/contact", contact);

export default router;

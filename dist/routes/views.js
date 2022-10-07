"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const routerController_1 = require("../controller/routerController");
const router = express_1.default.Router();
// rendering mainpage/dashboard
router.get("/dashboard", routerController_1.dashboard);
// rendering doctors-register page
router.get("/doctors/register", routerController_1.doctorRegister);
// rendering doctor login page
router.get("/doctors/login", routerController_1.doctorLogin);
// router.get("/doctors/login/profile", doctorProfile);
// rendering login_admin page
router.get("/login_admin", routerController_1.loginAdmin);
// render login panel
router.get("/", routerController_1.loginPanel);
// render contact page
router.get("/contact", routerController_1.contact);
exports.default = router;

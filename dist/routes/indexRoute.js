"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const http_status_1 = __importDefault(require("http-status"));
const router = express_1.default.Router();
router.get("/", (req, res) => {
    res
        .status(http_status_1.default.OK)
        .redirect("https://documenter.getpostman.com/view/21657944/2s83zguQSW");
});
exports.default = router;

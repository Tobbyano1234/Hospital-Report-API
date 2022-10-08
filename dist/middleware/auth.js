"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.auth = void 0;
const http_status_1 = __importDefault(require("http-status"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const secret = process.env.JWT_SECRET;
async function auth(req, res, next) {
    try {
        const token = req.headers.token;
        if (!token) {
            res.status(http_status_1.default.UNAUTHORIZED).json({
                Error: "Kindly sign in as a Doctor",
            });
            return;
        }
        let verified = jsonwebtoken_1.default.verify(token, secret);
        if (!verified) {
            return res
                .status(http_status_1.default.UNAUTHORIZED)
                .json({ Error: "Doctor not verify, you can access this route" });
        }
        next();
    }
    catch (error) {
        return res
            .status(http_status_1.default.FORBIDDEN)
            .json({ Error: "Doctor is not not logged in" });
    }
}
exports.auth = auth;

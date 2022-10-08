"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const http_errors_1 = __importDefault(require("http-errors"));
const express_1 = __importDefault(require("express"));
const path_1 = __importDefault(require("path"));
const cookie_parser_1 = __importDefault(require("cookie-parser"));
const morgan_1 = __importDefault(require("morgan"));
const database_config_1 = __importDefault(require("./config/database.config"));
const cors_1 = __importDefault(require("cors"));
database_config_1.default.sync()
    // db.sync({ force: true })
    .then(() => {
    console.log(`Database connected successfully`);
})
    .catch((err) => console.log(err));
const indexRoute_1 = __importDefault(require("./routes/indexRoute"));
const doctors_1 = __importDefault(require("./routes/doctors"));
const reports_1 = __importDefault(require("./routes/reports"));
const app = (0, express_1.default)();
// const PORT = process.env.PORT || 5000;
// view engine setup
// app.set("views", path.join(__dirname, "..", "views"));
// app.set("view engine", "ejs");
// //ejs layout
// app.use(ejsLayouts);
// app.set("layout", "./layouts/main");
app.use((0, morgan_1.default)("dev"));
app.use(express_1.default.json());
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, cookie_parser_1.default)());
// app.use(cors());
app.use((0, cors_1.default)({
    origin: process.env.CLIENT_APP_URL,
    methods: ["GET", "HEAD", "OPTIONS", "PUT", "PATCH", "POST", "DELETE"],
    credentials: true,
    optionsSuccessStatus: 200,
    exposedHeaders: [
        "X-Powered-By",
        "Access-Control-Allow-Origin",
        "Vary",
        "Access-Control-Allow-Credentials",
        "Set-Cookie",
        "Content-Type",
        "Content-Length",
        "ETag",
        "Date",
        "Connection",
        "Keep-Alive",
    ],
    allowedHeaders: [
        "Cookie",
        "Cache-Control",
        "Content-Type",
        "Content-Length",
        "Host",
        "User-Agent",
        "Accept",
        "Accept-Encoding",
        "X-Requested-With",
        "Connection",
        "Authorization",
    ],
}));
app.use(express_1.default.static(path_1.default.join(__dirname, "public")));
// app.use("/", viewsRouter);
app.use("/", indexRoute_1.default);
app.use("/api-v1/doctors", doctors_1.default);
app.use("/api-v1/patients", reports_1.default);
// catch 404 and forward to error handler
app.use(function (req, res, next) {
    next((0, http_errors_1.default)(404));
});
// error handler
app.use(function (err, req, res, next) {
    // set locals, only providing error in development
    res.locals.message = err.message;
    res.locals.error = req.app.get("env") === "development" ? err : {};
    // render the error page
    res.status(err.status || 500);
    res.render("error");
});
exports.default = app;

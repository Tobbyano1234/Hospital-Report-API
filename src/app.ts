import createError from "http-errors";
import express, { Request, Response, NextFunction } from "express";
import path from "path";
import cookieParser from "cookie-parser";
import logger from "morgan";
import db from "./config/database.config";
import cors from "cors";
import swagger from "swagger-ui-express";
import yamljs from "yamljs";

const swaggerDoc = yamljs.load("./documentation.yaml");

db.sync()
  // db.sync({ force: true })
  .then(() => {
    console.log(`Database connected successfully`);
  })
  .catch((err) => console.log(err));

import indexRouter from "./routes/indexRoute";
import doctorRouter from "./routes/doctors";
import reportRouter from "./routes/reports";

const app = express();

// const PORT = process.env.PORT || 5000;

// view engine setup
// app.set("views", path.join(__dirname, "..", "views"));
// app.set("view engine", "ejs");

// //ejs layout
// app.use(ejsLayouts);
// app.set("layout", "./layouts/main");

app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());
app.use(cors());
// app.use(
//   cors({
//     origin: process.env.CLIENT_APP_URL,
//     methods: ["GET", "HEAD", "OPTIONS", "PUT", "PATCH", "POST", "DELETE"],
//     credentials: true,
//     optionsSuccessStatus: 200,
//     exposedHeaders: [
//       "X-Powered-By",
//       "Access-Control-Allow-Origin",
//       "Vary",
//       "Access-Control-Allow-Credentials",
//       "Set-Cookie",
//       "Content-Type",
//       "Content-Length",
//       "ETag",
//       "Date",
//       "Connection",
//       "Keep-Alive",
//     ],
//     allowedHeaders: [
//       "Cookie",
//       "Cache-Control",
//       "Content-Type",
//       "Content-Length",
//       "Host",
//       "User-Agent",
//       "Accept",
//       "Accept-Encoding",
//       "X-Requested-With",
//       "Connection",
//       "Authorization",
//     ],
//   })
// );
app.use(express.static(path.join(__dirname, "public")));

// app.use("/", viewsRouter);
// app.use("/", indexRouter);
app.use("/api-v1/doctors", doctorRouter);
app.use("/api-v1/patients", reportRouter);
app.use("/", swagger.serve, swagger.setup(swaggerDoc));

// catch 404 and forward to error handler
app.use(function (req: Request, res: Response, next: NextFunction) {
  next(createError(404));
});

// error handler
app.use(function (
  err: createError.HttpError,
  req: Request,
  res: Response,
  next: NextFunction
) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

export default app;

const createError = require("http-errors");
const express = require("express");
const path = require("path");
const cookieParser = require("cookie-parser");
const logger = require("morgan");
const fs = require("fs");


const app = express();

// Глобальные мидлвары
app.use(logger("dev"));
app.use(express.json());
app.use(express.urlencoded({ extended: false }));
app.use(cookieParser());

// Раздаём статические файлы из папки uploads
app.use("/uploads", express.static("uploads"));

if (!fs.existsSync("uploads")) {
  fs.mkdirSync("uploads");
}

// Настройка движка представлений
app.set("view engine", "jade");

// Роуты
app.use("/api", require("./routes"));

// Обработка 404 ошибок
app.use(function (req, res, next) {
  next(createError(404));
});

// Обработка других ошибок
app.use(function (err, req, res, next) {
  // set locals, only providing error in development
  res.locals.message = err.message;
  res.locals.error = req.app.get("env") === "development" ? err : {};

  // render the error page
  res.status(err.status || 500);
  res.render("error");
});

module.exports = app;

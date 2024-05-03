const path = require("path");
const express = require("express");
const bodyParser = require("body-parser");
const expressLayouts = require("express-ejs-layouts");
const app = express();
const router = express.Router();

// load env vars
require("dotenv").config();

//Loading Routes
const webRoutes = require("./routes/web");
const sequelize = require("./config/database");

const PORT = process.env.PORT || 8000;

// parse application/json
app.use(bodyParser.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));

// set views
app.set("view engine", "ejs");
app.use(expressLayouts);
app.use(express.static(__dirname + "/public"));
app.set("layout", "layouts/app");

// Routes
app.use(webRoutes);

sequelize
  .sync()
  .then(() => {
    app.listen(PORT, process.env.IP, function () {
      console.log("Example app started!");
    });
    //pending set timezone
    console.log("App listening on port " + PORT);
  })
  .catch((err) => {
    console.log(err);
  });

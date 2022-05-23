const express = require("express");
const methodOverride = require("method-override");
const controllers = require("./controllers");
const app = express();
const session = require("express-session");
const MongoStore = require("connect-mongo");
const navLinks = require("./navLinks");

app.listen(process.env.PORT) || 3000;

require("./config/db.connection");

app.set("view engine", "ejs");

app.use(express.static("public"));

app.use(methodOverride("_method"));

app.use(express.urlencoded({ extended: false }));

app.use(
  session({
    store: MongoStore.create({
      mongoUrl: process.env.MONGODB_URI,
    }),
    secret: "secretKey",
    resave: false,
    saveUninitialized: false,
    cookie: {
      maxAge: 1000 * 60 * 60 * 24, // one day
    },
  })
);


let sessionLog = (req, res, next) => {
  console.log(req.session);
  next();
};

app.use(sessionLog);

const authRequired = function (req, res, next) {
  if (req.session.currentUser) {
    return next();
  }
  return res.redirect("/");
};

app.use("/home", authRequired, controllers.home);
app.use("/auth", controllers.auth);
app.use(navLinks);

app.use(function (req, res, next) {
  res.locals.user = req.session.currentUser;
  next();
});

app.get("/", (req, res) => {
  res.redirect("/auth/login");
});



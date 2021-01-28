const express = require("express");
const app = express();
const port = 3003;
const middeware = require("./middleware");
const path = require("path");
const bodyParser = require("body-parser");
const mongoose = require("./database");
const session = require('express-session');



//Server Instance
const server = app.listen(port, () => {
  console.log("Server listening on port " + port);
});

app.set("view engine", "pug");
app.set("views", "views"); //Whenn you need views go to views folder

app.use(bodyParser.urlencoded({ extended: false }));
//Servers as a static file
app.use(express.static(path.join(__dirname, "public")));
app.use(session({
  secret : "PariArora",
  //Saves even if not modified
  resave : true,
  //Will not save if not initialized
  saveUninitialized : false,
}))

//Routes
const loginRoute = require("./routes/loginRoutes");
const registerRoute = require("./routes/registerRoutes");
const logoutRoute = require("./routes/logout");

app.use("/login", loginRoute);
app.use("/register", registerRoute);
app.use("/logout", logoutRoute);

app.get("/", middeware.requireLogin, (req, res, next) => {
  var payload = {
    pageTitle: "Home",
    userLoggedIn : req.session.user,
  };
  res.status(200).render("home", payload);
});

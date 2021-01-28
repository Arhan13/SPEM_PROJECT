const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const User = require("../schemas/UserSchema");
const bcrypt = require("bcrypt");

app.set("view engine", "pug");
app.set("views", "views");

app.use(bodyParser.urlencoded({ extended: false }));

router.get("/", (req, res, next) => {
  res.status(200).render("register");
});

router.post("/", async (req, res, next) => {
  console.log(req.body);
  var firstName = req.body.firstName.trim();
  var lastName = req.body.lastName.trim();
  var username = req.body.username.trim();
  var email = req.body.email.trim();
  var password = req.body.password;

  var payload = req.body;

  if (firstName && lastName && username && email && password) {
    //Look for one document in Mongo
    //Waiting until its given back...
    var user = await User.findOne({
      $or: [{ username: username }, { email: email }],
    }).catch((error) => {
      console.log(error);
      payload.errorMessage = "Something went wrong";
      res.status(200).render("register", payload);
    });

    if (user === null) {
      //No user found
      var data = req.body;
      data.password = await bcrypt.hash(password, 10);

      //We will save the user and save it in session
      User.create(data).then((user) => {
        req.session.user = user;
        return res.redirect("/");
      });
    } else {
      //User found
      if (email === user.email && username === user.username) {
        payload.errorMessage = "Email and username already is use.";
      } else if (email === user.email) {
        payload.errorMessage = "Email already is use.";
      } else {
        payload.errorMessage = "Username already is use.";
      }
      res.status(200).render("register", payload);
    }
  } else {
    payload.errorMessage = "Make sure each field has a valid value.";
    res.status(200).render("register", payload);
  }
});

module.exports = router;

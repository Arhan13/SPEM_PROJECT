const express = require("express");
const app = express();
const router = express.Router();
const bodyParser = require("body-parser");
const bcrypt = require("bcrypt");
const User = require("../schemas/UserSchema");

app.set("view engine", "pug");
//Whenn you need views go to views folder
app.set("views", "views");
app.use(bodyParser.urlencoded({ extended: false }));

//Configuring the router
//Only handeling the route
router.get("/", (req, res, next) => {
  //trying to find login template
  res.status(200).render("login");
});

router.post("/", async (req, res, next) => {

  var payload = req.body;

  if (req.body.logUsername && req.body.logPassword) {
    //Check if they have this username or email exists
    var user = await User.findOne({
      $or: [
        //Find either of the two ie the username can be username or email
        { username: req.body.logUsername }, 
        { email: req.body.logUsername }
      ],
    }).catch((error) => {
      console.log(error);
      payload.errorMessage = "Something went wrong";
      res.status(200).render("login", payload);
    });

    if (user != null) {
      const result = await bcrypt.compare(req.body.logPassword, user.password)

      if (result === true) {
        //Seeting the session
        req.session.user = user;
        return res.redirect("/");
      }
    }
    payload.errorMessage = "Login credentials incorrect";
    return res.status(200).render("login", payload);
  }
  //trying to find login template
  payload.errorMessage = "Make sure each field has a valid value";
  res.status(200).render("login");
});

module.exports = router;

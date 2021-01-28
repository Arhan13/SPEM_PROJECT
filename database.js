const mongoose = require("mongoose");
mongoose.set("useNewUrlParser", true);
mongoose.set("useUnifiedTopology", true);
mongoose.set("useFindAndModify", false);
mongoose.set("useUnifiedTopology", true);

class Database {
  constructor() {
    this.connect();
  }
  connect() {
    mongoose
      .connect(
        "mongodb+srv://Arhan:bank1234@cluster0.jjxdj.mongodb.net/TwitterClone?retryWrites=true&w=majority"
      )
      .then(() => {
        console.log("database conection successful");
      })
      .catch((err) => {
        console.log("database conection error " + err);
      });
  }
}

//Exporting an instance of database
module.exports = new Database();

/* what properties should a user have?

username
password
email

// later: social login: facebook
// (firstname)
// (lastname)

*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const userSchema = new Schema({
  username: { type: String }, // unique?
  password: { type: String },
  email: { type: String },
});

const User = mongoose.model("User", userSchema);

module.exports = User;

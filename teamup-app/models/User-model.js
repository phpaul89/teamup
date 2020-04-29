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

const userSchema = new Schema(
  {
    username: { type: String }, // unique?
    password: { type: String },
    email: { type: String },
    googleID: { type: String },
    facebookId: { type: String },
    friends: { type: Schema.Types.ObjectId, ref: "User" },
    myTeams: { type: Schema.Types.ObjectId, ref: "Team" },
    // googleID: { type: Schema.Types.ObjectId, ref: "User" },
    // facebookId: { type: Schema.Types.ObjectId, ref: "User" },
  },
  {
    timestamps: true,
  }
);

const User = mongoose.model("User", userSchema);

module.exports = User;

// jshint esversion:8

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const teamSchema = new Schema({
  teamName: { type: String },
  teamMembers: { type: Schema.Types.ObjectId, ref: "User" }, // min/max value? find out in documentation of mongoose
  // category:
  // description:
  // logo
});

const Team = mongoose.model("Team", teamSchema);

module.exports = Team;

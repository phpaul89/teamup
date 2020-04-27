const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const scheduleSchema = new Schema({
  date: { type: date },
  timeSlot: { type: String }, // "8-9", "9to10", ..
  hall: { type: Schema.Types.ObjectId, ref: "Hall" },
  team: { type: Schema.Types.ObjectId, ref: "Team" }, // check!!
});

const Schedule = mongoose.model("Schedule", scheduleSchema);

module.exports = Schedule;

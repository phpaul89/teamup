/*

zip:
city:
street:
name:

// later:
users adding images
users adding more stuff
bezirke
equiment: basketball korb, volleyball nets

*/

const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const hallSchema = new Schema({
  name: { type: String },
  street: { type: String }, // check for type: Address? ---> coordinates: how does the API get the coordinates?
  zip: { type: String },
  city: { type: String },
  // later: equipment, images, bezirke
  // slotsBooked: { type: Schema.Types.ObjectId, ref: "Schedule" },
});

const Hall = mongoose.model("Hall", hallSchema);

module.exports = Hall;

/*
to lookup:
- API coordinates via street, zip?
- how to add images?
...

*/

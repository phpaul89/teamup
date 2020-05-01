const usersDemo = [
  {
    username: "Dioni",
    password: "dioni123",
    email: "dioni@dioni.com",
    city: "Berlin",
    bezirk: "Kreuzberg",
    zip: "10961",
  },
  {
    username: "Jony",
    password: "jony123",
    email: "jony@jony.com",
    city: "Berlin",
    bezirk: "Kreuzberg",
    zip: "10961",
  },
  {
    username: "Viktoria",
    password: "viktoria123",
    email: "viktoria@viktoria.com",
    city: "Berlin",
    bezirk: "Kreuzberg",
    zip: "10961",
  },
  {
    username: "Nate",
    password: "nate123",
    email: "nate@nate.com",
    city: "Berlin",
    bezirk: "Kreuzberg",
    zip: "10961",
  },
  {
    username: "Karl",
    password: "karl123",
    email: "karl@karl.com",
    city: "Berlin",
    bezirk: "Kreuzberg",
    zip: "10961",
  },
  {
    username: "Yosra",
    password: "yosra123",
    email: "yosra@yosra.com",
    city: "Berlin",
    bezirk: "Kreuzberg",
    zip: "10961",
  },
  {
    username: "Alfonso",
    password: "alfonso123",
    email: "alfonso@alfonso.com",
    city: "Berlin",
    bezirk: "Banana",
    zip: "10961",
  },
  {
    username: "Chantel",
    password: "chantel123",
    email: "chantel@chantel.com",
    city: "Berlin",
    bezirk: "Kreuzberg",
    zip: "10961",
  },
  {
    username: "Jeff",
    password: "jeff123",
    email: "jeff@jeff.com",
    city: "Berlin",
    bezirk: "Kreuzberg",
    zip: "10961",
  },
  {
    username: "Sebastian",
    password: "sebastian123",
    email: "sebastian@sebastian.com",
    city: "Berlin",
    bezirk: "Kreuzberg",
    zip: "10961",
  },
  {
    username: "Agustina",
    password: "agustina123",
    email: "agustina@agustina.com",
    city: "Berlin",
    bezirk: "Kreuzberg",
    zip: "10961",
  },
  {
    username: "Andre",
    password: "andre123",
    email: "andre@andre.com",
    city: "Berlin",
    bezirk: "Kreuzberg",
    zip: "10961",
  },
  {
    username: "Timur",
    password: "timur123",
    email: "timur@timur.com",
    city: "Berlin",
    bezirk: "Kreuzberg",
    zip: "10961",
  },
  {
    username: "Paula",
    password: "paula123",
    email: "paula@paula.com",
    city: "Berlin",
    bezirk: "Friedrichshain",
    zip: "10243",
  },
  {
    username: "Lucas",
    password: "lucas123",
    email: "lucas@lucas.com",
    city: "Berlin",
    bezirk: "Friedrichshain",
    zip: "10243",
  },
  {
    username: "Sami",
    password: "sami123",
    email: "sami@sami.com",
    city: "Berlin",
    bezirk: "Friedrichshain",
    zip: "10243",
  },
  {
    username: "Marcia",
    password: "marcia123",
    email: "marcia@marcia.com",
    city: "Berlin",
    bezirk: "Friedrichshain",
    zip: "10243",
  },
  {
    username: "Benjamin",
    password: "benjamin123",
    email: "benjamin@benjamin.com",
    city: "Berlin",
    bezirk: "Friedrichshain",
    zip: "10243",
  },
  {
    username: "Aleah",
    password: "aleah123",
    email: "aleah@aleah.com",
    city: "Berlin",
    bezirk: "Friedrichshain",
    zip: "10243",
  },
  {
    username: "Jan",
    password: "jan123",
    email: "jan@jan.com",
    city: "Berlin",
    bezirk: "Friedrichshain",
    zip: "10243",
  },
  {
    username: "Manuel",
    password: "manuel123",
    email: "manuel@manuel.com",
    city: "Berlin",
    bezirk: "Friedrichshain",
    zip: "10243",
  },
  {
    username: "Markus",
    password: "markus123",
    email: "markus@markus.com",
    city: "Berlin",
    bezirk: "Friedrichshain",
    zip: "10243",
  },
  {
    username: "Olah",
    password: "olah123",
    email: "olah@olah.com",
    city: "Berlin",
    bezirk: "Friedrichshain",
    zip: "10243",
  },
  {
    username: "Avta",
    password: "avta123",
    email: "avta@avta.com",
    city: "Berlin",
    bezirk: "Friedrichshain",
    zip: "10243",
  },
  {
    username: "Maria",
    password: "maria123",
    email: "maria@maria.com",
    city: "Berlin",
    bezirk: "Friedrichshain",
    zip: "10243",
  },
  {
    username: "Jesus",
    password: "jesus123",
    email: "jesus@jesus.com",
    city: "Berlin",
    bezirk: "Friedrichshain",
    zip: "10243",
  },
  {
    username: "Clara",
    password: "clara123",
    email: "clara@clara.com",
    city: "Berlin",
    bezirk: "Friedrichshain",
    zip: "10243",
  },
  {
    username: "Marie",
    password: "clara123",
    email: "clara@clara.com",
    city: "Berlin",
    bezirk: "Friedrichshain",
    zip: "10243",
  },
  {
    username: "YungTing",
    password: "yt123",
    email: "yt@yt.com",
    city: "Berlin",
    bezirk: "Friedrichshain",
    zip: "10243",
  },
];

// see also Express Cinema Lab, here using .create() instead of insertMany()
const mongoose = require("mongoose");
const User = require("../models/User-model.js"); // User-model.js

//const databaseToUse = "teamup-app";

mongoose
  .connect(`${process.env.MONGODB_URI}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log(
      `Connected to MongoDB from seeds_Ironhack.js! Database name: "${x.connections[0].name}"`
    );

    User.create(usersDemo, (error, users) => {
      if (error) {
        return handleError(error);
      }
      console.log("Halls created: ", users);
      x.connections[0].close();
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

const hallsBerlin = [
  {
    identity: "1587838871-2574",
    link:
      "https://lsb-berlin.net/nc/service/spcitystaetten/typ/spcityhallen/seite/1",
    name: "Archenhold-Gymnasium",
    street: "Rudower Str. 7",
    zip: "12439",
    city: "Berlin",
  },
  {
    identity: "1587838809-2285",
    link:
      "https://lsb-berlin.net/nc/service/spcitystaetten/typ/spcityhallen/seite/11",
    name: "Hedwig-Dohm-Oberschule",
    street: "Stephanstr. 27",
    zip: "10559",
    city: "Berlin",
  },
  {
    identity: "1587838855-2491",
    link:
      "https://lsb-berlin.net/nc/service/spcitystaetten/typ/spcityhallen/seite/4",
    name: "Droste-Hülshoff-Schule",
    street: "Schönower Str. 8",
    zip: "14165",
    city: "Berlin",
  },
  {
    identity: "1587838834-2415",
    link:
      "https://lsb-berlin.net/nc/service/spcitystaetten/typ/spcityhallen/seite/7",
    name: "Goethe-Gymnasium",
    street: "Gasteiner Str. 23",
    zip: "10717",
    city: "Berlin",
  },
  {
    identity: "1587838871-2577",
    link:
      "https://lsb-berlin.net/nc/service/spcitystaetten/typ/spcityhallen/seite/1",
    name: "Arnold-Zweig-Grundschule",
    street: "Wollankstr. 131",
    zip: "13187",
    city: "Berlin",
  },
  {
    identity: "1587838707-1736",
    link:
      "https://lsb-berlin.net/nc/service/spcitystaetten/typ/spcityhallen/seite/29",
    name: "Spcityplätze im Spcityforum Hohenschönhausen",
    street: "Weißenseer Weg 51-55",
    zip: "13055",
    city: "Berlin",
  },
];

// see also Express Cinema Lab, here using .create() instead of insertMany()
const mongoose = require("mongoose");
const Hall = require("../models/Hall-model.js"); // Hall-model.js

const databaseToUse = "teamup-app";

mongoose
  .connect(`mongodb://localhost/${databaseToUse}`, {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  })
  .then((x) => {
    console.log(
      `Connected to MongoDB from seeds_shorts_halls.js! Database name: "${x.connections[0].name}"`
    );

    Hall.create(hallsBerlin, (error, halls) => {
      if (error) {
        return handleError(error);
      }
      console.log("Halls created: ", halls);
      x.connections[0].close();
    });
  })
  .catch((error) => {
    console.error("Error connecting to MongoDB", error);
  });

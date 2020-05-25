const express = require("express");
const logger = require("morgan");
const mongoose = require("mongoose");
const mongojs = require("mongojs");
const mongdb = mongojs('workout', ['workouts'])
const path = require("path");

const PORT = process.env.PORT || 3000;

const db = require("./models");

const app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.use(express.static("public"));

mongoose.connect(process.env.MONGODB_URI || "mongodb://localhost/workout", { useNewUrlParser: true });

app.get("/", (req, res ) => {
  res.sendFile(path.join(__dirname, "/public/index.html"));
});


app.get("/stats", (req, res ) => {
  res.sendFile(path.join(__dirname, "/public/stats.html"));
});


app.get("/exercise", (req, res ) => {
  res.sendFile(path.join(__dirname, "/public/exercise.html"));
});


  app.get("/api/workouts", (req, res) => {
   mongdb.workouts.find({ }, (error, found) => {
    if (error) {
      console.log(error);
    } else {
      res.json(found);
    }
    });
  });


  

  app.post("/api/workouts", ({ body }, res) => {
    console.log("postBody", body)
    db.Workout.create(body, (error, saved) => {
      if (error) {
        console.log(error);
      } else {
        res.send(saved);
      }
    });
  });

  app.get("/api/workouts/range", (req, res)=>{
    mongdb.workouts.find({ }, (error, found) => {
      if (error) {
        console.log(error);
      } else {
        res.json(found);
      }
    });
  })
  


  


  app.put("/api/workouts/:id", ({ params, body }, res) => {
    console.log('params', params)
    console.log('body', body)
    mongdb.workouts.findAndModify({
      query: {_id: mongojs.ObjectId(params.id)},
      update: { $push: {exercises: body} },
      new: true
    }, (err, doc)=>{
      if (err) {console.log(err)}
      res.json(doc)
    })
    
  });

  app.listen(PORT, () => {
    console.log(`App running on port ${PORT}!`);
  });
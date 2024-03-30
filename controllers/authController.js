//model and schema for users
const express = require("express");
//require('../db/config');
const cors = require("cors");
const User = require("../db/User");
const Hadith = require("../db/Hadith");
//const Information=require("../db/Information");
const app = express();

// Create route (API endpoint) for user signup
exports.signup = async (req, res) => {
  try {
    const newUser = await User.create({
      name: req.body.name,
      email: req.body.email,
      password: req.body.password,
    });
    res.status(200).json({
      status: "1",
      tocken,
      data: {
        newUser,
      },
    });
  } catch (error) {
    res.status(500).send("Error creating user: " + error.message);
  }
};

// Route for user login
exports.login = async (req, res) => {
  try {
    if (req.body.email && req.body.password) {
      // To remove the password, we use the select function and exclude it from the resonse
      const user = await User.findOne(req.body).select("-password");
      if (user) {
        res.send(user);
      } else {
        res.send({ result: "No user found." });
      }
    } else {
      res.send({ result: "Please Enter Email or Password" });
    }
  } catch (error) {
    res.status(500).send("Error logging in: " + error.message);
  }
};

// Route for adding a new hadith
exports.addHadith = async (req, res) => {
  try {
    
    const hadith = await Hadith.create(req.body);
    res.send(hadith);
  } catch (error) {
    res.status(500).send("Error adding new Hadith: " + error.message);
  }
};

// Fetch all hadiths
exports.fetchHadith = async (req, res) => {
  try {
    const hadiths = await Hadith.find();
    if (hadiths.length > 0) {
      res.send(hadiths);
    } else {
      res.send({ result: "No hadiths found." });
    }
  } catch (error) {
    res.status(500).send("Error fetching Hadiths: " + error.message);
  }
};

// Route to delete a hadith
exports.hadith = async (req, res) => {
  try {
    res.send(req.params.id);
    const result = await Hadith.deleteOne({ _id: req.params.id });
    res.send(result);
  } catch (error) {
    res.status(500).send("Error deleting Hadith: " + error.message);
  }
};

// Route to retrieve a single hadith by ID (for prefilling a form)
exports.getHadith = async (req, res) => {
  try {
    const result = await Hadith.findOne({ _id: req.params.id });
    if (result) {
      res.send(result);
    } else {
      res.send({ result: "No record found." });
    }
  } catch (error) {
    res.status(500).send("Error retrieving Hadith: " + error.message);
  }
};

//route to update api
exports.updateHadith = async (req, res) => {
  try {
    const result = await Hadith.updateOne(
      { _id: req.params.id },
      { $set: req.body }
    );
    res.send(result);
  } catch (error) {
    res.status(500).send("Error updating Hadith: " + error.message);
  }
};

// Search API
exports.search = async (req, res) => {
  try {
    const result = await Hadith.find({
      $or: [
        { title: { $regex: req.params.key } },
        { hadith: { $regex: req.params.key } },
        { translation: { $regex: req.params.key } },
        { narrators: { $regex: req.params.key } },
        { source: { $regex: req.params.key } },
        { category: { $regex: req.params.key } },
      ],
    });
    res.send(result);
  } catch (error) {
    res.status(500).send("Error searching Hadith: " + error.message);
  }
};

//model and schema for users
const express= require('express');
require('./db/config');
const cors=require('cors');
const User=require("./db/User");
const Hadith=require("./db/Hadith");
const Information=require("./db/Information");
const app=express();
//use middleware controll the data send from react or postman
app.use(express.json());
app.use(cors());
// Create route (API endpoint) for user signup
app.post("/signup", async (req, resp) => {
    try {
        const user = new User(req.body);
        const result = await user.save();
        // To hide the password from the response, we use the toObject function
        const sanitizedResult = result.toObject();
        delete sanitizedResult.password;
        resp.send(sanitizedResult);
    } catch (error) {
        resp.status(500).send("Error creating user: " + error.message);
    }
});

// Route for user login
app.post("/login", async (req, resp) => {
    try {
        if (req.body.email && req.body.password) {
            // To remove the password, we use the select function and exclude it from the response
            const user = await User.findOne(req.body).select("-password");
            if (user) {
                resp.send(user);
            } else {
                resp.send({ result: "No user found." });
            }
        } else {
            resp.send({ result: "No user found." });
        }
    } catch (error) {
        resp.status(500).send("Error logging in: " + error.message);
    }
});


// Route for adding a new hadith
app.post("/add-hadith", async (req, resp) => {
    try {
        const hadith = new Hadith(req.body);
        const result = await hadith.save();
        resp.send(result);
    } catch (error) {
        resp.status(500).send("Error adding new Hadith: " + error.message);
    }
});

// Fetch all hadiths
app.get("/fetch-hadith", async (req, resp) => {
    try {
        const hadiths = await Hadith.find();
        if (hadiths.length > 0) {
            resp.send(hadiths);
        } else {
            resp.send({ result: "No hadiths found." });
        }
    } catch (error) {
        resp.status(500).send("Error fetching Hadiths: " + error.message);
    }
});

// Route to delete a hadith
app.delete("/hadith/:id", async (req, resp) => {
    try {
        resp.send(req.params.id);
        const result = await Hadith.deleteOne({ _id: req.params.id });
        resp.send(result);
    } catch (error) {
        resp.status(500).send("Error deleting Hadith: " + error.message);
    }
});

// Route to retrieve a single hadith by ID (for prefilling a form)
app.get("/hadith/:id", async (req, resp) => {
    try {
        const result = await Hadith.findOne({ _id: req.params.id });
        if (result) {
            resp.send(result);
        } else {
            resp.send({ result: "No record found." });
        }
    } catch (error) {
        resp.status(500).send("Error retrieving Hadith: " + error.message);
    }
});

//route to update api
app.put("/updateHadith/:id", async (req, resp) => {
    try {
        const result = await Hadith.updateOne(
            { _id: req.params.id },
            { $set: req.body }
        );
        resp.send(result);
    } catch (error) {
        resp.status(500).send("Error updating Hadith: " + error.message);
    }
});


// Search API
app.get("/search/:key", async (req, resp) => {
    try {
        const result = await Hadith.find({
            "$or": [
                { title: { $regex: req.params.key } },
                { hadith: { $regex: req.params.key } },
                { translation: { $regex: req.params.key } },
                { narrators: { $regex: req.params.key } },
                { source: { $regex: req.params.key } },
                { category: { $regex: req.params.key } }
            ]
        });
        resp.send(result);
    } catch (error) {
        resp.status(500).send("Error searching Hadith: " + error.message);
    }
});
app.listen(5000);



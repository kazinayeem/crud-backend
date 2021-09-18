const express = require("express");
const cors = require("cors");
const morgan = require("morgan");
const mongoose = require("mongoose");
const bodyParser = require("body-parser");

// init app
const app = express();
app.use(bodyParser.json());
app.use(morgan("dev"));
app.use(cors());

// mongoose

mongoose
    .connect("mongodb://localhost:27017/crud")
    .then(() => {
        console.log("connect");
    })
    .catch((err) => {
        console.log(err);
    });

const Schema = mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    email: {
        type: String,
        required: true,
    },
}, {
    timestamps: true,
});

//model
const Model = mongoose.model("user", Schema);

//router
app.get("/", async(req, res) => {
    try {
        const result = await Model.find({});
        if (!result) {
            return res.json({ erro: "not found" });
        }
        res.status(200).json({
            message: result,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// post

app.post("/", async(req, res) => {
    const { name, email } = req.body;
    try {
        const user = new Model({
            name: name,
            email: email,
        });
        const result = await user.save();
        res.status(200).json({
            user,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// get

app.get("/:id", async(req, res) => {
    const id = req.params.id;
    try {
        const result = await Model.findById({ _id: id });
        if (!result) {
            return res.json({ erro: "not found" });
        }
        res.status(200).json({
            message: result,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// delete
app.delete("/:id", async(req, res) => {
    const id = req.params.id;
    try {
        const result = await Model.findByIdAndDelete({ _id: id });
        if (!result) {
            return res.json({ error: "user not found" });
        }
        res.status(200).json({
            message: "delete successfull",
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

// put user
app.put("/:id", async(req, res) => {
    const id = req.params.id;
    try {
        const result = await Model.findByIdAndUpdate({ _id: id }, {
            $set: req.body,
        }, {
            new: true,
            useFindAndModify: false,
        });

        res.status(200).json({
            messgae: result,
        });
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});
// server
app.listen(2020, () => console.log(`server is running `));
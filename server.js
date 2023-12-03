const express = require("express");
const app = express();
const Joi = require("joi");
const multer = require("multer");
const mongoose = require("mongoose");
app.use(express.static("public"));
app.use(express.json());
const cors = require("cors");
app.use(cors());

const upload = multer({ dest: __dirname + "/public/images"});

mongoose
    .connect("mongodb+srv://fschein21:forMongoOnly@cluster0.n7nc3vs.mongodb.net/?retryWrites=true&w=majority")
    .then(() => console.log("Connected to mongodb"))
    .catch((err) => console.log("Couldn't connect to mongodb", err));

app.get("/", (req, res) => {
    res.sendFile(__dirname + "/index.html");
});

const codeSchema = new mongoose.Schema({
    language: String,
    description: String,
    link: String,
    img: String
});

const Code = mongoose.model("Code", codeSchema);

app.get("/api/codes", (req, res) => {
    getCodes(res);
});

const getCodes = async (res) => {
    const codes = await Code.find();
    res.send(codes);
};

app.post("/api/codes", upload.single("img"), (req, res) => {
    const result = validateCode(req.body);

    if (result.error) {
        res.status(400).send(result.error.deatils[0].message);
        return;
    }

    const code = new Code({
        language: req.body.language,
        description: req.body.description,
        link: req.body.link
    });

    if (req.file) {
        code.img = "images/" + req.file.filename;
    }

    createCode(code, res);
});

const createCode = async (code, res) => {
    const result = await code.save();
    res.send(code);
};

app.put("/api/codes/:id", upload.single("img"), (req, res) => {
    const result = validateCode(req.body);

    if(result.error) {
        res.status(400).send(result.error.details[0].message);
        return;
    }

    updateCode(req, res);
});

const updateCode = async (req, res) => {
    let fieldsToUpdate = {
        language: req.body.language,
        description: req.body.description,
        link: req.body.link
    };

    if (req.file) {
        code.img = "images/" + req.file.filename;
    }

    const result = await Code.updateOne({_id: req.params.id}, fieldsToUpdate);
    const soda = await Code.findById(req.params.id);
    res.send(code);
};

app.delete("/api/codes/:id", upload.single("img"), (req, res) => {
    removeCode(res, req.params.id);
});

const removeCode = async (res, id) => {
    const code = await Code.findByIdAndDelete(id);
    res.send(code);
}

const validateCode = (code) => {
    const schema = Joi.object({
        _id: Joi.allow(""),
        language: Joi.string().min(2).required(),
        description: Joi.string().min(1).required(),
        link: Joi.string().min(1).required()
    });

    return schema.validate(code);
};


app.listen(3000, () => {
    console.log("listening");
});
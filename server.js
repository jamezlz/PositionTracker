const express = require("express");
const app = express();
const axios = require('axios').default;
const bodyParser = require('body-parser');

app.set('view engine', 'ejs');
app.use(bodyParser.json());

const PORT = 5000;
const dataUrl = "http://localhost:3000/positions";

app.get("/", async (req,res)=>{
    try {
        const positions = await axios.get(dataUrl);
        res.render("pages/index",{positions: positions.data});
    } catch (error) {
        console.error(error);
    }
});

app.get("/add",(req,res)=>{
    res.render("pages/addPosition");
});

app.post("/add", async (req,res)=>{
    try {
        await axios.post(dataUrl,req.body);
        res.status(200).send({msg: "success"});
    } catch (error) {
        console.error(error);
    }
});

//delete? or edit?

app.listen(PORT, (err)=>{
    if(err)
        console.log(err);
    else   
        console.log("App running on port: " + PORT);
})
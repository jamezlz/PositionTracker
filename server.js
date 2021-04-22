var express = require("express");
var app = express();

const PORT = 6000;

app.listen(PORT, (err)=>{
    if(err)
        console.log(err);
    else   
        console.log("App running on port: " + PORT);
})
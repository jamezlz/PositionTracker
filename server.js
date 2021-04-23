const express = require("express");
const app = express();
const axios = require('axios').default;
const bodyParser = require('body-parser');
const config = require("./config/config");

app.set('view engine', 'ejs');
app.use(bodyParser.json());

const PORT = 5000;
const symbols = ["ETH", "BTC"];
const dataUrl = "http://localhost:3000/positions";
const priceUrl = "https://pro-api.coinmarketcap.com/v1/cryptocurrency/quotes/latest?symbol=";

app.get("/", async (req,res)=>{
    try {
        let positions = await axios.get(dataUrl+"");
        let cryptos = new Set();
        for (let p of positions.data) {
            cryptos.add(p.symbol);
        }
        let symbolString ="";
        for(let c of cryptos) {
            if (symbolString) {
                symbolString += "," + c
            } else {
                symbolString += c
            }
        }
        let prices = await axios.get(priceUrl+symbolString,{headers: {"X-CMC_PRO_API_KEY":config.apiKey}});
        for (let p of positions.data) {
            p.purchaseValue = p.purchasePrice * p.quantity;
            p.currentPrice = prices.data.data[p.symbol].quote.USD.price.toFixed(2);
            p.currentValue = (p.currentPrice * p.quantity).toFixed(2);
            p.profit = (p.currentValue - p.purchaseValue).toFixed(2);
            p.totalChange = ((p.currentPrice/p.purchasePrice - 1) * 100).toFixed(2);
            p.dailyChange = prices.data.data[p.symbol].quote.USD.percent_change_24h.toFixed(2);
        }
        res.render("pages/index",{positions: positions.data});
    } catch (error) {
        console.error(error);
    }
});

app.get("/add",(req,res)=>{
    res.render("pages/addPosition", {symbols: symbols});
});

app.post("/add", async (req,res)=>{
    try {
        console.log(req.body);
        await axios.post(dataUrl,req.body);
        res.status(200).send({msg: "success"});
    } catch (error) {
        console.error(error);
        res.status(504).send({msg: "error"})
    }
});

//delete? or edit?

app.listen(PORT, (err)=>{
    if(err)
        console.log(err);
    else   
        console.log("App running on port: " + PORT);
})
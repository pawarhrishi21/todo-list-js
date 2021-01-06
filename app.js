const bodyParser = require("body-parser");
const express = require("express");

const app = express();

var itemList = [];

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));

app.post("/",function(req,res){
    var item = req.body.itemAdded;
    console.log(item);
    itemList.push(item);
    res.redirect("/");
})


app.get("/",function(req,res){
    var date = new Date();

    var today = date.toLocaleDateString("en-US", {
        "weekday": "long",
        "day": "numeric",
        "year": "numeric",
        "month": "long"
    });

    res.render("display", { dateDisplay : today, itemListDisplay : itemList  });

})

app.listen(3000,function(){
    console.log("Server started at port 3000");
})
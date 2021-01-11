const bodyParser = require("body-parser");
const express = require("express");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});

const itemsSchema = {
    name: String,
}

const Item = mongoose.model("Item", itemsSchema);


const defaultItem1 = new Item({
    name: "Welcome! Click + to add a task.",
})

const defaultItem2 = new Item({
    name: "Select the checkbox to remove a task.",
})

const defaultItems = [defaultItem1, defaultItem2];



app.get("/",function(req,res){
    var date = new Date();
    var today = date.toLocaleDateString("en-US", {
        "weekday": "long",
        "day": "numeric",
        "year": "numeric",
        "month": "long"
    });

    Item.find(function(err,result){
        if(err){
            console.log(err);
        }else{
            if(result.length===0){
                res.render("display", {dateDisplay : "Today", itemListDisplay : defaultItems});
            }
            else{
                res.render("display", {dateDisplay : "Today", itemListDisplay : result});
            }
        }
    });
    
})

app.post("/",function(req,res){
    //Inserting the newItem into the Database
    let newItem = new Item({
        name: req.body.itemAdded,
    })
    
    newItem.save()
    res.redirect("/");
})

app.post("/delete",function(req,res){
    //Delete the items from Database which get checked
    console.log(req.body);
    Item.findByIdAndDelete(req.body.check, function(err){
        if(err){
            console.log(error);
        }else{
            console.log("Succesfully deleted from DB");
            res.redirect("/");
        }
    })


})

app.listen(3000,function(){
    console.log("Server started at port 3000");
})
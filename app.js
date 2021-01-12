const bodyParser = require("body-parser");
const express = require("express");
const _ = require("lodash");
const mongoose = require("mongoose");

const app = express();

app.set("view engine", "ejs");
app.use(express.static("public"));
app.use(bodyParser.urlencoded({extended: true}));


mongoose.connect("mongodb://localhost:27017/todolistDB", {useNewUrlParser: true, useUnifiedTopology: true});
mongoose.set('useFindAndModify', false); // o/w Depreciation warning for using findOneAndUpdate() 

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

const customListSchema = mongoose.Schema({
    customName: String,
    customList: [itemsSchema],
});

const CustomList = mongoose.model("customList", customListSchema);

app.get("/",function(req,res){

    Item.find(function(err,result){
        if(err){
            console.log(err);
        }else{
            if(result.length===0){
                res.render("display", {displayName : "Today", itemListDisplay : defaultItems});
            }
            else{
                res.render("display", {displayName : "Today", itemListDisplay : result});
            }
        }
    });
})

app.get("/:customListName",function(req,res){
    const customListName = _.capitalize(req.params.customListName);
    CustomList.findOne({customName: customListName}, function(err,foundList){
        if(!err){
            if(foundList === null){
                const customList = new CustomList({
                    customName: customListName,
                    customList: defaultItems,
                });
                customList.save();
                res.redirect("/" + customListName);
            }else{
                res.render("display",{displayName: customListName, itemListDisplay: foundList.customList});
            }
        }
    })
})

app.post("/",function(req,res){
    let newItem = new Item({
        name: req.body.itemAdded,
    })
    if(req.body.list == "Today"){
        //Inserting the newItem into the Database        
        newItem.save()
        res.redirect("/");
    }else{
        CustomList.findOne({customName:req.body.list}, function(err,foundList){
            if(!err){
                foundList.customList.push(newItem);
                foundList.save();
                res.redirect("/" + req.body.list);
            }
        })
    }
})

app.post("/delete",function(req,res){
    //Delete the items from Database which get checked
    if(req.body.list == "Today"){
        Item.findByIdAndDelete(req.body.check, function(err){
            if(err){
                console.log(error);
            }else{
                console.log("Succesfully deleted from DB");
                res.redirect("/");
            }
        })
    }else{
        CustomList.findOneAndUpdate({customName: req.body.list}, {$pull:{customList: {_id: req.body.check}}}, function(err,foundList){
            if(!err){
                res.redirect("/" + req.body.list);
            }
        } )
    }

})

app.listen(3000,function(){
    console.log("Server started at port 3000");
})
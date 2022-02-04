const express = require("express");
const bodyparser = require("body-parser");
const _=require("lodash");
const mongoose=require("mongoose");

const app = express();
app.use(bodyparser.urlencoded({
  extended: true
}));

//const items = ["eat", "sleep", "code"];
const workitems = [];

app.set('view engine', 'ejs');
app.use(express.static("public"));

//mongoose.connect("mongodb+srv://shailendra:Utr@1010@cluster0.wsew7.mongodb.net/test?retryWrites=true&w=majority");

mongoose.connect("mongodb+srv://skc3766:1234@cluster0.wsew7.mongodb.net/test?retryWrites=true&w=majority")

const itemsSchema ={
  name: String
};

const listSchema= {
  name: String,
  items:[itemsSchema]
};

const List=mongoose.model("List",listSchema);

const item=mongoose.model("item",itemsSchema);

const add1=new item({
  name:"run"
});

const add2=new item({
  name:"sleep"
});

const add3=new item({
  name:"work"
});

const defaultitem=[add1,add2,add3];

app.get("/", function(req, res) {
item.find({},function(err,foundItems){

if(foundItems.length===0){
  item.insertMany(defaultitem,function(err){
    if(err){
      console.log("error");
    }else{
      console.log("success");
    }
  });
    res.redirect("/");
}else{
    res.render("list", {
    listtitle: "Today",
    newlistitem: foundItems
  });
}
});
});

app.get("/:customListName",function(req,res){
  const customListName = _.capitalize(req.params.customListName);
  List.findOne({name: customListName},function(err,foundList){
    if(!err){
      if(!foundList){
      const list=new List({
        name: customListName,
        items: defaultitem
      });
      list.save();
      res.redirect("/"+customListName);
    }else{
      res.render("list",{
        listtitle: foundList.name,
         newlistitem: foundList.items
       });
    }
  }
});
});
app.post("/", function(req, res) {

  const itemname = req.body.event;
  const listname = req.body.list;
  const Item = new item({
    name:itemname
  });

if(listname==="Today"){
  Item.save();
  res.redirect("/");
}else{
  List.findOne({name:listname},function(err,foundList){
        foundList.items.push(Item);
        foundList.save();
        res.redirect("/"+ listname);
  });
}


});

app.post("/delete",function(req,res){
  const itemIDremove=req.body.checkbox;
  const listname=req.body.listname;

  if(listname==="Today"){
  item.findByIdAndRemove(itemIDremove,function(err){
    if(err){
      console.log(err);
    }else{
      res.redirect("/");
    }
  });
}else{
    List.findOneAndUpdate({name: listname}, {$pull:{items: {_id:itemIDremove}}},function(err,foundList){
      if(!err){
        res.redirect("/"+listname);
      }
    })
}
});

app.get("/work", function(req, res) {
  res.render("list", {
    listtitle:"work",
    newlistitem: workitems
  });
});
app.get("/about",function(req,res){
    res.render("about");
});

app.listen(5000, function() {
  console.log("port 5000 in running smoothly.");
});

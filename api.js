const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const dotenv=require("dotenv");

const app=express();
dotenv.config();

const port=process.env.PORT||3000;

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.bdbw5.mongodb.net/registartionDB`,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

const registrationSchema=new mongoose.schema({
    firstname:String,
    lastname:String,
    email:String,
    password:String,
})

const Registration =mongoose.model("Registration",registrationSchema);
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());

app.get("/",(req,res)=>{
    res.sendFile(__dirname+"./Home.js");
})

app.post("/register",async(req,res)=>{
    try{
     const {firstname,lastname,email,password}=req.body;
     const existinguser=await Registration.findOne({email:email});
     if(!existinguser){
        const registrationdata=new Registration({
            firstname,
            lastname,
            email,
            password
         });
         await registrationdata.save();
         res.redirect("/");
     }
     else{
        alert("User already exists");
     }
    }
    catch(error){
        console.log(error);
   res.redirect("error")
    }
})
const express=require("express");
const mongoose=require("mongoose");
const bodyParser=require("body-parser");
const dotenv=require("dotenv");
const cors = require('cors');

const app=express();
dotenv.config();
app.use(cors());

const port=process.env.PORT||3000;

const username=process.env.MONGODB_USERNAME;
const password=process.env.MONGODB_PASSWORD;
mongoose.connect(`mongodb+srv://${username}:${password}@cluster0.7zrhbse.mongodb.net/registrationDB`,{
    useNewUrlParser:true,
    useUnifiedTopology:true,
});

const registrationSchema=new mongoose.Schema({
    firstname:String,
    lastname:String,
    email:String,
    password:String
})

const Registration =mongoose.model("Registration",registrationSchema);
app.use(bodyParser.urlencoded({extended:true}))
app.use(bodyParser.json());


app.get("/registrations", async (req, res) => {
    try {
        // Fetch all registrations from the database
        const registrations = await Registration.find();
        // Send the registrations as a response
        res.json(registrations);
    } catch (error) {
        // Handle errors
        console.error(error);
        res.status(500).json({ error: "Internal Server Error" });
    }
});
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
     }
     else{
        console.log("User already exists");
     }
    }
    catch(error){
        console.log(error);
//    res.redirect("error")
    }
})

app.listen(port,()=>{
    console.log(`server is running on ${port}`);
})
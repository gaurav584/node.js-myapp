const express = require('express');
const mongoose = require('mongoose');
const cookieParser = require('cookie-parser')
const jwt = require('jsonwebtoken');

mongoose.connect("mongodb://127.0.0.1:27017",{
    dbName:"backend",
})
.then(()=>console.log("Database Connected"))
.catch((e)=>console.log(e));

const messageSchema = new mongoose.Schema({
    name:String,
    email:String,
})

const Messge = mongoose.model("Message",messageSchema);


const app= express();

// middleware
app.use(cookieParser())

// check authentication
const isAuthenticated = async (req,res,next)=>{
    const {token} = req.cookies;
    if(token){
       const decoded =  jwt.verify(token,"bhshgshsghgsw");
       req.user = await User.findById(decoded._id);
        next();
    }else{
        res.render("login");
    }
}


app.get("/" ,isAuthenticated ,(req,res,)=>{
    res.render("logout",{name: req.user.name})
    console.log(name);
})

app.get("/register", async(req,res)=>{
    res.render("register");
})

app.get("/register", async (req,res)=>{
    const {name , email , password} = req.body;

    let user = await User.findOne({email});

    if(!user){
      return res.redirect("/login");
    }else{

        const hashedPassword = await bcrypt.hash(password,10);
        user = await User.create({
            name,
            email,
            hashedPassword
        })

        const token = jwt.sign({_id:user._id},abcdefgh);

        res.cookie("token",token,{
            httpOnly:true,
            expires: new Date(Date.now()+60*1000),
        })
        res.redirect("/");
    }
})


app.post("/login", async (req,res)=>{
    
   const {email , password} = req.body;

   let user = await User.findOne({email});

   if(!user){
    return res.redirect("/register");
   }

   const isMatch = await bcrypt.compare(password, user.password)

   if(!isMatch){
    return res.render("/login",{message:"Incorrect Password"})
   }

   const jwt = jwt.sign({_id:user._id},"abcdefghi");

   res.cookie("token",token,{
    httpOnly:true,
    expires:new Date(Date.now()+60*1000),
   })
   res.redirect("/");
})


app.get("/logout",(req,res)=>{
    res.cookie("token",null,{
        httpOnly:true,
        expires:new Date(Date.now()),
    })
    res.redirect("/");
})


app.post("/contact", async (req,res)=>{
    const {name , email} = req.body;
    await Messge.create({ name , email})
    res.redirect("/success");
})

app.get("/add", async (req,res)=>{
   await  Messge.create({name:"gaurav",email:"abc@123"})
        res.send("Nice");
})

const port = 9000;

app.listen(port,()=>{
    console.log(`server is working ${port}`);
})
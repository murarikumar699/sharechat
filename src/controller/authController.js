const User = require("../models/users");
const ChatConnection = require("../models/chatConnection");
const {validate} = require("../utill/validate");
const {response} = require("../utill/response")
const {generateAccessToken}  = require("../middleware/authCheck")
const {encrypt,decrypt} = require("../utill/bcrypt")
async function login(req,res){
    try{
       
        let isValidate = validate(req.body,["name","email","password"]);
      
        if(isValidate.status === false){
            return res.status(401).json(response(false,isValidate.message,[],null));
        }
        
        let isEmailExists = await User.findOne({email:req.body.email});

        //check user is exist the login
        if(isEmailExists){
            let decryptPassword = decrypt(req.body.password,isEmailExists.password);
            console.log("decryptPassword",decryptPassword);
            if(decryptPassword){
                let token =  generateAccessToken(isEmailExists._id.toString());
                return res.status(200).json(response(true,isValidate.message,{token:token,user:isEmailExists},null));
            }else{
                return res.status(401).json(response(false,"Invalid email or password",[],null));
            }
            
        }

        //create new user if not exists
        let user = await createUser(req.body.name,req.body.email,req.body.password)
        let token =  generateAccessToken(user._id.toString());
        return res.status(200).json(response(true,isValidate.message,{token:token,user:user},null));

    }catch(error){
        console.log(error);
        return res.status(401).json(response(false,"Something went wrong",[],null));
    }
}

async function createUser(name,email,password){
    let encruptPassword = encrypt(password);
    let user = await User.create({
        name:name,
        email:email,
        password:encruptPassword
    })
    return user;
    
}

async function getUserList(req,res){
    try{
        console.log("req.user.id =============>",req.user)
       let users = await User.find({'_id': {$ne: req.user}}).lean();
        for(let i = 0; i < users.length; i++){
            let isChatExists = await ChatConnection.findOne({member:{$all:[req.user,users[i]._id]}});
            // console.log("isChatExists",isChatExists);
            if(isChatExists){
                users[i].socketId = isChatExists.socketId
            }else{
                users[i].socketId = ""
            }

        }
       return res.status(200).json(response(true,"success",{users:users},null));
    }catch(error){
        console.log(error)
        return res.status(401).json(response(false,"Something went wrong",[],null));
    }
}

module.exports = {
    login,
    getUserList
}
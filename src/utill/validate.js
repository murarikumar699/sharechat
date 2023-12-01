function validate(req,field){
    if(!req)
        return {status:false,message:"Missing body"};

    for(let i = 0; i < field.length; i++){
        if(req[field[i]] == "" || req[field[i]] == ""){
            return {status:false,message:"Please fill "+ field[i]};
        }
    }
    return {status:true,message:""};

}

module.exports = {
    validate
}
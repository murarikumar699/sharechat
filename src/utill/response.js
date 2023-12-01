function response(status,message,data,error){
    let res = {
        status:status,
        message:message,
        data:data,
        error:error
    }
    return res;
}

module.exports = {
    response
}
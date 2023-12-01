const bcrypt = require('bcrypt');
const saltRounds = 10;
const myPlaintextPassword = 's0/\/\P4$$w0rD';
const someOtherPlaintextPassword = 'not_bacon';


function encrypt(password){
    const salt = bcrypt.genSaltSync(saltRounds);
    const hash = bcrypt.hashSync(password, salt);
    console.log("hashhash",hash);
    return hash;
}


function decrypt(password,hash){
    return bcrypt.compareSync(password, hash);
}


module.exports = {
    encrypt,
    decrypt
}
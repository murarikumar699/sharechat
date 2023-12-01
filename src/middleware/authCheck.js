const jwt = require('jsonwebtoken');

function generateAccessToken(username) {
    return jwt.sign(username, process.env.TOKEN_SECRET);
}

function authenticateToken(req, res, next) {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (token == null) return res.sendStatus(401)

  jwt.verify(token, process.env.TOKEN_SECRET, (err,user) => {
    console.log(err)

    if (err) return res.sendStatus(403)

    req.user = user

    next()
  })
}

function getUserIdByToken(authtoken) {
    const authHeader = authtoken
    const token = authHeader && authHeader.split(' ')[1]
    console.log("token",token);
    let userId = ""
    jwt.verify(token, process.env.TOKEN_SECRET, (err,user) => {
        // console.log("user",user)
        userId = user
    //   return user
    })
    return userId
  }

module.exports = {
    generateAccessToken,
    authenticateToken,
    getUserIdByToken
}
const express = require('express')
const authRoute = express.Router()
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken')
const db = require('../database/connection')
const axios = require('axios')
var ls = require('local-storage');
const driverAuthServices = require('../services/auth/driverAuth')
const {getAccByUsername, getAllAccounts } = driverAuthServices()
let account = {
  token: '',
  role: ''
}
const verifyToken = (req, res, next) => 
{
  const token = ls.get('token')
  console.log("This is the token :>>>", token)
    if(token){
        req.sessionToken = token
        next()
    }else {
      console.log("No token")
      return res.json({message:'No token provided.'});
    }

}
authRoute.get('/alreadyauthenticated', (req, res) => 
{
  const token = ls.get('token')
  console.log("token :>>", token)
 if(token){   
   res.json({auth: true})  
}else{
  res.json({auth:false})
}

// if(req.session.token){   
//      res.json({auth: true, role: req.session.role})  
// }else{
//   res.json({auth:false})
// }

})
authRoute.get('/homeAuthentication', verifyToken, (req, res) => {
    jwt.verify(req.sessionToken, "secretkey", (err, authData)=>{
        if(err){
          console.log(err)
          return res.json({message: "token is expired, not valid!"})
        }else {
          console.log("user data :>>", authData)
          return res.json({authData})
        }
    })
})

authRoute.delete("/logout", (req, res) => 
{
  const token = ls.get('token')
  if(token){
    ls.remove('token')
    ls.remove('role')
    res.json({success:true})
  }

})
// DRIVER
authRoute.post('/login', async (req, res) => {
  try { 
    const { email, password } = req.body;
    console.log(password)
    const user = await getAccByUsername(email);
    console.log(user)
    if (user.length === 0) {
      return res.json({ message: "User does not exist" });
    } else {
      const checkPassword = await bcrypt.compare(password, user[0]?.password);
      console.log(checkPassword)
      if (!checkPassword) {
        return res.json({ message: "Password is incorrect!" });
      } else {
        jwt.sign({ user: user }, "secretkey", { expiresIn: '1d' }, (err, token) => {
          if (err) {
            console.log("Cannot create token:", err);
            return res.json({ message: "Cannot create token" });
          }
          
          const role = `Select * from users where email = '${email}'`
          ls.set('token', token)
          ls.set('role', role)
          // req.session.token = token;
          // req.session.role = role;
          // account.token = token
          // account.role = role
          return res.json({ success: "Login success!", user });
        });
      }
    }
  } catch (error) {
    console.log('Error:', error);
    return res.json({ message: "An error occurred" });
  }
});



authRoute.post('/register', async (req, res)=>
{
  try {
    const {email, username, password} = req.body
    const role = 'user'
    const hashedPassword = await bcrypt.hash(password, 10)

    if(username && password && email){
      const sqlQuery = `INSERT INTO users ( username, email, password, role) 
      VALUES('${username}','${email}', '${hashedPassword}', '${role}' )`;
  
      const result = await db(sqlQuery)
      res.json(result)
    }
    else{
      res.status(500)
    }

  } catch (error) {
    console.error(error)
  }

})


module.exports = authRoute

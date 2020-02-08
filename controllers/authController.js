const sql       = require("./mysql2ORMController");
const jwt       = require('jwt-simple');
const config    = require('./../config/keys.js');
const bcrypt    = require('bcryptjs');
const moment    = require('moment');
const logger       = require('../logs/Wlogger.js');

//This function takes the time and User ID from mysql and turns it into a timestamp for the user.
//it also requires the secret from your config file.
const tokenForUser = function(user) {
  const timestamp = new Date().getTime();
  // Sub === subject
  // iat === issued at time
  // Its going to encode the whole 1st object and then add our secret to it
  logger.log({
    level: 'info',
    message: `creating token for id ${user.id}  ||`
  });
  // console.log(user);
  return jwt.encode({ sub: user.id, iat: timestamp}, config.secret);
};


module.exports = {
  //Takes form data from req.body and adds a new user too the Database using the SQL controller
  signUp: async (req, res) => {
    const { fullName, email, password } = req.body;
    if(!email || !password) {
      //failed signup Log
      logger.log({
        level: 'info',
        message: `failed Signup Missing info|||| email| ${email} |fullname|${fullName}| password |${password}|  `
      });
      return res.status(422).json({ error: 'You must provide an email and password' });
    }
    try {
      // Check if there is an existing user
      let con = await sql.GetConnection();
      const existingUser = await sql.selectWhere(con,"users","email",email);
      // if user exist, throw error
      if(existingUser.length > 0) {
        logger.log({
          level: 'info',
          message: `failed Signup SESSION|||| BY| ${email}  email already in use|| `
        });
        return res.status(422).json({ error: 'Email is in use' });
      }
      //Generate data for New User Insert Object
      let InsertObj = {};
      InsertObj.email=email;
      InsertObj.fullName=fullName;
      InsertObj.createdOn= moment().unix();
      //Generate Salt for the password
      const salt = await bcrypt.genSalt();
      console.log('salt', salt);
      //Hash the password for storage in the database
      const hash = await bcrypt.hash(password, salt);
      console.log('hash', hash);
      InsertObj.password=hash;
      //Insert the new User into the MYsql datatabase
      let user = await sql.insertNewUser(con,"users",InsertObj);
      //very important end connection
      con.end();
      // console.log(user);
      user.id = user.insertId;
    logger.log({
        level: 'info',
        message: `SUCCESSFULL Signup SESSION|||| BY| ${JSON.stringify(user.id)} || for user ${JSON.stringify(tokenForUser({id:user.insertId}))} `
      });//Send the TokenFOr User as response
      res.json({ token: tokenForUser({id:user.insertId})});
    } catch(e) {
      logger.log({
        level: 'error',
        message: `Failed Signup ERROR |||| ${e} || `
      });
      res.status(404).json({ e });
    }
  },

  signIn: async (req, res) => {
    //check if
    const {email, password} = req.body;
    if (!email || !password) {
      //failed signIn Log due to missing email or password
      logger.log({
        level: 'info',
        message: `failed Signup Missing info|||| email| ${email}  password |${password}|  `
      });
      return res.status(422).json({error: 'You must provide an email and password'});
    }
    try {
      //start sql connection pool
      let con = await sql.GetConnection();
      const existingUser = await sql.selectWhere(con, "users", "email", email);
      con.end();
      //if there is an existing user in the array check the password
      if (existingUser.length > 0) {
        //check if the password matches the hash.
        const match = await bcrypt.compare(password, existingUser[0].password);
        if (match) {
          logger.log({
            level: 'info',
            message: `Success SignIN Attempt|||| BY| ${email}  with ${password}|| `
          });
          //send the token
          return res.send({token: tokenForUser({id: existingUser[0].id})});
        }
        logger.log({
          level: 'info',
          message: `FAILED SignIN Attempt|||| BY| ${email}  with ${password}|| `
        });


        return res.status(422).json({error: 'incorrect email or password'});
      }
    }
    catch
      (e)
      {
        logger.log({
          level: 'error',
          message: e
        });
        return res.status(404).json({error: e});
      }
    }

  };


const crypto = require('crypto');
const nodemailer = require('nodemailer');
const jwt = require('jsonwebtoken');
const dateFormat = require("dateformat");

const tokenModel = require("../models/tokenModel");
const userModel = require("../models/userModel");
const subscriptionModel = require("../models/subscriptionModel");
const transport = require("../lib/transport");
const config = require('./../config/config')
const log = require('../lib/logger');

const key = Buffer.from('5ebe2294ecd0e0f08eab7690d2a6ee69', 'hex');
const iv  = Buffer.from('26ae5cc854e36b6bdfca366848dea6bb', 'hex');

//Here "aes-256-cbc" is the advance encryption standard we are using for encryption.

function encrypt(text){
    var cipher = crypto.createCipheriv('aes-128-cbc', key, iv);
    var crypted = cipher.update(text,'utf8','hex')
    crypted += cipher.final('hex');
    return crypted;
}


function decrypt(text){
  console.log(text)
   var decipher = crypto.createDecipheriv('aes-128-cbc', key, iv)
   var dec = decipher.update(text,'hex','utf8')
   dec += decipher.final('utf8');
   return dec;
}


module.exports = {

  //login user
  login: function (req, res, next) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    userModel.findOne({ email: req.body.email }, function (err, user) {
      if (!user) {
        const LOGMESSAGE = DATETIME + "| The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.";
        log.write("ERROR", LOGMESSAGE);
        return res.status(401).send({ success: false, msg: 'The email address ' + req.body.email + ' is not associated with any account. Double-check your email address and try again.' });
      }

      user.comparePassword(req.body.password, user.password, function (err, isMatch) {

        if (!isMatch) {
          const LOGMESSAGE = DATETIME + "|Invalid email or password";
          log.write("ERROR", LOGMESSAGE);
          return res.status(401).send({ success: false, msg: 'Invalid email or password' });
        }

        // Make sure the user has been verified
        if (!user.isVerified) {
          const LOGMESSAGE = DATETIME + "|Your account has not been verified.";
          log.write("ERROR", LOGMESSAGE);
          return res.status(401).send({ success: false, type: 'not-verified', msg: 'Your account has not been verified.' });
        }

        // Login successful, write token, and send back user

        try {
          subscriptionModel.find({ company: user.companyId }).exec(function (err, subscription) {
            if (err) {
              const LOGMESSAGE = DATETIME + "|" + err.message;
              log.write("ERROR", LOGMESSAGE);
              return res.status(500).json({
                success: false,
                msg: "Error when getting subscription.",
                error: err
              });
            }
            if (!subscription) {
              const LOGMESSAGE = DATETIME + "|No such company subscription";
              log.write("ERROR", LOGMESSAGE);
              return res.status(404).json({
                success: false,
                msg: "No such subscription"
              });
            }

            const LOGMESSAGE = DATETIME + "|Your account has not been verified.";
            log.write("INFO", LOGMESSAGE);
            res.send({ success: true, subscription: subscription, token: 'Bearer ' + user.generateJwt(user), user: user.toJSON() });

          });
        } catch (error) {
          const LOGMESSAGE = DATETIME + "|" + error.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).json({
            success: false,
            msg: "Error when getting company subscription.",
            error: error
          });
        }

      });
    })  
    .populate('department', 'name')
    .populate('role', 'name, code')
    .populate('lineManager', 'username')
    .populate('companyId', 'name','company');
  },

  //signup User
  signupWithToken: function (req, res) {

    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    // Make sure this account doesn't already exist
    userModel.findOne({ email: req.body.email }, function (err, user) {
      // Make sure user doesn't already exist
      if (user) {
        const LOGMESSAGE = DATETIME + "| The email address you have entered is already associated with another account.";
        log.write("ERROR", LOGMESSAGE);
        return res.status(400).send({
          success: false,
          msg: 'The email address you have entered is already associated with another account.'
        });
      }

      // Create and save the user
      user = new userModel({
        email: req.body.email,
        password: req.body.password,
        username: req.body.username,
        designation: req.body.designation,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,
        phoneNo: req.body.phoneNo,
        companyId: req.body.companyId,
        department: req.body.department,
        role: req.body.role,
        lineManager: req.body.lineManager,
        employmentType: req.body.employmentType,
        createdBy: req.body.createdBy,
        updatedBy: req.body.updatedBy,
        joiningDate: req.body.joiningDate,
        status: req.body.status
      });
      user.setPassword(user, (error, isSet) => {
        user.save(function (err) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).send({ success: false, msg: err.message }
            );
          }

          // Create a verification token for this user
          var token = new tokenModel({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

          // Save the verification token
          token.save(function (err) {
            if (err) {
              const LOGMESSAGE = DATETIME + "|" + err.message;
              log.write("ERROR", LOGMESSAGE);
              return res.status(500).send({ success: false, msg: err.message }
              );
            }

            // Send the email
            // let emailResponse = transport.sendEmail('fazilamehtabelahi@gmail.com', 'Account Verification Token', 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n')
            // console.log(emailResponse)
            // if (emailResponse.success == false) {
            //   const LOGMESSAGE = DATETIME + "|" + emailResponse.message;
            //   log.write("ERROR", LOGMESSAGE, 'error');
            //   return res.status(500).send({ success: false, msg: emailResponse.message });
            // }else{
            //   const LOGMESSAGE = DATETIME + "| "+emailResponse.message ;
            //   log.write("INFO", LOGMESSAGE);
            //   res.status(200).send({ success: false, msg: emailResponse.message });
            // }

            let transporter = nodemailer.createTransport({

              // host: config.email.host,
              service: config.email.service,
              // port: 587,
              auth: {
                user: config.email.senderEmail,
                pass: config.email.senderPassword
              },
              secure: false,
              tls: {
                // ciphers: 'SSLv3',
                rejectUnauthorized: false

              }
            });

            let mailOptions = {
              from: config.email.senderName + ' ' + config.email.senderEmail, // sender address
              to: user.email, // list of receivers
              subject: 'Account Verification Token', // Subject line
              // text: 'Hello world?', // plain text body
              html: 'Hello,\n\n' + 'Confirmation Code: ' + token.token  // html body
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                const LOGMESSAGE = DATETIME + "|" + error.message;
                log.write("ERROR", LOGMESSAGE);
                return res.status(500).send({ success: false, msg: error.message });
              }
              const LOGMESSAGE = DATETIME + "| " + 'A verification email has been sent to ' + user.email + '.';
              log.write("INFO", LOGMESSAGE);
              res.status(200).send({ success: true, message: 'A verification email has been sent to ' + user.email + '.' });
            });
          });
        });
      });

    });
  },

   //signup User
   signup: function (req, res) {

    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    // Make sure this account doesn't already exist
    userModel.findOne({ email: req.body.email }, function (err, user) {
      // Make sure user doesn't already exist
      if (user) {
        const LOGMESSAGE = DATETIME + "| The email address you have entered is already associated with another account.";
        log.write("ERROR", LOGMESSAGE);
        return res.status(400).send({
          success: false,
          msg: 'The email address you have entered is already associated with another account.'
        });
      }

      const pwd = req.body.password;
 
      // Create and save the user
      user = new userModel({
        email: req.body.email,
        password:req.body.password,
        username: req.body.username,
        designation: req.body.designation,
        firstName: req.body.firstName,
        lastName: req.body.lastName,
        middleName: req.body.middleName,
        phoneNo: req.body.phoneNo,
        companyId: req.body.companyId,
        department: req.body.department,
        role: req.body.role,
        lineManager: req.body.lineManager,
        employmentType: req.body.employmentType,
        createdBy: req.body.createdBy,
        updatedBy: req.body.updatedBy,
        joiningDate: req.body.joiningDate,
        status: req.body.status,
        isVerified: true
      });
      user.setPassword(user, (error, isSet)=>{
        user.save(function (err) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).send({ success: false, msg: err.message }
            );
          }
          

         var t =  encrypt(req.body.email)
      
          // Create a verification token for this user
          var token = new tokenModel({ _userId: user._id, token: t});
          
          
          // Save the verification token
          // token.save(function (err) {
          //   if (err) {
          //     const LOGMESSAGE = DATETIME + "|" + err.message;
          //     log.write("ERROR", LOGMESSAGE);
          //     return res.status(500).send({ success: false, msg: err.message }
          //     );
          //   }
  
            // Send the email
            // let emailResponse = transport.sendEmail('fazilamehtabelahi@gmail.com', 'Account Verification Token', 'Hello,\n\n' + 'Please verify your account by clicking the link: \nhttp:\/\/' + req.headers.host + '\/confirmation\/' + token.token + '.\n')
            // console.log(emailResponse)
            // if (emailResponse.success == false) {
            //   const LOGMESSAGE = DATETIME + "|" + emailResponse.message;
            //   log.write("ERROR", LOGMESSAGE, 'error');
            //   return res.status(500).send({ success: false, msg: emailResponse.message });
            // }else{
            //   const LOGMESSAGE = DATETIME + "| "+emailResponse.message ;
            //   log.write("INFO", LOGMESSAGE);
            //   res.status(200).send({ success: false, msg: emailResponse.message });
            // }
  
            let transporter = nodemailer.createTransport({
  
              // host: config.email.host,
              service:config.email.service,
              // port: 587,
              auth: {
                user: config.email.senderEmail,
                pass: config.email.senderPassword
              },
              secure: false,
              tls: {
                // ciphers: 'SSLv3',
                rejectUnauthorized: false
  
              }
            });
  
            let mailOptions = {
              from: config.email.senderName + ' ' + config.email.senderEmail, // sender address
              to: user.email, // list of receivers
              subject: 'Account Created', // Subject line
              // subject: 'Account Verification', // Subject line
              // text: 'Hello world?', // plain text body
              // html: 'Hello,\n\n' + 'Please <a href="'+config.verificationUrl+ token.token +'">click here</a> to verify your account '   // html body
              html: 'Your account has been create as per following details: <br/><br/>UserID: ' + user.email +'<br/><br/>Password: '+ pwd
            };
            transporter.sendMail(mailOptions, (error, info) => {
              if (error) {
                const LOGMESSAGE = DATETIME + "|" + error.message;
                log.write("ERROR", LOGMESSAGE);
                return res.status(500).send({ success: false, msg: error.message });
              }
              // const LOGMESSAGE = DATETIME + "| " + 'A verification email has been sent to ' + user.email + '.';
              const LOGMESSAGE = DATETIME + "| " + 'Email has been sent to ' + user.email + '.';
              log.write("INFO", LOGMESSAGE);
              res.status(200).send({ success: true, message: 'Email has been sent to ' + user.email + '.' });
            });
       //   });
        });
      });
     
    });
  },


  //verify user token
  confirmation: function (req, res) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    tokenModel.findOne({ token: req.body.token }, function (err, token) {
      if (!token) {
        const LOGMESSAGE = DATETIME + "|We were unable to find a valid token. Your token my have expired.";
        log.write("ERROR", LOGMESSAGE);
        return res.status(400).send({ success: false, type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
      }

      // If we found a token, find a matching user
      userModel.findOne({ _id: token._userId, email: req.body.email }, function (err, user) {
        if (!user) {
          const LOGMESSAGE = DATETIME + "|We were unable to find a user for this token.";
          log.write("ERROR", LOGMESSAGE);
          return res.status(400).send({ success: false, msg: 'We were unable to find a user for this token.' })
        };
        if (user.isVerified) {
          const LOGMESSAGE = DATETIME + "|This user has already been verified.";
          log.write("ERROR", LOGMESSAGE);
          return res.status(400).send({ success: false, type: 'already-verified', msg: 'This user has already been verified.' });
        }

        // Verify and save the user
        user.isVerified = true;
        user.save(function (err) {
          if (err) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).send({ success: false, msg: err.message });
          }
          const LOGMESSAGE = DATETIME + "| " + 'The account has been verified. Please log in.';
          log.write("INFO", LOGMESSAGE);
          res.status(200).send({ success: true, msg: "The account has been verified. Please log in." });
        });
      });
    });
  },

     //verify user token with url
     verify: function (req, res) {
      console.log(req.params)
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      tokenModel.findOne({ token: req.params.token }, function (err, token) {
        if (!token) {
          const LOGMESSAGE = DATETIME + "|We were unable to find a valid token. Your token my have expired." ;
          log.write("ERROR", LOGMESSAGE);
          return res.status(400).send({ success: false, type: 'not-verified', msg: 'We were unable to find a valid token. Your token my have expired.' });
        }
        var decryptEmail = decrypt(token.token)
        console.log(token)
        // If we found a token, find a matching user
        userModel.findOne({ _id: token._userId, email:decryptEmail}, function (err, user) {
          if (!user) {
            const LOGMESSAGE = DATETIME + "|We were unable to find a user for this token.";
            log.write("ERROR", LOGMESSAGE);
            return res.status(400).send({success: false, msg: 'We were unable to find a user for this token.' })
          };
          if (user.isVerified) {
            const LOGMESSAGE = DATETIME + "|This user has already been verified.";
            log.write("ERROR", LOGMESSAGE);
            return res.status(400).send({ success: false,type: 'already-verified', msg: 'This user has already been verified.' });
          }
  
          // Verify and save the user
          user.isVerified = true;
          user.save(function (err) {
            if (err) {
              const LOGMESSAGE = DATETIME + "|" + err.message;
              log.write("ERROR", LOGMESSAGE);
              return res.status(500).send({success: false, msg: err.message });
            }
            const LOGMESSAGE = DATETIME + "| " + 'The account has been verified. Please log in.';
            log.write("INFO", LOGMESSAGE);
            res.status(200).send({success: true,msg:"The account has been verified. Please log in."});
          });
        });
      });
    },

  //resend confirmation token user's email
  resendToken: function (req, res, next) {
    const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
    userModel.findOne({ email: req.body.email }, function (err, user) {
      if (!user) {
        const LOGMESSAGE = DATETIME + "|We were unable to find a user with that email.";
        log.write("ERROR", LOGMESSAGE);
        return res.status(400).send({ success: false, msg: 'We were unable to find a user with that email.' });
      }
      if (user.isVerified) {
        const LOGMESSAGE = DATETIME + "|This account has already been verified. Please log in.";
        log.write("ERROR", LOGMESSAGE);
        return res.status(400).send({ success: false, msg: 'This account has already been verified. Please log in.' });
      }

      // Create a verification token, save it, and send email
      var token = new tokenModel({ _userId: user._id, token: crypto.randomBytes(16).toString('hex') });

      // Save the token
      token.save(function (err) {
        if (err) {
          const LOGMESSAGE = DATETIME + "|" + err.message;
          log.write("ERROR", LOGMESSAGE);
          return res.status(500).send({ success: false, msg: err.message });
        }

        // Send the email
        let transporter = nodemailer.createTransport({

          // host: config.email.host,
          // port: 587,
          service: config.email.service,
          auth: {
            user: config.email.senderEmail,
            pass: config.email.senderPassword
          },
          secure: false,
          tls: {
            // ciphers: 'SSLv3',
            rejectUnauthorized: false

          }
        });

        let mailOptions = {
          from: config.email.senderName + ' ' + config.email.senderEmail, // sender address
          to: user.email, // list of receivers
          subject: 'Account Verification Token', // Subject line
          // text: 'Hello world?', // plain text body
          html: 'Hello,\n\n' + 'Confirmation Code: ' + token.token  // html body
        };
        transporter.sendMail(mailOptions, (error, info) => {
          if (error) {
            const LOGMESSAGE = DATETIME + "|" + err.message;
            log.write("ERROR", LOGMESSAGE);
            return res.status(500).send({ success: false, msg: err.message });
          }
          const LOGMESSAGE = DATETIME + "| " + 'A verification email has been sent to ' + user.email + '.';
          log.write("INFO", LOGMESSAGE);
          res.status(200).send({ success: true, message: 'A verification email has been sent to ' + user.email + '.' });
        });
      });

    });
  }
}


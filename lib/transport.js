'use strict';
const validator    = require('validator');
const nodemailer   = require('nodemailer');
// const nodemailer = require('nodemailer');
const fs           = require('fs');

const config       = require('./../config/config');

function validate (data) {
    var err;
    try {
        if(data.hasOwnProperty("to") ){
            err = data.to === undefined ? false : true; 
            if (err != true) return "Undefined email to send";
            err  = validator.isEmpty(data.to);
            if (err == true) return "Please provide email address to send email";
            err = validator.isEmail(data.to);
            if (err != true) return "Please provide correct email pattern.";
        }
        if(data.hasOwnProperty("from") || data.from !== undefined){
            err = data.from === undefined ? false : true; 
            if (err != true) return "Undefined email to send";
            err  = validator.isEmpty(data.from); 
            if (err == true) return "Please provide email address to send email";
            err = validator.email(data.from);
            if (err != true) return "Please provide correct email pattern.";
        }
        if(data.hasOwnProperty("password")){
            err = data.password === undefined ? false : true; 
            if (err != true) return "Password is undefined, please provide password";
            err  = validator.isEmpty(data.password);
            if (err == true) return "Password is empty, please provide password";
        }
        if(data.hasOwnProperty("host")){
            err = data.host === undefined ? false : true; 
            if (err != true) return "Host is undefined, please provide host";
            err  = validator.isEmpty(data.host);
            if (err == true) return "Host is empty, please provide host";
        }
        if(data.hasOwnProperty("subject")){
            err = data.subject === undefined ? false : true; 
            if (err != true) return "Subject is undefined, please provide subject";
            err  = validator.isEmpty(data.subject);
            if (err == true) return "Subject is undefined, please provide subject";
        }
        if(data.hasOwnProperty("body")){
            err = data.body === undefined ? false : true; 
            if (err != true) return "Body is undefined, please provide body";
            err  = validator.isEmpty(data.body);
            if (err == true) return "Body is undefined, please provide body";
        }
    } catch (_err) {
      return new Error('Error validating address.');
    }
    return null;
  }
module.exports = {
    sendEmail: function(to, subject, body, logPath){
        var data = {
            to : to,
            subject : subject,
            body : body,
        };
        var err = validate(data);
        console.log('---err')
        console.log(err)
        if (err != null) {
            return {success: false, message:err};
        }
        try {
            let transporter = nodemailer.createTransport({
 
                host: config.email.host,
                port: 587,
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
            
            // setup email data with unicode symbols
            let mailOptions = {
                from: config.email.senderName + ' ' +config.email.senderEmail, // sender address
                to: to, // list of receivers
                subject: subject, // Subject line
                text: 'Hello world?', // plain text body
                html: '<b>'+ body +'</b>' // html body
            };
            console.log('--email')
            console.log(mailOptions)
            // send mail with defined transport object
            transporter.sendMail(mailOptions, (error, info) => {
                console.log(error,'--error emial');
                console.log(info,'---info email')
                if (error) {
                    // var writeStream = fs.createWriteStream(logPath + "alert-log.txt");
                    // writeStream.write(error.message + "\n");
                    return {success: false, message:error};
                }
                return {success: true, message:'A verification email has been sent to ' + user.email + '.'}; 
                // Preview only available when sending through an Ethereal account
                // console.log('Preview URL: %s', nodemailer.getTestMessageUrl(info));
    
            });
        } catch (error) {
            return  {success: false, message:error};
        } 
    }
};
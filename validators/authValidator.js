const { check, validationResult } = require('express-validator');
const dateFormat = require("dateformat");

const log = require('../lib/logger');


module.exports = {
    resend : [
        check('email', 'Email is not valid').isEmail(),
        check('email', 'Email field is required').not().isEmpty(),
        function (req, res, next) {
                    // Check Errors
            const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            const errors = validationResult(req);
            if (errors.errors && errors.errors.length>0) {
              const LOGMESSAGE = DATETIME + "|"+JSON.stringify(errors.array());
              log.write("ERROR", LOGMESSAGE);
                res.send({ errors: errors.array() });
                return true;
            }
            next();
        }
      ],
      confirmation : [
        check('email', 'Email is not valid').isEmail(),
        check('email', 'Email field is required').not().isEmpty(),
        check('token', 'Token field is required').not().isEmpty(),
        function (req, res, next) {
                    // Check Errors
            const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            const errors = validationResult(req);
            if (errors.errors && errors.errors.length>0) {
              const LOGMESSAGE = DATETIME + "|"+JSON.stringify(errors.array());
              log.write("ERROR", LOGMESSAGE);
                res.send({success:false, errors: errors.array() });
                return true;
            }
            next();
        }
      ],
      login : [
       
        check('email', 'Email is not valid').isEmail(),
        check('email', 'Email field is required').not().isEmpty(),
        check('password', 'Password field is required').not().isEmpty(),
        function (req, res, next) {
                    // Check Errors
            const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            const errors = validationResult(req);
            if (errors.errors && errors.errors.length>0) {
              const LOGMESSAGE = DATETIME + "|"+JSON.stringify(errors.array());
              log.write("ERROR", LOGMESSAGE);
                res.send({success:false, errors: errors.array() });
                return true;
            }
            next();
        }
      ],
      signup:[
        check('email', 'Email is not valid').isEmail(),
        check('email', 'Email field is required').not().isEmpty(),
        check('password', 'Password field is required').not().isEmpty(),
        check('username', 'Username field is required').not().isEmpty(),
        check('designation', 'Designation field is required').not().isEmpty(),
        check('firstName', 'First Name field is required').not().isEmpty(),
        check('lastName', 'lastName field is required').not().isEmpty(),
        check('phoneNo', 'Phone No field is required').not().isEmpty(),
        check('companyId', 'Company field is required').not().isEmpty(),
        check('department', 'Department field is required').not().isEmpty(),
        check('role', 'Role field is required').not().isEmpty(),
        check('lineManager', 'Line Manager Name field is required').not().isEmpty(),
        // check('joiningDate', 'Joining Date field is required').not().isEmpty(),
        check('status', 'Status field is required').not().isEmpty(),

        function (req, res, next) {
                    // Check Errors
            const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            const errors = validationResult(req);
            if (errors.errors && errors.errors.length>0) {
              const LOGMESSAGE = DATETIME + "|"+JSON.stringify(errors.array());
              log.write("ERROR", LOGMESSAGE);
                res.send({success:false, errors: errors.array() });
                return true;
            }
            next();
        }
      ]

}

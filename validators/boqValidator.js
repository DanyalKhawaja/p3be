const { check, validationResult } = require('express-validator');
const dateFormat = require("dateformat");

const log = require('../lib/logger');

module.exports = {

  create: [
    function (req, res, next) {
      // Check Errors
      const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
      const errors = validationResult(req);
      if (errors.errors && errors.errors.length > 0) {
        const LOGMESSAGE = DATETIME + "|" + JSON.stringify(errors.array());
        log.write("ERROR", LOGMESSAGE);
        res.send({success:false, errors: errors.array() });
        return true;
      }
      next();
    }
  ],



}

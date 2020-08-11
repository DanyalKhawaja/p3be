const { check, validationResult } = require('express-validator');
const { buildCheckFunction } = require('express-validator');
const dateFormat = require("dateformat");

const log = require('../lib/logger');

const checkBodyAndQuery = buildCheckFunction(['body', 'query']);

module.exports = {

    create: [
        check('portfolio', 'Portfolio field is required').not().isEmpty(),
        check('name', 'Name field is required').not().isEmpty(),
        check('startDate', 'Start Date field is required').not().isEmpty(),
        check('endDate', 'End Date field is required').not().isEmpty(),
        check('status', 'Status field is required').not().isEmpty(),
        check('manager', 'Manager field is required').not().isEmpty(),
        check('createdBy', 'Created By field is required').not().isEmpty(),

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
    portfolioId: [
        check('id', 'Profile Id field is required').not().isEmpty(),
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
    programId: [
        check('id', 'Program Id field is required').not().isEmpty(),
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
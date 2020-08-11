const { check, validationResult } = require('express-validator');
const { buildCheckFunction } = require('express-validator');
const dateFormat = require("dateformat");

const log = require('../lib/logger');

const checkBodyAndQuery = buildCheckFunction(['body', 'query']);

module.exports = {

    create: [
        check('project', 'Project field is required').not().isEmpty(),
        check('seller', 'Seller field is required').not().isEmpty(),
        check('sow', 'SOW field is required').not().isEmpty(),
        check('price', 'price field is required').not().isEmpty(),
        check('deliverable', 'Deliverable field is required').not().isEmpty(),
        check('completion', 'Completion field is required').not().isEmpty(),
        check('targetDate', 'Target Date field is required').not().isEmpty(),
        check('status', 'Status field is required').not().isEmpty(),

        function (req, res, next) {
            // Check Errors
            const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            const errors = validationResult(req);
            if (errors.errors && errors.errors.length > 0) {
                const LOGMESSAGE = DATETIME + "|" + JSON.stringify(errors.array());
                log.write("ERROR", LOGMESSAGE);
                res.send({ success: false, errors: errors.array() });
                return true;
            }
            next();
        }
    ],

    projectId: [
        check('id', 'project Id field is required').not().isEmpty(),
        function (req, res, next) {
            // Check Errors
            const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            const errors = validationResult(req);
            if (errors.errors && errors.errors.length > 0) {
                const LOGMESSAGE = DATETIME + "|" + JSON.stringify(errors.array());
                log.write("ERROR", LOGMESSAGE);
                res.send({ success: false, errors: errors.array() });
                return true;
            }
            next();
        }
    ],
    update: [
        check('updatedBy', 'Updated By is reuired').not().isEmpty(),
        function (req, res, next) {
            // Check Errors
            const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            const errors = validationResult(req);
            if (errors.errors && errors.errors.length > 0) {
                const LOGMESSAGE = DATETIME + "|" + JSON.stringify(errors.array());
                log.write("ERROR", LOGMESSAGE);
                res.send({ success: false, errors: errors.array() });
                return true;
            }
            next();
        }
    ]

}
const { check, validationResult } = require('express-validator');
const { buildCheckFunction } = require('express-validator');
const dateFormat = require("dateformat");

const log = require('../lib/logger');

const checkBodyAndQuery = buildCheckFunction(['body', 'query']);

module.exports = {

    create: [
        check('description', 'Description field is required').not().isEmpty(),
        check('name', 'Name field is required').not().isEmpty(),
        check('program', 'Program Date field is required').not().isEmpty(),
        check('projectType', 'Project Type field is required').not().isEmpty(),
        //check('projectLocation', 'Project Location field is required').not().isEmpty(),
        check('totalEstimatedBudget', 'Total Estimated Budget field is required').not().isEmpty(),
        check('expectedStartDate', 'Expected Start Date field is required').not().isEmpty(),
        check('expectedEndDate', 'Expected End Date field is required').not().isEmpty(),
        check('notes', 'Notes field is required').not().isEmpty(),
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
        check('profileId', 'Profile Id field is required').not().isEmpty(),
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
    projectId: [
        check('id', 'project Id field is required').not().isEmpty(),
        function (req, res, next) {
            // Check Errors
            const DATETIME = dateFormat(new Date(), "yyyy-mm-dd HH:MM:ss");
            const errors = validationResult(req);
            if (errors.errors && errors.errors.length > 0) {
                const LOGMESSAGE = DATETIME + "|" + JSON.stringify(errors.array());
                log.write("ERROR", LOGMESSAGE);
                res.send({ success:false,errors: errors.array() });
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
            res.send({success:false, errors: errors.array() });
            return true;
          }
          next();
        }
      ]

}
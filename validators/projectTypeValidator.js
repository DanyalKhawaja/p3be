const { check, validationResult } = require('express-validator');

module.exports = {
    
      
      projectTypeId : [
        check('id', 'project Type Id field is required').not().isEmpty(),
        function (req, res, next) {
                    // Check Errors
            const errors = validationResult(req);
            if (errors.errors && errors.errors.length>0) {
                res.send({success:false, errors: errors.array() });
                return true;
            }
            next();
        }
      ],


}
const express = require("express");

const router = express.Router();

const authController = require("../controllers/authController");
const authValidator = require('../validators/authValidator');

/*
 * GET confirmation user by email
 */
// router.get('/confirmation/:token', authController.confirmation);

/*
 * POST confirmation user by email
 */
router.post('/confirmation', authValidator.confirmation, authController.confirmation);

/*
 * POST resend token to verify user email
 */
router.post('/resend',authValidator.resend, authController.resendToken);

/*
 * POST resend token to verify user email
 */
router.post('/login',authValidator.login, authController.login);

/*
 * POST create user
 */
router.post("/signup", authValidator.signup, authController.signup);




module.exports = router;

// Needed Resources
const express = require("express")
const router = new express.Router()
const utilities = require("../utilities/index")
const accountController = require("../controllers/accountController")
const regValidate = require('../utilities/account-validation')

//route build for login
router.get("/login", utilities.handleErrors(accountController.buildLogin));
//route for registration
router.get("/register", utilities.handleErrors(accountController.buildRegister));

// Route to handle account management
router.get("/", utilities.checkLogin, utilities.handleErrors(accountController.buildAccountManagement));

//process the register attempt
router.post(
    "/register",
    regValidate.registationRules(),
    regValidate.checkRegData,
    utilities.handleErrors(accountController.registerAccount)
  )

// Process the login attempt
router.post(
  "/login",
  regValidate.loginRules(),
  regValidate.checkLogData,
  utilities.handleErrors(accountController.accountLogin)
)

//process the account management
router.post(
  "/accountManagement",
  utilities.handleErrors(accountController.accountLogin)
);

module.exports = router

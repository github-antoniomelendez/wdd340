// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")
const regValidate = require("../utilities/account-validation");

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build vehicle inventory
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildVehicleInventory));

//Route to build management
router.get("/", utilities.handleErrors(invController.buildByManagementId));

//Route to Add Classification
router.get("/add-classification", utilities.handleErrors(invController.buildClassification));

// Process the Add Classification
router.post(
    "/add-classification",
    regValidate.classificationRules(),
    regValidate.checkClassData,
    utilities.handleErrors(invController.addClassification)
  )

//Route to Add inventory
router.get("/add-inventory", utilities.handleErrors(invController.buildInventory));

// Process the Add Inventory
router.post(
    "/add-inventory",
    //regValidate.classificationRules(),
    //regValidate.checkClassData,
    utilities.handleErrors(invController.addinventory)
  )

//Route for 500 error
router.get("/trigger-error", utilities.handleErrors(invController.getError));

module.exports = router;
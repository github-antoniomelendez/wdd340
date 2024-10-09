// Needed Resources
const express = require("express")
const router = new express.Router()
const invController = require("../controllers/invController")
const utilities = require("../utilities/index")

//Route to build inventory by classification view
router.get("/type/:classificationId", utilities.handleErrors(invController.buildByClassificationId));

//Route to build vehicle inventory
router.get("/detail/:inventoryId", utilities.handleErrors(invController.buildVehicleInventory));

//Route for 500 error
router.get("/trigger-error", utilities.handleErrors(invController.getError));

module.exports = router;
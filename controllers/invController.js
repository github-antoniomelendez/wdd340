const invModel = require("../models/inventory-model")
const utilities = require("../utilities/")

const invCont = {}

/* ****************************
 * Build inventory by classification view
 * **************************** */
invCont.buildByClassificationId = async function (req, res, next) {
    const classification_id = req.params.classificationId
    const data = await invModel.getInventoryByClassificationId(classification_id)
    const grid = await utilities.buildClassificationGrid(data)
    let nav = await utilities.getNav()
    const className = data[0].classification_name
    res.render("./inventory/classification", {
        title: className + " vehicles",
        nav,
        grid,
    })
}

/* ****************************
 * Build vehicle inventory view
 * **************************** */
invCont.buildVehicleInventory = async function (req, res, next) {
    const inv_id = req.params.inventoryId
    const data = await invModel.getVehicleInventoryById(inv_id)
    const make = data[0].inv_make
    const model = data[0].inv_model
    const year = data[0].inv_year
    const grid = await utilities.buildVehicleInventory(data)
    let nav = await utilities.getNav()
    res.render("./inventory/vehicle", {
        title: `${year} ${make} ${model} vehicle`,
        nav,
        errors: null,
        grid,
    })
}

invCont.getError = async function (req, res, next) {
    const error = new Error('500 Error')
    error.status = 500
    next(error)
}

module.exports = invCont
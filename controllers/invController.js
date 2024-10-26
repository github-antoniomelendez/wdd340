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

/* ****************************
 * Build management view
 * **************************** */
invCont.buildByManagementId = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classification_select = await utilities.buildManagementList()
    res.render("./inventory/management", {
        title: " Management",
        nav,
        classification_select,
        errors: null,
    })
}

/* ****************************
 * build the view for a new classification
 * **************************** */
invCont.buildClassification = async function (req, res, next) {
    let nav = await utilities.getNav()
    res.render("./inventory/add-classification", {
        title: " Add Classification",
        nav,
        errors: null,
    })
}

/* ****************************
 * Add a new classification
 * **************************** */
invCont.addClassification = async function (req, res) {
    const { classification_name} = req.body;
    const classResult = await invModel.newClassification
    (classification_name);
    const classification_select = await utilities.buildManagementList();
    let nav = await utilities.getNav();
    if (classResult) {
        req.flash("notice", `Congratulations, you added ${classification_name}!`);
        res.status(201).render("./inventory/management", {
            title: "Management",
            nav,
            classification_select,
        });
    } else {
        req.flash("notice", "Sorry, the new classification was not entered.");
        res.status(501).render("./inventory/add-classification",
        {
            title: "Enter new classification",
            nav,
            errors: null,
        });
    }
};

/* ****************************
 * build the view for a new inventory
 * **************************** */
invCont.buildInventory = async function (req, res, next) {
    let nav = await utilities.getNav()
    const classificationList = await utilities.buildManagementList()
    res.render("./inventory/add-inventory", {
        title: " Add Inventory",
        nav,
        classificationList,
        errors: null,
    })
}

/* ****************************
 * Function to insert new inventory item
 * **************************** */
invCont.addinventory = async function (req, res) {
    const { 
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    } = req.body;
    let nav = await utilities.getNav(); 
    const classResult = await invModel.newInventory(
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
    )
    if (classResult) {
        req.flash("notice", `Congratulations, you added ${inv_make} ${inv_model}!`);
        const classification_select = await utilities.buildManagementList();
        res.status(201).render("./inventory/management", {
            title: "Management",
            nav,
            classification_select,
        });
    } else {
        req.flash(`notice, Sorry, the new ${inv_make} ${inv_model} was not entered.`);
        const classification_select = await utilities.buildManagementList();
        res.status(501).render("./inventory/add-inventory",
        {
            title: "Enter new vehicle",
            nav,
            errors: null,
            inv_make,
            inv_model,
            inv_year,
            inv_description,
            inv_image,
            inv_thumbnail,
            inv_price,
            inv_miles,
            inv_color,
            classification_id,
            classification_select
        });
    }
};

/* ****************************
 * Function to get errors
 * **************************** */
invCont.getError = async function (req, res, next) {
    const error = new Error('500 Error')
    error.status = 500
    next(error)
}

/* ***************************
 *  Return Inventory by Classification As JSON
 * ************************** */
invCont.getInventoryJSON = async (req, res, next) => {
    const classification_id = parseInt(req.params.classification_id)
    const invData = await invModel.getInventoryByClassificationId(classification_id)
    if (invData[0].inv_id) {
      return res.json(invData)
    } else {
      next(new Error("No data returned"))
    }
  }

/* ***************************
 *  Build edit inventory view
 * ************************** */
invCont.editInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemDataArray = await invModel.getVehicleInventoryById(inv_id)
    const itemData = itemDataArray[0]; // Access the first element of the array instead of adding on res.render
    const classificationList = await utilities.buildManagementList(
        itemData.classification_id
      );
      console.log(classificationList)
    if (!itemData) {
      req.flash("error", "Item not found");
      return res.redirect("/inv");
    }
   
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/edit-inventory", {
      title: "Edit " + itemName,
      nav,
      classificationList: classificationList,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_description: itemData.inv_description,
      inv_image: itemData.inv_image,
      inv_thumbnail: itemData.inv_thumbnail,
      inv_price: itemData.inv_price,
      inv_miles: itemData.inv_miles,
      inv_color: itemData.inv_color,
      classification_id: itemData.classification_id,
    });
  };

/* ****************************
 * Update inventory data
 * **************************** */
invCont.updateInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    const { 
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id,
    } = req.body; 
    const updateResult = await invModel.updateInventory(
        inv_id,
        inv_make,
        inv_model,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_year,
        inv_miles,
        inv_color,
        classification_id
    )
    if (updateResult) {
        const itemName = updateResult.inv_make + " " + updateResult.inv_model
        req.flash("notice", `The ${itemName} was successfully updated.`)
        res.redirect("/inv/")
      } else {
        const classificationList = await utilities.buildManagementList(classification_id)
        const itemName = `${inv_make} ${inv_model}`
        req.flash("notice", "Sorry, the insert failed.")
        res.status(501).render("inventory/edit-inventory", {
        title: "Edit " + itemName,
        nav,
        classificationList,
        errors: null,
        inv_id,
        inv_make,
        inv_model,
        inv_year,
        inv_description,
        inv_image,
        inv_thumbnail,
        inv_price,
        inv_miles,
        inv_color,
        classification_id
        })
        console.log(`inv_id, ${inv_id}`)
      }
    }

/* ***************************
 *  Build delete inventory view
 * ************************** */
invCont.deleteInventoryView = async function (req, res, next) {
    const inv_id = parseInt(req.params.inv_id);
    let nav = await utilities.getNav();
    const itemDataArray = await invModel.getVehicleInventoryById(inv_id)
    const itemData = itemDataArray[0]; // Access the first element of the array instead of adding on res.render
    const classificationList = await utilities.buildManagementList(
        itemData.classification_id
      );
      console.log(classificationList)
    if (!itemData) {
      req.flash("error", "Item not found");
      return res.redirect("/inv");
    }
   
    const itemName = `${itemData.inv_make} ${itemData.inv_model}`;
    res.render("./inventory/delete-confirm", {
      title: "Delete " + itemName,
      nav,
      errors: null,
      inv_id: itemData.inv_id,
      inv_make: itemData.inv_make,
      inv_model: itemData.inv_model,
      inv_year: itemData.inv_year,
      inv_price: itemData.inv_price,
    });
  };

/* ****************************
 * Delete inventory data
 * **************************** */
invCont.deleteInventory = async function (req, res, next) {
    let nav = await utilities.getNav();
    const { 
        inv_id,
        inv_make,
        inv_model,
        inv_price,
        inv_year,
    } = req.body; 
    const deleteResult = await invModel.deleteInventoryItem(
        inv_id,
        inv_make,
        inv_model,
        inv_price,
        inv_year,
    )
    if (deleteResult) {
        const itemName = deleteResult.inv_make + " " + deleteResult.inv_model
        req.flash("notice", `The ${itemName} was successfully deleted.`);
        res.redirect("/inv/")
      } else {
        req.flash("notice", "Sorry, the insert failed.");
        res.status(501).render("inventory/delete/inv_id")
      }
    };

module.exports = invCont
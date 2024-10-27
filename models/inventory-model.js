const pool = require("../database/")

/* *********************************
 * Get all classification data
 * ****************************** */
async function getClassifications(){
    return await pool.query("SELECT * FROM public.classification ORDER BY classification_name")
}

/* *********************************
 * Get all inventory items and classification_name by classification_id
 * ******************************** */
async function getInventoryByClassificationId(classification_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.classification_id = $1`,
            [classification_id]
        )
        return data.rows
    } catch (error) {
        console.error("getclassificationsbyid error " + error)
    }
}

/* *********************************
 * New Classification Function 
 * ******************************** */
async function newClassification(classification_name) {
    try {
      const sql = "INSERT INTO classification (classification_name) VALUES ($1) RETURNING *";
      const result = await pool.query(sql, [classification_name]);
      return result.rowCount > 0; // True if insertion was successful
    } catch (error) {
      console.error("Database error:", error);
      throw error; // Propagate error to the controller
    }
  }

/* ***************************
 *  Classification by classification_name validation procedure
 * ************************** */
async function findClassificationByName(classification_name) {
  try {
    const sql =
      "SELECT * FROM classification WHERE LOWER(classification_name) = LOWER($1)";
    const result = await pool.query(sql, [classification_name]);
    return result.rowCount > 0; // Returns true if a matching classification is found
  } catch (error) {
    console.error("findClassificationByName error:", error);
    throw error;
  }
}

/* *********************************
 * get inventory vehicle by inventory id 
 * ******************************** */
async function getVehicleInventoryById(inv_id) {
    try {
        const data = await pool.query(
            `SELECT * FROM public.inventory AS i
            JOIN public.classification AS c
            ON i.classification_id = c.classification_id
            WHERE i.inv_id = $1`,
            [inv_id]
        )
        return data.rows
    } catch (error) {
        console.error("getinventoryid error " + error)
    }
}

/* *********************************
 * Add new inventory 
 * ******************************** */
async function newInventory(
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
) {
  try {
    const sql =
      "INSERT INTO inventory (inv_make, inv_model, inv_year, inv_description, inv_image, inv_thumbnail, inv_price, inv_miles, inv_color, classification_id) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *";
    return await pool.query(sql, [
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
    ]);
  } catch (error) {
    return error.message;
  }
}

/* ***************************
 *  Update Inventory Data
 * ************************** */
async function updateInventory(
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
) {
  try {
    const sql =
      "UPDATE public.inventory SET inv_make = $1, inv_model = $2, inv_description = $3, inv_image = $4, inv_thumbnail = $5, inv_price = $6, inv_year = $7, inv_miles = $8, inv_color = $9, classification_id = $10 WHERE inv_id = $11 RETURNING *"
    const data = await pool.query(sql, [
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
      inv_id
    ])
    return data.rows[0]
  } catch (error) {
    console.error("model error: " + error)
  }
}

/* ***************************
 *  Delete Inventory Item
 * ************************** */
async function deleteInventoryItem(inv_id) {
  try {
    const sql = 'DELETE FROM inventory WHERE inv_id = $1'
    const data = await pool.query(sql, [inv_id])
  return data
  } catch (error) {
    new Error("Delete Inventory Error")
  }
}

/* *********************************
 * get review by id 
 * ******************************** */
async function getReviewById(inv_id) {
  try {
      const data = await pool.query(
          `SELECT * FROM public.review AS i
          JOIN public.classification AS c
          ON i.classification_id = c.classification_id
          WHERE i.inv_id = $1`,
          [inv_id]
      )
      return data.rows
  } catch (error) {
      console.error("getreviewid error " + error)
  }
}

/* *********************************
* Add new review 
* ******************************** */
async function newReview(
review_id,
review_date,
review_text,
inv_id,
account_id
) {
try {
  const sql =
    "INSERT INTO review (review_id, review_date, review_text, inv_id, account_id) VALUES ($1, $2, $3, $4, $5) RETURNING *";
  return await pool.query(sql, [
review_id,
review_date,
review_text,
inv_id,
account_id
  ]);
} catch (error) {
  return error.message;
}
}

/* ***************************
*  Edit Review Data
* ************************** */
async function editReview(
review_id,
review_date,
review_text,
inv_id,
account_id
) {
try {
  const sql =
    "UPDATE public.review SET review_id = $1, review_date = $2, review_text = $3, account_id = $4 WHERE inv_id = $5 RETURNING *"
  const data = await pool.query(sql, [
  review_id,
  review_date,
  review_text,
  account_id,
  inv_id
  ])
  return data.rows[0]
} catch (error) {
  console.error("model error: " + error)
}
}

/* ***************************
*  Delete Review Item
* ************************** */
async function deleteReview(inv_id) {
try {
  const sql = 'DELETE FROM review WHERE inv_id = $1'
  const data = await pool.query(sql, [inv_id])
return data
} catch (error) {
  new Error("Delete Review Error")
}
}

module.exports = {getClassifications, updateInventory, getInventoryByClassificationId, newInventory, getVehicleInventoryById,findClassificationByName, newClassification, deleteInventoryItem, getReviewById, newReview, editReview, deleteReview};
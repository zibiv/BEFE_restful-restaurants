const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
/**
 * A list of all restaurants that exist.
 * In a "real" application, this data would be maintained in a database.
*/
const supabase = require('../provider/supabase');


/**
 * Feature 1: Getting a list of restaurants
 */
router.get("/", async (_req, res) => {
  const { data: restaurants } = await supabase.from('restaurants').select();
  res.json(restaurants);
});

/**
 * Feature 2: Getting a specific restaurant
 */
//НЕ ИСПОЛЬЗУЕТСЯ ВО ФРОНТЕ
router.get("/:id", async (req, res) => {
  const { id } = req.params;

  // Find the restaurant with the matching id.
  const { data: restaurant } = await supabase.from('restaurants').select().eq('id', id);

  // If the restaurant doesn't exist, let the client know.
  if (!restaurant) {
    res.sendStatus(404);
    return;
  }

  // Send the restaurant data to the front-end.
  res.json(restaurant);
});

/**
 * Feature 3: Adding a new restaurant
 */
router.post("/", async (req, res) => {
  const { body } = req;
  const { name } = body;

  // Generate a unique ID for the new restaurant.
  const newId = uuidv4();
  const newRestaurant = {
    id: newId,
    name,
  };
  
  // Add the new restaurant to the list of restaurants.
  const { error } = await supabase.from('restaurants').insert(newRestaurant).select();
  if (error)  throw new Error(error.message);

  res.json(newRestaurant);
});

/**
 * Feature 4: Deleting a restaurant.
 */
router.delete("/:id", async (req, res) => {
  const { id } = req.params;

  const { error } = await supabase.from('restaurants').delete().eq('id', id);

  // The user tried to delete a restaurant that doesn't exist.
  if (error) return res.sendStatus(404);

  res.sendStatus(200);
});

/**
 * Feature 5: Updating the name of a restaurant.
 */
router.put("/:id", async (req, res) => {
  const { id } = req.params;
  const { newName } = req.body;

  const { data: restaurant, error} = await supabase.from('restaurants').update({ name: newName}).eq('id', id).select()

  if (!restaurant || error) {
    res.sendStatus(404);
    return;
  }
  res.sendStatus(200);
});


exports.router = router;

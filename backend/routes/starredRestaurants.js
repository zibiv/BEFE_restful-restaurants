const express = require("express");
const { v4: uuidv4 } = require("uuid");
const router = express.Router();
const ALL_RESTAURANTS = require("./restaurants").restaurants;

/**
 * A list of starred restaurants.
 * In a "real" application, this data would be maintained in a database.
 */
let STARRED_RESTAURANTS = [
  {
    id: "a7272cd9-26fb-44b5-8d53-9781f55175a1",
    restaurantId: "869c848c-7a58-4ed6-ab88-72ee2e8e677c",
    comment: "Best pho in NYC",
  },
  {
    id: "8df59b21-2152-4f9b-9200-95c19aa88226",
    restaurantId: "e8036613-4b72-46f6-ab5e-edd2fc7c4fe4",
    comment: "Their lunch special is the best!",
  },
];
//middleware функция для проверки наличия ресторана по параметру и формированию объекта для дальнейшей работы
router.param("id", (req, res, next, restId) => {
  const starredRestaurantById = STARRED_RESTAURANTS.find(
    starredRestaurant => starredRestaurant.id === restId
  );
  const restaurantById = ALL_RESTAURANTS.find(
    restaurant => restaurant.id === starredRestaurantById.restaurantId
  );
  if(!(restaurantById && starredRestaurantById)) return res.sendStatus(404);
  req.starredRestaurant = starredRestaurantById;
  next();
})

/**
 * Feature 6: Getting the list of all starred restaurants.
 */
router.get("/", (req, res) => {
  /**
   * We need to join our starred data with the all restaurants data to get the names.
   * Normally this join would happen in the database.
   */
  const joinedStarredRestaurants = STARRED_RESTAURANTS.map(
    (starredRestaurant) => {
      const restaurant = ALL_RESTAURANTS.find(
        (restaurant) => restaurant.id === starredRestaurant.restaurantId
      );

      return {
        id: starredRestaurant.id,
        comment: starredRestaurant.comment,
        name: restaurant.name
      };
    }
  );

  res.json(joinedStarredRestaurants);
});

/**
 * Feature 7: Getting a specific starred restaurant.
 */
router.get("/:id", (req, res) => {
  res.json(req.starredRestaurant);
})



/**
 * Feature 8: Adding to your list of starred restaurants.
 */
router.post("/", (req, res) => {
  const restaurantId = req.body.id 
  if(!restaurantId) return res.sendStatus(400);
  const restaurantById = ALL_RESTAURANTS.find(
    restaurant => restaurant.id === restaurantId
  );
  const alreadyHasStar = STARRED_RESTAURANTS.find(
    starredRestaurant => starredRestaurant.restaurantId === restaurantId
  );
  if(!!alreadyHasStar) return res.sendStatus(400);
  if(!restaurantById) return res.sendStatus(404);
  const newID = uuidv4();
  const newStarredRestaurant = {
    id: newID,
    restaurantId: restaurantById.id,
    comment: ''
  }
  //добавление записи в массив отмеченных ресторанов
  STARRED_RESTAURANTS.push(newStarredRestaurant);
  //нужно сформировать объект для ответа, так как в хранилище отмеченные рестораны хранятся с немного другими свойствами
  const newStarredRestaurantResponse = {
    id: newID,
    name: restaurantById.name,
    comment: ''
  }
  res.status(200).json(newStarredRestaurantResponse);
})



/**
 * Feature 9: Deleting from your list of starred restaurants.
 */
router.delete("/:id", (req, res) => {
  const { id } = req.params;

  const newStarredRestaurants = STARRED_RESTAURANTS.filter(restaurant => restaurant.id !== id);

  if(newStarredRestaurants.length === STARRED_RESTAURANTS.length) return res.sendStatus(404);

  STARRED_RESTAURANTS = newStarredRestaurants;

  //при успешном удалении ресурса лучше направлять 204 код ответа.
  res.sendStatus(204)
})


/**
 * Feature 10: Updating your comment of a starred restaurant.
 */
router.put("/:id", (req, res) => {

  const { newComment } = req.body;

  req.starredRestaurant.comment = newComment;

  res.sendStatus(200);
})


module.exports = router;

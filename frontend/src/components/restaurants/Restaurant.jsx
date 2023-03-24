import React, { useState, useEffect, useContext } from "react";
import RestaurantsContext from "../../provider/restaurants";

const Restaurant = ({
  restaurant,
  onDeleteRestaurant,
  onStarRestaurant,
  onUpdateRestaurant,
}) => {
  const {
    state: { starredRestaurants },
  } = useContext(RestaurantsContext);
  const [isEditing, setIsEditing] = useState(false);
  const [name, setName] = useState(restaurant.name);
  //получение данных о наличии данного ресторана в списке с отметкой, выбрана переменная так как нам не надо сохранять значение между ре-рендерингами
  const isStarred = starredRestaurants.some( rest => rest.name === restaurant.name);

  useEffect(() => {
    if (!isEditing) {
      setName(restaurant.name);
    }
  }, [isEditing, restaurant, restaurant.name]);

  const onSaveNameChange = async () => {
    onUpdateRestaurant(name);
    setIsEditing(false);
  };

  return (
    <div className='restaurant-list' >
      {isEditing ? (
        <input
          type="text"
          value={name}
          onChange={(e) => {
            setName(e.target.value);
          }}
        />
      ) : (
        name
      )}
      <div className='restaurant-buttons'>
          <button
            className='edit-btn'
            onClick={() => {
              setIsEditing((previousState) => !previousState);
            }}
          >
            {isEditing ? "Cancel Edit" : "Edit"}
          </button>

          {isEditing ? (
            <button className='save-btn' onClick={onSaveNameChange}>Save Name</button>
          ) : (
            <>
              <button className='delete-btn' onClick={onDeleteRestaurant}>Delete</button>
              <button className='star-btn' onClick={onStarRestaurant} disabled={isStarred}>Star</button>
            </>
          )}
      </div>
    </div>
  );
};

export default Restaurant;

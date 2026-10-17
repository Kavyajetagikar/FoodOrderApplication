package jsp.food_order.FOOD_ORDER_APP.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import jsp.food_order.FOOD_ORDER_APP.dto.ResponseStructure;
import jsp.food_order.FOOD_ORDER_APP.entity.MenuItem;
import jsp.food_order.FOOD_ORDER_APP.entity.Restaurant;
import jsp.food_order.FOOD_ORDER_APP.exception.ResourceNotFoundException;
import jsp.food_order.FOOD_ORDER_APP.repository.MenuItemRepository;
import jsp.food_order.FOOD_ORDER_APP.repository.RestaurantRepository;

@Service
public class RestaurantService {

    @Autowired
    private RestaurantRepository restaurantRepository;

    @Autowired
    private MenuItemRepository menuRepo;

    //  ADD RESTAURANT
    public ResponseEntity<ResponseStructure<Restaurant>> addRestaurant(Restaurant restaurant) {

        ResponseStructure<Restaurant> response = new ResponseStructure<>();
        response.setStatuscode(HttpStatus.CREATED.value());
        response.setMessage("Restaurant added successfully");
        response.setData(restaurantRepository.save(restaurant));

        return new ResponseEntity<ResponseStructure<Restaurant>>(response, HttpStatus.CREATED);
    }

    //  GET ALL
    public ResponseEntity<ResponseStructure<List<Restaurant>>> getAllRestaurant() {

        List<Restaurant> list = restaurantRepository.findAll();

        if (list.size() == 0) {
            throw new ResourceNotFoundException("No restaurants found");
        }

        ResponseStructure<List<Restaurant>> response = new ResponseStructure<>();
        response.setStatuscode(HttpStatus.OK.value());
        response.setMessage("All restaurants fetched");
        response.setData(list);

        return new ResponseEntity<ResponseStructure<List<Restaurant>>>(response, HttpStatus.OK);
    }

    //  GET BY ID
    public ResponseEntity<ResponseStructure<Restaurant>> getById(Integer id) {

        Optional<Restaurant> optional = restaurantRepository.findById(id);

        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("Restaurant not found");
        }

        ResponseStructure<Restaurant> response = new ResponseStructure<>();
        response.setStatuscode(HttpStatus.OK.value());
        response.setMessage("Restaurant found");
        response.setData(optional.get());

        return new ResponseEntity<ResponseStructure<Restaurant>>(response, HttpStatus.OK);
    }

    //  UPDATE RESTAURANT
    public ResponseEntity<ResponseStructure<Restaurant>> updateRestaurant(Restaurant restaurant) {

        if (restaurant.getResId() == null) {
            throw new ResourceNotFoundException("Restaurant ID is required");
        }

        Optional<Restaurant> optional = restaurantRepository.findById(restaurant.getResId());

        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("Restaurant not found");
        }

        ResponseStructure<Restaurant> response = new ResponseStructure<>();
        response.setStatuscode(HttpStatus.OK.value());
        response.setMessage("Restaurant updated successfully");
        response.setData(restaurantRepository.save(restaurant));

        return new ResponseEntity<ResponseStructure<Restaurant>>(response, HttpStatus.OK);
    }

    //  DELETE
    public ResponseEntity<ResponseStructure<String>> deleteRestaurant(Integer id) {

        Optional<Restaurant> optional = restaurantRepository.findById(id);

        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("Restaurant not found");
        }

        restaurantRepository.delete(optional.get());

        ResponseStructure<String> response = new ResponseStructure<>();
        response.setStatuscode(HttpStatus.OK.value());
        response.setMessage("Deleted successfully");
        response.setData("Restaurant deleted");

        return new ResponseEntity<ResponseStructure<String>>(response, HttpStatus.OK);
    }

    //  GET BY LOCATION
    public ResponseEntity<ResponseStructure<List<Restaurant>>> getByLocation(String location) {

        List<Restaurant> list = restaurantRepository.findByLocation(location);

        if (list.size() == 0) {
            throw new ResourceNotFoundException("No restaurant in this location");
        }

        ResponseStructure<List<Restaurant>> response = new ResponseStructure<>();
        response.setStatuscode(HttpStatus.OK.value());
        response.setMessage("Fetched by location");
        response.setData(list);

        return new ResponseEntity<ResponseStructure<List<Restaurant>>>(response, HttpStatus.OK);
    }

    //  SORT BY RATING DESC
    public ResponseEntity<ResponseStructure<List<Restaurant>>> sortByRatingInDesc() {

        List<Restaurant> list = restaurantRepository.findAllByOrderByRatingDesc();

        ResponseStructure<List<Restaurant>> response = new ResponseStructure<>();
        response.setStatuscode(HttpStatus.OK.value());
        response.setMessage("Sorted by rating (desc)");
        response.setData(list);

        return new ResponseEntity<ResponseStructure<List<Restaurant>>>(response, HttpStatus.OK);
    }

    //  GET BY NAME
    public ResponseEntity<ResponseStructure<List<Restaurant>>> getByName(String name) {

        List<Restaurant> list = restaurantRepository.findByRestaurantName(name);

        if (list.size() == 0) {
            throw new ResourceNotFoundException("No restaurant found with this name");
        }

        ResponseStructure<List<Restaurant>> response = new ResponseStructure<>();
        response.setStatuscode(HttpStatus.OK.value());
        response.setMessage("Restaurants fetched by name");
        response.setData(list);

        return new ResponseEntity<ResponseStructure<List<Restaurant>>>(response, HttpStatus.OK);
    }

    //  GET MENU ITEMS OF RESTAURANT
    public ResponseEntity<ResponseStructure<List<MenuItem>>> getMenuItemsOfRestaurant(Integer resId) {

        Optional<Restaurant> optional = restaurantRepository.findById(resId);

        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("Restaurant not found");
        }

        List<MenuItem> items = menuRepo.findByRestaurant_ResId(resId);

        if (items.size() == 0) {
            throw new ResourceNotFoundException("No menu items found");
        }

        ResponseStructure<List<MenuItem>> response = new ResponseStructure<>();
        response.setStatuscode(HttpStatus.OK.value());
        response.setMessage("Menu items fetched");
        response.setData(items);

        return new ResponseEntity<ResponseStructure<List<MenuItem>>>(response, HttpStatus.OK);
    }
}
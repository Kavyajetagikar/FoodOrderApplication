package jsp.food_order.FOOD_ORDER_APP.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jsp.food_order.FOOD_ORDER_APP.dto.ResponseStructure;
import jsp.food_order.FOOD_ORDER_APP.entity.MenuItem;
import jsp.food_order.FOOD_ORDER_APP.entity.Restaurant;
import jsp.food_order.FOOD_ORDER_APP.service.RestaurantService;

@RestController
@CrossOrigin(origins="*")

@RequestMapping("/restaurant")
public class RestaurantController {

    @Autowired
    private RestaurantService service;

    //  ADD RESTAURANT
    @PostMapping
    public ResponseEntity<ResponseStructure<Restaurant>> addRestaurant(
            @RequestBody Restaurant restaurant) {

        return service.addRestaurant(restaurant);
    }

    //  GET ALL RESTAURANTS
    @GetMapping
    public ResponseEntity<ResponseStructure<List<Restaurant>>> getAllRestaurant() {

        return service.getAllRestaurant();
    }

    //  GET BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ResponseStructure<Restaurant>> getById(
            @PathVariable Integer id) {

        return service.getById(id);
    }

    //  UPDATE RESTAURANT
    @PutMapping("/{id}")
    public ResponseEntity<ResponseStructure<Restaurant>> updateRestaurant(
            @PathVariable Integer id,
            @RequestBody Restaurant restaurant) {

        restaurant.setResId(id);
        return service.updateRestaurant(restaurant);
    }

    //  DELETE RESTAURANT
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseStructure<String>> deleteRestaurant(
            @PathVariable Integer id) {

        return service.deleteRestaurant(id);
    }

    //  GET BY LOCATION
    @GetMapping("/location/{location}")
    public ResponseEntity<ResponseStructure<List<Restaurant>>> getByLocation(
            @PathVariable String location) {

        return service.getByLocation(location);
    }

    //  SORT BY RATING DESC
    @GetMapping("/sort/rating")
    public ResponseEntity<ResponseStructure<List<Restaurant>>> sortByRatingInDesc() {

        return service.sortByRatingInDesc();
    }

    //  GET BY NAME
    @GetMapping("/name/{name}")
    public ResponseEntity<ResponseStructure<List<Restaurant>>> getByName(
            @PathVariable String name) {

        return service.getByName(name);
    }

    //  GET MENU ITEMS OF RESTAURANT
    @GetMapping("/{id}/menu-items")
    public ResponseEntity<ResponseStructure<List<MenuItem>>> getMenuItemsOfRestaurant(
            @PathVariable Integer id) {

        return service.getMenuItemsOfRestaurant(id);
    }
}
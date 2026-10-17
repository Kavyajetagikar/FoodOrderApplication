package jsp.food_order.FOOD_ORDER_APP.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import jsp.food_order.FOOD_ORDER_APP.dto.ResponseStructure;
import jsp.food_order.FOOD_ORDER_APP.entity.*;
import jsp.food_order.FOOD_ORDER_APP.exception.ResourceNotFoundException;
import jsp.food_order.FOOD_ORDER_APP.repository.*;

@Service
public class MenuItemService {

    @Autowired
    private MenuItemRepository menuRepo;

    @Autowired
    private RestaurantRepository restaurantRepo;

    //  ADD ITEM
    public ResponseEntity<ResponseStructure<MenuItem>> addItem(MenuItem item, Integer resId) {

        if (item.getPrice() < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }

        Optional<Restaurant> optional = restaurantRepo.findById(resId);

        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("Restaurant not found");
        }

        item.setRestaurant(optional.get());

        ResponseStructure<MenuItem> res = new ResponseStructure<>();
        res.setStatuscode(HttpStatus.CREATED.value());
        res.setMessage("Item added");
        res.setData(menuRepo.save(item));

        return new ResponseEntity<ResponseStructure<MenuItem>>(res, HttpStatus.CREATED);
    }

    //  GET ALL ITEMS
    public ResponseEntity<ResponseStructure<List<MenuItem>>> getAllItems() {

        List<MenuItem> list = menuRepo.findAll();

        ResponseStructure<List<MenuItem>> res = new ResponseStructure<>();
        res.setStatuscode(HttpStatus.OK.value());
        res.setMessage("All items fetched");
        res.setData(list);

        return new ResponseEntity<ResponseStructure<List<MenuItem>>>(res, HttpStatus.OK);
    }

    //  UPDATE PRICE
    public ResponseEntity<ResponseStructure<MenuItem>> updatePrice(Integer id, Integer price) {

        if (price < 0) {
            throw new IllegalArgumentException("Price cannot be negative");
        }

        Optional<MenuItem> optional = menuRepo.findById(id);

        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("Item not found");
        }

        MenuItem item = optional.get();
        item.setPrice(price);

        ResponseStructure<MenuItem> res = new ResponseStructure<>();
        res.setStatuscode(HttpStatus.OK.value());
        res.setMessage("Price updated");
        res.setData(menuRepo.save(item));

        return new ResponseEntity<ResponseStructure<MenuItem>>(res, HttpStatus.OK);
    }

    //  UPDATE AVAILABILITY
    public ResponseEntity<ResponseStructure<MenuItem>> updateAvailability(Integer id, Boolean availability) {

        Optional<MenuItem> optional = menuRepo.findById(id);

        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("Item not found");
        }

        MenuItem item = optional.get();
        item.setAvailability(availability);

        ResponseStructure<MenuItem> res = new ResponseStructure<>();
        res.setStatuscode(HttpStatus.OK.value());
        res.setMessage("Availability updated");
        res.setData(menuRepo.save(item));

        return new ResponseEntity<ResponseStructure<MenuItem>>(res, HttpStatus.OK);
    }

    //  DELETE ITEM
    public ResponseEntity<ResponseStructure<String>> deleteItem(Integer id) {

        Optional<MenuItem> optional = menuRepo.findById(id);

        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("Item not found");
        }

        menuRepo.delete(optional.get());

        ResponseStructure<String> res = new ResponseStructure<>();
        res.setStatuscode(HttpStatus.OK.value());
        res.setMessage("Deleted");
        res.setData("Item deleted");

        return new ResponseEntity<ResponseStructure<String>>(res, HttpStatus.OK);
    }

    // FETCH ITEMS > PRICE
    public ResponseEntity<ResponseStructure<List<MenuItem>>> fetchItemsGreaterThanSpecifiedPrice(Integer price) {

        List<MenuItem> list = menuRepo.findByPriceGreaterThan(price);

        if (list.size() == 0) {
            throw new ResourceNotFoundException("No items found");
        }

        ResponseStructure<List<MenuItem>> res = new ResponseStructure<>();
        res.setStatuscode(HttpStatus.OK.value());
        res.setMessage("Items fetched");
        res.setData(list);

        return new ResponseEntity<ResponseStructure<List<MenuItem>>>(res, HttpStatus.OK);
    }

    //  GET ITEMS BY NAME
    public ResponseEntity<ResponseStructure<List<MenuItem>>> getItemsByName(String name) {

        List<MenuItem> list = menuRepo.findByItemName(name);

        if (list.size() == 0) {
            throw new ResourceNotFoundException("No items found");
        }

        ResponseStructure<List<MenuItem>> res = new ResponseStructure<>();
        res.setStatuscode(HttpStatus.OK.value());
        res.setMessage("Items fetched");
        res.setData(list);

        return new ResponseEntity<ResponseStructure<List<MenuItem>>>(res, HttpStatus.OK);
    }
}
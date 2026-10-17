package jsp.food_order.FOOD_ORDER_APP.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jsp.food_order.FOOD_ORDER_APP.dto.ResponseStructure;
import jsp.food_order.FOOD_ORDER_APP.entity.MenuItem;
import jsp.food_order.FOOD_ORDER_APP.service.MenuItemService;

@RestController
@CrossOrigin(origins="*")

@RequestMapping("/menu-items")
public class MenuItemController {

    @Autowired
    private MenuItemService service;

    // ADD ITEM
    @PostMapping("/{resId}")
    public ResponseEntity<ResponseStructure<MenuItem>> addItem(
            @RequestBody MenuItem item,
            @PathVariable Integer resId) {

        return service.addItem(item, resId);
    }

    // GET ALL ITEMS
    @GetMapping
    public ResponseEntity<ResponseStructure<List<MenuItem>>> getAllItems() {

        return service.getAllItems();
    }

    // UPDATE PRICE
    @PutMapping("/{id}/price/{price}")
    public ResponseEntity<ResponseStructure<MenuItem>> updatePrice(
            @PathVariable Integer id,
            @PathVariable Integer price) {

        return service.updatePrice(id, price);
    }

    // UPDATE AVAILABILITY
    @PutMapping("/{id}/availability/{availability}")
    public ResponseEntity<ResponseStructure<MenuItem>> updateAvailability(
            @PathVariable Integer id,
            @PathVariable Boolean availability) {

        return service.updateAvailability(id, availability);
    }

    //  DELETE ITEM
    @DeleteMapping("/{id}")
    public ResponseEntity<ResponseStructure<String>> deleteItem(
            @PathVariable Integer id) {

        return service.deleteItem(id);
    }

    //  FETCH ITEMS GREATER THAN PRICE
    @GetMapping("/price/{price}")
    public ResponseEntity<ResponseStructure<List<MenuItem>>> fetchItemsGreaterThanSpecifiedPrice(
            @PathVariable Integer price) {

        return service.fetchItemsGreaterThanSpecifiedPrice(price);
    }

    //  GET ITEMS BY NAME
    @GetMapping("/name/{name}")
    public ResponseEntity<ResponseStructure<List<MenuItem>>> getItemsByName(
            @PathVariable String name) {

        return service.getItemsByName(name);
    }
}
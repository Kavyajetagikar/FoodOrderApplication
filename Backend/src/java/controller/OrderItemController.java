package jsp.food_order.FOOD_ORDER_APP.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jsp.food_order.FOOD_ORDER_APP.dto.ResponseStructure;
import jsp.food_order.FOOD_ORDER_APP.entity.OrderItem;
import jsp.food_order.FOOD_ORDER_APP.entity.Payment;
import jsp.food_order.FOOD_ORDER_APP.service.OrderItemService;

@RestController
@CrossOrigin(origins="*")

@RequestMapping("/order-items")
public class OrderItemController {

    @Autowired
    private OrderItemService service;

    // ADD ITEM TO EXISTING ORDER
    @PostMapping("/{orderId}/{menuId}/{quantity}")
    public ResponseEntity<ResponseStructure<OrderItem>> addItemToExistingOrder(
            @PathVariable Integer orderId,
            @PathVariable Integer menuId,
            @PathVariable Integer quantity) {

        return service.addItemToExistingOrder(orderId, menuId, quantity);
    }

    //  UPDATE ITEM QUANTITY
    @PutMapping("/{orderItemId}/{quantity}")
    public ResponseEntity<ResponseStructure<OrderItem>> updateItemQuantity(
            @PathVariable Integer orderItemId,
            @PathVariable Integer quantity) {

        return service.updateItemQuantity(orderItemId, quantity);
    }

    //  REMOVE ITEM FROM ORDER
    @DeleteMapping("/{orderItemId}")
    public ResponseEntity<ResponseStructure<String>> removeItemFromOrder(
            @PathVariable Integer orderItemId) {

        return service.removeItemFromOrder(orderItemId);
    }

    // GET ORDER ITEMS OF AN ORDER
    @GetMapping("/order/{orderId}")
    public ResponseEntity<ResponseStructure<List<OrderItem>>> getOrderItemsOfAnOrder(
            @PathVariable Integer orderId) {

        return service.getOrderItemsOfAnOrder(orderId);
    }
    
    //  PROCESS PAYMENT
    @PostMapping("/{orderId}")
    public ResponseEntity<ResponseStructure<Payment>> processPayment(
            @PathVariable Integer orderId,
            @RequestBody Payment payment) {

        return service.processPayment(orderId, payment);
    }
}
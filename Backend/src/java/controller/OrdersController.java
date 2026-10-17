package jsp.food_order.FOOD_ORDER_APP.controller;

import java.time.LocalDate;
import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.format.annotation.DateTimeFormat;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jsp.food_order.FOOD_ORDER_APP.dto.ResponseStructure;
import jsp.food_order.FOOD_ORDER_APP.entity.OrderStatus;
import jsp.food_order.FOOD_ORDER_APP.entity.Orders;
import jsp.food_order.FOOD_ORDER_APP.service.OrdersService;

@RestController
@CrossOrigin(origins="*")

@RequestMapping("/orders")
public class OrdersController {

    @Autowired
    private OrdersService service;

    //  PLACE ORDER
    @PostMapping("/{customerId}")
    public ResponseEntity<ResponseStructure<Orders>> placeOrder(
            @PathVariable Integer customerId,
            @RequestBody Orders order) {

        return service.placeOrder(customerId, order);
    }

    //  GET ALL ORDERS
    @GetMapping
    public ResponseEntity<ResponseStructure<List<Orders>>> getAllOrders() {

        return service.getAllOrders();
    }

    //  GET ORDER BY ID
    @GetMapping("/{id}")
    public ResponseEntity<ResponseStructure<Orders>> getById(
            @PathVariable Integer id) {

        return service.getById(id);
    }

    // GET ORDERS BY CUSTOMER
    @GetMapping("/customer/{customerId}")
    public ResponseEntity<ResponseStructure<List<Orders>>> getOrdersByCustomer(
            @PathVariable Integer customerId) {

        return service.getOrdersPlacedByParticularCustomer(customerId);
    }

    //  UPDATE ORDER STATUS
    @PutMapping("/{orderId}/status/{status}")
    public ResponseEntity<ResponseStructure<Orders>> updateOrderStatus(
            @PathVariable Integer orderId,
            @PathVariable OrderStatus status) {

        return service.updateOrderStatus(orderId, status);
    }

    //  CANCEL ORDER
    @PutMapping("/{orderId}/cancel")
    public ResponseEntity<ResponseStructure<String>> cancelOrder(
            @PathVariable Integer orderId) {

        return service.cancelOrder(orderId);
    }

    //  GET ORDERS BY STATUS
    @GetMapping("/status/{status}")
    public ResponseEntity<ResponseStructure<List<Orders>>> getOrdersByStatus(
            @PathVariable OrderStatus status) {

        return service.getOrderByStatus(status);
    }

    //  GET ORDERS BY DATE
    @GetMapping("/date/{date}")
    public ResponseEntity<ResponseStructure<List<Orders>>> getOrdersByDate(
            @PathVariable 
            @DateTimeFormat(iso = DateTimeFormat.ISO.DATE) LocalDate date) {

        return service.getOrderByDate(date);
    }

    //  GET ORDERS BY RESTAURANT
    @GetMapping("/restaurant/{resId}")
    public ResponseEntity<ResponseStructure<List<Orders>>> getOrdersByRestaurant(
            @PathVariable Integer resId) {

        return service.getOrdersPlacedForParticularRestaurant(resId);
    }

    // GET ORDERS IN PRICE RANGE
    @GetMapping("/price/{min}/{max}")
    public ResponseEntity<ResponseStructure<List<Orders>>> getOrdersInPriceRange(
            @PathVariable Double min,
            @PathVariable Double max) {

        return service.getOrdersInPriceRange(min, max);
    }
}
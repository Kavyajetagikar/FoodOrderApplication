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
public class OrderItemService {

    @Autowired
    private OrderItemRepository orderItemRepo;

    @Autowired
    private MenuItemRepository menuRepo;

    @Autowired
    private OrdersRepository orderRepo;

    //  ADD ITEM TO EXISTING ORDER
    public ResponseEntity<ResponseStructure<OrderItem>> addItemToExistingOrder(
            Integer orderId, Integer menuId, Integer quantity) {

        if (quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }

        Optional<Orders> orderOpt = orderRepo.findById(orderId);
        if (orderOpt.isEmpty()) {
            throw new ResourceNotFoundException("Order not found");
        }

        Optional<MenuItem> menuOpt = menuRepo.findById(menuId);
        if (menuOpt.isEmpty()) {
            throw new ResourceNotFoundException("Menu item not found");
        }

        MenuItem menu = menuOpt.get();

        if (!menu.getAvailability()) {
            throw new RuntimeException("Item not available");
        }

        OrderItem item = new OrderItem();
        item.setOrders(orderOpt.get());
        item.setMenuitem(menu);
        item.setQuantity(quantity);

        // ✔ subtotal logic
        item.setSubtotal((double) (menu.getPrice() * quantity));

        ResponseStructure<OrderItem> res = new ResponseStructure<>();
        res.setStatuscode(HttpStatus.CREATED.value());
        res.setMessage("Item added to existing order");
        res.setData(orderItemRepo.save(item));

        return new ResponseEntity<ResponseStructure<OrderItem>>(res, HttpStatus.CREATED);
    }

    //  UPDATE ITEM QUANTITY
    public ResponseEntity<ResponseStructure<OrderItem>> updateItemQuantity(
            Integer orderItemId, Integer quantity) {

        if (quantity < 1) {
            throw new IllegalArgumentException("Quantity must be at least 1");
        }

        Optional<OrderItem> optional = orderItemRepo.findById(orderItemId);

        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("OrderItem not found");
        }

        OrderItem item = optional.get();
        MenuItem menu = item.getMenuitem();

        // ✔ recalculate subtotal
        item.setQuantity(quantity);
        item.setSubtotal((double) (menu.getPrice() * quantity));

        ResponseStructure<OrderItem> res = new ResponseStructure<>();
        res.setStatuscode(HttpStatus.OK.value());
        res.setMessage("Order item quantity updated");
        res.setData(orderItemRepo.save(item));

        return new ResponseEntity<ResponseStructure<OrderItem>>(res, HttpStatus.OK);
    }

    //  REMOVE ITEM FROM ORDER
    public ResponseEntity<ResponseStructure<String>> removeItemFromOrder(Integer orderItemId) {

        Optional<OrderItem> optional = orderItemRepo.findById(orderItemId);

        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("OrderItem not found");
        }

        orderItemRepo.delete(optional.get());

        ResponseStructure<String> res = new ResponseStructure<>();
        res.setStatuscode(HttpStatus.OK.value());
        res.setMessage("Item removed from order");
        res.setData("Deleted successfully");

        return new ResponseEntity<ResponseStructure<String>>(res, HttpStatus.OK);
    }

    //  GET ORDER ITEMS OF AN ORDER
    public ResponseEntity<ResponseStructure<List<OrderItem>>> getOrderItemsOfAnOrder(Integer orderId) {

        Optional<Orders> orderOpt = orderRepo.findById(orderId);

        if (orderOpt.isEmpty()) {
            throw new ResourceNotFoundException("Order not found");
        }

        List<OrderItem> items = orderItemRepo.findByOrders_OrderId(orderId);

        if (items.size() == 0) {
            throw new ResourceNotFoundException("No items found for this order");
        }

        ResponseStructure<List<OrderItem>> res = new ResponseStructure<>();
        res.setStatuscode(HttpStatus.OK.value());
        res.setMessage("Order items fetched");
        res.setData(items);

        return new ResponseEntity<ResponseStructure<List<OrderItem>>>(res, HttpStatus.OK);
    }
    
 //  PROCESS PAYMENT

    @Autowired
    private PaymentRepository paymentRepo;
    
    public ResponseEntity<ResponseStructure<Payment>> processPayment(Integer orderId, Payment payment) {

        Optional<Orders> optional = orderRepo.findById(orderId);

        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("Order not found");
        }

        Orders order = optional.get();

        if (!order.getTotalAmount().equals(payment.getAmount())) {
            throw new RuntimeException("Payment amount must match order total amount");
        }

        payment.setOrder(order);

        ResponseStructure<Payment> res = new ResponseStructure<>();
        res.setStatuscode(HttpStatus.CREATED.value());
        res.setMessage("Payment successful");
        res.setData(paymentRepo.save(payment));

        return new ResponseEntity<ResponseStructure<Payment>>(res, HttpStatus.CREATED);
    }

}
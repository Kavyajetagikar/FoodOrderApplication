package jsp.food_order.FOOD_ORDER_APP.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import jsp.food_order.FOOD_ORDER_APP.dto.*;
import jsp.food_order.FOOD_ORDER_APP.entity.Payment;
import jsp.food_order.FOOD_ORDER_APP.entity.PaymentMethod;
import jsp.food_order.FOOD_ORDER_APP.entity.PaymentStatus;
import jsp.food_order.FOOD_ORDER_APP.service.PaymentService;

@RestController
@CrossOrigin(origins="*")

@RequestMapping("/payments")
public class PaymentController {

    @Autowired
    private PaymentService service;

//    //  PROCESS PAYMENT
//    @PostMapping("/{orderId}")
//    public ResponseEntity<ResponseStructure<Payment>> processPayment(
//            @PathVariable Integer orderId,
//            @RequestBody Payment payment) {
//
//        return service.processPayment(orderId, payment);
//    }

    //  GET PAYMENT BY ID
    @GetMapping("/{paymentId}")
    public ResponseEntity<ResponseStructure<Payment>> getPaymentById(
            @PathVariable Integer paymentId) {

        return service.getPaymentById(paymentId);
    }

    //  GET PAYMENT BY STATUS
    @GetMapping("/status/{status}")
    public ResponseEntity<ResponseStructure<List<Payment>>> getPaymentByStatus(
            @PathVariable PaymentStatus status) {

        return service.getPaymentByStatus(status);
    }

    //  GET PAYMENT BY METHOD
    @GetMapping("/method/{method}")
    public ResponseEntity<ResponseStructure<List<Payment>>> getPaymentByMethod(
            @PathVariable PaymentMethod method) {

        return service.getPaymentByMethod(method);
    }

    // UPDATE PAYMENT STATUS
    @PutMapping("/{paymentId}/status/{status}")
    public ResponseEntity<ResponseStructure<Payment>> updatePaymentStatus(
            @PathVariable Integer paymentId,
            @PathVariable PaymentStatus status) {

        return service.updatePaymentStatus(paymentId, status);
    }
}
package jsp.food_order.FOOD_ORDER_APP.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.*;
import org.springframework.stereotype.Service;

import jsp.food_order.FOOD_ORDER_APP.dto.*;
import jsp.food_order.FOOD_ORDER_APP.entity.*;
import jsp.food_order.FOOD_ORDER_APP.exception.ResourceNotFoundException;
import jsp.food_order.FOOD_ORDER_APP.repository.*;

@Service
public class PaymentService {

    @Autowired
    private PaymentRepository paymentRepo;

    @Autowired
    private OrdersRepository orderRepo;

//    //  PROCESS PAYMENT
//    public ResponseEntity<ResponseStructure<Payment>> processPayment(Integer orderId, Payment payment) {
//
//        Optional<Orders> optional = orderRepo.findById(orderId);
//
//        if (optional.isEmpty()) {
//            throw new ResourceNotFoundException("Order not found");
//        }
//
//        Orders order = optional.get();
//
//        if (!order.getTotalAmount().equals(payment.getAmount())) {
//            throw new RuntimeException("Payment amount must match order total amount");
//        }
//
//        payment.setOrder(order);
//
//        ResponseStructure<Payment> res = new ResponseStructure<>();
//        res.setStatuscode(HttpStatus.CREATED.value());
//        res.setMessage("Payment successful");
//        res.setData(paymentRepo.save(payment));
//
//        return new ResponseEntity<ResponseStructure<Payment>>(res, HttpStatus.CREATED);
//    }
    

    //  GET PAYMENT BY ID
    public ResponseEntity<ResponseStructure<Payment>> getPaymentById(Integer paymentId) {

        Optional<Payment> optional = paymentRepo.findById(paymentId);

        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("Payment not found");
        }

        ResponseStructure<Payment> res = new ResponseStructure<>();
        res.setStatuscode(HttpStatus.OK.value());
        res.setMessage("Payment fetched");
        res.setData(optional.get());

        return new ResponseEntity<ResponseStructure<Payment>>(res, HttpStatus.OK);
    }

    //  GET PAYMENT BY STATUS
    public ResponseEntity<ResponseStructure<List<Payment>>> getPaymentByStatus(PaymentStatus status) {

        List<Payment> list = paymentRepo.findByPaymentstatus(status);

        if (list.size() == 0) {
            throw new ResourceNotFoundException("No payments found with this status");
        }

        ResponseStructure<List<Payment>> res = new ResponseStructure<>();
        res.setStatuscode(HttpStatus.OK.value());
        res.setMessage("Payments fetched by status");
        res.setData(list);

        return new ResponseEntity<ResponseStructure<List<Payment>>>(res, HttpStatus.OK);
    }

    //  GET PAYMENT BY METHOD
    public ResponseEntity<ResponseStructure<List<Payment>>> getPaymentByMethod(PaymentMethod method) {

        List<Payment> list = paymentRepo.findByPaymentmethod(method);

        if (list.size() == 0) {
            throw new ResourceNotFoundException("No payments found with this method");
        }

        ResponseStructure<List<Payment>> res = new ResponseStructure<>();
        res.setStatuscode(HttpStatus.OK.value());
        res.setMessage("Payments fetched by method");
        res.setData(list);

        return new ResponseEntity<ResponseStructure<List<Payment>>>(res, HttpStatus.OK);
    }

    //  UPDATE PAYMENT STATUS
    public ResponseEntity<ResponseStructure<Payment>> updatePaymentStatus(
            Integer paymentId, PaymentStatus status) {

        Optional<Payment> optional = paymentRepo.findById(paymentId);

        if (optional.isEmpty()) {
            throw new ResourceNotFoundException("Payment not found");
        }

        Payment payment = optional.get();
        payment.setPaymentstatus(status);

        ResponseStructure<Payment> res = new ResponseStructure<>();
        res.setStatuscode(HttpStatus.OK.value());
        res.setMessage("Payment status updated");
        res.setData(paymentRepo.save(payment));

        return new ResponseEntity<ResponseStructure<Payment>>(res, HttpStatus.OK);
    }
}
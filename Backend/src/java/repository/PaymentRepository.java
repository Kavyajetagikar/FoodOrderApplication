
package jsp.food_order.FOOD_ORDER_APP.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import jsp.food_order.FOOD_ORDER_APP.entity.Payment;
import jsp.food_order.FOOD_ORDER_APP.entity.PaymentMethod;
import jsp.food_order.FOOD_ORDER_APP.entity.PaymentStatus;

public interface PaymentRepository extends JpaRepository<Payment, Integer> {

    // by status
    List<Payment> findByPaymentstatus(PaymentStatus status);

    // by method
    List<Payment> findByPaymentmethod(PaymentMethod method);
}
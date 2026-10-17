
package jsp.food_order.FOOD_ORDER_APP.repository;

import java.time.LocalDate;
import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import jsp.food_order.FOOD_ORDER_APP.entity.Orders;
import jsp.food_order.FOOD_ORDER_APP.entity.OrderStatus;

public interface OrdersRepository extends JpaRepository<Orders, Integer> {

    // orders by customer
    List<Orders> findByCustomer_CustomerId(Integer customerId);

    // orders by status
    List<Orders> findByStatus(OrderStatus status);

    // orders by date
    List<Orders> findByOrderDateTime(LocalDate date);

    // orders by price range
    List<Orders> findByTotalAmountBetween(Double min, Double max);

    // orders by restaurant (via orderItems → menuItem → restaurant)
    List<Orders> findByOrderitems_Menuitem_Restaurant_ResId(Integer resId);
}
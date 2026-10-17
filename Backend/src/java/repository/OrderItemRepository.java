
package jsp.food_order.FOOD_ORDER_APP.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import jsp.food_order.FOOD_ORDER_APP.entity.OrderItem;

public interface OrderItemRepository extends JpaRepository<OrderItem, Integer> {

    // get all items of an order
    List<OrderItem> findByOrders_OrderId(Integer orderId);
}
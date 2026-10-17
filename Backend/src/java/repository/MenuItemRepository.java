
package jsp.food_order.FOOD_ORDER_APP.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import jsp.food_order.FOOD_ORDER_APP.entity.MenuItem;

public interface MenuItemRepository extends JpaRepository<MenuItem, Integer> {

    // get items by name
    List<MenuItem> findByItemName(String itemName);

    // filter by price
    List<MenuItem> findByPriceGreaterThan(Integer price);

    // get items by restaurant
    List<MenuItem> findByRestaurant_ResId(Integer resId);
}

package jsp.food_order.FOOD_ORDER_APP.repository;

import java.util.List;

import org.springframework.data.jpa.repository.JpaRepository;

import jsp.food_order.FOOD_ORDER_APP.entity.Restaurant;

public interface RestaurantRepository extends JpaRepository<Restaurant, Integer> {

    List<Restaurant> findByLocation(String location);

    List<Restaurant> findByRestaurantName(String name);

    List<Restaurant> findAllByOrderByRatingDesc();
}
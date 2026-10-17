package jsp.food_order.FOOD_ORDER_APP.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;

import jsp.food_order.FOOD_ORDER_APP.entity.Customer;

public interface CustomerRepository extends JpaRepository<Customer, Integer> {

	boolean existsByEmail(String email);

	boolean existsByContact(Long contact);

	// get customer by contact
	Optional<Customer> findByContact(Long contact);
	
	//get customer by email
	Optional<Customer> findByEmail(String email);

}
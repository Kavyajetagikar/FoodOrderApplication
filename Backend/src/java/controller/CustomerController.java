package jsp.food_order.FOOD_ORDER_APP.controller;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import jsp.food_order.FOOD_ORDER_APP.dto.ResponseStructure;
import jsp.food_order.FOOD_ORDER_APP.entity.Customer;
import jsp.food_order.FOOD_ORDER_APP.service.CustomerService;

@RestController
@CrossOrigin(origins="*")
@RequestMapping("/customer")
public class CustomerController {

	@Autowired
	private CustomerService customerService;

	// create customer
	@PostMapping
	public ResponseEntity<ResponseStructure<Customer>> createCustomer(@RequestBody Customer customer) {
		return customerService.createCustomer(customer);

	}

	// get all customer
	@GetMapping
	public ResponseEntity<ResponseStructure<List<Customer>>> getAllCustomer() {
		return customerService.getAllCustomer();
	}

	// get customer by id
	@GetMapping("{id}")
	public ResponseEntity<ResponseStructure<Customer>> getCustomerById(@PathVariable Integer id) {
		return customerService.getCustomerById(id);
	}

	// updateAddress
	@PutMapping("/{id}")
	public ResponseEntity<ResponseStructure<Customer>> updateCustomer(
	        @PathVariable Integer id,
	        @RequestBody Customer customer) {

	    customer.setCustomerId(id);
	    return customerService.updateCustomer(customer);
	}

	// get customer by contact
	@GetMapping("/contact/{contact}")
	public ResponseEntity<ResponseStructure<Customer>> getcustomerByContact(@PathVariable Long contact) {
		return customerService.getcustomerByContact(contact);
	}

	// get customer by email
	@GetMapping("email/{email}")
	public ResponseEntity<ResponseStructure<Customer>> getcustomerByEmail(@PathVariable String email) {
		return customerService.getcustomerByEmail(email);
	}

}
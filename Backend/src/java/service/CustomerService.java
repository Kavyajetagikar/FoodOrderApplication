
package jsp.food_order.FOOD_ORDER_APP.service;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.dao.DataIntegrityViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import jsp.food_order.FOOD_ORDER_APP.dto.ResponseStructure;
import jsp.food_order.FOOD_ORDER_APP.entity.Customer;
import jsp.food_order.FOOD_ORDER_APP.exception.ResourceNotFoundException;
import jsp.food_order.FOOD_ORDER_APP.repository.CustomerRepository;

@Service
public class CustomerService {

	@Autowired
	private CustomerRepository customerRepository;

	//  CREATE CUSTOMER
	public ResponseEntity<ResponseStructure<Customer>> createCustomer(Customer customer) {

		// email validation
		if (customerRepository.existsByEmail(customer.getEmail())) {

			throw new DataIntegrityViolationException("Email already exists : " + customer.getEmail());
		}

		// contact validation
		if (customerRepository.existsByContact(customer.getContact())) {

			throw new DataIntegrityViolationException("Contact already exists : " + customer.getContact());
		}

		// contact length validation
		if (customer.getContact() == null || customer.getContact().toString().length() != 10) {

			throw new DataIntegrityViolationException("Contact number must be exactly 10 digits");
		}

		ResponseStructure<Customer> response = new ResponseStructure<Customer>();

		response.setStatuscode(HttpStatus.CREATED.value());
		response.setMessage("Customer created successfully");
		response.setData(customerRepository.save(customer));

		return new ResponseEntity<ResponseStructure<Customer>>(response, HttpStatus.CREATED);
	}

	//  GET ALL CUSTOMERS
	public ResponseEntity<ResponseStructure<List<Customer>>> getAllCustomer() {

		List<Customer> customers = customerRepository.findAll();

		if (customers.isEmpty()) {

			throw new ResourceNotFoundException("No customer records found");
		}

		ResponseStructure<List<Customer>> response = new ResponseStructure<List<Customer>>();

		response.setStatuscode(HttpStatus.OK.value());
		response.setMessage("All customer records fetched successfully");
		response.setData(customers);

		return new ResponseEntity<ResponseStructure<List<Customer>>>(response, HttpStatus.OK);
	}

	// GET CUSTOMER BY ID
	public ResponseEntity<ResponseStructure<Customer>> getCustomerById(Integer id) {

		Optional<Customer> optional = customerRepository.findById(id);

		if (optional.isEmpty()) {

			throw new ResourceNotFoundException("Customer not found with id : " + id);
		}

		ResponseStructure<Customer> response = new ResponseStructure<Customer>();

		response.setStatuscode(HttpStatus.OK.value());
		response.setMessage("Customer fetched successfully");
		response.setData(optional.get());

		return new ResponseEntity<ResponseStructure<Customer>>(response, HttpStatus.OK);
	}

	// UPDATE CUSTOMER
	public ResponseEntity<ResponseStructure<Customer>> updateCustomer(Customer customer) {

		//  id validation
		if (customer.getCustomerId() == null) {

			throw new ResourceNotFoundException("Customer id is required for update");
		}

		Optional<Customer> optional = customerRepository.findById(customer.getCustomerId());

		//  customer existence validation
		if (optional.isEmpty()) {

			throw new ResourceNotFoundException("Customer not found with id : " + customer.getCustomerId());
		}

		Customer existingCustomer = optional.get();

		//  email uniqueness validation
		Optional<Customer> emailOptional = customerRepository.findByEmail(customer.getEmail());

		if (emailOptional.isPresent() && !emailOptional.get().getCustomerId().equals(customer.getCustomerId())) {

			throw new DataIntegrityViolationException("Email already exists : " + customer.getEmail());
		}

		//  contact uniqueness validation
		Optional<Customer> contactOptional = customerRepository.findByContact(customer.getContact());

		if (contactOptional.isPresent() && !contactOptional.get().getCustomerId().equals(customer.getCustomerId())) {

			throw new DataIntegrityViolationException("Contact already exists : " + customer.getContact());
		}

		//  contact length validation
		if (customer.getContact() == null || customer.getContact().toString().length() != 10) {

			throw new DataIntegrityViolationException("Contact number must be exactly 10 digits");
		}

		existingCustomer.setCustomerName(customer.getCustomerName());
		existingCustomer.setEmail(customer.getEmail());
		existingCustomer.setContact(customer.getContact());
		existingCustomer.setAddress(customer.getAddress());

		ResponseStructure<Customer> response = new ResponseStructure<Customer>();

		response.setStatuscode(HttpStatus.OK.value());
		response.setMessage("Customer updated successfully");
		response.setData(customerRepository.save(existingCustomer));

		return new ResponseEntity<ResponseStructure<Customer>>(response, HttpStatus.OK);
	}

	//  GET CUSTOMER BY CONTACT
	public ResponseEntity<ResponseStructure<Customer>> getcustomerByContact(Long contact) {

		Optional<Customer> optional = customerRepository.findByContact(contact);

		if (optional.isEmpty()) {

			throw new ResourceNotFoundException("Customer not found with contact : " + contact);
		}

		ResponseStructure<Customer> response = new ResponseStructure<Customer>();

		response.setStatuscode(HttpStatus.OK.value());
		response.setMessage("Customer fetched successfully");
		response.setData(optional.get());

		return new ResponseEntity<ResponseStructure<Customer>>(response, HttpStatus.OK);
	}

	//  GET CUSTOMER BY EMAIL
	public ResponseEntity<ResponseStructure<Customer>> getcustomerByEmail(String email) {

		Optional<Customer> optional = customerRepository.findByEmail(email);

		if (optional.isEmpty()) {

			throw new ResourceNotFoundException("Customer not found with email : " + email);
		}

		ResponseStructure<Customer> response = new ResponseStructure<Customer>();

		response.setStatuscode(HttpStatus.OK.value());
		response.setMessage("Customer fetched successfully");
		response.setData(optional.get());

		return new ResponseEntity<ResponseStructure<Customer>>(response, HttpStatus.OK);
	}
}
package jsp.food_order.FOOD_ORDER_APP.service;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Service;

import jsp.food_order.FOOD_ORDER_APP.dto.ResponseStructure;
import jsp.food_order.FOOD_ORDER_APP.entity.Customer;
import jsp.food_order.FOOD_ORDER_APP.entity.MenuItem;
import jsp.food_order.FOOD_ORDER_APP.entity.OrderItem;
import jsp.food_order.FOOD_ORDER_APP.entity.OrderStatus;
import jsp.food_order.FOOD_ORDER_APP.entity.Orders;
import jsp.food_order.FOOD_ORDER_APP.exception.ResourceNotFoundException;
import jsp.food_order.FOOD_ORDER_APP.repository.CustomerRepository;
import jsp.food_order.FOOD_ORDER_APP.repository.MenuItemRepository;
import jsp.food_order.FOOD_ORDER_APP.repository.OrdersRepository;
import jsp.food_order.FOOD_ORDER_APP.repository.PaymentRepository;

@Service
public class OrdersService {

	@Autowired
	private OrdersRepository orderRepo;

	@Autowired
	private CustomerRepository customerRepo;

	@Autowired
	private MenuItemRepository menuRepo;

	@Autowired
	private PaymentRepository paymentRepo;

	// PLACE ORDER
	public ResponseEntity<ResponseStructure<Orders>> placeOrder(Integer customerId, Orders order) {

		Optional<Customer> custOpt = customerRepo.findById(customerId);

		if (custOpt.isEmpty()) {
			throw new ResourceNotFoundException("Customer not found");
		}

		// order must contain items
		if (order.getOrderitems() == null || order.getOrderitems().isEmpty()) {
			throw new IllegalArgumentException("Order must contain at least 1 item");
		}

		Double total = 0.0;

		for (OrderItem item : order.getOrderitems()) {

			// quantity validation
			if (item.getQuantity() == null || item.getQuantity() < 1) {
				throw new IllegalArgumentException("Quantity must be at least 1");
			}

			// menu item id validation
			if (item.getMenuitem() == null || item.getMenuitem().getItemId() == null) {
				throw new IllegalArgumentException("MenuItem ID is required");
			}

			Optional<MenuItem> menuOpt = menuRepo.findById(item.getMenuitem().getItemId());

			if (menuOpt.isEmpty()) {
				throw new ResourceNotFoundException("MenuItem not found");
			}

			MenuItem menu = menuOpt.get();

			// availability check
			if (!menu.getAvailability()) {
				throw new RuntimeException("Item not available");
			}

			item.setMenuitem(menu);
			item.setOrders(order);

			// subtotal calculation
			Double subtotal = (double) (menu.getPrice() * item.getQuantity());

			item.setSubtotal(subtotal);

			total += subtotal;
		}

		// payment validation
		if (order.getPayment() == null) {
			throw new IllegalArgumentException("Payment details required");
		}

		// amount automatically calculated
		
		order.getPayment().setAmount(total);

		// set order details
		order.setCustomer(custOpt.get());
		order.setTotalAmount(total);
		order.setStatus(OrderStatus.CREATED);

		// bi-directional mapping
		order.getPayment().setOrder(order);

		Orders saved = orderRepo.save(order);

		ResponseStructure<Orders> response = new ResponseStructure<>();

		response.setStatuscode(HttpStatus.CREATED.value());
		response.setMessage("Order placed successfully");
		response.setData(saved);

		return new ResponseEntity<ResponseStructure<Orders>>(response, HttpStatus.CREATED);
	}

	// GET ALL ORDERS
	public ResponseEntity<ResponseStructure<List<Orders>>> getAllOrders() {

		List<Orders> list = orderRepo.findAll();

		if (list.isEmpty()) {
			throw new ResourceNotFoundException("No orders found");
		}

		ResponseStructure<List<Orders>> response = new ResponseStructure<>();

		response.setStatuscode(HttpStatus.OK.value());
		response.setMessage("All orders fetched");
		response.setData(list);

		return new ResponseEntity<ResponseStructure<List<Orders>>>(response, HttpStatus.OK);
	}

	// GET ORDER BY ID
	public ResponseEntity<ResponseStructure<Orders>> getById(Integer id) {

		Optional<Orders> optional = orderRepo.findById(id);

		if (optional.isEmpty()) {
			throw new ResourceNotFoundException("Order not found");
		}

		ResponseStructure<Orders> response = new ResponseStructure<>();

		response.setStatuscode(HttpStatus.OK.value());
		response.setMessage("Order fetched");
		response.setData(optional.get());

		return new ResponseEntity<ResponseStructure<Orders>>(response, HttpStatus.OK);
	}

	// GET ORDERS BY CUSTOMER
	public ResponseEntity<ResponseStructure<List<Orders>>> getOrdersPlacedByParticularCustomer(Integer customerId) {

		List<Orders> list = orderRepo.findByCustomer_CustomerId(customerId);

		if (list.isEmpty()) {
			throw new ResourceNotFoundException("No orders found for this customer");
		}

		ResponseStructure<List<Orders>> response = new ResponseStructure<>();

		response.setStatuscode(HttpStatus.OK.value());
		response.setMessage("Orders fetched for customer");
		response.setData(list);

		return new ResponseEntity<ResponseStructure<List<Orders>>>(response, HttpStatus.OK);
	}

	// UPDATE ORDER STATUS
	public ResponseEntity<ResponseStructure<Orders>> updateOrderStatus(Integer orderId, OrderStatus status) {

		Optional<Orders> optional = orderRepo.findById(orderId);

		if (optional.isEmpty()) {
			throw new ResourceNotFoundException("Order not found");
		}

		Orders order = optional.get();

		order.setStatus(status);

		ResponseStructure<Orders> response = new ResponseStructure<>();

		response.setStatuscode(HttpStatus.OK.value());
		response.setMessage("Order status updated");
		response.setData(orderRepo.save(order));

		return new ResponseEntity<ResponseStructure<Orders>>(response, HttpStatus.OK);
	}

	// CANCEL ORDER
	public ResponseEntity<ResponseStructure<String>> cancelOrder(Integer orderId) {

		Optional<Orders> optional = orderRepo.findById(orderId);

		if (optional.isEmpty()) {
			throw new ResourceNotFoundException("Order not found");
		}

		Orders order = optional.get();

		if (order.getStatus() == OrderStatus.PREPARING || order.getStatus() == OrderStatus.CANCELLED
				|| order.getStatus() == OrderStatus.DELIVERED) {

			throw new RuntimeException("Order Cannot Be cancelled At This Time");
		}

		order.setStatus(OrderStatus.CANCELLED);

		orderRepo.save(order);

		ResponseStructure<String> response = new ResponseStructure<>();

		response.setStatuscode(HttpStatus.OK.value());
		response.setMessage("Order cancelled successfully");
		response.setData("Cancelled");

		return new ResponseEntity<ResponseStructure<String>>(response, HttpStatus.OK);
	}

	// GET ORDER BY STATUS
	public ResponseEntity<ResponseStructure<List<Orders>>> getOrderByStatus(OrderStatus status) {

		List<Orders> list = orderRepo.findByStatus(status);

		if (list.isEmpty()) {
			throw new ResourceNotFoundException("No orders found with this status");
		}

		ResponseStructure<List<Orders>> response = new ResponseStructure<>();

		response.setStatuscode(HttpStatus.OK.value());
		response.setMessage("Orders fetched by status");
		response.setData(list);

		return new ResponseEntity<ResponseStructure<List<Orders>>>(response, HttpStatus.OK);
	}

	// GET ORDER BY DATE
	public ResponseEntity<ResponseStructure<List<Orders>>> getOrderByDate(LocalDate date) {

		List<Orders> list = orderRepo.findByOrderDateTime(date);

		if (list.isEmpty()) {
			throw new ResourceNotFoundException("No orders found on this date");
		}

		ResponseStructure<List<Orders>> response = new ResponseStructure<>();

		response.setStatuscode(HttpStatus.OK.value());
		response.setMessage("Orders fetched by date");
		response.setData(list);

		return new ResponseEntity<ResponseStructure<List<Orders>>>(response, HttpStatus.OK);
	}

	//  GET ORDERS BY RESTAURANT
	public ResponseEntity<ResponseStructure<List<Orders>>> getOrdersPlacedForParticularRestaurant(Integer resId) {

		List<Orders> list = orderRepo.findByOrderitems_Menuitem_Restaurant_ResId(resId);

		if (list.isEmpty()) {
			throw new ResourceNotFoundException("No orders found for this restaurant");
		}

		ResponseStructure<List<Orders>> response = new ResponseStructure<>();

		response.setStatuscode(HttpStatus.OK.value());
		response.setMessage("Orders fetched for restaurant");
		response.setData(list);

		return new ResponseEntity<ResponseStructure<List<Orders>>>(response, HttpStatus.OK);
	}

	// GET ORDERS IN PRICE RANGE
	public ResponseEntity<ResponseStructure<List<Orders>>> getOrdersInPriceRange(Double min, Double max) {

		List<Orders> list = orderRepo.findByTotalAmountBetween(min, max);

		if (list.isEmpty()) {
			throw new ResourceNotFoundException("No orders found in this range");
		}

		ResponseStructure<List<Orders>> response = new ResponseStructure<>();

		response.setStatuscode(HttpStatus.OK.value());
		response.setMessage("Orders fetched in price range");
		response.setData(list);

		return new ResponseEntity<ResponseStructure<List<Orders>>>(response, HttpStatus.OK);
	}
}
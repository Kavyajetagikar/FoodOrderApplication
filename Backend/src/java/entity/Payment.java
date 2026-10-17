package jsp.food_order.FOOD_ORDER_APP.entity;


import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.OneToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class Payment {

	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer paymentId;
	
	
	@Enumerated(EnumType.STRING)
	private PaymentMethod paymentmethod;

	@Enumerated(EnumType.STRING)
	private PaymentStatus paymentstatus;
	
	private Double amount;
	
	@JsonIgnore
	@OneToOne(mappedBy="payment",cascade=CascadeType.ALL)
	private Orders order;

}
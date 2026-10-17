package jsp.food_order.FOOD_ORDER_APP.entity;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class OrderItem {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	 private Integer orderItemsId;
	 
	 private Integer quantity;
	 private Double subtotal;
	 
	 @JoinColumn
	 @ManyToOne
	 private MenuItem menuitem;
	 
	 @JsonIgnore
	 @JoinColumn
	 @ManyToOne
	 private Orders orders;
}

package jsp.food_order.FOOD_ORDER_APP.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
import lombok.AllArgsConstructor;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;

@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Entity
public class MenuItem {
	
	@Id
	@GeneratedValue(strategy=GenerationType.IDENTITY)
	private Integer itemId;
	
	private String itemName;
	private Integer price;
    private Boolean availability;
	
    @JoinColumn
	@ManyToOne
    private Restaurant restaurant; 
   
    @JsonIgnore
    @OneToMany(mappedBy="menuitem",cascade=CascadeType.ALL)
	private List<OrderItem> orderitems;
}

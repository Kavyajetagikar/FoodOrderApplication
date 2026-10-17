package jsp.food_order.FOOD_ORDER_APP.entity;

import java.util.List;

import com.fasterxml.jackson.annotation.JsonIgnore;

import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
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
public class Restaurant {
	
	 @Id
	 @GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer resId;
	
	private String restaurantName;
	private String location;
	private Double rating;

	@JsonIgnore
	@OneToMany(mappedBy = "restaurant",cascade=CascadeType.ALL)
	private List<MenuItem> menuitems;

}

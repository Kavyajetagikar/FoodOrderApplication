package jsp.food_order.FOOD_ORDER_APP.entity;

import java.time.LocalDate;
import java.util.List;

import org.hibernate.annotations.CreationTimestamp;


import jakarta.persistence.CascadeType;
import jakarta.persistence.Entity;
import jakarta.persistence.EnumType;
import jakarta.persistence.Enumerated;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.OneToMany;
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
public class Orders {
	@Id
	@GeneratedValue(strategy = GenerationType.IDENTITY)
	private Integer orderId;

	@CreationTimestamp
	private LocalDate orderDateTime;

	@Enumerated(EnumType.STRING)
    private OrderStatus status;

    private Double totalAmount;
    
    @JoinColumn
    @ManyToOne
    private Customer customer;
    
    @OneToMany(mappedBy="orders" ,cascade=CascadeType.ALL)
    private List<OrderItem> orderitems;
    
    @JoinColumn
    @OneToOne(cascade = CascadeType.ALL)
    private Payment payment;
    
    
}

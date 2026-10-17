package jsp.food_order.FOOD_ORDER_APP.dto;

import lombok.Getter;
import lombok.Setter;

@Getter
@Setter
public class ResponseStructure <T>{
	private int statuscode;
	private String message;
	private T data;

}

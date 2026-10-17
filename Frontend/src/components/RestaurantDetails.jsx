import {
    useEffect,
    useState
} from "react";

import {
    useParams,
    Link
} from "react-router-dom";

import {
    getAllMenuItems
} from "../api/menuApi";

import {
    useCart
} from "../context/CartContext";

import api from "../api/axios";


function RestaurantDetails() {

    const { id } = useParams();

    const {
        addToCart
    } = useCart();

    const [restaurant, setRestaurant] =
        useState(null);

    const [menuItems, setMenuItems] =
        useState([]);

    const [loading, setLoading] =
        useState(true);


    useEffect(() => {

        loadData();

    }, [id]);


    const loadData = async () => {

        try {

            setLoading(true);

            // =========================
            // GET RESTAURANT
            // =========================

            const restaurantResponse =
                await api.get(`/restaurant/${id}`);

            setRestaurant(
                restaurantResponse.data.data
            );


            // =========================
            // GET ALL MENU ITEMS
            // =========================

            const menuResponse =
                await getAllMenuItems();

            const allItems =
                menuResponse || [];


            // =========================
            // FILTER MENU ITEMS
            // FOR THIS RESTAURANT
            // =========================

            const restaurantItems =
                allItems.filter((item) => {

                    return (
                        item.restaurant &&
                        Number(
                            item.restaurant.restaurantId
                        ) === Number(id)
                    );

                });


            setMenuItems(
                restaurantItems
            );


        } catch (error) {

            console.error(
                "Failed to load restaurant",
                error
            );

        } finally {

            setLoading(false);

        }

    };


    // =========================
    // LOADING
    // =========================

    if (loading) {

        return (

            <div className="page-container">

                <h2>
                    Loading restaurant...
                </h2>

            </div>

        );

    }


    // =========================
    // RESTAURANT NOT FOUND
    // =========================

    if (!restaurant) {

        return (

            <div className="page-container">

                <div className="empty-state">

                    <div className="empty-state-icon">
                        😕
                    </div>

                    <h2>
                        Restaurant not found
                    </h2>

                    <Link to="/restaurants">

                        <button className="primary-btn">
                            Back to Restaurants
                        </button>

                    </Link>

                </div>

            </div>

        );

    }


    return (

        <div className="page-container">


            {/* =========================
                RESTAURANT HEADER
            ========================= */}

            <div className="restaurant-header">

                <div className="restaurant-header-top">

                    <div>

                        <h1>
                            {restaurant.restaurantName}
                        </h1>


                        <p className="restaurant-location">
                            📍 {restaurant.location}
                        </p>


                        <p className="restaurant-rating">
                            ⭐ {restaurant.rating}
                        </p>


                        {/* ADD MENU ITEM */}

                        <Link
                            to={`/restaurant/${id}/add-menu`}
                        >

                            <button className="primary-btn">
                                + Add Menu Item
                            </button>

                        </Link>

                    </div>

                </div>

            </div>


            {/* =========================
                MENU
            ========================= */}

            <h2 className="menu-title">
                Menu
            </h2>


            {menuItems.length === 0 ? (

                <div className="empty-state">

                    <div className="empty-state-icon">
                        🍽️
                    </div>

                    <h2>
                        No menu items yet
                    </h2>

                    <p>
                        This restaurant has not added
                        any menu items.
                    </p>


                    <Link
                        to={`/restaurant/${id}/add-menu`}
                    >

                        <button className="primary-btn">
                            + Add First Menu Item
                        </button>

                    </Link>

                </div>

            ) : (

                <div className="menu-grid">

                    {menuItems.map((item) => (

                        <div
                            className="menu-card"
                            key={item.menuItemId}
                        >

                            <div className="menu-icon">
                                🍛
                            </div>


                            <div className="menu-info">

                                <div className="menu-name">
                                    {item.itemName}
                                </div>


                                <div className="menu-price">
                                    ₹{item.price}
                                </div>


                                {item.availability ? (

                                    <div className="available">
                                        ● Available
                                    </div>

                                ) : (

                                    <div className="unavailable">
                                        ● Currently unavailable
                                    </div>

                                )}


                                <button
                                    className="add-cart-btn"
                                    disabled={!item.availability}
                                    onClick={() =>
                                        addToCart(item)
                                    }
                                >

                                    {item.availability
                                        ? "🛒 Add to Cart"
                                        : "Unavailable"
                                    }

                                </button>

                            </div>

                        </div>

                    ))}

                </div>

            )}

        </div>

    );

}


export default RestaurantDetails;
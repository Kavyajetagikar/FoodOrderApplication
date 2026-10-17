import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";

import { getAllRestaurants } from "../api/restaurantApi";

function Restaurants() {

    const [restaurants, setRestaurants] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {

        loadRestaurants();

    }, []);


    const loadRestaurants = async () => {

        try {

            const response =
                await getAllRestaurants();

            console.log(
                "Restaurant response:",
                response.data
            );

            setRestaurants(
                response.data.data || []
            );

        } catch (error) {

            console.error(
                "Error loading restaurants:",
                error
            );

            setError(
                "Unable to load restaurants"
            );

        } finally {

            setLoading(false);

        }

    };


    if (loading) {

        return (
            <>
                <Navbar />

                <div className="loading">
                    Loading restaurants...
                </div>
            </>
        );

    }


    return (

        <>

            <Navbar />

            <main className="restaurants-page">

                <div className="restaurants-header">

                    <h1>
                        Restaurants
                    </h1>

                    <p>
                        Discover your favourite restaurants
                    </p>

                </div>


                {error && (

                    <div className="error-message">
                        {error}
                    </div>

                )}


                <div className="restaurant-grid">

                    {restaurants.map(
                        (restaurant) => (

                            <div
                                className="restaurant-card"
                                key={restaurant.resId}
                            >

                                <div className="restaurant-image">

                                    🍛

                                </div>


                                <div className="restaurant-info">

                                    <h2>
                                        {
                                            restaurant.restaurantName
                                        }
                                    </h2>


                                    <p>
                                        📍{" "}
                                        {
                                            restaurant.location
                                        }
                                    </p>


                                    <p>
                                        ⭐{" "}
                                        {
                                            restaurant.rating
                                        }
                                    </p>


                                    {/* IMPORTANT */}

                                    <Link
                                        to={`/restaurant/${restaurant.resId}`}
                                        className="view-menu-btn"
                                    >
                                        View Menu →
                                    </Link>

                                </div>

                            </div>

                        )
                    )}

                </div>

            </main>

        </>

    );

}

export default Restaurants;
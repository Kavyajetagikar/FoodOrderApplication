// src/data/mockData.js

export const CUISINES = [
    { id: "all", name: "All Foods", icon: "🍽️" },
    { id: "pizza", name: "Pizzas", icon: "🍕" },
    { id: "burger", name: "Burgers", icon: "🍔" },
    { id: "biryani", name: "Biryani & Indian", icon: "🍛" },
    { id: "chinese", name: "Chinese & Asian", icon: "🍜" },
    { id: "desserts", name: "Desserts & Cakes", icon: "🍰" },
    { id: "beverages", name: "Drinks & Shakes", icon: "🥤" },
    { id: "healthy", name: "Salads & Healthy", icon: "🥗" }
];

export const COUPONS = [
    {
        code: "FOODIE50",
        discountPercent: 50,
        maxDiscount: 120,
        minOrder: 199,
        description: "50% OFF up to ₹120 on orders above ₹199"
    },
    {
        code: "WELCOME20",
        discountPercent: 20,
        maxDiscount: 80,
        minOrder: 149,
        description: "20% OFF up to ₹80 on your order"
    },
    {
        code: "SUPERFEST",
        discountPercent: 30,
        maxDiscount: 150,
        minOrder: 299,
        description: "30% OFF up to ₹150 for Foodie Fest"
    },
    {
        code: "FREEDEL",
        discountPercent: 0,
        flatDiscount: 40,
        minOrder: 99,
        description: "Free Delivery coupon (Save ₹40)"
    }
];

export const INITIAL_RESTAURANTS = [
    {
        resId: 1,
        restaurantName: "The Royal Spice Hub",
        location: "MG Road, Central Market",
        rating: 4.8,
        ratingCount: 1420,
        deliveryTime: "25-30 min",
        distance: "2.1 km",
        priceForTwo: "₹400 for two",
        cuisine: "North Indian, Biryani, Mughlai",
        tags: ["biryani", "north indian"],
        image: "https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=600&auto=format&fit=crop&q=80",
        offer: "50% OFF up to ₹100",
        isPureVeg: false,
        isOpen: true,
        menu: [
            {
                menuItemId: 101,
                itemName: "Hyderabadi Dum Biryani",
                price: 280,
                rating: 4.9,
                isVeg: false,
                category: "Biryani & Indian",
                description: "Fragrant basmati rice layered with spiced marinated chicken and slow-cooked in traditional dum style.",
                image: "https://images.unsplash.com/photo-1563379091339-03b21ab4a4f8?w=500&auto=format&fit=crop&q=80",
                availability: true,
                badge: "Bestseller"
            },
            {
                menuItemId: 102,
                itemName: "Butter Chicken Supreme",
                price: 320,
                rating: 4.8,
                isVeg: false,
                category: "Biryani & Indian",
                description: "Tender tandoori chicken simmered in rich creamy tomato and butter gravy topped with fresh cream.",
                image: "https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=500&auto=format&fit=crop&q=80",
                availability: true,
                badge: "Must Try"
            },
            {
                menuItemId: 103,
                itemName: "Paneer Butter Masala",
                price: 250,
                rating: 4.7,
                isVeg: true,
                category: "Biryani & Indian",
                description: "Soft cottage cheese cubes cooked in a velvety spiced onion-tomato and cashew gravy.",
                image: "https://images.unsplash.com/photo-1631452180519-c014fe946bc7?w=500&auto=format&fit=crop&q=80",
                availability: true,
                badge: "Popular"
            },
            {
                menuItemId: 104,
                itemName: "Garlic Butter Naan (2 pcs)",
                price: 90,
                rating: 4.6,
                isVeg: true,
                category: "Breads",
                description: "Oven-baked leavened flatbread brushed generously with roasted garlic butter and cilantro.",
                image: "https://images.unsplash.com/photo-1601050690597-df0568f70950?w=500&auto=format&fit=crop&q=80",
                availability: true
            },
            {
                menuItemId: 105,
                itemName: "Gulab Jamun (3 pcs)",
                price: 110,
                rating: 4.9,
                isVeg: true,
                category: "Desserts & Cakes",
                description: "Warm golden milk-solid dumplings soaked in cardamom infused rose water sugar syrup.",
                image: "https://images.unsplash.com/photo-1541832676-9b763b0239ab?w=500&auto=format&fit=crop&q=80",
                availability: true
            }
        ]
    },
    {
        resId: 2,
        restaurantName: "Crust & Crust Pizzeria",
        location: "Indiranagar, 100ft Road",
        rating: 4.7,
        ratingCount: 980,
        deliveryTime: "30-35 min",
        distance: "3.4 km",
        priceForTwo: "₹500 for two",
        cuisine: "Pizzas, Italian, Pastas",
        tags: ["pizza", "italian"],
        image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?w=600&auto=format&fit=crop&q=80",
        offer: "40% OFF with code WELCOME20",
        isPureVeg: false,
        isOpen: true,
        menu: [
            {
                menuItemId: 201,
                itemName: "Classic Margherita Pizza",
                price: 299,
                rating: 4.8,
                isVeg: true,
                category: "Pizzas",
                description: "Hand-stretched sourdough base with San Marzano tomato sauce, fresh mozzarella, and sweet basil.",
                image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?w=500&auto=format&fit=crop&q=80",
                availability: true,
                badge: "Bestseller"
            },
            {
                menuItemId: 202,
                itemName: "Pepperoni & Cheese Feast",
                price: 449,
                rating: 4.9,
                isVeg: false,
                category: "Pizzas",
                description: "Loaded with smoky chicken pepperoni slices, gooey mozzarella blend and chili flakes.",
                image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?w=500&auto=format&fit=crop&q=80",
                availability: true,
                badge: "Chef's Special"
            },
            {
                menuItemId: 203,
                itemName: "Cheesy Garlic Breadsticks",
                price: 169,
                rating: 4.6,
                isVeg: true,
                category: "Starters",
                description: "Warm pull-apart bread filled with herb garlic butter and melted cheddar mozzarella blend.",
                image: "https://images.unsplash.com/photo-1619881589947-f58c70757d54?w=500&auto=format&fit=crop&q=80",
                availability: true
            },
            {
                menuItemId: 204,
                itemName: "Creamy Alfredo Penne",
                price: 319,
                rating: 4.5,
                isVeg: true,
                category: "Pastas",
                description: "Penne pasta tossed in a velvety parmesan cream sauce with sauteed mushrooms and bell peppers.",
                image: "https://images.unsplash.com/photo-1621996346565-e3d5d628169a?w=500&auto=format&fit=crop&q=80",
                availability: true
            },
            {
                menuItemId: 205,
                itemName: "Choco Lava Cake",
                price: 139,
                rating: 4.9,
                isVeg: true,
                category: "Desserts & Cakes",
                description: "Decadent warm chocolate sponge with a luscious molten dark chocolate center.",
                image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?w=500&auto=format&fit=crop&q=80",
                availability: true
            }
        ]
    },
    {
        resId: 3,
        restaurantName: "Burger Bistro & Shakes",
        location: "Koramangala 5th Block",
        rating: 4.6,
        ratingCount: 1120,
        deliveryTime: "20-25 min",
        distance: "1.8 km",
        priceForTwo: "₹350 for two",
        cuisine: "Burgers, Fast Food, Shakes",
        tags: ["burger", "beverages"],
        image: "https://images.unsplash.com/photo-1550547660-d9450f859349?w=600&auto=format&fit=crop&q=80",
        offer: "Flat ₹50 OFF",
        isPureVeg: false,
        isOpen: true,
        menu: [
            {
                menuItemId: 301,
                itemName: "Double Smash Cheesy Burger",
                price: 249,
                rating: 4.9,
                isVeg: false,
                category: "Burgers",
                description: "Two crispy grilled patties smashed with caramelized onions, American cheddar, and signature house relish.",
                image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&auto=format&fit=crop&q=80",
                availability: true,
                badge: "Top Rated"
            },
            {
                menuItemId: 302,
                itemName: "Crispy Peri Peri Paneer Burger",
                price: 199,
                rating: 4.6,
                isVeg: true,
                category: "Burgers",
                description: "Golden crispy cottage cheese patty seasoned with African peri-peri spices, lettuce, and jalapeño mayo.",
                image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?w=500&auto=format&fit=crop&q=80",
                availability: true
            },
            {
                menuItemId: 303,
                itemName: "Peri Peri Crinkle Fries",
                price: 129,
                rating: 4.7,
                isVeg: true,
                category: "Sides",
                description: "Golden potato crinkle fries dusted with zesty peri-peri seasoning, served with garlic dip.",
                image: "https://images.unsplash.com/photo-1573080496219-bb080dd4f877?w=500&auto=format&fit=crop&q=80",
                availability: true
            },
            {
                menuItemId: 304,
                itemName: "Thick Belgian Chocolate Shake",
                price: 179,
                rating: 4.8,
                isVeg: true,
                category: "Drinks & Shakes",
                description: "Ultra-thick milkshake blended with rich Belgian chocolate ganache and chocolate chips.",
                image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?w=500&auto=format&fit=crop&q=80",
                availability: true
            }
        ]
    },
    {
        resId: 4,
        restaurantName: "Dragon Wok Asian Kitchen",
        location: "Whitefield Main Road",
        rating: 4.5,
        ratingCount: 750,
        deliveryTime: "30-40 min",
        distance: "4.2 km",
        priceForTwo: "₹450 for two",
        cuisine: "Chinese, Pan-Asian, Noodles",
        tags: ["chinese"],
        image: "https://images.unsplash.com/photo-1541696432-82c6da8ce7bf?w=600&auto=format&fit=crop&q=80",
        offer: "Free Spring Rolls on ₹399",
        isPureVeg: false,
        isOpen: true,
        menu: [
            {
                menuItemId: 401,
                itemName: "Hakka Noodles with Chili Chicken",
                price: 299,
                rating: 4.8,
                isVeg: false,
                category: "Chinese & Asian",
                description: "Wok-tossed egg noodles with julienned vegetables served alongside spicy crispy chicken in soy chili sauce.",
                image: "https://images.unsplash.com/photo-1585032226651-759b368d7246?w=500&auto=format&fit=crop&q=80",
                availability: true,
                badge: "Popular Combo"
            },
            {
                menuItemId: 402,
                itemName: "Veg Schezwan Fried Rice",
                price: 220,
                rating: 4.6,
                isVeg: true,
                category: "Chinese & Asian",
                description: "Aromatic jasmine rice stir-fried in authentic spicy red Schezwan chili paste and spring onions.",
                image: "https://images.unsplash.com/photo-1603133872878-684f208fb84b?w=500&auto=format&fit=crop&q=80",
                availability: true
            },
            {
                menuItemId: 403,
                itemName: "Steamed Dim Sums (6 pcs)",
                price: 189,
                rating: 4.7,
                isVeg: true,
                category: "Starters",
                description: "Translucent dumplings stuffed with finely minced exotic vegetables and water chestnuts.",
                image: "https://images.unsplash.com/photo-1496116218417-1a781b1c416c?w=500&auto=format&fit=crop&q=80",
                availability: true
            }
        ]
    },
    {
        resId: 5,
        restaurantName: "Green Bowl Clean Eats",
        location: "HSR Layout Sector 2",
        rating: 4.8,
        ratingCount: 620,
        deliveryTime: "20-30 min",
        distance: "2.5 km",
        priceForTwo: "₹380 for two",
        cuisine: "Healthy, Salads, Smoothies",
        tags: ["healthy", "beverages"],
        image: "https://images.unsplash.com/photo-1540420773420-3366772f4999?w=600&auto=format&fit=crop&q=80",
        offer: "20% OFF Healthy Picks",
        isPureVeg: true,
        isOpen: true,
        menu: [
            {
                menuItemId: 501,
                itemName: "Mediterranean Quinoa Salad Bowl",
                price: 260,
                rating: 4.9,
                isVeg: true,
                category: "Salads & Healthy",
                description: "Nutty quinoa, cherry tomatoes, kalamata olives, diced cucumbers, and feta with lemon herb dressing.",
                image: "https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&auto=format&fit=crop&q=80",
                availability: true,
                badge: "Health Favorite"
            },
            {
                menuItemId: 502,
                itemName: "Avocado & Grilled Paneer Toast",
                price: 210,
                rating: 4.7,
                isVeg: true,
                category: "Salads & Healthy",
                description: "Artisanal multigrain sourdough topped with creamy smashed avocado, spiced cottage cheese and chia seeds.",
                image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?w=500&auto=format&fit=crop&q=80",
                availability: true
            },
            {
                menuItemId: 503,
                itemName: "Tropical Berry Acai Smoothie",
                price: 170,
                rating: 4.8,
                isVeg: true,
                category: "Drinks & Shakes",
                description: "Cold-pressed blend of blueberries, acai berries, Greek yogurt, chia seeds, and honey.",
                image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?w=500&auto=format&fit=crop&q=80",
                availability: true
            }
        ]
    },
    {
        resId: 6,
        restaurantName: "Sweet Tooth Patisserie",
        location: "Brigade Road, Commercial Area",
        rating: 4.9,
        ratingCount: 1650,
        deliveryTime: "15-25 min",
        distance: "1.2 km",
        priceForTwo: "₹300 for two",
        cuisine: "Desserts, Bakery, Cakes",
        tags: ["desserts"],
        image: "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=600&auto=format&fit=crop&q=80",
        offer: "Buy 1 Get 1 on Cupcakes",
        isPureVeg: true,
        isOpen: true,
        menu: [
            {
                menuItemId: 601,
                itemName: "Signature Red Velvet Cheesecake",
                price: 220,
                rating: 5.0,
                isVeg: true,
                category: "Desserts & Cakes",
                description: "Layers of moist crimson cocoa cake baked with decadent New York style cream cheese frosting.",
                image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?w=500&auto=format&fit=crop&q=80",
                availability: true,
                badge: "Chef's Award"
            },
            {
                menuItemId: 602,
                itemName: "Nutella Hazelnut Waffle",
                price: 199,
                rating: 4.8,
                isVeg: true,
                category: "Desserts & Cakes",
                description: "Freshly pressed Belgian waffle smothered in original Nutella spread and roasted hazelnut crumbs.",
                image: "https://images.unsplash.com/photo-1562376552-0d160a2f238d?w=500&auto=format&fit=crop&q=80",
                availability: true
            },
            {
                menuItemId: 603,
                itemName: "Iced Caramel Macchiato",
                price: 150,
                rating: 4.7,
                isVeg: true,
                category: "Drinks & Shakes",
                description: "Freshly brewed espresso shots layered with cold whole milk, vanilla syrup, and salted caramel drizzle.",
                image: "https://images.unsplash.com/photo-1517701550927-30cf4ba1dba5?w=500&auto=format&fit=crop&q=80",
                availability: true
            }
        ]
    }
];

export const INITIAL_ORDERS = [
    {
        orderId: 1001,
        orderDateTime: "Today, 08:30 PM",
        status: "PREPARING",
        restaurantName: "The Royal Spice Hub",
        totalAmount: 690,
        deliveryAddress: "Flat 402, Sunshine Heights, MG Road",
        orderitems: [
            {
                orderItemsId: 1,
                quantity: 2,
                subtotal: 560,
                menuitem: {
                    itemName: "Hyderabadi Dum Biryani",
                    price: 280
                }
            },
            {
                orderItemsId: 2,
                quantity: 1,
                subtotal: 130,
                menuitem: {
                    itemName: "Gulab Jamun (3 pcs)",
                    price: 130
                }
            }
        ]
    },
    {
        orderId: 1002,
        orderDateTime: "Yesterday, 01:15 PM",
        status: "DELIVERED",
        restaurantName: "Crust & Crust Pizzeria",
        totalAmount: 468,
        deliveryAddress: "Flat 402, Sunshine Heights, MG Road",
        orderitems: [
            {
                orderItemsId: 3,
                quantity: 1,
                subtotal: 299,
                menuitem: {
                    itemName: "Classic Margherita Pizza",
                    price: 299
                }
            },
            {
                orderItemsId: 4,
                quantity: 1,
                subtotal: 169,
                menuitem: {
                    itemName: "Cheesy Garlic Breadsticks",
                    price: 169
                }
            }
        ]
    }
];

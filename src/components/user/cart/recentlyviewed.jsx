import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import img1 from "../../Images/img1.jpg";
import img2 from "../../Images/img2.jpg";
import img3 from "../../Images/img3.jpg";
import img4 from "../../Images/img4.jpg";

const RecentlyViewed = () => {
  const navigate = useNavigate();
  const [cart, setCart] = useState(() => {
    const savedCart = localStorage.getItem("cart");
    return savedCart ? JSON.parse(savedCart) : [];
  });
  const [showLoginDialog, setShowLoginDialog] = useState(false);
  const [showAddAnimation, setShowAddAnimation] = useState(false);

  const products = [
    { id: 1, name: "Customized Journal", price: 199, image: img1 },
    { id: 2, name: "Floral Greeting Card Set", price: 289, image: img2 },
    { id: 3, name: "Premium Leather Diary", price: 289, image: img3 },
    { id: 4, name: "Eco-Friendly Pen Pack", price: 289, image: img4 },
  ];

  const handleAddToCart = async (product) => {
    const userId = sessionStorage.getItem("userId");

    // Check if user is logged in
    if (!userId) {
      setShowLoginDialog(true);
      return;
    }

    // Add product to cart logic
    try {
      const response = await fetch(
        "https://ecommercebackend-8gx8.onrender.com/add-to-cart",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            userId,
            productId: product.id,
            quantity: 1,
          }),
        }
      );

      const data = await response.json();

      if (data.success && data.message === "Product added to cart successfully") {
        setShowAddAnimation(true);

        // Temporarily show the animation
        setTimeout(() => {
          setShowAddAnimation(false);
          toast(
            <div
              className="flex items-center cursor-pointer"
              onClick={() => navigate("/cart")}
            >
              Go to Cart →
            </div>,
            {
              position: "top-right",
              autoClose: 5000,
              hideProgressBar: false,
              closeOnClick: true,
              pauseOnHover: true,
              draggable: true,
            }
          );
        }, 1500);
      }
    } catch (error) {
      console.error("Error adding to cart:", error);
      toast.error("Failed to add item to cart");
    }
  };

  return (
    <div className="bg-pink-100 p-4 md:p-6">
      <ToastContainer />
      <AnimatePresence>
        {showLoginDialog && (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50"
          >
            <div className="bg-white p-8 rounded-lg shadow-xl max-w-md w-full">
              <h2 className="text-2xl font-bold mb-4">
                Oops! You're not logged in
              </h2>
              <p className="mb-6">Please login to add products to your cart</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setShowLoginDialog(false)}
                  className="px-4 py-2 text-gray-600 hover:text-gray-800"
                >
                  Cancel
                </button>
                <button
                  onClick={() => navigate("/login")}
                  className="px-6 py-2 bg-pink-600 text-white rounded-lg hover:bg-pink-700"
                >
                  Login
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <AnimatePresence>
        {showAddAnimation && (
          <motion.div
            initial={{ y: -100, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            exit={{ y: 100, opacity: 0 }}
            className="fixed top-20 left-1/2 transform -translate-x-1/2 bg-white p-4 rounded-lg shadow-lg z-50"
          >
            <div className="flex items-center space-x-2">
              <motion.div
                animate={{ y: [0, 20, 0], rotate: [0, 360] }}
                transition={{ duration: 1, repeat: 1 }}
                className="w-8 h-8 bg-pink-600 rounded-full"
              />
              <span className="font-medium">Item added to cart!</span>
            </div>
          </motion.div>
        )}
      </AnimatePresence>

      <h3 className="text-lg md:text-xl font-semibold mb-4">
        Recently Viewed Products
      </h3>
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 gap-4">
        {products.map((product) => (
          <div
            key={product.id}
            className="bg-white p-4 shadow-sm rounded-md flex flex-col items-center transition-transform transform hover:scale-105 hover:shadow-lg duration-200"
          >
            <div className="w-20 h-20 md:w-24 md:h-24 bg-gray-300 rounded-md mb-2">
              <img
                src={product.image}
                alt={product.name}
                className="w-full h-full object-cover rounded-md"
              />
            </div>
            <h4 className="font-medium text-sm md:text-base">{product.name}</h4>
            <p className="text-gray-500 text-xs md:text-sm">
              ₹̶𝟺̶𝟶̶𝟶̶ Rs. {product.price}
            </p>
            <button
              onClick={() => handleAddToCart(product)}
              className="mt-2 bg-pink-500 text-white px-4 py-2 rounded-md hover:bg-pink-600 transition-all duration-300"
            >
              Add to Cart
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default RecentlyViewed;

import React, { useState, useEffect } from 'react';
import { FaFacebook, FaInstagram, FaTwitter } from 'react-icons/fa';
import Navbar from '../../components/user/navbar/navbar';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';
import { Helmet } from "react-helmet";

const Shop = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [filteredProducts, setFilteredProducts] = useState([]);
  const [sortedProducts, setSortedProducts] = useState([]);
  const [loadMore, setLoadMore] = useState(6);
  const [products, setProducts] = useState([]);

  const categories = [
    {
      name: 'Books',
      img: "https://tse2.mm.bing.net/th?id=OIP.uyi1Q5l2H8Zf9APJQplJfQHaEK&pid=Api&P=0&h=180",
    },
    {
      name: 'Gift Boxes',
      img: "http://images4.fanpop.com/image/photos/22200000/Christmas-gifts-christmas-gifts-22231235-2048-2048.jpg",
    },
    {
      name: 'Stationery', 
      img: "https://tse1.mm.bing.net/th?id=OIP.UCpcTmMMOdXTF6WAhtD94QHaH0&pid=Api&P=0&h=180",
    },
  ];

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        const response = await fetch('https://ecommercebackend-8gx8.onrender.com/get-product');
        const data = await response.json();
        if (data.success) {
          const validProducts = data.products.filter(product => 
            product.name && 
            product.price && 
            product.img && 
            product.category &&
            product._id &&
            product.visibility === "on"
          );
          setProducts(validProducts);
          setSortedProducts(validProducts);
        }
      } catch (error) {
        console.error('Error fetching products:', error);
      }
    };

    fetchProducts();
  }, []);

  const filterProducts = (category) => {
    if (category === 'all') {
      setFilteredProducts(products);
    } else {
      const filtered = products.filter(product => product.category === category);
      setFilteredProducts(filtered);
    }
  };

  const sortProducts = (sortBy) => {
    let sorted = [...products];
    switch (sortBy) {
      case 'price':
        sorted.sort((a, b) => {
          const priceA = parseFloat(a.price.split('₹')[2]?.trim() || 0);
          const priceB = parseFloat(b.price.split('₹')[2]?.trim() || 0);
          return priceA - priceB;
        });
        break;
      case 'popularity':
      case 'rating':
        sorted.sort((a, b) => (b.rating || 0) - (a.rating || 0));
        break;
      default:
        break;
    }
    setSortedProducts(sorted);
  };

  const handleLoadMore = () => {
    setLoadMore(prevLoadMore => prevLoadMore + 6);
  };

  const handleShowLess = () => {
    setLoadMore(6);
  };

  return (  
    <>
    <Helmet>
      <title>Shop | Surprise Me</title>
    </Helmet>
    <div className="bg-pink-100">
      <div className="relative">
        <Navbar />
      </div>
      <section
        className="bg-cover bg-center py-24 text-center mt-1"
        style={{
          backgroundImage: "url('src/assets/bg shop.png')",
        }}
      >
        <h2 className="text-5xl font-bold text-black">SHOP BY CATEGORY</h2>
        <p className="text-gray-800 mt-4 text-lg">
          Discover our exclusive collections tailored just for you.
        </p>
      </section>

      <div className="max-w-7xl mx-auto p-4">
        <h3 className="text-3xl font-bold mb-4 text-center">Categories</h3>
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-3 gap-6">
          {categories.map((category, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-lg shadow-lg overflow-hidden cursor-pointer hover:shadow-xl"
              whileHover={{ scale: 1.05 }}
              onClick={() => filterProducts(category.name)}
            >
              <div
                className="h-48 bg-cover bg-center"
                style={{ backgroundImage: `url('${category.img}')` }}
              ></div>
              <div className="p-4 text-center">
                <p className="text-gray-500 text-sm">Lorem Ipsum</p>
                <h4 className="text-xl font-bold text-black">{category.name}</h4>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="flex justify-between items-center mb-4">
          <span>Showing 1 - {Math.min(loadMore, sortedProducts.length)} of {sortedProducts.length} results</span>
          <div className="flex gap-4 items-center">
            <button className="bg-gray-200 px-4 py-2 rounded" onClick={() => filterProducts('all')}>All Products</button>
            <div>
              <label htmlFor="sort" className="mr-2">Sort by</label>
              <select id="sort" className="border-gray-300 border px-2 py-1 rounded" onChange={(e) => sortProducts(e.target.value)}>
                <option value="price">Price</option>
                <option value="popularity">Popularity</option>
                <option value="rating">Rating</option>
              </select>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 border rounded ${viewMode === 'grid' ? 'bg-gray-300' : ''}`}
              >
                ▤
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 border rounded ${viewMode === 'list' ? 'bg-gray-300' : ''}`}
              >
                ☰
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <h3 className="text-3xl font-bold mb-4 text-center">Products</h3>
        <div
          className={`grid ${viewMode === 'grid' ? 'grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6' : 'grid-cols-1 gap-4'}`}
        >
          {(filteredProducts.length > 0 ? filteredProducts : sortedProducts)
            .slice(0, loadMore)
            .map((product) => (
              <motion.div
                key={product._id}
                className={`bg-white shadow-md rounded-md overflow-hidden hover:shadow-lg transition-shadow duration-300 ${
                  viewMode === 'list' ? 'flex' : ''
                }`}
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
                whileHover={{ scale: 1.05 }}
              >
                <Link to={`/${product._id}`} className={`${viewMode === 'list' ? 'w-1/3' : ''}`}>
                  <div
                    className={`${viewMode === 'list' ? 'h-full' : 'h-40'} bg-cover bg-center`}
                    style={{ backgroundImage: `url('${product.img}')` }}
                  />
                </Link>
                <div className={`p-4 ${viewMode === 'list' ? 'w-2/3' : ''} text-center`}>
                  <Link to={`/${product._id}`}>
                    <h4 className="font-bold text-lg hover:text-pink-500">{product.name}</h4>
                  </Link>
                  <p className="text-gray-600">{product.price}</p>
                  <div className="mt-2">
                    <span className="text-yellow-500">{'★'.repeat(Math.floor(product.rating))}</span>
                    <span className="text-gray-300">{'★'.repeat(5 - Math.floor(product.rating))}</span>
                    <span className="text-gray-600 ml-2">{product.rating}</span>
                  </div>
                </div>
              </motion.div>
            ))}
        </div>
        <div className="text-center mt-10">
          {loadMore < sortedProducts.length ? (
            <button className="bg-black text-white px-6 py-2 rounded-md" onClick={handleLoadMore}>
              Load More
            </button>
          ) : (
            <button className="bg-black text-white px-6 py-2 rounded-md" onClick={handleShowLess}>
              Show Less
            </button>
          )}
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white py-10 text-black mt-10">
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="flex flex-col items-center md:items-center">
            <h4 className="text-2xl font-bold">Surprise Me</h4>
            <div className="flex space-x-6 text-2xl mt-4">
              <FaFacebook className="cursor-pointer hover:text-pink-500" />
              <FaInstagram className="cursor-pointer hover:text-pink-500" />
              <FaTwitter className="cursor-pointer hover:text-pink-500" />
            </div>
          </div>
          <div className="text-center md:text-left">
            <p>
              Contact Information
              <br />
              3181 Street Name, City, India
            </p>
          </div>
        </div>
      </footer>
    </div>
    </>
  );
};

export default Shop;

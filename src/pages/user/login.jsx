import React, { useState } from "react";
import { FaGoogle, FaFacebook, FaTwitter, FaEye, FaEyeSlash } from "react-icons/fa";
import { useAuth } from '../../context/AuthContext';
import Navbar from "../../components/user/navbar/navbar";
import { Helmet } from "react-helmet";
import { GoogleLogin } from "@react-oauth/google"; // Import GoogleLogin
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css"; // Import toast styles

const Login = () => {
  const { login } = useAuth();
  const [emailOrMobile, setEmailOrMobile] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await login(emailOrMobile, password);
      if (response === 'Login successful') {
        window.location.href = '/';
      }
    } catch (error) {
      console.error('Login failed:', error);
      toast.error("Login failed. Please try again.");
    }
  };

  const handleGoogleLoginSuccess = async (response) => {
    console.log("Google login successful:", response);
    try {
      const res = await fetch("YOUR_BACKEND_API/google-login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: response.credential }),
      });
      const data = await res.json();

      if (data.success) {
        sessionStorage.setItem("userId", data.userId);
        toast.success("Login successful!");
        window.location.href = '/';
      } else {
        toast.error("Google login failed");
      }
    } catch (error) {
      console.error("Error during Google login:", error);
      toast.error("Error logging in with Google");
    }
  };

  const handleGoogleLoginFailure = (error) => {
    console.error("Google login failed:", error);
    toast.error("Google login failed. Please try again.");
  };

  return (
    <>
      <Helmet>
        <title>Login | Surprise me</title>
      </Helmet>
      <div className="min-h-screen bg-gradient-to-br from-pink-100 via-pink-200 to-pink-300 py-12 px-4 sm:px-6 lg:px-8 flex flex-col animate-fade-in">
        <div className="fixed top-0 left-0 w-full z-50">
          <Navbar />
        </div>
        <div className="flex-grow flex items-center justify-center mt-24 lg:mt-32">
          <div className="w-full max-w-md bg-white shadow-lg rounded-lg p-8 md:p-10 lg:max-w-lg lg:p-12 border-t-4 border-pink-500 animate-zoom-in">
            <h2 className="text-3xl font-bold mb-6 text-center text-gray-900 animate-text-focus-in lg:text-4xl">
              Login
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="mb-4">
                <label className="block text-lg text-gray-700">Email</label>
                <input
                  type="text"
                  className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                  value={emailOrMobile}
                  onChange={(e) => setEmailOrMobile(e.target.value)}
                />
              </div>
              <div className="mb-4 animate-fade-in-right">
                <label className="block text-lg text-gray-700">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="w-full px-4 py-2 mt-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-pink-500"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button
                    type="button"
                    className="absolute right-2 top-4 text-gray-700 hover:text-pink-500 transition-all"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <FaEyeSlash /> : <FaEye />}
                  </button>
                </div>
              </div>
              <button
                type="submit"
                className="w-full bg-pink-500 text-white py-2 rounded-md hover:bg-pink-600 transition-all duration-300 transform hover:scale-105 animate-bounce-on-hover text-lg lg:text-xl"
              >
                Login
              </button>
            </form>

            {/* Google Login Button */}
            <div className="mt-6 flex justify-center space-x-4">
              <GoogleLogin
                onSuccess={handleGoogleLoginSuccess}
                onError={handleGoogleLoginFailure}
                useOneTap
                theme="outline"
                shape="pill"
              />
            </div>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
};

export default Login;

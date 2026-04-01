import React from 'react';
import { Link, useNavigate } from 'react-router-dom';

const Navbar = () => {
  const navigate = useNavigate();
  const token = localStorage.getItem('token');

  const handleLogout = () => {
    localStorage.removeItem('token');
    navigate('/login');
  };

  return (
    <nav className="bg-blue-600 text-white px-6 py-4 flex justify-between items-center shadow-md">
      <Link to="/" className="text-2xl font-bold">
        ShopZone
      </Link>
      <div className="flex gap-4 items-center">
        <Link to="/products" className="hover:underline">Products</Link>
        <Link to="/orders" className="hover:underline">My Orders</Link>
        <Link to="/cart" className="hover:underline">Cart</Link>
        {token ? (
          <button
            onClick={handleLogout}
            className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100"
          >
            Logout
          </button>
        ) : (
          <Link
            to="/login"
            className="bg-white text-blue-600 px-4 py-1 rounded hover:bg-gray-100"
          >
            Login
          </Link>
        )}
      </div>
    </nav>
  );
};

export default Navbar;
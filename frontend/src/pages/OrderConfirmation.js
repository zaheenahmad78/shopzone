import React from 'react';
import { QRCodeSVG } from 'qrcode.react';
import { Link } from 'react-router-dom';

const OrderConfirmation = () => {
  const orderId = `ORD-${Date.now()}`;
  const orderDetails = {
    id: orderId,
    date: new Date().toLocaleDateString('en-IN'),
    items: [
      { name: 'Wireless Headphones', price: 2999, qty: 1 },
    ],
    total: 2999,
    status: 'Confirmed'
  };

  const qrData = `ShopZone Order: ${orderId} | Total: Rs.${orderDetails.total} | Date: ${orderDetails.date}`;

  return (
    <div className="max-w-2xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md p-8 text-center">
        <div className="text-green-500 text-6xl mb-4">✓</div>
        <h1 className="text-3xl font-bold text-gray-800 mb-2">Order Confirmed!</h1>
        <p className="text-gray-500 mb-6">Thank you for shopping with ShopZone</p>

        <div className="bg-gray-50 rounded-lg p-6 mb-6 text-left">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order Details</h2>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Order ID</span>
            <span className="font-semibold text-blue-600">{orderDetails.id}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Date</span>
            <span className="font-semibold">{orderDetails.date}</span>
          </div>
          <div className="flex justify-between mb-2">
            <span className="text-gray-500">Status</span>
            <span className="bg-green-100 text-green-800 px-3 py-1 rounded-full text-sm font-semibold">
              {orderDetails.status}
            </span>
          </div>
          <div className="border-t mt-4 pt-4">
            {orderDetails.items.map((item, i) => (
              <div key={i} className="flex justify-between mb-2">
                <span className="text-gray-600">{item.name} x{item.qty}</span>
                <span className="font-semibold">Rs.{item.price}</span>
              </div>
            ))}
            <div className="flex justify-between mt-2 text-lg font-bold">
              <span>Total</span>
              <span className="text-blue-600">Rs.{orderDetails.total}</span>
            </div>
          </div>
        </div>

        <div className="mb-6">
          <h2 className="text-lg font-semibold text-gray-800 mb-4">Order QR Code</h2>
          <p className="text-gray-500 text-sm mb-4">Scan this QR code to track your order</p>
          <div className="flex justify-center">
            <QRCodeSVG
              value={qrData}
              size={180}
              bgColor="#ffffff"
              fgColor="#1a1a2e"
              level="H"
            />
          </div>
        </div>

        <div className="flex gap-4 justify-center">
          <Link to="/" className="bg-blue-600 text-white px-6 py-3 rounded-lg hover:bg-blue-700 transition font-semibold">
            Continue Shopping
          </Link>
          <Link to="/orders" className="border border-blue-600 text-blue-600 px-6 py-3 rounded-lg hover:bg-blue-50 transition font-semibold">
            View Orders
          </Link>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
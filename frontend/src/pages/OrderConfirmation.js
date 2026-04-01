import React from 'react';
import { useLocation, Link } from 'react-router-dom';
import { QRCodeSVG } from 'qrcode.react';

const OrderConfirmation = () => {
  const location = useLocation();
  const { orderDetails, total, paymentMethod, upiId, orderId } = location.state || {
    orderDetails: [{ name: 'Wireless Headphones', price: 2999, qty: 1 }],
    total: 2999,
    paymentMethod: 'cod',
    upiId: null,
    orderId: `ORD-${Date.now()}`
  };

  const orderDate = new Date().toLocaleDateString('en-IN', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const invoiceNumber = `INV-${orderId.slice(4)}`;

  const qrData = `ShopZone Invoice\nOrder: ${orderId}\nDate: ${orderDate}\nTotal: Rs.${total}\nPayment: ${paymentMethod === 'cod' ? 'Cash on Delivery' : 'UPI'}`;

  return (
    <div className="max-w-3xl mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        {/* Header */}
        <div className="bg-blue-600 text-white p-6 text-center">
          <h1 className="text-3xl font-bold">Order Confirmed! 🎉</h1>
          <p className="text-blue-100 mt-2">Thank you for shopping with ShopZone</p>
        </div>

        <div className="p-6">
          {/* Order & Invoice Info */}
          <div className="flex justify-between items-start border-b pb-4 mb-4">
            <div>
              <p className="text-gray-500 text-sm">Order ID</p>
              <p className="font-bold text-lg">{orderId}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Invoice No.</p>
              <p className="font-bold text-lg">{invoiceNumber}</p>
            </div>
            <div>
              <p className="text-gray-500 text-sm">Date</p>
              <p className="font-bold">{orderDate}</p>
            </div>
          </div>

          {/* Payment Details */}
          <div className="bg-gray-50 rounded-lg p-4 mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Payment Details</h3>
            <div className="flex justify-between">
              <span className="text-gray-600">Method:</span>
              <span className="font-semibold">
                {paymentMethod === 'cod' ? '💵 Cash on Delivery' : '📱 UPI Payment'}
              </span>
            </div>
            {paymentMethod === 'upi' && upiId && (
              <div className="flex justify-between mt-1">
                <span className="text-gray-600">UPI ID:</span>
                <span className="font-mono text-sm">{upiId}</span>
              </div>
            )}
            <div className="flex justify-between mt-2 pt-2 border-t">
              <span className="text-gray-600">Total Amount:</span>
              <span className="font-bold text-blue-600 text-lg">Rs.{total}</span>
            </div>
          </div>

          {/* Items List */}
          <div className="mb-4">
            <h3 className="font-semibold text-gray-700 mb-2">Order Items</h3>
            <div className="border rounded-lg overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="text-left p-3">Item</th>
                    <th className="text-center p-3">Qty</th>
                    <th className="text-right p-3">Price</th>
                    <th className="text-right p-3">Total</th>
                  </tr>
                </thead>
                <tbody>
                  {orderDetails.map((item, idx) => (
                    <tr key={idx} className="border-t">
                      <td className="p-3">{item.name}</td>
                      <td className="text-center p-3">{item.qty}</td>
                      <td className="text-right p-3">Rs.{item.price}</td>
                      <td className="text-right p-3 font-semibold">Rs.{item.price * item.qty}</td>
                    </tr>
                  ))}
                </tbody>
                <tfoot className="bg-gray-50 border-t">
                  <tr>
                    <td colSpan="3" className="text-right p-3 font-bold">Grand Total:</td>
                    <td className="text-right p-3 font-bold text-blue-600">Rs.{total}</td>
                  </tr>
                </tfoot>
              </table>
            </div>
          </div>

          {/* QR Code */}
          <div className="text-center py-4 border-t pt-4">
            <h3 className="font-semibold text-gray-700 mb-2">Invoice QR Code</h3>
            <div className="flex justify-center">
              <QRCodeSVG value={qrData} size={150} level="H" />
            </div>
            <p className="text-xs text-gray-400 mt-2">Scan to view invoice details</p>
          </div>

          {/* Action Buttons */}
          <div className="flex gap-3 mt-6">
            <button
              onClick={() => window.print()}
              className="flex-1 bg-gray-600 text-white py-2 rounded hover:bg-gray-700 transition"
            >
              🖨️ Print Invoice
            </button>
            <Link
              to="/orders"
              className="flex-1 text-center bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
            >
              📋 View My Orders
            </Link>
            <Link
              to="/"
              className="flex-1 text-center border border-blue-600 text-blue-600 py-2 rounded hover:bg-blue-50 transition"
            >
              🛍️ Continue Shopping
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default OrderConfirmation;
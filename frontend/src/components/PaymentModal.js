import React, { useState } from 'react';

const PaymentModal = ({ total, onClose, onConfirm }) => {
  const [paymentMethod, setPaymentMethod] = useState('cod');
  const [upiId, setUpiId] = useState('');

  const handleConfirm = () => {
    onConfirm({ method: paymentMethod, upiId: paymentMethod === 'upi' ? upiId : null });
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-md w-full">
        <h2 className="text-2xl font-bold text-gray-800 mb-4">Select Payment Method</h2>
        <p className="text-gray-600 mb-4">Total Amount: <span className="font-bold text-blue-600">Rs.{total}</span></p>

        <div className="space-y-3 mb-6">
          <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="payment"
              value="cod"
              checked={paymentMethod === 'cod'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4"
            />
            <span className="font-semibold">💵 Cash on Delivery (COD)</span>
          </label>

          <label className="flex items-center gap-3 p-3 border rounded-lg cursor-pointer hover:bg-gray-50">
            <input
              type="radio"
              name="payment"
              value="upi"
              checked={paymentMethod === 'upi'}
              onChange={(e) => setPaymentMethod(e.target.value)}
              className="w-4 h-4"
            />
            <span className="font-semibold">📱 UPI Payment</span>
          </label>

          {paymentMethod === 'upi' && (
            <div className="ml-8 mt-2">
              <label className="block text-sm text-gray-600 mb-1">UPI ID</label>
              <input
                type="text"
                placeholder="example@okhdfcbank"
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:border-blue-500"
              />
              <p className="text-xs text-gray-400 mt-1">Enter your UPI ID to complete payment</p>
            </div>
          )}
        </div>

        <div className="flex gap-3">
          <button
            onClick={onClose}
            className="flex-1 bg-gray-300 text-gray-700 py-2 rounded hover:bg-gray-400 transition"
          >
            Cancel
          </button>
          <button
            onClick={handleConfirm}
            className="flex-1 bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition"
          >
            Confirm Order
          </button>
        </div>
      </div>
    </div>
  );
};

export default PaymentModal;
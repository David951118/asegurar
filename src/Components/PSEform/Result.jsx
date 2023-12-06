import React from 'react';

const Result = ({ amount }) => (
  <div className="text-center">
    <h2 className="mb-3">Payment Successful</h2>
    <p>Amount: {amount}</p>
  </div>
);

export default Result;
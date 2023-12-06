import React, { useState } from 'react';

const PSEForm = ({ onSubmit }) => {
  const [amount, setAmount] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(amount);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className="mb-3">
        <label htmlFor="amount" className="form-label">
          Amount:
        </label>
        <input
          type="text"
          className="form-control"
          id="amount"
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
        />
      </div>
      <button type="submit" className="btn btn-primary">
        Pay with PSE
      </button>
    </form>
  );
};

export default PSEForm;
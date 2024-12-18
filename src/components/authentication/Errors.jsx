import React from 'react';

function Errors({ errors }) {
 
  const renderError = () => {
    if (Object.keys(errors).length > 0) {
      return (
        <ul className="error-list">
          {Object.keys(errors).map((key, index) => (
            <li key={index}>
              <span className="error-icon">⚠️</span>
              <span className="error-message">{errors[key]}</span>
            </li>
          ))}
        </ul>
      );
    }
    return null;
  };

  // Không render gì nếu không có lỗi
  if (Object.keys(errors).length === 0) {
    return null;
  }

  return (
    <div className="error-container">
      {renderError()}
    </div>
  );
}

export default Errors;

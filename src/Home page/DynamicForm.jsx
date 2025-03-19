import React, { useState } from 'react';

const DynamicForm = ({ config, onSubmit, onCancel }) => {
  const { method, promptId, fields, promptText } = config;
  const [formData, setFormData] = useState({});
  const [submitting, setSubmitting] = useState(false);

  const handleChange = (fieldName, value) => {
    setFormData(prev => ({ ...prev, [fieldName]: value }));
  };

  const renderField = (field) => {
    // Check if the field name (case-insensitive) contains "account type"
    if (typeof field === 'string' && 
        (field.toLowerCase().includes('account type') || field.toLowerCase() === 'accounttype')) {
      return (
        <div key={field}>
          <label>{field}</label>
          <select
            value={formData[field] || ''}
            onChange={(e) => handleChange(field, e.target.value)}
            // required
          >
            <option value="">Select account type</option>
            <option value="SAVINGS">SAVINGS</option>
            <option value="CURRENT">CURRENT</option>
          </select>
        </div>
      );
    }
    // Handle all other text fields
    else if (typeof field === 'string') {
      // Map display names to field names if needed
      const fieldKey = field.toLowerCase().includes('holder name') ? 'accountHolderName' : field;
      const displayName = field;
      
      return (
        <div key={fieldKey}>
          <label>{displayName}</label>
          <input
            type="text"
            placeholder={`Enter ${displayName}`}
            value={formData[fieldKey] || ''}
            onChange={(e) => handleChange(fieldKey, e.target.value)}
            // required
          />
        </div>
      );
    } 
    // Handle object field format (for backward compatibility)
    else if (typeof field === 'object') {
      return Object.keys(field).map(fieldName => (
        <div key={fieldName}>
          <label>{fieldName}</label>
          <select
            value={formData[fieldName] || ''}
            onChange={(e) => handleChange(fieldName, e.target.value)}
            // required
          >
            <option value="">Select an option</option>
            {field[fieldName].map(option => (
              <option key={option} value={option}>
                {option}
              </option>
            ))}
          </select>
        </div>
      ));
    }
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    // Check if at least one field has been filled
    const hasAtLeastOneField = Object.values(formData).some(value => value !== undefined && value !== '');
    
    if (hasAtLeastOneField) {
      setSubmitting(true);
      
      // Only include fields that have values when submitting
      const nonEmptyFormData = Object.fromEntries(
        Object.entries(formData).filter(([_, value]) => value !== undefined && value !== '')
      );
      
      await onSubmit(nonEmptyFormData);
      setSubmitting(false);
    } else {
      // Optional: Show an alert if no fields are filled
      alert('Please fill at least one field');
    }
  };

  // Determine if this is an add or update form based on the HTTP method
  const isAddForm = method === 'POST';
  const formTitle = isAddForm ? "Fill details to Add" : "Fill details to Update";

  return (
    <div className="dynamic-form-overlay">
      <form onSubmit={handleSubmit} className="dynamic-form">
        <h2>{formTitle}</h2>
        {promptText && <h3>{promptText}</h3>}
        {fields.map(field => renderField(field))}
        <div className="button-group">
          <button type="submit" disabled={submitting}>
            {submitting ? 'Loading...' : 'Submit'}
          </button>
          <button type="button" onClick={onCancel} disabled={submitting}>
            Cancel
          </button>
        </div>
      </form>
      <style>{`
        /* CSS remains unchanged */
        .dynamic-form-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.7);
          backdrop-filter: blur(3px);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 2000;
        }

        .dynamic-form {
          background: linear-gradient(135deg, #0f2027, #203a43, #2c5364);
          padding: 32px;
          border-radius: 16px;
          max-width: 450px;
          width: 100%;
          max-height: 80vh;
          overflow-y: auto;
          color: #fff;
          box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3), 
                      0 0 50px rgba(65, 145, 255, 0.15),
                      inset 0 0 20px rgba(65, 145, 255, 0.05);
          border: 1px solid rgba(65, 145, 255, 0.2);
          position: relative;
        }

        .dynamic-form h2, .dynamic-form h3 {
          margin-bottom: 24px;
          text-align: center;
          font-weight: 600;
          color: #fff;
          text-shadow: 0 0 10px rgba(65, 145, 255, 0.5);
        }

        .dynamic-form div {
          margin-bottom: 20px;
        }

        .dynamic-form label {
          display: block;
          margin-bottom: 8px;
          font-weight: 500;
          color: #a9d4ff;
        }

        .dynamic-form input, .dynamic-form select {
          width: 100%;
          padding: 12px 16px;
          border: 1px solid rgba(65, 145, 255, 0.3);
          background-color: rgba(15, 32, 39, 0.8);
          color: #fff;
          border-radius: 8px;
          box-sizing: border-box;
          font-size: 16px;
          transition: all 0.2s ease;
        }

        .dynamic-form input:focus, .dynamic-form select:focus {
          outline: none;
          border-color: #4191ff;
          box-shadow: 0 0 0 2px rgba(65, 145, 255, 0.2);
        }

        .dynamic-form input::placeholder {
          color: #6d9fcb;
        }

        .button-group {
          display: flex;
          justify-content: space-between;
          margin-top: 32px;
        }

        .dynamic-form button {
          padding: 12px 24px;
          border: none;
          border-radius: 8px;
          cursor: pointer;
          font-weight: 500;
          font-size: 16px;
          transition: all 0.2s ease;
        }

        .dynamic-form button[type="submit"] {
          background: linear-gradient(135deg, #1e3c72, #2a5298);
          color: #fff;
          flex-grow: 1;
          margin-right: 12px;
          box-shadow: 0 3px 10px rgba(30, 60, 114, 0.3);
        }

        .dynamic-form button[type="submit"]:hover {
          background: linear-gradient(135deg, #2a5298, #1e3c72);
          transform: translateY(-2px);
          box-shadow: 0 5px 15px rgba(30, 60, 114, 0.4);
        }

        .dynamic-form button[type="button"] {
          background-color: rgba(0, 0, 0, 0.3);
          color: #a9d4ff;
          border: 1px solid rgba(65, 145, 255, 0.2);
        }

        .dynamic-form button[type="button"]:hover {
          background-color: rgba(0, 0, 0, 0.5);
          border-color: rgba(65, 145, 255, 0.4);
        }

        .dynamic-form::before {
          content: '';
          position: absolute;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background-image: radial-gradient(1px 1px at 25px 5px, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0)),
                            radial-gradient(1px 1px at 50px 25px, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0)),
                            radial-gradient(1px 1px at 125px 20px, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0)),
                            radial-gradient(1.5px 1.5px at 50px 75px, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0)),
                            radial-gradient(2px 2px at 15px 125px, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0)),
                            radial-gradient(2.5px 2.5px at 110px 80px, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0));
          z-index: -1;
          border-radius: 16px;
          opacity: 0.4;
          pointer-events: none;
        }
      `}</style>
    </div>
  );
};

export default DynamicForm;
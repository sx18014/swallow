import React, { useState } from 'react';
import { useAppState } from '../../store/useAppState';

const PainInputForm: React.FC = () => {
  const [inputValue, setInputValue] = useState('');
  const { setUserPainText, setCurrentScene } = useAppState();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setUserPainText(inputValue);
    setCurrentScene('FOLD');
  };

  return (
    <div
      style={{
        position: 'fixed',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        width: '400px',
        backgroundColor: 'rgba(255, 255, 255, 0.5)',
        border: '1px solid #111',
        borderRadius: '1px',
        padding: '24px',
        zIndex: 1000,
        boxShadow: '3px 10px 5px rgba(0, 0, 0, 0.15)'
      }}
    >
      <h2 style={{ 
        marginTop: 0, 
        textAlign: 'center', 
        fontFamily: 'sans-serif',
        color: '#333',
        fontWeight: 'normal'
      }}>
        Share Your Unspoken Pain
      </h2>
      
      <form onSubmit={handleSubmit}>
        <textarea
          rows={5}
          style={{
            width: '100%',
            resize: 'none',
            padding: '12px',
            marginBottom: '16px',
            fontFamily: 'inherit',
            fontSize: '16px',
            border: '1px solid #ddd',
            borderRadius: '4px',
            boxSizing: 'border-box',
            backgroundColor: 'rgba(255, 255, 255, 0.3)',
          }}
          placeholder="Write down anything you want to release..."
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />

        <button
          type="submit"
          style={{
            width: '100%',
            padding: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.8)',
            border: '1px solid #111',
            borderRadius: '1px',
            color: '#666',
            fontSize: '14px',
            cursor: 'pointer',
            transition: 'all 0.2s ease',
          }}
        >
          fold into a paper swallow
        </button>
      </form>
    </div>
  );
};

export default PainInputForm;

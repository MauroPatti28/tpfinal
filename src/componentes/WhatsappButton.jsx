import React, { useEffect, useState } from 'react';
import { FaWhatsapp } from 'react-icons/fa';
import '../estilos/wsp.css';

const WhatsAppButton = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [message, setMessage] = useState('');

  useEffect(() => {
    async function fetchWhatsAppInfo() {
      try {
        const response = await fetch('http://localhost:3000/api/whatsapp');
        const data = await response.json();
        setPhoneNumber(data.phoneNumber);
        setMessage(data.message);
      } catch (error) {
        console.error('Error fetching WhatsApp info:', error);
      }
    }

    fetchWhatsAppInfo();
  }, []);

  const handleWhatsAppClick = () => {
    const url = `https://wa.me/${phoneNumber}?text=${encodeURIComponent(message)}`;
    window.open(url, '_blank');
  };

  return (
    <div className="whatsapp-button-container">
      <button onClick={handleWhatsAppClick} className="whatsapp-button">
        <FaWhatsapp className="whatsapp-icon" />
      </button>
      <div className="whatsapp-tooltip">NUESTRO WHATSAPP</div>
    </div>
  );
};

export default WhatsAppButton;


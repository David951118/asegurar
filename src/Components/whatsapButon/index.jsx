import React, { useState } from 'react';
import WhatsAppModal from '../whatsappModal';
import whatsappIcon from '../../Assets/whatsapp.svg';

const WhatsAppButton = () => {
  const [showModal, setShowModal] = useState(false);

  const openWhatsAppModal = () => {
    setShowModal(true);
  };

  return (
    <>
      <div className="position-fixed bottom-0 end-0 p-3">
        {!showModal && (
          <img
            src={whatsappIcon}
            alt="WhatsApp Icon"
            style={{ width: '50px', height: '50px', cursor: 'pointer' }}
            onClick={openWhatsAppModal}
          />
        )}
      </div>

      <WhatsAppModal showModal={showModal} setShowModal={setShowModal} />
    </>
  );
};

export default WhatsAppButton;

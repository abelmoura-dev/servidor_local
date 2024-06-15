// WhatsAppChat.js
import React, { useState } from 'react';
import './style.css'; // Certifique-se de criar este arquivo para os estilos
import whatsappIcon  from '../../assets/whatsapp-icon.png';
import ContactFormModal from '../../components/ContactFormModal/index';

const WhatsAppChat = () => {
    const [isModalOpen, setModalOpen] = useState(false);
  
    const handleOpenModal = () => {
      setModalOpen(true);
    };
  
    const handleCloseModal = () => {
      setModalOpen(false);
    };

    return (
        <div className="whatsapp-chat">
          <a href="#void" onClick={handleOpenModal}>
            <div className="speech-bubble">
              <span className="message">Precisa de ajuda?</span>
            </div>
            <img src={whatsappIcon} alt="WhatsApp" />
          </a>
          <ContactFormModal open={isModalOpen} onClose={handleCloseModal} />
        </div>
      );
    };

export default WhatsAppChat;
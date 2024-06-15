// ContactFormModal.js
import React, { useState } from 'react';
import { Modal, Box, Typography, TextField, Button } from '@material-ui/core';
import emailjs from 'emailjs-com';
import validator from 'validator';


const ContactFormModal = ({ open, onClose }) => {
  const [formData, setFormData] = useState({
    fullName: '',
    whatsapp: '',
    email: '',
    description: '',
  });

  const [errors, setErrors] = useState({}); // Estado para armazenar mensagens de erro

  const handleInputChange = (field) => (event) => {
    setFormData({ ...formData, [field]: event.target.value });
    // Limpa a mensagem de erro quando o usuário começa a digitar novamente
    setErrors({ ...errors, [field]: '' });
  };

  const validateForm = () => {
    const newErrors = {};

    // Validação do nome
    if (!formData.fullName.trim()) {
      newErrors.fullName = 'Nome é obrigatório';
    }

    // Validação do WhatsApp
    if (!validator.isMobilePhone(formData.whatsapp, 'any', { strictMode: false })) {
      newErrors.whatsapp = 'Número de WhatsApp inválido';
    }

    // Validação do e-mail
    if (!validator.isEmail(formData.email)) {
      newErrors.email = 'E-mail inválido';
    }

    // Validação da descrição
    if (!formData.description.trim()) {
      newErrors.description = 'Descrição é obrigatória';
    }

    // Define as mensagens de erro no estado
    setErrors(newErrors);

    // Retorna true se não houver erros, caso contrário, false
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = () => {

    if (validateForm()) {
      // Configuração do emailJS (substitua com suas próprias informações)
      const serviceId = process.env.REACT_APP_EMAILJS_SERVICE_ID
      const templateId = process.env.REACT_APP_EMAILJS_TEMPLATE_ID;
      const userId = process.env.REACT_APP_EMAILJS_USER_ID;

      // Prepara os dados para enviar
      const templateParams = {
        fullName: formData.fullName,
        whatsapp: formData.whatsapp,
        email: formData.email,
        description: formData.description,
      };

      // Envia os dados usando o emailJS
      emailjs.send(serviceId, templateId, templateParams, userId)
        .then((response) => {
          console.log('Email enviado com sucesso:', response);
          // Limpa o formulário após o envio bem-sucedido
          setFormData({
            fullName: '',
            whatsapp: '',
            email: '',
            description: '',
          });
          // Fecha o modal
          onClose();
        })
        .catch((error) => {
          console.error('Erro ao enviar email:', error);
        });
    }
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box sx={{ position: 'absolute', top: '55%', left: '80%', transform: 'translate(-5%, -55%)', bgcolor: 'background.paper', boxShadow: 24, p: 4, maxWidth: 400, borderRadius: 10 }}>
        <Typography variant="h6" component="div" sx={{ marginBottom: 2 }}>
          Contato
        </Typography>
        <TextField fullWidth label="Nome Completo" variant="outlined" margin="normal" value={formData.fullName} onChange={handleInputChange('fullName')} error={Boolean(errors.fullName)} helperText={errors.fullName} />
        <TextField fullWidth label="WhatsApp" variant="outlined" margin="normal" value={formData.whatsapp} onChange={handleInputChange('whatsapp')} error={Boolean(errors.whatsapp)} helperText={errors.whatsapp} />
        <TextField fullWidth label="E-mail" variant="outlined" margin="normal" value={formData.email} onChange={handleInputChange('email')} error={Boolean(errors.email)} helperText={errors.email} />
        <TextField fullWidth multiline rows={4} label="Como podemos ajuda-lo?" variant="outlined" margin="normal" value={formData.description} onChange={handleInputChange('description')} error={Boolean(errors.description)} helperText={errors.description} />
        <Button variant="contained" color="primary" onClick={handleSubmit}>
          Enviar
        </Button>
      </Box>
    </Modal>
  );
};

export default ContactFormModal;
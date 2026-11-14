const ContactMessage = require('../models/ContactMessage');

const submitContactForm = async (req, res, next) => {
  try {
    const { name, email, message } = req.body;

    if (!name || !email || !message) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    const contact = await ContactMessage.create({
      name,
      email,
      message,
    });

    res.status(201).json({
      message: 'Message sent successfully. We will get back to you soon.',
      contact: {
        id: contact.id,
        name: contact.name,
        email: contact.email,
      },
    });
  } catch (error) {
    next(error);
  }
};

const getContactMessages = async (req, res, next) => {
  try {
    const messages = await ContactMessage.findAll({
      order: [['createdAt', 'DESC']],
    });

    res.json({
      total: messages.length,
      messages,
    });
  } catch (error) {
    next(error);
  }
};

module.exports = {
  submitContactForm,
  getContactMessages,
};

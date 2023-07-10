const mongoose = require('mongoose');
const { isURL } = require('validator');

// Define the Company schema
const companySchema = new mongoose.Schema({
  companyName: {
    type: String,
    required: true,
    unique: true
  },
  companyId: {
    type: String,
    required: true,
  },
  aboutCompany: {
    type: String,
    required: true,
  },
  websiteURL: {
    type: String,
    required: true,
    validate: {
      validator: (value) => isURL(value),
      message: 'Invalid website URL',
    },
  },
  logoURL: {
    type: String,
    required: true,
    validate: {
      validator: (value) => isURL(value),
      message: 'Invalid logo URL',
    },
  },
  address: {
    street: String,
    city: String,
    state: String,
    country: String,
    zipCode: String,
  },
  socialMedia: {
    twitter: {
      type: String,
      validate: {
        validator: (value) => isURL(value),
        message: 'Invalid Twitter URL',
      },
    },
    linkedin: {
      type: String,
      validate: {
        validator: (value) => isURL(value),
        message: 'Invalid LinkedIn URL',
      },
    },
    facebook: {
      type: String,
      validate: {
        validator: (value) => isURL(value),
        message: 'Invalid Facebook URL',
      },
    },
    instagram: {
      type: String,
      validate: {
        validator: (value) => isURL(value),
        message: 'Invalid Instagram URL',
      },
    },
  },
});

// Create the Company model
const Company = mongoose.model('Company', companySchema);

module.exports.Company = Company;

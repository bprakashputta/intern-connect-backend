const Joi = require('joi');
const {Company} = require('../models/company');

const uniqueCompanyName = async (value, helpers) => {
    try {
      // Check if the company name already exists in the database
      const existingCompany = await Company.findOne({ companyName: value });
      console.log(existingCompany);
      if (existingCompany) {
        throw new Error('Company name is already taken');
      }
      return value;
    } catch (error) {
      console.log(error);
    }
};

const companyValidationSchema = async (Company)=> {
    const schema = Joi.object({
        companyName: Joi.string().required().custom(uniqueCompanyName),
        companyId: Joi.string().required(),
        aboutCompany: Joi.string().required(),
        websiteURL: Joi.string().required().uri().message('Invalid website URL'),
        logoURL: Joi.string().required().uri().message('Invalid logo URL'),
        address: Joi.object({
          street: Joi.string(),
          city: Joi.string(),
          state: Joi.string(),
          country: Joi.string(),
          zipCode: Joi.string(),
        }),
        socialMedia: Joi.object({
          twitter: Joi.string().uri().message('Invalid Twitter URL'),
          linkedin: Joi.string().uri().message('Invalid LinkedIn URL'),
          facebook: Joi.string().uri().message('Invalid Facebook URL'),
          instagram: Joi.string().uri().message('Invalid Instagram URL'),
        }),
    });

    return schema.validate(Company);
}

module.exports = companyValidationSchema;

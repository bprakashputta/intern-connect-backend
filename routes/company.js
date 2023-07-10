const express = require('express');
const router = express.Router();
const passport = require('passport');
const Joi = require('joi');
const {Company} = require('../models/company');
const companyValidation = require('../validations/companyValidation');
const generateCompanyId = require('../utilities/generateCompanyId');


// Define the isAuthenticated middleware
function isAuthenticated(request, response, next) {
    next();
    // Check if the user is authenticated
    // if (request.isAuthenticated()) {
    //   // User is authenticated, proceed to the next middleware or route handler
    //   return next();
    // }
    // // User is not authenticated, redirect to login page or send an error response
    // return response.send('You are not authorised to make this request');
    // res.redirect('/login'); // Example redirect to the login page
  }
  
  // Use the isAuthenticated middleware in your route handler
  router.post('/', isAuthenticated, (req, res) => {
    // Handle the POST request logic for the authenticated route here
});
  


// Create a new company
router.post('/create', isAuthenticated, async (request, response) => {
  try {
    const { error } = await companyValidation(request.body);
    console.log("Doing validation");
    if (error) {
        console.log(error);
      return response.status(400).json({ error: error.details[0].message });
    }
    // Generate company id using generate company id function
    console.log('Schema sent in request body is valid');
    let companyId = await generateCompanyId();

    request.body.companyId = companyId;
    console.log(request.body);


    const newCompany = new Company(request.body);
    const savedCompany = await newCompany.save();
    
    return response.status(201).json(savedCompany);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Get all companies
router.get('/all', isAuthenticated, async (request, response) => {
  try {
    const companies = await Company.find();
    return response.json(companies);
  } catch (error) {
    return response.status(500).json({ error: error.message });
  }
});

// Get a specific company by ID
router.get('/view/:id', isAuthenticated, async (request, response) => {
    try {
      let companyId = request.params.id;
      console.log(companyId);
      const company = await Company.findOne({ companyId: companyId });
      console.log(company.companyId);
      if (!company) {
        return response.status(404).json({ error: 'Company not found' });
      }
      response.json(company);
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  });

// Get a specific company by ID
router.get('/:id', isAuthenticated, async (request, response) => {
    try {
      let companyId = request.params.id;
      console.log(companyId);
      const company = await Company.findById(companyId);
      console.log(company.companyId);
      if (!company) {
        return response.status(404).json({ error: 'Company not found' });
      }
      response.json({company});
    } catch (error) {
      return response.status(500).json({ error: error.message });
    }
  });



// Update a company by ID
router.put('/:id', isAuthenticated, async (request, response) => {
  try {
    console.log('Received Edit request bhanu');
    const { error } = await companyValidation(request.body);
    if (error) {
        console.log(error);
      return response.status(400).json({ error: error.details[0].message });
    }
    // console.log(request.body);
    const company = await Company.findByIdAndUpdate(request.params.id, request.body, {
      new: true,
      runValidators: true,
    });

    if (!company) {
      return response.status(404).json({ error: 'Company not found' });
    }
    response.json(company);
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

// Delete a company by ID
router.delete('/delete/:id', isAuthenticated, async (request, response) => {
  try {
    const company = await Company.findByIdAndDelete(request.params.id);
    if (!company) {
      return response.status(404).json({ error: 'Company not found' });
    }
    response.json({ message: 'Company deleted successfully' });
  } catch (error) {
    response.status(500).json({ error: error.message });
  }
});

module.exports = router;

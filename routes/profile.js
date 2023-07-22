const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Create a new profile
router.post('/', profileController.createProfile);

// Get a profile by ID
router.get('/:id', profileController.getProfileById);

// Update a profile by ID
router.put('/:id', profileController.updateProfileById);

// Delete a profile by ID
router.delete('/:id', profileController.deleteProfileById);

module.exports = router;

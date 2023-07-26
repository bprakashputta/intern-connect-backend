const express = require('express');
const router = express.Router();
const profileController = require('../controllers/profileController');

// Create a new profile
router.post('/', profileController.createProfile);

// Get a profile by ID
router.get('/:username', profileController.getProfileById);

// Update a profile by ID
router.put('/:username', profileController.updateProfileById);

// Delete a profile by ID
router.delete('/:username', profileController.deleteProfileById);

module.exports = router;

const User = require('../models/user');

const { Profile, validateProfile } = require("../models/profile")
const { PersonalDetails, validatePersonalDetails } = require('../models/personalDetails');
const { EducationalDetails, validateEducationalDetails } = require('../models/educationalDetails');
const { WorkExperienceDetails, validateWorkExperienceDetails } = require('../models/workExperienceDetails');
const { SocialMediaLinks, validateSocialMediaLinks } = require('../models/socialMediaLinks');
const { Skillset, validateSkillset } = require('../models/skillset');

exports.createProfile = async (req, res) => {
    // if (!req.isAuthenticated()) {
    //     return res.status(401).json({ error: 'You need to be logged in to create a profile' });
    // }
    // Validate the request body using the validateProfile function
    // const { error: profileError } = validateProfile(req.body);
  
    // Validate each nested model separately
    const { error: personalDetailsError } = validatePersonalDetails(req.body.personal_details);
    const { error: educationalDetailsError } = validateEducationalDetails(req.body.educational_details);
    const { error: workExperienceDetailsError } = validateWorkExperienceDetails(req.body.work_experience_details);
    const { error: socialMediaLinksError } = validateSocialMediaLinks(req.body.social_media_links);
    const { error: skillsetError } = validateSkillset(req.body.skillset);
  
    // Check if any validation errors exist
    if ( personalDetailsError || educationalDetailsError || workExperienceDetailsError || socialMediaLinksError || skillsetError) {
        const errors = {
            // profile: profileError ? profileError.details[0].message : undefined,
            personal_details: personalDetailsError ? personalDetailsError.details[0].message : undefined,
            educational_details: educationalDetailsError ? educationalDetailsError.details[0].message : undefined,
            work_experience_details: workExperienceDetailsError ? workExperienceDetailsError.details[0].message : undefined,
            social_media_links: socialMediaLinksError ? socialMediaLinksError.details[0].message : undefined,
            skillset: skillsetError ? skillsetError.details[0].message : undefined,
        };
        return res.status(400).json({ errors });
    }

    try {
        // Create instances of the nested models and save them to the database
        const personalDetails = new PersonalDetails(req.body.personal_details);
        const educationalDetails = new EducationalDetails(req.body.educational_details);
        const workExperienceDetails = new WorkExperienceDetails(req.body.work_experience_details);
        const socialMediaLinks = new SocialMediaLinks(req.body.social_media_links);
        const skillset = new Skillset(req.body.skillset);

        await personalDetails.save();
        await educationalDetails.save();
        await workExperienceDetails.save();
        await socialMediaLinks.save();
        await skillset.save();

        // Create the main profile document with references to the saved nested models
        const profile = new Profile({
            personal_details: personalDetails._id,
            educational_details: educationalDetails._id,
            work_experience_details: workExperienceDetails._id,
            social_media_links: socialMediaLinks._id,
            skillset: skillset._id,
        // Include other profile fields here, if any
        });

        console.log(profile);
        // await profile.save();

        // Link the newly created profile to the user
        const user = await User.findById(req.user._id);
        console.log(user);
        console.log("69");
        // user.profile = profile._id;
        // await user.save();

        return res.status(201).json({ message: 'Profile created successfully', profile });
    } catch (err) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};
  

// Get a profile by ID
exports.getProfileById = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'You need to be logged in to create a profile' });
    }
    const { id } = req.params;

    try {
        // Find the profile by ID
        const profile = await Profile.findById(id);

        if (!profile) {
        return res.status(404).json({ error: 'Profile not found' });
        }

        return res.status(200).json(profile);
    } catch (err) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};

// Update a profile by ID
exports.updateProfileById = async (req, res) => {
    
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'You need to be logged in to create a profile' });
    }
    // Validate the request body using the validateProfile function
    const { error: profileError } = validateProfile(req.body);
  
    // Check if any validation errors exist
    if (profileError) {
        const errors = {
            profile: profileError.details[0].message,
        };
    
        return res.status(400).json({ errors });
    }
  
    try {
        // Get the profile by ID from the database
        const profile = await Profile.findById(req.params.profileId);
    
        // Check if the profile exists
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
    
        // Update the main profile document with data from the request body
        profile.personalDetails = req.body.personalDetails;
        profile.educationalDetails = req.body.educationalDetails;
        profile.workExperienceDetails = req.body.workExperienceDetails;
        profile.socialMediaLinks = req.body.socialMediaLinks;
        profile.skillset = req.body.skillset;
        // Include other profile fields here, if any
    
        // Save the updated profile to the database
        await profile.save();
    
        return res.json({ message: 'Profile updated successfully', profile });
    } catch (err) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};
  
  

// Delete a profile by ID
exports.deleteProfileById = async (req, res) => {
    if (!req.isAuthenticated()) {
        return res.status(401).json({ error: 'You need to be logged in to create a profile' });
    }

    try {
        // Get the profile by ID from the database
        const profile = await Profile.findById(req.params.profileId);
    
        // Check if the profile exists
        if (!profile) {
            return res.status(404).json({ error: 'Profile not found' });
        }
    
        // Delete the associated nested models first
        await PersonalDetails.findByIdAndDelete(profile.personalDetails);
        await EducationalDetails.findByIdAndDelete(profile.educationalDetails);
        await WorkExperienceDetails.findByIdAndDelete(profile.workExperienceDetails);
        await SocialMediaLinks.findByIdAndDelete(profile.socialMediaLinks);
        await Skillset.findByIdAndDelete(profile.skillset);
        // Add other nested models to delete, if any
    
        // Delete the main profile document
        await profile.remove();
    
        return res.json({ message: 'Profile deleted successfully' });
    } catch (err) {
        return res.status(500).json({ error: 'Something went wrong' });
    }
};
  
  
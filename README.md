Hi Bhanu Prakash!

# The Intern Management System
## Name of Application 

## Summary
    Introduction:
    The Idea of the Application :
    Objective:
    Implementation
    Features
    Tech Stack
    Snippets
    Conclusion 

### Introduction 
#### Overview

    The Intern Management System is a software application for the end-to-end management of interns, from posting internships to hiring candidates to assigning tasks and collecting payments for successful candidates' certificates.


### Features
#### Overview
    The following features are expected to be present in the application,
        User profiles
        Company profiles
        Companies post internships - CRUD operations
        Admin Panel
        Internship page  - Separate tab on user profile 
        Feature to pay the candidate after successful completion of the internship.
        Details about the platform
        Contact Us page for the platform


The candidate should fill in details regarding his interests. There will be a detailed profile where he can fill in his details, interests, and skillset.
Both company and the candidate will provide what particular skillset they are looking for in the internship. And jobs will be suggested to candidates after mapping the skillset.
There should be a feature similar to Google Classroom where a selected candidate is given a task and can work on it and submit it back.
Post-completion of the internship, the certificate should be shared, and payment should be collected for the certificate.


Routes
    User route
    Platform route
    Profile route
    Personal profile details route
    Education details route
    Work experience details route
    Social media profiles URL route


Models
User Model
Username
Email id
Password
Profile Id
Profile Model
Personal details
Given name 
Surname
Preferred name
Email Id:
Mobile number 
Location
Education details
College Name
Branch of study
Education level
Start time - calendar 
End time - calendar 
Work Experience details
Company name
Role
Type of role(full-time or internship)
Start date
End date
Social Media links
LinkedIn URL
GitHub URL
Portfolio URL
Skillset - It will be an array of different skills that the user has


Company Model
Schema of company
Company Name
Company Id 
Description
About
Website link
Array of Jobs
Jobs Model
Schema of a job will contain
Role_name
Job_id
Location
Type of job
Skills required
Description
Company_id - refers to schema of company.




TODO’s
Display internships
Admin panel to modify data on the website
Assign tasks to a selected intern
Intern after completing intern should pay to get the certificate of internship.
 







PROJECT DEMO - 21/05/2023
Features to be completed for Demo:-
User signup and login
User signup and log in with user Google account
Home page
About us
Contact us
Profile filling page upon signup
User profile page post signup

Other To-do’s 
Company page
List of internships
Mapping jobs based on skillset, adding filters to queries
Admin Panel



Admin Panel Features:-
Admin should be able to modify everything on the website through the admin panel. 
Content like about us, list of internships, company details, user access, company details, modify jobs

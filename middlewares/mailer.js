const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth:{
        user: process.env.DEV_EMAIL_ID,
        pass: process.env.DEV_EMAIL_PASSWORD
    }
});

const options = {
    from: process.env.DEV_EMAIL_ID,
    to: "bhanu.putta1999@gmail.com",
    subject: "Test email for intern connect",
    text: "Hello Bhanu, the email service is working perfect."
};

transporter.sendMail(options, (err, info)=>{
    if(err){
        console.log(err);
        return;
    }
    console.log("Email has been sent. Response : ",info.response);
});
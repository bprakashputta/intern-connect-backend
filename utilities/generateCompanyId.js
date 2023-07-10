const {Company} = require('../models/company');

async function generateCompanyId() {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  const length = 6;

  while (true) {
    let companyId = '';

    for (let i = 0; i < length; i++) {
      const randomIndex = Math.floor(Math.random() * characters.length);
      companyId += characters.charAt(randomIndex);
    }

    const existingCompany = await Company.findOne({ companyId });

    if (!existingCompany) {
      return companyId;
    }
  }
}


// Testing the function
// generateCompanyId();

module.exports = generateCompanyId;
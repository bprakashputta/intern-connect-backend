const express = require("express");
const router = express.Router();
const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs").promises;

    // if (companyLogo) {
    //   const logoImageBytes = await fs.readFile(logoPath);
    //   const logoImage = await pdfDoc.embedPng(logoImageBytes);
    //   page.drawImage(logoImage, {
    //     x: 100, 
    //     y: 600, 
    //     width: 100, 
    //     height: 100, 
    //     rotate: degrees(0),
    //   });
    // }

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}

async function generateCertificate(candidateData, templatePath) {
  try {
    const templateBytes = await fs.readFile(templatePath);
    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPages()[0];

    const {
      companyName,
      // companyLogo,
      certificateID,
      courseName,
      name,
      certDate,
    } = candidateData;

    page.drawText(companyName, {
      x: 225,
      y: 140,
      size: 18,
      color: rgb(0, 0, 0),
    });

    page.drawText(certificateID, {
      x: 550,
      y: 140,
      size: 16,
      color: rgb(0, 0, 0),
    });

    page.drawText(name.toUpperCase(), {
      x: 200,
      y: 320,
      size: 36,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();
    return pdfBytes;
  } catch (error) {
    console.error(error);
    throw error;
  }
}

router.post("/generate", async (req, res) => {
  const { name, date, courseName ,companyName } = req.body;
  const certDate = date ? date : new Date().toISOString().slice(0, 10);
  const certificateID = Math.random().toString(36).substr(2, 9);
  const candidateData = {
    companyName,
    // companyLogo,
    certificateID,
    courseName,
    name,
    certDate,
  };
  const templatePath = "utilities/cert.pdf";
  try {
    const pdfBytes = await generateCertificate(candidateData, templatePath);

    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="${name}_${courseName}_certificate.pdf"`
    );
    res.end(pdfBytes);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Internal Server Error!" });
  }
});

module.exports = router;

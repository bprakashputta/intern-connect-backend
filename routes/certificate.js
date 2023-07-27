const express = require("express");
const router = express.Router();
const { PDFDocument, rgb } = require("pdf-lib");
const fs = require("fs").promises;

function toTitleCase(str) {
  return str
    .toLowerCase()
    .split(" ")
    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
    .join(" ");
}


router.post("/generate", async (req, res) => {
  const { name, date, courseName } = req.body;
  const certDate = date ? date : new Date().toISOString().slice(0, 10);

  try {
    const templateBytes = await fs.readFile("utilities/cert.pdf");
    const pdfDoc = await PDFDocument.load(templateBytes);
    const page = pdfDoc.getPages()[0];

    page.drawText(toTitleCase(name), { x: 200, y: 250, size: 18, color: rgb(0, 0, 0) });


    page.drawText(certDate, { x: 100, y: 260, size: 14, color: rgb(0, 0, 0) });

    page.drawText(courseName, {
      x: 100,
      y: 300,
      size: 14,
      color: rgb(0, 0, 0),
    });

    const pdfBytes = await pdfDoc.save();

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

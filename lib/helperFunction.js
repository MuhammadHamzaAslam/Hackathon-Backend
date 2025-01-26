import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import QRCode from "qrcode";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";

export const hashPassword = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

const SECRET_KEY = "a9gY859f6WpaRX2BKML78Y3LlBynLR";

export const comparePassword = async (password, hashedPassword) => {
  // Use bcrypt's compare method to check if the passwords match
  return await bcrypt.compare(password, hashedPassword);
};

export const generateToken = (user) => {
  return jwt.sign(
    { id: user._id, email: user.email, role: user.role },
    SECRET_KEY,
    { expiresIn: "90d" }
  );
};

export function generateRandomPassword(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

export async function sendResetPasswordEmail(email, password) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Reset Your Password",
    text: `Your account has been created successfully. Here is your auto-generated password: ${password}.
      Please log in and reset your password immediately.`,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendRejectEmail(email, password) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your Request Has Been Rejected",
    text: `Your Request Of Loan Has Been Rejected Due To These Reason:\n ${password}.`,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendApprovalEmail(email, password) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: process.env.EMAIL,
    to: email,
    subject: "Your Request Has Been Approved",
    text: `Your Request Of Loan Has Been Approved Due To These Reason:\n ${password}.`,
  };

  return transporter.sendMail(mailOptions);
}

export function calculateLoanBreakdown(initialDeposit, loanAmount, loanPeriod) {
  const totalInstallments = loanPeriod; // Assuming loanPeriod is in days
  const remainingAmount = loanAmount - initialDeposit;
  const installmentAmount = remainingAmount / totalInstallments;

  const breakdown = [];
  for (let i = 0; i < totalInstallments; i++) {
    const installmentDate = new Date();
    installmentDate.setDate(installmentDate.getDate() + i + 1); // Daily installment
    breakdown.push({
      date: installmentDate,
      amount: installmentAmount,
    });
  }

  return breakdown;
}

export async function generateTokenSlip(tokenNumber, appointmentDetails) {
  const doc = new PDFDocument({ autoFirstPage: false });
  const filePath = path.join(
    __dirname,
    `../uploads/token_slips/Token_${tokenNumber}.pdf`
  );

  // Add a page to the document
  doc.addPage();
  doc.fontSize(18).text(`Token Number: ${tokenNumber}`, { align: "center" });
  doc
    .fontSize(12)
    .text(`Date: ${appointmentDetails.date}`, { align: "center" });
  doc
    .fontSize(12)
    .text(`Time: ${appointmentDetails.time}`, { align: "center" });
  doc
    .fontSize(12)
    .text(`Office Location: ${appointmentDetails.officeLocation}`, {
      align: "center",
    });

  // Generate QR code
  const qrCodeDataUrl = await QRCode.toDataURL(tokenNumber);
  const qrImagePath = path.join(
    __dirname,
    `../uploads/token_slips/QR_${tokenNumber}.png`
  );

  // Save QR code to image
  await fs.promises.writeFile(
    qrImagePath,
    qrCodeDataUrl.split(",")[1],
    "base64"
  );

  // Add QR code image to PDF
  doc.image(qrImagePath, 200, 350, { width: 100 });

  // Save the PDF
  doc.pipe(fs.createWriteStream(filePath));
  doc.end();

  return filePath.replace(".pdf", ".jpeg"); // Convert to JPEG (could also use a PDF-to-image converter library here)
}

export const convertPasswordToHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

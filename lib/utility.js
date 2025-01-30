import bcrypt from "bcryptjs";
import jwt from "jsonwebtoken";
import nodemailer from "nodemailer";
import QRCode from "qrcode";
import PDFDocument from "pdfkit";
import fs from "fs";
import path from "path";
import dotenv from "dotenv";

dotenv.config();

console.log("EMAIL:", process.env.EMAIL);
console.log("EMAIL PASS:", process.env.EMAIL_PASSWORD);

export const convertPasswordToHash = async (password) => {
  const salt = await bcrypt.genSalt(10);
  return await bcrypt.hash(password, salt);
};

export const generateToken = (user) => {
  console.log(user, "user in generate token");
  return jwt.sign(user, process.env.JWT_PASSWORD_SECRET_KEY, {
    expiresIn: "60d",
  });
};

export async function comparePassword(currentSendedPassword, password) {
  return await bcrypt.compare(currentSendedPassword, password);
}

export function generateRandomPassword(length) {
  const chars =
    "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789@#$%&*!";
  let password = "";
  for (let i = 0; i < length; i++) {
    password += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  return password;
}

// export async function sendResetPasswordEmail(email, password) {
//   const transporter = nodemailer.createTransport({
//     service: "gmail",
//     auth: {
//       user: process.env.EMAIL,
//       pass: process.env.EMAIL_PASSWORD,
//     },
//   });

//   const mailOptions = {
//     from: process.env.EMAIL,
//     to: email,
//     subject: "Reset Your Password",
//     text: `Your account has been created successfully. Here is your auto-generated password: ${password}.
//       Please log in and reset your password immediately.`,
//   };

//   return transporter.sendMail(mailOptions);
// }

export async function sendResetPasswordEmail(email, password) {
  const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
      user: process.env.EMAIL,
      pass: process.env.EMAIL_PASSWORD,
    },
  });

  const mailOptions = {
    from: `"Saylani Microfinance System" <${process.env.EMAIL}>`,
    to: email,
    subject: "Your Account Credentials – Saylani Microfinance System",
    html: `
      <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
        <h2 style="color: #004085;">Welcome to Saylani Microfinance System</h2>
        <p>Dear Valued Member,</p>
        <p>Your account has been successfully created. Please find your login credentials below:</p>
        <p><strong>Email:</strong> ${email}</p>
        <p><strong>Temporary Password:</strong> <span style="background-color: #f8d7da; padding: 5px; border-radius: 5px;">${password}</span></p>
        <p><strong>Important:</strong> For security reasons, please log in and reset your password immediately.</p>
        <p>If you did not request this account, please contact our support team at <a href="mailto:support@saylanimicrofinance.com">support@saylanimicrofinance.com</a>.</p>
        <p>Thank you for choosing Saylani Microfinance System.</p>
        <p>Best Regards,<br><strong>Saylani Microfinance Team</strong></p>
      </div>
    `,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendRejectEmail(email, message) {
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
    text: `${message}`,
  };

  return transporter.sendMail(mailOptions);
}

export async function sendApprovalEmail(email, message) {
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
    text: `${message}`,
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

const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const { PassThrough } = require("stream");

const sendTicketMail = async (toEmail, username, eventName) => {
  try {
    // 1. Generate QR code with event + user info
    const qrData = `User: ${username}, Event: ${eventName}`;
    const qrBuffer = await QRCode.toBuffer(qrData);

    // 2. Generate PDF with user, event, and QR
    const doc = new PDFDocument();
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(buffers);

      // 3. Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL,
          pass: process.env.GMAIL_SECURITY_KEY,
        },
      });

      // 4. Mail options with PDF attachment
      const mailOptions = {
        from: `"Gatherly Team" <${process.env.GMAIL}>`,
        to: toEmail,
        subject: "Your Gatherly Event Ticket 🎟️",
        text: `Hello ${username},\n\nHere is your ticket for ${eventName}.`,
        html: `
          <p>Hello <strong>${username}</strong>,</p>
          <p>Here is your ticket for <b>${eventName}</b> 🎉</p>
          <p>Please find the ticket attached as a PDF.</p>
          <br/>
          <p>Best Regards,<br/>Gatherly Team</p>
        `,
        attachments: [
          {
            filename: "event-ticket.pdf",
            content: pdfBuffer,
          },
        ],
      };

      // 5. Send email
      const info = await transporter.sendMail(mailOptions);
      console.log("Ticket email sent:", info.response);
    });

    // Write PDF content
    doc.fontSize(20).text("🎟️ Gatherly Event Ticket", { align: "center" });
    doc.moveDown();
    doc.fontSize(14).text(`Name: ${username}`);
    doc.text(`Event: ${eventName}`);
    doc.moveDown();

    // Insert QR Code
    doc.image(qrBuffer, { fit: [150, 150], align: "center" });

    doc.end();
  } catch (error) {
    console.error("Error sending ticket mail:", error);
  }
};

module.exports = { sendTicketMail };

const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

const sendMail = async (toEmail, username) => {
  try {
    // Generate QR buffer
    const qrBuffer = await QRCode.toBuffer("Testing data");

    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_SECURITY_KEY,
      },
    });

    // Mail options
    const mailOptions = {
      from: `"Gatherly Team" <${process.env.GMAIL}>`,
      to: toEmail,
      subject: "Welcome to Gatherly 🎉",
      text: `Hello ${username}, Thanks for joining Gatherly! Visit: https://gatherly07.netlify.app/`,
      html: `
        <p>Hello <strong>${username}</strong>,</p>
        <p>Thanks for joining <b>Gatherly</b>! 🎉</p>
        <p>
          <a href="https://gatherly07.netlify.app/" 
             style="padding:10px 20px;background:#4CAF50;color:white;
             border-radius:5px;text-decoration:none;">
             Visit Gatherly
          </a>
        </p>
        <br/>
        <p>Your QR Ticket:</p>
        <img src="cid:qrimage" alt="QR Code"/>
        <br/>
        <p>Best Regards,<br/>Gatherly Team</p>
        <hr/>
        <small>If you didn’t request this, you can ignore this email.</small>
      `,
      attachments: [
        {
          filename: "ticket-qr.png",
          content: qrBuffer,
          cid: "qrimage" // same as used in <img src="cid:qrimage"/>
        }
      ],
    };

    // Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Email sent: " + info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

module.exports = { sendMail };

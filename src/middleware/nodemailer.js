const nodemailer = require("nodemailer");

const sendMail = async (toEmail, username) => {
  try {
    // Create transporter
    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.GMAIL,
        pass: process.env.GMAIL_SECURITY_KEY,
      },
    });

    const mailOptions = {
      from: process.env.GMAIL_USER,
      to: toEmail,
      subject: "Welcome to Gatherly 🎉",
      text: `Hello ${username},\n\nThank you for registering at Gatherly! We are excited to have you onboard.\n\nVisit us: https://gatherly07.netlify.app/\n\nBest Regards,\nGatherly Team`,

      html: `
  <p>Hello <strong>${username}</strong>,</p>
  <p>Thank you for registering at <b>Gatherly</b>! 🎉</p>
  <p>We are excited to have you onboard.</p>
  <br/>
  <a href="https://gatherly07.netlify.app/" 
     style="display:inline-block;padding:12px 24px;
            background-color:#4CAF50;color:#fff;
            text-decoration:none;border-radius:6px;
            font-weight:bold;">
    Visit Gatherly
  </a>
  <br/><br/>
  <p>Best Regards,<br/>Gatherly Team</p>
`,
    };

    // Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log("Email sent: " + info.response);
  } catch (error) {
    console.error("Error sending email:", error);
  }
};

module.exports = { sendMail };

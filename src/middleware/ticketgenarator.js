const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const { PassThrough } = require("stream");

const sendTicketMail = async (
  toEmail,
  username,
  userId,
  eventId,
  eventName,
  eventDate,
  eventTime,
  eventVenue
) => {
  try {
    const dateObj = new Date(eventDate);
    dateObj.toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const shortUsername = username.length > 6 ? username.slice(0, 6) : username;
    const shortEventName =
      eventName.length > 10 ? eventname.slice(0, 10) : eventname;
    // 1. Generate QR code with event + user info
    const qrData = `UserID: ${userId}, EventID: ${eventId}`;
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
         <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; border:1px solid #eee; border-radius:10px; overflow:hidden;">
    
    <!-- HEADER -->
    <div style="background:linear-gradient(135deg, hsl(262 83% 58%), hsl(232 83% 68%)); padding:25px; text-align:center; color:white;">
      <h1 style="margin:0; font-size:24px;">🎉 Your Booking is Confirmed! 🎉</h1>
    </div>
    
    <!-- BODY -->
    <div style="padding:25px;">
      <p style="font-size:16px;">Hi <strong>${username}</strong>,</p>
      <p style="font-size:16px;">Thank you for booking with <b>Gatherly</b>. Here are your booking details:</p>
      
      <!-- EVENT DETAILS CARD -->
      <div style="background:#f9f9f9; padding:20px; border-radius:10px; margin:25px 0; border-left:5px solid #4CAF50;">
        <p style="margin:8px 0;"><strong>📌 Event:</strong> ${eventName}</p>
        <p style="margin:8px 0;"><strong>📅 Date:</strong> ${dateObj}</p>
        <p style="margin:8px 0;"><strong>⏰ Time:</strong> ${eventTime}</p>
        <p style="margin:8px 0;"><strong>📍 Venue:</strong> ${eventVenue}</p>
      </div>
      
      <!-- QR CODE HIGHLIGHT -->
      <div style="background:#FFF3CD; border:1px solid #FFEEBA; padding:20px; border-radius:10px; margin:20px 0; text-align:center;">
        <h3 style="margin:0; color:#856404;">🎟️ Important Entry Pass</h3>
        <p style="font-size:15px; color:#856404; margin-top:10px;">
          Please present the <b>QR Code</b> below at the event entrance 🚪
        </p>
       
      </div>
      
      <!-- CTA BUTTON -->
      <div style="text-align:center; margin:30px 0;">
        <a href="https://gatherly07.netlify.app/" 
           style="background:linear-gradient(135deg, hsl(262 83% 58%), hsl(232 83% 68%));
                  color:white; padding:14px 30px; display:inline-block;
                  border-radius:8px; text-decoration:none; font-size:16px; font-weight:bold;
                  box-shadow:0 4px 10px rgba(0,0,0,0.15);">
          🔗 View My Bookings
        </a>
      </div>
      
      <!-- FOOTER MESSAGE -->
      <p style="font-size:15px; color:#555; line-height:1.6;">
        We can’t wait to see you at <b>${eventName}</b>! 🎊  
        Get ready for an amazing experience 🚀
      </p>
      
      <p style="font-size:14px; color:#777; margin-top:30px;">— The Gatherly Team 💚</p>
    </div>
    
    <!-- FOOTER -->
    <div style="background:#f1f1f1; text-align:center; padding:12px; font-size:12px; color:#666;">
      <p>If you didn’t book this event, you can safely ignore this email.</p>
    </div>
  </div>
        `,
        attachments: [
          {
            filename: `${shortUsername}-${shortEventName}.pdf`,
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

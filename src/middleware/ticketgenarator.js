const nodemailer = require("nodemailer");
const QRCode = require("qrcode");
const PDFDocument = require("pdfkit");
const axios = require("axios");

async function loadImageBuffer(url) {
  const response = await axios.get(url, { responseType: "arraybuffer" });
  return Buffer.from(response.data, "binary");
}

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
    const formattedDate = new Date(eventDate).toLocaleDateString("en-IN", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });

    const shortUsername = username.length > 6 ? username.slice(0, 6) : username;
    const shortEventName =
      eventName.length > 10 ? eventName.slice(0, 10) : eventName;

    // 1️⃣ Generate QR code with event + user info
    const qrData = `UserID: ${userId}, EventID: ${eventId}`;
    const qrBuffer = await QRCode.toBuffer(qrData);

    // 2️⃣ Load icons (run before PDF create)
    const userIcon = await loadImageBuffer(
      "https://img.icons8.com/ios-filled/50/000000/user.png"
    );
    const eventIcon = await loadImageBuffer(
      "https://img.icons8.com/ios-filled/50/000000/calendar.png"
    );
    const venueIcon = await loadImageBuffer(
      "https://img.icons8.com/ios-filled/50/000000/marker.png"
    );
    const dateIcon = await loadImageBuffer(
      "https://img.icons8.com/ios-filled/20/000000/calendar.png"
    );
    const timeIcon = await loadImageBuffer(
      "https://img.icons8.com/ios-filled/20/000000/clock.png"
    );

    // 3️⃣ Generate PDF with icons, QR, and user info
    const doc = new PDFDocument({ margin: 50, size: "A4" });
    const buffers = [];
    doc.on("data", buffers.push.bind(buffers));
    doc.on("end", async () => {
      const pdfBuffer = Buffer.concat(buffers);

      // 4️⃣ Nodemailer transporter
      const transporter = nodemailer.createTransport({
        service: "gmail",
        auth: {
          user: process.env.GMAIL,
          pass: process.env.GMAIL_SECURITY_KEY,
        },
      });

      // 5️⃣ Prepare mail options (your HTML kept unchanged)
      const mailOptions = {
        from: `"Gatherly Team" <${process.env.GMAIL}>`,
        to: toEmail,
        subject: `🎟️ Booking Confirmation - ${eventName}`,
        text: `Hello ${username},\n\nHere is your ticket for ${eventName}.`,
        html: `
        <div style="font-family: Arial, sans-serif; max-width:600px; margin:0 auto; border:1px solid #eee; border-radius:10px; overflow:hidden;">
        <!-- HEADER -->
        <div style="background:linear-gradient(90deg,#4CAF50,#2E7D32); padding:20px; text-align:center; color:white;">
            <h2 style="margin:0;">🎉 Your Booking is Confirmed!</h2>
          </div>
        <!-- BODY -->
        <div style="padding:25px;">
          <p style="font-size:16px;">Hi <strong>${username}</strong>,</p>
          <p style="font-size:16px;">Thank you for booking with <b>Gatherly</b>. Here are your booking details:</p>
          <!-- EVENT DETAILS CARD -->
          <div style="background:#f9f9f9; padding:20px; border-radius:10px; margin:25px 0; border-left:5px solid #4CAF50;">
            <p style="margin:8px 0;"><strong>📌 Event:</strong> ${eventName}</p>
            <p style="margin:8px 0;"><strong>📅 Date:</strong> ${formattedDate}</p>
            <p style="margin:8px 0;"><strong>⏰ Time:</strong> ${eventTime}</p>
            <p style="margin:8px 0;"><strong>📍 Venue:</strong> ${eventVenue}</p>
          </div>
          <!-- QR CODE HIGHLIGHT -->
          <div style="background:#FFF3CD; border:1px solid #FFEEBA; padding:20px; border-radius:10px; margin:20px 0; text-align:center;">
            <h3 style="margin:0; color:#856404;">🎟️ Important Entry Pass</h3>
            <p style="font-size:15px; color:#856404; margin-top:10px;">
              <p style="font-size:15px; color:#856404; margin-top:10px;">
  Please download and open the attached PDF ticket. Show the <b>QR Code</b> inside the PDF at the event entrance for verification.
</p>

            </p>
          </div>
          <!-- CTA BUTTON -->
          <div style="text-align:center; margin:30px 0;">
            <a href="https://gatherly07.netlify.app/" 
               style="background:linear-gradient(90deg,#4CAF50,#2E7D32);
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

      // 6️⃣ Send email
      const info = await transporter.sendMail(mailOptions);
      console.log("Ticket email sent:", info.response);
    });

    // Write new PDF with icons and layout
    // Draw a colored (green) header rectangle at the top
    doc
      .rect(0, 40, doc.page.width, 42) // (x, y, width, height)
      .fill("#2E7D32");

    // Add the ticket title in white over the background, centered
    doc.fontSize(20).fillColor("#fff").text("Gatherly Event Ticket", 0, 52, {
      align: "center",
      width: doc.page.width,
    });
    doc.moveDown();

    // USER INFO (with icons)
    doc.image(userIcon, 50, 120, { width: 18, height: 18 });
    doc.fontSize(14).fillColor("#333").text(`Name: ${username}`, 80, 120);
    doc.image(eventIcon, 50, 150, { width: 18, height: 18 });
    doc.text(`Event: ${eventName}`, 80, 150);
    doc.image(venueIcon, 50, 180, { width: 18, height: 18 });
    doc.text(`Venue: ${eventVenue}`, 80, 180);
    doc.image(dateIcon, 50, 180, { width: 18, height: 18 });
    doc.text(`Date: ${formattedDate}`, 80, 210);
    doc.image(timeIcon, 50, 180, { width: 18, height: 18 });
    doc.text(`Time: ${eventTime}`, 80, 240);

    // QR CODE
    doc.moveDown().moveDown();
    doc
      .fontSize(14)
      .fillColor("#000")
      .text("Scan this QR at the entrance:", { align: "center" });
    doc.image(qrBuffer, doc.page.width / 2 - 75, 300, {
      width: 150,
      height: 150,
    });
    doc.end();
  } catch (error) {
    console.error("Error sending ticket mail:", error);
  }
};

module.exports = { sendTicketMail };

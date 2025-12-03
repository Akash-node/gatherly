const nodemailer = require("nodemailer");
const QRCode = require("qrcode");

const sendMail = async (toEmail, username) => {
  try {
    // Generate QR buffer
    const qrBuffer = await QRCode.toBuffer("Testing data");

    // Create transporter
    const transporter = nodemailer.createTransport({
      host : "smtp.gmail.com",
      port: 587, // 587 or 465
      secure: false,
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
      text: `Hello ${username}, Thanks for joining Gatherly! Visit: https://gatherly07.netlify.app`,
      html: `
        <html lang="en" style="margin:0;padding:0;">
  <head>
    <meta charset="utf-8">
    <meta name="x-apple-disable-message-reformatting">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <title>Welcome</title>
    <style>
      @media (prefers-color-scheme: dark) {
        .wrapper { background:#0f172a !important; }
        .card { background:#111827 !important; border-color:#1f2937 !important; }
        .text { color:#e5e7eb !important; }
        .muted { color:#9ca3af !important; }
        .btn { background:linear-gradient(135deg,#8b5cf6,#3b82f6) !important; }
      }
      @media only screen and (max-width:600px) {
        .container { width:100% !important; padding:16px !important; }
        .h1 { font-size:22px !important; }
        .btn { display:block !important; width:100% !important; }
      }
    </style>
  </head>
  <body style="margin:0;padding:0;background:#f3f4f6;">
    <table class="wrapper" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#f3f4f6;padding:24px 0;">
      <tr>
        <td align="center">
          <table class="container" role="presentation" cellpadding="0" cellspacing="0" width="600" style="width:600px;max-width:100%;background:transparent;padding:0 24px;">
            <!-- Header -->
            <tr>
              <td align="center" style="padding:8px 0 16px;">
                <a href="https://gatherly07.netlify.app" style="text-decoration:none;">
                  <div style="font-family:Inter,Segoe UI,Arial,sans-serif;font-weight:700;font-size:20px;color:#111827;">
                    Gatherly
                  </div>
                </a>
              </td>
            </tr>

            <!-- Card -->
            <tr>
              <td>
                <table class="card" role="presentation" cellpadding="0" cellspacing="0" width="100%" style="background:#ffffff;border:1px solid #e5e7eb;border-radius:12px;overflow:hidden;">
                  <!-- Hero bar -->
                  <tr>
                    <td style="height:6px;background:linear-gradient(135deg,#8b5cf6,#3b82f6);"></td>
                  </tr>

                  <tr>
                    <td style="padding:28px;">
                      <!-- Content -->
                      <h1 class="h1 text" style="margin:0 0 12px 0;font-family:Inter,Segoe UI,Arial,sans-serif;font-size:24px;line-height:1.3;color:#111827;">
                        Welcome, ${username} 👋
                      </h1>

                      <p class="text" style="margin:0 0 16px 0;font-family:Inter,Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.6;color:#374151;">
                        We’re excited to have you join <strong>Gatherly</strong> — your one-stop platform for discovering and booking amazing events.
                      </p>

                      <p class="text" style="margin:0 0 16px 0;font-family:Inter,Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.6;color:#374151;">
                        Your account has been successfully created with the email <strong>${toEmail}</strong>.
                      </p>

                      <p class="text" style="margin:0 0 16px 0;font-family:Inter,Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.6;color:#374151;">
                        From now on, you can explore upcoming events, purchase tickets securely, and attend events — all in one place.
                      </p>

                      <p class="text" style="margin:0 0 16px 0;font-family:Inter,Segoe UI,Arial,sans-serif;font-size:15px;line-height:1.6;color:#374151;">
                        👉 To get started, head over to your personal dashboard.
                      </p>

                      <!-- CTA -->
                      <table role="presentation" cellpadding="0" cellspacing="0" style="margin:8px 0 12px;">
                        <tr>
                          <td>
                            <a class="btn" href="https://gatherly07.netlify.app/user-profile" 
                               style="display:inline-block;background:linear-gradient(135deg,#6366f1,#3b82f6);color:#ffffff;text-decoration:none;font-family:Inter,Segoe UI,Arial,sans-serif;font-weight:600;font-size:14px;padding:12px 18px;border-radius:10px;">
                              Go to my dashboard
                            </a>
                          </td>
                        </tr>
                      </table>
                    </td>
                  </tr>

                  <!-- Footer strip -->
                  <tr>
                    <td style="padding:16px 20px;background:#f9fafb;border-top:1px solid #e5e7eb;">
                      <p class="muted" style="margin:0;font-family:Inter,Segoe UI,Arial,sans-serif;font-size:12px;color:#6b7280;">
                        Need help? Reply to this email or reach us at <a href="mailto:gatherly07@gmail.com" style="color:#3b82f6;text-decoration:none;">gatherly07@gmail.com</a>.
                      </p>
                    </td>
                  </tr>
                </table>
              </td>
            </tr>

            <!-- Legal -->
            <tr>
              <td align="center" style="padding:16px 8px;">
                <p class="muted" style="margin:0;font-family:Inter,Segoe UI,Arial,sans-serif;font-size:12px;color:#9ca3af;">
                  © 2025 Gatherly • You’re receiving this because you created an account.
                </p>
              </td>
            </tr>

          </table>
        </td>
      </tr>
    </table>
  </body>
</html>


      `,
    };

    // Send mail
    const info = await transporter.sendMail(mailOptions);
    console.log("✅ Registration Email sent: " + info.response);
  } catch (error) {
    console.error("❌ Error sending email:", error);
  }
};

module.exports = { sendMail };

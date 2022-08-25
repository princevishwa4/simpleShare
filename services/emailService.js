const nodemailer = require("nodemailer");

async function sendMail({ from, to, subject, text, html }) {
  let transporter = nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: process.env.SMTP_PORT,
    secure: false,
    auth: {
      user: process.env.SMTP_LOGIN,
      pass: process.env.SMTP_PASS,
    },
  });

  let info = await transporter.sendMail({
    from: `simpleShare <${from}>`,
    to,
    subject,
    text,
    html,
  });
}

module.exports = sendMail;

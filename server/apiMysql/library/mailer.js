const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT ? parseInt(process.env.SMTP_PORT, 10) : 465,
  secure: (process.env.SMTP_SECURE === 'true') || true, 
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS
  },
  connectionTimeout: 10000,
  greetingTimeout: 5000,
  socketTimeout: 10000
});


transporter.verify((err, success) => {
  if (err) {
    console.error('✉️ Nodemailer verify failed:', err.message || err);
  } else {
    // console.log('✉️ Email transporter ready');
  }
});


function escapeHtml(str = '') {
  return String(str)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#039;');
}


async function sendMail({ to, subject, html, text, replyTo }) {
  const senderEmail = process.env.NOTIF_FROM || process.env.SMTP_USER;
  const senderName = process.env.NOTIF_NAME || 'CSR-SETARA';
  
  const mailOptions = {
    from: `"${senderName}" <${senderEmail}>`,
    to,
    subject,
    html,
    text: text || (html ? html.replace(/<[^>]*>/g, '') : ''),
    replyTo: replyTo || undefined
  };

  return transporter.sendMail(mailOptions);
}

module.exports = {
  transporter,
  sendMail,
  escapeHtml
};

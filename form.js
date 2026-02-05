// api/form.js
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

module.exports = async (req, res) => {
  if (req.method === 'POST') {
    let body = '';
    
    req.on('data', chunk => {
      body += chunk.toString();
    });

    req.on('end', async () => {
      try {
        let { name, email, text } = JSON.parse(body);
        // if (!email || !text) {
        //   return res.status(400).json({ error: 'Missing email or text' });
        // }
        name = name ? name : "NoName"
        email = email ? email : "@NoMail"
        text = text ? text : "NoText"
        
        // Настройка SendGrid
        sgMail.setApiKey(process.env.SENDGRID_API_KEY);  // API key из Vercel env
        
        const msg = {
          to: 'ivantimofeev1912@gmail.com',  // Твоя почта для получения
          from: 'sender@example.com',    // Подтвержденный email в SendGrid
          subject: 'New Form Submission',
          text: `Name: ${name}\nEmail: ${email}\nMessage: ${text}`,
          html: `<strong>Name:</strong> ${name}<br><strong>Email:</strong> ${email}<br><strong>Message:</strong> ${text}`,
        };
        
        await sgMail.send(msg);
        
        console.log(`Form submitted: ${name}, ${email}, ${text}`);
        res.status(200).json({ message: 'Form submitted and email sent!' });
      } catch (error) {
        console.log(error);
        res.status(500).json({ error: 'Error sending email' });
      }
    });
  } else {
    res.setHeader('Allow', ['POST']);
    res.status(405).end(`Method ${req.method} Not Allowed`);
  }
};
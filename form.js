// api/form.js
const nodemailer = require('nodemailer');
const sgMail = require('@sendgrid/mail');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', 'https://jhn611.github.io'); 
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');


  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

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
        
        // Настройка Nodemailer для Brevo (SMTP)
        const transporter = nodemailer.createTransport({
          host: 'smtp-relay.brevo.com',
          port: 587,
          secure: false, // true для 465, false для 587 + STARTTLS
          auth: {
            user: 'apikey',           // Всегда именно "apikey" для Brevo
            pass: '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'  // Твой API-ключ из Brevo
          }
        });

        // Сообщение
        const mailOptions = {
          from: '"Form Submission" <tutktoto05@gmail.com>', // Обязательно верифицированный email в Brevo
          to: 'ivantimofeev1912@gmail.com',           // Куда приходят письма (твоя почта)
          subject: 'Новая заявка с формы',
          text: `Имя: ${name}\nEmail: ${email}\nСообщение:\n${text}`,
          html: `
            <h3>Новая заявка</h3>
            <p><strong>Имя:</strong> ${name}</p>
            <p><strong>Email:</strong> ${email}</p>
            <p><strong>Сообщение:</strong><br>${text.replace(/\n/g, '<br>')}</p>
          `
        };

        await transporter.sendMail(mailOptions);

        console.log(`Форма отправлена: ${name}, ${email}`);
        res.status(200).json({ message: 'Форма успешно отправлена!' });
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
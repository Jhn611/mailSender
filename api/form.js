// api/form.js
const nodemailer = require('nodemailer');

module.exports = async (req, res) => {
  res.setHeader('Access-Control-Allow-Origin', '*'); 
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
        
       // Настройка Nodemailer для Resend
        const transporter = nodemailer.createTransport({
          host: 'smtp.resend.com',
          port: 587,
          secure: false, // STARTTLS
          auth: {
            user: 'resend',                 // Всегда именно 'resend'
            pass: process.env.RESEND_API_KEY // Твой новый ключ из Resend
          }
        });

        // Сообщение
        const mailOptions = {
          from: 'tutktoto05@gmail.com', // ← можно использовать по умолчанию или свой верифицированный email
          to: 'ivantimofeev1912@gmail.com',
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
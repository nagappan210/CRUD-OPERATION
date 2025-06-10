const nodemailer = require('nodemailer');
const transport = nodemailer.createTransport({
  service : 'gmail',
  auth :{
    user : 's.nagappan.6.9.2003@gmail.com',
    pass : 'kavk qmvd olfi fcps',
  }
})

const sendMailToUser = async (name,email)=>{
  try{
    const info = await transport.sendMail({
      from : '"My App"<s.nagappan.6.9.2003@gmail.com>',
      to: email, 
      subject: 'Welcome to My App',
      text: `Hello ${name}, welcome to My App!`,
      html: `
        <h2>Hello ${name}, </h2>  
        
        <p>Thanks for joining <b>My App</b>.</p>
        <p>We’re happy to have you on board!</p>
      `
    })
    console.log('Email sent successfully to', email);
  }
  catch (error) {
    console.error('Error sending email:', error);
  }
}

module.exports = sendMailToUser; 
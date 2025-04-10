import nodemailer from 'nodemailer'
import upgradeStorageTemplate from './mailTemplates/upgradeStorage'
const transporter = nodemailer.createTransport({
    //using zoho mail
    host: "smtp.zoho.in",
    port: 465,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });

  //send email function
export const sendEmail = async (name: string, email: string, subject: string, plan: string | number) => {
  const mail = await transporter.sendMail({
      from: '"Nafri" <support@nafri.in>',
      to: email,
      subject: subject,
      html: upgradeStorageTemplate(name, plan as string),
  })
  return mail;
}


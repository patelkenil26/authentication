import { Resend } from "resend";
import { 
  getVerificationEmailTemplate, 
  getResetPasswordEmailTemplate,
  getWelcomeEmailTemplate,
  getPasswordChangedEmailTemplate,
  getDeveloperAppRegisteredEmailTemplate
} from "../templates/emails/auth.email.js";

const resend = new Resend(process.env.RESEND_API_KEY);

const FROM_EMAIL = process.env.EMAIL_FROM; 

const sendEmail = async (to, subject, html) => {
  try {
    const data = await resend.emails.send({
      from: FROM_EMAIL,
      to,
      subject,
      html,
    });
    console.log("Email sent successfully via Resend:", data.id);
    return data;
  } catch (error) {
    console.error("Resend API Error:", error);
    throw error;
  }
};

const sendVerificationEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL || "http://localhost:3000"}/verify-email/${token}`;
  await sendEmail(email, "Verify your Identity Provider Account", getVerificationEmailTemplate(url));
};

const sendResetPasswordEmail = async (email, token) => {
  const url = `${process.env.CLIENT_URL || "http://localhost:3000"}/reset-password/${token}`;
  await sendEmail(email, "Reset your Password", getResetPasswordEmailTemplate(url));
};

const sendWelcomeEmail = async (email, name) => {
  await sendEmail(email, "Welcome to ChaiAuth!", getWelcomeEmailTemplate(name));
};

const sendPasswordChangedEmail = async (email) => {
  await sendEmail(email, "Your password was changed", getPasswordChangedEmailTemplate());
};

const sendDeveloperAppRegisteredEmail = async (email, appName, clientId) => {
  await sendEmail(email, "OAuth App Registered", getDeveloperAppRegisteredEmailTemplate(appName, clientId));
};

export {
  sendVerificationEmail,
  sendResetPasswordEmail,
  sendWelcomeEmail,
  sendPasswordChangedEmail,
  sendDeveloperAppRegisteredEmail
};

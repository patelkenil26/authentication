export const getVerificationEmailTemplate = (url) => {
  return `
    <div style="font-family: sans-serif; padding: 20px; text-align: center; background-color: #f9f9f9; border-radius: 8px;">
      <h2>Welcome to Our Identity Provider!</h2>
      <p style="color: #555;">Please verify your email address to complete your registration.</p>
      <a href="${url}" style="display: inline-block; padding: 12px 24px; margin-top: 15px; background-color: #000; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Verify Email
      </a>
    </div>
  `;
};

export const getResetPasswordEmailTemplate = (url) => {
  return `
    <div style="font-family: sans-serif; padding: 20px; text-align: center; background-color: #f9f9f9; border-radius: 8px;">
      <h2>Password Reset Request</h2>
      <p style="color: #555;">Click the button below to reset your password. This link expires in 15 minutes.</p>
      <a href="${url}" style="display: inline-block; padding: 12px 24px; margin-top: 15px; background-color: #d9534f; color: #fff; text-decoration: none; border-radius: 6px; font-weight: bold;">
        Reset Password
      </a>
    </div>
  `;
};

export const getWelcomeEmailTemplate = (name) => {
  return `
    <div style="font-family: sans-serif; padding: 20px; text-align: center; background-color: #f9f9f9; border-radius: 8px;">
      <h2>Hello ${name}, Welcome Aboard! 🎉</h2>
      <p style="color: #555;">Your email has been successfully verified. You now have full access to your account.</p>
      <p style="color: #555;">Thank you for joining our platform!</p>
    </div>
  `;
};

export const getPasswordChangedEmailTemplate = () => {
  return `
    <div style="font-family: sans-serif; padding: 20px; text-align: center; background-color: #f9f9f9; border-radius: 8px;">
      <h2>Security Alert</h2>
      <p style="color: #555;">Your password was recently changed successfully.</p>
      <p style="color: #d9534f; font-size: 12px;">If you did not make this change, please contact support immediately.</p>
    </div>
  `;
};

export const getDeveloperAppRegisteredEmailTemplate = (appName, clientId) => {
  return `
    <div style="font-family: sans-serif; padding: 20px; text-align: center; background-color: #f9f9f9; border-radius: 8px;">
      <h2>App Registered Successfully 🚀</h2>
      <p style="color: #555;">You have successfully registered a new OAuth App: <strong>${appName}</strong>.</p>
      <p style="background: #e5e7eb; padding: 10px; border-radius: 4px; display: inline-block;">Client ID: ${clientId}</p>
      <p style="color: #d9534f; font-size: 12px;">Reminder: Keep your Client Secret completely secure. Never expose it in frontend code.</p>
    </div>
  `;
};

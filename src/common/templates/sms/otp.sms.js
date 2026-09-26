export const getOtpSmsTemplate = (otp) => {
  return `ChaiAuth: Your login OTP is ${otp}. Do not share this code with anyone.`;
};

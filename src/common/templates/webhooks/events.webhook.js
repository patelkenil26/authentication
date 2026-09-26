export const getUserCreatedWebhookPayload = (user) => {
  return {
    event: "user.created",
    timestamp: new Date().toISOString(),
    data: {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role
    }
  };
};

export const getOidcErrorPageTemplate = (errorMessage) => {
  return `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <title>Authorization Error</title>
      <style>
        body { font-family: sans-serif; background-color: #f4f4f5; display: flex; justify-content: center; align-items: center; height: 100vh; margin: 0; }
        .error-card { background: white; padding: 40px; border-radius: 8px; box-shadow: 0 4px 6px rgba(0,0,0,0.1); text-align: center; max-width: 400px; }
        .error-title { color: #ef4444; margin-top: 0; }
        .error-message { color: #52525b; margin-bottom: 20px; }
      </style>
    </head>
    <body>
      <div class="error-card">
        <h2 class="error-title">Authorization Failed</h2>
        <p class="error-message">${errorMessage}</p>
        <p style="font-size: 12px; color: #a1a1aa;">Please contact the developer of the application you are trying to use.</p>
      </div>
    </body>
    </html>
  `;
};

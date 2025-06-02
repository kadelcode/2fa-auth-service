function getPasswordResetEmailHTML(resetLink, userName = 'User') {
  return `
    <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
      <h2>Hello ${userName},</h2>
      <p>You recently requested to reset your password. Click below to reset it:</p>

      <p style="text-align: center;">
        <a 
          href="${resetLink}" 
          style="background-color: #007bff; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">
          Reset Password
        </a>
      </p>

      <p>If the button doesn't work, copy and paste this URL into your browser:</p>
      <p style="word-break: break-all;">${resetLink}</p>

      <p>This link will expire in 1 hour. If you didn’t request it, just ignore this email.</p>

      <p>Thanks,<br>The 2FA Auth Team</p>
    </div>
  `;
}

module.exports = getPasswordResetEmailHTML;

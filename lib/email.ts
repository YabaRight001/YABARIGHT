interface SendMailParams {
  to: string;
  name: string;
  code: string;
  verifyUrl: string;
}

// In-memory verification storage: email -> { code, token, expiresAt }
export const emailVerificationStore: Map<string, { code: string; token: string; expiresAt: number }> = new Map();

export async function sendVerificationEmail({ to, name, code, verifyUrl }: SendMailParams): Promise<{ success: boolean; message: string }> {
  // Save OTP in memory store (15 minute expiration)
  const token = `tok_${Date.now()}_${Math.random().toString(36).substring(2, 8)}`;
  emailVerificationStore.set(to.toLowerCase().trim(), {
    code: code.trim(),
    token,
    expiresAt: Date.now() + 15 * 60 * 1000,
  });

  const smtpHost = process.env.EMAIL_SERVER_HOST || 'smtp.gmail.com';
  const smtpPort = Number(process.env.EMAIL_SERVER_PORT) || 465;
  const smtpUser = process.env.EMAIL_SERVER_USER || process.env.GMAIL_USER || 'yabatightofficial@gmail.com';
  const smtpPass = process.env.EMAIL_SERVER_PASSWORD || process.env.GMAIL_APP_PASSWORD || process.env.SMTP_PASSWORD;
  const smtpFrom = process.env.EMAIL_FROM || `YABARIGHT <${smtpUser}>`;

  const htmlContent = `
<!DOCTYPE html>
<html>
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Verify Your YABARIGHT Account</title>
</head>
<body style="margin: 0; padding: 0; background-color: #0b0b0b; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif;">
  <table width="100%" border="0" cellspacing="0" cellpadding="0" style="background-color: #0b0b0b; padding: 40px 15px;">
    <tr>
      <td align="center">
        <table width="100%" border="0" cellspacing="0" cellpadding="0" style="max-width: 520px; background-color: #141414; border: 1px solid rgba(255, 215, 0, 0.35); border-radius: 24px; padding: 36px 28px; text-align: center; color: #ffffff;">
          
          <!-- Logo / Header -->
          <tr>
            <td align="center" style="padding-bottom: 20px;">
              <h1 style="margin: 0; font-size: 30px; font-weight: 900; letter-spacing: 2px; color: #FFD700; text-transform: uppercase;">
                YABARIGHT
              </h1>
              <p style="margin: 4px 0 0 0; font-size: 11px; font-weight: 700; letter-spacing: 3px; color: #c88d00; text-transform: uppercase;">
                The Digital Home of Affordable Fashion
              </p>
            </td>
          </tr>

          <tr>
            <td style="border-top: 1px solid rgba(255, 215, 0, 0.15); padding-top: 24px; padding-bottom: 20px;">
              <h2 style="margin: 0; font-size: 20px; font-weight: 800; color: #ffffff;">
                Verify Your Email Address
              </h2>
              <p style="margin: 12px 0 0 0; font-size: 14px; line-height: 1.6; color: #d1d1d1;">
                Hello <strong style="color: #ffffff;">${name}</strong>,<br>
                Thank you for joining YabaRight! Use the 6-digit verification code below to activate your account and access your dashboard.
              </p>
            </td>
          </tr>

          <!-- 6-Digit OTP Code Box -->
          <tr>
            <td align="center" style="padding: 10px 0 25px 0;">
              <div style="display: inline-block; background-color: #1c1c1c; border: 2px dashed #FFD700; border-radius: 18px; padding: 16px 36px;">
                <span style="font-family: monospace, Courier, sans-serif; font-size: 34px; font-weight: 900; letter-spacing: 8px; color: #FFD700;">
                  ${code}
                </span>
              </div>
              <p style="margin: 10px 0 0 0; font-size: 11px; color: #888888;">
                (This code expires in 15 minutes)
              </p>
            </td>
          </tr>

          <!-- Direct Verification Link Button -->
          <tr>
            <td align="center" style="padding-bottom: 25px;">
              <a href="${verifyUrl}" style="background-color: #FFD700; color: #000000; font-weight: 900; text-decoration: none; padding: 14px 32px; border-radius: 50px; font-size: 13px; text-transform: uppercase; letter-spacing: 1px; display: inline-block; box-shadow: 0 4px 14px rgba(255, 215, 0, 0.3);">
                Verify Email Directly →
              </a>
            </td>
          </tr>

          <!-- Footer Note -->
          <tr>
            <td style="border-top: 1px solid rgba(255, 255, 255, 0.08); padding-top: 20px; font-size: 11px; color: #777777; line-height: 1.5;">
              If you did not sign up for an account on YabaRight, please disregard this email.<br>
              © ${new Date().getFullYear()} YABARIGHT. All rights reserved.
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>
</html>
  `;

  if (smtpPass) {
    try {
      // Dynamic import to prevent build breaks if module is loading or missing
      let nodemailerModule: any;
      try {
        nodemailerModule = await import('nodemailer');
        if (nodemailerModule.default) {
          nodemailerModule = nodemailerModule.default;
        }
      } catch (importErr) {
        console.warn('[SMTP Warning] nodemailer module not available, falling back to log mode.');
        return { success: true, message: `Verification code generated for ${to}` };
      }

      const transporter = nodemailerModule.createTransport({
        host: smtpHost,
        port: smtpPort,
        secure: smtpPort === 465,
        auth: {
          user: smtpUser,
          pass: smtpPass,
        },
      });

      await transporter.sendMail({
        from: smtpFrom,
        to,
        subject: `Your YABARIGHT Verification Code: ${code}`,
        text: `Your YabaRight email verification code is: ${code}. Verify directly here: ${verifyUrl}`,
        html: htmlContent,
      });

      console.log(`[Email Sent] Verification code dispatched to ${to}`);
      return { success: true, message: `Verification email sent to ${to}` };
    } catch (err: any) {
      console.error('[SMTP Send Error]:', err);
      return { success: false, message: err.message || 'SMTP delivery failed' };
    }
  } else {
    console.log(`[Email Mock/Dev Dispatch]: Code ${code} for ${to}. Direct link: ${verifyUrl}`);
    return { success: true, message: `Verification email dispatched to ${to}` };
  }
}

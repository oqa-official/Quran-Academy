// lib/emailTemplate.ts
import Email from "@/models/email.model";


// lib/fallbackTemplates.ts
export const fallbackTemplates = {
  forgot_password: {
    subject: "Hi {{name}}, Recover Your Account!",
    bodyHtml: `
      <!DOCTYPE html>
      <html lang="en">
      <head><meta charset="UTF-8"></head>
      <body>
        <h2>Assalamu Alaikum {{name}},</h2>
        <p>Your student account has been created successfully. Please find your details below:</p>
        <p><b>Student ID:</b> {{userId}}</p>
        <p><b>Email:</b> {{email}}</p>
        <p><b>Password:</b> {{password}}</p>
        <p>Please keep your credentials safe and do not share them with others.</p>
        <p>BarakAllahu Feek,<br><b>Quran Academy Team</b></p>
      </body>
      </html>
    `,
  },

  instructor_added: {
    subject: "Welcome {{name}}, Your Instructor Account at Quran Academy",
    bodyHtml: `
      <!DOCTYPE html>
      <html lang="en" style="margin:0; padding:0;">
      <head><meta charset="UTF-8"></head>
      <body style="margin:0; padding:0; background-color:#ce9a06; font-family:Arial, sans-serif;">
        <table role="presentation" width="100%">
          <tr>
            <td align="center" style="padding:20px; background-color:#ce9a06;">
              <h1 style="color:#fff; margin:0;">Online Quran Academy</h1>
            </td>
          </tr>
          <tr>
            <td align="center" style="padding:20px;">
              <table role="presentation" width="100%" style="max-width:600px; background:#fff; border-radius:8px;">
                <tr>
                  <td style="padding:30px; color:#333; font-size:16px; line-height:1.5;">
                    <h2 style="color:#004d40; margin-top:0;">Assalamu Alaikum {{name}},</h2>
                    <p>Welcome to the Online Quran Academy team! Your instructor account has been created successfully. Please find your login details below:</p>
                    <p><b>Instructor ID:</b> {{userId}}</p>
                    <p><b>Email:</b> {{educationMail}}</p>
                    <p><b>Password:</b> {{password}}</p>
                    <p>Please keep your credentials safe and do not share them with others.</p>
                    <p style="margin-top:30px;">BarakAllahu Feek,<br><b>Online Quran Academy Team</b></p>
                  </td>
                </tr>
              </table>
            </td>
          </tr>
        </table>
      </body>
      </html>
    `,
  },
  student_added: {
    subject: "Welcome {{name}}, Your Student Account at Quran Academy",
    bodyHtml: `
     <!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>New Student Welcome Email</title>
    <style type="text/css">
      /* Reset CSS */
      body {
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      table, td {
        border-collapse: collapse;
      }
      img {
        border: 0;
        line-height: 100%;
        outline: none; 
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }

      /* Mobile-specific styles */
      @media only screen and (max-width: 620px) {
        .main-wrapper {
          width: 100% !important;
          min-width: 100% !important;
        }
        .content-table {
          width: 100% !important;
          min-width: 100% !important;
        }
        .content-padding {
          padding: 20px !important;
        }
        .cta-button a {
          width: 100% !important;
          display: block;
          text-align: center;
        }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#ce9a06; font-family:Arial, sans-serif;">
    <!-- Wrapper -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding:20px 0; background-color:#ce9a06;">
          <!-- Header -->
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_FiuEvVd-cPQAgyUEW7lKPSwlAf2XttphZxZR-B5qT6aIXXsKN5G-3kJoVu4RwdaOMis&usqp=CAU"
            alt="Quran Academy Logo"
            width="60"
            style="display:block; border-radius:50%; margin:0 auto; width:60px; height:auto;"
          />
          <h1 style="color:#ffffff; margin:10px 0 0 0; font-size:24px;">Online Quran Academy</h1>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:20px;">
          <!-- Main Content -->
          <table
            role="presentation"
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            class="content-table"
            style="max-width:600px; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.1);"
          >
            <tr>
              <td class="content-padding" style="padding:30px; text-align:left; color:#333333; font-size:16px; line-height:1.5;">
                <h2 style="color:#004d40; margin-top:0;">Assalamu Alaikum {{name}},</h2>
                <p>Welcome to the Online Quran Academy team! Your Student account has been created successfully. Please find your login details below:</p>
                <p><b>Student ID:</b> {{userId}}</p>
                <p><b>Email:</b> {{educationMail}}</p>
                <p><b>Password:</b> {{password}}</p>
                <p>Please keep your credentials safe and do not share them with others.</p>
                <p style="margin-top:20px;">We look forward to you guiding our students on their Quran learning journey.</p>
                <p style="margin-top:30px;">BarakAllahu Feek,<br><b>Online Quran Academy Team</b></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td align="center" style="padding:20px; background-color:#F4B400; color:#ffffff; font-size:12px;">
          <p style="margin:0;">© 2025 Online Quran Academy. All rights reserved.</p>
          <p style="margin:5px 0 0 0;">This email was sent by Online Quran Academy.</p>
        </td>
      </tr>
    </table>
  </body>
</html>
    `,
  },
  teacher_inquiry: {
    subject: "Dear {{name}}! We have recieved your application.",
    bodyHtml: `
     <!-- Subject: {{name}} we have received your application -->
<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Application Received</title>
    <style type="text/css">
      /* Reset CSS */
      body {
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      table, td {
        border-collapse: collapse;
      }
      img {
        border: 0;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }

      /* Mobile-specific styles */
      @media only screen and (max-width: 620px) {
        .main-wrapper {
          width: 100% !important;
          min-width: 100% !important;
        }
        .content-table {
          width: 100% !important;
          min-width: 100% !important;
        }
        .content-padding {
          padding: 20px !important;
        }
        .cta-button a {
          width: 100% !important;
          display: block;
          text-align: center;
        }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#ce9a06; font-family:Arial, sans-serif;">
    <!-- Wrapper -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding:20px 0; background-color:#ce9a06;">
          <!-- Header -->
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_FiuEvVd-cPQAgyUEW7lKPSwlAf2XttphZxZR-B5qT6aIXXsKN5G-3kJoVu4RwdaOMis&usqp=CAU"
            alt="Quran Academy Logo"
            width="60"
            style="display:block; border-radius:50%; margin:0 auto; width:60px; height:auto;"
          />
          <h1 style="color:#ffffff; margin:10px 0 0 0; font-size:24px;">Online Quran Academy</h1>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:20px;">
          <!-- Main Content -->
          <table
            role="presentation"
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            class="content-table"
            style="max-width:600px; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.1);"
          >
            <tr>
              <td class="content-padding" style="padding:30px; text-align:left; color:#333333; font-size:16px; line-height:1.5;">
                <h2 style="color:#004d40; margin-top:0;">Assalamu Alaikum {{name}},</h2>
                <p>We are writing to confirm that we have successfully received your application to join our team of instructors. Thank you for your interest in guiding our students on their Quran learning journey.</p>
                <p>Our team will now carefully review the information you have provided. We will be in touch with you as soon as our review is complete to let you know the next steps.</p>
                <p style="margin-top:20px;">We appreciate your patience and look forward to potentially working with you.</p>
                <p style="margin-top:30px;">BarakAllahu Feek,<br><b>Online Quran Academy Team</b></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td align="center" style="padding:20px; background-color:#ce9a06; color:#ffffff; font-size:12px;">
          <p style="margin:0;">© 2025 Online Quran Academy. All rights reserved.</p>
          <p style="margin:5px 0 0 0;">This email was sent by Online Quran Academy.</p>
        </td>
      </tr>
    </table>
  </body>
</html>

    `,
  },

  inquiry_fill: {
    subject: "Dear {{name}}! We have recieved your Inquiry.",
    bodyHtml: `
   <!-- Subject: We have received your inquiry, {{name}} -->
<!DOCTYPE html>
<html lang="en" style="margin:0; padding:0;">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Inquiry Received</title>
    <style type="text/css">
      /* Reset CSS */
      body {
        margin: 0;
        padding: 0;
        -webkit-text-size-adjust: 100%;
        -ms-text-size-adjust: 100%;
      }
      table, td {
        border-collapse: collapse;
      }
      img {
        border: 0;
        line-height: 100%;
        outline: none;
        text-decoration: none;
        -ms-interpolation-mode: bicubic;
      }

      /* Mobile-specific styles */
      @media only screen and (max-width: 620px) {
        .main-wrapper {
          width: 100% !important;
          min-width: 100% !important;
        }
        .content-table {
          width: 100% !important;
          min-width: 100% !important;
        }
        .content-padding {
          padding: 20px !important;
        }
        .cta-button a {
          width: 100% !important;
          display: block;
          text-align: center;
        }
      }
    </style>
  </head>
  <body style="margin:0; padding:0; background-color:#ce9a06; font-family:Arial, sans-serif;">
    <!-- Wrapper -->
    <table role="presentation" cellpadding="0" cellspacing="0" border="0" width="100%">
      <tr>
        <td align="center" style="padding:20px 0; background-color:#ce9a06;">
          <!-- Header -->
          <img
            src="https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcR_FiuEvVd-cPQAgyUEW7lKPSwlAf2XttphZxZR-B5qT6aIXXsKN5G-3kJoVu4RwdaOMis&usqp=CAU"
            alt="Quran Academy Logo"
            width="60"
            style="display:block; border-radius:50%; margin:0 auto; width:60px; height:auto;"
          />
          <h1 style="color:#ffffff; margin:10px 0 0 0; font-size:24px;">Online Quran Academy</h1>
        </td>
      </tr>
      <tr>
        <td align="center" style="padding:20px;">
          <!-- Main Content -->
          <table
            role="presentation"
            cellpadding="0"
            cellspacing="0"
            border="0"
            width="100%"
            class="content-table"
            style="max-width:600px; background-color:#ffffff; border-radius:8px; overflow:hidden; box-shadow:0 2px 5px rgba(0,0,0,0.1);"
          >
            <tr>
              <td class="content-padding" style="padding:30px; text-align:left; color:#333333; font-size:16px; line-height:1.5;">
                <h2 style="color:#004d40; margin-top:0;">Assalamu Alaikum {{name}},</h2>
                <p>Thank you for reaching out to us. We have successfully received your inquiry and are happy to help you get started.</p>
                <p>For the next steps, please use the link below to begin your onboarding process:</p>
                <p style="text-align:center; margin:20px 0;">
                  <a href="{{link}}" style="background-color:#004d40; color:#ffffff; padding:12px 24px; text-decoration:none; border-radius:5px; font-weight:bold;">
                    Start Onboarding
                  </a>
                </p>
                <p style="margin-top:20px;">If you have any questions, feel free to reply to this email.</p>
                <p style="margin-top:30px;">BarakAllahu Feek,<br><b>Online Quran Academy Team</b></p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td align="center" style="padding:20px; background-color:#ce9a06; color:#ffffff; font-size:12px;">
          <p style="margin:0;">© 2025 Online Quran Academy. All rights reserved.</p>
          <p style="margin:5px 0 0 0;">This email was sent by Online Quran Academy.</p>
        </td>
      </tr>
    </table>
  </body>
</html>

    `,
  },


};


export async function getEmailTemplate(event: string) {
  return await Email.findOne({ event });
}


// lib/emailTemplate.ts
export function renderTemplate(template: string, data: Record<string, any>) {
  return template.replace(/{{(.*?)}}/g, (_, key) => {
    const value = data[key.trim()];
    return value !== undefined ? value : "";
  });
}

// Validate required placeholders exist in template
export function validateTemplate(template: string, requiredFields: string[]): boolean {
  return requiredFields.every((field) => template.includes(`{{${field}}}`));
}

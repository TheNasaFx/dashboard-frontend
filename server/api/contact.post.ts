import { defineEventHandler, readBody, H3Event } from "h3";
import { sanitizeInputString, getRealClientIp } from "../utils/generalUtils";
import { query } from "../utils/db";
import nodemailer from "nodemailer";

export default defineEventHandler(async (event: H3Event) => {
  try {
    const body = await readBody(event);

    // Check if name is set, similar to PHP logic
    if (!body.name) {
      // Return an error response. In Nuxt 3 server routes, returning an object sends JSON.
      event.res.statusCode = 400; // Bad Request
      return { success: false, message: "Name field is required." };
    }

    // Sanitize input fields using the migrated function
    const name = sanitizeInputString(body.name || "");
    const email = sanitizeInputString(body.email || "");
    const message = sanitizeInputString(body.message || "");

    // The PHP code had a subject field but seemed to use a hardcoded subject for the email.
    // We'll capture it but note its original usage.
    const subject = body.subject ? sanitizeInputString(body.subject) : "";

    // The PHP code used a hardcoded empty string for the tel field in the database.
    const tel = ""; // As per original PHP logic

    // Get the client IP using the migrated function
    const ip = getRealClientIp(event) || "";

    // TODO: Implement database insertion logic here
    // Example: await query('INSERT INTO feedback (title, content, name, contact, email, ip) VALUES (?, ?, ?, ?, ?, ?)', [name, message, name, tel, email, ip]);

    // Implement database insertion logic
    const sql =
      "INSERT INTO feedback (title, content, name, contact, email, ip) VALUES (?, ?, ?, ?, ?, ?)";
    const values = [name, message, name, tel, email, ip];
    await query(sql, values);

    // Implement email sending logic
    // Configure nodemailer transporter (replace with your SMTP settings)
    const transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST, // e.g., 'smtp.ethereal.email' or your mail server
      port: parseInt(process.env.SMTP_PORT || "587"),
      secure: process.env.SMTP_SECURE === "true", // true for 465, false for other ports
      auth: {
        user: process.env.SMTP_USER, // generated ethereal user
        pass: process.env.SMTP_PASS, // generated ethereal password
      },
    });

    // Email details (based on contacting.php logic)
    const mailOptions = {
      from: `"${name}" <${email}>`, // Sender address (using name and email from form)
      to: "info@terabit.mn", // List of recipients (hardcoded as in PHP)
      subject: "Вебсайтаас илгээлээ", // Subject line (hardcoded as in PHP)
      text: `Name: ${name}\nTel: ${tel}\nE-mail: ${email}\nip: ${ip}\nMessage: ${message}`, // Plain text body
      // html: '<p>HTML version of the message</p>' // Optional HTML body
    };

    // Send email
    const info = await transporter.sendMail(mailOptions);

    console.log("Message sent: %s", info.messageId);

    // Return a success response
    return {
      success: true,
      message: "Contact form data received, saved to database, and email sent.",
    };
  } catch (error) {
    console.error("API Error handling contact form submission:", error);
    event.res.statusCode = 500; // Internal Server Error
    return {
      success: false,
      message: "An error occurred while processing your submission.",
    };
  }
});

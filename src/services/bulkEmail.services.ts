// services/bulkEmail.service.ts
import { transporter } from "@/utils/mailer";

type EmailPayload = {
  to: string;
  subject: string;
  html: string;
};

const BATCH_SIZE = 10; // Gmail safe limit

export async function sendBulkEmails(emails: EmailPayload[]) {
  for (let i = 0; i < emails.length; i += BATCH_SIZE) {
    const batch = emails.slice(i, i + BATCH_SIZE);

    await Promise.all(
      batch.map((email) =>
        transporter.sendMail({
          from: `"Admin" <${process.env.EMAIL_USER}>`,
          to: email.to,
          subject: email.subject,
          html: email.html,
        })
      )
    );

    // small delay to avoid rate limit
    await new Promise((res) => setTimeout(res, 1000));
  }
}

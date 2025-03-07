/**
 * Email utility functions for sending notifications
 */

/**
 * Sends an entry confirmation email to the user
 * @param email Recipient email address
 * @param data Entry data including competition title and entry number
 * @returns Promise resolving to success status
 */
export async function sendEntryConfirmationEmail(
  email: string,
  data: {
    competitionTitle: string;
    entryNumber: string;
  }
): Promise<{ success: boolean; error?: string }> {
  try {
    // In a production environment, this would use a proper email service like SendGrid, AWS SES, etc.
    // For now, we'll implement a placeholder that logs the email
    console.log(`Sending entry confirmation email to ${email}`);
    console.log(`Competition: ${data.competitionTitle}`);
    console.log(`Entry Number: ${data.entryNumber}`);
    
    // Here would be the API call to your email service
    // For example with SendGrid:
    // const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
    //   method: 'POST',
    //   headers: {
    //     Authorization: `Bearer ${process.env.SENDGRID_API_KEY}`,
    //     'Content-Type': 'application/json',
    //   },
    //   body: JSON.stringify({
    //     personalizations: [{ to: [{ email }] }],
    //     from: { email: 'noreply@neomax-engage.com', name: 'Neomax Engage' },
    //     subject: `Entry Confirmation: ${data.competitionTitle}`,
    //     content: [
    //       {
    //         type: 'text/html',
    //         value: `<EntryConfirmationEmail competitionTitle="${data.competitionTitle}" entryNumber="${data.entryNumber}" />`,
    //       },
    //     ],
    //   }),
    // });
    
    return { success: true };
  } catch (error) {
    console.error('Error sending entry confirmation email:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error sending email' 
    };
  }
}

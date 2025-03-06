/**
 * Email client configuration and helper functions
 * Uses Resend (https://resend.com) for transactional emails with React templates
 */
import { Resend } from 'resend';
import { EntryConfirmationEmail } from '../emails/EntryConfirmationEmail';
import { WinnerNotificationEmail } from '../emails/WinnerNotificationEmail';

// Initialize Resend with API key from environment variables
const apiKey = process.env.RESEND_API_KEY || '';
const fromEmail = process.env.FROM_EMAIL || 'noreply@neomax-engage.com';

// Early return if API key is not available
if (!apiKey && process.env.NODE_ENV === 'production') {
  console.warn('Resend API key is not set. Email functionality will not work in production.');
}

// Create Resend instance
export const resend = new Resend(apiKey);

// Email sender information
export const emailConfig = {
  from: fromEmail,
  replyTo: 'support@neomax-engage.com',
};

/**
 * Format a date to display in emails
 * @param {Date} date - Date to format
 * @returns {string} - Formatted date string (e.g., "March 10, 2025")
 */
export const formatDateForEmail = (date: Date): string => {
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
};

/**
 * Send entry confirmation email
 * @param {Object} params - Parameters for the email
 * @param {string} params.email - Recipient email address
 * @param {string} params.name - Recipient name
 * @param {string} params.competitionTitle - Title of the competition
 * @param {string} params.entryNumber - Unique entry number
 * @param {Date} params.drawDate - Date of the prize draw
 * @param {string} params.prizeDescription - Description of the prize
 * @returns {Promise} - Promise that resolves with the email response
 */
export const sendEntryConfirmation = async ({
  email,
  name,
  competitionTitle,
  entryNumber,
  drawDate,
  prizeDescription,
}: {
  email: string;
  name: string;
  competitionTitle: string;
  entryNumber: string;
  drawDate: Date;
  prizeDescription: string;
}) => {
  try {
    // Early return if API key is not available
    if (!apiKey) {
      console.log('Email not sent: Resend API key not configured');
      return {
        success: true,
        message: 'Email sending skipped: API key not configured',
      };
    }
    
    const formattedDrawDate = formatDateForEmail(drawDate);
    
    const response = await resend.emails.send({
      from: emailConfig.from,
      to: email,
      subject: `Your Entry for ${competitionTitle} is Confirmed!`,
      react: EntryConfirmationEmail({
        userName: name,
        competitionName: competitionTitle,
        entryNumber,
        drawDate: formattedDrawDate,
        prizeDescription,
      }),
    });
    
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Failed to send entry confirmation email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

/**
 * Send winner notification email
 * @param {Object} params - Parameters for the email
 * @param {string} params.email - Recipient email address
 * @param {string} params.name - Recipient name
 * @param {string} params.competitionTitle - Title of the competition
 * @param {string} params.entryNumber - Winner's entry number
 * @param {string} params.prizeDescription - Description of the prize
 * @param {Date} params.claimDeadline - Deadline to claim the prize
 * @returns {Promise} - Promise that resolves with the email response
 */
export const sendWinnerNotification = async ({
  email,
  name,
  competitionTitle,
  entryNumber,
  prizeDescription,
  claimDeadline,
}: {
  email: string;
  name: string;
  competitionTitle: string;
  entryNumber: string;
  prizeDescription: string;
  claimDeadline: Date;
}) => {
  try {
    // Early return if API key is not available
    if (!apiKey) {
      console.log('Email not sent: Resend API key not configured');
      return {
        success: true,
        message: 'Email sending skipped: API key not configured',
      };
    }
    
    const formattedClaimDeadline = formatDateForEmail(claimDeadline);
    const claimUrl = `https://neomax-engage.com/winners/claim/${entryNumber}`;
    
    const response = await resend.emails.send({
      from: emailConfig.from,
      to: email,
      subject: `Congratulations! You've Won the ${competitionTitle} Competition!`,
      react: WinnerNotificationEmail({
        userName: name,
        competitionName: competitionTitle,
        entryNumber,
        prizeDescription,
        claimDeadline: formattedClaimDeadline,
        claimUrl,
      }),
    });
    
    return {
      success: true,
      data: response,
    };
  } catch (error) {
    console.error('Failed to send winner notification email:', error);
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

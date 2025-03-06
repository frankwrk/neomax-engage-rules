/**
 * Supabase email template customization utilities
 * Allows overriding default Supabase auth emails with custom React email templates
 */
import { createClient } from '@supabase/supabase-js';
import { resend } from './email';
import { getBaseUrl, replacePlaceholders } from './url-config';
import AccountConfirmationEmail from '../emails/AccountConfirmationEmail';

// Environment variables
const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL || '';
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY || '';

// Create a Supabase client with the service role key for admin operations
const adminClient = supabaseUrl && supabaseServiceKey 
  ? createClient(supabaseUrl, supabaseServiceKey, {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    })
  : null;

interface CustomEmailTemplateOptions {
  /** The name of the email template to override */
  type: 'signup' | 'recovery' | 'magiclink' | 'invite';
  /** The subject line of the email */
  subject: string;
}

/**
 * Configure Supabase to use our custom email templates
 * This must be called during app initialization or admin setup
 * Only works if SUPABASE_SERVICE_ROLE_KEY is set
 */
export const configureSupabaseCustomEmails = async (): Promise<void> => {
  if (!adminClient) {
    console.warn('Cannot configure custom email templates: Supabase admin client not initialized');
    return;
  }

  try {
    // Customize signup confirmation email template
    await customizeEmailTemplate({
      type: 'signup',
      subject: 'Welcome to Neomax Engage! Confirm Your Email',
    });
    
    console.log('Custom email templates configured successfully');
  } catch (error) {
    console.error('Failed to configure custom email templates:', error);
  }
};

/**
 * Customize a specific Supabase email template
 */
async function customizeEmailTemplate({ type, subject }: CustomEmailTemplateOptions): Promise<void> {
  if (!adminClient) {
    throw new Error('Supabase admin client not initialized');
  }
  
  const baseUrl = getBaseUrl();
  
  // For the signup confirmation template
  if (type === 'signup') {
    // Generate a sample email to get the structure
    // Using a placeholder will be replaced with the actual confirmation URL by Supabase
    const emailTemplate = AccountConfirmationEmail({
      userName: '{{ .UserName }}',
      confirmationLink: '{{ .ConfirmationURL }}',
    });
    
    // We'll use a template string approach instead of renderToStaticMarkup
    // This is a simplified approach for Supabase template emails
    let htmlContent = `
      <html>
        <body>
          <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
            <h1 style="color: #f97316;">Welcome to Neomax Engage!</h1>
            <p>Hello {{ .UserName }},</p>
            <p>Thank you for signing up for Neomax Engage. Please confirm your email address by clicking the button below:</p>
            <p>
              <a href="{{ .ConfirmationURL }}" style="background-color: #f97316; color: white; padding: 10px 15px; text-decoration: none; border-radius: 4px; display: inline-block;">
                Confirm my email
              </a>
            </p>
            <p>If you didn't create an account, you can safely ignore this email.</p>
            <p>Thanks,<br/>The Neomax Engage Team</p>
          </div>
        </body>
      </html>
    `;
    
    // Replace any baseUrl placeholders with the actual URL
    htmlContent = replacePlaceholders(htmlContent);
    
    // Update the template in Supabase
    const { error } = await adminClient.auth.admin.updateAuthConfig({
      config: {
        mailer: {
          template: {
            [type]: {
              subject,
              content: {
                html: htmlContent,
              },
            },
          },
        },
      },
    });
    
    if (error) {
      throw error;
    }
  }
}

/**
 * Custom function to send a signup confirmation email
 * Use this if you want to completely bypass Supabase's email system
 * and use Resend for all emails
 */
export const sendCustomSignupConfirmation = async ({
  email,
  name,
  confirmationToken,
}: {
  email: string;
  name: string;
  confirmationToken: string;
}): Promise<{ success: boolean; error?: string }> => {
  try {
    const baseUrl = getBaseUrl();
    const confirmationLink = `${baseUrl}/auth/confirm?token=${confirmationToken}`;
    
    const response = await resend.emails.send({
      from: 'noreply@neomax-engage.com',
      to: email,
      subject: 'Welcome to Neomax Engage! Confirm Your Email',
      react: AccountConfirmationEmail({
        userName: name,
        confirmationLink,
      }),
    });
    
    return { success: true };
  } catch (error) {
    console.error('Failed to send custom signup confirmation:', error);
    return { 
      success: false, 
      error: error instanceof Error ? error.message : 'Unknown error',
    };
  }
};

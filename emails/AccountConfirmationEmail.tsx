import React from 'react';
import {
  Body,
  Button,
  Container,
  Head,
  Heading,
  Html,
  Img,
  Link,
  Preview,
  Section,
  Text,
} from '@react-email/components';

interface AccountConfirmationEmailProps {
  userName: string;
  confirmationLink: string;
}

/**
 * Email template for confirming a user's new account registration
 * @param {object} props - Email template properties
 * @param {string} props.userName - User's name
 * @param {string} props.confirmationLink - The confirmation URL to verify the account
 * @returns {React.ReactElement} - React email template
 */
export const AccountConfirmationEmail = ({
  userName,
  confirmationLink,
}: AccountConfirmationEmailProps) => {
  const previewText = `Confirm your Neomax Engage account`;

  return (
    <Html>
      <Head />
      <Preview>{previewText}</Preview>
      <Body style={main}>
        <Container style={container}>
          <Img
            src="https://via.placeholder.com/150x50.png?text=Neomax+Engage"
            alt="Neomax Engage"
            width="150"
            height="50"
            style={logo}
          />
          <Heading style={heading}>Verify Your Email Address</Heading>
          <Section style={section}>
            <Text style={text}>Hi {userName},</Text>
            <Text style={text}>
              Thank you for creating an account with Neomax Engage. To complete your registration and
              start participating in competitions, please verify your email address.
            </Text>
            <Button pX={20} pY={12} style={button} href={confirmationLink}>
              Verify My Email
            </Button>
            <Text style={instructionText}>
              If the button above doesn't work, copy and paste the following link into your browser:
            </Text>
            <Text style={linkText}>{confirmationLink}</Text>
            <Text style={text}>
              This link will expire in 24 hours. If you did not create an account with Neomax Engage,
              please ignore this email.
            </Text>
          </Section>
          <Text style={footer}>
            © {new Date().getFullYear()} Neomax Engage. All rights reserved.
            <br />
            <Link href="{{baseUrl}}/privacy-policy" style={footerLink}>
              Privacy Policy
            </Link>{' '}
            •{' '}
            <Link href="{{baseUrl}}/terms" style={footerLink}>
              Terms of Service
            </Link>
          </Text>
        </Container>
      </Body>
    </Html>
  );
};

// Styles
const main = {
  backgroundColor: '#f6f9fc',
  fontFamily:
    '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif',
};

const container = {
  backgroundColor: '#ffffff',
  margin: '0 auto',
  padding: '24px',
  maxWidth: '600px',
  borderRadius: '8px',
  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.05)',
};

const logo = {
  margin: '0 auto 24px',
  display: 'block',
};

const heading = {
  fontSize: '24px',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  color: '#f97316', // Orange color from Tailwind
  margin: '30px 0',
};

const section = {
  margin: '24px 0',
};

const text = {
  fontSize: '16px',
  color: '#333',
  lineHeight: '1.5',
  margin: '16px 0',
};

const instructionText = {
  fontSize: '14px',
  color: '#666',
  margin: '24px 0 8px',
};

const linkText = {
  fontSize: '14px',
  color: '#0070f3',
  margin: '0 0 24px',
  wordBreak: 'break-all' as const,
};

const button = {
  display: 'block',
  backgroundColor: '#f97316',
  color: '#ffffff',
  borderRadius: '4px',
  fontSize: '16px',
  fontWeight: 'bold',
  textDecoration: 'none',
  textAlign: 'center' as const,
  padding: '12px 24px',
  margin: '24px auto',
  width: '200px',
};

const footer = {
  color: '#8898aa',
  fontSize: '14px',
  margin: '24px 0',
  textAlign: 'center' as const,
};

const footerLink = {
  color: '#f97316',
  textDecoration: 'underline',
};

export default AccountConfirmationEmail;

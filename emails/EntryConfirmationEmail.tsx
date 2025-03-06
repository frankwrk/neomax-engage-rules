import React from 'react';
import {
  Body,
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

interface EntryConfirmationEmailProps {
  userName: string;
  competitionName: string;
  entryNumber: string;
  drawDate: string;
  prizeDescription: string;
}

/**
 * Email template for confirming a user's entry into a competition
 * @param {object} props - Email template properties
 * @param {string} props.userName - User's name
 * @param {string} props.competitionName - Name of the competition
 * @param {string} props.entryNumber - Unique entry number
 * @param {string} props.drawDate - Date of the prize draw
 * @param {string} props.prizeDescription - Description of the prize
 * @returns {React.ReactElement} - React email template
 */
export const EntryConfirmationEmail = ({
  userName,
  competitionName,
  entryNumber,
  drawDate,
  prizeDescription,
}: EntryConfirmationEmailProps) => {
  const previewText = `Your entry for ${competitionName} has been confirmed!`;

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
          <Heading style={heading}>Entry Confirmation</Heading>
          <Section style={section}>
            <Text style={text}>Hi {userName},</Text>
            <Text style={text}>
              Thank you for participating in our competition. Your entry has been successfully
              registered.
            </Text>
            <Text style={entryDetails}>
              <strong>Competition:</strong> {competitionName}
            </Text>
            <Text style={entryDetails}>
              <strong>Entry Number:</strong> {entryNumber}
            </Text>
            <Text style={entryDetails}>
              <strong>Draw Date:</strong> {drawDate}
            </Text>
            <Text style={entryDetails}>
              <strong>Prize:</strong> {prizeDescription}
            </Text>
            <Text style={text}>
              Your entry number will be included in our next prize draw. Good luck!
            </Text>
            <Text style={text}>
              Want to increase your chances? Enter more of our competitions by visiting your dashboard.
            </Text>
            <Link href="https://neomax-engage.com/dashboard" style={button}>
              View Your Dashboard
            </Link>
          </Section>
          <Text style={footer}>
            © {new Date().getFullYear()} Neomax Engage. All rights reserved.
            <br />
            <Link href="https://neomax-engage.com/privacy-policy" style={footerLink}>
              Privacy Policy
            </Link>{' '}
            •{' '}
            <Link href="https://neomax-engage.com/terms" style={footerLink}>
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

const entryDetails = {
  fontSize: '16px',
  color: '#333',
  backgroundColor: '#f8fafc',
  padding: '12px',
  borderRadius: '4px',
  margin: '8px 0',
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

export default EntryConfirmationEmail;

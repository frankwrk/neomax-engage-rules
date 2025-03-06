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

interface WinnerNotificationEmailProps {
  userName: string;
  competitionName: string;
  entryNumber: string;
  prizeDescription: string;
  claimDeadline: string;
  claimUrl: string;
}

/**
 * Email template for notifying winners of a competition
 * @param {object} props - Email template properties
 * @param {string} props.userName - Winner's name
 * @param {string} props.competitionName - Name of the competition
 * @param {string} props.entryNumber - Winning entry number
 * @param {string} props.prizeDescription - Description of the prize
 * @param {string} props.claimDeadline - Deadline to claim the prize
 * @param {string} props.claimUrl - URL to claim the prize
 * @returns {React.ReactElement} - React email template
 */
export const WinnerNotificationEmail = ({
  userName,
  competitionName,
  entryNumber,
  prizeDescription,
  claimDeadline,
  claimUrl,
}: WinnerNotificationEmailProps) => {
  const previewText = `Congratulations! You've won ${prizeDescription} in the ${competitionName} draw!`;

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
          <Heading style={heading}>Congratulations, You're a Winner!</Heading>
          <Section style={section}>
            <Text style={text}>Hi {userName},</Text>
            <Text style={highlightText}>
              We're thrilled to inform you that your entry has been selected as a winner in our recent draw!
            </Text>
            <Text style={winnerDetails}>
              <strong>Competition:</strong> {competitionName}
            </Text>
            <Text style={winnerDetails}>
              <strong>Your Winning Entry:</strong> {entryNumber}
            </Text>
            <Text style={winnerDetails}>
              <strong>Prize:</strong> {prizeDescription}
            </Text>
            <Text style={winnerDetails}>
              <strong>Claim By:</strong> {claimDeadline}
            </Text>
            <Text style={text}>
              To claim your prize, please visit your winner's page and follow the instructions.
              You'll need to verify your details before we can process your prize.
            </Text>
            <Text style={warningText}>
              Important: You must claim your prize by {claimDeadline}, or it will be forfeited.
            </Text>
            <Link href={claimUrl} style={button}>
              Claim Your Prize
            </Link>
            <Text style={text}>
              If you have any questions about your prize or the claim process, please
              contact our support team at support@neomax-engage.com.
            </Text>
          </Section>
          <Section style={congratsSection}>
            <Text style={congratsText}>
              Congratulations again and thank you for participating in Neomax Engage competitions!
            </Text>
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
  fontSize: '28px',
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

const highlightText = {
  fontSize: '18px',
  fontWeight: 'bold',
  color: '#333',
  lineHeight: '1.5',
  margin: '16px 0',
};

const winnerDetails = {
  fontSize: '16px',
  color: '#333',
  backgroundColor: '#f8fafc',
  padding: '12px',
  borderRadius: '4px',
  margin: '8px 0',
};

const warningText = {
  fontSize: '16px',
  color: '#B91C1C',
  fontWeight: 'bold',
  margin: '16px 0',
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

const congratsSection = {
  backgroundColor: '#fef3c7',
  borderRadius: '8px',
  padding: '16px',
  margin: '32px 0',
};

const congratsText = {
  fontSize: '18px',
  color: '#92400e',
  fontWeight: 'bold',
  textAlign: 'center' as const,
  margin: '0',
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

export default WinnerNotificationEmail;

import React from 'react';
import { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'Terms and Conditions | Neomax Engage',
  description: 'Terms and conditions for using the Neomax Engage platform',
};

/**
 * Terms and Conditions page component
 * @returns {React.ReactElement} - Terms and Conditions page
 */
export default function TermsPage() {
  return (
    <div className="container max-w-4xl py-12">
      <h1 className="mb-8 text-3xl font-bold text-center">Terms and Conditions</h1>
      <p className="text-sm text-muted-foreground text-center mb-8">
        Last updated: March 6, 2025
      </p>

      <div className="prose prose-stone dark:prose-invert max-w-none">
        <h2>1. Introduction</h2>
        <p>
          Welcome to Neomax Engage. These Terms and Conditions govern your use of the Neomax Engage platform
          and constitute a binding legal agreement between you and Neomax Engage Ltd.
        </p>
        <p>
          By accessing or using our platform, you agree to be bound by these Terms. If you disagree with any
          part of the terms, you may not access the platform.
        </p>

        <h2>2. Definitions</h2>
        <p>
          <strong>"Competition"</strong> means any skill-based entry competition hosted on the Neomax Engage platform.
        </p>
        <p>
          <strong>"Entry"</strong> means a user's participation in a Competition after watching an advertisement and
          correctly answering a skill-based question.
        </p>
        <p>
          <strong>"Prize"</strong> means any item or experience offered to winners of a Competition.
        </p>
        <p>
          <strong>"User"</strong> means any individual who registers for and uses the Neomax Engage platform.
        </p>

        <h2>3. Eligibility</h2>
        <p>
          To use the Neomax Engage platform, you must:
        </p>
        <ul>
          <li>Be at least 18 years of age;</li>
          <li>Provide accurate and complete registration information;</li>
          <li>Maintain the security of your account details;</li>
          <li>Be a resident of the jurisdiction in which the Competition is open, as specified in each Competition's rules;</li>
          <li>Not be an employee, officer, director, agent, or representative of Neomax Engage Ltd, or any of its affiliated entities, or an immediate family member of such persons.</li>
        </ul>

        <h2>4. Account Registration</h2>
        <p>
          To participate in Competitions on Neomax Engage, you must create an account. During registration, you agree to:
        </p>
        <ul>
          <li>Provide accurate, current, and complete information;</li>
          <li>Maintain and update your information as needed;</li>
          <li>Accept responsibility for all activities that occur under your account;</li>
          <li>Create only one account per person (multiple accounts are prohibited);</li>
          <li>Notify us immediately of any unauthorized use of your account.</li>
        </ul>

        <h2>5. Competition Entry</h2>
        <p>
          Entry into Competitions is subject to the following conditions:
        </p>
        <ul>
          <li>You must watch the advertisement in its entirety;</li>
          <li>You must correctly answer the skill-based question to obtain an entry;</li>
          <li>One entry per Competition per person, unless otherwise specified;</li>
          <li>Entries are subject to verification and may be invalidated if obtained fraudulently;</li>
          <li>Neomax Engage reserves the right to limit the number of Competitions you may enter per day.</li>
        </ul>

        <h2>6. Prize Draws and Winner Selection</h2>
        <p>
          Winner selection and prize distribution are governed by the following terms:
        </p>
        <ul>
          <li>Winners are selected by automated random draw from all valid entries;</li>
          <li>The draw process is conducted using a provably fair random number generator;</li>
          <li>Winners will be notified via email using the address associated with their account;</li>
          <li>Winners must claim their prize within the specified timeframe (typically 14 days);</li>
          <li>Prizes not claimed within the specified timeframe may be forfeited;</li>
          <li>Neomax Engage reserves the right to verify winner eligibility before prize distribution;</li>
          <li>Prizes are non-transferable and non-exchangeable, unless otherwise specified.</li>
        </ul>

        <h2>7. Anti-Fraud Measures</h2>
        <p>
          To maintain the integrity of our platform, Neomax Engage implements various anti-fraud measures:
        </p>
        <ul>
          <li>Automated detection systems to identify suspicious activity;</li>
          <li>Verification of account details before prize distribution;</li>
          <li>Analysis of IP addresses and device information to prevent multiple accounts;</li>
          <li>Right to disqualify participants suspected of fraudulent behavior;</li>
          <li>Right to permanently ban users found to be engaging in fraud.</li>
        </ul>

        <h2>8. Content and Intellectual Property</h2>
        <p>
          All content on the Neomax Engage platform, including text, graphics, logos, and software, is the property
          of Neomax Engage Ltd or its content suppliers and is protected by intellectual property laws.
          You may not reproduce, distribute, modify, or create derivative works of such content without
          explicit permission.
        </p>

        <h2>9. Limitation of Liability</h2>
        <p>
          Neomax Engage Ltd and its affiliates shall not be liable for any indirect, incidental, special,
          consequential, or punitive damages resulting from your use of, or inability to use, the platform.
          Our total liability for any claim arising from these Terms shall not exceed the amount you have
          paid to us in the past twelve months.
        </p>

        <h2>10. Indemnification</h2>
        <p>
          You agree to indemnify and hold harmless Neomax Engage Ltd, its affiliates, officers, directors,
          employees, and agents from any claims, liabilities, damages, losses, costs, or expenses arising from your
          use of the platform or violation of these Terms.
        </p>

        <h2>11. Modifications to Terms</h2>
        <p>
          Neomax Engage reserves the right to modify these Terms at any time. We will provide notice of significant
          changes via email or platform notification. Your continued use of the platform after such modifications
          constitutes acceptance of the updated Terms.
        </p>

        <h2>12. Termination</h2>
        <p>
          Neomax Engage may terminate or suspend your account at any time for violations of these Terms or for
          any other reason at our sole discretion. Upon termination, your right to use the platform will cease
          immediately.
        </p>

        <h2>13. Governing Law</h2>
        <p>
          These Terms shall be governed by and construed in accordance with the laws of the United Kingdom,
          without regard to its conflict of law provisions. Any disputes relating to these Terms shall be
          subject to the exclusive jurisdiction of the courts of the United Kingdom.
        </p>

        <h2>14. Contact Information</h2>
        <p>
          If you have any questions about these Terms, please contact us at:
        </p>
        <p>
          Neomax Engage Ltd<br />
          Email: legal@neomax-engage.com<br />
          Address: 123 Engagement Street, London, UK
        </p>
      </div>
    </div>
  );
}

import React from 'react';
import { Metadata } from 'next';
import { LegalDocument } from '@/components/legal-document';

export const metadata: Metadata = {
  title: 'Privacy Policy | Neomax Engage',
  description: 'Privacy policy for the Neomax Engage platform',
};

/**
 * Privacy Policy page component
 * @returns {React.ReactElement} - Privacy Policy page
 */
export default function PrivacyPolicyPage() {
  return (
    <LegalDocument 
      title="Privacy Policy" 
      lastUpdated="March 6, 2025"
      version="1.2"
    >
        <h2>1. Introduction</h2>
        <p>
          At Neomax Engage, we take your privacy seriously. This Privacy Policy explains how we collect, use, 
          disclose, and safeguard your information when you use our platform. Please read this privacy policy 
          carefully. If you do not agree with the terms of this privacy policy, please do not access the platform.
        </p>
        <p>
          We reserve the right to make changes to this Privacy Policy at any time and for any reason. 
          We will alert you about any changes by updating the "Last updated" date of this policy. 
          You are encouraged to periodically review this Privacy Policy to stay informed of updates.
        </p>

        <h2>2. Collection of Your Information</h2>
        <p>
          We may collect information about you in a variety of ways. The information we may collect via 
          the Platform includes:
        </p>
        
        <h3>2.1 Personal Data</h3>
        <p>
          Personally identifiable information, such as your name, email address, telephone number, and 
          demographic information that you voluntarily give to us when you register with the Platform or 
          when you choose to participate in various activities related to the Platform. You are under no 
          obligation to provide us with personal information of any kind, however your refusal to do so may 
          prevent you from using certain features of the Platform.
        </p>
        
        <h3>2.2 Derivative Data</h3>
        <p>
          Information our servers automatically collect when you access the Platform, such as your IP address, 
          your browser type, your operating system, your access times, the pages you have viewed directly before 
          and after accessing the Platform, and other interactions with the platform.
        </p>
        
        <h3>2.3 Financial Data</h3>
        <p>
          Financial information, such as data related to your payment method (e.g., valid credit card number, 
          card brand, expiration date) that we may collect when you purchase, order, exchange, or request 
          information about our services. We store only very limited, if any, financial information that we 
          collect. Otherwise, all financial information is stored by our payment processor and you are 
          encouraged to review their privacy policy and contact them directly for responses to your questions.
        </p>
        
        <h3>2.4 Mobile Device Data</h3>
        <p>
          Device information, such as your mobile device ID, model, and manufacturer, and information about 
          the location of your device, if you access the Platform from a mobile device.
        </p>
        
        <h3>2.5 Data From Contests and Giveaways</h3>
        <p>
          Personal and other information you may provide when entering contests or giveaways and/or 
          responding to surveys.
        </p>

        <h2>3. Use of Your Information</h2>
        <p>
          Having accurate information about you permits us to provide you with a smooth, efficient, and 
          customized experience. Specifically, we may use information collected about you via the Platform to:
        </p>
        <ul>
          <li>Create and manage your account;</li>
          <li>Deliver targeted advertising, newsletters, and other information regarding promotions to you;</li>
          <li>Email you regarding your account or competition entries;</li>
          <li>Enable user-to-user communications;</li>
          <li>Generate a personal profile about you to make future visits to the Platform more personalized;</li>
          <li>Increase the efficiency and operation of the Platform;</li>
          <li>Monitor and analyze usage and trends to improve your experience with the Platform;</li>
          <li>Notify you of updates to the Platform;</li>
          <li>Offer new products, services, and/or recommendations to you;</li>
          <li>Perform other business activities as needed;</li>
          <li>Process prize fulfillment in competitions and record winners;</li>
          <li>Request feedback and contact you about your use of the Platform;</li>
          <li>Resolve disputes and troubleshoot problems;</li>
          <li>Respond to product and customer service requests;</li>
          <li>Solicit support for the Platform.</li>
        </ul>

        <h2>4. Disclosure of Your Information</h2>
        <p>
          We may share information we have collected about you in certain situations. Your information may be 
          disclosed as follows:
        </p>
        
        <h3>4.1 By Law or to Protect Rights</h3>
        <p>
          If we believe the release of information about you is necessary to respond to legal process, to 
          investigate or remedy potential violations of our policies, or to protect the rights, property, and 
          safety of others, we may share your information as permitted or required by any applicable law, rule, 
          or regulation.
        </p>
        
        <h3>4.2 Third-Party Service Providers</h3>
        <p>
          We may share your information with third parties that perform services for us or on our behalf, 
          including payment processing, data analysis, email delivery, hosting services, customer service, 
          and marketing assistance.
        </p>
        
        <h3>4.3 Marketing Communications</h3>
        <p>
          With your consent, or with an opportunity for you to withdraw consent, we may share your information 
          with third parties for marketing purposes.
        </p>
        
        <h3>4.4 Interactions with Other Users</h3>
        <p>
          If you interact with other users of the Platform, those users may see your name, profile photo, and 
          descriptions of your activity.
        </p>
        
        <h3>4.5 Online Postings</h3>
        <p>
          When you post comments, contributions or other content to the Platform, your posts may be viewed by 
          all users and may be publicly distributed outside the Platform in perpetuity.
        </p>
        
        <h3>4.6 Competition Information</h3>
        <p>
          If you win a competition, we may publicly post your name and competition winnings on our Platform and 
          in announcements. We may also be required by law to publish your name and competition entry details 
          for legal and transparency reasons.
        </p>
        
        <h3>4.7 Business Transfers</h3>
        <p>
          If we are involved in a merger, acquisition, or sale of all or a portion of our assets, your information 
          may be transferred as part of that transaction, but we will notify you via email and/or a prominent 
          notice on our Platform of any change in ownership or uses of your information.
        </p>

        <h2>5. Security of Your Information</h2>
        <p>
          We use administrative, technical, and physical security measures to help protect your personal information. 
          While we have taken reasonable steps to secure the personal information you provide to us, please be aware 
          that despite our efforts, no security measures are perfect or impenetrable, and no method of data 
          transmission can be guaranteed against any interception or other type of misuse.
        </p>

        <h2>6. Policy for Children</h2>
        <p>
          We do not knowingly solicit information from or market to children under the age of 18. If you become 
          aware of any data we have collected from children under age 18, please contact us using the contact 
          information provided below.
        </p>

        <h2>7. Your Rights</h2>
        <h3>7.1 Account Information</h3>
        <p>
          You may at any time review or change the information in your account or terminate your account by:
        </p>
        <ul>
          <li>Logging into your account settings and updating your account</li>
          <li>Contacting us using the contact information provided below</li>
        </ul>
        <p>
          Upon your request to terminate your account, we will deactivate or delete your account and information 
          from our active databases. However, some information may be retained in our files to prevent fraud, 
          troubleshoot problems, assist with any investigations, enforce our Terms and Conditions, and/or comply 
          with legal requirements.
        </p>
        
        <h3>7.2 Your Data Protection Rights Under GDPR</h3>
        <p>
          If you are a resident of the European Economic Area (EEA), you have certain data protection rights. 
          Neomax Engage aims to take reasonable steps to allow you to correct, amend, delete, or limit the use 
          of your Personal Data.
        </p>
        <p>
          In certain circumstances, you have the following data protection rights:
        </p>
        <ul>
          <li>The right to access, update or delete the information we have on you.</li>
          <li>The right of rectification: You have the right to have your information rectified if that information is inaccurate or incomplete.</li>
          <li>The right to object: You have the right to object to our processing of your Personal Data.</li>
          <li>The right of restriction: You have the right to request that we restrict the processing of your personal information.</li>
          <li>The right to data portability: You have the right to be provided with a copy of the information we have on you in a structured, machine-readable and commonly used format.</li>
          <li>The right to withdraw consent: You also have the right to withdraw your consent at any time where Neomax Engage relied on your consent to process your personal information.</li>
        </ul>

        <h2>8. Contact Us</h2>
        <p>
          If you have questions or comments about this Privacy Policy, please contact us at:
        </p>
        <p>
          Neomax Engage Ltd<br />
          Email: privacy@neomax-engage.com<br />
          Address: 123 Engagement Street, London, UK
        </p>
    </LegalDocument>
  );
}

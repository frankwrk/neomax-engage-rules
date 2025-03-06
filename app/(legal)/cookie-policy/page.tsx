import React from 'react';
import { Metadata } from 'next';
import { LegalDocument } from '@/components/legal-document';

export const metadata: Metadata = {
  title: 'Cookie Policy | Neomax Engage',
  description: 'Cookie policy for the Neomax Engage platform',
};

/**
 * Cookie Policy page component
 * @returns {React.ReactElement} - Cookie Policy page
 */
export default function CookiePolicyPage() {
  return (
    <LegalDocument 
      title="Cookie Policy" 
      lastUpdated="March 6, 2025"
      version="1.0"
    >
        <h2>1. Introduction</h2>
        <p>
          This Cookie Policy explains how Neomax Engage Ltd ("we", "us", or "our") uses cookies and similar 
          technologies to recognize you when you visit our website at neomax-engage.com ("Website"). 
          It explains what these technologies are and why we use them, as well as your rights to control our use of them.
        </p>
        <p>
          In some cases we may use cookies to collect personal information, or that becomes personal information if we 
          combine it with other information.
        </p>

        <h2>2. What are cookies?</h2>
        <p>
          Cookies are small data files that are placed on your computer or mobile device when you visit a website. 
          Cookies are widely used by website owners in order to make their websites work, or to work more efficiently, 
          as well as to provide reporting information.
        </p>
        <p>
          Cookies set by the website owner (in this case, Neomax Engage Ltd) are called "first-party cookies". 
          Cookies set by parties other than the website owner are called "third-party cookies". Third-party cookies 
          enable third-party features or functionality to be provided on or through the website (e.g., advertising, 
          interactive content, and analytics). The parties that set these third-party cookies can recognize your 
          computer both when it visits the website in question and also when it visits certain other websites.
        </p>

        <h2>3. Why do we use cookies?</h2>
        <p>
          We use first- and third-party cookies for several reasons. Some cookies are required for technical reasons 
          in order for our Website to operate, and we refer to these as "essential" or "strictly necessary" cookies. 
          Other cookies also enable us to track and target the interests of our users to enhance the experience on our 
          Online Properties. Third parties serve cookies through our Website for advertising, analytics, and other purposes. 
          This is described in more detail below.
        </p>

        <h2>4. Types of cookies we use</h2>
        <p>
          The specific types of first- and third-party cookies served through our Website and the purposes they perform 
          are described below:
        </p>

        <h3>4.1 Essential Cookies</h3>
        <p>
          These cookies are strictly necessary to provide you with services available through our Website and to use 
          some of its features, such as access to secure areas. Because these cookies are strictly necessary to deliver 
          the Website, you cannot refuse them without impacting how our Website functions.
        </p>
        <ul>
          <li><strong>Session Cookies</strong>: Used to maintain your user session and security state.</li>
          <li><strong>Authentication Cookies</strong>: Used to recognize you when you are logged in to our platform.</li>
          <li><strong>Security Cookies</strong>: Used to enable security features and detect fraudulent activities.</li>
        </ul>

        <h3>4.2 Performance and Functionality Cookies</h3>
        <p>
          These cookies are used to enhance the performance and functionality of our Website but are non-essential to 
          their use. However, without these cookies, certain functionality may become unavailable.
        </p>
        <ul>
          <li><strong>Preference Cookies</strong>: Used to remember preferences you have set, such as language or region.</li>
          <li><strong>Feature Cookies</strong>: Used to recognize you when you return to our website to provide enhanced and personalized features.</li>
        </ul>

        <h3>4.3 Analytics and Customization Cookies</h3>
        <p>
          These cookies collect information that is used either in aggregate form to help us understand how our Website is 
          being used or how effective our marketing campaigns are, or to help us customize our Website for you.
        </p>
        <ul>
          <li><strong>Google Analytics</strong>: Used to collect information about how visitors use our site. We use the information to compile reports and to help us improve the site.</li>
          <li><strong>Hotjar</strong>: Used to analyze the user experience and identify usability issues.</li>
        </ul>

        <h3>4.4 Advertising Cookies</h3>
        <p>
          These cookies are used to make advertising messages more relevant to you. They perform functions like preventing 
          the same ad from continuously reappearing, ensuring that ads are properly displayed for advertisers, and in some 
          cases selecting advertisements that are based on your interests.
        </p>
        <ul>
          <li><strong>Google Ads</strong>: Used to track conversions and serve targeted advertisements.</li>
          <li><strong>Facebook Pixel</strong>: Used to track user interactions with our Facebook advertisements and to target specific audiences.</li>
        </ul>

        <h3>4.5 Social Media Cookies</h3>
        <p>
          These cookies are used to enable you to share pages and content that you find interesting on our Website through 
          third-party social networking and other websites. These cookies may also be used for advertising purposes.
        </p>
        <ul>
          <li><strong>Facebook Share</strong>: Used to allow sharing content to Facebook.</li>
          <li><strong>Twitter Share</strong>: Used to allow sharing content to Twitter.</li>
        </ul>

        <h2>5. How can you control cookies?</h2>
        <p>
          You have the right to decide whether to accept or reject cookies. You can exercise your cookie rights by setting 
          your preferences in the Cookie Consent Manager. The Cookie Consent Manager allows you to select which categories 
          of cookies you accept or reject. Essential cookies cannot be rejected as they are strictly necessary to provide 
          you with services.
        </p>
        <p>
          The Cookie Consent Manager can be found in the notification banner and on our website. If you choose to reject 
          cookies, you may still use our website though your access to some functionality and areas of our website may be 
          restricted. You may also set or amend your web browser controls to accept or refuse cookies.
        </p>
        <p>
          The specific types of first and third-party cookies served through our Website and the purposes they perform are 
          described in the table below:
        </p>

        <h3>Browser Controls</h3>
        <p>
          Most web browsers allow some control of most cookies through the browser settings. For more information about how 
          to reject cookies via your browser, please consult the documentation that came with your browser:
        </p>
        <ul>
          <li><a href="https://support.google.com/chrome/answer/95647" className="text-primary hover:underline">Chrome</a></li>
          <li><a href="https://support.microsoft.com/en-us/help/17442/windows-internet-explorer-delete-manage-cookies" className="text-primary hover:underline">Internet Explorer</a></li>
          <li><a href="https://support.mozilla.org/en-US/kb/enhanced-tracking-protection-firefox-desktop" className="text-primary hover:underline">Firefox</a></li>
          <li><a href="https://support.apple.com/guide/safari/manage-cookies-and-website-data-sfri11471/mac" className="text-primary hover:underline">Safari</a></li>
          <li><a href="https://help.opera.com/en/latest/web-preferences/#cookies" className="text-primary hover:underline">Opera</a></li>
        </ul>
        <p>
          In addition, most advertising networks offer you a way to opt out of targeted advertising. For more information, please visit:
        </p>
        <ul>
          <li><a href="http://www.aboutads.info/choices/" className="text-primary hover:underline">Digital Advertising Alliance</a></li>
          <li><a href="https://www.networkadvertising.org/choices/" className="text-primary hover:underline">Network Advertising Initiative</a></li>
          <li><a href="https://www.youronlinechoices.eu/" className="text-primary hover:underline">Your Online Choices (EU)</a></li>
        </ul>

        <h2>6. How often will we update this Cookie Policy?</h2>
        <p>
          We may update this Cookie Policy from time to time in order to reflect, for example, changes to the cookies we use 
          or for other operational, legal or regulatory reasons. Please therefore re-visit this Cookie Policy regularly to 
          stay informed about our use of cookies and related technologies.
        </p>
        <p>
          The date at the top of this Cookie Policy indicates when it was last updated.
        </p>

        <h2>7. Where can you get further information?</h2>
        <p>
          If you have any questions about our use of cookies or other technologies, please email us at privacy@neomax-engage.com or by post to:
        </p>
        <p>
          Neomax Engage Ltd<br />
          123 Engagement Street<br />
          London, UK
        </p>
    </LegalDocument>
  );
}

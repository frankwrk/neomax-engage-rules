/**
 * URL configuration for different environments
 * Used to ensure links in emails point to the correct deployment
 */

/**
 * Get the base URL for the current environment
 * This is used for generating links in emails and other notifications
 */
export const getBaseUrl = (): string => {
  // For production builds that are deployed to Vercel
  if (process.env.VERCEL_URL) {
    return `https://${process.env.VERCEL_URL}`;
  }
  
  // For preview deployments on Vercel
  if (process.env.NEXT_PUBLIC_VERCEL_URL) {
    return `https://${process.env.NEXT_PUBLIC_VERCEL_URL}`;
  }
  
  // Custom deployment URL if defined
  if (process.env.NEXT_PUBLIC_SITE_URL) {
    return process.env.NEXT_PUBLIC_SITE_URL;
  }
  
  // Default to localhost for development
  return 'http://localhost:3000';
};

/**
 * Replace placeholder tokens in templates with actual values
 * @param {string} template - Template string with {{baseUrl}} placeholders
 * @returns {string} - String with placeholders replaced with actual values
 */
export const replacePlaceholders = (template: string): string => {
  const baseUrl = getBaseUrl();
  return template.replace(/{{baseUrl}}/g, baseUrl);
};

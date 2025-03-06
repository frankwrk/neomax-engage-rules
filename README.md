# Neomax Engage Rules

Neomax Engage is a skill-based engagement competition platform where users watch ads, correctly answer a question, and earn a free entry into prize draws. The platform prioritizes security, scalability, and transparency, featuring automated winner selection, fraud prevention, and advertiser engagement tools.

## Technologies Used

- **Frontend**: Next.js 14 (App Router), React, Tailwind CSS, Shadcn UI
- **State Management**: React Context
- **Forms & Validation**: React Hook Form, Zod
- **Backend & Database**: Supabase
- **Email Provider**: Resend with React Email

## Features

- User registration and authentication
- Competition entry system
- Automated email notifications
- Winner selection and announcements
- User profile management
- Admin dashboard

## Environment Variables

Create a `.env.local` file with the following variables:

```
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key
SUPABASE_SERVICE_ROLE_KEY=your_supabase_service_role_key

# Email Configuration
RESEND_API_KEY=your_resend_api_key
FROM_EMAIL=noreply@neomax-engage.com

# Deployment URLs (automatically set by Vercel)
# VERCEL_URL - Set by Vercel in production
# NEXT_PUBLIC_VERCEL_URL - Set by Vercel in preview

# Optional: Override site URL if needed
# NEXT_PUBLIC_SITE_URL=https://your-custom-domain.com
```

## Email System

The application uses Resend with React Email templates for all transactional emails:

- **Entry confirmation emails**: Sent when a user successfully enters a competition
- **Winner notification emails**: Sent when a user wins a competition
- **Account confirmation emails**: Custom templates for Supabase authentication

To configure custom Supabase email templates, deploy the application and make a GET request to the `/api/email-config` endpoint. This will set up Supabase to use our custom email templates. The SUPABASE_SERVICE_ROLE_KEY is required for this feature.

## Development

```bash
# Install dependencies
npm install

# Run development server
npm run dev
```

## Production

```bash
# Build for production
npm run build

# Start production server
npm start
```

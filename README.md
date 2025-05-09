# Referral Investment Platform Frontend

This is the React frontend for the Referral Investment Platform.

## Quick Deploy

Deploy the frontend directly to Vercel:

[![Deploy with Vercel](https://vercel.com/button)](https://vercel.com/new/clone?repository-url=https%3A%2F%2Fgithub.com%2Fyour-username%2Freferral-platform%2Ftree%2Fmain%2Ffrontend&env=REACT_APP_API_URL&envDescription=Backend%20API%20URL&envLink=https%3A%2F%2Fgithub.com%2Fyour-username%2Frefferal-platform%2Fblob%2Fmain%2FREADME.md&project-name=referral-platform-frontend&repository-name=referral-platform-frontend)

## Development Setup

1. Install dependencies:
   ```
   npm install
   ```

2. Create `.env.local` file with:
   ```
   REACT_APP_API_URL=http://localhost:8000/api
   ```

3. Start development server:
   ```
   npm start
   ```

## Building for Production

```
npm run build
```

## Deployment

This project is configured for easy deployment to Vercel:

1. Import your GitHub repository in Vercel
2. Configure environment variables:
   - `REACT_APP_API_URL`: URL of your backend API (e.g., https://your-backend.onrender.com/api)
3. Deploy!

## Environment Variables

This project uses environment variables for configuration. For security reasons, sensitive data such as API URLs and keys should be stored in environment files and not committed to version control.

### Environment Files

- `.env`: Default environment variables (should contain non-sensitive, default values)
- `.env.local`: Local overrides (not committed to git, contains sensitive data)
- `.env.development`: Development environment variables
- `.env.production`: Production environment variables

### Required Environment Variables

- `REACT_APP_API_URL`: The URL of the backend API
- `REACT_APP_ENV`: The current environment (development, production, etc.)

### Switching Environments

This project includes several convenience scripts to easily switch between development and production environments:

```bash
# Interactive environment switcher
npm run switch-env

# Quick switch to development (localhost)
npm run use:dev

# Quick switch to production (Railway)
npm run use:prod

# Setup environment with guided prompts
npm run setup-env
```

When running in development mode, you'll see an environment indicator in the bottom right corner of the application showing which API you're connected to.

### Local vs Production

- **Local Development**: Uses `http://localhost:8000/api` for the backend
- **Production**: Uses `https://web-production-989cb.up.railway.app/api` for the backend

### Environment Variable Usage

In your React components, access environment variables using the utility:

```javascript
import ENV from '../utils/env';

// Access API URL
const apiUrl = ENV.API_URL;

// Check environment
if (ENV.IS_DEVELOPMENT) {
  // Development-only code
}
```

### Security Best Practices

1. **Never commit sensitive API keys/tokens to git**
2. **Always use `.env.local` for sensitive data**
3. **Use placeholder values in committed `.env` files**
4. **Ensure `.env.local` is in your `.gitignore**

## Features

- User authentication with JWT
- Investment dashboard
- Referral tracking and management
- Withdrawal requests
- Admin dashboard (for admin users)
- Responsive design with Tailwind CSS 
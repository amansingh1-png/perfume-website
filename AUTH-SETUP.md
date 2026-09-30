# ROZANA Firebase Authentication

The website now includes:
- Email + password Login
- Email + password Sign Up
- Phone number + OTP sign-in/sign-up
- Google sign-in/sign-up
- Logged-in account state + Logout

## Firebase Console setup

In Firebase Console for project `rozana-ee5dd`:

1. Open **Authentication** → **Sign-in method**.
2. Enable **Email/Password**.
3. Enable **Phone**.
4. Enable **Google** and choose a support email if Firebase asks.
5. Open **Authentication → Settings → Authorized domains** and add the domain where the website is deployed (for example your Vercel domain). `localhost` is normally available for local testing.

## Important for phone OTP

Firebase Phone Authentication uses reCAPTCHA. The website creates the reCAPTCHA widget automatically when the customer requests an OTP.

## Firebase web configuration

The web app config supplied for ROZANA is included in `auth.js`. Web Firebase config is intended to be present in client-side code. Do not add a Firebase service-account/private-key JSON file to this website.

## Deployment

After enabling the providers and adding the deployed domain under Authorized domains, deploy the website files normally. No server-side Firebase Admin SDK is required for this client-side authentication flow.

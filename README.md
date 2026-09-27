# ROZANA Premium Website Upgrade

This package upgrades the existing ROZANA static storefront with:
- Discount popup shown first on a new session
- Him & Her couple collection page
- 200-word personalised handwritten-card builder
- Product detail page with separate URL/query for every fragrance
- Persistent cart using localStorage
- Cart → checkout → order-confirmation flow
- UPI/Card/COD payment UI
- Contact page with phone + Instagram
- Founder/CEO section using the supplied founder photo
- Premium dark/gold animations and AI-generated visual showcase
- Responsive mobile layout

## Important for real payments
The checkout currently creates a real browser-side order record and confirmation flow, but live UPI/card payment collection is NOT connected to a payment gateway yet. For real online payments, connect Razorpay/Stripe/etc. with a backend/serverless function and your live keys before launch.

## Upload to GitHub
Replace your existing `index.html`, `style.css`, `script.js` and add:
`product.html`, `couple.html`, `card.html`, `cart.html`, `checkout.html`, `success.html`, `contact.html`, plus the `images/` folder.

The Vercel project can then redeploy automatically from the GitHub main branch.

# ROZANA Free Email + Password Login

The Firebase authentication flow has been removed.

ROZANA now uses a simple browser-local email/password account flow so the static website can run without Firebase billing or an external authentication service.

### How it works
- Customer clicks **Login**.
- Customer can **Create Account** with name, email and password.
- Existing customers can log in with email + password.
- The current session is stored locally in the browser.
- Logout is available from the same account panel.

### Important
This is suitable for a free static/demo store. Passwords are stored in the customer's browser and are **not suitable for production-grade account security**. Before taking real customer accounts or sensitive personal information at scale, connect a proper server-side authentication system.

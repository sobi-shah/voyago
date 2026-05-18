# Voyago SaaS Deployment Guide

This guide outlines how to deploy the Voyago application to a production environment (VPS like Render or DigitalOcean) and connect a custom domain (e.g., `voyago.pk`).

## Prerequisites
- A MongoDB Atlas account with a deployed cluster.
- A hosting provider account (Render, DigitalOcean, Heroku).
- A purchased domain name (from Namecheap, GoDaddy, or PKNIC for `.pk`).

---

## Step 1: Database Setup
1. Log in to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas).
2. Ensure your IP Access List allows connections from anywhere (`0.0.0.0/0`) or specifically your hosting provider's IP.
3. Create a database user with a secure password.
4. Get your connection string (Select `Node.js` driver).

---

## Step 2: Backend Deployment (e.g., Render)

We recommend deploying the backend as a Web Service.

1. Create a new "Web Service" on Render and connect your GitHub repository.
2. Set the Environment to `Node`.
3. Set the Build Command:
   ```bash
   cd backend && npm install
   ```
4. Set the Start Command:
   ```bash
   cd backend && node server.js
   ```
5. Add the following **Environment Variables** in the Render dashboard:
   - `NODE_ENV`: `production`
   - `MONGO_URI`: (Your MongoDB Atlas connection string)
   - `JWT_SECRET`: (A long, secure random string)

---

## Step 3: Frontend Deployment

Since Voyago serves static files natively via Express (`app.use(express.static(...))`), the frontend is deployed automatically alongside the backend in Step 2!

*Note: If you wish to host the frontend separately (e.g., on Netlify or a separate Nginx block), ensure you update `API_BASE` in `js/app.js` to point to your new backend URL.*

---

## Step 4: Connecting Your Custom Domain (voyago.pk)

1. Go to your hosting provider's dashboard (e.g., Render Custom Domains settings).
2. Add your domain: `voyago.pk` and `www.voyago.pk`.
3. The dashboard will provide DNS records (usually a `CNAME` or `A` record).
4. Go to your Domain Registrar (where you bought the domain):
   - Find the **DNS Settings / Name Servers** page.
   - Add an **A Record** pointing `@` to the provided IP address.
   - Add a **CNAME Record** pointing `www` to your Render app URL (e.g., `voyago-api.onrender.com`).
5. Wait for DNS propagation (can take up to 24 hours, but usually 5-10 minutes).
6. Your hosting provider will automatically provision a free SSL certificate for HTTPS.

---

## Final Verification
1. Open `https://voyago.pk`.
2. Test the Signup and Login flow.
3. Test booking a package.
4. Verify the User Analytics dashboard works.

> **Note:** Run `node backend/seed.js` locally (connected to your production DB) ONCE to populate the initial destinations.

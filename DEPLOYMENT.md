# Deploying Deja-You to Vercel with Neon Postgres

This guide provides complete, step-by-step instructions for deploying your Deja-You application to Vercel using Neon Postgres (Vercel's recommended serverless PostgreSQL provider).

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier works)
- A GitHub account
- [Git](https://git-scm.com/) installed on your computer
- [Node.js](https://nodejs.org/) installed (v18 or later)

## Overview

This application uses:
- ✅ **Next.js** for the frontend and API
- ✅ **PostgreSQL** (via Neon) for the database
- ✅ **Drizzle ORM** for database operations
- ✅ **NextAuth.js** for authentication

---

## Step 1: Prepare Your Code

1. **Ensure all dependencies are installed**:
   ```bash
   npm install
   ```

2. **Verify the build works locally**:
   ```bash
   npm run build
   ```
   This should complete without errors.

---

## Step 2: Push to GitHub

1. **Initialize git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Ready for Vercel deployment with Neon Postgres"
   ```

2. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new)
   - Name your repository (e.g., `deja-you`)
   - **Don't** initialize with README (you already have one)
   - Click **"Create repository"**

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/deja-you.git
   git branch -M main
   git push -u origin main
   ```

---

## Step 3: Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in

2. Click **"Add New..."** → **"Project"**

3. **Import your GitHub repository**:
   - Find and click **"Import"** next to your `deja-you` repository
   - Vercel will auto-detect it's a Next.js project

4. **Configure Project Settings**:
   - **Project Name**: `deja-you` (or your preferred name)
   - **Framework Preset**: Next.js ✓ (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

5. **⚠️ IMPORTANT: Don't click "Deploy" yet!**
   - Click **"Environment Variables"** to expand the section
   - We'll add these in the next step

---

## Step 4: Configure Environment Variables (Part 1)

> **IMPORTANT**: Environment variables must be added in the Vercel dashboard, NOT in code files. Never commit secrets to your repository.

Before deploying, you need to prepare these environment variables. We'll add them in the Vercel dashboard in the next step.

### 4.1 Generate NEXTAUTH_SECRET

**On Windows (PowerShell)**:
```powershell
-join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
```

**Or use an online generator**: [generate-secret.vercel.app/32](https://generate-secret.vercel.app/32)

Copy the generated value and save it somewhere temporarily (you'll need it in the next step).

### 4.2 Add Environment Variables in Vercel

In the Vercel project creation screen, scroll down to **"Environment Variables"** section and add:

1. **NEXTAUTH_SECRET**
   - **Name**: `NEXTAUTH_SECRET`
   - **Value**: [paste your generated secret from step 4.1]
   - **Environments**: Check all three: ✓ Production, ✓ Preview, ✓ Development
   - Click **"Add"**

2. **NEXTAUTH_URL** (temporary value - we'll update this after deployment)
   - **Name**: `NEXTAUTH_URL`
   - **Value**: `https://temp-url.vercel.app` (we'll update this later with the real URL)
   - **Environments**: Check all three: ✓ Production, ✓ Preview, ✓ Development
   - Click **"Add"**

> **Note**: Don't worry about `DATABASE_URL` yet - Neon will add it automatically in Step 6.

---

## Step 5: Deploy to Vercel (First Deployment)

1. Click **"Deploy"** button

2. Wait for the deployment (this will fail, but that's expected!)
   - The build will succeed
   - The deployment will fail because there's no database yet
   - This is normal - we need to set up Neon first

3. **Copy your deployment URL** (e.g., `https://deja-you-abc123.vercel.app`)

---

## Step 6: Set Up Neon Postgres Database

1. In your Vercel project dashboard, go to the **"Storage"** tab

2. Click **"Create Database"**

3. In the **Marketplace Database Providers** section, find and click **"Neon"**

4. Click **"Add Integration"** or **"Connect"**

5. **Authorize Neon Integration**:
   - You'll be redirected to Neon
   - Click **"Authorize"** to connect Neon to Vercel
   - If you don't have a Neon account, you'll be prompted to create one (it's free)

6. **Create Database**:
   - **Database Name**: `deja-you-db` (or your preferred name)
   - **Region**: Choose a region close to your users (e.g., US East, EU West)
   - Click **"Create Database"**

7. **Connect to Project**:
   - Select your Vercel project (`deja-you`)
   - Neon will automatically add the `DATABASE_URL` environment variable to your project
   - Click **"Connect"** or **"Done"**

---

## Step 7: Update NEXTAUTH_URL

1. Go to your Vercel project → **"Settings"** → **"Environment Variables"**

2. Find **NEXTAUTH_URL** and click **"Edit"**

3. Update the value to your actual deployment URL (from Step 5)
   - Example: `https://deja-you-abc123.vercel.app`
   - Make sure there's **no trailing slash**

4. Click **"Save"**

---

## Step 8: Redeploy

1. Go to **"Deployments"** tab

2. Click on the latest deployment

3. Click the **"⋯"** (three dots) menu → **"Redeploy"**

4. Check **"Use existing Build Cache"** (optional, makes it faster)

5. Click **"Redeploy"**

6. Wait for deployment to complete (2-5 minutes)

This time it should succeed! ✅

---

## Step 9: Run Database Migrations

Now we need to create the database tables.

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Login to Vercel**:
   ```bash
   vercel login
   ```

3. **Link your project**:
   ```bash
   cd c:\Users\Ntokozo\antigravity_demo4\deja-you
   vercel link
   ```
   - Select your team (if applicable)
   - Select your project (`deja-you`)
   - Confirm the link

4. **Pull environment variables**:
   ```bash
   vercel env pull .env.local
   ```
   This downloads your production environment variables (including `DATABASE_URL`)

5. **Generate migrations**:
   ```bash
   npm run db:generate
   ```
   This creates migration files in the `drizzle/` folder

6. **Run migrations**:
   ```bash
   npm run db:migrate
   ```
   This creates the tables in your Neon database

### Option B: Using Neon Console (Alternative)

If you prefer not to use the CLI:

1. Go to [console.neon.tech](https://console.neon.tech)

2. Select your database

3. Click **"SQL Editor"**

4. Copy and paste the SQL from your migration files in `drizzle/` folder

5. Click **"Run"** to execute

---

## Step 10: Verify Deployment

1. Visit your deployment URL (e.g., `https://deja-you-abc123.vercel.app`)

2. **Test the following**:
   - [ ] Homepage loads correctly
   - [ ] Click **"Sign Up"** and create an account
   - [ ] Log in with your new account
   - [ ] Create a post from the dashboard
   - [ ] View your post on the homepage
   - [ ] Update your profile
   - [ ] Test theme toggle (if applicable)
   - [ ] Verify favicon appears
   - [ ] Check browser tab shows "deja-you"

If everything works, **congratulations!** 🎉 Your app is live!

---

## Step 11: Seed Database (Optional)

If you want to add sample data:

1. Make sure you have `.env.local` with `DATABASE_URL` (from Step 9)

2. Update `seed.ts` if needed

3. Run:
   ```bash
   npx tsx seed.ts
   ```

---

## Updating Your Deployment

To deploy updates in the future:

1. Make changes to your code

2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```

3. Vercel will **automatically** detect the changes and redeploy

---

## Custom Domain (Optional)

To use your own domain:

1. Go to your Vercel project → **"Settings"** → **"Domains"**

2. Click **"Add"**

3. Enter your domain name

4. Follow Vercel's instructions to update your DNS records

5. **Important**: Update `NEXTAUTH_URL` environment variable to your custom domain

6. Redeploy the application

---

## Troubleshooting

### Build Fails

**Error: "Cannot find module '@vercel/postgres'"**
- Run `npm install` locally
- Commit and push `package-lock.json`
- Redeploy

**Error: "Type errors"**
- Run `npm run build` locally to see the errors
- Fix TypeScript errors
- Commit and push

### Deployment Succeeds but App Doesn't Work

**Error: "Database connection failed"**
- Verify Neon integration is connected
- Check that `DATABASE_URL` is in environment variables
- Go to **Settings** → **Environment Variables** and verify

**Error: "NEXTAUTH_SECRET is not set"**
- Add `NEXTAUTH_SECRET` to environment variables (see Step 4)
- Redeploy

**Error: "relation 'users' does not exist"**
- You haven't run migrations yet
- Follow Step 9 to run database migrations

### Authentication Issues

**Can't log in / Session errors**
- Verify `NEXTAUTH_URL` matches your deployment URL exactly
- Must include `https://`
- Must **not** have a trailing slash
- Redeploy after updating

**"Invalid credentials" when logging in**
- Make sure you've run migrations (Step 9)
- Try creating a new account
- Check Neon database has the `users` table

### Database Issues

**"Too many connections"**
- Neon free tier has connection limits
- Use connection pooling (already configured)
- Consider upgrading Neon plan if needed

**Can't see data in database**
- Go to [console.neon.tech](https://console.neon.tech)
- Select your database
- Use SQL Editor to run: `SELECT * FROM users;`
- Verify tables exist and have data

---

## Environment Variables Reference

| Variable | Description | Example | Required |
|----------|-------------|---------|----------|
| `DATABASE_URL` | Neon Postgres connection string | `postgresql://user:pass@host/db` | ✅ Yes |
| `NEXTAUTH_SECRET` | Secret for session encryption | `abc123...` (32+ chars) | ✅ Yes |
| `NEXTAUTH_URL` | Full URL of deployment | `https://deja-you.vercel.app` | ✅ Yes |

---

## Local Development

To develop locally using the production database:

1. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

3. Open [http://localhost:3000](http://localhost:3000)

**⚠️ Warning**: This connects to your **production** database. Be careful!

For safer local development:
- Create a separate Neon database for development
- Use a different `DATABASE_URL` in `.env.local`

---

## Monitoring and Logs

### View Deployment Logs
1. Go to your Vercel project
2. Click **"Deployments"**
3. Click on a deployment
4. View build logs and runtime logs

### View Database
1. Go to [console.neon.tech](https://console.neon.tech)
2. Select your database
3. Use **SQL Editor** to query data
4. View **Monitoring** for performance metrics

---

## Cost and Limits

### Vercel Free Tier
- ✅ Unlimited deployments
- ✅ 100 GB bandwidth/month
- ✅ Serverless function execution

### Neon Free Tier
- ✅ 0.5 GB storage
- ✅ 1 project
- ✅ Unlimited queries
- ⚠️ Database sleeps after 5 minutes of inactivity (wakes up automatically)

Both free tiers are sufficient for personal projects and testing.

---

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Neon Documentation](https://neon.tech/docs)
- [Next.js Deployment](https://nextjs.org/docs/deployment)
- [Drizzle ORM with Neon](https://orm.drizzle.team/docs/get-started-postgresql#neon)
- [NextAuth.js Documentation](https://next-auth.js.org/)

---

## Need Help?

If you encounter issues:

1. **Check deployment logs** in Vercel dashboard
2. **Check database** in Neon console
3. **Review this guide** - most issues are covered in Troubleshooting
4. **Verify environment variables** are set correctly

---

## Summary

You've successfully deployed your Deja-You application! 🚀

**What you accomplished**:
- ✅ Deployed Next.js app to Vercel
- ✅ Set up Neon Postgres database
- ✅ Configured environment variables
- ✅ Ran database migrations
- ✅ Verified the application works

Your app is now live and accessible to anyone with the URL!

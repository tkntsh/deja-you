# Deploying Deja-You to Vercel with Vercel Postgres

This guide provides complete step-by-step instructions for deploying your Deja-You application to Vercel using Vercel Postgres.

## Prerequisites

- A [Vercel account](https://vercel.com/signup) (free tier works)
- A GitHub account
- [Git](https://git-scm.com/) installed on your computer
- [Node.js](https://nodejs.org/) installed (v18 or later)

## Overview

The application has been configured to use Vercel Postgres instead of SQLite. This migration includes:
- ✅ Database schema converted to PostgreSQL
- ✅ Dependencies updated for Vercel Postgres
- ✅ Vercel configuration file created
- ✅ Environment variable template provided

## Step 1: Install Dependencies

First, install the updated dependencies:

```bash
npm install
```

This will install the new PostgreSQL drivers and remove SQLite dependencies.

## Step 2: Push Your Code to GitHub

1. **Initialize git** (if not already done):
   ```bash
   git init
   git add .
   git commit -m "Configure for Vercel Postgres deployment"
   ```

2. **Create a new repository on GitHub**:
   - Go to [github.com/new](https://github.com/new)
   - Name your repository (e.g., `deja-you`)
   - Don't initialize with README (you already have one)
   - Click "Create repository"

3. **Push your code**:
   ```bash
   git remote add origin https://github.com/YOUR_USERNAME/deja-you.git
   git branch -M main
   git push -u origin main
   ```

## Step 3: Create Vercel Project

1. Go to [vercel.com](https://vercel.com) and sign in
2. Click **"Add New..."** → **"Project"**
3. Import your GitHub repository:
   - Click **"Import"** next to your `deja-you` repository
   - Vercel will auto-detect it's a Next.js project

4. **Configure Project** (before deploying):
   - **Framework Preset**: Next.js (auto-detected)
   - **Root Directory**: `./` (leave as default)
   - **Build Command**: `npm run build` (auto-detected)
   - **Output Directory**: `.next` (auto-detected)

5. **Don't click Deploy yet!** We need to set up the database first.

## Step 4: Create Vercel Postgres Database

1. In your Vercel project dashboard, click on the **"Storage"** tab
2. Click **"Create Database"**
3. Select **"Postgres"**
4. Choose a database name (e.g., `deja-you-db`)
5. Select a region (choose one close to your users)
6. Click **"Create"**

Vercel will automatically add the `POSTGRES_URL` environment variable to your project.

## Step 5: Configure Environment Variables

1. In your Vercel project, go to **"Settings"** → **"Environment Variables"**

2. Verify `POSTGRES_URL` is already added (from Step 4)

3. Add **NEXTAUTH_SECRET**:
   - **Key**: `NEXTAUTH_SECRET`
   - **Value**: Generate a secure random string
   
   To generate on Windows (PowerShell):
   ```powershell
   -join ((65..90) + (97..122) + (48..57) | Get-Random -Count 32 | ForEach-Object {[char]$_})
   ```
   
   Or use an online generator: [generate-secret.vercel.app](https://generate-secret.vercel.app/32)

4. Add **NEXTAUTH_URL**:
   - **Key**: `NEXTAUTH_URL`
   - **Value**: Leave blank for now (we'll update after deployment)

5. Make sure all variables are enabled for **Production**, **Preview**, and **Development**

## Step 6: Deploy

1. Go back to your project overview
2. Click **"Deployments"** tab
3. Click **"Redeploy"** or trigger a new deployment by pushing to GitHub

Wait for the build to complete (2-5 minutes). You'll see:
- ✓ Building
- ✓ Deploying
- ✓ Ready

## Step 7: Update NEXTAUTH_URL

1. Once deployed, copy your deployment URL (e.g., `https://deja-you.vercel.app`)
2. Go to **"Settings"** → **"Environment Variables"**
3. Update **NEXTAUTH_URL** with your deployment URL
4. Click **"Save"**
5. Redeploy the application for changes to take effect

## Step 8: Run Database Migrations

You need to create the database tables. You have two options:

### Option A: Using Vercel CLI (Recommended)

1. **Install Vercel CLI**:
   ```bash
   npm install -g vercel
   ```

2. **Link your project**:
   ```bash
   vercel link
   ```
   Follow the prompts to link to your Vercel project.

3. **Pull environment variables**:
   ```bash
   vercel env pull .env.local
   ```
   This downloads your production environment variables locally.

4. **Generate and run migrations**:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

### Option B: Using Vercel Postgres Dashboard

1. Go to your Vercel project → **"Storage"** → Your Postgres database
2. Click **"Query"** tab
3. Run the SQL from your migration files in `drizzle/` folder

## Step 9: Seed the Database (Optional)

If you want to add initial data:

1. Make sure you have `.env.local` with `POSTGRES_URL` (from Step 8)
2. Update `seed.ts` if needed
3. Run:
   ```bash
   npx tsx seed.ts
   ```

## Step 10: Test Your Deployment

Visit your deployment URL and test:

- [ ] Homepage loads correctly
- [ ] User registration works
- [ ] User login works
- [ ] Creating posts works
- [ ] Viewing posts works
- [ ] Profile updates work
- [ ] Theme toggle works
- [ ] Favicon appears correctly
- [ ] Browser tab shows "deja-you"

## Updating Your Deployment

To deploy updates:

1. Make changes to your code
2. Commit and push to GitHub:
   ```bash
   git add .
   git commit -m "Your update message"
   git push
   ```
3. Vercel will automatically detect the changes and redeploy

## Custom Domain (Optional)

To use a custom domain:

1. Go to your Vercel project settings
2. Click **"Domains"**
3. Add your domain
4. Update your DNS records as instructed by Vercel
5. Update `NEXTAUTH_URL` environment variable to your custom domain

## Troubleshooting

### Build Fails

**Error: "Cannot find module '@vercel/postgres'"**
- Run `npm install` to ensure all dependencies are installed
- Check that `package.json` includes `@vercel/postgres` and `postgres`

**Error: "POSTGRES_URL is not defined"**
- Verify the Vercel Postgres database is created
- Check environment variables in Vercel dashboard
- Ensure variables are enabled for the correct environment

### Runtime Errors

**Error: "NEXTAUTH_SECRET is not set"**
- Add `NEXTAUTH_SECRET` to environment variables
- Redeploy the application

**Error: "Database connection failed"**
- Verify `POSTGRES_URL` is correct in environment variables
- Check that the database is running in Vercel dashboard
- Ensure migrations have been run

**Error: "relation 'users' does not exist"**
- You haven't run migrations yet
- Follow Step 8 to run database migrations

### Authentication Issues

**Can't log in after deployment**
- Verify `NEXTAUTH_URL` matches your deployment URL exactly
- Make sure it includes `https://` and no trailing slash
- Redeploy after updating environment variables

### Performance Issues

- Vercel's free tier has limits on function execution time
- Consider upgrading to Pro if you hit limits
- Use Edge Runtime for faster cold starts (advanced)

## Environment Variables Reference

| Variable | Description | Example |
|----------|-------------|---------|
| `POSTGRES_URL` | PostgreSQL connection string | `postgres://user:pass@host/db` |
| `NEXTAUTH_SECRET` | Secret for session encryption | `abc123...` (32+ characters) |
| `NEXTAUTH_URL` | Full URL of your deployment | `https://deja-you.vercel.app` |

## Local Development with Vercel Postgres

To develop locally using the production database:

1. Pull environment variables:
   ```bash
   vercel env pull .env.local
   ```

2. Run development server:
   ```bash
   npm run dev
   ```

**Warning**: This connects to your production database. Be careful!

For safer local development, set up a separate local PostgreSQL database or use a Vercel Postgres preview database.

## Additional Resources

- [Vercel Documentation](https://vercel.com/docs)
- [Vercel Postgres Documentation](https://vercel.com/docs/storage/vercel-postgres)
- [Next.js Deployment Docs](https://nextjs.org/docs/deployment)
- [Drizzle ORM with Vercel Postgres](https://orm.drizzle.team/docs/get-started-postgresql#vercel-postgres)
- [NextAuth.js Documentation](https://next-auth.js.org/)

## Support

If you encounter issues:
1. Check the Vercel deployment logs
2. Review the troubleshooting section above
3. Check Vercel's status page: [vercel-status.com](https://www.vercel-status.com/)

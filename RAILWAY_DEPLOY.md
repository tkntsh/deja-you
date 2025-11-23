# Railway Deployment Guide for Deja-You

This is a step-by-step guide specifically for deploying your deja-you application to Railway.

## Why Railway?

Railway is the **easiest** platform to deploy Next.js apps with PostgreSQL:
- ✅ Built-in PostgreSQL (no external services needed)
- ✅ Automatic GitHub deployments
- ✅ $5/month free credit (plenty for personal projects)
- ✅ Simple environment variable management
- ✅ One-click deployments

---

## Prerequisites

- GitHub account with your code pushed
- Railway account (free - sign up with GitHub)

---

## Step-by-Step Deployment

### Step 1: Sign Up for Railway

1. Go to [railway.app](https://railway.app)
2. Click **"Login"**
3. Select **"Login with GitHub"**
4. Authorize Railway to access your repositories

### Step 2: Create New Project

1. Click **"New Project"** button (top right)
2. Select **"Deploy from GitHub repo"**
3. Find and select your **`deja-you`** repository
4. Railway will automatically detect it's a Next.js app and start deploying

**Note**: The first deployment will fail because we haven't set up the database yet. This is expected!

### Step 3: Add PostgreSQL Database

1. In your project dashboard, click the **"+ New"** button
2. Select **"Database"**
3. Choose **"Add PostgreSQL"**
4. Railway creates the database instantly

**Important**: Railway automatically creates a `DATABASE_URL` environment variable and links it to your Next.js service!

### Step 4: Add Environment Variables

1. Click on your **Next.js service** card (the one that says "deja-you", NOT the PostgreSQL card)
2. Click the **"Variables"** tab
3. Click **"+ New Variable"** button

Add these two variables:

**Variable 1: NEXTAUTH_SECRET**
- **Variable Name**: `NEXTAUTH_SECRET`
- **Value**: `32d22c2e55d7087d07bd742c97a27783`
- Click **"Add"**

**Variable 2: NEXTAUTH_URL** (temporary)
- **Variable Name**: `NEXTAUTH_URL`
- **Value**: `https://temp.railway.app` (we'll update this in Step 6)
- Click **"Add"**

### Step 5: Generate Public Domain

1. Still in your Next.js service, click the **"Settings"** tab
2. Scroll down to **"Networking"** section
3. Click **"Generate Domain"**
4. Railway will create a public URL like: `https://deja-you-production-abc123.up.railway.app`
5. **Copy this URL** - you'll need it in the next step

### Step 6: Update NEXTAUTH_URL

1. Go back to the **"Variables"** tab
2. Find the **NEXTAUTH_URL** variable
3. Click the **pencil icon** to edit
4. Replace the value with your actual Railway URL (from Step 5)
5. Click **"Update"**

Railway will automatically redeploy with the new variable.

### Step 7: Wait for Deployment

1. Click the **"Deployments"** tab
2. Watch the build logs (optional - you can see what's happening)
3. Wait for the status to show **"SUCCESS"** (usually 2-3 minutes)

### Step 8: Run Database Migrations

Now we need to create the database tables. You have two options:

#### Option A: Using Railway CLI (Recommended)

1. **Install Railway CLI**:
   ```bash
   npm install -g @railway/cli
   ```

2. **Login to Railway**:
   ```bash
   railway login
   ```
   This will open a browser window - click "Authorize"

3. **Link to your project**:
   ```bash
   cd c:\Users\Ntokozo\antigravity_demo4\deja-you
   railway link
   ```
   - Select your project from the list
   - Select the environment (usually "production")

4. **Run migrations**:
   ```bash
   railway run npm run db:generate
   railway run npm run db:migrate
   ```

#### Option B: Using Local Connection

1. **Get DATABASE_URL from Railway**:
   - Go to your PostgreSQL service in Railway
   - Click **"Variables"** tab
   - Copy the **DATABASE_URL** value

2. **Add to local .env.local**:
   ```bash
   DATABASE_URL=postgresql://postgres:...@...railway.app:5432/railway
   ```

3. **Run migrations locally**:
   ```bash
   npm run db:generate
   npm run db:migrate
   ```

### Step 9: Test Your Deployment

1. Visit your Railway URL (from Step 5)
2. Test the following:
   - [ ] Homepage loads
   - [ ] Click "Sign Up" and create an account
   - [ ] Log in with your new account
   - [ ] Create a post
   - [ ] View your post on the homepage
   - [ ] Update your profile
   - [ ] Test theme toggle

If everything works, **congratulations!** 🎉 Your app is live!

---

## Automatic Deployments

Railway automatically deploys when you push to GitHub:

```bash
# Make changes to your code
git add .
git commit -m "Update feature"
git push

# Railway automatically detects the push and deploys!
```

You can watch deployments in the Railway dashboard.

---

## Viewing Logs

To see what's happening in your app:

1. Click on your Next.js service
2. Click **"Deployments"** tab
3. Click on any deployment to see logs
4. Or click **"Observability"** for real-time logs

---

## Managing Your Database

### View Database Data

1. Click on your **PostgreSQL** service
2. Click **"Data"** tab
3. You can run SQL queries here

Example queries:
```sql
-- View all users
SELECT * FROM users;

-- View all posts
SELECT * FROM posts;

-- Count posts
SELECT COUNT(*) FROM posts;
```

### Connect with Database Client

You can connect with tools like pgAdmin or TablePlus:

1. Go to PostgreSQL service → **"Connect"** tab
2. Copy connection details:
   - Host
   - Port
   - Database
   - Username
   - Password

---

## Troubleshooting

### Deployment Failed

**Check build logs**:
1. Go to Deployments tab
2. Click on the failed deployment
3. Read the error message

**Common issues**:
- Missing environment variables → Add them in Variables tab
- Build errors → Check your code locally with `npm run build`

### Database Connection Failed

**Verify DATABASE_URL**:
1. Go to Next.js service → Variables tab
2. Ensure `DATABASE_URL` exists and is linked to PostgreSQL service
3. If missing, click "+ New Variable" → "Add a reference" → Select PostgreSQL → DATABASE_URL

### Can't Log In

**Check NEXTAUTH_URL**:
1. Ensure it matches your Railway domain exactly
2. Must include `https://`
3. Must NOT have trailing slash
4. Example: `https://deja-you-production.up.railway.app`

### App is Slow

**Railway free tier limitations**:
- Apps may sleep after inactivity
- First request after sleep takes longer (cold start)
- Upgrade to hobby plan ($5/month) for always-on

---

## Railway Free Tier

**What you get**:
- $5 in credits per month (renews monthly)
- ~500 hours of usage
- 100GB outbound bandwidth
- 1GB RAM per service
- 1GB disk per service

**What happens when credits run out**:
- Services pause until next month
- Data is preserved
- Can upgrade to hobby plan anytime

**For deja-you app**:
- Should easily fit within free tier
- Typical usage: $2-3/month
- Perfect for personal projects

---

## Upgrading (Optional)

If you need more resources:

1. Click **"Settings"** in your project
2. Scroll to **"Plan"**
3. Choose **"Hobby"** ($5/month)
   - $5 credit + unlimited usage
   - Priority support
   - No sleep/pause

---

## Custom Domain (Optional)

To use your own domain:

1. Go to Next.js service → **"Settings"** → **"Networking"**
2. Click **"Custom Domain"**
3. Enter your domain
4. Update your DNS records as instructed
5. Update `NEXTAUTH_URL` environment variable to your custom domain

---

## Summary

✅ **You've successfully deployed to Railway!**

Your app is now:
- Live on the internet
- Automatically deploying on git push
- Using a managed PostgreSQL database
- Completely free (within $5/month credit)

**Your Railway URL**: `https://your-app.up.railway.app`

Enjoy your deployed app! 🚀

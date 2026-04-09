# Quick Start: Deploy Civic Connect to Vercel

## 5-Minute Setup

### Step 1: Push to GitHub
```bash
git init
git add .
git commit -m "Civic Connect - Fixed version"
git remote add origin https://github.com/YOUR_USERNAME/civic-connect.git
git push -u origin main
```

### Step 2: Connect to Vercel
1. Go to https://vercel.com/new
2. Select "Import Git Repository"
3. Paste your GitHub URL
4. Click "Import"

### Step 3: Set Environment Variables
In Vercel dashboard, add these in "Environment Variables":

```
DATABASE_URL=mysql://user:password@host/dbname
OAUTH_SERVER_URL=https://your-oauth-provider.com
JWT_SECRET=<generate-random-string>
OWNER_OPEN_ID=<your-oauth-id>
OWNER_NAME=Admin
```

### Step 4: Deploy
Click "Deploy" and wait for the build to complete.

## What's Fixed

✅ **Report Creation Bug** - Now returns correct database ID
✅ **LiveMap Filters** - Work on all devices with proper timezone handling
✅ **Dashboard Filters** - Now fully functional with category, status, and date filtering

## Database Setup

Before deployment, ensure your MySQL database is set up:

```bash
# Run migrations
pnpm db:push
```

## Environment Variables Explained

| Variable | Purpose | Example |
|----------|---------|---------|
| `DATABASE_URL` | MySQL connection | `mysql://root:pass@db.example.com/civic` |
| `OAUTH_SERVER_URL` | OAuth provider | `https://auth.example.com` |
| `JWT_SECRET` | Session encryption | `abc123xyz...` |
| `OWNER_OPEN_ID` | Admin user ID | `user-123-abc` |
| `OWNER_NAME` | Admin name | `Administrator` |

## Verify Deployment

After deployment completes:

1. Visit your Vercel URL
2. Test login
3. Create a test report
4. Test filters on LiveMap and Dashboard

## Troubleshooting

**Build fails?**
- Check all environment variables are set
- Verify Node.js version 22.x

**Can't connect to database?**
- Verify DATABASE_URL format
- Check database firewall allows Vercel IPs

**Filters not working?**
- Clear browser cache
- Check browser console for errors
- Verify database has test data

## Next Steps

- Set up custom domain in Vercel settings
- Configure AWS S3 for file uploads
- Set up monitoring and alerts
- Configure CI/CD for automatic deployments

For detailed guide, see `VERCEL_DEPLOYMENT.md`

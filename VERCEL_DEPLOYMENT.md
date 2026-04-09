# Civic Connect - Vercel Deployment Guide

This guide will help you deploy the Civic Connect application to Vercel.

## Prerequisites

- A Vercel account (sign up at https://vercel.com)
- Git installed on your machine
- Node.js 22.x or higher
- A MySQL database (for production)
- OAuth provider credentials

## Step 1: Prepare Your Repository

1. Initialize a Git repository in the project directory:
```bash
cd civic-connect-deploy
git init
git add .
git commit -m "Initial commit: Civic Connect application"
```

2. Create a new repository on GitHub, GitLab, or Bitbucket

3. Push your code:
```bash
git remote add origin https://github.com/yourusername/civic-connect.git
git branch -M main
git push -u origin main
```

## Step 2: Deploy to Vercel

### Option A: Using Vercel CLI

1. Install Vercel CLI:
```bash
npm i -g vercel
```

2. Deploy:
```bash
vercel
```

3. Follow the prompts to connect your Git repository

### Option B: Using Vercel Web Dashboard

1. Go to https://vercel.com/dashboard
2. Click "Add New Project"
3. Import your Git repository
4. Vercel will automatically detect the configuration

## Step 3: Configure Environment Variables

1. In the Vercel dashboard, go to your project settings
2. Navigate to "Environment Variables"
3. Add the following variables:

### Required Variables:
- `DATABASE_URL`: Your MySQL connection string
  - Format: `mysql://username:password@host:port/database_name`
  - Example: `mysql://root:password@db.example.com:3306/civic_connect`

- `OAUTH_SERVER_URL`: Your OAuth provider URL
  - Example: `https://auth.example.com`

- `JWT_SECRET`: A secure random string for JWT signing
  - Generate: `openssl rand -base64 32`

- `OWNER_OPEN_ID`: The OAuth ID of the admin user
  - This should be the openId from your OAuth provider

- `OWNER_NAME`: The name of the admin user
  - Example: `Admin`

### Optional Variables:
- `AWS_REGION`: AWS region for S3 storage (default: us-east-1)
- `AWS_ACCESS_KEY_ID`: AWS access key for S3
- `AWS_SECRET_ACCESS_KEY`: AWS secret key for S3
- `AWS_S3_BUCKET`: S3 bucket name for file storage

## Step 4: Database Setup

### For Production MySQL Database:

1. **Option 1: Use a managed database service**
   - PlanetScale (MySQL-compatible)
   - AWS RDS
   - DigitalOcean Managed Databases
   - Railway

2. **Option 2: Self-hosted MySQL**
   - Ensure your database is accessible from Vercel
   - Configure firewall to allow connections from Vercel IPs

### Initialize Database Schema:

1. Connect to your production database
2. Run the migration scripts in `drizzle/` directory:
   ```bash
   pnpm db:push
   ```

## Step 5: Deploy

After setting environment variables:

1. Redeploy your project:
   ```bash
   vercel --prod
   ```

2. Or trigger a redeployment from the Vercel dashboard

## Step 6: Verify Deployment

1. Visit your Vercel project URL
2. Test the following features:
   - User authentication
   - Report creation
   - Filtering (LiveMap and Dashboard)
   - Map visualization
   - Analytics

## Troubleshooting

### Build Fails
- Check that all environment variables are set
- Verify Node.js version is 22.x or higher
- Check build logs in Vercel dashboard

### Database Connection Issues
- Verify `DATABASE_URL` format
- Ensure database is accessible from Vercel
- Check firewall rules and security groups

### OAuth Issues
- Verify `OAUTH_SERVER_URL` is correct
- Check `JWT_SECRET` is set
- Ensure OAuth provider is configured correctly

### Performance Issues
- Consider increasing Vercel function memory
- Optimize database queries
- Enable caching where appropriate

## Important Notes

### Port Configuration
The application automatically detects the port from the `PORT` environment variable. Vercel sets this automatically, so you don't need to configure it.

### File Storage
- For production, configure AWS S3 for file uploads
- Without S3, file uploads will not work
- Set `AWS_*` environment variables for S3 support

### Database Migrations
- Migrations are handled by Drizzle ORM
- Run `pnpm db:push` before first deployment
- Always backup your database before running migrations

## Monitoring and Logs

1. **View Logs**: Go to Vercel dashboard → Deployments → Select deployment → Logs
2. **Monitor Performance**: Use Vercel Analytics
3. **Error Tracking**: Check browser console and server logs

## Custom Domain

1. In Vercel dashboard, go to Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL certificate is automatically provisioned

## Rollback

If you need to rollback to a previous deployment:
1. Go to Vercel dashboard → Deployments
2. Select the previous deployment
3. Click "Promote to Production"

## Support

For issues with:
- **Vercel deployment**: Check https://vercel.com/docs
- **Application bugs**: Review the fixed issues in the code
- **Database**: Consult your database provider's documentation

## Fixed Issues

This deployment includes fixes for:
1. ✅ Report creation now returns correct database ID
2. ✅ LiveMap filters work on all screen sizes
3. ✅ LiveMap date filters handle timezones correctly
4. ✅ Dashboard now includes filter functionality

Enjoy your Civic Connect deployment!

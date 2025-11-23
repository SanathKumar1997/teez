# GitHub Actions CI/CD Guide for AWS Deployment

## Overview

This guide sets up automatic deployment to AWS whenever you push to the `master` branch. The workflow will:
- Build the frontend
- Deploy frontend to S3 + CloudFront
- Deploy backend to EC2
- Run database migrations
- Invalidate CloudFront cache

---

## Prerequisites

1. **GitHub Repository** - Your code must be in a GitHub repo
2. **AWS Account** - With EC2, S3, RDS already set up (follow AWS_DEPLOYMENT_GUIDE.md first)
3. **AWS Credentials** - Access Key ID and Secret Access Key
4. **EC2 SSH Key** - The private key (.pem file) for your EC2 instance

---

## Step 1: Setup AWS IAM User for GitHub Actions

### 1.1 Create IAM User

```bash
# Via AWS Console:
1. Go to IAM → Users → Add User
2. User name: github-actions-deploy
3. Access type: Programmatic access
4. Click Next: Permissions
```

### 1.2 Attach Policies

Attach these policies:
- `AmazonS3FullAccess`
- `CloudFrontFullAccess`
- `AmazonEC2FullAccess` (or create custom policy with SSH access)

### 1.3 Save Credentials

After creating the user, save:
- **Access Key ID**: `AKIAIOSFODNN7EXAMPLE`
- **Secret Access Key**: `wJalrXUtnFEMI/K7MDENG/bPxRfiCYEXAMPLEKEY`

---

## Step 2: Add GitHub Secrets

### 2.1 Navigate to Repository Settings

```
GitHub Repository → Settings → Secrets and variables → Actions → New repository secret
```

### 2.2 Add These Secrets

| Secret Name | Value | Description |
|-------------|-------|-------------|
| `AWS_ACCESS_KEY_ID` | Your IAM Access Key | From Step 1.3 |
| `AWS_SECRET_ACCESS_KEY` | Your IAM Secret Key | From Step 1.3 |
| `AWS_REGION` | `us-east-1` | Your AWS region |
| `EC2_HOST` | `ec2-xx-xx-xx-xx.compute.amazonaws.com` | Your EC2 public DNS |
| `EC2_USERNAME` | `ec2-user` | EC2 username (ec2-user for Amazon Linux) |
| `EC2_SSH_KEY` | Contents of your .pem file | Paste entire private key |
| `S3_BUCKET` | `teez-frontend` | Your S3 bucket name |
| `CLOUDFRONT_DISTRIBUTION_ID` | `E1234567890ABC` | From CloudFront console |
| `VITE_API_URL` | `https://api.yourdomain.com` | Your backend API URL |
| `VITE_STRIPE_PUBLIC_KEY` | `pk_live_...` | Your Stripe public key |

---

## Step 3: Create GitHub Actions Workflow Files

### 3.1 Create Workflow Directory

```bash
mkdir -p .github/workflows
```

### 3.2 Create Main Deployment Workflow

Create `.github/workflows/deploy.yml`:

```yaml
name: Deploy to AWS

on:
  push:
    branches:
      - master
  workflow_dispatch: # Allow manual trigger

jobs:
  deploy-frontend:
    name: Deploy Frontend to S3
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup Node.js
        uses: actions/setup-node@v3
        with:
          node-version: '18'
          cache: 'npm'

      - name: Install dependencies
        run: npm ci

      - name: Create .env.production
        run: |
          echo "VITE_API_URL=${{ secrets.VITE_API_URL }}" > .env.production
          echo "VITE_STRIPE_PUBLIC_KEY=${{ secrets.VITE_STRIPE_PUBLIC_KEY }}" >> .env.production

      - name: Build frontend
        run: npm run build

      - name: Configure AWS credentials
        uses: aws-actions/configure-aws-credentials@v2
        with:
          aws-access-key-id: ${{ secrets.AWS_ACCESS_KEY_ID }}
          aws-secret-access-key: ${{ secrets.AWS_SECRET_ACCESS_KEY }}
          aws-region: ${{ secrets.AWS_REGION }}

      - name: Deploy to S3
        run: |
          aws s3 sync dist/ s3://${{ secrets.S3_BUCKET }} --delete --acl public-read

      - name: Invalidate CloudFront cache
        run: |
          aws cloudfront create-invalidation \
            --distribution-id ${{ secrets.CLOUDFRONT_DISTRIBUTION_ID }} \
            --paths "/*"

      - name: Deployment Success
        run: echo "✅ Frontend deployed successfully to S3 + CloudFront"

  deploy-backend:
    name: Deploy Backend to EC2
    runs-on: ubuntu-latest
    needs: deploy-frontend
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.EC2_SSH_KEY }}" > ~/.ssh/deploy_key.pem
          chmod 600 ~/.ssh/deploy_key.pem
          ssh-keyscan -H ${{ secrets.EC2_HOST }} >> ~/.ssh/known_hosts

      - name: Deploy to EC2
        run: |
          ssh -i ~/.ssh/deploy_key.pem ${{ secrets.EC2_USERNAME }}@${{ secrets.EC2_HOST }} << 'EOF'
            set -e
            
            # Navigate to project directory
            cd ~/teez/server || { echo "Project directory not found"; exit 1; }
            
            # Pull latest code
            git pull origin master
            
            # Install dependencies
            npm ci --production
            
            # Restart PM2 process
            pm2 restart teez-api || pm2 start index.js --name teez-api
            
            # Save PM2 configuration
            pm2 save
            
            echo "✅ Backend deployed successfully"
          EOF

      - name: Health Check
        run: |
          sleep 10
          curl -f ${{ secrets.VITE_API_URL }}/health || exit 1

      - name: Deployment Success
        run: echo "✅ Backend deployed and health check passed"

  notify:
    name: Notify Deployment Status
    runs-on: ubuntu-latest
    needs: [deploy-frontend, deploy-backend]
    if: always()
    
    steps:
      - name: Deployment Status
        run: |
          if [ "${{ needs.deploy-frontend.result }}" == "success" ] && [ "${{ needs.deploy-backend.result }}" == "success" ]; then
            echo "🎉 Deployment completed successfully!"
          else
            echo "❌ Deployment failed. Check logs above."
            exit 1
          fi
```

### 3.3 Create Separate Backend Deployment Workflow (Optional)

Create `.github/workflows/deploy-backend-only.yml`:

```yaml
name: Deploy Backend Only

on:
  push:
    branches:
      - master
    paths:
      - 'server/**'
  workflow_dispatch:

jobs:
  deploy-backend:
    name: Deploy Backend to EC2
    runs-on: ubuntu-latest
    
    steps:
      - name: Checkout code
        uses: actions/checkout@v3

      - name: Setup SSH
        run: |
          mkdir -p ~/.ssh
          echo "${{ secrets.EC2_SSH_KEY }}" > ~/.ssh/deploy_key.pem
          chmod 600 ~/.ssh/deploy_key.pem
          ssh-keyscan -H ${{ secrets.EC2_HOST }} >> ~/.ssh/known_hosts

      - name: Deploy to EC2
        run: |
          ssh -i ~/.ssh/deploy_key.pem ${{ secrets.EC2_USERNAME }}@${{ secrets.EC2_HOST }} << 'EOF'
            cd ~/teez/server
            git pull origin master
            npm ci --production
            pm2 restart teez-api
            pm2 save
          EOF

      - name: Health Check
        run: |
          sleep 5
          curl -f ${{ secrets.VITE_API_URL }}/health || exit 1
```

---

## Step 4: Prepare EC2 for Automated Deployments

### 4.1 Clone Repository on EC2

```bash
# SSH into EC2
ssh -i teez-key.pem ec2-user@[EC2-IP]

# Clone your repository
cd ~
git clone https://github.com/yourusername/teez.git
cd teez/server

# Install dependencies
npm install

# Setup PM2
pm2 start index.js --name teez-api
pm2 startup
pm2 save
```

### 4.2 Add Health Check Endpoint

Add to `server/index.js`:

```javascript
// Health check endpoint for CI/CD
app.get('/health', (req, res) => {
  res.json({ status: 'healthy', timestamp: new Date().toISOString() });
});
```

### 4.3 Configure Git on EC2

```bash
# Configure git to avoid merge conflicts
git config pull.rebase false
git config user.email "deploy@teez.com"
git config user.name "Deploy Bot"
```

---

## Step 5: Test the Workflow

### 5.1 Make a Test Commit

```bash
# On your local machine
echo "# Test deployment" >> README.md
git add README.md
git commit -m "test: trigger deployment"
git push origin master
```

### 5.2 Monitor Deployment

```bash
# Go to GitHub:
Repository → Actions → Deploy to AWS

# Watch the workflow run in real-time
# Check logs for each step
```

---

## Step 6: Advanced Configuration

### 6.1 Add Database Migrations

Update `.github/workflows/deploy.yml` backend job:

```yaml
- name: Run Database Migrations
  run: |
    ssh -i ~/.ssh/deploy_key.pem ${{ secrets.EC2_USERNAME }}@${{ secrets.EC2_HOST }} << 'EOF'
      cd ~/teez/server
      npm run migrate # Add this script to package.json
    EOF
```

### 6.2 Add Rollback Capability

Create `.github/workflows/rollback.yml`:

```yaml
name: Rollback Deployment

on:
  workflow_dispatch:
    inputs:
      commit_sha:
        description: 'Commit SHA to rollback to'
        required: true

jobs:
  rollback:
    runs-on: ubuntu-latest
    steps:
      - name: Rollback Backend
        run: |
          ssh -i ~/.ssh/deploy_key.pem ${{ secrets.EC2_USERNAME }}@${{ secrets.EC2_HOST }} << EOF
            cd ~/teez/server
            git checkout ${{ github.event.inputs.commit_sha }}
            npm ci --production
            pm2 restart teez-api
          EOF
```

### 6.3 Add Slack Notifications (Optional)

Add to workflow:

```yaml
- name: Notify Slack
  if: always()
  uses: 8398a7/action-slack@v3
  with:
    status: ${{ job.status }}
    webhook_url: ${{ secrets.SLACK_WEBHOOK }}
```

---

## Step 7: Environment-Specific Deployments

### 7.1 Create Staging Workflow

Create `.github/workflows/deploy-staging.yml`:

```yaml
name: Deploy to Staging

on:
  push:
    branches:
      - develop

jobs:
  deploy-staging:
    # Same as production but use different secrets:
    # STAGING_EC2_HOST
    # STAGING_S3_BUCKET
    # etc.
```

---

## Workflow Diagram

```
┌─────────────────────────────────────────────────┐
│ Developer pushes to master branch               │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ GitHub Actions triggered automatically          │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Job 1: Deploy Frontend                          │
│ - Checkout code                                 │
│ - Install dependencies                          │
│ - Build React app                               │
│ - Upload to S3                                  │
│ - Invalidate CloudFront cache                   │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Job 2: Deploy Backend                           │
│ - SSH into EC2                                  │
│ - Pull latest code                              │
│ - Install dependencies                          │
│ - Restart PM2 process                           │
│ - Run health check                              │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ Job 3: Notify                                   │
│ - Send deployment status                        │
└─────────────────────────────────────────────────┘
```

---

## Troubleshooting

### Issue: SSH Connection Failed
```bash
# Solution: Verify EC2 security group allows SSH from GitHub IPs
# Add GitHub Actions IP ranges to EC2 security group
```

### Issue: S3 Upload Permission Denied
```bash
# Solution: Check IAM user has S3FullAccess policy
# Verify bucket name in secrets matches actual bucket
```

### Issue: PM2 Process Not Restarting
```bash
# Solution: SSH into EC2 and check PM2 status
pm2 status
pm2 logs teez-api
```

### Issue: Build Fails
```bash
# Solution: Check Node version matches
# Verify all dependencies are in package.json
# Check for environment variable issues
```

---

## Best Practices

1. **Always test in staging first** before deploying to production
2. **Use semantic versioning** for releases
3. **Tag releases** in Git for easy rollback
4. **Monitor deployments** in CloudWatch
5. **Set up alerts** for failed deployments
6. **Keep secrets secure** - never commit them
7. **Use branch protection** rules on master
8. **Require PR reviews** before merging to master

---

## Quick Reference Commands

```bash
# View workflow runs
gh run list

# View specific run logs
gh run view [RUN_ID]

# Manually trigger workflow
gh workflow run deploy.yml

# Cancel running workflow
gh run cancel [RUN_ID]

# SSH into EC2 to debug
ssh -i teez-key.pem ec2-user@[EC2-IP]

# Check PM2 status
pm2 status
pm2 logs teez-api

# Check S3 deployment
aws s3 ls s3://teez-frontend
```

---

## Summary

After completing this setup:

1. ✅ Push to `master` → Automatic deployment
2. ✅ Frontend deployed to S3 + CloudFront
3. ✅ Backend deployed to EC2 with PM2
4. ✅ Health checks verify deployment
5. ✅ CloudFront cache invalidated
6. ✅ Deployment status visible in GitHub Actions

**Deployment Time**: ~3-5 minutes per push

**Zero Downtime**: PM2 handles graceful restarts

**Rollback**: Manual workflow or git revert + push

---

## Next Steps

1. Set up the workflow files
2. Add GitHub secrets
3. Test with a small commit
4. Monitor the deployment
5. Celebrate automated deployments! 🎉

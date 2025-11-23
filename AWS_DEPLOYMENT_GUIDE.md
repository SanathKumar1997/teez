# AWS Deployment Guide for TEEZ E-Commerce Platform

## Architecture Overview

Your TEEZ platform consists of:
- **Frontend**: React + Vite (Static files)
- **Backend**: Node.js + Express API
- **Database**: SQLite (needs migration to production DB)
- **Payment**: Stripe integration

## Recommended AWS Architecture

### Option 1: Simple & Cost-Effective (Recommended for Start)

```
┌─────────────────────────────────────────────────┐
│ CloudFront (CDN)                                │
│ - Frontend static files                         │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ S3 Bucket (Frontend)                            │
│ - React build files                             │
└─────────────────────────────────────────────────┘

┌─────────────────────────────────────────────────┐
│ EC2 Instance (Backend)                          │
│ - Node.js API                                   │
│ - PM2 for process management                    │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ RDS MySQL/PostgreSQL                            │
│ - Replace SQLite                                │
└─────────────────────────────────────────────────┘
```

**Estimated Monthly Cost**: $15-30 (with free tier)

### Option 2: Serverless (More Scalable)

```
┌─────────────────────────────────────────────────┐
│ CloudFront + S3 (Frontend)                      │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ API Gateway + Lambda (Backend)                  │
│ - Serverless Node.js functions                  │
└─────────────────────────────────────────────────┘
                    ↓
┌─────────────────────────────────────────────────┐
│ RDS MySQL (Database)                            │
└─────────────────────────────────────────────────┘
```

**Estimated Monthly Cost**: $10-20 (pay per use)

---

## Step-by-Step Deployment (Option 1)

### Prerequisites

1. **AWS Account** - Create at [aws.amazon.com](https://aws.amazon.com)
2. **AWS CLI** - Install from [aws.amazon.com/cli](https://aws.amazon.com/cli/)
3. **Domain Name** (Optional) - From Route 53 or external registrar

### Step 1: Prepare Database Migration

#### 1.1 Install PostgreSQL adapter
```bash
npm install pg
```

#### 1.2 Update `server/db.js` for PostgreSQL
```javascript
import pkg from 'pg';
const { Pool } = pkg;

const pool = new Pool({
  host: process.env.DB_HOST,
  port: process.env.DB_PORT || 5432,
  database: process.env.DB_NAME,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  ssl: { rejectUnauthorized: false }
});

export default pool;
```

### Step 2: Setup RDS Database

#### 2.1 Create RDS PostgreSQL Instance
```bash
# Via AWS Console:
1. Go to RDS → Create Database
2. Choose PostgreSQL
3. Template: Free tier
4. DB instance identifier: teez-db
5. Master username: admin
6. Master password: [create strong password]
7. DB instance class: db.t3.micro
8. Storage: 20 GB
9. Enable automatic backups
10. Create database
```

#### 2.2 Configure Security Group
- Allow inbound PostgreSQL (port 5432) from your EC2 security group
- Note the endpoint URL (e.g., `teez-db.xxxxx.us-east-1.rds.amazonaws.com`)

### Step 3: Deploy Backend to EC2

#### 3.1 Launch EC2 Instance
```bash
# Via AWS Console:
1. Go to EC2 → Launch Instance
2. Name: teez-backend
3. AMI: Amazon Linux 2023
4. Instance type: t2.micro (free tier)
5. Create new key pair: teez-key.pem
6. Security group: Allow SSH (22), HTTP (80), HTTPS (443), Custom TCP (3000)
7. Launch instance
```

#### 3.2 Connect to EC2
```bash
# Download teez-key.pem
chmod 400 teez-key.pem
ssh -i teez-key.pem ec2-user@[EC2-PUBLIC-IP]
```

#### 3.3 Setup Node.js on EC2
```bash
# Install Node.js
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.0/install.sh | bash
source ~/.bashrc
nvm install 18
nvm use 18

# Install PM2
npm install -g pm2

# Install Git
sudo yum install git -y
```

#### 3.4 Deploy Backend Code
```bash
# Clone your repository (or upload files)
git clone [YOUR_REPO_URL]
cd teez/server

# Install dependencies
npm install

# Create .env file
cat > .env << EOF
PORT=3000
JWT_SECRET=[your-secret-key]
STRIPE_SECRET_KEY=[your-stripe-key]
DB_HOST=[RDS-ENDPOINT]
DB_PORT=5432
DB_NAME=teez
DB_USER=admin
DB_PASSWORD=[your-db-password]
NODE_ENV=production
EOF

# Start with PM2
pm2 start index.js --name teez-api
pm2 startup
pm2 save
```

#### 3.5 Setup Nginx Reverse Proxy
```bash
# Install Nginx
sudo yum install nginx -y

# Configure Nginx
sudo nano /etc/nginx/conf.d/teez.conf
```

Add this configuration:
```nginx
server {
    listen 80;
    server_name [YOUR_DOMAIN_OR_IP];

    location /api {
        proxy_pass http://localhost:3000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

```bash
# Start Nginx
sudo systemctl start nginx
sudo systemctl enable nginx
```

### Step 4: Deploy Frontend to S3 + CloudFront

#### 4.1 Build Frontend
```bash
# On your local machine
cd teez
npm run build
```

#### 4.2 Create S3 Bucket
```bash
# Via AWS Console:
1. Go to S3 → Create bucket
2. Bucket name: teez-frontend (must be globally unique)
3. Region: us-east-1
4. Uncheck "Block all public access"
5. Create bucket
```

#### 4.3 Enable Static Website Hosting
```bash
# In S3 bucket settings:
1. Properties → Static website hosting → Enable
2. Index document: index.html
3. Error document: index.html
4. Save changes
```

#### 4.4 Upload Build Files
```bash
# Install AWS CLI
aws configure
# Enter your AWS Access Key ID, Secret Key, Region

# Upload files
cd dist
aws s3 sync . s3://teez-frontend --acl public-read
```

#### 4.5 Setup CloudFront CDN
```bash
# Via AWS Console:
1. Go to CloudFront → Create Distribution
2. Origin domain: [S3-bucket-website-endpoint]
3. Viewer protocol policy: Redirect HTTP to HTTPS
4. Default root object: index.html
5. Create distribution
6. Note the CloudFront domain (e.g., d123abc.cloudfront.net)
```

### Step 5: Update Frontend API URL

Update `src/services/api.js`:
```javascript
const API_URL = import.meta.env.VITE_API_URL || 'http://[EC2-PUBLIC-IP]/api';
```

Create `.env.production`:
```bash
VITE_API_URL=http://[EC2-PUBLIC-IP]/api
```

Rebuild and redeploy:
```bash
npm run build
aws s3 sync dist s3://teez-frontend --acl public-read --delete
```

### Step 6: Setup SSL Certificate (HTTPS)

#### 6.1 Request Certificate in ACM
```bash
# Via AWS Console:
1. Go to Certificate Manager
2. Request certificate
3. Domain: yourdomain.com, www.yourdomain.com
4. Validation: DNS validation
5. Add CNAME records to your domain DNS
6. Wait for validation
```

#### 6.2 Update CloudFront with SSL
```bash
1. CloudFront → Edit Distribution
2. Alternate domain names: yourdomain.com
3. SSL certificate: Select your ACM certificate
4. Save changes
```

#### 6.3 Setup Route 53 (Optional)
```bash
1. Create hosted zone for your domain
2. Create A record pointing to CloudFront
```

---

## Environment Variables Summary

### Backend (.env on EC2)
```bash
PORT=3000
JWT_SECRET=your-super-secret-jwt-key-change-this
STRIPE_SECRET_KEY=sk_live_your_stripe_key
DB_HOST=teez-db.xxxxx.us-east-1.rds.amazonaws.com
DB_PORT=5432
DB_NAME=teez
DB_USER=admin
DB_PASSWORD=your-db-password
NODE_ENV=production
CORS_ORIGIN=https://yourdomain.com
```

### Frontend (.env.production)
```bash
VITE_API_URL=https://api.yourdomain.com
VITE_STRIPE_PUBLIC_KEY=pk_live_your_stripe_key
```

---

## Post-Deployment Checklist

- [ ] Test all API endpoints
- [ ] Verify database connections
- [ ] Test Stripe payment flow
- [ ] Check CORS settings
- [ ] Enable CloudWatch monitoring
- [ ] Setup automated backups for RDS
- [ ] Configure auto-scaling (optional)
- [ ] Setup CloudWatch alarms
- [ ] Enable AWS WAF for security (optional)
- [ ] Test admin panel functionality
- [ ] Verify SSL certificate

---

## Monitoring & Maintenance

### CloudWatch Logs
```bash
# View EC2 logs
pm2 logs teez-api

# Setup CloudWatch agent
sudo yum install amazon-cloudwatch-agent
```

### Database Backups
- RDS automated backups (enabled by default)
- Snapshot before major updates

### Cost Optimization
- Use Reserved Instances for EC2 (save 30-70%)
- Enable S3 lifecycle policies
- Use CloudFront caching effectively
- Monitor with AWS Cost Explorer

---

## Alternative: Deploy with Elastic Beanstalk (Easiest)

```bash
# Install EB CLI
pip install awsebcli

# Initialize
cd teez/server
eb init -p node.js teez-api

# Create environment
eb create teez-production

# Deploy
eb deploy

# Open in browser
eb open
```

---

## Troubleshooting

### Backend not accessible
- Check EC2 security group allows port 3000
- Verify PM2 is running: `pm2 status`
- Check logs: `pm2 logs teez-api`

### Database connection errors
- Verify RDS security group allows EC2
- Check credentials in .env
- Test connection: `psql -h [RDS-ENDPOINT] -U admin -d teez`

### Frontend not loading
- Clear CloudFront cache
- Check S3 bucket policy allows public read
- Verify API_URL in frontend

---

## Cost Estimate (Monthly)

| Service | Configuration | Cost |
|---------|--------------|------|
| EC2 t2.micro | 1 instance | $8-10 |
| RDS db.t3.micro | PostgreSQL | $15-20 |
| S3 | 5GB storage | $0.12 |
| CloudFront | 10GB transfer | $1-2 |
| **Total** | | **$25-35/month** |

*Free tier eligible for first 12 months: ~$0-5/month*

---

## Next Steps

1. **Get AWS Account** - Sign up at aws.amazon.com
2. **Follow Steps 1-6** - Deploy systematically
3. **Test Thoroughly** - Verify all features work
4. **Monitor** - Setup CloudWatch alarms
5. **Scale** - Add load balancer when traffic grows

Need help with any specific step? Let me know!

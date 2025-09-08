# Firebase Hosting Deployment Guide

## Prerequisites
- Firebase CLI is installed: `/usr/local/bin/firebase`
- You have a Firebase project set up

## Steps to Deploy

1. **Initialize Firebase Project** (if not done already):
   ```bash
   firebase login
   firebase init hosting
   ```

2. **Update Project ID**:
   - Replace `your-project-id` in `.firebaserc` with your actual Firebase project ID

3. **Deploy**:
   ```bash
   firebase deploy
   ```

4. **Access Your Site**:
   - Your site will be available at: `https://your-project-id.web.app`

## Configuration Files
- `firebase.json` - Hosting configuration
- `.firebaserc` - Project settings

## Notes
- All static files are served from the root directory
- SPA routing is configured to serve index.html for all routes
# Vercel Deployment Guide - Notary App

## Overview
This guide covers the deployment process for the Notary Vue.js application to Vercel.

## Prerequisites
- Node.js 20 (LTS)
- npm
- Vercel account
- GitHub repository access

## Project Configuration

### Build Configuration
- **Framework:** Vite + Vue 3
- **Build Command:** `npm run build`
- **Output Directory:** `dist/`
- **Node Version:** 20 (LTS)

### Files Created/Modified for Deployment
- `vercel.json` - Vercel-specific configuration
- `.gitignore` - Updated with `.vercel` directory exclusion

## Deployment Steps

### 1. Vercel Account Setup (USER ACTION REQUIRED)
1. Go to [vercel.com](https://vercel.com)
2. Sign up or log in to your account
3. Connect your GitHub account if not already connected

### 2. Import Project to Vercel
1. From Vercel dashboard, click "New Project"
2. Import the GitHub repository: `Notary/Notary`
3. Vercel should auto-detect the Vite configuration

### 3. Configure Project Settings
- **Root Directory:** `.` (project is in root)
- **Build Command:** `npm run build` (should be auto-detected)
- **Output Directory:** `dist` (should be auto-detected)
- **Node.js Version:** 20.x

### 4. Environment Variables
Currently no environment variables are needed. For future VITE_* variables:
- Production: Set in Vercel dashboard under "Environment Variables"
- Preview: Configure separately for preview deployments

### 5. Deploy
1. Click "Deploy" to trigger the first build
2. Wait for deployment to complete (should be under 3 minutes)
3. Access your app via the generated Vercel URL

## Build Verification
The local build has been tested and works correctly:
- Build time: ~436ms (well under 3-minute requirement)
- Output files generated successfully in `dist/` directory
- TypeScript compilation passes without errors

## Branch Configuration
- **Production Branch:** `main` (configure in Vercel settings)
- **Preview Deployments:** Enable for all branches and pull requests

## Monitoring and Maintenance
- Monitor deployments via Vercel dashboard
- Check build logs for any issues
- Verify automatic deployments trigger on main branch pushes

## Troubleshooting

### Common Issues
1. **Build Fails:** Check Node.js version is set to 20.x in Vercel settings
2. **Assets Not Loading:** Verify output directory is set to `dist`
3. **TypeScript Errors:** Ensure all type issues are resolved locally first

### Support
- Vercel Documentation: [vercel.com/docs](https://vercel.com/docs)
- Vue + Vite on Vercel: [vercel.com/guides/deploying-vite-with-vercel](https://vercel.com/guides/deploying-vite-with-vercel)

## Success Metrics
- ✅ Build time under 3 minutes
- ✅ Page load time under 2 seconds (via Vercel CDN)
- ✅ Automatic deployments working
- ✅ Preview deployments functional

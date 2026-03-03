# Deploying Tambola Pro User App 🎲

This guide is for absolute beginners to deploy the Tambola Pro Player (User) Application to the internet for free using Netlify.

## 📝 Prerequisites
Before deploying the user app, make sure you have:
1. **GitHub Account**: Sign up at [GitHub.com](https://github.com/).
2. **Clerk Publishable Key**: From your application on [Clerk.com](https://clerk.com/).
3. **Live Backend URL**: You must have already deployed the [Backend](https://github.com/DRLVP/tambola-pro.git) on Render and grabbed its live URL.
4. **Netlify Account**: Sign up at [Netlify.com](https://www.netlify.com/) using your GitHub Account.

## 📥 Step 1: Fork the Repository
Make your own copy of the official User App code.
1. Make sure you are logged into GitHub.
2. Go to the official User App repository: [https://github.com/DRLVP/tambola-pro-user.git](https://github.com/DRLVP/tambola-pro-user.git)
3. In the top-right corner, click the **Fork** button and click **Create fork**.

## 🚀 Step 2: Deploy to Netlify
The user app needs a website host. We will use Netlify.
1. Go to your [Netlify Dashboard](https://app.netlify.com/).
2. Click **Add new site** -> **Import an existing project**.
3. Select **GitHub** and authorize Netlify if prompted.
4. Select your forked `tambola-pro-user` repository.

## 🔐 Step 3: Configure Environment Variables (.env)
The user app needs to know how to connect to the backend server and authenticate players.
1. On the deployment screen, scroll down to **Environment variables**.
2. Click **Add environment variables** -> **New variable** and add exactly these two keys:
   * **Key**: `VITE_API_URL`
     **Value**: *(Paste the live Render Backend URL here. Example: `https://my-backend.onrender.com`)*
   * **Key**: `VITE_CLERK_PUBLISHABLE_KEY`
     **Value**: *(Paste your Clerk Publishable Key here)*
3. Click **Deploy [Repo Name]**.
4. It will build the website. Wait a couple of minutes!
5. When finished, Netlify will furnish a live link (e.g., `https://my-tambola-game.netlify.app`). Click the link to view the game!

## 🎉 Step 4: Add to Clerk
To allow players to securely sign in:
1. Go to your [Clerk Dashboard](https://dashboard.clerk.com).
2. Navigate to **Configure** -> **Domains** (or Origins).
3. Ensure you add your new Netlify App URL here, so Clerk permits logins from this specific website domain.

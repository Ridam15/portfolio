# Git Setup Guide

Follow these steps to push your portfolio project to GitHub:

## Step 1: Initialize Git Repository

```bash
cd /Users/ridam.chhapiya/Documents/ai_built/cursor/portfolio
git init
```

## Step 2: Add All Files

```bash
git add .
```

## Step 3: Create Initial Commit

```bash
git commit -m "Initial commit: Portfolio website with Next.js, Firebase, and admin dashboard"
```

## Step 4: Create GitHub Repository

1. Go to [GitHub](https://github.com)
2. Click the "+" icon in the top right → "New repository"
3. Name your repository (e.g., "portfolio" or "my-portfolio-website")
4. Choose visibility (Public or Private)
5. **DO NOT** initialize with README, .gitignore, or license (we already have these)
6. Click "Create repository"

## Step 5: Add Remote Origin

Replace `YOUR_USERNAME` and `YOUR_REPO_NAME` with your actual GitHub username and repository name:

```bash
git remote add origin https://github.com/YOUR_USERNAME/YOUR_REPO_NAME.git
```

Or if you prefer SSH:

```bash
git remote add origin git@github.com:YOUR_USERNAME/YOUR_REPO_NAME.git
```

## Step 6: Push to GitHub

```bash
git branch -M main
git push -u origin main
```

## ✅ Done!

Your portfolio is now on GitHub! You can view it at:
`https://github.com/YOUR_USERNAME/YOUR_REPO_NAME`

---

## 🔄 Future Updates

After making changes to your code:

```bash
# Check what files have changed
git status

# Add all changes
git add .

# Or add specific files
git add path/to/file

# Commit with a descriptive message
git commit -m "Description of your changes"

# Push to GitHub
git push
```

---

## 🚨 Important Notes

- **Never commit `.env.local`** - It's already in `.gitignore` to protect your Firebase credentials
- The `.env.example` file is safe to commit as it contains no real credentials
- Always write clear commit messages describing what you changed
- Consider creating a `.github/workflows` directory for CI/CD if needed

---

## 📝 Commit Message Best Practices

Good commit messages:
- `feat: Add contact form validation`
- `fix: Resolve particle background performance issue`
- `docs: Update README with deployment instructions`
- `style: Improve glassmorphic card styling`
- `refactor: Extract reusable hooks`

---

## 🌿 Branching (Optional but Recommended)

For feature development:

```bash
# Create and switch to a new branch
git checkout -b feature/new-feature-name

# Make your changes, then commit
git add .
git commit -m "feat: Add new feature"

# Push the branch
git push -u origin feature/new-feature-name

# Create a Pull Request on GitHub to merge into main
```

#!/usr/bin/env node

/**
 * scripts/git-push.mjs
 * 
 * BuildPilot - Professional One-Command Git Release Script
 * Validates environment, verifies secret protection, runs production build,
 * stages changes, commits with conventional message, and safely pushes to origin.
 */

import { execSync, spawnSync } from 'child_process';
import fs from 'fs';
import path from 'path';

// ANSI color formatting
const colors = {
  reset: '\x1b[0m',
  bold: '\x1b[1m',
  dim: '\x1b[2m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  red: '\x1b[31m',
};

function log(msg) {
  console.log(msg);
}

function info(msg) {
  console.log(`${colors.cyan}[INFO]${colors.reset} ${msg}`);
}

function success(msg) {
  console.log(`${colors.green}[SUCCESS]${colors.reset} ${msg}`);
}

function warn(msg) {
  console.log(`${colors.yellow}[WARN]${colors.reset} ${msg}`);
}

function error(msg) {
  console.error(`${colors.red}[ERROR]${colors.reset} ${msg}`);
}

function run(cmd, options = {}) {
  return execSync(cmd, { encoding: 'utf8', stdio: 'pipe', ...options }).trim();
}

function runInteractive(cmd, args, options = {}) {
  // Use shell: true only for npm commands on Windows, but direct execution for git commands to preserve quoted string arguments
  const useShell = cmd === 'npm' && process.platform === 'win32';
  const result = spawnSync(cmd, args, { stdio: 'inherit', shell: useShell, ...options });
  if (result.status !== 0) {
    throw new Error(`Command "${cmd} ${args.join(' ')}" failed with exit code ${result.status}`);
  }
}

async function main() {
  log(`\n${colors.bold}${colors.blue}====================================================${colors.reset}`);
  log(`${colors.bold}${colors.blue}      BUILDPILOT — GIT RELEASE & PUSH WORKFLOW      ${colors.reset}`);
  log(`${colors.bold}${colors.blue}====================================================${colors.reset}\n`);

  // 1. Verify Git Repository
  info('Step 1/7: Verifying Git environment...');
  try {
    const isGit = run('git rev-parse --is-inside-work-tree');
    if (isGit !== 'true') {
      throw new Error('Not inside a valid Git repository.');
    }
  } catch (err) {
    error('This directory is not an active Git repository.');
    process.exit(1);
  }

  // 2. Verify Remote Origin
  let remoteUrl = '';
  try {
    remoteUrl = run('git remote get-url origin');
    if (!remoteUrl) {
      throw new Error('No URL for origin.');
    }
    info(`Connected to remote: ${colors.bold}${remoteUrl}${colors.reset}`);
  } catch (err) {
    error("Git remote 'origin' is not configured. Please add an origin remote first.");
    process.exit(1);
  }

  // 3. Determine Branch & Check Detached HEAD
  const branch = run('git branch --show-current');
  if (!branch || branch === 'HEAD') {
    error('Detached HEAD state detected! Pushing from detached HEAD is prohibited.');
    error('Please switch to a valid branch (e.g., git checkout main) before running git:push.');
    process.exit(1);
  }
  info(`Current active branch: ${colors.bold}${branch}${colors.reset}`);

  // 4. Security & Secret Protection Check
  info('Step 2/7: Checking secret protection & .gitignore rules...');
  const secretPatterns = [
    '.env',
    '.env.local',
    '.env.development.local',
    '.env.test.local',
    '.env.production.local',
  ];

  // Untrack any secret files accidentally tracked in git index while preserving disk file
  for (const secretFile of secretPatterns) {
    try {
      const isTracked = run(`git ls-files --error-unmatch ${secretFile}`, { stdio: 'pipe' });
      if (isTracked) {
        warn(`Secret file "${secretFile}" was tracked in git! Untracking from git cache...`);
        run(`git rm --cached ${secretFile}`);
        success(`Untracked "${secretFile}" from Git cache (preserved on local disk).`);
      }
    } catch {
      // File is not tracked - this is the expected secure state
    }
  }

  // Verify .gitignore exists and contains secret ignores
  const gitignorePath = path.join(process.cwd(), '.gitignore');
  if (fs.existsSync(gitignorePath)) {
    const gitignoreContent = fs.readFileSync(gitignorePath, 'utf8');
    if (!gitignoreContent.includes('.env*.local') && !gitignoreContent.includes('.env*') && !gitignoreContent.includes('.env.local')) {
      warn('.gitignore may be missing explicit .env.local rules. Ensuring safety...');
    }
  }

  // 5. Pre-Commit Build Validation
  info('Step 3/7: Running production build validation (npm run build)...');
  try {
    runInteractive('npm', ['run', 'build']);
    success('Build succeeded! Production bundle compiled cleanly.');
  } catch (err) {
    error('Production build failed! Aborting git commit and push to prevent breaking remote.');
    process.exit(1);
  }

  // 6. Stage Changes & Check Status
  info('Step 4/7: Checking working tree status and staging changes...');
  
  // Show unstaged/staged status
  const preStatus = run('git status --short');
  if (!preStatus) {
    // Check if branch is ahead of remote
    try {
      const aheadCount = run(`git rev-list --count origin/${branch}..${branch}`);
      if (parseInt(aheadCount, 10) > 0) {
        info(`Local branch is ahead of origin/${branch} by ${aheadCount} commit(s). Pushing...`);
        runInteractive('git', ['push', 'origin', branch]);
        success(`Successfully pushed ${aheadCount} commit(s) to origin/${branch}!`);
        return;
      }
    } catch {
      // Branch might not exist on remote yet
    }
    success('Working tree clean. Nothing to commit or push.');
    return;
  }

  log(`\n${colors.dim}--- Git Status ---${colors.reset}`);
  log(preStatus);
  log(`${colors.dim}------------------${colors.reset}\n`);

  // Stage changes
  run('git add -A');

  // Double check that no .env files are in staged area
  const stagedFiles = run('git diff --name-only --cached').split('\n').filter(Boolean);
  const stagedSecrets = stagedFiles.filter(f => 
    f === '.env' || 
    f.endsWith('.env.local') || 
    f.includes('.env.') && !f.endsWith('.env.example')
  );

  if (stagedSecrets.length > 0) {
    error(`CRITICAL SECURITY ALERT: Secret file(s) staged: ${stagedSecrets.join(', ')}`);
    for (const secret of stagedSecrets) {
      run(`git reset HEAD ${secret}`);
    }
    error('Aborted commit. Staged secrets have been unstaged.');
    process.exit(1);
  }

  // Check if anything is actually staged
  const stagedStatus = run('git status --porcelain');
  if (!stagedStatus) {
    success('Working tree clean after staging. Nothing to commit.');
    return;
  }

  // 7. Determine Commit Message
  info('Step 5/7: Generating conventional commit message...');
  
  // Check CLI arguments for custom commit message: npm run git:push -- "feat: message"
  const args = process.argv.slice(2);
  let commitMessage = args.join(' ').trim();

  if (!commitMessage) {
    // Intelligent commit message synthesis based on staged files
    const changedFiles = stagedFiles;
    
    const hasComponentChanges = changedFiles.some(f => f.includes('src/components/'));
    const hasMentorChanges = changedFiles.some(f => f.includes('AIMentor') || f.includes('api/mentor'));
    const hasWorkspaceChanges = changedFiles.some(f => f.includes('ProjectWorkspace'));
    const hasProfileChanges = changedFiles.some(f => f.includes('ProfileForm') || f.includes('options') || f.includes('types/'));
    const hasStyleChanges = changedFiles.some(f => f.includes('globals.css') || f.includes('tailwind'));
    const hasWorkflowChanges = changedFiles.some(f => f.includes('.github/') || f.includes('scripts/'));
    const hasDocChanges = changedFiles.some(f => f.endsWith('.md'));

    if (hasMentorChanges) {
      commitMessage = 'feat(mentor): refine context-aware AI mentor developer experience';
    } else if (hasWorkspaceChanges) {
      commitMessage = 'feat(workspace): enhance engineering command center & architecture flow';
    } else if (hasProfileChanges) {
      commitMessage = 'feat(profile): optimize profile configuration and synthesis options';
    } else if (hasStyleChanges) {
      commitMessage = 'style(ui): refine dark architectural theme and developer design tokens';
    } else if (hasWorkflowChanges) {
      commitMessage = 'ci: configure GitHub Actions workflow and automated release script';
    } else if (hasComponentChanges) {
      commitMessage = 'feat(ui): update BuildPilot interface components and layouts';
    } else if (hasDocChanges) {
      commitMessage = 'docs: update project architecture and documentation';
    } else {
      commitMessage = 'feat: update BuildPilot engineering platform';
    }
  }

  info(`Commit message: ${colors.bold}"${commitMessage}"${colors.reset}`);

  // 8. Commit Changes
  info('Step 6/7: Committing changes...');
  runInteractive('git', ['commit', '-m', commitMessage]);
  const latestCommitHash = run('git rev-parse --short HEAD');
  success(`Committed [${latestCommitHash}]: "${commitMessage}"`);

  // 9. Push to Origin
  info(`Step 7/7: Pushing ${branch} to origin (${remoteUrl})...`);
  runInteractive('git', ['push', 'origin', branch]);
  success(`Successfully pushed ${branch} -> origin/${branch}!\n`);

  log(`${colors.bold}${colors.green}====================================================${colors.reset}`);
  log(`${colors.bold}${colors.green}      RELEASE & PUSH COMPLETED SUCCESSFULLY!        ${colors.reset}`);
  log(`${colors.bold}${colors.green}====================================================${colors.reset}\n`);
  log(`  Branch:  ${colors.bold}${branch}${colors.reset}`);
  log(`  Commit:  ${colors.bold}${latestCommitHash}${colors.reset}`);
  log(`  Remote:  ${colors.bold}${remoteUrl}${colors.reset}\n`);
}

main().catch((err) => {
  error(`Unhandled error during git:push: ${err.message}`);
  process.exit(1);
});

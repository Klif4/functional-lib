# Setup commit-msg Git Hook with Cocogitto

This guide walks you through setting up a `commit-msg` git hook that validates commit messages using [Cocogitto](https://github.com/cocogitto/cocogitto), ensuring they follow the [Conventional Commits](https://www.conventionalcommits.org/) specification.

## Overview

The hook will:
- Automatically validate commit messages on the `master` branch
- Allow commits on other branches without validation (for flexibility during development)
- Reject non-conforming commits before they're added to the repository

## Prerequisites

- Cocogitto installed on your system (see [cocogitto-install.md](./cocogitto-install.md))
- Git repository initialized
- Write access to the repository's `.git/hooks` directory

## Setup Steps

### 1. Initialize Cocogitto Configuration

Generate the default Cocogitto configuration file:

```bash
cog init
```

This creates a `cog.toml` file in your repository root with default settings.

### 2. Configure the commit-msg Hook

Add the following hook configuration to your `cog.toml` file:

```toml
[git_hooks.commit-msg]
script = """#!/bin/sh
set -e

# Determine the name of the current branch
# The command git rev-parse --abbrev-ref HEAD gets the current branch name.
branch_name=$(git rev-parse --abbrev-ref HEAD)

# Define the target branch where validation must occur
TARGET_BRANCH="master"

# Check if we are on the target branch
if [ "$branch_name" = "$TARGET_BRANCH" ]; then
    echo "-> Running cocogitto commit message validation on branch '$TARGET_BRANCH'..."
    # Execute cocogitto verification. $1 is the path to the commit message file.
    cog verify --file $1
else
    # Display a skip message and proceed without error (commit is not blocked)
    echo "-> Skipping cocogitto validation (not on branch '$TARGET_BRANCH': $branch_name)."
fi
"""
```

**What this script does:**
- Checks which branch you're currently on
- If on `master`, validates the commit message using `cog verify`
- If on any other branch, skips validation and allows the commit
- Exits with error code if validation fails (blocking the commit)

### 3. Install the Git Hook

Install the hook script into your repository's `.git/hooks` directory:

```bash
cog install-hook commit-msg
```

This creates an executable `commit-msg` hook file that Git will run automatically before each commit.

## Verification

Test that the hook is working correctly:

1. **Test on master branch** (should validate):
   ```bash
   git checkout master
   git commit --allow-empty -m "invalid message"  # Should fail
   git commit --allow-empty -m "feat: valid conventional commit"  # Should succeed
   ```

2. **Test on another branch** (should skip validation):
   ```bash
   git checkout -b feature/test
   git commit --allow-empty -m "any message works here"  # Should succeed
   ```

## Customization

To change the target branch or add multiple branches, modify the `TARGET_BRANCH` variable or add additional conditions in the hook script in `cog.toml`.

## Troubleshooting

- **Hook not running**: Ensure the hook file is executable: `ls -l .git/hooks/commit-msg`
- **Permission denied**: Check that you have write access to `.git/hooks/`
- **Validation always skipped**: Verify your current branch name matches `TARGET_BRANCH`
- **Hook missing after clone**: Hooks are not committed to the repository. Team members need to run `cog install-hook commit-msg` after cloning
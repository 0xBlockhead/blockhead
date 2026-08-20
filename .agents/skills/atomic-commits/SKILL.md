---
name: atomic-commits
description: Plan and create atomic Git commits from an existing dirty worktree in this repository. Use only when the user explicitly asks to commit changes or split current changes into commits.
---

# Atomic commits

Do not commit without explicit user authorization. Preserve every existing working change throughout this workflow.

1. Snapshot the full working state with the repository's stash-and-apply procedure so untracked files are included without removing them from the worktree:

   ```sh
   git add .
   git stash -m "$(date +%s) before atomic commits"
   git stash apply
   ```

2. List every diff hunk and group hunks by one behavior or feature, not by file or directory.
3. Order groups by dependency.
4. Write a temporary Markdown plan with one checkbox and commit message per group.
5. Use messages shaped as `<Feature or area>: <present-tense verb phrase>`.
6. For each group, run applicable checks, stage only its hunks, commit, and mark its checkbox complete.
7. If checks expose a small related issue, fix it in the same group. If the worktree is broadly inconsistent, stop and restore the complete original working state instead of stacking repairs.

Never use `git reset --hard`, `git checkout --`, or a revert to separate or repair changes in a dirty worktree.

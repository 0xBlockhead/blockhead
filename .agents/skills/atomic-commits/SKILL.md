---
name: atomic-commits
description: Plan and create atomic Git commits from an existing dirty worktree in this repository. Use only when the user explicitly asks to commit changes or split current changes into commits.
---

# Atomic commits

Do not commit without explicit user authorization. Preserve every existing working change throughout this workflow.

1. Snapshot `git status --short`, the staged diff, and the unstaged diff. Do not stage or stash the entire tree as a way to make that snapshot: it mutates the user's index and can capture unrelated or ignored artifacts.
2. List every intended diff hunk and group hunks by one behavior or feature, not by file or directory. Record the exact paths and, when a file mixes groups, the exact hunks owned by each group.
3. Order groups by dependency.
4. Write a temporary Markdown plan with one checkbox and commit message per group.
5. Use messages shaped as `<Feature or area>: <present-tense verb phrase>`.
6. For each group, run applicable checks, stage only its exact paths or hunks, inspect `git diff --cached --check`, `git diff --cached`, and `git status --short`, then commit and mark its checkbox complete. Never use `git add .`, `git add -A`, or a whole-tree stash in a dirty worktree.
7. After every commit, verify its file list and confirm unrelated staged and unstaged state is unchanged. If authorization is declined, unstage only the paths or hunks added by this workflow and leave all content intact.
8. If checks expose a small related issue, fix it in the same group. If the worktree is broadly inconsistent, stop without trying to reconstruct or roll back the user's state.

Never use `git reset --hard`, `git checkout --`, `git restore` on worktree content, or a revert to separate or repair changes in a dirty worktree.

# Workflow - Orchestrated Development

Coordinate subagents for planning, coding, reviewing, and debugging.

## Worktrees
Located in `.worktrees/`:
- `feature-boss` - Boss fight system
- `feature-skills` - Skill trainer system
- (create more as needed)

## Commands
- `git worktree add .worktrees/NAME -b NAME` - Create new worktree
- `git worktree list` - List all worktrees
- `git worktree remove .worktrees/NAME` - Remove worktree

## Subagent Roles

### Planner
```
Explore codebase, understand current architecture, create implementation plan.
Output: Step-by-step plan with files to modify.
```

### Coder
```
Implement feature in assigned worktree/branch.
Follow the plan, write clean code, use existing patterns.
```

### Reviewer
```
Review code changes, check for:
- Bugs, edge cases
- Style consistency
- Performance issues
- Security concerns
```

### Debugger
```
Investigate bug, find root cause, implement fix.
Add defensive code if needed.
```

## Workflow Steps
1. `/workflow plan [idea]` - Spawn planner, get plan
2. User approves plan
3. `/workflow code [branch]` - Spawn coder(s) in worktree(s)
4. `/workflow review [branch]` - Spawn reviewer
5. `/workflow merge [branch]` - Merge to main after approval

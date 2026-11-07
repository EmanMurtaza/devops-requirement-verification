# DevOps Requirement Verification

A working pilot of **acceptance-test PR gating**: a PR can only merge when QA-written Given/When/Then tests pass. The goal is to cut the time lost to "is this what we asked for?" back-and-forth between QA and developers.

## The idea

1. QA turns a ticket's acceptance criteria (ACs) into executable tests **before** the developer starts.
2. The developer builds against those tests. Done = green.
3. GitHub Actions runs them on every PR; branch protection blocks the merge until they pass.
4. CODEOWNERS means only QA can approve changes to the tests, so a dev can't "fix" a failing test by weakening it.

QA writes the tests, not the dev, because tests written by the dev tend to repeat the dev's misunderstanding.

## What's in this repo

| Path | Checklist step | Purpose |
|---|---|---|
| `.github/workflows/acceptance.yml` | 4 | `build` job (build + unit + acceptance tests) and `ticket-check` job (PR title has e.g. `PROJ-123`) |
| `scripts/setup-branch-protection.sh` | 5 | Makes both checks mandatory on `main`, requires Code Owner review |
| `.github/CODEOWNERS` | 6 | Locks `/acceptance-tests/` to QA |
| `.github/pull_request_template.md` | 7 | Ticket, ACs covered (checkboxes), screenshots |
| `.github/ISSUE_TEMPLATE/story.md` | n/a | Story template that forces testable ACs and examples |
| `acceptance-tests/` | 3 | QA-owned tests, one file per ticket |
| `docs/STACKS.md` | 4 | Workflow snippets for .NET, React, Flutter, API services |
| `docs/METRICS.md` | n/a | Pilot scorecard and review agenda |
| `src/`, `tests/unit/` | n/a | Tiny sample app so there is something to test |

## Try the demo (about 10 minutes)

The demo ticket is **PROJ-123: Apply a discount code at checkout**. QA's tests are already on branch `feature/PROJ-123-discount-code`, written before any code. See the open PR:

1. **Red:** the first commit on the PR has only the tests. CI fails with messages like `PROJ-123: cart.applyDiscount(...) is not implemented`.
2. **Green:** the second commit adds the implementation. CI passes.
3. **Gate:** `main` is protected. The merge button is blocked until `build`, `ticket-check`, and a Code Owner approval are present.
4. **Try to cheat:** open a PR titled "fix stuff" and watch `ticket-check` fail; edit a file in `acceptance-tests/` and see it ask for the QA owner.

Run locally (Node 22+, no dependencies):

```bash
npm test
```

## Applying it to a real project

1. Copy `.github/`, `scripts/setup-branch-protection.sh`, and an `acceptance-tests/` folder into the repo.
2. Edit the three marked steps in `acceptance.yml` for your stack (`docs/STACKS.md`).
3. Replace `@EmanMurtaza` in `CODEOWNERS` with your QA owner or team.
4. Run `ENFORCE_ADMINS=true scripts/setup-branch-protection.sh` (needs repo Admin). Check the two job names match the workflow.
5. For each ticket: QA creates `feature/PROJ-123-short-name`, commits failing tests, hands off. The dev branches from it. **Never merge failing tests to `main`**; they travel with the feature.
6. Record the numbers in `docs/METRICS.md`.

## Limits

- The gate is only as good as the ACs. Vague requirements make vague tests.
- A weak test can pass while the feature is wrong. QA review of the tests is the mitigation.
- UI look-and-feel isn't automated; use screenshots in the PR template.
- Writing tests first shifts effort to QA. Track those hours.
- Branch protection needs Admin, and on private repos a paid GitHub plan.
- Solo testing: GitHub never lets you approve your own PR, so the script defaults to `ENFORCE_ADMINS=false` (admin can bypass). In the real pilot, set it to `true`.

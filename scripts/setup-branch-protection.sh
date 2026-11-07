#!/usr/bin/env bash
# Checklist step 5: make the checks mandatory on main. Needs Admin on the repo and `gh` logged in.
#
# Usage: scripts/setup-branch-protection.sh [owner/repo]
#   ENFORCE_ADMINS=true   also block admins from bypassing (the production setting)
#
# Default is ENFORCE_ADMINS=false so a solo tester who is both PR author and code owner is
# not locked out (GitHub never lets you approve your own PR). Use true in the real pilot,
# where Owais authors and QA approves.
set -euo pipefail

REPO="${1:-$(gh repo view --json nameWithOwner --jq .nameWithOwner)}"
ENFORCE_ADMINS="${ENFORCE_ADMINS:-false}"

gh api -X PUT "repos/${REPO}/branches/main/protection" --input - <<JSON
{
  "required_status_checks": { "strict": true, "contexts": ["build", "ticket-check"] },
  "enforce_admins": ${ENFORCE_ADMINS},
  "required_pull_request_reviews": {
    "require_code_owner_reviews": true,
    "required_approving_review_count": 1
  },
  "restrictions": null
}
JSON

echo "Branch protection set on ${REPO}:main (enforce_admins=${ENFORCE_ADMINS})"

# Pilot metrics

Fill in after the pilot ticket merges. Compare against a similar-size ticket from the last sprint. Scale up only if the pilot beats the comparison on **most** rows.

| Measure | How to count it | Pilot ticket | Comparison ticket |
|---|---|---|---|
| Times the PR bounced back for "not what we asked" | Review rounds citing a requirement mismatch | | |
| Clarification questions from the dev | Messages asking what a requirement means | | |
| Days from In Progress to Done | Ticket timestamps | | |
| Defects found in QA after merge | Bugs logged against the ticket | | |
| QA time spent writing the tests (hours) | Self-tracked, so we know the cost | | |

## Tips for honest numbers
- Pick the comparison ticket **before** the pilot starts, not after seeing the result.
- One ticket is an anecdote. Run 3-5 small tickets before a company-wide decision.
- Count clarification questions in one place (the ticket thread or one chat channel) and record the source.

## 15-minute review agenda
1. What did the tests catch that review would have missed?
2. What did they miss (a test passed, the feature was still wrong)?
3. Which AC wording caused confusion?
4. Was the hour cost of writing tests worth it?

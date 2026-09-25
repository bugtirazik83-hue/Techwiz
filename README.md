# BudgetBasics

A private budgeting simulator for students and beginners. Plain HTML, CSS and JavaScript, so there is nothing to install or build.

## Run it
1. Unzip the folder.
2. Double-click `index.html`. An internet connection is needed for the Google Fonts and the Three.js library (loaded from cdnjs). Without it, the site still works with fallback fonts and no 3D scene.

## Files
| File | Purpose |
|---|---|
| `index.html` | All 12 sections (Home, Basics, Needs vs wants, 50-30-20, Savings goals, Planner, Mistakes, Gallery, Helper, Search, Feedback, About with Contact and Sitemap) |
| `styles.css` | Design tokens, light and dark themes, layout, responsive rules |
| `app.js` | Router, calculators, quizzes, planner, chatbot rules, search, feedback validation, 3D scene |
| `test-data.json` | Inputs and expected results for manual testing |
| `REPORT.md` | Project report with flowchart and data flow |

## Privacy
No database, no network requests for user data, no cookies, no local storage. Everything you type lives in memory and disappears when the tab closes.

## Accessibility
Skip link, semantic landmarks, visible focus, ARIA live regions for results and errors, labelled inputs, text descriptions for every infographic, reduced-motion support, 44px or larger touch targets.

## Not financial advice
BudgetBasics teaches general concepts only.

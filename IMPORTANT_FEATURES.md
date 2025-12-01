# Important Features - Do Not Remove

This document lists critical features that should NOT be removed without explicit discussion.

## Carousel Component Features

### defaultText Labels
**Status:** CRITICAL - Required Feature
**Location:** `src/components/Carousel.jsx` and `src/App.jsx`

The carousel displays default text labels on each image. These labels:
- Appear at the top of each carousel image with a dark semi-transparent background
- Provide context about each project
- Are defined in the `images` array in `App.jsx` with the `defaultText` property
- Are styled with `.carousel-default-text` CSS class

**Why it's important:** These labels help users quickly understand what each project is about without needing to click or hover.

**Files to check before removing:**
- `src/components/Carousel.jsx` - Look for `defaultText` references
- `src/App.jsx` - Check the `images` array for `defaultText` properties
- `src/App.css` - Check for `.carousel-default-text` styles

**If you need to modify:** Update the text content, but keep the feature intact.

---

### Carousel Zoom Effect
**Status:** CRITICAL - Design Intent
**Location:** `src/App.css`

The carousel images have a subtle zoom effect on hover set to `scale(1.02)`.

**Why it's important:** This was intentionally reduced from `1.05` to `1.02` for a more subtle effect. Do not increase it back to `1.05` or higher without discussion.

**File to check:** `src/App.css` - Look for `.carousel-image-wrapper:hover img` with `transform: scale(1.02)`

---

## Before Committing Changes

1. **Review your git diff:** `git diff` to see all changes
2. **Check this file:** Make sure you're not accidentally removing features listed here
3. **Test visually:** Make sure carousel labels still appear
4. **Write descriptive commit messages:** Include what you changed and why

## Git Best Practices

- Make focused commits (one feature/change per commit)
- Review diffs before committing: `git diff --staged`
- Test after each change
- Write commit messages that accurately describe ALL changes






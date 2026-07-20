---
name: scholarly-sanctuary-design-system
description: >
  Design system rules and constraints for the Scholarly Sanctuary ("Digital Atelier") product.
  Use this skill whenever working on ANY UI task for this project — including writing component
  code, reviewing designs, creating new screens, suggesting colors, choosing typography, handling
  RTL layouts, building buttons, cards, inputs, chips, or navigation elements. Also trigger for
  questions about spacing, shadows, borders, glassmorphism, or surface hierarchy. If the user
  mentions a component, color, layout, or asks "how should this look", consult this skill first.
---

# Scholarly Sanctuary — Design System Skill

## Creative North Star: "The Digital Atelier"

This is **not** standard educational software UI. The aesthetic draws from high-end editorial archives
and architectural blueprints. Key pillars:

- **Persian (RTL) script** as a primary layout element — break Western-centric grids
- **Intentional white space** and oversized typography for depth and focus
- **No decorative clutter** — every interaction must reduce cognitive load, not add to it

---

## Colors & Surfaces

### Surface Hierarchy (treat as physical layers of paper)

| Layer | Token | Hex |
|---|---|---|
| Base | `surface` | `#f8f9fb` |
| Level 1 — Sections | `surface_container_low` | `#f2f4f6` |
| Level 2 — Cards | `surface_container_lowest` | `#ffffff` |
| Level 3 — Popovers | `surface_bright` | `#f8f9fb` |
| High containers | `surface_container_high` | *(tonal step above low)* |

### Key Color Tokens

| Token | Hex | Usage |
|---|---|---|
| `primary` | `#004b9f` | Primary actions, active states |
| `primary_container` | `#0062cc` | Gradient endpoint for CTAs |
| `secondary_container` | `#5ce9fe` | Selected chips (high-contrast pop) |
| `on_surface` | `#191c1e` | All body text (never pure black) |
| `on_surface_variant` | `#424753` | Secondary/supporting body text |
| `error` | `#ba1a1a` | Error states |
| `outline_variant` | `#c2c6d5` | Ghost borders only (15% opacity max) |

---

## Strict Rules — Read Before Writing Any UI

### ❌ The "No-Line" Rule
**Never** use `1px solid border` to separate content. Define boundaries only through:
1. **Background shifts** — e.g., `surface_container_low` card on `surface` background
2. **Tonal transitions** — subtle gradient or step from `surface_container` → `surface_container_high`

### ❌ The "No-Divider" Rule
No horizontal `<hr>` or divider lines between list items. Separate items using:
- **24px vertical spacing**, or
- Alternating backgrounds between `surface_container_lowest` and `surface_container_low`

### ❌ No Pure Black Text
Always use `on_surface` (`#191c1e`) for high-contrast text, never `#000000`.

### ❌ No Standard Material 3 Elevation Shadows
Do not use Material elevation levels 1–5. Use **Tonal Layering** and **Glassmorphism** instead (see below).

### ❌ No Cramming
If a screen feels full, use a horizontal scroll carousel for chips or cards. Preserve breathing room.

---

## Elevation & Depth

### Tonal Layering (primary method)
Stack `surface_container_lowest` on top of `surface_container_high` to create a natural cut-out depth —
no drop shadows needed.

### Ambient Shadows (only when mandatory, e.g. FAB)
- Color: `on_surface` (`#191c1e`) at **6% opacity**
- Blur: **minimum 24px** (soft ambient light effect)

### Ghost Border Fallback (accessibility only)
Use `outline_variant` (`#c2c6d5`) at **15% opacity max**. Never 100% opaque.

### Glassmorphism (floating/persistent elements)
For Bottom Navigation, Header, and other floating surfaces:
- Background: `surface_container_lowest` at **70–80% opacity**
- Backdrop blur: **20px–30px**
- Allows the student's progress colors to "bleed through", creating a cohesive environment

---

## Typography — Vazir Exclusively

Font: **Vazir** (Persian/Latin). No other typefaces.

| Scale | Usage |
|---|---|
| Display lg/md/sm | Large numeric grades, "Welcome" headers — bold, commanding |
| Headline lg/md/sm | Section titles — generous line-height for Persian diacritics |
| Body lg/md | Primary reading — use `on_surface_variant` for secondary text |
| Label | Metadata only — use sparingly |

### Editorial Layout Rules
- **Always right-align text** (RTL-first)
- **Asymmetric margins for headlines:** 24px right, 32px left — creates sophisticated editorial flow,
  not centered symmetry

---

## Components

### Buttons
| Type | Spec |
|---|---|
| Primary | Min height **56px**, `xl` roundedness (1.5rem), gradient `primary` → `primary_container` at 135° |
| Tertiary | No container, `primary`-colored text only. For "Cancel", "See More" |
| RTL icons | Mirror directional icons — a "Back" arrow points **right (→)** |

### Cards & Lists
- No dividers (see No-Divider Rule above)
- Minimum list item height: **64px**
- Separate items with 24px spacing or alternating surface tones

### Input Fields
- Style: filled, using `surface_container_high` background
- Active state: **2px `primary` bottom indicator** — no full-box border
- Error state: bottom indicator + helper text → `error` (`#ba1a1a`)

### Selection Chips
- Selected: `secondary_container` (`#5ce9fe`) background — high-contrast pop against deep blue
- Roundedness: **full** (9999px)

### Corner Radius
Use `xl` (1.5rem) for all main containers — mirrors the organic, leaf-like curves of the logo.

---

## RTL & Layout Principles

- **Right side = most important.** Primary CTAs belong on the right — RTL users' eye starts there.
- Use Persian script layout to break rigid Western grids intentionally.
- Use **asymmetric margins** on headline elements (not centered).

---

## Do's Quick Reference

| ✅ Do | ❌ Don't |
|---|---|
| Use teal/tan accents (Secondary/Tertiary) for Success/Warning | Use pure black `#000000` for text |
| Right-align primary CTAs | Use standard Material 3 elevation shadows |
| Use `xl` corners on main containers | Use 1px solid borders to divide sections |
| Use glassmorphism on persistent mobile elements | Use horizontal dividers in lists |
| Use carousels when content feels crowded | Cram content onto a screen |

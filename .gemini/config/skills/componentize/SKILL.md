---
name: ui-refine
description: Transform generic, card-heavy UI into polished, content-driven, production-quality interfaces while preserving existing functionality and project conventions.
---

# UI Refine

Refine generic UI into a clean, intentional, and visually polished product experience.

## When to use

Use this skill when:

- The generated UI looks generic or AI-generated.
- The page contains too many cards, borders, shadows, or decorative elements.
- A screenshot or Figma design needs to be matched more accurately.
- The current implementation feels like a dashboard or template instead of a polished product.
- Images or visual content were replaced with initials, icons, or colored placeholders.
- The UI needs better spacing, hierarchy, typography, or visual balance.

## What this skill does

- Removes unnecessary cards and nested containers.
- Improves visual hierarchy using typography, spacing, and alignment.
- Replaces generic placeholders with meaningful visual content.
- Reduces excessive shadows, borders, gradients, and decorative effects.
- Preserves the reference layout and content composition.
- Reuses existing project components where appropriate.
- Keeps existing functionality and behavior unchanged.
- Produces responsive, maintainable, production-ready UI.

## Design principles

### Prefer hierarchy over decoration

Use the following before adding cards or visual effects:

1. Typography
2. Spacing
3. Alignment
4. Content grouping
5. Subtle visual separation

Do not use borders, shadows, backgrounds, or cards as the default solution for every section.

### Avoid unnecessary cards

Before creating a card, determine whether the content requires:

- Visual grouping
- Interaction affordance
- Content separation
- A distinct surface

If not, use spacing and typography instead.

Avoid:

- Every item being wrapped in a card.
- Cards inside cards.
- Large containers used only for decoration.
- Repeated borders around every content block.
- Heavy shadows on static content.

### Use meaningful visual content

When the reference includes:

- Photos
- People
- Products
- Illustrations
- Brand assets
- Media

Preserve their visual role.

Do not replace visual content with:

- Initial avatars
- Colored squares
- Generic icons
- Empty placeholders
- Random decorative graphics

### Preserve the reference composition

Match the reference in this order:

1. Overall layout
2. Content hierarchy
3. Spacing and alignment
4. Content grouping
5. Typography scale
6. Visual styling
7. Small decorative details

Do not copy only the colors while changing the layout structure.

## Authentication UI

For login, registration, and password pages:

- Use the real product logo or brand identity.
- Prefer a clean, centered, brand-focused layout.
- Do not automatically place the form inside a large card.
- Avoid large decorative icons above the heading.
- Keep the form visually lightweight.
- Use subtle input borders.
- Keep social login actions balanced.
- Use the brand color for primary actions.
- Avoid strong gradients and heavy shadows unless required by the design.

Preferred structure:

```text
Brand
Heading
Supporting text
Social authentication
Divider
Email field
Password field
Supporting actions
Primary action
Secondary navigation
```

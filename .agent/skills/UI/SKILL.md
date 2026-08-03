---
name: ui
description: A skill for Transform generic, overly componentized UI into a polished, content-driven, production-quality interface
--- 

# UI Design Refinement Skill

## Purpose

Transform generic, overly componentized UI into a polished, content-driven, production-quality interface.

Prioritize realistic layouts, strong visual hierarchy, meaningful content, and intentional use of imagery. Avoid making every piece of information look like a separate card.

## Design Direction

When implementing UI from a screenshot, Figma design, or existing requirements:

- Prefer content-focused layouts over dashboard-like card grids.
- Use real images, avatars, product visuals, or meaningful media when the design benefits from them.
- Avoid replacing visual content with initials, colored placeholders, generic icons, or empty blocks.
- Do not automatically wrap every item inside a bordered card.
- Use whitespace, typography, alignment, and grouping to create hierarchy before adding borders or backgrounds.
- Keep the layout clean, minimal, and visually intentional.
- Make the page feel like a finished product, not a wireframe or generated admin template.

## Layout Rules

- Use a clear content container with intentional max-width and responsive spacing.
- Prefer natural content flow over excessive use of grids.
- Use grids only when they improve content scanning or comparison.
- Avoid large empty areas without a visual or structural purpose.
- Do not center all content by default.
- Follow the alignment shown in the reference design.
- Use consistent horizontal and vertical spacing.
- Maintain strong hierarchy between:
  1. Navigation
  2. Main headline
  3. Supporting description
  4. Section headings
  5. Content and media

## Typography

- Use large, prominent headings with appropriate line height.
- Keep body text readable but visually secondary.
- Avoid excessive font-size variation.
- Use font weight and spacing intentionally.
- Limit decorative text effects.
- Do not use gradients on text unless clearly required by the reference.
- Preserve natural text wrapping and avoid forcing unnecessary line breaks.

## Cards and Containers

Before creating a card, ask:

> Does this content need visual separation, interaction affordance, or grouping?

If the answer is no:

- Do not add a card.
- Do not add a border.
- Do not add a background panel.
- Use spacing and typography instead.

Avoid:

- Card inside card.
- Every list item having the same heavy container.
- Large rounded rectangles used only as decoration.
- Excessive shadows.
- Excessive borders.
- Decorative gradients without a purpose.

## Images and Visual Content

When the reference contains people, products, photos, illustrations, or media:

- Use meaningful visual assets instead of initials or colored placeholders.
- Preserve the visual prominence of the media.
- Use consistent image aspect ratios.
- Use `object-fit: cover` when appropriate.
- Apply rounded corners only when supported by the design.
- Ensure images remain responsive without distortion.

Do not replace a photo-based layout with:

- Initial-letter avatars.
- Random colored squares.
- Generic icon cards.
- Empty image placeholders.

## Navigation

- Keep navigation compact and visually quiet.
- Avoid oversized navigation items.
- Use subtle active states.
- Keep primary actions visually distinct without overpowering the page.
- Maintain consistent spacing between navigation items.

## Visual Style

Prioritize:

- Minimalism
- Strong hierarchy
- Intentional whitespace
- Realistic content
- Clean alignment
- Balanced composition
- Production-ready polish

Avoid:

- Generic AI-generated dashboard appearance.
- Excessive gradients.
- Excessive glow effects.
- Too many colored elements.
- Unnecessary badges.
- Repeated decorative patterns.
- Overly rounded UI everywhere.
- Heavy shadows.
- Placeholder-heavy interfaces.

## Implementation Rules

- Reuse existing project components where appropriate.
- Do not create reusable components for one-off visual structures unless reuse is expected.
- Keep components focused and maintainable.
- Separate content data from presentation when rendering repeated items.
- Use semantic HTML.
- Ensure responsive behavior for mobile, tablet, and desktop.
- Preserve existing project conventions, design tokens, and component patterns.
- Do not introduce a new UI library unless necessary.
- Avoid changing unrelated code.

## Final Quality Checklist

Before completing the implementation, verify:

- Does the result resemble a polished product rather than a generic dashboard?
- Are images or visual assets used where the reference uses them?
- Were unnecessary cards removed?
- Is the hierarchy clear without excessive borders?
- Is whitespace intentional?
- Are headings visually dominant?
- Is the content aligned consistently?
- Does the UI remain responsive?
- Are existing reusable components used appropriately?
- Does the implementation match the reference composition, not only its colors?

## Priority Order

1. Match the reference layout and visual hierarchy.
2. Use meaningful visual content.
3. Preserve clean spacing and alignment.
4. Avoid unnecessary cards and decorative UI.
5. Follow existing project architecture.
6. Keep the implementation reusable and maintainable.
# Frontend Development Rules

## Stack

- React
- TypeScript
- Vite
- Tailwind CSS
- shadcn/ui
- TanStack Query
- React Hook Form

## Architecture

- Keep components small and composable.
- Prefer feature-based organization.
- Do not create giant components.
- Keep API calls outside UI components.
- Avoid `any`.
- Prefer `unknown` when the type is genuinely unknown.
- Use TypeScript types for API responses.

## UI

- Use shadcn/ui components.
- Prefer existing components over creating duplicates.
- Maintain consistent spacing.
- Use semantic HTML.
- Ensure keyboard accessibility.
- Design responsive layouts.

## Styling

- Avoid arbitrary colors.
- Use design tokens.
- Avoid excessive shadows.
- Avoid excessive rounded containers.
- Avoid unnecessary animations.

## UX

Every page should handle:

- Loading
- Empty
- Error
- Success

Forms should provide:

- Validation
- Clear error messages
- Disabled submit state
- Loading state

## Code Quality

Before finishing a task:

1. Run TypeScript checks.
2. Run lint.
3. Check for unused imports.
4. Check responsive behavior.
5. Check accessibility.
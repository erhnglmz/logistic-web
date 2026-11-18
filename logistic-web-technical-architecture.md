# Logistic-web – Technical Architecture & Development Guidelines

> **Document Purpose**
>
> This document is the primary technical documentation and architectural contract for the `Logistic-web` application.
>
> Every development task in `Logistic-web` MUST read this document before implementation.
>
> After every development task, this document MUST be reviewed and updated if the architecture, folder structure, dependencies, modules, API contracts, conventions, testing strategy, state management, routing, error handling, or any important technical decision changes.
>
> This document describes the **current intended technical architecture** of `Logistic-web`. It is not a changelog.
>
> If this document conflicts with the actual source code, the source code is the technical source of truth and this document must be corrected.

---

# 1. Application Overview

`Logistic-web` is the frontend application of the Logistic Automation platform.

Its main responsibility is to provide the user interface and communicate with the backend application:

```text
Logistic-web
      ↓
Logistic-api
```

The frontend must NOT become the source of truth for business rules.

Core business rules belong to `Logistic-api`.

Frontend responsibilities include:

- User interaction
- View rendering
- UI state management
- Form state
- Client-side input validation
- Calling backend APIs
- Displaying backend responses
- Presenting validation and business errors returned by the backend
- Navigation and routing
- User experience concerns
- Local UI-only decisions

---

# 2. Technology

Primary technology:

```text
React
```

Current frontend baseline:

```text
React: 19.x
TypeScript: 5.9.x
Build tool: Vite 7.x
Router: react-router-dom 7.x
Server state: @tanstack/react-query 5.x
Forms: react-hook-form 7.x
Validation: zod 4.x
HTTP: native fetch via shared/services/httpClient.ts
Dev server: http://localhost:5173
API base URL env: VITE_API_BASE_URL (default http://localhost:5111)
File naming: PascalCase components/pages, camelCase services/hooks
```

Do not introduce a library merely because it is popular.

Every dependency must solve a real project need.

---

# 3. Core Engineering Principles

All development must follow:

- SOLID
- Clean Code
- Separation of Concerns
- High Cohesion
- Low Coupling
- Explicit module boundaries
- Testability
- Maintainability
- Reusability where appropriate
- Composition over unnecessary inheritance
- Predictable data flow
- Minimal hidden side effects
- Avoidance of unnecessary abstractions
- Avoidance of over-engineering

The objective is not to create the most abstract frontend architecture.

The objective is to create a frontend architecture that remains understandable and maintainable as business modules grow.

---

# 4. Architectural Style

`Logistic-web` MUST use a modular, feature-oriented architecture.

Preferred high-level structure:

```text
src/
│
├── app/
│   ├── router/
│   ├── providers/
│   ├── config/
│   └── layouts/
│
├── modules/
│   └── <business-module>/
│
├── shared/
│   ├── components/
│   ├── hooks/
│   ├── services/
│   ├── utils/
│   ├── constants/
│   ├── types/
│   └── validation/
│
└── main.*
```

Only create folders that are actually required.

Do not create empty architecture for hypothetical future features.

---

# 5. Module Design

Every business capability should preferably live inside its own module.

Example:

```text
modules/
├── customers/
├── shipments/
├── vehicles/
├── drivers/
└── ...
```

A module may contain:

```text
modules/<module-name>/
│
├── components/
├── pages/
├── hooks/
├── services/
├── models/
├── validation/
├── constants/
├── utils/
└── index.*
```

The exact internal structure should depend on the module's complexity.

Do not force every module to contain every folder.

---

# 6. Module Boundaries

A business module should own its feature-specific:

- Pages
- Components
- Hooks
- Models
- API calls
- Validation
- Local constants
- Local utilities
- Feature-specific state

A module should not directly depend on another module's internal implementation.

If data or behavior must be shared, expose a deliberate public contract.

Avoid deep cross-module imports.

Prefer a module entry point or a shared abstraction where appropriate.

---

# 7. Shared Layer

The `shared` layer contains code that is genuinely reusable across multiple modules.

Examples:

```text
shared/
├── components/
├── hooks/
├── services/
├── utils/
├── constants/
├── types/
└── validation/
```

`shared` MUST NOT become a dumping ground.

A piece of code should remain inside its owning module until it is truly shared by multiple modules.

Prematurely moving feature-specific code into `shared` is discouraged.

---

# 8. Component Design

React components should focus primarily on presentation and interaction.

Components should remain small and focused.

Avoid components that simultaneously handle:

- API access
- Business decisions
- Large amounts of data transformation
- Form orchestration
- Complex state
- Presentation

When a component grows beyond presentation concerns, extract appropriate logic into:

- Hooks
- Services
- Module utilities
- Smaller components

---

# 9. Container / Presentation Separation

When useful, separate orchestration from pure presentation.

```text
Page / Container
      ↓
Custom Hook
      ↓
Presentation Components
```

Pure presentation components should preferably receive data and callbacks via props and avoid direct infrastructure concerns.

Do not apply this pattern mechanically to trivial components.

---

# 10. API Communication

HTTP communication with `Logistic-api` must be abstracted from UI components.

Preferred flow:

```text
Component
   ↓
Hook / Module Logic
   ↓
API Service
   ↓
HTTP Client
   ↓
Logistic-api
```

Avoid direct `fetch`/HTTP client calls scattered through UI components.

API access should be centralized enough to provide consistent:

- Base URL handling
- Headers
- Authentication handling when introduced
- Error translation
- Cancellation
- Serialization
- Diagnostics where appropriate

---

# 11. API Service Rule

Every business module should own its API operations where appropriate.

Example:

```text
modules/shipments/services/shipmentService.ts
```

Possible operations:

```text
getShipmentById
getShipments
createShipment
updateShipment
cancelShipment
```

The service layer should deal with HTTP/application contract concerns.

It should not contain UI rendering logic.

---

# 12. Backend as Business Source of Truth

The frontend may perform client-side validation for UX.

However, backend validation remains authoritative.

Frontend examples:

```text
Required field
Invalid date format
Immediate UX feedback
```

Backend examples:

```text
Business rule
Permission
State transition
Domain validation
Final data integrity
```

Never assume that a frontend check removes the need for backend validation.

---

# 13. Models and Types

Use explicit types for application contracts and UI models.

Avoid excessive usage of:

```text
any
unknown without narrowing
untyped objects
```

API response models should reflect the backend contract.

Different concerns may require separate types such as:

```text
ShipmentResponse
CreateShipmentRequest
UpdateShipmentRequest
ShipmentFormModel
```

Do not reuse one type for unrelated responsibilities simply because the fields currently look similar.

---

# 14. Mapping

If frontend form/view models differ from API models, introduce explicit mapping.

```text
Form Model
    ↓
Mapper / Conversion
    ↓
Request Model
```

and:

```text
API Response
    ↓
Mapper / Conversion
    ↓
View Model
```

Do not scatter non-trivial conversion logic across components.

---

# 15. State Management

Use the simplest state mechanism that satisfies the requirement.

Preferred decision order:

```text
1. Local component state
2. Custom hook state
3. Feature-level state
4. Shared/global state only when truly necessary
```

Do not move local state into a global store without a concrete need.

Global state is appropriate for genuinely application-wide concerns such as:

- Authenticated user
- Global permissions
- Cross-module shared selections
- Global notifications
- App-wide preferences

Server state and UI state should not be treated as the same problem.

---

# 16. Server State

Data retrieved from the backend should be treated as server state.

If a dedicated server-state library is introduced, use it consistently for:

- Fetching
- Loading state
- Caching
- Refetching
- Mutation invalidation
- Error state

The concrete library and conventions must be documented here when selected.

---

# 17. Forms

Forms should use a consistent approach.

A form should clearly separate:

- Form state
- Input validation
- Submission
- Backend errors
- Mapping to request models

Complex form logic should not be embedded directly into large page components.

When a form library is introduced, it must be used consistently unless there is a justified exception.

---

# 18. Validation

Frontend validation is primarily for user experience.

## UI/Input Validation

Examples:

- Required field
- Invalid email format
- Invalid number format
- Invalid date range
- Maximum input length

## Business Validation

Must remain authoritative in the backend.

The frontend may mirror a business rule only when it improves UX, but must not rely on that check for data integrity.

---

# 19. Error Handling

The frontend must provide consistent error handling.

Errors should be categorized where possible:

```text
Validation Error
Business Rule Error
Unauthorized
Forbidden
Not Found
Conflict
Server Error
Network Error
```

Users should receive useful messages without exposing technical internals.

Avoid displaying:

- Stack traces
- Raw exception details
- Database messages
- Sensitive server information

Backend error contracts should be handled through a centralized approach where practical.

---

# 20. Loading and Empty States

Every asynchronous page or component should intentionally handle:

- Initial loading
- Reloading where relevant
- Empty result
- Success
- Error

Do not leave users with an unexplained blank screen.

---

# 21. Routing

Routing belongs to the application layer.

Recommended location:

```text
src/app/router/
```

Feature modules may expose route definitions if that improves modularity.

Authorization-related route protection must be documented when authentication is introduced.

---

# 22. Layouts and Providers

Application-wide layouts belong to:

```text
src/app/layouts/
```

Global React providers should be composed in:

```text
src/app/providers/
```

Potential providers include:

- Router
- Theme
- Server-state client
- Global notification system
- Authentication context

Avoid deeply nested provider logic spread across unrelated files.

---

# 23. Configuration

Environment-specific configuration must be centralized.

Examples:

```text
API base URL
Environment name
Feature flags
External public configuration
```

Never hard-code environment-specific values throughout components.

Secrets must not be committed to source control.

Frontend environment values are exposed to the client and therefore must never contain server secrets.

---

# 24. Naming Conventions

Use descriptive names.

Preferred examples:

```text
ShipmentListPage
ShipmentForm
useShipmentForm
shipmentService
ShipmentResponse
CreateShipmentRequest
ShipmentStatus
```

Boolean names should clearly describe state:

```text
isLoading
isSubmitting
canEdit
hasError
```

Event handlers:

```text
handleSubmit
handleCancel
handleCustomerChange
```

Props callbacks:

```text
onSubmit
onCancel
onCustomerChange
```

Avoid vague names such as `helper`, `manager`, `temp`, `data2`, or `handleStuff`.

---

# 25. File Naming

Use one consistent file naming convention across the codebase.

The final selected convention must be documented here after bootstrap.

Do not mix casing strategies without a reason.

---

# 26. Reusability and Abstraction

Reuse should be based on actual shared behavior.

Preferred rule:

```text
First use: implement clearly
Second similar use: compare
Repeated stable pattern: extract
```

Avoid premature generic abstractions.

Do not create internal frameworks unless a repeated business need justifies them.

---

# 27. Dependency Management

Before adding a package, ask:

```text
Does the current stack already solve this?
Is this library maintained?
Will it become infrastructure we must maintain?
Does it improve the project enough to justify the dependency?
```

Remove unused dependencies.

Major library additions or replacements must be documented in this file.

---

# 28. Testing Strategy

Testing should focus on behavior and important user flows.

Potential layers:

```text
Unit Tests
Component Tests
Integration Tests
End-to-End Tests
```

Suggested priorities:

- Custom hook behavior
- Form validation
- User interactions
- Critical pages
- API integration behavior
- Error handling
- Important user flows

Avoid tests that merely reproduce implementation details.

The concrete test stack must be documented after selection.

---

# 29. Accessibility

User-facing components should follow accessibility best practices.

Prefer:

- Semantic HTML
- Proper labels
- Keyboard accessibility
- Appropriate ARIA only when needed
- Visible focus behavior
- Meaningful button/link semantics

---

# 30. Performance

Do not optimize prematurely.

Performance optimizations should be driven by observable need.

Avoid unnecessary use of:

```text
useMemo
useCallback
React.memo
```

when they add complexity without measurable benefit.

---

# 31. Security

Frontend security does not replace backend security.

Never rely on hidden buttons or disabled UI as authorization.

Authorization must be enforced by `Logistic-api`.

Frontend responsibilities may include:

- Hiding unavailable actions
- Route protection for UX
- Handling 401/403 responses
- Managing authentication state

Never store secrets in source code.

Authentication strategy must be documented when introduced.

---

# 32. Logging and Diagnostics

Do not leave uncontrolled debug logging in production code.

Avoid logging:

- Tokens
- Passwords
- Sensitive personal data
- Financial secrets
- Confidential API payloads

If a client-side monitoring/error service is introduced, document it here.

---

# 33. Business Workflow Documentation

Before implementing a business feature:

1. Read this document.
2. Read the project's business workflow documentation.
3. Review the relevant `Logistic-api` API contract.
4. Inspect the existing module and similar modules.
5. Identify reusable patterns.
6. Implement using existing conventions.
7. Run tests/build/lint as applicable.
8. Review this document.
9. Update this document if architecture or conventions changed.

Do not invent business behavior that is not supported by the workflow or API contract.

---

# 34. Current Business Modules

Current modules:

## customers

```text
Module: customers
Purpose: Customer list/create/edit/detail UI and CRM sub-forms (contacts, notes, bank accounts)
Pages: CustomerListPage, CustomerCreatePage, CustomerEditPage, CustomerDetailPage
Main Components: CustomerForm, CustomerContactList, CustomerNoteList, CustomerBankAccountList
Hooks: useCustomers, useCustomer, useCustomerForm
Services: customerService.ts
API Endpoints Used: /api/customers/*
State Strategy: TanStack Query for server state; local component/hook state for forms and filters
Important UI Rules: loading/empty/error states required; inactive customers are read-only for child forms
```

When adding a module, document:

```text
Module:
Purpose:
Pages:
Main Components:
Hooks:
Services:
API Endpoints Used:
State Strategy:
Important UI Rules:
```

---

# 35. Frontend / Backend Contract

The frontend depends on the public API contract exposed by `Logistic-api`.

Whenever an API contract changes, evaluate:

- Request models
- Response models
- Error contract
- HTTP status codes
- UI flows
- Form models
- Mappers
- API services
- Tests

Breaking API changes must not be silently introduced.

---


# 36. Backend Persistence Boundary

`Logistic-web` must remain completely unaware of backend persistence implementation details.

The backend currently uses:

```text
PostgreSQL
Docker for local PostgreSQL
Entity Framework Core
Database First
Repository EntityMap classes
```

These are backend implementation details only.

The frontend must depend exclusively on the public HTTP API contract exposed by `Logistic-api`.

Frontend code must never depend on:

- Database table names
- Database column names that are not part of the API contract
- Scaffolded EF Core models
- Repository `EntityMap` classes
- DbContext
- PostgreSQL-specific behavior

This boundary allows the backend persistence model to be re-scaffolded or refactored without coupling the React application to database implementation details.

---

# 37. Architectural Decisions

## WEB-ADR-001 – React is the frontend technology

`Logistic-web` is developed using React.

## WEB-ADR-002 – Feature-based modular architecture

Business capabilities are organized into modules.

## WEB-ADR-003 – Backend is the business-rule source of truth

Core business rules are enforced in `Logistic-api`.

## WEB-ADR-004 – Components do not directly own infrastructure concerns

HTTP access and non-trivial orchestration are separated from presentation components.

## WEB-ADR-005 – Global state is used only when necessary

Local or feature state is preferred over application-wide state.

## WEB-ADR-006 – This document is mandatory technical documentation

This file is part of the project's Definition of Done.

## WEB-ADR-007 – Frontend is persistence-agnostic

`Logistic-web` depends only on `Logistic-api` contracts and never on PostgreSQL, EF Core, Database First scaffolded models, repositories, or EntityMap classes.

**Reason:** Preserves separation of concerns and keeps database implementation changes isolated to the backend.

---

# 38. Definition of Done

A `Logistic-web` task is complete only when all applicable checks pass:

```text
[ ] Requirement implemented
[ ] Relevant business workflow reviewed
[ ] Backend API contract reviewed
[ ] No backend persistence detail leaked into frontend code
[ ] Existing module conventions respected
[ ] Components remain focused
[ ] Direct HTTP calls are not scattered in UI components
[ ] State is stored at the correct scope
[ ] Types are explicit
[ ] Backend errors are handled correctly
[ ] Loading/empty/error states are covered
[ ] No unnecessary abstraction was introduced
[ ] No unnecessary dependency was introduced
[ ] Accessibility was considered
[ ] Relevant tests pass
[ ] Lint/build succeeds
[ ] This technical document was reviewed
[ ] This technical document was updated if required
```

---

# 39. Mandatory Maintenance Rule

Every future prompt and development task for `Logistic-web` must use this document as mandatory technical context.

Before development:

```text
READ THIS FILE
```

After development:

```text
REVIEW THIS FILE
UPDATE THIS FILE IF REQUIRED
```

A code change that changes the technical reality of the application but leaves this document outdated is incomplete.

> A Senior Software Engineer should be able to read this file and quickly understand how `Logistic-web` is structured, how modules communicate, where logic belongs, how the frontend communicates with `Logistic-api`, and which engineering rules must be followed.

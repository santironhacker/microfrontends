# MicroFrontends Project Scaffolding Guide

This document provides a clear step-by-step guide to setting up a modular Angular application using multiple applications (modules) with module federation. The goal is to create a scalable, maintainable architecture that includes a shell app and micro-frontend modules.

---

## **Project Setup Steps**

### 1. **Initialize the Workspace**

The first step is to create a new Angular workspace without an initial application.

```bash
npx @angular/cli@18 new microfrontends --no-create-application
```

This command sets up a new Angular workspace named `microfrontends` without creating a default application.

For more details, refer to the [official Angular CLI `ng new` documentation](https://angular.io/cli/new).

Note we use version 18 of angular/cli as by the time this project is created the latest compatible version of [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) is `v18.0.6`.

---

### 2. **Add the Shell Application**

The shell application serves as the main container for hosting micro-frontends (modules).

#### Generate the Shell Application:

```bash
npx ng generate application shell --routing=true --style=scss --ssr=false
```

This creates an application named `shell` with:

- Routing enabled (`--routing=true`)
- SCSS as the stylesheet format (`--style=scss`)
- Server-side rendering disabled (`--ssr=false`)

#### Update the Scripts in `package.json`:

Add the following entries under the `scripts` section for easier development and production builds:

```json
"start": "npm run start:shell",
"start:shell": "ng serve shell -o --port 4300",
"build:shell": "ng build shell --prod"
```

- **`start:shell`**: Launches the shell app on port `4300`.
- **`build:shell`**: Builds the shell app in production mode.

#### Add some basic navigation in the `app.component.html`:

```html
<ul>
  <li><a routerLink="/">Landing</a></li>
  <li><a routerLink="/user">User</a></li>
</ul>

<router-outlet />
```

This will allow us to navigate to different routes once the routing is configured.

---

### 3. **Add the First Micro-Frontend Module**

This step involves creating a new application to act as the first micro-frontend module (`mfe-user`).

#### Generate the Micro-Frontend Application:

```bash
npx ng generate application mfe-user --routing=true --style=scss --ssr=false
```

This creates the `mfe-user` application with routing and SCSS support.

#### Add some Components to the Micro-Frontend:

```bash
npx ng g c details --project=mfe-user
npx ng g c edit --project=mfe-user
```

This generates a `details` and `edit` components within the `mfe-user` project.

#### Rename and set the routes of the Micro-Frontend:

```ts
// user.routes.ts

export const MFE_USER_ROUTES: Routes = [
  {
    path: "",
    pathMatch: "full",
    redirectTo: "details",
  },
  {
    path: "details",
    component: DetailsComponent,
  },
  {
    path: "edit",
    component: EditComponent,
  },
];
```

This routes `mfe-user` module to corresponding `details` and `edit` components.

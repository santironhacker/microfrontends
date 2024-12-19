# MicroFrontends Project Scaffolding Guide

This document provides a clear step-by-step guide to setting up a modular Angular application using multiple applications (modules) with module federation. The goal is to create a scalable, maintainable architecture that includes a shell app and micro-frontend modules.

#### **Run the code** 🚀

After cloning the repo, navigate to `microfrontends` workspace and install the `node_modules`:

```bash
cd microfrontends
npm install
```

Run the following commands in two different terminals to at the root of your workspace to run the `shell` and `mfe-user`:

```bash
npm run start:shell
npm run start:mfe-user
```

Or alternatively, use the following command to launch both concurrently:

```bash
npm run start:all
```

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

This will allow us to navigate to different routes once the routing is configured. Add styles as desired.

---

### 3. **Add the First Micro-Frontend Module**

This step involves creating a new application to act as the first micro-frontend module (`mfe-user`).

#### Generate the Micro-Frontend Application:

```bash
npx ng generate application mfe-user --routing=true --style=scss --ssr=false
```

This creates the `mfe-user` application with routing and SCSS support.

#### Update the Scripts in `package.json`:

Like for the shell, add the following entries under the `scripts` section for easier development and production builds:

```json
"start:mfe-user": "ng serve mfe-user -o --port 4301",
"build:mfe-user": "ng build mfe-user --prod",
```

- **`start:mfe-user`**: Launches the mfe-user app on port `4301`.
- **`build:mfe-user`**: Builds the mfe-user app in production mode.

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

---

### 4. **Enable Module Federation**

#### Install module federation

Install and use the Angular Architects Module Federation plugin to configure the micro-frontend.

```bash
npm install @angular-architects/module-federation@18 -D
```

Note the `@18` make sure we match `Angular CLI 18` and avoid uncompatible versions, as specified in the [@angular-architects/module-federation](https://www.npmjs.com/package/@angular-architects/module-federation) package in the section `Which Version to use?`.

#### Add Module Federation to the Micro-Frontend:

```bash
npx ng g @angular-architects/module-federation:init --project=mfe-user --port 4301 --type remote
```

- **`--project=mfe-user`**: Specifies the micro-frontend project.
- **`--port=4301`**: Sets the micro-frontend's development server port.
- **`--type=remote`**: Configures the app as a remote module.

#### Expose Routes in the Micro-Frontend:

Update the `webpack.config.ts` file for the `mfe-user` project to expose its routes:

```javascript
exposes: {
  "./routes": "./projects/mfe-user/src/app/user.routes.ts",
},
```

#### Add Module Federation to the Shell

To enable the shell to act as a host application:

```bash
npx ng g @angular-architects/module-federation:init --project shell --port 4300 --type host
```

This will create and update the `webpack.config.js` file in the shell application.

Since we want to work with dynamic loaded modules, remove the automatically added:

```js
// projects/shell/webpack.config.js

module.exports = withModuleFederationPlugin({
  // Remotes can be removed
  // remotes: {
  //   "mfeUser": "http://localhost:4301/remoteEntry.js",
  // },
});
```

#### Add Typings for Micro Frontends

Since static federation is being used, add typings for the configured paths (ECMAScript modules) that reference Micro Frontends:

```typescript
// projects/shell/src/declarations.d.ts

declare module "mfe-user/*";
```

#### Configure Lazy Loading in the Shell

Add a lazy route in the shell application to load the remote module's routes:

```typescript
// projects/shell/src/app/app.routes.ts

import { loadRemoteModule } from "@angular-architects/module-federation";

export const routes: Routes = [
  {
    path: "user",
    loadChildren: () =>
      loadRemoteModule({
        type: "module",
        remoteEntry: "http://localhost:4301/remoteEntry.js",
        exposedModule: "./routes",
      }).then((m) => m.MFE_USER_ROUTES),
  },
];
```

---

### 5. **Create `auth-lib` Library**

Generate a new library for authentication to share auth between modules:

```bash
npx ng generate library auth-lib
```

If you encounter issues installing `node_modules`, try running the following inside the library folder:

```bash
npm install --legacy-peer-deps
```

#### Update `tsconfig.json`

Edit the `tsconfig.json` file at the root of the workspace to include the library's paths and additional compiler options:

```json
"paths": {
  "compilerOptions": {
    "auth-lib": [
      "projects/auth-lib/src/public-api.ts"
    ]
    "baseUrl": "./",
  },
}
```

#### Add Basic Authentication Service

Implement a basic authentication service in `auth-lib.service.ts`:

```typescript
export class AuthLibService {
  private readonly USER_STORAGE_KEY = "user";
  private readonly UNDEFINED = "undefined";

  private userName: WritableSignal<string> = signal(this.checkUserInMemory());

  public get user(): Signal<string> {
    return this.userName.asReadonly();
  }

  public login(userName: string): void {
    this.userName.set(userName);
    sessionStorage.setItem(this.USER_STORAGE_KEY, this.userName());
  }

  private checkUserInMemory(): string {
    const storedUser: string | null = sessionStorage.getItem(this.USER_STORAGE_KEY);
    return storedUser ? storedUser : this.UNDEFINED;
  }
}
```

The `AuthLibService` can be therefore be accessed in our `shell` and `mfe-user` through dependency injection:

```typescript
import { AuthLibService } from "auth-lib";

export class AnyComponentModule {
  authLibService = inject(AuthLibService);
}
```

## **Summary of Project Structure**

After completing the above steps, your Angular workspace will have the following structure:

```
microfrontends/
├── projects/
│   ├── shell/        # Main shell application
│   └── mfe-user/     # First micro-frontend module
│   └── auth-lib/     # Lib shared as an npm package
└── package.json      # Scripts for managing the workspace
└── angular.json      # Details of workspace and projects config
```

- **`shell`**: Hosts the micro-frontends and manages shared functionality like navigation.
- **`mfe-user`**: Contains a `details` and `edit` component and serves as a remote module for the shell.
- **`auth-lib`**: Contains a `authLib` service that stores and manages the active connected user through the whole app.

---

## **Next Steps**

1. Configure and switch shared dependencies and lazy loading for micro-frontends if you want to move to static microfrontends.
2. Test the shell and micro-frontends in isolation and integration.
3. Add additional micro-frontend modules as needed using similar steps.

For further details on Angular Module Federation, consult the [Angular Architects Module Federation documentation](https://www.npmjs.com/package/@angular-architects/module-federation).

# SpadeUI

Bridge the gap between your business and your development team by using Spade's simple interface to automate frequent business tasks.

This repository hosts the frontend code for **Spade**. It complements the [backend service](https://github.com/crugroup/spade), hosted separately, to offer a complete solution. Feel free to visit the [Spade homepage](https://getspade.io/).

## Features

This tool is built with **TypeScript** and leverages the capabilities of **Refine.dev** to streamline development and enhance functionality.

- User-Friendly Interface

- Flexibility

- Uploading files & executing Processes

- Customisable forms

- Cross-Platform Interoperability

- Scalability

## Related Repositories

[Backend repository](https://github.com/crugroup/spade) contains all server-side code associated with this initiative.

## Available Scripts

#### Running the development server

```bash
yarn dev
```

#### Building for production

```bash
yarn build
```

## Maintenance

### Prerequisites
- Node.js (latest LTS)
- Yarn 4.6.0+ (enable with `corepack enable`)
- Backend API running on `http://localhost:8081`

### Development Workflow

#### 1. Install dependencies
```bash
yarn install
```
This regenerates `yarn.lock` automatically - never edit it manually.

#### 2. Start development server
```bash
yarn dev
```
Runs on `http://localhost:5173` with hot reload enabled.

#### 3. Environment configuration
Create `.env` file in the root:
```bash
VITE_API_URL=http://localhost:8081/api/v1
```

### Quality Checks

#### Run linter
```bash
yarn lint
```
Checks for ESLint and TypeScript errors.

#### Type checking
```bash
npx tsc --noEmit
```
Validates TypeScript types without building.

#### Build for production
```bash
yarn build
```
Outputs to `dist/` folder. Should complete without errors.

### Dependency Management

#### Check current versions
```bash
yarn info <package-name>
```

#### Check for dependency conflicts
```bash
yarn explain peer-requirements
```
Shows peer dependency mismatches. Look for ✘ markers for critical issues.

#### Check for security vulnerabilities
```bash
yarn npm audit --all
```
Should return "No audit suggestions" if all secure.

#### Upgrade specific packages
```bash
yarn up '@refinedev/*' '@rjsf/*' '@types/*' '@typescript-eslint/*' antd axios dayjs eslint-plugin-react-hooks '@vitejs/plugin-react'
```

#### Fix common dependency issues:

**Ant Design version conflict:**
```bash
# Keep Ant Design v5 (not v6) for Refine compatibility
yarn add antd@^5.21.6
```

**React type mismatch:**
```bash
# Ensure types match React 18 runtime
yarn add -D @types/react@^18.3 @types/react-dom@^18.3
```

**Security vulnerabilities:**
```bash
# Upgrade affected package (example: vite)
yarn up vite@^6.4
```

#### After upgrading:
1. Run `yarn install` to regenerate `yarn.lock`
2. Check for issues: `yarn explain peer-requirements`
3. Run security audit: `yarn npm audit --all`
4. Test with `yarn build`
5. Test with `yarn dev`
6. Run `npx tsc --noEmit` for type checking

### Testing Checklist
- [ ] `yarn install` completes without errors
- [ ] `yarn explain peer-requirements` shows no critical (✘) issues
- [ ] `yarn npm audit --all` returns "No audit suggestions"
- [ ] `yarn build` succeeds (target: < 5s build time)
- [ ] `yarn dev` starts on port 5173
- [ ] `npx tsc --noEmit` shows no type errors
- [ ] Frontend connects to backend API successfully

### Tech Stack & Compatibility Notes
- **Framework**: React 18.3.1 (stay on v18, not v19)
- **TypeScript**: 5.9.2
- **Build Tool**: Vite 6.4.1+
- **UI Library**: Ant Design 5.21.6+ (v5, not v6), Refine v4.58 (core) + v5.47 (UI)
- **Forms**: React JSON Schema Form (RJSF) 6.1.2
- **HTTP Client**: Axios 1.13.2
- **Package Manager**: Yarn 4.6.0

**Important**: Keep React 18.3 and ensure `@types/react` matches React 18 (not 19). Keep Ant Design on v5 (not v6). The Refine v4 core + v5 UI combination is officially supported during the transition period.


## Learn More

For additional resources and further information, visit the links below:

- **Documentation**: https://crugroup.github.io/spade/

- **Homepage**: https://getspade.io/

- **Refine Documentation**: https://refine.dev/docs

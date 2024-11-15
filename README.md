# React + Vite

This template provides a minimal setup to get React working in Vite with HMR and some ESLint rules.

Currently using [@vitejs/plugin-react](https://github.com/vitejs/vite-plugin-react/blob/main/packages/plugin-react/README.md) (Built on [Babel](https://babeljs.io/)) for Fast Refresh

## TanStack Router

The default routes of home ("/") and about ("/about") have been setup, with a root layout available in [\_\_root.tsx](src/routes/__root.jsx)

TanStack Router was setup using this [manual setup guide](https://tanstack.com/router/v1/docs/framework/react/quick-start#manual-setup), using the file-based routing approach.

## Mantine Component Library

Mantine was setup using their [vite guide](https://mantine.dev/guides/vite/)

All the required stylesheets for these packages have been imported in [main.tsx](src/main.tsx), and the two required Providers for Mantine and Modals have also been setup in main.tsx.

Here is Mantines learning resource: [link](https://mantine.dev/getting-started/#learn)

### Packages and dependencies

These Mantine packages have been installed as part of this template:

1. @mantine/core
2. @mantine/hooks
3. @mantine/dates
4. dayjs
5. @mantine/form
6. @mantine/dropzone
7. @mantine/carousel
8. embla-carousel-react@^7.1.0
9. @mantine/modals
10. @mantine/spotlight

## Supabase

Supabase JS client has been installed as an npm package using [their guide](https://supabase.com/docs/reference/javascript/installing#install-as-package).

And then in this project, the few boilerplate lines of code to initialize the client has been hidden away in [getSupabaseClient.js](src/supabase/getSupabaseClient.js)

Edit the 2 variables: `SUPABASE_URL` and `PUBLIC_ANON_KEY`, to match the values from your Supabase project.

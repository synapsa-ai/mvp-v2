// frontend/landing/src/lib/appRoutes.ts
export const APP_URL = import.meta.env.VITE_APP_URL || "http://localhost:8080";

// TODO: tudo aponta para /role-select
export const appPaths = {
  roleSelect: "/role-select",
  login: "/role-select",
  register: "/role-select",
  home: "/role-select",
} as const;

export function appHref(path: keyof typeof appPaths) {
  return `${APP_URL}${appPaths[path]}`;
}

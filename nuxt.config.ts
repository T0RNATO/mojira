import tailwindcss from "@tailwindcss/vite";

// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  runtimeConfig: {
    email: process.env.email,
    password: process.env.password,
  },
  nitro: {
    preset: 'cloudflare_pages',
    prerender: {
      autoSubfolderIndex: false
    }
  },
  vite: {
    plugins: [
      tailwindcss(),
    ],
  },
  app: {
    head: {
      link: [
        {rel: "icon", type: 'image/x-icon', href: '/dark.ico', media: '(prefers-color-scheme: dark)'},
        {rel: "icon", type: 'image/x-icon', href: '/light.ico', media: '(prefers-color-scheme: light)'},
      ]
    }
  }
})
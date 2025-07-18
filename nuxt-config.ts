// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  devtools: { enabled: true },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt'
  ],
  css: [
    '@/assets/css/main.css'
  ],
  app: {
    head: {
      title: 'DJ DJ LLC - Property Management',
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1' },
        { hid: 'description', name: 'description', content: 'Property management and tracking system for DJ DJ LLC' }
      ],
      link: [
        { rel: 'stylesheet', href: 'https://cdnjs.cloudflare.com/ajax/libs/font-awesome/6.0.0/css/all.min.css' }
      ]
    }
  },
  runtimeConfig: {
    public: {
      arcgisExperienceUrl: 'https://experience.arcgis.com/experience/c69f053c68e84a0ab98bc80b00836949/',
      dataSourceId: 'dataSource_5-c618cc10482c44689186cffcf8f4521a'
    }
  }
})
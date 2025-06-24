export default defineNuxtConfig({
  app: {
    head: {
      title: "MTA | Нийслэлийн татварын газар",
      meta: [
        { name: "description", content: "MTA | Нийслэлийн татварын газар" },
        { name: "author", content: "MaGnatE @ Mindsymbol" },
        {
          name: "keywords",
          content:
            "MTA, Нийслэлийн татварын газар, eTax, eTax систем, eTax системийн хэрэглэгчийн гарын авлага",
        },
        { "http-equiv": "X-UA-Compatible", content: "IE=edge" },
      ],
      link: [
        {
          rel: "icon",
          type: "image/x-icon",
          href: "/assets/images/favicon.png",
        },
        {
          rel: "stylesheet",
          href: "https://unpkg.com/leaflet@1.9.3/dist/leaflet.css",
        },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/MarkerCluster.css",
        },
        {
          rel: "stylesheet",
          href: "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.5.0/MarkerCluster.Default.min.css",
        },
      ],
      script: [
        { src: "https://unpkg.com/leaflet@1.9.3/dist/leaflet.js", defer: true },
        {
          src: "https://cdnjs.cloudflare.com/ajax/libs/leaflet.markercluster/1.4.1/leaflet.markercluster.js",
          defer: true,
        },
      ],
    },
  },
  css: [
    "@/assets/css/bootstrap.min.css",
    "@/assets/css/icons.min.css",
    "@/assets/css/app.css",
    "leaflet/dist/leaflet.css",
    "leaflet.markercluster/dist/MarkerCluster.css",
    "leaflet.markercluster/dist/MarkerCluster.Default.css",
  ],
  plugins: ["~/plugins/custom-js.client.ts"],
  runtimeConfig: {
    public: {
      backendApiUrl: process.env.BACKEND_API_URL
    }
  }
});

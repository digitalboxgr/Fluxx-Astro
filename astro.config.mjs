import { defineConfig } from 'astro/config';

export default defineConfig({
  // Your existing configuration
  
  // Image optimization settings
  image: {
    // The service to use for image optimization
    service: { entrypoint: 'astro/assets/services/sharp' },
    // Default image quality
    defaultQuality: 80,
    // Allow specific domains rather than using wildcards
    domains: [
      // Add domains where your images are hosted, for example:
      'example.com',
      'images.unsplash.com'
    ],
  },
  
  // Vite optimization settings for better performance
  vite: {
    build: {
      // Enable CSS code splitting
      cssCodeSplit: true,
      // Minimize output
      minify: 'terser',
      // Configure Terser options
      terserOptions: {
        compress: {
          drop_console: true,
        },
      },
    },
    // Enable asset optimization
    optimizeDeps: {
      exclude: [],
    },
  },
});
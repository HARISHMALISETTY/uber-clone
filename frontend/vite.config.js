import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
})

// No direct VITE_BASE_URL in vite.config.js, so ensure .env is used. Add a comment for developers.
// To set the backend URL, create a .env file in the frontend directory with:
// VITE_BASE_URL=http://localhost:3000

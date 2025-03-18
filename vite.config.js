import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react-swc'
import {config} from 'dotenv'

config();

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  define: {
    'process.env': process.env
  }
})

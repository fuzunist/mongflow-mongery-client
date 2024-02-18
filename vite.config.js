import { defineConfig } from 'vite'
import * as path from 'path'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [react()],
    resolve: {
        alias: {
            '@': path.resolve(__dirname, 'src')
        }
    },
    server: {
        port: 5179, 
      },
    //   build: {
    //     lib: {
    //       entry: path.resolve(__dirname, 'lib/main.js'),
    //       name: 'MyLib',
    //       fileName: (format) => `my-lib.${format}.js`
    //     },
    //     rollupOptions: {
    //       // make sure to externalize deps that shouldn't be bundled
    //       // into your library
    //       external: ['vue'],
    //       output: {
    //         // Provide global variables to use in the UMD build
    //         // for externalized deps
    //         globals: {
    //           vue: 'Vue'
    //         }
    //       }
    //     }
    //   }
})


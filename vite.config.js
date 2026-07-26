import { resolve } from "path";
import { defineConfig } from "vite";

export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        // 出力したいHTMLファイルをすべて指定する
        main: resolve(__dirname, "index.html"),
        menu: resolve(__dirname, "menu.html"),
        contact: resolve(__dirname, "contact.html"),
      },
    },
  },
});

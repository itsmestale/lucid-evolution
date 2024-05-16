import { defineConfig } from "tsup";
import { wasmLoader } from "esbuild-plugin-wasm";
import copy from "esbuild-copy-files-plugin";
import brode from "@geut/esbuild-plugin-brode";
import { polyfillNode } from "esbuild-plugin-polyfill-node";

export default defineConfig([
  {
    entry: ["src/index.ts"],
    format: ["cjs", "esm"],
    dts: true,
    clean: true,
    platform: "node",
    outDir: "dist/node",
    esbuildPlugins: [
      copy({
        source: "./src/uplc_tx_bg.wasm",
        target: "./dist/node",
        copyWithFolder: true,
      }),
      wasmLoader(),
    ],
  },
  {
    entry: ["src/index.ts"],
    format: ["esm"],
    dts: true,
    clean: true,
    platform: "browser",
    outDir: "dist/browser",
    esbuildPlugins: [
      wasmLoader(),
      polyfillNode(),
      copy({
        source: "./src/uplc_tx_bg.wasm",
        target: "./dist/browser",
        copyWithFolder: true,
      }),
    ],
  },
]);

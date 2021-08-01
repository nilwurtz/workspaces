import { build } from "esbuild"

const isDev = process.env.NODE_ENV !== "production"

build({
  entryPoints: ["./src/index.ts"],
  outfile: "./dist/index.js",
  platform: "node",
  watch: isDev ? {
    onRebuild: (e, r) => {
      if (e) console.error("Build Failed.", e.message)
      else console.log("Build Success.")
    }
  } : false,
}).then((r) => console.log("Building..."))
import path from "path";
import { build, ssrBuild } from "vite";
import { renderToString } from "@vue/server-renderer";
import express from "express";

const cwd = process.cwd();
const primaryPackage = path.resolve(cwd, "package.json");
const { main = "index" } = require(primaryPackage);

export const appSrc = path.dirname(path.resolve(cwd, main));
export const appDir = process.cwd();
export const appDist = path.join(appSrc, "dist");

export const buildApp = async (): Promise<void> => {
  const serverDist = path.join(appDist, "server");
  const clientDist = path.join(appDist, "client");
  const viteOutput = path.join(serverDist, "_assets");
  const entryFile = path.join(__dirname, "index.ts");

  const clientResult = await build({
    outDir: clientDist,
  });

  await ssrBuild({
    outDir: serverDist,
    rollupInputOptions: {
      input: { index: entryFile },
      preserveEntrySignatures: "allow-extension",
    },
  });

  const app = express();

  app.use(
    "/_assets",
    express.static(path.join(appDist, "client", "_assets"), { etag: false })
  );

  app.get("*", async (req, res) => {
    const { factorApp } = require(viteOutput);
    const context = { url: req.url };

    const fa = await factorApp(context);
    // // Render the html of the app, and insert it in the generated index.html built for client side.
    const content = await renderToString(fa, context);

    const basicHtml = clientResult[0].html;
    const indexOutput = basicHtml.replace(
      '<div id="app"></div>',
      `<div id="app" data-server-rendered="true">${content}</div>`
    );

    console.log("req", req.url);

    res.status(200).send(indexOutput).end();

    return;
  });

  await app.listen(3000);
  console.log(`LISTENING http://localhost:3000`);
};

buildApp();

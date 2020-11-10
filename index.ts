import { createSSRApp, App as VueApp } from "vue";
import { createFactorRouter } from "./router";
import Test from "./App.vue";

const isNode = typeof window !== "undefined" ? false : true;
/**
 * Create the main Vue app
 */
export const factorApp = async (
  context: { url?: string } = {}
): Promise<VueApp> => {
  const app = createSSRApp(Test);

  const router = createFactorRouter({ engine: isNode ? "server" : "client" });

  app.use(router);

  if (context.url) {
    router.push(context.url);
  }
  await router.isReady();

  return app;
};

/**
 * In client mode, mount the app
 */
if (!isNode) {
  factorApp().then((app) => {
    app.mount("#app");
  });
}

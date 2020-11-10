import {
  createRouter,
  createWebHistory,
  createMemoryHistory,
  Router,
} from "vue-router";
import Home from "./components/Homepage.vue";
import PageA from "./components/PageA.vue";

export const createFactorRouter = (options: {
  engine: "client" | "server";
}): Router => {
  const routerHistory =
    options.engine === "client" ? createWebHistory() : createMemoryHistory();

  return createRouter({
    history: routerHistory,
    routes: [
      {
        path: "/",
        component: Home,
      },
      {
        path: "/a",
        component: PageA,
      },
    ],
  });
};

export const testFun = (): string => {
  return "something";
};

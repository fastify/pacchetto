import { r as resolveComponent, o as openBlock, c as createBlock, w as withCtx, S as Suspense, u as unref, a as app, b as resolveDynamicComponent, _ as _export_sfc, d as createElementBlock, e as useHead, f as onErrorCaptured, g as computed, h as routing, i as createSSRApp, j as createHead, k as createRouter, I as Inkline, l as components, m as createWebHistory } from "./vendor.03f44651.js";
const p = function polyfill() {
  const relList = document.createElement("link").relList;
  if (relList && relList.supports && relList.supports("modulepreload")) {
    return;
  }
  for (const link2 of document.querySelectorAll('link[rel="modulepreload"]')) {
    processPreload(link2);
  }
  new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      if (mutation.type !== "childList") {
        continue;
      }
      for (const node of mutation.addedNodes) {
        if (node.tagName === "LINK" && node.rel === "modulepreload")
          processPreload(node);
      }
    }
  }).observe(document, { childList: true, subtree: true });
  function getFetchOpts(script2) {
    const fetchOpts = {};
    if (script2.integrity)
      fetchOpts.integrity = script2.integrity;
    if (script2.referrerpolicy)
      fetchOpts.referrerPolicy = script2.referrerpolicy;
    if (script2.crossorigin === "use-credentials")
      fetchOpts.credentials = "include";
    else if (script2.crossorigin === "anonymous")
      fetchOpts.credentials = "omit";
    else
      fetchOpts.credentials = "same-origin";
    return fetchOpts;
  }
  function processPreload(link2) {
    if (link2.ep)
      return;
    link2.ep = true;
    const fetchOpts = getFetchOpts(link2);
    fetch(link2.href, fetchOpts);
  }
};
p();
var index = "";
const _sfc_main$2 = {
  setup(__props) {
    return (_ctx, _cache) => {
      const _component_router_view = resolveComponent("router-view");
      return openBlock(), createBlock(_component_router_view, null, {
        default: withCtx(({ Component }) => [
          (openBlock(), createBlock(Suspense, { onResolve: unref(app.hydrationDone) }, {
            default: withCtx(() => [
              (openBlock(), createBlock(resolveDynamicComponent(Component), {
                key: _ctx.$route.path
              }))
            ]),
            _: 2
          }, 1032, ["onResolve"]))
        ]),
        _: 1
      });
    };
  }
};
const _sfc_main$1 = {
  props: {
    error: Object
  }
};
function _sfc_render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("h1", null, "Error Page");
}
var Error = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", _sfc_render$1]]);
const title = null;
const base$1 = null;
const meta = [];
const link = [];
const style = [];
const script = [];
const htmlAttrs = {};
const bodyAttrs = {};
var head = {
  title: null,
  base: null,
  meta: [],
  link: [],
  style: [],
  script: [],
  htmlAttrs: {},
  bodyAttrs: {}
};
var head$1 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  title,
  base: base$1,
  meta,
  link,
  style,
  script,
  htmlAttrs,
  bodyAttrs,
  "default": head
});
const _sfc_main = {
  components: {
    Error,
    Router: _sfc_main$2
  },
  setup() {
    const ctx = app.useIsomorphic();
    if (typeof head === "function") {
      useHead(head(ctx));
    } else {
      useHead(head != null ? head : head$1);
    }
    onErrorCaptured((error) => {
      ctx.$error = error;
    });
    return {
      error: computed(() => ctx.$error)
    };
  }
};
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_Error = resolveComponent("Error");
  const _component_Router = resolveComponent("Router");
  return $setup.error ? (openBlock(), createBlock(_component_Error, {
    key: 0,
    error: $setup.error
  }, null, 8, ["error"])) : (openBlock(), createBlock(_component_Router, { key: 1 }));
}
var baseLayout = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render]]);
const scriptRel = "modulepreload";
const seen = {};
const base = "/";
const __vitePreload = function preload(baseModule, deps) {
  if (!deps || deps.length === 0) {
    return baseModule();
  }
  return Promise.all(deps.map((dep) => {
    dep = `${base}${dep}`;
    if (dep in seen)
      return;
    seen[dep] = true;
    const isCss = dep.endsWith(".css");
    const cssSelector = isCss ? '[rel="stylesheet"]' : "";
    if (document.querySelector(`link[href="${dep}"]${cssSelector}`)) {
      return;
    }
    const link2 = document.createElement("link");
    link2.rel = isCss ? "stylesheet" : scriptRel;
    if (!isCss) {
      link2.as = "script";
      link2.crossOrigin = "";
    }
    link2.href = dep;
    document.head.appendChild(link2);
    if (isCss) {
      return new Promise((res, rej) => {
        link2.addEventListener("load", res);
        link2.addEventListener("error", rej);
      });
    }
  })).then(() => baseModule());
};
var index_vue_vue_type_style_index_0_scoped_true_lang = "";
var loadRoutes = () => routing.getRoutes(routing.hydrateRoutes({ "/views/index.vue": () => true ? __vitePreload(() => import("./index.c25b3635.js"), ["assets/index.c25b3635.js","assets/vendor.03f44651.js","assets/vendor.b5bb102d.css"]) : null }));
var inkline = "";
var main = "";
const createHistory = createWebHistory;
async function createApp(ctx) {
  const resolvedRoutes = await loadRoutes();
  const app2 = createSSRApp(baseLayout);
  const head2 = createHead();
  const router = createRouter({
    history: createHistory(),
    routes: resolvedRoutes
  });
  {
    router.beforeEach(routing.createBeforeEachHandler(resolvedRoutes));
  }
  app2.use(router);
  app2.use(head2);
  app2.use(Inkline, { components });
  return { ctx, app: app2, head: head2, router, routes: resolvedRoutes };
}
createApp().then(async ({ app: app2, router }) => {
  await router.isReady();
  app2.mount("#app");
});

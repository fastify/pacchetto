"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports[Symbol.toStringTag] = "Module";
var vue = require("vue");
var vueRouter = require("vue-router");
var head$2 = require("@vueuse/head");
var routing = require("fastify-vite-vue/routing");
var inkline$1 = require("@inkline/inkline");
var app = require("fastify-vite-vue/app");
var serverRenderer = require("vue/server-renderer");
var server$1 = require("fastify-vite-vue/server");
const _sfc_main$3 = {
  __ssrInlineRender: true,
  setup(__props) {
    return (_ctx, _push, _parent, _attrs) => {
      const _component_router_view = vue.resolveComponent("router-view");
      _push(serverRenderer.ssrRenderComponent(_component_router_view, _attrs, {
        default: vue.withCtx(({ Component }, _push2, _parent2, _scopeId) => {
          if (_push2) {
            serverRenderer.ssrRenderSuspense(_push2, {
              default: () => {
                serverRenderer.ssrRenderVNode(_push2, vue.createVNode(vue.resolveDynamicComponent(Component), {
                  key: _ctx.$route.path
                }, null), _parent2, _scopeId);
              },
              _: 2
            });
          } else {
            return [
              (vue.openBlock(), vue.createBlock(vue.Suspense, { onResolve: vue.unref(app.hydrationDone) }, {
                default: vue.withCtx(() => [
                  (vue.openBlock(), vue.createBlock(vue.resolveDynamicComponent(Component), {
                    key: _ctx.$route.path
                  }))
                ]),
                _: 2
              }, 1032, ["onResolve"]))
            ];
          }
        }),
        _: 1
      }, _parent));
    };
  }
};
const _sfc_setup$3 = _sfc_main$3.setup;
_sfc_main$3.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("router.vue");
  return _sfc_setup$3 ? _sfc_setup$3(props, ctx) : void 0;
};
var _export_sfc = (sfc, props) => {
  const target = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target[key] = val;
  }
  return target;
};
const _sfc_main$2 = {
  props: {
    error: Object
  }
};
function _sfc_ssrRender$2(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  _push(`<h1${serverRenderer.ssrRenderAttrs(_attrs)}>Error Page</h1>`);
}
const _sfc_setup$2 = _sfc_main$2.setup;
_sfc_main$2.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("error.vue");
  return _sfc_setup$2 ? _sfc_setup$2(props, ctx) : void 0;
};
var Error = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["ssrRender", _sfc_ssrRender$2]]);
const title = null;
const base = null;
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
  base,
  meta,
  link,
  style,
  script,
  htmlAttrs,
  bodyAttrs,
  "default": head
});
const _sfc_main$1 = {
  components: {
    Error,
    Router: _sfc_main$3
  },
  setup() {
    const ctx = app.useIsomorphic();
    if (typeof head === "function") {
      head$2.useHead(head(ctx));
    } else {
      head$2.useHead(head != null ? head : head$1);
    }
    vue.onErrorCaptured((error) => {
      ctx.$error = error;
    });
    return {
      error: vue.computed(() => ctx.$error)
    };
  }
};
function _sfc_ssrRender$1(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_Error = vue.resolveComponent("Error");
  const _component_Router = vue.resolveComponent("Router");
  if ($setup.error) {
    _push(serverRenderer.ssrRenderComponent(_component_Error, vue.mergeProps({ error: $setup.error }, _attrs), null, _parent));
  } else {
    _push(serverRenderer.ssrRenderComponent(_component_Router, _attrs, null, _parent));
  }
}
const _sfc_setup$1 = _sfc_main$1.setup;
_sfc_main$1.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("client.vue");
  return _sfc_setup$1 ? _sfc_setup$1(props, ctx) : void 0;
};
var baseLayout = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["ssrRender", _sfc_ssrRender$1]]);
var _imports_0 = "/fastify.svg";
var index_vue_vue_type_style_index_0_scoped_true_lang = "";
function getPayload({ fastify }) {
  return {
    plugins: fastify.data
  };
}
const path = "/";
const _sfc_main = {
  setup() {
    const selectedCat = vue.ref(false);
    const setSelectedCat = (cat) => {
      selectedCat.value = cat;
    };
    const { plugins } = app.usePayload();
    const categories = vue.ref(Object.keys(plugins));
    const json = vue.computed(() => {
      const dependencies = {};
      for (const cat of Object.keys(plugins)) {
        for (const plugin of plugins[cat]) {
          if (plugin.checked) {
            dependencies[plugin.name] = plugin.version;
          }
        }
      }
      return JSON.stringify({ dependencies }, null, 2);
    });
    return {
      json,
      plugins,
      categories,
      selectedCat,
      setSelectedCat
    };
  }
};
function _sfc_ssrRender(_ctx, _push, _parent, _attrs, $props, $setup, $data, $options) {
  const _component_i_button = vue.resolveComponent("i-button");
  const _component_i_checkbox = vue.resolveComponent("i-checkbox");
  _push(`<!--[--><h1 class="title" data-v-8c569d14><img${serverRenderer.ssrRenderAttr("src", _imports_0)} data-v-8c569d14>Fastify Package Generator</h1><div class="panes" data-v-8c569d14><pre class="code" data-v-8c569d14>${serverRenderer.ssrInterpolate($setup.json)}</pre><div class="controls" data-v-8c569d14><div class="top" data-v-8c569d14><h2 data-v-8c569d14><i data-v-8c569d14>Full stack</i>, you say? What do you need?</h2><div class="categories" data-v-8c569d14><!--[-->`);
  serverRenderer.ssrRenderList($setup.categories, (cat) => {
    _push(serverRenderer.ssrRenderComponent(_component_i_button, {
      class: { selected: cat === $setup.selectedCat },
      color: "primary"
    }, {
      default: vue.withCtx((_, _push2, _parent2, _scopeId) => {
        if (_push2) {
          _push2(`${serverRenderer.ssrInterpolate(cat)}`);
        } else {
          return [
            vue.createTextVNode(vue.toDisplayString(cat), 1)
          ];
        }
      }),
      _: 2
    }, _parent));
  });
  _push(`<!--]--></div><div class="plugins" data-v-8c569d14><!--[-->`);
  serverRenderer.ssrRenderList($setup.plugins[$setup.selectedCat], (plugin, i) => {
    _push(`<div class="plugin" data-v-8c569d14><div class="left" data-v-8c569d14>`);
    _push(serverRenderer.ssrRenderComponent(_component_i_checkbox, {
      modelValue: $setup.plugins[$setup.selectedCat][i].checked,
      "onUpdate:modelValue": ($event) => $setup.plugins[$setup.selectedCat][i].checked = $event
    }, null, _parent));
    _push(`</div><div class="right" data-v-8c569d14><p class="name" data-v-8c569d14><a href="https://fastify.io/" data-v-8c569d14>${serverRenderer.ssrInterpolate(plugin.name)}</a></p><p class="description" data-v-8c569d14>${serverRenderer.ssrInterpolate(plugin.description)}</p></div></div>`);
  });
  _push(`<!--]--></div></div></div></div><!--]-->`);
}
const _sfc_setup = _sfc_main.setup;
_sfc_main.setup = (props, ctx) => {
  const ssrContext = vue.useSSRContext();
  (ssrContext.modules || (ssrContext.modules = new Set())).add("views/index.vue");
  return _sfc_setup ? _sfc_setup(props, ctx) : void 0;
};
var index = /* @__PURE__ */ _export_sfc(_sfc_main, [["ssrRender", _sfc_ssrRender], ["__scopeId", "data-v-8c569d14"]]);
var __glob_1_0 = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  getPayload,
  path,
  "default": index
});
var routes = () => routing.getRoutes({ "/views/index.vue": __glob_1_0 });
var inkline = "";
var main = "";
const createHistory = vueRouter.createMemoryHistory;
async function createApp(ctx) {
  const resolvedRoutes = await routes();
  const app2 = vue.createSSRApp(baseLayout);
  const head2 = head$2.createHead();
  const router = vueRouter.createRouter({
    history: createHistory(),
    routes: resolvedRoutes
  });
  app2.use(router);
  app2.use(head2);
  app2.use(inkline$1.Inkline, { components: inkline$1.components });
  return { ctx, app: app2, head: head2, router, routes: resolvedRoutes };
}
var server = {
  routes,
  render: server$1.createRenderFunction(createApp)
};
exports["default"] = server;

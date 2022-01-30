import { _ as _export_sfc, n as ref, a as app, g as computed, r as resolveComponent, o as openBlock, d as createElementBlock, p as createBaseVNode, t as toDisplayString, F as Fragment, q as renderList, c as createBlock, w as withCtx, s as createTextVNode, v as normalizeClass, x as createVNode, y as pushScopeId, z as popScopeId } from "./vendor.03f44651.js";
import "./index.fb98afea.js";
var _imports_0 = "/fastify.svg";
function getPayload({ fastify }) {
  return {
    plugins: fastify.data
  };
}
const path = "/";
const _sfc_main = {
  setup() {
    const selectedCat = ref(false);
    const setSelectedCat = (cat) => {
      selectedCat.value = cat;
    };
    const { plugins } = app.usePayload();
    const categories = ref(Object.keys(plugins));
    const json = computed(() => {
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
const _withScopeId = (n) => (pushScopeId("data-v-8c569d14"), n = n(), popScopeId(), n);
const _hoisted_1 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("h1", { class: "title" }, [
  /* @__PURE__ */ createBaseVNode("img", { src: _imports_0 }),
  /* @__PURE__ */ createTextVNode("Fastify Package Generator")
], -1));
const _hoisted_2 = { class: "panes" };
const _hoisted_3 = { class: "code" };
const _hoisted_4 = { class: "controls" };
const _hoisted_5 = { class: "top" };
const _hoisted_6 = /* @__PURE__ */ _withScopeId(() => /* @__PURE__ */ createBaseVNode("h2", null, [
  /* @__PURE__ */ createBaseVNode("i", null, "Full stack"),
  /* @__PURE__ */ createTextVNode(", you say? What do you need?")
], -1));
const _hoisted_7 = { class: "categories" };
const _hoisted_8 = { class: "plugins" };
const _hoisted_9 = { class: "plugin" };
const _hoisted_10 = { class: "left" };
const _hoisted_11 = { class: "right" };
const _hoisted_12 = { class: "name" };
const _hoisted_13 = { href: "https://fastify.io/" };
const _hoisted_14 = { class: "description" };
function _sfc_render(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_i_button = resolveComponent("i-button");
  const _component_i_checkbox = resolveComponent("i-checkbox");
  return openBlock(), createElementBlock(Fragment, null, [
    _hoisted_1,
    createBaseVNode("div", _hoisted_2, [
      createBaseVNode("pre", _hoisted_3, toDisplayString($setup.json), 1),
      createBaseVNode("div", _hoisted_4, [
        createBaseVNode("div", _hoisted_5, [
          _hoisted_6,
          createBaseVNode("div", _hoisted_7, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($setup.categories, (cat) => {
              return openBlock(), createBlock(_component_i_button, {
                class: normalizeClass({ selected: cat === $setup.selectedCat }),
                onClick: ($event) => $setup.setSelectedCat(cat),
                color: "primary"
              }, {
                default: withCtx(() => [
                  createTextVNode(toDisplayString(cat), 1)
                ]),
                _: 2
              }, 1032, ["class", "onClick"]);
            }), 256))
          ]),
          createBaseVNode("div", _hoisted_8, [
            (openBlock(true), createElementBlock(Fragment, null, renderList($setup.plugins[$setup.selectedCat], (plugin, i) => {
              return openBlock(), createElementBlock("div", _hoisted_9, [
                createBaseVNode("div", _hoisted_10, [
                  createVNode(_component_i_checkbox, {
                    modelValue: $setup.plugins[$setup.selectedCat][i].checked,
                    "onUpdate:modelValue": ($event) => $setup.plugins[$setup.selectedCat][i].checked = $event
                  }, null, 8, ["modelValue", "onUpdate:modelValue"])
                ]),
                createBaseVNode("div", _hoisted_11, [
                  createBaseVNode("p", _hoisted_12, [
                    createBaseVNode("a", _hoisted_13, toDisplayString(plugin.name), 1)
                  ]),
                  createBaseVNode("p", _hoisted_14, toDisplayString(plugin.description), 1)
                ])
              ]);
            }), 256))
          ])
        ])
      ])
    ])
  ], 64);
}
var index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", _sfc_render], ["__scopeId", "data-v-8c569d14"]]);
export { index as default, getPayload, path };

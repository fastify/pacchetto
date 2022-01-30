var __defProp = Object.defineProperty;
var __defProps = Object.defineProperties;
var __getOwnPropDescs = Object.getOwnPropertyDescriptors;
var __getOwnPropSymbols = Object.getOwnPropertySymbols;
var __hasOwnProp = Object.prototype.hasOwnProperty;
var __propIsEnum = Object.prototype.propertyIsEnumerable;
var __defNormalProp = (obj, key, value) => key in obj ? __defProp(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues = (a, b) => {
  for (var prop2 in b || (b = {}))
    if (__hasOwnProp.call(b, prop2))
      __defNormalProp(a, prop2, b[prop2]);
  if (__getOwnPropSymbols)
    for (var prop2 of __getOwnPropSymbols(b)) {
      if (__propIsEnum.call(b, prop2))
        __defNormalProp(a, prop2, b[prop2]);
    }
  return a;
};
var __spreadProps = (a, b) => __defProps(a, __getOwnPropDescs(b));
var __objRest = (source, exclude) => {
  var target2 = {};
  for (var prop2 in source)
    if (__hasOwnProp.call(source, prop2) && exclude.indexOf(prop2) < 0)
      target2[prop2] = source[prop2];
  if (source != null && __getOwnPropSymbols)
    for (var prop2 of __getOwnPropSymbols(source)) {
      if (exclude.indexOf(prop2) < 0 && __propIsEnum.call(source, prop2))
        target2[prop2] = source[prop2];
    }
  return target2;
};
function makeMap(str, expectsLowerCase) {
  const map2 = Object.create(null);
  const list = str.split(",");
  for (let i = 0; i < list.length; i++) {
    map2[list[i]] = true;
  }
  return expectsLowerCase ? (val) => !!map2[val.toLowerCase()] : (val) => !!map2[val];
}
const GLOBALS_WHITE_LISTED = "Infinity,undefined,NaN,isFinite,isNaN,parseFloat,parseInt,decodeURI,decodeURIComponent,encodeURI,encodeURIComponent,Math,Number,Date,Array,Object,Boolean,String,RegExp,Map,Set,JSON,Intl,BigInt";
const isGloballyWhitelisted = /* @__PURE__ */ makeMap(GLOBALS_WHITE_LISTED);
const specialBooleanAttrs = `itemscope,allowfullscreen,formnovalidate,ismap,nomodule,novalidate,readonly`;
const isSpecialBooleanAttr = /* @__PURE__ */ makeMap(specialBooleanAttrs);
function includeBooleanAttr(value) {
  return !!value || value === "";
}
function normalizeStyle(value) {
  if (isArray(value)) {
    const res = {};
    for (let i = 0; i < value.length; i++) {
      const item = value[i];
      const normalized = isString(item) ? parseStringStyle(item) : normalizeStyle(item);
      if (normalized) {
        for (const key in normalized) {
          res[key] = normalized[key];
        }
      }
    }
    return res;
  } else if (isString(value)) {
    return value;
  } else if (isObject(value)) {
    return value;
  }
}
const listDelimiterRE = /;(?![^(]*\))/g;
const propertyDelimiterRE = /:(.+)/;
function parseStringStyle(cssText) {
  const ret = {};
  cssText.split(listDelimiterRE).forEach((item) => {
    if (item) {
      const tmp = item.split(propertyDelimiterRE);
      tmp.length > 1 && (ret[tmp[0].trim()] = tmp[1].trim());
    }
  });
  return ret;
}
function normalizeClass(value) {
  let res = "";
  if (isString(value)) {
    res = value;
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      const normalized = normalizeClass(value[i]);
      if (normalized) {
        res += normalized + " ";
      }
    }
  } else if (isObject(value)) {
    for (const name in value) {
      if (value[name]) {
        res += name + " ";
      }
    }
  }
  return res.trim();
}
function normalizeProps(props) {
  if (!props)
    return null;
  let { class: klass, style } = props;
  if (klass && !isString(klass)) {
    props.class = normalizeClass(klass);
  }
  if (style) {
    props.style = normalizeStyle(style);
  }
  return props;
}
function looseCompareArrays(a, b) {
  if (a.length !== b.length)
    return false;
  let equal = true;
  for (let i = 0; equal && i < a.length; i++) {
    equal = looseEqual(a[i], b[i]);
  }
  return equal;
}
function looseEqual(a, b) {
  if (a === b)
    return true;
  let aValidType = isDate(a);
  let bValidType = isDate(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? a.getTime() === b.getTime() : false;
  }
  aValidType = isArray(a);
  bValidType = isArray(b);
  if (aValidType || bValidType) {
    return aValidType && bValidType ? looseCompareArrays(a, b) : false;
  }
  aValidType = isObject(a);
  bValidType = isObject(b);
  if (aValidType || bValidType) {
    if (!aValidType || !bValidType) {
      return false;
    }
    const aKeysCount = Object.keys(a).length;
    const bKeysCount = Object.keys(b).length;
    if (aKeysCount !== bKeysCount) {
      return false;
    }
    for (const key in a) {
      const aHasKey = a.hasOwnProperty(key);
      const bHasKey = b.hasOwnProperty(key);
      if (aHasKey && !bHasKey || !aHasKey && bHasKey || !looseEqual(a[key], b[key])) {
        return false;
      }
    }
  }
  return String(a) === String(b);
}
function looseIndexOf(arr, val) {
  return arr.findIndex((item) => looseEqual(item, val));
}
const toDisplayString = (val) => {
  return val == null ? "" : isArray(val) || isObject(val) && (val.toString === objectToString || !isFunction$1(val.toString)) ? JSON.stringify(val, replacer, 2) : String(val);
};
const replacer = (_key, val) => {
  if (val && val.__v_isRef) {
    return replacer(_key, val.value);
  } else if (isMap(val)) {
    return {
      [`Map(${val.size})`]: [...val.entries()].reduce((entries, [key, val2]) => {
        entries[`${key} =>`] = val2;
        return entries;
      }, {})
    };
  } else if (isSet(val)) {
    return {
      [`Set(${val.size})`]: [...val.values()]
    };
  } else if (isObject(val) && !isArray(val) && !isPlainObject(val)) {
    return String(val);
  }
  return val;
};
const EMPTY_OBJ = {};
const EMPTY_ARR = [];
const NOOP = () => {
};
const NO = () => false;
const onRE = /^on[^a-z]/;
const isOn = (key) => onRE.test(key);
const isModelListener = (key) => key.startsWith("onUpdate:");
const extend = Object.assign;
const remove = (arr, el2) => {
  const i = arr.indexOf(el2);
  if (i > -1) {
    arr.splice(i, 1);
  }
};
const hasOwnProperty = Object.prototype.hasOwnProperty;
const hasOwn = (val, key) => hasOwnProperty.call(val, key);
const isArray = Array.isArray;
const isMap = (val) => toTypeString(val) === "[object Map]";
const isSet = (val) => toTypeString(val) === "[object Set]";
const isDate = (val) => val instanceof Date;
const isFunction$1 = (val) => typeof val === "function";
const isString = (val) => typeof val === "string";
const isSymbol = (val) => typeof val === "symbol";
const isObject = (val) => val !== null && typeof val === "object";
const isPromise = (val) => {
  return isObject(val) && isFunction$1(val.then) && isFunction$1(val.catch);
};
const objectToString = Object.prototype.toString;
const toTypeString = (value) => objectToString.call(value);
const toRawType = (value) => {
  return toTypeString(value).slice(8, -1);
};
const isPlainObject = (val) => toTypeString(val) === "[object Object]";
const isIntegerKey = (key) => isString(key) && key !== "NaN" && key[0] !== "-" && "" + parseInt(key, 10) === key;
const isReservedProp = /* @__PURE__ */ makeMap(",key,ref,ref_for,ref_key,onVnodeBeforeMount,onVnodeMounted,onVnodeBeforeUpdate,onVnodeUpdated,onVnodeBeforeUnmount,onVnodeUnmounted");
const cacheStringFunction = (fn2) => {
  const cache = Object.create(null);
  return (str) => {
    const hit = cache[str];
    return hit || (cache[str] = fn2(str));
  };
};
const camelizeRE = /-(\w)/g;
const camelize = cacheStringFunction((str) => {
  return str.replace(camelizeRE, (_, c) => c ? c.toUpperCase() : "");
});
const hyphenateRE = /\B([A-Z])/g;
const hyphenate = cacheStringFunction((str) => str.replace(hyphenateRE, "-$1").toLowerCase());
const capitalize = cacheStringFunction((str) => str.charAt(0).toUpperCase() + str.slice(1));
const toHandlerKey = cacheStringFunction((str) => str ? `on${capitalize(str)}` : ``);
const hasChanged = (value, oldValue) => !Object.is(value, oldValue);
const invokeArrayFns = (fns, arg) => {
  for (let i = 0; i < fns.length; i++) {
    fns[i](arg);
  }
};
const def = (obj, key, value) => {
  Object.defineProperty(obj, key, {
    configurable: true,
    enumerable: false,
    value
  });
};
const toNumber = (val) => {
  const n = parseFloat(val);
  return isNaN(n) ? val : n;
};
let _globalThis;
const getGlobalThis = () => {
  return _globalThis || (_globalThis = typeof globalThis !== "undefined" ? globalThis : typeof self !== "undefined" ? self : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : {});
};
let activeEffectScope;
const effectScopeStack = [];
class EffectScope {
  constructor(detached = false) {
    this.active = true;
    this.effects = [];
    this.cleanups = [];
    if (!detached && activeEffectScope) {
      this.parent = activeEffectScope;
      this.index = (activeEffectScope.scopes || (activeEffectScope.scopes = [])).push(this) - 1;
    }
  }
  run(fn2) {
    if (this.active) {
      try {
        this.on();
        return fn2();
      } finally {
        this.off();
      }
    }
  }
  on() {
    if (this.active) {
      effectScopeStack.push(this);
      activeEffectScope = this;
    }
  }
  off() {
    if (this.active) {
      effectScopeStack.pop();
      activeEffectScope = effectScopeStack[effectScopeStack.length - 1];
    }
  }
  stop(fromParent) {
    if (this.active) {
      this.effects.forEach((e) => e.stop());
      this.cleanups.forEach((cleanup) => cleanup());
      if (this.scopes) {
        this.scopes.forEach((e) => e.stop(true));
      }
      if (this.parent && !fromParent) {
        const last = this.parent.scopes.pop();
        if (last && last !== this) {
          this.parent.scopes[this.index] = last;
          last.index = this.index;
        }
      }
      this.active = false;
    }
  }
}
function effectScope(detached) {
  return new EffectScope(detached);
}
function recordEffectScope(effect2, scope) {
  scope = scope || activeEffectScope;
  if (scope && scope.active) {
    scope.effects.push(effect2);
  }
}
function getCurrentScope() {
  return activeEffectScope;
}
function onScopeDispose(fn2) {
  if (activeEffectScope) {
    activeEffectScope.cleanups.push(fn2);
  }
}
const createDep = (effects) => {
  const dep = new Set(effects);
  dep.w = 0;
  dep.n = 0;
  return dep;
};
const wasTracked = (dep) => (dep.w & trackOpBit) > 0;
const newTracked = (dep) => (dep.n & trackOpBit) > 0;
const initDepMarkers = ({ deps }) => {
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].w |= trackOpBit;
    }
  }
};
const finalizeDepMarkers = (effect2) => {
  const { deps } = effect2;
  if (deps.length) {
    let ptr = 0;
    for (let i = 0; i < deps.length; i++) {
      const dep = deps[i];
      if (wasTracked(dep) && !newTracked(dep)) {
        dep.delete(effect2);
      } else {
        deps[ptr++] = dep;
      }
      dep.w &= ~trackOpBit;
      dep.n &= ~trackOpBit;
    }
    deps.length = ptr;
  }
};
const targetMap = new WeakMap();
let effectTrackDepth = 0;
let trackOpBit = 1;
const maxMarkerBits = 30;
const effectStack = [];
let activeEffect;
const ITERATE_KEY = Symbol("");
const MAP_KEY_ITERATE_KEY = Symbol("");
class ReactiveEffect {
  constructor(fn2, scheduler = null, scope) {
    this.fn = fn2;
    this.scheduler = scheduler;
    this.active = true;
    this.deps = [];
    recordEffectScope(this, scope);
  }
  run() {
    if (!this.active) {
      return this.fn();
    }
    if (!effectStack.length || !effectStack.includes(this)) {
      try {
        effectStack.push(activeEffect = this);
        enableTracking();
        trackOpBit = 1 << ++effectTrackDepth;
        if (effectTrackDepth <= maxMarkerBits) {
          initDepMarkers(this);
        } else {
          cleanupEffect(this);
        }
        return this.fn();
      } finally {
        if (effectTrackDepth <= maxMarkerBits) {
          finalizeDepMarkers(this);
        }
        trackOpBit = 1 << --effectTrackDepth;
        resetTracking();
        effectStack.pop();
        const n = effectStack.length;
        activeEffect = n > 0 ? effectStack[n - 1] : void 0;
      }
    }
  }
  stop() {
    if (this.active) {
      cleanupEffect(this);
      if (this.onStop) {
        this.onStop();
      }
      this.active = false;
    }
  }
}
function cleanupEffect(effect2) {
  const { deps } = effect2;
  if (deps.length) {
    for (let i = 0; i < deps.length; i++) {
      deps[i].delete(effect2);
    }
    deps.length = 0;
  }
}
function effect$3(fn2, options) {
  if (fn2.effect) {
    fn2 = fn2.effect.fn;
  }
  const _effect = new ReactiveEffect(fn2);
  if (options) {
    extend(_effect, options);
    if (options.scope)
      recordEffectScope(_effect, options.scope);
  }
  if (!options || !options.lazy) {
    _effect.run();
  }
  const runner = _effect.run.bind(_effect);
  runner.effect = _effect;
  return runner;
}
function stop(runner) {
  runner.effect.stop();
}
let shouldTrack = true;
const trackStack = [];
function pauseTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = false;
}
function enableTracking() {
  trackStack.push(shouldTrack);
  shouldTrack = true;
}
function resetTracking() {
  const last = trackStack.pop();
  shouldTrack = last === void 0 ? true : last;
}
function track(target2, type2, key) {
  if (!isTracking()) {
    return;
  }
  let depsMap = targetMap.get(target2);
  if (!depsMap) {
    targetMap.set(target2, depsMap = new Map());
  }
  let dep = depsMap.get(key);
  if (!dep) {
    depsMap.set(key, dep = createDep());
  }
  trackEffects(dep);
}
function isTracking() {
  return shouldTrack && activeEffect !== void 0;
}
function trackEffects(dep, debuggerEventExtraInfo) {
  let shouldTrack2 = false;
  if (effectTrackDepth <= maxMarkerBits) {
    if (!newTracked(dep)) {
      dep.n |= trackOpBit;
      shouldTrack2 = !wasTracked(dep);
    }
  } else {
    shouldTrack2 = !dep.has(activeEffect);
  }
  if (shouldTrack2) {
    dep.add(activeEffect);
    activeEffect.deps.push(dep);
  }
}
function trigger$1(target2, type2, key, newValue, oldValue, oldTarget) {
  const depsMap = targetMap.get(target2);
  if (!depsMap) {
    return;
  }
  let deps = [];
  if (type2 === "clear") {
    deps = [...depsMap.values()];
  } else if (key === "length" && isArray(target2)) {
    depsMap.forEach((dep, key2) => {
      if (key2 === "length" || key2 >= newValue) {
        deps.push(dep);
      }
    });
  } else {
    if (key !== void 0) {
      deps.push(depsMap.get(key));
    }
    switch (type2) {
      case "add":
        if (!isArray(target2)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target2)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        } else if (isIntegerKey(key)) {
          deps.push(depsMap.get("length"));
        }
        break;
      case "delete":
        if (!isArray(target2)) {
          deps.push(depsMap.get(ITERATE_KEY));
          if (isMap(target2)) {
            deps.push(depsMap.get(MAP_KEY_ITERATE_KEY));
          }
        }
        break;
      case "set":
        if (isMap(target2)) {
          deps.push(depsMap.get(ITERATE_KEY));
        }
        break;
    }
  }
  if (deps.length === 1) {
    if (deps[0]) {
      {
        triggerEffects(deps[0]);
      }
    }
  } else {
    const effects = [];
    for (const dep of deps) {
      if (dep) {
        effects.push(...dep);
      }
    }
    {
      triggerEffects(createDep(effects));
    }
  }
}
function triggerEffects(dep, debuggerEventExtraInfo) {
  for (const effect2 of isArray(dep) ? dep : [...dep]) {
    if (effect2 !== activeEffect || effect2.allowRecurse) {
      if (effect2.scheduler) {
        effect2.scheduler();
      } else {
        effect2.run();
      }
    }
  }
}
const isNonTrackableKeys = /* @__PURE__ */ makeMap(`__proto__,__v_isRef,__isVue`);
const builtInSymbols = new Set(Object.getOwnPropertyNames(Symbol).map((key) => Symbol[key]).filter(isSymbol));
const get = /* @__PURE__ */ createGetter();
const shallowGet = /* @__PURE__ */ createGetter(false, true);
const readonlyGet = /* @__PURE__ */ createGetter(true);
const shallowReadonlyGet = /* @__PURE__ */ createGetter(true, true);
const arrayInstrumentations = /* @__PURE__ */ createArrayInstrumentations();
function createArrayInstrumentations() {
  const instrumentations = {};
  ["includes", "indexOf", "lastIndexOf"].forEach((key) => {
    instrumentations[key] = function(...args) {
      const arr = toRaw(this);
      for (let i = 0, l = this.length; i < l; i++) {
        track(arr, "get", i + "");
      }
      const res = arr[key](...args);
      if (res === -1 || res === false) {
        return arr[key](...args.map(toRaw));
      } else {
        return res;
      }
    };
  });
  ["push", "pop", "shift", "unshift", "splice"].forEach((key) => {
    instrumentations[key] = function(...args) {
      pauseTracking();
      const res = toRaw(this)[key].apply(this, args);
      resetTracking();
      return res;
    };
  });
  return instrumentations;
}
function createGetter(isReadonly2 = false, shallow = false) {
  return function get2(target2, key, receiver) {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_isShallow") {
      return shallow;
    } else if (key === "__v_raw" && receiver === (isReadonly2 ? shallow ? shallowReadonlyMap : readonlyMap : shallow ? shallowReactiveMap : reactiveMap).get(target2)) {
      return target2;
    }
    const targetIsArray = isArray(target2);
    if (!isReadonly2 && targetIsArray && hasOwn(arrayInstrumentations, key)) {
      return Reflect.get(arrayInstrumentations, key, receiver);
    }
    const res = Reflect.get(target2, key, receiver);
    if (isSymbol(key) ? builtInSymbols.has(key) : isNonTrackableKeys(key)) {
      return res;
    }
    if (!isReadonly2) {
      track(target2, "get", key);
    }
    if (shallow) {
      return res;
    }
    if (isRef(res)) {
      const shouldUnwrap = !targetIsArray || !isIntegerKey(key);
      return shouldUnwrap ? res.value : res;
    }
    if (isObject(res)) {
      return isReadonly2 ? readonly(res) : reactive$1(res);
    }
    return res;
  };
}
const set = /* @__PURE__ */ createSetter();
const shallowSet = /* @__PURE__ */ createSetter(true);
function createSetter(shallow = false) {
  return function set2(target2, key, value, receiver) {
    let oldValue = target2[key];
    if (isReadonly(oldValue) && isRef(oldValue) && !isRef(value)) {
      return false;
    }
    if (!shallow && !isReadonly(value)) {
      if (!isShallow(value)) {
        value = toRaw(value);
        oldValue = toRaw(oldValue);
      }
      if (!isArray(target2) && isRef(oldValue) && !isRef(value)) {
        oldValue.value = value;
        return true;
      }
    }
    const hadKey = isArray(target2) && isIntegerKey(key) ? Number(key) < target2.length : hasOwn(target2, key);
    const result = Reflect.set(target2, key, value, receiver);
    if (target2 === toRaw(receiver)) {
      if (!hadKey) {
        trigger$1(target2, "add", key, value);
      } else if (hasChanged(value, oldValue)) {
        trigger$1(target2, "set", key, value);
      }
    }
    return result;
  };
}
function deleteProperty(target2, key) {
  const hadKey = hasOwn(target2, key);
  target2[key];
  const result = Reflect.deleteProperty(target2, key);
  if (result && hadKey) {
    trigger$1(target2, "delete", key, void 0);
  }
  return result;
}
function has(target2, key) {
  const result = Reflect.has(target2, key);
  if (!isSymbol(key) || !builtInSymbols.has(key)) {
    track(target2, "has", key);
  }
  return result;
}
function ownKeys(target2) {
  track(target2, "iterate", isArray(target2) ? "length" : ITERATE_KEY);
  return Reflect.ownKeys(target2);
}
const mutableHandlers = {
  get,
  set,
  deleteProperty,
  has,
  ownKeys
};
const readonlyHandlers = {
  get: readonlyGet,
  set(target2, key) {
    return true;
  },
  deleteProperty(target2, key) {
    return true;
  }
};
const shallowReactiveHandlers = /* @__PURE__ */ extend({}, mutableHandlers, {
  get: shallowGet,
  set: shallowSet
});
const shallowReadonlyHandlers = /* @__PURE__ */ extend({}, readonlyHandlers, {
  get: shallowReadonlyGet
});
const toShallow = (value) => value;
const getProto = (v) => Reflect.getPrototypeOf(v);
function get$1(target2, key, isReadonly2 = false, isShallow2 = false) {
  target2 = target2["__v_raw"];
  const rawTarget = toRaw(target2);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly2 && track(rawTarget, "get", key);
  }
  !isReadonly2 && track(rawTarget, "get", rawKey);
  const { has: has2 } = getProto(rawTarget);
  const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
  if (has2.call(rawTarget, key)) {
    return wrap(target2.get(key));
  } else if (has2.call(rawTarget, rawKey)) {
    return wrap(target2.get(rawKey));
  } else if (target2 !== rawTarget) {
    target2.get(key);
  }
}
function has$1(key, isReadonly2 = false) {
  const target2 = this["__v_raw"];
  const rawTarget = toRaw(target2);
  const rawKey = toRaw(key);
  if (key !== rawKey) {
    !isReadonly2 && track(rawTarget, "has", key);
  }
  !isReadonly2 && track(rawTarget, "has", rawKey);
  return key === rawKey ? target2.has(key) : target2.has(key) || target2.has(rawKey);
}
function size(target2, isReadonly2 = false) {
  target2 = target2["__v_raw"];
  !isReadonly2 && track(toRaw(target2), "iterate", ITERATE_KEY);
  return Reflect.get(target2, "size", target2);
}
function add(value) {
  value = toRaw(value);
  const target2 = toRaw(this);
  const proto = getProto(target2);
  const hadKey = proto.has.call(target2, value);
  if (!hadKey) {
    target2.add(value);
    trigger$1(target2, "add", value, value);
  }
  return this;
}
function set$1(key, value) {
  value = toRaw(value);
  const target2 = toRaw(this);
  const { has: has2, get: get2 } = getProto(target2);
  let hadKey = has2.call(target2, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target2, key);
  }
  const oldValue = get2.call(target2, key);
  target2.set(key, value);
  if (!hadKey) {
    trigger$1(target2, "add", key, value);
  } else if (hasChanged(value, oldValue)) {
    trigger$1(target2, "set", key, value);
  }
  return this;
}
function deleteEntry(key) {
  const target2 = toRaw(this);
  const { has: has2, get: get2 } = getProto(target2);
  let hadKey = has2.call(target2, key);
  if (!hadKey) {
    key = toRaw(key);
    hadKey = has2.call(target2, key);
  }
  get2 ? get2.call(target2, key) : void 0;
  const result = target2.delete(key);
  if (hadKey) {
    trigger$1(target2, "delete", key, void 0);
  }
  return result;
}
function clear() {
  const target2 = toRaw(this);
  const hadItems = target2.size !== 0;
  const result = target2.clear();
  if (hadItems) {
    trigger$1(target2, "clear", void 0, void 0);
  }
  return result;
}
function createForEach(isReadonly2, isShallow2) {
  return function forEach(callback, thisArg) {
    const observed = this;
    const target2 = observed["__v_raw"];
    const rawTarget = toRaw(target2);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", ITERATE_KEY);
    return target2.forEach((value, key) => {
      return callback.call(thisArg, wrap(value), wrap(key), observed);
    });
  };
}
function createIterableMethod(method, isReadonly2, isShallow2) {
  return function(...args) {
    const target2 = this["__v_raw"];
    const rawTarget = toRaw(target2);
    const targetIsMap = isMap(rawTarget);
    const isPair = method === "entries" || method === Symbol.iterator && targetIsMap;
    const isKeyOnly = method === "keys" && targetIsMap;
    const innerIterator = target2[method](...args);
    const wrap = isShallow2 ? toShallow : isReadonly2 ? toReadonly : toReactive;
    !isReadonly2 && track(rawTarget, "iterate", isKeyOnly ? MAP_KEY_ITERATE_KEY : ITERATE_KEY);
    return {
      next() {
        const { value, done } = innerIterator.next();
        return done ? { value, done } : {
          value: isPair ? [wrap(value[0]), wrap(value[1])] : wrap(value),
          done
        };
      },
      [Symbol.iterator]() {
        return this;
      }
    };
  };
}
function createReadonlyMethod(type2) {
  return function(...args) {
    return type2 === "delete" ? false : this;
  };
}
function createInstrumentations() {
  const mutableInstrumentations2 = {
    get(key) {
      return get$1(this, key);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, false)
  };
  const shallowInstrumentations2 = {
    get(key) {
      return get$1(this, key, false, true);
    },
    get size() {
      return size(this);
    },
    has: has$1,
    add,
    set: set$1,
    delete: deleteEntry,
    clear,
    forEach: createForEach(false, true)
  };
  const readonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, false)
  };
  const shallowReadonlyInstrumentations2 = {
    get(key) {
      return get$1(this, key, true, true);
    },
    get size() {
      return size(this, true);
    },
    has(key) {
      return has$1.call(this, key, true);
    },
    add: createReadonlyMethod("add"),
    set: createReadonlyMethod("set"),
    delete: createReadonlyMethod("delete"),
    clear: createReadonlyMethod("clear"),
    forEach: createForEach(true, true)
  };
  const iteratorMethods = ["keys", "values", "entries", Symbol.iterator];
  iteratorMethods.forEach((method) => {
    mutableInstrumentations2[method] = createIterableMethod(method, false, false);
    readonlyInstrumentations2[method] = createIterableMethod(method, true, false);
    shallowInstrumentations2[method] = createIterableMethod(method, false, true);
    shallowReadonlyInstrumentations2[method] = createIterableMethod(method, true, true);
  });
  return [
    mutableInstrumentations2,
    readonlyInstrumentations2,
    shallowInstrumentations2,
    shallowReadonlyInstrumentations2
  ];
}
const [mutableInstrumentations, readonlyInstrumentations, shallowInstrumentations, shallowReadonlyInstrumentations] = /* @__PURE__ */ createInstrumentations();
function createInstrumentationGetter(isReadonly2, shallow) {
  const instrumentations = shallow ? isReadonly2 ? shallowReadonlyInstrumentations : shallowInstrumentations : isReadonly2 ? readonlyInstrumentations : mutableInstrumentations;
  return (target2, key, receiver) => {
    if (key === "__v_isReactive") {
      return !isReadonly2;
    } else if (key === "__v_isReadonly") {
      return isReadonly2;
    } else if (key === "__v_raw") {
      return target2;
    }
    return Reflect.get(hasOwn(instrumentations, key) && key in target2 ? instrumentations : target2, key, receiver);
  };
}
const mutableCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, false)
};
const shallowCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(false, true)
};
const readonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, false)
};
const shallowReadonlyCollectionHandlers = {
  get: /* @__PURE__ */ createInstrumentationGetter(true, true)
};
const reactiveMap = new WeakMap();
const shallowReactiveMap = new WeakMap();
const readonlyMap = new WeakMap();
const shallowReadonlyMap = new WeakMap();
function targetTypeMap(rawType) {
  switch (rawType) {
    case "Object":
    case "Array":
      return 1;
    case "Map":
    case "Set":
    case "WeakMap":
    case "WeakSet":
      return 2;
    default:
      return 0;
  }
}
function getTargetType(value) {
  return value["__v_skip"] || !Object.isExtensible(value) ? 0 : targetTypeMap(toRawType(value));
}
function reactive$1(target2) {
  if (isReadonly(target2)) {
    return target2;
  }
  return createReactiveObject(target2, false, mutableHandlers, mutableCollectionHandlers, reactiveMap);
}
function shallowReactive(target2) {
  return createReactiveObject(target2, false, shallowReactiveHandlers, shallowCollectionHandlers, shallowReactiveMap);
}
function readonly(target2) {
  return createReactiveObject(target2, true, readonlyHandlers, readonlyCollectionHandlers, readonlyMap);
}
function shallowReadonly(target2) {
  return createReactiveObject(target2, true, shallowReadonlyHandlers, shallowReadonlyCollectionHandlers, shallowReadonlyMap);
}
function createReactiveObject(target2, isReadonly2, baseHandlers, collectionHandlers, proxyMap) {
  if (!isObject(target2)) {
    return target2;
  }
  if (target2["__v_raw"] && !(isReadonly2 && target2["__v_isReactive"])) {
    return target2;
  }
  const existingProxy = proxyMap.get(target2);
  if (existingProxy) {
    return existingProxy;
  }
  const targetType = getTargetType(target2);
  if (targetType === 0) {
    return target2;
  }
  const proxy = new Proxy(target2, targetType === 2 ? collectionHandlers : baseHandlers);
  proxyMap.set(target2, proxy);
  return proxy;
}
function isReactive(value) {
  if (isReadonly(value)) {
    return isReactive(value["__v_raw"]);
  }
  return !!(value && value["__v_isReactive"]);
}
function isReadonly(value) {
  return !!(value && value["__v_isReadonly"]);
}
function isShallow(value) {
  return !!(value && value["__v_isShallow"]);
}
function isProxy(value) {
  return isReactive(value) || isReadonly(value);
}
function toRaw(observed) {
  const raw = observed && observed["__v_raw"];
  return raw ? toRaw(raw) : observed;
}
function markRaw(value) {
  def(value, "__v_skip", true);
  return value;
}
const toReactive = (value) => isObject(value) ? reactive$1(value) : value;
const toReadonly = (value) => isObject(value) ? readonly(value) : value;
function trackRefValue(ref2) {
  if (isTracking()) {
    ref2 = toRaw(ref2);
    if (!ref2.dep) {
      ref2.dep = createDep();
    }
    {
      trackEffects(ref2.dep);
    }
  }
}
function triggerRefValue(ref2, newVal) {
  ref2 = toRaw(ref2);
  if (ref2.dep) {
    {
      triggerEffects(ref2.dep);
    }
  }
}
function isRef(r) {
  return Boolean(r && r.__v_isRef === true);
}
function ref(value) {
  return createRef(value, false);
}
function shallowRef(value) {
  return createRef(value, true);
}
function createRef(rawValue, shallow) {
  if (isRef(rawValue)) {
    return rawValue;
  }
  return new RefImpl(rawValue, shallow);
}
class RefImpl {
  constructor(value, __v_isShallow) {
    this.__v_isShallow = __v_isShallow;
    this.dep = void 0;
    this.__v_isRef = true;
    this._rawValue = __v_isShallow ? value : toRaw(value);
    this._value = __v_isShallow ? value : toReactive(value);
  }
  get value() {
    trackRefValue(this);
    return this._value;
  }
  set value(newVal) {
    newVal = this.__v_isShallow ? newVal : toRaw(newVal);
    if (hasChanged(newVal, this._rawValue)) {
      this._rawValue = newVal;
      this._value = this.__v_isShallow ? newVal : toReactive(newVal);
      triggerRefValue(this);
    }
  }
}
function triggerRef(ref2) {
  triggerRefValue(ref2);
}
function unref(ref2) {
  return isRef(ref2) ? ref2.value : ref2;
}
const shallowUnwrapHandlers = {
  get: (target2, key, receiver) => unref(Reflect.get(target2, key, receiver)),
  set: (target2, key, value, receiver) => {
    const oldValue = target2[key];
    if (isRef(oldValue) && !isRef(value)) {
      oldValue.value = value;
      return true;
    } else {
      return Reflect.set(target2, key, value, receiver);
    }
  }
};
function proxyRefs(objectWithRefs) {
  return isReactive(objectWithRefs) ? objectWithRefs : new Proxy(objectWithRefs, shallowUnwrapHandlers);
}
class CustomRefImpl {
  constructor(factory) {
    this.dep = void 0;
    this.__v_isRef = true;
    const { get: get2, set: set2 } = factory(() => trackRefValue(this), () => triggerRefValue(this));
    this._get = get2;
    this._set = set2;
  }
  get value() {
    return this._get();
  }
  set value(newVal) {
    this._set(newVal);
  }
}
function customRef(factory) {
  return new CustomRefImpl(factory);
}
function toRefs(object) {
  const ret = isArray(object) ? new Array(object.length) : {};
  for (const key in object) {
    ret[key] = toRef(object, key);
  }
  return ret;
}
class ObjectRefImpl {
  constructor(_object, _key, _defaultValue) {
    this._object = _object;
    this._key = _key;
    this._defaultValue = _defaultValue;
    this.__v_isRef = true;
  }
  get value() {
    const val = this._object[this._key];
    return val === void 0 ? this._defaultValue : val;
  }
  set value(newVal) {
    this._object[this._key] = newVal;
  }
}
function toRef(object, key, defaultValue) {
  const val = object[key];
  return isRef(val) ? val : new ObjectRefImpl(object, key, defaultValue);
}
class ComputedRefImpl {
  constructor(getter, _setter, isReadonly2, isSSR) {
    this._setter = _setter;
    this.dep = void 0;
    this.__v_isRef = true;
    this._dirty = true;
    this.effect = new ReactiveEffect(getter, () => {
      if (!this._dirty) {
        this._dirty = true;
        triggerRefValue(this);
      }
    });
    this.effect.computed = this;
    this.effect.active = this._cacheable = !isSSR;
    this["__v_isReadonly"] = isReadonly2;
  }
  get value() {
    const self2 = toRaw(this);
    trackRefValue(self2);
    if (self2._dirty || !self2._cacheable) {
      self2._dirty = false;
      self2._value = self2.effect.run();
    }
    return self2._value;
  }
  set value(newValue) {
    this._setter(newValue);
  }
}
function computed$1(getterOrOptions, debugOptions, isSSR = false) {
  let getter;
  let setter;
  const onlyGetter = isFunction$1(getterOrOptions);
  if (onlyGetter) {
    getter = getterOrOptions;
    setter = NOOP;
  } else {
    getter = getterOrOptions.get;
    setter = getterOrOptions.set;
  }
  const cRef = new ComputedRefImpl(getter, setter, onlyGetter || !setter, isSSR);
  return cRef;
}
Promise.resolve();
const stack = [];
function warn(msg, ...args) {
  pauseTracking();
  const instance = stack.length ? stack[stack.length - 1].component : null;
  const appWarnHandler = instance && instance.appContext.config.warnHandler;
  const trace = getComponentTrace();
  if (appWarnHandler) {
    callWithErrorHandling(appWarnHandler, instance, 11, [
      msg + args.join(""),
      instance && instance.proxy,
      trace.map(({ vnode }) => `at <${formatComponentName(instance, vnode.type)}>`).join("\n"),
      trace
    ]);
  } else {
    const warnArgs = [`[Vue warn]: ${msg}`, ...args];
    if (trace.length && true) {
      warnArgs.push(`
`, ...formatTrace(trace));
    }
    console.warn(...warnArgs);
  }
  resetTracking();
}
function getComponentTrace() {
  let currentVNode = stack[stack.length - 1];
  if (!currentVNode) {
    return [];
  }
  const normalizedStack = [];
  while (currentVNode) {
    const last = normalizedStack[0];
    if (last && last.vnode === currentVNode) {
      last.recurseCount++;
    } else {
      normalizedStack.push({
        vnode: currentVNode,
        recurseCount: 0
      });
    }
    const parentInstance = currentVNode.component && currentVNode.component.parent;
    currentVNode = parentInstance && parentInstance.vnode;
  }
  return normalizedStack;
}
function formatTrace(trace) {
  const logs = [];
  trace.forEach((entry, i) => {
    logs.push(...i === 0 ? [] : [`
`], ...formatTraceEntry(entry));
  });
  return logs;
}
function formatTraceEntry({ vnode, recurseCount }) {
  const postfix = recurseCount > 0 ? `... (${recurseCount} recursive calls)` : ``;
  const isRoot = vnode.component ? vnode.component.parent == null : false;
  const open = ` at <${formatComponentName(vnode.component, vnode.type, isRoot)}`;
  const close = `>` + postfix;
  return vnode.props ? [open, ...formatProps(vnode.props), close] : [open + close];
}
function formatProps(props) {
  const res = [];
  const keys = Object.keys(props);
  keys.slice(0, 3).forEach((key) => {
    res.push(...formatProp(key, props[key]));
  });
  if (keys.length > 3) {
    res.push(` ...`);
  }
  return res;
}
function formatProp(key, value, raw) {
  if (isString(value)) {
    value = JSON.stringify(value);
    return raw ? value : [`${key}=${value}`];
  } else if (typeof value === "number" || typeof value === "boolean" || value == null) {
    return raw ? value : [`${key}=${value}`];
  } else if (isRef(value)) {
    value = formatProp(key, toRaw(value.value), true);
    return raw ? value : [`${key}=Ref<`, value, `>`];
  } else if (isFunction$1(value)) {
    return [`${key}=fn${value.name ? `<${value.name}>` : ``}`];
  } else {
    value = toRaw(value);
    return raw ? value : [`${key}=`, value];
  }
}
function callWithErrorHandling(fn2, instance, type2, args) {
  let res;
  try {
    res = args ? fn2(...args) : fn2();
  } catch (err) {
    handleError(err, instance, type2);
  }
  return res;
}
function callWithAsyncErrorHandling(fn2, instance, type2, args) {
  if (isFunction$1(fn2)) {
    const res = callWithErrorHandling(fn2, instance, type2, args);
    if (res && isPromise(res)) {
      res.catch((err) => {
        handleError(err, instance, type2);
      });
    }
    return res;
  }
  const values = [];
  for (let i = 0; i < fn2.length; i++) {
    values.push(callWithAsyncErrorHandling(fn2[i], instance, type2, args));
  }
  return values;
}
function handleError(err, instance, type2, throwInDev = true) {
  const contextVNode = instance ? instance.vnode : null;
  if (instance) {
    let cur = instance.parent;
    const exposedInstance = instance.proxy;
    const errorInfo = type2;
    while (cur) {
      const errorCapturedHooks = cur.ec;
      if (errorCapturedHooks) {
        for (let i = 0; i < errorCapturedHooks.length; i++) {
          if (errorCapturedHooks[i](err, exposedInstance, errorInfo) === false) {
            return;
          }
        }
      }
      cur = cur.parent;
    }
    const appErrorHandler = instance.appContext.config.errorHandler;
    if (appErrorHandler) {
      callWithErrorHandling(appErrorHandler, null, 10, [err, exposedInstance, errorInfo]);
      return;
    }
  }
  logError(err, type2, contextVNode, throwInDev);
}
function logError(err, type2, contextVNode, throwInDev = true) {
  {
    console.error(err);
  }
}
let isFlushing = false;
let isFlushPending = false;
const queue = [];
let flushIndex = 0;
const pendingPreFlushCbs = [];
let activePreFlushCbs = null;
let preFlushIndex = 0;
const pendingPostFlushCbs = [];
let activePostFlushCbs = null;
let postFlushIndex = 0;
const resolvedPromise = Promise.resolve();
let currentFlushPromise = null;
let currentPreFlushParentJob = null;
function nextTick(fn2) {
  const p2 = currentFlushPromise || resolvedPromise;
  return fn2 ? p2.then(this ? fn2.bind(this) : fn2) : p2;
}
function findInsertionIndex(id) {
  let start2 = flushIndex + 1;
  let end2 = queue.length;
  while (start2 < end2) {
    const middle = start2 + end2 >>> 1;
    const middleJobId = getId(queue[middle]);
    middleJobId < id ? start2 = middle + 1 : end2 = middle;
  }
  return start2;
}
function queueJob(job) {
  if ((!queue.length || !queue.includes(job, isFlushing && job.allowRecurse ? flushIndex + 1 : flushIndex)) && job !== currentPreFlushParentJob) {
    if (job.id == null) {
      queue.push(job);
    } else {
      queue.splice(findInsertionIndex(job.id), 0, job);
    }
    queueFlush();
  }
}
function queueFlush() {
  if (!isFlushing && !isFlushPending) {
    isFlushPending = true;
    currentFlushPromise = resolvedPromise.then(flushJobs);
  }
}
function invalidateJob(job) {
  const i = queue.indexOf(job);
  if (i > flushIndex) {
    queue.splice(i, 1);
  }
}
function queueCb(cb, activeQueue, pendingQueue, index2) {
  if (!isArray(cb)) {
    if (!activeQueue || !activeQueue.includes(cb, cb.allowRecurse ? index2 + 1 : index2)) {
      pendingQueue.push(cb);
    }
  } else {
    pendingQueue.push(...cb);
  }
  queueFlush();
}
function queuePreFlushCb(cb) {
  queueCb(cb, activePreFlushCbs, pendingPreFlushCbs, preFlushIndex);
}
function queuePostFlushCb(cb) {
  queueCb(cb, activePostFlushCbs, pendingPostFlushCbs, postFlushIndex);
}
function flushPreFlushCbs(seen, parentJob = null) {
  if (pendingPreFlushCbs.length) {
    currentPreFlushParentJob = parentJob;
    activePreFlushCbs = [...new Set(pendingPreFlushCbs)];
    pendingPreFlushCbs.length = 0;
    for (preFlushIndex = 0; preFlushIndex < activePreFlushCbs.length; preFlushIndex++) {
      activePreFlushCbs[preFlushIndex]();
    }
    activePreFlushCbs = null;
    preFlushIndex = 0;
    currentPreFlushParentJob = null;
    flushPreFlushCbs(seen, parentJob);
  }
}
function flushPostFlushCbs(seen) {
  if (pendingPostFlushCbs.length) {
    const deduped = [...new Set(pendingPostFlushCbs)];
    pendingPostFlushCbs.length = 0;
    if (activePostFlushCbs) {
      activePostFlushCbs.push(...deduped);
      return;
    }
    activePostFlushCbs = deduped;
    activePostFlushCbs.sort((a, b) => getId(a) - getId(b));
    for (postFlushIndex = 0; postFlushIndex < activePostFlushCbs.length; postFlushIndex++) {
      activePostFlushCbs[postFlushIndex]();
    }
    activePostFlushCbs = null;
    postFlushIndex = 0;
  }
}
const getId = (job) => job.id == null ? Infinity : job.id;
function flushJobs(seen) {
  isFlushPending = false;
  isFlushing = true;
  flushPreFlushCbs(seen);
  queue.sort((a, b) => getId(a) - getId(b));
  const check2 = NOOP;
  try {
    for (flushIndex = 0; flushIndex < queue.length; flushIndex++) {
      const job = queue[flushIndex];
      if (job && job.active !== false) {
        if (false)
          ;
        callWithErrorHandling(job, null, 14);
      }
    }
  } finally {
    flushIndex = 0;
    queue.length = 0;
    flushPostFlushCbs();
    isFlushing = false;
    currentFlushPromise = null;
    if (queue.length || pendingPreFlushCbs.length || pendingPostFlushCbs.length) {
      flushJobs(seen);
    }
  }
}
let devtools;
let buffer = [];
function setDevtoolsHook(hook, target2) {
  var _a, _b;
  devtools = hook;
  if (devtools) {
    devtools.enabled = true;
    buffer.forEach(({ event, args }) => devtools.emit(event, ...args));
    buffer = [];
  } else if (typeof window !== "undefined" && window.HTMLElement && !((_b = (_a = window.navigator) === null || _a === void 0 ? void 0 : _a.userAgent) === null || _b === void 0 ? void 0 : _b.includes("jsdom"))) {
    const replay = target2.__VUE_DEVTOOLS_HOOK_REPLAY__ = target2.__VUE_DEVTOOLS_HOOK_REPLAY__ || [];
    replay.push((newHook) => {
      setDevtoolsHook(newHook, target2);
    });
    setTimeout(() => {
      if (!devtools) {
        target2.__VUE_DEVTOOLS_HOOK_REPLAY__ = null;
        buffer = [];
      }
    }, 3e3);
  } else {
    buffer = [];
  }
}
function emit$1(instance, event, ...rawArgs) {
  const props = instance.vnode.props || EMPTY_OBJ;
  let args = rawArgs;
  const isModelListener2 = event.startsWith("update:");
  const modelArg = isModelListener2 && event.slice(7);
  if (modelArg && modelArg in props) {
    const modifiersKey = `${modelArg === "modelValue" ? "model" : modelArg}Modifiers`;
    const { number: number2, trim: trim2 } = props[modifiersKey] || EMPTY_OBJ;
    if (trim2) {
      args = rawArgs.map((a) => a.trim());
    } else if (number2) {
      args = rawArgs.map(toNumber);
    }
  }
  let handlerName;
  let handler = props[handlerName = toHandlerKey(event)] || props[handlerName = toHandlerKey(camelize(event))];
  if (!handler && isModelListener2) {
    handler = props[handlerName = toHandlerKey(hyphenate(event))];
  }
  if (handler) {
    callWithAsyncErrorHandling(handler, instance, 6, args);
  }
  const onceHandler = props[handlerName + `Once`];
  if (onceHandler) {
    if (!instance.emitted) {
      instance.emitted = {};
    } else if (instance.emitted[handlerName]) {
      return;
    }
    instance.emitted[handlerName] = true;
    callWithAsyncErrorHandling(onceHandler, instance, 6, args);
  }
}
function normalizeEmitsOptions(comp2, appContext, asMixin = false) {
  const cache = appContext.emitsCache;
  const cached = cache.get(comp2);
  if (cached !== void 0) {
    return cached;
  }
  const raw = comp2.emits;
  let normalized = {};
  let hasExtends = false;
  if (!isFunction$1(comp2)) {
    const extendEmits = (raw2) => {
      const normalizedFromExtend = normalizeEmitsOptions(raw2, appContext, true);
      if (normalizedFromExtend) {
        hasExtends = true;
        extend(normalized, normalizedFromExtend);
      }
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendEmits);
    }
    if (comp2.extends) {
      extendEmits(comp2.extends);
    }
    if (comp2.mixins) {
      comp2.mixins.forEach(extendEmits);
    }
  }
  if (!raw && !hasExtends) {
    cache.set(comp2, null);
    return null;
  }
  if (isArray(raw)) {
    raw.forEach((key) => normalized[key] = null);
  } else {
    extend(normalized, raw);
  }
  cache.set(comp2, normalized);
  return normalized;
}
function isEmitListener(options, key) {
  if (!options || !isOn(key)) {
    return false;
  }
  key = key.slice(2).replace(/Once$/, "");
  return hasOwn(options, key[0].toLowerCase() + key.slice(1)) || hasOwn(options, hyphenate(key)) || hasOwn(options, key);
}
let currentRenderingInstance = null;
let currentScopeId = null;
function setCurrentRenderingInstance(instance) {
  const prev = currentRenderingInstance;
  currentRenderingInstance = instance;
  currentScopeId = instance && instance.type.__scopeId || null;
  return prev;
}
function pushScopeId(id) {
  currentScopeId = id;
}
function popScopeId() {
  currentScopeId = null;
}
const withScopeId = (_id) => withCtx;
function withCtx(fn2, ctx = currentRenderingInstance, isNonScopedSlot) {
  if (!ctx)
    return fn2;
  if (fn2._n) {
    return fn2;
  }
  const renderFnWithContext = (...args) => {
    if (renderFnWithContext._d) {
      setBlockTracking(-1);
    }
    const prevInstance = setCurrentRenderingInstance(ctx);
    const res = fn2(...args);
    setCurrentRenderingInstance(prevInstance);
    if (renderFnWithContext._d) {
      setBlockTracking(1);
    }
    return res;
  };
  renderFnWithContext._n = true;
  renderFnWithContext._c = true;
  renderFnWithContext._d = true;
  return renderFnWithContext;
}
function markAttrsAccessed() {
}
function renderComponentRoot(instance) {
  const { type: Component, vnode, proxy, withProxy, props, propsOptions: [propsOptions], slots, attrs, emit, render: render2, renderCache, data, setupState, ctx, inheritAttrs } = instance;
  let result;
  let fallthroughAttrs;
  const prev = setCurrentRenderingInstance(instance);
  try {
    if (vnode.shapeFlag & 4) {
      const proxyToUse = withProxy || proxy;
      result = normalizeVNode(render2.call(proxyToUse, proxyToUse, renderCache, props, setupState, data, ctx));
      fallthroughAttrs = attrs;
    } else {
      const render3 = Component;
      if (false)
        ;
      result = normalizeVNode(render3.length > 1 ? render3(props, false ? {
        get attrs() {
          markAttrsAccessed();
          return attrs;
        },
        slots,
        emit
      } : { attrs, slots, emit }) : render3(props, null));
      fallthroughAttrs = Component.props ? attrs : getFunctionalFallthrough(attrs);
    }
  } catch (err) {
    blockStack.length = 0;
    handleError(err, instance, 1);
    result = createVNode(Comment$1);
  }
  let root = result;
  if (fallthroughAttrs && inheritAttrs !== false) {
    const keys = Object.keys(fallthroughAttrs);
    const { shapeFlag } = root;
    if (keys.length) {
      if (shapeFlag & (1 | 6)) {
        if (propsOptions && keys.some(isModelListener)) {
          fallthroughAttrs = filterModelListeners(fallthroughAttrs, propsOptions);
        }
        root = cloneVNode(root, fallthroughAttrs);
      }
    }
  }
  if (vnode.dirs) {
    root.dirs = root.dirs ? root.dirs.concat(vnode.dirs) : vnode.dirs;
  }
  if (vnode.transition) {
    root.transition = vnode.transition;
  }
  {
    result = root;
  }
  setCurrentRenderingInstance(prev);
  return result;
}
function filterSingleRoot(children) {
  let singleRoot;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (isVNode(child)) {
      if (child.type !== Comment$1 || child.children === "v-if") {
        if (singleRoot) {
          return;
        } else {
          singleRoot = child;
        }
      }
    } else {
      return;
    }
  }
  return singleRoot;
}
const getFunctionalFallthrough = (attrs) => {
  let res;
  for (const key in attrs) {
    if (key === "class" || key === "style" || isOn(key)) {
      (res || (res = {}))[key] = attrs[key];
    }
  }
  return res;
};
const filterModelListeners = (attrs, props) => {
  const res = {};
  for (const key in attrs) {
    if (!isModelListener(key) || !(key.slice(9) in props)) {
      res[key] = attrs[key];
    }
  }
  return res;
};
function shouldUpdateComponent(prevVNode, nextVNode, optimized) {
  const { props: prevProps, children: prevChildren, component } = prevVNode;
  const { props: nextProps, children: nextChildren, patchFlag } = nextVNode;
  const emits = component.emitsOptions;
  if (nextVNode.dirs || nextVNode.transition) {
    return true;
  }
  if (optimized && patchFlag >= 0) {
    if (patchFlag & 1024) {
      return true;
    }
    if (patchFlag & 16) {
      if (!prevProps) {
        return !!nextProps;
      }
      return hasPropsChanged(prevProps, nextProps, emits);
    } else if (patchFlag & 8) {
      const dynamicProps = nextVNode.dynamicProps;
      for (let i = 0; i < dynamicProps.length; i++) {
        const key = dynamicProps[i];
        if (nextProps[key] !== prevProps[key] && !isEmitListener(emits, key)) {
          return true;
        }
      }
    }
  } else {
    if (prevChildren || nextChildren) {
      if (!nextChildren || !nextChildren.$stable) {
        return true;
      }
    }
    if (prevProps === nextProps) {
      return false;
    }
    if (!prevProps) {
      return !!nextProps;
    }
    if (!nextProps) {
      return true;
    }
    return hasPropsChanged(prevProps, nextProps, emits);
  }
  return false;
}
function hasPropsChanged(prevProps, nextProps, emitsOptions) {
  const nextKeys = Object.keys(nextProps);
  if (nextKeys.length !== Object.keys(prevProps).length) {
    return true;
  }
  for (let i = 0; i < nextKeys.length; i++) {
    const key = nextKeys[i];
    if (nextProps[key] !== prevProps[key] && !isEmitListener(emitsOptions, key)) {
      return true;
    }
  }
  return false;
}
function updateHOCHostEl({ vnode, parent }, el2) {
  while (parent && parent.subTree === vnode) {
    (vnode = parent.vnode).el = el2;
    parent = parent.parent;
  }
}
const isSuspense = (type2) => type2.__isSuspense;
const SuspenseImpl = {
  name: "Suspense",
  __isSuspense: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals) {
    if (n1 == null) {
      mountSuspense(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals);
    } else {
      patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, slotScopeIds, optimized, rendererInternals);
    }
  },
  hydrate: hydrateSuspense,
  create: createSuspenseBoundary,
  normalize: normalizeSuspenseChildren
};
const Suspense = SuspenseImpl;
function triggerEvent(vnode, name) {
  const eventListener = vnode.props && vnode.props[name];
  if (isFunction$1(eventListener)) {
    eventListener();
  }
}
function mountSuspense(vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals) {
  const { p: patch, o: { createElement: createElement2 } } = rendererInternals;
  const hiddenContainer = createElement2("div");
  const suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, container, hiddenContainer, anchor, isSVG, slotScopeIds, optimized, rendererInternals);
  patch(null, suspense.pendingBranch = vnode.ssContent, hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds);
  if (suspense.deps > 0) {
    triggerEvent(vnode, "onPending");
    triggerEvent(vnode, "onFallback");
    patch(null, vnode.ssFallback, container, anchor, parentComponent, null, isSVG, slotScopeIds);
    setActiveBranch(suspense, vnode.ssFallback);
  } else {
    suspense.resolve();
  }
}
function patchSuspense(n1, n2, container, anchor, parentComponent, isSVG, slotScopeIds, optimized, { p: patch, um: unmount, o: { createElement: createElement2 } }) {
  const suspense = n2.suspense = n1.suspense;
  suspense.vnode = n2;
  n2.el = n1.el;
  const newBranch = n2.ssContent;
  const newFallback = n2.ssFallback;
  const { activeBranch, pendingBranch, isInFallback, isHydrating } = suspense;
  if (pendingBranch) {
    suspense.pendingBranch = newBranch;
    if (isSameVNodeType(newBranch, pendingBranch)) {
      patch(pendingBranch, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);
      if (suspense.deps <= 0) {
        suspense.resolve();
      } else if (isInFallback) {
        patch(activeBranch, newFallback, container, anchor, parentComponent, null, isSVG, slotScopeIds, optimized);
        setActiveBranch(suspense, newFallback);
      }
    } else {
      suspense.pendingId++;
      if (isHydrating) {
        suspense.isHydrating = false;
        suspense.activeBranch = pendingBranch;
      } else {
        unmount(pendingBranch, parentComponent, suspense);
      }
      suspense.deps = 0;
      suspense.effects.length = 0;
      suspense.hiddenContainer = createElement2("div");
      if (isInFallback) {
        patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);
        if (suspense.deps <= 0) {
          suspense.resolve();
        } else {
          patch(activeBranch, newFallback, container, anchor, parentComponent, null, isSVG, slotScopeIds, optimized);
          setActiveBranch(suspense, newFallback);
        }
      } else if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
        patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, isSVG, slotScopeIds, optimized);
        suspense.resolve(true);
      } else {
        patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);
        if (suspense.deps <= 0) {
          suspense.resolve();
        }
      }
    }
  } else {
    if (activeBranch && isSameVNodeType(newBranch, activeBranch)) {
      patch(activeBranch, newBranch, container, anchor, parentComponent, suspense, isSVG, slotScopeIds, optimized);
      setActiveBranch(suspense, newBranch);
    } else {
      triggerEvent(n2, "onPending");
      suspense.pendingBranch = newBranch;
      suspense.pendingId++;
      patch(null, newBranch, suspense.hiddenContainer, null, parentComponent, suspense, isSVG, slotScopeIds, optimized);
      if (suspense.deps <= 0) {
        suspense.resolve();
      } else {
        const { timeout, pendingId } = suspense;
        if (timeout > 0) {
          setTimeout(() => {
            if (suspense.pendingId === pendingId) {
              suspense.fallback(newFallback);
            }
          }, timeout);
        } else if (timeout === 0) {
          suspense.fallback(newFallback);
        }
      }
    }
  }
}
function createSuspenseBoundary(vnode, parent, parentComponent, container, hiddenContainer, anchor, isSVG, slotScopeIds, optimized, rendererInternals, isHydrating = false) {
  const { p: patch, m: move, um: unmount, n: next, o: { parentNode, remove: remove2 } } = rendererInternals;
  const timeout = toNumber(vnode.props && vnode.props.timeout);
  const suspense = {
    vnode,
    parent,
    parentComponent,
    isSVG,
    container,
    hiddenContainer,
    anchor,
    deps: 0,
    pendingId: 0,
    timeout: typeof timeout === "number" ? timeout : -1,
    activeBranch: null,
    pendingBranch: null,
    isInFallback: true,
    isHydrating,
    isUnmounted: false,
    effects: [],
    resolve(resume = false) {
      const { vnode: vnode2, activeBranch, pendingBranch, pendingId, effects, parentComponent: parentComponent2, container: container2 } = suspense;
      if (suspense.isHydrating) {
        suspense.isHydrating = false;
      } else if (!resume) {
        const delayEnter = activeBranch && pendingBranch.transition && pendingBranch.transition.mode === "out-in";
        if (delayEnter) {
          activeBranch.transition.afterLeave = () => {
            if (pendingId === suspense.pendingId) {
              move(pendingBranch, container2, anchor2, 0);
            }
          };
        }
        let { anchor: anchor2 } = suspense;
        if (activeBranch) {
          anchor2 = next(activeBranch);
          unmount(activeBranch, parentComponent2, suspense, true);
        }
        if (!delayEnter) {
          move(pendingBranch, container2, anchor2, 0);
        }
      }
      setActiveBranch(suspense, pendingBranch);
      suspense.pendingBranch = null;
      suspense.isInFallback = false;
      let parent2 = suspense.parent;
      let hasUnresolvedAncestor = false;
      while (parent2) {
        if (parent2.pendingBranch) {
          parent2.effects.push(...effects);
          hasUnresolvedAncestor = true;
          break;
        }
        parent2 = parent2.parent;
      }
      if (!hasUnresolvedAncestor) {
        queuePostFlushCb(effects);
      }
      suspense.effects = [];
      triggerEvent(vnode2, "onResolve");
    },
    fallback(fallbackVNode) {
      if (!suspense.pendingBranch) {
        return;
      }
      const { vnode: vnode2, activeBranch, parentComponent: parentComponent2, container: container2, isSVG: isSVG2 } = suspense;
      triggerEvent(vnode2, "onFallback");
      const anchor2 = next(activeBranch);
      const mountFallback = () => {
        if (!suspense.isInFallback) {
          return;
        }
        patch(null, fallbackVNode, container2, anchor2, parentComponent2, null, isSVG2, slotScopeIds, optimized);
        setActiveBranch(suspense, fallbackVNode);
      };
      const delayEnter = fallbackVNode.transition && fallbackVNode.transition.mode === "out-in";
      if (delayEnter) {
        activeBranch.transition.afterLeave = mountFallback;
      }
      suspense.isInFallback = true;
      unmount(activeBranch, parentComponent2, null, true);
      if (!delayEnter) {
        mountFallback();
      }
    },
    move(container2, anchor2, type2) {
      suspense.activeBranch && move(suspense.activeBranch, container2, anchor2, type2);
      suspense.container = container2;
    },
    next() {
      return suspense.activeBranch && next(suspense.activeBranch);
    },
    registerDep(instance, setupRenderEffect) {
      const isInPendingSuspense = !!suspense.pendingBranch;
      if (isInPendingSuspense) {
        suspense.deps++;
      }
      const hydratedEl = instance.vnode.el;
      instance.asyncDep.catch((err) => {
        handleError(err, instance, 0);
      }).then((asyncSetupResult) => {
        if (instance.isUnmounted || suspense.isUnmounted || suspense.pendingId !== instance.suspenseId) {
          return;
        }
        instance.asyncResolved = true;
        const { vnode: vnode2 } = instance;
        handleSetupResult(instance, asyncSetupResult, false);
        if (hydratedEl) {
          vnode2.el = hydratedEl;
        }
        const placeholder = !hydratedEl && instance.subTree.el;
        setupRenderEffect(instance, vnode2, parentNode(hydratedEl || instance.subTree.el), hydratedEl ? null : next(instance.subTree), suspense, isSVG, optimized);
        if (placeholder) {
          remove2(placeholder);
        }
        updateHOCHostEl(instance, vnode2.el);
        if (isInPendingSuspense && --suspense.deps === 0) {
          suspense.resolve();
        }
      });
    },
    unmount(parentSuspense, doRemove) {
      suspense.isUnmounted = true;
      if (suspense.activeBranch) {
        unmount(suspense.activeBranch, parentComponent, parentSuspense, doRemove);
      }
      if (suspense.pendingBranch) {
        unmount(suspense.pendingBranch, parentComponent, parentSuspense, doRemove);
      }
    }
  };
  return suspense;
}
function hydrateSuspense(node2, vnode, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, rendererInternals, hydrateNode) {
  const suspense = vnode.suspense = createSuspenseBoundary(vnode, parentSuspense, parentComponent, node2.parentNode, document.createElement("div"), null, isSVG, slotScopeIds, optimized, rendererInternals, true);
  const result = hydrateNode(node2, suspense.pendingBranch = vnode.ssContent, parentComponent, suspense, slotScopeIds, optimized);
  if (suspense.deps === 0) {
    suspense.resolve();
  }
  return result;
}
function normalizeSuspenseChildren(vnode) {
  const { shapeFlag, children } = vnode;
  const isSlotChildren = shapeFlag & 32;
  vnode.ssContent = normalizeSuspenseSlot(isSlotChildren ? children.default : children);
  vnode.ssFallback = isSlotChildren ? normalizeSuspenseSlot(children.fallback) : createVNode(Comment$1);
}
function normalizeSuspenseSlot(s) {
  let block2;
  if (isFunction$1(s)) {
    const trackBlock = isBlockTreeEnabled && s._c;
    if (trackBlock) {
      s._d = false;
      openBlock();
    }
    s = s();
    if (trackBlock) {
      s._d = true;
      block2 = currentBlock;
      closeBlock();
    }
  }
  if (isArray(s)) {
    const singleChild = filterSingleRoot(s);
    s = singleChild;
  }
  s = normalizeVNode(s);
  if (block2 && !s.dynamicChildren) {
    s.dynamicChildren = block2.filter((c) => c !== s);
  }
  return s;
}
function queueEffectWithSuspense(fn2, suspense) {
  if (suspense && suspense.pendingBranch) {
    if (isArray(fn2)) {
      suspense.effects.push(...fn2);
    } else {
      suspense.effects.push(fn2);
    }
  } else {
    queuePostFlushCb(fn2);
  }
}
function setActiveBranch(suspense, branch) {
  suspense.activeBranch = branch;
  const { vnode, parentComponent } = suspense;
  const el2 = vnode.el = branch.el;
  if (parentComponent && parentComponent.subTree === vnode) {
    parentComponent.vnode.el = el2;
    updateHOCHostEl(parentComponent, el2);
  }
}
function provide(key, value) {
  if (!currentInstance)
    ;
  else {
    let provides = currentInstance.provides;
    const parentProvides = currentInstance.parent && currentInstance.parent.provides;
    if (parentProvides === provides) {
      provides = currentInstance.provides = Object.create(parentProvides);
    }
    provides[key] = value;
  }
}
function inject(key, defaultValue, treatDefaultAsFactory = false) {
  const instance = currentInstance || currentRenderingInstance;
  if (instance) {
    const provides = instance.parent == null ? instance.vnode.appContext && instance.vnode.appContext.provides : instance.parent.provides;
    if (provides && key in provides) {
      return provides[key];
    } else if (arguments.length > 1) {
      return treatDefaultAsFactory && isFunction$1(defaultValue) ? defaultValue.call(instance.proxy) : defaultValue;
    } else
      ;
  }
}
function watchEffect(effect2, options) {
  return doWatch(effect2, null, options);
}
function watchPostEffect(effect2, options) {
  return doWatch(effect2, null, { flush: "post" });
}
function watchSyncEffect(effect2, options) {
  return doWatch(effect2, null, { flush: "sync" });
}
const INITIAL_WATCHER_VALUE = {};
function watch(source, cb, options) {
  return doWatch(source, cb, options);
}
function doWatch(source, cb, { immediate, deep, flush, onTrack, onTrigger } = EMPTY_OBJ) {
  const instance = currentInstance;
  let getter;
  let forceTrigger = false;
  let isMultiSource = false;
  if (isRef(source)) {
    getter = () => source.value;
    forceTrigger = isShallow(source);
  } else if (isReactive(source)) {
    getter = () => source;
    deep = true;
  } else if (isArray(source)) {
    isMultiSource = true;
    forceTrigger = source.some(isReactive);
    getter = () => source.map((s) => {
      if (isRef(s)) {
        return s.value;
      } else if (isReactive(s)) {
        return traverse(s);
      } else if (isFunction$1(s)) {
        return callWithErrorHandling(s, instance, 2);
      } else
        ;
    });
  } else if (isFunction$1(source)) {
    if (cb) {
      getter = () => callWithErrorHandling(source, instance, 2);
    } else {
      getter = () => {
        if (instance && instance.isUnmounted) {
          return;
        }
        if (cleanup) {
          cleanup();
        }
        return callWithAsyncErrorHandling(source, instance, 3, [onCleanup]);
      };
    }
  } else {
    getter = NOOP;
  }
  if (cb && deep) {
    const baseGetter = getter;
    getter = () => traverse(baseGetter());
  }
  let cleanup;
  let onCleanup = (fn2) => {
    cleanup = effect2.onStop = () => {
      callWithErrorHandling(fn2, instance, 4);
    };
  };
  if (isInSSRComponentSetup) {
    onCleanup = NOOP;
    if (!cb) {
      getter();
    } else if (immediate) {
      callWithAsyncErrorHandling(cb, instance, 3, [
        getter(),
        isMultiSource ? [] : void 0,
        onCleanup
      ]);
    }
    return NOOP;
  }
  let oldValue = isMultiSource ? [] : INITIAL_WATCHER_VALUE;
  const job = () => {
    if (!effect2.active) {
      return;
    }
    if (cb) {
      const newValue = effect2.run();
      if (deep || forceTrigger || (isMultiSource ? newValue.some((v, i) => hasChanged(v, oldValue[i])) : hasChanged(newValue, oldValue)) || false) {
        if (cleanup) {
          cleanup();
        }
        callWithAsyncErrorHandling(cb, instance, 3, [
          newValue,
          oldValue === INITIAL_WATCHER_VALUE ? void 0 : oldValue,
          onCleanup
        ]);
        oldValue = newValue;
      }
    } else {
      effect2.run();
    }
  };
  job.allowRecurse = !!cb;
  let scheduler;
  if (flush === "sync") {
    scheduler = job;
  } else if (flush === "post") {
    scheduler = () => queuePostRenderEffect(job, instance && instance.suspense);
  } else {
    scheduler = () => {
      if (!instance || instance.isMounted) {
        queuePreFlushCb(job);
      } else {
        job();
      }
    };
  }
  const effect2 = new ReactiveEffect(getter, scheduler);
  if (cb) {
    if (immediate) {
      job();
    } else {
      oldValue = effect2.run();
    }
  } else if (flush === "post") {
    queuePostRenderEffect(effect2.run.bind(effect2), instance && instance.suspense);
  } else {
    effect2.run();
  }
  return () => {
    effect2.stop();
    if (instance && instance.scope) {
      remove(instance.scope.effects, effect2);
    }
  };
}
function instanceWatch(source, value, options) {
  const publicThis = this.proxy;
  const getter = isString(source) ? source.includes(".") ? createPathGetter(publicThis, source) : () => publicThis[source] : source.bind(publicThis, publicThis);
  let cb;
  if (isFunction$1(value)) {
    cb = value;
  } else {
    cb = value.handler;
    options = value;
  }
  const cur = currentInstance;
  setCurrentInstance(this);
  const res = doWatch(getter, cb.bind(publicThis), options);
  if (cur) {
    setCurrentInstance(cur);
  } else {
    unsetCurrentInstance();
  }
  return res;
}
function createPathGetter(ctx, path) {
  const segments = path.split(".");
  return () => {
    let cur = ctx;
    for (let i = 0; i < segments.length && cur; i++) {
      cur = cur[segments[i]];
    }
    return cur;
  };
}
function traverse(value, seen) {
  if (!isObject(value) || value["__v_skip"]) {
    return value;
  }
  seen = seen || new Set();
  if (seen.has(value)) {
    return value;
  }
  seen.add(value);
  if (isRef(value)) {
    traverse(value.value, seen);
  } else if (isArray(value)) {
    for (let i = 0; i < value.length; i++) {
      traverse(value[i], seen);
    }
  } else if (isSet(value) || isMap(value)) {
    value.forEach((v) => {
      traverse(v, seen);
    });
  } else if (isPlainObject(value)) {
    for (const key in value) {
      traverse(value[key], seen);
    }
  }
  return value;
}
function useTransitionState() {
  const state = {
    isMounted: false,
    isLeaving: false,
    isUnmounting: false,
    leavingVNodes: new Map()
  };
  onMounted(() => {
    state.isMounted = true;
  });
  onBeforeUnmount(() => {
    state.isUnmounting = true;
  });
  return state;
}
const TransitionHookValidator = [Function, Array];
const BaseTransitionImpl = {
  name: `BaseTransition`,
  props: {
    mode: String,
    appear: Boolean,
    persisted: Boolean,
    onBeforeEnter: TransitionHookValidator,
    onEnter: TransitionHookValidator,
    onAfterEnter: TransitionHookValidator,
    onEnterCancelled: TransitionHookValidator,
    onBeforeLeave: TransitionHookValidator,
    onLeave: TransitionHookValidator,
    onAfterLeave: TransitionHookValidator,
    onLeaveCancelled: TransitionHookValidator,
    onBeforeAppear: TransitionHookValidator,
    onAppear: TransitionHookValidator,
    onAfterAppear: TransitionHookValidator,
    onAppearCancelled: TransitionHookValidator
  },
  setup(props, { slots }) {
    const instance = getCurrentInstance$1();
    const state = useTransitionState();
    let prevTransitionKey;
    return () => {
      const children = slots.default && getTransitionRawChildren(slots.default(), true);
      if (!children || !children.length) {
        return;
      }
      const rawProps = toRaw(props);
      const { mode } = rawProps;
      const child = children[0];
      if (state.isLeaving) {
        return emptyPlaceholder(child);
      }
      const innerChild = getKeepAliveChild(child);
      if (!innerChild) {
        return emptyPlaceholder(child);
      }
      const enterHooks = resolveTransitionHooks(innerChild, rawProps, state, instance);
      setTransitionHooks(innerChild, enterHooks);
      const oldChild = instance.subTree;
      const oldInnerChild = oldChild && getKeepAliveChild(oldChild);
      let transitionKeyChanged = false;
      const { getTransitionKey } = innerChild.type;
      if (getTransitionKey) {
        const key = getTransitionKey();
        if (prevTransitionKey === void 0) {
          prevTransitionKey = key;
        } else if (key !== prevTransitionKey) {
          prevTransitionKey = key;
          transitionKeyChanged = true;
        }
      }
      if (oldInnerChild && oldInnerChild.type !== Comment$1 && (!isSameVNodeType(innerChild, oldInnerChild) || transitionKeyChanged)) {
        const leavingHooks = resolveTransitionHooks(oldInnerChild, rawProps, state, instance);
        setTransitionHooks(oldInnerChild, leavingHooks);
        if (mode === "out-in") {
          state.isLeaving = true;
          leavingHooks.afterLeave = () => {
            state.isLeaving = false;
            instance.update();
          };
          return emptyPlaceholder(child);
        } else if (mode === "in-out" && innerChild.type !== Comment$1) {
          leavingHooks.delayLeave = (el2, earlyRemove, delayedLeave) => {
            const leavingVNodesCache = getLeavingNodesForType(state, oldInnerChild);
            leavingVNodesCache[String(oldInnerChild.key)] = oldInnerChild;
            el2._leaveCb = () => {
              earlyRemove();
              el2._leaveCb = void 0;
              delete enterHooks.delayedLeave;
            };
            enterHooks.delayedLeave = delayedLeave;
          };
        }
      }
      return child;
    };
  }
};
const BaseTransition = BaseTransitionImpl;
function getLeavingNodesForType(state, vnode) {
  const { leavingVNodes } = state;
  let leavingVNodesCache = leavingVNodes.get(vnode.type);
  if (!leavingVNodesCache) {
    leavingVNodesCache = Object.create(null);
    leavingVNodes.set(vnode.type, leavingVNodesCache);
  }
  return leavingVNodesCache;
}
function resolveTransitionHooks(vnode, props, state, instance) {
  const { appear, mode, persisted = false, onBeforeEnter, onEnter, onAfterEnter, onEnterCancelled, onBeforeLeave, onLeave, onAfterLeave, onLeaveCancelled, onBeforeAppear, onAppear, onAfterAppear, onAppearCancelled } = props;
  const key = String(vnode.key);
  const leavingVNodesCache = getLeavingNodesForType(state, vnode);
  const callHook2 = (hook, args) => {
    hook && callWithAsyncErrorHandling(hook, instance, 9, args);
  };
  const hooks = {
    mode,
    persisted,
    beforeEnter(el2) {
      let hook = onBeforeEnter;
      if (!state.isMounted) {
        if (appear) {
          hook = onBeforeAppear || onBeforeEnter;
        } else {
          return;
        }
      }
      if (el2._leaveCb) {
        el2._leaveCb(true);
      }
      const leavingVNode = leavingVNodesCache[key];
      if (leavingVNode && isSameVNodeType(vnode, leavingVNode) && leavingVNode.el._leaveCb) {
        leavingVNode.el._leaveCb();
      }
      callHook2(hook, [el2]);
    },
    enter(el2) {
      let hook = onEnter;
      let afterHook = onAfterEnter;
      let cancelHook = onEnterCancelled;
      if (!state.isMounted) {
        if (appear) {
          hook = onAppear || onEnter;
          afterHook = onAfterAppear || onAfterEnter;
          cancelHook = onAppearCancelled || onEnterCancelled;
        } else {
          return;
        }
      }
      let called = false;
      const done = el2._enterCb = (cancelled) => {
        if (called)
          return;
        called = true;
        if (cancelled) {
          callHook2(cancelHook, [el2]);
        } else {
          callHook2(afterHook, [el2]);
        }
        if (hooks.delayedLeave) {
          hooks.delayedLeave();
        }
        el2._enterCb = void 0;
      };
      if (hook) {
        hook(el2, done);
        if (hook.length <= 1) {
          done();
        }
      } else {
        done();
      }
    },
    leave(el2, remove2) {
      const key2 = String(vnode.key);
      if (el2._enterCb) {
        el2._enterCb(true);
      }
      if (state.isUnmounting) {
        return remove2();
      }
      callHook2(onBeforeLeave, [el2]);
      let called = false;
      const done = el2._leaveCb = (cancelled) => {
        if (called)
          return;
        called = true;
        remove2();
        if (cancelled) {
          callHook2(onLeaveCancelled, [el2]);
        } else {
          callHook2(onAfterLeave, [el2]);
        }
        el2._leaveCb = void 0;
        if (leavingVNodesCache[key2] === vnode) {
          delete leavingVNodesCache[key2];
        }
      };
      leavingVNodesCache[key2] = vnode;
      if (onLeave) {
        onLeave(el2, done);
        if (onLeave.length <= 1) {
          done();
        }
      } else {
        done();
      }
    },
    clone(vnode2) {
      return resolveTransitionHooks(vnode2, props, state, instance);
    }
  };
  return hooks;
}
function emptyPlaceholder(vnode) {
  if (isKeepAlive(vnode)) {
    vnode = cloneVNode(vnode);
    vnode.children = null;
    return vnode;
  }
}
function getKeepAliveChild(vnode) {
  return isKeepAlive(vnode) ? vnode.children ? vnode.children[0] : void 0 : vnode;
}
function setTransitionHooks(vnode, hooks) {
  if (vnode.shapeFlag & 6 && vnode.component) {
    setTransitionHooks(vnode.component.subTree, hooks);
  } else if (vnode.shapeFlag & 128) {
    vnode.ssContent.transition = hooks.clone(vnode.ssContent);
    vnode.ssFallback.transition = hooks.clone(vnode.ssFallback);
  } else {
    vnode.transition = hooks;
  }
}
function getTransitionRawChildren(children, keepComment = false) {
  let ret = [];
  let keyedFragmentCount = 0;
  for (let i = 0; i < children.length; i++) {
    const child = children[i];
    if (child.type === Fragment) {
      if (child.patchFlag & 128)
        keyedFragmentCount++;
      ret = ret.concat(getTransitionRawChildren(child.children, keepComment));
    } else if (keepComment || child.type !== Comment$1) {
      ret.push(child);
    }
  }
  if (keyedFragmentCount > 1) {
    for (let i = 0; i < ret.length; i++) {
      ret[i].patchFlag = -2;
    }
  }
  return ret;
}
function defineComponent(options) {
  return isFunction$1(options) ? { setup: options, name: options.name } : options;
}
const isAsyncWrapper = (i) => !!i.type.__asyncLoader;
function defineAsyncComponent(source) {
  if (isFunction$1(source)) {
    source = { loader: source };
  }
  const {
    loader,
    loadingComponent,
    errorComponent,
    delay = 200,
    timeout,
    suspensible = true,
    onError: userOnError
  } = source;
  let pendingRequest = null;
  let resolvedComp;
  let retries = 0;
  const retry = () => {
    retries++;
    pendingRequest = null;
    return load();
  };
  const load = () => {
    let thisRequest;
    return pendingRequest || (thisRequest = pendingRequest = loader().catch((err) => {
      err = err instanceof Error ? err : new Error(String(err));
      if (userOnError) {
        return new Promise((resolve2, reject) => {
          const userRetry = () => resolve2(retry());
          const userFail = () => reject(err);
          userOnError(err, userRetry, userFail, retries + 1);
        });
      } else {
        throw err;
      }
    }).then((comp2) => {
      if (thisRequest !== pendingRequest && pendingRequest) {
        return pendingRequest;
      }
      if (comp2 && (comp2.__esModule || comp2[Symbol.toStringTag] === "Module")) {
        comp2 = comp2.default;
      }
      resolvedComp = comp2;
      return comp2;
    }));
  };
  return defineComponent({
    name: "AsyncComponentWrapper",
    __asyncLoader: load,
    get __asyncResolved() {
      return resolvedComp;
    },
    setup() {
      const instance = currentInstance;
      if (resolvedComp) {
        return () => createInnerComp(resolvedComp, instance);
      }
      const onError = (err) => {
        pendingRequest = null;
        handleError(err, instance, 13, !errorComponent);
      };
      if (suspensible && instance.suspense || isInSSRComponentSetup) {
        return load().then((comp2) => {
          return () => createInnerComp(comp2, instance);
        }).catch((err) => {
          onError(err);
          return () => errorComponent ? createVNode(errorComponent, {
            error: err
          }) : null;
        });
      }
      const loaded = ref(false);
      const error = ref();
      const delayed = ref(!!delay);
      if (delay) {
        setTimeout(() => {
          delayed.value = false;
        }, delay);
      }
      if (timeout != null) {
        setTimeout(() => {
          if (!loaded.value && !error.value) {
            const err = new Error(`Async component timed out after ${timeout}ms.`);
            onError(err);
            error.value = err;
          }
        }, timeout);
      }
      load().then(() => {
        loaded.value = true;
        if (instance.parent && isKeepAlive(instance.parent.vnode)) {
          queueJob(instance.parent.update);
        }
      }).catch((err) => {
        onError(err);
        error.value = err;
      });
      return () => {
        if (loaded.value && resolvedComp) {
          return createInnerComp(resolvedComp, instance);
        } else if (error.value && errorComponent) {
          return createVNode(errorComponent, {
            error: error.value
          });
        } else if (loadingComponent && !delayed.value) {
          return createVNode(loadingComponent);
        }
      };
    }
  });
}
function createInnerComp(comp2, { vnode: { ref: ref2, props, children } }) {
  const vnode = createVNode(comp2, props, children);
  vnode.ref = ref2;
  return vnode;
}
const isKeepAlive = (vnode) => vnode.type.__isKeepAlive;
const KeepAliveImpl = {
  name: `KeepAlive`,
  __isKeepAlive: true,
  props: {
    include: [String, RegExp, Array],
    exclude: [String, RegExp, Array],
    max: [String, Number]
  },
  setup(props, { slots }) {
    const instance = getCurrentInstance$1();
    const sharedContext = instance.ctx;
    if (!sharedContext.renderer) {
      return slots.default;
    }
    const cache = new Map();
    const keys = new Set();
    let current = null;
    const parentSuspense = instance.suspense;
    const { renderer: { p: patch, m: move, um: _unmount, o: { createElement: createElement2 } } } = sharedContext;
    const storageContainer = createElement2("div");
    sharedContext.activate = (vnode, container, anchor, isSVG, optimized) => {
      const instance2 = vnode.component;
      move(vnode, container, anchor, 0, parentSuspense);
      patch(instance2.vnode, vnode, container, anchor, instance2, parentSuspense, isSVG, vnode.slotScopeIds, optimized);
      queuePostRenderEffect(() => {
        instance2.isDeactivated = false;
        if (instance2.a) {
          invokeArrayFns(instance2.a);
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeMounted;
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance2.parent, vnode);
        }
      }, parentSuspense);
    };
    sharedContext.deactivate = (vnode) => {
      const instance2 = vnode.component;
      move(vnode, storageContainer, null, 1, parentSuspense);
      queuePostRenderEffect(() => {
        if (instance2.da) {
          invokeArrayFns(instance2.da);
        }
        const vnodeHook = vnode.props && vnode.props.onVnodeUnmounted;
        if (vnodeHook) {
          invokeVNodeHook(vnodeHook, instance2.parent, vnode);
        }
        instance2.isDeactivated = true;
      }, parentSuspense);
    };
    function unmount(vnode) {
      resetShapeFlag(vnode);
      _unmount(vnode, instance, parentSuspense, true);
    }
    function pruneCache(filter2) {
      cache.forEach((vnode, key) => {
        const name = getComponentName(vnode.type);
        if (name && (!filter2 || !filter2(name))) {
          pruneCacheEntry(key);
        }
      });
    }
    function pruneCacheEntry(key) {
      const cached = cache.get(key);
      if (!current || cached.type !== current.type) {
        unmount(cached);
      } else if (current) {
        resetShapeFlag(current);
      }
      cache.delete(key);
      keys.delete(key);
    }
    watch(() => [props.include, props.exclude], ([include, exclude]) => {
      include && pruneCache((name) => matches(include, name));
      exclude && pruneCache((name) => !matches(exclude, name));
    }, { flush: "post", deep: true });
    let pendingCacheKey = null;
    const cacheSubtree = () => {
      if (pendingCacheKey != null) {
        cache.set(pendingCacheKey, getInnerChild(instance.subTree));
      }
    };
    onMounted(cacheSubtree);
    onUpdated(cacheSubtree);
    onBeforeUnmount(() => {
      cache.forEach((cached) => {
        const { subTree, suspense } = instance;
        const vnode = getInnerChild(subTree);
        if (cached.type === vnode.type) {
          resetShapeFlag(vnode);
          const da = vnode.component.da;
          da && queuePostRenderEffect(da, suspense);
          return;
        }
        unmount(cached);
      });
    });
    return () => {
      pendingCacheKey = null;
      if (!slots.default) {
        return null;
      }
      const children = slots.default();
      const rawVNode = children[0];
      if (children.length > 1) {
        current = null;
        return children;
      } else if (!isVNode(rawVNode) || !(rawVNode.shapeFlag & 4) && !(rawVNode.shapeFlag & 128)) {
        current = null;
        return rawVNode;
      }
      let vnode = getInnerChild(rawVNode);
      const comp2 = vnode.type;
      const name = getComponentName(isAsyncWrapper(vnode) ? vnode.type.__asyncResolved || {} : comp2);
      const { include, exclude, max: max2 } = props;
      if (include && (!name || !matches(include, name)) || exclude && name && matches(exclude, name)) {
        current = vnode;
        return rawVNode;
      }
      const key = vnode.key == null ? comp2 : vnode.key;
      const cachedVNode = cache.get(key);
      if (vnode.el) {
        vnode = cloneVNode(vnode);
        if (rawVNode.shapeFlag & 128) {
          rawVNode.ssContent = vnode;
        }
      }
      pendingCacheKey = key;
      if (cachedVNode) {
        vnode.el = cachedVNode.el;
        vnode.component = cachedVNode.component;
        if (vnode.transition) {
          setTransitionHooks(vnode, vnode.transition);
        }
        vnode.shapeFlag |= 512;
        keys.delete(key);
        keys.add(key);
      } else {
        keys.add(key);
        if (max2 && keys.size > parseInt(max2, 10)) {
          pruneCacheEntry(keys.values().next().value);
        }
      }
      vnode.shapeFlag |= 256;
      current = vnode;
      return rawVNode;
    };
  }
};
const KeepAlive = KeepAliveImpl;
function matches(pattern, name) {
  if (isArray(pattern)) {
    return pattern.some((p2) => matches(p2, name));
  } else if (isString(pattern)) {
    return pattern.split(",").includes(name);
  } else if (pattern.test) {
    return pattern.test(name);
  }
  return false;
}
function onActivated(hook, target2) {
  registerKeepAliveHook(hook, "a", target2);
}
function onDeactivated(hook, target2) {
  registerKeepAliveHook(hook, "da", target2);
}
function registerKeepAliveHook(hook, type2, target2 = currentInstance) {
  const wrappedHook = hook.__wdc || (hook.__wdc = () => {
    let current = target2;
    while (current) {
      if (current.isDeactivated) {
        return;
      }
      current = current.parent;
    }
    return hook();
  });
  injectHook(type2, wrappedHook, target2);
  if (target2) {
    let current = target2.parent;
    while (current && current.parent) {
      if (isKeepAlive(current.parent.vnode)) {
        injectToKeepAliveRoot(wrappedHook, type2, target2, current);
      }
      current = current.parent;
    }
  }
}
function injectToKeepAliveRoot(hook, type2, target2, keepAliveRoot) {
  const injected = injectHook(type2, hook, keepAliveRoot, true);
  onUnmounted(() => {
    remove(keepAliveRoot[type2], injected);
  }, target2);
}
function resetShapeFlag(vnode) {
  let shapeFlag = vnode.shapeFlag;
  if (shapeFlag & 256) {
    shapeFlag -= 256;
  }
  if (shapeFlag & 512) {
    shapeFlag -= 512;
  }
  vnode.shapeFlag = shapeFlag;
}
function getInnerChild(vnode) {
  return vnode.shapeFlag & 128 ? vnode.ssContent : vnode;
}
function injectHook(type2, hook, target2 = currentInstance, prepend2 = false) {
  if (target2) {
    const hooks = target2[type2] || (target2[type2] = []);
    const wrappedHook = hook.__weh || (hook.__weh = (...args) => {
      if (target2.isUnmounted) {
        return;
      }
      pauseTracking();
      setCurrentInstance(target2);
      const res = callWithAsyncErrorHandling(hook, target2, type2, args);
      unsetCurrentInstance();
      resetTracking();
      return res;
    });
    if (prepend2) {
      hooks.unshift(wrappedHook);
    } else {
      hooks.push(wrappedHook);
    }
    return wrappedHook;
  }
}
const createHook = (lifecycle) => (hook, target2 = currentInstance) => (!isInSSRComponentSetup || lifecycle === "sp") && injectHook(lifecycle, hook, target2);
const onBeforeMount = createHook("bm");
const onMounted = createHook("m");
const onBeforeUpdate = createHook("bu");
const onUpdated = createHook("u");
const onBeforeUnmount = createHook("bum");
const onUnmounted = createHook("um");
const onServerPrefetch = createHook("sp");
const onRenderTriggered = createHook("rtg");
const onRenderTracked = createHook("rtc");
function onErrorCaptured(hook, target2 = currentInstance) {
  injectHook("ec", hook, target2);
}
let shouldCacheAccess = true;
function applyOptions(instance) {
  const options = resolveMergedOptions(instance);
  const publicThis = instance.proxy;
  const ctx = instance.ctx;
  shouldCacheAccess = false;
  if (options.beforeCreate) {
    callHook$1(options.beforeCreate, instance, "bc");
  }
  const {
    data: dataOptions,
    computed: computedOptions,
    methods,
    watch: watchOptions,
    provide: provideOptions,
    inject: injectOptions,
    created,
    beforeMount,
    mounted,
    beforeUpdate,
    updated,
    activated,
    deactivated,
    beforeDestroy,
    beforeUnmount,
    destroyed,
    unmounted,
    render: render2,
    renderTracked,
    renderTriggered,
    errorCaptured,
    serverPrefetch,
    expose,
    inheritAttrs,
    components: components2,
    directives,
    filters: filters2
  } = options;
  const checkDuplicateProperties = null;
  if (injectOptions) {
    resolveInjections(injectOptions, ctx, checkDuplicateProperties, instance.appContext.config.unwrapInjectedRef);
  }
  if (methods) {
    for (const key in methods) {
      const methodHandler = methods[key];
      if (isFunction$1(methodHandler)) {
        {
          ctx[key] = methodHandler.bind(publicThis);
        }
      }
    }
  }
  if (dataOptions) {
    const data = dataOptions.call(publicThis, publicThis);
    if (!isObject(data))
      ;
    else {
      instance.data = reactive$1(data);
    }
  }
  shouldCacheAccess = true;
  if (computedOptions) {
    for (const key in computedOptions) {
      const opt = computedOptions[key];
      const get2 = isFunction$1(opt) ? opt.bind(publicThis, publicThis) : isFunction$1(opt.get) ? opt.get.bind(publicThis, publicThis) : NOOP;
      const set2 = !isFunction$1(opt) && isFunction$1(opt.set) ? opt.set.bind(publicThis) : NOOP;
      const c = computed({
        get: get2,
        set: set2
      });
      Object.defineProperty(ctx, key, {
        enumerable: true,
        configurable: true,
        get: () => c.value,
        set: (v) => c.value = v
      });
    }
  }
  if (watchOptions) {
    for (const key in watchOptions) {
      createWatcher(watchOptions[key], ctx, publicThis, key);
    }
  }
  if (provideOptions) {
    const provides = isFunction$1(provideOptions) ? provideOptions.call(publicThis) : provideOptions;
    Reflect.ownKeys(provides).forEach((key) => {
      provide(key, provides[key]);
    });
  }
  if (created) {
    callHook$1(created, instance, "c");
  }
  function registerLifecycleHook(register, hook) {
    if (isArray(hook)) {
      hook.forEach((_hook) => register(_hook.bind(publicThis)));
    } else if (hook) {
      register(hook.bind(publicThis));
    }
  }
  registerLifecycleHook(onBeforeMount, beforeMount);
  registerLifecycleHook(onMounted, mounted);
  registerLifecycleHook(onBeforeUpdate, beforeUpdate);
  registerLifecycleHook(onUpdated, updated);
  registerLifecycleHook(onActivated, activated);
  registerLifecycleHook(onDeactivated, deactivated);
  registerLifecycleHook(onErrorCaptured, errorCaptured);
  registerLifecycleHook(onRenderTracked, renderTracked);
  registerLifecycleHook(onRenderTriggered, renderTriggered);
  registerLifecycleHook(onBeforeUnmount, beforeUnmount);
  registerLifecycleHook(onUnmounted, unmounted);
  registerLifecycleHook(onServerPrefetch, serverPrefetch);
  if (isArray(expose)) {
    if (expose.length) {
      const exposed = instance.exposed || (instance.exposed = {});
      expose.forEach((key) => {
        Object.defineProperty(exposed, key, {
          get: () => publicThis[key],
          set: (val) => publicThis[key] = val
        });
      });
    } else if (!instance.exposed) {
      instance.exposed = {};
    }
  }
  if (render2 && instance.render === NOOP) {
    instance.render = render2;
  }
  if (inheritAttrs != null) {
    instance.inheritAttrs = inheritAttrs;
  }
  if (components2)
    instance.components = components2;
  if (directives)
    instance.directives = directives;
}
function resolveInjections(injectOptions, ctx, checkDuplicateProperties = NOOP, unwrapRef = false) {
  if (isArray(injectOptions)) {
    injectOptions = normalizeInject(injectOptions);
  }
  for (const key in injectOptions) {
    const opt = injectOptions[key];
    let injected;
    if (isObject(opt)) {
      if ("default" in opt) {
        injected = inject(opt.from || key, opt.default, true);
      } else {
        injected = inject(opt.from || key);
      }
    } else {
      injected = inject(opt);
    }
    if (isRef(injected)) {
      if (unwrapRef) {
        Object.defineProperty(ctx, key, {
          enumerable: true,
          configurable: true,
          get: () => injected.value,
          set: (v) => injected.value = v
        });
      } else {
        ctx[key] = injected;
      }
    } else {
      ctx[key] = injected;
    }
  }
}
function callHook$1(hook, instance, type2) {
  callWithAsyncErrorHandling(isArray(hook) ? hook.map((h2) => h2.bind(instance.proxy)) : hook.bind(instance.proxy), instance, type2);
}
function createWatcher(raw, ctx, publicThis, key) {
  const getter = key.includes(".") ? createPathGetter(publicThis, key) : () => publicThis[key];
  if (isString(raw)) {
    const handler = ctx[raw];
    if (isFunction$1(handler)) {
      watch(getter, handler);
    }
  } else if (isFunction$1(raw)) {
    watch(getter, raw.bind(publicThis));
  } else if (isObject(raw)) {
    if (isArray(raw)) {
      raw.forEach((r) => createWatcher(r, ctx, publicThis, key));
    } else {
      const handler = isFunction$1(raw.handler) ? raw.handler.bind(publicThis) : ctx[raw.handler];
      if (isFunction$1(handler)) {
        watch(getter, handler, raw);
      }
    }
  } else
    ;
}
function resolveMergedOptions(instance) {
  const base = instance.type;
  const { mixins, extends: extendsOptions } = base;
  const { mixins: globalMixins, optionsCache: cache, config: { optionMergeStrategies } } = instance.appContext;
  const cached = cache.get(base);
  let resolved;
  if (cached) {
    resolved = cached;
  } else if (!globalMixins.length && !mixins && !extendsOptions) {
    {
      resolved = base;
    }
  } else {
    resolved = {};
    if (globalMixins.length) {
      globalMixins.forEach((m) => mergeOptions$1(resolved, m, optionMergeStrategies, true));
    }
    mergeOptions$1(resolved, base, optionMergeStrategies);
  }
  cache.set(base, resolved);
  return resolved;
}
function mergeOptions$1(to, from, strats, asMixin = false) {
  const { mixins, extends: extendsOptions } = from;
  if (extendsOptions) {
    mergeOptions$1(to, extendsOptions, strats, true);
  }
  if (mixins) {
    mixins.forEach((m) => mergeOptions$1(to, m, strats, true));
  }
  for (const key in from) {
    if (asMixin && key === "expose")
      ;
    else {
      const strat = internalOptionMergeStrats[key] || strats && strats[key];
      to[key] = strat ? strat(to[key], from[key]) : from[key];
    }
  }
  return to;
}
const internalOptionMergeStrats = {
  data: mergeDataFn,
  props: mergeObjectOptions,
  emits: mergeObjectOptions,
  methods: mergeObjectOptions,
  computed: mergeObjectOptions,
  beforeCreate: mergeAsArray,
  created: mergeAsArray,
  beforeMount: mergeAsArray,
  mounted: mergeAsArray,
  beforeUpdate: mergeAsArray,
  updated: mergeAsArray,
  beforeDestroy: mergeAsArray,
  beforeUnmount: mergeAsArray,
  destroyed: mergeAsArray,
  unmounted: mergeAsArray,
  activated: mergeAsArray,
  deactivated: mergeAsArray,
  errorCaptured: mergeAsArray,
  serverPrefetch: mergeAsArray,
  components: mergeObjectOptions,
  directives: mergeObjectOptions,
  watch: mergeWatchOptions,
  provide: mergeDataFn,
  inject: mergeInject
};
function mergeDataFn(to, from) {
  if (!from) {
    return to;
  }
  if (!to) {
    return from;
  }
  return function mergedDataFn() {
    return extend(isFunction$1(to) ? to.call(this, this) : to, isFunction$1(from) ? from.call(this, this) : from);
  };
}
function mergeInject(to, from) {
  return mergeObjectOptions(normalizeInject(to), normalizeInject(from));
}
function normalizeInject(raw) {
  if (isArray(raw)) {
    const res = {};
    for (let i = 0; i < raw.length; i++) {
      res[raw[i]] = raw[i];
    }
    return res;
  }
  return raw;
}
function mergeAsArray(to, from) {
  return to ? [...new Set([].concat(to, from))] : from;
}
function mergeObjectOptions(to, from) {
  return to ? extend(extend(Object.create(null), to), from) : from;
}
function mergeWatchOptions(to, from) {
  if (!to)
    return from;
  if (!from)
    return to;
  const merged = extend(Object.create(null), to);
  for (const key in from) {
    merged[key] = mergeAsArray(to[key], from[key]);
  }
  return merged;
}
function initProps(instance, rawProps, isStateful, isSSR = false) {
  const props = {};
  const attrs = {};
  def(attrs, InternalObjectKey, 1);
  instance.propsDefaults = Object.create(null);
  setFullProps(instance, rawProps, props, attrs);
  for (const key in instance.propsOptions[0]) {
    if (!(key in props)) {
      props[key] = void 0;
    }
  }
  if (isStateful) {
    instance.props = isSSR ? props : shallowReactive(props);
  } else {
    if (!instance.type.props) {
      instance.props = attrs;
    } else {
      instance.props = props;
    }
  }
  instance.attrs = attrs;
}
function updateProps(instance, rawProps, rawPrevProps, optimized) {
  const { props, attrs, vnode: { patchFlag } } = instance;
  const rawCurrentProps = toRaw(props);
  const [options] = instance.propsOptions;
  let hasAttrsChanged = false;
  if ((optimized || patchFlag > 0) && !(patchFlag & 16)) {
    if (patchFlag & 8) {
      const propsToUpdate = instance.vnode.dynamicProps;
      for (let i = 0; i < propsToUpdate.length; i++) {
        let key = propsToUpdate[i];
        const value = rawProps[key];
        if (options) {
          if (hasOwn(attrs, key)) {
            if (value !== attrs[key]) {
              attrs[key] = value;
              hasAttrsChanged = true;
            }
          } else {
            const camelizedKey = camelize(key);
            props[camelizedKey] = resolvePropValue(options, rawCurrentProps, camelizedKey, value, instance, false);
          }
        } else {
          if (value !== attrs[key]) {
            attrs[key] = value;
            hasAttrsChanged = true;
          }
        }
      }
    }
  } else {
    if (setFullProps(instance, rawProps, props, attrs)) {
      hasAttrsChanged = true;
    }
    let kebabKey;
    for (const key in rawCurrentProps) {
      if (!rawProps || !hasOwn(rawProps, key) && ((kebabKey = hyphenate(key)) === key || !hasOwn(rawProps, kebabKey))) {
        if (options) {
          if (rawPrevProps && (rawPrevProps[key] !== void 0 || rawPrevProps[kebabKey] !== void 0)) {
            props[key] = resolvePropValue(options, rawCurrentProps, key, void 0, instance, true);
          }
        } else {
          delete props[key];
        }
      }
    }
    if (attrs !== rawCurrentProps) {
      for (const key in attrs) {
        if (!rawProps || !hasOwn(rawProps, key) && true) {
          delete attrs[key];
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (hasAttrsChanged) {
    trigger$1(instance, "set", "$attrs");
  }
}
function setFullProps(instance, rawProps, props, attrs) {
  const [options, needCastKeys] = instance.propsOptions;
  let hasAttrsChanged = false;
  let rawCastValues;
  if (rawProps) {
    for (let key in rawProps) {
      if (isReservedProp(key)) {
        continue;
      }
      const value = rawProps[key];
      let camelKey;
      if (options && hasOwn(options, camelKey = camelize(key))) {
        if (!needCastKeys || !needCastKeys.includes(camelKey)) {
          props[camelKey] = value;
        } else {
          (rawCastValues || (rawCastValues = {}))[camelKey] = value;
        }
      } else if (!isEmitListener(instance.emitsOptions, key)) {
        if (!(key in attrs) || value !== attrs[key]) {
          attrs[key] = value;
          hasAttrsChanged = true;
        }
      }
    }
  }
  if (needCastKeys) {
    const rawCurrentProps = toRaw(props);
    const castValues = rawCastValues || EMPTY_OBJ;
    for (let i = 0; i < needCastKeys.length; i++) {
      const key = needCastKeys[i];
      props[key] = resolvePropValue(options, rawCurrentProps, key, castValues[key], instance, !hasOwn(castValues, key));
    }
  }
  return hasAttrsChanged;
}
function resolvePropValue(options, props, key, value, instance, isAbsent) {
  const opt = options[key];
  if (opt != null) {
    const hasDefault = hasOwn(opt, "default");
    if (hasDefault && value === void 0) {
      const defaultValue = opt.default;
      if (opt.type !== Function && isFunction$1(defaultValue)) {
        const { propsDefaults } = instance;
        if (key in propsDefaults) {
          value = propsDefaults[key];
        } else {
          setCurrentInstance(instance);
          value = propsDefaults[key] = defaultValue.call(null, props);
          unsetCurrentInstance();
        }
      } else {
        value = defaultValue;
      }
    }
    if (opt[0]) {
      if (isAbsent && !hasDefault) {
        value = false;
      } else if (opt[1] && (value === "" || value === hyphenate(key))) {
        value = true;
      }
    }
  }
  return value;
}
function normalizePropsOptions(comp2, appContext, asMixin = false) {
  const cache = appContext.propsCache;
  const cached = cache.get(comp2);
  if (cached) {
    return cached;
  }
  const raw = comp2.props;
  const normalized = {};
  const needCastKeys = [];
  let hasExtends = false;
  if (!isFunction$1(comp2)) {
    const extendProps = (raw2) => {
      hasExtends = true;
      const [props, keys] = normalizePropsOptions(raw2, appContext, true);
      extend(normalized, props);
      if (keys)
        needCastKeys.push(...keys);
    };
    if (!asMixin && appContext.mixins.length) {
      appContext.mixins.forEach(extendProps);
    }
    if (comp2.extends) {
      extendProps(comp2.extends);
    }
    if (comp2.mixins) {
      comp2.mixins.forEach(extendProps);
    }
  }
  if (!raw && !hasExtends) {
    cache.set(comp2, EMPTY_ARR);
    return EMPTY_ARR;
  }
  if (isArray(raw)) {
    for (let i = 0; i < raw.length; i++) {
      const normalizedKey = camelize(raw[i]);
      if (validatePropName(normalizedKey)) {
        normalized[normalizedKey] = EMPTY_OBJ;
      }
    }
  } else if (raw) {
    for (const key in raw) {
      const normalizedKey = camelize(key);
      if (validatePropName(normalizedKey)) {
        const opt = raw[key];
        const prop2 = normalized[normalizedKey] = isArray(opt) || isFunction$1(opt) ? { type: opt } : opt;
        if (prop2) {
          const booleanIndex = getTypeIndex(Boolean, prop2.type);
          const stringIndex = getTypeIndex(String, prop2.type);
          prop2[0] = booleanIndex > -1;
          prop2[1] = stringIndex < 0 || booleanIndex < stringIndex;
          if (booleanIndex > -1 || hasOwn(prop2, "default")) {
            needCastKeys.push(normalizedKey);
          }
        }
      }
    }
  }
  const res = [normalized, needCastKeys];
  cache.set(comp2, res);
  return res;
}
function validatePropName(key) {
  if (key[0] !== "$") {
    return true;
  }
  return false;
}
function getType(ctor) {
  const match2 = ctor && ctor.toString().match(/^\s*function (\w+)/);
  return match2 ? match2[1] : ctor === null ? "null" : "";
}
function isSameType(a, b) {
  return getType(a) === getType(b);
}
function getTypeIndex(type2, expectedTypes) {
  if (isArray(expectedTypes)) {
    return expectedTypes.findIndex((t) => isSameType(t, type2));
  } else if (isFunction$1(expectedTypes)) {
    return isSameType(expectedTypes, type2) ? 0 : -1;
  }
  return -1;
}
const isInternalKey = (key) => key[0] === "_" || key === "$stable";
const normalizeSlotValue = (value) => isArray(value) ? value.map(normalizeVNode) : [normalizeVNode(value)];
const normalizeSlot$1 = (key, rawSlot, ctx) => {
  const normalized = withCtx((...args) => {
    return normalizeSlotValue(rawSlot(...args));
  }, ctx);
  normalized._c = false;
  return normalized;
};
const normalizeObjectSlots = (rawSlots, slots, instance) => {
  const ctx = rawSlots._ctx;
  for (const key in rawSlots) {
    if (isInternalKey(key))
      continue;
    const value = rawSlots[key];
    if (isFunction$1(value)) {
      slots[key] = normalizeSlot$1(key, value, ctx);
    } else if (value != null) {
      const normalized = normalizeSlotValue(value);
      slots[key] = () => normalized;
    }
  }
};
const normalizeVNodeSlots = (instance, children) => {
  const normalized = normalizeSlotValue(children);
  instance.slots.default = () => normalized;
};
const initSlots = (instance, children) => {
  if (instance.vnode.shapeFlag & 32) {
    const type2 = children._;
    if (type2) {
      instance.slots = toRaw(children);
      def(children, "_", type2);
    } else {
      normalizeObjectSlots(children, instance.slots = {});
    }
  } else {
    instance.slots = {};
    if (children) {
      normalizeVNodeSlots(instance, children);
    }
  }
  def(instance.slots, InternalObjectKey, 1);
};
const updateSlots = (instance, children, optimized) => {
  const { vnode, slots } = instance;
  let needDeletionCheck = true;
  let deletionComparisonTarget = EMPTY_OBJ;
  if (vnode.shapeFlag & 32) {
    const type2 = children._;
    if (type2) {
      if (optimized && type2 === 1) {
        needDeletionCheck = false;
      } else {
        extend(slots, children);
        if (!optimized && type2 === 1) {
          delete slots._;
        }
      }
    } else {
      needDeletionCheck = !children.$stable;
      normalizeObjectSlots(children, slots);
    }
    deletionComparisonTarget = children;
  } else if (children) {
    normalizeVNodeSlots(instance, children);
    deletionComparisonTarget = { default: 1 };
  }
  if (needDeletionCheck) {
    for (const key in slots) {
      if (!isInternalKey(key) && !(key in deletionComparisonTarget)) {
        delete slots[key];
      }
    }
  }
};
function withDirectives(vnode, directives) {
  const internalInstance = currentRenderingInstance;
  if (internalInstance === null) {
    return vnode;
  }
  const instance = internalInstance.proxy;
  const bindings = vnode.dirs || (vnode.dirs = []);
  for (let i = 0; i < directives.length; i++) {
    let [dir, value, arg, modifiers = EMPTY_OBJ] = directives[i];
    if (isFunction$1(dir)) {
      dir = {
        mounted: dir,
        updated: dir
      };
    }
    if (dir.deep) {
      traverse(value);
    }
    bindings.push({
      dir,
      instance,
      value,
      oldValue: void 0,
      arg,
      modifiers
    });
  }
  return vnode;
}
function invokeDirectiveHook(vnode, prevVNode, instance, name) {
  const bindings = vnode.dirs;
  const oldBindings = prevVNode && prevVNode.dirs;
  for (let i = 0; i < bindings.length; i++) {
    const binding = bindings[i];
    if (oldBindings) {
      binding.oldValue = oldBindings[i].value;
    }
    let hook = binding.dir[name];
    if (hook) {
      pauseTracking();
      callWithAsyncErrorHandling(hook, instance, 8, [
        vnode.el,
        binding,
        vnode,
        prevVNode
      ]);
      resetTracking();
    }
  }
}
function createAppContext() {
  return {
    app: null,
    config: {
      isNativeTag: NO,
      performance: false,
      globalProperties: {},
      optionMergeStrategies: {},
      errorHandler: void 0,
      warnHandler: void 0,
      compilerOptions: {}
    },
    mixins: [],
    components: {},
    directives: {},
    provides: Object.create(null),
    optionsCache: new WeakMap(),
    propsCache: new WeakMap(),
    emitsCache: new WeakMap()
  };
}
let uid$1 = 0;
function createAppAPI(render2, hydrate2) {
  return function createApp2(rootComponent, rootProps = null) {
    if (rootProps != null && !isObject(rootProps)) {
      rootProps = null;
    }
    const context = createAppContext();
    const installedPlugins = new Set();
    let isMounted = false;
    const app2 = context.app = {
      _uid: uid$1++,
      _component: rootComponent,
      _props: rootProps,
      _container: null,
      _context: context,
      _instance: null,
      version,
      get config() {
        return context.config;
      },
      set config(v) {
      },
      use(plugin, ...options) {
        if (installedPlugins.has(plugin))
          ;
        else if (plugin && isFunction$1(plugin.install)) {
          installedPlugins.add(plugin);
          plugin.install(app2, ...options);
        } else if (isFunction$1(plugin)) {
          installedPlugins.add(plugin);
          plugin(app2, ...options);
        } else
          ;
        return app2;
      },
      mixin(mixin) {
        {
          if (!context.mixins.includes(mixin)) {
            context.mixins.push(mixin);
          }
        }
        return app2;
      },
      component(name, component) {
        if (!component) {
          return context.components[name];
        }
        context.components[name] = component;
        return app2;
      },
      directive(name, directive) {
        if (!directive) {
          return context.directives[name];
        }
        context.directives[name] = directive;
        return app2;
      },
      mount(rootContainer, isHydrate, isSVG) {
        if (!isMounted) {
          const vnode = createVNode(rootComponent, rootProps);
          vnode.appContext = context;
          if (isHydrate && hydrate2) {
            hydrate2(vnode, rootContainer);
          } else {
            render2(vnode, rootContainer, isSVG);
          }
          isMounted = true;
          app2._container = rootContainer;
          rootContainer.__vue_app__ = app2;
          return getExposeProxy(vnode.component) || vnode.component.proxy;
        }
      },
      unmount() {
        if (isMounted) {
          render2(null, app2._container);
          delete app2._container.__vue_app__;
        }
      },
      provide(key, value) {
        context.provides[key] = value;
        return app2;
      }
    };
    return app2;
  };
}
function setRef(rawRef, oldRawRef, parentSuspense, vnode, isUnmount = false) {
  if (isArray(rawRef)) {
    rawRef.forEach((r, i) => setRef(r, oldRawRef && (isArray(oldRawRef) ? oldRawRef[i] : oldRawRef), parentSuspense, vnode, isUnmount));
    return;
  }
  if (isAsyncWrapper(vnode) && !isUnmount) {
    return;
  }
  const refValue = vnode.shapeFlag & 4 ? getExposeProxy(vnode.component) || vnode.component.proxy : vnode.el;
  const value = isUnmount ? null : refValue;
  const { i: owner, r: ref2 } = rawRef;
  const oldRef = oldRawRef && oldRawRef.r;
  const refs = owner.refs === EMPTY_OBJ ? owner.refs = {} : owner.refs;
  const setupState = owner.setupState;
  if (oldRef != null && oldRef !== ref2) {
    if (isString(oldRef)) {
      refs[oldRef] = null;
      if (hasOwn(setupState, oldRef)) {
        setupState[oldRef] = null;
      }
    } else if (isRef(oldRef)) {
      oldRef.value = null;
    }
  }
  if (isFunction$1(ref2)) {
    callWithErrorHandling(ref2, owner, 12, [value, refs]);
  } else {
    const _isString = isString(ref2);
    const _isRef = isRef(ref2);
    if (_isString || _isRef) {
      const doSet = () => {
        if (rawRef.f) {
          const existing = _isString ? refs[ref2] : ref2.value;
          if (isUnmount) {
            isArray(existing) && remove(existing, refValue);
          } else {
            if (!isArray(existing)) {
              if (_isString) {
                refs[ref2] = [refValue];
              } else {
                ref2.value = [refValue];
                if (rawRef.k)
                  refs[rawRef.k] = ref2.value;
              }
            } else if (!existing.includes(refValue)) {
              existing.push(refValue);
            }
          }
        } else if (_isString) {
          refs[ref2] = value;
          if (hasOwn(setupState, ref2)) {
            setupState[ref2] = value;
          }
        } else if (isRef(ref2)) {
          ref2.value = value;
          if (rawRef.k)
            refs[rawRef.k] = value;
        } else
          ;
      };
      if (value) {
        doSet.id = -1;
        queuePostRenderEffect(doSet, parentSuspense);
      } else {
        doSet();
      }
    }
  }
}
let hasMismatch = false;
const isSVGContainer = (container) => /svg/.test(container.namespaceURI) && container.tagName !== "foreignObject";
const isComment$1 = (node2) => node2.nodeType === 8;
function createHydrationFunctions(rendererInternals) {
  const { mt: mountComponent, p: patch, o: { patchProp: patchProp2, nextSibling, parentNode, remove: remove2, insert, createComment } } = rendererInternals;
  const hydrate2 = (vnode, container) => {
    if (!container.hasChildNodes()) {
      patch(null, vnode, container);
      flushPostFlushCbs();
      return;
    }
    hasMismatch = false;
    hydrateNode(container.firstChild, vnode, null, null, null);
    flushPostFlushCbs();
    if (hasMismatch && true) {
      console.error(`Hydration completed but contains mismatches.`);
    }
  };
  const hydrateNode = (node2, vnode, parentComponent, parentSuspense, slotScopeIds, optimized = false) => {
    const isFragmentStart = isComment$1(node2) && node2.data === "[";
    const onMismatch = () => handleMismatch(node2, vnode, parentComponent, parentSuspense, slotScopeIds, isFragmentStart);
    const { type: type2, ref: ref2, shapeFlag } = vnode;
    const domType = node2.nodeType;
    vnode.el = node2;
    let nextNode = null;
    switch (type2) {
      case Text$1:
        if (domType !== 3) {
          nextNode = onMismatch();
        } else {
          if (node2.data !== vnode.children) {
            hasMismatch = true;
            node2.data = vnode.children;
          }
          nextNode = nextSibling(node2);
        }
        break;
      case Comment$1:
        if (domType !== 8 || isFragmentStart) {
          nextNode = onMismatch();
        } else {
          nextNode = nextSibling(node2);
        }
        break;
      case Static:
        if (domType !== 1) {
          nextNode = onMismatch();
        } else {
          nextNode = node2;
          const needToAdoptContent = !vnode.children.length;
          for (let i = 0; i < vnode.staticCount; i++) {
            if (needToAdoptContent)
              vnode.children += nextNode.outerHTML;
            if (i === vnode.staticCount - 1) {
              vnode.anchor = nextNode;
            }
            nextNode = nextSibling(nextNode);
          }
          return nextNode;
        }
        break;
      case Fragment:
        if (!isFragmentStart) {
          nextNode = onMismatch();
        } else {
          nextNode = hydrateFragment(node2, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
        }
        break;
      default:
        if (shapeFlag & 1) {
          if (domType !== 1 || vnode.type.toLowerCase() !== node2.tagName.toLowerCase()) {
            nextNode = onMismatch();
          } else {
            nextNode = hydrateElement(node2, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
          }
        } else if (shapeFlag & 6) {
          vnode.slotScopeIds = slotScopeIds;
          const container = parentNode(node2);
          mountComponent(vnode, container, null, parentComponent, parentSuspense, isSVGContainer(container), optimized);
          nextNode = isFragmentStart ? locateClosingAsyncAnchor(node2) : nextSibling(node2);
          if (isAsyncWrapper(vnode)) {
            let subTree;
            if (isFragmentStart) {
              subTree = createVNode(Fragment);
              subTree.anchor = nextNode ? nextNode.previousSibling : container.lastChild;
            } else {
              subTree = node2.nodeType === 3 ? createTextVNode("") : createVNode("div");
            }
            subTree.el = node2;
            vnode.component.subTree = subTree;
          }
        } else if (shapeFlag & 64) {
          if (domType !== 8) {
            nextNode = onMismatch();
          } else {
            nextNode = vnode.type.hydrate(node2, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, rendererInternals, hydrateChildren);
          }
        } else if (shapeFlag & 128) {
          nextNode = vnode.type.hydrate(node2, vnode, parentComponent, parentSuspense, isSVGContainer(parentNode(node2)), slotScopeIds, optimized, rendererInternals, hydrateNode);
        } else
          ;
    }
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode);
    }
    return nextNode;
  };
  const hydrateElement = (el2, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
    optimized = optimized || !!vnode.dynamicChildren;
    const { type: type2, props, patchFlag, shapeFlag, dirs } = vnode;
    const forcePatchValue = type2 === "input" && dirs || type2 === "option";
    if (forcePatchValue || patchFlag !== -1) {
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      if (props) {
        if (forcePatchValue || !optimized || patchFlag & (16 | 32)) {
          for (const key in props) {
            if (forcePatchValue && key.endsWith("value") || isOn(key) && !isReservedProp(key)) {
              patchProp2(el2, key, null, props[key], false, void 0, parentComponent);
            }
          }
        } else if (props.onClick) {
          patchProp2(el2, "onClick", null, props.onClick, false, void 0, parentComponent);
        }
      }
      let vnodeHooks;
      if (vnodeHooks = props && props.onVnodeBeforeMount) {
        invokeVNodeHook(vnodeHooks, parentComponent, vnode);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
      }
      if ((vnodeHooks = props && props.onVnodeMounted) || dirs) {
        queueEffectWithSuspense(() => {
          vnodeHooks && invokeVNodeHook(vnodeHooks, parentComponent, vnode);
          dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
        }, parentSuspense);
      }
      if (shapeFlag & 16 && !(props && (props.innerHTML || props.textContent))) {
        let next = hydrateChildren(el2.firstChild, vnode, el2, parentComponent, parentSuspense, slotScopeIds, optimized);
        while (next) {
          hasMismatch = true;
          const cur = next;
          next = next.nextSibling;
          remove2(cur);
        }
      } else if (shapeFlag & 8) {
        if (el2.textContent !== vnode.children) {
          hasMismatch = true;
          el2.textContent = vnode.children;
        }
      }
    }
    return el2.nextSibling;
  };
  const hydrateChildren = (node2, parentVNode, container, parentComponent, parentSuspense, slotScopeIds, optimized) => {
    optimized = optimized || !!parentVNode.dynamicChildren;
    const children = parentVNode.children;
    const l = children.length;
    for (let i = 0; i < l; i++) {
      const vnode = optimized ? children[i] : children[i] = normalizeVNode(children[i]);
      if (node2) {
        node2 = hydrateNode(node2, vnode, parentComponent, parentSuspense, slotScopeIds, optimized);
      } else if (vnode.type === Text$1 && !vnode.children) {
        continue;
      } else {
        hasMismatch = true;
        patch(null, vnode, container, null, parentComponent, parentSuspense, isSVGContainer(container), slotScopeIds);
      }
    }
    return node2;
  };
  const hydrateFragment = (node2, vnode, parentComponent, parentSuspense, slotScopeIds, optimized) => {
    const { slotScopeIds: fragmentSlotScopeIds } = vnode;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    const container = parentNode(node2);
    const next = hydrateChildren(nextSibling(node2), vnode, container, parentComponent, parentSuspense, slotScopeIds, optimized);
    if (next && isComment$1(next) && next.data === "]") {
      return nextSibling(vnode.anchor = next);
    } else {
      hasMismatch = true;
      insert(vnode.anchor = createComment(`]`), container, next);
      return next;
    }
  };
  const handleMismatch = (node2, vnode, parentComponent, parentSuspense, slotScopeIds, isFragment) => {
    hasMismatch = true;
    vnode.el = null;
    if (isFragment) {
      const end2 = locateClosingAsyncAnchor(node2);
      while (true) {
        const next2 = nextSibling(node2);
        if (next2 && next2 !== end2) {
          remove2(next2);
        } else {
          break;
        }
      }
    }
    const next = nextSibling(node2);
    const container = parentNode(node2);
    remove2(node2);
    patch(null, vnode, container, next, parentComponent, parentSuspense, isSVGContainer(container), slotScopeIds);
    return next;
  };
  const locateClosingAsyncAnchor = (node2) => {
    let match2 = 0;
    while (node2) {
      node2 = nextSibling(node2);
      if (node2 && isComment$1(node2)) {
        if (node2.data === "[")
          match2++;
        if (node2.data === "]") {
          if (match2 === 0) {
            return nextSibling(node2);
          } else {
            match2--;
          }
        }
      }
    }
    return node2;
  };
  return [hydrate2, hydrateNode];
}
const queuePostRenderEffect = queueEffectWithSuspense;
function createRenderer(options) {
  return baseCreateRenderer(options);
}
function createHydrationRenderer(options) {
  return baseCreateRenderer(options, createHydrationFunctions);
}
function baseCreateRenderer(options, createHydrationFns) {
  const target2 = getGlobalThis();
  target2.__VUE__ = true;
  const { insert: hostInsert, remove: hostRemove, patchProp: hostPatchProp, createElement: hostCreateElement, createText: hostCreateText, createComment: hostCreateComment, setText: hostSetText, setElementText: hostSetElementText, parentNode: hostParentNode, nextSibling: hostNextSibling, setScopeId: hostSetScopeId = NOOP, cloneNode: hostCloneNode, insertStaticContent: hostInsertStaticContent } = options;
  const patch = (n1, n2, container, anchor = null, parentComponent = null, parentSuspense = null, isSVG = false, slotScopeIds = null, optimized = !!n2.dynamicChildren) => {
    if (n1 === n2) {
      return;
    }
    if (n1 && !isSameVNodeType(n1, n2)) {
      anchor = getNextHostNode(n1);
      unmount(n1, parentComponent, parentSuspense, true);
      n1 = null;
    }
    if (n2.patchFlag === -2) {
      optimized = false;
      n2.dynamicChildren = null;
    }
    const { type: type2, ref: ref2, shapeFlag } = n2;
    switch (type2) {
      case Text$1:
        processText(n1, n2, container, anchor);
        break;
      case Comment$1:
        processCommentNode(n1, n2, container, anchor);
        break;
      case Static:
        if (n1 == null) {
          mountStaticNode(n2, container, anchor, isSVG);
        }
        break;
      case Fragment:
        processFragment(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        break;
      default:
        if (shapeFlag & 1) {
          processElement(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 6) {
          processComponent(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (shapeFlag & 64) {
          type2.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else if (shapeFlag & 128) {
          type2.process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals);
        } else
          ;
    }
    if (ref2 != null && parentComponent) {
      setRef(ref2, n1 && n1.ref, parentSuspense, n2 || n1, !n2);
    }
  };
  const processText = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateText(n2.children), container, anchor);
    } else {
      const el2 = n2.el = n1.el;
      if (n2.children !== n1.children) {
        hostSetText(el2, n2.children);
      }
    }
  };
  const processCommentNode = (n1, n2, container, anchor) => {
    if (n1 == null) {
      hostInsert(n2.el = hostCreateComment(n2.children || ""), container, anchor);
    } else {
      n2.el = n1.el;
    }
  };
  const mountStaticNode = (n2, container, anchor, isSVG) => {
    [n2.el, n2.anchor] = hostInsertStaticContent(n2.children, container, anchor, isSVG, n2.el, n2.anchor);
  };
  const moveStaticNode = ({ el: el2, anchor }, container, nextSibling) => {
    let next;
    while (el2 && el2 !== anchor) {
      next = hostNextSibling(el2);
      hostInsert(el2, container, nextSibling);
      el2 = next;
    }
    hostInsert(anchor, container, nextSibling);
  };
  const removeStaticNode = ({ el: el2, anchor }) => {
    let next;
    while (el2 && el2 !== anchor) {
      next = hostNextSibling(el2);
      hostRemove(el2);
      el2 = next;
    }
    hostRemove(anchor);
  };
  const processElement = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    isSVG = isSVG || n2.type === "svg";
    if (n1 == null) {
      mountElement(n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      patchElement(n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const mountElement = (vnode, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let el2;
    let vnodeHook;
    const { type: type2, props, shapeFlag, transition, patchFlag, dirs } = vnode;
    if (vnode.el && hostCloneNode !== void 0 && patchFlag === -1) {
      el2 = vnode.el = hostCloneNode(vnode.el);
    } else {
      el2 = vnode.el = hostCreateElement(vnode.type, isSVG, props && props.is, props);
      if (shapeFlag & 8) {
        hostSetElementText(el2, vnode.children);
      } else if (shapeFlag & 16) {
        mountChildren(vnode.children, el2, null, parentComponent, parentSuspense, isSVG && type2 !== "foreignObject", slotScopeIds, optimized);
      }
      if (dirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "created");
      }
      if (props) {
        for (const key in props) {
          if (key !== "value" && !isReservedProp(key)) {
            hostPatchProp(el2, key, null, props[key], isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
        if ("value" in props) {
          hostPatchProp(el2, "value", null, props.value);
        }
        if (vnodeHook = props.onVnodeBeforeMount) {
          invokeVNodeHook(vnodeHook, parentComponent, vnode);
        }
      }
      setScopeId(el2, vnode, vnode.scopeId, slotScopeIds, parentComponent);
    }
    if (dirs) {
      invokeDirectiveHook(vnode, null, parentComponent, "beforeMount");
    }
    const needCallTransitionHooks = (!parentSuspense || parentSuspense && !parentSuspense.pendingBranch) && transition && !transition.persisted;
    if (needCallTransitionHooks) {
      transition.beforeEnter(el2);
    }
    hostInsert(el2, container, anchor);
    if ((vnodeHook = props && props.onVnodeMounted) || needCallTransitionHooks || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        needCallTransitionHooks && transition.enter(el2);
        dirs && invokeDirectiveHook(vnode, null, parentComponent, "mounted");
      }, parentSuspense);
    }
  };
  const setScopeId = (el2, vnode, scopeId, slotScopeIds, parentComponent) => {
    if (scopeId) {
      hostSetScopeId(el2, scopeId);
    }
    if (slotScopeIds) {
      for (let i = 0; i < slotScopeIds.length; i++) {
        hostSetScopeId(el2, slotScopeIds[i]);
      }
    }
    if (parentComponent) {
      let subTree = parentComponent.subTree;
      if (vnode === subTree) {
        const parentVNode = parentComponent.vnode;
        setScopeId(el2, parentVNode, parentVNode.scopeId, parentVNode.slotScopeIds, parentComponent.parent);
      }
    }
  };
  const mountChildren = (children, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, start2 = 0) => {
    for (let i = start2; i < children.length; i++) {
      const child = children[i] = optimized ? cloneIfMounted(children[i]) : normalizeVNode(children[i]);
      patch(null, child, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
  };
  const patchElement = (n1, n2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const el2 = n2.el = n1.el;
    let { patchFlag, dynamicChildren, dirs } = n2;
    patchFlag |= n1.patchFlag & 16;
    const oldProps = n1.props || EMPTY_OBJ;
    const newProps = n2.props || EMPTY_OBJ;
    let vnodeHook;
    parentComponent && toggleRecurse(parentComponent, false);
    if (vnodeHook = newProps.onVnodeBeforeUpdate) {
      invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
    }
    if (dirs) {
      invokeDirectiveHook(n2, n1, parentComponent, "beforeUpdate");
    }
    parentComponent && toggleRecurse(parentComponent, true);
    const areChildrenSVG = isSVG && n2.type !== "foreignObject";
    if (dynamicChildren) {
      patchBlockChildren(n1.dynamicChildren, dynamicChildren, el2, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds);
    } else if (!optimized) {
      patchChildren(n1, n2, el2, null, parentComponent, parentSuspense, areChildrenSVG, slotScopeIds, false);
    }
    if (patchFlag > 0) {
      if (patchFlag & 16) {
        patchProps(el2, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
      } else {
        if (patchFlag & 2) {
          if (oldProps.class !== newProps.class) {
            hostPatchProp(el2, "class", null, newProps.class, isSVG);
          }
        }
        if (patchFlag & 4) {
          hostPatchProp(el2, "style", oldProps.style, newProps.style, isSVG);
        }
        if (patchFlag & 8) {
          const propsToUpdate = n2.dynamicProps;
          for (let i = 0; i < propsToUpdate.length; i++) {
            const key = propsToUpdate[i];
            const prev = oldProps[key];
            const next = newProps[key];
            if (next !== prev || key === "value") {
              hostPatchProp(el2, key, prev, next, isSVG, n1.children, parentComponent, parentSuspense, unmountChildren);
            }
          }
        }
      }
      if (patchFlag & 1) {
        if (n1.children !== n2.children) {
          hostSetElementText(el2, n2.children);
        }
      }
    } else if (!optimized && dynamicChildren == null) {
      patchProps(el2, n2, oldProps, newProps, parentComponent, parentSuspense, isSVG);
    }
    if ((vnodeHook = newProps.onVnodeUpdated) || dirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, n2, n1);
        dirs && invokeDirectiveHook(n2, n1, parentComponent, "updated");
      }, parentSuspense);
    }
  };
  const patchBlockChildren = (oldChildren, newChildren, fallbackContainer, parentComponent, parentSuspense, isSVG, slotScopeIds) => {
    for (let i = 0; i < newChildren.length; i++) {
      const oldVNode = oldChildren[i];
      const newVNode = newChildren[i];
      const container = oldVNode.el && (oldVNode.type === Fragment || !isSameVNodeType(oldVNode, newVNode) || oldVNode.shapeFlag & (6 | 64)) ? hostParentNode(oldVNode.el) : fallbackContainer;
      patch(oldVNode, newVNode, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, true);
    }
  };
  const patchProps = (el2, vnode, oldProps, newProps, parentComponent, parentSuspense, isSVG) => {
    if (oldProps !== newProps) {
      for (const key in newProps) {
        if (isReservedProp(key))
          continue;
        const next = newProps[key];
        const prev = oldProps[key];
        if (next !== prev && key !== "value") {
          hostPatchProp(el2, key, prev, next, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
        }
      }
      if (oldProps !== EMPTY_OBJ) {
        for (const key in oldProps) {
          if (!isReservedProp(key) && !(key in newProps)) {
            hostPatchProp(el2, key, oldProps[key], null, isSVG, vnode.children, parentComponent, parentSuspense, unmountChildren);
          }
        }
      }
      if ("value" in newProps) {
        hostPatchProp(el2, "value", oldProps.value, newProps.value);
      }
    }
  };
  const processFragment = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    const fragmentStartAnchor = n2.el = n1 ? n1.el : hostCreateText("");
    const fragmentEndAnchor = n2.anchor = n1 ? n1.anchor : hostCreateText("");
    let { patchFlag, dynamicChildren, slotScopeIds: fragmentSlotScopeIds } = n2;
    if (fragmentSlotScopeIds) {
      slotScopeIds = slotScopeIds ? slotScopeIds.concat(fragmentSlotScopeIds) : fragmentSlotScopeIds;
    }
    if (n1 == null) {
      hostInsert(fragmentStartAnchor, container, anchor);
      hostInsert(fragmentEndAnchor, container, anchor);
      mountChildren(n2.children, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    } else {
      if (patchFlag > 0 && patchFlag & 64 && dynamicChildren && n1.dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, container, parentComponent, parentSuspense, isSVG, slotScopeIds);
        if (n2.key != null || parentComponent && n2 === parentComponent.subTree) {
          traverseStaticChildren(n1, n2, true);
        }
      } else {
        patchChildren(n1, n2, container, fragmentEndAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      }
    }
  };
  const processComponent = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    n2.slotScopeIds = slotScopeIds;
    if (n1 == null) {
      if (n2.shapeFlag & 512) {
        parentComponent.ctx.activate(n2, container, anchor, isSVG, optimized);
      } else {
        mountComponent(n2, container, anchor, parentComponent, parentSuspense, isSVG, optimized);
      }
    } else {
      updateComponent(n1, n2, optimized);
    }
  };
  const mountComponent = (initialVNode, container, anchor, parentComponent, parentSuspense, isSVG, optimized) => {
    const instance = initialVNode.component = createComponentInstance(initialVNode, parentComponent, parentSuspense);
    if (isKeepAlive(initialVNode)) {
      instance.ctx.renderer = internals;
    }
    {
      setupComponent(instance);
    }
    if (instance.asyncDep) {
      parentSuspense && parentSuspense.registerDep(instance, setupRenderEffect);
      if (!initialVNode.el) {
        const placeholder = instance.subTree = createVNode(Comment$1);
        processCommentNode(null, placeholder, container, anchor);
      }
      return;
    }
    setupRenderEffect(instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized);
  };
  const updateComponent = (n1, n2, optimized) => {
    const instance = n2.component = n1.component;
    if (shouldUpdateComponent(n1, n2, optimized)) {
      if (instance.asyncDep && !instance.asyncResolved) {
        updateComponentPreRender(instance, n2, optimized);
        return;
      } else {
        instance.next = n2;
        invalidateJob(instance.update);
        instance.update();
      }
    } else {
      n2.component = n1.component;
      n2.el = n1.el;
      instance.vnode = n2;
    }
  };
  const setupRenderEffect = (instance, initialVNode, container, anchor, parentSuspense, isSVG, optimized) => {
    const componentUpdateFn = () => {
      if (!instance.isMounted) {
        let vnodeHook;
        const { el: el2, props } = initialVNode;
        const { bm, m, parent } = instance;
        const isAsyncWrapperVNode = isAsyncWrapper(initialVNode);
        toggleRecurse(instance, false);
        if (bm) {
          invokeArrayFns(bm);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeBeforeMount)) {
          invokeVNodeHook(vnodeHook, parent, initialVNode);
        }
        toggleRecurse(instance, true);
        if (el2 && hydrateNode) {
          const hydrateSubTree = () => {
            instance.subTree = renderComponentRoot(instance);
            hydrateNode(el2, instance.subTree, instance, parentSuspense, null);
          };
          if (isAsyncWrapperVNode) {
            initialVNode.type.__asyncLoader().then(() => !instance.isUnmounted && hydrateSubTree());
          } else {
            hydrateSubTree();
          }
        } else {
          const subTree = instance.subTree = renderComponentRoot(instance);
          patch(null, subTree, container, anchor, instance, parentSuspense, isSVG);
          initialVNode.el = subTree.el;
        }
        if (m) {
          queuePostRenderEffect(m, parentSuspense);
        }
        if (!isAsyncWrapperVNode && (vnodeHook = props && props.onVnodeMounted)) {
          const scopedInitialVNode = initialVNode;
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, scopedInitialVNode), parentSuspense);
        }
        if (initialVNode.shapeFlag & 256) {
          instance.a && queuePostRenderEffect(instance.a, parentSuspense);
        }
        instance.isMounted = true;
        initialVNode = container = anchor = null;
      } else {
        let { next, bu, u, parent, vnode } = instance;
        let originNext = next;
        let vnodeHook;
        toggleRecurse(instance, false);
        if (next) {
          next.el = vnode.el;
          updateComponentPreRender(instance, next, optimized);
        } else {
          next = vnode;
        }
        if (bu) {
          invokeArrayFns(bu);
        }
        if (vnodeHook = next.props && next.props.onVnodeBeforeUpdate) {
          invokeVNodeHook(vnodeHook, parent, next, vnode);
        }
        toggleRecurse(instance, true);
        const nextTree = renderComponentRoot(instance);
        const prevTree = instance.subTree;
        instance.subTree = nextTree;
        patch(prevTree, nextTree, hostParentNode(prevTree.el), getNextHostNode(prevTree), instance, parentSuspense, isSVG);
        next.el = nextTree.el;
        if (originNext === null) {
          updateHOCHostEl(instance, nextTree.el);
        }
        if (u) {
          queuePostRenderEffect(u, parentSuspense);
        }
        if (vnodeHook = next.props && next.props.onVnodeUpdated) {
          queuePostRenderEffect(() => invokeVNodeHook(vnodeHook, parent, next, vnode), parentSuspense);
        }
      }
    };
    const effect2 = instance.effect = new ReactiveEffect(componentUpdateFn, () => queueJob(instance.update), instance.scope);
    const update = instance.update = effect2.run.bind(effect2);
    update.id = instance.uid;
    toggleRecurse(instance, true);
    update();
  };
  const updateComponentPreRender = (instance, nextVNode, optimized) => {
    nextVNode.component = instance;
    const prevProps = instance.vnode.props;
    instance.vnode = nextVNode;
    instance.next = null;
    updateProps(instance, nextVNode.props, prevProps, optimized);
    updateSlots(instance, nextVNode.children, optimized);
    pauseTracking();
    flushPreFlushCbs(void 0, instance.update);
    resetTracking();
  };
  const patchChildren = (n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized = false) => {
    const c1 = n1 && n1.children;
    const prevShapeFlag = n1 ? n1.shapeFlag : 0;
    const c2 = n2.children;
    const { patchFlag, shapeFlag } = n2;
    if (patchFlag > 0) {
      if (patchFlag & 128) {
        patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      } else if (patchFlag & 256) {
        patchUnkeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        return;
      }
    }
    if (shapeFlag & 8) {
      if (prevShapeFlag & 16) {
        unmountChildren(c1, parentComponent, parentSuspense);
      }
      if (c2 !== c1) {
        hostSetElementText(container, c2);
      }
    } else {
      if (prevShapeFlag & 16) {
        if (shapeFlag & 16) {
          patchKeyedChildren(c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else {
          unmountChildren(c1, parentComponent, parentSuspense, true);
        }
      } else {
        if (prevShapeFlag & 8) {
          hostSetElementText(container, "");
        }
        if (shapeFlag & 16) {
          mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      }
    }
  };
  const patchUnkeyedChildren = (c1, c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    c1 = c1 || EMPTY_ARR;
    c2 = c2 || EMPTY_ARR;
    const oldLength = c1.length;
    const newLength = c2.length;
    const commonLength = Math.min(oldLength, newLength);
    let i;
    for (i = 0; i < commonLength; i++) {
      const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      patch(c1[i], nextChild, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
    }
    if (oldLength > newLength) {
      unmountChildren(c1, parentComponent, parentSuspense, true, false, commonLength);
    } else {
      mountChildren(c2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, commonLength);
    }
  };
  const patchKeyedChildren = (c1, c2, container, parentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized) => {
    let i = 0;
    const l2 = c2.length;
    let e1 = c1.length - 1;
    let e2 = l2 - 1;
    while (i <= e1 && i <= e2) {
      const n1 = c1[i];
      const n2 = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      i++;
    }
    while (i <= e1 && i <= e2) {
      const n1 = c1[e1];
      const n2 = c2[e2] = optimized ? cloneIfMounted(c2[e2]) : normalizeVNode(c2[e2]);
      if (isSameVNodeType(n1, n2)) {
        patch(n1, n2, container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
      } else {
        break;
      }
      e1--;
      e2--;
    }
    if (i > e1) {
      if (i <= e2) {
        const nextPos = e2 + 1;
        const anchor = nextPos < l2 ? c2[nextPos].el : parentAnchor;
        while (i <= e2) {
          patch(null, c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]), container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          i++;
        }
      }
    } else if (i > e2) {
      while (i <= e1) {
        unmount(c1[i], parentComponent, parentSuspense, true);
        i++;
      }
    } else {
      const s1 = i;
      const s2 = i;
      const keyToNewIndexMap = new Map();
      for (i = s2; i <= e2; i++) {
        const nextChild = c2[i] = optimized ? cloneIfMounted(c2[i]) : normalizeVNode(c2[i]);
        if (nextChild.key != null) {
          keyToNewIndexMap.set(nextChild.key, i);
        }
      }
      let j;
      let patched = 0;
      const toBePatched = e2 - s2 + 1;
      let moved = false;
      let maxNewIndexSoFar = 0;
      const newIndexToOldIndexMap = new Array(toBePatched);
      for (i = 0; i < toBePatched; i++)
        newIndexToOldIndexMap[i] = 0;
      for (i = s1; i <= e1; i++) {
        const prevChild = c1[i];
        if (patched >= toBePatched) {
          unmount(prevChild, parentComponent, parentSuspense, true);
          continue;
        }
        let newIndex;
        if (prevChild.key != null) {
          newIndex = keyToNewIndexMap.get(prevChild.key);
        } else {
          for (j = s2; j <= e2; j++) {
            if (newIndexToOldIndexMap[j - s2] === 0 && isSameVNodeType(prevChild, c2[j])) {
              newIndex = j;
              break;
            }
          }
        }
        if (newIndex === void 0) {
          unmount(prevChild, parentComponent, parentSuspense, true);
        } else {
          newIndexToOldIndexMap[newIndex - s2] = i + 1;
          if (newIndex >= maxNewIndexSoFar) {
            maxNewIndexSoFar = newIndex;
          } else {
            moved = true;
          }
          patch(prevChild, c2[newIndex], container, null, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
          patched++;
        }
      }
      const increasingNewIndexSequence = moved ? getSequence(newIndexToOldIndexMap) : EMPTY_ARR;
      j = increasingNewIndexSequence.length - 1;
      for (i = toBePatched - 1; i >= 0; i--) {
        const nextIndex = s2 + i;
        const nextChild = c2[nextIndex];
        const anchor = nextIndex + 1 < l2 ? c2[nextIndex + 1].el : parentAnchor;
        if (newIndexToOldIndexMap[i] === 0) {
          patch(null, nextChild, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        } else if (moved) {
          if (j < 0 || i !== increasingNewIndexSequence[j]) {
            move(nextChild, container, anchor, 2);
          } else {
            j--;
          }
        }
      }
    }
  };
  const move = (vnode, container, anchor, moveType, parentSuspense = null) => {
    const { el: el2, type: type2, transition, children, shapeFlag } = vnode;
    if (shapeFlag & 6) {
      move(vnode.component.subTree, container, anchor, moveType);
      return;
    }
    if (shapeFlag & 128) {
      vnode.suspense.move(container, anchor, moveType);
      return;
    }
    if (shapeFlag & 64) {
      type2.move(vnode, container, anchor, internals);
      return;
    }
    if (type2 === Fragment) {
      hostInsert(el2, container, anchor);
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, anchor, moveType);
      }
      hostInsert(vnode.anchor, container, anchor);
      return;
    }
    if (type2 === Static) {
      moveStaticNode(vnode, container, anchor);
      return;
    }
    const needTransition = moveType !== 2 && shapeFlag & 1 && transition;
    if (needTransition) {
      if (moveType === 0) {
        transition.beforeEnter(el2);
        hostInsert(el2, container, anchor);
        queuePostRenderEffect(() => transition.enter(el2), parentSuspense);
      } else {
        const { leave, delayLeave, afterLeave } = transition;
        const remove3 = () => hostInsert(el2, container, anchor);
        const performLeave = () => {
          leave(el2, () => {
            remove3();
            afterLeave && afterLeave();
          });
        };
        if (delayLeave) {
          delayLeave(el2, remove3, performLeave);
        } else {
          performLeave();
        }
      }
    } else {
      hostInsert(el2, container, anchor);
    }
  };
  const unmount = (vnode, parentComponent, parentSuspense, doRemove = false, optimized = false) => {
    const { type: type2, props, ref: ref2, children, dynamicChildren, shapeFlag, patchFlag, dirs } = vnode;
    if (ref2 != null) {
      setRef(ref2, null, parentSuspense, vnode, true);
    }
    if (shapeFlag & 256) {
      parentComponent.ctx.deactivate(vnode);
      return;
    }
    const shouldInvokeDirs = shapeFlag & 1 && dirs;
    const shouldInvokeVnodeHook = !isAsyncWrapper(vnode);
    let vnodeHook;
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeBeforeUnmount)) {
      invokeVNodeHook(vnodeHook, parentComponent, vnode);
    }
    if (shapeFlag & 6) {
      unmountComponent(vnode.component, parentSuspense, doRemove);
    } else {
      if (shapeFlag & 128) {
        vnode.suspense.unmount(parentSuspense, doRemove);
        return;
      }
      if (shouldInvokeDirs) {
        invokeDirectiveHook(vnode, null, parentComponent, "beforeUnmount");
      }
      if (shapeFlag & 64) {
        vnode.type.remove(vnode, parentComponent, parentSuspense, optimized, internals, doRemove);
      } else if (dynamicChildren && (type2 !== Fragment || patchFlag > 0 && patchFlag & 64)) {
        unmountChildren(dynamicChildren, parentComponent, parentSuspense, false, true);
      } else if (type2 === Fragment && patchFlag & (128 | 256) || !optimized && shapeFlag & 16) {
        unmountChildren(children, parentComponent, parentSuspense);
      }
      if (doRemove) {
        remove2(vnode);
      }
    }
    if (shouldInvokeVnodeHook && (vnodeHook = props && props.onVnodeUnmounted) || shouldInvokeDirs) {
      queuePostRenderEffect(() => {
        vnodeHook && invokeVNodeHook(vnodeHook, parentComponent, vnode);
        shouldInvokeDirs && invokeDirectiveHook(vnode, null, parentComponent, "unmounted");
      }, parentSuspense);
    }
  };
  const remove2 = (vnode) => {
    const { type: type2, el: el2, anchor, transition } = vnode;
    if (type2 === Fragment) {
      removeFragment(el2, anchor);
      return;
    }
    if (type2 === Static) {
      removeStaticNode(vnode);
      return;
    }
    const performRemove = () => {
      hostRemove(el2);
      if (transition && !transition.persisted && transition.afterLeave) {
        transition.afterLeave();
      }
    };
    if (vnode.shapeFlag & 1 && transition && !transition.persisted) {
      const { leave, delayLeave } = transition;
      const performLeave = () => leave(el2, performRemove);
      if (delayLeave) {
        delayLeave(vnode.el, performRemove, performLeave);
      } else {
        performLeave();
      }
    } else {
      performRemove();
    }
  };
  const removeFragment = (cur, end2) => {
    let next;
    while (cur !== end2) {
      next = hostNextSibling(cur);
      hostRemove(cur);
      cur = next;
    }
    hostRemove(end2);
  };
  const unmountComponent = (instance, parentSuspense, doRemove) => {
    const { bum, scope, update, subTree, um } = instance;
    if (bum) {
      invokeArrayFns(bum);
    }
    scope.stop();
    if (update) {
      update.active = false;
      unmount(subTree, instance, parentSuspense, doRemove);
    }
    if (um) {
      queuePostRenderEffect(um, parentSuspense);
    }
    queuePostRenderEffect(() => {
      instance.isUnmounted = true;
    }, parentSuspense);
    if (parentSuspense && parentSuspense.pendingBranch && !parentSuspense.isUnmounted && instance.asyncDep && !instance.asyncResolved && instance.suspenseId === parentSuspense.pendingId) {
      parentSuspense.deps--;
      if (parentSuspense.deps === 0) {
        parentSuspense.resolve();
      }
    }
  };
  const unmountChildren = (children, parentComponent, parentSuspense, doRemove = false, optimized = false, start2 = 0) => {
    for (let i = start2; i < children.length; i++) {
      unmount(children[i], parentComponent, parentSuspense, doRemove, optimized);
    }
  };
  const getNextHostNode = (vnode) => {
    if (vnode.shapeFlag & 6) {
      return getNextHostNode(vnode.component.subTree);
    }
    if (vnode.shapeFlag & 128) {
      return vnode.suspense.next();
    }
    return hostNextSibling(vnode.anchor || vnode.el);
  };
  const render2 = (vnode, container, isSVG) => {
    if (vnode == null) {
      if (container._vnode) {
        unmount(container._vnode, null, null, true);
      }
    } else {
      patch(container._vnode || null, vnode, container, null, null, null, isSVG);
    }
    flushPostFlushCbs();
    container._vnode = vnode;
  };
  const internals = {
    p: patch,
    um: unmount,
    m: move,
    r: remove2,
    mt: mountComponent,
    mc: mountChildren,
    pc: patchChildren,
    pbc: patchBlockChildren,
    n: getNextHostNode,
    o: options
  };
  let hydrate2;
  let hydrateNode;
  if (createHydrationFns) {
    [hydrate2, hydrateNode] = createHydrationFns(internals);
  }
  return {
    render: render2,
    hydrate: hydrate2,
    createApp: createAppAPI(render2, hydrate2)
  };
}
function toggleRecurse({ effect: effect2, update }, allowed) {
  effect2.allowRecurse = update.allowRecurse = allowed;
}
function traverseStaticChildren(n1, n2, shallow = false) {
  const ch1 = n1.children;
  const ch2 = n2.children;
  if (isArray(ch1) && isArray(ch2)) {
    for (let i = 0; i < ch1.length; i++) {
      const c1 = ch1[i];
      let c2 = ch2[i];
      if (c2.shapeFlag & 1 && !c2.dynamicChildren) {
        if (c2.patchFlag <= 0 || c2.patchFlag === 32) {
          c2 = ch2[i] = cloneIfMounted(ch2[i]);
          c2.el = c1.el;
        }
        if (!shallow)
          traverseStaticChildren(c1, c2);
      }
    }
  }
}
function getSequence(arr) {
  const p2 = arr.slice();
  const result = [0];
  let i, j, u, v, c;
  const len = arr.length;
  for (i = 0; i < len; i++) {
    const arrI = arr[i];
    if (arrI !== 0) {
      j = result[result.length - 1];
      if (arr[j] < arrI) {
        p2[i] = j;
        result.push(i);
        continue;
      }
      u = 0;
      v = result.length - 1;
      while (u < v) {
        c = u + v >> 1;
        if (arr[result[c]] < arrI) {
          u = c + 1;
        } else {
          v = c;
        }
      }
      if (arrI < arr[result[u]]) {
        if (u > 0) {
          p2[i] = result[u - 1];
        }
        result[u] = i;
      }
    }
  }
  u = result.length;
  v = result[u - 1];
  while (u-- > 0) {
    result[u] = v;
    v = p2[v];
  }
  return result;
}
const isTeleport = (type2) => type2.__isTeleport;
const isTeleportDisabled = (props) => props && (props.disabled || props.disabled === "");
const isTargetSVG = (target2) => typeof SVGElement !== "undefined" && target2 instanceof SVGElement;
const resolveTarget = (props, select) => {
  const targetSelector = props && props.to;
  if (isString(targetSelector)) {
    if (!select) {
      return null;
    } else {
      const target2 = select(targetSelector);
      return target2;
    }
  } else {
    return targetSelector;
  }
};
const TeleportImpl = {
  __isTeleport: true,
  process(n1, n2, container, anchor, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized, internals) {
    const { mc: mountChildren, pc: patchChildren, pbc: patchBlockChildren, o: { insert, querySelector, createText, createComment } } = internals;
    const disabled = isTeleportDisabled(n2.props);
    let { shapeFlag, children, dynamicChildren } = n2;
    if (n1 == null) {
      const placeholder = n2.el = createText("");
      const mainAnchor = n2.anchor = createText("");
      insert(placeholder, container, anchor);
      insert(mainAnchor, container, anchor);
      const target2 = n2.target = resolveTarget(n2.props, querySelector);
      const targetAnchor = n2.targetAnchor = createText("");
      if (target2) {
        insert(targetAnchor, target2);
        isSVG = isSVG || isTargetSVG(target2);
      }
      const mount = (container2, anchor2) => {
        if (shapeFlag & 16) {
          mountChildren(children, container2, anchor2, parentComponent, parentSuspense, isSVG, slotScopeIds, optimized);
        }
      };
      if (disabled) {
        mount(container, mainAnchor);
      } else if (target2) {
        mount(target2, targetAnchor);
      }
    } else {
      n2.el = n1.el;
      const mainAnchor = n2.anchor = n1.anchor;
      const target2 = n2.target = n1.target;
      const targetAnchor = n2.targetAnchor = n1.targetAnchor;
      const wasDisabled = isTeleportDisabled(n1.props);
      const currentContainer = wasDisabled ? container : target2;
      const currentAnchor = wasDisabled ? mainAnchor : targetAnchor;
      isSVG = isSVG || isTargetSVG(target2);
      if (dynamicChildren) {
        patchBlockChildren(n1.dynamicChildren, dynamicChildren, currentContainer, parentComponent, parentSuspense, isSVG, slotScopeIds);
        traverseStaticChildren(n1, n2, true);
      } else if (!optimized) {
        patchChildren(n1, n2, currentContainer, currentAnchor, parentComponent, parentSuspense, isSVG, slotScopeIds, false);
      }
      if (disabled) {
        if (!wasDisabled) {
          moveTeleport(n2, container, mainAnchor, internals, 1);
        }
      } else {
        if ((n2.props && n2.props.to) !== (n1.props && n1.props.to)) {
          const nextTarget = n2.target = resolveTarget(n2.props, querySelector);
          if (nextTarget) {
            moveTeleport(n2, nextTarget, null, internals, 0);
          }
        } else if (wasDisabled) {
          moveTeleport(n2, target2, targetAnchor, internals, 1);
        }
      }
    }
  },
  remove(vnode, parentComponent, parentSuspense, optimized, { um: unmount, o: { remove: hostRemove } }, doRemove) {
    const { shapeFlag, children, anchor, targetAnchor, target: target2, props } = vnode;
    if (target2) {
      hostRemove(targetAnchor);
    }
    if (doRemove || !isTeleportDisabled(props)) {
      hostRemove(anchor);
      if (shapeFlag & 16) {
        for (let i = 0; i < children.length; i++) {
          const child = children[i];
          unmount(child, parentComponent, parentSuspense, true, !!child.dynamicChildren);
        }
      }
    }
  },
  move: moveTeleport,
  hydrate: hydrateTeleport
};
function moveTeleport(vnode, container, parentAnchor, { o: { insert }, m: move }, moveType = 2) {
  if (moveType === 0) {
    insert(vnode.targetAnchor, container, parentAnchor);
  }
  const { el: el2, anchor, shapeFlag, children, props } = vnode;
  const isReorder = moveType === 2;
  if (isReorder) {
    insert(el2, container, parentAnchor);
  }
  if (!isReorder || isTeleportDisabled(props)) {
    if (shapeFlag & 16) {
      for (let i = 0; i < children.length; i++) {
        move(children[i], container, parentAnchor, 2);
      }
    }
  }
  if (isReorder) {
    insert(anchor, container, parentAnchor);
  }
}
function hydrateTeleport(node2, vnode, parentComponent, parentSuspense, slotScopeIds, optimized, { o: { nextSibling, parentNode, querySelector } }, hydrateChildren) {
  const target2 = vnode.target = resolveTarget(vnode.props, querySelector);
  if (target2) {
    const targetNode = target2._lpa || target2.firstChild;
    if (vnode.shapeFlag & 16) {
      if (isTeleportDisabled(vnode.props)) {
        vnode.anchor = hydrateChildren(nextSibling(node2), vnode, parentNode(node2), parentComponent, parentSuspense, slotScopeIds, optimized);
        vnode.targetAnchor = targetNode;
      } else {
        vnode.anchor = nextSibling(node2);
        vnode.targetAnchor = hydrateChildren(targetNode, vnode, target2, parentComponent, parentSuspense, slotScopeIds, optimized);
      }
      target2._lpa = vnode.targetAnchor && nextSibling(vnode.targetAnchor);
    }
  }
  return vnode.anchor && nextSibling(vnode.anchor);
}
const Teleport = TeleportImpl;
const COMPONENTS = "components";
const DIRECTIVES = "directives";
function resolveComponent(name, maybeSelfReference) {
  return resolveAsset(COMPONENTS, name, true, maybeSelfReference) || name;
}
const NULL_DYNAMIC_COMPONENT = Symbol();
function resolveDynamicComponent(component) {
  if (isString(component)) {
    return resolveAsset(COMPONENTS, component, false) || component;
  } else {
    return component || NULL_DYNAMIC_COMPONENT;
  }
}
function resolveDirective(name) {
  return resolveAsset(DIRECTIVES, name);
}
function resolveAsset(type2, name, warnMissing = true, maybeSelfReference = false) {
  const instance = currentRenderingInstance || currentInstance;
  if (instance) {
    const Component = instance.type;
    if (type2 === COMPONENTS) {
      const selfName = getComponentName(Component);
      if (selfName && (selfName === name || selfName === camelize(name) || selfName === capitalize(camelize(name)))) {
        return Component;
      }
    }
    const res = resolve(instance[type2] || Component[type2], name) || resolve(instance.appContext[type2], name);
    if (!res && maybeSelfReference) {
      return Component;
    }
    return res;
  }
}
function resolve(registry, name) {
  return registry && (registry[name] || registry[camelize(name)] || registry[capitalize(camelize(name))]);
}
const Fragment = Symbol(void 0);
const Text$1 = Symbol(void 0);
const Comment$1 = Symbol(void 0);
const Static = Symbol(void 0);
const blockStack = [];
let currentBlock = null;
function openBlock(disableTracking = false) {
  blockStack.push(currentBlock = disableTracking ? null : []);
}
function closeBlock() {
  blockStack.pop();
  currentBlock = blockStack[blockStack.length - 1] || null;
}
let isBlockTreeEnabled = 1;
function setBlockTracking(value) {
  isBlockTreeEnabled += value;
}
function setupBlock(vnode) {
  vnode.dynamicChildren = isBlockTreeEnabled > 0 ? currentBlock || EMPTY_ARR : null;
  closeBlock();
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(vnode);
  }
  return vnode;
}
function createElementBlock(type2, props, children, patchFlag, dynamicProps, shapeFlag) {
  return setupBlock(createBaseVNode(type2, props, children, patchFlag, dynamicProps, shapeFlag, true));
}
function createBlock(type2, props, children, patchFlag, dynamicProps) {
  return setupBlock(createVNode(type2, props, children, patchFlag, dynamicProps, true));
}
function isVNode(value) {
  return value ? value.__v_isVNode === true : false;
}
function isSameVNodeType(n1, n2) {
  return n1.type === n2.type && n1.key === n2.key;
}
function transformVNodeArgs(transformer) {
}
const InternalObjectKey = `__vInternal`;
const normalizeKey = ({ key }) => key != null ? key : null;
const normalizeRef = ({ ref: ref2, ref_key, ref_for }) => {
  return ref2 != null ? isString(ref2) || isRef(ref2) || isFunction$1(ref2) ? { i: currentRenderingInstance, r: ref2, k: ref_key, f: !!ref_for } : ref2 : null;
};
function createBaseVNode(type2, props = null, children = null, patchFlag = 0, dynamicProps = null, shapeFlag = type2 === Fragment ? 0 : 1, isBlockNode = false, needFullChildrenNormalization = false) {
  const vnode = {
    __v_isVNode: true,
    __v_skip: true,
    type: type2,
    props,
    key: props && normalizeKey(props),
    ref: props && normalizeRef(props),
    scopeId: currentScopeId,
    slotScopeIds: null,
    children,
    component: null,
    suspense: null,
    ssContent: null,
    ssFallback: null,
    dirs: null,
    transition: null,
    el: null,
    anchor: null,
    target: null,
    targetAnchor: null,
    staticCount: 0,
    shapeFlag,
    patchFlag,
    dynamicProps,
    dynamicChildren: null,
    appContext: null
  };
  if (needFullChildrenNormalization) {
    normalizeChildren(vnode, children);
    if (shapeFlag & 128) {
      type2.normalize(vnode);
    }
  } else if (children) {
    vnode.shapeFlag |= isString(children) ? 8 : 16;
  }
  if (isBlockTreeEnabled > 0 && !isBlockNode && currentBlock && (vnode.patchFlag > 0 || shapeFlag & 6) && vnode.patchFlag !== 32) {
    currentBlock.push(vnode);
  }
  return vnode;
}
const createVNode = _createVNode;
function _createVNode(type2, props = null, children = null, patchFlag = 0, dynamicProps = null, isBlockNode = false) {
  if (!type2 || type2 === NULL_DYNAMIC_COMPONENT) {
    type2 = Comment$1;
  }
  if (isVNode(type2)) {
    const cloned = cloneVNode(type2, props, true);
    if (children) {
      normalizeChildren(cloned, children);
    }
    return cloned;
  }
  if (isClassComponent(type2)) {
    type2 = type2.__vccOpts;
  }
  if (props) {
    props = guardReactiveProps(props);
    let { class: klass, style } = props;
    if (klass && !isString(klass)) {
      props.class = normalizeClass(klass);
    }
    if (isObject(style)) {
      if (isProxy(style) && !isArray(style)) {
        style = extend({}, style);
      }
      props.style = normalizeStyle(style);
    }
  }
  const shapeFlag = isString(type2) ? 1 : isSuspense(type2) ? 128 : isTeleport(type2) ? 64 : isObject(type2) ? 4 : isFunction$1(type2) ? 2 : 0;
  return createBaseVNode(type2, props, children, patchFlag, dynamicProps, shapeFlag, isBlockNode, true);
}
function guardReactiveProps(props) {
  if (!props)
    return null;
  return isProxy(props) || InternalObjectKey in props ? extend({}, props) : props;
}
function cloneVNode(vnode, extraProps, mergeRef = false) {
  const { props, ref: ref2, patchFlag, children } = vnode;
  const mergedProps = extraProps ? mergeProps(props || {}, extraProps) : props;
  const cloned = {
    __v_isVNode: true,
    __v_skip: true,
    type: vnode.type,
    props: mergedProps,
    key: mergedProps && normalizeKey(mergedProps),
    ref: extraProps && extraProps.ref ? mergeRef && ref2 ? isArray(ref2) ? ref2.concat(normalizeRef(extraProps)) : [ref2, normalizeRef(extraProps)] : normalizeRef(extraProps) : ref2,
    scopeId: vnode.scopeId,
    slotScopeIds: vnode.slotScopeIds,
    children,
    target: vnode.target,
    targetAnchor: vnode.targetAnchor,
    staticCount: vnode.staticCount,
    shapeFlag: vnode.shapeFlag,
    patchFlag: extraProps && vnode.type !== Fragment ? patchFlag === -1 ? 16 : patchFlag | 16 : patchFlag,
    dynamicProps: vnode.dynamicProps,
    dynamicChildren: vnode.dynamicChildren,
    appContext: vnode.appContext,
    dirs: vnode.dirs,
    transition: vnode.transition,
    component: vnode.component,
    suspense: vnode.suspense,
    ssContent: vnode.ssContent && cloneVNode(vnode.ssContent),
    ssFallback: vnode.ssFallback && cloneVNode(vnode.ssFallback),
    el: vnode.el,
    anchor: vnode.anchor
  };
  return cloned;
}
function createTextVNode(text2 = " ", flag = 0) {
  return createVNode(Text$1, null, text2, flag);
}
function createStaticVNode(content, numberOfNodes) {
  const vnode = createVNode(Static, null, content);
  vnode.staticCount = numberOfNodes;
  return vnode;
}
function createCommentVNode(text2 = "", asBlock = false) {
  return asBlock ? (openBlock(), createBlock(Comment$1, null, text2)) : createVNode(Comment$1, null, text2);
}
function normalizeVNode(child) {
  if (child == null || typeof child === "boolean") {
    return createVNode(Comment$1);
  } else if (isArray(child)) {
    return createVNode(Fragment, null, child.slice());
  } else if (typeof child === "object") {
    return cloneIfMounted(child);
  } else {
    return createVNode(Text$1, null, String(child));
  }
}
function cloneIfMounted(child) {
  return child.el === null || child.memo ? child : cloneVNode(child);
}
function normalizeChildren(vnode, children) {
  let type2 = 0;
  const { shapeFlag } = vnode;
  if (children == null) {
    children = null;
  } else if (isArray(children)) {
    type2 = 16;
  } else if (typeof children === "object") {
    if (shapeFlag & (1 | 64)) {
      const slot = children.default;
      if (slot) {
        slot._c && (slot._d = false);
        normalizeChildren(vnode, slot());
        slot._c && (slot._d = true);
      }
      return;
    } else {
      type2 = 32;
      const slotFlag = children._;
      if (!slotFlag && !(InternalObjectKey in children)) {
        children._ctx = currentRenderingInstance;
      } else if (slotFlag === 3 && currentRenderingInstance) {
        if (currentRenderingInstance.slots._ === 1) {
          children._ = 1;
        } else {
          children._ = 2;
          vnode.patchFlag |= 1024;
        }
      }
    }
  } else if (isFunction$1(children)) {
    children = { default: children, _ctx: currentRenderingInstance };
    type2 = 32;
  } else {
    children = String(children);
    if (shapeFlag & 64) {
      type2 = 16;
      children = [createTextVNode(children)];
    } else {
      type2 = 8;
    }
  }
  vnode.children = children;
  vnode.shapeFlag |= type2;
}
function mergeProps(...args) {
  const ret = {};
  for (let i = 0; i < args.length; i++) {
    const toMerge = args[i];
    for (const key in toMerge) {
      if (key === "class") {
        if (ret.class !== toMerge.class) {
          ret.class = normalizeClass([ret.class, toMerge.class]);
        }
      } else if (key === "style") {
        ret.style = normalizeStyle([ret.style, toMerge.style]);
      } else if (isOn(key)) {
        const existing = ret[key];
        const incoming = toMerge[key];
        if (incoming && existing !== incoming && !(isArray(existing) && existing.includes(incoming))) {
          ret[key] = existing ? [].concat(existing, incoming) : incoming;
        }
      } else if (key !== "") {
        ret[key] = toMerge[key];
      }
    }
  }
  return ret;
}
function invokeVNodeHook(hook, instance, vnode, prevVNode = null) {
  callWithAsyncErrorHandling(hook, instance, 7, [
    vnode,
    prevVNode
  ]);
}
function renderList(source, renderItem, cache, index2) {
  let ret;
  const cached = cache && cache[index2];
  if (isArray(source) || isString(source)) {
    ret = new Array(source.length);
    for (let i = 0, l = source.length; i < l; i++) {
      ret[i] = renderItem(source[i], i, void 0, cached && cached[i]);
    }
  } else if (typeof source === "number") {
    ret = new Array(source);
    for (let i = 0; i < source; i++) {
      ret[i] = renderItem(i + 1, i, void 0, cached && cached[i]);
    }
  } else if (isObject(source)) {
    if (source[Symbol.iterator]) {
      ret = Array.from(source, (item, i) => renderItem(item, i, void 0, cached && cached[i]));
    } else {
      const keys = Object.keys(source);
      ret = new Array(keys.length);
      for (let i = 0, l = keys.length; i < l; i++) {
        const key = keys[i];
        ret[i] = renderItem(source[key], key, i, cached && cached[i]);
      }
    }
  } else {
    ret = [];
  }
  if (cache) {
    cache[index2] = ret;
  }
  return ret;
}
function createSlots(slots, dynamicSlots) {
  for (let i = 0; i < dynamicSlots.length; i++) {
    const slot = dynamicSlots[i];
    if (isArray(slot)) {
      for (let j = 0; j < slot.length; j++) {
        slots[slot[j].name] = slot[j].fn;
      }
    } else if (slot) {
      slots[slot.name] = slot.fn;
    }
  }
  return slots;
}
function renderSlot(slots, name, props = {}, fallback, noSlotted) {
  if (currentRenderingInstance.isCE) {
    return createVNode("slot", name === "default" ? null : { name }, fallback && fallback());
  }
  let slot = slots[name];
  if (slot && slot._c) {
    slot._d = false;
  }
  openBlock();
  const validSlotContent = slot && ensureValidVNode(slot(props));
  const rendered = createBlock(Fragment, { key: props.key || `_${name}` }, validSlotContent || (fallback ? fallback() : []), validSlotContent && slots._ === 1 ? 64 : -2);
  if (!noSlotted && rendered.scopeId) {
    rendered.slotScopeIds = [rendered.scopeId + "-s"];
  }
  if (slot && slot._c) {
    slot._d = true;
  }
  return rendered;
}
function ensureValidVNode(vnodes) {
  return vnodes.some((child) => {
    if (!isVNode(child))
      return true;
    if (child.type === Comment$1)
      return false;
    if (child.type === Fragment && !ensureValidVNode(child.children))
      return false;
    return true;
  }) ? vnodes : null;
}
function toHandlers(obj) {
  const ret = {};
  for (const key in obj) {
    ret[toHandlerKey(key)] = obj[key];
  }
  return ret;
}
const getPublicInstance = (i) => {
  if (!i)
    return null;
  if (isStatefulComponent(i))
    return getExposeProxy(i) || i.proxy;
  return getPublicInstance(i.parent);
};
const publicPropertiesMap = extend(Object.create(null), {
  $: (i) => i,
  $el: (i) => i.vnode.el,
  $data: (i) => i.data,
  $props: (i) => i.props,
  $attrs: (i) => i.attrs,
  $slots: (i) => i.slots,
  $refs: (i) => i.refs,
  $parent: (i) => getPublicInstance(i.parent),
  $root: (i) => getPublicInstance(i.root),
  $emit: (i) => i.emit,
  $options: (i) => resolveMergedOptions(i),
  $forceUpdate: (i) => () => queueJob(i.update),
  $nextTick: (i) => nextTick.bind(i.proxy),
  $watch: (i) => instanceWatch.bind(i)
});
const PublicInstanceProxyHandlers = {
  get({ _: instance }, key) {
    const { ctx, setupState, data, props, accessCache, type: type2, appContext } = instance;
    let normalizedProps;
    if (key[0] !== "$") {
      const n = accessCache[key];
      if (n !== void 0) {
        switch (n) {
          case 1:
            return setupState[key];
          case 2:
            return data[key];
          case 4:
            return ctx[key];
          case 3:
            return props[key];
        }
      } else if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
        accessCache[key] = 1;
        return setupState[key];
      } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
        accessCache[key] = 2;
        return data[key];
      } else if ((normalizedProps = instance.propsOptions[0]) && hasOwn(normalizedProps, key)) {
        accessCache[key] = 3;
        return props[key];
      } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
        accessCache[key] = 4;
        return ctx[key];
      } else if (shouldCacheAccess) {
        accessCache[key] = 0;
      }
    }
    const publicGetter = publicPropertiesMap[key];
    let cssModule, globalProperties;
    if (publicGetter) {
      if (key === "$attrs") {
        track(instance, "get", key);
      }
      return publicGetter(instance);
    } else if ((cssModule = type2.__cssModules) && (cssModule = cssModule[key])) {
      return cssModule;
    } else if (ctx !== EMPTY_OBJ && hasOwn(ctx, key)) {
      accessCache[key] = 4;
      return ctx[key];
    } else if (globalProperties = appContext.config.globalProperties, hasOwn(globalProperties, key)) {
      {
        return globalProperties[key];
      }
    } else
      ;
  },
  set({ _: instance }, key, value) {
    const { data, setupState, ctx } = instance;
    if (setupState !== EMPTY_OBJ && hasOwn(setupState, key)) {
      setupState[key] = value;
    } else if (data !== EMPTY_OBJ && hasOwn(data, key)) {
      data[key] = value;
    } else if (hasOwn(instance.props, key)) {
      return false;
    }
    if (key[0] === "$" && key.slice(1) in instance) {
      return false;
    } else {
      {
        ctx[key] = value;
      }
    }
    return true;
  },
  has({ _: { data, setupState, accessCache, ctx, appContext, propsOptions } }, key) {
    let normalizedProps;
    return !!accessCache[key] || data !== EMPTY_OBJ && hasOwn(data, key) || setupState !== EMPTY_OBJ && hasOwn(setupState, key) || (normalizedProps = propsOptions[0]) && hasOwn(normalizedProps, key) || hasOwn(ctx, key) || hasOwn(publicPropertiesMap, key) || hasOwn(appContext.config.globalProperties, key);
  }
};
const RuntimeCompiledPublicInstanceProxyHandlers = /* @__PURE__ */ extend({}, PublicInstanceProxyHandlers, {
  get(target2, key) {
    if (key === Symbol.unscopables) {
      return;
    }
    return PublicInstanceProxyHandlers.get(target2, key, target2);
  },
  has(_, key) {
    const has2 = key[0] !== "_" && !isGloballyWhitelisted(key);
    return has2;
  }
});
const emptyAppContext = createAppContext();
let uid$1$1 = 0;
function createComponentInstance(vnode, parent, suspense) {
  const type2 = vnode.type;
  const appContext = (parent ? parent.appContext : vnode.appContext) || emptyAppContext;
  const instance = {
    uid: uid$1$1++,
    vnode,
    type: type2,
    parent,
    appContext,
    root: null,
    next: null,
    subTree: null,
    effect: null,
    update: null,
    scope: new EffectScope(true),
    render: null,
    proxy: null,
    exposed: null,
    exposeProxy: null,
    withProxy: null,
    provides: parent ? parent.provides : Object.create(appContext.provides),
    accessCache: null,
    renderCache: [],
    components: null,
    directives: null,
    propsOptions: normalizePropsOptions(type2, appContext),
    emitsOptions: normalizeEmitsOptions(type2, appContext),
    emit: null,
    emitted: null,
    propsDefaults: EMPTY_OBJ,
    inheritAttrs: type2.inheritAttrs,
    ctx: EMPTY_OBJ,
    data: EMPTY_OBJ,
    props: EMPTY_OBJ,
    attrs: EMPTY_OBJ,
    slots: EMPTY_OBJ,
    refs: EMPTY_OBJ,
    setupState: EMPTY_OBJ,
    setupContext: null,
    suspense,
    suspenseId: suspense ? suspense.pendingId : 0,
    asyncDep: null,
    asyncResolved: false,
    isMounted: false,
    isUnmounted: false,
    isDeactivated: false,
    bc: null,
    c: null,
    bm: null,
    m: null,
    bu: null,
    u: null,
    um: null,
    bum: null,
    da: null,
    a: null,
    rtg: null,
    rtc: null,
    ec: null,
    sp: null
  };
  {
    instance.ctx = { _: instance };
  }
  instance.root = parent ? parent.root : instance;
  instance.emit = emit$1.bind(null, instance);
  if (vnode.ce) {
    vnode.ce(instance);
  }
  return instance;
}
let currentInstance = null;
const getCurrentInstance$1 = () => currentInstance || currentRenderingInstance;
const setCurrentInstance = (instance) => {
  currentInstance = instance;
  instance.scope.on();
};
const unsetCurrentInstance = () => {
  currentInstance && currentInstance.scope.off();
  currentInstance = null;
};
function isStatefulComponent(instance) {
  return instance.vnode.shapeFlag & 4;
}
let isInSSRComponentSetup = false;
function setupComponent(instance, isSSR = false) {
  isInSSRComponentSetup = isSSR;
  const { props, children } = instance.vnode;
  const isStateful = isStatefulComponent(instance);
  initProps(instance, props, isStateful, isSSR);
  initSlots(instance, children);
  const setupResult = isStateful ? setupStatefulComponent(instance, isSSR) : void 0;
  isInSSRComponentSetup = false;
  return setupResult;
}
function setupStatefulComponent(instance, isSSR) {
  const Component = instance.type;
  instance.accessCache = Object.create(null);
  instance.proxy = markRaw(new Proxy(instance.ctx, PublicInstanceProxyHandlers));
  const { setup } = Component;
  if (setup) {
    const setupContext = instance.setupContext = setup.length > 1 ? createSetupContext(instance) : null;
    setCurrentInstance(instance);
    pauseTracking();
    const setupResult = callWithErrorHandling(setup, instance, 0, [instance.props, setupContext]);
    resetTracking();
    unsetCurrentInstance();
    if (isPromise(setupResult)) {
      setupResult.then(unsetCurrentInstance, unsetCurrentInstance);
      if (isSSR) {
        return setupResult.then((resolvedResult) => {
          handleSetupResult(instance, resolvedResult, isSSR);
        }).catch((e) => {
          handleError(e, instance, 0);
        });
      } else {
        instance.asyncDep = setupResult;
      }
    } else {
      handleSetupResult(instance, setupResult, isSSR);
    }
  } else {
    finishComponentSetup(instance, isSSR);
  }
}
function handleSetupResult(instance, setupResult, isSSR) {
  if (isFunction$1(setupResult)) {
    if (instance.type.__ssrInlineRender) {
      instance.ssrRender = setupResult;
    } else {
      instance.render = setupResult;
    }
  } else if (isObject(setupResult)) {
    instance.setupState = proxyRefs(setupResult);
  } else
    ;
  finishComponentSetup(instance, isSSR);
}
let compile$5;
let installWithProxy;
function registerRuntimeCompiler(_compile) {
  compile$5 = _compile;
  installWithProxy = (i) => {
    if (i.render._rc) {
      i.withProxy = new Proxy(i.ctx, RuntimeCompiledPublicInstanceProxyHandlers);
    }
  };
}
const isRuntimeOnly = () => !compile$5;
function finishComponentSetup(instance, isSSR, skipOptions) {
  const Component = instance.type;
  if (!instance.render) {
    if (!isSSR && compile$5 && !Component.render) {
      const template = Component.template;
      if (template) {
        const { isCustomElement, compilerOptions } = instance.appContext.config;
        const { delimiters, compilerOptions: componentCompilerOptions } = Component;
        const finalCompilerOptions = extend(extend({
          isCustomElement,
          delimiters
        }, compilerOptions), componentCompilerOptions);
        Component.render = compile$5(template, finalCompilerOptions);
      }
    }
    instance.render = Component.render || NOOP;
    if (installWithProxy) {
      installWithProxy(instance);
    }
  }
  {
    setCurrentInstance(instance);
    pauseTracking();
    applyOptions(instance);
    resetTracking();
    unsetCurrentInstance();
  }
}
function createAttrsProxy(instance) {
  return new Proxy(instance.attrs, {
    get(target2, key) {
      track(instance, "get", "$attrs");
      return target2[key];
    }
  });
}
function createSetupContext(instance) {
  const expose = (exposed) => {
    instance.exposed = exposed || {};
  };
  let attrs;
  {
    return {
      get attrs() {
        return attrs || (attrs = createAttrsProxy(instance));
      },
      slots: instance.slots,
      emit: instance.emit,
      expose
    };
  }
}
function getExposeProxy(instance) {
  if (instance.exposed) {
    return instance.exposeProxy || (instance.exposeProxy = new Proxy(proxyRefs(markRaw(instance.exposed)), {
      get(target2, key) {
        if (key in target2) {
          return target2[key];
        } else if (key in publicPropertiesMap) {
          return publicPropertiesMap[key](instance);
        }
      }
    }));
  }
}
const classifyRE = /(?:^|[-_])(\w)/g;
const classify = (str) => str.replace(classifyRE, (c) => c.toUpperCase()).replace(/[-_]/g, "");
function getComponentName(Component) {
  return isFunction$1(Component) ? Component.displayName || Component.name : Component.name;
}
function formatComponentName(instance, Component, isRoot = false) {
  let name = getComponentName(Component);
  if (!name && Component.__file) {
    const match2 = Component.__file.match(/([^/\\]+)\.\w+$/);
    if (match2) {
      name = match2[1];
    }
  }
  if (!name && instance && instance.parent) {
    const inferFromRegistry = (registry) => {
      for (const key in registry) {
        if (registry[key] === Component) {
          return key;
        }
      }
    };
    name = inferFromRegistry(instance.components || instance.parent.type.components) || inferFromRegistry(instance.appContext.components);
  }
  return name ? classify(name) : isRoot ? `App` : `Anonymous`;
}
function isClassComponent(value) {
  return isFunction$1(value) && "__vccOpts" in value;
}
const computed = (getterOrOptions, debugOptions) => {
  return computed$1(getterOrOptions, debugOptions, isInSSRComponentSetup);
};
function defineProps() {
  return null;
}
function defineEmits() {
  return null;
}
function defineExpose(exposed) {
}
function withDefaults(props, defaults) {
  return null;
}
function useSlots() {
  return getContext().slots;
}
function useAttrs() {
  return getContext().attrs;
}
function getContext() {
  const i = getCurrentInstance$1();
  return i.setupContext || (i.setupContext = createSetupContext(i));
}
function mergeDefaults(raw, defaults) {
  const props = isArray(raw) ? raw.reduce((normalized, p2) => (normalized[p2] = {}, normalized), {}) : raw;
  for (const key in defaults) {
    const opt = props[key];
    if (opt) {
      if (isArray(opt) || isFunction$1(opt)) {
        props[key] = { type: opt, default: defaults[key] };
      } else {
        opt.default = defaults[key];
      }
    } else if (opt === null) {
      props[key] = { default: defaults[key] };
    } else
      ;
  }
  return props;
}
function createPropsRestProxy(props, excludedKeys) {
  const ret = {};
  for (const key in props) {
    if (!excludedKeys.includes(key)) {
      Object.defineProperty(ret, key, {
        enumerable: true,
        get: () => props[key]
      });
    }
  }
  return ret;
}
function withAsyncContext(getAwaitable) {
  const ctx = getCurrentInstance$1();
  let awaitable = getAwaitable();
  unsetCurrentInstance();
  if (isPromise(awaitable)) {
    awaitable = awaitable.catch((e) => {
      setCurrentInstance(ctx);
      throw e;
    });
  }
  return [awaitable, () => setCurrentInstance(ctx)];
}
function h(type2, propsOrChildren, children) {
  const l = arguments.length;
  if (l === 2) {
    if (isObject(propsOrChildren) && !isArray(propsOrChildren)) {
      if (isVNode(propsOrChildren)) {
        return createVNode(type2, null, [propsOrChildren]);
      }
      return createVNode(type2, propsOrChildren);
    } else {
      return createVNode(type2, null, propsOrChildren);
    }
  } else {
    if (l > 3) {
      children = Array.prototype.slice.call(arguments, 2);
    } else if (l === 3 && isVNode(children)) {
      children = [children];
    }
    return createVNode(type2, propsOrChildren, children);
  }
}
const ssrContextKey = Symbol(``);
const useSSRContext$1 = () => {
  {
    const ctx = inject(ssrContextKey);
    if (!ctx) {
      warn(`Server rendering context not provided. Make sure to only call useSSRContext() conditionally in the server build.`);
    }
    return ctx;
  }
};
function initCustomFormatter() {
  {
    return;
  }
}
function withMemo(memo, render2, cache, index2) {
  const cached = cache[index2];
  if (cached && isMemoSame(cached, memo)) {
    return cached;
  }
  const ret = render2();
  ret.memo = memo.slice();
  return cache[index2] = ret;
}
function isMemoSame(cached, memo) {
  const prev = cached.memo;
  if (prev.length != memo.length) {
    return false;
  }
  for (let i = 0; i < prev.length; i++) {
    if (prev[i] !== memo[i]) {
      return false;
    }
  }
  if (isBlockTreeEnabled > 0 && currentBlock) {
    currentBlock.push(cached);
  }
  return true;
}
const version = "3.2.29";
const _ssrUtils = {
  createComponentInstance,
  setupComponent,
  renderComponentRoot,
  setCurrentRenderingInstance,
  isVNode,
  normalizeVNode
};
const ssrUtils = _ssrUtils;
const resolveFilter = null;
const compatUtils = null;
const svgNS = "http://www.w3.org/2000/svg";
const doc = typeof document !== "undefined" ? document : null;
const templateContainer = doc && doc.createElement("template");
const nodeOps = {
  insert: (child, parent, anchor) => {
    parent.insertBefore(child, anchor || null);
  },
  remove: (child) => {
    const parent = child.parentNode;
    if (parent) {
      parent.removeChild(child);
    }
  },
  createElement: (tag, isSVG, is, props) => {
    const el2 = isSVG ? doc.createElementNS(svgNS, tag) : doc.createElement(tag, is ? { is } : void 0);
    if (tag === "select" && props && props.multiple != null) {
      el2.setAttribute("multiple", props.multiple);
    }
    return el2;
  },
  createText: (text2) => doc.createTextNode(text2),
  createComment: (text2) => doc.createComment(text2),
  setText: (node2, text2) => {
    node2.nodeValue = text2;
  },
  setElementText: (el2, text2) => {
    el2.textContent = text2;
  },
  parentNode: (node2) => node2.parentNode,
  nextSibling: (node2) => node2.nextSibling,
  querySelector: (selector) => doc.querySelector(selector),
  setScopeId(el2, id) {
    el2.setAttribute(id, "");
  },
  cloneNode(el2) {
    const cloned = el2.cloneNode(true);
    if (`_value` in el2) {
      cloned._value = el2._value;
    }
    return cloned;
  },
  insertStaticContent(content, parent, anchor, isSVG, start2, end2) {
    const before = anchor ? anchor.previousSibling : parent.lastChild;
    if (start2 && (start2 === end2 || start2.nextSibling)) {
      while (true) {
        parent.insertBefore(start2.cloneNode(true), anchor);
        if (start2 === end2 || !(start2 = start2.nextSibling))
          break;
      }
    } else {
      templateContainer.innerHTML = isSVG ? `<svg>${content}</svg>` : content;
      const template = templateContainer.content;
      if (isSVG) {
        const wrapper = template.firstChild;
        while (wrapper.firstChild) {
          template.appendChild(wrapper.firstChild);
        }
        template.removeChild(wrapper);
      }
      parent.insertBefore(template, anchor);
    }
    return [
      before ? before.nextSibling : parent.firstChild,
      anchor ? anchor.previousSibling : parent.lastChild
    ];
  }
};
function patchClass(el2, value, isSVG) {
  const transitionClasses = el2._vtc;
  if (transitionClasses) {
    value = (value ? [value, ...transitionClasses] : [...transitionClasses]).join(" ");
  }
  if (value == null) {
    el2.removeAttribute("class");
  } else if (isSVG) {
    el2.setAttribute("class", value);
  } else {
    el2.className = value;
  }
}
function patchStyle(el2, prev, next) {
  const style = el2.style;
  const isCssString = isString(next);
  if (next && !isCssString) {
    for (const key in next) {
      setStyle(style, key, next[key]);
    }
    if (prev && !isString(prev)) {
      for (const key in prev) {
        if (next[key] == null) {
          setStyle(style, key, "");
        }
      }
    }
  } else {
    const currentDisplay = style.display;
    if (isCssString) {
      if (prev !== next) {
        style.cssText = next;
      }
    } else if (prev) {
      el2.removeAttribute("style");
    }
    if ("_vod" in el2) {
      style.display = currentDisplay;
    }
  }
}
const importantRE = /\s*!important$/;
function setStyle(style, name, val) {
  if (isArray(val)) {
    val.forEach((v) => setStyle(style, name, v));
  } else {
    if (name.startsWith("--")) {
      style.setProperty(name, val);
    } else {
      const prefixed = autoPrefix(style, name);
      if (importantRE.test(val)) {
        style.setProperty(hyphenate(prefixed), val.replace(importantRE, ""), "important");
      } else {
        style[prefixed] = val;
      }
    }
  }
}
const prefixes = ["Webkit", "Moz", "ms"];
const prefixCache = {};
function autoPrefix(style, rawName) {
  const cached = prefixCache[rawName];
  if (cached) {
    return cached;
  }
  let name = camelize(rawName);
  if (name !== "filter" && name in style) {
    return prefixCache[rawName] = name;
  }
  name = capitalize(name);
  for (let i = 0; i < prefixes.length; i++) {
    const prefixed = prefixes[i] + name;
    if (prefixed in style) {
      return prefixCache[rawName] = prefixed;
    }
  }
  return rawName;
}
const xlinkNS = "http://www.w3.org/1999/xlink";
function patchAttr(el2, key, value, isSVG, instance) {
  if (isSVG && key.startsWith("xlink:")) {
    if (value == null) {
      el2.removeAttributeNS(xlinkNS, key.slice(6, key.length));
    } else {
      el2.setAttributeNS(xlinkNS, key, value);
    }
  } else {
    const isBoolean = isSpecialBooleanAttr(key);
    if (value == null || isBoolean && !includeBooleanAttr(value)) {
      el2.removeAttribute(key);
    } else {
      el2.setAttribute(key, isBoolean ? "" : value);
    }
  }
}
function patchDOMProp(el2, key, value, prevChildren, parentComponent, parentSuspense, unmountChildren) {
  if (key === "innerHTML" || key === "textContent") {
    if (prevChildren) {
      unmountChildren(prevChildren, parentComponent, parentSuspense);
    }
    el2[key] = value == null ? "" : value;
    return;
  }
  if (key === "value" && el2.tagName !== "PROGRESS" && !el2.tagName.includes("-")) {
    el2._value = value;
    const newValue = value == null ? "" : value;
    if (el2.value !== newValue || el2.tagName === "OPTION") {
      el2.value = newValue;
    }
    if (value == null) {
      el2.removeAttribute(key);
    }
    return;
  }
  if (value === "" || value == null) {
    const type2 = typeof el2[key];
    if (type2 === "boolean") {
      el2[key] = includeBooleanAttr(value);
      return;
    } else if (value == null && type2 === "string") {
      el2[key] = "";
      el2.removeAttribute(key);
      return;
    } else if (type2 === "number") {
      try {
        el2[key] = 0;
      } catch (_a) {
      }
      el2.removeAttribute(key);
      return;
    }
  }
  try {
    el2[key] = value;
  } catch (e) {
  }
}
let _getNow = Date.now;
let skipTimestampCheck = false;
if (typeof window !== "undefined") {
  if (_getNow() > document.createEvent("Event").timeStamp) {
    _getNow = () => performance.now();
  }
  const ffMatch = navigator.userAgent.match(/firefox\/(\d+)/i);
  skipTimestampCheck = !!(ffMatch && Number(ffMatch[1]) <= 53);
}
let cachedNow = 0;
const p = Promise.resolve();
const reset = () => {
  cachedNow = 0;
};
const getNow = () => cachedNow || (p.then(reset), cachedNow = _getNow());
function addEventListener(el2, event, handler, options) {
  el2.addEventListener(event, handler, options);
}
function removeEventListener(el2, event, handler, options) {
  el2.removeEventListener(event, handler, options);
}
function patchEvent(el2, rawName, prevValue, nextValue, instance = null) {
  const invokers = el2._vei || (el2._vei = {});
  const existingInvoker = invokers[rawName];
  if (nextValue && existingInvoker) {
    existingInvoker.value = nextValue;
  } else {
    const [name, options] = parseName(rawName);
    if (nextValue) {
      const invoker = invokers[rawName] = createInvoker(nextValue, instance);
      addEventListener(el2, name, invoker, options);
    } else if (existingInvoker) {
      removeEventListener(el2, name, existingInvoker, options);
      invokers[rawName] = void 0;
    }
  }
}
const optionsModifierRE = /(?:Once|Passive|Capture)$/;
function parseName(name) {
  let options;
  if (optionsModifierRE.test(name)) {
    options = {};
    let m;
    while (m = name.match(optionsModifierRE)) {
      name = name.slice(0, name.length - m[0].length);
      options[m[0].toLowerCase()] = true;
    }
  }
  return [hyphenate(name.slice(2)), options];
}
function createInvoker(initialValue, instance) {
  const invoker = (e) => {
    const timeStamp = e.timeStamp || _getNow();
    if (skipTimestampCheck || timeStamp >= invoker.attached - 1) {
      callWithAsyncErrorHandling(patchStopImmediatePropagation(e, invoker.value), instance, 5, [e]);
    }
  };
  invoker.value = initialValue;
  invoker.attached = getNow();
  return invoker;
}
function patchStopImmediatePropagation(e, value) {
  if (isArray(value)) {
    const originalStop = e.stopImmediatePropagation;
    e.stopImmediatePropagation = () => {
      originalStop.call(e);
      e._stopped = true;
    };
    return value.map((fn2) => (e2) => !e2._stopped && fn2 && fn2(e2));
  } else {
    return value;
  }
}
const nativeOnRE = /^on[a-z]/;
const patchProp = (el2, key, prevValue, nextValue, isSVG = false, prevChildren, parentComponent, parentSuspense, unmountChildren) => {
  if (key === "class") {
    patchClass(el2, nextValue, isSVG);
  } else if (key === "style") {
    patchStyle(el2, prevValue, nextValue);
  } else if (isOn(key)) {
    if (!isModelListener(key)) {
      patchEvent(el2, key, prevValue, nextValue, parentComponent);
    }
  } else if (key[0] === "." ? (key = key.slice(1), true) : key[0] === "^" ? (key = key.slice(1), false) : shouldSetAsProp(el2, key, nextValue, isSVG)) {
    patchDOMProp(el2, key, nextValue, prevChildren, parentComponent, parentSuspense, unmountChildren);
  } else {
    if (key === "true-value") {
      el2._trueValue = nextValue;
    } else if (key === "false-value") {
      el2._falseValue = nextValue;
    }
    patchAttr(el2, key, nextValue, isSVG);
  }
};
function shouldSetAsProp(el2, key, value, isSVG) {
  if (isSVG) {
    if (key === "innerHTML" || key === "textContent") {
      return true;
    }
    if (key in el2 && nativeOnRE.test(key) && isFunction$1(value)) {
      return true;
    }
    return false;
  }
  if (key === "spellcheck" || key === "draggable") {
    return false;
  }
  if (key === "form") {
    return false;
  }
  if (key === "list" && el2.tagName === "INPUT") {
    return false;
  }
  if (key === "type" && el2.tagName === "TEXTAREA") {
    return false;
  }
  if (nativeOnRE.test(key) && isString(value)) {
    return false;
  }
  return key in el2;
}
function defineCustomElement(options, hydate) {
  const Comp = defineComponent(options);
  class VueCustomElement extends VueElement {
    constructor(initialProps) {
      super(Comp, initialProps, hydate);
    }
  }
  VueCustomElement.def = Comp;
  return VueCustomElement;
}
const defineSSRCustomElement = (options) => {
  return defineCustomElement(options, hydrate);
};
const BaseClass = typeof HTMLElement !== "undefined" ? HTMLElement : class {
};
class VueElement extends BaseClass {
  constructor(_def, _props = {}, hydrate2) {
    super();
    this._def = _def;
    this._props = _props;
    this._instance = null;
    this._connected = false;
    this._resolved = false;
    this._numberProps = null;
    if (this.shadowRoot && hydrate2) {
      hydrate2(this._createVNode(), this.shadowRoot);
    } else {
      this.attachShadow({ mode: "open" });
    }
  }
  connectedCallback() {
    this._connected = true;
    if (!this._instance) {
      this._resolveDef();
    }
  }
  disconnectedCallback() {
    this._connected = false;
    nextTick(() => {
      if (!this._connected) {
        render$Y(null, this.shadowRoot);
        this._instance = null;
      }
    });
  }
  _resolveDef() {
    if (this._resolved) {
      return;
    }
    this._resolved = true;
    for (let i = 0; i < this.attributes.length; i++) {
      this._setAttr(this.attributes[i].name);
    }
    new MutationObserver((mutations) => {
      for (const m of mutations) {
        this._setAttr(m.attributeName);
      }
    }).observe(this, { attributes: true });
    const resolve2 = (def2) => {
      const { props, styles } = def2;
      const hasOptions = !isArray(props);
      const rawKeys = props ? hasOptions ? Object.keys(props) : props : [];
      let numberProps;
      if (hasOptions) {
        for (const key in this._props) {
          const opt = props[key];
          if (opt === Number || opt && opt.type === Number) {
            this._props[key] = toNumber(this._props[key]);
            (numberProps || (numberProps = Object.create(null)))[key] = true;
          }
        }
      }
      this._numberProps = numberProps;
      for (const key of Object.keys(this)) {
        if (key[0] !== "_") {
          this._setProp(key, this[key], true, false);
        }
      }
      for (const key of rawKeys.map(camelize)) {
        Object.defineProperty(this, key, {
          get() {
            return this._getProp(key);
          },
          set(val) {
            this._setProp(key, val);
          }
        });
      }
      this._applyStyles(styles);
      this._update();
    };
    const asyncDef = this._def.__asyncLoader;
    if (asyncDef) {
      asyncDef().then(resolve2);
    } else {
      resolve2(this._def);
    }
  }
  _setAttr(key) {
    let value = this.getAttribute(key);
    if (this._numberProps && this._numberProps[key]) {
      value = toNumber(value);
    }
    this._setProp(camelize(key), value, false);
  }
  _getProp(key) {
    return this._props[key];
  }
  _setProp(key, val, shouldReflect = true, shouldUpdate = true) {
    if (val !== this._props[key]) {
      this._props[key] = val;
      if (shouldUpdate && this._instance) {
        this._update();
      }
      if (shouldReflect) {
        if (val === true) {
          this.setAttribute(hyphenate(key), "");
        } else if (typeof val === "string" || typeof val === "number") {
          this.setAttribute(hyphenate(key), val + "");
        } else if (!val) {
          this.removeAttribute(hyphenate(key));
        }
      }
    }
  }
  _update() {
    render$Y(this._createVNode(), this.shadowRoot);
  }
  _createVNode() {
    const vnode = createVNode(this._def, extend({}, this._props));
    if (!this._instance) {
      vnode.ce = (instance) => {
        this._instance = instance;
        instance.isCE = true;
        instance.emit = (event, ...args) => {
          this.dispatchEvent(new CustomEvent(event, {
            detail: args
          }));
        };
        let parent = this;
        while (parent = parent && (parent.parentNode || parent.host)) {
          if (parent instanceof VueElement) {
            instance.parent = parent._instance;
            break;
          }
        }
      };
    }
    return vnode;
  }
  _applyStyles(styles) {
    if (styles) {
      styles.forEach((css) => {
        const s = document.createElement("style");
        s.textContent = css;
        this.shadowRoot.appendChild(s);
      });
    }
  }
}
function useCssModule(name = "$style") {
  {
    const instance = getCurrentInstance$1();
    if (!instance) {
      return EMPTY_OBJ;
    }
    const modules = instance.type.__cssModules;
    if (!modules) {
      return EMPTY_OBJ;
    }
    const mod = modules[name];
    if (!mod) {
      return EMPTY_OBJ;
    }
    return mod;
  }
}
function useCssVars(getter) {
  const instance = getCurrentInstance$1();
  if (!instance) {
    return;
  }
  const setVars = () => setVarsOnVNode(instance.subTree, getter(instance.proxy));
  watchPostEffect(setVars);
  onMounted(() => {
    const ob = new MutationObserver(setVars);
    ob.observe(instance.subTree.el.parentNode, { childList: true });
    onUnmounted(() => ob.disconnect());
  });
}
function setVarsOnVNode(vnode, vars) {
  if (vnode.shapeFlag & 128) {
    const suspense = vnode.suspense;
    vnode = suspense.activeBranch;
    if (suspense.pendingBranch && !suspense.isHydrating) {
      suspense.effects.push(() => {
        setVarsOnVNode(suspense.activeBranch, vars);
      });
    }
  }
  while (vnode.component) {
    vnode = vnode.component.subTree;
  }
  if (vnode.shapeFlag & 1 && vnode.el) {
    setVarsOnNode(vnode.el, vars);
  } else if (vnode.type === Fragment) {
    vnode.children.forEach((c) => setVarsOnVNode(c, vars));
  } else if (vnode.type === Static) {
    let { el: el2, anchor } = vnode;
    while (el2) {
      setVarsOnNode(el2, vars);
      if (el2 === anchor)
        break;
      el2 = el2.nextSibling;
    }
  }
}
function setVarsOnNode(el2, vars) {
  if (el2.nodeType === 1) {
    const style = el2.style;
    for (const key in vars) {
      style.setProperty(`--${key}`, vars[key]);
    }
  }
}
const TRANSITION = "transition";
const ANIMATION = "animation";
const Transition = (props, { slots }) => h(BaseTransition, resolveTransitionProps(props), slots);
Transition.displayName = "Transition";
const DOMTransitionPropsValidators = {
  name: String,
  type: String,
  css: {
    type: Boolean,
    default: true
  },
  duration: [String, Number, Object],
  enterFromClass: String,
  enterActiveClass: String,
  enterToClass: String,
  appearFromClass: String,
  appearActiveClass: String,
  appearToClass: String,
  leaveFromClass: String,
  leaveActiveClass: String,
  leaveToClass: String
};
const TransitionPropsValidators = Transition.props = /* @__PURE__ */ extend({}, BaseTransition.props, DOMTransitionPropsValidators);
const callHook = (hook, args = []) => {
  if (isArray(hook)) {
    hook.forEach((h2) => h2(...args));
  } else if (hook) {
    hook(...args);
  }
};
const hasExplicitCallback = (hook) => {
  return hook ? isArray(hook) ? hook.some((h2) => h2.length > 1) : hook.length > 1 : false;
};
function resolveTransitionProps(rawProps) {
  const baseProps = {};
  for (const key in rawProps) {
    if (!(key in DOMTransitionPropsValidators)) {
      baseProps[key] = rawProps[key];
    }
  }
  if (rawProps.css === false) {
    return baseProps;
  }
  const { name = "v", type: type2, duration, enterFromClass = `${name}-enter-from`, enterActiveClass = `${name}-enter-active`, enterToClass = `${name}-enter-to`, appearFromClass = enterFromClass, appearActiveClass = enterActiveClass, appearToClass = enterToClass, leaveFromClass = `${name}-leave-from`, leaveActiveClass = `${name}-leave-active`, leaveToClass = `${name}-leave-to` } = rawProps;
  const durations = normalizeDuration(duration);
  const enterDuration = durations && durations[0];
  const leaveDuration = durations && durations[1];
  const { onBeforeEnter, onEnter, onEnterCancelled, onLeave, onLeaveCancelled, onBeforeAppear = onBeforeEnter, onAppear = onEnter, onAppearCancelled = onEnterCancelled } = baseProps;
  const finishEnter = (el2, isAppear, done) => {
    removeTransitionClass(el2, isAppear ? appearToClass : enterToClass);
    removeTransitionClass(el2, isAppear ? appearActiveClass : enterActiveClass);
    done && done();
  };
  const finishLeave = (el2, done) => {
    removeTransitionClass(el2, leaveToClass);
    removeTransitionClass(el2, leaveActiveClass);
    done && done();
  };
  const makeEnterHook = (isAppear) => {
    return (el2, done) => {
      const hook = isAppear ? onAppear : onEnter;
      const resolve2 = () => finishEnter(el2, isAppear, done);
      callHook(hook, [el2, resolve2]);
      nextFrame(() => {
        removeTransitionClass(el2, isAppear ? appearFromClass : enterFromClass);
        addTransitionClass(el2, isAppear ? appearToClass : enterToClass);
        if (!hasExplicitCallback(hook)) {
          whenTransitionEnds(el2, type2, enterDuration, resolve2);
        }
      });
    };
  };
  return extend(baseProps, {
    onBeforeEnter(el2) {
      callHook(onBeforeEnter, [el2]);
      addTransitionClass(el2, enterFromClass);
      addTransitionClass(el2, enterActiveClass);
    },
    onBeforeAppear(el2) {
      callHook(onBeforeAppear, [el2]);
      addTransitionClass(el2, appearFromClass);
      addTransitionClass(el2, appearActiveClass);
    },
    onEnter: makeEnterHook(false),
    onAppear: makeEnterHook(true),
    onLeave(el2, done) {
      const resolve2 = () => finishLeave(el2, done);
      addTransitionClass(el2, leaveFromClass);
      forceReflow();
      addTransitionClass(el2, leaveActiveClass);
      nextFrame(() => {
        removeTransitionClass(el2, leaveFromClass);
        addTransitionClass(el2, leaveToClass);
        if (!hasExplicitCallback(onLeave)) {
          whenTransitionEnds(el2, type2, leaveDuration, resolve2);
        }
      });
      callHook(onLeave, [el2, resolve2]);
    },
    onEnterCancelled(el2) {
      finishEnter(el2, false);
      callHook(onEnterCancelled, [el2]);
    },
    onAppearCancelled(el2) {
      finishEnter(el2, true);
      callHook(onAppearCancelled, [el2]);
    },
    onLeaveCancelled(el2) {
      finishLeave(el2);
      callHook(onLeaveCancelled, [el2]);
    }
  });
}
function normalizeDuration(duration) {
  if (duration == null) {
    return null;
  } else if (isObject(duration)) {
    return [NumberOf(duration.enter), NumberOf(duration.leave)];
  } else {
    const n = NumberOf(duration);
    return [n, n];
  }
}
function NumberOf(val) {
  const res = toNumber(val);
  return res;
}
function addTransitionClass(el2, cls) {
  cls.split(/\s+/).forEach((c) => c && el2.classList.add(c));
  (el2._vtc || (el2._vtc = new Set())).add(cls);
}
function removeTransitionClass(el2, cls) {
  cls.split(/\s+/).forEach((c) => c && el2.classList.remove(c));
  const { _vtc } = el2;
  if (_vtc) {
    _vtc.delete(cls);
    if (!_vtc.size) {
      el2._vtc = void 0;
    }
  }
}
function nextFrame(cb) {
  requestAnimationFrame(() => {
    requestAnimationFrame(cb);
  });
}
let endId = 0;
function whenTransitionEnds(el2, expectedType, explicitTimeout, resolve2) {
  const id = el2._endId = ++endId;
  const resolveIfNotStale = () => {
    if (id === el2._endId) {
      resolve2();
    }
  };
  if (explicitTimeout) {
    return setTimeout(resolveIfNotStale, explicitTimeout);
  }
  const { type: type2, timeout, propCount } = getTransitionInfo(el2, expectedType);
  if (!type2) {
    return resolve2();
  }
  const endEvent = type2 + "end";
  let ended = 0;
  const end2 = () => {
    el2.removeEventListener(endEvent, onEnd);
    resolveIfNotStale();
  };
  const onEnd = (e) => {
    if (e.target === el2 && ++ended >= propCount) {
      end2();
    }
  };
  setTimeout(() => {
    if (ended < propCount) {
      end2();
    }
  }, timeout + 1);
  el2.addEventListener(endEvent, onEnd);
}
function getTransitionInfo(el2, expectedType) {
  const styles = window.getComputedStyle(el2);
  const getStyleProperties = (key) => (styles[key] || "").split(", ");
  const transitionDelays = getStyleProperties(TRANSITION + "Delay");
  const transitionDurations = getStyleProperties(TRANSITION + "Duration");
  const transitionTimeout = getTimeout(transitionDelays, transitionDurations);
  const animationDelays = getStyleProperties(ANIMATION + "Delay");
  const animationDurations = getStyleProperties(ANIMATION + "Duration");
  const animationTimeout = getTimeout(animationDelays, animationDurations);
  let type2 = null;
  let timeout = 0;
  let propCount = 0;
  if (expectedType === TRANSITION) {
    if (transitionTimeout > 0) {
      type2 = TRANSITION;
      timeout = transitionTimeout;
      propCount = transitionDurations.length;
    }
  } else if (expectedType === ANIMATION) {
    if (animationTimeout > 0) {
      type2 = ANIMATION;
      timeout = animationTimeout;
      propCount = animationDurations.length;
    }
  } else {
    timeout = Math.max(transitionTimeout, animationTimeout);
    type2 = timeout > 0 ? transitionTimeout > animationTimeout ? TRANSITION : ANIMATION : null;
    propCount = type2 ? type2 === TRANSITION ? transitionDurations.length : animationDurations.length : 0;
  }
  const hasTransform = type2 === TRANSITION && /\b(transform|all)(,|$)/.test(styles[TRANSITION + "Property"]);
  return {
    type: type2,
    timeout,
    propCount,
    hasTransform
  };
}
function getTimeout(delays, durations) {
  while (delays.length < durations.length) {
    delays = delays.concat(delays);
  }
  return Math.max(...durations.map((d, i) => toMs(d) + toMs(delays[i])));
}
function toMs(s) {
  return Number(s.slice(0, -1).replace(",", ".")) * 1e3;
}
function forceReflow() {
  return document.body.offsetHeight;
}
const positionMap = new WeakMap();
const newPositionMap = new WeakMap();
const TransitionGroupImpl = {
  name: "TransitionGroup",
  props: /* @__PURE__ */ extend({}, TransitionPropsValidators, {
    tag: String,
    moveClass: String
  }),
  setup(props, { slots }) {
    const instance = getCurrentInstance$1();
    const state = useTransitionState();
    let prevChildren;
    let children;
    onUpdated(() => {
      if (!prevChildren.length) {
        return;
      }
      const moveClass = props.moveClass || `${props.name || "v"}-move`;
      if (!hasCSSTransform(prevChildren[0].el, instance.vnode.el, moveClass)) {
        return;
      }
      prevChildren.forEach(callPendingCbs);
      prevChildren.forEach(recordPosition);
      const movedChildren = prevChildren.filter(applyTranslation);
      forceReflow();
      movedChildren.forEach((c) => {
        const el2 = c.el;
        const style = el2.style;
        addTransitionClass(el2, moveClass);
        style.transform = style.webkitTransform = style.transitionDuration = "";
        const cb = el2._moveCb = (e) => {
          if (e && e.target !== el2) {
            return;
          }
          if (!e || /transform$/.test(e.propertyName)) {
            el2.removeEventListener("transitionend", cb);
            el2._moveCb = null;
            removeTransitionClass(el2, moveClass);
          }
        };
        el2.addEventListener("transitionend", cb);
      });
    });
    return () => {
      const rawProps = toRaw(props);
      const cssTransitionProps = resolveTransitionProps(rawProps);
      let tag = rawProps.tag || Fragment;
      prevChildren = children;
      children = slots.default ? getTransitionRawChildren(slots.default()) : [];
      for (let i = 0; i < children.length; i++) {
        const child = children[i];
        if (child.key != null) {
          setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state, instance));
        }
      }
      if (prevChildren) {
        for (let i = 0; i < prevChildren.length; i++) {
          const child = prevChildren[i];
          setTransitionHooks(child, resolveTransitionHooks(child, cssTransitionProps, state, instance));
          positionMap.set(child, child.el.getBoundingClientRect());
        }
      }
      return createVNode(tag, null, children);
    };
  }
};
const TransitionGroup = TransitionGroupImpl;
function callPendingCbs(c) {
  const el2 = c.el;
  if (el2._moveCb) {
    el2._moveCb();
  }
  if (el2._enterCb) {
    el2._enterCb();
  }
}
function recordPosition(c) {
  newPositionMap.set(c, c.el.getBoundingClientRect());
}
function applyTranslation(c) {
  const oldPos = positionMap.get(c);
  const newPos = newPositionMap.get(c);
  const dx = oldPos.left - newPos.left;
  const dy = oldPos.top - newPos.top;
  if (dx || dy) {
    const s = c.el.style;
    s.transform = s.webkitTransform = `translate(${dx}px,${dy}px)`;
    s.transitionDuration = "0s";
    return c;
  }
}
function hasCSSTransform(el2, root, moveClass) {
  const clone2 = el2.cloneNode();
  if (el2._vtc) {
    el2._vtc.forEach((cls) => {
      cls.split(/\s+/).forEach((c) => c && clone2.classList.remove(c));
    });
  }
  moveClass.split(/\s+/).forEach((c) => c && clone2.classList.add(c));
  clone2.style.display = "none";
  const container = root.nodeType === 1 ? root : root.parentNode;
  container.appendChild(clone2);
  const { hasTransform } = getTransitionInfo(clone2);
  container.removeChild(clone2);
  return hasTransform;
}
const getModelAssigner = (vnode) => {
  const fn2 = vnode.props["onUpdate:modelValue"];
  return isArray(fn2) ? (value) => invokeArrayFns(fn2, value) : fn2;
};
function onCompositionStart(e) {
  e.target.composing = true;
}
function onCompositionEnd(e) {
  const target2 = e.target;
  if (target2.composing) {
    target2.composing = false;
    trigger(target2, "input");
  }
}
function trigger(el2, type2) {
  const e = document.createEvent("HTMLEvents");
  e.initEvent(type2, true, true);
  el2.dispatchEvent(e);
}
const vModelText = {
  created(el2, { modifiers: { lazy, trim: trim2, number: number2 } }, vnode) {
    el2._assign = getModelAssigner(vnode);
    const castToNumber = number2 || vnode.props && vnode.props.type === "number";
    addEventListener(el2, lazy ? "change" : "input", (e) => {
      if (e.target.composing)
        return;
      let domValue = el2.value;
      if (trim2) {
        domValue = domValue.trim();
      } else if (castToNumber) {
        domValue = toNumber(domValue);
      }
      el2._assign(domValue);
    });
    if (trim2) {
      addEventListener(el2, "change", () => {
        el2.value = el2.value.trim();
      });
    }
    if (!lazy) {
      addEventListener(el2, "compositionstart", onCompositionStart);
      addEventListener(el2, "compositionend", onCompositionEnd);
      addEventListener(el2, "change", onCompositionEnd);
    }
  },
  mounted(el2, { value }) {
    el2.value = value == null ? "" : value;
  },
  beforeUpdate(el2, { value, modifiers: { lazy, trim: trim2, number: number2 } }, vnode) {
    el2._assign = getModelAssigner(vnode);
    if (el2.composing)
      return;
    if (document.activeElement === el2) {
      if (lazy) {
        return;
      }
      if (trim2 && el2.value.trim() === value) {
        return;
      }
      if ((number2 || el2.type === "number") && toNumber(el2.value) === value) {
        return;
      }
    }
    const newValue = value == null ? "" : value;
    if (el2.value !== newValue) {
      el2.value = newValue;
    }
  }
};
const vModelCheckbox = {
  deep: true,
  created(el2, _, vnode) {
    el2._assign = getModelAssigner(vnode);
    addEventListener(el2, "change", () => {
      const modelValue = el2._modelValue;
      const elementValue = getValue(el2);
      const checked = el2.checked;
      const assign2 = el2._assign;
      if (isArray(modelValue)) {
        const index2 = looseIndexOf(modelValue, elementValue);
        const found = index2 !== -1;
        if (checked && !found) {
          assign2(modelValue.concat(elementValue));
        } else if (!checked && found) {
          const filtered = [...modelValue];
          filtered.splice(index2, 1);
          assign2(filtered);
        }
      } else if (isSet(modelValue)) {
        const cloned = new Set(modelValue);
        if (checked) {
          cloned.add(elementValue);
        } else {
          cloned.delete(elementValue);
        }
        assign2(cloned);
      } else {
        assign2(getCheckboxValue(el2, checked));
      }
    });
  },
  mounted: setChecked,
  beforeUpdate(el2, binding, vnode) {
    el2._assign = getModelAssigner(vnode);
    setChecked(el2, binding, vnode);
  }
};
function setChecked(el2, { value, oldValue }, vnode) {
  el2._modelValue = value;
  if (isArray(value)) {
    el2.checked = looseIndexOf(value, vnode.props.value) > -1;
  } else if (isSet(value)) {
    el2.checked = value.has(vnode.props.value);
  } else if (value !== oldValue) {
    el2.checked = looseEqual(value, getCheckboxValue(el2, true));
  }
}
const vModelRadio = {
  created(el2, { value }, vnode) {
    el2.checked = looseEqual(value, vnode.props.value);
    el2._assign = getModelAssigner(vnode);
    addEventListener(el2, "change", () => {
      el2._assign(getValue(el2));
    });
  },
  beforeUpdate(el2, { value, oldValue }, vnode) {
    el2._assign = getModelAssigner(vnode);
    if (value !== oldValue) {
      el2.checked = looseEqual(value, vnode.props.value);
    }
  }
};
const vModelSelect = {
  deep: true,
  created(el2, { value, modifiers: { number: number2 } }, vnode) {
    const isSetModel = isSet(value);
    addEventListener(el2, "change", () => {
      const selectedVal = Array.prototype.filter.call(el2.options, (o) => o.selected).map((o) => number2 ? toNumber(getValue(o)) : getValue(o));
      el2._assign(el2.multiple ? isSetModel ? new Set(selectedVal) : selectedVal : selectedVal[0]);
    });
    el2._assign = getModelAssigner(vnode);
  },
  mounted(el2, { value }) {
    setSelected(el2, value);
  },
  beforeUpdate(el2, _binding, vnode) {
    el2._assign = getModelAssigner(vnode);
  },
  updated(el2, { value }) {
    setSelected(el2, value);
  }
};
function setSelected(el2, value) {
  const isMultiple = el2.multiple;
  if (isMultiple && !isArray(value) && !isSet(value)) {
    return;
  }
  for (let i = 0, l = el2.options.length; i < l; i++) {
    const option = el2.options[i];
    const optionValue = getValue(option);
    if (isMultiple) {
      if (isArray(value)) {
        option.selected = looseIndexOf(value, optionValue) > -1;
      } else {
        option.selected = value.has(optionValue);
      }
    } else {
      if (looseEqual(getValue(option), value)) {
        if (el2.selectedIndex !== i)
          el2.selectedIndex = i;
        return;
      }
    }
  }
  if (!isMultiple && el2.selectedIndex !== -1) {
    el2.selectedIndex = -1;
  }
}
function getValue(el2) {
  return "_value" in el2 ? el2._value : el2.value;
}
function getCheckboxValue(el2, checked) {
  const key = checked ? "_trueValue" : "_falseValue";
  return key in el2 ? el2[key] : checked;
}
const vModelDynamic = {
  created(el2, binding, vnode) {
    callModelHook(el2, binding, vnode, null, "created");
  },
  mounted(el2, binding, vnode) {
    callModelHook(el2, binding, vnode, null, "mounted");
  },
  beforeUpdate(el2, binding, vnode, prevVNode) {
    callModelHook(el2, binding, vnode, prevVNode, "beforeUpdate");
  },
  updated(el2, binding, vnode, prevVNode) {
    callModelHook(el2, binding, vnode, prevVNode, "updated");
  }
};
function callModelHook(el2, binding, vnode, prevVNode, hook) {
  let modelToUse;
  switch (el2.tagName) {
    case "SELECT":
      modelToUse = vModelSelect;
      break;
    case "TEXTAREA":
      modelToUse = vModelText;
      break;
    default:
      switch (vnode.props && vnode.props.type) {
        case "checkbox":
          modelToUse = vModelCheckbox;
          break;
        case "radio":
          modelToUse = vModelRadio;
          break;
        default:
          modelToUse = vModelText;
      }
  }
  const fn2 = modelToUse[hook];
  fn2 && fn2(el2, binding, vnode, prevVNode);
}
function initVModelForSSR() {
  vModelText.getSSRProps = ({ value }) => ({ value });
  vModelRadio.getSSRProps = ({ value }, vnode) => {
    if (vnode.props && looseEqual(vnode.props.value, value)) {
      return { checked: true };
    }
  };
  vModelCheckbox.getSSRProps = ({ value }, vnode) => {
    if (isArray(value)) {
      if (vnode.props && looseIndexOf(value, vnode.props.value) > -1) {
        return { checked: true };
      }
    } else if (isSet(value)) {
      if (vnode.props && value.has(vnode.props.value)) {
        return { checked: true };
      }
    } else if (value) {
      return { checked: true };
    }
  };
}
const systemModifiers = ["ctrl", "shift", "alt", "meta"];
const modifierGuards = {
  stop: (e) => e.stopPropagation(),
  prevent: (e) => e.preventDefault(),
  self: (e) => e.target !== e.currentTarget,
  ctrl: (e) => !e.ctrlKey,
  shift: (e) => !e.shiftKey,
  alt: (e) => !e.altKey,
  meta: (e) => !e.metaKey,
  left: (e) => "button" in e && e.button !== 0,
  middle: (e) => "button" in e && e.button !== 1,
  right: (e) => "button" in e && e.button !== 2,
  exact: (e, modifiers) => systemModifiers.some((m) => e[`${m}Key`] && !modifiers.includes(m))
};
const withModifiers = (fn2, modifiers) => {
  return (event, ...args) => {
    for (let i = 0; i < modifiers.length; i++) {
      const guard = modifierGuards[modifiers[i]];
      if (guard && guard(event, modifiers))
        return;
    }
    return fn2(event, ...args);
  };
};
const keyNames = {
  esc: "escape",
  space: " ",
  up: "arrow-up",
  left: "arrow-left",
  right: "arrow-right",
  down: "arrow-down",
  delete: "backspace"
};
const withKeys = (fn2, modifiers) => {
  return (event) => {
    if (!("key" in event)) {
      return;
    }
    const eventKey = hyphenate(event.key);
    if (modifiers.some((k) => k === eventKey || keyNames[k] === eventKey)) {
      return fn2(event);
    }
  };
};
const vShow = {
  beforeMount(el2, { value }, { transition }) {
    el2._vod = el2.style.display === "none" ? "" : el2.style.display;
    if (transition && value) {
      transition.beforeEnter(el2);
    } else {
      setDisplay(el2, value);
    }
  },
  mounted(el2, { value }, { transition }) {
    if (transition && value) {
      transition.enter(el2);
    }
  },
  updated(el2, { value, oldValue }, { transition }) {
    if (!value === !oldValue)
      return;
    if (transition) {
      if (value) {
        transition.beforeEnter(el2);
        setDisplay(el2, true);
        transition.enter(el2);
      } else {
        transition.leave(el2, () => {
          setDisplay(el2, false);
        });
      }
    } else {
      setDisplay(el2, value);
    }
  },
  beforeUnmount(el2, { value }) {
    setDisplay(el2, value);
  }
};
function setDisplay(el2, value) {
  el2.style.display = value ? el2._vod : "none";
}
function initVShowForSSR() {
  vShow.getSSRProps = ({ value }) => {
    if (!value) {
      return { style: { display: "none" } };
    }
  };
}
const rendererOptions = extend({ patchProp }, nodeOps);
let renderer;
let enabledHydration = false;
function ensureRenderer() {
  return renderer || (renderer = createRenderer(rendererOptions));
}
function ensureHydrationRenderer() {
  renderer = enabledHydration ? renderer : createHydrationRenderer(rendererOptions);
  enabledHydration = true;
  return renderer;
}
const render$Y = (...args) => {
  ensureRenderer().render(...args);
};
const hydrate = (...args) => {
  ensureHydrationRenderer().hydrate(...args);
};
const createApp = (...args) => {
  const app2 = ensureRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (!container)
      return;
    const component = app2._component;
    if (!isFunction$1(component) && !component.render && !component.template) {
      component.template = container.innerHTML;
    }
    container.innerHTML = "";
    const proxy = mount(container, false, container instanceof SVGElement);
    if (container instanceof Element) {
      container.removeAttribute("v-cloak");
      container.setAttribute("data-v-app", "");
    }
    return proxy;
  };
  return app2;
};
const createSSRApp = (...args) => {
  const app2 = ensureHydrationRenderer().createApp(...args);
  const { mount } = app2;
  app2.mount = (containerOrSelector) => {
    const container = normalizeContainer(containerOrSelector);
    if (container) {
      return mount(container, true, container instanceof SVGElement);
    }
  };
  return app2;
};
function normalizeContainer(container) {
  if (isString(container)) {
    const res = document.querySelector(container);
    return res;
  }
  return container;
}
let ssrDirectiveInitialized = false;
const initDirectivesForSSR = () => {
  if (!ssrDirectiveInitialized) {
    ssrDirectiveInitialized = true;
    initVModelForSSR();
    initVShowForSSR();
  }
};
const compile$4 = () => {
};
var vue_runtime_esmBundler = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  compile: compile$4,
  EffectScope,
  ReactiveEffect,
  customRef,
  effect: effect$3,
  effectScope,
  getCurrentScope,
  isProxy,
  isReactive,
  isReadonly,
  isRef,
  isShallow,
  markRaw,
  onScopeDispose,
  proxyRefs,
  reactive: reactive$1,
  readonly,
  ref,
  shallowReactive,
  shallowReadonly,
  shallowRef,
  stop,
  toRaw,
  toRef,
  toRefs,
  triggerRef,
  unref,
  camelize,
  capitalize,
  normalizeClass,
  normalizeProps,
  normalizeStyle,
  toDisplayString,
  toHandlerKey,
  BaseTransition,
  Comment: Comment$1,
  Fragment,
  KeepAlive,
  Static,
  Suspense,
  Teleport,
  Text: Text$1,
  callWithAsyncErrorHandling,
  callWithErrorHandling,
  cloneVNode,
  compatUtils,
  computed,
  createBlock,
  createCommentVNode,
  createElementBlock,
  createElementVNode: createBaseVNode,
  createHydrationRenderer,
  createPropsRestProxy,
  createRenderer,
  createSlots,
  createStaticVNode,
  createTextVNode,
  createVNode,
  defineAsyncComponent,
  defineComponent,
  defineEmits,
  defineExpose,
  defineProps,
  get devtools() {
    return devtools;
  },
  getCurrentInstance: getCurrentInstance$1,
  getTransitionRawChildren,
  guardReactiveProps,
  h,
  handleError,
  initCustomFormatter,
  inject,
  isMemoSame,
  isRuntimeOnly,
  isVNode,
  mergeDefaults,
  mergeProps,
  nextTick,
  onActivated,
  onBeforeMount,
  onBeforeUnmount,
  onBeforeUpdate,
  onDeactivated,
  onErrorCaptured,
  onMounted,
  onRenderTracked,
  onRenderTriggered,
  onServerPrefetch,
  onUnmounted,
  onUpdated,
  openBlock,
  popScopeId,
  provide,
  pushScopeId,
  queuePostFlushCb,
  registerRuntimeCompiler,
  renderList,
  renderSlot,
  resolveComponent,
  resolveDirective,
  resolveDynamicComponent,
  resolveFilter,
  resolveTransitionHooks,
  setBlockTracking,
  setDevtoolsHook,
  setTransitionHooks,
  ssrContextKey,
  ssrUtils,
  toHandlers,
  transformVNodeArgs,
  useAttrs,
  useSSRContext: useSSRContext$1,
  useSlots,
  useTransitionState,
  version,
  warn,
  watch,
  watchEffect,
  watchPostEffect,
  watchSyncEffect,
  withAsyncContext,
  withCtx,
  withDefaults,
  withDirectives,
  withMemo,
  withScopeId,
  Transition,
  TransitionGroup,
  VueElement,
  createApp,
  createSSRApp,
  defineCustomElement,
  defineSSRCustomElement,
  hydrate,
  initDirectivesForSSR,
  render: render$Y,
  useCssModule,
  useCssVars,
  vModelCheckbox,
  vModelDynamic,
  vModelRadio,
  vModelSelect,
  vModelText,
  vShow,
  withKeys,
  withModifiers
});
/*!
  * vue-router v4.0.10
  * (c) 2021 Eduardo San Martin Morote
  * @license MIT
  */
const hasSymbol = typeof Symbol === "function" && typeof Symbol.toStringTag === "symbol";
const PolySymbol = (name) => hasSymbol ? Symbol(name) : "_vr_" + name;
const matchedRouteKey = /* @__PURE__ */ PolySymbol("rvlm");
const viewDepthKey = /* @__PURE__ */ PolySymbol("rvd");
const routerKey = /* @__PURE__ */ PolySymbol("r");
const routeLocationKey = /* @__PURE__ */ PolySymbol("rl");
const routerViewLocationKey = /* @__PURE__ */ PolySymbol("rvl");
const isBrowser = typeof window !== "undefined";
function isESModule(obj) {
  return obj.__esModule || hasSymbol && obj[Symbol.toStringTag] === "Module";
}
const assign = Object.assign;
function applyToParams(fn2, params) {
  const newParams = {};
  for (const key in params) {
    const value = params[key];
    newParams[key] = Array.isArray(value) ? value.map(fn2) : fn2(value);
  }
  return newParams;
}
let noop = () => {
};
const TRAILING_SLASH_RE = /\/$/;
const removeTrailingSlash = (path) => path.replace(TRAILING_SLASH_RE, "");
function parseURL(parseQuery2, location2, currentLocation = "/") {
  let path, query = {}, searchString = "", hash2 = "";
  const searchPos = location2.indexOf("?");
  const hashPos = location2.indexOf("#", searchPos > -1 ? searchPos : 0);
  if (searchPos > -1) {
    path = location2.slice(0, searchPos);
    searchString = location2.slice(searchPos + 1, hashPos > -1 ? hashPos : location2.length);
    query = parseQuery2(searchString);
  }
  if (hashPos > -1) {
    path = path || location2.slice(0, hashPos);
    hash2 = location2.slice(hashPos, location2.length);
  }
  path = resolveRelativePath(path != null ? path : location2, currentLocation);
  return {
    fullPath: path + (searchString && "?") + searchString + hash2,
    path,
    query,
    hash: hash2
  };
}
function stringifyURL(stringifyQuery2, location2) {
  let query = location2.query ? stringifyQuery2(location2.query) : "";
  return location2.path + (query && "?") + query + (location2.hash || "");
}
function stripBase(pathname, base) {
  if (!base || !pathname.toLowerCase().startsWith(base.toLowerCase()))
    return pathname;
  return pathname.slice(base.length) || "/";
}
function isSameRouteLocation(stringifyQuery2, a, b) {
  let aLastIndex = a.matched.length - 1;
  let bLastIndex = b.matched.length - 1;
  return aLastIndex > -1 && aLastIndex === bLastIndex && isSameRouteRecord(a.matched[aLastIndex], b.matched[bLastIndex]) && isSameRouteLocationParams(a.params, b.params) && stringifyQuery2(a.query) === stringifyQuery2(b.query) && a.hash === b.hash;
}
function isSameRouteRecord(a, b) {
  return (a.aliasOf || a) === (b.aliasOf || b);
}
function isSameRouteLocationParams(a, b) {
  if (Object.keys(a).length !== Object.keys(b).length)
    return false;
  for (let key in a) {
    if (!isSameRouteLocationParamsValue(a[key], b[key]))
      return false;
  }
  return true;
}
function isSameRouteLocationParamsValue(a, b) {
  return Array.isArray(a) ? isEquivalentArray(a, b) : Array.isArray(b) ? isEquivalentArray(b, a) : a === b;
}
function isEquivalentArray(a, b) {
  return Array.isArray(b) ? a.length === b.length && a.every((value, i) => value === b[i]) : a.length === 1 && a[0] === b;
}
function resolveRelativePath(to, from) {
  if (to.startsWith("/"))
    return to;
  if (!to)
    return from;
  const fromSegments = from.split("/");
  const toSegments = to.split("/");
  let position = fromSegments.length - 1;
  let toPosition;
  let segment;
  for (toPosition = 0; toPosition < toSegments.length; toPosition++) {
    segment = toSegments[toPosition];
    if (position === 1 || segment === ".")
      continue;
    if (segment === "..")
      position--;
    else
      break;
  }
  return fromSegments.slice(0, position).join("/") + "/" + toSegments.slice(toPosition - (toPosition === toSegments.length ? 1 : 0)).join("/");
}
var NavigationType;
(function(NavigationType2) {
  NavigationType2["pop"] = "pop";
  NavigationType2["push"] = "push";
})(NavigationType || (NavigationType = {}));
var NavigationDirection;
(function(NavigationDirection2) {
  NavigationDirection2["back"] = "back";
  NavigationDirection2["forward"] = "forward";
  NavigationDirection2["unknown"] = "";
})(NavigationDirection || (NavigationDirection = {}));
const START = "";
function normalizeBase(base) {
  if (!base) {
    if (isBrowser) {
      const baseEl = document.querySelector("base");
      base = baseEl && baseEl.getAttribute("href") || "/";
      base = base.replace(/^\w+:\/\/[^\/]+/, "");
    } else {
      base = "/";
    }
  }
  if (base[0] !== "/" && base[0] !== "#")
    base = "/" + base;
  return removeTrailingSlash(base);
}
const BEFORE_HASH_RE = /^[^#]+#/;
function createHref(base, location2) {
  return base.replace(BEFORE_HASH_RE, "#") + location2;
}
function getElementPosition(el2, offset2) {
  const docRect = document.documentElement.getBoundingClientRect();
  const elRect = el2.getBoundingClientRect();
  return {
    behavior: offset2.behavior,
    left: elRect.left - docRect.left - (offset2.left || 0),
    top: elRect.top - docRect.top - (offset2.top || 0)
  };
}
const computeScrollPosition = () => ({
  left: window.pageXOffset,
  top: window.pageYOffset
});
function scrollToPosition(position) {
  let scrollToOptions;
  if ("el" in position) {
    let positionEl = position.el;
    const isIdSelector = typeof positionEl === "string" && positionEl.startsWith("#");
    const el2 = typeof positionEl === "string" ? isIdSelector ? document.getElementById(positionEl.slice(1)) : document.querySelector(positionEl) : positionEl;
    if (!el2) {
      return;
    }
    scrollToOptions = getElementPosition(el2, position);
  } else {
    scrollToOptions = position;
  }
  if ("scrollBehavior" in document.documentElement.style)
    window.scrollTo(scrollToOptions);
  else {
    window.scrollTo(scrollToOptions.left != null ? scrollToOptions.left : window.pageXOffset, scrollToOptions.top != null ? scrollToOptions.top : window.pageYOffset);
  }
}
function getScrollKey(path, delta2) {
  const position = history.state ? history.state.position - delta2 : -1;
  return position + path;
}
const scrollPositions = new Map();
function saveScrollPosition(key, scrollPosition) {
  scrollPositions.set(key, scrollPosition);
}
function getSavedScrollPosition(key) {
  const scroll = scrollPositions.get(key);
  scrollPositions.delete(key);
  return scroll;
}
let createBaseLocation = () => location.protocol + "//" + location.host;
function createCurrentLocation(base, location2) {
  const { pathname, search, hash: hash2 } = location2;
  const hashPos = base.indexOf("#");
  if (hashPos > -1) {
    let slicePos = hash2.includes(base.slice(hashPos)) ? base.slice(hashPos).length : 1;
    let pathFromHash = hash2.slice(slicePos);
    if (pathFromHash[0] !== "/")
      pathFromHash = "/" + pathFromHash;
    return stripBase(pathFromHash, "");
  }
  const path = stripBase(pathname, base);
  return path + search + hash2;
}
function useHistoryListeners(base, historyState, currentLocation, replace) {
  let listeners = [];
  let teardowns = [];
  let pauseState = null;
  const popStateHandler = ({ state }) => {
    const to = createCurrentLocation(base, location);
    const from = currentLocation.value;
    const fromState = historyState.value;
    let delta2 = 0;
    if (state) {
      currentLocation.value = to;
      historyState.value = state;
      if (pauseState && pauseState === from) {
        pauseState = null;
        return;
      }
      delta2 = fromState ? state.position - fromState.position : 0;
    } else {
      replace(to);
    }
    listeners.forEach((listener) => {
      listener(currentLocation.value, from, {
        delta: delta2,
        type: NavigationType.pop,
        direction: delta2 ? delta2 > 0 ? NavigationDirection.forward : NavigationDirection.back : NavigationDirection.unknown
      });
    });
  };
  function pauseListeners() {
    pauseState = currentLocation.value;
  }
  function listen(callback) {
    listeners.push(callback);
    const teardown = () => {
      const index2 = listeners.indexOf(callback);
      if (index2 > -1)
        listeners.splice(index2, 1);
    };
    teardowns.push(teardown);
    return teardown;
  }
  function beforeUnloadListener() {
    const { history: history2 } = window;
    if (!history2.state)
      return;
    history2.replaceState(assign({}, history2.state, { scroll: computeScrollPosition() }), "");
  }
  function destroy() {
    for (const teardown of teardowns)
      teardown();
    teardowns = [];
    window.removeEventListener("popstate", popStateHandler);
    window.removeEventListener("beforeunload", beforeUnloadListener);
  }
  window.addEventListener("popstate", popStateHandler);
  window.addEventListener("beforeunload", beforeUnloadListener);
  return {
    pauseListeners,
    listen,
    destroy
  };
}
function buildState(back2, current, forward, replaced = false, computeScroll = false) {
  return {
    back: back2,
    current,
    forward,
    replaced,
    position: window.history.length,
    scroll: computeScroll ? computeScrollPosition() : null
  };
}
function useHistoryStateNavigation(base) {
  const { history: history2, location: location2 } = window;
  let currentLocation = {
    value: createCurrentLocation(base, location2)
  };
  let historyState = { value: history2.state };
  if (!historyState.value) {
    changeLocation(currentLocation.value, {
      back: null,
      current: currentLocation.value,
      forward: null,
      position: history2.length - 1,
      replaced: true,
      scroll: null
    }, true);
  }
  function changeLocation(to, state, replace2) {
    const hashIndex = base.indexOf("#");
    const url = hashIndex > -1 ? (location2.host && document.querySelector("base") ? base : base.slice(hashIndex)) + to : createBaseLocation() + base + to;
    try {
      history2[replace2 ? "replaceState" : "pushState"](state, "", url);
      historyState.value = state;
    } catch (err) {
      {
        console.error(err);
      }
      location2[replace2 ? "replace" : "assign"](url);
    }
  }
  function replace(to, data) {
    const state = assign({}, history2.state, buildState(historyState.value.back, to, historyState.value.forward, true), data, { position: historyState.value.position });
    changeLocation(to, state, true);
    currentLocation.value = to;
  }
  function push(to, data) {
    const currentState = assign({}, historyState.value, history2.state, {
      forward: to,
      scroll: computeScrollPosition()
    });
    changeLocation(currentState.current, currentState, true);
    const state = assign({}, buildState(currentLocation.value, to, null), { position: currentState.position + 1 }, data);
    changeLocation(to, state, false);
    currentLocation.value = to;
  }
  return {
    location: currentLocation,
    state: historyState,
    push,
    replace
  };
}
function createWebHistory(base) {
  base = normalizeBase(base);
  const historyNavigation = useHistoryStateNavigation(base);
  const historyListeners = useHistoryListeners(base, historyNavigation.state, historyNavigation.location, historyNavigation.replace);
  function go(delta2, triggerListeners = true) {
    if (!triggerListeners)
      historyListeners.pauseListeners();
    history.go(delta2);
  }
  const routerHistory = assign({
    location: "",
    base,
    go,
    createHref: createHref.bind(null, base)
  }, historyNavigation, historyListeners);
  Object.defineProperty(routerHistory, "location", {
    enumerable: true,
    get: () => historyNavigation.location.value
  });
  Object.defineProperty(routerHistory, "state", {
    enumerable: true,
    get: () => historyNavigation.state.value
  });
  return routerHistory;
}
function createMemoryHistory(base = "") {
  let listeners = [];
  let queue2 = [START];
  let position = 0;
  function setLocation(location2) {
    position++;
    if (position === queue2.length) {
      queue2.push(location2);
    } else {
      queue2.splice(position);
      queue2.push(location2);
    }
  }
  function triggerListeners(to, from, { direction, delta: delta2 }) {
    const info = {
      direction,
      delta: delta2,
      type: NavigationType.pop
    };
    for (let callback of listeners) {
      callback(to, from, info);
    }
  }
  const routerHistory = {
    location: START,
    state: {},
    base,
    createHref: createHref.bind(null, base),
    replace(to) {
      queue2.splice(position--, 1);
      setLocation(to);
    },
    push(to, data) {
      setLocation(to);
    },
    listen(callback) {
      listeners.push(callback);
      return () => {
        const index2 = listeners.indexOf(callback);
        if (index2 > -1)
          listeners.splice(index2, 1);
      };
    },
    destroy() {
      listeners = [];
      queue2 = [START];
      position = 0;
    },
    go(delta2, shouldTrigger = true) {
      const from = this.location;
      const direction = delta2 < 0 ? NavigationDirection.back : NavigationDirection.forward;
      position = Math.max(0, Math.min(position + delta2, queue2.length - 1));
      if (shouldTrigger) {
        triggerListeners(this.location, from, {
          direction,
          delta: delta2
        });
      }
    }
  };
  Object.defineProperty(routerHistory, "location", {
    enumerable: true,
    get: () => queue2[position]
  });
  return routerHistory;
}
function createWebHashHistory(base) {
  base = location.host ? base || location.pathname + location.search : "";
  if (!base.includes("#"))
    base += "#";
  return createWebHistory(base);
}
function isRouteLocation(route) {
  return typeof route === "string" || route && typeof route === "object";
}
function isRouteName(name) {
  return typeof name === "string" || typeof name === "symbol";
}
const START_LOCATION_NORMALIZED = {
  path: "/",
  name: void 0,
  params: {},
  query: {},
  hash: "",
  fullPath: "/",
  matched: [],
  meta: {},
  redirectedFrom: void 0
};
const NavigationFailureSymbol = /* @__PURE__ */ PolySymbol("nf");
var NavigationFailureType;
(function(NavigationFailureType2) {
  NavigationFailureType2[NavigationFailureType2["aborted"] = 4] = "aborted";
  NavigationFailureType2[NavigationFailureType2["cancelled"] = 8] = "cancelled";
  NavigationFailureType2[NavigationFailureType2["duplicated"] = 16] = "duplicated";
})(NavigationFailureType || (NavigationFailureType = {}));
function createRouterError(type2, params) {
  {
    return assign(new Error(), {
      type: type2,
      [NavigationFailureSymbol]: true
    }, params);
  }
}
function isNavigationFailure(error, type2) {
  return error instanceof Error && NavigationFailureSymbol in error && (type2 == null || !!(error.type & type2));
}
const BASE_PARAM_PATTERN = "[^/]+?";
const BASE_PATH_PARSER_OPTIONS = {
  sensitive: false,
  strict: false,
  start: true,
  end: true
};
const REGEX_CHARS_RE = /[.+*?^${}()[\]/\\]/g;
function tokensToParser(segments, extraOptions) {
  const options = assign({}, BASE_PATH_PARSER_OPTIONS, extraOptions);
  let score = [];
  let pattern = options.start ? "^" : "";
  const keys = [];
  for (const segment of segments) {
    const segmentScores = segment.length ? [] : [90];
    if (options.strict && !segment.length)
      pattern += "/";
    for (let tokenIndex = 0; tokenIndex < segment.length; tokenIndex++) {
      const token = segment[tokenIndex];
      let subSegmentScore = 40 + (options.sensitive ? 0.25 : 0);
      if (token.type === 0) {
        if (!tokenIndex)
          pattern += "/";
        pattern += token.value.replace(REGEX_CHARS_RE, "\\$&");
        subSegmentScore += 40;
      } else if (token.type === 1) {
        const { value, repeatable, optional, regexp } = token;
        keys.push({
          name: value,
          repeatable,
          optional
        });
        const re2 = regexp ? regexp : BASE_PARAM_PATTERN;
        if (re2 !== BASE_PARAM_PATTERN) {
          subSegmentScore += 10;
          try {
            new RegExp(`(${re2})`);
          } catch (err) {
            throw new Error(`Invalid custom RegExp for param "${value}" (${re2}): ` + err.message);
          }
        }
        let subPattern = repeatable ? `((?:${re2})(?:/(?:${re2}))*)` : `(${re2})`;
        if (!tokenIndex)
          subPattern = optional && segment.length < 2 ? `(?:/${subPattern})` : "/" + subPattern;
        if (optional)
          subPattern += "?";
        pattern += subPattern;
        subSegmentScore += 20;
        if (optional)
          subSegmentScore += -8;
        if (repeatable)
          subSegmentScore += -20;
        if (re2 === ".*")
          subSegmentScore += -50;
      }
      segmentScores.push(subSegmentScore);
    }
    score.push(segmentScores);
  }
  if (options.strict && options.end) {
    const i = score.length - 1;
    score[i][score[i].length - 1] += 0.7000000000000001;
  }
  if (!options.strict)
    pattern += "/?";
  if (options.end)
    pattern += "$";
  else if (options.strict)
    pattern += "(?:/|$)";
  const re = new RegExp(pattern, options.sensitive ? "" : "i");
  function parse2(path) {
    const match2 = path.match(re);
    const params = {};
    if (!match2)
      return null;
    for (let i = 1; i < match2.length; i++) {
      const value = match2[i] || "";
      const key = keys[i - 1];
      params[key.name] = value && key.repeatable ? value.split("/") : value;
    }
    return params;
  }
  function stringify2(params) {
    let path = "";
    let avoidDuplicatedSlash = false;
    for (const segment of segments) {
      if (!avoidDuplicatedSlash || !path.endsWith("/"))
        path += "/";
      avoidDuplicatedSlash = false;
      for (const token of segment) {
        if (token.type === 0) {
          path += token.value;
        } else if (token.type === 1) {
          const { value, repeatable, optional } = token;
          const param = value in params ? params[value] : "";
          if (Array.isArray(param) && !repeatable)
            throw new Error(`Provided param "${value}" is an array but it is not repeatable (* or + modifiers)`);
          const text2 = Array.isArray(param) ? param.join("/") : param;
          if (!text2) {
            if (optional) {
              if (segment.length < 2) {
                if (path.endsWith("/"))
                  path = path.slice(0, -1);
                else
                  avoidDuplicatedSlash = true;
              }
            } else
              throw new Error(`Missing required param "${value}"`);
          }
          path += text2;
        }
      }
    }
    return path;
  }
  return {
    re,
    score,
    keys,
    parse: parse2,
    stringify: stringify2
  };
}
function compareScoreArray(a, b) {
  let i = 0;
  while (i < a.length && i < b.length) {
    const diff = b[i] - a[i];
    if (diff)
      return diff;
    i++;
  }
  if (a.length < b.length) {
    return a.length === 1 && a[0] === 40 + 40 ? -1 : 1;
  } else if (a.length > b.length) {
    return b.length === 1 && b[0] === 40 + 40 ? 1 : -1;
  }
  return 0;
}
function comparePathParserScore(a, b) {
  let i = 0;
  const aScore = a.score;
  const bScore = b.score;
  while (i < aScore.length && i < bScore.length) {
    const comp2 = compareScoreArray(aScore[i], bScore[i]);
    if (comp2)
      return comp2;
    i++;
  }
  return bScore.length - aScore.length;
}
const ROOT_TOKEN = {
  type: 0,
  value: ""
};
const VALID_PARAM_RE = /[a-zA-Z0-9_]/;
function tokenizePath(path) {
  if (!path)
    return [[]];
  if (path === "/")
    return [[ROOT_TOKEN]];
  if (!path.startsWith("/")) {
    throw new Error(`Invalid path "${path}"`);
  }
  function crash(message) {
    throw new Error(`ERR (${state})/"${buffer2}": ${message}`);
  }
  let state = 0;
  let previousState = state;
  const tokens = [];
  let segment;
  function finalizeSegment() {
    if (segment)
      tokens.push(segment);
    segment = [];
  }
  let i = 0;
  let char;
  let buffer2 = "";
  let customRe = "";
  function consumeBuffer() {
    if (!buffer2)
      return;
    if (state === 0) {
      segment.push({
        type: 0,
        value: buffer2
      });
    } else if (state === 1 || state === 2 || state === 3) {
      if (segment.length > 1 && (char === "*" || char === "+"))
        crash(`A repeatable param (${buffer2}) must be alone in its segment. eg: '/:ids+.`);
      segment.push({
        type: 1,
        value: buffer2,
        regexp: customRe,
        repeatable: char === "*" || char === "+",
        optional: char === "*" || char === "?"
      });
    } else {
      crash("Invalid state to consume buffer");
    }
    buffer2 = "";
  }
  function addCharToBuffer() {
    buffer2 += char;
  }
  while (i < path.length) {
    char = path[i++];
    if (char === "\\" && state !== 2) {
      previousState = state;
      state = 4;
      continue;
    }
    switch (state) {
      case 0:
        if (char === "/") {
          if (buffer2) {
            consumeBuffer();
          }
          finalizeSegment();
        } else if (char === ":") {
          consumeBuffer();
          state = 1;
        } else {
          addCharToBuffer();
        }
        break;
      case 4:
        addCharToBuffer();
        state = previousState;
        break;
      case 1:
        if (char === "(") {
          state = 2;
        } else if (VALID_PARAM_RE.test(char)) {
          addCharToBuffer();
        } else {
          consumeBuffer();
          state = 0;
          if (char !== "*" && char !== "?" && char !== "+")
            i--;
        }
        break;
      case 2:
        if (char === ")") {
          if (customRe[customRe.length - 1] == "\\")
            customRe = customRe.slice(0, -1) + char;
          else
            state = 3;
        } else {
          customRe += char;
        }
        break;
      case 3:
        consumeBuffer();
        state = 0;
        if (char !== "*" && char !== "?" && char !== "+")
          i--;
        customRe = "";
        break;
      default:
        crash("Unknown state");
        break;
    }
  }
  if (state === 2)
    crash(`Unfinished custom RegExp for param "${buffer2}"`);
  consumeBuffer();
  finalizeSegment();
  return tokens;
}
function createRouteRecordMatcher(record, parent, options) {
  const parser = tokensToParser(tokenizePath(record.path), options);
  const matcher2 = assign(parser, {
    record,
    parent,
    children: [],
    alias: []
  });
  if (parent) {
    if (!matcher2.record.aliasOf === !parent.record.aliasOf)
      parent.children.push(matcher2);
  }
  return matcher2;
}
function createRouterMatcher(routes, globalOptions) {
  const matchers = [];
  const matcherMap = new Map();
  globalOptions = mergeOptions({ strict: false, end: true, sensitive: false }, globalOptions);
  function getRecordMatcher(name) {
    return matcherMap.get(name);
  }
  function addRoute(record, parent, originalRecord) {
    let isRootAdd = !originalRecord;
    let mainNormalizedRecord = normalizeRouteRecord(record);
    mainNormalizedRecord.aliasOf = originalRecord && originalRecord.record;
    const options = mergeOptions(globalOptions, record);
    const normalizedRecords = [
      mainNormalizedRecord
    ];
    if ("alias" in record) {
      const aliases2 = typeof record.alias === "string" ? [record.alias] : record.alias;
      for (const alias of aliases2) {
        normalizedRecords.push(assign({}, mainNormalizedRecord, {
          components: originalRecord ? originalRecord.record.components : mainNormalizedRecord.components,
          path: alias,
          aliasOf: originalRecord ? originalRecord.record : mainNormalizedRecord
        }));
      }
    }
    let matcher2;
    let originalMatcher;
    for (const normalizedRecord of normalizedRecords) {
      let { path } = normalizedRecord;
      if (parent && path[0] !== "/") {
        let parentPath = parent.record.path;
        let connectingSlash = parentPath[parentPath.length - 1] === "/" ? "" : "/";
        normalizedRecord.path = parent.record.path + (path && connectingSlash + path);
      }
      matcher2 = createRouteRecordMatcher(normalizedRecord, parent, options);
      if (originalRecord) {
        originalRecord.alias.push(matcher2);
      } else {
        originalMatcher = originalMatcher || matcher2;
        if (originalMatcher !== matcher2)
          originalMatcher.alias.push(matcher2);
        if (isRootAdd && record.name && !isAliasRecord(matcher2))
          removeRoute(record.name);
      }
      if ("children" in mainNormalizedRecord) {
        let children = mainNormalizedRecord.children;
        for (let i = 0; i < children.length; i++) {
          addRoute(children[i], matcher2, originalRecord && originalRecord.children[i]);
        }
      }
      originalRecord = originalRecord || matcher2;
      insertMatcher(matcher2);
    }
    return originalMatcher ? () => {
      removeRoute(originalMatcher);
    } : noop;
  }
  function removeRoute(matcherRef) {
    if (isRouteName(matcherRef)) {
      const matcher2 = matcherMap.get(matcherRef);
      if (matcher2) {
        matcherMap.delete(matcherRef);
        matchers.splice(matchers.indexOf(matcher2), 1);
        matcher2.children.forEach(removeRoute);
        matcher2.alias.forEach(removeRoute);
      }
    } else {
      let index2 = matchers.indexOf(matcherRef);
      if (index2 > -1) {
        matchers.splice(index2, 1);
        if (matcherRef.record.name)
          matcherMap.delete(matcherRef.record.name);
        matcherRef.children.forEach(removeRoute);
        matcherRef.alias.forEach(removeRoute);
      }
    }
  }
  function getRoutes2() {
    return matchers;
  }
  function insertMatcher(matcher2) {
    let i = 0;
    while (i < matchers.length && comparePathParserScore(matcher2, matchers[i]) >= 0)
      i++;
    matchers.splice(i, 0, matcher2);
    if (matcher2.record.name && !isAliasRecord(matcher2))
      matcherMap.set(matcher2.record.name, matcher2);
  }
  function resolve2(location2, currentLocation) {
    let matcher2;
    let params = {};
    let path;
    let name;
    if ("name" in location2 && location2.name) {
      matcher2 = matcherMap.get(location2.name);
      if (!matcher2)
        throw createRouterError(1, {
          location: location2
        });
      name = matcher2.record.name;
      params = assign(paramsFromLocation(currentLocation.params, matcher2.keys.filter((k) => !k.optional).map((k) => k.name)), location2.params);
      path = matcher2.stringify(params);
    } else if ("path" in location2) {
      path = location2.path;
      matcher2 = matchers.find((m) => m.re.test(path));
      if (matcher2) {
        params = matcher2.parse(path);
        name = matcher2.record.name;
      }
    } else {
      matcher2 = currentLocation.name ? matcherMap.get(currentLocation.name) : matchers.find((m) => m.re.test(currentLocation.path));
      if (!matcher2)
        throw createRouterError(1, {
          location: location2,
          currentLocation
        });
      name = matcher2.record.name;
      params = assign({}, currentLocation.params, location2.params);
      path = matcher2.stringify(params);
    }
    const matched = [];
    let parentMatcher = matcher2;
    while (parentMatcher) {
      matched.unshift(parentMatcher.record);
      parentMatcher = parentMatcher.parent;
    }
    return {
      name,
      path,
      params,
      matched,
      meta: mergeMetaFields(matched)
    };
  }
  routes.forEach((route) => addRoute(route));
  return { addRoute, resolve: resolve2, removeRoute, getRoutes: getRoutes2, getRecordMatcher };
}
function paramsFromLocation(params, keys) {
  let newParams = {};
  for (let key of keys) {
    if (key in params)
      newParams[key] = params[key];
  }
  return newParams;
}
function normalizeRouteRecord(record) {
  return {
    path: record.path,
    redirect: record.redirect,
    name: record.name,
    meta: record.meta || {},
    aliasOf: void 0,
    beforeEnter: record.beforeEnter,
    props: normalizeRecordProps(record),
    children: record.children || [],
    instances: {},
    leaveGuards: new Set(),
    updateGuards: new Set(),
    enterCallbacks: {},
    components: "components" in record ? record.components || {} : { default: record.component }
  };
}
function normalizeRecordProps(record) {
  const propsObject = {};
  const props = record.props || false;
  if ("component" in record) {
    propsObject.default = props;
  } else {
    for (let name in record.components)
      propsObject[name] = typeof props === "boolean" ? props : props[name];
  }
  return propsObject;
}
function isAliasRecord(record) {
  while (record) {
    if (record.record.aliasOf)
      return true;
    record = record.parent;
  }
  return false;
}
function mergeMetaFields(matched) {
  return matched.reduce((meta, record) => assign(meta, record.meta), {});
}
function mergeOptions(defaults, partialOptions) {
  let options = {};
  for (let key in defaults) {
    options[key] = key in partialOptions ? partialOptions[key] : defaults[key];
  }
  return options;
}
const HASH_RE = /#/g;
const AMPERSAND_RE = /&/g;
const SLASH_RE = /\//g;
const EQUAL_RE = /=/g;
const IM_RE = /\?/g;
const PLUS_RE = /\+/g;
const ENC_BRACKET_OPEN_RE = /%5B/g;
const ENC_BRACKET_CLOSE_RE = /%5D/g;
const ENC_CARET_RE = /%5E/g;
const ENC_BACKTICK_RE = /%60/g;
const ENC_CURLY_OPEN_RE = /%7B/g;
const ENC_PIPE_RE = /%7C/g;
const ENC_CURLY_CLOSE_RE = /%7D/g;
const ENC_SPACE_RE = /%20/g;
function commonEncode(text2) {
  return encodeURI("" + text2).replace(ENC_PIPE_RE, "|").replace(ENC_BRACKET_OPEN_RE, "[").replace(ENC_BRACKET_CLOSE_RE, "]");
}
function encodeHash(text2) {
  return commonEncode(text2).replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryValue(text2) {
  return commonEncode(text2).replace(PLUS_RE, "%2B").replace(ENC_SPACE_RE, "+").replace(HASH_RE, "%23").replace(AMPERSAND_RE, "%26").replace(ENC_BACKTICK_RE, "`").replace(ENC_CURLY_OPEN_RE, "{").replace(ENC_CURLY_CLOSE_RE, "}").replace(ENC_CARET_RE, "^");
}
function encodeQueryKey(text2) {
  return encodeQueryValue(text2).replace(EQUAL_RE, "%3D");
}
function encodePath(text2) {
  return commonEncode(text2).replace(HASH_RE, "%23").replace(IM_RE, "%3F");
}
function encodeParam(text2) {
  return encodePath(text2).replace(SLASH_RE, "%2F");
}
function decode$2(text2) {
  try {
    return decodeURIComponent("" + text2);
  } catch (err) {
  }
  return "" + text2;
}
function parseQuery(search) {
  const query = {};
  if (search === "" || search === "?")
    return query;
  const hasLeadingIM = search[0] === "?";
  const searchParams = (hasLeadingIM ? search.slice(1) : search).split("&");
  for (let i = 0; i < searchParams.length; ++i) {
    const searchParam = searchParams[i].replace(PLUS_RE, " ");
    let eqPos = searchParam.indexOf("=");
    let key = decode$2(eqPos < 0 ? searchParam : searchParam.slice(0, eqPos));
    let value = eqPos < 0 ? null : decode$2(searchParam.slice(eqPos + 1));
    if (key in query) {
      let currentValue = query[key];
      if (!Array.isArray(currentValue)) {
        currentValue = query[key] = [currentValue];
      }
      currentValue.push(value);
    } else {
      query[key] = value;
    }
  }
  return query;
}
function stringifyQuery(query) {
  let search = "";
  for (let key in query) {
    const value = query[key];
    key = encodeQueryKey(key);
    if (value == null) {
      if (value !== void 0) {
        search += (search.length ? "&" : "") + key;
      }
      continue;
    }
    let values = Array.isArray(value) ? value.map((v) => v && encodeQueryValue(v)) : [value && encodeQueryValue(value)];
    values.forEach((value2) => {
      if (value2 !== void 0) {
        search += (search.length ? "&" : "") + key;
        if (value2 != null)
          search += "=" + value2;
      }
    });
  }
  return search;
}
function normalizeQuery(query) {
  const normalizedQuery = {};
  for (let key in query) {
    let value = query[key];
    if (value !== void 0) {
      normalizedQuery[key] = Array.isArray(value) ? value.map((v) => v == null ? null : "" + v) : value == null ? value : "" + value;
    }
  }
  return normalizedQuery;
}
function useCallbacks() {
  let handlers = [];
  function add2(handler) {
    handlers.push(handler);
    return () => {
      const i = handlers.indexOf(handler);
      if (i > -1)
        handlers.splice(i, 1);
    };
  }
  function reset2() {
    handlers = [];
  }
  return {
    add: add2,
    list: () => handlers,
    reset: reset2
  };
}
function registerGuard(record, name, guard) {
  const removeFromList = () => {
    record[name].delete(guard);
  };
  onUnmounted(removeFromList);
  onDeactivated(removeFromList);
  onActivated(() => {
    record[name].add(guard);
  });
  record[name].add(guard);
}
function onBeforeRouteLeave(leaveGuard) {
  const activeRecord = inject(matchedRouteKey, {}).value;
  if (!activeRecord) {
    return;
  }
  registerGuard(activeRecord, "leaveGuards", leaveGuard);
}
function onBeforeRouteUpdate(updateGuard) {
  const activeRecord = inject(matchedRouteKey, {}).value;
  if (!activeRecord) {
    return;
  }
  registerGuard(activeRecord, "updateGuards", updateGuard);
}
function guardToPromiseFn(guard, to, from, record, name) {
  const enterCallbackArray = record && (record.enterCallbacks[name] = record.enterCallbacks[name] || []);
  return () => new Promise((resolve2, reject) => {
    const next = (valid2) => {
      if (valid2 === false)
        reject(createRouterError(4, {
          from,
          to
        }));
      else if (valid2 instanceof Error) {
        reject(valid2);
      } else if (isRouteLocation(valid2)) {
        reject(createRouterError(2, {
          from: to,
          to: valid2
        }));
      } else {
        if (enterCallbackArray && record.enterCallbacks[name] === enterCallbackArray && typeof valid2 === "function")
          enterCallbackArray.push(valid2);
        resolve2();
      }
    };
    const guardReturn = guard.call(record && record.instances[name], to, from, next);
    let guardCall = Promise.resolve(guardReturn);
    if (guard.length < 3)
      guardCall = guardCall.then(next);
    guardCall.catch((err) => reject(err));
  });
}
function extractComponentsGuards(matched, guardType, to, from) {
  const guards = [];
  for (const record of matched) {
    for (const name in record.components) {
      let rawComponent = record.components[name];
      if (guardType !== "beforeRouteEnter" && !record.instances[name])
        continue;
      if (isRouteComponent(rawComponent)) {
        let options = rawComponent.__vccOpts || rawComponent;
        const guard = options[guardType];
        guard && guards.push(guardToPromiseFn(guard, to, from, record, name));
      } else {
        let componentPromise = rawComponent();
        guards.push(() => componentPromise.then((resolved) => {
          if (!resolved)
            return Promise.reject(new Error(`Couldn't resolve component "${name}" at "${record.path}"`));
          const resolvedComponent = isESModule(resolved) ? resolved.default : resolved;
          record.components[name] = resolvedComponent;
          let options = resolvedComponent.__vccOpts || resolvedComponent;
          const guard = options[guardType];
          return guard && guardToPromiseFn(guard, to, from, record, name)();
        }));
      }
    }
  }
  return guards;
}
function isRouteComponent(component) {
  return typeof component === "object" || "displayName" in component || "props" in component || "__vccOpts" in component;
}
function useLink(props) {
  const router = inject(routerKey);
  const currentRoute = inject(routeLocationKey);
  const route = computed(() => router.resolve(unref(props.to)));
  const activeRecordIndex = computed(() => {
    let { matched } = route.value;
    let { length } = matched;
    const routeMatched = matched[length - 1];
    let currentMatched = currentRoute.matched;
    if (!routeMatched || !currentMatched.length)
      return -1;
    let index2 = currentMatched.findIndex(isSameRouteRecord.bind(null, routeMatched));
    if (index2 > -1)
      return index2;
    let parentRecordPath = getOriginalPath(matched[length - 2]);
    return length > 1 && getOriginalPath(routeMatched) === parentRecordPath && currentMatched[currentMatched.length - 1].path !== parentRecordPath ? currentMatched.findIndex(isSameRouteRecord.bind(null, matched[length - 2])) : index2;
  });
  const isActive = computed(() => activeRecordIndex.value > -1 && includesParams(currentRoute.params, route.value.params));
  const isExactActive = computed(() => activeRecordIndex.value > -1 && activeRecordIndex.value === currentRoute.matched.length - 1 && isSameRouteLocationParams(currentRoute.params, route.value.params));
  function navigate(e = {}) {
    if (guardEvent(e)) {
      return router[unref(props.replace) ? "replace" : "push"](unref(props.to)).catch(noop);
    }
    return Promise.resolve();
  }
  return {
    route,
    href: computed(() => route.value.href),
    isActive,
    isExactActive,
    navigate
  };
}
const RouterLinkImpl = /* @__PURE__ */ defineComponent({
  name: "RouterLink",
  props: {
    to: {
      type: [String, Object],
      required: true
    },
    replace: Boolean,
    activeClass: String,
    exactActiveClass: String,
    custom: Boolean,
    ariaCurrentValue: {
      type: String,
      default: "page"
    }
  },
  useLink,
  setup(props, { slots }) {
    const link = reactive$1(useLink(props));
    const { options } = inject(routerKey);
    const elClass = computed(() => ({
      [getLinkClass(props.activeClass, options.linkActiveClass, "router-link-active")]: link.isActive,
      [getLinkClass(props.exactActiveClass, options.linkExactActiveClass, "router-link-exact-active")]: link.isExactActive
    }));
    return () => {
      const children = slots.default && slots.default(link);
      return props.custom ? children : h("a", {
        "aria-current": link.isExactActive ? props.ariaCurrentValue : null,
        href: link.href,
        onClick: link.navigate,
        class: elClass.value
      }, children);
    };
  }
});
const RouterLink = RouterLinkImpl;
function guardEvent(e) {
  if (e.metaKey || e.altKey || e.ctrlKey || e.shiftKey)
    return;
  if (e.defaultPrevented)
    return;
  if (e.button !== void 0 && e.button !== 0)
    return;
  if (e.currentTarget && e.currentTarget.getAttribute) {
    const target2 = e.currentTarget.getAttribute("target");
    if (/\b_blank\b/i.test(target2))
      return;
  }
  if (e.preventDefault)
    e.preventDefault();
  return true;
}
function includesParams(outer, inner) {
  for (let key in inner) {
    let innerValue = inner[key];
    let outerValue = outer[key];
    if (typeof innerValue === "string") {
      if (innerValue !== outerValue)
        return false;
    } else {
      if (!Array.isArray(outerValue) || outerValue.length !== innerValue.length || innerValue.some((value, i) => value !== outerValue[i]))
        return false;
    }
  }
  return true;
}
function getOriginalPath(record) {
  return record ? record.aliasOf ? record.aliasOf.path : record.path : "";
}
const getLinkClass = (propClass, globalClass, defaultClass) => propClass != null ? propClass : globalClass != null ? globalClass : defaultClass;
const RouterViewImpl = /* @__PURE__ */ defineComponent({
  name: "RouterView",
  inheritAttrs: false,
  props: {
    name: {
      type: String,
      default: "default"
    },
    route: Object
  },
  setup(props, { attrs, slots }) {
    const injectedRoute = inject(routerViewLocationKey);
    const routeToDisplay = computed(() => props.route || injectedRoute.value);
    const depth = inject(viewDepthKey, 0);
    const matchedRouteRef = computed(() => routeToDisplay.value.matched[depth]);
    provide(viewDepthKey, depth + 1);
    provide(matchedRouteKey, matchedRouteRef);
    provide(routerViewLocationKey, routeToDisplay);
    const viewRef = ref();
    watch(() => [viewRef.value, matchedRouteRef.value, props.name], ([instance, to, name], [oldInstance, from, oldName]) => {
      if (to) {
        to.instances[name] = instance;
        if (from && from !== to && instance && instance === oldInstance) {
          if (!to.leaveGuards.size) {
            to.leaveGuards = from.leaveGuards;
          }
          if (!to.updateGuards.size) {
            to.updateGuards = from.updateGuards;
          }
        }
      }
      if (instance && to && (!from || !isSameRouteRecord(to, from) || !oldInstance)) {
        (to.enterCallbacks[name] || []).forEach((callback) => callback(instance));
      }
    }, { flush: "post" });
    return () => {
      const route = routeToDisplay.value;
      const matchedRoute = matchedRouteRef.value;
      const ViewComponent = matchedRoute && matchedRoute.components[props.name];
      const currentName = props.name;
      if (!ViewComponent) {
        return normalizeSlot(slots.default, { Component: ViewComponent, route });
      }
      const routePropsOption = matchedRoute.props[props.name];
      const routeProps = routePropsOption ? routePropsOption === true ? route.params : typeof routePropsOption === "function" ? routePropsOption(route) : routePropsOption : null;
      const onVnodeUnmounted = (vnode) => {
        if (vnode.component.isUnmounted) {
          matchedRoute.instances[currentName] = null;
        }
      };
      const component = h(ViewComponent, assign({}, routeProps, attrs, {
        onVnodeUnmounted,
        ref: viewRef
      }));
      return normalizeSlot(slots.default, { Component: component, route }) || component;
    };
  }
});
function normalizeSlot(slot, data) {
  if (!slot)
    return null;
  const slotContent = slot(data);
  return slotContent.length === 1 ? slotContent[0] : slotContent;
}
const RouterView = RouterViewImpl;
function createRouter(options) {
  const matcher2 = createRouterMatcher(options.routes, options);
  let parseQuery$1 = options.parseQuery || parseQuery;
  let stringifyQuery$1 = options.stringifyQuery || stringifyQuery;
  let routerHistory = options.history;
  const beforeGuards = useCallbacks();
  const beforeResolveGuards = useCallbacks();
  const afterGuards = useCallbacks();
  const currentRoute = shallowRef(START_LOCATION_NORMALIZED);
  let pendingLocation = START_LOCATION_NORMALIZED;
  if (isBrowser && options.scrollBehavior && "scrollRestoration" in history) {
    history.scrollRestoration = "manual";
  }
  const normalizeParams = applyToParams.bind(null, (paramValue) => "" + paramValue);
  const encodeParams = applyToParams.bind(null, encodeParam);
  const decodeParams = applyToParams.bind(null, decode$2);
  function addRoute(parentOrRoute, route) {
    let parent;
    let record;
    if (isRouteName(parentOrRoute)) {
      parent = matcher2.getRecordMatcher(parentOrRoute);
      record = route;
    } else {
      record = parentOrRoute;
    }
    return matcher2.addRoute(record, parent);
  }
  function removeRoute(name) {
    let recordMatcher = matcher2.getRecordMatcher(name);
    if (recordMatcher) {
      matcher2.removeRoute(recordMatcher);
    }
  }
  function getRoutes2() {
    return matcher2.getRoutes().map((routeMatcher) => routeMatcher.record);
  }
  function hasRoute(name) {
    return !!matcher2.getRecordMatcher(name);
  }
  function resolve2(rawLocation, currentLocation) {
    currentLocation = assign({}, currentLocation || currentRoute.value);
    if (typeof rawLocation === "string") {
      let locationNormalized = parseURL(parseQuery$1, rawLocation, currentLocation.path);
      let matchedRoute2 = matcher2.resolve({ path: locationNormalized.path }, currentLocation);
      let href2 = routerHistory.createHref(locationNormalized.fullPath);
      return assign(locationNormalized, matchedRoute2, {
        params: decodeParams(matchedRoute2.params),
        hash: decode$2(locationNormalized.hash),
        redirectedFrom: void 0,
        href: href2
      });
    }
    let matcherLocation;
    if ("path" in rawLocation) {
      matcherLocation = assign({}, rawLocation, {
        path: parseURL(parseQuery$1, rawLocation.path, currentLocation.path).path
      });
    } else {
      matcherLocation = assign({}, rawLocation, {
        params: encodeParams(rawLocation.params)
      });
      currentLocation.params = encodeParams(currentLocation.params);
    }
    let matchedRoute = matcher2.resolve(matcherLocation, currentLocation);
    const hash2 = rawLocation.hash || "";
    matchedRoute.params = normalizeParams(decodeParams(matchedRoute.params));
    const fullPath = stringifyURL(stringifyQuery$1, assign({}, rawLocation, {
      hash: encodeHash(hash2),
      path: matchedRoute.path
    }));
    let href = routerHistory.createHref(fullPath);
    return assign({
      fullPath,
      hash: hash2,
      query: stringifyQuery$1 === stringifyQuery ? normalizeQuery(rawLocation.query) : rawLocation.query
    }, matchedRoute, {
      redirectedFrom: void 0,
      href
    });
  }
  function locationAsObject(to) {
    return typeof to === "string" ? parseURL(parseQuery$1, to, currentRoute.value.path) : assign({}, to);
  }
  function checkCanceledNavigation(to, from) {
    if (pendingLocation !== to) {
      return createRouterError(8, {
        from,
        to
      });
    }
  }
  function push(to) {
    return pushWithRedirect(to);
  }
  function replace(to) {
    return push(assign(locationAsObject(to), { replace: true }));
  }
  function handleRedirectRecord(to) {
    const lastMatched = to.matched[to.matched.length - 1];
    if (lastMatched && lastMatched.redirect) {
      const { redirect } = lastMatched;
      let newTargetLocation = typeof redirect === "function" ? redirect(to) : redirect;
      if (typeof newTargetLocation === "string") {
        newTargetLocation = newTargetLocation.includes("?") || newTargetLocation.includes("#") ? newTargetLocation = locationAsObject(newTargetLocation) : { path: newTargetLocation };
        newTargetLocation.params = {};
      }
      return assign({
        query: to.query,
        hash: to.hash,
        params: to.params
      }, newTargetLocation);
    }
  }
  function pushWithRedirect(to, redirectedFrom) {
    const targetLocation = pendingLocation = resolve2(to);
    const from = currentRoute.value;
    const data = to.state;
    const force = to.force;
    const replace2 = to.replace === true;
    const shouldRedirect = handleRedirectRecord(targetLocation);
    if (shouldRedirect)
      return pushWithRedirect(assign(locationAsObject(shouldRedirect), {
        state: data,
        force,
        replace: replace2
      }), redirectedFrom || targetLocation);
    const toLocation = targetLocation;
    toLocation.redirectedFrom = redirectedFrom;
    let failure;
    if (!force && isSameRouteLocation(stringifyQuery$1, from, targetLocation)) {
      failure = createRouterError(16, { to: toLocation, from });
      handleScroll(from, from, true, false);
    }
    return (failure ? Promise.resolve(failure) : navigate(toLocation, from)).catch((error) => isNavigationFailure(error) ? error : triggerError(error, toLocation, from)).then((failure2) => {
      if (failure2) {
        if (isNavigationFailure(failure2, 2)) {
          return pushWithRedirect(assign(locationAsObject(failure2.to), {
            state: data,
            force,
            replace: replace2
          }), redirectedFrom || toLocation);
        }
      } else {
        failure2 = finalizeNavigation(toLocation, from, true, replace2, data);
      }
      triggerAfterEach(toLocation, from, failure2);
      return failure2;
    });
  }
  function checkCanceledNavigationAndReject(to, from) {
    const error = checkCanceledNavigation(to, from);
    return error ? Promise.reject(error) : Promise.resolve();
  }
  function navigate(to, from) {
    let guards;
    const [leavingRecords, updatingRecords, enteringRecords] = extractChangingRecords(to, from);
    guards = extractComponentsGuards(leavingRecords.reverse(), "beforeRouteLeave", to, from);
    for (const record of leavingRecords) {
      record.leaveGuards.forEach((guard) => {
        guards.push(guardToPromiseFn(guard, to, from));
      });
    }
    const canceledNavigationCheck = checkCanceledNavigationAndReject.bind(null, to, from);
    guards.push(canceledNavigationCheck);
    return runGuardQueue(guards).then(() => {
      guards = [];
      for (const guard of beforeGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = extractComponentsGuards(updatingRecords, "beforeRouteUpdate", to, from);
      for (const record of updatingRecords) {
        record.updateGuards.forEach((guard) => {
          guards.push(guardToPromiseFn(guard, to, from));
        });
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const record of to.matched) {
        if (record.beforeEnter && !from.matched.includes(record)) {
          if (Array.isArray(record.beforeEnter)) {
            for (const beforeEnter of record.beforeEnter)
              guards.push(guardToPromiseFn(beforeEnter, to, from));
          } else {
            guards.push(guardToPromiseFn(record.beforeEnter, to, from));
          }
        }
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      to.matched.forEach((record) => record.enterCallbacks = {});
      guards = extractComponentsGuards(enteringRecords, "beforeRouteEnter", to, from);
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).then(() => {
      guards = [];
      for (const guard of beforeResolveGuards.list()) {
        guards.push(guardToPromiseFn(guard, to, from));
      }
      guards.push(canceledNavigationCheck);
      return runGuardQueue(guards);
    }).catch((err) => isNavigationFailure(err, 8) ? err : Promise.reject(err));
  }
  function triggerAfterEach(to, from, failure) {
    for (const guard of afterGuards.list())
      guard(to, from, failure);
  }
  function finalizeNavigation(toLocation, from, isPush, replace2, data) {
    const error = checkCanceledNavigation(toLocation, from);
    if (error)
      return error;
    const isFirstNavigation = from === START_LOCATION_NORMALIZED;
    const state = !isBrowser ? {} : history.state;
    if (isPush) {
      if (replace2 || isFirstNavigation)
        routerHistory.replace(toLocation.fullPath, assign({
          scroll: isFirstNavigation && state && state.scroll
        }, data));
      else
        routerHistory.push(toLocation.fullPath, data);
    }
    currentRoute.value = toLocation;
    handleScroll(toLocation, from, isPush, isFirstNavigation);
    markAsReady();
  }
  let removeHistoryListener;
  function setupListeners() {
    removeHistoryListener = routerHistory.listen((to, _from, info) => {
      let toLocation = resolve2(to);
      const shouldRedirect = handleRedirectRecord(toLocation);
      if (shouldRedirect) {
        pushWithRedirect(assign(shouldRedirect, { replace: true }), toLocation).catch(noop);
        return;
      }
      pendingLocation = toLocation;
      const from = currentRoute.value;
      if (isBrowser) {
        saveScrollPosition(getScrollKey(from.fullPath, info.delta), computeScrollPosition());
      }
      navigate(toLocation, from).catch((error) => {
        if (isNavigationFailure(error, 4 | 8)) {
          return error;
        }
        if (isNavigationFailure(error, 2)) {
          pushWithRedirect(error.to, toLocation).then((failure) => {
            if (isNavigationFailure(failure, 4 | 16) && !info.delta && info.type === NavigationType.pop) {
              routerHistory.go(-1, false);
            }
          }).catch(noop);
          return Promise.reject();
        }
        if (info.delta)
          routerHistory.go(-info.delta, false);
        return triggerError(error, toLocation, from);
      }).then((failure) => {
        failure = failure || finalizeNavigation(toLocation, from, false);
        if (failure) {
          if (info.delta) {
            routerHistory.go(-info.delta, false);
          } else if (info.type === NavigationType.pop && isNavigationFailure(failure, 4 | 16)) {
            routerHistory.go(-1, false);
          }
        }
        triggerAfterEach(toLocation, from, failure);
      }).catch(noop);
    });
  }
  let readyHandlers = useCallbacks();
  let errorHandlers = useCallbacks();
  let ready;
  function triggerError(error, to, from) {
    markAsReady(error);
    const list = errorHandlers.list();
    if (list.length) {
      list.forEach((handler) => handler(error, to, from));
    } else {
      console.error(error);
    }
    return Promise.reject(error);
  }
  function isReady() {
    if (ready && currentRoute.value !== START_LOCATION_NORMALIZED)
      return Promise.resolve();
    return new Promise((resolve3, reject) => {
      readyHandlers.add([resolve3, reject]);
    });
  }
  function markAsReady(err) {
    if (ready)
      return;
    ready = true;
    setupListeners();
    readyHandlers.list().forEach(([resolve3, reject]) => err ? reject(err) : resolve3());
    readyHandlers.reset();
  }
  function handleScroll(to, from, isPush, isFirstNavigation) {
    const { scrollBehavior } = options;
    if (!isBrowser || !scrollBehavior)
      return Promise.resolve();
    let scrollPosition = !isPush && getSavedScrollPosition(getScrollKey(to.fullPath, 0)) || (isFirstNavigation || !isPush) && history.state && history.state.scroll || null;
    return nextTick().then(() => scrollBehavior(to, from, scrollPosition)).then((position) => position && scrollToPosition(position)).catch((err) => triggerError(err, to, from));
  }
  const go = (delta2) => routerHistory.go(delta2);
  let started;
  const installedApps = new Set();
  const router = {
    currentRoute,
    addRoute,
    removeRoute,
    hasRoute,
    getRoutes: getRoutes2,
    resolve: resolve2,
    options,
    push,
    replace,
    go,
    back: () => go(-1),
    forward: () => go(1),
    beforeEach: beforeGuards.add,
    beforeResolve: beforeResolveGuards.add,
    afterEach: afterGuards.add,
    onError: errorHandlers.add,
    isReady,
    install(app2) {
      const router2 = this;
      app2.component("RouterLink", RouterLink);
      app2.component("RouterView", RouterView);
      app2.config.globalProperties.$router = router2;
      Object.defineProperty(app2.config.globalProperties, "$route", {
        enumerable: true,
        get: () => unref(currentRoute)
      });
      if (isBrowser && !started && currentRoute.value === START_LOCATION_NORMALIZED) {
        started = true;
        push(routerHistory.location).catch((err) => {
        });
      }
      const reactiveRoute = {};
      for (let key in START_LOCATION_NORMALIZED) {
        reactiveRoute[key] = computed(() => currentRoute.value[key]);
      }
      app2.provide(routerKey, router2);
      app2.provide(routeLocationKey, reactive$1(reactiveRoute));
      app2.provide(routerViewLocationKey, currentRoute);
      let unmountApp = app2.unmount;
      installedApps.add(app2);
      app2.unmount = function() {
        installedApps.delete(app2);
        if (installedApps.size < 1) {
          removeHistoryListener();
          currentRoute.value = START_LOCATION_NORMALIZED;
          started = false;
          ready = false;
        }
        unmountApp();
      };
    }
  };
  return router;
}
function runGuardQueue(guards) {
  return guards.reduce((promise, guard) => promise.then(() => guard()), Promise.resolve());
}
function extractChangingRecords(to, from) {
  const leavingRecords = [];
  const updatingRecords = [];
  const enteringRecords = [];
  const len = Math.max(from.matched.length, to.matched.length);
  for (let i = 0; i < len; i++) {
    const recordFrom = from.matched[i];
    if (recordFrom) {
      if (to.matched.find((record) => isSameRouteRecord(record, recordFrom)))
        updatingRecords.push(recordFrom);
      else
        leavingRecords.push(recordFrom);
    }
    const recordTo = to.matched[i];
    if (recordTo) {
      if (!from.matched.find((record) => isSameRouteRecord(record, recordTo))) {
        enteringRecords.push(recordTo);
      }
    }
  }
  return [leavingRecords, updatingRecords, enteringRecords];
}
function useRouter() {
  return inject(routerKey);
}
function useRoute$1() {
  return inject(routeLocationKey);
}
var vueRouter_esmBundler = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  get NavigationFailureType() {
    return NavigationFailureType;
  },
  RouterLink,
  RouterView,
  START_LOCATION: START_LOCATION_NORMALIZED,
  createMemoryHistory,
  createRouter,
  createRouterMatcher,
  createWebHashHistory,
  createWebHistory,
  isNavigationFailure,
  matchedRouteKey,
  onBeforeRouteLeave,
  onBeforeRouteUpdate,
  parseQuery,
  routeLocationKey,
  routerKey,
  routerViewLocationKey,
  stringifyQuery,
  useLink,
  useRoute: useRoute$1,
  useRouter,
  viewDepthKey
});
var __defProp2 = Object.defineProperty;
var __getOwnPropSymbols2 = Object.getOwnPropertySymbols;
var __hasOwnProp2 = Object.prototype.hasOwnProperty;
var __propIsEnum2 = Object.prototype.propertyIsEnumerable;
var __defNormalProp2 = (obj, key, value) => key in obj ? __defProp2(obj, key, { enumerable: true, configurable: true, writable: true, value }) : obj[key] = value;
var __spreadValues2 = (a, b) => {
  for (var prop2 in b || (b = {}))
    if (__hasOwnProp2.call(b, prop2))
      __defNormalProp2(a, prop2, b[prop2]);
  if (__getOwnPropSymbols2)
    for (var prop2 of __getOwnPropSymbols2(b)) {
      if (__propIsEnum2.call(b, prop2))
        __defNormalProp2(a, prop2, b[prop2]);
    }
  return a;
};
var PROVIDE_KEY = `usehead`;
var HEAD_COUNT_KEY = `head:count`;
var HEAD_ATTRS_KEY = `data-head-attrs`;
var createElement = (tag, attrs, document2) => {
  const el2 = document2.createElement(tag);
  for (const key of Object.keys(attrs)) {
    let value = attrs[key];
    if (key === "key" || value === false) {
      continue;
    }
    if (key === "children") {
      el2.textContent = value;
    } else {
      el2.setAttribute(key, value);
    }
  }
  return el2;
};
var getTagKey = (props) => {
  if (props.key !== void 0) {
    return { name: "key", value: props.key };
  }
  if (props.name !== void 0) {
    return { name: "name", value: props.name };
  }
  if (props.property !== void 0) {
    return {
      name: "property",
      value: props.property
    };
  }
};
var injectHead = () => {
  const head = inject(PROVIDE_KEY);
  if (!head) {
    throw new Error(`You may forget to apply app.use(head)`);
  }
  return head;
};
var acceptFields = [
  "title",
  "meta",
  "link",
  "base",
  "style",
  "script",
  "htmlAttrs",
  "bodyAttrs"
];
var headObjToTags = (obj) => {
  const tags = [];
  for (const key of Object.keys(obj)) {
    if (obj[key] == null)
      continue;
    if (key === "title") {
      tags.push({ tag: key, props: { children: obj[key] } });
    } else if (key === "base") {
      tags.push({ tag: key, props: __spreadValues2({ key: "default" }, obj[key]) });
    } else if (acceptFields.includes(key)) {
      const value = obj[key];
      if (Array.isArray(value)) {
        value.forEach((item) => {
          tags.push({ tag: key, props: item });
        });
      } else if (value) {
        tags.push({ tag: key, props: value });
      }
    }
  }
  return tags;
};
var setAttrs = (el2, attrs) => {
  const existingAttrs = el2.getAttribute(HEAD_ATTRS_KEY);
  if (existingAttrs) {
    for (const key of existingAttrs.split(",")) {
      el2.removeAttribute(key);
    }
  }
  const keys = [];
  for (const key in attrs) {
    const value = attrs[key];
    if (value == null)
      continue;
    if (value === false) {
      el2.removeAttribute(key);
    } else {
      el2.setAttribute(key, value);
    }
    keys.push(key);
  }
  if (keys.length) {
    el2.setAttribute(HEAD_ATTRS_KEY, keys.join(","));
  } else {
    el2.removeAttribute(HEAD_ATTRS_KEY);
  }
};
var insertTags = (tags, document2 = window.document) => {
  const head = document2.head;
  let headCountEl = head.querySelector(`meta[name="${HEAD_COUNT_KEY}"]`);
  const headCount = headCountEl ? Number(headCountEl.getAttribute("content")) : 0;
  const oldElements = [];
  if (headCountEl) {
    for (let i = 0, j = headCountEl.previousElementSibling; i < headCount; i++, j = j.previousElementSibling) {
      if (j) {
        oldElements.push(j);
      }
    }
  } else {
    headCountEl = document2.createElement("meta");
    headCountEl.setAttribute("name", HEAD_COUNT_KEY);
    headCountEl.setAttribute("content", "0");
    head.append(headCountEl);
  }
  const newElements = [];
  let title;
  let htmlAttrs = {};
  let bodyAttrs = {};
  for (const tag of tags) {
    if (tag.tag === "title") {
      title = tag.props.children;
      continue;
    }
    if (tag.tag === "htmlAttrs") {
      Object.assign(htmlAttrs, tag.props);
      continue;
    }
    if (tag.tag === "bodyAttrs") {
      Object.assign(bodyAttrs, tag.props);
      continue;
    }
    if (tag.tag === "meta") {
      const key = getTagKey(tag.props);
      if (key) {
        const elementList = [
          ...head.querySelectorAll(`meta[${key.name}="${key.value}"]`)
        ];
        for (const el2 of elementList) {
          if (!oldElements.includes(el2)) {
            oldElements.push(el2);
          }
        }
      }
    }
    newElements.push(createElement(tag.tag, tag.props, document2));
  }
  oldElements.forEach((el2) => {
    if (el2.nextSibling && el2.nextSibling.nodeType === Node.TEXT_NODE) {
      el2.nextSibling.remove();
    }
    el2.remove();
  });
  if (title !== void 0) {
    document2.title = title;
  }
  setAttrs(document2.documentElement, htmlAttrs);
  setAttrs(document2.body, bodyAttrs);
  newElements.forEach((el2) => {
    head.insertBefore(el2, headCountEl);
  });
  headCountEl.setAttribute("content", "" + newElements.length);
};
var createHead = () => {
  let allHeadObjs = [];
  const head = {
    install(app2) {
      app2.config.globalProperties.$head = head;
      app2.provide(PROVIDE_KEY, head);
    },
    get headTags() {
      const deduped = [];
      allHeadObjs.forEach((objs) => {
        const tags = headObjToTags(objs.value);
        tags.forEach((tag) => {
          if (tag.tag === "meta" || tag.tag === "base") {
            const key = getTagKey(tag.props);
            if (key) {
              let index2 = -1;
              for (let i = 0; i < deduped.length; i++) {
                const prev = deduped[i];
                const prevValue = prev.props[key.name];
                const nextValue = tag.props[key.name];
                if (prev.tag === tag.tag && prevValue === nextValue) {
                  index2 = i;
                  break;
                }
              }
              if (index2 !== -1) {
                deduped.splice(index2, 1);
              }
            }
          }
          deduped.push(tag);
        });
      });
      return deduped;
    },
    addHeadObjs(objs) {
      allHeadObjs.push(objs);
    },
    removeHeadObjs(objs) {
      allHeadObjs = allHeadObjs.filter((_objs) => _objs !== objs);
    },
    updateDOM(document2) {
      insertTags(head.headTags, document2);
    }
  };
  return head;
};
var IS_BROWSER = typeof window !== "undefined";
var useHead = (obj) => {
  const headObj = ref(obj);
  const head = injectHead();
  head.addHeadObjs(headObj);
  if (IS_BROWSER) {
    watchEffect(() => {
      head.updateDOM();
    });
    onBeforeUnmount(() => {
      head.removeHeadObjs(headObj);
      head.updateDOM();
    });
  }
};
var commonjsGlobal = typeof globalThis !== "undefined" ? globalThis : typeof window !== "undefined" ? window : typeof global !== "undefined" ? global : typeof self !== "undefined" ? self : {};
function getAugmentedNamespace(n) {
  if (n.__esModule)
    return n;
  var a = Object.defineProperty({}, "__esModule", { value: true });
  Object.keys(n).forEach(function(k) {
    var d = Object.getOwnPropertyDescriptor(n, k);
    Object.defineProperty(a, k, d.get ? d : {
      enumerable: true,
      get: function() {
        return n[k];
      }
    });
  });
  return a;
}
function every(arr, cb) {
  var i = 0, len = arr.length;
  for (; i < len; i++) {
    if (!cb(arr[i], i, arr)) {
      return false;
    }
  }
  return true;
}
const SEP = "/";
const STYPE = 0, PTYPE = 1, ATYPE = 2, OTYPE = 3;
const SLASH = 47, COLON = 58, ASTER = 42, QMARK = 63;
function strip(str) {
  if (str === SEP)
    return str;
  str.charCodeAt(0) === SLASH && (str = str.substring(1));
  var len = str.length - 1;
  return str.charCodeAt(len) === SLASH ? str.substring(0, len) : str;
}
function split(str) {
  return (str = strip(str)) === SEP ? [SEP] : str.split(SEP);
}
function isMatch(arr, obj, idx) {
  idx = arr[idx];
  return obj.val === idx && obj.type === STYPE || (idx === SEP ? obj.type > PTYPE : obj.type !== STYPE && (idx || "").endsWith(obj.end));
}
function match(str, all) {
  var i = 0, tmp, segs = split(str), len = segs.length, l;
  var fn2 = isMatch.bind(isMatch, segs);
  for (; i < all.length; i++) {
    tmp = all[i];
    if ((l = tmp.length) === len || l < len && tmp[l - 1].type === ATYPE || l > len && tmp[l - 1].type === OTYPE) {
      if (every(tmp, fn2))
        return tmp;
    }
  }
  return [];
}
function parse$6(str) {
  if (str === SEP) {
    return [{ old: str, type: STYPE, val: str, end: "" }];
  }
  var c, x, t, sfx, nxt = strip(str), i = -1, j = 0, len = nxt.length, out = [];
  while (++i < len) {
    c = nxt.charCodeAt(i);
    if (c === COLON) {
      j = i + 1;
      t = PTYPE;
      x = 0;
      sfx = "";
      while (i < len && nxt.charCodeAt(i) !== SLASH) {
        c = nxt.charCodeAt(i);
        if (c === QMARK) {
          x = i;
          t = OTYPE;
        } else if (c === 46 && sfx.length === 0) {
          sfx = nxt.substring(x = i);
        }
        i++;
      }
      out.push({
        old: str,
        type: t,
        val: nxt.substring(j, x || i),
        end: sfx
      });
      nxt = nxt.substring(i);
      len -= i;
      i = 0;
      continue;
    } else if (c === ASTER) {
      out.push({
        old: str,
        type: ATYPE,
        val: nxt.substring(i),
        end: ""
      });
      continue;
    } else {
      j = i;
      while (i < len && nxt.charCodeAt(i) !== SLASH) {
        ++i;
      }
      out.push({
        old: str,
        type: STYPE,
        val: nxt.substring(j, i),
        end: ""
      });
      nxt = nxt.substring(i);
      len -= i;
      i = j = 0;
    }
  }
  return out;
}
function exec(str, arr) {
  var i = 0, x, y, segs = split(str), out = {};
  for (; i < arr.length; i++) {
    x = segs[i];
    y = arr[i];
    if (x === SEP)
      continue;
    if (x !== void 0 && y.type | OTYPE === 2) {
      out[y.val] = x.replace(y.end, "");
    }
  }
  return out;
}
var matchit = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  match,
  parse: parse$6,
  exec
});
var require$$0$3 = /* @__PURE__ */ getAugmentedNamespace(matchit);
var dist = {};
var comment = {};
var node$1 = {};
var he = { exports: {} };
/*! https://mths.be/he v1.2.0 by @mathias | MIT license */
(function(module, exports) {
  (function(root) {
    var freeExports = exports;
    var freeModule = module && module.exports == freeExports && module;
    var freeGlobal = typeof commonjsGlobal == "object" && commonjsGlobal;
    if (freeGlobal.global === freeGlobal || freeGlobal.window === freeGlobal) {
      root = freeGlobal;
    }
    var regexAstralSymbols = /[\uD800-\uDBFF][\uDC00-\uDFFF]/g;
    var regexAsciiWhitelist = /[\x01-\x7F]/g;
    var regexBmpWhitelist = /[\x01-\t\x0B\f\x0E-\x1F\x7F\x81\x8D\x8F\x90\x9D\xA0-\uFFFF]/g;
    var regexEncodeNonAscii = /<\u20D2|=\u20E5|>\u20D2|\u205F\u200A|\u219D\u0338|\u2202\u0338|\u2220\u20D2|\u2229\uFE00|\u222A\uFE00|\u223C\u20D2|\u223D\u0331|\u223E\u0333|\u2242\u0338|\u224B\u0338|\u224D\u20D2|\u224E\u0338|\u224F\u0338|\u2250\u0338|\u2261\u20E5|\u2264\u20D2|\u2265\u20D2|\u2266\u0338|\u2267\u0338|\u2268\uFE00|\u2269\uFE00|\u226A\u0338|\u226A\u20D2|\u226B\u0338|\u226B\u20D2|\u227F\u0338|\u2282\u20D2|\u2283\u20D2|\u228A\uFE00|\u228B\uFE00|\u228F\u0338|\u2290\u0338|\u2293\uFE00|\u2294\uFE00|\u22B4\u20D2|\u22B5\u20D2|\u22D8\u0338|\u22D9\u0338|\u22DA\uFE00|\u22DB\uFE00|\u22F5\u0338|\u22F9\u0338|\u2933\u0338|\u29CF\u0338|\u29D0\u0338|\u2A6D\u0338|\u2A70\u0338|\u2A7D\u0338|\u2A7E\u0338|\u2AA1\u0338|\u2AA2\u0338|\u2AAC\uFE00|\u2AAD\uFE00|\u2AAF\u0338|\u2AB0\u0338|\u2AC5\u0338|\u2AC6\u0338|\u2ACB\uFE00|\u2ACC\uFE00|\u2AFD\u20E5|[\xA0-\u0113\u0116-\u0122\u0124-\u012B\u012E-\u014D\u0150-\u017E\u0192\u01B5\u01F5\u0237\u02C6\u02C7\u02D8-\u02DD\u0311\u0391-\u03A1\u03A3-\u03A9\u03B1-\u03C9\u03D1\u03D2\u03D5\u03D6\u03DC\u03DD\u03F0\u03F1\u03F5\u03F6\u0401-\u040C\u040E-\u044F\u0451-\u045C\u045E\u045F\u2002-\u2005\u2007-\u2010\u2013-\u2016\u2018-\u201A\u201C-\u201E\u2020-\u2022\u2025\u2026\u2030-\u2035\u2039\u203A\u203E\u2041\u2043\u2044\u204F\u2057\u205F-\u2063\u20AC\u20DB\u20DC\u2102\u2105\u210A-\u2113\u2115-\u211E\u2122\u2124\u2127-\u2129\u212C\u212D\u212F-\u2131\u2133-\u2138\u2145-\u2148\u2153-\u215E\u2190-\u219B\u219D-\u21A7\u21A9-\u21AE\u21B0-\u21B3\u21B5-\u21B7\u21BA-\u21DB\u21DD\u21E4\u21E5\u21F5\u21FD-\u2205\u2207-\u2209\u220B\u220C\u220F-\u2214\u2216-\u2218\u221A\u221D-\u2238\u223A-\u2257\u2259\u225A\u225C\u225F-\u2262\u2264-\u228B\u228D-\u229B\u229D-\u22A5\u22A7-\u22B0\u22B2-\u22BB\u22BD-\u22DB\u22DE-\u22E3\u22E6-\u22F7\u22F9-\u22FE\u2305\u2306\u2308-\u2310\u2312\u2313\u2315\u2316\u231C-\u231F\u2322\u2323\u232D\u232E\u2336\u233D\u233F\u237C\u23B0\u23B1\u23B4-\u23B6\u23DC-\u23DF\u23E2\u23E7\u2423\u24C8\u2500\u2502\u250C\u2510\u2514\u2518\u251C\u2524\u252C\u2534\u253C\u2550-\u256C\u2580\u2584\u2588\u2591-\u2593\u25A1\u25AA\u25AB\u25AD\u25AE\u25B1\u25B3-\u25B5\u25B8\u25B9\u25BD-\u25BF\u25C2\u25C3\u25CA\u25CB\u25EC\u25EF\u25F8-\u25FC\u2605\u2606\u260E\u2640\u2642\u2660\u2663\u2665\u2666\u266A\u266D-\u266F\u2713\u2717\u2720\u2736\u2758\u2772\u2773\u27C8\u27C9\u27E6-\u27ED\u27F5-\u27FA\u27FC\u27FF\u2902-\u2905\u290C-\u2913\u2916\u2919-\u2920\u2923-\u292A\u2933\u2935-\u2939\u293C\u293D\u2945\u2948-\u294B\u294E-\u2976\u2978\u2979\u297B-\u297F\u2985\u2986\u298B-\u2996\u299A\u299C\u299D\u29A4-\u29B7\u29B9\u29BB\u29BC\u29BE-\u29C5\u29C9\u29CD-\u29D0\u29DC-\u29DE\u29E3-\u29E5\u29EB\u29F4\u29F6\u2A00-\u2A02\u2A04\u2A06\u2A0C\u2A0D\u2A10-\u2A17\u2A22-\u2A27\u2A29\u2A2A\u2A2D-\u2A31\u2A33-\u2A3C\u2A3F\u2A40\u2A42-\u2A4D\u2A50\u2A53-\u2A58\u2A5A-\u2A5D\u2A5F\u2A66\u2A6A\u2A6D-\u2A75\u2A77-\u2A9A\u2A9D-\u2AA2\u2AA4-\u2AB0\u2AB3-\u2AC8\u2ACB\u2ACC\u2ACF-\u2ADB\u2AE4\u2AE6-\u2AE9\u2AEB-\u2AF3\u2AFD\uFB00-\uFB04]|\uD835[\uDC9C\uDC9E\uDC9F\uDCA2\uDCA5\uDCA6\uDCA9-\uDCAC\uDCAE-\uDCB9\uDCBB\uDCBD-\uDCC3\uDCC5-\uDCCF\uDD04\uDD05\uDD07-\uDD0A\uDD0D-\uDD14\uDD16-\uDD1C\uDD1E-\uDD39\uDD3B-\uDD3E\uDD40-\uDD44\uDD46\uDD4A-\uDD50\uDD52-\uDD6B]/g;
    var encodeMap = { "\xAD": "shy", "\u200C": "zwnj", "\u200D": "zwj", "\u200E": "lrm", "\u2063": "ic", "\u2062": "it", "\u2061": "af", "\u200F": "rlm", "\u200B": "ZeroWidthSpace", "\u2060": "NoBreak", "\u0311": "DownBreve", "\u20DB": "tdot", "\u20DC": "DotDot", "	": "Tab", "\n": "NewLine", "\u2008": "puncsp", "\u205F": "MediumSpace", "\u2009": "thinsp", "\u200A": "hairsp", "\u2004": "emsp13", "\u2002": "ensp", "\u2005": "emsp14", "\u2003": "emsp", "\u2007": "numsp", "\xA0": "nbsp", "\u205F\u200A": "ThickSpace", "\u203E": "oline", "_": "lowbar", "\u2010": "dash", "\u2013": "ndash", "\u2014": "mdash", "\u2015": "horbar", ",": "comma", ";": "semi", "\u204F": "bsemi", ":": "colon", "\u2A74": "Colone", "!": "excl", "\xA1": "iexcl", "?": "quest", "\xBF": "iquest", ".": "period", "\u2025": "nldr", "\u2026": "mldr", "\xB7": "middot", "'": "apos", "\u2018": "lsquo", "\u2019": "rsquo", "\u201A": "sbquo", "\u2039": "lsaquo", "\u203A": "rsaquo", '"': "quot", "\u201C": "ldquo", "\u201D": "rdquo", "\u201E": "bdquo", "\xAB": "laquo", "\xBB": "raquo", "(": "lpar", ")": "rpar", "[": "lsqb", "]": "rsqb", "{": "lcub", "}": "rcub", "\u2308": "lceil", "\u2309": "rceil", "\u230A": "lfloor", "\u230B": "rfloor", "\u2985": "lopar", "\u2986": "ropar", "\u298B": "lbrke", "\u298C": "rbrke", "\u298D": "lbrkslu", "\u298E": "rbrksld", "\u298F": "lbrksld", "\u2990": "rbrkslu", "\u2991": "langd", "\u2992": "rangd", "\u2993": "lparlt", "\u2994": "rpargt", "\u2995": "gtlPar", "\u2996": "ltrPar", "\u27E6": "lobrk", "\u27E7": "robrk", "\u27E8": "lang", "\u27E9": "rang", "\u27EA": "Lang", "\u27EB": "Rang", "\u27EC": "loang", "\u27ED": "roang", "\u2772": "lbbrk", "\u2773": "rbbrk", "\u2016": "Vert", "\xA7": "sect", "\xB6": "para", "@": "commat", "*": "ast", "/": "sol", "undefined": null, "&": "amp", "#": "num", "%": "percnt", "\u2030": "permil", "\u2031": "pertenk", "\u2020": "dagger", "\u2021": "Dagger", "\u2022": "bull", "\u2043": "hybull", "\u2032": "prime", "\u2033": "Prime", "\u2034": "tprime", "\u2057": "qprime", "\u2035": "bprime", "\u2041": "caret", "`": "grave", "\xB4": "acute", "\u02DC": "tilde", "^": "Hat", "\xAF": "macr", "\u02D8": "breve", "\u02D9": "dot", "\xA8": "die", "\u02DA": "ring", "\u02DD": "dblac", "\xB8": "cedil", "\u02DB": "ogon", "\u02C6": "circ", "\u02C7": "caron", "\xB0": "deg", "\xA9": "copy", "\xAE": "reg", "\u2117": "copysr", "\u2118": "wp", "\u211E": "rx", "\u2127": "mho", "\u2129": "iiota", "\u2190": "larr", "\u219A": "nlarr", "\u2192": "rarr", "\u219B": "nrarr", "\u2191": "uarr", "\u2193": "darr", "\u2194": "harr", "\u21AE": "nharr", "\u2195": "varr", "\u2196": "nwarr", "\u2197": "nearr", "\u2198": "searr", "\u2199": "swarr", "\u219D": "rarrw", "\u219D\u0338": "nrarrw", "\u219E": "Larr", "\u219F": "Uarr", "\u21A0": "Rarr", "\u21A1": "Darr", "\u21A2": "larrtl", "\u21A3": "rarrtl", "\u21A4": "mapstoleft", "\u21A5": "mapstoup", "\u21A6": "map", "\u21A7": "mapstodown", "\u21A9": "larrhk", "\u21AA": "rarrhk", "\u21AB": "larrlp", "\u21AC": "rarrlp", "\u21AD": "harrw", "\u21B0": "lsh", "\u21B1": "rsh", "\u21B2": "ldsh", "\u21B3": "rdsh", "\u21B5": "crarr", "\u21B6": "cularr", "\u21B7": "curarr", "\u21BA": "olarr", "\u21BB": "orarr", "\u21BC": "lharu", "\u21BD": "lhard", "\u21BE": "uharr", "\u21BF": "uharl", "\u21C0": "rharu", "\u21C1": "rhard", "\u21C2": "dharr", "\u21C3": "dharl", "\u21C4": "rlarr", "\u21C5": "udarr", "\u21C6": "lrarr", "\u21C7": "llarr", "\u21C8": "uuarr", "\u21C9": "rrarr", "\u21CA": "ddarr", "\u21CB": "lrhar", "\u21CC": "rlhar", "\u21D0": "lArr", "\u21CD": "nlArr", "\u21D1": "uArr", "\u21D2": "rArr", "\u21CF": "nrArr", "\u21D3": "dArr", "\u21D4": "iff", "\u21CE": "nhArr", "\u21D5": "vArr", "\u21D6": "nwArr", "\u21D7": "neArr", "\u21D8": "seArr", "\u21D9": "swArr", "\u21DA": "lAarr", "\u21DB": "rAarr", "\u21DD": "zigrarr", "\u21E4": "larrb", "\u21E5": "rarrb", "\u21F5": "duarr", "\u21FD": "loarr", "\u21FE": "roarr", "\u21FF": "hoarr", "\u2200": "forall", "\u2201": "comp", "\u2202": "part", "\u2202\u0338": "npart", "\u2203": "exist", "\u2204": "nexist", "\u2205": "empty", "\u2207": "Del", "\u2208": "in", "\u2209": "notin", "\u220B": "ni", "\u220C": "notni", "\u03F6": "bepsi", "\u220F": "prod", "\u2210": "coprod", "\u2211": "sum", "+": "plus", "\xB1": "pm", "\xF7": "div", "\xD7": "times", "<": "lt", "\u226E": "nlt", "<\u20D2": "nvlt", "=": "equals", "\u2260": "ne", "=\u20E5": "bne", "\u2A75": "Equal", ">": "gt", "\u226F": "ngt", ">\u20D2": "nvgt", "\xAC": "not", "|": "vert", "\xA6": "brvbar", "\u2212": "minus", "\u2213": "mp", "\u2214": "plusdo", "\u2044": "frasl", "\u2216": "setmn", "\u2217": "lowast", "\u2218": "compfn", "\u221A": "Sqrt", "\u221D": "prop", "\u221E": "infin", "\u221F": "angrt", "\u2220": "ang", "\u2220\u20D2": "nang", "\u2221": "angmsd", "\u2222": "angsph", "\u2223": "mid", "\u2224": "nmid", "\u2225": "par", "\u2226": "npar", "\u2227": "and", "\u2228": "or", "\u2229": "cap", "\u2229\uFE00": "caps", "\u222A": "cup", "\u222A\uFE00": "cups", "\u222B": "int", "\u222C": "Int", "\u222D": "tint", "\u2A0C": "qint", "\u222E": "oint", "\u222F": "Conint", "\u2230": "Cconint", "\u2231": "cwint", "\u2232": "cwconint", "\u2233": "awconint", "\u2234": "there4", "\u2235": "becaus", "\u2236": "ratio", "\u2237": "Colon", "\u2238": "minusd", "\u223A": "mDDot", "\u223B": "homtht", "\u223C": "sim", "\u2241": "nsim", "\u223C\u20D2": "nvsim", "\u223D": "bsim", "\u223D\u0331": "race", "\u223E": "ac", "\u223E\u0333": "acE", "\u223F": "acd", "\u2240": "wr", "\u2242": "esim", "\u2242\u0338": "nesim", "\u2243": "sime", "\u2244": "nsime", "\u2245": "cong", "\u2247": "ncong", "\u2246": "simne", "\u2248": "ap", "\u2249": "nap", "\u224A": "ape", "\u224B": "apid", "\u224B\u0338": "napid", "\u224C": "bcong", "\u224D": "CupCap", "\u226D": "NotCupCap", "\u224D\u20D2": "nvap", "\u224E": "bump", "\u224E\u0338": "nbump", "\u224F": "bumpe", "\u224F\u0338": "nbumpe", "\u2250": "doteq", "\u2250\u0338": "nedot", "\u2251": "eDot", "\u2252": "efDot", "\u2253": "erDot", "\u2254": "colone", "\u2255": "ecolon", "\u2256": "ecir", "\u2257": "cire", "\u2259": "wedgeq", "\u225A": "veeeq", "\u225C": "trie", "\u225F": "equest", "\u2261": "equiv", "\u2262": "nequiv", "\u2261\u20E5": "bnequiv", "\u2264": "le", "\u2270": "nle", "\u2264\u20D2": "nvle", "\u2265": "ge", "\u2271": "nge", "\u2265\u20D2": "nvge", "\u2266": "lE", "\u2266\u0338": "nlE", "\u2267": "gE", "\u2267\u0338": "ngE", "\u2268\uFE00": "lvnE", "\u2268": "lnE", "\u2269": "gnE", "\u2269\uFE00": "gvnE", "\u226A": "ll", "\u226A\u0338": "nLtv", "\u226A\u20D2": "nLt", "\u226B": "gg", "\u226B\u0338": "nGtv", "\u226B\u20D2": "nGt", "\u226C": "twixt", "\u2272": "lsim", "\u2274": "nlsim", "\u2273": "gsim", "\u2275": "ngsim", "\u2276": "lg", "\u2278": "ntlg", "\u2277": "gl", "\u2279": "ntgl", "\u227A": "pr", "\u2280": "npr", "\u227B": "sc", "\u2281": "nsc", "\u227C": "prcue", "\u22E0": "nprcue", "\u227D": "sccue", "\u22E1": "nsccue", "\u227E": "prsim", "\u227F": "scsim", "\u227F\u0338": "NotSucceedsTilde", "\u2282": "sub", "\u2284": "nsub", "\u2282\u20D2": "vnsub", "\u2283": "sup", "\u2285": "nsup", "\u2283\u20D2": "vnsup", "\u2286": "sube", "\u2288": "nsube", "\u2287": "supe", "\u2289": "nsupe", "\u228A\uFE00": "vsubne", "\u228A": "subne", "\u228B\uFE00": "vsupne", "\u228B": "supne", "\u228D": "cupdot", "\u228E": "uplus", "\u228F": "sqsub", "\u228F\u0338": "NotSquareSubset", "\u2290": "sqsup", "\u2290\u0338": "NotSquareSuperset", "\u2291": "sqsube", "\u22E2": "nsqsube", "\u2292": "sqsupe", "\u22E3": "nsqsupe", "\u2293": "sqcap", "\u2293\uFE00": "sqcaps", "\u2294": "sqcup", "\u2294\uFE00": "sqcups", "\u2295": "oplus", "\u2296": "ominus", "\u2297": "otimes", "\u2298": "osol", "\u2299": "odot", "\u229A": "ocir", "\u229B": "oast", "\u229D": "odash", "\u229E": "plusb", "\u229F": "minusb", "\u22A0": "timesb", "\u22A1": "sdotb", "\u22A2": "vdash", "\u22AC": "nvdash", "\u22A3": "dashv", "\u22A4": "top", "\u22A5": "bot", "\u22A7": "models", "\u22A8": "vDash", "\u22AD": "nvDash", "\u22A9": "Vdash", "\u22AE": "nVdash", "\u22AA": "Vvdash", "\u22AB": "VDash", "\u22AF": "nVDash", "\u22B0": "prurel", "\u22B2": "vltri", "\u22EA": "nltri", "\u22B3": "vrtri", "\u22EB": "nrtri", "\u22B4": "ltrie", "\u22EC": "nltrie", "\u22B4\u20D2": "nvltrie", "\u22B5": "rtrie", "\u22ED": "nrtrie", "\u22B5\u20D2": "nvrtrie", "\u22B6": "origof", "\u22B7": "imof", "\u22B8": "mumap", "\u22B9": "hercon", "\u22BA": "intcal", "\u22BB": "veebar", "\u22BD": "barvee", "\u22BE": "angrtvb", "\u22BF": "lrtri", "\u22C0": "Wedge", "\u22C1": "Vee", "\u22C2": "xcap", "\u22C3": "xcup", "\u22C4": "diam", "\u22C5": "sdot", "\u22C6": "Star", "\u22C7": "divonx", "\u22C8": "bowtie", "\u22C9": "ltimes", "\u22CA": "rtimes", "\u22CB": "lthree", "\u22CC": "rthree", "\u22CD": "bsime", "\u22CE": "cuvee", "\u22CF": "cuwed", "\u22D0": "Sub", "\u22D1": "Sup", "\u22D2": "Cap", "\u22D3": "Cup", "\u22D4": "fork", "\u22D5": "epar", "\u22D6": "ltdot", "\u22D7": "gtdot", "\u22D8": "Ll", "\u22D8\u0338": "nLl", "\u22D9": "Gg", "\u22D9\u0338": "nGg", "\u22DA\uFE00": "lesg", "\u22DA": "leg", "\u22DB": "gel", "\u22DB\uFE00": "gesl", "\u22DE": "cuepr", "\u22DF": "cuesc", "\u22E6": "lnsim", "\u22E7": "gnsim", "\u22E8": "prnsim", "\u22E9": "scnsim", "\u22EE": "vellip", "\u22EF": "ctdot", "\u22F0": "utdot", "\u22F1": "dtdot", "\u22F2": "disin", "\u22F3": "isinsv", "\u22F4": "isins", "\u22F5": "isindot", "\u22F5\u0338": "notindot", "\u22F6": "notinvc", "\u22F7": "notinvb", "\u22F9": "isinE", "\u22F9\u0338": "notinE", "\u22FA": "nisd", "\u22FB": "xnis", "\u22FC": "nis", "\u22FD": "notnivc", "\u22FE": "notnivb", "\u2305": "barwed", "\u2306": "Barwed", "\u230C": "drcrop", "\u230D": "dlcrop", "\u230E": "urcrop", "\u230F": "ulcrop", "\u2310": "bnot", "\u2312": "profline", "\u2313": "profsurf", "\u2315": "telrec", "\u2316": "target", "\u231C": "ulcorn", "\u231D": "urcorn", "\u231E": "dlcorn", "\u231F": "drcorn", "\u2322": "frown", "\u2323": "smile", "\u232D": "cylcty", "\u232E": "profalar", "\u2336": "topbot", "\u233D": "ovbar", "\u233F": "solbar", "\u237C": "angzarr", "\u23B0": "lmoust", "\u23B1": "rmoust", "\u23B4": "tbrk", "\u23B5": "bbrk", "\u23B6": "bbrktbrk", "\u23DC": "OverParenthesis", "\u23DD": "UnderParenthesis", "\u23DE": "OverBrace", "\u23DF": "UnderBrace", "\u23E2": "trpezium", "\u23E7": "elinters", "\u2423": "blank", "\u2500": "boxh", "\u2502": "boxv", "\u250C": "boxdr", "\u2510": "boxdl", "\u2514": "boxur", "\u2518": "boxul", "\u251C": "boxvr", "\u2524": "boxvl", "\u252C": "boxhd", "\u2534": "boxhu", "\u253C": "boxvh", "\u2550": "boxH", "\u2551": "boxV", "\u2552": "boxdR", "\u2553": "boxDr", "\u2554": "boxDR", "\u2555": "boxdL", "\u2556": "boxDl", "\u2557": "boxDL", "\u2558": "boxuR", "\u2559": "boxUr", "\u255A": "boxUR", "\u255B": "boxuL", "\u255C": "boxUl", "\u255D": "boxUL", "\u255E": "boxvR", "\u255F": "boxVr", "\u2560": "boxVR", "\u2561": "boxvL", "\u2562": "boxVl", "\u2563": "boxVL", "\u2564": "boxHd", "\u2565": "boxhD", "\u2566": "boxHD", "\u2567": "boxHu", "\u2568": "boxhU", "\u2569": "boxHU", "\u256A": "boxvH", "\u256B": "boxVh", "\u256C": "boxVH", "\u2580": "uhblk", "\u2584": "lhblk", "\u2588": "block", "\u2591": "blk14", "\u2592": "blk12", "\u2593": "blk34", "\u25A1": "squ", "\u25AA": "squf", "\u25AB": "EmptyVerySmallSquare", "\u25AD": "rect", "\u25AE": "marker", "\u25B1": "fltns", "\u25B3": "xutri", "\u25B4": "utrif", "\u25B5": "utri", "\u25B8": "rtrif", "\u25B9": "rtri", "\u25BD": "xdtri", "\u25BE": "dtrif", "\u25BF": "dtri", "\u25C2": "ltrif", "\u25C3": "ltri", "\u25CA": "loz", "\u25CB": "cir", "\u25EC": "tridot", "\u25EF": "xcirc", "\u25F8": "ultri", "\u25F9": "urtri", "\u25FA": "lltri", "\u25FB": "EmptySmallSquare", "\u25FC": "FilledSmallSquare", "\u2605": "starf", "\u2606": "star", "\u260E": "phone", "\u2640": "female", "\u2642": "male", "\u2660": "spades", "\u2663": "clubs", "\u2665": "hearts", "\u2666": "diams", "\u266A": "sung", "\u2713": "check", "\u2717": "cross", "\u2720": "malt", "\u2736": "sext", "\u2758": "VerticalSeparator", "\u27C8": "bsolhsub", "\u27C9": "suphsol", "\u27F5": "xlarr", "\u27F6": "xrarr", "\u27F7": "xharr", "\u27F8": "xlArr", "\u27F9": "xrArr", "\u27FA": "xhArr", "\u27FC": "xmap", "\u27FF": "dzigrarr", "\u2902": "nvlArr", "\u2903": "nvrArr", "\u2904": "nvHarr", "\u2905": "Map", "\u290C": "lbarr", "\u290D": "rbarr", "\u290E": "lBarr", "\u290F": "rBarr", "\u2910": "RBarr", "\u2911": "DDotrahd", "\u2912": "UpArrowBar", "\u2913": "DownArrowBar", "\u2916": "Rarrtl", "\u2919": "latail", "\u291A": "ratail", "\u291B": "lAtail", "\u291C": "rAtail", "\u291D": "larrfs", "\u291E": "rarrfs", "\u291F": "larrbfs", "\u2920": "rarrbfs", "\u2923": "nwarhk", "\u2924": "nearhk", "\u2925": "searhk", "\u2926": "swarhk", "\u2927": "nwnear", "\u2928": "toea", "\u2929": "tosa", "\u292A": "swnwar", "\u2933": "rarrc", "\u2933\u0338": "nrarrc", "\u2935": "cudarrr", "\u2936": "ldca", "\u2937": "rdca", "\u2938": "cudarrl", "\u2939": "larrpl", "\u293C": "curarrm", "\u293D": "cularrp", "\u2945": "rarrpl", "\u2948": "harrcir", "\u2949": "Uarrocir", "\u294A": "lurdshar", "\u294B": "ldrushar", "\u294E": "LeftRightVector", "\u294F": "RightUpDownVector", "\u2950": "DownLeftRightVector", "\u2951": "LeftUpDownVector", "\u2952": "LeftVectorBar", "\u2953": "RightVectorBar", "\u2954": "RightUpVectorBar", "\u2955": "RightDownVectorBar", "\u2956": "DownLeftVectorBar", "\u2957": "DownRightVectorBar", "\u2958": "LeftUpVectorBar", "\u2959": "LeftDownVectorBar", "\u295A": "LeftTeeVector", "\u295B": "RightTeeVector", "\u295C": "RightUpTeeVector", "\u295D": "RightDownTeeVector", "\u295E": "DownLeftTeeVector", "\u295F": "DownRightTeeVector", "\u2960": "LeftUpTeeVector", "\u2961": "LeftDownTeeVector", "\u2962": "lHar", "\u2963": "uHar", "\u2964": "rHar", "\u2965": "dHar", "\u2966": "luruhar", "\u2967": "ldrdhar", "\u2968": "ruluhar", "\u2969": "rdldhar", "\u296A": "lharul", "\u296B": "llhard", "\u296C": "rharul", "\u296D": "lrhard", "\u296E": "udhar", "\u296F": "duhar", "\u2970": "RoundImplies", "\u2971": "erarr", "\u2972": "simrarr", "\u2973": "larrsim", "\u2974": "rarrsim", "\u2975": "rarrap", "\u2976": "ltlarr", "\u2978": "gtrarr", "\u2979": "subrarr", "\u297B": "suplarr", "\u297C": "lfisht", "\u297D": "rfisht", "\u297E": "ufisht", "\u297F": "dfisht", "\u299A": "vzigzag", "\u299C": "vangrt", "\u299D": "angrtvbd", "\u29A4": "ange", "\u29A5": "range", "\u29A6": "dwangle", "\u29A7": "uwangle", "\u29A8": "angmsdaa", "\u29A9": "angmsdab", "\u29AA": "angmsdac", "\u29AB": "angmsdad", "\u29AC": "angmsdae", "\u29AD": "angmsdaf", "\u29AE": "angmsdag", "\u29AF": "angmsdah", "\u29B0": "bemptyv", "\u29B1": "demptyv", "\u29B2": "cemptyv", "\u29B3": "raemptyv", "\u29B4": "laemptyv", "\u29B5": "ohbar", "\u29B6": "omid", "\u29B7": "opar", "\u29B9": "operp", "\u29BB": "olcross", "\u29BC": "odsold", "\u29BE": "olcir", "\u29BF": "ofcir", "\u29C0": "olt", "\u29C1": "ogt", "\u29C2": "cirscir", "\u29C3": "cirE", "\u29C4": "solb", "\u29C5": "bsolb", "\u29C9": "boxbox", "\u29CD": "trisb", "\u29CE": "rtriltri", "\u29CF": "LeftTriangleBar", "\u29CF\u0338": "NotLeftTriangleBar", "\u29D0": "RightTriangleBar", "\u29D0\u0338": "NotRightTriangleBar", "\u29DC": "iinfin", "\u29DD": "infintie", "\u29DE": "nvinfin", "\u29E3": "eparsl", "\u29E4": "smeparsl", "\u29E5": "eqvparsl", "\u29EB": "lozf", "\u29F4": "RuleDelayed", "\u29F6": "dsol", "\u2A00": "xodot", "\u2A01": "xoplus", "\u2A02": "xotime", "\u2A04": "xuplus", "\u2A06": "xsqcup", "\u2A0D": "fpartint", "\u2A10": "cirfnint", "\u2A11": "awint", "\u2A12": "rppolint", "\u2A13": "scpolint", "\u2A14": "npolint", "\u2A15": "pointint", "\u2A16": "quatint", "\u2A17": "intlarhk", "\u2A22": "pluscir", "\u2A23": "plusacir", "\u2A24": "simplus", "\u2A25": "plusdu", "\u2A26": "plussim", "\u2A27": "plustwo", "\u2A29": "mcomma", "\u2A2A": "minusdu", "\u2A2D": "loplus", "\u2A2E": "roplus", "\u2A2F": "Cross", "\u2A30": "timesd", "\u2A31": "timesbar", "\u2A33": "smashp", "\u2A34": "lotimes", "\u2A35": "rotimes", "\u2A36": "otimesas", "\u2A37": "Otimes", "\u2A38": "odiv", "\u2A39": "triplus", "\u2A3A": "triminus", "\u2A3B": "tritime", "\u2A3C": "iprod", "\u2A3F": "amalg", "\u2A40": "capdot", "\u2A42": "ncup", "\u2A43": "ncap", "\u2A44": "capand", "\u2A45": "cupor", "\u2A46": "cupcap", "\u2A47": "capcup", "\u2A48": "cupbrcap", "\u2A49": "capbrcup", "\u2A4A": "cupcup", "\u2A4B": "capcap", "\u2A4C": "ccups", "\u2A4D": "ccaps", "\u2A50": "ccupssm", "\u2A53": "And", "\u2A54": "Or", "\u2A55": "andand", "\u2A56": "oror", "\u2A57": "orslope", "\u2A58": "andslope", "\u2A5A": "andv", "\u2A5B": "orv", "\u2A5C": "andd", "\u2A5D": "ord", "\u2A5F": "wedbar", "\u2A66": "sdote", "\u2A6A": "simdot", "\u2A6D": "congdot", "\u2A6D\u0338": "ncongdot", "\u2A6E": "easter", "\u2A6F": "apacir", "\u2A70": "apE", "\u2A70\u0338": "napE", "\u2A71": "eplus", "\u2A72": "pluse", "\u2A73": "Esim", "\u2A77": "eDDot", "\u2A78": "equivDD", "\u2A79": "ltcir", "\u2A7A": "gtcir", "\u2A7B": "ltquest", "\u2A7C": "gtquest", "\u2A7D": "les", "\u2A7D\u0338": "nles", "\u2A7E": "ges", "\u2A7E\u0338": "nges", "\u2A7F": "lesdot", "\u2A80": "gesdot", "\u2A81": "lesdoto", "\u2A82": "gesdoto", "\u2A83": "lesdotor", "\u2A84": "gesdotol", "\u2A85": "lap", "\u2A86": "gap", "\u2A87": "lne", "\u2A88": "gne", "\u2A89": "lnap", "\u2A8A": "gnap", "\u2A8B": "lEg", "\u2A8C": "gEl", "\u2A8D": "lsime", "\u2A8E": "gsime", "\u2A8F": "lsimg", "\u2A90": "gsiml", "\u2A91": "lgE", "\u2A92": "glE", "\u2A93": "lesges", "\u2A94": "gesles", "\u2A95": "els", "\u2A96": "egs", "\u2A97": "elsdot", "\u2A98": "egsdot", "\u2A99": "el", "\u2A9A": "eg", "\u2A9D": "siml", "\u2A9E": "simg", "\u2A9F": "simlE", "\u2AA0": "simgE", "\u2AA1": "LessLess", "\u2AA1\u0338": "NotNestedLessLess", "\u2AA2": "GreaterGreater", "\u2AA2\u0338": "NotNestedGreaterGreater", "\u2AA4": "glj", "\u2AA5": "gla", "\u2AA6": "ltcc", "\u2AA7": "gtcc", "\u2AA8": "lescc", "\u2AA9": "gescc", "\u2AAA": "smt", "\u2AAB": "lat", "\u2AAC": "smte", "\u2AAC\uFE00": "smtes", "\u2AAD": "late", "\u2AAD\uFE00": "lates", "\u2AAE": "bumpE", "\u2AAF": "pre", "\u2AAF\u0338": "npre", "\u2AB0": "sce", "\u2AB0\u0338": "nsce", "\u2AB3": "prE", "\u2AB4": "scE", "\u2AB5": "prnE", "\u2AB6": "scnE", "\u2AB7": "prap", "\u2AB8": "scap", "\u2AB9": "prnap", "\u2ABA": "scnap", "\u2ABB": "Pr", "\u2ABC": "Sc", "\u2ABD": "subdot", "\u2ABE": "supdot", "\u2ABF": "subplus", "\u2AC0": "supplus", "\u2AC1": "submult", "\u2AC2": "supmult", "\u2AC3": "subedot", "\u2AC4": "supedot", "\u2AC5": "subE", "\u2AC5\u0338": "nsubE", "\u2AC6": "supE", "\u2AC6\u0338": "nsupE", "\u2AC7": "subsim", "\u2AC8": "supsim", "\u2ACB\uFE00": "vsubnE", "\u2ACB": "subnE", "\u2ACC\uFE00": "vsupnE", "\u2ACC": "supnE", "\u2ACF": "csub", "\u2AD0": "csup", "\u2AD1": "csube", "\u2AD2": "csupe", "\u2AD3": "subsup", "\u2AD4": "supsub", "\u2AD5": "subsub", "\u2AD6": "supsup", "\u2AD7": "suphsub", "\u2AD8": "supdsub", "\u2AD9": "forkv", "\u2ADA": "topfork", "\u2ADB": "mlcp", "\u2AE4": "Dashv", "\u2AE6": "Vdashl", "\u2AE7": "Barv", "\u2AE8": "vBar", "\u2AE9": "vBarv", "\u2AEB": "Vbar", "\u2AEC": "Not", "\u2AED": "bNot", "\u2AEE": "rnmid", "\u2AEF": "cirmid", "\u2AF0": "midcir", "\u2AF1": "topcir", "\u2AF2": "nhpar", "\u2AF3": "parsim", "\u2AFD": "parsl", "\u2AFD\u20E5": "nparsl", "\u266D": "flat", "\u266E": "natur", "\u266F": "sharp", "\xA4": "curren", "\xA2": "cent", "$": "dollar", "\xA3": "pound", "\xA5": "yen", "\u20AC": "euro", "\xB9": "sup1", "\xBD": "half", "\u2153": "frac13", "\xBC": "frac14", "\u2155": "frac15", "\u2159": "frac16", "\u215B": "frac18", "\xB2": "sup2", "\u2154": "frac23", "\u2156": "frac25", "\xB3": "sup3", "\xBE": "frac34", "\u2157": "frac35", "\u215C": "frac38", "\u2158": "frac45", "\u215A": "frac56", "\u215D": "frac58", "\u215E": "frac78", "\u{1D4B6}": "ascr", "\u{1D552}": "aopf", "\u{1D51E}": "afr", "\u{1D538}": "Aopf", "\u{1D504}": "Afr", "\u{1D49C}": "Ascr", "\xAA": "ordf", "\xE1": "aacute", "\xC1": "Aacute", "\xE0": "agrave", "\xC0": "Agrave", "\u0103": "abreve", "\u0102": "Abreve", "\xE2": "acirc", "\xC2": "Acirc", "\xE5": "aring", "\xC5": "angst", "\xE4": "auml", "\xC4": "Auml", "\xE3": "atilde", "\xC3": "Atilde", "\u0105": "aogon", "\u0104": "Aogon", "\u0101": "amacr", "\u0100": "Amacr", "\xE6": "aelig", "\xC6": "AElig", "\u{1D4B7}": "bscr", "\u{1D553}": "bopf", "\u{1D51F}": "bfr", "\u{1D539}": "Bopf", "\u212C": "Bscr", "\u{1D505}": "Bfr", "\u{1D520}": "cfr", "\u{1D4B8}": "cscr", "\u{1D554}": "copf", "\u212D": "Cfr", "\u{1D49E}": "Cscr", "\u2102": "Copf", "\u0107": "cacute", "\u0106": "Cacute", "\u0109": "ccirc", "\u0108": "Ccirc", "\u010D": "ccaron", "\u010C": "Ccaron", "\u010B": "cdot", "\u010A": "Cdot", "\xE7": "ccedil", "\xC7": "Ccedil", "\u2105": "incare", "\u{1D521}": "dfr", "\u2146": "dd", "\u{1D555}": "dopf", "\u{1D4B9}": "dscr", "\u{1D49F}": "Dscr", "\u{1D507}": "Dfr", "\u2145": "DD", "\u{1D53B}": "Dopf", "\u010F": "dcaron", "\u010E": "Dcaron", "\u0111": "dstrok", "\u0110": "Dstrok", "\xF0": "eth", "\xD0": "ETH", "\u2147": "ee", "\u212F": "escr", "\u{1D522}": "efr", "\u{1D556}": "eopf", "\u2130": "Escr", "\u{1D508}": "Efr", "\u{1D53C}": "Eopf", "\xE9": "eacute", "\xC9": "Eacute", "\xE8": "egrave", "\xC8": "Egrave", "\xEA": "ecirc", "\xCA": "Ecirc", "\u011B": "ecaron", "\u011A": "Ecaron", "\xEB": "euml", "\xCB": "Euml", "\u0117": "edot", "\u0116": "Edot", "\u0119": "eogon", "\u0118": "Eogon", "\u0113": "emacr", "\u0112": "Emacr", "\u{1D523}": "ffr", "\u{1D557}": "fopf", "\u{1D4BB}": "fscr", "\u{1D509}": "Ffr", "\u{1D53D}": "Fopf", "\u2131": "Fscr", "\uFB00": "fflig", "\uFB03": "ffilig", "\uFB04": "ffllig", "\uFB01": "filig", "fj": "fjlig", "\uFB02": "fllig", "\u0192": "fnof", "\u210A": "gscr", "\u{1D558}": "gopf", "\u{1D524}": "gfr", "\u{1D4A2}": "Gscr", "\u{1D53E}": "Gopf", "\u{1D50A}": "Gfr", "\u01F5": "gacute", "\u011F": "gbreve", "\u011E": "Gbreve", "\u011D": "gcirc", "\u011C": "Gcirc", "\u0121": "gdot", "\u0120": "Gdot", "\u0122": "Gcedil", "\u{1D525}": "hfr", "\u210E": "planckh", "\u{1D4BD}": "hscr", "\u{1D559}": "hopf", "\u210B": "Hscr", "\u210C": "Hfr", "\u210D": "Hopf", "\u0125": "hcirc", "\u0124": "Hcirc", "\u210F": "hbar", "\u0127": "hstrok", "\u0126": "Hstrok", "\u{1D55A}": "iopf", "\u{1D526}": "ifr", "\u{1D4BE}": "iscr", "\u2148": "ii", "\u{1D540}": "Iopf", "\u2110": "Iscr", "\u2111": "Im", "\xED": "iacute", "\xCD": "Iacute", "\xEC": "igrave", "\xCC": "Igrave", "\xEE": "icirc", "\xCE": "Icirc", "\xEF": "iuml", "\xCF": "Iuml", "\u0129": "itilde", "\u0128": "Itilde", "\u0130": "Idot", "\u012F": "iogon", "\u012E": "Iogon", "\u012B": "imacr", "\u012A": "Imacr", "\u0133": "ijlig", "\u0132": "IJlig", "\u0131": "imath", "\u{1D4BF}": "jscr", "\u{1D55B}": "jopf", "\u{1D527}": "jfr", "\u{1D4A5}": "Jscr", "\u{1D50D}": "Jfr", "\u{1D541}": "Jopf", "\u0135": "jcirc", "\u0134": "Jcirc", "\u0237": "jmath", "\u{1D55C}": "kopf", "\u{1D4C0}": "kscr", "\u{1D528}": "kfr", "\u{1D4A6}": "Kscr", "\u{1D542}": "Kopf", "\u{1D50E}": "Kfr", "\u0137": "kcedil", "\u0136": "Kcedil", "\u{1D529}": "lfr", "\u{1D4C1}": "lscr", "\u2113": "ell", "\u{1D55D}": "lopf", "\u2112": "Lscr", "\u{1D50F}": "Lfr", "\u{1D543}": "Lopf", "\u013A": "lacute", "\u0139": "Lacute", "\u013E": "lcaron", "\u013D": "Lcaron", "\u013C": "lcedil", "\u013B": "Lcedil", "\u0142": "lstrok", "\u0141": "Lstrok", "\u0140": "lmidot", "\u013F": "Lmidot", "\u{1D52A}": "mfr", "\u{1D55E}": "mopf", "\u{1D4C2}": "mscr", "\u{1D510}": "Mfr", "\u{1D544}": "Mopf", "\u2133": "Mscr", "\u{1D52B}": "nfr", "\u{1D55F}": "nopf", "\u{1D4C3}": "nscr", "\u2115": "Nopf", "\u{1D4A9}": "Nscr", "\u{1D511}": "Nfr", "\u0144": "nacute", "\u0143": "Nacute", "\u0148": "ncaron", "\u0147": "Ncaron", "\xF1": "ntilde", "\xD1": "Ntilde", "\u0146": "ncedil", "\u0145": "Ncedil", "\u2116": "numero", "\u014B": "eng", "\u014A": "ENG", "\u{1D560}": "oopf", "\u{1D52C}": "ofr", "\u2134": "oscr", "\u{1D4AA}": "Oscr", "\u{1D512}": "Ofr", "\u{1D546}": "Oopf", "\xBA": "ordm", "\xF3": "oacute", "\xD3": "Oacute", "\xF2": "ograve", "\xD2": "Ograve", "\xF4": "ocirc", "\xD4": "Ocirc", "\xF6": "ouml", "\xD6": "Ouml", "\u0151": "odblac", "\u0150": "Odblac", "\xF5": "otilde", "\xD5": "Otilde", "\xF8": "oslash", "\xD8": "Oslash", "\u014D": "omacr", "\u014C": "Omacr", "\u0153": "oelig", "\u0152": "OElig", "\u{1D52D}": "pfr", "\u{1D4C5}": "pscr", "\u{1D561}": "popf", "\u2119": "Popf", "\u{1D513}": "Pfr", "\u{1D4AB}": "Pscr", "\u{1D562}": "qopf", "\u{1D52E}": "qfr", "\u{1D4C6}": "qscr", "\u{1D4AC}": "Qscr", "\u{1D514}": "Qfr", "\u211A": "Qopf", "\u0138": "kgreen", "\u{1D52F}": "rfr", "\u{1D563}": "ropf", "\u{1D4C7}": "rscr", "\u211B": "Rscr", "\u211C": "Re", "\u211D": "Ropf", "\u0155": "racute", "\u0154": "Racute", "\u0159": "rcaron", "\u0158": "Rcaron", "\u0157": "rcedil", "\u0156": "Rcedil", "\u{1D564}": "sopf", "\u{1D4C8}": "sscr", "\u{1D530}": "sfr", "\u{1D54A}": "Sopf", "\u{1D516}": "Sfr", "\u{1D4AE}": "Sscr", "\u24C8": "oS", "\u015B": "sacute", "\u015A": "Sacute", "\u015D": "scirc", "\u015C": "Scirc", "\u0161": "scaron", "\u0160": "Scaron", "\u015F": "scedil", "\u015E": "Scedil", "\xDF": "szlig", "\u{1D531}": "tfr", "\u{1D4C9}": "tscr", "\u{1D565}": "topf", "\u{1D4AF}": "Tscr", "\u{1D517}": "Tfr", "\u{1D54B}": "Topf", "\u0165": "tcaron", "\u0164": "Tcaron", "\u0163": "tcedil", "\u0162": "Tcedil", "\u2122": "trade", "\u0167": "tstrok", "\u0166": "Tstrok", "\u{1D4CA}": "uscr", "\u{1D566}": "uopf", "\u{1D532}": "ufr", "\u{1D54C}": "Uopf", "\u{1D518}": "Ufr", "\u{1D4B0}": "Uscr", "\xFA": "uacute", "\xDA": "Uacute", "\xF9": "ugrave", "\xD9": "Ugrave", "\u016D": "ubreve", "\u016C": "Ubreve", "\xFB": "ucirc", "\xDB": "Ucirc", "\u016F": "uring", "\u016E": "Uring", "\xFC": "uuml", "\xDC": "Uuml", "\u0171": "udblac", "\u0170": "Udblac", "\u0169": "utilde", "\u0168": "Utilde", "\u0173": "uogon", "\u0172": "Uogon", "\u016B": "umacr", "\u016A": "Umacr", "\u{1D533}": "vfr", "\u{1D567}": "vopf", "\u{1D4CB}": "vscr", "\u{1D519}": "Vfr", "\u{1D54D}": "Vopf", "\u{1D4B1}": "Vscr", "\u{1D568}": "wopf", "\u{1D4CC}": "wscr", "\u{1D534}": "wfr", "\u{1D4B2}": "Wscr", "\u{1D54E}": "Wopf", "\u{1D51A}": "Wfr", "\u0175": "wcirc", "\u0174": "Wcirc", "\u{1D535}": "xfr", "\u{1D4CD}": "xscr", "\u{1D569}": "xopf", "\u{1D54F}": "Xopf", "\u{1D51B}": "Xfr", "\u{1D4B3}": "Xscr", "\u{1D536}": "yfr", "\u{1D4CE}": "yscr", "\u{1D56A}": "yopf", "\u{1D4B4}": "Yscr", "\u{1D51C}": "Yfr", "\u{1D550}": "Yopf", "\xFD": "yacute", "\xDD": "Yacute", "\u0177": "ycirc", "\u0176": "Ycirc", "\xFF": "yuml", "\u0178": "Yuml", "\u{1D4CF}": "zscr", "\u{1D537}": "zfr", "\u{1D56B}": "zopf", "\u2128": "Zfr", "\u2124": "Zopf", "\u{1D4B5}": "Zscr", "\u017A": "zacute", "\u0179": "Zacute", "\u017E": "zcaron", "\u017D": "Zcaron", "\u017C": "zdot", "\u017B": "Zdot", "\u01B5": "imped", "\xFE": "thorn", "\xDE": "THORN", "\u0149": "napos", "\u03B1": "alpha", "\u0391": "Alpha", "\u03B2": "beta", "\u0392": "Beta", "\u03B3": "gamma", "\u0393": "Gamma", "\u03B4": "delta", "\u0394": "Delta", "\u03B5": "epsi", "\u03F5": "epsiv", "\u0395": "Epsilon", "\u03DD": "gammad", "\u03DC": "Gammad", "\u03B6": "zeta", "\u0396": "Zeta", "\u03B7": "eta", "\u0397": "Eta", "\u03B8": "theta", "\u03D1": "thetav", "\u0398": "Theta", "\u03B9": "iota", "\u0399": "Iota", "\u03BA": "kappa", "\u03F0": "kappav", "\u039A": "Kappa", "\u03BB": "lambda", "\u039B": "Lambda", "\u03BC": "mu", "\xB5": "micro", "\u039C": "Mu", "\u03BD": "nu", "\u039D": "Nu", "\u03BE": "xi", "\u039E": "Xi", "\u03BF": "omicron", "\u039F": "Omicron", "\u03C0": "pi", "\u03D6": "piv", "\u03A0": "Pi", "\u03C1": "rho", "\u03F1": "rhov", "\u03A1": "Rho", "\u03C3": "sigma", "\u03A3": "Sigma", "\u03C2": "sigmaf", "\u03C4": "tau", "\u03A4": "Tau", "\u03C5": "upsi", "\u03A5": "Upsilon", "\u03D2": "Upsi", "\u03C6": "phi", "\u03D5": "phiv", "\u03A6": "Phi", "\u03C7": "chi", "\u03A7": "Chi", "\u03C8": "psi", "\u03A8": "Psi", "\u03C9": "omega", "\u03A9": "ohm", "\u0430": "acy", "\u0410": "Acy", "\u0431": "bcy", "\u0411": "Bcy", "\u0432": "vcy", "\u0412": "Vcy", "\u0433": "gcy", "\u0413": "Gcy", "\u0453": "gjcy", "\u0403": "GJcy", "\u0434": "dcy", "\u0414": "Dcy", "\u0452": "djcy", "\u0402": "DJcy", "\u0435": "iecy", "\u0415": "IEcy", "\u0451": "iocy", "\u0401": "IOcy", "\u0454": "jukcy", "\u0404": "Jukcy", "\u0436": "zhcy", "\u0416": "ZHcy", "\u0437": "zcy", "\u0417": "Zcy", "\u0455": "dscy", "\u0405": "DScy", "\u0438": "icy", "\u0418": "Icy", "\u0456": "iukcy", "\u0406": "Iukcy", "\u0457": "yicy", "\u0407": "YIcy", "\u0439": "jcy", "\u0419": "Jcy", "\u0458": "jsercy", "\u0408": "Jsercy", "\u043A": "kcy", "\u041A": "Kcy", "\u045C": "kjcy", "\u040C": "KJcy", "\u043B": "lcy", "\u041B": "Lcy", "\u0459": "ljcy", "\u0409": "LJcy", "\u043C": "mcy", "\u041C": "Mcy", "\u043D": "ncy", "\u041D": "Ncy", "\u045A": "njcy", "\u040A": "NJcy", "\u043E": "ocy", "\u041E": "Ocy", "\u043F": "pcy", "\u041F": "Pcy", "\u0440": "rcy", "\u0420": "Rcy", "\u0441": "scy", "\u0421": "Scy", "\u0442": "tcy", "\u0422": "Tcy", "\u045B": "tshcy", "\u040B": "TSHcy", "\u0443": "ucy", "\u0423": "Ucy", "\u045E": "ubrcy", "\u040E": "Ubrcy", "\u0444": "fcy", "\u0424": "Fcy", "\u0445": "khcy", "\u0425": "KHcy", "\u0446": "tscy", "\u0426": "TScy", "\u0447": "chcy", "\u0427": "CHcy", "\u045F": "dzcy", "\u040F": "DZcy", "\u0448": "shcy", "\u0428": "SHcy", "\u0449": "shchcy", "\u0429": "SHCHcy", "\u044A": "hardcy", "\u042A": "HARDcy", "\u044B": "ycy", "\u042B": "Ycy", "\u044C": "softcy", "\u042C": "SOFTcy", "\u044D": "ecy", "\u042D": "Ecy", "\u044E": "yucy", "\u042E": "YUcy", "\u044F": "yacy", "\u042F": "YAcy", "\u2135": "aleph", "\u2136": "beth", "\u2137": "gimel", "\u2138": "daleth" };
    var regexEscape = /["&'<>`]/g;
    var escapeMap = {
      '"': "&quot;",
      "&": "&amp;",
      "'": "&#x27;",
      "<": "&lt;",
      ">": "&gt;",
      "`": "&#x60;"
    };
    var regexInvalidEntity = /&#(?:[xX][^a-fA-F0-9]|[^0-9xX])/;
    var regexInvalidRawCodePoint = /[\0-\x08\x0B\x0E-\x1F\x7F-\x9F\uFDD0-\uFDEF\uFFFE\uFFFF]|[\uD83F\uD87F\uD8BF\uD8FF\uD93F\uD97F\uD9BF\uD9FF\uDA3F\uDA7F\uDABF\uDAFF\uDB3F\uDB7F\uDBBF\uDBFF][\uDFFE\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF]/;
    var regexDecode = /&(CounterClockwiseContourIntegral|DoubleLongLeftRightArrow|ClockwiseContourIntegral|NotNestedGreaterGreater|NotSquareSupersetEqual|DiacriticalDoubleAcute|NotRightTriangleEqual|NotSucceedsSlantEqual|NotPrecedesSlantEqual|CloseCurlyDoubleQuote|NegativeVeryThinSpace|DoubleContourIntegral|FilledVerySmallSquare|CapitalDifferentialD|OpenCurlyDoubleQuote|EmptyVerySmallSquare|NestedGreaterGreater|DoubleLongRightArrow|NotLeftTriangleEqual|NotGreaterSlantEqual|ReverseUpEquilibrium|DoubleLeftRightArrow|NotSquareSubsetEqual|NotDoubleVerticalBar|RightArrowLeftArrow|NotGreaterFullEqual|NotRightTriangleBar|SquareSupersetEqual|DownLeftRightVector|DoubleLongLeftArrow|leftrightsquigarrow|LeftArrowRightArrow|NegativeMediumSpace|blacktriangleright|RightDownVectorBar|PrecedesSlantEqual|RightDoubleBracket|SucceedsSlantEqual|NotLeftTriangleBar|RightTriangleEqual|SquareIntersection|RightDownTeeVector|ReverseEquilibrium|NegativeThickSpace|longleftrightarrow|Longleftrightarrow|LongLeftRightArrow|DownRightTeeVector|DownRightVectorBar|GreaterSlantEqual|SquareSubsetEqual|LeftDownVectorBar|LeftDoubleBracket|VerticalSeparator|rightleftharpoons|NotGreaterGreater|NotSquareSuperset|blacktriangleleft|blacktriangledown|NegativeThinSpace|LeftDownTeeVector|NotLessSlantEqual|leftrightharpoons|DoubleUpDownArrow|DoubleVerticalBar|LeftTriangleEqual|FilledSmallSquare|twoheadrightarrow|NotNestedLessLess|DownLeftTeeVector|DownLeftVectorBar|RightAngleBracket|NotTildeFullEqual|NotReverseElement|RightUpDownVector|DiacriticalTilde|NotSucceedsTilde|circlearrowright|NotPrecedesEqual|rightharpoondown|DoubleRightArrow|NotSucceedsEqual|NonBreakingSpace|NotRightTriangle|LessEqualGreater|RightUpTeeVector|LeftAngleBracket|GreaterFullEqual|DownArrowUpArrow|RightUpVectorBar|twoheadleftarrow|GreaterEqualLess|downharpoonright|RightTriangleBar|ntrianglerighteq|NotSupersetEqual|LeftUpDownVector|DiacriticalAcute|rightrightarrows|vartriangleright|UpArrowDownArrow|DiacriticalGrave|UnderParenthesis|EmptySmallSquare|LeftUpVectorBar|leftrightarrows|DownRightVector|downharpoonleft|trianglerighteq|ShortRightArrow|OverParenthesis|DoubleLeftArrow|DoubleDownArrow|NotSquareSubset|bigtriangledown|ntrianglelefteq|UpperRightArrow|curvearrowright|vartriangleleft|NotLeftTriangle|nleftrightarrow|LowerRightArrow|NotHumpDownHump|NotGreaterTilde|rightthreetimes|LeftUpTeeVector|NotGreaterEqual|straightepsilon|LeftTriangleBar|rightsquigarrow|ContourIntegral|rightleftarrows|CloseCurlyQuote|RightDownVector|LeftRightVector|nLeftrightarrow|leftharpoondown|circlearrowleft|SquareSuperset|OpenCurlyQuote|hookrightarrow|HorizontalLine|DiacriticalDot|NotLessGreater|ntriangleright|DoubleRightTee|InvisibleComma|InvisibleTimes|LowerLeftArrow|DownLeftVector|NotSubsetEqual|curvearrowleft|trianglelefteq|NotVerticalBar|TildeFullEqual|downdownarrows|NotGreaterLess|RightTeeVector|ZeroWidthSpace|looparrowright|LongRightArrow|doublebarwedge|ShortLeftArrow|ShortDownArrow|RightVectorBar|GreaterGreater|ReverseElement|rightharpoonup|LessSlantEqual|leftthreetimes|upharpoonright|rightarrowtail|LeftDownVector|Longrightarrow|NestedLessLess|UpperLeftArrow|nshortparallel|leftleftarrows|leftrightarrow|Leftrightarrow|LeftRightArrow|longrightarrow|upharpoonleft|RightArrowBar|ApplyFunction|LeftTeeVector|leftarrowtail|NotEqualTilde|varsubsetneqq|varsupsetneqq|RightTeeArrow|SucceedsEqual|SucceedsTilde|LeftVectorBar|SupersetEqual|hookleftarrow|DifferentialD|VerticalTilde|VeryThinSpace|blacktriangle|bigtriangleup|LessFullEqual|divideontimes|leftharpoonup|UpEquilibrium|ntriangleleft|RightTriangle|measuredangle|shortparallel|longleftarrow|Longleftarrow|LongLeftArrow|DoubleLeftTee|Poincareplane|PrecedesEqual|triangleright|DoubleUpArrow|RightUpVector|fallingdotseq|looparrowleft|PrecedesTilde|NotTildeEqual|NotTildeTilde|smallsetminus|Proportional|triangleleft|triangledown|UnderBracket|NotHumpEqual|exponentiale|ExponentialE|NotLessTilde|HilbertSpace|RightCeiling|blacklozenge|varsupsetneq|HumpDownHump|GreaterEqual|VerticalLine|LeftTeeArrow|NotLessEqual|DownTeeArrow|LeftTriangle|varsubsetneq|Intersection|NotCongruent|DownArrowBar|LeftUpVector|LeftArrowBar|risingdotseq|GreaterTilde|RoundImplies|SquareSubset|ShortUpArrow|NotSuperset|quaternions|precnapprox|backepsilon|preccurlyeq|OverBracket|blacksquare|MediumSpace|VerticalBar|circledcirc|circleddash|CircleMinus|CircleTimes|LessGreater|curlyeqprec|curlyeqsucc|diamondsuit|UpDownArrow|Updownarrow|RuleDelayed|Rrightarrow|updownarrow|RightVector|nRightarrow|nrightarrow|eqslantless|LeftCeiling|Equilibrium|SmallCircle|expectation|NotSucceeds|thickapprox|GreaterLess|SquareUnion|NotPrecedes|NotLessLess|straightphi|succnapprox|succcurlyeq|SubsetEqual|sqsupseteq|Proportion|Laplacetrf|ImaginaryI|supsetneqq|NotGreater|gtreqqless|NotElement|ThickSpace|TildeEqual|TildeTilde|Fouriertrf|rmoustache|EqualTilde|eqslantgtr|UnderBrace|LeftVector|UpArrowBar|nLeftarrow|nsubseteqq|subsetneqq|nsupseteqq|nleftarrow|succapprox|lessapprox|UpTeeArrow|upuparrows|curlywedge|lesseqqgtr|varepsilon|varnothing|RightFloor|complement|CirclePlus|sqsubseteq|Lleftarrow|circledast|RightArrow|Rightarrow|rightarrow|lmoustache|Bernoullis|precapprox|mapstoleft|mapstodown|longmapsto|dotsquare|downarrow|DoubleDot|nsubseteq|supsetneq|leftarrow|nsupseteq|subsetneq|ThinSpace|ngeqslant|subseteqq|HumpEqual|NotSubset|triangleq|NotCupCap|lesseqgtr|heartsuit|TripleDot|Leftarrow|Coproduct|Congruent|varpropto|complexes|gvertneqq|LeftArrow|LessTilde|supseteqq|MinusPlus|CircleDot|nleqslant|NotExists|gtreqless|nparallel|UnionPlus|LeftFloor|checkmark|CenterDot|centerdot|Mellintrf|gtrapprox|bigotimes|OverBrace|spadesuit|therefore|pitchfork|rationals|PlusMinus|Backslash|Therefore|DownBreve|backsimeq|backprime|DownArrow|nshortmid|Downarrow|lvertneqq|eqvparsl|imagline|imagpart|infintie|integers|Integral|intercal|LessLess|Uarrocir|intlarhk|sqsupset|angmsdaf|sqsubset|llcorner|vartheta|cupbrcap|lnapprox|Superset|SuchThat|succnsim|succneqq|angmsdag|biguplus|curlyvee|trpezium|Succeeds|NotTilde|bigwedge|angmsdah|angrtvbd|triminus|cwconint|fpartint|lrcorner|smeparsl|subseteq|urcorner|lurdshar|laemptyv|DDotrahd|approxeq|ldrushar|awconint|mapstoup|backcong|shortmid|triangle|geqslant|gesdotol|timesbar|circledR|circledS|setminus|multimap|naturals|scpolint|ncongdot|RightTee|boxminus|gnapprox|boxtimes|andslope|thicksim|angmsdaa|varsigma|cirfnint|rtriltri|angmsdab|rppolint|angmsdac|barwedge|drbkarow|clubsuit|thetasym|bsolhsub|capbrcup|dzigrarr|doteqdot|DotEqual|dotminus|UnderBar|NotEqual|realpart|otimesas|ulcorner|hksearow|hkswarow|parallel|PartialD|elinters|emptyset|plusacir|bbrktbrk|angmsdad|pointint|bigoplus|angmsdae|Precedes|bigsqcup|varkappa|notindot|supseteq|precneqq|precnsim|profalar|profline|profsurf|leqslant|lesdotor|raemptyv|subplus|notnivb|notnivc|subrarr|zigrarr|vzigzag|submult|subedot|Element|between|cirscir|larrbfs|larrsim|lotimes|lbrksld|lbrkslu|lozenge|ldrdhar|dbkarow|bigcirc|epsilon|simrarr|simplus|ltquest|Epsilon|luruhar|gtquest|maltese|npolint|eqcolon|npreceq|bigodot|ddagger|gtrless|bnequiv|harrcir|ddotseq|equivDD|backsim|demptyv|nsqsube|nsqsupe|Upsilon|nsubset|upsilon|minusdu|nsucceq|swarrow|nsupset|coloneq|searrow|boxplus|napprox|natural|asympeq|alefsym|congdot|nearrow|bigstar|diamond|supplus|tritime|LeftTee|nvinfin|triplus|NewLine|nvltrie|nvrtrie|nwarrow|nexists|Diamond|ruluhar|Implies|supmult|angzarr|suplarr|suphsub|questeq|because|digamma|Because|olcross|bemptyv|omicron|Omicron|rotimes|NoBreak|intprod|angrtvb|orderof|uwangle|suphsol|lesdoto|orslope|DownTee|realine|cudarrl|rdldhar|OverBar|supedot|lessdot|supdsub|topfork|succsim|rbrkslu|rbrksld|pertenk|cudarrr|isindot|planckh|lessgtr|pluscir|gesdoto|plussim|plustwo|lesssim|cularrp|rarrsim|Cayleys|notinva|notinvb|notinvc|UpArrow|Uparrow|uparrow|NotLess|dwangle|precsim|Product|curarrm|Cconint|dotplus|rarrbfs|ccupssm|Cedilla|cemptyv|notniva|quatint|frac35|frac38|frac45|frac56|frac58|frac78|tridot|xoplus|gacute|gammad|Gammad|lfisht|lfloor|bigcup|sqsupe|gbreve|Gbreve|lharul|sqsube|sqcups|Gcedil|apacir|llhard|lmidot|Lmidot|lmoust|andand|sqcaps|approx|Abreve|spades|circeq|tprime|divide|topcir|Assign|topbot|gesdot|divonx|xuplus|timesd|gesles|atilde|solbar|SOFTcy|loplus|timesb|lowast|lowbar|dlcorn|dlcrop|softcy|dollar|lparlt|thksim|lrhard|Atilde|lsaquo|smashp|bigvee|thinsp|wreath|bkarow|lsquor|lstrok|Lstrok|lthree|ltimes|ltlarr|DotDot|simdot|ltrPar|weierp|xsqcup|angmsd|sigmav|sigmaf|zeetrf|Zcaron|zcaron|mapsto|vsupne|thetav|cirmid|marker|mcomma|Zacute|vsubnE|there4|gtlPar|vsubne|bottom|gtrarr|SHCHcy|shchcy|midast|midcir|middot|minusb|minusd|gtrdot|bowtie|sfrown|mnplus|models|colone|seswar|Colone|mstpos|searhk|gtrsim|nacute|Nacute|boxbox|telrec|hairsp|Tcedil|nbumpe|scnsim|ncaron|Ncaron|ncedil|Ncedil|hamilt|Scedil|nearhk|hardcy|HARDcy|tcedil|Tcaron|commat|nequiv|nesear|tcaron|target|hearts|nexist|varrho|scedil|Scaron|scaron|hellip|Sacute|sacute|hercon|swnwar|compfn|rtimes|rthree|rsquor|rsaquo|zacute|wedgeq|homtht|barvee|barwed|Barwed|rpargt|horbar|conint|swarhk|roplus|nltrie|hslash|hstrok|Hstrok|rmoust|Conint|bprime|hybull|hyphen|iacute|Iacute|supsup|supsub|supsim|varphi|coprod|brvbar|agrave|Supset|supset|igrave|Igrave|notinE|Agrave|iiiint|iinfin|copysr|wedbar|Verbar|vangrt|becaus|incare|verbar|inodot|bullet|drcorn|intcal|drcrop|cularr|vellip|Utilde|bumpeq|cupcap|dstrok|Dstrok|CupCap|cupcup|cupdot|eacute|Eacute|supdot|iquest|easter|ecaron|Ecaron|ecolon|isinsv|utilde|itilde|Itilde|curarr|succeq|Bumpeq|cacute|ulcrop|nparsl|Cacute|nprcue|egrave|Egrave|nrarrc|nrarrw|subsup|subsub|nrtrie|jsercy|nsccue|Jsercy|kappav|kcedil|Kcedil|subsim|ulcorn|nsimeq|egsdot|veebar|kgreen|capand|elsdot|Subset|subset|curren|aacute|lacute|Lacute|emptyv|ntilde|Ntilde|lagran|lambda|Lambda|capcap|Ugrave|langle|subdot|emsp13|numero|emsp14|nvdash|nvDash|nVdash|nVDash|ugrave|ufisht|nvHarr|larrfs|nvlArr|larrhk|larrlp|larrpl|nvrArr|Udblac|nwarhk|larrtl|nwnear|oacute|Oacute|latail|lAtail|sstarf|lbrace|odblac|Odblac|lbrack|udblac|odsold|eparsl|lcaron|Lcaron|ograve|Ograve|lcedil|Lcedil|Aacute|ssmile|ssetmn|squarf|ldquor|capcup|ominus|cylcty|rharul|eqcirc|dagger|rfloor|rfisht|Dagger|daleth|equals|origof|capdot|equest|dcaron|Dcaron|rdquor|oslash|Oslash|otilde|Otilde|otimes|Otimes|urcrop|Ubreve|ubreve|Yacute|Uacute|uacute|Rcedil|rcedil|urcorn|parsim|Rcaron|Vdashl|rcaron|Tstrok|percnt|period|permil|Exists|yacute|rbrack|rbrace|phmmat|ccaron|Ccaron|planck|ccedil|plankv|tstrok|female|plusdo|plusdu|ffilig|plusmn|ffllig|Ccedil|rAtail|dfisht|bernou|ratail|Rarrtl|rarrtl|angsph|rarrpl|rarrlp|rarrhk|xwedge|xotime|forall|ForAll|Vvdash|vsupnE|preceq|bigcap|frac12|frac13|frac14|primes|rarrfs|prnsim|frac15|Square|frac16|square|lesdot|frac18|frac23|propto|prurel|rarrap|rangle|puncsp|frac25|Racute|qprime|racute|lesges|frac34|abreve|AElig|eqsim|utdot|setmn|urtri|Equal|Uring|seArr|uring|searr|dashv|Dashv|mumap|nabla|iogon|Iogon|sdote|sdotb|scsim|napid|napos|equiv|natur|Acirc|dblac|erarr|nbump|iprod|erDot|ucirc|awint|esdot|angrt|ncong|isinE|scnap|Scirc|scirc|ndash|isins|Ubrcy|nearr|neArr|isinv|nedot|ubrcy|acute|Ycirc|iukcy|Iukcy|xutri|nesim|caret|jcirc|Jcirc|caron|twixt|ddarr|sccue|exist|jmath|sbquo|ngeqq|angst|ccaps|lceil|ngsim|UpTee|delta|Delta|rtrif|nharr|nhArr|nhpar|rtrie|jukcy|Jukcy|kappa|rsquo|Kappa|nlarr|nlArr|TSHcy|rrarr|aogon|Aogon|fflig|xrarr|tshcy|ccirc|nleqq|filig|upsih|nless|dharl|nlsim|fjlig|ropar|nltri|dharr|robrk|roarr|fllig|fltns|roang|rnmid|subnE|subne|lAarr|trisb|Ccirc|acirc|ccups|blank|VDash|forkv|Vdash|langd|cedil|blk12|blk14|laquo|strns|diams|notin|vDash|larrb|blk34|block|disin|uplus|vdash|vBarv|aelig|starf|Wedge|check|xrArr|lates|lbarr|lBarr|notni|lbbrk|bcong|frasl|lbrke|frown|vrtri|vprop|vnsup|gamma|Gamma|wedge|xodot|bdquo|srarr|doteq|ldquo|boxdl|boxdL|gcirc|Gcirc|boxDl|boxDL|boxdr|boxdR|boxDr|TRADE|trade|rlhar|boxDR|vnsub|npart|vltri|rlarr|boxhd|boxhD|nprec|gescc|nrarr|nrArr|boxHd|boxHD|boxhu|boxhU|nrtri|boxHu|clubs|boxHU|times|colon|Colon|gimel|xlArr|Tilde|nsime|tilde|nsmid|nspar|THORN|thorn|xlarr|nsube|nsubE|thkap|xhArr|comma|nsucc|boxul|boxuL|nsupe|nsupE|gneqq|gnsim|boxUl|boxUL|grave|boxur|boxuR|boxUr|boxUR|lescc|angle|bepsi|boxvh|varpi|boxvH|numsp|Theta|gsime|gsiml|theta|boxVh|boxVH|boxvl|gtcir|gtdot|boxvL|boxVl|boxVL|crarr|cross|Cross|nvsim|boxvr|nwarr|nwArr|sqsup|dtdot|Uogon|lhard|lharu|dtrif|ocirc|Ocirc|lhblk|duarr|odash|sqsub|Hacek|sqcup|llarr|duhar|oelig|OElig|ofcir|boxvR|uogon|lltri|boxVr|csube|uuarr|ohbar|csupe|ctdot|olarr|olcir|harrw|oline|sqcap|omacr|Omacr|omega|Omega|boxVR|aleph|lneqq|lnsim|loang|loarr|rharu|lobrk|hcirc|operp|oplus|rhard|Hcirc|orarr|Union|order|ecirc|Ecirc|cuepr|szlig|cuesc|breve|reals|eDDot|Breve|hoarr|lopar|utrif|rdquo|Umacr|umacr|efDot|swArr|ultri|alpha|rceil|ovbar|swarr|Wcirc|wcirc|smtes|smile|bsemi|lrarr|aring|parsl|lrhar|bsime|uhblk|lrtri|cupor|Aring|uharr|uharl|slarr|rbrke|bsolb|lsime|rbbrk|RBarr|lsimg|phone|rBarr|rbarr|icirc|lsquo|Icirc|emacr|Emacr|ratio|simne|plusb|simlE|simgE|simeq|pluse|ltcir|ltdot|empty|xharr|xdtri|iexcl|Alpha|ltrie|rarrw|pound|ltrif|xcirc|bumpe|prcue|bumpE|asymp|amacr|cuvee|Sigma|sigma|iiint|udhar|iiota|ijlig|IJlig|supnE|imacr|Imacr|prime|Prime|image|prnap|eogon|Eogon|rarrc|mdash|mDDot|cuwed|imath|supne|imped|Amacr|udarr|prsim|micro|rarrb|cwint|raquo|infin|eplus|range|rangd|Ucirc|radic|minus|amalg|veeeq|rAarr|epsiv|ycirc|quest|sharp|quot|zwnj|Qscr|race|qscr|Qopf|qopf|qint|rang|Rang|Zscr|zscr|Zopf|zopf|rarr|rArr|Rarr|Pscr|pscr|prop|prod|prnE|prec|ZHcy|zhcy|prap|Zeta|zeta|Popf|popf|Zdot|plus|zdot|Yuml|yuml|phiv|YUcy|yucy|Yscr|yscr|perp|Yopf|yopf|part|para|YIcy|Ouml|rcub|yicy|YAcy|rdca|ouml|osol|Oscr|rdsh|yacy|real|oscr|xvee|andd|rect|andv|Xscr|oror|ordm|ordf|xscr|ange|aopf|Aopf|rHar|Xopf|opar|Oopf|xopf|xnis|rhov|oopf|omid|xmap|oint|apid|apos|ogon|ascr|Ascr|odot|odiv|xcup|xcap|ocir|oast|nvlt|nvle|nvgt|nvge|nvap|Wscr|wscr|auml|ntlg|ntgl|nsup|nsub|nsim|Nscr|nscr|nsce|Wopf|ring|npre|wopf|npar|Auml|Barv|bbrk|Nopf|nopf|nmid|nLtv|beta|ropf|Ropf|Beta|beth|nles|rpar|nleq|bnot|bNot|nldr|NJcy|rscr|Rscr|Vscr|vscr|rsqb|njcy|bopf|nisd|Bopf|rtri|Vopf|nGtv|ngtr|vopf|boxh|boxH|boxv|nges|ngeq|boxV|bscr|scap|Bscr|bsim|Vert|vert|bsol|bull|bump|caps|cdot|ncup|scnE|ncap|nbsp|napE|Cdot|cent|sdot|Vbar|nang|vBar|chcy|Mscr|mscr|sect|semi|CHcy|Mopf|mopf|sext|circ|cire|mldr|mlcp|cirE|comp|shcy|SHcy|vArr|varr|cong|copf|Copf|copy|COPY|malt|male|macr|lvnE|cscr|ltri|sime|ltcc|simg|Cscr|siml|csub|Uuml|lsqb|lsim|uuml|csup|Lscr|lscr|utri|smid|lpar|cups|smte|lozf|darr|Lopf|Uscr|solb|lopf|sopf|Sopf|lneq|uscr|spar|dArr|lnap|Darr|dash|Sqrt|LJcy|ljcy|lHar|dHar|Upsi|upsi|diam|lesg|djcy|DJcy|leqq|dopf|Dopf|dscr|Dscr|dscy|ldsh|ldca|squf|DScy|sscr|Sscr|dsol|lcub|late|star|Star|Uopf|Larr|lArr|larr|uopf|dtri|dzcy|sube|subE|Lang|lang|Kscr|kscr|Kopf|kopf|KJcy|kjcy|KHcy|khcy|DZcy|ecir|edot|eDot|Jscr|jscr|succ|Jopf|jopf|Edot|uHar|emsp|ensp|Iuml|iuml|eopf|isin|Iscr|iscr|Eopf|epar|sung|epsi|escr|sup1|sup2|sup3|Iota|iota|supe|supE|Iopf|iopf|IOcy|iocy|Escr|esim|Esim|imof|Uarr|QUOT|uArr|uarr|euml|IEcy|iecy|Idot|Euml|euro|excl|Hscr|hscr|Hopf|hopf|TScy|tscy|Tscr|hbar|tscr|flat|tbrk|fnof|hArr|harr|half|fopf|Fopf|tdot|gvnE|fork|trie|gtcc|fscr|Fscr|gdot|gsim|Gscr|gscr|Gopf|gopf|gneq|Gdot|tosa|gnap|Topf|topf|geqq|toea|GJcy|gjcy|tint|gesl|mid|Sfr|ggg|top|ges|gla|glE|glj|geq|gne|gEl|gel|gnE|Gcy|gcy|gap|Tfr|tfr|Tcy|tcy|Hat|Tau|Ffr|tau|Tab|hfr|Hfr|ffr|Fcy|fcy|icy|Icy|iff|ETH|eth|ifr|Ifr|Eta|eta|int|Int|Sup|sup|ucy|Ucy|Sum|sum|jcy|ENG|ufr|Ufr|eng|Jcy|jfr|els|ell|egs|Efr|efr|Jfr|uml|kcy|Kcy|Ecy|ecy|kfr|Kfr|lap|Sub|sub|lat|lcy|Lcy|leg|Dot|dot|lEg|leq|les|squ|div|die|lfr|Lfr|lgE|Dfr|dfr|Del|deg|Dcy|dcy|lne|lnE|sol|loz|smt|Cup|lrm|cup|lsh|Lsh|sim|shy|map|Map|mcy|Mcy|mfr|Mfr|mho|gfr|Gfr|sfr|cir|Chi|chi|nap|Cfr|vcy|Vcy|cfr|Scy|scy|ncy|Ncy|vee|Vee|Cap|cap|nfr|scE|sce|Nfr|nge|ngE|nGg|vfr|Vfr|ngt|bot|nGt|nis|niv|Rsh|rsh|nle|nlE|bne|Bfr|bfr|nLl|nlt|nLt|Bcy|bcy|not|Not|rlm|wfr|Wfr|npr|nsc|num|ocy|ast|Ocy|ofr|xfr|Xfr|Ofr|ogt|ohm|apE|olt|Rho|ape|rho|Rfr|rfr|ord|REG|ang|reg|orv|And|and|AMP|Rcy|amp|Afr|ycy|Ycy|yen|yfr|Yfr|rcy|par|pcy|Pcy|pfr|Pfr|phi|Phi|afr|Acy|acy|zcy|Zcy|piv|acE|acd|zfr|Zfr|pre|prE|psi|Psi|qfr|Qfr|zwj|Or|ge|Gg|gt|gg|el|oS|lt|Lt|LT|Re|lg|gl|eg|ne|Im|it|le|DD|wp|wr|nu|Nu|dd|lE|Sc|sc|pi|Pi|ee|af|ll|Ll|rx|gE|xi|pm|Xi|ic|pr|Pr|in|ni|mp|mu|ac|Mu|or|ap|Gt|GT|ii);|&(Aacute|Agrave|Atilde|Ccedil|Eacute|Egrave|Iacute|Igrave|Ntilde|Oacute|Ograve|Oslash|Otilde|Uacute|Ugrave|Yacute|aacute|agrave|atilde|brvbar|ccedil|curren|divide|eacute|egrave|frac12|frac14|frac34|iacute|igrave|iquest|middot|ntilde|oacute|ograve|oslash|otilde|plusmn|uacute|ugrave|yacute|AElig|Acirc|Aring|Ecirc|Icirc|Ocirc|THORN|Ucirc|acirc|acute|aelig|aring|cedil|ecirc|icirc|iexcl|laquo|micro|ocirc|pound|raquo|szlig|thorn|times|ucirc|Auml|COPY|Euml|Iuml|Ouml|QUOT|Uuml|auml|cent|copy|euml|iuml|macr|nbsp|ordf|ordm|ouml|para|quot|sect|sup1|sup2|sup3|uuml|yuml|AMP|ETH|REG|amp|deg|eth|not|reg|shy|uml|yen|GT|LT|gt|lt)(?!;)([=a-zA-Z0-9]?)|&#([0-9]+)(;?)|&#[xX]([a-fA-F0-9]+)(;?)|&([0-9a-zA-Z]+)/g;
    var decodeMap = { "aacute": "\xE1", "Aacute": "\xC1", "abreve": "\u0103", "Abreve": "\u0102", "ac": "\u223E", "acd": "\u223F", "acE": "\u223E\u0333", "acirc": "\xE2", "Acirc": "\xC2", "acute": "\xB4", "acy": "\u0430", "Acy": "\u0410", "aelig": "\xE6", "AElig": "\xC6", "af": "\u2061", "afr": "\u{1D51E}", "Afr": "\u{1D504}", "agrave": "\xE0", "Agrave": "\xC0", "alefsym": "\u2135", "aleph": "\u2135", "alpha": "\u03B1", "Alpha": "\u0391", "amacr": "\u0101", "Amacr": "\u0100", "amalg": "\u2A3F", "amp": "&", "AMP": "&", "and": "\u2227", "And": "\u2A53", "andand": "\u2A55", "andd": "\u2A5C", "andslope": "\u2A58", "andv": "\u2A5A", "ang": "\u2220", "ange": "\u29A4", "angle": "\u2220", "angmsd": "\u2221", "angmsdaa": "\u29A8", "angmsdab": "\u29A9", "angmsdac": "\u29AA", "angmsdad": "\u29AB", "angmsdae": "\u29AC", "angmsdaf": "\u29AD", "angmsdag": "\u29AE", "angmsdah": "\u29AF", "angrt": "\u221F", "angrtvb": "\u22BE", "angrtvbd": "\u299D", "angsph": "\u2222", "angst": "\xC5", "angzarr": "\u237C", "aogon": "\u0105", "Aogon": "\u0104", "aopf": "\u{1D552}", "Aopf": "\u{1D538}", "ap": "\u2248", "apacir": "\u2A6F", "ape": "\u224A", "apE": "\u2A70", "apid": "\u224B", "apos": "'", "ApplyFunction": "\u2061", "approx": "\u2248", "approxeq": "\u224A", "aring": "\xE5", "Aring": "\xC5", "ascr": "\u{1D4B6}", "Ascr": "\u{1D49C}", "Assign": "\u2254", "ast": "*", "asymp": "\u2248", "asympeq": "\u224D", "atilde": "\xE3", "Atilde": "\xC3", "auml": "\xE4", "Auml": "\xC4", "awconint": "\u2233", "awint": "\u2A11", "backcong": "\u224C", "backepsilon": "\u03F6", "backprime": "\u2035", "backsim": "\u223D", "backsimeq": "\u22CD", "Backslash": "\u2216", "Barv": "\u2AE7", "barvee": "\u22BD", "barwed": "\u2305", "Barwed": "\u2306", "barwedge": "\u2305", "bbrk": "\u23B5", "bbrktbrk": "\u23B6", "bcong": "\u224C", "bcy": "\u0431", "Bcy": "\u0411", "bdquo": "\u201E", "becaus": "\u2235", "because": "\u2235", "Because": "\u2235", "bemptyv": "\u29B0", "bepsi": "\u03F6", "bernou": "\u212C", "Bernoullis": "\u212C", "beta": "\u03B2", "Beta": "\u0392", "beth": "\u2136", "between": "\u226C", "bfr": "\u{1D51F}", "Bfr": "\u{1D505}", "bigcap": "\u22C2", "bigcirc": "\u25EF", "bigcup": "\u22C3", "bigodot": "\u2A00", "bigoplus": "\u2A01", "bigotimes": "\u2A02", "bigsqcup": "\u2A06", "bigstar": "\u2605", "bigtriangledown": "\u25BD", "bigtriangleup": "\u25B3", "biguplus": "\u2A04", "bigvee": "\u22C1", "bigwedge": "\u22C0", "bkarow": "\u290D", "blacklozenge": "\u29EB", "blacksquare": "\u25AA", "blacktriangle": "\u25B4", "blacktriangledown": "\u25BE", "blacktriangleleft": "\u25C2", "blacktriangleright": "\u25B8", "blank": "\u2423", "blk12": "\u2592", "blk14": "\u2591", "blk34": "\u2593", "block": "\u2588", "bne": "=\u20E5", "bnequiv": "\u2261\u20E5", "bnot": "\u2310", "bNot": "\u2AED", "bopf": "\u{1D553}", "Bopf": "\u{1D539}", "bot": "\u22A5", "bottom": "\u22A5", "bowtie": "\u22C8", "boxbox": "\u29C9", "boxdl": "\u2510", "boxdL": "\u2555", "boxDl": "\u2556", "boxDL": "\u2557", "boxdr": "\u250C", "boxdR": "\u2552", "boxDr": "\u2553", "boxDR": "\u2554", "boxh": "\u2500", "boxH": "\u2550", "boxhd": "\u252C", "boxhD": "\u2565", "boxHd": "\u2564", "boxHD": "\u2566", "boxhu": "\u2534", "boxhU": "\u2568", "boxHu": "\u2567", "boxHU": "\u2569", "boxminus": "\u229F", "boxplus": "\u229E", "boxtimes": "\u22A0", "boxul": "\u2518", "boxuL": "\u255B", "boxUl": "\u255C", "boxUL": "\u255D", "boxur": "\u2514", "boxuR": "\u2558", "boxUr": "\u2559", "boxUR": "\u255A", "boxv": "\u2502", "boxV": "\u2551", "boxvh": "\u253C", "boxvH": "\u256A", "boxVh": "\u256B", "boxVH": "\u256C", "boxvl": "\u2524", "boxvL": "\u2561", "boxVl": "\u2562", "boxVL": "\u2563", "boxvr": "\u251C", "boxvR": "\u255E", "boxVr": "\u255F", "boxVR": "\u2560", "bprime": "\u2035", "breve": "\u02D8", "Breve": "\u02D8", "brvbar": "\xA6", "bscr": "\u{1D4B7}", "Bscr": "\u212C", "bsemi": "\u204F", "bsim": "\u223D", "bsime": "\u22CD", "bsol": "\\", "bsolb": "\u29C5", "bsolhsub": "\u27C8", "bull": "\u2022", "bullet": "\u2022", "bump": "\u224E", "bumpe": "\u224F", "bumpE": "\u2AAE", "bumpeq": "\u224F", "Bumpeq": "\u224E", "cacute": "\u0107", "Cacute": "\u0106", "cap": "\u2229", "Cap": "\u22D2", "capand": "\u2A44", "capbrcup": "\u2A49", "capcap": "\u2A4B", "capcup": "\u2A47", "capdot": "\u2A40", "CapitalDifferentialD": "\u2145", "caps": "\u2229\uFE00", "caret": "\u2041", "caron": "\u02C7", "Cayleys": "\u212D", "ccaps": "\u2A4D", "ccaron": "\u010D", "Ccaron": "\u010C", "ccedil": "\xE7", "Ccedil": "\xC7", "ccirc": "\u0109", "Ccirc": "\u0108", "Cconint": "\u2230", "ccups": "\u2A4C", "ccupssm": "\u2A50", "cdot": "\u010B", "Cdot": "\u010A", "cedil": "\xB8", "Cedilla": "\xB8", "cemptyv": "\u29B2", "cent": "\xA2", "centerdot": "\xB7", "CenterDot": "\xB7", "cfr": "\u{1D520}", "Cfr": "\u212D", "chcy": "\u0447", "CHcy": "\u0427", "check": "\u2713", "checkmark": "\u2713", "chi": "\u03C7", "Chi": "\u03A7", "cir": "\u25CB", "circ": "\u02C6", "circeq": "\u2257", "circlearrowleft": "\u21BA", "circlearrowright": "\u21BB", "circledast": "\u229B", "circledcirc": "\u229A", "circleddash": "\u229D", "CircleDot": "\u2299", "circledR": "\xAE", "circledS": "\u24C8", "CircleMinus": "\u2296", "CirclePlus": "\u2295", "CircleTimes": "\u2297", "cire": "\u2257", "cirE": "\u29C3", "cirfnint": "\u2A10", "cirmid": "\u2AEF", "cirscir": "\u29C2", "ClockwiseContourIntegral": "\u2232", "CloseCurlyDoubleQuote": "\u201D", "CloseCurlyQuote": "\u2019", "clubs": "\u2663", "clubsuit": "\u2663", "colon": ":", "Colon": "\u2237", "colone": "\u2254", "Colone": "\u2A74", "coloneq": "\u2254", "comma": ",", "commat": "@", "comp": "\u2201", "compfn": "\u2218", "complement": "\u2201", "complexes": "\u2102", "cong": "\u2245", "congdot": "\u2A6D", "Congruent": "\u2261", "conint": "\u222E", "Conint": "\u222F", "ContourIntegral": "\u222E", "copf": "\u{1D554}", "Copf": "\u2102", "coprod": "\u2210", "Coproduct": "\u2210", "copy": "\xA9", "COPY": "\xA9", "copysr": "\u2117", "CounterClockwiseContourIntegral": "\u2233", "crarr": "\u21B5", "cross": "\u2717", "Cross": "\u2A2F", "cscr": "\u{1D4B8}", "Cscr": "\u{1D49E}", "csub": "\u2ACF", "csube": "\u2AD1", "csup": "\u2AD0", "csupe": "\u2AD2", "ctdot": "\u22EF", "cudarrl": "\u2938", "cudarrr": "\u2935", "cuepr": "\u22DE", "cuesc": "\u22DF", "cularr": "\u21B6", "cularrp": "\u293D", "cup": "\u222A", "Cup": "\u22D3", "cupbrcap": "\u2A48", "cupcap": "\u2A46", "CupCap": "\u224D", "cupcup": "\u2A4A", "cupdot": "\u228D", "cupor": "\u2A45", "cups": "\u222A\uFE00", "curarr": "\u21B7", "curarrm": "\u293C", "curlyeqprec": "\u22DE", "curlyeqsucc": "\u22DF", "curlyvee": "\u22CE", "curlywedge": "\u22CF", "curren": "\xA4", "curvearrowleft": "\u21B6", "curvearrowright": "\u21B7", "cuvee": "\u22CE", "cuwed": "\u22CF", "cwconint": "\u2232", "cwint": "\u2231", "cylcty": "\u232D", "dagger": "\u2020", "Dagger": "\u2021", "daleth": "\u2138", "darr": "\u2193", "dArr": "\u21D3", "Darr": "\u21A1", "dash": "\u2010", "dashv": "\u22A3", "Dashv": "\u2AE4", "dbkarow": "\u290F", "dblac": "\u02DD", "dcaron": "\u010F", "Dcaron": "\u010E", "dcy": "\u0434", "Dcy": "\u0414", "dd": "\u2146", "DD": "\u2145", "ddagger": "\u2021", "ddarr": "\u21CA", "DDotrahd": "\u2911", "ddotseq": "\u2A77", "deg": "\xB0", "Del": "\u2207", "delta": "\u03B4", "Delta": "\u0394", "demptyv": "\u29B1", "dfisht": "\u297F", "dfr": "\u{1D521}", "Dfr": "\u{1D507}", "dHar": "\u2965", "dharl": "\u21C3", "dharr": "\u21C2", "DiacriticalAcute": "\xB4", "DiacriticalDot": "\u02D9", "DiacriticalDoubleAcute": "\u02DD", "DiacriticalGrave": "`", "DiacriticalTilde": "\u02DC", "diam": "\u22C4", "diamond": "\u22C4", "Diamond": "\u22C4", "diamondsuit": "\u2666", "diams": "\u2666", "die": "\xA8", "DifferentialD": "\u2146", "digamma": "\u03DD", "disin": "\u22F2", "div": "\xF7", "divide": "\xF7", "divideontimes": "\u22C7", "divonx": "\u22C7", "djcy": "\u0452", "DJcy": "\u0402", "dlcorn": "\u231E", "dlcrop": "\u230D", "dollar": "$", "dopf": "\u{1D555}", "Dopf": "\u{1D53B}", "dot": "\u02D9", "Dot": "\xA8", "DotDot": "\u20DC", "doteq": "\u2250", "doteqdot": "\u2251", "DotEqual": "\u2250", "dotminus": "\u2238", "dotplus": "\u2214", "dotsquare": "\u22A1", "doublebarwedge": "\u2306", "DoubleContourIntegral": "\u222F", "DoubleDot": "\xA8", "DoubleDownArrow": "\u21D3", "DoubleLeftArrow": "\u21D0", "DoubleLeftRightArrow": "\u21D4", "DoubleLeftTee": "\u2AE4", "DoubleLongLeftArrow": "\u27F8", "DoubleLongLeftRightArrow": "\u27FA", "DoubleLongRightArrow": "\u27F9", "DoubleRightArrow": "\u21D2", "DoubleRightTee": "\u22A8", "DoubleUpArrow": "\u21D1", "DoubleUpDownArrow": "\u21D5", "DoubleVerticalBar": "\u2225", "downarrow": "\u2193", "Downarrow": "\u21D3", "DownArrow": "\u2193", "DownArrowBar": "\u2913", "DownArrowUpArrow": "\u21F5", "DownBreve": "\u0311", "downdownarrows": "\u21CA", "downharpoonleft": "\u21C3", "downharpoonright": "\u21C2", "DownLeftRightVector": "\u2950", "DownLeftTeeVector": "\u295E", "DownLeftVector": "\u21BD", "DownLeftVectorBar": "\u2956", "DownRightTeeVector": "\u295F", "DownRightVector": "\u21C1", "DownRightVectorBar": "\u2957", "DownTee": "\u22A4", "DownTeeArrow": "\u21A7", "drbkarow": "\u2910", "drcorn": "\u231F", "drcrop": "\u230C", "dscr": "\u{1D4B9}", "Dscr": "\u{1D49F}", "dscy": "\u0455", "DScy": "\u0405", "dsol": "\u29F6", "dstrok": "\u0111", "Dstrok": "\u0110", "dtdot": "\u22F1", "dtri": "\u25BF", "dtrif": "\u25BE", "duarr": "\u21F5", "duhar": "\u296F", "dwangle": "\u29A6", "dzcy": "\u045F", "DZcy": "\u040F", "dzigrarr": "\u27FF", "eacute": "\xE9", "Eacute": "\xC9", "easter": "\u2A6E", "ecaron": "\u011B", "Ecaron": "\u011A", "ecir": "\u2256", "ecirc": "\xEA", "Ecirc": "\xCA", "ecolon": "\u2255", "ecy": "\u044D", "Ecy": "\u042D", "eDDot": "\u2A77", "edot": "\u0117", "eDot": "\u2251", "Edot": "\u0116", "ee": "\u2147", "efDot": "\u2252", "efr": "\u{1D522}", "Efr": "\u{1D508}", "eg": "\u2A9A", "egrave": "\xE8", "Egrave": "\xC8", "egs": "\u2A96", "egsdot": "\u2A98", "el": "\u2A99", "Element": "\u2208", "elinters": "\u23E7", "ell": "\u2113", "els": "\u2A95", "elsdot": "\u2A97", "emacr": "\u0113", "Emacr": "\u0112", "empty": "\u2205", "emptyset": "\u2205", "EmptySmallSquare": "\u25FB", "emptyv": "\u2205", "EmptyVerySmallSquare": "\u25AB", "emsp": "\u2003", "emsp13": "\u2004", "emsp14": "\u2005", "eng": "\u014B", "ENG": "\u014A", "ensp": "\u2002", "eogon": "\u0119", "Eogon": "\u0118", "eopf": "\u{1D556}", "Eopf": "\u{1D53C}", "epar": "\u22D5", "eparsl": "\u29E3", "eplus": "\u2A71", "epsi": "\u03B5", "epsilon": "\u03B5", "Epsilon": "\u0395", "epsiv": "\u03F5", "eqcirc": "\u2256", "eqcolon": "\u2255", "eqsim": "\u2242", "eqslantgtr": "\u2A96", "eqslantless": "\u2A95", "Equal": "\u2A75", "equals": "=", "EqualTilde": "\u2242", "equest": "\u225F", "Equilibrium": "\u21CC", "equiv": "\u2261", "equivDD": "\u2A78", "eqvparsl": "\u29E5", "erarr": "\u2971", "erDot": "\u2253", "escr": "\u212F", "Escr": "\u2130", "esdot": "\u2250", "esim": "\u2242", "Esim": "\u2A73", "eta": "\u03B7", "Eta": "\u0397", "eth": "\xF0", "ETH": "\xD0", "euml": "\xEB", "Euml": "\xCB", "euro": "\u20AC", "excl": "!", "exist": "\u2203", "Exists": "\u2203", "expectation": "\u2130", "exponentiale": "\u2147", "ExponentialE": "\u2147", "fallingdotseq": "\u2252", "fcy": "\u0444", "Fcy": "\u0424", "female": "\u2640", "ffilig": "\uFB03", "fflig": "\uFB00", "ffllig": "\uFB04", "ffr": "\u{1D523}", "Ffr": "\u{1D509}", "filig": "\uFB01", "FilledSmallSquare": "\u25FC", "FilledVerySmallSquare": "\u25AA", "fjlig": "fj", "flat": "\u266D", "fllig": "\uFB02", "fltns": "\u25B1", "fnof": "\u0192", "fopf": "\u{1D557}", "Fopf": "\u{1D53D}", "forall": "\u2200", "ForAll": "\u2200", "fork": "\u22D4", "forkv": "\u2AD9", "Fouriertrf": "\u2131", "fpartint": "\u2A0D", "frac12": "\xBD", "frac13": "\u2153", "frac14": "\xBC", "frac15": "\u2155", "frac16": "\u2159", "frac18": "\u215B", "frac23": "\u2154", "frac25": "\u2156", "frac34": "\xBE", "frac35": "\u2157", "frac38": "\u215C", "frac45": "\u2158", "frac56": "\u215A", "frac58": "\u215D", "frac78": "\u215E", "frasl": "\u2044", "frown": "\u2322", "fscr": "\u{1D4BB}", "Fscr": "\u2131", "gacute": "\u01F5", "gamma": "\u03B3", "Gamma": "\u0393", "gammad": "\u03DD", "Gammad": "\u03DC", "gap": "\u2A86", "gbreve": "\u011F", "Gbreve": "\u011E", "Gcedil": "\u0122", "gcirc": "\u011D", "Gcirc": "\u011C", "gcy": "\u0433", "Gcy": "\u0413", "gdot": "\u0121", "Gdot": "\u0120", "ge": "\u2265", "gE": "\u2267", "gel": "\u22DB", "gEl": "\u2A8C", "geq": "\u2265", "geqq": "\u2267", "geqslant": "\u2A7E", "ges": "\u2A7E", "gescc": "\u2AA9", "gesdot": "\u2A80", "gesdoto": "\u2A82", "gesdotol": "\u2A84", "gesl": "\u22DB\uFE00", "gesles": "\u2A94", "gfr": "\u{1D524}", "Gfr": "\u{1D50A}", "gg": "\u226B", "Gg": "\u22D9", "ggg": "\u22D9", "gimel": "\u2137", "gjcy": "\u0453", "GJcy": "\u0403", "gl": "\u2277", "gla": "\u2AA5", "glE": "\u2A92", "glj": "\u2AA4", "gnap": "\u2A8A", "gnapprox": "\u2A8A", "gne": "\u2A88", "gnE": "\u2269", "gneq": "\u2A88", "gneqq": "\u2269", "gnsim": "\u22E7", "gopf": "\u{1D558}", "Gopf": "\u{1D53E}", "grave": "`", "GreaterEqual": "\u2265", "GreaterEqualLess": "\u22DB", "GreaterFullEqual": "\u2267", "GreaterGreater": "\u2AA2", "GreaterLess": "\u2277", "GreaterSlantEqual": "\u2A7E", "GreaterTilde": "\u2273", "gscr": "\u210A", "Gscr": "\u{1D4A2}", "gsim": "\u2273", "gsime": "\u2A8E", "gsiml": "\u2A90", "gt": ">", "Gt": "\u226B", "GT": ">", "gtcc": "\u2AA7", "gtcir": "\u2A7A", "gtdot": "\u22D7", "gtlPar": "\u2995", "gtquest": "\u2A7C", "gtrapprox": "\u2A86", "gtrarr": "\u2978", "gtrdot": "\u22D7", "gtreqless": "\u22DB", "gtreqqless": "\u2A8C", "gtrless": "\u2277", "gtrsim": "\u2273", "gvertneqq": "\u2269\uFE00", "gvnE": "\u2269\uFE00", "Hacek": "\u02C7", "hairsp": "\u200A", "half": "\xBD", "hamilt": "\u210B", "hardcy": "\u044A", "HARDcy": "\u042A", "harr": "\u2194", "hArr": "\u21D4", "harrcir": "\u2948", "harrw": "\u21AD", "Hat": "^", "hbar": "\u210F", "hcirc": "\u0125", "Hcirc": "\u0124", "hearts": "\u2665", "heartsuit": "\u2665", "hellip": "\u2026", "hercon": "\u22B9", "hfr": "\u{1D525}", "Hfr": "\u210C", "HilbertSpace": "\u210B", "hksearow": "\u2925", "hkswarow": "\u2926", "hoarr": "\u21FF", "homtht": "\u223B", "hookleftarrow": "\u21A9", "hookrightarrow": "\u21AA", "hopf": "\u{1D559}", "Hopf": "\u210D", "horbar": "\u2015", "HorizontalLine": "\u2500", "hscr": "\u{1D4BD}", "Hscr": "\u210B", "hslash": "\u210F", "hstrok": "\u0127", "Hstrok": "\u0126", "HumpDownHump": "\u224E", "HumpEqual": "\u224F", "hybull": "\u2043", "hyphen": "\u2010", "iacute": "\xED", "Iacute": "\xCD", "ic": "\u2063", "icirc": "\xEE", "Icirc": "\xCE", "icy": "\u0438", "Icy": "\u0418", "Idot": "\u0130", "iecy": "\u0435", "IEcy": "\u0415", "iexcl": "\xA1", "iff": "\u21D4", "ifr": "\u{1D526}", "Ifr": "\u2111", "igrave": "\xEC", "Igrave": "\xCC", "ii": "\u2148", "iiiint": "\u2A0C", "iiint": "\u222D", "iinfin": "\u29DC", "iiota": "\u2129", "ijlig": "\u0133", "IJlig": "\u0132", "Im": "\u2111", "imacr": "\u012B", "Imacr": "\u012A", "image": "\u2111", "ImaginaryI": "\u2148", "imagline": "\u2110", "imagpart": "\u2111", "imath": "\u0131", "imof": "\u22B7", "imped": "\u01B5", "Implies": "\u21D2", "in": "\u2208", "incare": "\u2105", "infin": "\u221E", "infintie": "\u29DD", "inodot": "\u0131", "int": "\u222B", "Int": "\u222C", "intcal": "\u22BA", "integers": "\u2124", "Integral": "\u222B", "intercal": "\u22BA", "Intersection": "\u22C2", "intlarhk": "\u2A17", "intprod": "\u2A3C", "InvisibleComma": "\u2063", "InvisibleTimes": "\u2062", "iocy": "\u0451", "IOcy": "\u0401", "iogon": "\u012F", "Iogon": "\u012E", "iopf": "\u{1D55A}", "Iopf": "\u{1D540}", "iota": "\u03B9", "Iota": "\u0399", "iprod": "\u2A3C", "iquest": "\xBF", "iscr": "\u{1D4BE}", "Iscr": "\u2110", "isin": "\u2208", "isindot": "\u22F5", "isinE": "\u22F9", "isins": "\u22F4", "isinsv": "\u22F3", "isinv": "\u2208", "it": "\u2062", "itilde": "\u0129", "Itilde": "\u0128", "iukcy": "\u0456", "Iukcy": "\u0406", "iuml": "\xEF", "Iuml": "\xCF", "jcirc": "\u0135", "Jcirc": "\u0134", "jcy": "\u0439", "Jcy": "\u0419", "jfr": "\u{1D527}", "Jfr": "\u{1D50D}", "jmath": "\u0237", "jopf": "\u{1D55B}", "Jopf": "\u{1D541}", "jscr": "\u{1D4BF}", "Jscr": "\u{1D4A5}", "jsercy": "\u0458", "Jsercy": "\u0408", "jukcy": "\u0454", "Jukcy": "\u0404", "kappa": "\u03BA", "Kappa": "\u039A", "kappav": "\u03F0", "kcedil": "\u0137", "Kcedil": "\u0136", "kcy": "\u043A", "Kcy": "\u041A", "kfr": "\u{1D528}", "Kfr": "\u{1D50E}", "kgreen": "\u0138", "khcy": "\u0445", "KHcy": "\u0425", "kjcy": "\u045C", "KJcy": "\u040C", "kopf": "\u{1D55C}", "Kopf": "\u{1D542}", "kscr": "\u{1D4C0}", "Kscr": "\u{1D4A6}", "lAarr": "\u21DA", "lacute": "\u013A", "Lacute": "\u0139", "laemptyv": "\u29B4", "lagran": "\u2112", "lambda": "\u03BB", "Lambda": "\u039B", "lang": "\u27E8", "Lang": "\u27EA", "langd": "\u2991", "langle": "\u27E8", "lap": "\u2A85", "Laplacetrf": "\u2112", "laquo": "\xAB", "larr": "\u2190", "lArr": "\u21D0", "Larr": "\u219E", "larrb": "\u21E4", "larrbfs": "\u291F", "larrfs": "\u291D", "larrhk": "\u21A9", "larrlp": "\u21AB", "larrpl": "\u2939", "larrsim": "\u2973", "larrtl": "\u21A2", "lat": "\u2AAB", "latail": "\u2919", "lAtail": "\u291B", "late": "\u2AAD", "lates": "\u2AAD\uFE00", "lbarr": "\u290C", "lBarr": "\u290E", "lbbrk": "\u2772", "lbrace": "{", "lbrack": "[", "lbrke": "\u298B", "lbrksld": "\u298F", "lbrkslu": "\u298D", "lcaron": "\u013E", "Lcaron": "\u013D", "lcedil": "\u013C", "Lcedil": "\u013B", "lceil": "\u2308", "lcub": "{", "lcy": "\u043B", "Lcy": "\u041B", "ldca": "\u2936", "ldquo": "\u201C", "ldquor": "\u201E", "ldrdhar": "\u2967", "ldrushar": "\u294B", "ldsh": "\u21B2", "le": "\u2264", "lE": "\u2266", "LeftAngleBracket": "\u27E8", "leftarrow": "\u2190", "Leftarrow": "\u21D0", "LeftArrow": "\u2190", "LeftArrowBar": "\u21E4", "LeftArrowRightArrow": "\u21C6", "leftarrowtail": "\u21A2", "LeftCeiling": "\u2308", "LeftDoubleBracket": "\u27E6", "LeftDownTeeVector": "\u2961", "LeftDownVector": "\u21C3", "LeftDownVectorBar": "\u2959", "LeftFloor": "\u230A", "leftharpoondown": "\u21BD", "leftharpoonup": "\u21BC", "leftleftarrows": "\u21C7", "leftrightarrow": "\u2194", "Leftrightarrow": "\u21D4", "LeftRightArrow": "\u2194", "leftrightarrows": "\u21C6", "leftrightharpoons": "\u21CB", "leftrightsquigarrow": "\u21AD", "LeftRightVector": "\u294E", "LeftTee": "\u22A3", "LeftTeeArrow": "\u21A4", "LeftTeeVector": "\u295A", "leftthreetimes": "\u22CB", "LeftTriangle": "\u22B2", "LeftTriangleBar": "\u29CF", "LeftTriangleEqual": "\u22B4", "LeftUpDownVector": "\u2951", "LeftUpTeeVector": "\u2960", "LeftUpVector": "\u21BF", "LeftUpVectorBar": "\u2958", "LeftVector": "\u21BC", "LeftVectorBar": "\u2952", "leg": "\u22DA", "lEg": "\u2A8B", "leq": "\u2264", "leqq": "\u2266", "leqslant": "\u2A7D", "les": "\u2A7D", "lescc": "\u2AA8", "lesdot": "\u2A7F", "lesdoto": "\u2A81", "lesdotor": "\u2A83", "lesg": "\u22DA\uFE00", "lesges": "\u2A93", "lessapprox": "\u2A85", "lessdot": "\u22D6", "lesseqgtr": "\u22DA", "lesseqqgtr": "\u2A8B", "LessEqualGreater": "\u22DA", "LessFullEqual": "\u2266", "LessGreater": "\u2276", "lessgtr": "\u2276", "LessLess": "\u2AA1", "lesssim": "\u2272", "LessSlantEqual": "\u2A7D", "LessTilde": "\u2272", "lfisht": "\u297C", "lfloor": "\u230A", "lfr": "\u{1D529}", "Lfr": "\u{1D50F}", "lg": "\u2276", "lgE": "\u2A91", "lHar": "\u2962", "lhard": "\u21BD", "lharu": "\u21BC", "lharul": "\u296A", "lhblk": "\u2584", "ljcy": "\u0459", "LJcy": "\u0409", "ll": "\u226A", "Ll": "\u22D8", "llarr": "\u21C7", "llcorner": "\u231E", "Lleftarrow": "\u21DA", "llhard": "\u296B", "lltri": "\u25FA", "lmidot": "\u0140", "Lmidot": "\u013F", "lmoust": "\u23B0", "lmoustache": "\u23B0", "lnap": "\u2A89", "lnapprox": "\u2A89", "lne": "\u2A87", "lnE": "\u2268", "lneq": "\u2A87", "lneqq": "\u2268", "lnsim": "\u22E6", "loang": "\u27EC", "loarr": "\u21FD", "lobrk": "\u27E6", "longleftarrow": "\u27F5", "Longleftarrow": "\u27F8", "LongLeftArrow": "\u27F5", "longleftrightarrow": "\u27F7", "Longleftrightarrow": "\u27FA", "LongLeftRightArrow": "\u27F7", "longmapsto": "\u27FC", "longrightarrow": "\u27F6", "Longrightarrow": "\u27F9", "LongRightArrow": "\u27F6", "looparrowleft": "\u21AB", "looparrowright": "\u21AC", "lopar": "\u2985", "lopf": "\u{1D55D}", "Lopf": "\u{1D543}", "loplus": "\u2A2D", "lotimes": "\u2A34", "lowast": "\u2217", "lowbar": "_", "LowerLeftArrow": "\u2199", "LowerRightArrow": "\u2198", "loz": "\u25CA", "lozenge": "\u25CA", "lozf": "\u29EB", "lpar": "(", "lparlt": "\u2993", "lrarr": "\u21C6", "lrcorner": "\u231F", "lrhar": "\u21CB", "lrhard": "\u296D", "lrm": "\u200E", "lrtri": "\u22BF", "lsaquo": "\u2039", "lscr": "\u{1D4C1}", "Lscr": "\u2112", "lsh": "\u21B0", "Lsh": "\u21B0", "lsim": "\u2272", "lsime": "\u2A8D", "lsimg": "\u2A8F", "lsqb": "[", "lsquo": "\u2018", "lsquor": "\u201A", "lstrok": "\u0142", "Lstrok": "\u0141", "lt": "<", "Lt": "\u226A", "LT": "<", "ltcc": "\u2AA6", "ltcir": "\u2A79", "ltdot": "\u22D6", "lthree": "\u22CB", "ltimes": "\u22C9", "ltlarr": "\u2976", "ltquest": "\u2A7B", "ltri": "\u25C3", "ltrie": "\u22B4", "ltrif": "\u25C2", "ltrPar": "\u2996", "lurdshar": "\u294A", "luruhar": "\u2966", "lvertneqq": "\u2268\uFE00", "lvnE": "\u2268\uFE00", "macr": "\xAF", "male": "\u2642", "malt": "\u2720", "maltese": "\u2720", "map": "\u21A6", "Map": "\u2905", "mapsto": "\u21A6", "mapstodown": "\u21A7", "mapstoleft": "\u21A4", "mapstoup": "\u21A5", "marker": "\u25AE", "mcomma": "\u2A29", "mcy": "\u043C", "Mcy": "\u041C", "mdash": "\u2014", "mDDot": "\u223A", "measuredangle": "\u2221", "MediumSpace": "\u205F", "Mellintrf": "\u2133", "mfr": "\u{1D52A}", "Mfr": "\u{1D510}", "mho": "\u2127", "micro": "\xB5", "mid": "\u2223", "midast": "*", "midcir": "\u2AF0", "middot": "\xB7", "minus": "\u2212", "minusb": "\u229F", "minusd": "\u2238", "minusdu": "\u2A2A", "MinusPlus": "\u2213", "mlcp": "\u2ADB", "mldr": "\u2026", "mnplus": "\u2213", "models": "\u22A7", "mopf": "\u{1D55E}", "Mopf": "\u{1D544}", "mp": "\u2213", "mscr": "\u{1D4C2}", "Mscr": "\u2133", "mstpos": "\u223E", "mu": "\u03BC", "Mu": "\u039C", "multimap": "\u22B8", "mumap": "\u22B8", "nabla": "\u2207", "nacute": "\u0144", "Nacute": "\u0143", "nang": "\u2220\u20D2", "nap": "\u2249", "napE": "\u2A70\u0338", "napid": "\u224B\u0338", "napos": "\u0149", "napprox": "\u2249", "natur": "\u266E", "natural": "\u266E", "naturals": "\u2115", "nbsp": "\xA0", "nbump": "\u224E\u0338", "nbumpe": "\u224F\u0338", "ncap": "\u2A43", "ncaron": "\u0148", "Ncaron": "\u0147", "ncedil": "\u0146", "Ncedil": "\u0145", "ncong": "\u2247", "ncongdot": "\u2A6D\u0338", "ncup": "\u2A42", "ncy": "\u043D", "Ncy": "\u041D", "ndash": "\u2013", "ne": "\u2260", "nearhk": "\u2924", "nearr": "\u2197", "neArr": "\u21D7", "nearrow": "\u2197", "nedot": "\u2250\u0338", "NegativeMediumSpace": "\u200B", "NegativeThickSpace": "\u200B", "NegativeThinSpace": "\u200B", "NegativeVeryThinSpace": "\u200B", "nequiv": "\u2262", "nesear": "\u2928", "nesim": "\u2242\u0338", "NestedGreaterGreater": "\u226B", "NestedLessLess": "\u226A", "NewLine": "\n", "nexist": "\u2204", "nexists": "\u2204", "nfr": "\u{1D52B}", "Nfr": "\u{1D511}", "nge": "\u2271", "ngE": "\u2267\u0338", "ngeq": "\u2271", "ngeqq": "\u2267\u0338", "ngeqslant": "\u2A7E\u0338", "nges": "\u2A7E\u0338", "nGg": "\u22D9\u0338", "ngsim": "\u2275", "ngt": "\u226F", "nGt": "\u226B\u20D2", "ngtr": "\u226F", "nGtv": "\u226B\u0338", "nharr": "\u21AE", "nhArr": "\u21CE", "nhpar": "\u2AF2", "ni": "\u220B", "nis": "\u22FC", "nisd": "\u22FA", "niv": "\u220B", "njcy": "\u045A", "NJcy": "\u040A", "nlarr": "\u219A", "nlArr": "\u21CD", "nldr": "\u2025", "nle": "\u2270", "nlE": "\u2266\u0338", "nleftarrow": "\u219A", "nLeftarrow": "\u21CD", "nleftrightarrow": "\u21AE", "nLeftrightarrow": "\u21CE", "nleq": "\u2270", "nleqq": "\u2266\u0338", "nleqslant": "\u2A7D\u0338", "nles": "\u2A7D\u0338", "nless": "\u226E", "nLl": "\u22D8\u0338", "nlsim": "\u2274", "nlt": "\u226E", "nLt": "\u226A\u20D2", "nltri": "\u22EA", "nltrie": "\u22EC", "nLtv": "\u226A\u0338", "nmid": "\u2224", "NoBreak": "\u2060", "NonBreakingSpace": "\xA0", "nopf": "\u{1D55F}", "Nopf": "\u2115", "not": "\xAC", "Not": "\u2AEC", "NotCongruent": "\u2262", "NotCupCap": "\u226D", "NotDoubleVerticalBar": "\u2226", "NotElement": "\u2209", "NotEqual": "\u2260", "NotEqualTilde": "\u2242\u0338", "NotExists": "\u2204", "NotGreater": "\u226F", "NotGreaterEqual": "\u2271", "NotGreaterFullEqual": "\u2267\u0338", "NotGreaterGreater": "\u226B\u0338", "NotGreaterLess": "\u2279", "NotGreaterSlantEqual": "\u2A7E\u0338", "NotGreaterTilde": "\u2275", "NotHumpDownHump": "\u224E\u0338", "NotHumpEqual": "\u224F\u0338", "notin": "\u2209", "notindot": "\u22F5\u0338", "notinE": "\u22F9\u0338", "notinva": "\u2209", "notinvb": "\u22F7", "notinvc": "\u22F6", "NotLeftTriangle": "\u22EA", "NotLeftTriangleBar": "\u29CF\u0338", "NotLeftTriangleEqual": "\u22EC", "NotLess": "\u226E", "NotLessEqual": "\u2270", "NotLessGreater": "\u2278", "NotLessLess": "\u226A\u0338", "NotLessSlantEqual": "\u2A7D\u0338", "NotLessTilde": "\u2274", "NotNestedGreaterGreater": "\u2AA2\u0338", "NotNestedLessLess": "\u2AA1\u0338", "notni": "\u220C", "notniva": "\u220C", "notnivb": "\u22FE", "notnivc": "\u22FD", "NotPrecedes": "\u2280", "NotPrecedesEqual": "\u2AAF\u0338", "NotPrecedesSlantEqual": "\u22E0", "NotReverseElement": "\u220C", "NotRightTriangle": "\u22EB", "NotRightTriangleBar": "\u29D0\u0338", "NotRightTriangleEqual": "\u22ED", "NotSquareSubset": "\u228F\u0338", "NotSquareSubsetEqual": "\u22E2", "NotSquareSuperset": "\u2290\u0338", "NotSquareSupersetEqual": "\u22E3", "NotSubset": "\u2282\u20D2", "NotSubsetEqual": "\u2288", "NotSucceeds": "\u2281", "NotSucceedsEqual": "\u2AB0\u0338", "NotSucceedsSlantEqual": "\u22E1", "NotSucceedsTilde": "\u227F\u0338", "NotSuperset": "\u2283\u20D2", "NotSupersetEqual": "\u2289", "NotTilde": "\u2241", "NotTildeEqual": "\u2244", "NotTildeFullEqual": "\u2247", "NotTildeTilde": "\u2249", "NotVerticalBar": "\u2224", "npar": "\u2226", "nparallel": "\u2226", "nparsl": "\u2AFD\u20E5", "npart": "\u2202\u0338", "npolint": "\u2A14", "npr": "\u2280", "nprcue": "\u22E0", "npre": "\u2AAF\u0338", "nprec": "\u2280", "npreceq": "\u2AAF\u0338", "nrarr": "\u219B", "nrArr": "\u21CF", "nrarrc": "\u2933\u0338", "nrarrw": "\u219D\u0338", "nrightarrow": "\u219B", "nRightarrow": "\u21CF", "nrtri": "\u22EB", "nrtrie": "\u22ED", "nsc": "\u2281", "nsccue": "\u22E1", "nsce": "\u2AB0\u0338", "nscr": "\u{1D4C3}", "Nscr": "\u{1D4A9}", "nshortmid": "\u2224", "nshortparallel": "\u2226", "nsim": "\u2241", "nsime": "\u2244", "nsimeq": "\u2244", "nsmid": "\u2224", "nspar": "\u2226", "nsqsube": "\u22E2", "nsqsupe": "\u22E3", "nsub": "\u2284", "nsube": "\u2288", "nsubE": "\u2AC5\u0338", "nsubset": "\u2282\u20D2", "nsubseteq": "\u2288", "nsubseteqq": "\u2AC5\u0338", "nsucc": "\u2281", "nsucceq": "\u2AB0\u0338", "nsup": "\u2285", "nsupe": "\u2289", "nsupE": "\u2AC6\u0338", "nsupset": "\u2283\u20D2", "nsupseteq": "\u2289", "nsupseteqq": "\u2AC6\u0338", "ntgl": "\u2279", "ntilde": "\xF1", "Ntilde": "\xD1", "ntlg": "\u2278", "ntriangleleft": "\u22EA", "ntrianglelefteq": "\u22EC", "ntriangleright": "\u22EB", "ntrianglerighteq": "\u22ED", "nu": "\u03BD", "Nu": "\u039D", "num": "#", "numero": "\u2116", "numsp": "\u2007", "nvap": "\u224D\u20D2", "nvdash": "\u22AC", "nvDash": "\u22AD", "nVdash": "\u22AE", "nVDash": "\u22AF", "nvge": "\u2265\u20D2", "nvgt": ">\u20D2", "nvHarr": "\u2904", "nvinfin": "\u29DE", "nvlArr": "\u2902", "nvle": "\u2264\u20D2", "nvlt": "<\u20D2", "nvltrie": "\u22B4\u20D2", "nvrArr": "\u2903", "nvrtrie": "\u22B5\u20D2", "nvsim": "\u223C\u20D2", "nwarhk": "\u2923", "nwarr": "\u2196", "nwArr": "\u21D6", "nwarrow": "\u2196", "nwnear": "\u2927", "oacute": "\xF3", "Oacute": "\xD3", "oast": "\u229B", "ocir": "\u229A", "ocirc": "\xF4", "Ocirc": "\xD4", "ocy": "\u043E", "Ocy": "\u041E", "odash": "\u229D", "odblac": "\u0151", "Odblac": "\u0150", "odiv": "\u2A38", "odot": "\u2299", "odsold": "\u29BC", "oelig": "\u0153", "OElig": "\u0152", "ofcir": "\u29BF", "ofr": "\u{1D52C}", "Ofr": "\u{1D512}", "ogon": "\u02DB", "ograve": "\xF2", "Ograve": "\xD2", "ogt": "\u29C1", "ohbar": "\u29B5", "ohm": "\u03A9", "oint": "\u222E", "olarr": "\u21BA", "olcir": "\u29BE", "olcross": "\u29BB", "oline": "\u203E", "olt": "\u29C0", "omacr": "\u014D", "Omacr": "\u014C", "omega": "\u03C9", "Omega": "\u03A9", "omicron": "\u03BF", "Omicron": "\u039F", "omid": "\u29B6", "ominus": "\u2296", "oopf": "\u{1D560}", "Oopf": "\u{1D546}", "opar": "\u29B7", "OpenCurlyDoubleQuote": "\u201C", "OpenCurlyQuote": "\u2018", "operp": "\u29B9", "oplus": "\u2295", "or": "\u2228", "Or": "\u2A54", "orarr": "\u21BB", "ord": "\u2A5D", "order": "\u2134", "orderof": "\u2134", "ordf": "\xAA", "ordm": "\xBA", "origof": "\u22B6", "oror": "\u2A56", "orslope": "\u2A57", "orv": "\u2A5B", "oS": "\u24C8", "oscr": "\u2134", "Oscr": "\u{1D4AA}", "oslash": "\xF8", "Oslash": "\xD8", "osol": "\u2298", "otilde": "\xF5", "Otilde": "\xD5", "otimes": "\u2297", "Otimes": "\u2A37", "otimesas": "\u2A36", "ouml": "\xF6", "Ouml": "\xD6", "ovbar": "\u233D", "OverBar": "\u203E", "OverBrace": "\u23DE", "OverBracket": "\u23B4", "OverParenthesis": "\u23DC", "par": "\u2225", "para": "\xB6", "parallel": "\u2225", "parsim": "\u2AF3", "parsl": "\u2AFD", "part": "\u2202", "PartialD": "\u2202", "pcy": "\u043F", "Pcy": "\u041F", "percnt": "%", "period": ".", "permil": "\u2030", "perp": "\u22A5", "pertenk": "\u2031", "pfr": "\u{1D52D}", "Pfr": "\u{1D513}", "phi": "\u03C6", "Phi": "\u03A6", "phiv": "\u03D5", "phmmat": "\u2133", "phone": "\u260E", "pi": "\u03C0", "Pi": "\u03A0", "pitchfork": "\u22D4", "piv": "\u03D6", "planck": "\u210F", "planckh": "\u210E", "plankv": "\u210F", "plus": "+", "plusacir": "\u2A23", "plusb": "\u229E", "pluscir": "\u2A22", "plusdo": "\u2214", "plusdu": "\u2A25", "pluse": "\u2A72", "PlusMinus": "\xB1", "plusmn": "\xB1", "plussim": "\u2A26", "plustwo": "\u2A27", "pm": "\xB1", "Poincareplane": "\u210C", "pointint": "\u2A15", "popf": "\u{1D561}", "Popf": "\u2119", "pound": "\xA3", "pr": "\u227A", "Pr": "\u2ABB", "prap": "\u2AB7", "prcue": "\u227C", "pre": "\u2AAF", "prE": "\u2AB3", "prec": "\u227A", "precapprox": "\u2AB7", "preccurlyeq": "\u227C", "Precedes": "\u227A", "PrecedesEqual": "\u2AAF", "PrecedesSlantEqual": "\u227C", "PrecedesTilde": "\u227E", "preceq": "\u2AAF", "precnapprox": "\u2AB9", "precneqq": "\u2AB5", "precnsim": "\u22E8", "precsim": "\u227E", "prime": "\u2032", "Prime": "\u2033", "primes": "\u2119", "prnap": "\u2AB9", "prnE": "\u2AB5", "prnsim": "\u22E8", "prod": "\u220F", "Product": "\u220F", "profalar": "\u232E", "profline": "\u2312", "profsurf": "\u2313", "prop": "\u221D", "Proportion": "\u2237", "Proportional": "\u221D", "propto": "\u221D", "prsim": "\u227E", "prurel": "\u22B0", "pscr": "\u{1D4C5}", "Pscr": "\u{1D4AB}", "psi": "\u03C8", "Psi": "\u03A8", "puncsp": "\u2008", "qfr": "\u{1D52E}", "Qfr": "\u{1D514}", "qint": "\u2A0C", "qopf": "\u{1D562}", "Qopf": "\u211A", "qprime": "\u2057", "qscr": "\u{1D4C6}", "Qscr": "\u{1D4AC}", "quaternions": "\u210D", "quatint": "\u2A16", "quest": "?", "questeq": "\u225F", "quot": '"', "QUOT": '"', "rAarr": "\u21DB", "race": "\u223D\u0331", "racute": "\u0155", "Racute": "\u0154", "radic": "\u221A", "raemptyv": "\u29B3", "rang": "\u27E9", "Rang": "\u27EB", "rangd": "\u2992", "range": "\u29A5", "rangle": "\u27E9", "raquo": "\xBB", "rarr": "\u2192", "rArr": "\u21D2", "Rarr": "\u21A0", "rarrap": "\u2975", "rarrb": "\u21E5", "rarrbfs": "\u2920", "rarrc": "\u2933", "rarrfs": "\u291E", "rarrhk": "\u21AA", "rarrlp": "\u21AC", "rarrpl": "\u2945", "rarrsim": "\u2974", "rarrtl": "\u21A3", "Rarrtl": "\u2916", "rarrw": "\u219D", "ratail": "\u291A", "rAtail": "\u291C", "ratio": "\u2236", "rationals": "\u211A", "rbarr": "\u290D", "rBarr": "\u290F", "RBarr": "\u2910", "rbbrk": "\u2773", "rbrace": "}", "rbrack": "]", "rbrke": "\u298C", "rbrksld": "\u298E", "rbrkslu": "\u2990", "rcaron": "\u0159", "Rcaron": "\u0158", "rcedil": "\u0157", "Rcedil": "\u0156", "rceil": "\u2309", "rcub": "}", "rcy": "\u0440", "Rcy": "\u0420", "rdca": "\u2937", "rdldhar": "\u2969", "rdquo": "\u201D", "rdquor": "\u201D", "rdsh": "\u21B3", "Re": "\u211C", "real": "\u211C", "realine": "\u211B", "realpart": "\u211C", "reals": "\u211D", "rect": "\u25AD", "reg": "\xAE", "REG": "\xAE", "ReverseElement": "\u220B", "ReverseEquilibrium": "\u21CB", "ReverseUpEquilibrium": "\u296F", "rfisht": "\u297D", "rfloor": "\u230B", "rfr": "\u{1D52F}", "Rfr": "\u211C", "rHar": "\u2964", "rhard": "\u21C1", "rharu": "\u21C0", "rharul": "\u296C", "rho": "\u03C1", "Rho": "\u03A1", "rhov": "\u03F1", "RightAngleBracket": "\u27E9", "rightarrow": "\u2192", "Rightarrow": "\u21D2", "RightArrow": "\u2192", "RightArrowBar": "\u21E5", "RightArrowLeftArrow": "\u21C4", "rightarrowtail": "\u21A3", "RightCeiling": "\u2309", "RightDoubleBracket": "\u27E7", "RightDownTeeVector": "\u295D", "RightDownVector": "\u21C2", "RightDownVectorBar": "\u2955", "RightFloor": "\u230B", "rightharpoondown": "\u21C1", "rightharpoonup": "\u21C0", "rightleftarrows": "\u21C4", "rightleftharpoons": "\u21CC", "rightrightarrows": "\u21C9", "rightsquigarrow": "\u219D", "RightTee": "\u22A2", "RightTeeArrow": "\u21A6", "RightTeeVector": "\u295B", "rightthreetimes": "\u22CC", "RightTriangle": "\u22B3", "RightTriangleBar": "\u29D0", "RightTriangleEqual": "\u22B5", "RightUpDownVector": "\u294F", "RightUpTeeVector": "\u295C", "RightUpVector": "\u21BE", "RightUpVectorBar": "\u2954", "RightVector": "\u21C0", "RightVectorBar": "\u2953", "ring": "\u02DA", "risingdotseq": "\u2253", "rlarr": "\u21C4", "rlhar": "\u21CC", "rlm": "\u200F", "rmoust": "\u23B1", "rmoustache": "\u23B1", "rnmid": "\u2AEE", "roang": "\u27ED", "roarr": "\u21FE", "robrk": "\u27E7", "ropar": "\u2986", "ropf": "\u{1D563}", "Ropf": "\u211D", "roplus": "\u2A2E", "rotimes": "\u2A35", "RoundImplies": "\u2970", "rpar": ")", "rpargt": "\u2994", "rppolint": "\u2A12", "rrarr": "\u21C9", "Rrightarrow": "\u21DB", "rsaquo": "\u203A", "rscr": "\u{1D4C7}", "Rscr": "\u211B", "rsh": "\u21B1", "Rsh": "\u21B1", "rsqb": "]", "rsquo": "\u2019", "rsquor": "\u2019", "rthree": "\u22CC", "rtimes": "\u22CA", "rtri": "\u25B9", "rtrie": "\u22B5", "rtrif": "\u25B8", "rtriltri": "\u29CE", "RuleDelayed": "\u29F4", "ruluhar": "\u2968", "rx": "\u211E", "sacute": "\u015B", "Sacute": "\u015A", "sbquo": "\u201A", "sc": "\u227B", "Sc": "\u2ABC", "scap": "\u2AB8", "scaron": "\u0161", "Scaron": "\u0160", "sccue": "\u227D", "sce": "\u2AB0", "scE": "\u2AB4", "scedil": "\u015F", "Scedil": "\u015E", "scirc": "\u015D", "Scirc": "\u015C", "scnap": "\u2ABA", "scnE": "\u2AB6", "scnsim": "\u22E9", "scpolint": "\u2A13", "scsim": "\u227F", "scy": "\u0441", "Scy": "\u0421", "sdot": "\u22C5", "sdotb": "\u22A1", "sdote": "\u2A66", "searhk": "\u2925", "searr": "\u2198", "seArr": "\u21D8", "searrow": "\u2198", "sect": "\xA7", "semi": ";", "seswar": "\u2929", "setminus": "\u2216", "setmn": "\u2216", "sext": "\u2736", "sfr": "\u{1D530}", "Sfr": "\u{1D516}", "sfrown": "\u2322", "sharp": "\u266F", "shchcy": "\u0449", "SHCHcy": "\u0429", "shcy": "\u0448", "SHcy": "\u0428", "ShortDownArrow": "\u2193", "ShortLeftArrow": "\u2190", "shortmid": "\u2223", "shortparallel": "\u2225", "ShortRightArrow": "\u2192", "ShortUpArrow": "\u2191", "shy": "\xAD", "sigma": "\u03C3", "Sigma": "\u03A3", "sigmaf": "\u03C2", "sigmav": "\u03C2", "sim": "\u223C", "simdot": "\u2A6A", "sime": "\u2243", "simeq": "\u2243", "simg": "\u2A9E", "simgE": "\u2AA0", "siml": "\u2A9D", "simlE": "\u2A9F", "simne": "\u2246", "simplus": "\u2A24", "simrarr": "\u2972", "slarr": "\u2190", "SmallCircle": "\u2218", "smallsetminus": "\u2216", "smashp": "\u2A33", "smeparsl": "\u29E4", "smid": "\u2223", "smile": "\u2323", "smt": "\u2AAA", "smte": "\u2AAC", "smtes": "\u2AAC\uFE00", "softcy": "\u044C", "SOFTcy": "\u042C", "sol": "/", "solb": "\u29C4", "solbar": "\u233F", "sopf": "\u{1D564}", "Sopf": "\u{1D54A}", "spades": "\u2660", "spadesuit": "\u2660", "spar": "\u2225", "sqcap": "\u2293", "sqcaps": "\u2293\uFE00", "sqcup": "\u2294", "sqcups": "\u2294\uFE00", "Sqrt": "\u221A", "sqsub": "\u228F", "sqsube": "\u2291", "sqsubset": "\u228F", "sqsubseteq": "\u2291", "sqsup": "\u2290", "sqsupe": "\u2292", "sqsupset": "\u2290", "sqsupseteq": "\u2292", "squ": "\u25A1", "square": "\u25A1", "Square": "\u25A1", "SquareIntersection": "\u2293", "SquareSubset": "\u228F", "SquareSubsetEqual": "\u2291", "SquareSuperset": "\u2290", "SquareSupersetEqual": "\u2292", "SquareUnion": "\u2294", "squarf": "\u25AA", "squf": "\u25AA", "srarr": "\u2192", "sscr": "\u{1D4C8}", "Sscr": "\u{1D4AE}", "ssetmn": "\u2216", "ssmile": "\u2323", "sstarf": "\u22C6", "star": "\u2606", "Star": "\u22C6", "starf": "\u2605", "straightepsilon": "\u03F5", "straightphi": "\u03D5", "strns": "\xAF", "sub": "\u2282", "Sub": "\u22D0", "subdot": "\u2ABD", "sube": "\u2286", "subE": "\u2AC5", "subedot": "\u2AC3", "submult": "\u2AC1", "subne": "\u228A", "subnE": "\u2ACB", "subplus": "\u2ABF", "subrarr": "\u2979", "subset": "\u2282", "Subset": "\u22D0", "subseteq": "\u2286", "subseteqq": "\u2AC5", "SubsetEqual": "\u2286", "subsetneq": "\u228A", "subsetneqq": "\u2ACB", "subsim": "\u2AC7", "subsub": "\u2AD5", "subsup": "\u2AD3", "succ": "\u227B", "succapprox": "\u2AB8", "succcurlyeq": "\u227D", "Succeeds": "\u227B", "SucceedsEqual": "\u2AB0", "SucceedsSlantEqual": "\u227D", "SucceedsTilde": "\u227F", "succeq": "\u2AB0", "succnapprox": "\u2ABA", "succneqq": "\u2AB6", "succnsim": "\u22E9", "succsim": "\u227F", "SuchThat": "\u220B", "sum": "\u2211", "Sum": "\u2211", "sung": "\u266A", "sup": "\u2283", "Sup": "\u22D1", "sup1": "\xB9", "sup2": "\xB2", "sup3": "\xB3", "supdot": "\u2ABE", "supdsub": "\u2AD8", "supe": "\u2287", "supE": "\u2AC6", "supedot": "\u2AC4", "Superset": "\u2283", "SupersetEqual": "\u2287", "suphsol": "\u27C9", "suphsub": "\u2AD7", "suplarr": "\u297B", "supmult": "\u2AC2", "supne": "\u228B", "supnE": "\u2ACC", "supplus": "\u2AC0", "supset": "\u2283", "Supset": "\u22D1", "supseteq": "\u2287", "supseteqq": "\u2AC6", "supsetneq": "\u228B", "supsetneqq": "\u2ACC", "supsim": "\u2AC8", "supsub": "\u2AD4", "supsup": "\u2AD6", "swarhk": "\u2926", "swarr": "\u2199", "swArr": "\u21D9", "swarrow": "\u2199", "swnwar": "\u292A", "szlig": "\xDF", "Tab": "	", "target": "\u2316", "tau": "\u03C4", "Tau": "\u03A4", "tbrk": "\u23B4", "tcaron": "\u0165", "Tcaron": "\u0164", "tcedil": "\u0163", "Tcedil": "\u0162", "tcy": "\u0442", "Tcy": "\u0422", "tdot": "\u20DB", "telrec": "\u2315", "tfr": "\u{1D531}", "Tfr": "\u{1D517}", "there4": "\u2234", "therefore": "\u2234", "Therefore": "\u2234", "theta": "\u03B8", "Theta": "\u0398", "thetasym": "\u03D1", "thetav": "\u03D1", "thickapprox": "\u2248", "thicksim": "\u223C", "ThickSpace": "\u205F\u200A", "thinsp": "\u2009", "ThinSpace": "\u2009", "thkap": "\u2248", "thksim": "\u223C", "thorn": "\xFE", "THORN": "\xDE", "tilde": "\u02DC", "Tilde": "\u223C", "TildeEqual": "\u2243", "TildeFullEqual": "\u2245", "TildeTilde": "\u2248", "times": "\xD7", "timesb": "\u22A0", "timesbar": "\u2A31", "timesd": "\u2A30", "tint": "\u222D", "toea": "\u2928", "top": "\u22A4", "topbot": "\u2336", "topcir": "\u2AF1", "topf": "\u{1D565}", "Topf": "\u{1D54B}", "topfork": "\u2ADA", "tosa": "\u2929", "tprime": "\u2034", "trade": "\u2122", "TRADE": "\u2122", "triangle": "\u25B5", "triangledown": "\u25BF", "triangleleft": "\u25C3", "trianglelefteq": "\u22B4", "triangleq": "\u225C", "triangleright": "\u25B9", "trianglerighteq": "\u22B5", "tridot": "\u25EC", "trie": "\u225C", "triminus": "\u2A3A", "TripleDot": "\u20DB", "triplus": "\u2A39", "trisb": "\u29CD", "tritime": "\u2A3B", "trpezium": "\u23E2", "tscr": "\u{1D4C9}", "Tscr": "\u{1D4AF}", "tscy": "\u0446", "TScy": "\u0426", "tshcy": "\u045B", "TSHcy": "\u040B", "tstrok": "\u0167", "Tstrok": "\u0166", "twixt": "\u226C", "twoheadleftarrow": "\u219E", "twoheadrightarrow": "\u21A0", "uacute": "\xFA", "Uacute": "\xDA", "uarr": "\u2191", "uArr": "\u21D1", "Uarr": "\u219F", "Uarrocir": "\u2949", "ubrcy": "\u045E", "Ubrcy": "\u040E", "ubreve": "\u016D", "Ubreve": "\u016C", "ucirc": "\xFB", "Ucirc": "\xDB", "ucy": "\u0443", "Ucy": "\u0423", "udarr": "\u21C5", "udblac": "\u0171", "Udblac": "\u0170", "udhar": "\u296E", "ufisht": "\u297E", "ufr": "\u{1D532}", "Ufr": "\u{1D518}", "ugrave": "\xF9", "Ugrave": "\xD9", "uHar": "\u2963", "uharl": "\u21BF", "uharr": "\u21BE", "uhblk": "\u2580", "ulcorn": "\u231C", "ulcorner": "\u231C", "ulcrop": "\u230F", "ultri": "\u25F8", "umacr": "\u016B", "Umacr": "\u016A", "uml": "\xA8", "UnderBar": "_", "UnderBrace": "\u23DF", "UnderBracket": "\u23B5", "UnderParenthesis": "\u23DD", "Union": "\u22C3", "UnionPlus": "\u228E", "uogon": "\u0173", "Uogon": "\u0172", "uopf": "\u{1D566}", "Uopf": "\u{1D54C}", "uparrow": "\u2191", "Uparrow": "\u21D1", "UpArrow": "\u2191", "UpArrowBar": "\u2912", "UpArrowDownArrow": "\u21C5", "updownarrow": "\u2195", "Updownarrow": "\u21D5", "UpDownArrow": "\u2195", "UpEquilibrium": "\u296E", "upharpoonleft": "\u21BF", "upharpoonright": "\u21BE", "uplus": "\u228E", "UpperLeftArrow": "\u2196", "UpperRightArrow": "\u2197", "upsi": "\u03C5", "Upsi": "\u03D2", "upsih": "\u03D2", "upsilon": "\u03C5", "Upsilon": "\u03A5", "UpTee": "\u22A5", "UpTeeArrow": "\u21A5", "upuparrows": "\u21C8", "urcorn": "\u231D", "urcorner": "\u231D", "urcrop": "\u230E", "uring": "\u016F", "Uring": "\u016E", "urtri": "\u25F9", "uscr": "\u{1D4CA}", "Uscr": "\u{1D4B0}", "utdot": "\u22F0", "utilde": "\u0169", "Utilde": "\u0168", "utri": "\u25B5", "utrif": "\u25B4", "uuarr": "\u21C8", "uuml": "\xFC", "Uuml": "\xDC", "uwangle": "\u29A7", "vangrt": "\u299C", "varepsilon": "\u03F5", "varkappa": "\u03F0", "varnothing": "\u2205", "varphi": "\u03D5", "varpi": "\u03D6", "varpropto": "\u221D", "varr": "\u2195", "vArr": "\u21D5", "varrho": "\u03F1", "varsigma": "\u03C2", "varsubsetneq": "\u228A\uFE00", "varsubsetneqq": "\u2ACB\uFE00", "varsupsetneq": "\u228B\uFE00", "varsupsetneqq": "\u2ACC\uFE00", "vartheta": "\u03D1", "vartriangleleft": "\u22B2", "vartriangleright": "\u22B3", "vBar": "\u2AE8", "Vbar": "\u2AEB", "vBarv": "\u2AE9", "vcy": "\u0432", "Vcy": "\u0412", "vdash": "\u22A2", "vDash": "\u22A8", "Vdash": "\u22A9", "VDash": "\u22AB", "Vdashl": "\u2AE6", "vee": "\u2228", "Vee": "\u22C1", "veebar": "\u22BB", "veeeq": "\u225A", "vellip": "\u22EE", "verbar": "|", "Verbar": "\u2016", "vert": "|", "Vert": "\u2016", "VerticalBar": "\u2223", "VerticalLine": "|", "VerticalSeparator": "\u2758", "VerticalTilde": "\u2240", "VeryThinSpace": "\u200A", "vfr": "\u{1D533}", "Vfr": "\u{1D519}", "vltri": "\u22B2", "vnsub": "\u2282\u20D2", "vnsup": "\u2283\u20D2", "vopf": "\u{1D567}", "Vopf": "\u{1D54D}", "vprop": "\u221D", "vrtri": "\u22B3", "vscr": "\u{1D4CB}", "Vscr": "\u{1D4B1}", "vsubne": "\u228A\uFE00", "vsubnE": "\u2ACB\uFE00", "vsupne": "\u228B\uFE00", "vsupnE": "\u2ACC\uFE00", "Vvdash": "\u22AA", "vzigzag": "\u299A", "wcirc": "\u0175", "Wcirc": "\u0174", "wedbar": "\u2A5F", "wedge": "\u2227", "Wedge": "\u22C0", "wedgeq": "\u2259", "weierp": "\u2118", "wfr": "\u{1D534}", "Wfr": "\u{1D51A}", "wopf": "\u{1D568}", "Wopf": "\u{1D54E}", "wp": "\u2118", "wr": "\u2240", "wreath": "\u2240", "wscr": "\u{1D4CC}", "Wscr": "\u{1D4B2}", "xcap": "\u22C2", "xcirc": "\u25EF", "xcup": "\u22C3", "xdtri": "\u25BD", "xfr": "\u{1D535}", "Xfr": "\u{1D51B}", "xharr": "\u27F7", "xhArr": "\u27FA", "xi": "\u03BE", "Xi": "\u039E", "xlarr": "\u27F5", "xlArr": "\u27F8", "xmap": "\u27FC", "xnis": "\u22FB", "xodot": "\u2A00", "xopf": "\u{1D569}", "Xopf": "\u{1D54F}", "xoplus": "\u2A01", "xotime": "\u2A02", "xrarr": "\u27F6", "xrArr": "\u27F9", "xscr": "\u{1D4CD}", "Xscr": "\u{1D4B3}", "xsqcup": "\u2A06", "xuplus": "\u2A04", "xutri": "\u25B3", "xvee": "\u22C1", "xwedge": "\u22C0", "yacute": "\xFD", "Yacute": "\xDD", "yacy": "\u044F", "YAcy": "\u042F", "ycirc": "\u0177", "Ycirc": "\u0176", "ycy": "\u044B", "Ycy": "\u042B", "yen": "\xA5", "yfr": "\u{1D536}", "Yfr": "\u{1D51C}", "yicy": "\u0457", "YIcy": "\u0407", "yopf": "\u{1D56A}", "Yopf": "\u{1D550}", "yscr": "\u{1D4CE}", "Yscr": "\u{1D4B4}", "yucy": "\u044E", "YUcy": "\u042E", "yuml": "\xFF", "Yuml": "\u0178", "zacute": "\u017A", "Zacute": "\u0179", "zcaron": "\u017E", "Zcaron": "\u017D", "zcy": "\u0437", "Zcy": "\u0417", "zdot": "\u017C", "Zdot": "\u017B", "zeetrf": "\u2128", "ZeroWidthSpace": "\u200B", "zeta": "\u03B6", "Zeta": "\u0396", "zfr": "\u{1D537}", "Zfr": "\u2128", "zhcy": "\u0436", "ZHcy": "\u0416", "zigrarr": "\u21DD", "zopf": "\u{1D56B}", "Zopf": "\u2124", "zscr": "\u{1D4CF}", "Zscr": "\u{1D4B5}", "zwj": "\u200D", "zwnj": "\u200C" };
    var decodeMapLegacy = { "aacute": "\xE1", "Aacute": "\xC1", "acirc": "\xE2", "Acirc": "\xC2", "acute": "\xB4", "aelig": "\xE6", "AElig": "\xC6", "agrave": "\xE0", "Agrave": "\xC0", "amp": "&", "AMP": "&", "aring": "\xE5", "Aring": "\xC5", "atilde": "\xE3", "Atilde": "\xC3", "auml": "\xE4", "Auml": "\xC4", "brvbar": "\xA6", "ccedil": "\xE7", "Ccedil": "\xC7", "cedil": "\xB8", "cent": "\xA2", "copy": "\xA9", "COPY": "\xA9", "curren": "\xA4", "deg": "\xB0", "divide": "\xF7", "eacute": "\xE9", "Eacute": "\xC9", "ecirc": "\xEA", "Ecirc": "\xCA", "egrave": "\xE8", "Egrave": "\xC8", "eth": "\xF0", "ETH": "\xD0", "euml": "\xEB", "Euml": "\xCB", "frac12": "\xBD", "frac14": "\xBC", "frac34": "\xBE", "gt": ">", "GT": ">", "iacute": "\xED", "Iacute": "\xCD", "icirc": "\xEE", "Icirc": "\xCE", "iexcl": "\xA1", "igrave": "\xEC", "Igrave": "\xCC", "iquest": "\xBF", "iuml": "\xEF", "Iuml": "\xCF", "laquo": "\xAB", "lt": "<", "LT": "<", "macr": "\xAF", "micro": "\xB5", "middot": "\xB7", "nbsp": "\xA0", "not": "\xAC", "ntilde": "\xF1", "Ntilde": "\xD1", "oacute": "\xF3", "Oacute": "\xD3", "ocirc": "\xF4", "Ocirc": "\xD4", "ograve": "\xF2", "Ograve": "\xD2", "ordf": "\xAA", "ordm": "\xBA", "oslash": "\xF8", "Oslash": "\xD8", "otilde": "\xF5", "Otilde": "\xD5", "ouml": "\xF6", "Ouml": "\xD6", "para": "\xB6", "plusmn": "\xB1", "pound": "\xA3", "quot": '"', "QUOT": '"', "raquo": "\xBB", "reg": "\xAE", "REG": "\xAE", "sect": "\xA7", "shy": "\xAD", "sup1": "\xB9", "sup2": "\xB2", "sup3": "\xB3", "szlig": "\xDF", "thorn": "\xFE", "THORN": "\xDE", "times": "\xD7", "uacute": "\xFA", "Uacute": "\xDA", "ucirc": "\xFB", "Ucirc": "\xDB", "ugrave": "\xF9", "Ugrave": "\xD9", "uml": "\xA8", "uuml": "\xFC", "Uuml": "\xDC", "yacute": "\xFD", "Yacute": "\xDD", "yen": "\xA5", "yuml": "\xFF" };
    var decodeMapNumeric = { "0": "\uFFFD", "128": "\u20AC", "130": "\u201A", "131": "\u0192", "132": "\u201E", "133": "\u2026", "134": "\u2020", "135": "\u2021", "136": "\u02C6", "137": "\u2030", "138": "\u0160", "139": "\u2039", "140": "\u0152", "142": "\u017D", "145": "\u2018", "146": "\u2019", "147": "\u201C", "148": "\u201D", "149": "\u2022", "150": "\u2013", "151": "\u2014", "152": "\u02DC", "153": "\u2122", "154": "\u0161", "155": "\u203A", "156": "\u0153", "158": "\u017E", "159": "\u0178" };
    var invalidReferenceCodePoints = [1, 2, 3, 4, 5, 6, 7, 8, 11, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 127, 128, 129, 130, 131, 132, 133, 134, 135, 136, 137, 138, 139, 140, 141, 142, 143, 144, 145, 146, 147, 148, 149, 150, 151, 152, 153, 154, 155, 156, 157, 158, 159, 64976, 64977, 64978, 64979, 64980, 64981, 64982, 64983, 64984, 64985, 64986, 64987, 64988, 64989, 64990, 64991, 64992, 64993, 64994, 64995, 64996, 64997, 64998, 64999, 65e3, 65001, 65002, 65003, 65004, 65005, 65006, 65007, 65534, 65535, 131070, 131071, 196606, 196607, 262142, 262143, 327678, 327679, 393214, 393215, 458750, 458751, 524286, 524287, 589822, 589823, 655358, 655359, 720894, 720895, 786430, 786431, 851966, 851967, 917502, 917503, 983038, 983039, 1048574, 1048575, 1114110, 1114111];
    var stringFromCharCode = String.fromCharCode;
    var object = {};
    var hasOwnProperty2 = object.hasOwnProperty;
    var has2 = function(object2, propertyName) {
      return hasOwnProperty2.call(object2, propertyName);
    };
    var contains2 = function(array, value) {
      var index2 = -1;
      var length = array.length;
      while (++index2 < length) {
        if (array[index2] == value) {
          return true;
        }
      }
      return false;
    };
    var merge = function(options, defaults) {
      if (!options) {
        return defaults;
      }
      var result = {};
      var key2;
      for (key2 in defaults) {
        result[key2] = has2(options, key2) ? options[key2] : defaults[key2];
      }
      return result;
    };
    var codePointToSymbol = function(codePoint, strict) {
      var output = "";
      if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
        if (strict) {
          parseError("character reference outside the permissible Unicode range");
        }
        return "\uFFFD";
      }
      if (has2(decodeMapNumeric, codePoint)) {
        if (strict) {
          parseError("disallowed character reference");
        }
        return decodeMapNumeric[codePoint];
      }
      if (strict && contains2(invalidReferenceCodePoints, codePoint)) {
        parseError("disallowed character reference");
      }
      if (codePoint > 65535) {
        codePoint -= 65536;
        output += stringFromCharCode(codePoint >>> 10 & 1023 | 55296);
        codePoint = 56320 | codePoint & 1023;
      }
      output += stringFromCharCode(codePoint);
      return output;
    };
    var hexEscape = function(codePoint) {
      return "&#x" + codePoint.toString(16).toUpperCase() + ";";
    };
    var decEscape = function(codePoint) {
      return "&#" + codePoint + ";";
    };
    var parseError = function(message) {
      throw Error("Parse error: " + message);
    };
    var encode2 = function(string, options) {
      options = merge(options, encode2.options);
      var strict = options.strict;
      if (strict && regexInvalidRawCodePoint.test(string)) {
        parseError("forbidden code point");
      }
      var encodeEverything = options.encodeEverything;
      var useNamedReferences = options.useNamedReferences;
      var allowUnsafeSymbols = options.allowUnsafeSymbols;
      var escapeCodePoint = options.decimal ? decEscape : hexEscape;
      var escapeBmpSymbol = function(symbol) {
        return escapeCodePoint(symbol.charCodeAt(0));
      };
      if (encodeEverything) {
        string = string.replace(regexAsciiWhitelist, function(symbol) {
          if (useNamedReferences && has2(encodeMap, symbol)) {
            return "&" + encodeMap[symbol] + ";";
          }
          return escapeBmpSymbol(symbol);
        });
        if (useNamedReferences) {
          string = string.replace(/&gt;\u20D2/g, "&nvgt;").replace(/&lt;\u20D2/g, "&nvlt;").replace(/&#x66;&#x6A;/g, "&fjlig;");
        }
        if (useNamedReferences) {
          string = string.replace(regexEncodeNonAscii, function(string2) {
            return "&" + encodeMap[string2] + ";";
          });
        }
      } else if (useNamedReferences) {
        if (!allowUnsafeSymbols) {
          string = string.replace(regexEscape, function(string2) {
            return "&" + encodeMap[string2] + ";";
          });
        }
        string = string.replace(/&gt;\u20D2/g, "&nvgt;").replace(/&lt;\u20D2/g, "&nvlt;");
        string = string.replace(regexEncodeNonAscii, function(string2) {
          return "&" + encodeMap[string2] + ";";
        });
      } else if (!allowUnsafeSymbols) {
        string = string.replace(regexEscape, escapeBmpSymbol);
      }
      return string.replace(regexAstralSymbols, function($0) {
        var high = $0.charCodeAt(0);
        var low = $0.charCodeAt(1);
        var codePoint = (high - 55296) * 1024 + low - 56320 + 65536;
        return escapeCodePoint(codePoint);
      }).replace(regexBmpWhitelist, escapeBmpSymbol);
    };
    encode2.options = {
      "allowUnsafeSymbols": false,
      "encodeEverything": false,
      "strict": false,
      "useNamedReferences": false,
      "decimal": false
    };
    var decode2 = function(html2, options) {
      options = merge(options, decode2.options);
      var strict = options.strict;
      if (strict && regexInvalidEntity.test(html2)) {
        parseError("malformed character reference");
      }
      return html2.replace(regexDecode, function($0, $1, $2, $3, $4, $5, $6, $7, $8) {
        var codePoint;
        var semicolon;
        var decDigits;
        var hexDigits;
        var reference2;
        var next;
        if ($1) {
          reference2 = $1;
          return decodeMap[reference2];
        }
        if ($2) {
          reference2 = $2;
          next = $3;
          if (next && options.isAttributeValue) {
            if (strict && next == "=") {
              parseError("`&` did not start a character reference");
            }
            return $0;
          } else {
            if (strict) {
              parseError("named character reference was not terminated by a semicolon");
            }
            return decodeMapLegacy[reference2] + (next || "");
          }
        }
        if ($4) {
          decDigits = $4;
          semicolon = $5;
          if (strict && !semicolon) {
            parseError("character reference was not terminated by a semicolon");
          }
          codePoint = parseInt(decDigits, 10);
          return codePointToSymbol(codePoint, strict);
        }
        if ($6) {
          hexDigits = $6;
          semicolon = $7;
          if (strict && !semicolon) {
            parseError("character reference was not terminated by a semicolon");
          }
          codePoint = parseInt(hexDigits, 16);
          return codePointToSymbol(codePoint, strict);
        }
        if (strict) {
          parseError("named character reference was not terminated by a semicolon");
        }
        return $0;
      });
    };
    decode2.options = {
      "isAttributeValue": false,
      "strict": false
    };
    var escape2 = function(string) {
      return string.replace(regexEscape, function($0) {
        return escapeMap[$0];
      });
    };
    var he2 = {
      "version": "1.2.0",
      "encode": encode2,
      "decode": decode2,
      "escape": escape2,
      "unescape": decode2
    };
    if (freeExports && !freeExports.nodeType) {
      if (freeModule) {
        freeModule.exports = he2;
      } else {
        for (var key in he2) {
          has2(he2, key) && (freeExports[key] = he2[key]);
        }
      }
    } else {
      root.he = he2;
    }
  })(commonjsGlobal);
})(he, he.exports);
Object.defineProperty(node$1, "__esModule", { value: true });
var he_1$2 = he.exports;
var Node$2 = function() {
  function Node2(parentNode, range2) {
    if (parentNode === void 0) {
      parentNode = null;
    }
    this.parentNode = parentNode;
    this.childNodes = [];
    Object.defineProperty(this, "range", {
      enumerable: false,
      writable: true,
      configurable: true,
      value: range2 !== null && range2 !== void 0 ? range2 : [-1, -1]
    });
  }
  Object.defineProperty(Node2.prototype, "innerText", {
    get: function() {
      return this.rawText;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Node2.prototype, "textContent", {
    get: function() {
      return (0, he_1$2.decode)(this.rawText);
    },
    set: function(val) {
      this.rawText = (0, he_1$2.encode)(val);
    },
    enumerable: false,
    configurable: true
  });
  return Node2;
}();
node$1.default = Node$2;
var type = {};
Object.defineProperty(type, "__esModule", { value: true });
var NodeType;
(function(NodeType2) {
  NodeType2[NodeType2["ELEMENT_NODE"] = 1] = "ELEMENT_NODE";
  NodeType2[NodeType2["TEXT_NODE"] = 3] = "TEXT_NODE";
  NodeType2[NodeType2["COMMENT_NODE"] = 8] = "COMMENT_NODE";
})(NodeType || (NodeType = {}));
type.default = NodeType;
var __extends$3 = commonjsGlobal && commonjsGlobal.__extends || function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p2 in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p2))
          d2[p2] = b2[p2];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __importDefault$8 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(comment, "__esModule", { value: true });
var node_1$2 = __importDefault$8(node$1);
var type_1$3 = __importDefault$8(type);
var CommentNode = function(_super) {
  __extends$3(CommentNode2, _super);
  function CommentNode2(rawText, parentNode, range2) {
    var _this = _super.call(this, parentNode, range2) || this;
    _this.rawText = rawText;
    _this.nodeType = type_1$3.default.COMMENT_NODE;
    return _this;
  }
  Object.defineProperty(CommentNode2.prototype, "text", {
    get: function() {
      return this.rawText;
    },
    enumerable: false,
    configurable: true
  });
  CommentNode2.prototype.toString = function() {
    return "<!--" + this.rawText + "-->";
  };
  return CommentNode2;
}(node_1$2.default);
comment.default = CommentNode;
var html = {};
var lib$7 = {};
var lib$6 = {};
var stringify$2 = {};
var lib$5 = {};
var lib$4 = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.Doctype = exports.CDATA = exports.Tag = exports.Style = exports.Script = exports.Comment = exports.Directive = exports.Text = exports.Root = exports.isTag = exports.ElementType = void 0;
  var ElementType2;
  (function(ElementType3) {
    ElementType3["Root"] = "root";
    ElementType3["Text"] = "text";
    ElementType3["Directive"] = "directive";
    ElementType3["Comment"] = "comment";
    ElementType3["Script"] = "script";
    ElementType3["Style"] = "style";
    ElementType3["Tag"] = "tag";
    ElementType3["CDATA"] = "cdata";
    ElementType3["Doctype"] = "doctype";
  })(ElementType2 = exports.ElementType || (exports.ElementType = {}));
  function isTag2(elem) {
    return elem.type === ElementType2.Tag || elem.type === ElementType2.Script || elem.type === ElementType2.Style;
  }
  exports.isTag = isTag2;
  exports.Root = ElementType2.Root;
  exports.Text = ElementType2.Text;
  exports.Directive = ElementType2.Directive;
  exports.Comment = ElementType2.Comment;
  exports.Script = ElementType2.Script;
  exports.Style = ElementType2.Style;
  exports.Tag = ElementType2.Tag;
  exports.CDATA = ElementType2.CDATA;
  exports.Doctype = ElementType2.Doctype;
})(lib$4);
var node = {};
var __extends$2 = commonjsGlobal && commonjsGlobal.__extends || function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p2 in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p2))
          d2[p2] = b2[p2];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __assign$2 = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$2 = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p2 in s)
        if (Object.prototype.hasOwnProperty.call(s, p2))
          t[p2] = s[p2];
    }
    return t;
  };
  return __assign$2.apply(this, arguments);
};
Object.defineProperty(node, "__esModule", { value: true });
node.cloneNode = node.hasChildren = node.isDocument = node.isDirective = node.isComment = node.isText = node.isCDATA = node.isTag = node.Element = node.Document = node.NodeWithChildren = node.ProcessingInstruction = node.Comment = node.Text = node.DataNode = node.Node = void 0;
var domelementtype_1$1 = lib$4;
var nodeTypes = new Map([
  [domelementtype_1$1.ElementType.Tag, 1],
  [domelementtype_1$1.ElementType.Script, 1],
  [domelementtype_1$1.ElementType.Style, 1],
  [domelementtype_1$1.ElementType.Directive, 1],
  [domelementtype_1$1.ElementType.Text, 3],
  [domelementtype_1$1.ElementType.CDATA, 4],
  [domelementtype_1$1.ElementType.Comment, 8],
  [domelementtype_1$1.ElementType.Root, 9]
]);
var Node$1 = function() {
  function Node2(type2) {
    this.type = type2;
    this.parent = null;
    this.prev = null;
    this.next = null;
    this.startIndex = null;
    this.endIndex = null;
  }
  Object.defineProperty(Node2.prototype, "nodeType", {
    get: function() {
      var _a;
      return (_a = nodeTypes.get(this.type)) !== null && _a !== void 0 ? _a : 1;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Node2.prototype, "parentNode", {
    get: function() {
      return this.parent;
    },
    set: function(parent) {
      this.parent = parent;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Node2.prototype, "previousSibling", {
    get: function() {
      return this.prev;
    },
    set: function(prev) {
      this.prev = prev;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Node2.prototype, "nextSibling", {
    get: function() {
      return this.next;
    },
    set: function(next) {
      this.next = next;
    },
    enumerable: false,
    configurable: true
  });
  Node2.prototype.cloneNode = function(recursive) {
    if (recursive === void 0) {
      recursive = false;
    }
    return cloneNode(this, recursive);
  };
  return Node2;
}();
node.Node = Node$1;
var DataNode = function(_super) {
  __extends$2(DataNode2, _super);
  function DataNode2(type2, data) {
    var _this = _super.call(this, type2) || this;
    _this.data = data;
    return _this;
  }
  Object.defineProperty(DataNode2.prototype, "nodeValue", {
    get: function() {
      return this.data;
    },
    set: function(data) {
      this.data = data;
    },
    enumerable: false,
    configurable: true
  });
  return DataNode2;
}(Node$1);
node.DataNode = DataNode;
var Text = function(_super) {
  __extends$2(Text2, _super);
  function Text2(data) {
    return _super.call(this, domelementtype_1$1.ElementType.Text, data) || this;
  }
  return Text2;
}(DataNode);
node.Text = Text;
var Comment = function(_super) {
  __extends$2(Comment2, _super);
  function Comment2(data) {
    return _super.call(this, domelementtype_1$1.ElementType.Comment, data) || this;
  }
  return Comment2;
}(DataNode);
node.Comment = Comment;
var ProcessingInstruction = function(_super) {
  __extends$2(ProcessingInstruction2, _super);
  function ProcessingInstruction2(name, data) {
    var _this = _super.call(this, domelementtype_1$1.ElementType.Directive, data) || this;
    _this.name = name;
    return _this;
  }
  return ProcessingInstruction2;
}(DataNode);
node.ProcessingInstruction = ProcessingInstruction;
var NodeWithChildren = function(_super) {
  __extends$2(NodeWithChildren2, _super);
  function NodeWithChildren2(type2, children) {
    var _this = _super.call(this, type2) || this;
    _this.children = children;
    return _this;
  }
  Object.defineProperty(NodeWithChildren2.prototype, "firstChild", {
    get: function() {
      var _a;
      return (_a = this.children[0]) !== null && _a !== void 0 ? _a : null;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(NodeWithChildren2.prototype, "lastChild", {
    get: function() {
      return this.children.length > 0 ? this.children[this.children.length - 1] : null;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(NodeWithChildren2.prototype, "childNodes", {
    get: function() {
      return this.children;
    },
    set: function(children) {
      this.children = children;
    },
    enumerable: false,
    configurable: true
  });
  return NodeWithChildren2;
}(Node$1);
node.NodeWithChildren = NodeWithChildren;
var Document = function(_super) {
  __extends$2(Document2, _super);
  function Document2(children) {
    return _super.call(this, domelementtype_1$1.ElementType.Root, children) || this;
  }
  return Document2;
}(NodeWithChildren);
node.Document = Document;
var Element$2 = function(_super) {
  __extends$2(Element2, _super);
  function Element2(name, attribs, children, type2) {
    if (children === void 0) {
      children = [];
    }
    if (type2 === void 0) {
      type2 = name === "script" ? domelementtype_1$1.ElementType.Script : name === "style" ? domelementtype_1$1.ElementType.Style : domelementtype_1$1.ElementType.Tag;
    }
    var _this = _super.call(this, type2, children) || this;
    _this.name = name;
    _this.attribs = attribs;
    return _this;
  }
  Object.defineProperty(Element2.prototype, "tagName", {
    get: function() {
      return this.name;
    },
    set: function(name) {
      this.name = name;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(Element2.prototype, "attributes", {
    get: function() {
      var _this = this;
      return Object.keys(this.attribs).map(function(name) {
        var _a, _b;
        return {
          name,
          value: _this.attribs[name],
          namespace: (_a = _this["x-attribsNamespace"]) === null || _a === void 0 ? void 0 : _a[name],
          prefix: (_b = _this["x-attribsPrefix"]) === null || _b === void 0 ? void 0 : _b[name]
        };
      });
    },
    enumerable: false,
    configurable: true
  });
  return Element2;
}(NodeWithChildren);
node.Element = Element$2;
function isTag$1(node2) {
  return (0, domelementtype_1$1.isTag)(node2);
}
node.isTag = isTag$1;
function isCDATA(node2) {
  return node2.type === domelementtype_1$1.ElementType.CDATA;
}
node.isCDATA = isCDATA;
function isText(node2) {
  return node2.type === domelementtype_1$1.ElementType.Text;
}
node.isText = isText;
function isComment(node2) {
  return node2.type === domelementtype_1$1.ElementType.Comment;
}
node.isComment = isComment;
function isDirective(node2) {
  return node2.type === domelementtype_1$1.ElementType.Directive;
}
node.isDirective = isDirective;
function isDocument(node2) {
  return node2.type === domelementtype_1$1.ElementType.Root;
}
node.isDocument = isDocument;
function hasChildren(node2) {
  return Object.prototype.hasOwnProperty.call(node2, "children");
}
node.hasChildren = hasChildren;
function cloneNode(node2, recursive) {
  if (recursive === void 0) {
    recursive = false;
  }
  var result;
  if (isText(node2)) {
    result = new Text(node2.data);
  } else if (isComment(node2)) {
    result = new Comment(node2.data);
  } else if (isTag$1(node2)) {
    var children = recursive ? cloneChildren(node2.children) : [];
    var clone_1 = new Element$2(node2.name, __assign$2({}, node2.attribs), children);
    children.forEach(function(child) {
      return child.parent = clone_1;
    });
    if (node2.namespace != null) {
      clone_1.namespace = node2.namespace;
    }
    if (node2["x-attribsNamespace"]) {
      clone_1["x-attribsNamespace"] = __assign$2({}, node2["x-attribsNamespace"]);
    }
    if (node2["x-attribsPrefix"]) {
      clone_1["x-attribsPrefix"] = __assign$2({}, node2["x-attribsPrefix"]);
    }
    result = clone_1;
  } else if (isCDATA(node2)) {
    var children = recursive ? cloneChildren(node2.children) : [];
    var clone_2 = new NodeWithChildren(domelementtype_1$1.ElementType.CDATA, children);
    children.forEach(function(child) {
      return child.parent = clone_2;
    });
    result = clone_2;
  } else if (isDocument(node2)) {
    var children = recursive ? cloneChildren(node2.children) : [];
    var clone_3 = new Document(children);
    children.forEach(function(child) {
      return child.parent = clone_3;
    });
    if (node2["x-mode"]) {
      clone_3["x-mode"] = node2["x-mode"];
    }
    result = clone_3;
  } else if (isDirective(node2)) {
    var instruction = new ProcessingInstruction(node2.name, node2.data);
    if (node2["x-name"] != null) {
      instruction["x-name"] = node2["x-name"];
      instruction["x-publicId"] = node2["x-publicId"];
      instruction["x-systemId"] = node2["x-systemId"];
    }
    result = instruction;
  } else {
    throw new Error("Not implemented yet: ".concat(node2.type));
  }
  result.startIndex = node2.startIndex;
  result.endIndex = node2.endIndex;
  if (node2.sourceCodeLocation != null) {
    result.sourceCodeLocation = node2.sourceCodeLocation;
  }
  return result;
}
node.cloneNode = cloneNode;
function cloneChildren(childs) {
  var children = childs.map(function(child) {
    return cloneNode(child, true);
  });
  for (var i = 1; i < children.length; i++) {
    children[i].prev = children[i - 1];
    children[i - 1].next = children[i];
  }
  return children;
}
(function(exports) {
  var __createBinding2 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() {
      return m[k];
    } });
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports2) {
    for (var p2 in m)
      if (p2 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p2))
        __createBinding2(exports2, m, p2);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.DomHandler = void 0;
  var domelementtype_12 = lib$4;
  var node_12 = node;
  __exportStar(node, exports);
  var reWhitespace = /\s+/g;
  var defaultOpts = {
    normalizeWhitespace: false,
    withStartIndices: false,
    withEndIndices: false,
    xmlMode: false
  };
  var DomHandler = function() {
    function DomHandler2(callback, options, elementCB) {
      this.dom = [];
      this.root = new node_12.Document(this.dom);
      this.done = false;
      this.tagStack = [this.root];
      this.lastNode = null;
      this.parser = null;
      if (typeof options === "function") {
        elementCB = options;
        options = defaultOpts;
      }
      if (typeof callback === "object") {
        options = callback;
        callback = void 0;
      }
      this.callback = callback !== null && callback !== void 0 ? callback : null;
      this.options = options !== null && options !== void 0 ? options : defaultOpts;
      this.elementCB = elementCB !== null && elementCB !== void 0 ? elementCB : null;
    }
    DomHandler2.prototype.onparserinit = function(parser) {
      this.parser = parser;
    };
    DomHandler2.prototype.onreset = function() {
      this.dom = [];
      this.root = new node_12.Document(this.dom);
      this.done = false;
      this.tagStack = [this.root];
      this.lastNode = null;
      this.parser = null;
    };
    DomHandler2.prototype.onend = function() {
      if (this.done)
        return;
      this.done = true;
      this.parser = null;
      this.handleCallback(null);
    };
    DomHandler2.prototype.onerror = function(error) {
      this.handleCallback(error);
    };
    DomHandler2.prototype.onclosetag = function() {
      this.lastNode = null;
      var elem = this.tagStack.pop();
      if (this.options.withEndIndices) {
        elem.endIndex = this.parser.endIndex;
      }
      if (this.elementCB)
        this.elementCB(elem);
    };
    DomHandler2.prototype.onopentag = function(name, attribs) {
      var type2 = this.options.xmlMode ? domelementtype_12.ElementType.Tag : void 0;
      var element = new node_12.Element(name, attribs, void 0, type2);
      this.addNode(element);
      this.tagStack.push(element);
    };
    DomHandler2.prototype.ontext = function(data) {
      var normalizeWhitespace = this.options.normalizeWhitespace;
      var lastNode = this.lastNode;
      if (lastNode && lastNode.type === domelementtype_12.ElementType.Text) {
        if (normalizeWhitespace) {
          lastNode.data = (lastNode.data + data).replace(reWhitespace, " ");
        } else {
          lastNode.data += data;
        }
        if (this.options.withEndIndices) {
          lastNode.endIndex = this.parser.endIndex;
        }
      } else {
        if (normalizeWhitespace) {
          data = data.replace(reWhitespace, " ");
        }
        var node2 = new node_12.Text(data);
        this.addNode(node2);
        this.lastNode = node2;
      }
    };
    DomHandler2.prototype.oncomment = function(data) {
      if (this.lastNode && this.lastNode.type === domelementtype_12.ElementType.Comment) {
        this.lastNode.data += data;
        return;
      }
      var node2 = new node_12.Comment(data);
      this.addNode(node2);
      this.lastNode = node2;
    };
    DomHandler2.prototype.oncommentend = function() {
      this.lastNode = null;
    };
    DomHandler2.prototype.oncdatastart = function() {
      var text2 = new node_12.Text("");
      var node2 = new node_12.NodeWithChildren(domelementtype_12.ElementType.CDATA, [text2]);
      this.addNode(node2);
      text2.parent = node2;
      this.lastNode = text2;
    };
    DomHandler2.prototype.oncdataend = function() {
      this.lastNode = null;
    };
    DomHandler2.prototype.onprocessinginstruction = function(name, data) {
      var node2 = new node_12.ProcessingInstruction(name, data);
      this.addNode(node2);
    };
    DomHandler2.prototype.handleCallback = function(error) {
      if (typeof this.callback === "function") {
        this.callback(error, this.dom);
      } else if (error) {
        throw error;
      }
    };
    DomHandler2.prototype.addNode = function(node2) {
      var parent = this.tagStack[this.tagStack.length - 1];
      var previousSibling = parent.children[parent.children.length - 1];
      if (this.options.withStartIndices) {
        node2.startIndex = this.parser.startIndex;
      }
      if (this.options.withEndIndices) {
        node2.endIndex = this.parser.endIndex;
      }
      parent.children.push(node2);
      if (previousSibling) {
        node2.prev = previousSibling;
        previousSibling.next = node2;
      }
      node2.parent = parent;
      this.lastNode = null;
    };
    return DomHandler2;
  }();
  exports.DomHandler = DomHandler;
  exports.default = DomHandler;
})(lib$5);
var lib$3 = {};
var lib$2 = {};
var decode$1 = {};
const Aacute$1 = "\xC1";
const aacute$1 = "\xE1";
const Abreve = "\u0102";
const abreve = "\u0103";
const ac = "\u223E";
const acd = "\u223F";
const acE = "\u223E\u0333";
const Acirc$1 = "\xC2";
const acirc$1 = "\xE2";
const acute$1 = "\xB4";
const Acy = "\u0410";
const acy = "\u0430";
const AElig$1 = "\xC6";
const aelig$1 = "\xE6";
const af = "\u2061";
const Afr = "\u{1D504}";
const afr = "\u{1D51E}";
const Agrave$1 = "\xC0";
const agrave$1 = "\xE0";
const alefsym = "\u2135";
const aleph = "\u2135";
const Alpha = "\u0391";
const alpha$2 = "\u03B1";
const Amacr = "\u0100";
const amacr = "\u0101";
const amalg = "\u2A3F";
const amp$2 = "&";
const AMP$1 = "&";
const andand = "\u2A55";
const And = "\u2A53";
const and = "\u2227";
const andd = "\u2A5C";
const andslope = "\u2A58";
const andv = "\u2A5A";
const ang = "\u2220";
const ange = "\u29A4";
const angle = "\u2220";
const angmsdaa = "\u29A8";
const angmsdab = "\u29A9";
const angmsdac = "\u29AA";
const angmsdad = "\u29AB";
const angmsdae = "\u29AC";
const angmsdaf = "\u29AD";
const angmsdag = "\u29AE";
const angmsdah = "\u29AF";
const angmsd = "\u2221";
const angrt = "\u221F";
const angrtvb = "\u22BE";
const angrtvbd = "\u299D";
const angsph = "\u2222";
const angst = "\xC5";
const angzarr = "\u237C";
const Aogon = "\u0104";
const aogon = "\u0105";
const Aopf = "\u{1D538}";
const aopf = "\u{1D552}";
const apacir = "\u2A6F";
const ap = "\u2248";
const apE = "\u2A70";
const ape = "\u224A";
const apid = "\u224B";
const apos$1 = "'";
const ApplyFunction = "\u2061";
const approx = "\u2248";
const approxeq = "\u224A";
const Aring$1 = "\xC5";
const aring$1 = "\xE5";
const Ascr = "\u{1D49C}";
const ascr = "\u{1D4B6}";
const Assign = "\u2254";
const ast = "*";
const asymp = "\u2248";
const asympeq = "\u224D";
const Atilde$1 = "\xC3";
const atilde$1 = "\xE3";
const Auml$1 = "\xC4";
const auml$1 = "\xE4";
const awconint = "\u2233";
const awint = "\u2A11";
const backcong = "\u224C";
const backepsilon = "\u03F6";
const backprime = "\u2035";
const backsim = "\u223D";
const backsimeq = "\u22CD";
const Backslash = "\u2216";
const Barv = "\u2AE7";
const barvee = "\u22BD";
const barwed = "\u2305";
const Barwed = "\u2306";
const barwedge = "\u2305";
const bbrk = "\u23B5";
const bbrktbrk = "\u23B6";
const bcong = "\u224C";
const Bcy = "\u0411";
const bcy = "\u0431";
const bdquo = "\u201E";
const becaus = "\u2235";
const because = "\u2235";
const Because = "\u2235";
const bemptyv = "\u29B0";
const bepsi = "\u03F6";
const bernou = "\u212C";
const Bernoullis = "\u212C";
const Beta = "\u0392";
const beta = "\u03B2";
const beth = "\u2136";
const between = "\u226C";
const Bfr = "\u{1D505}";
const bfr = "\u{1D51F}";
const bigcap = "\u22C2";
const bigcirc = "\u25EF";
const bigcup = "\u22C3";
const bigodot = "\u2A00";
const bigoplus = "\u2A01";
const bigotimes = "\u2A02";
const bigsqcup = "\u2A06";
const bigstar = "\u2605";
const bigtriangledown = "\u25BD";
const bigtriangleup = "\u25B3";
const biguplus = "\u2A04";
const bigvee = "\u22C1";
const bigwedge = "\u22C0";
const bkarow = "\u290D";
const blacklozenge = "\u29EB";
const blacksquare = "\u25AA";
const blacktriangle = "\u25B4";
const blacktriangledown = "\u25BE";
const blacktriangleleft = "\u25C2";
const blacktriangleright = "\u25B8";
const blank = "\u2423";
const blk12 = "\u2592";
const blk14 = "\u2591";
const blk34 = "\u2593";
const block = "\u2588";
const bne = "=\u20E5";
const bnequiv = "\u2261\u20E5";
const bNot = "\u2AED";
const bnot = "\u2310";
const Bopf = "\u{1D539}";
const bopf = "\u{1D553}";
const bot = "\u22A5";
const bottom$1 = "\u22A5";
const bowtie = "\u22C8";
const boxbox = "\u29C9";
const boxdl = "\u2510";
const boxdL = "\u2555";
const boxDl = "\u2556";
const boxDL = "\u2557";
const boxdr = "\u250C";
const boxdR = "\u2552";
const boxDr = "\u2553";
const boxDR = "\u2554";
const boxh = "\u2500";
const boxH = "\u2550";
const boxhd = "\u252C";
const boxHd = "\u2564";
const boxhD = "\u2565";
const boxHD = "\u2566";
const boxhu = "\u2534";
const boxHu = "\u2567";
const boxhU = "\u2568";
const boxHU = "\u2569";
const boxminus = "\u229F";
const boxplus = "\u229E";
const boxtimes = "\u22A0";
const boxul = "\u2518";
const boxuL = "\u255B";
const boxUl = "\u255C";
const boxUL = "\u255D";
const boxur = "\u2514";
const boxuR = "\u2558";
const boxUr = "\u2559";
const boxUR = "\u255A";
const boxv = "\u2502";
const boxV = "\u2551";
const boxvh = "\u253C";
const boxvH = "\u256A";
const boxVh = "\u256B";
const boxVH = "\u256C";
const boxvl = "\u2524";
const boxvL = "\u2561";
const boxVl = "\u2562";
const boxVL = "\u2563";
const boxvr = "\u251C";
const boxvR = "\u255E";
const boxVr = "\u255F";
const boxVR = "\u2560";
const bprime = "\u2035";
const breve = "\u02D8";
const Breve = "\u02D8";
const brvbar$1 = "\xA6";
const bscr = "\u{1D4B7}";
const Bscr = "\u212C";
const bsemi = "\u204F";
const bsim = "\u223D";
const bsime = "\u22CD";
const bsolb = "\u29C5";
const bsol = "\\";
const bsolhsub = "\u27C8";
const bull = "\u2022";
const bullet = "\u2022";
const bump = "\u224E";
const bumpE = "\u2AAE";
const bumpe = "\u224F";
const Bumpeq = "\u224E";
const bumpeq = "\u224F";
const Cacute = "\u0106";
const cacute = "\u0107";
const capand = "\u2A44";
const capbrcup = "\u2A49";
const capcap = "\u2A4B";
const cap = "\u2229";
const Cap = "\u22D2";
const capcup = "\u2A47";
const capdot = "\u2A40";
const CapitalDifferentialD = "\u2145";
const caps = "\u2229\uFE00";
const caret = "\u2041";
const caron = "\u02C7";
const Cayleys = "\u212D";
const ccaps = "\u2A4D";
const Ccaron = "\u010C";
const ccaron = "\u010D";
const Ccedil$1 = "\xC7";
const ccedil$1 = "\xE7";
const Ccirc = "\u0108";
const ccirc = "\u0109";
const Cconint = "\u2230";
const ccups = "\u2A4C";
const ccupssm = "\u2A50";
const Cdot = "\u010A";
const cdot = "\u010B";
const cedil$1 = "\xB8";
const Cedilla = "\xB8";
const cemptyv = "\u29B2";
const cent$1 = "\xA2";
const centerdot = "\xB7";
const CenterDot = "\xB7";
const cfr = "\u{1D520}";
const Cfr = "\u212D";
const CHcy = "\u0427";
const chcy = "\u0447";
const check = "\u2713";
const checkmark = "\u2713";
const Chi = "\u03A7";
const chi = "\u03C7";
const circ = "\u02C6";
const circeq = "\u2257";
const circlearrowleft = "\u21BA";
const circlearrowright = "\u21BB";
const circledast = "\u229B";
const circledcirc = "\u229A";
const circleddash = "\u229D";
const CircleDot = "\u2299";
const circledR = "\xAE";
const circledS = "\u24C8";
const CircleMinus = "\u2296";
const CirclePlus = "\u2295";
const CircleTimes = "\u2297";
const cir = "\u25CB";
const cirE = "\u29C3";
const cire = "\u2257";
const cirfnint = "\u2A10";
const cirmid = "\u2AEF";
const cirscir = "\u29C2";
const ClockwiseContourIntegral = "\u2232";
const CloseCurlyDoubleQuote = "\u201D";
const CloseCurlyQuote = "\u2019";
const clubs = "\u2663";
const clubsuit = "\u2663";
const colon = ":";
const Colon = "\u2237";
const Colone = "\u2A74";
const colone = "\u2254";
const coloneq = "\u2254";
const comma = ",";
const commat = "@";
const comp = "\u2201";
const compfn = "\u2218";
const complement = "\u2201";
const complexes = "\u2102";
const cong = "\u2245";
const congdot = "\u2A6D";
const Congruent = "\u2261";
const conint = "\u222E";
const Conint = "\u222F";
const ContourIntegral = "\u222E";
const copf = "\u{1D554}";
const Copf = "\u2102";
const coprod = "\u2210";
const Coproduct = "\u2210";
const copy$1 = "\xA9";
const COPY$1 = "\xA9";
const copysr = "\u2117";
const CounterClockwiseContourIntegral = "\u2233";
const crarr = "\u21B5";
const cross = "\u2717";
const Cross = "\u2A2F";
const Cscr = "\u{1D49E}";
const cscr = "\u{1D4B8}";
const csub = "\u2ACF";
const csube = "\u2AD1";
const csup = "\u2AD0";
const csupe = "\u2AD2";
const ctdot = "\u22EF";
const cudarrl = "\u2938";
const cudarrr = "\u2935";
const cuepr = "\u22DE";
const cuesc = "\u22DF";
const cularr = "\u21B6";
const cularrp = "\u293D";
const cupbrcap = "\u2A48";
const cupcap = "\u2A46";
const CupCap = "\u224D";
const cup = "\u222A";
const Cup = "\u22D3";
const cupcup = "\u2A4A";
const cupdot = "\u228D";
const cupor = "\u2A45";
const cups = "\u222A\uFE00";
const curarr = "\u21B7";
const curarrm = "\u293C";
const curlyeqprec = "\u22DE";
const curlyeqsucc = "\u22DF";
const curlyvee = "\u22CE";
const curlywedge = "\u22CF";
const curren$1 = "\xA4";
const curvearrowleft = "\u21B6";
const curvearrowright = "\u21B7";
const cuvee = "\u22CE";
const cuwed = "\u22CF";
const cwconint = "\u2232";
const cwint = "\u2231";
const cylcty = "\u232D";
const dagger = "\u2020";
const Dagger = "\u2021";
const daleth = "\u2138";
const darr = "\u2193";
const Darr = "\u21A1";
const dArr = "\u21D3";
const dash = "\u2010";
const Dashv = "\u2AE4";
const dashv = "\u22A3";
const dbkarow = "\u290F";
const dblac = "\u02DD";
const Dcaron = "\u010E";
const dcaron = "\u010F";
const Dcy = "\u0414";
const dcy = "\u0434";
const ddagger = "\u2021";
const ddarr = "\u21CA";
const DD = "\u2145";
const dd = "\u2146";
const DDotrahd = "\u2911";
const ddotseq = "\u2A77";
const deg$1 = "\xB0";
const Del = "\u2207";
const Delta = "\u0394";
const delta = "\u03B4";
const demptyv = "\u29B1";
const dfisht = "\u297F";
const Dfr = "\u{1D507}";
const dfr = "\u{1D521}";
const dHar = "\u2965";
const dharl = "\u21C3";
const dharr = "\u21C2";
const DiacriticalAcute = "\xB4";
const DiacriticalDot = "\u02D9";
const DiacriticalDoubleAcute = "\u02DD";
const DiacriticalGrave = "`";
const DiacriticalTilde = "\u02DC";
const diam = "\u22C4";
const diamond = "\u22C4";
const Diamond = "\u22C4";
const diamondsuit = "\u2666";
const diams = "\u2666";
const die = "\xA8";
const DifferentialD = "\u2146";
const digamma = "\u03DD";
const disin = "\u22F2";
const div = "\xF7";
const divide$1 = "\xF7";
const divideontimes = "\u22C7";
const divonx = "\u22C7";
const DJcy = "\u0402";
const djcy = "\u0452";
const dlcorn = "\u231E";
const dlcrop = "\u230D";
const dollar = "$";
const Dopf = "\u{1D53B}";
const dopf = "\u{1D555}";
const Dot = "\xA8";
const dot = "\u02D9";
const DotDot = "\u20DC";
const doteq = "\u2250";
const doteqdot = "\u2251";
const DotEqual = "\u2250";
const dotminus = "\u2238";
const dotplus = "\u2214";
const dotsquare = "\u22A1";
const doublebarwedge = "\u2306";
const DoubleContourIntegral = "\u222F";
const DoubleDot = "\xA8";
const DoubleDownArrow = "\u21D3";
const DoubleLeftArrow = "\u21D0";
const DoubleLeftRightArrow = "\u21D4";
const DoubleLeftTee = "\u2AE4";
const DoubleLongLeftArrow = "\u27F8";
const DoubleLongLeftRightArrow = "\u27FA";
const DoubleLongRightArrow = "\u27F9";
const DoubleRightArrow = "\u21D2";
const DoubleRightTee = "\u22A8";
const DoubleUpArrow = "\u21D1";
const DoubleUpDownArrow = "\u21D5";
const DoubleVerticalBar = "\u2225";
const DownArrowBar = "\u2913";
const downarrow = "\u2193";
const DownArrow = "\u2193";
const Downarrow = "\u21D3";
const DownArrowUpArrow = "\u21F5";
const DownBreve = "\u0311";
const downdownarrows = "\u21CA";
const downharpoonleft = "\u21C3";
const downharpoonright = "\u21C2";
const DownLeftRightVector = "\u2950";
const DownLeftTeeVector = "\u295E";
const DownLeftVectorBar = "\u2956";
const DownLeftVector = "\u21BD";
const DownRightTeeVector = "\u295F";
const DownRightVectorBar = "\u2957";
const DownRightVector = "\u21C1";
const DownTeeArrow = "\u21A7";
const DownTee = "\u22A4";
const drbkarow = "\u2910";
const drcorn = "\u231F";
const drcrop = "\u230C";
const Dscr = "\u{1D49F}";
const dscr = "\u{1D4B9}";
const DScy = "\u0405";
const dscy = "\u0455";
const dsol = "\u29F6";
const Dstrok = "\u0110";
const dstrok = "\u0111";
const dtdot = "\u22F1";
const dtri = "\u25BF";
const dtrif = "\u25BE";
const duarr = "\u21F5";
const duhar = "\u296F";
const dwangle = "\u29A6";
const DZcy = "\u040F";
const dzcy = "\u045F";
const dzigrarr = "\u27FF";
const Eacute$1 = "\xC9";
const eacute$1 = "\xE9";
const easter = "\u2A6E";
const Ecaron = "\u011A";
const ecaron = "\u011B";
const Ecirc$1 = "\xCA";
const ecirc$1 = "\xEA";
const ecir = "\u2256";
const ecolon = "\u2255";
const Ecy = "\u042D";
const ecy = "\u044D";
const eDDot = "\u2A77";
const Edot = "\u0116";
const edot = "\u0117";
const eDot = "\u2251";
const ee = "\u2147";
const efDot = "\u2252";
const Efr = "\u{1D508}";
const efr = "\u{1D522}";
const eg = "\u2A9A";
const Egrave$1 = "\xC8";
const egrave$1 = "\xE8";
const egs = "\u2A96";
const egsdot = "\u2A98";
const el = "\u2A99";
const Element$1 = "\u2208";
const elinters = "\u23E7";
const ell = "\u2113";
const els = "\u2A95";
const elsdot = "\u2A97";
const Emacr = "\u0112";
const emacr = "\u0113";
const empty = "\u2205";
const emptyset = "\u2205";
const EmptySmallSquare = "\u25FB";
const emptyv = "\u2205";
const EmptyVerySmallSquare = "\u25AB";
const emsp13 = "\u2004";
const emsp14 = "\u2005";
const emsp = "\u2003";
const ENG = "\u014A";
const eng = "\u014B";
const ensp = "\u2002";
const Eogon = "\u0118";
const eogon = "\u0119";
const Eopf = "\u{1D53C}";
const eopf = "\u{1D556}";
const epar = "\u22D5";
const eparsl = "\u29E3";
const eplus = "\u2A71";
const epsi = "\u03B5";
const Epsilon = "\u0395";
const epsilon = "\u03B5";
const epsiv = "\u03F5";
const eqcirc = "\u2256";
const eqcolon = "\u2255";
const eqsim = "\u2242";
const eqslantgtr = "\u2A96";
const eqslantless = "\u2A95";
const Equal = "\u2A75";
const equals = "=";
const EqualTilde = "\u2242";
const equest = "\u225F";
const Equilibrium = "\u21CC";
const equiv = "\u2261";
const equivDD = "\u2A78";
const eqvparsl = "\u29E5";
const erarr = "\u2971";
const erDot = "\u2253";
const escr = "\u212F";
const Escr = "\u2130";
const esdot = "\u2250";
const Esim = "\u2A73";
const esim = "\u2242";
const Eta = "\u0397";
const eta = "\u03B7";
const ETH$1 = "\xD0";
const eth$1 = "\xF0";
const Euml$1 = "\xCB";
const euml$1 = "\xEB";
const euro = "\u20AC";
const excl = "!";
const exist = "\u2203";
const Exists = "\u2203";
const expectation = "\u2130";
const exponentiale = "\u2147";
const ExponentialE = "\u2147";
const fallingdotseq = "\u2252";
const Fcy = "\u0424";
const fcy = "\u0444";
const female = "\u2640";
const ffilig = "\uFB03";
const fflig = "\uFB00";
const ffllig = "\uFB04";
const Ffr = "\u{1D509}";
const ffr = "\u{1D523}";
const filig = "\uFB01";
const FilledSmallSquare = "\u25FC";
const FilledVerySmallSquare = "\u25AA";
const fjlig = "fj";
const flat = "\u266D";
const fllig = "\uFB02";
const fltns = "\u25B1";
const fnof = "\u0192";
const Fopf = "\u{1D53D}";
const fopf = "\u{1D557}";
const forall = "\u2200";
const ForAll = "\u2200";
const fork = "\u22D4";
const forkv = "\u2AD9";
const Fouriertrf = "\u2131";
const fpartint = "\u2A0D";
const frac12$1 = "\xBD";
const frac13 = "\u2153";
const frac14$1 = "\xBC";
const frac15 = "\u2155";
const frac16 = "\u2159";
const frac18 = "\u215B";
const frac23 = "\u2154";
const frac25 = "\u2156";
const frac34$1 = "\xBE";
const frac35 = "\u2157";
const frac38 = "\u215C";
const frac45 = "\u2158";
const frac56 = "\u215A";
const frac58 = "\u215D";
const frac78 = "\u215E";
const frasl = "\u2044";
const frown = "\u2322";
const fscr = "\u{1D4BB}";
const Fscr = "\u2131";
const gacute = "\u01F5";
const Gamma = "\u0393";
const gamma = "\u03B3";
const Gammad = "\u03DC";
const gammad = "\u03DD";
const gap = "\u2A86";
const Gbreve = "\u011E";
const gbreve = "\u011F";
const Gcedil = "\u0122";
const Gcirc = "\u011C";
const gcirc = "\u011D";
const Gcy = "\u0413";
const gcy = "\u0433";
const Gdot = "\u0120";
const gdot = "\u0121";
const ge = "\u2265";
const gE = "\u2267";
const gEl = "\u2A8C";
const gel = "\u22DB";
const geq = "\u2265";
const geqq = "\u2267";
const geqslant = "\u2A7E";
const gescc = "\u2AA9";
const ges = "\u2A7E";
const gesdot = "\u2A80";
const gesdoto = "\u2A82";
const gesdotol = "\u2A84";
const gesl = "\u22DB\uFE00";
const gesles = "\u2A94";
const Gfr = "\u{1D50A}";
const gfr = "\u{1D524}";
const gg = "\u226B";
const Gg = "\u22D9";
const ggg = "\u22D9";
const gimel = "\u2137";
const GJcy = "\u0403";
const gjcy = "\u0453";
const gla = "\u2AA5";
const gl = "\u2277";
const glE = "\u2A92";
const glj = "\u2AA4";
const gnap = "\u2A8A";
const gnapprox = "\u2A8A";
const gne = "\u2A88";
const gnE = "\u2269";
const gneq = "\u2A88";
const gneqq = "\u2269";
const gnsim = "\u22E7";
const Gopf = "\u{1D53E}";
const gopf = "\u{1D558}";
const grave = "`";
const GreaterEqual = "\u2265";
const GreaterEqualLess = "\u22DB";
const GreaterFullEqual = "\u2267";
const GreaterGreater = "\u2AA2";
const GreaterLess = "\u2277";
const GreaterSlantEqual = "\u2A7E";
const GreaterTilde = "\u2273";
const Gscr = "\u{1D4A2}";
const gscr = "\u210A";
const gsim = "\u2273";
const gsime = "\u2A8E";
const gsiml = "\u2A90";
const gtcc = "\u2AA7";
const gtcir = "\u2A7A";
const gt$2 = ">";
const GT$1 = ">";
const Gt = "\u226B";
const gtdot = "\u22D7";
const gtlPar = "\u2995";
const gtquest = "\u2A7C";
const gtrapprox = "\u2A86";
const gtrarr = "\u2978";
const gtrdot = "\u22D7";
const gtreqless = "\u22DB";
const gtreqqless = "\u2A8C";
const gtrless = "\u2277";
const gtrsim = "\u2273";
const gvertneqq = "\u2269\uFE00";
const gvnE = "\u2269\uFE00";
const Hacek = "\u02C7";
const hairsp = "\u200A";
const half = "\xBD";
const hamilt = "\u210B";
const HARDcy = "\u042A";
const hardcy = "\u044A";
const harrcir = "\u2948";
const harr = "\u2194";
const hArr = "\u21D4";
const harrw = "\u21AD";
const Hat = "^";
const hbar = "\u210F";
const Hcirc = "\u0124";
const hcirc = "\u0125";
const hearts = "\u2665";
const heartsuit = "\u2665";
const hellip = "\u2026";
const hercon = "\u22B9";
const hfr = "\u{1D525}";
const Hfr = "\u210C";
const HilbertSpace = "\u210B";
const hksearow = "\u2925";
const hkswarow = "\u2926";
const hoarr = "\u21FF";
const homtht = "\u223B";
const hookleftarrow = "\u21A9";
const hookrightarrow = "\u21AA";
const hopf = "\u{1D559}";
const Hopf = "\u210D";
const horbar = "\u2015";
const HorizontalLine = "\u2500";
const hscr = "\u{1D4BD}";
const Hscr = "\u210B";
const hslash = "\u210F";
const Hstrok = "\u0126";
const hstrok = "\u0127";
const HumpDownHump = "\u224E";
const HumpEqual = "\u224F";
const hybull = "\u2043";
const hyphen = "\u2010";
const Iacute$1 = "\xCD";
const iacute$1 = "\xED";
const ic = "\u2063";
const Icirc$1 = "\xCE";
const icirc$1 = "\xEE";
const Icy = "\u0418";
const icy = "\u0438";
const Idot = "\u0130";
const IEcy = "\u0415";
const iecy = "\u0435";
const iexcl$1 = "\xA1";
const iff = "\u21D4";
const ifr = "\u{1D526}";
const Ifr = "\u2111";
const Igrave$1 = "\xCC";
const igrave$1 = "\xEC";
const ii = "\u2148";
const iiiint = "\u2A0C";
const iiint = "\u222D";
const iinfin = "\u29DC";
const iiota = "\u2129";
const IJlig = "\u0132";
const ijlig = "\u0133";
const Imacr = "\u012A";
const imacr = "\u012B";
const image = "\u2111";
const ImaginaryI = "\u2148";
const imagline = "\u2110";
const imagpart = "\u2111";
const imath = "\u0131";
const Im = "\u2111";
const imof = "\u22B7";
const imped = "\u01B5";
const Implies = "\u21D2";
const incare = "\u2105";
const infin = "\u221E";
const infintie = "\u29DD";
const inodot = "\u0131";
const intcal = "\u22BA";
const int = "\u222B";
const Int = "\u222C";
const integers = "\u2124";
const Integral = "\u222B";
const intercal = "\u22BA";
const Intersection = "\u22C2";
const intlarhk = "\u2A17";
const intprod = "\u2A3C";
const InvisibleComma = "\u2063";
const InvisibleTimes = "\u2062";
const IOcy = "\u0401";
const iocy = "\u0451";
const Iogon = "\u012E";
const iogon = "\u012F";
const Iopf = "\u{1D540}";
const iopf = "\u{1D55A}";
const Iota = "\u0399";
const iota = "\u03B9";
const iprod = "\u2A3C";
const iquest$1 = "\xBF";
const iscr = "\u{1D4BE}";
const Iscr = "\u2110";
const isin = "\u2208";
const isindot = "\u22F5";
const isinE = "\u22F9";
const isins = "\u22F4";
const isinsv = "\u22F3";
const isinv = "\u2208";
const it = "\u2062";
const Itilde = "\u0128";
const itilde = "\u0129";
const Iukcy = "\u0406";
const iukcy = "\u0456";
const Iuml$1 = "\xCF";
const iuml$1 = "\xEF";
const Jcirc = "\u0134";
const jcirc = "\u0135";
const Jcy = "\u0419";
const jcy = "\u0439";
const Jfr = "\u{1D50D}";
const jfr = "\u{1D527}";
const jmath = "\u0237";
const Jopf = "\u{1D541}";
const jopf = "\u{1D55B}";
const Jscr = "\u{1D4A5}";
const jscr = "\u{1D4BF}";
const Jsercy = "\u0408";
const jsercy = "\u0458";
const Jukcy = "\u0404";
const jukcy = "\u0454";
const Kappa = "\u039A";
const kappa = "\u03BA";
const kappav = "\u03F0";
const Kcedil = "\u0136";
const kcedil = "\u0137";
const Kcy = "\u041A";
const kcy = "\u043A";
const Kfr = "\u{1D50E}";
const kfr = "\u{1D528}";
const kgreen = "\u0138";
const KHcy = "\u0425";
const khcy = "\u0445";
const KJcy = "\u040C";
const kjcy = "\u045C";
const Kopf = "\u{1D542}";
const kopf = "\u{1D55C}";
const Kscr = "\u{1D4A6}";
const kscr = "\u{1D4C0}";
const lAarr = "\u21DA";
const Lacute = "\u0139";
const lacute = "\u013A";
const laemptyv = "\u29B4";
const lagran = "\u2112";
const Lambda = "\u039B";
const lambda = "\u03BB";
const lang = "\u27E8";
const Lang = "\u27EA";
const langd = "\u2991";
const langle = "\u27E8";
const lap = "\u2A85";
const Laplacetrf = "\u2112";
const laquo$1 = "\xAB";
const larrb = "\u21E4";
const larrbfs = "\u291F";
const larr = "\u2190";
const Larr = "\u219E";
const lArr = "\u21D0";
const larrfs = "\u291D";
const larrhk = "\u21A9";
const larrlp = "\u21AB";
const larrpl = "\u2939";
const larrsim = "\u2973";
const larrtl = "\u21A2";
const latail = "\u2919";
const lAtail = "\u291B";
const lat = "\u2AAB";
const late = "\u2AAD";
const lates = "\u2AAD\uFE00";
const lbarr = "\u290C";
const lBarr = "\u290E";
const lbbrk = "\u2772";
const lbrace = "{";
const lbrack = "[";
const lbrke = "\u298B";
const lbrksld = "\u298F";
const lbrkslu = "\u298D";
const Lcaron = "\u013D";
const lcaron = "\u013E";
const Lcedil = "\u013B";
const lcedil = "\u013C";
const lceil = "\u2308";
const lcub = "{";
const Lcy = "\u041B";
const lcy = "\u043B";
const ldca = "\u2936";
const ldquo = "\u201C";
const ldquor = "\u201E";
const ldrdhar = "\u2967";
const ldrushar = "\u294B";
const ldsh = "\u21B2";
const le = "\u2264";
const lE = "\u2266";
const LeftAngleBracket = "\u27E8";
const LeftArrowBar = "\u21E4";
const leftarrow = "\u2190";
const LeftArrow = "\u2190";
const Leftarrow = "\u21D0";
const LeftArrowRightArrow = "\u21C6";
const leftarrowtail = "\u21A2";
const LeftCeiling = "\u2308";
const LeftDoubleBracket = "\u27E6";
const LeftDownTeeVector = "\u2961";
const LeftDownVectorBar = "\u2959";
const LeftDownVector = "\u21C3";
const LeftFloor = "\u230A";
const leftharpoondown = "\u21BD";
const leftharpoonup = "\u21BC";
const leftleftarrows = "\u21C7";
const leftrightarrow = "\u2194";
const LeftRightArrow = "\u2194";
const Leftrightarrow = "\u21D4";
const leftrightarrows = "\u21C6";
const leftrightharpoons = "\u21CB";
const leftrightsquigarrow = "\u21AD";
const LeftRightVector = "\u294E";
const LeftTeeArrow = "\u21A4";
const LeftTee = "\u22A3";
const LeftTeeVector = "\u295A";
const leftthreetimes = "\u22CB";
const LeftTriangleBar = "\u29CF";
const LeftTriangle = "\u22B2";
const LeftTriangleEqual = "\u22B4";
const LeftUpDownVector = "\u2951";
const LeftUpTeeVector = "\u2960";
const LeftUpVectorBar = "\u2958";
const LeftUpVector = "\u21BF";
const LeftVectorBar = "\u2952";
const LeftVector = "\u21BC";
const lEg = "\u2A8B";
const leg = "\u22DA";
const leq = "\u2264";
const leqq = "\u2266";
const leqslant = "\u2A7D";
const lescc = "\u2AA8";
const les = "\u2A7D";
const lesdot = "\u2A7F";
const lesdoto = "\u2A81";
const lesdotor = "\u2A83";
const lesg = "\u22DA\uFE00";
const lesges = "\u2A93";
const lessapprox = "\u2A85";
const lessdot = "\u22D6";
const lesseqgtr = "\u22DA";
const lesseqqgtr = "\u2A8B";
const LessEqualGreater = "\u22DA";
const LessFullEqual = "\u2266";
const LessGreater = "\u2276";
const lessgtr = "\u2276";
const LessLess = "\u2AA1";
const lesssim = "\u2272";
const LessSlantEqual = "\u2A7D";
const LessTilde = "\u2272";
const lfisht = "\u297C";
const lfloor = "\u230A";
const Lfr = "\u{1D50F}";
const lfr = "\u{1D529}";
const lg = "\u2276";
const lgE = "\u2A91";
const lHar = "\u2962";
const lhard = "\u21BD";
const lharu = "\u21BC";
const lharul = "\u296A";
const lhblk = "\u2584";
const LJcy = "\u0409";
const ljcy = "\u0459";
const llarr = "\u21C7";
const ll = "\u226A";
const Ll = "\u22D8";
const llcorner = "\u231E";
const Lleftarrow = "\u21DA";
const llhard = "\u296B";
const lltri = "\u25FA";
const Lmidot = "\u013F";
const lmidot = "\u0140";
const lmoustache = "\u23B0";
const lmoust = "\u23B0";
const lnap = "\u2A89";
const lnapprox = "\u2A89";
const lne = "\u2A87";
const lnE = "\u2268";
const lneq = "\u2A87";
const lneqq = "\u2268";
const lnsim = "\u22E6";
const loang = "\u27EC";
const loarr = "\u21FD";
const lobrk = "\u27E6";
const longleftarrow = "\u27F5";
const LongLeftArrow = "\u27F5";
const Longleftarrow = "\u27F8";
const longleftrightarrow = "\u27F7";
const LongLeftRightArrow = "\u27F7";
const Longleftrightarrow = "\u27FA";
const longmapsto = "\u27FC";
const longrightarrow = "\u27F6";
const LongRightArrow = "\u27F6";
const Longrightarrow = "\u27F9";
const looparrowleft = "\u21AB";
const looparrowright = "\u21AC";
const lopar = "\u2985";
const Lopf = "\u{1D543}";
const lopf = "\u{1D55D}";
const loplus = "\u2A2D";
const lotimes = "\u2A34";
const lowast = "\u2217";
const lowbar = "_";
const LowerLeftArrow = "\u2199";
const LowerRightArrow = "\u2198";
const loz = "\u25CA";
const lozenge = "\u25CA";
const lozf = "\u29EB";
const lpar = "(";
const lparlt = "\u2993";
const lrarr = "\u21C6";
const lrcorner = "\u231F";
const lrhar = "\u21CB";
const lrhard = "\u296D";
const lrm = "\u200E";
const lrtri = "\u22BF";
const lsaquo = "\u2039";
const lscr = "\u{1D4C1}";
const Lscr = "\u2112";
const lsh = "\u21B0";
const Lsh = "\u21B0";
const lsim = "\u2272";
const lsime = "\u2A8D";
const lsimg = "\u2A8F";
const lsqb = "[";
const lsquo = "\u2018";
const lsquor = "\u201A";
const Lstrok = "\u0141";
const lstrok = "\u0142";
const ltcc = "\u2AA6";
const ltcir = "\u2A79";
const lt$2 = "<";
const LT$1 = "<";
const Lt = "\u226A";
const ltdot = "\u22D6";
const lthree = "\u22CB";
const ltimes = "\u22C9";
const ltlarr = "\u2976";
const ltquest = "\u2A7B";
const ltri = "\u25C3";
const ltrie = "\u22B4";
const ltrif = "\u25C2";
const ltrPar = "\u2996";
const lurdshar = "\u294A";
const luruhar = "\u2966";
const lvertneqq = "\u2268\uFE00";
const lvnE = "\u2268\uFE00";
const macr$1 = "\xAF";
const male = "\u2642";
const malt = "\u2720";
const maltese = "\u2720";
const map = "\u21A6";
const mapsto = "\u21A6";
const mapstodown = "\u21A7";
const mapstoleft = "\u21A4";
const mapstoup = "\u21A5";
const marker = "\u25AE";
const mcomma = "\u2A29";
const Mcy = "\u041C";
const mcy = "\u043C";
const mdash = "\u2014";
const mDDot = "\u223A";
const measuredangle = "\u2221";
const MediumSpace = "\u205F";
const Mellintrf = "\u2133";
const Mfr = "\u{1D510}";
const mfr = "\u{1D52A}";
const mho = "\u2127";
const micro$1 = "\xB5";
const midast = "*";
const midcir = "\u2AF0";
const mid = "\u2223";
const middot$1 = "\xB7";
const minusb = "\u229F";
const minus = "\u2212";
const minusd = "\u2238";
const minusdu = "\u2A2A";
const MinusPlus = "\u2213";
const mlcp = "\u2ADB";
const mldr = "\u2026";
const mnplus = "\u2213";
const models = "\u22A7";
const Mopf = "\u{1D544}";
const mopf = "\u{1D55E}";
const mp = "\u2213";
const mscr = "\u{1D4C2}";
const Mscr = "\u2133";
const mstpos = "\u223E";
const Mu = "\u039C";
const mu = "\u03BC";
const multimap = "\u22B8";
const mumap = "\u22B8";
const nabla = "\u2207";
const Nacute = "\u0143";
const nacute = "\u0144";
const nang = "\u2220\u20D2";
const nap = "\u2249";
const napE = "\u2A70\u0338";
const napid = "\u224B\u0338";
const napos = "\u0149";
const napprox = "\u2249";
const natural = "\u266E";
const naturals = "\u2115";
const natur = "\u266E";
const nbsp$1 = "\xA0";
const nbump = "\u224E\u0338";
const nbumpe = "\u224F\u0338";
const ncap = "\u2A43";
const Ncaron = "\u0147";
const ncaron = "\u0148";
const Ncedil = "\u0145";
const ncedil = "\u0146";
const ncong = "\u2247";
const ncongdot = "\u2A6D\u0338";
const ncup = "\u2A42";
const Ncy = "\u041D";
const ncy = "\u043D";
const ndash = "\u2013";
const nearhk = "\u2924";
const nearr = "\u2197";
const neArr = "\u21D7";
const nearrow = "\u2197";
const ne = "\u2260";
const nedot = "\u2250\u0338";
const NegativeMediumSpace = "\u200B";
const NegativeThickSpace = "\u200B";
const NegativeThinSpace = "\u200B";
const NegativeVeryThinSpace = "\u200B";
const nequiv = "\u2262";
const nesear = "\u2928";
const nesim = "\u2242\u0338";
const NestedGreaterGreater = "\u226B";
const NestedLessLess = "\u226A";
const NewLine = "\n";
const nexist = "\u2204";
const nexists = "\u2204";
const Nfr = "\u{1D511}";
const nfr = "\u{1D52B}";
const ngE = "\u2267\u0338";
const nge = "\u2271";
const ngeq = "\u2271";
const ngeqq = "\u2267\u0338";
const ngeqslant = "\u2A7E\u0338";
const nges = "\u2A7E\u0338";
const nGg = "\u22D9\u0338";
const ngsim = "\u2275";
const nGt = "\u226B\u20D2";
const ngt = "\u226F";
const ngtr = "\u226F";
const nGtv = "\u226B\u0338";
const nharr = "\u21AE";
const nhArr = "\u21CE";
const nhpar = "\u2AF2";
const ni = "\u220B";
const nis = "\u22FC";
const nisd = "\u22FA";
const niv = "\u220B";
const NJcy = "\u040A";
const njcy = "\u045A";
const nlarr = "\u219A";
const nlArr = "\u21CD";
const nldr = "\u2025";
const nlE = "\u2266\u0338";
const nle = "\u2270";
const nleftarrow = "\u219A";
const nLeftarrow = "\u21CD";
const nleftrightarrow = "\u21AE";
const nLeftrightarrow = "\u21CE";
const nleq = "\u2270";
const nleqq = "\u2266\u0338";
const nleqslant = "\u2A7D\u0338";
const nles = "\u2A7D\u0338";
const nless = "\u226E";
const nLl = "\u22D8\u0338";
const nlsim = "\u2274";
const nLt = "\u226A\u20D2";
const nlt = "\u226E";
const nltri = "\u22EA";
const nltrie = "\u22EC";
const nLtv = "\u226A\u0338";
const nmid = "\u2224";
const NoBreak = "\u2060";
const NonBreakingSpace = "\xA0";
const nopf = "\u{1D55F}";
const Nopf = "\u2115";
const Not = "\u2AEC";
const not$1 = "\xAC";
const NotCongruent = "\u2262";
const NotCupCap = "\u226D";
const NotDoubleVerticalBar = "\u2226";
const NotElement = "\u2209";
const NotEqual = "\u2260";
const NotEqualTilde = "\u2242\u0338";
const NotExists = "\u2204";
const NotGreater = "\u226F";
const NotGreaterEqual = "\u2271";
const NotGreaterFullEqual = "\u2267\u0338";
const NotGreaterGreater = "\u226B\u0338";
const NotGreaterLess = "\u2279";
const NotGreaterSlantEqual = "\u2A7E\u0338";
const NotGreaterTilde = "\u2275";
const NotHumpDownHump = "\u224E\u0338";
const NotHumpEqual = "\u224F\u0338";
const notin = "\u2209";
const notindot = "\u22F5\u0338";
const notinE = "\u22F9\u0338";
const notinva = "\u2209";
const notinvb = "\u22F7";
const notinvc = "\u22F6";
const NotLeftTriangleBar = "\u29CF\u0338";
const NotLeftTriangle = "\u22EA";
const NotLeftTriangleEqual = "\u22EC";
const NotLess = "\u226E";
const NotLessEqual = "\u2270";
const NotLessGreater = "\u2278";
const NotLessLess = "\u226A\u0338";
const NotLessSlantEqual = "\u2A7D\u0338";
const NotLessTilde = "\u2274";
const NotNestedGreaterGreater = "\u2AA2\u0338";
const NotNestedLessLess = "\u2AA1\u0338";
const notni = "\u220C";
const notniva = "\u220C";
const notnivb = "\u22FE";
const notnivc = "\u22FD";
const NotPrecedes = "\u2280";
const NotPrecedesEqual = "\u2AAF\u0338";
const NotPrecedesSlantEqual = "\u22E0";
const NotReverseElement = "\u220C";
const NotRightTriangleBar = "\u29D0\u0338";
const NotRightTriangle = "\u22EB";
const NotRightTriangleEqual = "\u22ED";
const NotSquareSubset = "\u228F\u0338";
const NotSquareSubsetEqual = "\u22E2";
const NotSquareSuperset = "\u2290\u0338";
const NotSquareSupersetEqual = "\u22E3";
const NotSubset = "\u2282\u20D2";
const NotSubsetEqual = "\u2288";
const NotSucceeds = "\u2281";
const NotSucceedsEqual = "\u2AB0\u0338";
const NotSucceedsSlantEqual = "\u22E1";
const NotSucceedsTilde = "\u227F\u0338";
const NotSuperset = "\u2283\u20D2";
const NotSupersetEqual = "\u2289";
const NotTilde = "\u2241";
const NotTildeEqual = "\u2244";
const NotTildeFullEqual = "\u2247";
const NotTildeTilde = "\u2249";
const NotVerticalBar = "\u2224";
const nparallel = "\u2226";
const npar = "\u2226";
const nparsl = "\u2AFD\u20E5";
const npart = "\u2202\u0338";
const npolint = "\u2A14";
const npr = "\u2280";
const nprcue = "\u22E0";
const nprec = "\u2280";
const npreceq = "\u2AAF\u0338";
const npre = "\u2AAF\u0338";
const nrarrc = "\u2933\u0338";
const nrarr = "\u219B";
const nrArr = "\u21CF";
const nrarrw = "\u219D\u0338";
const nrightarrow = "\u219B";
const nRightarrow = "\u21CF";
const nrtri = "\u22EB";
const nrtrie = "\u22ED";
const nsc = "\u2281";
const nsccue = "\u22E1";
const nsce = "\u2AB0\u0338";
const Nscr = "\u{1D4A9}";
const nscr = "\u{1D4C3}";
const nshortmid = "\u2224";
const nshortparallel = "\u2226";
const nsim = "\u2241";
const nsime = "\u2244";
const nsimeq = "\u2244";
const nsmid = "\u2224";
const nspar = "\u2226";
const nsqsube = "\u22E2";
const nsqsupe = "\u22E3";
const nsub = "\u2284";
const nsubE = "\u2AC5\u0338";
const nsube = "\u2288";
const nsubset = "\u2282\u20D2";
const nsubseteq = "\u2288";
const nsubseteqq = "\u2AC5\u0338";
const nsucc = "\u2281";
const nsucceq = "\u2AB0\u0338";
const nsup = "\u2285";
const nsupE = "\u2AC6\u0338";
const nsupe = "\u2289";
const nsupset = "\u2283\u20D2";
const nsupseteq = "\u2289";
const nsupseteqq = "\u2AC6\u0338";
const ntgl = "\u2279";
const Ntilde$1 = "\xD1";
const ntilde$1 = "\xF1";
const ntlg = "\u2278";
const ntriangleleft = "\u22EA";
const ntrianglelefteq = "\u22EC";
const ntriangleright = "\u22EB";
const ntrianglerighteq = "\u22ED";
const Nu = "\u039D";
const nu = "\u03BD";
const num = "#";
const numero = "\u2116";
const numsp = "\u2007";
const nvap = "\u224D\u20D2";
const nvdash = "\u22AC";
const nvDash = "\u22AD";
const nVdash = "\u22AE";
const nVDash = "\u22AF";
const nvge = "\u2265\u20D2";
const nvgt = ">\u20D2";
const nvHarr = "\u2904";
const nvinfin = "\u29DE";
const nvlArr = "\u2902";
const nvle = "\u2264\u20D2";
const nvlt = "<\u20D2";
const nvltrie = "\u22B4\u20D2";
const nvrArr = "\u2903";
const nvrtrie = "\u22B5\u20D2";
const nvsim = "\u223C\u20D2";
const nwarhk = "\u2923";
const nwarr = "\u2196";
const nwArr = "\u21D6";
const nwarrow = "\u2196";
const nwnear = "\u2927";
const Oacute$1 = "\xD3";
const oacute$1 = "\xF3";
const oast = "\u229B";
const Ocirc$1 = "\xD4";
const ocirc$1 = "\xF4";
const ocir = "\u229A";
const Ocy = "\u041E";
const ocy = "\u043E";
const odash = "\u229D";
const Odblac = "\u0150";
const odblac = "\u0151";
const odiv = "\u2A38";
const odot = "\u2299";
const odsold = "\u29BC";
const OElig = "\u0152";
const oelig = "\u0153";
const ofcir = "\u29BF";
const Ofr = "\u{1D512}";
const ofr = "\u{1D52C}";
const ogon = "\u02DB";
const Ograve$1 = "\xD2";
const ograve$1 = "\xF2";
const ogt = "\u29C1";
const ohbar = "\u29B5";
const ohm = "\u03A9";
const oint = "\u222E";
const olarr = "\u21BA";
const olcir = "\u29BE";
const olcross = "\u29BB";
const oline = "\u203E";
const olt = "\u29C0";
const Omacr = "\u014C";
const omacr = "\u014D";
const Omega = "\u03A9";
const omega = "\u03C9";
const Omicron = "\u039F";
const omicron = "\u03BF";
const omid = "\u29B6";
const ominus = "\u2296";
const Oopf = "\u{1D546}";
const oopf = "\u{1D560}";
const opar = "\u29B7";
const OpenCurlyDoubleQuote = "\u201C";
const OpenCurlyQuote = "\u2018";
const operp = "\u29B9";
const oplus = "\u2295";
const orarr = "\u21BB";
const Or = "\u2A54";
const or = "\u2228";
const ord = "\u2A5D";
const order$1 = "\u2134";
const orderof = "\u2134";
const ordf$1 = "\xAA";
const ordm$1 = "\xBA";
const origof = "\u22B6";
const oror = "\u2A56";
const orslope = "\u2A57";
const orv = "\u2A5B";
const oS = "\u24C8";
const Oscr = "\u{1D4AA}";
const oscr = "\u2134";
const Oslash$1 = "\xD8";
const oslash$1 = "\xF8";
const osol = "\u2298";
const Otilde$1 = "\xD5";
const otilde$1 = "\xF5";
const otimesas = "\u2A36";
const Otimes = "\u2A37";
const otimes = "\u2297";
const Ouml$1 = "\xD6";
const ouml$1 = "\xF6";
const ovbar = "\u233D";
const OverBar = "\u203E";
const OverBrace = "\u23DE";
const OverBracket = "\u23B4";
const OverParenthesis = "\u23DC";
const para$1 = "\xB6";
const parallel = "\u2225";
const par = "\u2225";
const parsim = "\u2AF3";
const parsl = "\u2AFD";
const part = "\u2202";
const PartialD = "\u2202";
const Pcy = "\u041F";
const pcy = "\u043F";
const percnt = "%";
const period = ".";
const permil = "\u2030";
const perp = "\u22A5";
const pertenk = "\u2031";
const Pfr = "\u{1D513}";
const pfr = "\u{1D52D}";
const Phi = "\u03A6";
const phi = "\u03C6";
const phiv = "\u03D5";
const phmmat = "\u2133";
const phone = "\u260E";
const Pi = "\u03A0";
const pi = "\u03C0";
const pitchfork = "\u22D4";
const piv = "\u03D6";
const planck = "\u210F";
const planckh = "\u210E";
const plankv = "\u210F";
const plusacir = "\u2A23";
const plusb = "\u229E";
const pluscir = "\u2A22";
const plus = "+";
const plusdo = "\u2214";
const plusdu = "\u2A25";
const pluse = "\u2A72";
const PlusMinus = "\xB1";
const plusmn$1 = "\xB1";
const plussim = "\u2A26";
const plustwo = "\u2A27";
const pm = "\xB1";
const Poincareplane = "\u210C";
const pointint = "\u2A15";
const popf = "\u{1D561}";
const Popf = "\u2119";
const pound$1 = "\xA3";
const prap = "\u2AB7";
const Pr = "\u2ABB";
const pr = "\u227A";
const prcue = "\u227C";
const precapprox = "\u2AB7";
const prec = "\u227A";
const preccurlyeq = "\u227C";
const Precedes = "\u227A";
const PrecedesEqual = "\u2AAF";
const PrecedesSlantEqual = "\u227C";
const PrecedesTilde = "\u227E";
const preceq = "\u2AAF";
const precnapprox = "\u2AB9";
const precneqq = "\u2AB5";
const precnsim = "\u22E8";
const pre = "\u2AAF";
const prE = "\u2AB3";
const precsim = "\u227E";
const prime = "\u2032";
const Prime = "\u2033";
const primes = "\u2119";
const prnap = "\u2AB9";
const prnE = "\u2AB5";
const prnsim = "\u22E8";
const prod = "\u220F";
const Product = "\u220F";
const profalar = "\u232E";
const profline = "\u2312";
const profsurf = "\u2313";
const prop = "\u221D";
const Proportional = "\u221D";
const Proportion = "\u2237";
const propto = "\u221D";
const prsim = "\u227E";
const prurel = "\u22B0";
const Pscr = "\u{1D4AB}";
const pscr = "\u{1D4C5}";
const Psi = "\u03A8";
const psi = "\u03C8";
const puncsp = "\u2008";
const Qfr = "\u{1D514}";
const qfr = "\u{1D52E}";
const qint = "\u2A0C";
const qopf = "\u{1D562}";
const Qopf = "\u211A";
const qprime = "\u2057";
const Qscr = "\u{1D4AC}";
const qscr = "\u{1D4C6}";
const quaternions = "\u210D";
const quatint = "\u2A16";
const quest = "?";
const questeq = "\u225F";
const quot$2 = '"';
const QUOT$1 = '"';
const rAarr = "\u21DB";
const race = "\u223D\u0331";
const Racute = "\u0154";
const racute = "\u0155";
const radic = "\u221A";
const raemptyv = "\u29B3";
const rang = "\u27E9";
const Rang = "\u27EB";
const rangd = "\u2992";
const range = "\u29A5";
const rangle = "\u27E9";
const raquo$1 = "\xBB";
const rarrap = "\u2975";
const rarrb = "\u21E5";
const rarrbfs = "\u2920";
const rarrc = "\u2933";
const rarr = "\u2192";
const Rarr = "\u21A0";
const rArr = "\u21D2";
const rarrfs = "\u291E";
const rarrhk = "\u21AA";
const rarrlp = "\u21AC";
const rarrpl = "\u2945";
const rarrsim = "\u2974";
const Rarrtl = "\u2916";
const rarrtl = "\u21A3";
const rarrw = "\u219D";
const ratail = "\u291A";
const rAtail = "\u291C";
const ratio = "\u2236";
const rationals = "\u211A";
const rbarr = "\u290D";
const rBarr = "\u290F";
const RBarr = "\u2910";
const rbbrk = "\u2773";
const rbrace = "}";
const rbrack = "]";
const rbrke = "\u298C";
const rbrksld = "\u298E";
const rbrkslu = "\u2990";
const Rcaron = "\u0158";
const rcaron = "\u0159";
const Rcedil = "\u0156";
const rcedil = "\u0157";
const rceil = "\u2309";
const rcub = "}";
const Rcy = "\u0420";
const rcy = "\u0440";
const rdca = "\u2937";
const rdldhar = "\u2969";
const rdquo = "\u201D";
const rdquor = "\u201D";
const rdsh = "\u21B3";
const real = "\u211C";
const realine = "\u211B";
const realpart = "\u211C";
const reals = "\u211D";
const Re = "\u211C";
const rect = "\u25AD";
const reg$1 = "\xAE";
const REG$1 = "\xAE";
const ReverseElement = "\u220B";
const ReverseEquilibrium = "\u21CB";
const ReverseUpEquilibrium = "\u296F";
const rfisht = "\u297D";
const rfloor = "\u230B";
const rfr = "\u{1D52F}";
const Rfr = "\u211C";
const rHar = "\u2964";
const rhard = "\u21C1";
const rharu = "\u21C0";
const rharul = "\u296C";
const Rho = "\u03A1";
const rho = "\u03C1";
const rhov = "\u03F1";
const RightAngleBracket = "\u27E9";
const RightArrowBar = "\u21E5";
const rightarrow = "\u2192";
const RightArrow = "\u2192";
const Rightarrow = "\u21D2";
const RightArrowLeftArrow = "\u21C4";
const rightarrowtail = "\u21A3";
const RightCeiling = "\u2309";
const RightDoubleBracket = "\u27E7";
const RightDownTeeVector = "\u295D";
const RightDownVectorBar = "\u2955";
const RightDownVector = "\u21C2";
const RightFloor = "\u230B";
const rightharpoondown = "\u21C1";
const rightharpoonup = "\u21C0";
const rightleftarrows = "\u21C4";
const rightleftharpoons = "\u21CC";
const rightrightarrows = "\u21C9";
const rightsquigarrow = "\u219D";
const RightTeeArrow = "\u21A6";
const RightTee = "\u22A2";
const RightTeeVector = "\u295B";
const rightthreetimes = "\u22CC";
const RightTriangleBar = "\u29D0";
const RightTriangle = "\u22B3";
const RightTriangleEqual = "\u22B5";
const RightUpDownVector = "\u294F";
const RightUpTeeVector = "\u295C";
const RightUpVectorBar = "\u2954";
const RightUpVector = "\u21BE";
const RightVectorBar = "\u2953";
const RightVector = "\u21C0";
const ring = "\u02DA";
const risingdotseq = "\u2253";
const rlarr = "\u21C4";
const rlhar = "\u21CC";
const rlm = "\u200F";
const rmoustache = "\u23B1";
const rmoust = "\u23B1";
const rnmid = "\u2AEE";
const roang = "\u27ED";
const roarr = "\u21FE";
const robrk = "\u27E7";
const ropar = "\u2986";
const ropf = "\u{1D563}";
const Ropf = "\u211D";
const roplus = "\u2A2E";
const rotimes = "\u2A35";
const RoundImplies = "\u2970";
const rpar = ")";
const rpargt = "\u2994";
const rppolint = "\u2A12";
const rrarr = "\u21C9";
const Rrightarrow = "\u21DB";
const rsaquo = "\u203A";
const rscr = "\u{1D4C7}";
const Rscr = "\u211B";
const rsh = "\u21B1";
const Rsh = "\u21B1";
const rsqb = "]";
const rsquo = "\u2019";
const rsquor = "\u2019";
const rthree = "\u22CC";
const rtimes = "\u22CA";
const rtri = "\u25B9";
const rtrie = "\u22B5";
const rtrif = "\u25B8";
const rtriltri = "\u29CE";
const RuleDelayed = "\u29F4";
const ruluhar = "\u2968";
const rx = "\u211E";
const Sacute = "\u015A";
const sacute = "\u015B";
const sbquo = "\u201A";
const scap = "\u2AB8";
const Scaron = "\u0160";
const scaron = "\u0161";
const Sc = "\u2ABC";
const sc = "\u227B";
const sccue = "\u227D";
const sce = "\u2AB0";
const scE = "\u2AB4";
const Scedil = "\u015E";
const scedil = "\u015F";
const Scirc = "\u015C";
const scirc = "\u015D";
const scnap = "\u2ABA";
const scnE = "\u2AB6";
const scnsim = "\u22E9";
const scpolint = "\u2A13";
const scsim = "\u227F";
const Scy = "\u0421";
const scy = "\u0441";
const sdotb = "\u22A1";
const sdot = "\u22C5";
const sdote = "\u2A66";
const searhk = "\u2925";
const searr = "\u2198";
const seArr = "\u21D8";
const searrow = "\u2198";
const sect$1 = "\xA7";
const semi = ";";
const seswar = "\u2929";
const setminus = "\u2216";
const setmn = "\u2216";
const sext = "\u2736";
const Sfr = "\u{1D516}";
const sfr = "\u{1D530}";
const sfrown = "\u2322";
const sharp = "\u266F";
const SHCHcy = "\u0429";
const shchcy = "\u0449";
const SHcy = "\u0428";
const shcy = "\u0448";
const ShortDownArrow = "\u2193";
const ShortLeftArrow = "\u2190";
const shortmid = "\u2223";
const shortparallel = "\u2225";
const ShortRightArrow = "\u2192";
const ShortUpArrow = "\u2191";
const shy$1 = "\xAD";
const Sigma = "\u03A3";
const sigma = "\u03C3";
const sigmaf = "\u03C2";
const sigmav = "\u03C2";
const sim = "\u223C";
const simdot = "\u2A6A";
const sime = "\u2243";
const simeq = "\u2243";
const simg = "\u2A9E";
const simgE = "\u2AA0";
const siml = "\u2A9D";
const simlE = "\u2A9F";
const simne = "\u2246";
const simplus = "\u2A24";
const simrarr = "\u2972";
const slarr = "\u2190";
const SmallCircle = "\u2218";
const smallsetminus = "\u2216";
const smashp = "\u2A33";
const smeparsl = "\u29E4";
const smid = "\u2223";
const smile = "\u2323";
const smt = "\u2AAA";
const smte = "\u2AAC";
const smtes = "\u2AAC\uFE00";
const SOFTcy = "\u042C";
const softcy = "\u044C";
const solbar = "\u233F";
const solb = "\u29C4";
const sol = "/";
const Sopf = "\u{1D54A}";
const sopf = "\u{1D564}";
const spades = "\u2660";
const spadesuit = "\u2660";
const spar = "\u2225";
const sqcap = "\u2293";
const sqcaps = "\u2293\uFE00";
const sqcup = "\u2294";
const sqcups = "\u2294\uFE00";
const Sqrt = "\u221A";
const sqsub = "\u228F";
const sqsube = "\u2291";
const sqsubset = "\u228F";
const sqsubseteq = "\u2291";
const sqsup = "\u2290";
const sqsupe = "\u2292";
const sqsupset = "\u2290";
const sqsupseteq = "\u2292";
const square = "\u25A1";
const Square = "\u25A1";
const SquareIntersection = "\u2293";
const SquareSubset = "\u228F";
const SquareSubsetEqual = "\u2291";
const SquareSuperset = "\u2290";
const SquareSupersetEqual = "\u2292";
const SquareUnion = "\u2294";
const squarf = "\u25AA";
const squ = "\u25A1";
const squf = "\u25AA";
const srarr = "\u2192";
const Sscr = "\u{1D4AE}";
const sscr = "\u{1D4C8}";
const ssetmn = "\u2216";
const ssmile = "\u2323";
const sstarf = "\u22C6";
const Star = "\u22C6";
const star = "\u2606";
const starf = "\u2605";
const straightepsilon = "\u03F5";
const straightphi = "\u03D5";
const strns = "\xAF";
const sub = "\u2282";
const Sub = "\u22D0";
const subdot = "\u2ABD";
const subE = "\u2AC5";
const sube = "\u2286";
const subedot = "\u2AC3";
const submult = "\u2AC1";
const subnE = "\u2ACB";
const subne = "\u228A";
const subplus = "\u2ABF";
const subrarr = "\u2979";
const subset = "\u2282";
const Subset = "\u22D0";
const subseteq = "\u2286";
const subseteqq = "\u2AC5";
const SubsetEqual = "\u2286";
const subsetneq = "\u228A";
const subsetneqq = "\u2ACB";
const subsim = "\u2AC7";
const subsub = "\u2AD5";
const subsup = "\u2AD3";
const succapprox = "\u2AB8";
const succ = "\u227B";
const succcurlyeq = "\u227D";
const Succeeds = "\u227B";
const SucceedsEqual = "\u2AB0";
const SucceedsSlantEqual = "\u227D";
const SucceedsTilde = "\u227F";
const succeq = "\u2AB0";
const succnapprox = "\u2ABA";
const succneqq = "\u2AB6";
const succnsim = "\u22E9";
const succsim = "\u227F";
const SuchThat = "\u220B";
const sum = "\u2211";
const Sum = "\u2211";
const sung = "\u266A";
const sup1$1 = "\xB9";
const sup2$1 = "\xB2";
const sup3$1 = "\xB3";
const sup = "\u2283";
const Sup = "\u22D1";
const supdot = "\u2ABE";
const supdsub = "\u2AD8";
const supE = "\u2AC6";
const supe = "\u2287";
const supedot = "\u2AC4";
const Superset = "\u2283";
const SupersetEqual = "\u2287";
const suphsol = "\u27C9";
const suphsub = "\u2AD7";
const suplarr = "\u297B";
const supmult = "\u2AC2";
const supnE = "\u2ACC";
const supne = "\u228B";
const supplus = "\u2AC0";
const supset = "\u2283";
const Supset = "\u22D1";
const supseteq = "\u2287";
const supseteqq = "\u2AC6";
const supsetneq = "\u228B";
const supsetneqq = "\u2ACC";
const supsim = "\u2AC8";
const supsub = "\u2AD4";
const supsup = "\u2AD6";
const swarhk = "\u2926";
const swarr = "\u2199";
const swArr = "\u21D9";
const swarrow = "\u2199";
const swnwar = "\u292A";
const szlig$1 = "\xDF";
const Tab = "	";
const target = "\u2316";
const Tau = "\u03A4";
const tau = "\u03C4";
const tbrk = "\u23B4";
const Tcaron = "\u0164";
const tcaron = "\u0165";
const Tcedil = "\u0162";
const tcedil = "\u0163";
const Tcy = "\u0422";
const tcy = "\u0442";
const tdot = "\u20DB";
const telrec = "\u2315";
const Tfr = "\u{1D517}";
const tfr = "\u{1D531}";
const there4 = "\u2234";
const therefore = "\u2234";
const Therefore = "\u2234";
const Theta = "\u0398";
const theta = "\u03B8";
const thetasym = "\u03D1";
const thetav = "\u03D1";
const thickapprox = "\u2248";
const thicksim = "\u223C";
const ThickSpace = "\u205F\u200A";
const ThinSpace = "\u2009";
const thinsp = "\u2009";
const thkap = "\u2248";
const thksim = "\u223C";
const THORN$1 = "\xDE";
const thorn$1 = "\xFE";
const tilde = "\u02DC";
const Tilde = "\u223C";
const TildeEqual = "\u2243";
const TildeFullEqual = "\u2245";
const TildeTilde = "\u2248";
const timesbar = "\u2A31";
const timesb = "\u22A0";
const times$1 = "\xD7";
const timesd = "\u2A30";
const tint = "\u222D";
const toea = "\u2928";
const topbot = "\u2336";
const topcir = "\u2AF1";
const top$1 = "\u22A4";
const Topf = "\u{1D54B}";
const topf = "\u{1D565}";
const topfork = "\u2ADA";
const tosa = "\u2929";
const tprime = "\u2034";
const trade = "\u2122";
const TRADE = "\u2122";
const triangle = "\u25B5";
const triangledown = "\u25BF";
const triangleleft = "\u25C3";
const trianglelefteq = "\u22B4";
const triangleq = "\u225C";
const triangleright = "\u25B9";
const trianglerighteq = "\u22B5";
const tridot = "\u25EC";
const trie = "\u225C";
const triminus = "\u2A3A";
const TripleDot = "\u20DB";
const triplus = "\u2A39";
const trisb = "\u29CD";
const tritime = "\u2A3B";
const trpezium = "\u23E2";
const Tscr = "\u{1D4AF}";
const tscr = "\u{1D4C9}";
const TScy = "\u0426";
const tscy = "\u0446";
const TSHcy = "\u040B";
const tshcy = "\u045B";
const Tstrok = "\u0166";
const tstrok = "\u0167";
const twixt = "\u226C";
const twoheadleftarrow = "\u219E";
const twoheadrightarrow = "\u21A0";
const Uacute$1 = "\xDA";
const uacute$1 = "\xFA";
const uarr = "\u2191";
const Uarr = "\u219F";
const uArr = "\u21D1";
const Uarrocir = "\u2949";
const Ubrcy = "\u040E";
const ubrcy = "\u045E";
const Ubreve = "\u016C";
const ubreve = "\u016D";
const Ucirc$1 = "\xDB";
const ucirc$1 = "\xFB";
const Ucy = "\u0423";
const ucy = "\u0443";
const udarr = "\u21C5";
const Udblac = "\u0170";
const udblac = "\u0171";
const udhar = "\u296E";
const ufisht = "\u297E";
const Ufr = "\u{1D518}";
const ufr = "\u{1D532}";
const Ugrave$1 = "\xD9";
const ugrave$1 = "\xF9";
const uHar = "\u2963";
const uharl = "\u21BF";
const uharr = "\u21BE";
const uhblk = "\u2580";
const ulcorn = "\u231C";
const ulcorner = "\u231C";
const ulcrop = "\u230F";
const ultri = "\u25F8";
const Umacr = "\u016A";
const umacr = "\u016B";
const uml$1 = "\xA8";
const UnderBar = "_";
const UnderBrace = "\u23DF";
const UnderBracket = "\u23B5";
const UnderParenthesis = "\u23DD";
const Union = "\u22C3";
const UnionPlus = "\u228E";
const Uogon = "\u0172";
const uogon = "\u0173";
const Uopf = "\u{1D54C}";
const uopf = "\u{1D566}";
const UpArrowBar = "\u2912";
const uparrow = "\u2191";
const UpArrow = "\u2191";
const Uparrow = "\u21D1";
const UpArrowDownArrow = "\u21C5";
const updownarrow = "\u2195";
const UpDownArrow = "\u2195";
const Updownarrow = "\u21D5";
const UpEquilibrium = "\u296E";
const upharpoonleft = "\u21BF";
const upharpoonright = "\u21BE";
const uplus = "\u228E";
const UpperLeftArrow = "\u2196";
const UpperRightArrow = "\u2197";
const upsi = "\u03C5";
const Upsi = "\u03D2";
const upsih = "\u03D2";
const Upsilon = "\u03A5";
const upsilon = "\u03C5";
const UpTeeArrow = "\u21A5";
const UpTee = "\u22A5";
const upuparrows = "\u21C8";
const urcorn = "\u231D";
const urcorner = "\u231D";
const urcrop = "\u230E";
const Uring = "\u016E";
const uring = "\u016F";
const urtri = "\u25F9";
const Uscr = "\u{1D4B0}";
const uscr = "\u{1D4CA}";
const utdot = "\u22F0";
const Utilde = "\u0168";
const utilde = "\u0169";
const utri = "\u25B5";
const utrif = "\u25B4";
const uuarr = "\u21C8";
const Uuml$1 = "\xDC";
const uuml$1 = "\xFC";
const uwangle = "\u29A7";
const vangrt = "\u299C";
const varepsilon = "\u03F5";
const varkappa = "\u03F0";
const varnothing = "\u2205";
const varphi = "\u03D5";
const varpi = "\u03D6";
const varpropto = "\u221D";
const varr = "\u2195";
const vArr = "\u21D5";
const varrho = "\u03F1";
const varsigma = "\u03C2";
const varsubsetneq = "\u228A\uFE00";
const varsubsetneqq = "\u2ACB\uFE00";
const varsupsetneq = "\u228B\uFE00";
const varsupsetneqq = "\u2ACC\uFE00";
const vartheta = "\u03D1";
const vartriangleleft = "\u22B2";
const vartriangleright = "\u22B3";
const vBar = "\u2AE8";
const Vbar = "\u2AEB";
const vBarv = "\u2AE9";
const Vcy = "\u0412";
const vcy = "\u0432";
const vdash = "\u22A2";
const vDash = "\u22A8";
const Vdash = "\u22A9";
const VDash = "\u22AB";
const Vdashl = "\u2AE6";
const veebar = "\u22BB";
const vee = "\u2228";
const Vee = "\u22C1";
const veeeq = "\u225A";
const vellip = "\u22EE";
const verbar = "|";
const Verbar = "\u2016";
const vert = "|";
const Vert = "\u2016";
const VerticalBar = "\u2223";
const VerticalLine = "|";
const VerticalSeparator = "\u2758";
const VerticalTilde = "\u2240";
const VeryThinSpace = "\u200A";
const Vfr = "\u{1D519}";
const vfr = "\u{1D533}";
const vltri = "\u22B2";
const vnsub = "\u2282\u20D2";
const vnsup = "\u2283\u20D2";
const Vopf = "\u{1D54D}";
const vopf = "\u{1D567}";
const vprop = "\u221D";
const vrtri = "\u22B3";
const Vscr = "\u{1D4B1}";
const vscr = "\u{1D4CB}";
const vsubnE = "\u2ACB\uFE00";
const vsubne = "\u228A\uFE00";
const vsupnE = "\u2ACC\uFE00";
const vsupne = "\u228B\uFE00";
const Vvdash = "\u22AA";
const vzigzag = "\u299A";
const Wcirc = "\u0174";
const wcirc = "\u0175";
const wedbar = "\u2A5F";
const wedge = "\u2227";
const Wedge = "\u22C0";
const wedgeq = "\u2259";
const weierp = "\u2118";
const Wfr = "\u{1D51A}";
const wfr = "\u{1D534}";
const Wopf = "\u{1D54E}";
const wopf = "\u{1D568}";
const wp = "\u2118";
const wr = "\u2240";
const wreath = "\u2240";
const Wscr = "\u{1D4B2}";
const wscr = "\u{1D4CC}";
const xcap = "\u22C2";
const xcirc = "\u25EF";
const xcup = "\u22C3";
const xdtri = "\u25BD";
const Xfr = "\u{1D51B}";
const xfr = "\u{1D535}";
const xharr = "\u27F7";
const xhArr = "\u27FA";
const Xi = "\u039E";
const xi = "\u03BE";
const xlarr = "\u27F5";
const xlArr = "\u27F8";
const xmap = "\u27FC";
const xnis = "\u22FB";
const xodot = "\u2A00";
const Xopf = "\u{1D54F}";
const xopf = "\u{1D569}";
const xoplus = "\u2A01";
const xotime = "\u2A02";
const xrarr = "\u27F6";
const xrArr = "\u27F9";
const Xscr = "\u{1D4B3}";
const xscr = "\u{1D4CD}";
const xsqcup = "\u2A06";
const xuplus = "\u2A04";
const xutri = "\u25B3";
const xvee = "\u22C1";
const xwedge = "\u22C0";
const Yacute$1 = "\xDD";
const yacute$1 = "\xFD";
const YAcy = "\u042F";
const yacy = "\u044F";
const Ycirc = "\u0176";
const ycirc = "\u0177";
const Ycy = "\u042B";
const ycy = "\u044B";
const yen$1 = "\xA5";
const Yfr = "\u{1D51C}";
const yfr = "\u{1D536}";
const YIcy = "\u0407";
const yicy = "\u0457";
const Yopf = "\u{1D550}";
const yopf = "\u{1D56A}";
const Yscr = "\u{1D4B4}";
const yscr = "\u{1D4CE}";
const YUcy = "\u042E";
const yucy = "\u044E";
const yuml$1 = "\xFF";
const Yuml = "\u0178";
const Zacute = "\u0179";
const zacute = "\u017A";
const Zcaron = "\u017D";
const zcaron = "\u017E";
const Zcy = "\u0417";
const zcy = "\u0437";
const Zdot = "\u017B";
const zdot = "\u017C";
const zeetrf = "\u2128";
const ZeroWidthSpace = "\u200B";
const Zeta = "\u0396";
const zeta = "\u03B6";
const zfr = "\u{1D537}";
const Zfr = "\u2128";
const ZHcy = "\u0416";
const zhcy = "\u0436";
const zigrarr = "\u21DD";
const zopf = "\u{1D56B}";
const Zopf = "\u2124";
const Zscr = "\u{1D4B5}";
const zscr = "\u{1D4CF}";
const zwj = "\u200D";
const zwnj = "\u200C";
var require$$1$2 = {
  Aacute: Aacute$1,
  aacute: aacute$1,
  Abreve,
  abreve,
  ac,
  acd,
  acE,
  Acirc: Acirc$1,
  acirc: acirc$1,
  acute: acute$1,
  Acy,
  acy,
  AElig: AElig$1,
  aelig: aelig$1,
  af,
  Afr,
  afr,
  Agrave: Agrave$1,
  agrave: agrave$1,
  alefsym,
  aleph,
  Alpha,
  alpha: alpha$2,
  Amacr,
  amacr,
  amalg,
  amp: amp$2,
  AMP: AMP$1,
  andand,
  And,
  and,
  andd,
  andslope,
  andv,
  ang,
  ange,
  angle,
  angmsdaa,
  angmsdab,
  angmsdac,
  angmsdad,
  angmsdae,
  angmsdaf,
  angmsdag,
  angmsdah,
  angmsd,
  angrt,
  angrtvb,
  angrtvbd,
  angsph,
  angst,
  angzarr,
  Aogon,
  aogon,
  Aopf,
  aopf,
  apacir,
  ap,
  apE,
  ape,
  apid,
  apos: apos$1,
  ApplyFunction,
  approx,
  approxeq,
  Aring: Aring$1,
  aring: aring$1,
  Ascr,
  ascr,
  Assign,
  ast,
  asymp,
  asympeq,
  Atilde: Atilde$1,
  atilde: atilde$1,
  Auml: Auml$1,
  auml: auml$1,
  awconint,
  awint,
  backcong,
  backepsilon,
  backprime,
  backsim,
  backsimeq,
  Backslash,
  Barv,
  barvee,
  barwed,
  Barwed,
  barwedge,
  bbrk,
  bbrktbrk,
  bcong,
  Bcy,
  bcy,
  bdquo,
  becaus,
  because,
  Because,
  bemptyv,
  bepsi,
  bernou,
  Bernoullis,
  Beta,
  beta,
  beth,
  between,
  Bfr,
  bfr,
  bigcap,
  bigcirc,
  bigcup,
  bigodot,
  bigoplus,
  bigotimes,
  bigsqcup,
  bigstar,
  bigtriangledown,
  bigtriangleup,
  biguplus,
  bigvee,
  bigwedge,
  bkarow,
  blacklozenge,
  blacksquare,
  blacktriangle,
  blacktriangledown,
  blacktriangleleft,
  blacktriangleright,
  blank,
  blk12,
  blk14,
  blk34,
  block,
  bne,
  bnequiv,
  bNot,
  bnot,
  Bopf,
  bopf,
  bot,
  bottom: bottom$1,
  bowtie,
  boxbox,
  boxdl,
  boxdL,
  boxDl,
  boxDL,
  boxdr,
  boxdR,
  boxDr,
  boxDR,
  boxh,
  boxH,
  boxhd,
  boxHd,
  boxhD,
  boxHD,
  boxhu,
  boxHu,
  boxhU,
  boxHU,
  boxminus,
  boxplus,
  boxtimes,
  boxul,
  boxuL,
  boxUl,
  boxUL,
  boxur,
  boxuR,
  boxUr,
  boxUR,
  boxv,
  boxV,
  boxvh,
  boxvH,
  boxVh,
  boxVH,
  boxvl,
  boxvL,
  boxVl,
  boxVL,
  boxvr,
  boxvR,
  boxVr,
  boxVR,
  bprime,
  breve,
  Breve,
  brvbar: brvbar$1,
  bscr,
  Bscr,
  bsemi,
  bsim,
  bsime,
  bsolb,
  bsol,
  bsolhsub,
  bull,
  bullet,
  bump,
  bumpE,
  bumpe,
  Bumpeq,
  bumpeq,
  Cacute,
  cacute,
  capand,
  capbrcup,
  capcap,
  cap,
  Cap,
  capcup,
  capdot,
  CapitalDifferentialD,
  caps,
  caret,
  caron,
  Cayleys,
  ccaps,
  Ccaron,
  ccaron,
  Ccedil: Ccedil$1,
  ccedil: ccedil$1,
  Ccirc,
  ccirc,
  Cconint,
  ccups,
  ccupssm,
  Cdot,
  cdot,
  cedil: cedil$1,
  Cedilla,
  cemptyv,
  cent: cent$1,
  centerdot,
  CenterDot,
  cfr,
  Cfr,
  CHcy,
  chcy,
  check,
  checkmark,
  Chi,
  chi,
  circ,
  circeq,
  circlearrowleft,
  circlearrowright,
  circledast,
  circledcirc,
  circleddash,
  CircleDot,
  circledR,
  circledS,
  CircleMinus,
  CirclePlus,
  CircleTimes,
  cir,
  cirE,
  cire,
  cirfnint,
  cirmid,
  cirscir,
  ClockwiseContourIntegral,
  CloseCurlyDoubleQuote,
  CloseCurlyQuote,
  clubs,
  clubsuit,
  colon,
  Colon,
  Colone,
  colone,
  coloneq,
  comma,
  commat,
  comp,
  compfn,
  complement,
  complexes,
  cong,
  congdot,
  Congruent,
  conint,
  Conint,
  ContourIntegral,
  copf,
  Copf,
  coprod,
  Coproduct,
  copy: copy$1,
  COPY: COPY$1,
  copysr,
  CounterClockwiseContourIntegral,
  crarr,
  cross,
  Cross,
  Cscr,
  cscr,
  csub,
  csube,
  csup,
  csupe,
  ctdot,
  cudarrl,
  cudarrr,
  cuepr,
  cuesc,
  cularr,
  cularrp,
  cupbrcap,
  cupcap,
  CupCap,
  cup,
  Cup,
  cupcup,
  cupdot,
  cupor,
  cups,
  curarr,
  curarrm,
  curlyeqprec,
  curlyeqsucc,
  curlyvee,
  curlywedge,
  curren: curren$1,
  curvearrowleft,
  curvearrowright,
  cuvee,
  cuwed,
  cwconint,
  cwint,
  cylcty,
  dagger,
  Dagger,
  daleth,
  darr,
  Darr,
  dArr,
  dash,
  Dashv,
  dashv,
  dbkarow,
  dblac,
  Dcaron,
  dcaron,
  Dcy,
  dcy,
  ddagger,
  ddarr,
  DD,
  dd,
  DDotrahd,
  ddotseq,
  deg: deg$1,
  Del,
  Delta,
  delta,
  demptyv,
  dfisht,
  Dfr,
  dfr,
  dHar,
  dharl,
  dharr,
  DiacriticalAcute,
  DiacriticalDot,
  DiacriticalDoubleAcute,
  DiacriticalGrave,
  DiacriticalTilde,
  diam,
  diamond,
  Diamond,
  diamondsuit,
  diams,
  die,
  DifferentialD,
  digamma,
  disin,
  div,
  divide: divide$1,
  divideontimes,
  divonx,
  DJcy,
  djcy,
  dlcorn,
  dlcrop,
  dollar,
  Dopf,
  dopf,
  Dot,
  dot,
  DotDot,
  doteq,
  doteqdot,
  DotEqual,
  dotminus,
  dotplus,
  dotsquare,
  doublebarwedge,
  DoubleContourIntegral,
  DoubleDot,
  DoubleDownArrow,
  DoubleLeftArrow,
  DoubleLeftRightArrow,
  DoubleLeftTee,
  DoubleLongLeftArrow,
  DoubleLongLeftRightArrow,
  DoubleLongRightArrow,
  DoubleRightArrow,
  DoubleRightTee,
  DoubleUpArrow,
  DoubleUpDownArrow,
  DoubleVerticalBar,
  DownArrowBar,
  downarrow,
  DownArrow,
  Downarrow,
  DownArrowUpArrow,
  DownBreve,
  downdownarrows,
  downharpoonleft,
  downharpoonright,
  DownLeftRightVector,
  DownLeftTeeVector,
  DownLeftVectorBar,
  DownLeftVector,
  DownRightTeeVector,
  DownRightVectorBar,
  DownRightVector,
  DownTeeArrow,
  DownTee,
  drbkarow,
  drcorn,
  drcrop,
  Dscr,
  dscr,
  DScy,
  dscy,
  dsol,
  Dstrok,
  dstrok,
  dtdot,
  dtri,
  dtrif,
  duarr,
  duhar,
  dwangle,
  DZcy,
  dzcy,
  dzigrarr,
  Eacute: Eacute$1,
  eacute: eacute$1,
  easter,
  Ecaron,
  ecaron,
  Ecirc: Ecirc$1,
  ecirc: ecirc$1,
  ecir,
  ecolon,
  Ecy,
  ecy,
  eDDot,
  Edot,
  edot,
  eDot,
  ee,
  efDot,
  Efr,
  efr,
  eg,
  Egrave: Egrave$1,
  egrave: egrave$1,
  egs,
  egsdot,
  el,
  Element: Element$1,
  elinters,
  ell,
  els,
  elsdot,
  Emacr,
  emacr,
  empty,
  emptyset,
  EmptySmallSquare,
  emptyv,
  EmptyVerySmallSquare,
  emsp13,
  emsp14,
  emsp,
  ENG,
  eng,
  ensp,
  Eogon,
  eogon,
  Eopf,
  eopf,
  epar,
  eparsl,
  eplus,
  epsi,
  Epsilon,
  epsilon,
  epsiv,
  eqcirc,
  eqcolon,
  eqsim,
  eqslantgtr,
  eqslantless,
  Equal,
  equals,
  EqualTilde,
  equest,
  Equilibrium,
  equiv,
  equivDD,
  eqvparsl,
  erarr,
  erDot,
  escr,
  Escr,
  esdot,
  Esim,
  esim,
  Eta,
  eta,
  ETH: ETH$1,
  eth: eth$1,
  Euml: Euml$1,
  euml: euml$1,
  euro,
  excl,
  exist,
  Exists,
  expectation,
  exponentiale,
  ExponentialE,
  fallingdotseq,
  Fcy,
  fcy,
  female,
  ffilig,
  fflig,
  ffllig,
  Ffr,
  ffr,
  filig,
  FilledSmallSquare,
  FilledVerySmallSquare,
  fjlig,
  flat,
  fllig,
  fltns,
  fnof,
  Fopf,
  fopf,
  forall,
  ForAll,
  fork,
  forkv,
  Fouriertrf,
  fpartint,
  frac12: frac12$1,
  frac13,
  frac14: frac14$1,
  frac15,
  frac16,
  frac18,
  frac23,
  frac25,
  frac34: frac34$1,
  frac35,
  frac38,
  frac45,
  frac56,
  frac58,
  frac78,
  frasl,
  frown,
  fscr,
  Fscr,
  gacute,
  Gamma,
  gamma,
  Gammad,
  gammad,
  gap,
  Gbreve,
  gbreve,
  Gcedil,
  Gcirc,
  gcirc,
  Gcy,
  gcy,
  Gdot,
  gdot,
  ge,
  gE,
  gEl,
  gel,
  geq,
  geqq,
  geqslant,
  gescc,
  ges,
  gesdot,
  gesdoto,
  gesdotol,
  gesl,
  gesles,
  Gfr,
  gfr,
  gg,
  Gg,
  ggg,
  gimel,
  GJcy,
  gjcy,
  gla,
  gl,
  glE,
  glj,
  gnap,
  gnapprox,
  gne,
  gnE,
  gneq,
  gneqq,
  gnsim,
  Gopf,
  gopf,
  grave,
  GreaterEqual,
  GreaterEqualLess,
  GreaterFullEqual,
  GreaterGreater,
  GreaterLess,
  GreaterSlantEqual,
  GreaterTilde,
  Gscr,
  gscr,
  gsim,
  gsime,
  gsiml,
  gtcc,
  gtcir,
  gt: gt$2,
  GT: GT$1,
  Gt,
  gtdot,
  gtlPar,
  gtquest,
  gtrapprox,
  gtrarr,
  gtrdot,
  gtreqless,
  gtreqqless,
  gtrless,
  gtrsim,
  gvertneqq,
  gvnE,
  Hacek,
  hairsp,
  half,
  hamilt,
  HARDcy,
  hardcy,
  harrcir,
  harr,
  hArr,
  harrw,
  Hat,
  hbar,
  Hcirc,
  hcirc,
  hearts,
  heartsuit,
  hellip,
  hercon,
  hfr,
  Hfr,
  HilbertSpace,
  hksearow,
  hkswarow,
  hoarr,
  homtht,
  hookleftarrow,
  hookrightarrow,
  hopf,
  Hopf,
  horbar,
  HorizontalLine,
  hscr,
  Hscr,
  hslash,
  Hstrok,
  hstrok,
  HumpDownHump,
  HumpEqual,
  hybull,
  hyphen,
  Iacute: Iacute$1,
  iacute: iacute$1,
  ic,
  Icirc: Icirc$1,
  icirc: icirc$1,
  Icy,
  icy,
  Idot,
  IEcy,
  iecy,
  iexcl: iexcl$1,
  iff,
  ifr,
  Ifr,
  Igrave: Igrave$1,
  igrave: igrave$1,
  ii,
  iiiint,
  iiint,
  iinfin,
  iiota,
  IJlig,
  ijlig,
  Imacr,
  imacr,
  image,
  ImaginaryI,
  imagline,
  imagpart,
  imath,
  Im,
  imof,
  imped,
  Implies,
  incare,
  "in": "\u2208",
  infin,
  infintie,
  inodot,
  intcal,
  int,
  Int,
  integers,
  Integral,
  intercal,
  Intersection,
  intlarhk,
  intprod,
  InvisibleComma,
  InvisibleTimes,
  IOcy,
  iocy,
  Iogon,
  iogon,
  Iopf,
  iopf,
  Iota,
  iota,
  iprod,
  iquest: iquest$1,
  iscr,
  Iscr,
  isin,
  isindot,
  isinE,
  isins,
  isinsv,
  isinv,
  it,
  Itilde,
  itilde,
  Iukcy,
  iukcy,
  Iuml: Iuml$1,
  iuml: iuml$1,
  Jcirc,
  jcirc,
  Jcy,
  jcy,
  Jfr,
  jfr,
  jmath,
  Jopf,
  jopf,
  Jscr,
  jscr,
  Jsercy,
  jsercy,
  Jukcy,
  jukcy,
  Kappa,
  kappa,
  kappav,
  Kcedil,
  kcedil,
  Kcy,
  kcy,
  Kfr,
  kfr,
  kgreen,
  KHcy,
  khcy,
  KJcy,
  kjcy,
  Kopf,
  kopf,
  Kscr,
  kscr,
  lAarr,
  Lacute,
  lacute,
  laemptyv,
  lagran,
  Lambda,
  lambda,
  lang,
  Lang,
  langd,
  langle,
  lap,
  Laplacetrf,
  laquo: laquo$1,
  larrb,
  larrbfs,
  larr,
  Larr,
  lArr,
  larrfs,
  larrhk,
  larrlp,
  larrpl,
  larrsim,
  larrtl,
  latail,
  lAtail,
  lat,
  late,
  lates,
  lbarr,
  lBarr,
  lbbrk,
  lbrace,
  lbrack,
  lbrke,
  lbrksld,
  lbrkslu,
  Lcaron,
  lcaron,
  Lcedil,
  lcedil,
  lceil,
  lcub,
  Lcy,
  lcy,
  ldca,
  ldquo,
  ldquor,
  ldrdhar,
  ldrushar,
  ldsh,
  le,
  lE,
  LeftAngleBracket,
  LeftArrowBar,
  leftarrow,
  LeftArrow,
  Leftarrow,
  LeftArrowRightArrow,
  leftarrowtail,
  LeftCeiling,
  LeftDoubleBracket,
  LeftDownTeeVector,
  LeftDownVectorBar,
  LeftDownVector,
  LeftFloor,
  leftharpoondown,
  leftharpoonup,
  leftleftarrows,
  leftrightarrow,
  LeftRightArrow,
  Leftrightarrow,
  leftrightarrows,
  leftrightharpoons,
  leftrightsquigarrow,
  LeftRightVector,
  LeftTeeArrow,
  LeftTee,
  LeftTeeVector,
  leftthreetimes,
  LeftTriangleBar,
  LeftTriangle,
  LeftTriangleEqual,
  LeftUpDownVector,
  LeftUpTeeVector,
  LeftUpVectorBar,
  LeftUpVector,
  LeftVectorBar,
  LeftVector,
  lEg,
  leg,
  leq,
  leqq,
  leqslant,
  lescc,
  les,
  lesdot,
  lesdoto,
  lesdotor,
  lesg,
  lesges,
  lessapprox,
  lessdot,
  lesseqgtr,
  lesseqqgtr,
  LessEqualGreater,
  LessFullEqual,
  LessGreater,
  lessgtr,
  LessLess,
  lesssim,
  LessSlantEqual,
  LessTilde,
  lfisht,
  lfloor,
  Lfr,
  lfr,
  lg,
  lgE,
  lHar,
  lhard,
  lharu,
  lharul,
  lhblk,
  LJcy,
  ljcy,
  llarr,
  ll,
  Ll,
  llcorner,
  Lleftarrow,
  llhard,
  lltri,
  Lmidot,
  lmidot,
  lmoustache,
  lmoust,
  lnap,
  lnapprox,
  lne,
  lnE,
  lneq,
  lneqq,
  lnsim,
  loang,
  loarr,
  lobrk,
  longleftarrow,
  LongLeftArrow,
  Longleftarrow,
  longleftrightarrow,
  LongLeftRightArrow,
  Longleftrightarrow,
  longmapsto,
  longrightarrow,
  LongRightArrow,
  Longrightarrow,
  looparrowleft,
  looparrowright,
  lopar,
  Lopf,
  lopf,
  loplus,
  lotimes,
  lowast,
  lowbar,
  LowerLeftArrow,
  LowerRightArrow,
  loz,
  lozenge,
  lozf,
  lpar,
  lparlt,
  lrarr,
  lrcorner,
  lrhar,
  lrhard,
  lrm,
  lrtri,
  lsaquo,
  lscr,
  Lscr,
  lsh,
  Lsh,
  lsim,
  lsime,
  lsimg,
  lsqb,
  lsquo,
  lsquor,
  Lstrok,
  lstrok,
  ltcc,
  ltcir,
  lt: lt$2,
  LT: LT$1,
  Lt,
  ltdot,
  lthree,
  ltimes,
  ltlarr,
  ltquest,
  ltri,
  ltrie,
  ltrif,
  ltrPar,
  lurdshar,
  luruhar,
  lvertneqq,
  lvnE,
  macr: macr$1,
  male,
  malt,
  maltese,
  "Map": "\u2905",
  map,
  mapsto,
  mapstodown,
  mapstoleft,
  mapstoup,
  marker,
  mcomma,
  Mcy,
  mcy,
  mdash,
  mDDot,
  measuredangle,
  MediumSpace,
  Mellintrf,
  Mfr,
  mfr,
  mho,
  micro: micro$1,
  midast,
  midcir,
  mid,
  middot: middot$1,
  minusb,
  minus,
  minusd,
  minusdu,
  MinusPlus,
  mlcp,
  mldr,
  mnplus,
  models,
  Mopf,
  mopf,
  mp,
  mscr,
  Mscr,
  mstpos,
  Mu,
  mu,
  multimap,
  mumap,
  nabla,
  Nacute,
  nacute,
  nang,
  nap,
  napE,
  napid,
  napos,
  napprox,
  natural,
  naturals,
  natur,
  nbsp: nbsp$1,
  nbump,
  nbumpe,
  ncap,
  Ncaron,
  ncaron,
  Ncedil,
  ncedil,
  ncong,
  ncongdot,
  ncup,
  Ncy,
  ncy,
  ndash,
  nearhk,
  nearr,
  neArr,
  nearrow,
  ne,
  nedot,
  NegativeMediumSpace,
  NegativeThickSpace,
  NegativeThinSpace,
  NegativeVeryThinSpace,
  nequiv,
  nesear,
  nesim,
  NestedGreaterGreater,
  NestedLessLess,
  NewLine,
  nexist,
  nexists,
  Nfr,
  nfr,
  ngE,
  nge,
  ngeq,
  ngeqq,
  ngeqslant,
  nges,
  nGg,
  ngsim,
  nGt,
  ngt,
  ngtr,
  nGtv,
  nharr,
  nhArr,
  nhpar,
  ni,
  nis,
  nisd,
  niv,
  NJcy,
  njcy,
  nlarr,
  nlArr,
  nldr,
  nlE,
  nle,
  nleftarrow,
  nLeftarrow,
  nleftrightarrow,
  nLeftrightarrow,
  nleq,
  nleqq,
  nleqslant,
  nles,
  nless,
  nLl,
  nlsim,
  nLt,
  nlt,
  nltri,
  nltrie,
  nLtv,
  nmid,
  NoBreak,
  NonBreakingSpace,
  nopf,
  Nopf,
  Not,
  not: not$1,
  NotCongruent,
  NotCupCap,
  NotDoubleVerticalBar,
  NotElement,
  NotEqual,
  NotEqualTilde,
  NotExists,
  NotGreater,
  NotGreaterEqual,
  NotGreaterFullEqual,
  NotGreaterGreater,
  NotGreaterLess,
  NotGreaterSlantEqual,
  NotGreaterTilde,
  NotHumpDownHump,
  NotHumpEqual,
  notin,
  notindot,
  notinE,
  notinva,
  notinvb,
  notinvc,
  NotLeftTriangleBar,
  NotLeftTriangle,
  NotLeftTriangleEqual,
  NotLess,
  NotLessEqual,
  NotLessGreater,
  NotLessLess,
  NotLessSlantEqual,
  NotLessTilde,
  NotNestedGreaterGreater,
  NotNestedLessLess,
  notni,
  notniva,
  notnivb,
  notnivc,
  NotPrecedes,
  NotPrecedesEqual,
  NotPrecedesSlantEqual,
  NotReverseElement,
  NotRightTriangleBar,
  NotRightTriangle,
  NotRightTriangleEqual,
  NotSquareSubset,
  NotSquareSubsetEqual,
  NotSquareSuperset,
  NotSquareSupersetEqual,
  NotSubset,
  NotSubsetEqual,
  NotSucceeds,
  NotSucceedsEqual,
  NotSucceedsSlantEqual,
  NotSucceedsTilde,
  NotSuperset,
  NotSupersetEqual,
  NotTilde,
  NotTildeEqual,
  NotTildeFullEqual,
  NotTildeTilde,
  NotVerticalBar,
  nparallel,
  npar,
  nparsl,
  npart,
  npolint,
  npr,
  nprcue,
  nprec,
  npreceq,
  npre,
  nrarrc,
  nrarr,
  nrArr,
  nrarrw,
  nrightarrow,
  nRightarrow,
  nrtri,
  nrtrie,
  nsc,
  nsccue,
  nsce,
  Nscr,
  nscr,
  nshortmid,
  nshortparallel,
  nsim,
  nsime,
  nsimeq,
  nsmid,
  nspar,
  nsqsube,
  nsqsupe,
  nsub,
  nsubE,
  nsube,
  nsubset,
  nsubseteq,
  nsubseteqq,
  nsucc,
  nsucceq,
  nsup,
  nsupE,
  nsupe,
  nsupset,
  nsupseteq,
  nsupseteqq,
  ntgl,
  Ntilde: Ntilde$1,
  ntilde: ntilde$1,
  ntlg,
  ntriangleleft,
  ntrianglelefteq,
  ntriangleright,
  ntrianglerighteq,
  Nu,
  nu,
  num,
  numero,
  numsp,
  nvap,
  nvdash,
  nvDash,
  nVdash,
  nVDash,
  nvge,
  nvgt,
  nvHarr,
  nvinfin,
  nvlArr,
  nvle,
  nvlt,
  nvltrie,
  nvrArr,
  nvrtrie,
  nvsim,
  nwarhk,
  nwarr,
  nwArr,
  nwarrow,
  nwnear,
  Oacute: Oacute$1,
  oacute: oacute$1,
  oast,
  Ocirc: Ocirc$1,
  ocirc: ocirc$1,
  ocir,
  Ocy,
  ocy,
  odash,
  Odblac,
  odblac,
  odiv,
  odot,
  odsold,
  OElig,
  oelig,
  ofcir,
  Ofr,
  ofr,
  ogon,
  Ograve: Ograve$1,
  ograve: ograve$1,
  ogt,
  ohbar,
  ohm,
  oint,
  olarr,
  olcir,
  olcross,
  oline,
  olt,
  Omacr,
  omacr,
  Omega,
  omega,
  Omicron,
  omicron,
  omid,
  ominus,
  Oopf,
  oopf,
  opar,
  OpenCurlyDoubleQuote,
  OpenCurlyQuote,
  operp,
  oplus,
  orarr,
  Or,
  or,
  ord,
  order: order$1,
  orderof,
  ordf: ordf$1,
  ordm: ordm$1,
  origof,
  oror,
  orslope,
  orv,
  oS,
  Oscr,
  oscr,
  Oslash: Oslash$1,
  oslash: oslash$1,
  osol,
  Otilde: Otilde$1,
  otilde: otilde$1,
  otimesas,
  Otimes,
  otimes,
  Ouml: Ouml$1,
  ouml: ouml$1,
  ovbar,
  OverBar,
  OverBrace,
  OverBracket,
  OverParenthesis,
  para: para$1,
  parallel,
  par,
  parsim,
  parsl,
  part,
  PartialD,
  Pcy,
  pcy,
  percnt,
  period,
  permil,
  perp,
  pertenk,
  Pfr,
  pfr,
  Phi,
  phi,
  phiv,
  phmmat,
  phone,
  Pi,
  pi,
  pitchfork,
  piv,
  planck,
  planckh,
  plankv,
  plusacir,
  plusb,
  pluscir,
  plus,
  plusdo,
  plusdu,
  pluse,
  PlusMinus,
  plusmn: plusmn$1,
  plussim,
  plustwo,
  pm,
  Poincareplane,
  pointint,
  popf,
  Popf,
  pound: pound$1,
  prap,
  Pr,
  pr,
  prcue,
  precapprox,
  prec,
  preccurlyeq,
  Precedes,
  PrecedesEqual,
  PrecedesSlantEqual,
  PrecedesTilde,
  preceq,
  precnapprox,
  precneqq,
  precnsim,
  pre,
  prE,
  precsim,
  prime,
  Prime,
  primes,
  prnap,
  prnE,
  prnsim,
  prod,
  Product,
  profalar,
  profline,
  profsurf,
  prop,
  Proportional,
  Proportion,
  propto,
  prsim,
  prurel,
  Pscr,
  pscr,
  Psi,
  psi,
  puncsp,
  Qfr,
  qfr,
  qint,
  qopf,
  Qopf,
  qprime,
  Qscr,
  qscr,
  quaternions,
  quatint,
  quest,
  questeq,
  quot: quot$2,
  QUOT: QUOT$1,
  rAarr,
  race,
  Racute,
  racute,
  radic,
  raemptyv,
  rang,
  Rang,
  rangd,
  range,
  rangle,
  raquo: raquo$1,
  rarrap,
  rarrb,
  rarrbfs,
  rarrc,
  rarr,
  Rarr,
  rArr,
  rarrfs,
  rarrhk,
  rarrlp,
  rarrpl,
  rarrsim,
  Rarrtl,
  rarrtl,
  rarrw,
  ratail,
  rAtail,
  ratio,
  rationals,
  rbarr,
  rBarr,
  RBarr,
  rbbrk,
  rbrace,
  rbrack,
  rbrke,
  rbrksld,
  rbrkslu,
  Rcaron,
  rcaron,
  Rcedil,
  rcedil,
  rceil,
  rcub,
  Rcy,
  rcy,
  rdca,
  rdldhar,
  rdquo,
  rdquor,
  rdsh,
  real,
  realine,
  realpart,
  reals,
  Re,
  rect,
  reg: reg$1,
  REG: REG$1,
  ReverseElement,
  ReverseEquilibrium,
  ReverseUpEquilibrium,
  rfisht,
  rfloor,
  rfr,
  Rfr,
  rHar,
  rhard,
  rharu,
  rharul,
  Rho,
  rho,
  rhov,
  RightAngleBracket,
  RightArrowBar,
  rightarrow,
  RightArrow,
  Rightarrow,
  RightArrowLeftArrow,
  rightarrowtail,
  RightCeiling,
  RightDoubleBracket,
  RightDownTeeVector,
  RightDownVectorBar,
  RightDownVector,
  RightFloor,
  rightharpoondown,
  rightharpoonup,
  rightleftarrows,
  rightleftharpoons,
  rightrightarrows,
  rightsquigarrow,
  RightTeeArrow,
  RightTee,
  RightTeeVector,
  rightthreetimes,
  RightTriangleBar,
  RightTriangle,
  RightTriangleEqual,
  RightUpDownVector,
  RightUpTeeVector,
  RightUpVectorBar,
  RightUpVector,
  RightVectorBar,
  RightVector,
  ring,
  risingdotseq,
  rlarr,
  rlhar,
  rlm,
  rmoustache,
  rmoust,
  rnmid,
  roang,
  roarr,
  robrk,
  ropar,
  ropf,
  Ropf,
  roplus,
  rotimes,
  RoundImplies,
  rpar,
  rpargt,
  rppolint,
  rrarr,
  Rrightarrow,
  rsaquo,
  rscr,
  Rscr,
  rsh,
  Rsh,
  rsqb,
  rsquo,
  rsquor,
  rthree,
  rtimes,
  rtri,
  rtrie,
  rtrif,
  rtriltri,
  RuleDelayed,
  ruluhar,
  rx,
  Sacute,
  sacute,
  sbquo,
  scap,
  Scaron,
  scaron,
  Sc,
  sc,
  sccue,
  sce,
  scE,
  Scedil,
  scedil,
  Scirc,
  scirc,
  scnap,
  scnE,
  scnsim,
  scpolint,
  scsim,
  Scy,
  scy,
  sdotb,
  sdot,
  sdote,
  searhk,
  searr,
  seArr,
  searrow,
  sect: sect$1,
  semi,
  seswar,
  setminus,
  setmn,
  sext,
  Sfr,
  sfr,
  sfrown,
  sharp,
  SHCHcy,
  shchcy,
  SHcy,
  shcy,
  ShortDownArrow,
  ShortLeftArrow,
  shortmid,
  shortparallel,
  ShortRightArrow,
  ShortUpArrow,
  shy: shy$1,
  Sigma,
  sigma,
  sigmaf,
  sigmav,
  sim,
  simdot,
  sime,
  simeq,
  simg,
  simgE,
  siml,
  simlE,
  simne,
  simplus,
  simrarr,
  slarr,
  SmallCircle,
  smallsetminus,
  smashp,
  smeparsl,
  smid,
  smile,
  smt,
  smte,
  smtes,
  SOFTcy,
  softcy,
  solbar,
  solb,
  sol,
  Sopf,
  sopf,
  spades,
  spadesuit,
  spar,
  sqcap,
  sqcaps,
  sqcup,
  sqcups,
  Sqrt,
  sqsub,
  sqsube,
  sqsubset,
  sqsubseteq,
  sqsup,
  sqsupe,
  sqsupset,
  sqsupseteq,
  square,
  Square,
  SquareIntersection,
  SquareSubset,
  SquareSubsetEqual,
  SquareSuperset,
  SquareSupersetEqual,
  SquareUnion,
  squarf,
  squ,
  squf,
  srarr,
  Sscr,
  sscr,
  ssetmn,
  ssmile,
  sstarf,
  Star,
  star,
  starf,
  straightepsilon,
  straightphi,
  strns,
  sub,
  Sub,
  subdot,
  subE,
  sube,
  subedot,
  submult,
  subnE,
  subne,
  subplus,
  subrarr,
  subset,
  Subset,
  subseteq,
  subseteqq,
  SubsetEqual,
  subsetneq,
  subsetneqq,
  subsim,
  subsub,
  subsup,
  succapprox,
  succ,
  succcurlyeq,
  Succeeds,
  SucceedsEqual,
  SucceedsSlantEqual,
  SucceedsTilde,
  succeq,
  succnapprox,
  succneqq,
  succnsim,
  succsim,
  SuchThat,
  sum,
  Sum,
  sung,
  sup1: sup1$1,
  sup2: sup2$1,
  sup3: sup3$1,
  sup,
  Sup,
  supdot,
  supdsub,
  supE,
  supe,
  supedot,
  Superset,
  SupersetEqual,
  suphsol,
  suphsub,
  suplarr,
  supmult,
  supnE,
  supne,
  supplus,
  supset,
  Supset,
  supseteq,
  supseteqq,
  supsetneq,
  supsetneqq,
  supsim,
  supsub,
  supsup,
  swarhk,
  swarr,
  swArr,
  swarrow,
  swnwar,
  szlig: szlig$1,
  Tab,
  target,
  Tau,
  tau,
  tbrk,
  Tcaron,
  tcaron,
  Tcedil,
  tcedil,
  Tcy,
  tcy,
  tdot,
  telrec,
  Tfr,
  tfr,
  there4,
  therefore,
  Therefore,
  Theta,
  theta,
  thetasym,
  thetav,
  thickapprox,
  thicksim,
  ThickSpace,
  ThinSpace,
  thinsp,
  thkap,
  thksim,
  THORN: THORN$1,
  thorn: thorn$1,
  tilde,
  Tilde,
  TildeEqual,
  TildeFullEqual,
  TildeTilde,
  timesbar,
  timesb,
  times: times$1,
  timesd,
  tint,
  toea,
  topbot,
  topcir,
  top: top$1,
  Topf,
  topf,
  topfork,
  tosa,
  tprime,
  trade,
  TRADE,
  triangle,
  triangledown,
  triangleleft,
  trianglelefteq,
  triangleq,
  triangleright,
  trianglerighteq,
  tridot,
  trie,
  triminus,
  TripleDot,
  triplus,
  trisb,
  tritime,
  trpezium,
  Tscr,
  tscr,
  TScy,
  tscy,
  TSHcy,
  tshcy,
  Tstrok,
  tstrok,
  twixt,
  twoheadleftarrow,
  twoheadrightarrow,
  Uacute: Uacute$1,
  uacute: uacute$1,
  uarr,
  Uarr,
  uArr,
  Uarrocir,
  Ubrcy,
  ubrcy,
  Ubreve,
  ubreve,
  Ucirc: Ucirc$1,
  ucirc: ucirc$1,
  Ucy,
  ucy,
  udarr,
  Udblac,
  udblac,
  udhar,
  ufisht,
  Ufr,
  ufr,
  Ugrave: Ugrave$1,
  ugrave: ugrave$1,
  uHar,
  uharl,
  uharr,
  uhblk,
  ulcorn,
  ulcorner,
  ulcrop,
  ultri,
  Umacr,
  umacr,
  uml: uml$1,
  UnderBar,
  UnderBrace,
  UnderBracket,
  UnderParenthesis,
  Union,
  UnionPlus,
  Uogon,
  uogon,
  Uopf,
  uopf,
  UpArrowBar,
  uparrow,
  UpArrow,
  Uparrow,
  UpArrowDownArrow,
  updownarrow,
  UpDownArrow,
  Updownarrow,
  UpEquilibrium,
  upharpoonleft,
  upharpoonright,
  uplus,
  UpperLeftArrow,
  UpperRightArrow,
  upsi,
  Upsi,
  upsih,
  Upsilon,
  upsilon,
  UpTeeArrow,
  UpTee,
  upuparrows,
  urcorn,
  urcorner,
  urcrop,
  Uring,
  uring,
  urtri,
  Uscr,
  uscr,
  utdot,
  Utilde,
  utilde,
  utri,
  utrif,
  uuarr,
  Uuml: Uuml$1,
  uuml: uuml$1,
  uwangle,
  vangrt,
  varepsilon,
  varkappa,
  varnothing,
  varphi,
  varpi,
  varpropto,
  varr,
  vArr,
  varrho,
  varsigma,
  varsubsetneq,
  varsubsetneqq,
  varsupsetneq,
  varsupsetneqq,
  vartheta,
  vartriangleleft,
  vartriangleright,
  vBar,
  Vbar,
  vBarv,
  Vcy,
  vcy,
  vdash,
  vDash,
  Vdash,
  VDash,
  Vdashl,
  veebar,
  vee,
  Vee,
  veeeq,
  vellip,
  verbar,
  Verbar,
  vert,
  Vert,
  VerticalBar,
  VerticalLine,
  VerticalSeparator,
  VerticalTilde,
  VeryThinSpace,
  Vfr,
  vfr,
  vltri,
  vnsub,
  vnsup,
  Vopf,
  vopf,
  vprop,
  vrtri,
  Vscr,
  vscr,
  vsubnE,
  vsubne,
  vsupnE,
  vsupne,
  Vvdash,
  vzigzag,
  Wcirc,
  wcirc,
  wedbar,
  wedge,
  Wedge,
  wedgeq,
  weierp,
  Wfr,
  wfr,
  Wopf,
  wopf,
  wp,
  wr,
  wreath,
  Wscr,
  wscr,
  xcap,
  xcirc,
  xcup,
  xdtri,
  Xfr,
  xfr,
  xharr,
  xhArr,
  Xi,
  xi,
  xlarr,
  xlArr,
  xmap,
  xnis,
  xodot,
  Xopf,
  xopf,
  xoplus,
  xotime,
  xrarr,
  xrArr,
  Xscr,
  xscr,
  xsqcup,
  xuplus,
  xutri,
  xvee,
  xwedge,
  Yacute: Yacute$1,
  yacute: yacute$1,
  YAcy,
  yacy,
  Ycirc,
  ycirc,
  Ycy,
  ycy,
  yen: yen$1,
  Yfr,
  yfr,
  YIcy,
  yicy,
  Yopf,
  yopf,
  Yscr,
  yscr,
  YUcy,
  yucy,
  yuml: yuml$1,
  Yuml,
  Zacute,
  zacute,
  Zcaron,
  zcaron,
  Zcy,
  zcy,
  Zdot,
  zdot,
  zeetrf,
  ZeroWidthSpace,
  Zeta,
  zeta,
  zfr,
  Zfr,
  ZHcy,
  zhcy,
  zigrarr,
  zopf,
  Zopf,
  Zscr,
  zscr,
  zwj,
  zwnj
};
const Aacute = "\xC1";
const aacute = "\xE1";
const Acirc = "\xC2";
const acirc = "\xE2";
const acute = "\xB4";
const AElig = "\xC6";
const aelig = "\xE6";
const Agrave = "\xC0";
const agrave = "\xE0";
const amp$1 = "&";
const AMP = "&";
const Aring = "\xC5";
const aring = "\xE5";
const Atilde = "\xC3";
const atilde = "\xE3";
const Auml = "\xC4";
const auml = "\xE4";
const brvbar = "\xA6";
const Ccedil = "\xC7";
const ccedil = "\xE7";
const cedil = "\xB8";
const cent = "\xA2";
const copy = "\xA9";
const COPY = "\xA9";
const curren = "\xA4";
const deg = "\xB0";
const divide = "\xF7";
const Eacute = "\xC9";
const eacute = "\xE9";
const Ecirc = "\xCA";
const ecirc = "\xEA";
const Egrave = "\xC8";
const egrave = "\xE8";
const ETH = "\xD0";
const eth = "\xF0";
const Euml = "\xCB";
const euml = "\xEB";
const frac12 = "\xBD";
const frac14 = "\xBC";
const frac34 = "\xBE";
const gt$1 = ">";
const GT = ">";
const Iacute = "\xCD";
const iacute = "\xED";
const Icirc = "\xCE";
const icirc = "\xEE";
const iexcl = "\xA1";
const Igrave = "\xCC";
const igrave = "\xEC";
const iquest = "\xBF";
const Iuml = "\xCF";
const iuml = "\xEF";
const laquo = "\xAB";
const lt$1 = "<";
const LT = "<";
const macr = "\xAF";
const micro = "\xB5";
const middot = "\xB7";
const nbsp = "\xA0";
const not = "\xAC";
const Ntilde = "\xD1";
const ntilde = "\xF1";
const Oacute = "\xD3";
const oacute = "\xF3";
const Ocirc = "\xD4";
const ocirc = "\xF4";
const Ograve = "\xD2";
const ograve = "\xF2";
const ordf = "\xAA";
const ordm = "\xBA";
const Oslash = "\xD8";
const oslash = "\xF8";
const Otilde = "\xD5";
const otilde = "\xF5";
const Ouml = "\xD6";
const ouml = "\xF6";
const para = "\xB6";
const plusmn = "\xB1";
const pound = "\xA3";
const quot$1 = '"';
const QUOT = '"';
const raquo = "\xBB";
const reg = "\xAE";
const REG = "\xAE";
const sect = "\xA7";
const shy = "\xAD";
const sup1 = "\xB9";
const sup2 = "\xB2";
const sup3 = "\xB3";
const szlig = "\xDF";
const THORN = "\xDE";
const thorn = "\xFE";
const times = "\xD7";
const Uacute = "\xDA";
const uacute = "\xFA";
const Ucirc = "\xDB";
const ucirc = "\xFB";
const Ugrave = "\xD9";
const ugrave = "\xF9";
const uml = "\xA8";
const Uuml = "\xDC";
const uuml = "\xFC";
const Yacute = "\xDD";
const yacute = "\xFD";
const yen = "\xA5";
const yuml = "\xFF";
var require$$1$1 = {
  Aacute,
  aacute,
  Acirc,
  acirc,
  acute,
  AElig,
  aelig,
  Agrave,
  agrave,
  amp: amp$1,
  AMP,
  Aring,
  aring,
  Atilde,
  atilde,
  Auml,
  auml,
  brvbar,
  Ccedil,
  ccedil,
  cedil,
  cent,
  copy,
  COPY,
  curren,
  deg,
  divide,
  Eacute,
  eacute,
  Ecirc,
  ecirc,
  Egrave,
  egrave,
  ETH,
  eth,
  Euml,
  euml,
  frac12,
  frac14,
  frac34,
  gt: gt$1,
  GT,
  Iacute,
  iacute,
  Icirc,
  icirc,
  iexcl,
  Igrave,
  igrave,
  iquest,
  Iuml,
  iuml,
  laquo,
  lt: lt$1,
  LT,
  macr,
  micro,
  middot,
  nbsp,
  not,
  Ntilde,
  ntilde,
  Oacute,
  oacute,
  Ocirc,
  ocirc,
  Ograve,
  ograve,
  ordf,
  ordm,
  Oslash,
  oslash,
  Otilde,
  otilde,
  Ouml,
  ouml,
  para,
  plusmn,
  pound,
  quot: quot$1,
  QUOT,
  raquo,
  reg,
  REG,
  sect,
  shy,
  sup1,
  sup2,
  sup3,
  szlig,
  THORN,
  thorn,
  times,
  Uacute,
  uacute,
  Ucirc,
  ucirc,
  Ugrave,
  ugrave,
  uml,
  Uuml,
  uuml,
  Yacute,
  yacute,
  yen,
  yuml
};
const amp = "&";
const apos = "'";
const gt = ">";
const lt = "<";
const quot = '"';
var require$$0$2 = {
  amp,
  apos,
  gt,
  lt,
  quot
};
var decode_codepoint = {};
var require$$0$1 = {
  "0": 65533,
  "128": 8364,
  "130": 8218,
  "131": 402,
  "132": 8222,
  "133": 8230,
  "134": 8224,
  "135": 8225,
  "136": 710,
  "137": 8240,
  "138": 352,
  "139": 8249,
  "140": 338,
  "142": 381,
  "145": 8216,
  "146": 8217,
  "147": 8220,
  "148": 8221,
  "149": 8226,
  "150": 8211,
  "151": 8212,
  "152": 732,
  "153": 8482,
  "154": 353,
  "155": 8250,
  "156": 339,
  "158": 382,
  "159": 376
};
var __importDefault$7 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(decode_codepoint, "__esModule", { value: true });
var decode_json_1 = __importDefault$7(require$$0$1);
var fromCodePoint = String.fromCodePoint || function(codePoint) {
  var output = "";
  if (codePoint > 65535) {
    codePoint -= 65536;
    output += String.fromCharCode(codePoint >>> 10 & 1023 | 55296);
    codePoint = 56320 | codePoint & 1023;
  }
  output += String.fromCharCode(codePoint);
  return output;
};
function decodeCodePoint(codePoint) {
  if (codePoint >= 55296 && codePoint <= 57343 || codePoint > 1114111) {
    return "\uFFFD";
  }
  if (codePoint in decode_json_1.default) {
    codePoint = decode_json_1.default[codePoint];
  }
  return fromCodePoint(codePoint);
}
decode_codepoint.default = decodeCodePoint;
var __importDefault$6 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(decode$1, "__esModule", { value: true });
decode$1.decodeHTML = decode$1.decodeHTMLStrict = decode$1.decodeXML = void 0;
var entities_json_1$1 = __importDefault$6(require$$1$2);
var legacy_json_1 = __importDefault$6(require$$1$1);
var xml_json_1$1 = __importDefault$6(require$$0$2);
var decode_codepoint_1 = __importDefault$6(decode_codepoint);
var strictEntityRe = /&(?:[a-zA-Z0-9]+|#[xX][\da-fA-F]+|#\d+);/g;
decode$1.decodeXML = getStrictDecoder(xml_json_1$1.default);
decode$1.decodeHTMLStrict = getStrictDecoder(entities_json_1$1.default);
function getStrictDecoder(map2) {
  var replace = getReplacer(map2);
  return function(str) {
    return String(str).replace(strictEntityRe, replace);
  };
}
var sorter = function(a, b) {
  return a < b ? 1 : -1;
};
decode$1.decodeHTML = function() {
  var legacy2 = Object.keys(legacy_json_1.default).sort(sorter);
  var keys = Object.keys(entities_json_1$1.default).sort(sorter);
  for (var i = 0, j = 0; i < keys.length; i++) {
    if (legacy2[j] === keys[i]) {
      keys[i] += ";?";
      j++;
    } else {
      keys[i] += ";";
    }
  }
  var re = new RegExp("&(?:" + keys.join("|") + "|#[xX][\\da-fA-F]+;?|#\\d+;?)", "g");
  var replace = getReplacer(entities_json_1$1.default);
  function replacer2(str) {
    if (str.substr(-1) !== ";")
      str += ";";
    return replace(str);
  }
  return function(str) {
    return String(str).replace(re, replacer2);
  };
}();
function getReplacer(map2) {
  return function replace(str) {
    if (str.charAt(1) === "#") {
      var secondChar = str.charAt(2);
      if (secondChar === "X" || secondChar === "x") {
        return decode_codepoint_1.default(parseInt(str.substr(3), 16));
      }
      return decode_codepoint_1.default(parseInt(str.substr(2), 10));
    }
    return map2[str.slice(1, -1)] || str;
  };
}
var encode = {};
var __importDefault$5 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(encode, "__esModule", { value: true });
encode.escapeUTF8 = encode.escape = encode.encodeNonAsciiHTML = encode.encodeHTML = encode.encodeXML = void 0;
var xml_json_1 = __importDefault$5(require$$0$2);
var inverseXML = getInverseObj(xml_json_1.default);
var xmlReplacer = getInverseReplacer(inverseXML);
encode.encodeXML = getASCIIEncoder(inverseXML);
var entities_json_1 = __importDefault$5(require$$1$2);
var inverseHTML = getInverseObj(entities_json_1.default);
var htmlReplacer = getInverseReplacer(inverseHTML);
encode.encodeHTML = getInverse(inverseHTML, htmlReplacer);
encode.encodeNonAsciiHTML = getASCIIEncoder(inverseHTML);
function getInverseObj(obj) {
  return Object.keys(obj).sort().reduce(function(inverse, name) {
    inverse[obj[name]] = "&" + name + ";";
    return inverse;
  }, {});
}
function getInverseReplacer(inverse) {
  var single = [];
  var multiple = [];
  for (var _i = 0, _a = Object.keys(inverse); _i < _a.length; _i++) {
    var k = _a[_i];
    if (k.length === 1) {
      single.push("\\" + k);
    } else {
      multiple.push(k);
    }
  }
  single.sort();
  for (var start2 = 0; start2 < single.length - 1; start2++) {
    var end2 = start2;
    while (end2 < single.length - 1 && single[end2].charCodeAt(1) + 1 === single[end2 + 1].charCodeAt(1)) {
      end2 += 1;
    }
    var count = 1 + end2 - start2;
    if (count < 3)
      continue;
    single.splice(start2, count, single[start2] + "-" + single[end2]);
  }
  multiple.unshift("[" + single.join("") + "]");
  return new RegExp(multiple.join("|"), "g");
}
var reNonASCII = /(?:[\x80-\uD7FF\uE000-\uFFFF]|[\uD800-\uDBFF][\uDC00-\uDFFF]|[\uD800-\uDBFF](?![\uDC00-\uDFFF])|(?:[^\uD800-\uDBFF]|^)[\uDC00-\uDFFF])/g;
var getCodePoint = String.prototype.codePointAt != null ? function(str) {
  return str.codePointAt(0);
} : function(c) {
  return (c.charCodeAt(0) - 55296) * 1024 + c.charCodeAt(1) - 56320 + 65536;
};
function singleCharReplacer(c) {
  return "&#x" + (c.length > 1 ? getCodePoint(c) : c.charCodeAt(0)).toString(16).toUpperCase() + ";";
}
function getInverse(inverse, re) {
  return function(data) {
    return data.replace(re, function(name) {
      return inverse[name];
    }).replace(reNonASCII, singleCharReplacer);
  };
}
var reEscapeChars = new RegExp(xmlReplacer.source + "|" + reNonASCII.source, "g");
function escape(data) {
  return data.replace(reEscapeChars, singleCharReplacer);
}
encode.escape = escape;
function escapeUTF8(data) {
  return data.replace(xmlReplacer, singleCharReplacer);
}
encode.escapeUTF8 = escapeUTF8;
function getASCIIEncoder(obj) {
  return function(data) {
    return data.replace(reEscapeChars, function(c) {
      return obj[c] || singleCharReplacer(c);
    });
  };
}
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.decodeXMLStrict = exports.decodeHTML5Strict = exports.decodeHTML4Strict = exports.decodeHTML5 = exports.decodeHTML4 = exports.decodeHTMLStrict = exports.decodeHTML = exports.decodeXML = exports.encodeHTML5 = exports.encodeHTML4 = exports.escapeUTF8 = exports.escape = exports.encodeNonAsciiHTML = exports.encodeHTML = exports.encodeXML = exports.encode = exports.decodeStrict = exports.decode = void 0;
  var decode_1 = decode$1;
  var encode_1 = encode;
  function decode2(data, level) {
    return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTML)(data);
  }
  exports.decode = decode2;
  function decodeStrict(data, level) {
    return (!level || level <= 0 ? decode_1.decodeXML : decode_1.decodeHTMLStrict)(data);
  }
  exports.decodeStrict = decodeStrict;
  function encode$1(data, level) {
    return (!level || level <= 0 ? encode_1.encodeXML : encode_1.encodeHTML)(data);
  }
  exports.encode = encode$1;
  var encode_2 = encode;
  Object.defineProperty(exports, "encodeXML", { enumerable: true, get: function() {
    return encode_2.encodeXML;
  } });
  Object.defineProperty(exports, "encodeHTML", { enumerable: true, get: function() {
    return encode_2.encodeHTML;
  } });
  Object.defineProperty(exports, "encodeNonAsciiHTML", { enumerable: true, get: function() {
    return encode_2.encodeNonAsciiHTML;
  } });
  Object.defineProperty(exports, "escape", { enumerable: true, get: function() {
    return encode_2.escape;
  } });
  Object.defineProperty(exports, "escapeUTF8", { enumerable: true, get: function() {
    return encode_2.escapeUTF8;
  } });
  Object.defineProperty(exports, "encodeHTML4", { enumerable: true, get: function() {
    return encode_2.encodeHTML;
  } });
  Object.defineProperty(exports, "encodeHTML5", { enumerable: true, get: function() {
    return encode_2.encodeHTML;
  } });
  var decode_2 = decode$1;
  Object.defineProperty(exports, "decodeXML", { enumerable: true, get: function() {
    return decode_2.decodeXML;
  } });
  Object.defineProperty(exports, "decodeHTML", { enumerable: true, get: function() {
    return decode_2.decodeHTML;
  } });
  Object.defineProperty(exports, "decodeHTMLStrict", { enumerable: true, get: function() {
    return decode_2.decodeHTMLStrict;
  } });
  Object.defineProperty(exports, "decodeHTML4", { enumerable: true, get: function() {
    return decode_2.decodeHTML;
  } });
  Object.defineProperty(exports, "decodeHTML5", { enumerable: true, get: function() {
    return decode_2.decodeHTML;
  } });
  Object.defineProperty(exports, "decodeHTML4Strict", { enumerable: true, get: function() {
    return decode_2.decodeHTMLStrict;
  } });
  Object.defineProperty(exports, "decodeHTML5Strict", { enumerable: true, get: function() {
    return decode_2.decodeHTMLStrict;
  } });
  Object.defineProperty(exports, "decodeXMLStrict", { enumerable: true, get: function() {
    return decode_2.decodeXML;
  } });
})(lib$2);
var foreignNames = {};
Object.defineProperty(foreignNames, "__esModule", { value: true });
foreignNames.attributeNames = foreignNames.elementNames = void 0;
foreignNames.elementNames = new Map([
  ["altglyph", "altGlyph"],
  ["altglyphdef", "altGlyphDef"],
  ["altglyphitem", "altGlyphItem"],
  ["animatecolor", "animateColor"],
  ["animatemotion", "animateMotion"],
  ["animatetransform", "animateTransform"],
  ["clippath", "clipPath"],
  ["feblend", "feBlend"],
  ["fecolormatrix", "feColorMatrix"],
  ["fecomponenttransfer", "feComponentTransfer"],
  ["fecomposite", "feComposite"],
  ["feconvolvematrix", "feConvolveMatrix"],
  ["fediffuselighting", "feDiffuseLighting"],
  ["fedisplacementmap", "feDisplacementMap"],
  ["fedistantlight", "feDistantLight"],
  ["fedropshadow", "feDropShadow"],
  ["feflood", "feFlood"],
  ["fefunca", "feFuncA"],
  ["fefuncb", "feFuncB"],
  ["fefuncg", "feFuncG"],
  ["fefuncr", "feFuncR"],
  ["fegaussianblur", "feGaussianBlur"],
  ["feimage", "feImage"],
  ["femerge", "feMerge"],
  ["femergenode", "feMergeNode"],
  ["femorphology", "feMorphology"],
  ["feoffset", "feOffset"],
  ["fepointlight", "fePointLight"],
  ["fespecularlighting", "feSpecularLighting"],
  ["fespotlight", "feSpotLight"],
  ["fetile", "feTile"],
  ["feturbulence", "feTurbulence"],
  ["foreignobject", "foreignObject"],
  ["glyphref", "glyphRef"],
  ["lineargradient", "linearGradient"],
  ["radialgradient", "radialGradient"],
  ["textpath", "textPath"]
]);
foreignNames.attributeNames = new Map([
  ["definitionurl", "definitionURL"],
  ["attributename", "attributeName"],
  ["attributetype", "attributeType"],
  ["basefrequency", "baseFrequency"],
  ["baseprofile", "baseProfile"],
  ["calcmode", "calcMode"],
  ["clippathunits", "clipPathUnits"],
  ["diffuseconstant", "diffuseConstant"],
  ["edgemode", "edgeMode"],
  ["filterunits", "filterUnits"],
  ["glyphref", "glyphRef"],
  ["gradienttransform", "gradientTransform"],
  ["gradientunits", "gradientUnits"],
  ["kernelmatrix", "kernelMatrix"],
  ["kernelunitlength", "kernelUnitLength"],
  ["keypoints", "keyPoints"],
  ["keysplines", "keySplines"],
  ["keytimes", "keyTimes"],
  ["lengthadjust", "lengthAdjust"],
  ["limitingconeangle", "limitingConeAngle"],
  ["markerheight", "markerHeight"],
  ["markerunits", "markerUnits"],
  ["markerwidth", "markerWidth"],
  ["maskcontentunits", "maskContentUnits"],
  ["maskunits", "maskUnits"],
  ["numoctaves", "numOctaves"],
  ["pathlength", "pathLength"],
  ["patterncontentunits", "patternContentUnits"],
  ["patterntransform", "patternTransform"],
  ["patternunits", "patternUnits"],
  ["pointsatx", "pointsAtX"],
  ["pointsaty", "pointsAtY"],
  ["pointsatz", "pointsAtZ"],
  ["preservealpha", "preserveAlpha"],
  ["preserveaspectratio", "preserveAspectRatio"],
  ["primitiveunits", "primitiveUnits"],
  ["refx", "refX"],
  ["refy", "refY"],
  ["repeatcount", "repeatCount"],
  ["repeatdur", "repeatDur"],
  ["requiredextensions", "requiredExtensions"],
  ["requiredfeatures", "requiredFeatures"],
  ["specularconstant", "specularConstant"],
  ["specularexponent", "specularExponent"],
  ["spreadmethod", "spreadMethod"],
  ["startoffset", "startOffset"],
  ["stddeviation", "stdDeviation"],
  ["stitchtiles", "stitchTiles"],
  ["surfacescale", "surfaceScale"],
  ["systemlanguage", "systemLanguage"],
  ["tablevalues", "tableValues"],
  ["targetx", "targetX"],
  ["targety", "targetY"],
  ["textlength", "textLength"],
  ["viewbox", "viewBox"],
  ["viewtarget", "viewTarget"],
  ["xchannelselector", "xChannelSelector"],
  ["ychannelselector", "yChannelSelector"],
  ["zoomandpan", "zoomAndPan"]
]);
var __assign$1 = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign$1 = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p2 in s)
        if (Object.prototype.hasOwnProperty.call(s, p2))
          t[p2] = s[p2];
    }
    return t;
  };
  return __assign$1.apply(this, arguments);
};
var __createBinding = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  Object.defineProperty(o, k2, { enumerable: true, get: function() {
    return m[k];
  } });
} : function(o, m, k, k2) {
  if (k2 === void 0)
    k2 = k;
  o[k2] = m[k];
});
var __setModuleDefault = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
  Object.defineProperty(o, "default", { enumerable: true, value: v });
} : function(o, v) {
  o["default"] = v;
});
var __importStar = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
  if (mod && mod.__esModule)
    return mod;
  var result = {};
  if (mod != null) {
    for (var k in mod)
      if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
        __createBinding(result, mod, k);
  }
  __setModuleDefault(result, mod);
  return result;
};
Object.defineProperty(lib$3, "__esModule", { value: true });
var ElementType = __importStar(lib$4);
var entities_1 = lib$2;
var foreignNames_1 = foreignNames;
var unencodedElements = new Set([
  "style",
  "script",
  "xmp",
  "iframe",
  "noembed",
  "noframes",
  "plaintext",
  "noscript"
]);
function formatAttributes(attributes2, opts) {
  if (!attributes2)
    return;
  return Object.keys(attributes2).map(function(key) {
    var _a, _b;
    var value = (_a = attributes2[key]) !== null && _a !== void 0 ? _a : "";
    if (opts.xmlMode === "foreign") {
      key = (_b = foreignNames_1.attributeNames.get(key)) !== null && _b !== void 0 ? _b : key;
    }
    if (!opts.emptyAttrs && !opts.xmlMode && value === "") {
      return key;
    }
    return key + '="' + (opts.decodeEntities !== false ? entities_1.encodeXML(value) : value.replace(/"/g, "&quot;")) + '"';
  }).join(" ");
}
var singleTag = new Set([
  "area",
  "base",
  "basefont",
  "br",
  "col",
  "command",
  "embed",
  "frame",
  "hr",
  "img",
  "input",
  "isindex",
  "keygen",
  "link",
  "meta",
  "param",
  "source",
  "track",
  "wbr"
]);
function render$X(node2, options) {
  if (options === void 0) {
    options = {};
  }
  var nodes = "length" in node2 ? node2 : [node2];
  var output = "";
  for (var i = 0; i < nodes.length; i++) {
    output += renderNode(nodes[i], options);
  }
  return output;
}
lib$3.default = render$X;
function renderNode(node2, options) {
  switch (node2.type) {
    case ElementType.Root:
      return render$X(node2.children, options);
    case ElementType.Directive:
    case ElementType.Doctype:
      return renderDirective(node2);
    case ElementType.Comment:
      return renderComment(node2);
    case ElementType.CDATA:
      return renderCdata(node2);
    case ElementType.Script:
    case ElementType.Style:
    case ElementType.Tag:
      return renderTag(node2, options);
    case ElementType.Text:
      return renderText(node2, options);
  }
}
var foreignModeIntegrationPoints = new Set([
  "mi",
  "mo",
  "mn",
  "ms",
  "mtext",
  "annotation-xml",
  "foreignObject",
  "desc",
  "title"
]);
var foreignElements = new Set(["svg", "math"]);
function renderTag(elem, opts) {
  var _a;
  if (opts.xmlMode === "foreign") {
    elem.name = (_a = foreignNames_1.elementNames.get(elem.name)) !== null && _a !== void 0 ? _a : elem.name;
    if (elem.parent && foreignModeIntegrationPoints.has(elem.parent.name)) {
      opts = __assign$1(__assign$1({}, opts), { xmlMode: false });
    }
  }
  if (!opts.xmlMode && foreignElements.has(elem.name)) {
    opts = __assign$1(__assign$1({}, opts), { xmlMode: "foreign" });
  }
  var tag = "<" + elem.name;
  var attribs = formatAttributes(elem.attribs, opts);
  if (attribs) {
    tag += " " + attribs;
  }
  if (elem.children.length === 0 && (opts.xmlMode ? opts.selfClosingTags !== false : opts.selfClosingTags && singleTag.has(elem.name))) {
    if (!opts.xmlMode)
      tag += " ";
    tag += "/>";
  } else {
    tag += ">";
    if (elem.children.length > 0) {
      tag += render$X(elem.children, opts);
    }
    if (opts.xmlMode || !singleTag.has(elem.name)) {
      tag += "</" + elem.name + ">";
    }
  }
  return tag;
}
function renderDirective(elem) {
  return "<" + elem.data + ">";
}
function renderText(elem, opts) {
  var data = elem.data || "";
  if (opts.decodeEntities !== false && !(!opts.xmlMode && elem.parent && unencodedElements.has(elem.parent.name))) {
    data = entities_1.encodeXML(data);
  }
  return data;
}
function renderCdata(elem) {
  return "<![CDATA[" + elem.children[0].data + "]]>";
}
function renderComment(elem) {
  return "<!--" + elem.data + "-->";
}
var __importDefault$4 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(stringify$2, "__esModule", { value: true });
stringify$2.innerText = stringify$2.textContent = stringify$2.getText = stringify$2.getInnerHTML = stringify$2.getOuterHTML = void 0;
var domhandler_1$4 = lib$5;
var dom_serializer_1 = __importDefault$4(lib$3);
var domelementtype_1 = lib$4;
function getOuterHTML(node2, options) {
  return (0, dom_serializer_1.default)(node2, options);
}
stringify$2.getOuterHTML = getOuterHTML;
function getInnerHTML(node2, options) {
  return (0, domhandler_1$4.hasChildren)(node2) ? node2.children.map(function(node3) {
    return getOuterHTML(node3, options);
  }).join("") : "";
}
stringify$2.getInnerHTML = getInnerHTML;
function getText$1(node2) {
  if (Array.isArray(node2))
    return node2.map(getText$1).join("");
  if ((0, domhandler_1$4.isTag)(node2))
    return node2.name === "br" ? "\n" : getText$1(node2.children);
  if ((0, domhandler_1$4.isCDATA)(node2))
    return getText$1(node2.children);
  if ((0, domhandler_1$4.isText)(node2))
    return node2.data;
  return "";
}
stringify$2.getText = getText$1;
function textContent(node2) {
  if (Array.isArray(node2))
    return node2.map(textContent).join("");
  if ((0, domhandler_1$4.hasChildren)(node2) && !(0, domhandler_1$4.isComment)(node2)) {
    return textContent(node2.children);
  }
  if ((0, domhandler_1$4.isText)(node2))
    return node2.data;
  return "";
}
stringify$2.textContent = textContent;
function innerText(node2) {
  if (Array.isArray(node2))
    return node2.map(innerText).join("");
  if ((0, domhandler_1$4.hasChildren)(node2) && (node2.type === domelementtype_1.ElementType.Tag || (0, domhandler_1$4.isCDATA)(node2))) {
    return innerText(node2.children);
  }
  if ((0, domhandler_1$4.isText)(node2))
    return node2.data;
  return "";
}
stringify$2.innerText = innerText;
var traversal = {};
Object.defineProperty(traversal, "__esModule", { value: true });
traversal.prevElementSibling = traversal.nextElementSibling = traversal.getName = traversal.hasAttrib = traversal.getAttributeValue = traversal.getSiblings = traversal.getParent = traversal.getChildren = void 0;
var domhandler_1$3 = lib$5;
var emptyArray = [];
function getChildren$1(elem) {
  var _a;
  return (_a = elem.children) !== null && _a !== void 0 ? _a : emptyArray;
}
traversal.getChildren = getChildren$1;
function getParent$1(elem) {
  return elem.parent || null;
}
traversal.getParent = getParent$1;
function getSiblings$1(elem) {
  var _a, _b;
  var parent = getParent$1(elem);
  if (parent != null)
    return getChildren$1(parent);
  var siblings = [elem];
  var prev = elem.prev, next = elem.next;
  while (prev != null) {
    siblings.unshift(prev);
    _a = prev, prev = _a.prev;
  }
  while (next != null) {
    siblings.push(next);
    _b = next, next = _b.next;
  }
  return siblings;
}
traversal.getSiblings = getSiblings$1;
function getAttributeValue$1(elem, name) {
  var _a;
  return (_a = elem.attribs) === null || _a === void 0 ? void 0 : _a[name];
}
traversal.getAttributeValue = getAttributeValue$1;
function hasAttrib$1(elem, name) {
  return elem.attribs != null && Object.prototype.hasOwnProperty.call(elem.attribs, name) && elem.attribs[name] != null;
}
traversal.hasAttrib = hasAttrib$1;
function getName$1(elem) {
  return elem.name;
}
traversal.getName = getName$1;
function nextElementSibling(elem) {
  var _a;
  var next = elem.next;
  while (next !== null && !(0, domhandler_1$3.isTag)(next))
    _a = next, next = _a.next;
  return next;
}
traversal.nextElementSibling = nextElementSibling;
function prevElementSibling(elem) {
  var _a;
  var prev = elem.prev;
  while (prev !== null && !(0, domhandler_1$3.isTag)(prev))
    _a = prev, prev = _a.prev;
  return prev;
}
traversal.prevElementSibling = prevElementSibling;
var manipulation = {};
Object.defineProperty(manipulation, "__esModule", { value: true });
manipulation.prepend = manipulation.prependChild = manipulation.append = manipulation.appendChild = manipulation.replaceElement = manipulation.removeElement = void 0;
function removeElement(elem) {
  if (elem.prev)
    elem.prev.next = elem.next;
  if (elem.next)
    elem.next.prev = elem.prev;
  if (elem.parent) {
    var childs = elem.parent.children;
    childs.splice(childs.lastIndexOf(elem), 1);
  }
}
manipulation.removeElement = removeElement;
function replaceElement(elem, replacement) {
  var prev = replacement.prev = elem.prev;
  if (prev) {
    prev.next = replacement;
  }
  var next = replacement.next = elem.next;
  if (next) {
    next.prev = replacement;
  }
  var parent = replacement.parent = elem.parent;
  if (parent) {
    var childs = parent.children;
    childs[childs.lastIndexOf(elem)] = replacement;
  }
}
manipulation.replaceElement = replaceElement;
function appendChild(elem, child) {
  removeElement(child);
  child.next = null;
  child.parent = elem;
  if (elem.children.push(child) > 1) {
    var sibling = elem.children[elem.children.length - 2];
    sibling.next = child;
    child.prev = sibling;
  } else {
    child.prev = null;
  }
}
manipulation.appendChild = appendChild;
function append(elem, next) {
  removeElement(next);
  var parent = elem.parent;
  var currNext = elem.next;
  next.next = currNext;
  next.prev = elem;
  elem.next = next;
  next.parent = parent;
  if (currNext) {
    currNext.prev = next;
    if (parent) {
      var childs = parent.children;
      childs.splice(childs.lastIndexOf(currNext), 0, next);
    }
  } else if (parent) {
    parent.children.push(next);
  }
}
manipulation.append = append;
function prependChild(elem, child) {
  removeElement(child);
  child.parent = elem;
  child.prev = null;
  if (elem.children.unshift(child) !== 1) {
    var sibling = elem.children[1];
    sibling.prev = child;
    child.next = sibling;
  } else {
    child.next = null;
  }
}
manipulation.prependChild = prependChild;
function prepend(elem, prev) {
  removeElement(prev);
  var parent = elem.parent;
  if (parent) {
    var childs = parent.children;
    childs.splice(childs.indexOf(elem), 0, prev);
  }
  if (elem.prev) {
    elem.prev.next = prev;
  }
  prev.parent = parent;
  prev.prev = elem.prev;
  prev.next = elem;
  elem.prev = prev;
}
manipulation.prepend = prepend;
var querying = {};
Object.defineProperty(querying, "__esModule", { value: true });
querying.findAll = querying.existsOne = querying.findOne = querying.findOneChild = querying.find = querying.filter = void 0;
var domhandler_1$2 = lib$5;
function filter(test, node2, recurse, limit) {
  if (recurse === void 0) {
    recurse = true;
  }
  if (limit === void 0) {
    limit = Infinity;
  }
  if (!Array.isArray(node2))
    node2 = [node2];
  return find(test, node2, recurse, limit);
}
querying.filter = filter;
function find(test, nodes, recurse, limit) {
  var result = [];
  for (var _i = 0, nodes_1 = nodes; _i < nodes_1.length; _i++) {
    var elem = nodes_1[_i];
    if (test(elem)) {
      result.push(elem);
      if (--limit <= 0)
        break;
    }
    if (recurse && (0, domhandler_1$2.hasChildren)(elem) && elem.children.length > 0) {
      var children = find(test, elem.children, recurse, limit);
      result.push.apply(result, children);
      limit -= children.length;
      if (limit <= 0)
        break;
    }
  }
  return result;
}
querying.find = find;
function findOneChild(test, nodes) {
  return nodes.find(test);
}
querying.findOneChild = findOneChild;
function findOne$1(test, nodes, recurse) {
  if (recurse === void 0) {
    recurse = true;
  }
  var elem = null;
  for (var i = 0; i < nodes.length && !elem; i++) {
    var checked = nodes[i];
    if (!(0, domhandler_1$2.isTag)(checked)) {
      continue;
    } else if (test(checked)) {
      elem = checked;
    } else if (recurse && checked.children.length > 0) {
      elem = findOne$1(test, checked.children);
    }
  }
  return elem;
}
querying.findOne = findOne$1;
function existsOne$1(test, nodes) {
  return nodes.some(function(checked) {
    return (0, domhandler_1$2.isTag)(checked) && (test(checked) || checked.children.length > 0 && existsOne$1(test, checked.children));
  });
}
querying.existsOne = existsOne$1;
function findAll$1(test, nodes) {
  var _a;
  var result = [];
  var stack2 = nodes.filter(domhandler_1$2.isTag);
  var elem;
  while (elem = stack2.shift()) {
    var children = (_a = elem.children) === null || _a === void 0 ? void 0 : _a.filter(domhandler_1$2.isTag);
    if (children && children.length > 0) {
      stack2.unshift.apply(stack2, children);
    }
    if (test(elem))
      result.push(elem);
  }
  return result;
}
querying.findAll = findAll$1;
var legacy = {};
Object.defineProperty(legacy, "__esModule", { value: true });
legacy.getElementsByTagType = legacy.getElementsByTagName = legacy.getElementById = legacy.getElements = legacy.testElement = void 0;
var domhandler_1$1 = lib$5;
var querying_1 = querying;
var Checks = {
  tag_name: function(name) {
    if (typeof name === "function") {
      return function(elem) {
        return (0, domhandler_1$1.isTag)(elem) && name(elem.name);
      };
    } else if (name === "*") {
      return domhandler_1$1.isTag;
    }
    return function(elem) {
      return (0, domhandler_1$1.isTag)(elem) && elem.name === name;
    };
  },
  tag_type: function(type2) {
    if (typeof type2 === "function") {
      return function(elem) {
        return type2(elem.type);
      };
    }
    return function(elem) {
      return elem.type === type2;
    };
  },
  tag_contains: function(data) {
    if (typeof data === "function") {
      return function(elem) {
        return (0, domhandler_1$1.isText)(elem) && data(elem.data);
      };
    }
    return function(elem) {
      return (0, domhandler_1$1.isText)(elem) && elem.data === data;
    };
  }
};
function getAttribCheck(attrib, value) {
  if (typeof value === "function") {
    return function(elem) {
      return (0, domhandler_1$1.isTag)(elem) && value(elem.attribs[attrib]);
    };
  }
  return function(elem) {
    return (0, domhandler_1$1.isTag)(elem) && elem.attribs[attrib] === value;
  };
}
function combineFuncs(a, b) {
  return function(elem) {
    return a(elem) || b(elem);
  };
}
function compileTest(options) {
  var funcs = Object.keys(options).map(function(key) {
    var value = options[key];
    return Object.prototype.hasOwnProperty.call(Checks, key) ? Checks[key](value) : getAttribCheck(key, value);
  });
  return funcs.length === 0 ? null : funcs.reduce(combineFuncs);
}
function testElement(options, node2) {
  var test = compileTest(options);
  return test ? test(node2) : true;
}
legacy.testElement = testElement;
function getElements(options, nodes, recurse, limit) {
  if (limit === void 0) {
    limit = Infinity;
  }
  var test = compileTest(options);
  return test ? (0, querying_1.filter)(test, nodes, recurse, limit) : [];
}
legacy.getElements = getElements;
function getElementById(id, nodes, recurse) {
  if (recurse === void 0) {
    recurse = true;
  }
  if (!Array.isArray(nodes))
    nodes = [nodes];
  return (0, querying_1.findOne)(getAttribCheck("id", id), nodes, recurse);
}
legacy.getElementById = getElementById;
function getElementsByTagName(tagName, nodes, recurse, limit) {
  if (recurse === void 0) {
    recurse = true;
  }
  if (limit === void 0) {
    limit = Infinity;
  }
  return (0, querying_1.filter)(Checks.tag_name(tagName), nodes, recurse, limit);
}
legacy.getElementsByTagName = getElementsByTagName;
function getElementsByTagType(type2, nodes, recurse, limit) {
  if (recurse === void 0) {
    recurse = true;
  }
  if (limit === void 0) {
    limit = Infinity;
  }
  return (0, querying_1.filter)(Checks.tag_type(type2), nodes, recurse, limit);
}
legacy.getElementsByTagType = getElementsByTagType;
var helpers = {};
Object.defineProperty(helpers, "__esModule", { value: true });
helpers.uniqueSort = helpers.compareDocumentPosition = helpers.removeSubsets = void 0;
var domhandler_1 = lib$5;
function removeSubsets$1(nodes) {
  var idx = nodes.length;
  while (--idx >= 0) {
    var node2 = nodes[idx];
    if (idx > 0 && nodes.lastIndexOf(node2, idx - 1) >= 0) {
      nodes.splice(idx, 1);
      continue;
    }
    for (var ancestor = node2.parent; ancestor; ancestor = ancestor.parent) {
      if (nodes.includes(ancestor)) {
        nodes.splice(idx, 1);
        break;
      }
    }
  }
  return nodes;
}
helpers.removeSubsets = removeSubsets$1;
function compareDocumentPosition(nodeA, nodeB) {
  var aParents = [];
  var bParents = [];
  if (nodeA === nodeB) {
    return 0;
  }
  var current = (0, domhandler_1.hasChildren)(nodeA) ? nodeA : nodeA.parent;
  while (current) {
    aParents.unshift(current);
    current = current.parent;
  }
  current = (0, domhandler_1.hasChildren)(nodeB) ? nodeB : nodeB.parent;
  while (current) {
    bParents.unshift(current);
    current = current.parent;
  }
  var maxIdx = Math.min(aParents.length, bParents.length);
  var idx = 0;
  while (idx < maxIdx && aParents[idx] === bParents[idx]) {
    idx++;
  }
  if (idx === 0) {
    return 1;
  }
  var sharedParent = aParents[idx - 1];
  var siblings = sharedParent.children;
  var aSibling = aParents[idx];
  var bSibling = bParents[idx];
  if (siblings.indexOf(aSibling) > siblings.indexOf(bSibling)) {
    if (sharedParent === nodeB) {
      return 4 | 16;
    }
    return 4;
  }
  if (sharedParent === nodeA) {
    return 2 | 8;
  }
  return 2;
}
helpers.compareDocumentPosition = compareDocumentPosition;
function uniqueSort(nodes) {
  nodes = nodes.filter(function(node2, i, arr) {
    return !arr.includes(node2, i + 1);
  });
  nodes.sort(function(a, b) {
    var relative = compareDocumentPosition(a, b);
    if (relative & 2) {
      return -1;
    } else if (relative & 4) {
      return 1;
    }
    return 0;
  });
  return nodes;
}
helpers.uniqueSort = uniqueSort;
var feeds = {};
Object.defineProperty(feeds, "__esModule", { value: true });
feeds.getFeed = void 0;
var stringify_1 = stringify$2;
var legacy_1 = legacy;
function getFeed(doc2) {
  var feedRoot = getOneElement(isValidFeed, doc2);
  return !feedRoot ? null : feedRoot.name === "feed" ? getAtomFeed(feedRoot) : getRssFeed(feedRoot);
}
feeds.getFeed = getFeed;
function getAtomFeed(feedRoot) {
  var _a;
  var childs = feedRoot.children;
  var feed = {
    type: "atom",
    items: (0, legacy_1.getElementsByTagName)("entry", childs).map(function(item) {
      var _a2;
      var children = item.children;
      var entry = { media: getMediaElements(children) };
      addConditionally(entry, "id", "id", children);
      addConditionally(entry, "title", "title", children);
      var href2 = (_a2 = getOneElement("link", children)) === null || _a2 === void 0 ? void 0 : _a2.attribs.href;
      if (href2) {
        entry.link = href2;
      }
      var description = fetch("summary", children) || fetch("content", children);
      if (description) {
        entry.description = description;
      }
      var pubDate = fetch("updated", children);
      if (pubDate) {
        entry.pubDate = new Date(pubDate);
      }
      return entry;
    })
  };
  addConditionally(feed, "id", "id", childs);
  addConditionally(feed, "title", "title", childs);
  var href = (_a = getOneElement("link", childs)) === null || _a === void 0 ? void 0 : _a.attribs.href;
  if (href) {
    feed.link = href;
  }
  addConditionally(feed, "description", "subtitle", childs);
  var updated = fetch("updated", childs);
  if (updated) {
    feed.updated = new Date(updated);
  }
  addConditionally(feed, "author", "email", childs, true);
  return feed;
}
function getRssFeed(feedRoot) {
  var _a, _b;
  var childs = (_b = (_a = getOneElement("channel", feedRoot.children)) === null || _a === void 0 ? void 0 : _a.children) !== null && _b !== void 0 ? _b : [];
  var feed = {
    type: feedRoot.name.substr(0, 3),
    id: "",
    items: (0, legacy_1.getElementsByTagName)("item", feedRoot.children).map(function(item) {
      var children = item.children;
      var entry = { media: getMediaElements(children) };
      addConditionally(entry, "id", "guid", children);
      addConditionally(entry, "title", "title", children);
      addConditionally(entry, "link", "link", children);
      addConditionally(entry, "description", "description", children);
      var pubDate = fetch("pubDate", children);
      if (pubDate)
        entry.pubDate = new Date(pubDate);
      return entry;
    })
  };
  addConditionally(feed, "title", "title", childs);
  addConditionally(feed, "link", "link", childs);
  addConditionally(feed, "description", "description", childs);
  var updated = fetch("lastBuildDate", childs);
  if (updated) {
    feed.updated = new Date(updated);
  }
  addConditionally(feed, "author", "managingEditor", childs, true);
  return feed;
}
var MEDIA_KEYS_STRING = ["url", "type", "lang"];
var MEDIA_KEYS_INT = [
  "fileSize",
  "bitrate",
  "framerate",
  "samplingrate",
  "channels",
  "duration",
  "height",
  "width"
];
function getMediaElements(where) {
  return (0, legacy_1.getElementsByTagName)("media:content", where).map(function(elem) {
    var attribs = elem.attribs;
    var media = {
      medium: attribs.medium,
      isDefault: !!attribs.isDefault
    };
    for (var _i = 0, MEDIA_KEYS_STRING_1 = MEDIA_KEYS_STRING; _i < MEDIA_KEYS_STRING_1.length; _i++) {
      var attrib = MEDIA_KEYS_STRING_1[_i];
      if (attribs[attrib]) {
        media[attrib] = attribs[attrib];
      }
    }
    for (var _a = 0, MEDIA_KEYS_INT_1 = MEDIA_KEYS_INT; _a < MEDIA_KEYS_INT_1.length; _a++) {
      var attrib = MEDIA_KEYS_INT_1[_a];
      if (attribs[attrib]) {
        media[attrib] = parseInt(attribs[attrib], 10);
      }
    }
    if (attribs.expression) {
      media.expression = attribs.expression;
    }
    return media;
  });
}
function getOneElement(tagName, node2) {
  return (0, legacy_1.getElementsByTagName)(tagName, node2, true, 1)[0];
}
function fetch(tagName, where, recurse) {
  if (recurse === void 0) {
    recurse = false;
  }
  return (0, stringify_1.textContent)((0, legacy_1.getElementsByTagName)(tagName, where, recurse, 1)).trim();
}
function addConditionally(obj, prop2, tagName, where, recurse) {
  if (recurse === void 0) {
    recurse = false;
  }
  var val = fetch(tagName, where, recurse);
  if (val)
    obj[prop2] = val;
}
function isValidFeed(value) {
  return value === "rss" || value === "feed" || value === "rdf:RDF";
}
(function(exports) {
  var __createBinding2 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() {
      return m[k];
    } });
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports2) {
    for (var p2 in m)
      if (p2 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p2))
        __createBinding2(exports2, m, p2);
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.hasChildren = exports.isDocument = exports.isComment = exports.isText = exports.isCDATA = exports.isTag = void 0;
  __exportStar(stringify$2, exports);
  __exportStar(traversal, exports);
  __exportStar(manipulation, exports);
  __exportStar(querying, exports);
  __exportStar(legacy, exports);
  __exportStar(helpers, exports);
  __exportStar(feeds, exports);
  var domhandler_12 = lib$5;
  Object.defineProperty(exports, "isTag", { enumerable: true, get: function() {
    return domhandler_12.isTag;
  } });
  Object.defineProperty(exports, "isCDATA", { enumerable: true, get: function() {
    return domhandler_12.isCDATA;
  } });
  Object.defineProperty(exports, "isText", { enumerable: true, get: function() {
    return domhandler_12.isText;
  } });
  Object.defineProperty(exports, "isComment", { enumerable: true, get: function() {
    return domhandler_12.isComment;
  } });
  Object.defineProperty(exports, "isDocument", { enumerable: true, get: function() {
    return domhandler_12.isDocument;
  } });
  Object.defineProperty(exports, "hasChildren", { enumerable: true, get: function() {
    return domhandler_12.hasChildren;
  } });
})(lib$6);
var boolbase = {
  trueFunc: function trueFunc() {
    return true;
  },
  falseFunc: function falseFunc() {
    return false;
  }
};
var compile$3 = {};
var lib$1 = {};
var parse$5 = {};
var __spreadArray$2 = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(parse$5, "__esModule", { value: true });
parse$5.isTraversal = void 0;
var reName = /^[^\\#]?(?:\\(?:[\da-f]{1,6}\s?|.)|[\w\-\u00b0-\uFFFF])+/;
var reEscape = /\\([\da-f]{1,6}\s?|(\s)|.)/gi;
var actionTypes$1 = new Map([
  ["~", "element"],
  ["^", "start"],
  ["$", "end"],
  ["*", "any"],
  ["!", "not"],
  ["|", "hyphen"]
]);
var Traversals = {
  ">": "child",
  "<": "parent",
  "~": "sibling",
  "+": "adjacent"
};
var attribSelectors = {
  "#": ["id", "equals"],
  ".": ["class", "element"]
};
var unpackPseudos = new Set([
  "has",
  "not",
  "matches",
  "is",
  "where",
  "host",
  "host-context"
]);
var traversalNames = new Set(__spreadArray$2([
  "descendant"
], Object.keys(Traversals).map(function(k) {
  return Traversals[k];
}), true));
var caseInsensitiveAttributes = new Set([
  "accept",
  "accept-charset",
  "align",
  "alink",
  "axis",
  "bgcolor",
  "charset",
  "checked",
  "clear",
  "codetype",
  "color",
  "compact",
  "declare",
  "defer",
  "dir",
  "direction",
  "disabled",
  "enctype",
  "face",
  "frame",
  "hreflang",
  "http-equiv",
  "lang",
  "language",
  "link",
  "media",
  "method",
  "multiple",
  "nohref",
  "noresize",
  "noshade",
  "nowrap",
  "readonly",
  "rel",
  "rev",
  "rules",
  "scope",
  "scrolling",
  "selected",
  "shape",
  "target",
  "text",
  "type",
  "valign",
  "valuetype",
  "vlink"
]);
function isTraversal(selector) {
  return traversalNames.has(selector.type);
}
parse$5.isTraversal = isTraversal;
var stripQuotesFromPseudos = new Set(["contains", "icontains"]);
var quotes = new Set(['"', "'"]);
function funescape(_, escaped, escapedWhitespace) {
  var high = parseInt(escaped, 16) - 65536;
  return high !== high || escapedWhitespace ? escaped : high < 0 ? String.fromCharCode(high + 65536) : String.fromCharCode(high >> 10 | 55296, high & 1023 | 56320);
}
function unescapeCSS(str) {
  return str.replace(reEscape, funescape);
}
function isWhitespace(c) {
  return c === " " || c === "\n" || c === "	" || c === "\f" || c === "\r";
}
function parse$4(selector, options) {
  var subselects2 = [];
  var endIndex = parseSelector(subselects2, "" + selector, options, 0);
  if (endIndex < selector.length) {
    throw new Error("Unmatched selector: " + selector.slice(endIndex));
  }
  return subselects2;
}
parse$5.default = parse$4;
function parseSelector(subselects2, selector, options, selectorIndex) {
  var _a, _b;
  if (options === void 0) {
    options = {};
  }
  var tokens = [];
  var sawWS = false;
  function getName2(offset2) {
    var match2 = selector.slice(selectorIndex + offset2).match(reName);
    if (!match2) {
      throw new Error("Expected name, found " + selector.slice(selectorIndex));
    }
    var name = match2[0];
    selectorIndex += offset2 + name.length;
    return unescapeCSS(name);
  }
  function stripWhitespace(offset2) {
    while (isWhitespace(selector.charAt(selectorIndex + offset2)))
      offset2++;
    selectorIndex += offset2;
  }
  function isEscaped(pos) {
    var slashCount = 0;
    while (selector.charAt(--pos) === "\\")
      slashCount++;
    return (slashCount & 1) === 1;
  }
  function ensureNotTraversal() {
    if (tokens.length > 0 && isTraversal(tokens[tokens.length - 1])) {
      throw new Error("Did not expect successive traversals.");
    }
  }
  stripWhitespace(0);
  while (selector !== "") {
    var firstChar = selector.charAt(selectorIndex);
    if (isWhitespace(firstChar)) {
      sawWS = true;
      stripWhitespace(1);
    } else if (firstChar in Traversals) {
      ensureNotTraversal();
      tokens.push({ type: Traversals[firstChar] });
      sawWS = false;
      stripWhitespace(1);
    } else if (firstChar === ",") {
      if (tokens.length === 0) {
        throw new Error("Empty sub-selector");
      }
      subselects2.push(tokens);
      tokens = [];
      sawWS = false;
      stripWhitespace(1);
    } else if (selector.startsWith("/*", selectorIndex)) {
      var endIndex = selector.indexOf("*/", selectorIndex + 2);
      if (endIndex < 0) {
        throw new Error("Comment was not terminated");
      }
      selectorIndex = endIndex + 2;
    } else {
      if (sawWS) {
        ensureNotTraversal();
        tokens.push({ type: "descendant" });
        sawWS = false;
      }
      if (firstChar in attribSelectors) {
        var _c = attribSelectors[firstChar], name_1 = _c[0], action = _c[1];
        tokens.push({
          type: "attribute",
          name: name_1,
          action,
          value: getName2(1),
          namespace: null,
          ignoreCase: options.xmlMode ? null : false
        });
      } else if (firstChar === "[") {
        stripWhitespace(1);
        var namespace = null;
        if (selector.charAt(selectorIndex) === "|") {
          namespace = "";
          selectorIndex += 1;
        }
        if (selector.startsWith("*|", selectorIndex)) {
          namespace = "*";
          selectorIndex += 2;
        }
        var name_2 = getName2(0);
        if (namespace === null && selector.charAt(selectorIndex) === "|" && selector.charAt(selectorIndex + 1) !== "=") {
          namespace = name_2;
          name_2 = getName2(1);
        }
        if ((_a = options.lowerCaseAttributeNames) !== null && _a !== void 0 ? _a : !options.xmlMode) {
          name_2 = name_2.toLowerCase();
        }
        stripWhitespace(0);
        var action = "exists";
        var possibleAction = actionTypes$1.get(selector.charAt(selectorIndex));
        if (possibleAction) {
          action = possibleAction;
          if (selector.charAt(selectorIndex + 1) !== "=") {
            throw new Error("Expected `=`");
          }
          stripWhitespace(2);
        } else if (selector.charAt(selectorIndex) === "=") {
          action = "equals";
          stripWhitespace(1);
        }
        var value = "";
        var ignoreCase = null;
        if (action !== "exists") {
          if (quotes.has(selector.charAt(selectorIndex))) {
            var quote = selector.charAt(selectorIndex);
            var sectionEnd = selectorIndex + 1;
            while (sectionEnd < selector.length && (selector.charAt(sectionEnd) !== quote || isEscaped(sectionEnd))) {
              sectionEnd += 1;
            }
            if (selector.charAt(sectionEnd) !== quote) {
              throw new Error("Attribute value didn't end");
            }
            value = unescapeCSS(selector.slice(selectorIndex + 1, sectionEnd));
            selectorIndex = sectionEnd + 1;
          } else {
            var valueStart = selectorIndex;
            while (selectorIndex < selector.length && (!isWhitespace(selector.charAt(selectorIndex)) && selector.charAt(selectorIndex) !== "]" || isEscaped(selectorIndex))) {
              selectorIndex += 1;
            }
            value = unescapeCSS(selector.slice(valueStart, selectorIndex));
          }
          stripWhitespace(0);
          var forceIgnore = selector.charAt(selectorIndex);
          if (forceIgnore === "s" || forceIgnore === "S") {
            ignoreCase = false;
            stripWhitespace(1);
          } else if (forceIgnore === "i" || forceIgnore === "I") {
            ignoreCase = true;
            stripWhitespace(1);
          }
        }
        if (!options.xmlMode) {
          ignoreCase !== null && ignoreCase !== void 0 ? ignoreCase : ignoreCase = caseInsensitiveAttributes.has(name_2);
        }
        if (selector.charAt(selectorIndex) !== "]") {
          throw new Error("Attribute selector didn't terminate");
        }
        selectorIndex += 1;
        var attributeSelector = {
          type: "attribute",
          name: name_2,
          action,
          value,
          namespace,
          ignoreCase
        };
        tokens.push(attributeSelector);
      } else if (firstChar === ":") {
        if (selector.charAt(selectorIndex + 1) === ":") {
          tokens.push({
            type: "pseudo-element",
            name: getName2(2).toLowerCase()
          });
          continue;
        }
        var name_3 = getName2(1).toLowerCase();
        var data = null;
        if (selector.charAt(selectorIndex) === "(") {
          if (unpackPseudos.has(name_3)) {
            if (quotes.has(selector.charAt(selectorIndex + 1))) {
              throw new Error("Pseudo-selector " + name_3 + " cannot be quoted");
            }
            data = [];
            selectorIndex = parseSelector(data, selector, options, selectorIndex + 1);
            if (selector.charAt(selectorIndex) !== ")") {
              throw new Error("Missing closing parenthesis in :" + name_3 + " (" + selector + ")");
            }
            selectorIndex += 1;
          } else {
            selectorIndex += 1;
            var start2 = selectorIndex;
            var counter = 1;
            for (; counter > 0 && selectorIndex < selector.length; selectorIndex++) {
              if (selector.charAt(selectorIndex) === "(" && !isEscaped(selectorIndex)) {
                counter++;
              } else if (selector.charAt(selectorIndex) === ")" && !isEscaped(selectorIndex)) {
                counter--;
              }
            }
            if (counter) {
              throw new Error("Parenthesis not matched");
            }
            data = selector.slice(start2, selectorIndex - 1);
            if (stripQuotesFromPseudos.has(name_3)) {
              var quot2 = data.charAt(0);
              if (quot2 === data.slice(-1) && quotes.has(quot2)) {
                data = data.slice(1, -1);
              }
              data = unescapeCSS(data);
            }
          }
        }
        tokens.push({ type: "pseudo", name: name_3, data });
      } else {
        var namespace = null;
        var name_4 = void 0;
        if (firstChar === "*") {
          selectorIndex += 1;
          name_4 = "*";
        } else if (reName.test(selector.slice(selectorIndex))) {
          if (selector.charAt(selectorIndex) === "|") {
            namespace = "";
            selectorIndex += 1;
          }
          name_4 = getName2(0);
        } else {
          if (tokens.length && tokens[tokens.length - 1].type === "descendant") {
            tokens.pop();
          }
          addToken(subselects2, tokens);
          return selectorIndex;
        }
        if (selector.charAt(selectorIndex) === "|") {
          namespace = name_4;
          if (selector.charAt(selectorIndex + 1) === "*") {
            name_4 = "*";
            selectorIndex += 2;
          } else {
            name_4 = getName2(1);
          }
        }
        if (name_4 === "*") {
          tokens.push({ type: "universal", namespace });
        } else {
          if ((_b = options.lowerCaseTags) !== null && _b !== void 0 ? _b : !options.xmlMode) {
            name_4 = name_4.toLowerCase();
          }
          tokens.push({ type: "tag", name: name_4, namespace });
        }
      }
    }
  }
  addToken(subselects2, tokens);
  return selectorIndex;
}
function addToken(subselects2, tokens) {
  if (subselects2.length > 0 && tokens.length === 0) {
    throw new Error("Empty sub-selector");
  }
  subselects2.push(tokens);
}
var stringify$1 = {};
var __spreadArray$1 = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
};
Object.defineProperty(stringify$1, "__esModule", { value: true });
var actionTypes = {
  equals: "",
  element: "~",
  start: "^",
  end: "$",
  any: "*",
  not: "!",
  hyphen: "|"
};
var charsToEscape = new Set(__spreadArray$1(__spreadArray$1([], Object.keys(actionTypes).map(function(typeKey) {
  return actionTypes[typeKey];
}).filter(Boolean), true), [
  ":",
  "[",
  "]",
  " ",
  "\\",
  "(",
  ")",
  "'"
], false));
function stringify(selector) {
  return selector.map(stringifySubselector).join(", ");
}
stringify$1.default = stringify;
function stringifySubselector(token) {
  return token.map(stringifyToken).join("");
}
function stringifyToken(token) {
  switch (token.type) {
    case "child":
      return " > ";
    case "parent":
      return " < ";
    case "sibling":
      return " ~ ";
    case "adjacent":
      return " + ";
    case "descendant":
      return " ";
    case "universal":
      return getNamespace(token.namespace) + "*";
    case "tag":
      return getNamespacedName(token);
    case "pseudo-element":
      return "::" + escapeName(token.name);
    case "pseudo":
      if (token.data === null)
        return ":" + escapeName(token.name);
      if (typeof token.data === "string") {
        return ":" + escapeName(token.name) + "(" + escapeName(token.data) + ")";
      }
      return ":" + escapeName(token.name) + "(" + stringify(token.data) + ")";
    case "attribute": {
      if (token.name === "id" && token.action === "equals" && !token.ignoreCase && !token.namespace) {
        return "#" + escapeName(token.value);
      }
      if (token.name === "class" && token.action === "element" && !token.ignoreCase && !token.namespace) {
        return "." + escapeName(token.value);
      }
      var name_1 = getNamespacedName(token);
      if (token.action === "exists") {
        return "[" + name_1 + "]";
      }
      return "[" + name_1 + actionTypes[token.action] + "='" + escapeName(token.value) + "'" + (token.ignoreCase ? "i" : token.ignoreCase === false ? "s" : "") + "]";
    }
  }
}
function getNamespacedName(token) {
  return "" + getNamespace(token.namespace) + escapeName(token.name);
}
function getNamespace(namespace) {
  return namespace !== null ? (namespace === "*" ? "*" : escapeName(namespace)) + "|" : "";
}
function escapeName(str) {
  return str.split("").map(function(c) {
    return charsToEscape.has(c) ? "\\" + c : c;
  }).join("");
}
(function(exports) {
  var __createBinding2 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() {
      return m[k];
    } });
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __exportStar = commonjsGlobal && commonjsGlobal.__exportStar || function(m, exports2) {
    for (var p2 in m)
      if (p2 !== "default" && !Object.prototype.hasOwnProperty.call(exports2, p2))
        __createBinding2(exports2, m, p2);
  };
  var __importDefault2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.stringify = exports.parse = void 0;
  __exportStar(parse$5, exports);
  var parse_1 = parse$5;
  Object.defineProperty(exports, "parse", { enumerable: true, get: function() {
    return __importDefault2(parse_1).default;
  } });
  var stringify_12 = stringify$1;
  Object.defineProperty(exports, "stringify", { enumerable: true, get: function() {
    return __importDefault2(stringify_12).default;
  } });
})(lib$1);
var sort = {};
var procedure = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.isTraversal = exports.procedure = void 0;
  exports.procedure = {
    universal: 50,
    tag: 30,
    attribute: 1,
    pseudo: 0,
    "pseudo-element": 0,
    descendant: -1,
    child: -1,
    parent: -1,
    sibling: -1,
    adjacent: -1,
    _flexibleDescendant: -1
  };
  function isTraversal2(t) {
    return exports.procedure[t.type] < 0;
  }
  exports.isTraversal = isTraversal2;
})(procedure);
Object.defineProperty(sort, "__esModule", { value: true });
var procedure_1$1 = procedure;
var attributes$1 = {
  exists: 10,
  equals: 8,
  not: 7,
  start: 6,
  end: 6,
  any: 5,
  hyphen: 4,
  element: 4
};
function sortByProcedure(arr) {
  var procs = arr.map(getProcedure);
  for (var i = 1; i < arr.length; i++) {
    var procNew = procs[i];
    if (procNew < 0)
      continue;
    for (var j = i - 1; j >= 0 && procNew < procs[j]; j--) {
      var token = arr[j + 1];
      arr[j + 1] = arr[j];
      arr[j] = token;
      procs[j + 1] = procs[j];
      procs[j] = procNew;
    }
  }
}
sort.default = sortByProcedure;
function getProcedure(token) {
  var proc = procedure_1$1.procedure[token.type];
  if (token.type === "attribute") {
    proc = attributes$1[token.action];
    if (proc === attributes$1.equals && token.name === "id") {
      proc = 9;
    }
    if (token.ignoreCase) {
      proc >>= 1;
    }
  } else if (token.type === "pseudo") {
    if (!token.data) {
      proc = 3;
    } else if (token.name === "has" || token.name === "contains") {
      proc = 0;
    } else if (Array.isArray(token.data)) {
      proc = 0;
      for (var i = 0; i < token.data.length; i++) {
        if (token.data[i].length !== 1)
          continue;
        var cur = getProcedure(token.data[i][0]);
        if (cur === 0) {
          proc = 0;
          break;
        }
        if (cur > proc)
          proc = cur;
      }
      if (token.data.length > 1 && proc > 0)
        proc -= 1;
    } else {
      proc = 1;
    }
  }
  return proc;
}
var general = {};
var attributes = {};
Object.defineProperty(attributes, "__esModule", { value: true });
attributes.attributeRules = void 0;
var boolbase_1$2 = boolbase;
var reChars = /[-[\]{}()*+?.,\\^$|#\s]/g;
function escapeRegex(value) {
  return value.replace(reChars, "\\$&");
}
attributes.attributeRules = {
  equals: function(next, data, _a) {
    var adapter = _a.adapter;
    var name = data.name;
    var value = data.value;
    if (data.ignoreCase) {
      value = value.toLowerCase();
      return function(elem) {
        var attr = adapter.getAttributeValue(elem, name);
        return attr != null && attr.length === value.length && attr.toLowerCase() === value && next(elem);
      };
    }
    return function(elem) {
      return adapter.getAttributeValue(elem, name) === value && next(elem);
    };
  },
  hyphen: function(next, data, _a) {
    var adapter = _a.adapter;
    var name = data.name;
    var value = data.value;
    var len = value.length;
    if (data.ignoreCase) {
      value = value.toLowerCase();
      return function hyphenIC(elem) {
        var attr = adapter.getAttributeValue(elem, name);
        return attr != null && (attr.length === len || attr.charAt(len) === "-") && attr.substr(0, len).toLowerCase() === value && next(elem);
      };
    }
    return function hyphen2(elem) {
      var attr = adapter.getAttributeValue(elem, name);
      return attr != null && (attr.length === len || attr.charAt(len) === "-") && attr.substr(0, len) === value && next(elem);
    };
  },
  element: function(next, _a, _b) {
    var name = _a.name, value = _a.value, ignoreCase = _a.ignoreCase;
    var adapter = _b.adapter;
    if (/\s/.test(value)) {
      return boolbase_1$2.falseFunc;
    }
    var regex = new RegExp("(?:^|\\s)".concat(escapeRegex(value), "(?:$|\\s)"), ignoreCase ? "i" : "");
    return function element(elem) {
      var attr = adapter.getAttributeValue(elem, name);
      return attr != null && attr.length >= value.length && regex.test(attr) && next(elem);
    };
  },
  exists: function(next, _a, _b) {
    var name = _a.name;
    var adapter = _b.adapter;
    return function(elem) {
      return adapter.hasAttrib(elem, name) && next(elem);
    };
  },
  start: function(next, data, _a) {
    var adapter = _a.adapter;
    var name = data.name;
    var value = data.value;
    var len = value.length;
    if (len === 0) {
      return boolbase_1$2.falseFunc;
    }
    if (data.ignoreCase) {
      value = value.toLowerCase();
      return function(elem) {
        var attr = adapter.getAttributeValue(elem, name);
        return attr != null && attr.length >= len && attr.substr(0, len).toLowerCase() === value && next(elem);
      };
    }
    return function(elem) {
      var _a2;
      return !!((_a2 = adapter.getAttributeValue(elem, name)) === null || _a2 === void 0 ? void 0 : _a2.startsWith(value)) && next(elem);
    };
  },
  end: function(next, data, _a) {
    var adapter = _a.adapter;
    var name = data.name;
    var value = data.value;
    var len = -value.length;
    if (len === 0) {
      return boolbase_1$2.falseFunc;
    }
    if (data.ignoreCase) {
      value = value.toLowerCase();
      return function(elem) {
        var _a2;
        return ((_a2 = adapter.getAttributeValue(elem, name)) === null || _a2 === void 0 ? void 0 : _a2.substr(len).toLowerCase()) === value && next(elem);
      };
    }
    return function(elem) {
      var _a2;
      return !!((_a2 = adapter.getAttributeValue(elem, name)) === null || _a2 === void 0 ? void 0 : _a2.endsWith(value)) && next(elem);
    };
  },
  any: function(next, data, _a) {
    var adapter = _a.adapter;
    var name = data.name, value = data.value;
    if (value === "") {
      return boolbase_1$2.falseFunc;
    }
    if (data.ignoreCase) {
      var regex_1 = new RegExp(escapeRegex(value), "i");
      return function anyIC(elem) {
        var attr = adapter.getAttributeValue(elem, name);
        return attr != null && attr.length >= value.length && regex_1.test(attr) && next(elem);
      };
    }
    return function(elem) {
      var _a2;
      return !!((_a2 = adapter.getAttributeValue(elem, name)) === null || _a2 === void 0 ? void 0 : _a2.includes(value)) && next(elem);
    };
  },
  not: function(next, data, _a) {
    var adapter = _a.adapter;
    var name = data.name;
    var value = data.value;
    if (value === "") {
      return function(elem) {
        return !!adapter.getAttributeValue(elem, name) && next(elem);
      };
    } else if (data.ignoreCase) {
      value = value.toLowerCase();
      return function(elem) {
        var attr = adapter.getAttributeValue(elem, name);
        return (attr == null || attr.length !== value.length || attr.toLowerCase() !== value) && next(elem);
      };
    }
    return function(elem) {
      return adapter.getAttributeValue(elem, name) !== value && next(elem);
    };
  }
};
var pseudoSelectors = {};
var filters = {};
var lib = {};
var parse$3 = {};
Object.defineProperty(parse$3, "__esModule", { value: true });
parse$3.parse = void 0;
var whitespace = new Set([9, 10, 12, 13, 32]);
var ZERO = "0".charCodeAt(0);
var NINE = "9".charCodeAt(0);
function parse$2(formula) {
  formula = formula.trim().toLowerCase();
  if (formula === "even") {
    return [2, 0];
  } else if (formula === "odd") {
    return [2, 1];
  }
  var idx = 0;
  var a = 0;
  var sign = readSign();
  var number2 = readNumber();
  if (idx < formula.length && formula.charAt(idx) === "n") {
    idx++;
    a = sign * (number2 !== null && number2 !== void 0 ? number2 : 1);
    skipWhitespace();
    if (idx < formula.length) {
      sign = readSign();
      skipWhitespace();
      number2 = readNumber();
    } else {
      sign = number2 = 0;
    }
  }
  if (number2 === null || idx < formula.length) {
    throw new Error("n-th rule couldn't be parsed ('" + formula + "')");
  }
  return [a, sign * number2];
  function readSign() {
    if (formula.charAt(idx) === "-") {
      idx++;
      return -1;
    }
    if (formula.charAt(idx) === "+") {
      idx++;
    }
    return 1;
  }
  function readNumber() {
    var start2 = idx;
    var value = 0;
    while (idx < formula.length && formula.charCodeAt(idx) >= ZERO && formula.charCodeAt(idx) <= NINE) {
      value = value * 10 + (formula.charCodeAt(idx) - ZERO);
      idx++;
    }
    return idx === start2 ? null : value;
  }
  function skipWhitespace() {
    while (idx < formula.length && whitespace.has(formula.charCodeAt(idx))) {
      idx++;
    }
  }
}
parse$3.parse = parse$2;
var compile$2 = {};
Object.defineProperty(compile$2, "__esModule", { value: true });
compile$2.compile = void 0;
var boolbase_1$1 = boolbase;
function compile$1(parsed) {
  var a = parsed[0];
  var b = parsed[1] - 1;
  if (b < 0 && a <= 0)
    return boolbase_1$1.falseFunc;
  if (a === -1)
    return function(index2) {
      return index2 <= b;
    };
  if (a === 0)
    return function(index2) {
      return index2 === b;
    };
  if (a === 1)
    return b < 0 ? boolbase_1$1.trueFunc : function(index2) {
      return index2 >= b;
    };
  var absA = Math.abs(a);
  var bMod = (b % absA + absA) % absA;
  return a > 1 ? function(index2) {
    return index2 >= b && index2 % absA === bMod;
  } : function(index2) {
    return index2 <= b && index2 % absA === bMod;
  };
}
compile$2.compile = compile$1;
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.compile = exports.parse = void 0;
  var parse_1 = parse$3;
  Object.defineProperty(exports, "parse", { enumerable: true, get: function() {
    return parse_1.parse;
  } });
  var compile_1 = compile$2;
  Object.defineProperty(exports, "compile", { enumerable: true, get: function() {
    return compile_1.compile;
  } });
  function nthCheck(formula) {
    return (0, compile_1.compile)((0, parse_1.parse)(formula));
  }
  exports.default = nthCheck;
})(lib);
(function(exports) {
  var __importDefault2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.filters = void 0;
  var nth_check_1 = __importDefault2(lib);
  var boolbase_12 = boolbase;
  function getChildFunc(next, adapter) {
    return function(elem) {
      var parent = adapter.getParent(elem);
      return parent != null && adapter.isTag(parent) && next(elem);
    };
  }
  exports.filters = {
    contains: function(next, text2, _a) {
      var adapter = _a.adapter;
      return function contains2(elem) {
        return next(elem) && adapter.getText(elem).includes(text2);
      };
    },
    icontains: function(next, text2, _a) {
      var adapter = _a.adapter;
      var itext = text2.toLowerCase();
      return function icontains(elem) {
        return next(elem) && adapter.getText(elem).toLowerCase().includes(itext);
      };
    },
    "nth-child": function(next, rule, _a) {
      var adapter = _a.adapter, equals2 = _a.equals;
      var func = (0, nth_check_1.default)(rule);
      if (func === boolbase_12.falseFunc)
        return boolbase_12.falseFunc;
      if (func === boolbase_12.trueFunc)
        return getChildFunc(next, adapter);
      return function nthChild(elem) {
        var siblings = adapter.getSiblings(elem);
        var pos = 0;
        for (var i = 0; i < siblings.length; i++) {
          if (equals2(elem, siblings[i]))
            break;
          if (adapter.isTag(siblings[i])) {
            pos++;
          }
        }
        return func(pos) && next(elem);
      };
    },
    "nth-last-child": function(next, rule, _a) {
      var adapter = _a.adapter, equals2 = _a.equals;
      var func = (0, nth_check_1.default)(rule);
      if (func === boolbase_12.falseFunc)
        return boolbase_12.falseFunc;
      if (func === boolbase_12.trueFunc)
        return getChildFunc(next, adapter);
      return function nthLastChild(elem) {
        var siblings = adapter.getSiblings(elem);
        var pos = 0;
        for (var i = siblings.length - 1; i >= 0; i--) {
          if (equals2(elem, siblings[i]))
            break;
          if (adapter.isTag(siblings[i])) {
            pos++;
          }
        }
        return func(pos) && next(elem);
      };
    },
    "nth-of-type": function(next, rule, _a) {
      var adapter = _a.adapter, equals2 = _a.equals;
      var func = (0, nth_check_1.default)(rule);
      if (func === boolbase_12.falseFunc)
        return boolbase_12.falseFunc;
      if (func === boolbase_12.trueFunc)
        return getChildFunc(next, adapter);
      return function nthOfType(elem) {
        var siblings = adapter.getSiblings(elem);
        var pos = 0;
        for (var i = 0; i < siblings.length; i++) {
          var currentSibling = siblings[i];
          if (equals2(elem, currentSibling))
            break;
          if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === adapter.getName(elem)) {
            pos++;
          }
        }
        return func(pos) && next(elem);
      };
    },
    "nth-last-of-type": function(next, rule, _a) {
      var adapter = _a.adapter, equals2 = _a.equals;
      var func = (0, nth_check_1.default)(rule);
      if (func === boolbase_12.falseFunc)
        return boolbase_12.falseFunc;
      if (func === boolbase_12.trueFunc)
        return getChildFunc(next, adapter);
      return function nthLastOfType(elem) {
        var siblings = adapter.getSiblings(elem);
        var pos = 0;
        for (var i = siblings.length - 1; i >= 0; i--) {
          var currentSibling = siblings[i];
          if (equals2(elem, currentSibling))
            break;
          if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === adapter.getName(elem)) {
            pos++;
          }
        }
        return func(pos) && next(elem);
      };
    },
    root: function(next, _rule, _a) {
      var adapter = _a.adapter;
      return function(elem) {
        var parent = adapter.getParent(elem);
        return (parent == null || !adapter.isTag(parent)) && next(elem);
      };
    },
    scope: function(next, rule, options, context) {
      var equals2 = options.equals;
      if (!context || context.length === 0) {
        return exports.filters.root(next, rule, options);
      }
      if (context.length === 1) {
        return function(elem) {
          return equals2(context[0], elem) && next(elem);
        };
      }
      return function(elem) {
        return context.includes(elem) && next(elem);
      };
    },
    hover: dynamicStatePseudo("isHovered"),
    visited: dynamicStatePseudo("isVisited"),
    active: dynamicStatePseudo("isActive")
  };
  function dynamicStatePseudo(name) {
    return function dynamicPseudo(next, _rule, _a) {
      var adapter = _a.adapter;
      var func = adapter[name];
      if (typeof func !== "function") {
        return boolbase_12.falseFunc;
      }
      return function active(elem) {
        return func(elem) && next(elem);
      };
    };
  }
})(filters);
var pseudos = {};
Object.defineProperty(pseudos, "__esModule", { value: true });
pseudos.verifyPseudoArgs = pseudos.pseudos = void 0;
pseudos.pseudos = {
  empty: function(elem, _a) {
    var adapter = _a.adapter;
    return !adapter.getChildren(elem).some(function(elem2) {
      return adapter.isTag(elem2) || adapter.getText(elem2) !== "";
    });
  },
  "first-child": function(elem, _a) {
    var adapter = _a.adapter, equals2 = _a.equals;
    var firstChild = adapter.getSiblings(elem).find(function(elem2) {
      return adapter.isTag(elem2);
    });
    return firstChild != null && equals2(elem, firstChild);
  },
  "last-child": function(elem, _a) {
    var adapter = _a.adapter, equals2 = _a.equals;
    var siblings = adapter.getSiblings(elem);
    for (var i = siblings.length - 1; i >= 0; i--) {
      if (equals2(elem, siblings[i]))
        return true;
      if (adapter.isTag(siblings[i]))
        break;
    }
    return false;
  },
  "first-of-type": function(elem, _a) {
    var adapter = _a.adapter, equals2 = _a.equals;
    var siblings = adapter.getSiblings(elem);
    var elemName = adapter.getName(elem);
    for (var i = 0; i < siblings.length; i++) {
      var currentSibling = siblings[i];
      if (equals2(elem, currentSibling))
        return true;
      if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === elemName) {
        break;
      }
    }
    return false;
  },
  "last-of-type": function(elem, _a) {
    var adapter = _a.adapter, equals2 = _a.equals;
    var siblings = adapter.getSiblings(elem);
    var elemName = adapter.getName(elem);
    for (var i = siblings.length - 1; i >= 0; i--) {
      var currentSibling = siblings[i];
      if (equals2(elem, currentSibling))
        return true;
      if (adapter.isTag(currentSibling) && adapter.getName(currentSibling) === elemName) {
        break;
      }
    }
    return false;
  },
  "only-of-type": function(elem, _a) {
    var adapter = _a.adapter, equals2 = _a.equals;
    var elemName = adapter.getName(elem);
    return adapter.getSiblings(elem).every(function(sibling) {
      return equals2(elem, sibling) || !adapter.isTag(sibling) || adapter.getName(sibling) !== elemName;
    });
  },
  "only-child": function(elem, _a) {
    var adapter = _a.adapter, equals2 = _a.equals;
    return adapter.getSiblings(elem).every(function(sibling) {
      return equals2(elem, sibling) || !adapter.isTag(sibling);
    });
  }
};
function verifyPseudoArgs(func, name, subselect) {
  if (subselect === null) {
    if (func.length > 2) {
      throw new Error("pseudo-selector :".concat(name, " requires an argument"));
    }
  } else if (func.length === 2) {
    throw new Error("pseudo-selector :".concat(name, " doesn't have any arguments"));
  }
}
pseudos.verifyPseudoArgs = verifyPseudoArgs;
var aliases = {};
Object.defineProperty(aliases, "__esModule", { value: true });
aliases.aliases = void 0;
aliases.aliases = {
  "any-link": ":is(a, area, link)[href]",
  link: ":any-link:not(:visited)",
  disabled: ":is(\n        :is(button, input, select, textarea, optgroup, option)[disabled],\n        optgroup[disabled] > option,\n        fieldset[disabled]:not(fieldset[disabled] legend:first-of-type *)\n    )",
  enabled: ":not(:disabled)",
  checked: ":is(:is(input[type=radio], input[type=checkbox])[checked], option:selected)",
  required: ":is(input, select, textarea)[required]",
  optional: ":is(input, select, textarea):not([required])",
  selected: "option:is([selected], select:not([multiple]):not(:has(> option[selected])) > :first-of-type)",
  checkbox: "[type=checkbox]",
  file: "[type=file]",
  password: "[type=password]",
  radio: "[type=radio]",
  reset: "[type=reset]",
  image: "[type=image]",
  submit: "[type=submit]",
  parent: ":not(:empty)",
  header: ":is(h1, h2, h3, h4, h5, h6)",
  button: ":is(button, input[type=button])",
  input: ":is(input, textarea, select, button)",
  text: "input:is(:not([type!='']), [type=text])"
};
var subselects = {};
(function(exports) {
  var __spreadArray2 = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from, pack) {
    if (pack || arguments.length === 2)
      for (var i = 0, l = from.length, ar; i < l; i++) {
        if (ar || !(i in from)) {
          if (!ar)
            ar = Array.prototype.slice.call(from, 0, i);
          ar[i] = from[i];
        }
      }
    return to.concat(ar || Array.prototype.slice.call(from));
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.subselects = exports.getNextSiblings = exports.ensureIsTag = exports.PLACEHOLDER_ELEMENT = void 0;
  var boolbase_12 = boolbase;
  var procedure_12 = procedure;
  exports.PLACEHOLDER_ELEMENT = {};
  function ensureIsTag(next, adapter) {
    if (next === boolbase_12.falseFunc)
      return boolbase_12.falseFunc;
    return function(elem) {
      return adapter.isTag(elem) && next(elem);
    };
  }
  exports.ensureIsTag = ensureIsTag;
  function getNextSiblings(elem, adapter) {
    var siblings = adapter.getSiblings(elem);
    if (siblings.length <= 1)
      return [];
    var elemIndex = siblings.indexOf(elem);
    if (elemIndex < 0 || elemIndex === siblings.length - 1)
      return [];
    return siblings.slice(elemIndex + 1).filter(adapter.isTag);
  }
  exports.getNextSiblings = getNextSiblings;
  var is = function(next, token, options, context, compileToken2) {
    var opts = {
      xmlMode: !!options.xmlMode,
      adapter: options.adapter,
      equals: options.equals
    };
    var func = compileToken2(token, opts, context);
    return function(elem) {
      return func(elem) && next(elem);
    };
  };
  exports.subselects = {
    is,
    matches: is,
    where: is,
    not: function(next, token, options, context, compileToken2) {
      var opts = {
        xmlMode: !!options.xmlMode,
        adapter: options.adapter,
        equals: options.equals
      };
      var func = compileToken2(token, opts, context);
      if (func === boolbase_12.falseFunc)
        return next;
      if (func === boolbase_12.trueFunc)
        return boolbase_12.falseFunc;
      return function not2(elem) {
        return !func(elem) && next(elem);
      };
    },
    has: function(next, subselect, options, _context, compileToken2) {
      var adapter = options.adapter;
      var opts = {
        xmlMode: !!options.xmlMode,
        adapter,
        equals: options.equals
      };
      var context = subselect.some(function(s) {
        return s.some(procedure_12.isTraversal);
      }) ? [exports.PLACEHOLDER_ELEMENT] : void 0;
      var compiled = compileToken2(subselect, opts, context);
      if (compiled === boolbase_12.falseFunc)
        return boolbase_12.falseFunc;
      if (compiled === boolbase_12.trueFunc) {
        return function(elem) {
          return adapter.getChildren(elem).some(adapter.isTag) && next(elem);
        };
      }
      var hasElement = ensureIsTag(compiled, adapter);
      var _a = compiled.shouldTestNextSiblings, shouldTestNextSiblings = _a === void 0 ? false : _a;
      if (context) {
        return function(elem) {
          context[0] = elem;
          var childs = adapter.getChildren(elem);
          var nextElements = shouldTestNextSiblings ? __spreadArray2(__spreadArray2([], childs, true), getNextSiblings(elem, adapter), true) : childs;
          return next(elem) && adapter.existsOne(hasElement, nextElements);
        };
      }
      return function(elem) {
        return next(elem) && adapter.existsOne(hasElement, adapter.getChildren(elem));
      };
    }
  };
})(subselects);
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.compilePseudoSelector = exports.aliases = exports.pseudos = exports.filters = void 0;
  var boolbase_12 = boolbase;
  var css_what_12 = lib$1;
  var filters_1 = filters;
  Object.defineProperty(exports, "filters", { enumerable: true, get: function() {
    return filters_1.filters;
  } });
  var pseudos_1 = pseudos;
  Object.defineProperty(exports, "pseudos", { enumerable: true, get: function() {
    return pseudos_1.pseudos;
  } });
  var aliases_1 = aliases;
  Object.defineProperty(exports, "aliases", { enumerable: true, get: function() {
    return aliases_1.aliases;
  } });
  var subselects_12 = subselects;
  function compilePseudoSelector(next, selector, options, context, compileToken2) {
    var name = selector.name, data = selector.data;
    if (Array.isArray(data)) {
      return subselects_12.subselects[name](next, data, options, context, compileToken2);
    }
    if (name in aliases_1.aliases) {
      if (data != null) {
        throw new Error("Pseudo ".concat(name, " doesn't have any arguments"));
      }
      var alias = (0, css_what_12.parse)(aliases_1.aliases[name], options);
      return subselects_12.subselects.is(next, alias, options, context, compileToken2);
    }
    if (name in filters_1.filters) {
      return filters_1.filters[name](next, data, options, context);
    }
    if (name in pseudos_1.pseudos) {
      var pseudo_1 = pseudos_1.pseudos[name];
      (0, pseudos_1.verifyPseudoArgs)(pseudo_1, name, data);
      return pseudo_1 === boolbase_12.falseFunc ? boolbase_12.falseFunc : next === boolbase_12.trueFunc ? function(elem) {
        return pseudo_1(elem, options, data);
      } : function(elem) {
        return pseudo_1(elem, options, data) && next(elem);
      };
    }
    throw new Error("unmatched pseudo-class :".concat(name));
  }
  exports.compilePseudoSelector = compilePseudoSelector;
})(pseudoSelectors);
Object.defineProperty(general, "__esModule", { value: true });
general.compileGeneralSelector = void 0;
var attributes_1 = attributes;
var pseudo_selectors_1 = pseudoSelectors;
function compileGeneralSelector(next, selector, options, context, compileToken2) {
  var adapter = options.adapter, equals2 = options.equals;
  switch (selector.type) {
    case "pseudo-element":
      throw new Error("Pseudo-elements are not supported by css-select");
    case "attribute":
      return attributes_1.attributeRules[selector.action](next, selector, options);
    case "pseudo":
      return (0, pseudo_selectors_1.compilePseudoSelector)(next, selector, options, context, compileToken2);
    case "tag":
      return function tag(elem) {
        return adapter.getName(elem) === selector.name && next(elem);
      };
    case "descendant":
      if (options.cacheResults === false || typeof WeakSet === "undefined") {
        return function descendant(elem) {
          var current = elem;
          while (current = adapter.getParent(current)) {
            if (adapter.isTag(current) && next(current)) {
              return true;
            }
          }
          return false;
        };
      }
      var isFalseCache_1 = new WeakSet();
      return function cachedDescendant(elem) {
        var current = elem;
        while (current = adapter.getParent(current)) {
          if (!isFalseCache_1.has(current)) {
            if (adapter.isTag(current) && next(current)) {
              return true;
            }
            isFalseCache_1.add(current);
          }
        }
        return false;
      };
    case "_flexibleDescendant":
      return function flexibleDescendant(elem) {
        var current = elem;
        do {
          if (adapter.isTag(current) && next(current))
            return true;
        } while (current = adapter.getParent(current));
        return false;
      };
    case "parent":
      return function parent(elem) {
        return adapter.getChildren(elem).some(function(elem2) {
          return adapter.isTag(elem2) && next(elem2);
        });
      };
    case "child":
      return function child(elem) {
        var parent = adapter.getParent(elem);
        return parent != null && adapter.isTag(parent) && next(parent);
      };
    case "sibling":
      return function sibling(elem) {
        var siblings = adapter.getSiblings(elem);
        for (var i = 0; i < siblings.length; i++) {
          var currentSibling = siblings[i];
          if (equals2(elem, currentSibling))
            break;
          if (adapter.isTag(currentSibling) && next(currentSibling)) {
            return true;
          }
        }
        return false;
      };
    case "adjacent":
      return function adjacent(elem) {
        var siblings = adapter.getSiblings(elem);
        var lastElement;
        for (var i = 0; i < siblings.length; i++) {
          var currentSibling = siblings[i];
          if (equals2(elem, currentSibling))
            break;
          if (adapter.isTag(currentSibling)) {
            lastElement = currentSibling;
          }
        }
        return !!lastElement && next(lastElement);
      };
    case "universal":
      return next;
  }
}
general.compileGeneralSelector = compileGeneralSelector;
var __importDefault$3 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(compile$3, "__esModule", { value: true });
compile$3.compileToken = compile$3.compileUnsafe = compile$3.compile = void 0;
var css_what_1 = lib$1;
var boolbase_1 = boolbase;
var sort_1 = __importDefault$3(sort);
var procedure_1 = procedure;
var general_1 = general;
var subselects_1 = subselects;
function compile(selector, options, context) {
  var next = compileUnsafe(selector, options, context);
  return (0, subselects_1.ensureIsTag)(next, options.adapter);
}
compile$3.compile = compile;
function compileUnsafe(selector, options, context) {
  var token = typeof selector === "string" ? (0, css_what_1.parse)(selector, options) : selector;
  return compileToken(token, options, context);
}
compile$3.compileUnsafe = compileUnsafe;
function includesScopePseudo(t) {
  return t.type === "pseudo" && (t.name === "scope" || Array.isArray(t.data) && t.data.some(function(data) {
    return data.some(includesScopePseudo);
  }));
}
var DESCENDANT_TOKEN = { type: "descendant" };
var FLEXIBLE_DESCENDANT_TOKEN = {
  type: "_flexibleDescendant"
};
var SCOPE_TOKEN = { type: "pseudo", name: "scope", data: null };
function absolutize(token, _a, context) {
  var adapter = _a.adapter;
  var hasContext = !!(context === null || context === void 0 ? void 0 : context.every(function(e) {
    var parent = adapter.isTag(e) && adapter.getParent(e);
    return e === subselects_1.PLACEHOLDER_ELEMENT || parent && adapter.isTag(parent);
  }));
  for (var _i = 0, token_1 = token; _i < token_1.length; _i++) {
    var t = token_1[_i];
    if (t.length > 0 && (0, procedure_1.isTraversal)(t[0]) && t[0].type !== "descendant")
      ;
    else if (hasContext && !t.some(includesScopePseudo)) {
      t.unshift(DESCENDANT_TOKEN);
    } else {
      continue;
    }
    t.unshift(SCOPE_TOKEN);
  }
}
function compileToken(token, options, context) {
  var _a;
  token = token.filter(function(t) {
    return t.length > 0;
  });
  token.forEach(sort_1.default);
  context = (_a = options.context) !== null && _a !== void 0 ? _a : context;
  var isArrayContext = Array.isArray(context);
  var finalContext = context && (Array.isArray(context) ? context : [context]);
  absolutize(token, options, finalContext);
  var shouldTestNextSiblings = false;
  var query = token.map(function(rules) {
    if (rules.length >= 2) {
      var first = rules[0], second = rules[1];
      if (first.type !== "pseudo" || first.name !== "scope")
        ;
      else if (isArrayContext && second.type === "descendant") {
        rules[1] = FLEXIBLE_DESCENDANT_TOKEN;
      } else if (second.type === "adjacent" || second.type === "sibling") {
        shouldTestNextSiblings = true;
      }
    }
    return compileRules(rules, options, finalContext);
  }).reduce(reduceRules, boolbase_1.falseFunc);
  query.shouldTestNextSiblings = shouldTestNextSiblings;
  return query;
}
compile$3.compileToken = compileToken;
function compileRules(rules, options, context) {
  var _a;
  return rules.reduce(function(previous, rule) {
    return previous === boolbase_1.falseFunc ? boolbase_1.falseFunc : (0, general_1.compileGeneralSelector)(previous, rule, options, context, compileToken);
  }, (_a = options.rootFunc) !== null && _a !== void 0 ? _a : boolbase_1.trueFunc);
}
function reduceRules(a, b) {
  if (b === boolbase_1.falseFunc || a === boolbase_1.trueFunc) {
    return a;
  }
  if (a === boolbase_1.falseFunc || b === boolbase_1.trueFunc) {
    return b;
  }
  return function combine(elem) {
    return a(elem) || b(elem);
  };
}
(function(exports) {
  var __createBinding2 = commonjsGlobal && commonjsGlobal.__createBinding || (Object.create ? function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() {
      return m[k];
    } });
  } : function(o, m, k, k2) {
    if (k2 === void 0)
      k2 = k;
    o[k2] = m[k];
  });
  var __setModuleDefault2 = commonjsGlobal && commonjsGlobal.__setModuleDefault || (Object.create ? function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
  } : function(o, v) {
    o["default"] = v;
  });
  var __importStar2 = commonjsGlobal && commonjsGlobal.__importStar || function(mod) {
    if (mod && mod.__esModule)
      return mod;
    var result = {};
    if (mod != null) {
      for (var k in mod)
        if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k))
          __createBinding2(result, mod, k);
    }
    __setModuleDefault2(result, mod);
    return result;
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.aliases = exports.pseudos = exports.filters = exports.is = exports.selectOne = exports.selectAll = exports.prepareContext = exports._compileToken = exports._compileUnsafe = exports.compile = void 0;
  var DomUtils = __importStar2(lib$6);
  var boolbase_12 = boolbase;
  var compile_1 = compile$3;
  var subselects_12 = subselects;
  var defaultEquals = function(a, b) {
    return a === b;
  };
  var defaultOptions2 = {
    adapter: DomUtils,
    equals: defaultEquals
  };
  function convertOptionFormats(options) {
    var _a, _b, _c, _d;
    var opts = options !== null && options !== void 0 ? options : defaultOptions2;
    (_a = opts.adapter) !== null && _a !== void 0 ? _a : opts.adapter = DomUtils;
    (_b = opts.equals) !== null && _b !== void 0 ? _b : opts.equals = (_d = (_c = opts.adapter) === null || _c === void 0 ? void 0 : _c.equals) !== null && _d !== void 0 ? _d : defaultEquals;
    return opts;
  }
  function wrapCompile(func) {
    return function addAdapter(selector, options, context) {
      var opts = convertOptionFormats(options);
      return func(selector, opts, context);
    };
  }
  exports.compile = wrapCompile(compile_1.compile);
  exports._compileUnsafe = wrapCompile(compile_1.compileUnsafe);
  exports._compileToken = wrapCompile(compile_1.compileToken);
  function getSelectorFunc(searchFunc) {
    return function select(query, elements, options) {
      var opts = convertOptionFormats(options);
      if (typeof query !== "function") {
        query = (0, compile_1.compileUnsafe)(query, opts, elements);
      }
      var filteredElements = prepareContext(elements, opts.adapter, query.shouldTestNextSiblings);
      return searchFunc(query, filteredElements, opts);
    };
  }
  function prepareContext(elems, adapter, shouldTestNextSiblings) {
    if (shouldTestNextSiblings === void 0) {
      shouldTestNextSiblings = false;
    }
    if (shouldTestNextSiblings) {
      elems = appendNextSiblings(elems, adapter);
    }
    return Array.isArray(elems) ? adapter.removeSubsets(elems) : adapter.getChildren(elems);
  }
  exports.prepareContext = prepareContext;
  function appendNextSiblings(elem, adapter) {
    var elems = Array.isArray(elem) ? elem.slice(0) : [elem];
    var elemsLength = elems.length;
    for (var i = 0; i < elemsLength; i++) {
      var nextSiblings = (0, subselects_12.getNextSiblings)(elems[i], adapter);
      elems.push.apply(elems, nextSiblings);
    }
    return elems;
  }
  exports.selectAll = getSelectorFunc(function(query, elems, options) {
    return query === boolbase_12.falseFunc || !elems || elems.length === 0 ? [] : options.adapter.findAll(query, elems);
  });
  exports.selectOne = getSelectorFunc(function(query, elems, options) {
    return query === boolbase_12.falseFunc || !elems || elems.length === 0 ? null : options.adapter.findOne(query, elems);
  });
  function is(elem, query, options) {
    var opts = convertOptionFormats(options);
    return (typeof query === "function" ? query : (0, compile_1.compile)(query, opts))(elem);
  }
  exports.is = is;
  exports.default = exports.selectAll;
  var pseudo_selectors_12 = pseudoSelectors;
  Object.defineProperty(exports, "filters", { enumerable: true, get: function() {
    return pseudo_selectors_12.filters;
  } });
  Object.defineProperty(exports, "pseudos", { enumerable: true, get: function() {
    return pseudo_selectors_12.pseudos;
  } });
  Object.defineProperty(exports, "aliases", { enumerable: true, get: function() {
    return pseudo_selectors_12.aliases;
  } });
})(lib$7);
var text = {};
var __extends$1 = commonjsGlobal && commonjsGlobal.__extends || function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p2 in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p2))
          d2[p2] = b2[p2];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __importDefault$2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(text, "__esModule", { value: true });
var he_1$1 = he.exports;
var node_1$1 = __importDefault$2(node$1);
var type_1$2 = __importDefault$2(type);
var TextNode = function(_super) {
  __extends$1(TextNode2, _super);
  function TextNode2(rawText, parentNode, range2) {
    var _this = _super.call(this, parentNode, range2) || this;
    _this.nodeType = type_1$2.default.TEXT_NODE;
    _this._rawText = rawText;
    return _this;
  }
  Object.defineProperty(TextNode2.prototype, "rawText", {
    get: function() {
      return this._rawText;
    },
    set: function(text2) {
      this._rawText = text2;
      this._trimmedRawText = void 0;
      this._trimmedText = void 0;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(TextNode2.prototype, "trimmedRawText", {
    get: function() {
      if (this._trimmedRawText !== void 0)
        return this._trimmedRawText;
      this._trimmedRawText = trimText(this.rawText);
      return this._trimmedRawText;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(TextNode2.prototype, "trimmedText", {
    get: function() {
      if (this._trimmedText !== void 0)
        return this._trimmedText;
      this._trimmedText = trimText(this.text);
      return this._trimmedText;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(TextNode2.prototype, "text", {
    get: function() {
      return (0, he_1$1.decode)(this.rawText);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(TextNode2.prototype, "isWhitespace", {
    get: function() {
      return /^(\s|&nbsp;)*$/.test(this.rawText);
    },
    enumerable: false,
    configurable: true
  });
  TextNode2.prototype.toString = function() {
    return this.rawText;
  };
  return TextNode2;
}(node_1$1.default);
text.default = TextNode;
function trimText(text2) {
  var i = 0;
  var startPos;
  var endPos;
  while (i >= 0 && i < text2.length) {
    if (/\S/.test(text2[i])) {
      if (startPos === void 0) {
        startPos = i;
        i = text2.length;
      } else {
        endPos = i;
        i = void 0;
      }
    }
    if (startPos === void 0)
      i++;
    else
      i--;
  }
  if (startPos === void 0)
    startPos = 0;
  if (endPos === void 0)
    endPos = text2.length - 1;
  var hasLeadingSpace = startPos > 0 && /[^\S\r\n]/.test(text2[startPos - 1]);
  var hasTrailingSpace = endPos < text2.length - 1 && /[^\S\r\n]/.test(text2[endPos + 1]);
  return (hasLeadingSpace ? " " : "") + text2.slice(startPos, endPos + 1) + (hasTrailingSpace ? " " : "");
}
var matcher = {};
var __importDefault$1 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(matcher, "__esModule", { value: true });
var type_1$1 = __importDefault$1(type);
function isTag(node2) {
  return node2 && node2.nodeType === type_1$1.default.ELEMENT_NODE;
}
function getAttributeValue(elem, name) {
  return isTag(elem) ? elem.getAttribute(name) : void 0;
}
function getName(elem) {
  return (elem && elem.rawTagName || "").toLowerCase();
}
function getChildren(node2) {
  return node2 && node2.childNodes;
}
function getParent(node2) {
  return node2 ? node2.parentNode : null;
}
function getText(node2) {
  return node2.text;
}
function removeSubsets(nodes) {
  var idx = nodes.length;
  var node2;
  var ancestor;
  var replace;
  while (--idx > -1) {
    node2 = ancestor = nodes[idx];
    nodes[idx] = null;
    replace = true;
    while (ancestor) {
      if (nodes.indexOf(ancestor) > -1) {
        replace = false;
        nodes.splice(idx, 1);
        break;
      }
      ancestor = getParent(ancestor);
    }
    if (replace) {
      nodes[idx] = node2;
    }
  }
  return nodes;
}
function existsOne(test, elems) {
  return elems.some(function(elem) {
    return isTag(elem) ? test(elem) || existsOne(test, getChildren(elem)) : false;
  });
}
function getSiblings(node2) {
  var parent = getParent(node2);
  return parent && getChildren(parent);
}
function hasAttrib(elem, name) {
  return getAttributeValue(elem, name) !== void 0;
}
function findOne(test, elems) {
  var elem = null;
  for (var i = 0, l = elems.length; i < l && !elem; i++) {
    var el2 = elems[i];
    if (test(el2)) {
      elem = el2;
    } else {
      var childs = getChildren(el2);
      if (childs && childs.length > 0) {
        elem = findOne(test, childs);
      }
    }
  }
  return elem;
}
function findAll(test, nodes) {
  var result = [];
  for (var i = 0, j = nodes.length; i < j; i++) {
    if (!isTag(nodes[i]))
      continue;
    if (test(nodes[i]))
      result.push(nodes[i]);
    var childs = getChildren(nodes[i]);
    if (childs)
      result = result.concat(findAll(test, childs));
  }
  return result;
}
matcher.default = {
  isTag,
  getAttributeValue,
  getName,
  getChildren,
  getParent,
  getText,
  removeSubsets,
  existsOne,
  getSiblings,
  hasAttrib,
  findOne,
  findAll
};
var back = {};
Object.defineProperty(back, "__esModule", { value: true });
function arr_back(arr) {
  return arr[arr.length - 1];
}
back.default = arr_back;
var __extends = commonjsGlobal && commonjsGlobal.__extends || function() {
  var extendStatics = function(d, b) {
    extendStatics = Object.setPrototypeOf || { __proto__: [] } instanceof Array && function(d2, b2) {
      d2.__proto__ = b2;
    } || function(d2, b2) {
      for (var p2 in b2)
        if (Object.prototype.hasOwnProperty.call(b2, p2))
          d2[p2] = b2[p2];
    };
    return extendStatics(d, b);
  };
  return function(d, b) {
    if (typeof b !== "function" && b !== null)
      throw new TypeError("Class extends value " + String(b) + " is not a constructor or null");
    extendStatics(d, b);
    function __() {
      this.constructor = d;
    }
    d.prototype = b === null ? Object.create(b) : (__.prototype = b.prototype, new __());
  };
}();
var __assign = commonjsGlobal && commonjsGlobal.__assign || function() {
  __assign = Object.assign || function(t) {
    for (var s, i = 1, n = arguments.length; i < n; i++) {
      s = arguments[i];
      for (var p2 in s)
        if (Object.prototype.hasOwnProperty.call(s, p2))
          t[p2] = s[p2];
    }
    return t;
  };
  return __assign.apply(this, arguments);
};
var __spreadArray = commonjsGlobal && commonjsGlobal.__spreadArray || function(to, from, pack) {
  if (pack || arguments.length === 2)
    for (var i = 0, l = from.length, ar; i < l; i++) {
      if (ar || !(i in from)) {
        if (!ar)
          ar = Array.prototype.slice.call(from, 0, i);
        ar[i] = from[i];
      }
    }
  return to.concat(ar || Array.prototype.slice.call(from));
};
var __importDefault = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
  return mod && mod.__esModule ? mod : { "default": mod };
};
Object.defineProperty(html, "__esModule", { value: true });
html.parse = html.base_parse = void 0;
var he_1 = __importDefault(he.exports);
var css_select_1 = lib$7;
var node_1 = __importDefault(node$1);
var type_1 = __importDefault(type);
var text_1 = __importDefault(text);
var matcher_1 = __importDefault(matcher);
var back_1 = __importDefault(back);
var comment_1 = __importDefault(comment);
var voidTags = new Set(["area", "base", "br", "col", "embed", "hr", "img", "input", "link", "meta", "param", "source", "track", "wbr"]);
function decode(val) {
  return JSON.parse(JSON.stringify(he_1.default.decode(val)));
}
var Htags = ["h1", "h2", "h3", "h4", "h5", "h6", "header", "hgroup"];
var Dtags = ["details", "dialog", "dd", "div", "dt"];
var Ftags = ["fieldset", "figcaption", "figure", "footer", "form"];
var tableTags = ["table", "td", "tr"];
var htmlTags = ["address", "article", "aside", "blockquote", "br", "hr", "li", "main", "nav", "ol", "p", "pre", "section", "ul"];
var kBlockElements = new Set();
function addToKBlockElement() {
  var args = [];
  for (var _i = 0; _i < arguments.length; _i++) {
    args[_i] = arguments[_i];
  }
  var addToSet = function(array) {
    for (var index2 = 0; index2 < array.length; index2++) {
      var element = array[index2];
      kBlockElements.add(element);
      kBlockElements.add(element.toUpperCase());
    }
  };
  for (var _a = 0, args_1 = args; _a < args_1.length; _a++) {
    var arg = args_1[_a];
    addToSet(arg);
  }
}
addToKBlockElement(Htags, Dtags, Ftags, tableTags, htmlTags);
var DOMTokenList = function() {
  function DOMTokenList2(valuesInit, afterUpdate) {
    if (valuesInit === void 0) {
      valuesInit = [];
    }
    if (afterUpdate === void 0) {
      afterUpdate = function() {
        return null;
      };
    }
    this._set = new Set(valuesInit);
    this._afterUpdate = afterUpdate;
  }
  DOMTokenList2.prototype._validate = function(c) {
    if (/\s/.test(c)) {
      throw new Error("DOMException in DOMTokenList.add: The token '" + c + "' contains HTML space characters, which are not valid in tokens.");
    }
  };
  DOMTokenList2.prototype.add = function(c) {
    this._validate(c);
    this._set.add(c);
    this._afterUpdate(this);
  };
  DOMTokenList2.prototype.replace = function(c1, c2) {
    this._validate(c2);
    this._set.delete(c1);
    this._set.add(c2);
    this._afterUpdate(this);
  };
  DOMTokenList2.prototype.remove = function(c) {
    this._set.delete(c) && this._afterUpdate(this);
  };
  DOMTokenList2.prototype.toggle = function(c) {
    this._validate(c);
    if (this._set.has(c))
      this._set.delete(c);
    else
      this._set.add(c);
    this._afterUpdate(this);
  };
  DOMTokenList2.prototype.contains = function(c) {
    return this._set.has(c);
  };
  Object.defineProperty(DOMTokenList2.prototype, "length", {
    get: function() {
      return this._set.size;
    },
    enumerable: false,
    configurable: true
  });
  DOMTokenList2.prototype.values = function() {
    return this._set.values();
  };
  Object.defineProperty(DOMTokenList2.prototype, "value", {
    get: function() {
      return Array.from(this._set.values());
    },
    enumerable: false,
    configurable: true
  });
  DOMTokenList2.prototype.toString = function() {
    return Array.from(this._set.values()).join(" ");
  };
  return DOMTokenList2;
}();
var HTMLElement$1 = function(_super) {
  __extends(HTMLElement2, _super);
  function HTMLElement2(tagName, keyAttrs, rawAttrs, parentNode, range2) {
    if (rawAttrs === void 0) {
      rawAttrs = "";
    }
    var _this = _super.call(this, parentNode, range2) || this;
    _this.rawAttrs = rawAttrs;
    _this.nodeType = type_1.default.ELEMENT_NODE;
    _this.rawTagName = tagName;
    _this.rawAttrs = rawAttrs || "";
    _this.id = keyAttrs.id || "";
    _this.childNodes = [];
    _this.classList = new DOMTokenList(keyAttrs.class ? keyAttrs.class.split(/\s+/) : [], function(classList) {
      return _this.setAttribute("class", classList.toString());
    });
    if (keyAttrs.id) {
      if (!rawAttrs) {
        _this.rawAttrs = 'id="' + keyAttrs.id + '"';
      }
    }
    if (keyAttrs.class) {
      if (!rawAttrs) {
        var cls = 'class="' + _this.classList.toString() + '"';
        if (_this.rawAttrs) {
          _this.rawAttrs += " " + cls;
        } else {
          _this.rawAttrs = cls;
        }
      }
    }
    return _this;
  }
  HTMLElement2.prototype.quoteAttribute = function(attr) {
    if (attr == null) {
      return "null";
    }
    return JSON.stringify(attr.replace(/"/g, "&quot;"));
  };
  HTMLElement2.prototype.remove = function() {
    var _this = this;
    if (this.parentNode) {
      var children = this.parentNode.childNodes;
      this.parentNode.childNodes = children.filter(function(child) {
        return _this !== child;
      });
    }
  };
  HTMLElement2.prototype.removeChild = function(node2) {
    this.childNodes = this.childNodes.filter(function(child) {
      return child !== node2;
    });
  };
  HTMLElement2.prototype.exchangeChild = function(oldNode, newNode) {
    var children = this.childNodes;
    this.childNodes = children.map(function(child) {
      if (child === oldNode) {
        return newNode;
      }
      return child;
    });
  };
  Object.defineProperty(HTMLElement2.prototype, "tagName", {
    get: function() {
      return this.rawTagName ? this.rawTagName.toUpperCase() : this.rawTagName;
    },
    set: function(newname) {
      this.rawTagName = newname.toLowerCase();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(HTMLElement2.prototype, "localName", {
    get: function() {
      return this.rawTagName.toLowerCase();
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(HTMLElement2.prototype, "isVoidElement", {
    get: function() {
      return voidTags.has(this.localName);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(HTMLElement2.prototype, "rawText", {
    get: function() {
      return this.childNodes.reduce(function(pre2, cur) {
        return pre2 += cur.rawText;
      }, "");
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(HTMLElement2.prototype, "textContent", {
    get: function() {
      return decode(this.rawText);
    },
    set: function(val) {
      var content = [new text_1.default(val, this)];
      this.childNodes = content;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(HTMLElement2.prototype, "text", {
    get: function() {
      return decode(this.rawText);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(HTMLElement2.prototype, "structuredText", {
    get: function() {
      var currentBlock2 = [];
      var blocks = [currentBlock2];
      function dfs(node2) {
        if (node2.nodeType === type_1.default.ELEMENT_NODE) {
          if (kBlockElements.has(node2.rawTagName)) {
            if (currentBlock2.length > 0) {
              blocks.push(currentBlock2 = []);
            }
            node2.childNodes.forEach(dfs);
            if (currentBlock2.length > 0) {
              blocks.push(currentBlock2 = []);
            }
          } else {
            node2.childNodes.forEach(dfs);
          }
        } else if (node2.nodeType === type_1.default.TEXT_NODE) {
          if (node2.isWhitespace) {
            currentBlock2.prependWhitespace = true;
          } else {
            var text2 = node2.trimmedText;
            if (currentBlock2.prependWhitespace) {
              text2 = " " + text2;
              currentBlock2.prependWhitespace = false;
            }
            currentBlock2.push(text2);
          }
        }
      }
      dfs(this);
      return blocks.map(function(block2) {
        return block2.join("").replace(/\s{2,}/g, " ");
      }).join("\n").replace(/\s+$/, "");
    },
    enumerable: false,
    configurable: true
  });
  HTMLElement2.prototype.toString = function() {
    var tag = this.rawTagName;
    if (tag) {
      var attrs = this.rawAttrs ? " " + this.rawAttrs : "";
      return this.isVoidElement ? "<" + tag + attrs + ">" : "<" + tag + attrs + ">" + this.innerHTML + "</" + tag + ">";
    }
    return this.innerHTML;
  };
  Object.defineProperty(HTMLElement2.prototype, "innerHTML", {
    get: function() {
      return this.childNodes.map(function(child) {
        return child.toString();
      }).join("");
    },
    set: function(content) {
      var r = parse$1(content);
      this.childNodes = r.childNodes.length ? r.childNodes : [new text_1.default(content, this)];
    },
    enumerable: false,
    configurable: true
  });
  HTMLElement2.prototype.set_content = function(content, options) {
    if (options === void 0) {
      options = {};
    }
    if (content instanceof node_1.default) {
      content = [content];
    } else if (typeof content == "string") {
      var r = parse$1(content, options);
      content = r.childNodes.length ? r.childNodes : [new text_1.default(content, this)];
    }
    this.childNodes = content;
  };
  HTMLElement2.prototype.replaceWith = function() {
    var _this = this;
    var nodes = [];
    for (var _i = 0; _i < arguments.length; _i++) {
      nodes[_i] = arguments[_i];
    }
    var content = nodes.map(function(node2) {
      if (node2 instanceof node_1.default) {
        return [node2];
      } else if (typeof node2 == "string") {
        var r = parse$1(node2);
        return r.childNodes.length ? r.childNodes : [new text_1.default(node2, _this)];
      }
      return [];
    }).flat();
    var idx = this.parentNode.childNodes.findIndex(function(child) {
      return child === _this;
    });
    this.parentNode.childNodes = __spreadArray(__spreadArray(__spreadArray([], this.parentNode.childNodes.slice(0, idx), true), content, true), this.parentNode.childNodes.slice(idx + 1), true);
  };
  Object.defineProperty(HTMLElement2.prototype, "outerHTML", {
    get: function() {
      return this.toString();
    },
    enumerable: false,
    configurable: true
  });
  HTMLElement2.prototype.trimRight = function(pattern) {
    for (var i = 0; i < this.childNodes.length; i++) {
      var childNode = this.childNodes[i];
      if (childNode.nodeType === type_1.default.ELEMENT_NODE) {
        childNode.trimRight(pattern);
      } else {
        var index2 = childNode.rawText.search(pattern);
        if (index2 > -1) {
          childNode.rawText = childNode.rawText.substr(0, index2);
          this.childNodes.length = i + 1;
        }
      }
    }
    return this;
  };
  Object.defineProperty(HTMLElement2.prototype, "structure", {
    get: function() {
      var res = [];
      var indention = 0;
      function write2(str) {
        res.push("  ".repeat(indention) + str);
      }
      function dfs(node2) {
        var idStr = node2.id ? "#" + node2.id : "";
        var classStr = node2.classList.length ? "." + node2.classList.value.join(".") : "";
        write2("" + node2.rawTagName + idStr + classStr);
        indention++;
        node2.childNodes.forEach(function(childNode) {
          if (childNode.nodeType === type_1.default.ELEMENT_NODE) {
            dfs(childNode);
          } else if (childNode.nodeType === type_1.default.TEXT_NODE) {
            if (!childNode.isWhitespace) {
              write2("#text");
            }
          }
        });
        indention--;
      }
      dfs(this);
      return res.join("\n");
    },
    enumerable: false,
    configurable: true
  });
  HTMLElement2.prototype.removeWhitespace = function() {
    var _this = this;
    var o = 0;
    this.childNodes.forEach(function(node2) {
      if (node2.nodeType === type_1.default.TEXT_NODE) {
        if (node2.isWhitespace) {
          return;
        }
        node2.rawText = node2.trimmedRawText;
      } else if (node2.nodeType === type_1.default.ELEMENT_NODE) {
        node2.removeWhitespace();
      }
      _this.childNodes[o++] = node2;
    });
    this.childNodes.length = o;
    return this;
  };
  HTMLElement2.prototype.querySelectorAll = function(selector) {
    return (0, css_select_1.selectAll)(selector, this, {
      xmlMode: true,
      adapter: matcher_1.default
    });
  };
  HTMLElement2.prototype.querySelector = function(selector) {
    return (0, css_select_1.selectOne)(selector, this, {
      xmlMode: true,
      adapter: matcher_1.default
    });
  };
  HTMLElement2.prototype.getElementsByTagName = function(tagName) {
    var upperCasedTagName = tagName.toUpperCase();
    var re = [];
    var stack2 = [];
    var currentNodeReference = this;
    var index2 = 0;
    while (index2 !== void 0) {
      var child = void 0;
      do {
        child = currentNodeReference.childNodes[index2++];
      } while (index2 < currentNodeReference.childNodes.length && child === void 0);
      if (child === void 0) {
        currentNodeReference = currentNodeReference.parentNode;
        index2 = stack2.pop();
        continue;
      }
      if (child.nodeType === type_1.default.ELEMENT_NODE) {
        if (tagName === "*" || child.tagName === upperCasedTagName)
          re.push(child);
        if (child.childNodes.length > 0) {
          stack2.push(index2);
          currentNodeReference = child;
          index2 = 0;
        }
      }
    }
    return re;
  };
  HTMLElement2.prototype.closest = function(selector) {
    var mapChild = new Map();
    var el2 = this;
    var old = null;
    function findOne2(test, elems) {
      var elem = null;
      for (var i = 0, l = elems.length; i < l && !elem; i++) {
        var el_1 = elems[i];
        if (test(el_1)) {
          elem = el_1;
        } else {
          var child = mapChild.get(el_1);
          if (child) {
            elem = findOne2(test, [child]);
          }
        }
      }
      return elem;
    }
    while (el2) {
      mapChild.set(el2, old);
      old = el2;
      el2 = el2.parentNode;
    }
    el2 = this;
    while (el2) {
      var e = (0, css_select_1.selectOne)(selector, el2, {
        xmlMode: true,
        adapter: __assign(__assign({}, matcher_1.default), { getChildren: function(node2) {
          var child = mapChild.get(node2);
          return child && [child];
        }, getSiblings: function(node2) {
          return [node2];
        }, findOne: findOne2, findAll: function() {
          return [];
        } })
      });
      if (e) {
        return e;
      }
      el2 = el2.parentNode;
    }
    return null;
  };
  HTMLElement2.prototype.appendChild = function(node2) {
    this.childNodes.push(node2);
    node2.parentNode = this;
    return node2;
  };
  Object.defineProperty(HTMLElement2.prototype, "firstChild", {
    get: function() {
      return this.childNodes[0];
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(HTMLElement2.prototype, "lastChild", {
    get: function() {
      return (0, back_1.default)(this.childNodes);
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(HTMLElement2.prototype, "attrs", {
    get: function() {
      if (this._attrs) {
        return this._attrs;
      }
      this._attrs = {};
      var attrs = this.rawAttributes;
      for (var key in attrs) {
        var val = attrs[key] || "";
        this._attrs[key.toLowerCase()] = decode(val);
      }
      return this._attrs;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(HTMLElement2.prototype, "attributes", {
    get: function() {
      var ret_attrs = {};
      var attrs = this.rawAttributes;
      for (var key in attrs) {
        var val = attrs[key] || "";
        ret_attrs[key] = decode(val);
      }
      return ret_attrs;
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(HTMLElement2.prototype, "rawAttributes", {
    get: function() {
      if (this._rawAttrs) {
        return this._rawAttrs;
      }
      var attrs = {};
      if (this.rawAttrs) {
        var re = /([a-zA-Z()#][a-zA-Z0-9-_:()#]*)(?:\s*=\s*((?:'[^']*')|(?:"[^"]*")|\S+))?/g;
        var match2 = void 0;
        while (match2 = re.exec(this.rawAttrs)) {
          var key = match2[1];
          var val = match2[2] || null;
          if (val && (val[0] === "'" || val[0] === '"'))
            val = val.slice(1, val.length - 1);
          attrs[key] = val;
        }
      }
      this._rawAttrs = attrs;
      return attrs;
    },
    enumerable: false,
    configurable: true
  });
  HTMLElement2.prototype.removeAttribute = function(key) {
    var attrs = this.rawAttributes;
    delete attrs[key];
    if (this._attrs) {
      delete this._attrs[key];
    }
    this.rawAttrs = Object.keys(attrs).map(function(name) {
      var val = JSON.stringify(attrs[name]);
      if (val === void 0 || val === "null") {
        return name;
      }
      return name + "=" + val;
    }).join(" ");
    if (key === "id") {
      this.id = "";
    }
  };
  HTMLElement2.prototype.hasAttribute = function(key) {
    return key.toLowerCase() in this.attrs;
  };
  HTMLElement2.prototype.getAttribute = function(key) {
    return this.attrs[key.toLowerCase()];
  };
  HTMLElement2.prototype.setAttribute = function(key, value) {
    var _this = this;
    if (arguments.length < 2) {
      throw new Error("Failed to execute 'setAttribute' on 'Element'");
    }
    var k2 = key.toLowerCase();
    var attrs = this.rawAttributes;
    for (var k in attrs) {
      if (k.toLowerCase() === k2) {
        key = k;
        break;
      }
    }
    attrs[key] = String(value);
    if (this._attrs) {
      this._attrs[k2] = decode(attrs[key]);
    }
    this.rawAttrs = Object.keys(attrs).map(function(name) {
      var val = _this.quoteAttribute(attrs[name]);
      if (val === "null" || val === '""')
        return name;
      return name + "=" + val;
    }).join(" ");
    if (key === "id") {
      this.id = value;
    }
  };
  HTMLElement2.prototype.setAttributes = function(attributes2) {
    var _this = this;
    if (this._attrs) {
      delete this._attrs;
    }
    if (this._rawAttrs) {
      delete this._rawAttrs;
    }
    this.rawAttrs = Object.keys(attributes2).map(function(name) {
      var val = attributes2[name];
      if (val === "null" || val === '""')
        return name;
      return name + "=" + _this.quoteAttribute(String(val));
    }).join(" ");
  };
  HTMLElement2.prototype.insertAdjacentHTML = function(where, html2) {
    var _a, _b, _c;
    var _this = this;
    if (arguments.length < 2) {
      throw new Error("2 arguments required");
    }
    var p2 = parse$1(html2);
    if (where === "afterend") {
      var idx = this.parentNode.childNodes.findIndex(function(child) {
        return child === _this;
      });
      (_a = this.parentNode.childNodes).splice.apply(_a, __spreadArray([idx + 1, 0], p2.childNodes, false));
      p2.childNodes.forEach(function(n) {
        if (n instanceof HTMLElement2) {
          n.parentNode = _this.parentNode;
        }
      });
    } else if (where === "afterbegin") {
      (_b = this.childNodes).unshift.apply(_b, p2.childNodes);
    } else if (where === "beforeend") {
      p2.childNodes.forEach(function(n) {
        _this.appendChild(n);
      });
    } else if (where === "beforebegin") {
      var idx = this.parentNode.childNodes.findIndex(function(child) {
        return child === _this;
      });
      (_c = this.parentNode.childNodes).splice.apply(_c, __spreadArray([idx, 0], p2.childNodes, false));
      p2.childNodes.forEach(function(n) {
        if (n instanceof HTMLElement2) {
          n.parentNode = _this.parentNode;
        }
      });
    } else {
      throw new Error("The value provided ('" + where + "') is not one of 'beforebegin', 'afterbegin', 'beforeend', or 'afterend'");
    }
  };
  Object.defineProperty(HTMLElement2.prototype, "nextSibling", {
    get: function() {
      if (this.parentNode) {
        var children = this.parentNode.childNodes;
        var i = 0;
        while (i < children.length) {
          var child = children[i++];
          if (this === child)
            return children[i] || null;
        }
        return null;
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(HTMLElement2.prototype, "nextElementSibling", {
    get: function() {
      if (this.parentNode) {
        var children = this.parentNode.childNodes;
        var i = 0;
        var find2 = false;
        while (i < children.length) {
          var child = children[i++];
          if (find2) {
            if (child instanceof HTMLElement2) {
              return child || null;
            }
          } else if (this === child) {
            find2 = true;
          }
        }
        return null;
      }
    },
    enumerable: false,
    configurable: true
  });
  Object.defineProperty(HTMLElement2.prototype, "classNames", {
    get: function() {
      return this.classList.toString();
    },
    enumerable: false,
    configurable: true
  });
  return HTMLElement2;
}(node_1.default);
html.default = HTMLElement$1;
var kMarkupPattern = /<!--[\s\S]*?-->|<(\/?)([a-zA-Z][-.:0-9_a-zA-Z]*)((?:\s+[^>]*?(?:(?:'[^']*')|(?:"[^"]*"))?)*)\s*(\/?)>/g;
var kAttributePattern = /(?:^|\s)(id|class)\s*=\s*((?:'[^']*')|(?:"[^"]*")|\S+)/gi;
var kSelfClosingElements = {
  area: true,
  AREA: true,
  base: true,
  BASE: true,
  br: true,
  BR: true,
  col: true,
  COL: true,
  hr: true,
  HR: true,
  img: true,
  IMG: true,
  input: true,
  INPUT: true,
  link: true,
  LINK: true,
  meta: true,
  META: true,
  source: true,
  SOURCE: true,
  embed: true,
  EMBED: true,
  param: true,
  PARAM: true,
  track: true,
  TRACK: true,
  wbr: true,
  WBR: true
};
var kElementsClosedByOpening = {
  li: { li: true, LI: true },
  LI: { li: true, LI: true },
  p: { p: true, div: true, P: true, DIV: true },
  P: { p: true, div: true, P: true, DIV: true },
  b: { div: true, DIV: true },
  B: { div: true, DIV: true },
  td: { td: true, th: true, TD: true, TH: true },
  TD: { td: true, th: true, TD: true, TH: true },
  th: { td: true, th: true, TD: true, TH: true },
  TH: { td: true, th: true, TD: true, TH: true },
  h1: { h1: true, H1: true },
  H1: { h1: true, H1: true },
  h2: { h2: true, H2: true },
  H2: { h2: true, H2: true },
  h3: { h3: true, H3: true },
  H3: { h3: true, H3: true },
  h4: { h4: true, H4: true },
  H4: { h4: true, H4: true },
  h5: { h5: true, H5: true },
  H5: { h5: true, H5: true },
  h6: { h6: true, H6: true },
  H6: { h6: true, H6: true }
};
var kElementsClosedByClosing = {
  li: { ul: true, ol: true, UL: true, OL: true },
  LI: { ul: true, ol: true, UL: true, OL: true },
  a: { div: true, DIV: true },
  A: { div: true, DIV: true },
  b: { div: true, DIV: true },
  B: { div: true, DIV: true },
  i: { div: true, DIV: true },
  I: { div: true, DIV: true },
  p: { div: true, DIV: true },
  P: { div: true, DIV: true },
  td: { tr: true, table: true, TR: true, TABLE: true },
  TD: { tr: true, table: true, TR: true, TABLE: true },
  th: { tr: true, table: true, TR: true, TABLE: true },
  TH: { tr: true, table: true, TR: true, TABLE: true }
};
var frameflag = "documentfragmentcontainer";
function base_parse(data, options) {
  if (options === void 0) {
    options = { lowerCaseTagName: false, comment: false };
  }
  var elements = options.blockTextElements || {
    script: true,
    noscript: true,
    style: true,
    pre: true
  };
  var element_names = Object.keys(elements);
  var kBlockTextElements = element_names.map(function(it2) {
    return new RegExp("^" + it2 + "$", "i");
  });
  var kIgnoreElements = element_names.filter(function(it2) {
    return elements[it2];
  }).map(function(it2) {
    return new RegExp("^" + it2 + "$", "i");
  });
  function element_should_be_ignore(tag) {
    return kIgnoreElements.some(function(it2) {
      return it2.test(tag);
    });
  }
  function is_block_text_element(tag) {
    return kBlockTextElements.some(function(it2) {
      return it2.test(tag);
    });
  }
  var createRange = function(startPos, endPos) {
    return [startPos - frameFlagOffset, endPos - frameFlagOffset];
  };
  var root = new HTMLElement$1(null, {}, "", null, [0, data.length]);
  var currentParent = root;
  var stack2 = [root];
  var lastTextPos = -1;
  var noNestedTagIndex = void 0;
  var match2;
  data = "<" + frameflag + ">" + data + "</" + frameflag + ">";
  var lowerCaseTagName = options.lowerCaseTagName;
  var dataEndPos = data.length - (frameflag.length + 2);
  var frameFlagOffset = frameflag.length + 2;
  while (match2 = kMarkupPattern.exec(data)) {
    var matchText = match2[0], leadingSlash = match2[1], tagName = match2[2], attributes2 = match2[3], closingSlash = match2[4];
    var matchLength = matchText.length;
    var tagStartPos = kMarkupPattern.lastIndex - matchLength;
    var tagEndPos = kMarkupPattern.lastIndex;
    if (lastTextPos > -1) {
      if (lastTextPos + matchLength < tagEndPos) {
        var text2 = data.substring(lastTextPos, tagStartPos);
        currentParent.appendChild(new text_1.default(text2, currentParent, createRange(lastTextPos, tagStartPos)));
      }
    }
    lastTextPos = kMarkupPattern.lastIndex;
    if (tagName === frameflag)
      continue;
    if (matchText[1] === "!") {
      if (options.comment) {
        var text2 = data.substring(tagStartPos + 4, tagEndPos - 3);
        currentParent.appendChild(new comment_1.default(text2, currentParent, createRange(tagStartPos, tagEndPos)));
      }
      continue;
    }
    if (lowerCaseTagName)
      tagName = tagName.toLowerCase();
    if (!leadingSlash) {
      var attrs = {};
      for (var attMatch = void 0; attMatch = kAttributePattern.exec(attributes2); ) {
        var key = attMatch[1], val = attMatch[2];
        var isQuoted = val[0] === "'" || val[0] === '"';
        attrs[key.toLowerCase()] = isQuoted ? val.slice(1, val.length - 1) : val;
      }
      var parentTagName = currentParent.rawTagName;
      if (!closingSlash && kElementsClosedByOpening[parentTagName]) {
        if (kElementsClosedByOpening[parentTagName][tagName]) {
          stack2.pop();
          currentParent = (0, back_1.default)(stack2);
        }
      }
      if (tagName === "a" || tagName === "A") {
        if (noNestedTagIndex !== void 0) {
          stack2.splice(noNestedTagIndex);
          currentParent = (0, back_1.default)(stack2);
        }
        noNestedTagIndex = stack2.length;
      }
      var tagEndPos_1 = kMarkupPattern.lastIndex;
      var tagStartPos_1 = tagEndPos_1 - matchLength;
      currentParent = currentParent.appendChild(new HTMLElement$1(tagName, attrs, attributes2.slice(1), null, createRange(tagStartPos_1, tagEndPos_1)));
      stack2.push(currentParent);
      if (is_block_text_element(tagName)) {
        var closeMarkup = "</" + tagName + ">";
        var closeIndex = lowerCaseTagName ? data.toLocaleLowerCase().indexOf(closeMarkup, kMarkupPattern.lastIndex) : data.indexOf(closeMarkup, kMarkupPattern.lastIndex);
        var textEndPos = closeIndex === -1 ? dataEndPos : closeIndex;
        if (element_should_be_ignore(tagName)) {
          var text2 = data.substring(tagEndPos_1, textEndPos);
          if (text2.length > 0 && /\S/.test(text2)) {
            currentParent.appendChild(new text_1.default(text2, currentParent, createRange(tagEndPos_1, textEndPos)));
          }
        }
        if (closeIndex === -1) {
          lastTextPos = kMarkupPattern.lastIndex = data.length + 1;
        } else {
          lastTextPos = kMarkupPattern.lastIndex = closeIndex + closeMarkup.length;
          leadingSlash = "/";
        }
      }
    }
    if (leadingSlash || closingSlash || kSelfClosingElements[tagName]) {
      while (true) {
        if (tagName === "a" || tagName === "A")
          noNestedTagIndex = void 0;
        if (currentParent.rawTagName === tagName) {
          currentParent.range[1] = createRange(-1, Math.max(lastTextPos, tagEndPos))[1];
          stack2.pop();
          currentParent = (0, back_1.default)(stack2);
          break;
        } else {
          var parentTagName = currentParent.tagName;
          if (kElementsClosedByClosing[parentTagName]) {
            if (kElementsClosedByClosing[parentTagName][tagName]) {
              stack2.pop();
              currentParent = (0, back_1.default)(stack2);
              continue;
            }
          }
          break;
        }
      }
    }
  }
  return stack2;
}
html.base_parse = base_parse;
function parse$1(data, options) {
  if (options === void 0) {
    options = { lowerCaseTagName: false, comment: false };
  }
  var stack2 = base_parse(data, options);
  var root = stack2[0];
  var _loop_1 = function() {
    var last = stack2.pop();
    var oneBefore = (0, back_1.default)(stack2);
    if (last.parentNode && last.parentNode.parentNode) {
      if (last.parentNode === oneBefore && last.tagName === oneBefore.tagName) {
        oneBefore.removeChild(last);
        last.childNodes.forEach(function(child) {
          oneBefore.parentNode.appendChild(child);
        });
        stack2.pop();
      } else {
        oneBefore.removeChild(last);
        last.childNodes.forEach(function(child) {
          oneBefore.appendChild(child);
        });
      }
    }
  };
  while (stack2.length > 1) {
    _loop_1();
  }
  return root;
}
html.parse = parse$1;
var parse = {};
(function(exports) {
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.default = void 0;
  var html_12 = html;
  Object.defineProperty(exports, "default", { enumerable: true, get: function() {
    return html_12.parse;
  } });
})(parse);
var valid$1 = {};
Object.defineProperty(valid$1, "__esModule", { value: true });
var html_1 = html;
function valid(data, options) {
  if (options === void 0) {
    options = { lowerCaseTagName: false, comment: false };
  }
  var stack2 = (0, html_1.base_parse)(data, options);
  return Boolean(stack2.length === 1);
}
valid$1.default = valid;
(function(exports) {
  var __importDefault2 = commonjsGlobal && commonjsGlobal.__importDefault || function(mod) {
    return mod && mod.__esModule ? mod : { "default": mod };
  };
  Object.defineProperty(exports, "__esModule", { value: true });
  exports.NodeType = exports.TextNode = exports.Node = exports.valid = exports.default = exports.parse = exports.HTMLElement = exports.CommentNode = void 0;
  var comment_12 = comment;
  Object.defineProperty(exports, "CommentNode", { enumerable: true, get: function() {
    return __importDefault2(comment_12).default;
  } });
  var html_12 = html;
  Object.defineProperty(exports, "HTMLElement", { enumerable: true, get: function() {
    return __importDefault2(html_12).default;
  } });
  var parse_1 = parse;
  Object.defineProperty(exports, "parse", { enumerable: true, get: function() {
    return __importDefault2(parse_1).default;
  } });
  Object.defineProperty(exports, "default", { enumerable: true, get: function() {
    return __importDefault2(parse_1).default;
  } });
  var valid_1 = valid$1;
  Object.defineProperty(exports, "valid", { enumerable: true, get: function() {
    return __importDefault2(valid_1).default;
  } });
  var node_12 = node$1;
  Object.defineProperty(exports, "Node", { enumerable: true, get: function() {
    return __importDefault2(node_12).default;
  } });
  var text_12 = text;
  Object.defineProperty(exports, "TextNode", { enumerable: true, get: function() {
    return __importDefault2(text_12).default;
  } });
  var type_12 = type;
  Object.defineProperty(exports, "NodeType", { enumerable: true, get: function() {
    return __importDefault2(type_12).default;
  } });
})(dist);
function addScript$1(src, type2) {
  const script = document.createElement("script");
  script.setAttribute("src", src);
  script.setAttribute("type", type2);
  document.head.appendChild(script);
}
function onIdle$1(callback) {
  let requestIdleCallback = window.requestIdleCallback;
  if (!window.requestIdleCallback) {
    requestIdleCallback = (fn2) => setTimeout(fn2, 200);
  }
  requestIdleCallback(callback);
}
function onMedia$1(query) {
  return function onMedia2(fn2) {
    const mediaQuery = matchMedia(query);
    if (mediaQuery.matches) {
      fn2();
    } else {
      mediaQuery.addEventListener("change", fn2, { once: true });
    }
  };
}
function onDisplay$1(id) {
  return function onDisplay2(fn2) {
    const observer = new IntersectionObserver(([{ isIntersecting }]) => {
      if (isIntersecting) {
        observer.disconnect();
        fn2();
      }
    });
    const fragment = document.getElementById(id);
    if (!fragment) {
      throw new Error(`onDisplay: fragment #${id} not found`);
    }
    for (const child of Array.from(fragment.children)) {
      observer.observe(child);
    }
  };
}
var client = {
  addScript: addScript$1,
  onIdle: onIdle$1,
  onMedia: onMedia$1,
  onDisplay: onDisplay$1
};
const { parse: parseHTML } = dist;
const { addScript } = client;
function packIsland$1(id, loader) {
  return (req, reply, payload, done) => {
    const result = {
      scripts: [],
      links: [],
      markup: null
    };
    try {
      const host = req.headers.host;
      const parsed = parseHTML(payload);
      const scripts = parsed.querySelectorAll("script");
      const links = parsed.querySelectorAll("link");
      for (const link of links) {
        if (link.attributes.rel === "modulepreload") {
          result.scripts.push({
            type: "module",
            src: `//${host}${link.attributes.href}`
          });
        } else {
          result.links.push(`<link ${link.rawAttrs}>`);
        }
      }
      for (const script of scripts) {
        result.scripts.push({
          type: script.attributes.type,
          src: `//${host}${script.attributes.src}`
        });
      }
      let markup = parsed.querySelector(id);
      if (markup) {
        markup = payload.slice(...markup.range);
        result.markup = markup;
      }
      let html2 = "";
      for (const link of result.links) {
        html2 += `${link}
`;
      }
      html2 += `${result.markup}
`;
      if (result.scripts.length) {
        html2 += "<script>\n";
        html2 += `${loader.toString()}
`;
        html2 += `${addScript.toString()}
`;
        html2 += `${loader.name}(() => {
`;
        for (const script of result.scripts) {
          html2 += `  addScript('${script.src}', '${script.type}')
`;
        }
        html2 += "})\n<\/script>\n";
      }
      done(null, html2);
    } catch (error) {
      done(error, payload);
    }
  };
}
var islands = { packIsland: packIsland$1 };
const { packIsland } = islands;
const { onIdle, onMedia, onDisplay } = client;
function flattenPaths(viewPath) {
  if (!viewPath) {
    return [];
  }
  if (typeof viewPath === "string") {
    return [viewPath];
  }
  if (Array.isArray(viewPath)) {
    return viewPath;
  }
  return [];
}
function getRoutes$1(views) {
  const routes = [];
  for (const [componentPath, view] of Object.entries(views)) {
    const _a = view, { default: component } = _a, viewProps = __objRest(_a, ["default"]);
    for (const path of flattenPaths(view.path)) {
      routes.push(__spreadValues({ path, componentPath, component }, viewProps));
    }
  }
  return routes.sort((a, b) => {
    if (b.path > a.path) {
      return 1;
    } else if (a.path > b.path) {
      return -1;
    } else {
      return 0;
    }
  });
}
var app$1 = {
  flattenPaths,
  getRoutes: getRoutes$1,
  packIsland,
  onIdle,
  onMedia,
  onDisplay
};
var require$$0 = /* @__PURE__ */ getAugmentedNamespace(vue_runtime_esmBundler);
var require$$1 = /* @__PURE__ */ getAugmentedNamespace(vueRouter_esmBundler);
function manifetch$1(instance) {
  return getFetchWrapper.bind(instance);
}
var manifetch_1 = manifetch$1;
function getFetchWrapper(methods, method) {
  if (method in methods) {
    if (!Array.isArray(methods[method]) && typeof methods[method] === "object") {
      return new Proxy(methods[method], { get: getFetchWrapper.bind(this) });
    }
    const [httpMethod, path] = methods[method];
    const hasParams = path.match(/\/:(\w+)/);
    if (hasParams) {
      return async (params, options = {}) => {
        options.method = httpMethod;
        const response = await this.fetch(`${this.prefix}${applyParams(path, params)}`, options);
        const body = await response.text();
        return {
          body,
          json: tryJSONParse(body),
          status: response.status,
          headers: response.headers
        };
      };
    } else {
      return async (options = {}) => {
        options.method = httpMethod;
        const response = await this.fetch(`${this.prefix}${path}`, options);
        const body = await response.text();
        return {
          body,
          json: tryJSONParse(body),
          status: response.status,
          headers: response.headers
        };
      };
    }
  }
}
function applyParams(template, params) {
  try {
    return template.replace(/:(\w+)/g, (_, m) => {
      if (params[m]) {
        return params[m];
      } else {
        throw null;
      }
    });
  } catch (err) {
    if (err === null) {
      return err;
    } else {
      throw err;
    }
  }
}
function tryJSONParse(str) {
  try {
    return JSON.parse(str);
  } catch (_) {
    return void 0;
  }
}
const kRoutes$1 = Symbol.for("kRoutes");
const kData$1 = Symbol.for("kData");
const kPayload$1 = Symbol.for("kPayload");
const kStaticPayload$2 = Symbol.for("kStaticPayload");
const kGlobal$1 = Symbol.for("kGlobal");
const kAPI$1 = Symbol.for("kAPI");
const kIsomorphic$1 = Symbol("kIsomorphic");
const kFirstRender$2 = Symbol("kFirstRender");
const kFuncValue$1 = Symbol("kFuncValue");
const kFuncExecuted$1 = Symbol("kFuncExecuted");
var symbols = {
  kRoutes: kRoutes$1,
  kData: kData$1,
  kPayload: kPayload$1,
  kStaticPayload: kStaticPayload$2,
  kGlobal: kGlobal$1,
  kAPI: kAPI$1,
  kIsomorphic: kIsomorphic$1,
  kFirstRender: kFirstRender$2,
  kFuncValue: kFuncValue$1,
  kFuncExecuted: kFuncExecuted$1
};
const { reactive, getCurrentInstance, useSSRContext } = require$$0;
const { useRoute } = require$$1;
const manifetch = manifetch_1;
const {
  kData,
  kPayload,
  kGlobal,
  kStaticPayload: kStaticPayload$1,
  kAPI,
  kIsomorphic,
  kFirstRender: kFirstRender$1
} = symbols;
const isServer = typeof window === "undefined";
const appState$1 = {
  [kIsomorphic]: null,
  [kFirstRender$1]: !isServer
};
function useIsomorphic$1(append2) {
  if (isServer) {
    const ssrContext = useSSRContext();
    return Object.assign({
      $error: ssrContext.req.$error,
      $errors: ssrContext.$errors,
      $payload: ssrContext.$payload,
      $global: ssrContext.$global,
      $data: ssrContext.$data,
      $api: ssrContext.$api
    }, append2);
  } else {
    if (!appState$1[kIsomorphic]) {
      appState$1[kIsomorphic] = reactive({
        $error: null,
        $errors: {}
      });
    }
    Object.assign(appState$1[kIsomorphic], {
      $global: window[kGlobal],
      $api: new Proxy(__spreadValues({}, window[kAPI]), {
        get: manifetch({
          prefix: "",
          fetch: (...args) => window.fetch(...args)
        })
      })
    }, append2);
    if (!appState$1[kIsomorphic].$data) {
      appState$1[kIsomorphic].$data = window[kData];
      delete window[kData];
    }
    if (!appState$1[kIsomorphic].$payload) {
      appState$1[kIsomorphic].$payload = window[kPayload];
      delete window[kPayload];
    }
    return appState$1[kIsomorphic];
  }
}
function hydrationDone() {
  if (appState$1[kFirstRender$1]) {
    appState$1[kFirstRender$1] = false;
  }
}
function usePayload() {
  const ctx = useIsomorphic$1();
  if ("getPayload" in ctx.$errors) {
    ctx.$error = ctx.$errors.getPayload;
    return false;
  }
  return ctx.$payload;
}
function useData() {
  const ctx = useIsomorphic$1();
  if ("getData" in ctx.$errors) {
    ctx.$error = ctx.$errors.getData;
    return;
  }
  return ctx.$data;
}
function useGlobalProperties() {
  return getCurrentInstance().appContext.app.config.globalProperties;
}
function usePayloadPath$1(route) {
  if (window[kStaticPayload$1]) {
    let { pathname } = Object.assign({}, document.location);
    if (pathname.endsWith("/")) {
      pathname = `${pathname}index`;
    }
    return `${pathname.replace(".html", "")}.json`;
  } else {
    return `/-/payload${route.path}`;
  }
}
async function fetchPayload(route) {
  const payloadURL = usePayloadPath$1(route);
  const response = await window.fetch(payloadURL);
  return response.json();
}
var app = {
  useIsomorphic: useIsomorphic$1,
  usePayload,
  useData,
  useRoute,
  appState: appState$1,
  hydrationDone,
  useGlobalProperties,
  usePayloadPath: usePayloadPath$1,
  fetchPayload
};
const {
  parse: parseRoute,
  match: matchRoute
} = require$$0$3;
const { getRoutes } = app$1;
const { appState, useIsomorphic, usePayloadPath } = app;
const {
  kRoutes,
  kFirstRender,
  kStaticPayload,
  kFuncValue,
  kFuncExecuted
} = symbols;
function hydrateRoutes(globImports) {
  const routes = window[kRoutes];
  delete window[kRoutes];
  for (const route of routes) {
    route.component = memoized(globImports[route.componentPath]);
  }
  return routes;
}
function createBeforeEachHandler(resolvedRoutes) {
  const {
    map: routeMap,
    parsed: parsedRoutes
  } = makeRouteLookups(resolvedRoutes);
  return async (to) => {
    const ctx = useIsomorphic({ params: to.params });
    const {
      hasPayload,
      hasData,
      component
    } = getRouteMeta(to, routeMap, parsedRoutes);
    if (!component) {
      return false;
    }
    if (!!window[kStaticPayload] && hasPayload) {
      try {
        const response = await window.fetch(usePayloadPath(to));
        ctx.$payload = await response.json();
      } catch (error) {
        ctx.$errors.getPayload = error;
      }
    } else if (!appState[kFirstRender] && (hasPayload || hasData)) {
      if (hasPayload) {
        try {
          const response = await window.fetch(usePayloadPath(to));
          ctx.$payload = await response.json();
        } catch (error) {
          ctx.$errors.getPayload = error;
        }
      }
      if (hasData) {
        const { getData } = await component();
        try {
          ctx.$data = await getData(ctx);
        } catch (error) {
          ctx.$errors.getData = error;
        }
      }
    }
  };
}
var routing = {
  getRoutes,
  hydrateRoutes,
  createBeforeEachHandler,
  usePayloadPath
};
function getRouteMeta(route, map2, parsed) {
  const match2 = matchRoute(route.path, parsed);
  return match2.length > 0 && map2[match2[0].old] || {};
}
function makeRouteLookups(resolvedRoutes) {
  const map2 = {};
  const parsed = [];
  for (const route of resolvedRoutes) {
    map2[route.path] = route;
    parsed.push(parseRoute(route.path));
  }
  return { map: map2, parsed };
}
function memoized(func) {
  func[kFuncExecuted] = false;
  return async function() {
    if (!func[kFuncExecuted]) {
      func[kFuncValue] = await func();
      func[kFuncExecuted] = true;
    }
    return func[kFuncValue];
  };
}
function colorVariantClass(component) {
  let colorClass = component.color;
  if (!colorClass) {
    if (component.$inkline.options.colorMode === "system") {
      colorClass = typeof window !== "undefined" && window.matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
    } else {
      colorClass = component.$inkline.options.colorMode;
    }
  }
  return {
    [`-${colorClass}`]: true
  };
}
function hasClass(element, className) {
  if (!element || !className)
    return false;
  if (className.indexOf(" ") !== -1)
    throw new Error("Class name should not contain spaces.");
  if (element.classList) {
    return element.classList.contains(className);
  } else {
    return (" " + element.className + " ").indexOf(" " + className + " ") > -1;
  }
}
function addClass(element, classes) {
  if (!element)
    return;
  let currentClass = element.className;
  const classList = (classes || "").split(" ");
  for (let i = 0, j = classList.length; i < j; i++) {
    const className = classList[i];
    if (!className)
      continue;
    if (element.classList) {
      element.classList.add(className);
    } else if (!hasClass(element, className)) {
      currentClass += " " + className;
    }
  }
  if (!element.classList) {
    element.className = currentClass;
  }
}
function toDashCase(string, from = "camel") {
  const regExp = from === "camel" ? /([A-Z])/g : /_([a-zA-Z])/g;
  return string.replace(regExp, (match2, p2) => "-" + p2.toLowerCase());
}
function breakpointClass(className, breakpoint) {
  if (["string", "number"].indexOf(typeof breakpoint) > -1 && breakpoint !== "") {
    return `${toDashCase(className)}-${breakpoint}`;
  }
  return toDashCase(className);
}
function capitalizeFirst(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}
function clone(source) {
  if (Array.isArray(source)) {
    const target2 = source.slice().map(clone);
    const targetKeys = Object.keys(target2);
    Object.keys(source).filter((key) => !targetKeys.includes(key)).forEach((key) => {
      target2[key] = source[key];
    });
    return target2;
  } else if (typeof source === "object") {
    return Object.keys(source).reduce((acc, key) => {
      acc[key] = clone(source[key]);
      return acc;
    }, {});
  }
  return source;
}
function debounce$1(fn2, delay) {
  let inDebounce;
  return function(...args) {
    const context = this;
    clearTimeout(inDebounce);
    inDebounce = setTimeout(() => fn2.apply(context, args), delay);
  };
}
function isFocusable(element) {
  if (element.tabIndex > 0 || element.tabIndex === 0 && element.getAttribute("tabIndex") !== null) {
    return true;
  }
  if (element.disabled) {
    return false;
  }
  switch (element.nodeName) {
    case "A":
      return !!element.href && element.rel !== "ignore";
    case "INPUT":
      return element.type !== "hidden" && element.type !== "file";
    case "BUTTON":
    case "SELECT":
    case "TEXTAREA":
      return true;
    default:
      return false;
  }
}
function focusAttempt(element) {
  if (!isFocusable(element)) {
    return false;
  }
  try {
    element.focus();
  } catch (e) {
  }
  return typeof window !== "undefined" && document.activeElement === element;
}
function focusFirstDescendant(element) {
  for (let i = 0; i < element.childNodes.length; i++) {
    const child = element.childNodes[i];
    if (focusAttempt(child) || focusFirstDescendant(child)) {
      return true;
    }
  }
  return false;
}
function getStyleProperty(element, property) {
  if (!element || !property || typeof window === "undefined") {
    return;
  }
  if (element.currentStyle) {
    return element.currentStyle[property];
  }
  const computedStyle = window.getComputedStyle(element, null);
  return computedStyle.getPropertyValue ? computedStyle.getPropertyValue(property) : computedStyle[property];
}
const isFunction = (fn2) => fn2 instanceof Function;
const breakpoints = {
  xs: [0, 575],
  sm: [576, 767],
  md: [768, 991],
  lg: [992, 1199],
  xl: [1200, 1399],
  xxl: [1400, Infinity]
};
const breakpointKeys = ["", "xs", "sm", "md", "lg", "xl", "xxl"];
const keymap = {
  tab: ["Tab", 9],
  enter: ["Enter", 13],
  esc: ["Escape", 27],
  space: [" ", "Space", 32],
  left: ["ArrowLeft", "Left", 37],
  up: ["ArrowUp", "Up", 38],
  right: ["ArrowRight", "Right", 39],
  down: ["ArrowDown", "Down", 40]
};
const defaultValidationValues = {
  pristine: true,
  dirty: false,
  untouched: true,
  touched: false,
  valid: true,
  invalid: false,
  errors: []
};
const defaultFieldValidationValues = {
  value: "",
  validators: []
};
const reservedValidationFields = [
  "value",
  "validators",
  "pristine",
  "dirty",
  "untouched",
  "touched",
  "valid",
  "invalid",
  "errors"
];
const isKey = (key, e) => {
  const keyCode = e.key || e.keyIdentifier || e.keyCode;
  return keymap[key].indexOf(keyCode) !== -1;
};
function isVisible(element) {
  return Boolean(element) && Boolean(element.offsetWidth || element.offsetHeight || element.getClientRects().length);
}
function markSearchString(text2, query) {
  if (!query)
    return [{ text: text2 }];
  const chunks = [];
  const lowerText = text2.toLowerCase();
  const lowerQuery = query.toLowerCase();
  let start2 = 0;
  let end2 = 0;
  while (end2 < text2.length) {
    const foundIdx = lowerText.indexOf(lowerQuery, end2);
    const found = foundIdx >= 0;
    end2 = found ? foundIdx : text2.length;
    if (end2) {
      chunks.push({ text: text2.substring(start2, end2) });
      start2 = end2;
    }
    if (found) {
      end2 += query.length;
      chunks.push({
        text: text2.substring(start2, end2),
        marked: true
      });
      start2 = end2;
    }
  }
  return chunks;
}
function memoize(fn2) {
  const cache = {};
  return (...args) => {
    const cacheKey = JSON.stringify(args);
    if (cacheKey in cache) {
      return cache[cacheKey];
    }
    cache[cacheKey] = fn2(...args);
    return cache[cacheKey];
  };
}
function removeEventListenerBinding(element, event, handler) {
  if (element && event) {
    element.removeEventListener(event, handler, false);
  }
}
function detachEventBinding(element, event, handler) {
  if (element && event) {
    element.detachEvent("on" + event, handler);
  }
}
const _off = () => {
  if (typeof window === "undefined") {
    return () => {
    };
  }
  if (window.document.removeEventListener) {
    return removeEventListenerBinding;
  } else {
    return detachEventBinding;
  }
};
const off = _off();
function addEventListenerBinding(element, event, handler) {
  if (element && event && handler) {
    element.addEventListener(event, handler, false);
  }
}
function attachEventBinding(element, event, handler) {
  if (element && event && handler) {
    element.attachEvent("on" + event, handler);
  }
}
const _on = () => {
  if (typeof window === "undefined") {
    return () => {
    };
  }
  if (window.document.addEventListener) {
    return addEventListenerBinding;
  } else {
    return attachEventBinding;
  }
};
const on = _on();
const renderSvg = (children) => children.map((child) => child.type === "element" ? h(child.name, child.attributes, renderSvg(child.children)) : child.value);
function trim(string) {
  return (string || "").replace(/^[\s\uFEFF]+|[\s\uFEFF]+$/g, "");
}
function removeClass(element, classes) {
  if (!element || !classes) {
    return;
  }
  const classList = classes.split(" ");
  let currentClass = " " + element.className + " ";
  for (let i = 0, j = classList.length; i < j; i++) {
    const className = classList[i];
    if (!className) {
      continue;
    }
    if (element.classList) {
      element.classList.remove(className);
    } else if (hasClass(element, className)) {
      currentClass = currentClass.replace(" " + className + " ", " ");
    }
  }
  if (!element.classList) {
    element.className = trim(currentClass);
  }
}
function getValueByPath(object, path) {
  return path.split(".").reduce((acc, part2) => {
    return acc && acc[part2];
  }, object);
}
function setValueByPath(object, path, key, value) {
  getValueByPath(object, path)[key] = value;
  return object;
}
function setValuesAlongPath(object, path, values) {
  path.split(".").reduce((acc, part2) => {
    Object.keys(values).forEach((key) => {
      acc[part2][key] = values[key];
    });
    return acc && acc[part2];
  }, object);
  Object.keys(values).forEach((key) => {
    object[key] = values[key];
  });
  return object;
}
function toCamelCase(string, from = "dash") {
  const regExp = from === "dash" ? /-([a-z0-9])/g : /_([a-z0-9])/g;
  return string.replace(regExp, (match2, p2) => p2.toUpperCase());
}
function uid(baseId) {
  return `${baseId ? `${baseId}-` : ""}${Math.random().toString(36).substr(2, 9)}`;
}
const alpha$1 = {
  "en-US": /^[A-Z]+$/i,
  "bg-BG": /^[А-Я]+$/i,
  "cs-CZ": /^[A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
  "da-DK": /^[A-ZÆØÅ]+$/i,
  "de-DE": /^[A-ZÄÖÜß]+$/i,
  "el-GR": /^[Α-ω]+$/i,
  "es-ES": /^[A-ZÁÉÍÑÓÚÜ]+$/i,
  "fr-FR": /^[A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
  "it-IT": /^[A-ZÀÉÈÌÎÓÒÙ]+$/i,
  "nb-NO": /^[A-ZÆØÅ]+$/i,
  "nl-NL": /^[A-ZÁÉËÏÓÖÜÚ]+$/i,
  "nn-NO": /^[A-ZÆØÅ]+$/i,
  "hu-HU": /^[A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
  "pl-PL": /^[A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
  "pt-PT": /^[A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]+$/i,
  "ru-RU": /^[А-ЯЁ]+$/i,
  "sl-SI": /^[A-ZČĆĐŠŽ]+$/i,
  "sk-SK": /^[A-ZÁČĎÉÍŇÓŠŤÚÝŽĹŔĽÄÔ]+$/i,
  "sr-RS@latin": /^[A-ZČĆŽŠĐ]+$/i,
  "sr-RS": /^[А-ЯЂЈЉЊЋЏ]+$/i,
  "sv-SE": /^[A-ZÅÄÖ]+$/i,
  "tr-TR": /^[A-ZÇĞİıÖŞÜ]+$/i,
  "uk-UA": /^[А-ЩЬЮЯЄIЇҐі]+$/i,
  "ku-IQ": /^[ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
  ar: /^[ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/
};
const alphanumeric$1 = {
  "en-US": /^[0-9A-Z]+$/i,
  "bg-BG": /^[0-9А-Я]+$/i,
  "cs-CZ": /^[0-9A-ZÁČĎÉĚÍŇÓŘŠŤÚŮÝŽ]+$/i,
  "da-DK": /^[0-9A-ZÆØÅ]+$/i,
  "de-DE": /^[0-9A-ZÄÖÜß]+$/i,
  "el-GR": /^[0-9Α-ω]+$/i,
  "es-ES": /^[0-9A-ZÁÉÍÑÓÚÜ]+$/i,
  "fr-FR": /^[0-9A-ZÀÂÆÇÉÈÊËÏÎÔŒÙÛÜŸ]+$/i,
  "it-IT": /^[0-9A-ZÀÉÈÌÎÓÒÙ]+$/i,
  "hu-HU": /^[0-9A-ZÁÉÍÓÖŐÚÜŰ]+$/i,
  "nb-NO": /^[0-9A-ZÆØÅ]+$/i,
  "nl-NL": /^[0-9A-ZÁÉËÏÓÖÜÚ]+$/i,
  "nn-NO": /^[0-9A-ZÆØÅ]+$/i,
  "pl-PL": /^[0-9A-ZĄĆĘŚŁŃÓŻŹ]+$/i,
  "pt-PT": /^[0-9A-ZÃÁÀÂÇÉÊÍÕÓÔÚÜ]+$/i,
  "ru-RU": /^[0-9А-ЯЁ]+$/i,
  "sl-SI": /^[0-9A-ZČĆĐŠŽ]+$/i,
  "sk-SK": /^[0-9A-ZÁČĎÉÍŇÓŠŤÚÝŽĹŔĽÄÔ]+$/i,
  "sr-RS@latin": /^[0-9A-ZČĆŽŠĐ]+$/i,
  "sr-RS": /^[0-9А-ЯЂЈЉЊЋЏ]+$/i,
  "sv-SE": /^[0-9A-ZÅÄÖ]+$/i,
  "tr-TR": /^[0-9A-ZÇĞİıÖŞÜ]+$/i,
  "uk-UA": /^[0-9А-ЩЬЮЯЄIЇҐі]+$/i,
  "ku-IQ": /^[٠١٢٣٤٥٦٧٨٩0-9ئابپتجچحخدرڕزژسشعغفڤقکگلڵمنوۆھەیێيطؤثآإأكضصةظذ]+$/i,
  ar: /^[٠١٢٣٤٥٦٧٨٩0-9ءآأؤإئابةتثجحخدذرزسشصضطظعغفقكلمنهوىيًٌٍَُِّْٰ]+$/
};
const decimal = {
  "en-US": ".",
  ar: "\u066B"
};
const arabicLocales = [
  "AE",
  "BH",
  "DZ",
  "EG",
  "IQ",
  "JO",
  "KW",
  "LB",
  "LY",
  "MA",
  "QM",
  "QA",
  "SA",
  "SD",
  "SY",
  "TN",
  "YE"
];
const englishLocales = [
  "AU",
  "GB",
  "HK",
  "IN",
  "NZ",
  "ZA",
  "ZM"
];
const dotDecimal = ["ar-EG", "ar-LB", "ar-LY"];
const commaDecimal = [
  "bg-BG",
  "cs-CZ",
  "da-DK",
  "de-DE",
  "el-GR",
  "en-ZM",
  "es-ES",
  "fr-FR",
  "it-IT",
  "ku-IQ",
  "hu-HU",
  "nb-NO",
  "nn-NO",
  "nl-NL",
  "pl-PL",
  "pt-PT",
  "ru-RU",
  "sl-SI",
  "sr-RS@latin",
  "sr-RS",
  "sv-SE",
  "tr-TR",
  "uk-UA"
];
englishLocales.forEach((locale) => {
  alpha$1[`en-${locale}`] = alpha$1["en-US"];
  alphanumeric$1[`en-${locale}`] = alphanumeric$1["en-US"];
  decimal[`en-${locale}`] = decimal["en-US"];
});
arabicLocales.forEach((locale) => {
  alpha$1[`ar-${locale}`] = alpha$1.ar;
  alphanumeric$1[`ar-${locale}`] = alphanumeric$1.ar;
  decimal[`ar-${locale}`] = decimal.ar;
});
dotDecimal.forEach((locale) => {
  decimal[locale] = decimal["en-US"];
});
commaDecimal.forEach((locale) => {
  decimal[locale] = decimal.ar;
});
alpha$1["pt-BR"] = alpha$1["pt-PT"];
alphanumeric$1["pt-BR"] = alphanumeric$1["pt-PT"];
decimal["pt-BR"] = decimal["pt-PT"];
alpha$1["pl-Pl"] = alpha$1["pl-PL"];
alphanumeric$1["pl-Pl"] = alphanumeric$1["pl-PL"];
decimal["pl-Pl"] = decimal["pl-PL"];
function alpha(rawValue, options = {}) {
  const locale = options.locale || "en-US";
  const process = (v) => {
    let value = String(v);
    if (options.allowDashes) {
      value = value.replace(/-/g, "");
    }
    if (options.allowSpaces) {
      value = value.replace(/ /g, "");
    }
    return value;
  };
  if (rawValue.constructor === Array) {
    return rawValue.every((v) => alpha$1[locale].test(process(v)));
  }
  return alpha$1[locale].test(process(rawValue));
}
function alphanumeric(rawValue, options = {}) {
  const locale = options.locale || "en-US";
  const process = (v) => {
    let value = String(v);
    if (options.allowDashes) {
      value = value.replace(/-/g, "");
    }
    if (options.allowSpaces) {
      value = value.replace(/ /g, "");
    }
    return value;
  };
  if (rawValue.constructor === Array) {
    return rawValue.every((v) => alphanumeric$1[locale].test(process(v)));
  }
  return alphanumeric$1[locale].test(process(rawValue));
}
function custom(value, options = { validator: () => true }) {
  if (value.constructor === Array) {
    return value.every((v) => options.validator(v));
  }
  return options.validator(value);
}
function number(value, options = { allowNegative: false, allowDecimal: false }) {
  let regExpString = "\\d+";
  if (options.allowNegative) {
    regExpString = "[-]?" + regExpString;
  }
  if (options.allowDecimal) {
    regExpString += "([\\.\\,]\\d+)?";
  }
  const regExp = new RegExp(`^${regExpString}$`);
  if (value.constructor === Array) {
    return value.every((v) => regExp.test(v));
  }
  return regExp.test(value);
}
const validator = /^(([^<>()[\]\\.,;:\s@"]+(\.[^<>()[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
function email(value) {
  if (value.constructor === Array) {
    return value.every((v) => !v || validator.test(String(v)));
  }
  return !value || validator.test(String(value));
}
function max$1(value, options = { value: 0 }) {
  if (value === void 0 || value === null) {
    return false;
  }
  const process = (v) => Number(v);
  if (Array.isArray(value)) {
    return value.every((v) => process(v) <= options.value);
  }
  return process(value) <= options.value;
}
function maxLength(value, options = { value: 0 }) {
  if (value === void 0 || value === null) {
    return false;
  }
  if (value.constructor === Array) {
    return value.length <= options.value;
  }
  if (typeof value === "object") {
    return Object.keys(value).length <= options.value;
  }
  return String(value).length <= options.value;
}
function min$1(value, options = { value: 0 }) {
  if (value === void 0 || value === null) {
    return false;
  }
  const process = (v) => Number(v);
  if (Array.isArray(value)) {
    return value.every((v) => process(v) >= options.value);
  }
  return process(value) >= options.value;
}
function minLength(value, options = { value: 0 }) {
  if (value === void 0 || value === null) {
    return false;
  }
  if (value.constructor === Array) {
    return value.length >= options.value;
  }
  if (typeof value === "object") {
    return Object.keys(value).length >= options.value;
  }
  return String(value).length >= options.value;
}
function required(value, options = { invalidateFalse: false }) {
  if (value === void 0 || value === null) {
    return false;
  }
  if (value.constructor === Array) {
    return !!value.length;
  }
  if (typeof value === "boolean") {
    return options.invalidateFalse ? value : true;
  }
  return !!String(value).trim().length;
}
function sameAs(value, options = {}) {
  if (!options.target) {
    return false;
  }
  const targetSchema = getValueByPath(options.schema(), options.target);
  if (!targetSchema) {
    throw new Error(`Could not find target with name '${options.target}' in 'sameAs' validator.`);
  }
  return value === targetSchema.value;
}
const validators = {
  alpha,
  alphanumeric,
  custom,
  number,
  email,
  max: max$1,
  maxLength,
  min: min$1,
  minLength,
  required,
  sameAs
};
function initialize(schema) {
  const isField = Object.keys(schema).length === 0 || Array.isArray(schema.validators) || schema.hasOwnProperty("value");
  const defaultValues = isField ? __spreadValues(__spreadValues({}, defaultValidationValues), defaultFieldValidationValues) : defaultValidationValues;
  Object.entries(defaultValues).forEach(([key, value]) => {
    if (!schema.hasOwnProperty(key)) {
      schema[key] = value;
    }
  });
  Object.keys(schema).filter((key) => !reservedValidationFields.includes(key)).forEach((key) => {
    if (typeof schema[key] === "object" || Array.isArray(schema[key])) {
      schema[key] = initialize(schema[key]);
    }
  });
  return schema;
}
const en = {
  validation: {
    alpha: (params) => {
      let context;
      switch (true) {
        case (params.allowSpaces && params.allowDashes):
          context = "letters, spaces, and dashes";
          break;
        case params.allowSpaces:
          context = "letters and spaces";
          break;
        case params.allowDashes:
          context = "letters and dashes";
          break;
        default:
          context = "letters";
      }
      return `Please enter ${context} only.`;
    },
    alphanumeric: (params) => {
      let context;
      switch (true) {
        case (params.allowSpaces && params.allowDashes):
          context = "letters, numbers, spaces, and dashes";
          break;
        case params.allowSpaces:
          context = "letters, numbers, and spaces";
          break;
        case params.allowDashes:
          context = "letters, numbers, and dashes";
          break;
        default:
          context = "letters and numbers";
      }
      return `Please enter ${context} only.`;
    },
    number: (params) => {
      let context;
      switch (true) {
        case (params.allowNegative && params.allowDecimal):
          context = "positive or negative decimal numbers";
          break;
        case params.allowNegative:
          context = "positive or negative numbers";
          break;
        case params.allowDecimal:
          context = "decimal numbers";
          break;
        default:
          context = "numbers";
      }
      return `Please enter ${context} only.`;
    },
    email: () => "Please enter a valid email address.",
    max: () => "Please enter a maximum value of {value}.",
    maxLength: () => "Please enter up to {value} characters.",
    min: () => "Please enter a minimum value of {value}.",
    minLength: () => "Please enter at least {value} characters.",
    required: () => "Please enter a value for this field.",
    sameAs: () => "Please make sure that the two values match.",
    custom: () => "Please enter a correct value for this field."
  }
};
function translate(path, params = {}) {
  const valueByPath = getValueByPath(i18n.messages[i18n.locale], path);
  const string = isFunction(valueByPath) ? valueByPath(params) : valueByPath || path;
  return Object.keys(params).reduce((acc, key) => {
    return acc.replace(new RegExp(`{${key}}`, "g"), `${params[key]}`);
  }, string);
}
const i18n = {
  locale: "en",
  messages: {
    en
  }
};
function setLocale(locale) {
  i18n.locale = locale;
}
function validateFormInput(schema, path = "") {
  const errors = [];
  schema.valid = (schema.validators || []).reduce((acc, rawValidator) => {
    const validator2 = typeof rawValidator === "string" ? { name: rawValidator } : rawValidator;
    const valid2 = validators[validator2.name](schema.value, validator2);
    if (!valid2) {
      const _a = validator2, { name, message } = _a, params = __objRest(_a, ["name", "message"]);
      const i18nParams = __spreadValues({
        name: path.split(".").pop(),
        value: schema.value
      }, params);
      const errorMessage = (message instanceof Function ? message() : message) || translate(`validation.${name}`, i18nParams);
      errors.push({ name, message: errorMessage, path });
    }
    return acc && valid2;
  }, true);
  schema.invalid = !schema.valid;
  schema.errors = errors;
  return schema;
}
function validateFormGroup(schema, name = "") {
  schema.valid = Object.keys(schema).filter((key) => !reservedValidationFields.includes(key)).reduce((acc, key) => {
    if (Object.keys(schema[key]).length === 0 || schema[key].validators || schema[key].value) {
      schema[key] = validateFormInput(schema[key], `${name}` ? `${name}.${key}` : key);
    } else {
      schema[key] = validateFormGroup(schema[key], `${name}` ? `${name}.${key}` : key);
    }
    return acc && schema[key].valid;
  }, true);
  schema.invalid = !schema.valid;
  return schema;
}
function validate(schema) {
  return validateFormGroup(schema, "");
}
const inkCaretDown = { name: "svg", type: "element", value: "", attributes: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "16", height: "28", viewBox: "0 0 16 28", fill: "currentColor" }, children: [{ name: "title", type: "element", value: "", attributes: {}, children: [{ name: "", type: "text", value: "caret-down", attributes: {}, children: [] }] }, { name: "path", type: "element", value: "", attributes: { d: "M16 11c0 0.266-0.109 0.516-0.297 0.703l-7 7c-0.187 0.187-0.438 0.297-0.703 0.297s-0.516-0.109-0.703-0.297l-7-7c-0.187-0.187-0.297-0.438-0.297-0.703 0-0.547 0.453-1 1-1h14c0.547 0 1 0.453 1 1z" }, children: [] }] };
const inkCheck = { name: "svg", type: "element", value: "", attributes: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "28", height: "28", viewBox: "0 0 28 28", fill: "currentColor" }, children: [{ name: "title", type: "element", value: "", attributes: {}, children: [{ name: "", type: "text", value: "check", attributes: {}, children: [] }] }, { name: "path", type: "element", value: "", attributes: { d: "M23.625 3.5l-13.125 13.125-6.125-6.125-4.375 4.375 10.5 10.5 17.5-17.5z" }, children: [] }] };
const inkChevronDown = { name: "svg", type: "element", value: "", attributes: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "28", height: "28", viewBox: "0 0 28 28", fill: "currentColor" }, children: [{ name: "title", type: "element", value: "", attributes: {}, children: [{ name: "", type: "text", value: "chevron-down", attributes: {}, children: [] }] }, { name: "path", type: "element", value: "", attributes: { d: "M26.297 12.625l-11.594 11.578c-0.391 0.391-1.016 0.391-1.406 0l-11.594-11.578c-0.391-0.391-0.391-1.031 0-1.422l2.594-2.578c0.391-0.391 1.016-0.391 1.406 0l8.297 8.297 8.297-8.297c0.391-0.391 1.016-0.391 1.406 0l2.594 2.578c0.391 0.391 0.391 1.031 0 1.422z" }, children: [] }] };
const inkCircle = { name: "svg", type: "element", value: "", attributes: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "24", height: "28", viewBox: "0 0 24 28", fill: "currentColor" }, children: [{ name: "title", type: "element", value: "", attributes: {}, children: [{ name: "", type: "text", value: "circle", attributes: {}, children: [] }] }, { name: "path", type: "element", value: "", attributes: { d: "M24 14c0 6.625-5.375 12-12 12s-12-5.375-12-12 5.375-12 12-12 12 5.375 12 12z" }, children: [] }] };
const inkDanger = { name: "svg", type: "element", value: "", attributes: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "28", height: "28", viewBox: "0 0 28 28", fill: "currentColor" }, children: [{ name: "title", type: "element", value: "", attributes: {}, children: [{ name: "", type: "text", value: "danger", attributes: {}, children: [] }] }, { name: "path", type: "element", value: "", attributes: { d: "M14 2.625c-3.038 0-5.895 1.183-8.043 3.332s-3.332 5.005-3.332 8.043c0 3.038 1.183 5.895 3.332 8.043s5.005 3.332 8.043 3.332c3.038 0 5.895-1.183 8.043-3.332s3.332-5.005 3.332-8.043c0-3.038-1.183-5.895-3.332-8.043s-5.005-3.332-8.043-3.332zM14 0v0c7.732 0 14 6.268 14 14s-6.268 14-14 14c-7.732 0-14-6.268-14-14s6.268-14 14-14zM12.25 19.25h3.5v3.5h-3.5zM12.25 5.25h3.5v10.5h-3.5z" }, children: [] }] };
const inkInfo = { name: "svg", type: "element", value: "", attributes: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "28", height: "28", viewBox: "0 0 28 28", fill: "currentColor" }, children: [{ name: "title", type: "element", value: "", attributes: {}, children: [{ name: "", type: "text", value: "info", attributes: {}, children: [] }] }, { name: "path", type: "element", value: "", attributes: { d: "M12.25 8.313c0-0.722 0.591-1.313 1.313-1.313h0.875c0.722 0 1.313 0.591 1.313 1.313v0.875c0 0.722-0.591 1.313-1.313 1.313h-0.875c-0.722 0-1.313-0.591-1.313-1.313v-0.875z" }, children: [] }, { name: "path", type: "element", value: "", attributes: { d: "M17.5 21h-7v-1.75h1.75v-5.25h-1.75v-1.75h5.25v7h1.75z" }, children: [] }, { name: "path", type: "element", value: "", attributes: { d: "M14 0c-7.732 0-14 6.268-14 14s6.268 14 14 14 14-6.268 14-14-6.268-14-14-14zM14 25.375c-6.282 0-11.375-5.093-11.375-11.375s5.093-11.375 11.375-11.375 11.375 5.093 11.375 11.375-5.093 11.375-11.375 11.375z" }, children: [] }] };
const inkMinus = { name: "svg", type: "element", value: "", attributes: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "28", height: "28", viewBox: "0 0 28 28", fill: "currentColor" }, children: [{ name: "title", type: "element", value: "", attributes: {}, children: [{ name: "", type: "text", value: "minus", attributes: {}, children: [] }] }, { name: "path", type: "element", value: "", attributes: { d: "M0 11.375v5.25c0 0.483 0.392 0.875 0.875 0.875h26.25c0.483 0 0.875-0.392 0.875-0.875v-5.25c0-0.483-0.392-0.875-0.875-0.875h-26.25c-0.483 0-0.875 0.392-0.875 0.875z" }, children: [] }] };
const inkPlus = { name: "svg", type: "element", value: "", attributes: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "28", height: "28", viewBox: "0 0 28 28", fill: "currentColor" }, children: [{ name: "title", type: "element", value: "", attributes: {}, children: [{ name: "", type: "text", value: "plus", attributes: {}, children: [] }] }, { name: "path", type: "element", value: "", attributes: { d: "M27.125 10.5h-9.625v-9.625c0-0.483-0.392-0.875-0.875-0.875h-5.25c-0.483 0-0.875 0.392-0.875 0.875v9.625h-9.625c-0.483 0-0.875 0.392-0.875 0.875v5.25c0 0.483 0.392 0.875 0.875 0.875h9.625v9.625c0 0.483 0.392 0.875 0.875 0.875h5.25c0.483 0 0.875-0.392 0.875-0.875v-9.625h9.625c0.483 0 0.875-0.392 0.875-0.875v-5.25c0-0.483-0.392-0.875-0.875-0.875z" }, children: [] }] };
const inkSearch = { name: "svg", type: "element", value: "", attributes: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "28", height: "28", viewBox: "0 0 28 28", fill: "currentColor" }, children: [{ name: "title", type: "element", value: "", attributes: {}, children: [{ name: "", type: "text", value: "search", attributes: {}, children: [] }] }, { name: "path", type: "element", value: "", attributes: { d: "M27.132 23.827l-6.632-5.641c-0.686-0.617-1.419-0.9-2.011-0.873 1.566-1.834 2.511-4.213 2.511-6.813 0-5.799-4.701-10.5-10.5-10.5s-10.5 4.701-10.5 10.5 4.701 10.5 10.5 10.5c2.6 0 4.98-0.946 6.813-2.511-0.027 0.592 0.256 1.326 0.873 2.011l5.641 6.632c0.966 1.073 2.544 1.164 3.506 0.201s0.872-2.54-0.201-3.506zM10.5 17.5c-3.866 0-7-3.134-7-7s3.134-7 7-7 7 3.134 7 7-3.134 7-7 7z" }, children: [] }] };
const inkSortAsc = { name: "svg", type: "element", value: "", attributes: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "16", height: "28", viewBox: "0 0 16 28", fill: "currentColor" }, children: [{ name: "title", type: "element", value: "", attributes: {}, children: [{ name: "", type: "text", value: "sort-asc", attributes: {}, children: [] }] }, { name: "path", type: "element", value: "", attributes: { d: "M16 11c0 0.547-0.453 1-1 1h-14c-0.547 0-1-0.453-1-1 0-0.266 0.109-0.516 0.297-0.703l7-7c0.187-0.187 0.438-0.297 0.703-0.297s0.516 0.109 0.703 0.297l7 7c0.187 0.187 0.297 0.438 0.297 0.703z" }, children: [] }] };
const inkSortDesc = { name: "svg", type: "element", value: "", attributes: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "16", height: "28", viewBox: "0 0 16 28", fill: "currentColor" }, children: [{ name: "title", type: "element", value: "", attributes: {}, children: [{ name: "", type: "text", value: "sort-desc", attributes: {}, children: [] }] }, { name: "path", type: "element", value: "", attributes: { d: "M16 17c0 0.266-0.109 0.516-0.297 0.703l-7 7c-0.187 0.187-0.438 0.297-0.703 0.297s-0.516-0.109-0.703-0.297l-7-7c-0.187-0.187-0.297-0.438-0.297-0.703 0-0.547 0.453-1 1-1h14c0.547 0 1 0.453 1 1z" }, children: [] }] };
const inkSort = { name: "svg", type: "element", value: "", attributes: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "16", height: "28", viewBox: "0 0 16 28", fill: "currentColor" }, children: [{ name: "title", type: "element", value: "", attributes: {}, children: [{ name: "", type: "text", value: "sort", attributes: {}, children: [] }] }, { name: "path", type: "element", value: "", attributes: { d: "M16 17c0 0.266-0.109 0.516-0.297 0.703l-7 7c-0.187 0.187-0.438 0.297-0.703 0.297s-0.516-0.109-0.703-0.297l-7-7c-0.187-0.187-0.297-0.438-0.297-0.703 0-0.547 0.453-1 1-1h14c0.547 0 1 0.453 1 1zM16 11c0 0.547-0.453 1-1 1h-14c-0.547 0-1-0.453-1-1 0-0.266 0.109-0.516 0.297-0.703l7-7c0.187-0.187 0.438-0.297 0.703-0.297s0.516 0.109 0.703 0.297l7 7c0.187 0.187 0.297 0.438 0.297 0.703z" }, children: [] }] };
const inkTimes = { name: "svg", type: "element", value: "", attributes: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "28", height: "28", viewBox: "0 0 28 28", fill: "currentColor" }, children: [{ name: "title", type: "element", value: "", attributes: {}, children: [{ name: "", type: "text", value: "times", attributes: {}, children: [] }] }, { name: "path", type: "element", value: "", attributes: { d: "M27.745 22.495c-0-0-0-0-0-0l-8.494-8.494 8.494-8.494c0-0 0-0 0-0 0.091-0.091 0.158-0.198 0.2-0.312 0.116-0.311 0.050-0.675-0.2-0.925l-4.013-4.013c-0.25-0.25-0.614-0.316-0.925-0.2-0.114 0.042-0.221 0.109-0.312 0.2 0 0-0 0-0 0l-8.494 8.494-8.494-8.494c-0-0-0-0-0-0-0.091-0.091-0.198-0.158-0.312-0.2-0.311-0.116-0.675-0.050-0.925 0.2l-4.013 4.013c-0.25 0.25-0.316 0.614-0.2 0.925 0.042 0.114 0.109 0.221 0.2 0.312 0 0 0 0 0 0l8.494 8.494-8.494 8.494c-0 0-0 0-0 0-0.091 0.091-0.157 0.198-0.2 0.312-0.116 0.311-0.050 0.675 0.2 0.925l4.013 4.013c0.25 0.25 0.614 0.316 0.925 0.2 0.114-0.042 0.221-0.109 0.312-0.2 0-0 0-0 0-0l8.494-8.494 8.494 8.494c0 0 0 0 0 0 0.092 0.091 0.198 0.158 0.312 0.2 0.311 0.116 0.675 0.050 0.925-0.2l4.013-4.013c0.25-0.25 0.316-0.614 0.2-0.925-0.042-0.114-0.109-0.221-0.2-0.312z" }, children: [] }] };
const inkWarning = { name: "svg", type: "element", value: "", attributes: { version: "1.1", xmlns: "http://www.w3.org/2000/svg", width: "28", height: "28", viewBox: "0 0 28 28", fill: "currentColor" }, children: [{ name: "title", type: "element", value: "", attributes: {}, children: [{ name: "", type: "text", value: "warning", attributes: {}, children: [] }] }, { name: "path", type: "element", value: "", attributes: { d: "M14 2.537l11.733 23.385h-23.467l11.733-23.385zM14 0c-0.603 0-1.207 0.407-1.665 1.221l-11.951 23.819c-0.916 1.628-0.137 2.96 1.731 2.96h23.77c1.868 0 2.647-1.332 1.731-2.96h0l-11.951-23.819c-0.458-0.814-1.061-1.221-1.665-1.221v0z" }, children: [] }, { name: "path", type: "element", value: "", attributes: { d: "M15.75 22.75c0 0.966-0.784 1.75-1.75 1.75s-1.75-0.784-1.75-1.75c0-0.966 0.784-1.75 1.75-1.75s1.75 0.784 1.75 1.75z" }, children: [] }, { name: "path", type: "element", value: "", attributes: { d: "M14 19.25c-0.966 0-1.75-0.784-1.75-1.75v-5.25c0-0.966 0.784-1.75 1.75-1.75s1.75 0.784 1.75 1.75v5.25c0 0.966-0.784 1.75-1.75 1.75z" }, children: [] }] };
var inklineIcons = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  inkCaretDown,
  inkCheck,
  inkChevronDown,
  inkCircle,
  inkDanger,
  inkInfo,
  inkMinus,
  inkPlus,
  inkSearch,
  inkSortAsc,
  inkSortDesc,
  inkSort,
  inkTimes,
  inkWarning
});
const colorModeLocalStorageKey = "inkline-color-mode";
const handleColorMode = (colorMode) => {
  let color;
  if (colorMode === "system") {
    color = matchMedia("(prefers-color-scheme: dark)").matches ? "dark" : "light";
  } else {
    color = colorMode;
  }
  removeClass(document.body, "-light -dark");
  addClass(document.body, `-${color}`);
};
const defaultOptions = {
  components: {},
  icons: {},
  colorMode: "system",
  locale: "en",
  validateOn: ["input", "blur"],
  color: "",
  size: "",
  routerComponent: "router-link",
  componentOptions: {}
};
function createPrototype(_a) {
  var _b = _a, { icons, components: components2 } = _b, options = __objRest(_b, ["icons", "components"]);
  return {
    form(schema) {
      return initialize(schema);
    },
    setLocale(locale) {
      setLocale(locale);
    },
    options: reactive$1(options)
  };
}
const inklineGlobals = {
  prototype: void 0,
  icons: void 0
};
const Inkline = {
  install(app2, options = {}) {
    const extendedOptions = __spreadValues(__spreadValues({}, defaultOptions), options);
    for (const componentIndex in extendedOptions.components) {
      app2.component(extendedOptions.components[componentIndex].name, extendedOptions.components[componentIndex]);
    }
    if (typeof window !== "undefined") {
      extendedOptions.colorMode = localStorage.getItem(colorModeLocalStorageKey) || extendedOptions.colorMode;
    }
    const prototype = createPrototype(extendedOptions);
    app2.config.globalProperties.$inkline = prototype;
    app2.provide("inkline", prototype);
    inklineGlobals.prototype = prototype;
    const icons = __spreadValues(__spreadValues({}, inklineIcons), extendedOptions.icons);
    app2.provide("inklineIcons", icons);
    if (typeof window !== "undefined") {
      addClass(document.body, "inkline");
      watch(() => prototype.options.colorMode, (colorMode) => {
        handleColorMode(colorMode);
        localStorage.setItem(colorModeLocalStorageKey, colorMode);
      });
      const onDarkModeMediaQueryChange = (e) => {
        prototype.options.prefersColorScheme = e.matches ? "dark" : "light";
        if (prototype.options.colorMode === "system") {
          handleColorMode(prototype.options.colorMode);
        }
      };
      const darkModeMediaQuery = matchMedia("(prefers-color-scheme: dark)");
      if (darkModeMediaQuery.addEventListener) {
        darkModeMediaQuery.addEventListener("change", onDarkModeMediaQueryChange);
      } else {
        darkModeMediaQuery.addListener(onDarkModeMediaQueryChange);
      }
      handleColorMode(extendedOptions.colorMode);
    }
  }
};
function defaultPropValue(componentName2, propertyName, propertyValue = "") {
  return () => {
    var _a;
    return inklineGlobals.prototype ? ((_a = inklineGlobals.prototype.options.componentOptions[componentName2]) == null ? void 0 : _a[propertyName]) ? inklineGlobals.prototype.options.componentOptions[componentName2][propertyName] : inklineGlobals.prototype.options[propertyName] : propertyValue;
  };
}
function sizePropValidator(size2) {
  return ["", "xs", "sm", "md", "lg", "xl", "xxl"].includes(size2);
}
var CollapsibleMixin = defineComponent({
  props: {
    collapse: {
      type: [String, Boolean],
      default: "md"
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      open: this.modelValue,
      windowWidth: typeof window !== "undefined" ? window.innerWidth : 0
    };
  },
  computed: {
    collapsibleClasses() {
      return {
        "-open": this.open,
        "-collapsible": this.collapsible,
        [`-collapse-${this.collapse}`]: Boolean(this.collapse)
      };
    },
    collapsible() {
      if (this.collapse === true || this.collapse === false) {
        return this.collapse;
      }
      return this.windowWidth <= breakpoints[this.collapse][1];
    }
  },
  watch: {
    modelValue(value) {
      this.open = value;
    }
  },
  created() {
    if (typeof window !== "undefined") {
      on(window, "resize", this.onWindowResize);
      this.onWindowResize();
    }
  },
  beforeUnmount() {
    if (typeof window !== "undefined") {
      off(window, "resize", this.onWindowResize);
    }
  },
  methods: {
    setOpen(value) {
      this.open = value;
      this.$emit("update:modelValue", this.open);
    },
    toggleOpen() {
      this.open = !this.open;
      this.$emit("update:modelValue", this.open);
    },
    onWindowResize() {
      if (this.collapse === true || this.collapse === false || typeof window === "undefined") {
        return;
      }
      const windowWidth = window.innerWidth;
      if (this.windowWidth <= breakpoints[this.collapse][1] && windowWidth > breakpoints[this.collapse][1]) {
        this.setOpen(false);
      }
      this.windowWidth = window.innerWidth;
    }
  }
});
var FormComponentMixin = defineComponent({
  inject: {
    formGroup: {
      default: () => ({})
    },
    form: {
      default: () => ({})
    }
  },
  computed: {
    isDisabled() {
      return this.disabled || this.form.isDisabled || this.formGroup.isDisabled;
    },
    isReadonly() {
      return this.readonly || this.form.isReadonly || this.formGroup.isReadonly;
    },
    parent() {
      if (this.formGroup.$) {
        return this.formGroup;
      }
      return this.form;
    },
    schema() {
      const parentSchema = this.parent.schema || {};
      if (this.name !== "") {
        return getValueByPath(parentSchema, `${this.name}`);
      }
      return parentSchema;
    }
  }
});
var LinkableMixin = defineComponent({
  props: {
    tag: {
      type: String,
      default: "a"
    }
  },
  computed: {
    isTag() {
      return this.$attrs.to ? this.routerComponent : this.$attrs.href ? "a" : this.tag;
    },
    isComponent() {
      return this.isTag === this.routerComponent;
    },
    routerComponent() {
      return this.$inkline.options.routerComponent;
    }
  }
});
var top = "top";
var bottom = "bottom";
var right = "right";
var left = "left";
var auto = "auto";
var basePlacements = [top, bottom, right, left];
var start = "start";
var end = "end";
var clippingParents = "clippingParents";
var viewport = "viewport";
var popper = "popper";
var reference = "reference";
var variationPlacements = /* @__PURE__ */ basePlacements.reduce(function(acc, placement) {
  return acc.concat([placement + "-" + start, placement + "-" + end]);
}, []);
var placements = /* @__PURE__ */ [].concat(basePlacements, [auto]).reduce(function(acc, placement) {
  return acc.concat([placement, placement + "-" + start, placement + "-" + end]);
}, []);
var beforeRead = "beforeRead";
var read = "read";
var afterRead = "afterRead";
var beforeMain = "beforeMain";
var main = "main";
var afterMain = "afterMain";
var beforeWrite = "beforeWrite";
var write = "write";
var afterWrite = "afterWrite";
var modifierPhases = [beforeRead, read, afterRead, beforeMain, main, afterMain, beforeWrite, write, afterWrite];
function getNodeName(element) {
  return element ? (element.nodeName || "").toLowerCase() : null;
}
function getWindow(node2) {
  if (node2 == null) {
    return window;
  }
  if (node2.toString() !== "[object Window]") {
    var ownerDocument = node2.ownerDocument;
    return ownerDocument ? ownerDocument.defaultView || window : window;
  }
  return node2;
}
function isElement(node2) {
  var OwnElement = getWindow(node2).Element;
  return node2 instanceof OwnElement || node2 instanceof Element;
}
function isHTMLElement(node2) {
  var OwnElement = getWindow(node2).HTMLElement;
  return node2 instanceof OwnElement || node2 instanceof HTMLElement;
}
function isShadowRoot(node2) {
  if (typeof ShadowRoot === "undefined") {
    return false;
  }
  var OwnElement = getWindow(node2).ShadowRoot;
  return node2 instanceof OwnElement || node2 instanceof ShadowRoot;
}
function applyStyles(_ref) {
  var state = _ref.state;
  Object.keys(state.elements).forEach(function(name) {
    var style = state.styles[name] || {};
    var attributes2 = state.attributes[name] || {};
    var element = state.elements[name];
    if (!isHTMLElement(element) || !getNodeName(element)) {
      return;
    }
    Object.assign(element.style, style);
    Object.keys(attributes2).forEach(function(name2) {
      var value = attributes2[name2];
      if (value === false) {
        element.removeAttribute(name2);
      } else {
        element.setAttribute(name2, value === true ? "" : value);
      }
    });
  });
}
function effect$2(_ref2) {
  var state = _ref2.state;
  var initialStyles = {
    popper: {
      position: state.options.strategy,
      left: "0",
      top: "0",
      margin: "0"
    },
    arrow: {
      position: "absolute"
    },
    reference: {}
  };
  Object.assign(state.elements.popper.style, initialStyles.popper);
  state.styles = initialStyles;
  if (state.elements.arrow) {
    Object.assign(state.elements.arrow.style, initialStyles.arrow);
  }
  return function() {
    Object.keys(state.elements).forEach(function(name) {
      var element = state.elements[name];
      var attributes2 = state.attributes[name] || {};
      var styleProperties = Object.keys(state.styles.hasOwnProperty(name) ? state.styles[name] : initialStyles[name]);
      var style = styleProperties.reduce(function(style2, property) {
        style2[property] = "";
        return style2;
      }, {});
      if (!isHTMLElement(element) || !getNodeName(element)) {
        return;
      }
      Object.assign(element.style, style);
      Object.keys(attributes2).forEach(function(attribute) {
        element.removeAttribute(attribute);
      });
    });
  };
}
var applyStyles$1 = {
  name: "applyStyles",
  enabled: true,
  phase: "write",
  fn: applyStyles,
  effect: effect$2,
  requires: ["computeStyles"]
};
function getBasePlacement(placement) {
  return placement.split("-")[0];
}
var max = Math.max;
var min = Math.min;
var round = Math.round;
function getBoundingClientRect(element, includeScale) {
  if (includeScale === void 0) {
    includeScale = false;
  }
  var rect2 = element.getBoundingClientRect();
  var scaleX = 1;
  var scaleY = 1;
  if (isHTMLElement(element) && includeScale) {
    var offsetHeight = element.offsetHeight;
    var offsetWidth = element.offsetWidth;
    if (offsetWidth > 0) {
      scaleX = round(rect2.width) / offsetWidth || 1;
    }
    if (offsetHeight > 0) {
      scaleY = round(rect2.height) / offsetHeight || 1;
    }
  }
  return {
    width: rect2.width / scaleX,
    height: rect2.height / scaleY,
    top: rect2.top / scaleY,
    right: rect2.right / scaleX,
    bottom: rect2.bottom / scaleY,
    left: rect2.left / scaleX,
    x: rect2.left / scaleX,
    y: rect2.top / scaleY
  };
}
function getLayoutRect(element) {
  var clientRect = getBoundingClientRect(element);
  var width = element.offsetWidth;
  var height = element.offsetHeight;
  if (Math.abs(clientRect.width - width) <= 1) {
    width = clientRect.width;
  }
  if (Math.abs(clientRect.height - height) <= 1) {
    height = clientRect.height;
  }
  return {
    x: element.offsetLeft,
    y: element.offsetTop,
    width,
    height
  };
}
function contains(parent, child) {
  var rootNode = child.getRootNode && child.getRootNode();
  if (parent.contains(child)) {
    return true;
  } else if (rootNode && isShadowRoot(rootNode)) {
    var next = child;
    do {
      if (next && parent.isSameNode(next)) {
        return true;
      }
      next = next.parentNode || next.host;
    } while (next);
  }
  return false;
}
function getComputedStyle$1(element) {
  return getWindow(element).getComputedStyle(element);
}
function isTableElement(element) {
  return ["table", "td", "th"].indexOf(getNodeName(element)) >= 0;
}
function getDocumentElement(element) {
  return ((isElement(element) ? element.ownerDocument : element.document) || window.document).documentElement;
}
function getParentNode(element) {
  if (getNodeName(element) === "html") {
    return element;
  }
  return element.assignedSlot || element.parentNode || (isShadowRoot(element) ? element.host : null) || getDocumentElement(element);
}
function getTrueOffsetParent(element) {
  if (!isHTMLElement(element) || getComputedStyle$1(element).position === "fixed") {
    return null;
  }
  return element.offsetParent;
}
function getContainingBlock(element) {
  var isFirefox = navigator.userAgent.toLowerCase().indexOf("firefox") !== -1;
  var isIE = navigator.userAgent.indexOf("Trident") !== -1;
  if (isIE && isHTMLElement(element)) {
    var elementCss = getComputedStyle$1(element);
    if (elementCss.position === "fixed") {
      return null;
    }
  }
  var currentNode = getParentNode(element);
  while (isHTMLElement(currentNode) && ["html", "body"].indexOf(getNodeName(currentNode)) < 0) {
    var css = getComputedStyle$1(currentNode);
    if (css.transform !== "none" || css.perspective !== "none" || css.contain === "paint" || ["transform", "perspective"].indexOf(css.willChange) !== -1 || isFirefox && css.willChange === "filter" || isFirefox && css.filter && css.filter !== "none") {
      return currentNode;
    } else {
      currentNode = currentNode.parentNode;
    }
  }
  return null;
}
function getOffsetParent(element) {
  var window2 = getWindow(element);
  var offsetParent = getTrueOffsetParent(element);
  while (offsetParent && isTableElement(offsetParent) && getComputedStyle$1(offsetParent).position === "static") {
    offsetParent = getTrueOffsetParent(offsetParent);
  }
  if (offsetParent && (getNodeName(offsetParent) === "html" || getNodeName(offsetParent) === "body" && getComputedStyle$1(offsetParent).position === "static")) {
    return window2;
  }
  return offsetParent || getContainingBlock(element) || window2;
}
function getMainAxisFromPlacement(placement) {
  return ["top", "bottom"].indexOf(placement) >= 0 ? "x" : "y";
}
function within(min$12, value, max$12) {
  return max(min$12, min(value, max$12));
}
function withinMaxClamp(min2, value, max2) {
  var v = within(min2, value, max2);
  return v > max2 ? max2 : v;
}
function getFreshSideObject() {
  return {
    top: 0,
    right: 0,
    bottom: 0,
    left: 0
  };
}
function mergePaddingObject(paddingObject) {
  return Object.assign({}, getFreshSideObject(), paddingObject);
}
function expandToHashMap(value, keys) {
  return keys.reduce(function(hashMap, key) {
    hashMap[key] = value;
    return hashMap;
  }, {});
}
var toPaddingObject = function toPaddingObject2(padding, state) {
  padding = typeof padding === "function" ? padding(Object.assign({}, state.rects, {
    placement: state.placement
  })) : padding;
  return mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
};
function arrow(_ref) {
  var _state$modifiersData$;
  var state = _ref.state, name = _ref.name, options = _ref.options;
  var arrowElement = state.elements.arrow;
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var basePlacement = getBasePlacement(state.placement);
  var axis = getMainAxisFromPlacement(basePlacement);
  var isVertical = [left, right].indexOf(basePlacement) >= 0;
  var len = isVertical ? "height" : "width";
  if (!arrowElement || !popperOffsets2) {
    return;
  }
  var paddingObject = toPaddingObject(options.padding, state);
  var arrowRect = getLayoutRect(arrowElement);
  var minProp = axis === "y" ? top : left;
  var maxProp = axis === "y" ? bottom : right;
  var endDiff = state.rects.reference[len] + state.rects.reference[axis] - popperOffsets2[axis] - state.rects.popper[len];
  var startDiff = popperOffsets2[axis] - state.rects.reference[axis];
  var arrowOffsetParent = getOffsetParent(arrowElement);
  var clientSize = arrowOffsetParent ? axis === "y" ? arrowOffsetParent.clientHeight || 0 : arrowOffsetParent.clientWidth || 0 : 0;
  var centerToReference = endDiff / 2 - startDiff / 2;
  var min2 = paddingObject[minProp];
  var max2 = clientSize - arrowRect[len] - paddingObject[maxProp];
  var center = clientSize / 2 - arrowRect[len] / 2 + centerToReference;
  var offset2 = within(min2, center, max2);
  var axisProp = axis;
  state.modifiersData[name] = (_state$modifiersData$ = {}, _state$modifiersData$[axisProp] = offset2, _state$modifiersData$.centerOffset = offset2 - center, _state$modifiersData$);
}
function effect$1(_ref2) {
  var state = _ref2.state, options = _ref2.options;
  var _options$element = options.element, arrowElement = _options$element === void 0 ? "[data-popper-arrow]" : _options$element;
  if (arrowElement == null) {
    return;
  }
  if (typeof arrowElement === "string") {
    arrowElement = state.elements.popper.querySelector(arrowElement);
    if (!arrowElement) {
      return;
    }
  }
  if (!contains(state.elements.popper, arrowElement)) {
    return;
  }
  state.elements.arrow = arrowElement;
}
var arrow$1 = {
  name: "arrow",
  enabled: true,
  phase: "main",
  fn: arrow,
  effect: effect$1,
  requires: ["popperOffsets"],
  requiresIfExists: ["preventOverflow"]
};
function getVariation(placement) {
  return placement.split("-")[1];
}
var unsetSides = {
  top: "auto",
  right: "auto",
  bottom: "auto",
  left: "auto"
};
function roundOffsetsByDPR(_ref) {
  var x = _ref.x, y = _ref.y;
  var win = window;
  var dpr = win.devicePixelRatio || 1;
  return {
    x: round(x * dpr) / dpr || 0,
    y: round(y * dpr) / dpr || 0
  };
}
function mapToStyles(_ref2) {
  var _Object$assign2;
  var popper2 = _ref2.popper, popperRect = _ref2.popperRect, placement = _ref2.placement, variation = _ref2.variation, offsets = _ref2.offsets, position = _ref2.position, gpuAcceleration = _ref2.gpuAcceleration, adaptive = _ref2.adaptive, roundOffsets = _ref2.roundOffsets, isFixed = _ref2.isFixed;
  var _ref3 = roundOffsets === true ? roundOffsetsByDPR(offsets) : typeof roundOffsets === "function" ? roundOffsets(offsets) : offsets, _ref3$x = _ref3.x, x = _ref3$x === void 0 ? 0 : _ref3$x, _ref3$y = _ref3.y, y = _ref3$y === void 0 ? 0 : _ref3$y;
  var hasX = offsets.hasOwnProperty("x");
  var hasY = offsets.hasOwnProperty("y");
  var sideX = left;
  var sideY = top;
  var win = window;
  if (adaptive) {
    var offsetParent = getOffsetParent(popper2);
    var heightProp = "clientHeight";
    var widthProp = "clientWidth";
    if (offsetParent === getWindow(popper2)) {
      offsetParent = getDocumentElement(popper2);
      if (getComputedStyle$1(offsetParent).position !== "static" && position === "absolute") {
        heightProp = "scrollHeight";
        widthProp = "scrollWidth";
      }
    }
    offsetParent = offsetParent;
    if (placement === top || (placement === left || placement === right) && variation === end) {
      sideY = bottom;
      var offsetY = isFixed && win.visualViewport ? win.visualViewport.height : offsetParent[heightProp];
      y -= offsetY - popperRect.height;
      y *= gpuAcceleration ? 1 : -1;
    }
    if (placement === left || (placement === top || placement === bottom) && variation === end) {
      sideX = right;
      var offsetX = isFixed && win.visualViewport ? win.visualViewport.width : offsetParent[widthProp];
      x -= offsetX - popperRect.width;
      x *= gpuAcceleration ? 1 : -1;
    }
  }
  var commonStyles = Object.assign({
    position
  }, adaptive && unsetSides);
  if (gpuAcceleration) {
    var _Object$assign;
    return Object.assign({}, commonStyles, (_Object$assign = {}, _Object$assign[sideY] = hasY ? "0" : "", _Object$assign[sideX] = hasX ? "0" : "", _Object$assign.transform = (win.devicePixelRatio || 1) <= 1 ? "translate(" + x + "px, " + y + "px)" : "translate3d(" + x + "px, " + y + "px, 0)", _Object$assign));
  }
  return Object.assign({}, commonStyles, (_Object$assign2 = {}, _Object$assign2[sideY] = hasY ? y + "px" : "", _Object$assign2[sideX] = hasX ? x + "px" : "", _Object$assign2.transform = "", _Object$assign2));
}
function computeStyles(_ref4) {
  var state = _ref4.state, options = _ref4.options;
  var _options$gpuAccelerat = options.gpuAcceleration, gpuAcceleration = _options$gpuAccelerat === void 0 ? true : _options$gpuAccelerat, _options$adaptive = options.adaptive, adaptive = _options$adaptive === void 0 ? true : _options$adaptive, _options$roundOffsets = options.roundOffsets, roundOffsets = _options$roundOffsets === void 0 ? true : _options$roundOffsets;
  var commonStyles = {
    placement: getBasePlacement(state.placement),
    variation: getVariation(state.placement),
    popper: state.elements.popper,
    popperRect: state.rects.popper,
    gpuAcceleration,
    isFixed: state.options.strategy === "fixed"
  };
  if (state.modifiersData.popperOffsets != null) {
    state.styles.popper = Object.assign({}, state.styles.popper, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.popperOffsets,
      position: state.options.strategy,
      adaptive,
      roundOffsets
    })));
  }
  if (state.modifiersData.arrow != null) {
    state.styles.arrow = Object.assign({}, state.styles.arrow, mapToStyles(Object.assign({}, commonStyles, {
      offsets: state.modifiersData.arrow,
      position: "absolute",
      adaptive: false,
      roundOffsets
    })));
  }
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-placement": state.placement
  });
}
var computeStyles$1 = {
  name: "computeStyles",
  enabled: true,
  phase: "beforeWrite",
  fn: computeStyles,
  data: {}
};
var passive = {
  passive: true
};
function effect(_ref) {
  var state = _ref.state, instance = _ref.instance, options = _ref.options;
  var _options$scroll = options.scroll, scroll = _options$scroll === void 0 ? true : _options$scroll, _options$resize = options.resize, resize = _options$resize === void 0 ? true : _options$resize;
  var window2 = getWindow(state.elements.popper);
  var scrollParents = [].concat(state.scrollParents.reference, state.scrollParents.popper);
  if (scroll) {
    scrollParents.forEach(function(scrollParent) {
      scrollParent.addEventListener("scroll", instance.update, passive);
    });
  }
  if (resize) {
    window2.addEventListener("resize", instance.update, passive);
  }
  return function() {
    if (scroll) {
      scrollParents.forEach(function(scrollParent) {
        scrollParent.removeEventListener("scroll", instance.update, passive);
      });
    }
    if (resize) {
      window2.removeEventListener("resize", instance.update, passive);
    }
  };
}
var eventListeners = {
  name: "eventListeners",
  enabled: true,
  phase: "write",
  fn: function fn() {
  },
  effect,
  data: {}
};
var hash$1 = {
  left: "right",
  right: "left",
  bottom: "top",
  top: "bottom"
};
function getOppositePlacement(placement) {
  return placement.replace(/left|right|bottom|top/g, function(matched) {
    return hash$1[matched];
  });
}
var hash = {
  start: "end",
  end: "start"
};
function getOppositeVariationPlacement(placement) {
  return placement.replace(/start|end/g, function(matched) {
    return hash[matched];
  });
}
function getWindowScroll(node2) {
  var win = getWindow(node2);
  var scrollLeft = win.pageXOffset;
  var scrollTop = win.pageYOffset;
  return {
    scrollLeft,
    scrollTop
  };
}
function getWindowScrollBarX(element) {
  return getBoundingClientRect(getDocumentElement(element)).left + getWindowScroll(element).scrollLeft;
}
function getViewportRect(element) {
  var win = getWindow(element);
  var html2 = getDocumentElement(element);
  var visualViewport = win.visualViewport;
  var width = html2.clientWidth;
  var height = html2.clientHeight;
  var x = 0;
  var y = 0;
  if (visualViewport) {
    width = visualViewport.width;
    height = visualViewport.height;
    if (!/^((?!chrome|android).)*safari/i.test(navigator.userAgent)) {
      x = visualViewport.offsetLeft;
      y = visualViewport.offsetTop;
    }
  }
  return {
    width,
    height,
    x: x + getWindowScrollBarX(element),
    y
  };
}
function getDocumentRect(element) {
  var _element$ownerDocumen;
  var html2 = getDocumentElement(element);
  var winScroll = getWindowScroll(element);
  var body = (_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body;
  var width = max(html2.scrollWidth, html2.clientWidth, body ? body.scrollWidth : 0, body ? body.clientWidth : 0);
  var height = max(html2.scrollHeight, html2.clientHeight, body ? body.scrollHeight : 0, body ? body.clientHeight : 0);
  var x = -winScroll.scrollLeft + getWindowScrollBarX(element);
  var y = -winScroll.scrollTop;
  if (getComputedStyle$1(body || html2).direction === "rtl") {
    x += max(html2.clientWidth, body ? body.clientWidth : 0) - width;
  }
  return {
    width,
    height,
    x,
    y
  };
}
function isScrollParent(element) {
  var _getComputedStyle = getComputedStyle$1(element), overflow = _getComputedStyle.overflow, overflowX = _getComputedStyle.overflowX, overflowY = _getComputedStyle.overflowY;
  return /auto|scroll|overlay|hidden/.test(overflow + overflowY + overflowX);
}
function getScrollParent(node2) {
  if (["html", "body", "#document"].indexOf(getNodeName(node2)) >= 0) {
    return node2.ownerDocument.body;
  }
  if (isHTMLElement(node2) && isScrollParent(node2)) {
    return node2;
  }
  return getScrollParent(getParentNode(node2));
}
function listScrollParents(element, list) {
  var _element$ownerDocumen;
  if (list === void 0) {
    list = [];
  }
  var scrollParent = getScrollParent(element);
  var isBody = scrollParent === ((_element$ownerDocumen = element.ownerDocument) == null ? void 0 : _element$ownerDocumen.body);
  var win = getWindow(scrollParent);
  var target2 = isBody ? [win].concat(win.visualViewport || [], isScrollParent(scrollParent) ? scrollParent : []) : scrollParent;
  var updatedList = list.concat(target2);
  return isBody ? updatedList : updatedList.concat(listScrollParents(getParentNode(target2)));
}
function rectToClientRect(rect2) {
  return Object.assign({}, rect2, {
    left: rect2.x,
    top: rect2.y,
    right: rect2.x + rect2.width,
    bottom: rect2.y + rect2.height
  });
}
function getInnerBoundingClientRect(element) {
  var rect2 = getBoundingClientRect(element);
  rect2.top = rect2.top + element.clientTop;
  rect2.left = rect2.left + element.clientLeft;
  rect2.bottom = rect2.top + element.clientHeight;
  rect2.right = rect2.left + element.clientWidth;
  rect2.width = element.clientWidth;
  rect2.height = element.clientHeight;
  rect2.x = rect2.left;
  rect2.y = rect2.top;
  return rect2;
}
function getClientRectFromMixedType(element, clippingParent) {
  return clippingParent === viewport ? rectToClientRect(getViewportRect(element)) : isElement(clippingParent) ? getInnerBoundingClientRect(clippingParent) : rectToClientRect(getDocumentRect(getDocumentElement(element)));
}
function getClippingParents(element) {
  var clippingParents2 = listScrollParents(getParentNode(element));
  var canEscapeClipping = ["absolute", "fixed"].indexOf(getComputedStyle$1(element).position) >= 0;
  var clipperElement = canEscapeClipping && isHTMLElement(element) ? getOffsetParent(element) : element;
  if (!isElement(clipperElement)) {
    return [];
  }
  return clippingParents2.filter(function(clippingParent) {
    return isElement(clippingParent) && contains(clippingParent, clipperElement) && getNodeName(clippingParent) !== "body" && (canEscapeClipping ? getComputedStyle$1(clippingParent).position !== "static" : true);
  });
}
function getClippingRect(element, boundary, rootBoundary) {
  var mainClippingParents = boundary === "clippingParents" ? getClippingParents(element) : [].concat(boundary);
  var clippingParents2 = [].concat(mainClippingParents, [rootBoundary]);
  var firstClippingParent = clippingParents2[0];
  var clippingRect = clippingParents2.reduce(function(accRect, clippingParent) {
    var rect2 = getClientRectFromMixedType(element, clippingParent);
    accRect.top = max(rect2.top, accRect.top);
    accRect.right = min(rect2.right, accRect.right);
    accRect.bottom = min(rect2.bottom, accRect.bottom);
    accRect.left = max(rect2.left, accRect.left);
    return accRect;
  }, getClientRectFromMixedType(element, firstClippingParent));
  clippingRect.width = clippingRect.right - clippingRect.left;
  clippingRect.height = clippingRect.bottom - clippingRect.top;
  clippingRect.x = clippingRect.left;
  clippingRect.y = clippingRect.top;
  return clippingRect;
}
function computeOffsets(_ref) {
  var reference2 = _ref.reference, element = _ref.element, placement = _ref.placement;
  var basePlacement = placement ? getBasePlacement(placement) : null;
  var variation = placement ? getVariation(placement) : null;
  var commonX = reference2.x + reference2.width / 2 - element.width / 2;
  var commonY = reference2.y + reference2.height / 2 - element.height / 2;
  var offsets;
  switch (basePlacement) {
    case top:
      offsets = {
        x: commonX,
        y: reference2.y - element.height
      };
      break;
    case bottom:
      offsets = {
        x: commonX,
        y: reference2.y + reference2.height
      };
      break;
    case right:
      offsets = {
        x: reference2.x + reference2.width,
        y: commonY
      };
      break;
    case left:
      offsets = {
        x: reference2.x - element.width,
        y: commonY
      };
      break;
    default:
      offsets = {
        x: reference2.x,
        y: reference2.y
      };
  }
  var mainAxis = basePlacement ? getMainAxisFromPlacement(basePlacement) : null;
  if (mainAxis != null) {
    var len = mainAxis === "y" ? "height" : "width";
    switch (variation) {
      case start:
        offsets[mainAxis] = offsets[mainAxis] - (reference2[len] / 2 - element[len] / 2);
        break;
      case end:
        offsets[mainAxis] = offsets[mainAxis] + (reference2[len] / 2 - element[len] / 2);
        break;
    }
  }
  return offsets;
}
function detectOverflow(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, _options$placement = _options.placement, placement = _options$placement === void 0 ? state.placement : _options$placement, _options$boundary = _options.boundary, boundary = _options$boundary === void 0 ? clippingParents : _options$boundary, _options$rootBoundary = _options.rootBoundary, rootBoundary = _options$rootBoundary === void 0 ? viewport : _options$rootBoundary, _options$elementConte = _options.elementContext, elementContext = _options$elementConte === void 0 ? popper : _options$elementConte, _options$altBoundary = _options.altBoundary, altBoundary = _options$altBoundary === void 0 ? false : _options$altBoundary, _options$padding = _options.padding, padding = _options$padding === void 0 ? 0 : _options$padding;
  var paddingObject = mergePaddingObject(typeof padding !== "number" ? padding : expandToHashMap(padding, basePlacements));
  var altContext = elementContext === popper ? reference : popper;
  var popperRect = state.rects.popper;
  var element = state.elements[altBoundary ? altContext : elementContext];
  var clippingClientRect = getClippingRect(isElement(element) ? element : element.contextElement || getDocumentElement(state.elements.popper), boundary, rootBoundary);
  var referenceClientRect = getBoundingClientRect(state.elements.reference);
  var popperOffsets2 = computeOffsets({
    reference: referenceClientRect,
    element: popperRect,
    strategy: "absolute",
    placement
  });
  var popperClientRect = rectToClientRect(Object.assign({}, popperRect, popperOffsets2));
  var elementClientRect = elementContext === popper ? popperClientRect : referenceClientRect;
  var overflowOffsets = {
    top: clippingClientRect.top - elementClientRect.top + paddingObject.top,
    bottom: elementClientRect.bottom - clippingClientRect.bottom + paddingObject.bottom,
    left: clippingClientRect.left - elementClientRect.left + paddingObject.left,
    right: elementClientRect.right - clippingClientRect.right + paddingObject.right
  };
  var offsetData = state.modifiersData.offset;
  if (elementContext === popper && offsetData) {
    var offset2 = offsetData[placement];
    Object.keys(overflowOffsets).forEach(function(key) {
      var multiply = [right, bottom].indexOf(key) >= 0 ? 1 : -1;
      var axis = [top, bottom].indexOf(key) >= 0 ? "y" : "x";
      overflowOffsets[key] += offset2[axis] * multiply;
    });
  }
  return overflowOffsets;
}
function computeAutoPlacement(state, options) {
  if (options === void 0) {
    options = {};
  }
  var _options = options, placement = _options.placement, boundary = _options.boundary, rootBoundary = _options.rootBoundary, padding = _options.padding, flipVariations = _options.flipVariations, _options$allowedAutoP = _options.allowedAutoPlacements, allowedAutoPlacements = _options$allowedAutoP === void 0 ? placements : _options$allowedAutoP;
  var variation = getVariation(placement);
  var placements$1 = variation ? flipVariations ? variationPlacements : variationPlacements.filter(function(placement2) {
    return getVariation(placement2) === variation;
  }) : basePlacements;
  var allowedPlacements = placements$1.filter(function(placement2) {
    return allowedAutoPlacements.indexOf(placement2) >= 0;
  });
  if (allowedPlacements.length === 0) {
    allowedPlacements = placements$1;
  }
  var overflows = allowedPlacements.reduce(function(acc, placement2) {
    acc[placement2] = detectOverflow(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding
    })[getBasePlacement(placement2)];
    return acc;
  }, {});
  return Object.keys(overflows).sort(function(a, b) {
    return overflows[a] - overflows[b];
  });
}
function getExpandedFallbackPlacements(placement) {
  if (getBasePlacement(placement) === auto) {
    return [];
  }
  var oppositePlacement = getOppositePlacement(placement);
  return [getOppositeVariationPlacement(placement), oppositePlacement, getOppositeVariationPlacement(oppositePlacement)];
}
function flip(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  if (state.modifiersData[name]._skip) {
    return;
  }
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? true : _options$altAxis, specifiedFallbackPlacements = options.fallbackPlacements, padding = options.padding, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, _options$flipVariatio = options.flipVariations, flipVariations = _options$flipVariatio === void 0 ? true : _options$flipVariatio, allowedAutoPlacements = options.allowedAutoPlacements;
  var preferredPlacement = state.options.placement;
  var basePlacement = getBasePlacement(preferredPlacement);
  var isBasePlacement = basePlacement === preferredPlacement;
  var fallbackPlacements = specifiedFallbackPlacements || (isBasePlacement || !flipVariations ? [getOppositePlacement(preferredPlacement)] : getExpandedFallbackPlacements(preferredPlacement));
  var placements2 = [preferredPlacement].concat(fallbackPlacements).reduce(function(acc, placement2) {
    return acc.concat(getBasePlacement(placement2) === auto ? computeAutoPlacement(state, {
      placement: placement2,
      boundary,
      rootBoundary,
      padding,
      flipVariations,
      allowedAutoPlacements
    }) : placement2);
  }, []);
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var checksMap = new Map();
  var makeFallbackChecks = true;
  var firstFittingPlacement = placements2[0];
  for (var i = 0; i < placements2.length; i++) {
    var placement = placements2[i];
    var _basePlacement = getBasePlacement(placement);
    var isStartVariation = getVariation(placement) === start;
    var isVertical = [top, bottom].indexOf(_basePlacement) >= 0;
    var len = isVertical ? "width" : "height";
    var overflow = detectOverflow(state, {
      placement,
      boundary,
      rootBoundary,
      altBoundary,
      padding
    });
    var mainVariationSide = isVertical ? isStartVariation ? right : left : isStartVariation ? bottom : top;
    if (referenceRect[len] > popperRect[len]) {
      mainVariationSide = getOppositePlacement(mainVariationSide);
    }
    var altVariationSide = getOppositePlacement(mainVariationSide);
    var checks = [];
    if (checkMainAxis) {
      checks.push(overflow[_basePlacement] <= 0);
    }
    if (checkAltAxis) {
      checks.push(overflow[mainVariationSide] <= 0, overflow[altVariationSide] <= 0);
    }
    if (checks.every(function(check2) {
      return check2;
    })) {
      firstFittingPlacement = placement;
      makeFallbackChecks = false;
      break;
    }
    checksMap.set(placement, checks);
  }
  if (makeFallbackChecks) {
    var numberOfChecks = flipVariations ? 3 : 1;
    var _loop = function _loop2(_i2) {
      var fittingPlacement = placements2.find(function(placement2) {
        var checks2 = checksMap.get(placement2);
        if (checks2) {
          return checks2.slice(0, _i2).every(function(check2) {
            return check2;
          });
        }
      });
      if (fittingPlacement) {
        firstFittingPlacement = fittingPlacement;
        return "break";
      }
    };
    for (var _i = numberOfChecks; _i > 0; _i--) {
      var _ret = _loop(_i);
      if (_ret === "break")
        break;
    }
  }
  if (state.placement !== firstFittingPlacement) {
    state.modifiersData[name]._skip = true;
    state.placement = firstFittingPlacement;
    state.reset = true;
  }
}
var flip$1 = {
  name: "flip",
  enabled: true,
  phase: "main",
  fn: flip,
  requiresIfExists: ["offset"],
  data: {
    _skip: false
  }
};
function getSideOffsets(overflow, rect2, preventedOffsets) {
  if (preventedOffsets === void 0) {
    preventedOffsets = {
      x: 0,
      y: 0
    };
  }
  return {
    top: overflow.top - rect2.height - preventedOffsets.y,
    right: overflow.right - rect2.width + preventedOffsets.x,
    bottom: overflow.bottom - rect2.height + preventedOffsets.y,
    left: overflow.left - rect2.width - preventedOffsets.x
  };
}
function isAnySideFullyClipped(overflow) {
  return [top, right, bottom, left].some(function(side) {
    return overflow[side] >= 0;
  });
}
function hide(_ref) {
  var state = _ref.state, name = _ref.name;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var preventedOffsets = state.modifiersData.preventOverflow;
  var referenceOverflow = detectOverflow(state, {
    elementContext: "reference"
  });
  var popperAltOverflow = detectOverflow(state, {
    altBoundary: true
  });
  var referenceClippingOffsets = getSideOffsets(referenceOverflow, referenceRect);
  var popperEscapeOffsets = getSideOffsets(popperAltOverflow, popperRect, preventedOffsets);
  var isReferenceHidden = isAnySideFullyClipped(referenceClippingOffsets);
  var hasPopperEscaped = isAnySideFullyClipped(popperEscapeOffsets);
  state.modifiersData[name] = {
    referenceClippingOffsets,
    popperEscapeOffsets,
    isReferenceHidden,
    hasPopperEscaped
  };
  state.attributes.popper = Object.assign({}, state.attributes.popper, {
    "data-popper-reference-hidden": isReferenceHidden,
    "data-popper-escaped": hasPopperEscaped
  });
}
var hide$1 = {
  name: "hide",
  enabled: true,
  phase: "main",
  requiresIfExists: ["preventOverflow"],
  fn: hide
};
function distanceAndSkiddingToXY(placement, rects, offset2) {
  var basePlacement = getBasePlacement(placement);
  var invertDistance = [left, top].indexOf(basePlacement) >= 0 ? -1 : 1;
  var _ref = typeof offset2 === "function" ? offset2(Object.assign({}, rects, {
    placement
  })) : offset2, skidding = _ref[0], distance = _ref[1];
  skidding = skidding || 0;
  distance = (distance || 0) * invertDistance;
  return [left, right].indexOf(basePlacement) >= 0 ? {
    x: distance,
    y: skidding
  } : {
    x: skidding,
    y: distance
  };
}
function offset(_ref2) {
  var state = _ref2.state, options = _ref2.options, name = _ref2.name;
  var _options$offset = options.offset, offset2 = _options$offset === void 0 ? [0, 0] : _options$offset;
  var data = placements.reduce(function(acc, placement) {
    acc[placement] = distanceAndSkiddingToXY(placement, state.rects, offset2);
    return acc;
  }, {});
  var _data$state$placement = data[state.placement], x = _data$state$placement.x, y = _data$state$placement.y;
  if (state.modifiersData.popperOffsets != null) {
    state.modifiersData.popperOffsets.x += x;
    state.modifiersData.popperOffsets.y += y;
  }
  state.modifiersData[name] = data;
}
var offset$1 = {
  name: "offset",
  enabled: true,
  phase: "main",
  requires: ["popperOffsets"],
  fn: offset
};
function popperOffsets(_ref) {
  var state = _ref.state, name = _ref.name;
  state.modifiersData[name] = computeOffsets({
    reference: state.rects.reference,
    element: state.rects.popper,
    strategy: "absolute",
    placement: state.placement
  });
}
var popperOffsets$1 = {
  name: "popperOffsets",
  enabled: true,
  phase: "read",
  fn: popperOffsets,
  data: {}
};
function getAltAxis(axis) {
  return axis === "x" ? "y" : "x";
}
function preventOverflow(_ref) {
  var state = _ref.state, options = _ref.options, name = _ref.name;
  var _options$mainAxis = options.mainAxis, checkMainAxis = _options$mainAxis === void 0 ? true : _options$mainAxis, _options$altAxis = options.altAxis, checkAltAxis = _options$altAxis === void 0 ? false : _options$altAxis, boundary = options.boundary, rootBoundary = options.rootBoundary, altBoundary = options.altBoundary, padding = options.padding, _options$tether = options.tether, tether = _options$tether === void 0 ? true : _options$tether, _options$tetherOffset = options.tetherOffset, tetherOffset = _options$tetherOffset === void 0 ? 0 : _options$tetherOffset;
  var overflow = detectOverflow(state, {
    boundary,
    rootBoundary,
    padding,
    altBoundary
  });
  var basePlacement = getBasePlacement(state.placement);
  var variation = getVariation(state.placement);
  var isBasePlacement = !variation;
  var mainAxis = getMainAxisFromPlacement(basePlacement);
  var altAxis = getAltAxis(mainAxis);
  var popperOffsets2 = state.modifiersData.popperOffsets;
  var referenceRect = state.rects.reference;
  var popperRect = state.rects.popper;
  var tetherOffsetValue = typeof tetherOffset === "function" ? tetherOffset(Object.assign({}, state.rects, {
    placement: state.placement
  })) : tetherOffset;
  var normalizedTetherOffsetValue = typeof tetherOffsetValue === "number" ? {
    mainAxis: tetherOffsetValue,
    altAxis: tetherOffsetValue
  } : Object.assign({
    mainAxis: 0,
    altAxis: 0
  }, tetherOffsetValue);
  var offsetModifierState = state.modifiersData.offset ? state.modifiersData.offset[state.placement] : null;
  var data = {
    x: 0,
    y: 0
  };
  if (!popperOffsets2) {
    return;
  }
  if (checkMainAxis) {
    var _offsetModifierState$;
    var mainSide = mainAxis === "y" ? top : left;
    var altSide = mainAxis === "y" ? bottom : right;
    var len = mainAxis === "y" ? "height" : "width";
    var offset2 = popperOffsets2[mainAxis];
    var min$12 = offset2 + overflow[mainSide];
    var max$12 = offset2 - overflow[altSide];
    var additive = tether ? -popperRect[len] / 2 : 0;
    var minLen = variation === start ? referenceRect[len] : popperRect[len];
    var maxLen = variation === start ? -popperRect[len] : -referenceRect[len];
    var arrowElement = state.elements.arrow;
    var arrowRect = tether && arrowElement ? getLayoutRect(arrowElement) : {
      width: 0,
      height: 0
    };
    var arrowPaddingObject = state.modifiersData["arrow#persistent"] ? state.modifiersData["arrow#persistent"].padding : getFreshSideObject();
    var arrowPaddingMin = arrowPaddingObject[mainSide];
    var arrowPaddingMax = arrowPaddingObject[altSide];
    var arrowLen = within(0, referenceRect[len], arrowRect[len]);
    var minOffset = isBasePlacement ? referenceRect[len] / 2 - additive - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis : minLen - arrowLen - arrowPaddingMin - normalizedTetherOffsetValue.mainAxis;
    var maxOffset = isBasePlacement ? -referenceRect[len] / 2 + additive + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis : maxLen + arrowLen + arrowPaddingMax + normalizedTetherOffsetValue.mainAxis;
    var arrowOffsetParent = state.elements.arrow && getOffsetParent(state.elements.arrow);
    var clientOffset = arrowOffsetParent ? mainAxis === "y" ? arrowOffsetParent.clientTop || 0 : arrowOffsetParent.clientLeft || 0 : 0;
    var offsetModifierValue = (_offsetModifierState$ = offsetModifierState == null ? void 0 : offsetModifierState[mainAxis]) != null ? _offsetModifierState$ : 0;
    var tetherMin = offset2 + minOffset - offsetModifierValue - clientOffset;
    var tetherMax = offset2 + maxOffset - offsetModifierValue;
    var preventedOffset = within(tether ? min(min$12, tetherMin) : min$12, offset2, tether ? max(max$12, tetherMax) : max$12);
    popperOffsets2[mainAxis] = preventedOffset;
    data[mainAxis] = preventedOffset - offset2;
  }
  if (checkAltAxis) {
    var _offsetModifierState$2;
    var _mainSide = mainAxis === "x" ? top : left;
    var _altSide = mainAxis === "x" ? bottom : right;
    var _offset = popperOffsets2[altAxis];
    var _len = altAxis === "y" ? "height" : "width";
    var _min = _offset + overflow[_mainSide];
    var _max = _offset - overflow[_altSide];
    var isOriginSide = [top, left].indexOf(basePlacement) !== -1;
    var _offsetModifierValue = (_offsetModifierState$2 = offsetModifierState == null ? void 0 : offsetModifierState[altAxis]) != null ? _offsetModifierState$2 : 0;
    var _tetherMin = isOriginSide ? _min : _offset - referenceRect[_len] - popperRect[_len] - _offsetModifierValue + normalizedTetherOffsetValue.altAxis;
    var _tetherMax = isOriginSide ? _offset + referenceRect[_len] + popperRect[_len] - _offsetModifierValue - normalizedTetherOffsetValue.altAxis : _max;
    var _preventedOffset = tether && isOriginSide ? withinMaxClamp(_tetherMin, _offset, _tetherMax) : within(tether ? _tetherMin : _min, _offset, tether ? _tetherMax : _max);
    popperOffsets2[altAxis] = _preventedOffset;
    data[altAxis] = _preventedOffset - _offset;
  }
  state.modifiersData[name] = data;
}
var preventOverflow$1 = {
  name: "preventOverflow",
  enabled: true,
  phase: "main",
  fn: preventOverflow,
  requiresIfExists: ["offset"]
};
function getHTMLElementScroll(element) {
  return {
    scrollLeft: element.scrollLeft,
    scrollTop: element.scrollTop
  };
}
function getNodeScroll(node2) {
  if (node2 === getWindow(node2) || !isHTMLElement(node2)) {
    return getWindowScroll(node2);
  } else {
    return getHTMLElementScroll(node2);
  }
}
function isElementScaled(element) {
  var rect2 = element.getBoundingClientRect();
  var scaleX = round(rect2.width) / element.offsetWidth || 1;
  var scaleY = round(rect2.height) / element.offsetHeight || 1;
  return scaleX !== 1 || scaleY !== 1;
}
function getCompositeRect(elementOrVirtualElement, offsetParent, isFixed) {
  if (isFixed === void 0) {
    isFixed = false;
  }
  var isOffsetParentAnElement = isHTMLElement(offsetParent);
  var offsetParentIsScaled = isHTMLElement(offsetParent) && isElementScaled(offsetParent);
  var documentElement = getDocumentElement(offsetParent);
  var rect2 = getBoundingClientRect(elementOrVirtualElement, offsetParentIsScaled);
  var scroll = {
    scrollLeft: 0,
    scrollTop: 0
  };
  var offsets = {
    x: 0,
    y: 0
  };
  if (isOffsetParentAnElement || !isOffsetParentAnElement && !isFixed) {
    if (getNodeName(offsetParent) !== "body" || isScrollParent(documentElement)) {
      scroll = getNodeScroll(offsetParent);
    }
    if (isHTMLElement(offsetParent)) {
      offsets = getBoundingClientRect(offsetParent, true);
      offsets.x += offsetParent.clientLeft;
      offsets.y += offsetParent.clientTop;
    } else if (documentElement) {
      offsets.x = getWindowScrollBarX(documentElement);
    }
  }
  return {
    x: rect2.left + scroll.scrollLeft - offsets.x,
    y: rect2.top + scroll.scrollTop - offsets.y,
    width: rect2.width,
    height: rect2.height
  };
}
function order(modifiers) {
  var map2 = new Map();
  var visited = new Set();
  var result = [];
  modifiers.forEach(function(modifier) {
    map2.set(modifier.name, modifier);
  });
  function sort2(modifier) {
    visited.add(modifier.name);
    var requires = [].concat(modifier.requires || [], modifier.requiresIfExists || []);
    requires.forEach(function(dep) {
      if (!visited.has(dep)) {
        var depModifier = map2.get(dep);
        if (depModifier) {
          sort2(depModifier);
        }
      }
    });
    result.push(modifier);
  }
  modifiers.forEach(function(modifier) {
    if (!visited.has(modifier.name)) {
      sort2(modifier);
    }
  });
  return result;
}
function orderModifiers(modifiers) {
  var orderedModifiers = order(modifiers);
  return modifierPhases.reduce(function(acc, phase) {
    return acc.concat(orderedModifiers.filter(function(modifier) {
      return modifier.phase === phase;
    }));
  }, []);
}
function debounce(fn2) {
  var pending;
  return function() {
    if (!pending) {
      pending = new Promise(function(resolve2) {
        Promise.resolve().then(function() {
          pending = void 0;
          resolve2(fn2());
        });
      });
    }
    return pending;
  };
}
function mergeByName(modifiers) {
  var merged = modifiers.reduce(function(merged2, current) {
    var existing = merged2[current.name];
    merged2[current.name] = existing ? Object.assign({}, existing, current, {
      options: Object.assign({}, existing.options, current.options),
      data: Object.assign({}, existing.data, current.data)
    }) : current;
    return merged2;
  }, {});
  return Object.keys(merged).map(function(key) {
    return merged[key];
  });
}
var DEFAULT_OPTIONS = {
  placement: "bottom",
  modifiers: [],
  strategy: "absolute"
};
function areValidElements() {
  for (var _len = arguments.length, args = new Array(_len), _key = 0; _key < _len; _key++) {
    args[_key] = arguments[_key];
  }
  return !args.some(function(element) {
    return !(element && typeof element.getBoundingClientRect === "function");
  });
}
function popperGenerator(generatorOptions) {
  if (generatorOptions === void 0) {
    generatorOptions = {};
  }
  var _generatorOptions = generatorOptions, _generatorOptions$def = _generatorOptions.defaultModifiers, defaultModifiers2 = _generatorOptions$def === void 0 ? [] : _generatorOptions$def, _generatorOptions$def2 = _generatorOptions.defaultOptions, defaultOptions2 = _generatorOptions$def2 === void 0 ? DEFAULT_OPTIONS : _generatorOptions$def2;
  return function createPopper2(reference2, popper2, options) {
    if (options === void 0) {
      options = defaultOptions2;
    }
    var state = {
      placement: "bottom",
      orderedModifiers: [],
      options: Object.assign({}, DEFAULT_OPTIONS, defaultOptions2),
      modifiersData: {},
      elements: {
        reference: reference2,
        popper: popper2
      },
      attributes: {},
      styles: {}
    };
    var effectCleanupFns = [];
    var isDestroyed = false;
    var instance = {
      state,
      setOptions: function setOptions(setOptionsAction) {
        var options2 = typeof setOptionsAction === "function" ? setOptionsAction(state.options) : setOptionsAction;
        cleanupModifierEffects();
        state.options = Object.assign({}, defaultOptions2, state.options, options2);
        state.scrollParents = {
          reference: isElement(reference2) ? listScrollParents(reference2) : reference2.contextElement ? listScrollParents(reference2.contextElement) : [],
          popper: listScrollParents(popper2)
        };
        var orderedModifiers = orderModifiers(mergeByName([].concat(defaultModifiers2, state.options.modifiers)));
        state.orderedModifiers = orderedModifiers.filter(function(m) {
          return m.enabled;
        });
        runModifierEffects();
        return instance.update();
      },
      forceUpdate: function forceUpdate() {
        if (isDestroyed) {
          return;
        }
        var _state$elements = state.elements, reference3 = _state$elements.reference, popper3 = _state$elements.popper;
        if (!areValidElements(reference3, popper3)) {
          return;
        }
        state.rects = {
          reference: getCompositeRect(reference3, getOffsetParent(popper3), state.options.strategy === "fixed"),
          popper: getLayoutRect(popper3)
        };
        state.reset = false;
        state.placement = state.options.placement;
        state.orderedModifiers.forEach(function(modifier) {
          return state.modifiersData[modifier.name] = Object.assign({}, modifier.data);
        });
        for (var index2 = 0; index2 < state.orderedModifiers.length; index2++) {
          if (state.reset === true) {
            state.reset = false;
            index2 = -1;
            continue;
          }
          var _state$orderedModifie = state.orderedModifiers[index2], fn2 = _state$orderedModifie.fn, _state$orderedModifie2 = _state$orderedModifie.options, _options = _state$orderedModifie2 === void 0 ? {} : _state$orderedModifie2, name = _state$orderedModifie.name;
          if (typeof fn2 === "function") {
            state = fn2({
              state,
              options: _options,
              name,
              instance
            }) || state;
          }
        }
      },
      update: debounce(function() {
        return new Promise(function(resolve2) {
          instance.forceUpdate();
          resolve2(state);
        });
      }),
      destroy: function destroy() {
        cleanupModifierEffects();
        isDestroyed = true;
      }
    };
    if (!areValidElements(reference2, popper2)) {
      return instance;
    }
    instance.setOptions(options).then(function(state2) {
      if (!isDestroyed && options.onFirstUpdate) {
        options.onFirstUpdate(state2);
      }
    });
    function runModifierEffects() {
      state.orderedModifiers.forEach(function(_ref3) {
        var name = _ref3.name, _ref3$options = _ref3.options, options2 = _ref3$options === void 0 ? {} : _ref3$options, effect2 = _ref3.effect;
        if (typeof effect2 === "function") {
          var cleanupFn = effect2({
            state,
            name,
            instance,
            options: options2
          });
          var noopFn = function noopFn2() {
          };
          effectCleanupFns.push(cleanupFn || noopFn);
        }
      });
    }
    function cleanupModifierEffects() {
      effectCleanupFns.forEach(function(fn2) {
        return fn2();
      });
      effectCleanupFns = [];
    }
    return instance;
  };
}
var defaultModifiers = [eventListeners, popperOffsets$1, computeStyles$1, applyStyles$1, offset$1, flip$1, preventOverflow$1, arrow$1, hide$1];
var createPopper = /* @__PURE__ */ popperGenerator({
  defaultModifiers
});
const offsetModifier = (offset2) => ({
  name: "offset",
  options: {
    offset: [0, offset2]
  }
});
const arrowModifier = () => ({
  name: "arrow",
  options: {
    padding: 6
  }
});
const preventOverflowModifier = () => ({
  name: "preventOverflow",
  options: {
    padding: 8
  }
});
const computeStylesModifier = () => ({
  name: "computeStyles",
  options: {
    gpuAcceleration: false,
    adaptive: false
  }
});
const sameWidthModifier = () => ({
  name: "sameWidth",
  enabled: true,
  phase: "beforeWrite",
  requires: ["computeStyles"],
  fn: ({ state }) => {
    state.styles.popper.width = `${state.rects.reference.width}px`;
  },
  effect({ state }) {
    state.elements.popper.style.width = `${state.elements.reference.offsetWidth}px`;
  }
});
const useBaseModifiers = ({ offset: offset2 }) => [
  offsetModifier(offset2),
  arrowModifier(),
  preventOverflowModifier(),
  computeStylesModifier()
];
var PopupMixin = defineComponent({
  props: {
    placement: {
      type: String,
      default: "auto"
    },
    offset: {
      type: Number,
      default: 6
    },
    popperOptions: {
      type: Object,
      default: () => ({})
    }
  },
  data() {
    return {
      popperInstance: void 0
    };
  },
  watch: {
    placement(placement) {
      if (this.popperInstance) {
        this.popperInstance.setOptions({ placement });
      }
    }
  },
  beforeUnmount() {
    this.destroyPopper();
  },
  methods: {
    createPopper() {
      if (typeof window === "undefined") {
        return;
      }
      const modifiers = useBaseModifiers({ offset: this.offset });
      this.popperInstance = createPopper(this.$refs.wrapper, this.$refs.popup, __spreadValues({
        strategy: "fixed",
        placement: this.placement,
        modifiers
      }, this.popperOptions));
    },
    destroyPopper() {
      if (this.popperInstance) {
        this.popperInstance.destroy();
        this.popperInstance = void 0;
      }
    }
  }
});
var PopupControlsMixin = defineComponent({
  props: {
    disabled: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Boolean,
      default: void 0
    },
    trigger: {
      type: Array,
      default: () => ["hover", "click", "focus"]
    }
  },
  emits: ["update:modelValue"],
  data() {
    return {
      visible: this.modelValue,
      triggerStack: 0
    };
  },
  watch: {
    modelValue(value) {
      if (value) {
        this.show();
      } else {
        this.hide();
      }
    }
  },
  mounted() {
    if (!this.$slots.default) {
      throw new Error("Popup components require one child element to be used as trigger.");
    }
    this.addEventListeners();
  },
  beforeUnmount() {
    this.removeEventListeners();
  },
  methods: {
    show() {
      if (this.disabled || this.visible) {
        return;
      }
      this.triggerStack += 1;
      this.visible = true;
      this.createPopper();
      this.$emit("update:modelValue", true);
    },
    hide() {
      if (this.disabled || !this.visible) {
        return;
      }
      this.triggerStack -= 1;
      if (this.triggerStack <= 0) {
        this.triggerStack = 0;
        this.visible = false;
        this.$emit("update:modelValue", false);
      }
    },
    onClick() {
      if (this.visible) {
        this.hide();
      } else {
        this.show();
      }
    },
    onClickOutside() {
      if (this.modelValue)
        return;
      this.hide();
    },
    addEventListeners() {
      [].concat(this.trigger).forEach((trigger2) => {
        switch (trigger2) {
          case "hover":
            on(this.$refs.trigger, "mouseenter", this.show);
            on(this.$refs.trigger, "mouseleave", this.hide);
            break;
          case "click":
            on(this.$refs.trigger, "click", this.onClick);
            break;
          case "focus":
            for (const child of this.$refs.trigger.children) {
              on(child, "focus", this.show);
              on(child, "blur", this.hide);
            }
            break;
        }
      });
    },
    removeEventListeners() {
      [].concat(this.trigger).forEach((trigger2) => {
        switch (trigger2) {
          case "hover":
            off(this.$refs.trigger, "mouseenter", this.show);
            off(this.$refs.trigger, "mouseleave", this.hide);
            break;
          case "click":
            off(this.$refs.trigger, "click", this.onClick);
            break;
          case "focus":
            for (const child of this.$refs.trigger.children) {
              off(child, "focus", this.show);
              off(child, "blur", this.hide);
            }
            break;
        }
      });
    },
    focusTrigger() {
      for (const child of this.$refs.trigger.children) {
        if (focusFirstDescendant(child)) {
          child.focus();
          break;
        }
      }
    }
  }
});
const componentName$V = "IAlert";
var _sfc_main$W = defineComponent({
  name: componentName$V,
  props: {
    size: {
      type: String,
      default: defaultPropValue(componentName$V, "size"),
      validator: sizePropValidator
    },
    color: {
      type: String,
      default: defaultPropValue(componentName$V, "color")
    },
    modelValue: {
      type: Boolean,
      default: true
    },
    dismissible: {
      type: Boolean,
      default: false
    },
    dismissAriaLabel: {
      type: String,
      default: "Dismiss"
    }
  },
  emits: [
    "update:modelValue"
  ],
  data() {
    return {
      dismissed: false
    };
  },
  computed: {
    classes() {
      return {
        [`-${this.color}`]: Boolean(this.color),
        [`-${this.size}`]: Boolean(this.size),
        "-dismissible": this.dismissible,
        "-with-icon": Boolean(this.$slots.icon)
      };
    }
  },
  watch: {
    modelValue(value) {
      this.dismissed = !value;
    }
  },
  methods: {
    dismiss() {
      this.dismissed = true;
      this.$emit("update:modelValue", false);
    }
  }
});
const _hoisted_1$E = {
  key: 0,
  class: "icon",
  role: "img",
  "aria-hidden": "true"
};
const _hoisted_2$k = { class: "content" };
const _hoisted_3$d = ["aria-label"];
const _hoisted_4$a = /* @__PURE__ */ createTextVNode("\xD7");
function render$W(_ctx, _cache, $props, $setup, $data, $options) {
  return withDirectives((openBlock(), createElementBlock("div", mergeProps({
    class: ["alert", _ctx.classes],
    role: "alert"
  }, _ctx.$attrs), [
    _ctx.$slots.icon ? (openBlock(), createElementBlock("span", _hoisted_1$E, [
      renderSlot(_ctx.$slots, "icon")
    ])) : createCommentVNode("v-if", true),
    createBaseVNode("div", _hoisted_2$k, [
      renderSlot(_ctx.$slots, "default")
    ]),
    _ctx.dismissible ? (openBlock(), createElementBlock("span", {
      key: 1,
      class: "dismiss",
      role: "button",
      "aria-label": _ctx.dismissAriaLabel,
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.dismiss && _ctx.dismiss(...args))
    }, [
      renderSlot(_ctx.$slots, "dismiss", {}, () => [
        _hoisted_4$a
      ])
    ], 8, _hoisted_3$d)) : createCommentVNode("v-if", true)
  ], 16)), [
    [vShow, !_ctx.dismissed]
  ]);
}
var style_scss_vue_type_style_index_0_src_lang$J = "";
var _export_sfc = (sfc, props) => {
  const target2 = sfc.__vccOpts || sfc;
  for (const [key, val] of props) {
    target2[key] = val;
  }
  return target2;
};
var index$L = /* @__PURE__ */ _export_sfc(_sfc_main$W, [["render", render$W]]);
const componentName$U = "IBadge";
var _sfc_main$V = defineComponent({
  name: componentName$U,
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$U, "color")
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$U, "size"),
      validator: sizePropValidator
    }
  },
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size)
      });
    }
  }
});
function render$V(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({
    class: ["badge", _ctx.classes]
  }, _ctx.$attrs), [
    renderSlot(_ctx.$slots, "default")
  ], 16);
}
var style_scss_vue_type_style_index_0_src_lang$I = "";
var index$K = /* @__PURE__ */ _export_sfc(_sfc_main$V, [["render", render$V]]);
const componentName$T = "IBreadcrumb";
var _sfc_main$U = defineComponent({
  name: componentName$T,
  props: {
    ariaLabel: {
      type: String,
      default: "Breadcrumbs"
    },
    color: {
      type: String,
      default: defaultPropValue(componentName$T, "color")
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$T, "size"),
      validator: sizePropValidator
    }
  },
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size)
      });
    }
  }
});
const _hoisted_1$D = ["aria-label"];
function render$U(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("nav", mergeProps({
    class: ["breadcrumb", _ctx.classes],
    "aria-label": _ctx.ariaLabel
  }, _ctx.$attrs), [
    createBaseVNode("ol", null, [
      renderSlot(_ctx.$slots, "default")
    ])
  ], 16, _hoisted_1$D);
}
var style_scss_vue_type_style_index_0_src_lang$H = "";
var index$J = /* @__PURE__ */ _export_sfc(_sfc_main$U, [["render", render$U]]);
const componentName$S = "IBreadcrumbItem";
var _sfc_main$T = defineComponent({
  name: componentName$S,
  mixins: [
    LinkableMixin
  ],
  props: {
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tabindex: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    classes() {
      return {
        "-active": this.active,
        "-disabled": this.disabled
      };
    },
    tabIndex() {
      return this.disabled || this.active ? -1 : this.tabindex;
    }
  }
});
const _hoisted_1$C = ["is", "tabindex", "aria-current"];
function render$T(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("li", {
    class: normalizeClass(["breadcrumb-item", _ctx.classes])
  }, [
    createBaseVNode("a", mergeProps({ is: _ctx.isTag }, _ctx.$attrs, {
      tabindex: _ctx.tabIndex,
      "aria-current": _ctx.active ? "location" : null
    }), [
      renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ], 16, _hoisted_1$C)
  ], 2);
}
var style_scss_vue_type_style_index_0_src_scoped_true_lang$9 = "";
var index$I = /* @__PURE__ */ _export_sfc(_sfc_main$T, [["render", render$T], ["__scopeId", "data-v-4f65c4cb"]]);
const componentName$R = "ILoader";
var _sfc_main$S = defineComponent({
  name: componentName$R,
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$R, "color")
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$R, "size")
    }
  },
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size)
      });
    }
  }
});
const _hoisted_1$B = {
  key: 0,
  class: "loader-text"
};
const _hoisted_2$j = /* @__PURE__ */ createBaseVNode("svg", { viewBox: "25 25 50 50" }, [
  /* @__PURE__ */ createBaseVNode("circle", {
    cx: "50",
    cy: "50",
    r: "20",
    fill: "none",
    "stroke-width": "4",
    "stroke-miterlimit": "10"
  })
], -1);
function render$S(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["loader", _ctx.classes]),
    role: "img",
    "aria-hidden": "true"
  }, [
    _ctx.$slots.default ? (openBlock(), createElementBlock("span", _hoisted_1$B, [
      renderSlot(_ctx.$slots, "default")
    ])) : createCommentVNode("v-if", true),
    _hoisted_2$j
  ], 2);
}
var style_scss_vue_type_style_index_0_src_lang$G = "";
var ILoader = /* @__PURE__ */ _export_sfc(_sfc_main$S, [["render", render$S]]);
const componentName$Q = "IButton";
var _sfc_main$R = defineComponent({
  name: componentName$Q,
  components: {
    ILoader
  },
  mixins: [
    LinkableMixin
  ],
  inject: {
    buttonGroup: {
      default: () => ({})
    },
    form: {
      default: () => ({})
    },
    formGroup: {
      default: () => ({})
    }
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    circle: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: defaultPropValue(componentName$Q, "color")
    },
    disabled: {
      type: Boolean,
      default: false
    },
    link: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    outline: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: "button"
    },
    tabindex: {
      type: [Number, String],
      default: 0
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$Q, "size"),
      validator: sizePropValidator
    }
  },
  computed: {
    ariaBusy() {
      if (this.role !== "button") {
        return null;
      }
      return this.loading ? "true" : "false";
    },
    ariaDisabled() {
      if (this.role !== "button") {
        return null;
      }
      return this.disabled ? "true" : "false";
    },
    ariaPressed() {
      if (this.role !== "button") {
        return null;
      }
      return this.active ? "true" : "false";
    },
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size),
        "-active": this.active,
        "-block": this.block,
        "-circle": this.circle,
        "-disabled": this.isDisabled,
        "-link": this.link,
        "-outline": this.outline
      });
    },
    isDisabled() {
      return this.disabled || this.buttonGroup.disabled || this.form.disabled || this.formGroup.disabled;
    },
    role() {
      return this.$attrs.to || this.$attrs.href ? "link" : "button";
    },
    tabIndex() {
      return this.isDisabled ? -1 : this.tabindex;
    }
  }
});
function render$R(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_i_loader = resolveComponent("i-loader");
  return openBlock(), createBlock(resolveDynamicComponent(_ctx.isTag), mergeProps(_ctx.$attrs, {
    class: ["button", _ctx.classes],
    tag: _ctx.tag,
    role: _ctx.role,
    tabindex: _ctx.tabIndex,
    disabled: _ctx.isDisabled || _ctx.loading,
    "aria-disabled": _ctx.ariaDisabled,
    "aria-pressed": _ctx.ariaPressed,
    "aria-busy": _ctx.ariaBusy,
    "aria-live": "polite"
  }), {
    default: withCtx(() => [
      _ctx.loading ? renderSlot(_ctx.$slots, "loading", { key: 0 }, () => [
        createVNode(_component_i_loader)
      ]) : createCommentVNode("v-if", true),
      !_ctx.loading ? renderSlot(_ctx.$slots, "default", { key: 1 }) : createCommentVNode("v-if", true)
    ]),
    _: 3
  }, 16, ["tag", "role", "tabindex", "class", "disabled", "aria-disabled", "aria-pressed", "aria-busy"]);
}
var style_scss_vue_type_style_index_0_src_lang$F = "";
var IButton = /* @__PURE__ */ _export_sfc(_sfc_main$R, [["render", render$R]]);
const componentName$P = "IButtonGroup";
var _sfc_main$Q = defineComponent({
  name: componentName$P,
  inject: {
    form: {
      default: () => ({})
    },
    buttonGroup: {
      default: () => ({})
    },
    formGroup: {
      default: () => ({})
    }
  },
  provide() {
    return {
      buttonGroup: this
    };
  },
  props: {
    vertical: {
      type: Boolean,
      default: false
    },
    block: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      return {
        "-vertical": this.vertical,
        "-block": this.block,
        "-disabled": this.isDisabled
      };
    },
    isDisabled() {
      return this.disabled || this.buttonGroup.disabled || this.form.disabled || this.formGroup.disabled;
    }
  }
});
const _hoisted_1$A = ["aria-disabled"];
function render$Q(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({
    class: ["button-group", _ctx.classes],
    role: "group",
    "aria-disabled": _ctx.isDisabled
  }, _ctx.$attrs), [
    renderSlot(_ctx.$slots, "default")
  ], 16, _hoisted_1$A);
}
var style_scss_vue_type_style_index_0_src_lang$E = "";
var index$H = /* @__PURE__ */ _export_sfc(_sfc_main$Q, [["render", render$Q]]);
const properties$1 = {};
for (const breakpoint of breakpointKeys) {
  if (breakpoint !== "") {
    properties$1[breakpoint] = {
      type: [String, Boolean, Number],
      default: false
    };
  }
  for (const property of ["first", "last"]) {
    properties$1[`${property}${capitalizeFirst(breakpoint)}`] = {
      type: Boolean,
      default: false
    };
  }
  for (const property of ["offset", "push", "pull"]) {
    properties$1[`${property}${capitalizeFirst(breakpoint)}`] = {
      type: [String, Number],
      default: ""
    };
  }
}
const componentName$O = "IColumn";
var _sfc_main$P = defineComponent({
  name: componentName$O,
  props: properties$1,
  computed: {
    classes() {
      return Object.keys(properties$1).reduce((acc, property) => {
        if (this[property]) {
          acc[breakpointClass(`-${property}`, this[property])] = true;
        }
        return acc;
      }, {});
    }
  }
});
function render$P(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["column", _ctx.classes])
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var style_scss_vue_type_style_index_0_src_lang$D = "";
var IColumn = /* @__PURE__ */ _export_sfc(_sfc_main$P, [["render", render$P]]);
const componentName$N = "IContainer";
var _sfc_main$O = defineComponent({
  name: componentName$N,
  props: {
    fluid: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      return {
        "-fluid": this.fluid
      };
    }
  }
});
function render$O(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["container", _ctx.classes])
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var style_scss_vue_type_style_index_0_src_lang$C = "";
var IContainer = /* @__PURE__ */ _export_sfc(_sfc_main$O, [["render", render$O]]);
const componentName$M = "ICard";
var _sfc_main$N = defineComponent({
  name: componentName$M,
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$M, "color")
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$M, "size"),
      validator: sizePropValidator
    }
  },
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size)
      });
    }
  }
});
const _hoisted_1$z = {
  key: 0,
  class: "card-header"
};
const _hoisted_2$i = {
  key: 1,
  class: "card-body"
};
const _hoisted_3$c = {
  key: 2,
  class: "card-footer"
};
function render$N(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["card", _ctx.classes])
  }, [
    !!_ctx.$slots.header ? (openBlock(), createElementBlock("header", _hoisted_1$z, [
      renderSlot(_ctx.$slots, "header")
    ])) : createCommentVNode("v-if", true),
    renderSlot(_ctx.$slots, "image"),
    !!_ctx.$slots.default ? (openBlock(), createElementBlock("div", _hoisted_2$i, [
      renderSlot(_ctx.$slots, "default")
    ])) : createCommentVNode("v-if", true),
    !!_ctx.$slots.footer ? (openBlock(), createElementBlock("footer", _hoisted_3$c, [
      renderSlot(_ctx.$slots, "footer")
    ])) : createCommentVNode("v-if", true)
  ], 2);
}
var style_scss_vue_type_style_index_0_src_lang$B = "";
var index$G = /* @__PURE__ */ _export_sfc(_sfc_main$N, [["render", render$N]]);
const componentName$L = "ICheckbox";
var _sfc_main$M = defineComponent({
  name: componentName$L,
  mixins: [
    FormComponentMixin
  ],
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$L, "color")
    },
    disabled: {
      type: Boolean,
      default: false
    },
    indeterminate: {
      type: Boolean,
      default: false
    },
    value: {
      default: false
    },
    modelValue: {
      default: false
    },
    name: {
      type: [String, Number],
      default() {
        return uid("checkbox");
      }
    },
    native: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$L, "size"),
      validator: sizePropValidator
    },
    tabindex: {
      type: [Number, String],
      default: 0
    }
  },
  emits: [
    "update:modelValue"
  ],
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size),
        "-disabled": this.isDisabled,
        "-readonly": this.isReadonly,
        "-native": this.native
      });
    },
    checked() {
      if (this.formGroup.checked) {
        return this.formGroup.checked.includes(this.value);
      }
      if (this.schema) {
        return this.schema.value;
      }
      return this.modelValue;
    },
    tabIndex() {
      return this.isDisabled ? -1 : this.tabindex;
    }
  },
  methods: {
    clickInputRef() {
      if (this.isReadonly) {
        return;
      }
      this.$refs.input.click();
    },
    onChange(event) {
      var _a, _b, _c, _d;
      (_b = (_a = this.parent).onInput) == null ? void 0 : _b.call(_a, this.name, event.target.checked);
      (_d = (_c = this.formGroup).onChange) == null ? void 0 : _d.call(_c, this.value);
      this.$emit("update:modelValue", event.target.checked);
    },
    onBlur(event) {
      var _a, _b;
      (_b = (_a = this.parent).onBlur) == null ? void 0 : _b.call(_a, this.name, event);
    }
  }
});
const _hoisted_1$y = ["aria-checked"];
const _hoisted_2$h = ["checked", "name", "disabled", "readonly", ".indeterminate"];
const _hoisted_3$b = ["aria-checked", "aria-disabled", "aria-readonly", "tabindex"];
function render$M(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["checkbox", _ctx.classes]),
    "aria-checked": _ctx.checked ? "true" : "false",
    role: "checkbox"
  }, [
    createBaseVNode("input", {
      ref: "input",
      type: "checkbox",
      checked: _ctx.checked,
      tabindex: "-1",
      name: _ctx.name,
      disabled: _ctx.isDisabled,
      readonly: _ctx.isReadonly,
      ".indeterminate": _ctx.indeterminate,
      "aria-hidden": "true",
      onChange: _cache[0] || (_cache[0] = (...args) => _ctx.onChange && _ctx.onChange(...args))
    }, null, 40, _hoisted_2$h),
    createBaseVNode("label", {
      class: "checkbox-label",
      "aria-checked": _ctx.checked,
      "aria-disabled": _ctx.isDisabled,
      "aria-readonly": _ctx.isReadonly,
      tabindex: _ctx.tabIndex,
      onBlur: _cache[1] || (_cache[1] = (...args) => _ctx.onBlur && _ctx.onBlur(...args)),
      onClick: _cache[2] || (_cache[2] = (...args) => _ctx.clickInputRef && _ctx.clickInputRef(...args)),
      onKeydown: _cache[3] || (_cache[3] = withKeys(withModifiers((...args) => _ctx.clickInputRef && _ctx.clickInputRef(...args), ["stop", "prevent"]), ["space"]))
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 40, _hoisted_3$b)
  ], 10, _hoisted_1$y);
}
var style_scss_vue_type_style_index_0_src_lang$A = "";
var index$F = /* @__PURE__ */ _export_sfc(_sfc_main$M, [["render", render$M]]);
const componentName$K = "ICheckboxGroup";
var _sfc_main$L = defineComponent({
  name: componentName$K,
  mixins: [
    FormComponentMixin
  ],
  provide() {
    return {
      formGroup: this
    };
  },
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$K, "color")
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    indeterminate: {
      type: Boolean,
      default: false
    },
    modelValue: {
      default: () => []
    },
    name: {
      type: [String, Number],
      default() {
        return uid("checkbox-group");
      }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$K, "size"),
      validator: sizePropValidator
    }
  },
  emits: [
    "update:modelValue"
  ],
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size),
        "-disabled": this.isDisabled,
        "-readonly": this.isReadonly,
        "-inline": this.inline
      });
    },
    checked() {
      if (this.schema) {
        return this.schema.value;
      }
      return this.modelValue;
    }
  },
  methods: {
    onChange(value) {
      var _a, _b;
      const modelValue = [...this.modelValue];
      const valueIndex = modelValue.findIndex((v) => v === value);
      if (valueIndex !== -1) {
        modelValue.splice(valueIndex, 1);
      } else {
        modelValue.push(value);
      }
      (_b = (_a = this.parent).onInput) == null ? void 0 : _b.call(_a, this.name, modelValue);
      this.$emit("update:modelValue", modelValue);
    }
  }
});
const _hoisted_1$x = ["name"];
function render$L(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["form-group checkbox-group", _ctx.classes]),
    name: _ctx.name,
    role: "checkboxgroup"
  }, [
    renderSlot(_ctx.$slots, "default", {}, void 0, true)
  ], 10, _hoisted_1$x);
}
var style_scss_vue_type_style_index_0_src_scoped_true_lang$8 = "";
var index$E = /* @__PURE__ */ _export_sfc(_sfc_main$L, [["render", render$L], ["__scopeId", "data-v-63461e47"]]);
const componentName$J = "ICollapsible";
var _sfc_main$K = defineComponent({
  name: componentName$J,
  provide() {
    return {
      collapsible: this
    };
  },
  props: {
    accordion: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: defaultPropValue(componentName$J, "color")
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$J, "size"),
      validator: sizePropValidator
    },
    modelValue: {
      type: Array,
      default: () => []
    }
  },
  emits: [
    "update:modelValue"
  ],
  data() {
    return {
      activeItems: [].concat(this.modelValue)
    };
  },
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size)
      });
    }
  },
  watch: {
    modelValue(value) {
      this.activeItems = [].concat(value);
    }
  },
  methods: {
    onItemClick(item) {
      if (this.accordion) {
        this.activeItems = this.activeItems.indexOf(item.name) > -1 ? [] : [item.name];
        return this.activeItems;
      }
      const index2 = this.activeItems.indexOf(item.name);
      if (index2 > -1) {
        this.activeItems.splice(index2, 1);
      } else {
        this.activeItems.push(item.name);
      }
      this.$emit("update:modelValue", this.activeItems);
    }
  }
});
function render$K(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps({
    class: ["collapsible", _ctx.classes],
    role: "tablist",
    "aria-multiselectable": "true"
  }, _ctx.$attrs), [
    renderSlot(_ctx.$slots, "default")
  ], 16);
}
var style_scss_vue_type_style_index_0_src_lang$z = "";
var index$D = /* @__PURE__ */ _export_sfc(_sfc_main$K, [["render", render$K]]);
var _sfc_main$J = defineComponent({
  name: "IExpandTransition",
  methods: {
    onEnter(element) {
      const width = getStyleProperty(element, "width");
      element.style.width = width;
      element.style.position = "absolute";
      element.style.visibility = "hidden";
      element.style.height = "auto";
      const height = getStyleProperty(element, "height");
      element.style.width = null;
      element.style.position = null;
      element.style.visibility = null;
      element.style.height = 0;
      getStyleProperty(element, "height");
      setTimeout(() => {
        element.style.height = height;
      });
    },
    onAfterEnter(element) {
      element.style.height = "auto";
    },
    onLeave(element) {
      element.style.height = getStyleProperty(element, "height");
      getStyleProperty(element, "height");
      setTimeout(() => {
        element.style.height = 0;
      });
    }
  }
});
function render$J(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, {
    name: "expand",
    onEnter: _ctx.onEnter,
    onAfterEnter: _ctx.onAfterEnter,
    onLeave: _ctx.onLeave
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ]),
    _: 3
  }, 8, ["onEnter", "onAfterEnter", "onLeave"]);
}
var style_scss_vue_type_style_index_0_src_scoped_true_lang$7 = "";
var IExpandTransition = /* @__PURE__ */ _export_sfc(_sfc_main$J, [["render", render$J], ["__scopeId", "data-v-2b76e686"]]);
const componentName$I = "ICollapsibleItem";
var _sfc_main$I = defineComponent({
  name: componentName$I,
  components: {
    IExpandTransition
  },
  inject: {
    collapsible: {
      default: () => ({
        activeItems: []
      })
    }
  },
  props: {
    name: {
      type: String,
      default() {
        return uid("collapsible-item");
      }
    },
    title: {
      type: String,
      default: ""
    }
  },
  computed: {
    active() {
      return this.collapsible.activeItems.indexOf(this.name) > -1;
    },
    classes() {
      return {
        "-active": this.active
      };
    }
  },
  methods: {
    onClick() {
      this.collapsible.onItemClick(this);
    }
  }
});
const _hoisted_1$w = ["name"];
const _hoisted_2$g = ["id", "aria-expanded", "aria-controls", "aria-describedby"];
const _hoisted_3$a = /* @__PURE__ */ createBaseVNode("i", { class: "icon" }, null, -1);
const _hoisted_4$9 = ["id", "aria-hidden", "aria-labelledby"];
const _hoisted_5$8 = { class: "content" };
function render$I(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_i_expand_transition = resolveComponent("i-expand-transition");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["collapsible-item", _ctx.classes]),
    name: _ctx.name
  }, [
    createBaseVNode("a", {
      class: "collapsible-header",
      role: "tab",
      id: `collapsible-item-heading-${_ctx.name}`,
      "aria-expanded": _ctx.active ? "true" : "false",
      "aria-controls": `collapsible-item-content-${_ctx.name}`,
      "aria-describedby": `collapsible-item-content-${_ctx.name}`,
      tabindex: "0",
      onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
    }, [
      renderSlot(_ctx.$slots, "header", {}, () => [
        createTextVNode(toDisplayString(_ctx.title), 1)
      ]),
      _hoisted_3$a
    ], 8, _hoisted_2$g),
    createVNode(_component_i_expand_transition, null, {
      default: withCtx(() => [
        withDirectives(createBaseVNode("div", {
          class: "collapsible-body",
          role: "tabpanel",
          id: `collapsible-item-content-${_ctx.name}`,
          "aria-hidden": _ctx.active ? "false" : "true",
          "aria-labelledby": `collapsible-item-heading-${_ctx.name}`
        }, [
          createBaseVNode("div", _hoisted_5$8, [
            renderSlot(_ctx.$slots, "default")
          ])
        ], 8, _hoisted_4$9), [
          [vShow, _ctx.active]
        ])
      ]),
      _: 3
    })
  ], 10, _hoisted_1$w);
}
var style_scss_vue_type_style_index_0_src_lang$y = "";
var index$C = /* @__PURE__ */ _export_sfc(_sfc_main$I, [["render", render$I]]);
const onClickOutside = (element, binding) => (e) => {
  if (!isVisible(element) || !e.target) {
    return;
  }
  if (element === e.target || element.contains(e.target)) {
    return;
  }
  binding.value(e);
};
const ClickOutsideDirective = {
  beforeMount(element, binding) {
    if (typeof window !== "undefined") {
      on(window.document, "mouseup", onClickOutside(element, binding));
    }
  }
};
const componentName$H = "IDropdown";
var _sfc_main$H = defineComponent({
  name: componentName$H,
  directives: {
    ClickOutside: ClickOutsideDirective
  },
  mixins: [
    PopupMixin,
    PopupControlsMixin
  ],
  provide() {
    return {
      dropdown: this
    };
  },
  props: {
    animationDuration: {
      type: Number,
      default: 300
    },
    color: {
      type: String,
      default: defaultPropValue(componentName$H, "color")
    },
    disabled: {
      type: Boolean,
      default: false
    },
    hideOnItemClick: {
      type: Boolean,
      default: true
    },
    keydownTrigger: {
      type: Array,
      default: () => ["up", "down", "enter", "space", "tab", "esc"]
    },
    keydownItem: {
      type: Array,
      default: () => ["up", "down", "enter", "space", "tab", "esc"]
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    arrow: {
      type: Boolean,
      default: true
    },
    placement: {
      type: String,
      default: "bottom"
    },
    trigger: {
      type: [String, Array],
      default: () => ["click"]
    },
    offset: {
      type: Number,
      default: 6
    },
    popperOptions: {
      type: Object,
      default: () => ({})
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$H, "size"),
      validator: sizePropValidator
    }
  },
  emits: [
    "update:modelValue"
  ],
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size)
      });
    }
  },
  mounted() {
    for (const child of this.$refs.trigger.children) {
      on(child, "keydown", this.onTriggerKeyDown);
    }
    on(this.$refs.popup, "keydown", this.onItemKeyDown);
  },
  beforeUnmount() {
    for (const child of this.$refs.trigger.children) {
      off(child, "keydown", this.onTriggerKeyDown);
    }
    off(this.$refs.popup, "keydown", this.onItemKeyDown);
  },
  methods: {
    onEscape() {
      this.visible = false;
      this.$emit("update:modelValue", false);
    },
    handleClickOutside() {
      this.visible = false;
      this.$emit("update:modelValue", false);
      this.onClickOutside();
    },
    getFocusableItems() {
      const focusableItems = [];
      for (const child of this.$refs.body.children) {
        if (isFocusable(child)) {
          focusableItems.push(child);
        }
      }
      return focusableItems;
    },
    onTriggerKeyDown(event) {
      if (this.keydownTrigger.length === 0) {
        return;
      }
      const focusableItems = this.getFocusableItems();
      const activeIndex = focusableItems.findIndex((item) => item.active);
      const initialIndex = activeIndex > -1 ? activeIndex : 0;
      const focusTarget = focusableItems[initialIndex];
      switch (true) {
        case (isKey("up", event) && this.keydownTrigger.includes("up")):
        case (isKey("down", event) && this.keydownTrigger.includes("down")):
          this.show();
          setTimeout(() => {
            focusTarget.focus();
          }, this.visible ? 0 : this.animationDuration);
          event.preventDefault();
          event.stopPropagation();
          break;
        case (isKey("enter", event) && this.keydownTrigger.includes("enter")):
        case (isKey("space", event) && this.keydownTrigger.includes("space")):
          this.onClick();
          if (!this.visible) {
            setTimeout(() => {
              focusTarget.focus();
            }, this.animationDuration);
          }
          event.preventDefault();
          break;
        case (isKey("tab", event) && this.keydownTrigger.includes("tab")):
        case (isKey("esc", event) && this.keydownTrigger.includes("esc")):
          this.hide();
          break;
      }
    },
    onItemKeyDown(event) {
      if (this.keydownItem.length === 0) {
        return;
      }
      switch (true) {
        case (isKey("up", event) && this.keydownItem.includes("up")):
        case (isKey("down", event) && this.keydownItem.includes("down")):
          const focusableItems = this.getFocusableItems();
          const currentIndex = focusableItems.findIndex((item) => item === event.target);
          const maxIndex = focusableItems.length - 1;
          let nextIndex;
          if (isKey("up", event)) {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
          } else {
            nextIndex = currentIndex < maxIndex ? currentIndex + 1 : maxIndex;
          }
          focusableItems[nextIndex].focus();
          event.preventDefault();
          event.stopPropagation();
          break;
        case (isKey("enter", event) && this.keydownItem.includes("enter")):
        case (isKey("space", event) && this.keydownItem.includes("space")):
          event.target.click();
          if (this.hideOnItemClick) {
            this.hide();
          }
          this.focusTrigger();
          event.preventDefault();
          break;
        case (isKey("tab", event) && this.keydownItem.includes("tab")):
        case (isKey("esc", event) && this.keydownItem.includes("esc")):
          this.hide();
          this.focusTrigger();
          event.preventDefault();
          break;
      }
    },
    onItemClick() {
      if (this.hideOnItemClick) {
        this.hide();
      }
    }
  }
});
const _hoisted_1$v = {
  class: "dropdown-trigger",
  ref: "trigger"
};
const _hoisted_2$f = ["aria-hidden"];
const _hoisted_3$9 = {
  key: 0,
  "data-popper-arrow": ""
};
const _hoisted_4$8 = {
  key: 1,
  class: "dropdown-header"
};
const _hoisted_5$7 = {
  key: 2,
  class: "dropdown-body",
  ref: "body"
};
const _hoisted_6$7 = {
  key: 3,
  class: "dropdown-footer"
};
function render$H(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_click_outside = resolveDirective("click-outside");
  return withDirectives((openBlock(), createElementBlock("div", {
    class: "dropdown-wrapper",
    ref: "wrapper",
    "aria-haspopup": "true",
    onKeyup: _cache[0] || (_cache[0] = withKeys((...args) => _ctx.onEscape && _ctx.onEscape(...args), ["esc"]))
  }, [
    createBaseVNode("div", _hoisted_1$v, [
      renderSlot(_ctx.$slots, "default")
    ], 512),
    createVNode(Transition, {
      name: "zoom-in-top-transition",
      onAfterLeave: _ctx.destroyPopper
    }, {
      default: withCtx(() => [
        withDirectives(createBaseVNode("div", {
          class: normalizeClass(["dropdown", _ctx.classes]),
          role: "menu",
          ref: "popup",
          "aria-hidden": _ctx.visible ? "false" : "true"
        }, [
          _ctx.arrow ? (openBlock(), createElementBlock("span", _hoisted_3$9)) : createCommentVNode("v-if", true),
          _ctx.$slots.header ? (openBlock(), createElementBlock("div", _hoisted_4$8, [
            renderSlot(_ctx.$slots, "header")
          ])) : createCommentVNode("v-if", true),
          _ctx.$slots.body ? (openBlock(), createElementBlock("div", _hoisted_5$7, [
            renderSlot(_ctx.$slots, "body")
          ], 512)) : createCommentVNode("v-if", true),
          _ctx.$slots.footer ? (openBlock(), createElementBlock("div", _hoisted_6$7, [
            renderSlot(_ctx.$slots, "footer")
          ])) : createCommentVNode("v-if", true)
        ], 10, _hoisted_2$f), [
          [vShow, _ctx.visible]
        ])
      ]),
      _: 3
    }, 8, ["onAfterLeave"])
  ], 32)), [
    [_directive_click_outside, _ctx.onClickOutside]
  ]);
}
var style_scss_vue_type_style_index_0_src_lang$x = "";
var index$B = /* @__PURE__ */ _export_sfc(_sfc_main$H, [["render", render$H]]);
const componentName$G = "IDropdownDivider";
var _sfc_main$G = defineComponent({
  name: componentName$G
});
const _hoisted_1$u = {
  class: "dropdown-divider",
  role: "separator"
};
function render$G(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$u);
}
var style_scss_vue_type_style_index_0_src_lang$w = "";
var index$A = /* @__PURE__ */ _export_sfc(_sfc_main$G, [["render", render$G]]);
const componentName$F = "IDropdownItem";
var _sfc_main$F = defineComponent({
  name: componentName$F,
  mixins: [
    LinkableMixin
  ],
  inject: {
    dropdown: {
      default: () => ({})
    }
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    plaintext: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: "div"
    },
    tabindex: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    classes() {
      return {
        "-active": this.active,
        "-disabled": this.disabled,
        "-plaintext": this.plaintext
      };
    },
    role() {
      return this.$attrs.to || this.$attrs.href ? "link" : "menuitem";
    },
    tabIndex() {
      return this.disabled ? -1 : this.tabindex;
    }
  },
  methods: {
    onClick(event) {
      var _a, _b;
      (_b = (_a = this.dropdown).onItemClick) == null ? void 0 : _b.call(_a, this, event);
    }
  }
});
function render$F(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(resolveDynamicComponent(_ctx.isTag), mergeProps(_ctx.$attrs, {
    class: ["dropdown-item", _ctx.classes],
    role: _ctx.role,
    tag: _ctx.tag,
    tabindex: _ctx.tabIndex,
    disabled: _ctx.disabled,
    "aria-disabled": _ctx.disabled,
    "aria-pressed": _ctx.active,
    onClick: _ctx.onClick
  }), {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3
  }, 16, ["class", "role", "tag", "tabindex", "disabled", "aria-disabled", "aria-pressed", "onClick"]);
}
var style_scss_vue_type_style_index_0_src_lang$v = "";
var index$z = /* @__PURE__ */ _export_sfc(_sfc_main$F, [["render", render$F]]);
const componentName$E = "IForm";
var _sfc_main$E = defineComponent({
  name: componentName$E,
  mixins: [
    FormComponentMixin
  ],
  provide() {
    return {
      form: this
    };
  },
  inheritAttrs: false,
  props: {
    color: {
      type: String,
      default: ""
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    loading: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default() {
        return uid("form");
      }
    },
    modelValue: {
      type: Object,
      default: () => null
    },
    readonly: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$E, "size"),
      validator: sizePropValidator
    }
  },
  emits: [
    "update:modelValue",
    "submit"
  ],
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size),
        "-disabled": this.isDisabled,
        "-readonly": this.isReadonly,
        "-inline": this.inline
      });
    },
    schema() {
      if (this.modelValue) {
        return this.modelValue;
      }
      return getValueByPath(this.formGroup.schema || this.form.schema || {}, this.name);
    }
  },
  methods: {
    onBlur(name, event) {
      var _a, _b;
      (_b = (_a = this.parent).onBlur) == null ? void 0 : _b.call(_a, this.name ? `${this.name}.${name}` : name, event);
      if (this.modelValue) {
        let schema = clone(this.modelValue);
        schema = setValuesAlongPath(schema, name, { untouched: false, touched: true });
        if (this.shouldValidate(name, "blur")) {
          schema = validate(schema);
        }
        this.$emit("update:modelValue", schema);
      }
    },
    onInput(name, value) {
      var _a, _b;
      (_b = (_a = this.parent).onInput) == null ? void 0 : _b.call(_a, this.name ? `${this.name}.${name}` : name, value);
      if (this.modelValue) {
        let schema = this.modelValue;
        schema = setValueByPath(schema, name, "value", value);
        schema = setValuesAlongPath(schema, name, { pristine: false, dirty: true });
        if (this.shouldValidate(name, "input")) {
          schema = validate(schema);
        }
        this.$emit("update:modelValue", schema);
      }
    },
    onSubmit(event) {
      event.preventDefault();
      if (this.modelValue) {
        let schema = clone(this.modelValue);
        schema = validate(schema);
        this.$emit("update:modelValue", schema);
        if (schema.invalid) {
          return;
        }
      }
      this.$emit("submit", event);
    },
    shouldValidate(path, eventName) {
      const targetSchema = getValueByPath(this.modelValue, path);
      const events = targetSchema.validateOn ? [].concat(targetSchema.validateOn) : this.$inkline.options.validateOn;
      return events.includes(eventName);
    }
  }
});
const _hoisted_1$t = ["name", "readonly", "disabled"];
function render$E(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("form", {
    class: normalizeClass(["form", _ctx.classes]),
    role: "form",
    name: _ctx.name,
    readonly: _ctx.isReadonly,
    disabled: _ctx.isDisabled,
    onSubmit: _cache[0] || (_cache[0] = (...args) => _ctx.onSubmit && _ctx.onSubmit(...args))
  }, [
    renderSlot(_ctx.$slots, "default", {}, void 0, true)
  ], 42, _hoisted_1$t);
}
var style_scss_vue_type_style_index_0_src_scoped_true_lang$6 = "";
var style_scss_vue_type_style_index_1_src_scoped_true_lang = "";
var index$y = /* @__PURE__ */ _export_sfc(_sfc_main$E, [["render", render$E], ["__scopeId", "data-v-65e36f52"]]);
const componentName$D = "IFormGroup";
var _sfc_main$D = defineComponent({
  name: componentName$D,
  mixins: [
    FormComponentMixin
  ],
  provide() {
    return {
      formGroup: this
    };
  },
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$D, "color")
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default: ""
    },
    readonly: {
      type: Boolean,
      default: false
    },
    required: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$D, "size"),
      validator: sizePropValidator
    }
  },
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size),
        "-disabled": this.isDisabled,
        "-readonly": this.isReadonly,
        "-inline": this.inline,
        "-required": this.required
      });
    }
  },
  methods: {
    onBlur(name, event) {
      var _a, _b;
      (_b = (_a = this.parent) == null ? void 0 : _a.onBlur) == null ? void 0 : _b.call(_a, this.name ? `${this.name}.${name}` : name, event);
    },
    onInput(name, value) {
      var _a, _b;
      (_b = (_a = this.parent) == null ? void 0 : _a.onInput) == null ? void 0 : _b.call(_a, this.name ? `${this.name}.${name}` : name, value);
    }
  }
});
const _hoisted_1$s = ["name"];
function render$D(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("fieldset", {
    class: normalizeClass(["form-group", _ctx.classes]),
    name: _ctx.name,
    role: "group"
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 10, _hoisted_1$s);
}
var style_scss_vue_type_style_index_0_src_lang$u = "";
var index$x = /* @__PURE__ */ _export_sfc(_sfc_main$D, [["render", render$D]]);
const componentName$C = "IFormError";
var _sfc_main$C = defineComponent({
  name: componentName$C,
  inject: {
    formGroup: {
      default: () => ({})
    },
    form: {
      default: () => ({})
    }
  },
  props: {
    for: {
      type: String,
      default: ""
    },
    visible: {
      type: [Array, String],
      default: () => ["touched", "dirty", "invalid"]
    }
  },
  computed: {
    parent() {
      if (this.formGroup.$) {
        return this.formGroup;
      }
      return this.form;
    },
    schema() {
      if (this.for !== "") {
        return getValueByPath(this.parent.schema || {}, `${this.for}`);
      }
      return this.parent.schema || {};
    },
    errors() {
      return this.schema.errors || [];
    },
    isVisible() {
      let visible = true;
      if (this.schema && this.visible) {
        [].concat(this.visible).forEach((status) => {
          visible = visible && this.schema[status];
        });
      }
      return visible;
    }
  }
});
const _hoisted_1$r = {
  key: 0,
  class: "form-error",
  "aria-live": "polite"
};
function render$C(_ctx, _cache, $props, $setup, $data, $options) {
  return _ctx.schema ? withDirectives((openBlock(), createBlock(Transition, {
    key: 0,
    name: "fade-in-transition"
  }, {
    default: withCtx(() => [
      _ctx.errors.length > 0 ? (openBlock(), createElementBlock("ul", _hoisted_1$r, [
        (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.errors, (error) => {
          return openBlock(), createElementBlock("li", null, toDisplayString(error.message), 1);
        }), 256))
      ])) : createCommentVNode("v-if", true)
    ]),
    _: 1
  }, 512)), [
    [vShow, _ctx.isVisible]
  ]) : createCommentVNode("v-if", true);
}
var style_scss_vue_type_style_index_0_src_lang$t = "";
var index$w = /* @__PURE__ */ _export_sfc(_sfc_main$C, [["render", render$C]]);
const componentName$B = "IFormLabel";
var _sfc_main$B = defineComponent({
  name: componentName$B,
  mixins: [
    FormComponentMixin
  ],
  props: {
    for: {
      type: String,
      default: ""
    },
    placement: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$B, "size"),
      validator: sizePropValidator
    }
  },
  computed: {
    classes() {
      return {
        [`-${this.size}`]: Boolean(this.size),
        [`-${this.placement}`]: Boolean(this.placement)
      };
    },
    forAttr() {
      return this.for;
    }
  },
  methods: {
    getNextSibling() {
      return this.$el.nextSibling.querySelector("input, textarea");
    },
    onClick() {
      var _a;
      if (this.for) {
        return;
      }
      (_a = this.getNextSibling()) == null ? void 0 : _a.focus();
    }
  }
});
const _hoisted_1$q = ["for"];
function render$B(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("label", mergeProps({
    class: ["form-label", _ctx.classes],
    for: _ctx.forAttr
  }, _ctx.$attrs, {
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
  }), [
    renderSlot(_ctx.$slots, "default")
  ], 16, _hoisted_1$q);
}
var style_scss_vue_type_style_index_0_src_lang$s = "";
var index$v = /* @__PURE__ */ _export_sfc(_sfc_main$B, [["render", render$B]]);
const componentName$A = "IHamburgerMenu";
var _sfc_main$A = defineComponent({
  name: componentName$A,
  props: {
    animation: {
      type: String,
      default: "close"
    },
    color: {
      type: String,
      default: defaultPropValue(componentName$A, "color")
    },
    modelValue: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "update:modelValue"
  ],
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        "-active": this.modelValue,
        [`-${this.animation}`]: true
      });
    }
  },
  methods: {
    onClick() {
      this.$emit("update:modelValue", !this.modelValue);
    }
  }
});
const _hoisted_1$p = /* @__PURE__ */ createBaseVNode("span", { class: "hamburger-menu-bars" }, null, -1);
const _hoisted_2$e = [
  _hoisted_1$p
];
function render$A(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["hamburger-menu", _ctx.classes]),
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
  }, _hoisted_2$e, 2);
}
var style_scss_vue_type_style_index_0_src_lang$r = "";
var IHamburgerMenu = /* @__PURE__ */ _export_sfc(_sfc_main$A, [["render", render$A]]);
const properties = {};
for (const breakpoint of breakpointKeys) {
  for (const property of ["start", "center", "end", "top", "middle", "bottom", "around", "between", "reverse"]) {
    properties[`${property}${capitalizeFirst(breakpoint)}`] = {
      type: Boolean,
      default: false
    };
  }
}
const componentName$z = "IRow";
var _sfc_main$z = defineComponent({
  name: componentName$z,
  props: __spreadValues({
    noGutter: {
      type: Boolean,
      default: false
    },
    noCollapse: {
      type: Boolean,
      default: false
    }
  }, properties),
  computed: {
    classes() {
      const responsiveClasses = Object.keys(properties).reduce((acc, property) => {
        if (this[property]) {
          acc[breakpointClass(`-${property}`, this[property])] = true;
        }
        return acc;
      }, {});
      return __spreadValues({
        "-no-gutter": this.noGutter,
        "-no-collapse": this.noCollapse
      }, responsiveClasses);
    }
  }
});
function render$z(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["row", _ctx.classes])
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var style_scss_vue_type_style_index_0_src_lang$q = "";
var IRow = /* @__PURE__ */ _export_sfc(_sfc_main$z, [["render", render$z]]);
const componentName$y = "IHeader";
var _sfc_main$y = defineComponent({
  name: componentName$y,
  components: {
    IContainer,
    IRow,
    IColumn
  },
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$y, "color")
    },
    cover: {
      type: Boolean,
      default: false
    },
    fluid: {
      type: Boolean,
      default: false
    },
    fullscreen: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$y, "size"),
      validator: sizePropValidator
    }
  },
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size),
        "-cover": this.cover,
        "-fullscreen": this.fullscreen
      });
    }
  }
});
function render$y(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_i_column = resolveComponent("i-column");
  const _component_i_row = resolveComponent("i-row");
  const _component_i_container = resolveComponent("i-container");
  return openBlock(), createElementBlock("header", {
    class: normalizeClass(["header", _ctx.classes])
  }, [
    createVNode(_component_i_container, { fluid: _ctx.fluid }, {
      default: withCtx(() => [
        createVNode(_component_i_row, null, {
          default: withCtx(() => [
            createVNode(_component_i_column, null, {
              default: withCtx(() => [
                renderSlot(_ctx.$slots, "default")
              ]),
              _: 3
            })
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 8, ["fluid"])
  ], 2);
}
var style_scss_vue_type_style_index_0_src_lang$p = "";
var index$u = /* @__PURE__ */ _export_sfc(_sfc_main$y, [["render", render$y]]);
const componentName$x = "IIcon";
var _sfc_main$x = defineComponent({
  name: componentName$x,
  props: {
    name: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$x, "size"),
      validator: sizePropValidator
    }
  },
  setup(props) {
    const icons = inject("inklineIcons");
    const iconName = computed(() => toCamelCase(props.name));
    const icon = computed(() => icons[iconName.value]);
    const classes = computed(() => ({
      "inkline-icon": true,
      [`-${props.size}`]: Boolean(props.size)
    }));
    onMounted(() => {
      if (iconName.value && !icons[iconName.value]) {
        console.error(`The icon ${iconName.value} is not registered.`);
      }
    });
    return () => {
      var _a, _b;
      return h("svg", __spreadValues({
        class: classes.value
      }, (_a = icon.value) == null ? void 0 : _a.attributes), renderSvg(((_b = icon.value) == null ? void 0 : _b.children) || []));
    };
  }
});
function render$x(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_icon = resolveComponent("icon");
  return openBlock(), createBlock(_component_icon, mergeProps({ size: _ctx.size }, _ctx.$attrs), null, 16, ["size"]);
}
var style_scss_vue_type_style_index_0_src_lang$o = "";
var IIcon = /* @__PURE__ */ _export_sfc(_sfc_main$x, [["render", render$x]]);
const componentName$w = "IInput";
var _sfc_main$w = defineComponent({
  name: componentName$w,
  mixins: [
    FormComponentMixin
  ],
  inheritAttrs: false,
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$w, "color")
    },
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    error: {
      type: [Array, Boolean],
      default: () => ["touched", "dirty", "invalid"]
    },
    id: {
      type: String,
      default: void 0
    },
    modelValue: {
      type: [String, Number],
      default: ""
    },
    name: {
      type: [String, Number],
      default() {
        return uid("input");
      }
    },
    plaintext: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$w, "size"),
      validator: sizePropValidator
    },
    tabindex: {
      type: [Number, String],
      default: 0
    },
    type: {
      type: String,
      default: "text"
    },
    clearAriaLabel: {
      type: String,
      default: "Clear"
    }
  },
  emits: [
    "update:modelValue",
    "clear"
  ],
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size),
        "-disabled": this.isDisabled,
        "-error": this.hasError,
        "-readonly": this.isReadonly,
        "-prefixed": Boolean(this.$slots.prefix),
        "-suffixed": Boolean(this.$slots.suffix),
        "-prepended": Boolean(this.$slots.prepend),
        "-appended": Boolean(this.$slots.append)
      });
    },
    hasError() {
      if (typeof this.error === "boolean") {
        return this.error;
      } else if (this.schema && this.error) {
        let visible = true;
        [].concat(this.error).forEach((status) => {
          visible = visible && this.schema[status];
        });
        return visible;
      }
      return false;
    },
    tabIndex() {
      return this.isDisabled ? -1 : this.tabindex;
    },
    isClearable() {
      return this.clearable && !this.isDisabled && !this.isReadonly && this.value !== "";
    },
    value() {
      if (this.schema) {
        return this.schema.value;
      }
      return this.modelValue;
    }
  },
  methods: {
    onBlur(event) {
      var _a, _b;
      (_b = (_a = this.parent).onBlur) == null ? void 0 : _b.call(_a, this.name, event);
    },
    onInput(event) {
      var _a, _b;
      (_b = (_a = this.parent).onInput) == null ? void 0 : _b.call(_a, this.name, event.target.value);
      this.$emit("update:modelValue", event.target.value);
    },
    onClear(event) {
      this.$emit("update:modelValue", "");
      this.$emit("clear", event);
    },
    focus() {
      this.$refs.input.focus();
    }
  }
});
const _hoisted_1$o = {
  key: 0,
  class: "input-prepend"
};
const _hoisted_2$d = { class: "input" };
const _hoisted_3$8 = {
  key: 0,
  class: "input-prefix"
};
const _hoisted_4$7 = ["value", "name", "id", "type", "tabindex", "disabled", "aria-disabled", "readonly", "aria-readonly"];
const _hoisted_5$6 = {
  key: 1,
  class: "input-suffix"
};
const _hoisted_6$6 = ["aria-label", "aria-hidden"];
const _hoisted_7$5 = {
  key: 1,
  class: "input-append"
};
function render$w(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["input-wrapper", _ctx.classes])
  }, [
    _ctx.$slots.prepend ? (openBlock(), createElementBlock("div", _hoisted_1$o, [
      renderSlot(_ctx.$slots, "prepend")
    ])) : createCommentVNode("v-if", true),
    createBaseVNode("div", _hoisted_2$d, [
      _ctx.$slots.prefix ? (openBlock(), createElementBlock("span", _hoisted_3$8, [
        renderSlot(_ctx.$slots, "prefix")
      ])) : createCommentVNode("v-if", true),
      createBaseVNode("input", mergeProps(_ctx.$attrs, {
        value: _ctx.value,
        ref: "input",
        name: _ctx.name,
        id: _ctx.id,
        type: _ctx.type,
        tabindex: _ctx.tabIndex,
        disabled: _ctx.isDisabled,
        "aria-disabled": _ctx.isDisabled ? "true" : false,
        readonly: _ctx.isReadonly || _ctx.plaintext,
        "aria-readonly": _ctx.isReadonly || _ctx.plaintext ? "true" : false,
        onInput: _cache[0] || (_cache[0] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
        onBlur: _cache[1] || (_cache[1] = (...args) => _ctx.onBlur && _ctx.onBlur(...args))
      }), null, 16, _hoisted_4$7),
      _ctx.$slots.suffix || _ctx.clearable && _ctx.isClearable ? (openBlock(), createElementBlock("span", _hoisted_5$6, [
        renderSlot(_ctx.$slots, "clearable", { clear: _ctx.onClear }, () => [
          _ctx.clearable ? withDirectives((openBlock(), createElementBlock("i", {
            key: 0,
            class: "input-clear",
            role: "button",
            "aria-label": _ctx.clearAriaLabel,
            "aria-hidden": _ctx.isClearable ? "false" : "true",
            onClick: _cache[2] || (_cache[2] = (...args) => _ctx.onClear && _ctx.onClear(...args))
          }, null, 8, _hoisted_6$6)), [
            [vShow, _ctx.isClearable]
          ]) : createCommentVNode("v-if", true)
        ]),
        renderSlot(_ctx.$slots, "suffix")
      ])) : createCommentVNode("v-if", true)
    ]),
    _ctx.$slots.append ? (openBlock(), createElementBlock("div", _hoisted_7$5, [
      renderSlot(_ctx.$slots, "append")
    ])) : createCommentVNode("v-if", true)
  ], 2);
}
var style_scss_vue_type_style_index_0_src_lang$n = "";
var IInput = /* @__PURE__ */ _export_sfc(_sfc_main$w, [["render", render$w]]);
const componentName$v = "INumberInput";
var _sfc_main$v = defineComponent({
  name: componentName$v,
  components: {
    IButton
  },
  extends: IInput,
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$v, "color")
    },
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ""
    },
    modelValue: {
      type: [String, Number],
      default: ""
    },
    name: {
      type: [String, Number],
      default() {
        return uid("input");
      }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$v, "size"),
      validator: sizePropValidator
    },
    tabindex: {
      type: [Number, String],
      default: 0
    },
    min: {
      type: [Number, String],
      default: -Infinity
    },
    max: {
      type: [Number, String],
      default: Infinity
    },
    precision: {
      type: Number,
      default: 0
    },
    step: {
      type: Number,
      default: 1
    }
  },
  emits: [
    "update:modelValue"
  ],
  watch: {
    modelValue: {
      immediate: true,
      handler(value) {
        var _a, _b;
        let newValue = (value || "").toString().replace(/^[^0-9-]/, "").replace(/^(-)[^0-9]/, "$1").replace(new RegExp(`^(-?[0-9]+)[^0-9${this.precision > 0 ? "." : ""}]`), "$1");
        if (this.precision > 0) {
          newValue = newValue.replace(/^(-?[0-9]+\.)[^0-9]/, "$1").replace(new RegExp(`^(-?[0-9]+\\.[0-9]{0,${this.precision}}).*`), "$1");
        }
        if (parseFloat(newValue) >= parseFloat(this.max))
          newValue = this.max.toString();
        if (parseFloat(newValue) <= parseFloat(this.min))
          newValue = this.min.toString();
        (_b = (_a = this.parent).onInput) == null ? void 0 : _b.call(_a, this.name, newValue);
        this.$emit("update:modelValue", newValue);
      }
    }
  },
  methods: {
    decrease() {
      this.$emit("update:modelValue", this.formatPrecision((Number(this.modelValue) - this.step).toString()));
    },
    increase() {
      this.$emit("update:modelValue", this.formatPrecision((Number(this.modelValue) + this.step).toString()));
    },
    formatPrecision(value) {
      const parts = value.split(".");
      let decimals = parts[1] || "";
      for (let i = decimals.length; i < this.precision; i += 1) {
        decimals += "0";
      }
      return this.precision > 0 ? `${parts[0]}.${decimals}` : parts[0];
    },
    onBlurFormatPrecision(event) {
      var _a, _b;
      this.$emit("update:modelValue", this.formatPrecision(Number(this.modelValue).toString()));
      (_b = (_a = this.parent).onBlur) == null ? void 0 : _b.call(_a, this.name, event);
    }
  }
});
const _hoisted_1$n = { class: "input-prepend" };
const _hoisted_2$c = /* @__PURE__ */ createTextVNode(" - ");
const _hoisted_3$7 = { class: "input" };
const _hoisted_4$6 = {
  key: 0,
  class: "input-prefix"
};
const _hoisted_5$5 = ["value", "name", "id", "tabindex", "disabled", "aria-disabled", "readonly", "aria-readonly"];
const _hoisted_6$5 = {
  key: 1,
  class: "input-suffix"
};
const _hoisted_7$4 = ["aria-label", "aria-hidden"];
const _hoisted_8$1 = { class: "input-append" };
const _hoisted_9 = /* @__PURE__ */ createTextVNode(" + ");
function render$v(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_i_button = resolveComponent("i-button");
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["input-wrapper -prepended -appended", _ctx.classes])
  }, [
    createBaseVNode("div", _hoisted_1$n, [
      renderSlot(_ctx.$slots, "prepend"),
      createVNode(_component_i_button, {
        type: "button",
        color: _ctx.color,
        size: _ctx.size,
        disabled: _ctx.disabled,
        class: "input-button-decrease",
        onClick: _ctx.decrease
      }, {
        default: withCtx(() => [
          _hoisted_2$c
        ]),
        _: 1
      }, 8, ["color", "size", "disabled", "onClick"])
    ]),
    createBaseVNode("div", _hoisted_3$7, [
      _ctx.$slots.prefix ? (openBlock(), createElementBlock("span", _hoisted_4$6, [
        renderSlot(_ctx.$slots, "prefix")
      ])) : createCommentVNode("v-if", true),
      createBaseVNode("input", mergeProps(_ctx.$attrs, {
        value: _ctx.value,
        ref: "input",
        name: _ctx.name,
        id: _ctx.id,
        type: "text",
        tabindex: _ctx.tabIndex,
        disabled: _ctx.isDisabled,
        "aria-disabled": _ctx.isDisabled ? "true" : false,
        readonly: _ctx.isReadonly,
        "aria-readonly": _ctx.isReadonly ? "true" : false,
        onInput: _cache[0] || (_cache[0] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
        onBlur: _cache[1] || (_cache[1] = (...args) => _ctx.onBlur && _ctx.onBlur(...args))
      }), null, 16, _hoisted_5$5),
      _ctx.$slots.suffix || _ctx.clearable && _ctx.isClearable ? (openBlock(), createElementBlock("span", _hoisted_6$5, [
        renderSlot(_ctx.$slots, "clearable", { clear: _ctx.onClear }, () => [
          _ctx.clearable ? withDirectives((openBlock(), createElementBlock("i", {
            key: 0,
            class: "input-clear",
            role: "button",
            "aria-label": _ctx.clearAriaLabel,
            "aria-hidden": _ctx.isClearable ? "false" : "true",
            onClick: _cache[2] || (_cache[2] = (...args) => _ctx.onClear && _ctx.onClear(...args))
          }, null, 8, _hoisted_7$4)), [
            [vShow, _ctx.isClearable]
          ]) : createCommentVNode("v-if", true)
        ]),
        renderSlot(_ctx.$slots, "suffix")
      ])) : createCommentVNode("v-if", true)
    ]),
    createBaseVNode("div", _hoisted_8$1, [
      createVNode(_component_i_button, {
        type: "button",
        color: _ctx.color,
        size: _ctx.size,
        disabled: _ctx.disabled,
        class: "input-button-increase",
        onClick: _ctx.increase
      }, {
        default: withCtx(() => [
          _hoisted_9
        ]),
        _: 1
      }, 8, ["color", "size", "disabled", "onClick"]),
      renderSlot(_ctx.$slots, "append")
    ])
  ], 2);
}
var index$t = /* @__PURE__ */ _export_sfc(_sfc_main$v, [["render", render$v]]);
const componentName$u = "ITextarea";
var _sfc_main$u = defineComponent({
  name: componentName$u,
  extends: IInput,
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$u, "color")
    },
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    id: {
      type: String,
      default: ""
    },
    modelValue: {
      type: String,
      default: ""
    },
    name: {
      type: [String, Number],
      default() {
        return uid("textarea");
      }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$u, "size"),
      validator: sizePropValidator
    },
    tabindex: {
      type: [Number, String],
      default: 0
    }
  },
  emits: [
    "update:modelValue"
  ]
});
const _hoisted_1$m = {
  key: 0,
  class: "input-prepend"
};
const _hoisted_2$b = { class: "input" };
const _hoisted_3$6 = {
  key: 0,
  class: "input-prefix"
};
const _hoisted_4$5 = ["value", "name", "id", "tabindex", "disabled", "aria-disabled", "readonly", "aria-readonly"];
const _hoisted_5$4 = {
  key: 1,
  class: "input-suffix"
};
const _hoisted_6$4 = {
  key: 1,
  class: "input-append"
};
function render$u(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["input-wrapper", _ctx.classes])
  }, [
    _ctx.$slots.prepend ? (openBlock(), createElementBlock("div", _hoisted_1$m, [
      renderSlot(_ctx.$slots, "prepend")
    ])) : createCommentVNode("v-if", true),
    createBaseVNode("div", _hoisted_2$b, [
      _ctx.$slots.prefix ? (openBlock(), createElementBlock("span", _hoisted_3$6, [
        renderSlot(_ctx.$slots, "prefix")
      ])) : createCommentVNode("v-if", true),
      createBaseVNode("textarea", mergeProps(_ctx.$attrs, {
        value: _ctx.value,
        ref: "input",
        role: "textbox",
        name: _ctx.name,
        id: _ctx.id,
        tabindex: _ctx.tabIndex,
        disabled: _ctx.isDisabled,
        "aria-disabled": _ctx.isDisabled ? "true" : false,
        readonly: _ctx.isReadonly,
        "aria-readonly": _ctx.isReadonly ? "true" : false,
        "aria-multiline": "true",
        onInput: _cache[0] || (_cache[0] = (...args) => _ctx.onInput && _ctx.onInput(...args)),
        onBlur: _cache[1] || (_cache[1] = (...args) => _ctx.onBlur && _ctx.onBlur(...args))
      }), null, 16, _hoisted_4$5),
      _ctx.$slots.suffix || _ctx.clearable && _ctx.isClearable ? (openBlock(), createElementBlock("span", _hoisted_5$4, [
        renderSlot(_ctx.$slots, "clearable", { clear: _ctx.onClear }, () => [
          withDirectives(createBaseVNode("i", {
            class: "input-clear",
            "aria-label": "Clear",
            onClick: _cache[2] || (_cache[2] = (...args) => _ctx.onClear && _ctx.onClear(...args))
          }, null, 512), [
            [vShow, _ctx.isClearable]
          ])
        ]),
        renderSlot(_ctx.$slots, "suffix")
      ])) : createCommentVNode("v-if", true)
    ]),
    _ctx.$slots.append ? (openBlock(), createElementBlock("div", _hoisted_6$4, [
      renderSlot(_ctx.$slots, "append")
    ])) : createCommentVNode("v-if", true)
  ], 2);
}
var index$s = /* @__PURE__ */ _export_sfc(_sfc_main$u, [["render", render$u]]);
const componentName$t = "ILayout";
var _sfc_main$t = defineComponent({
  name: componentName$t,
  props: {
    vertical: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      return { "-vertical": this.vertical };
    }
  }
});
function render$t(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("main", {
    class: normalizeClass(["layout", _ctx.classes])
  }, [
    renderSlot(_ctx.$slots, "default", {}, void 0, true)
  ], 2);
}
var style_scss_vue_type_style_index_0_src_scoped_true_lang$5 = "";
var index$r = /* @__PURE__ */ _export_sfc(_sfc_main$t, [["render", render$t], ["__scopeId", "data-v-e54ee446"]]);
const componentName$s = "ILayoutAside";
var _sfc_main$s = defineComponent({
  name: componentName$s
});
const _hoisted_1$l = { class: "layout-aside" };
const _hoisted_2$a = { class: "layout-aside-children" };
function render$s(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("aside", _hoisted_1$l, [
    createBaseVNode("div", _hoisted_2$a, [
      renderSlot(_ctx.$slots, "default", {}, void 0, true)
    ])
  ]);
}
var style_scss_vue_type_style_index_0_src_scoped_true_lang$4 = "";
var index$q = /* @__PURE__ */ _export_sfc(_sfc_main$s, [["render", render$s], ["__scopeId", "data-v-7f70120e"]]);
const componentName$r = "ILayoutContent";
var _sfc_main$r = defineComponent({
  name: componentName$r
});
const _hoisted_1$k = { class: "layout-content" };
function render$r(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("section", _hoisted_1$k, [
    renderSlot(_ctx.$slots, "default", {}, void 0, true)
  ]);
}
var style_scss_vue_type_style_index_0_src_scoped_true_lang$3 = "";
var index$p = /* @__PURE__ */ _export_sfc(_sfc_main$r, [["render", render$r], ["__scopeId", "data-v-199dc92d"]]);
const componentName$q = "ILayoutFooter";
var _sfc_main$q = defineComponent({
  name: componentName$q
});
const _hoisted_1$j = { class: "layout-footer" };
function render$q(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("footer", _hoisted_1$j, [
    renderSlot(_ctx.$slots, "default", {}, void 0, true)
  ]);
}
var style_scss_vue_type_style_index_0_src_scoped_true_lang$2 = "";
var index$o = /* @__PURE__ */ _export_sfc(_sfc_main$q, [["render", render$q], ["__scopeId", "data-v-cbbb0aba"]]);
const componentName$p = "ILayoutHeader";
var _sfc_main$p = defineComponent({
  name: componentName$p
});
const _hoisted_1$i = { class: "layout-header" };
function render$p(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("header", _hoisted_1$i, [
    renderSlot(_ctx.$slots, "default", {}, void 0, true)
  ]);
}
var style_scss_vue_type_style_index_0_src_scoped_true_lang$1 = "";
var index$n = /* @__PURE__ */ _export_sfc(_sfc_main$p, [["render", render$p], ["__scopeId", "data-v-dbdcc31e"]]);
const componentName$o = "IListGroup";
var _sfc_main$o = defineComponent({
  name: componentName$o,
  props: {
    border: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: defaultPropValue(componentName$o, "color")
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$o, "size"),
      validator: sizePropValidator
    }
  },
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size),
        "-border": this.border
      });
    }
  }
});
function render$o(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["list-group", _ctx.classes]),
    role: "list"
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var style_scss_vue_type_style_index_0_src_lang$m = "";
var index$m = /* @__PURE__ */ _export_sfc(_sfc_main$o, [["render", render$o]]);
const componentName$n = "IListGroupItem";
var _sfc_main$n = defineComponent({
  name: componentName$n,
  mixins: [
    LinkableMixin
  ],
  props: {
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: "div"
    },
    tabindex: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    ariaDisabled() {
      if (this.role === "link") {
        return null;
      }
      return this.disabled ? "true" : "false";
    },
    classes() {
      return {
        "-active": this.active,
        "-disabled": this.disabled
      };
    },
    role() {
      return this.$attrs.to || this.$attrs.href ? "link" : "listitem";
    },
    tabIndex() {
      return this.disabled ? -1 : this.tabindex;
    }
  }
});
function render$n(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(resolveDynamicComponent(_ctx.isTag), mergeProps(_ctx.$attrs, {
    class: ["list-group-item", _ctx.classes],
    tag: _ctx.tag,
    role: _ctx.role,
    tabindex: _ctx.tabIndex,
    disabled: _ctx.disabled,
    "aria-disabled": _ctx.ariaDisabled
  }), {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3
  }, 16, ["tag", "role", "tabindex", "class", "disabled", "aria-disabled"]);
}
var style_scss_vue_type_style_index_0_src_lang$l = "";
var index$l = /* @__PURE__ */ _export_sfc(_sfc_main$n, [["render", render$n]]);
const memoizedMarkSearchString = memoize(markSearchString);
const componentName$m = "IMark";
var _sfc_main$m = defineComponent({
  name: componentName$m,
  props: {
    text: {
      type: String,
      default: ""
    },
    query: {
      type: String,
      default: ""
    }
  },
  computed: {
    parts() {
      return memoizedMarkSearchString(this.text, this.query);
    }
  }
});
const _hoisted_1$h = { key: 0 };
function render$m(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("span", null, [
    (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.parts, ({ text: text2, marked }) => {
      return openBlock(), createElementBlock(Fragment, null, [
        marked ? (openBlock(), createElementBlock("mark", _hoisted_1$h, toDisplayString(text2), 1)) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
          createTextVNode(toDisplayString(text2), 1)
        ], 2112))
      ], 64);
    }), 256))
  ]);
}
var IMark = /* @__PURE__ */ _export_sfc(_sfc_main$m, [["render", render$m]]);
const componentName$l = "IMedia";
var _sfc_main$l = defineComponent({
  name: componentName$l
});
const _hoisted_1$g = { class: "media" };
const _hoisted_2$9 = { class: "media-body" };
function render$l(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", _hoisted_1$g, [
    renderSlot(_ctx.$slots, "image"),
    createBaseVNode("div", _hoisted_2$9, [
      renderSlot(_ctx.$slots, "default")
    ])
  ]);
}
var style_scss_vue_type_style_index_0_src_lang$k = "";
var index$k = /* @__PURE__ */ _export_sfc(_sfc_main$l, [["render", render$l]]);
const OverlayController = {
  instances: {},
  stack: [],
  zIndex: 1050,
  register(instance) {
    if (instance && instance.name) {
      OverlayController.instances[instance.name] = instance;
    }
  },
  unregister(instance) {
    if (instance && instance.name) {
      OverlayController.instances[instance.name] = null;
      delete OverlayController.instances[instance.name];
    }
  },
  open(name) {
    if (typeof window === "undefined") {
      return;
    }
    OverlayController.stack.push(name);
    OverlayController.instances[name].$el.style.zIndex = OverlayController.zIndex++;
  },
  close(name) {
    if (typeof window === "undefined") {
      return;
    }
    OverlayController.stack.splice(OverlayController.stack.indexOf(name), 1);
  },
  getTopOverlay() {
    const topOverlayName = OverlayController.stack.slice(-1)[0] || "";
    return OverlayController.instances[topOverlayName];
  },
  onPressEscape() {
    const topOverlay = OverlayController.getTopOverlay();
    if (topOverlay && topOverlay.closeOnPressEscape) {
      topOverlay.hide();
    }
  }
};
if (typeof window !== "undefined") {
  window.addEventListener("keydown", (e) => {
    if (isKey("esc", e)) {
      OverlayController.onPressEscape();
    }
  });
}
const componentName$k = "IModal";
var _sfc_main$k = defineComponent({
  name: componentName$k,
  directives: {
    ClickOutside: ClickOutsideDirective
  },
  props: {
    closeOnPressEscape: {
      type: Boolean,
      default: true
    },
    closeAriaLabel: {
      type: String,
      default: "Close"
    },
    color: {
      type: String,
      default: defaultPropValue(componentName$k, "color")
    },
    disabled: {
      type: Boolean,
      default: false
    },
    hideOnClickOutside: {
      type: Boolean,
      default: true
    },
    name: {
      type: String,
      default() {
        return uid("modal");
      }
    },
    showClose: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$k, "size"),
      validator: sizePropValidator
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    transition: {
      type: String,
      default: "zoom-in-center-transition"
    }
  },
  emits: [
    "update:modelValue"
  ],
  data() {
    return {
      visible: this.modelValue
    };
  },
  computed: {
    classes() {
      return __spreadProps(__spreadValues({
        "-disabled": this.disabled
      }, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size)
      });
    }
  },
  watch: {
    modelValue(value) {
      if (value) {
        this.show();
      } else {
        this.hide();
      }
    }
  },
  mounted() {
    OverlayController.register(this);
  },
  unmounted() {
    OverlayController.unregister(this);
  },
  methods: {
    show() {
      if (this.disabled) {
        return;
      }
      this.visible = true;
      this.$emit("update:modelValue", true);
      OverlayController.open(this.name);
      if (typeof window !== "undefined") {
        addClass(window.document.body, "-modal");
      }
    },
    hide() {
      if (this.disabled) {
        return;
      }
      this.visible = false;
      this.$emit("update:modelValue", false);
      OverlayController.close(this.name);
      if (typeof window !== "undefined") {
        removeClass(window.document.body, "-modal");
      }
    },
    onClickOutside() {
      if (!this.hideOnClickOutside) {
        return;
      }
      this.hide();
    }
  }
});
const _hoisted_1$f = ["aria-hidden", "id", "name", "aria-labelledby"];
const _hoisted_2$8 = { class: "modal" };
const _hoisted_3$5 = ["id"];
const _hoisted_4$4 = ["aria-label"];
const _hoisted_5$3 = /* @__PURE__ */ createBaseVNode("i", { class: "icon" }, null, -1);
const _hoisted_6$3 = {
  key: 1,
  class: "modal-body"
};
const _hoisted_7$3 = {
  key: 2,
  class: "modal-footer"
};
function render$k(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_click_outside = resolveDirective("click-outside");
  return openBlock(), createBlock(Transition, { name: "fade-in-transition" }, {
    default: withCtx(() => [
      withDirectives(createBaseVNode("div", {
        class: normalizeClass(["modal-wrapper", _ctx.classes]),
        role: "dialog",
        "aria-modal": "true",
        "aria-hidden": _ctx.visible ? "false" : "true",
        id: _ctx.name,
        name: _ctx.name,
        "aria-labelledby": `${_ctx.name}-header`
      }, [
        createVNode(Transition, { name: _ctx.transition }, {
          default: withCtx(() => [
            withDirectives((openBlock(), createElementBlock("div", _hoisted_2$8, [
              _ctx.$slots.header ? (openBlock(), createElementBlock("div", {
                key: 0,
                class: "modal-header",
                id: `${_ctx.name}-header`
              }, [
                renderSlot(_ctx.$slots, "header"),
                _ctx.showClose ? (openBlock(), createElementBlock("button", {
                  key: 0,
                  class: "close",
                  "aria-hidden": "true",
                  "aria-label": _ctx.closeAriaLabel,
                  onClick: _cache[0] || (_cache[0] = (...args) => _ctx.hide && _ctx.hide(...args))
                }, [
                  renderSlot(_ctx.$slots, "close", {}, () => [
                    _hoisted_5$3
                  ])
                ], 8, _hoisted_4$4)) : createCommentVNode("v-if", true)
              ], 8, _hoisted_3$5)) : createCommentVNode("v-if", true),
              _ctx.$slots.default ? (openBlock(), createElementBlock("div", _hoisted_6$3, [
                renderSlot(_ctx.$slots, "default")
              ])) : createCommentVNode("v-if", true),
              _ctx.$slots.footer ? (openBlock(), createElementBlock("div", _hoisted_7$3, [
                renderSlot(_ctx.$slots, "footer")
              ])) : createCommentVNode("v-if", true)
            ])), [
              [_directive_click_outside, _ctx.onClickOutside],
              [vShow, _ctx.visible]
            ])
          ]),
          _: 3
        }, 8, ["name"])
      ], 10, _hoisted_1$f), [
        [vShow, _ctx.visible]
      ])
    ]),
    _: 3
  });
}
var style_scss_vue_type_style_index_0_src_lang$j = "";
var index$j = /* @__PURE__ */ _export_sfc(_sfc_main$k, [["render", render$k]]);
const componentName$j = "INav";
var _sfc_main$j = defineComponent({
  name: componentName$j,
  provide() {
    return {
      nav: this
    };
  },
  inject: {
    navbar: {
      default: () => ({
        onItemClick: () => {
        }
      })
    },
    sidebar: {
      default: () => ({
        onItemClick: () => {
        }
      })
    }
  },
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$j, "color")
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$j, "size"),
      validator: sizePropValidator
    },
    vertical: {
      type: Boolean,
      default: false
    }
  },
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size),
        "-vertical": this.vertical
      });
    }
  },
  methods: {
    onItemClick() {
      [this.navbar, this.sidebar].forEach((parent) => {
        parent.onItemClick();
      });
    }
  }
});
function render$j(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("nav", {
    class: normalizeClass(["nav", _ctx.classes]),
    role: "menubar"
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var style_scss_vue_type_style_index_0_src_lang$i = "";
var index$i = /* @__PURE__ */ _export_sfc(_sfc_main$j, [["render", render$j]]);
const componentName$i = "INavItem";
var _sfc_main$i = defineComponent({
  name: componentName$i,
  mixins: [
    LinkableMixin
  ],
  inject: {
    nav: {
      default: () => ({
        onItemClick: () => {
        }
      })
    }
  },
  inheritAttrs: false,
  props: {
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    tag: {
      type: String,
      default: "div"
    },
    tabindex: {
      type: [Number, String],
      default: 0
    }
  },
  computed: {
    ariaDisabled() {
      if (this.role === "link") {
        return null;
      }
      return this.disabled ? "true" : "false";
    },
    classes() {
      return {
        "-active": this.active,
        "-disabled": this.disabled
      };
    },
    role() {
      return this.$attrs.to || this.$attrs.href ? "link" : "menuitem";
    },
    tabIndex() {
      return this.disabled ? -1 : this.tabindex;
    }
  },
  methods: {
    onClick(event) {
      this.nav.onItemClick(this, event);
    }
  }
});
function render$i(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(resolveDynamicComponent(_ctx.isTag), mergeProps(_ctx.$attrs, {
    class: ["nav-item", _ctx.classes],
    role: _ctx.role,
    tag: _ctx.tag,
    tabindex: _ctx.tabIndex,
    disabled: _ctx.disabled,
    "aria-disabled": _ctx.ariaDisabled,
    onClick: _ctx.onClick
  }), {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3
  }, 16, ["role", "tag", "tabindex", "class", "disabled", "aria-disabled", "onClick"]);
}
var style_scss_vue_type_style_index_0_src_lang$h = "";
var index$h = /* @__PURE__ */ _export_sfc(_sfc_main$i, [["render", render$i]]);
const componentName$h = "INavbar";
var _sfc_main$h = defineComponent({
  name: componentName$h,
  components: {
    IContainer,
    IRow,
    IColumn,
    IHamburgerMenu
  },
  directives: {
    ClickOutside: ClickOutsideDirective
  },
  mixins: [
    CollapsibleMixin
  ],
  provide() {
    return {
      navbar: this
    };
  },
  props: {
    collapseOnItemClick: {
      type: Boolean,
      default: true
    },
    collapseOnClickOutside: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: defaultPropValue(componentName$h, "color")
    },
    fluid: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$h, "size"),
      validator: sizePropValidator
    },
    menuAnimation: {
      type: String,
      default: "close"
    }
  },
  emits: [
    "update:modelValue"
  ],
  computed: {
    classes() {
      return __spreadProps(__spreadValues(__spreadValues({}, this.collapsibleClasses), colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size)
      });
    }
  },
  methods: {
    onItemClick() {
      if (this.collapseOnItemClick && this.open) {
        this.setOpen(false);
      }
    },
    onClickOutside() {
      if (this.collapseOnClickOutside && this.open) {
        this.setOpen(false);
      }
    }
  }
});
function render$h(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_i_hamburger_menu = resolveComponent("i-hamburger-menu");
  const _component_i_column = resolveComponent("i-column");
  const _component_i_row = resolveComponent("i-row");
  const _component_i_container = resolveComponent("i-container");
  const _directive_click_outside = resolveDirective("click-outside");
  return withDirectives((openBlock(), createElementBlock("div", mergeProps({
    class: ["navbar", _ctx.classes],
    role: "navigation"
  }, _ctx.$attrs), [
    createVNode(_component_i_container, { fluid: _ctx.fluid }, {
      default: withCtx(() => [
        createVNode(_component_i_row, null, {
          default: withCtx(() => [
            createVNode(_component_i_column, null, {
              default: withCtx(() => [
                createVNode(_component_i_hamburger_menu, {
                  class: "collapse-toggle",
                  animation: _ctx.menuAnimation,
                  color: _ctx.color,
                  modelValue: _ctx.open,
                  "onUpdate:modelValue": _ctx.toggleOpen
                }, null, 8, ["animation", "color", "modelValue", "onUpdate:modelValue"]),
                renderSlot(_ctx.$slots, "default")
              ]),
              _: 3
            })
          ]),
          _: 3
        })
      ]),
      _: 3
    }, 8, ["fluid"])
  ], 16)), [
    [_directive_click_outside, _ctx.onClickOutside]
  ]);
}
var style_scss_vue_type_style_index_0_src_lang$g = "";
var index$g = /* @__PURE__ */ _export_sfc(_sfc_main$h, [["render", render$h]]);
const componentName$g = "INavbarBrand";
var _sfc_main$g = defineComponent({
  name: componentName$g,
  mixins: [
    LinkableMixin
  ],
  props: {
    tag: {
      type: String,
      default: "div"
    }
  }
});
function render$g(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(resolveDynamicComponent(_ctx.isTag), {
    class: "navbar-brand",
    tag: _ctx.tag,
    translate: "no"
  }, {
    default: withCtx(() => [
      renderSlot(_ctx.$slots, "default")
    ]),
    _: 3
  }, 8, ["tag"]);
}
var style_scss_vue_type_style_index_0_src_lang$f = "";
var index$f = /* @__PURE__ */ _export_sfc(_sfc_main$g, [["render", render$g]]);
const componentName$f = "INavbarCollapsible";
var _sfc_main$f = defineComponent({
  name: componentName$f,
  components: {
    IExpandTransition
  },
  inject: {
    navbar: {
      default: () => ({})
    }
  },
  computed: {
    visible() {
      return this.navbar.open || !this.navbar.collapsible;
    }
  }
});
const _hoisted_1$e = ["aria-hidden", "aria-expanded"];
function render$f(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_i_expand_transition = resolveComponent("i-expand-transition");
  return openBlock(), createBlock(_component_i_expand_transition, null, {
    default: withCtx(() => [
      withDirectives(createBaseVNode("div", {
        class: "navbar-collapsible",
        "aria-hidden": _ctx.visible ? "false" : "true",
        "aria-expanded": _ctx.visible ? "true" : "false"
      }, [
        renderSlot(_ctx.$slots, "default")
      ], 8, _hoisted_1$e), [
        [vShow, _ctx.visible]
      ])
    ]),
    _: 3
  });
}
var style_scss_vue_type_style_index_0_src_lang$e = "";
var index$e = /* @__PURE__ */ _export_sfc(_sfc_main$f, [["render", render$f]]);
const componentName$e = "IPagination";
var _sfc_main$e = defineComponent({
  name: componentName$e,
  props: {
    ariaLabel: {
      type: String,
      default: "Pagination"
    },
    color: {
      type: String,
      default: defaultPropValue(componentName$e, "color")
    },
    itemsPerPage: {
      type: Number,
      default: 20
    },
    itemsTotal: {
      type: Number,
      default: 0
    },
    limit: {
      type: [Number, Object],
      default() {
        return {
          xs: 3,
          sm: 5
        };
      }
    },
    quickLink: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Number,
      default: 1
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$e, "size"),
      validator: sizePropValidator
    }
  },
  emits: [
    "update:modelValue"
  ],
  data() {
    return {
      pageLimit: 5
    };
  },
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size)
      });
    },
    pageCount() {
      return Math.ceil(this.itemsTotal / this.itemsPerPage);
    },
    showQuickPrevious() {
      return this.pageCount > this.pageLimit && this.modelValue > this.pageLimit - (this.pageLimit - 1) / 2;
    },
    showQuickNext() {
      return this.pageCount > this.pageLimit && this.modelValue < this.pageCount - (this.pageLimit - 1) / 2;
    },
    pages() {
      const pages = [];
      if (this.showQuickPrevious && !this.showQuickNext) {
        const startPage = this.pageCount - (this.pageLimit - 2);
        for (let i = startPage; i < this.pageCount; i++) {
          pages.push(i);
        }
      } else if (!this.showQuickPrevious && this.showQuickNext) {
        for (let i = 2; i < this.pageLimit; i++) {
          pages.push(i);
        }
      } else if (this.showQuickPrevious && this.showQuickNext) {
        const offset2 = Math.floor(this.pageLimit / 2) - 1;
        for (let i = this.modelValue - offset2; i <= this.modelValue + offset2; i++) {
          pages.push(i);
        }
      } else {
        for (let i = 2; i < this.pageCount; i++) {
          pages.push(i);
        }
      }
      return pages;
    }
  },
  created() {
    this.debouncedOnWindowResize = debounce$1(this.onWindowResize, 250);
    if (typeof window !== "undefined") {
      window.addEventListener("resize", this.debouncedOnWindowResize);
      this.onWindowResize();
    }
  },
  unmounted() {
    if (typeof window !== "undefined") {
      window.removeEventListener("resize", this.debouncedOnWindowResize);
    }
  },
  methods: {
    next() {
      if (this.modelValue === this.pageCount) {
        return;
      }
      this.onClick(this.modelValue + 1);
    },
    quickNext() {
      if (!this.quickLink) {
        return;
      }
      const jumpTo = this.modelValue + (this.pageLimit - 2);
      this.onClick(jumpTo > this.pageCount ? this.pageCount : jumpTo);
    },
    previous() {
      if (this.modelValue === 1) {
        return;
      }
      this.onClick(this.modelValue - 1);
    },
    quickPrevious() {
      if (!this.quickLink) {
        return;
      }
      const jumpTo = this.modelValue - (this.pageLimit - 2);
      this.onClick(jumpTo < 1 ? 1 : jumpTo);
    },
    onClick(item) {
      this.$emit("update:modelValue", item);
    },
    onWindowResize() {
      if (typeof this.limit === "number") {
        this.pageLimit = this.limit;
        return this.pageLimit;
      }
      for (const breakpointKey of breakpointKeys.slice().reverse()) {
        if (this.limit.hasOwnProperty(breakpointKey) && (typeof window !== "undefined" && window.innerWidth >= breakpoints[breakpointKey][0])) {
          this.pageLimit = this.limit[breakpointKey];
          return this.pageLimit;
        }
      }
    }
  }
});
const _hoisted_1$d = ["aria-label"];
const _hoisted_2$7 = { class: "pagination-items" };
const _hoisted_3$4 = { "aria-hidden": "true" };
const _hoisted_4$3 = /* @__PURE__ */ createTextVNode("<");
const _hoisted_5$2 = ["aria-current", "onClick"];
const _hoisted_6$2 = { "aria-hidden": "true" };
const _hoisted_7$2 = /* @__PURE__ */ createTextVNode(">");
function render$e(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("nav", {
    class: normalizeClass(["pagination", _ctx.classes]),
    role: "navigation",
    "aria-label": _ctx.ariaLabel
  }, [
    createBaseVNode("ul", _hoisted_2$7, [
      _ctx.pageCount > 0 ? (openBlock(), createElementBlock("li", {
        key: 0,
        class: normalizeClass(["pagination-item -previous", { "-disabled": _ctx.modelValue === 1 }]),
        onClick: _cache[0] || (_cache[0] = (...args) => _ctx.previous && _ctx.previous(...args))
      }, [
        createBaseVNode("span", _hoisted_3$4, [
          renderSlot(_ctx.$slots, "previous", {}, () => [
            _hoisted_4$3
          ])
        ])
      ], 2)) : createCommentVNode("v-if", true),
      _ctx.pageCount > 0 ? (openBlock(), createElementBlock("li", {
        key: 1,
        class: normalizeClass(["pagination-item -first", { "-active": _ctx.modelValue === 1 }]),
        onClick: _cache[1] || (_cache[1] = ($event) => _ctx.onClick(1))
      }, " 1 ", 2)) : createCommentVNode("v-if", true),
      _ctx.showQuickPrevious ? (openBlock(), createElementBlock("li", {
        key: 2,
        class: normalizeClass(["pagination-item -quick-previous", { "-disabled": !_ctx.quickLink }]),
        onClick: _cache[2] || (_cache[2] = (...args) => _ctx.quickPrevious && _ctx.quickPrevious(...args))
      }, " \u2026 ", 2)) : createCommentVNode("v-if", true),
      (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.pages, (page) => {
        return openBlock(), createElementBlock("li", {
          class: normalizeClass(["pagination-item", { "-active": _ctx.modelValue === page }]),
          "aria-current": _ctx.modelValue === page ? "page" : false,
          onClick: ($event) => _ctx.onClick(page)
        }, toDisplayString(page), 11, _hoisted_5$2);
      }), 256)),
      _ctx.showQuickNext ? (openBlock(), createElementBlock("li", {
        key: 3,
        class: normalizeClass(["pagination-item -quick-next", { "-disabled": !_ctx.quickLink }]),
        onClick: _cache[3] || (_cache[3] = (...args) => _ctx.quickNext && _ctx.quickNext(...args))
      }, " \u2026 ", 2)) : createCommentVNode("v-if", true),
      _ctx.pageCount > 1 ? (openBlock(), createElementBlock("li", {
        key: 4,
        class: normalizeClass(["pagination-item -last", { "-active": _ctx.modelValue === _ctx.pageCount }]),
        onClick: _cache[4] || (_cache[4] = ($event) => _ctx.onClick(_ctx.pageCount))
      }, toDisplayString(_ctx.pageCount), 3)) : createCommentVNode("v-if", true),
      _ctx.pageCount > 0 ? (openBlock(), createElementBlock("li", {
        key: 5,
        class: normalizeClass(["pagination-item -next", { "-disabled": _ctx.modelValue === _ctx.pageCount }]),
        onClick: _cache[5] || (_cache[5] = (...args) => _ctx.next && _ctx.next(...args))
      }, [
        createBaseVNode("span", _hoisted_6$2, [
          renderSlot(_ctx.$slots, "next", {}, () => [
            _hoisted_7$2
          ])
        ])
      ], 2)) : createCommentVNode("v-if", true)
    ])
  ], 10, _hoisted_1$d);
}
var style_scss_vue_type_style_index_0_src_lang$d = "";
var index$d = /* @__PURE__ */ _export_sfc(_sfc_main$e, [["render", render$e]]);
const componentName$d = "IPopover";
var _sfc_main$d = defineComponent({
  name: componentName$d,
  directives: {
    ClickOutside: ClickOutsideDirective
  },
  mixins: [
    PopupMixin,
    PopupControlsMixin
  ],
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$d, "color")
    },
    disabled: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default() {
        return uid("popover");
      }
    },
    arrow: {
      type: Boolean,
      default: true
    },
    placement: {
      type: String,
      default: "top"
    },
    trigger: {
      type: [String, Array],
      default: () => ["click"]
    },
    offset: {
      type: Number,
      default: 6
    },
    popperOptions: {
      type: Object,
      default: () => ({})
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$d, "size"),
      validator: sizePropValidator
    }
  },
  emits: [
    "update:modelValue"
  ],
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size)
      });
    }
  },
  methods: {
    onEscape() {
      this.visible = false;
      this.$emit("update:modelValue", false);
    },
    handleClickOutside() {
      this.visible = false;
      this.$emit("update:modelValue", false);
      this.onClickOutside();
    }
  }
});
const _hoisted_1$c = ["id"];
const _hoisted_2$6 = ["aria-describedby", "aria-disabled", "aria-expanded"];
const _hoisted_3$3 = ["id", "aria-hidden"];
const _hoisted_4$2 = {
  key: 0,
  "data-popper-arrow": ""
};
const _hoisted_5$1 = {
  key: 1,
  class: "popover-header"
};
const _hoisted_6$1 = {
  key: 2,
  class: "popover-body"
};
const _hoisted_7$1 = {
  key: 3,
  class: "popover-footer"
};
function render$d(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_click_outside = resolveDirective("click-outside");
  return withDirectives((openBlock(), createElementBlock("div", {
    class: normalizeClass(["popover-wrapper", _ctx.classes]),
    ref: "wrapper",
    id: _ctx.name,
    onKeyup: _cache[0] || (_cache[0] = withKeys((...args) => _ctx.onEscape && _ctx.onEscape(...args), ["esc"]))
  }, [
    createBaseVNode("div", {
      class: "popover-trigger",
      ref: "trigger",
      "aria-describedby": `${_ctx.name}-popup`,
      "aria-disabled": _ctx.disabled ? "true" : "false",
      "aria-expanded": _ctx.visible ? "true" : "false"
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 8, _hoisted_2$6),
    createVNode(Transition, {
      name: "zoom-in-top-transition",
      onAfterLeave: _ctx.destroyPopper
    }, {
      default: withCtx(() => [
        withDirectives(createBaseVNode("div", {
          class: "popover",
          ref: "popup",
          role: "tooltip",
          "aria-live": "polite",
          id: `${_ctx.name}-popup`,
          "aria-hidden": _ctx.visible ? "false" : "true"
        }, [
          _ctx.arrow ? (openBlock(), createElementBlock("span", _hoisted_4$2)) : createCommentVNode("v-if", true),
          _ctx.$slots.header ? (openBlock(), createElementBlock("div", _hoisted_5$1, [
            renderSlot(_ctx.$slots, "header")
          ])) : createCommentVNode("v-if", true),
          _ctx.$slots.body ? (openBlock(), createElementBlock("div", _hoisted_6$1, [
            renderSlot(_ctx.$slots, "body")
          ])) : createCommentVNode("v-if", true),
          _ctx.$slots.footer ? (openBlock(), createElementBlock("div", _hoisted_7$1, [
            renderSlot(_ctx.$slots, "footer")
          ])) : createCommentVNode("v-if", true)
        ], 8, _hoisted_3$3), [
          [vShow, _ctx.visible]
        ])
      ]),
      _: 3
    }, 8, ["onAfterLeave"])
  ], 42, _hoisted_1$c)), [
    [_directive_click_outside, _ctx.onClickOutside]
  ]);
}
var style_scss_vue_type_style_index_0_src_lang$c = "";
var index$c = /* @__PURE__ */ _export_sfc(_sfc_main$d, [["render", render$d]]);
const componentName$c = "IProgress";
var _sfc_main$c = defineComponent({
  name: componentName$c,
  provide() {
    return {
      progress: this
    };
  },
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$c, "color")
    },
    min: {
      type: [String, Number],
      default: 0
    },
    max: {
      type: [String, Number],
      default: 100
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$c, "size"),
      validator: sizePropValidator
    }
  },
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size)
      });
    }
  }
});
function render$c(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["progress", _ctx.classes])
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var style_scss_vue_type_style_index_0_src_lang$b = "";
var index$b = /* @__PURE__ */ _export_sfc(_sfc_main$c, [["render", render$c]]);
const componentName$b = "IProgressBar";
var _sfc_main$b = defineComponent({
  name: componentName$b,
  inject: {
    progress: {
      default: () => ({ min: 0, max: 100 })
    }
  },
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$b, "color", "primary")
    },
    value: {
      type: [String, Number],
      default: 0
    }
  },
  computed: {
    computedValue() {
      const min2 = typeof this.min === "string" ? parseFloat(this.min) : this.min;
      const value = typeof this.value === "string" ? parseFloat(this.value.replace("%", "")) : this.value;
      const max2 = typeof this.max === "string" ? parseFloat(this.max) : this.max;
      return (value - min2) * 100 / (max2 - min2);
    },
    min() {
      return this.progress.min;
    },
    max() {
      return this.progress.max;
    },
    style() {
      return {
        width: `${this.computedValue}%`
      };
    },
    classes() {
      return __spreadValues({}, colorVariantClass(this));
    }
  }
});
const _hoisted_1$b = ["aria-valuemin", "aria-valuemax", "aria-valuenow"];
function render$b(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["progress-bar", _ctx.classes]),
    style: normalizeStyle(_ctx.style),
    role: "progressbar",
    "aria-valuemin": _ctx.min,
    "aria-valuemax": _ctx.max,
    "aria-valuenow": _ctx.computedValue
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 14, _hoisted_1$b);
}
var style_scss_vue_type_style_index_0_src_lang$a = "";
var index$a = /* @__PURE__ */ _export_sfc(_sfc_main$b, [["render", render$b]]);
const componentName$a = "IRadio";
var _sfc_main$a = defineComponent({
  name: componentName$a,
  mixins: [
    FormComponentMixin
  ],
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$a, "color")
    },
    disabled: {
      type: Boolean,
      default: false
    },
    indeterminate: {
      type: Boolean,
      default: false
    },
    value: {
      default: ""
    },
    modelValue: {
      default: false
    },
    name: {
      type: [String, Number],
      default() {
        return uid("radio");
      }
    },
    native: {
      type: Boolean,
      default: false
    },
    readonly: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$a, "size"),
      validator: sizePropValidator
    },
    tabindex: {
      type: [Number, String],
      default: 0
    }
  },
  emits: [
    "update:modelValue"
  ],
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size),
        "-disabled": this.isDisabled,
        "-readonly": this.isReadonly,
        "-native": this.native
      });
    },
    checked() {
      return this.formGroup.checked === this.value;
    },
    tabIndex() {
      return this.isDisabled ? -1 : this.tabindex;
    }
  },
  methods: {
    clickInputRef() {
      if (this.isReadonly) {
        return;
      }
      this.$refs.input.click();
    },
    onChange(event) {
      var _a, _b, _c, _d;
      (_b = (_a = this.parent).onInput) == null ? void 0 : _b.call(_a, this.name, event.target.checked);
      (_d = (_c = this.formGroup).onChange) == null ? void 0 : _d.call(_c, this.value);
      this.$emit("update:modelValue", event.target.checked);
    },
    onBlur(event) {
      var _a, _b;
      (_b = (_a = this.parent).onBlur) == null ? void 0 : _b.call(_a, this.name, event);
    }
  }
});
const _hoisted_1$a = ["checked", "name", "disabled", "readonly", ".indeterminate"];
const _hoisted_2$5 = ["aria-checked", "aria-disabled", "aria-readonly", "tabindex"];
function render$a(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["radio", _ctx.classes]),
    role: "radio"
  }, [
    createBaseVNode("input", {
      checked: _ctx.checked,
      ref: "input",
      type: "radio",
      tabindex: "-1",
      name: _ctx.name,
      disabled: _ctx.isDisabled,
      readonly: _ctx.isReadonly,
      ".indeterminate": _ctx.indeterminate,
      onChange: _cache[0] || (_cache[0] = (...args) => _ctx.onChange && _ctx.onChange(...args))
    }, null, 40, _hoisted_1$a),
    createBaseVNode("label", {
      class: "radio-label",
      "aria-checked": _ctx.checked,
      "aria-disabled": _ctx.isDisabled,
      "aria-readonly": _ctx.isReadonly,
      tabindex: _ctx.tabIndex,
      onBlur: _cache[1] || (_cache[1] = (...args) => _ctx.onBlur && _ctx.onBlur(...args)),
      onClick: _cache[2] || (_cache[2] = (...args) => _ctx.clickInputRef && _ctx.clickInputRef(...args)),
      onKeydown: _cache[3] || (_cache[3] = withKeys(withModifiers((...args) => _ctx.clickInputRef && _ctx.clickInputRef(...args), ["stop", "prevent"]), ["space"]))
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 40, _hoisted_2$5)
  ], 2);
}
var style_scss_vue_type_style_index_0_src_lang$9 = "";
var index$9 = /* @__PURE__ */ _export_sfc(_sfc_main$a, [["render", render$a]]);
const componentName$9 = "IRadioGroup";
var _sfc_main$9 = defineComponent({
  name: componentName$9,
  mixins: [
    FormComponentMixin
  ],
  provide() {
    return {
      formGroup: this
    };
  },
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$9, "color")
    },
    disabled: {
      type: Boolean,
      default: false
    },
    inline: {
      type: Boolean,
      default: false
    },
    modelValue: {
      default: ""
    },
    name: {
      type: [String, Number],
      default() {
        return uid("radio-group");
      }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$9, "size"),
      validator: sizePropValidator
    }
  },
  emits: [
    "update:modelValue"
  ],
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size),
        "-disabled": this.isDisabled,
        "-readonly": this.isReadonly,
        "-inline": this.inline
      });
    },
    checked() {
      if (this.schema) {
        return this.schema.value;
      }
      return this.modelValue;
    }
  },
  methods: {
    onChange(value) {
      var _a, _b;
      (_b = (_a = this.parent).onInput) == null ? void 0 : _b.call(_a, this.name, value);
      this.$emit("update:modelValue", value);
    }
  }
});
const _hoisted_1$9 = ["name"];
function render$9(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["form-group radio-group", _ctx.classes]),
    name: _ctx.name,
    role: "radiogroup"
  }, [
    renderSlot(_ctx.$slots, "default", {}, void 0, true)
  ], 10, _hoisted_1$9);
}
var style_scss_vue_type_style_index_0_src_scoped_true_lang = "";
var index$8 = /* @__PURE__ */ _export_sfc(_sfc_main$9, [["render", render$9], ["__scopeId", "data-v-48fe68ff"]]);
const componentName$8 = "ISelectOption";
var _sfc_main$8 = defineComponent({
  name: componentName$8,
  inject: {
    select: {
      default: () => ({})
    }
  },
  props: {
    active: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    label: {
      type: String,
      default: ""
    },
    tabindex: {
      type: [Number, String],
      default: 0
    },
    value: {
      type: [Object, String, Number],
      default: () => ({})
    }
  },
  computed: {
    ariaDisabled() {
      return this.disabled ? "true" : "false";
    },
    ariaSelected() {
      return this.active ? "true" : "false";
    },
    isActive() {
      return this.active || this.value === this.select.modelValue;
    },
    classes() {
      return {
        "-active": this.isActive,
        "-disabled": this.disabled
      };
    },
    tabIndex() {
      return this.disabled ? -1 : this.tabindex;
    }
  },
  methods: {
    onClick() {
      if (!this.disabled) {
        this.select.onInput(this.value, this.label);
      }
    }
  }
});
const _hoisted_1$8 = ["tabindex", "aria-disabled", "aria-selected"];
function render$8(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", mergeProps(_ctx.$attrs, {
    class: ["select-option", _ctx.classes],
    role: "option",
    tabindex: _ctx.tabIndex,
    "aria-disabled": _ctx.ariaDisabled,
    "aria-selected": _ctx.ariaSelected,
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
  }), [
    renderSlot(_ctx.$slots, "default", {}, () => [
      createTextVNode(toDisplayString(_ctx.label), 1)
    ])
  ], 16, _hoisted_1$8);
}
var style_scss_vue_type_style_index_0_src_lang$8 = "";
var ISelectOption = /* @__PURE__ */ _export_sfc(_sfc_main$8, [["render", render$8]]);
const componentName$7 = "ISelect";
var _sfc_main$7 = defineComponent({
  name: componentName$7,
  directives: {
    ClickOutside: ClickOutsideDirective
  },
  components: {
    IInput,
    IIcon,
    ISelectOption,
    IMark
  },
  mixins: [
    FormComponentMixin,
    PopupMixin
  ],
  provide() {
    return {
      select: this
    };
  },
  props: {
    animationDuration: {
      type: Number,
      default: 300
    },
    autocomplete: {
      type: Boolean,
      default: false
    },
    arrow: {
      type: Boolean,
      default: true
    },
    color: {
      type: String,
      default: defaultPropValue(componentName$7, "color")
    },
    clearable: {
      type: Boolean,
      default: false
    },
    disabled: {
      type: Boolean,
      default: false
    },
    idField: {
      type: String,
      default: "id"
    },
    keydownTrigger: {
      type: Array,
      default: () => ["up", "down", "enter", "space", "tab", "esc"]
    },
    keydownItem: {
      type: Array,
      default: () => ["up", "down", "enter", "space", "tab", "esc"]
    },
    label: {
      type: [String, Function],
      default: "label"
    },
    loading: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: [Object, String, Number],
      default: null
    },
    minLength: {
      type: Number,
      default: 0
    },
    name: {
      type: [String, Number],
      default: () => uid("select")
    },
    options: {
      type: Array,
      default: () => []
    },
    placeholder: {
      type: String,
      default: ""
    },
    offset: {
      type: Number,
      default: 6
    },
    placement: {
      type: String,
      default: "bottom"
    },
    popperOptions: {
      type: Object,
      default: () => ({
        modifiers: [
          ...useBaseModifiers({ offset: 8 }),
          sameWidthModifier()
        ]
      })
    },
    readonly: {
      type: Boolean,
      default: false
    },
    scrollTolerance: {
      type: Number,
      default: 160
    },
    selectFirstOptionOnEnter: {
      type: Boolean,
      default: true
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$7, "size"),
      validator: sizePropValidator
    },
    tabindex: {
      type: [Number, String],
      default: 0
    },
    type: {
      type: String,
      default: "text"
    },
    total: {
      type: Number,
      default: void 0
    }
  },
  emits: [
    "update:modelValue",
    "search",
    "pagination"
  ],
  data() {
    return {
      animating: false,
      visible: false,
      inputValue: this.computeLabel(this.modelValue) || ""
    };
  },
  computed: {
    wrapperClasses() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size)
      });
    },
    popupClasses() {
      return {
        "-disabled": this.isDisabled,
        "-readonly": this.isReadonly
      };
    },
    tabIndex() {
      return this.isDisabled ? -1 : this.tabindex;
    },
    isClearable() {
      return this.value && this.clearable && !this.isDisabled && !this.isReadonly;
    },
    value() {
      if (this.schema) {
        return this.schema.value;
      }
      return this.modelValue;
    },
    inputPlaceholder() {
      return this.value ? this.computeLabel(this.value) : this.placeholder;
    }
  },
  watch: {
    value(value) {
      this.inputValue = this.computeLabel(value);
    },
    inputValue(value) {
      const matchesLength = this.inputMatchesLength(value);
      const matchesLabel = this.inputMatchesLabel(value);
      if (matchesLength && !matchesLabel && !this.animating) {
        this.show();
      }
      this.$emit("search", this.inputValue);
    },
    options() {
      if (this.visible) {
        this.createPopper();
      }
    }
  },
  methods: {
    onInput(option, label) {
      var _a, _b;
      if (option.disabled) {
        return;
      }
      this.hide();
      if (label) {
        this.inputValue = label;
      }
      (_b = (_a = this.parent).onInput) == null ? void 0 : _b.call(_a, this.name, option);
      this.$emit("update:modelValue", option);
    },
    onClear() {
      this.animating = true;
      this.$emit("update:modelValue", null);
      this.$nextTick(() => {
        this.animating = false;
      });
    },
    onFocus(event) {
      if (!this.value && this.options.length === 0) {
        return;
      }
      if (this.autocomplete) {
        this.inputValue = "";
      }
      const focusShouldShowSelect = !event.relatedTarget || !this.$refs.wrapper.contains(event.relatedTarget);
      if (focusShouldShowSelect && this.inputShouldShowSelect(this.inputValue)) {
        this.show();
      }
    },
    onBlur(event) {
      var _a, _b;
      const blurShouldHideSelect = !event.relatedTarget || !this.$refs.wrapper.contains(event.relatedTarget);
      if (blurShouldHideSelect) {
        this.hide();
        this.inputValue = this.computeLabel(this.value);
      }
      (_b = (_a = this.parent).onBlur) == null ? void 0 : _b.call(_a, this.name, event);
    },
    onClick() {
      if (this.autocomplete) {
        this.inputValue = "";
      }
      if (this.inputShouldShowSelect(this.inputValue)) {
        this.show();
      }
    },
    onClickOutside() {
      this.hide();
    },
    onCaretClick() {
      this.focus();
    },
    onScroll() {
      if (isNaN(this.total)) {
        return;
      }
      const scrollTop = this.$refs.body.scrollTop;
      const viewportHeight = parseInt(getComputedStyle(this.$refs.body).height, 10);
      const totalHeight = parseInt(getComputedStyle(this.$refs.options).height, 10);
      const shouldLoadNextPage = scrollTop + viewportHeight > totalHeight - this.scrollTolerance;
      const endReached = this.options.length >= this.total;
      if (shouldLoadNextPage && !endReached && this.options.length > 0 && !this.loading) {
        this.$emit("pagination");
      }
    },
    onWindowResize() {
      this.onScroll();
    },
    onTriggerKeyDown(event) {
      if (this.keydownTrigger.length === 0) {
        return;
      }
      const focusableItems = this.getFocusableItems();
      const activeIndex = focusableItems.findIndex((item) => item.active);
      const initialIndex = activeIndex > -1 ? activeIndex : 0;
      const focusTarget = focusableItems[initialIndex];
      switch (true) {
        case (isKey("up", event) && this.keydownTrigger.includes("up")):
        case (isKey("down", event) && this.keydownTrigger.includes("down")):
          this.show();
          setTimeout(() => {
            focusTarget.focus();
          }, this.visible ? 0 : this.animationDuration);
          event.preventDefault();
          event.stopPropagation();
          break;
        case (isKey("enter", event) && this.keydownTrigger.includes("enter")):
          if (this.selectFirstOptionOnEnter && (!this.value || !this.inputMatchesLabel(this.inputValue))) {
            const firstAvailableOption = this.options.find((option) => !option.disabled);
            if (firstAvailableOption) {
              this.onInput(firstAvailableOption);
              this.focus();
            }
          } else {
            this.onClick();
          }
          if (!this.visible) {
            setTimeout(() => {
              focusTarget.focus();
            }, this.animationDuration);
          }
          event.preventDefault();
          break;
        case (isKey("tab", event) && this.keydownTrigger.includes("tab")):
        case (isKey("esc", event) && this.keydownTrigger.includes("esc")):
          this.hide();
          break;
      }
    },
    onItemKeyDown(event) {
      if (this.keydownItem.length === 0) {
        return;
      }
      switch (true) {
        case (isKey("up", event) && this.keydownItem.includes("up")):
        case (isKey("down", event) && this.keydownItem.includes("down")):
          const focusableItems = this.getFocusableItems();
          const currentIndex = focusableItems.findIndex((item) => item === event.target);
          const maxIndex = focusableItems.length - 1;
          let nextIndex;
          if (isKey("up", event)) {
            nextIndex = currentIndex > 0 ? currentIndex - 1 : 0;
          } else {
            nextIndex = currentIndex < maxIndex ? currentIndex + 1 : maxIndex;
          }
          focusableItems[nextIndex].focus();
          event.preventDefault();
          event.stopPropagation();
          break;
        case (isKey("enter", event) && this.keydownItem.includes("enter")):
        case (isKey("space", event) && this.keydownItem.includes("space")):
          event.target.click();
          this.focus();
          event.preventDefault();
          break;
        case (isKey("tab", event) && this.keydownItem.includes("tab")):
        case (isKey("esc", event) && this.keydownItem.includes("esc")):
          this.hide();
          this.focus();
          event.preventDefault();
          break;
      }
    },
    onEscape() {
      this.hide();
    },
    show() {
      if (this.isDisabled || this.isReadonly || this.visible) {
        return;
      }
      this.visible = true;
      this.createPopper();
    },
    hide() {
      if (!this.visible) {
        return;
      }
      this.visible = false;
      this.animating = true;
      setTimeout(() => {
        this.animating = false;
      }, this.animationDuration);
    },
    focus() {
      this.$refs.trigger.focus();
    },
    getFocusableItems() {
      const focusableItems = [];
      for (const child of this.$refs.options.children) {
        if (isFocusable(child)) {
          focusableItems.push(child);
        }
      }
      return focusableItems;
    },
    getElementHeight(node2) {
      const computedStyle = getComputedStyle(node2);
      if (!computedStyle.height) {
        return NaN;
      }
      return Math.ceil(parseFloat(computedStyle.height));
    },
    inputMatchesLabel(value) {
      return this.value && value === this.computeLabel(this.value);
    },
    inputMatchesLength(value) {
      return this.minLength === 0 || value && value.length >= this.minLength;
    },
    inputShouldShowSelect(value) {
      if (!this.autocomplete) {
        return true;
      }
      return this.inputMatchesLength(value) && !this.inputMatchesLabel(value);
    },
    computeLabel(option) {
      if (typeof option !== "object") {
        return this.inputValue;
      }
      return isFunction(this.label) ? this.label(option) : getValueByPath(option, this.label);
    }
  }
});
const _hoisted_1$7 = ["id", "name", "aria-owns", "aria-expanded"];
const _hoisted_2$4 = ["id", "aria-hidden"];
const _hoisted_3$2 = {
  key: 0,
  "data-popper-arrow": ""
};
const _hoisted_4$1 = {
  key: 1,
  class: "select-header"
};
const _hoisted_5 = {
  key: 0,
  class: "select-no-results"
};
const _hoisted_6 = /* @__PURE__ */ createTextVNode(" There are no results for your query. ");
const _hoisted_7 = {
  class: "select-options",
  ref: "options"
};
const _hoisted_8 = {
  key: 2,
  class: "select-footer"
};
function render$7(_ctx, _cache, $props, $setup, $data, $options) {
  const _component_i_input = resolveComponent("i-input");
  const _component_i_mark = resolveComponent("i-mark");
  const _component_i_select_option = resolveComponent("i-select-option");
  const _directive_click_outside = resolveDirective("click-outside");
  return withDirectives((openBlock(), createElementBlock("div", {
    class: normalizeClass(["select-wrapper", _ctx.wrapperClasses]),
    id: _ctx.name,
    name: _ctx.name,
    ref: "wrapper",
    role: "combobox",
    "aria-haspopup": "listbox",
    "aria-owns": `${_ctx.name}-options`,
    "aria-expanded": _ctx.visible ? "true" : "false",
    onKeyup: _cache[3] || (_cache[3] = withKeys((...args) => _ctx.onEscape && _ctx.onEscape(...args), ["esc"]))
  }, [
    createVNode(_component_i_input, {
      modelValue: _ctx.inputValue,
      "onUpdate:modelValue": _cache[1] || (_cache[1] = ($event) => _ctx.inputValue = $event),
      ref: "trigger",
      autocomplete: "off",
      "aria-autocomplete": "both",
      "aria-controls": `${_ctx.name}-options`,
      disabled: _ctx.isDisabled,
      readonly: _ctx.isReadonly,
      tabindex: _ctx.tabIndex,
      plaintext: !_ctx.autocomplete,
      placeholder: _ctx.inputPlaceholder,
      clearable: _ctx.isClearable,
      color: _ctx.color,
      size: _ctx.size,
      name: `${_ctx.name}-input`,
      onClick: _ctx.onClick,
      onFocus: _ctx.onFocus,
      onBlur: _ctx.onBlur,
      onClear: _ctx.onClear,
      onKeydown: _ctx.onTriggerKeyDown
    }, createSlots({
      suffix: withCtx(() => [
        renderSlot(_ctx.$slots, "suffix"),
        createBaseVNode("button", {
          class: "select-caret",
          "aria-hidden": "true",
          onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onCaretClick && _ctx.onCaretClick(...args))
        })
      ]),
      _: 2
    }, [
      _ctx.$slots.prepend ? {
        name: "prepend",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "prepend")
        ])
      } : void 0,
      _ctx.$slots.prefix ? {
        name: "prefix",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "prefix")
        ])
      } : void 0,
      _ctx.$slots.append ? {
        name: "append",
        fn: withCtx(() => [
          renderSlot(_ctx.$slots, "append")
        ])
      } : void 0
    ]), 1032, ["modelValue", "aria-controls", "disabled", "readonly", "tabindex", "plaintext", "placeholder", "clearable", "color", "size", "name", "onClick", "onFocus", "onBlur", "onClear", "onKeydown"]),
    createVNode(Transition, {
      name: "zoom-in-top-transition",
      onAfterLeave: _ctx.destroyPopper
    }, {
      default: withCtx(() => [
        withDirectives(createBaseVNode("div", {
          class: normalizeClass(["select", _ctx.popupClasses]),
          id: `${_ctx.name}-options`,
          role: "listbox",
          ref: "popup",
          "aria-hidden": _ctx.visible ? "false" : "true"
        }, [
          _ctx.arrow ? (openBlock(), createElementBlock("span", _hoisted_3$2)) : createCommentVNode("v-if", true),
          _ctx.$slots.header ? (openBlock(), createElementBlock("div", _hoisted_4$1, [
            renderSlot(_ctx.$slots, "header")
          ])) : createCommentVNode("v-if", true),
          createBaseVNode("div", {
            class: "select-body",
            ref: "body",
            onScroll: _cache[2] || (_cache[2] = (...args) => _ctx.onScroll && _ctx.onScroll(...args))
          }, [
            !_ctx.$slots.default && _ctx.options.length === 0 ? (openBlock(), createElementBlock("div", _hoisted_5, [
              renderSlot(_ctx.$slots, "no-results", {}, () => [
                _hoisted_6
              ])
            ])) : createCommentVNode("v-if", true),
            createBaseVNode("div", _hoisted_7, [
              renderSlot(_ctx.$slots, "default"),
              (openBlock(true), createElementBlock(Fragment, null, renderList(_ctx.options, (option) => {
                return openBlock(), createBlock(_component_i_select_option, {
                  key: option[_ctx.idField],
                  active: _ctx.value && _ctx.value[_ctx.idField] === option[_ctx.idField],
                  disabled: option.disabled,
                  value: option,
                  onKeydown: _ctx.onItemKeyDown
                }, {
                  default: withCtx(() => [
                    renderSlot(_ctx.$slots, "option", { option }, () => [
                      _ctx.autocomplete && _ctx.inputValue !== _ctx.computeLabel(option) ? (openBlock(), createBlock(_component_i_mark, {
                        key: 0,
                        text: _ctx.computeLabel(option),
                        query: _ctx.inputValue
                      }, null, 8, ["text", "query"])) : (openBlock(), createElementBlock(Fragment, { key: 1 }, [
                        createTextVNode(toDisplayString(_ctx.computeLabel(option)), 1)
                      ], 2112))
                    ])
                  ]),
                  _: 2
                }, 1032, ["active", "disabled", "value", "onKeydown"]);
              }), 128))
            ], 512)
          ], 544),
          _ctx.$slots.footer ? (openBlock(), createElementBlock("div", _hoisted_8, [
            renderSlot(_ctx.$slots, "footer")
          ])) : createCommentVNode("v-if", true)
        ], 10, _hoisted_2$4), [
          [vShow, _ctx.visible]
        ])
      ]),
      _: 3
    }, 8, ["onAfterLeave"])
  ], 42, _hoisted_1$7)), [
    [_directive_click_outside, _ctx.onClickOutside]
  ]);
}
var style_scss_vue_type_style_index_0_src_lang$7 = "";
var index$7 = /* @__PURE__ */ _export_sfc(_sfc_main$7, [["render", render$7]]);
const componentName$6 = "ISidebar";
var _sfc_main$6 = defineComponent({
  name: componentName$6,
  mixins: [
    CollapsibleMixin
  ],
  provide() {
    return {
      sidebar: this
    };
  },
  props: {
    ariaLabel: {
      type: String,
      default: "Sidebar"
    },
    collapseOnItemClick: {
      type: Boolean,
      default: true
    },
    collapseOnClickOutside: {
      type: Boolean,
      default: true
    },
    collapsePosition: {
      type: String,
      default: "absolute"
    },
    color: {
      type: String,
      default: defaultPropValue(componentName$6, "color")
    },
    placement: {
      type: String,
      default: "left"
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$6, "size"),
      validator: sizePropValidator
    }
  },
  emits: [
    "update:modelValue"
  ],
  computed: {
    classes() {
      return __spreadProps(__spreadValues(__spreadValues({}, this.collapsibleClasses), colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size),
        [`-collapse-${this.collapsePosition}`]: true,
        [`-placement-${this.placement}`]: true
      });
    },
    sidebarWrapperTransition() {
      return this.collapsePosition !== "relative" ? "sidebar-wrapper-none-transition" : "sidebar-wrapper-transition";
    },
    sidebarTransition() {
      return this.collapsePosition !== "relative" ? "sidebar-transition" : "sidebar-none-transition";
    }
  },
  methods: {
    onItemClick() {
      if (this.collapseOnItemClick && this.open) {
        this.setOpen(false);
      }
    },
    onOverlayClick() {
      if (this.collapseOnClickOutside && this.open) {
        this.setOpen(false);
      }
    }
  }
});
const _hoisted_1$6 = ["aria-label"];
const _hoisted_2$3 = { class: "sidebar" };
const _hoisted_3$1 = { class: "sidebar-content" };
function render$6(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createBlock(Transition, { name: _ctx.sidebarWrapperTransition }, {
    default: withCtx(() => [
      withDirectives(createBaseVNode("aside", {
        role: "complementary",
        class: normalizeClass(["sidebar-wrapper", _ctx.classes]),
        "aria-label": _ctx.ariaLabel,
        ref: "wrapper"
      }, [
        createVNode(Transition, { name: _ctx.sidebarTransition }, {
          default: withCtx(() => [
            withDirectives(createBaseVNode("div", _hoisted_2$3, [
              createBaseVNode("div", _hoisted_3$1, [
                renderSlot(_ctx.$slots, "default")
              ])
            ], 512), [
              [vShow, _ctx.collapsePosition === "relative" || _ctx.open || !_ctx.collapsible]
            ])
          ]),
          _: 3
        }, 8, ["name"]),
        createVNode(Transition, { name: "sidebar-overlay-transition" }, {
          default: withCtx(() => [
            _ctx.collapsePosition !== "relative" ? withDirectives((openBlock(), createElementBlock("div", {
              key: 0,
              class: "sidebar-overlay",
              onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onOverlayClick && _ctx.onOverlayClick(...args))
            }, null, 512)), [
              [vShow, _ctx.open]
            ]) : createCommentVNode("v-if", true)
          ]),
          _: 1
        })
      ], 10, _hoisted_1$6), [
        [vShow, _ctx.open || !_ctx.collapsible]
      ])
    ]),
    _: 3
  }, 8, ["name"]);
}
var style_scss_vue_type_style_index_0_src_lang$6 = "";
var index$6 = /* @__PURE__ */ _export_sfc(_sfc_main$6, [["render", render$6]]);
const componentName$5 = "ITable";
var _sfc_main$5 = defineComponent({
  name: componentName$5,
  props: {
    border: {
      type: Boolean,
      default: false
    },
    condensed: {
      type: Boolean,
      default: false
    },
    striped: {
      type: Boolean,
      default: false
    },
    hover: {
      type: Boolean,
      default: false
    },
    responsive: {
      type: [Boolean, String],
      default: true
    },
    nowrap: {
      type: Boolean,
      default: false
    },
    color: {
      type: String,
      default: defaultPropValue(componentName$5, "color")
    }
  },
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        "-border": this.border,
        "-condensed": this.condensed,
        "-striped": this.striped,
        "-hover": this.hover,
        "-nowrap": this.nowrap,
        [`-responsive${typeof this.responsive === "boolean" ? "" : `-${this.responsive}`}`]: Boolean(this.responsive)
      });
    }
  }
});
const _hoisted_1$5 = { class: "table" };
function render$5(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["table-wrapper", _ctx.classes])
  }, [
    createBaseVNode("table", _hoisted_1$5, [
      renderSlot(_ctx.$slots, "default")
    ])
  ], 2);
}
var style_scss_vue_type_style_index_0_src_lang$5 = "";
var index$5 = /* @__PURE__ */ _export_sfc(_sfc_main$5, [["render", render$5]]);
const componentName$4 = "ITabs";
var _sfc_main$4 = defineComponent({
  name: componentName$4,
  provide() {
    return {
      tabs: this
    };
  },
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$4, "color")
    },
    modelValue: {
      type: String,
      default: ""
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$4, "size"),
      validator: sizePropValidator
    },
    stretch: {
      type: Boolean,
      default: false
    }
  },
  emits: [
    "update:modelValue"
  ],
  data() {
    return {
      active: this.modelValue,
      tabs: []
    };
  },
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size),
        "-stretch": this.stretch
      });
    }
  },
  watch: {
    modelValue(value) {
      this.active = value;
    }
  },
  methods: {
    setActive(id) {
      this.active = id;
      this.$emit("update:modelValue", this.active);
    }
  }
});
const _hoisted_1$4 = { class: "tabs-header" };
function render$4(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["tabs", _ctx.classes]),
    role: "tablist",
    "aria-multiselectable": "true"
  }, [
    createBaseVNode("div", _hoisted_1$4, [
      renderSlot(_ctx.$slots, "header")
    ]),
    renderSlot(_ctx.$slots, "default")
  ], 2);
}
var style_scss_vue_type_style_index_0_src_lang$4 = "";
var index$4 = /* @__PURE__ */ _export_sfc(_sfc_main$4, [["render", render$4]]);
const componentName$3 = "ITab";
var _sfc_main$3 = defineComponent({
  name: componentName$3,
  inject: {
    tabs: {
      default: () => ({})
    }
  },
  props: {
    title: {
      type: String,
      default: ""
    },
    name: {
      type: String,
      default() {
        return uid("tab");
      }
    }
  },
  computed: {
    active() {
      return this.tabs.active === this.name;
    },
    classes() {
      return {
        "-active": this.active
      };
    }
  }
});
const _hoisted_1$3 = ["name", "aria-hidden", "aria-labelledby"];
const _hoisted_2$2 = { class: "tab-body" };
function render$3(_ctx, _cache, $props, $setup, $data, $options) {
  return withDirectives((openBlock(), createElementBlock("div", {
    class: normalizeClass(["tab", _ctx.classes]),
    role: "tabpanel",
    name: _ctx.name,
    "aria-hidden": !_ctx.active,
    "aria-labelledby": `tab-heading-${_ctx.name}`
  }, [
    createBaseVNode("div", _hoisted_2$2, [
      renderSlot(_ctx.$slots, "default")
    ])
  ], 10, _hoisted_1$3)), [
    [vShow, _ctx.active]
  ]);
}
var style_scss_vue_type_style_index_0_src_lang$3 = "";
var index$3 = /* @__PURE__ */ _export_sfc(_sfc_main$3, [["render", render$3]]);
const componentName$2 = "ITabTitle";
var _sfc_main$2 = defineComponent({
  name: componentName$2,
  inject: {
    tabs: {
      default: () => ({})
    }
  },
  props: {
    for: {
      type: String,
      default() {
        return uid("tab");
      }
    }
  },
  computed: {
    active() {
      return this.tabs.active === this.for;
    },
    classes() {
      return {
        "-active": this.active
      };
    },
    name() {
      return this.for;
    }
  },
  methods: {
    onClick() {
      this.tabs.setActive(this.for);
    }
  }
});
const _hoisted_1$2 = ["for", "active", "aria-expanded", "aria-controls", "aria-describedby"];
function render$2(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["tab-title", _ctx.classes]),
    role: "tab",
    for: _ctx.name,
    active: _ctx.active,
    "aria-expanded": _ctx.active,
    "aria-controls": `tab-content-${_ctx.name}`,
    "aria-describedby": `tab-content-${_ctx.name}`,
    tabindex: "0",
    onClick: _cache[0] || (_cache[0] = (...args) => _ctx.onClick && _ctx.onClick(...args))
  }, [
    renderSlot(_ctx.$slots, "default")
  ], 10, _hoisted_1$2);
}
var style_scss_vue_type_style_index_0_src_lang$2 = "";
var index$2 = /* @__PURE__ */ _export_sfc(_sfc_main$2, [["render", render$2]]);
const componentName$1 = "IToggle";
var _sfc_main$1 = defineComponent({
  name: componentName$1,
  mixins: [
    FormComponentMixin
  ],
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName$1, "color")
    },
    disabled: {
      type: Boolean,
      default: false
    },
    indeterminate: {
      type: Boolean,
      default: false
    },
    value: {
      default: false
    },
    modelValue: {
      default: false
    },
    name: {
      type: [String, Number],
      default() {
        return uid("toggle");
      }
    },
    readonly: {
      type: Boolean,
      default: false
    },
    size: {
      type: String,
      default: defaultPropValue(componentName$1, "size"),
      validator: sizePropValidator
    },
    tabindex: {
      type: [Number, String],
      default: 0
    }
  },
  emits: [
    "update:modelValue"
  ],
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size),
        "-disabled": this.isDisabled,
        "-readonly": this.isReadonly
      });
    },
    checked() {
      if (this.schema) {
        return this.schema.value;
      }
      return this.modelValue;
    },
    tabIndex() {
      return this.isDisabled ? -1 : this.tabindex;
    }
  },
  methods: {
    clickInputRef() {
      if (this.isReadonly) {
        return;
      }
      this.$refs.input.click();
    },
    onChange(event) {
      var _a, _b;
      (_b = (_a = this.parent).onInput) == null ? void 0 : _b.call(_a, this.name, event.target.checked);
      this.$emit("update:modelValue", event.target.checked);
    },
    onBlur(event) {
      var _a, _b;
      (_b = (_a = this.parent).onBlur) == null ? void 0 : _b.call(_a, this.name, event);
    }
  }
});
const _hoisted_1$1 = ["checked", "disabled", "readonly", "aria-checked", "aria-disabled", "aria-readonly", "name"];
const _hoisted_2$1 = ["aria-checked", "aria-disabled", "aria-readonly", "tabindex"];
function render$1(_ctx, _cache, $props, $setup, $data, $options) {
  return openBlock(), createElementBlock("div", {
    class: normalizeClass(["toggle", _ctx.classes])
  }, [
    createBaseVNode("input", {
      ref: "input",
      type: "checkbox",
      checked: _ctx.checked,
      disabled: _ctx.isDisabled,
      readonly: _ctx.isReadonly,
      "aria-checked": _ctx.checked,
      "aria-disabled": _ctx.isDisabled,
      "aria-readonly": _ctx.isReadonly,
      name: _ctx.name,
      onChange: _cache[0] || (_cache[0] = (...args) => _ctx.onChange && _ctx.onChange(...args))
    }, null, 40, _hoisted_1$1),
    createBaseVNode("label", {
      class: "toggle-label",
      "aria-checked": _ctx.checked,
      "aria-disabled": _ctx.isDisabled,
      "aria-readonly": _ctx.isReadonly,
      tabindex: _ctx.tabIndex,
      onClick: _cache[1] || (_cache[1] = (...args) => _ctx.clickInputRef && _ctx.clickInputRef(...args)),
      onBlur: _cache[2] || (_cache[2] = (...args) => _ctx.onBlur && _ctx.onBlur(...args)),
      onKeydown: _cache[3] || (_cache[3] = withKeys(withModifiers((...args) => _ctx.clickInputRef && _ctx.clickInputRef(...args), ["stop", "prevent"]), ["space"]))
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 40, _hoisted_2$1)
  ], 2);
}
var style_scss_vue_type_style_index_0_src_lang$1 = "";
var index$1 = /* @__PURE__ */ _export_sfc(_sfc_main$1, [["render", render$1]]);
const componentName = "ITooltip";
var _sfc_main = defineComponent({
  name: componentName,
  directives: {
    ClickOutside: ClickOutsideDirective
  },
  mixins: [
    PopupMixin,
    PopupControlsMixin
  ],
  props: {
    color: {
      type: String,
      default: defaultPropValue(componentName, "color")
    },
    disabled: {
      type: Boolean,
      default: false
    },
    modelValue: {
      type: Boolean,
      default: false
    },
    name: {
      type: String,
      default() {
        return uid("tooltip");
      }
    },
    arrow: {
      type: Boolean,
      default: true
    },
    placement: {
      type: String,
      default: "top"
    },
    trigger: {
      type: [String, Array],
      default: () => ["hover", "focus"]
    },
    offset: {
      type: Number,
      default: 6
    },
    popperOptions: {
      type: Object,
      default: () => ({})
    },
    size: {
      type: String,
      default: defaultPropValue(componentName, "size"),
      validator: sizePropValidator
    }
  },
  emits: [
    "update:modelValue"
  ],
  computed: {
    classes() {
      return __spreadProps(__spreadValues({}, colorVariantClass(this)), {
        [`-${this.size}`]: Boolean(this.size)
      });
    }
  },
  methods: {
    onEscape() {
      this.visible = false;
      this.$emit("update:modelValue", false);
    },
    handleClickOutside() {
      this.visible = false;
      this.$emit("update:modelValue", false);
      this.onClickOutside();
    }
  }
});
const _hoisted_1 = ["id"];
const _hoisted_2 = ["aria-describedby", "aria-disabled", "aria-expanded"];
const _hoisted_3 = ["id", "aria-hidden"];
const _hoisted_4 = {
  key: 0,
  "data-popper-arrow": ""
};
function render(_ctx, _cache, $props, $setup, $data, $options) {
  const _directive_click_outside = resolveDirective("click-outside");
  return withDirectives((openBlock(), createElementBlock("div", {
    class: normalizeClass(["tooltip-wrapper", _ctx.classes]),
    ref: "wrapper",
    id: _ctx.name,
    onKeyup: _cache[0] || (_cache[0] = withKeys((...args) => _ctx.onEscape && _ctx.onEscape(...args), ["esc"]))
  }, [
    createBaseVNode("div", {
      class: "tooltip-trigger",
      ref: "trigger",
      "aria-describedby": `${_ctx.name}-popup`,
      "aria-disabled": _ctx.disabled ? "true" : "false",
      "aria-expanded": _ctx.visible ? "true" : "false"
    }, [
      renderSlot(_ctx.$slots, "default")
    ], 8, _hoisted_2),
    createVNode(Transition, {
      name: "zoom-in-top-transition",
      onAfterLeave: _ctx.destroyPopper
    }, {
      default: withCtx(() => [
        withDirectives(createBaseVNode("div", {
          class: "tooltip",
          ref: "popup",
          role: "tooltip",
          "aria-live": "polite",
          id: `${_ctx.name}-popup`,
          "aria-hidden": _ctx.visible ? "false" : "true"
        }, [
          _ctx.arrow ? (openBlock(), createElementBlock("span", _hoisted_4)) : createCommentVNode("v-if", true),
          renderSlot(_ctx.$slots, "body")
        ], 8, _hoisted_3), [
          [vShow, _ctx.visible]
        ])
      ]),
      _: 3
    }, 8, ["onAfterLeave"])
  ], 42, _hoisted_1)), [
    [_directive_click_outside, _ctx.onClickOutside]
  ]);
}
var style_scss_vue_type_style_index_0_src_lang = "";
var index = /* @__PURE__ */ _export_sfc(_sfc_main, [["render", render]]);
var components = /* @__PURE__ */ Object.freeze({
  __proto__: null,
  [Symbol.toStringTag]: "Module",
  IAlert: index$L,
  IBadge: index$K,
  IBreadcrumb: index$J,
  IButton,
  IButtonGroup: index$H,
  IColumn,
  IContainer,
  ICard: index$G,
  ICheckbox: index$F,
  ICollapsible: index$D,
  IDropdown: index$B,
  IForm: index$y,
  IHamburgerMenu,
  IHeader: index$u,
  IIcon,
  IInput,
  INumberInput: index$t,
  ITextarea: index$s,
  ILayout: index$r,
  ILayoutAside: index$q,
  ILayoutContent: index$p,
  ILayoutFooter: index$o,
  ILayoutHeader: index$n,
  IListGroup: index$m,
  ILoader,
  IMark,
  IMedia: index$k,
  IModal: index$j,
  INav: index$i,
  INavbar: index$g,
  IPagination: index$d,
  IPopover: index$c,
  IProgress: index$b,
  IRadio: index$9,
  IRow,
  ISelect: index$7,
  ISidebar: index$6,
  ITable: index$5,
  ITabs: index$4,
  IToggle: index$1,
  ITooltip: index,
  IBreadcrumbItem: index$I,
  ICheckboxGroup: index$E,
  ICollapsibleItem: index$C,
  IDropdownDivider: index$A,
  IDropdownItem: index$z,
  IFormGroup: index$x,
  IFormError: index$w,
  IFormLabel: index$v,
  IListGroupItem: index$l,
  INavItem: index$h,
  INavbarBrand: index$f,
  INavbarCollapsible: index$e,
  IProgressBar: index$a,
  IRadioGroup: index$8,
  ISelectOption,
  ITab: index$3,
  ITabTitle: index$2
});
export { Fragment as F, Inkline as I, Suspense as S, _export_sfc as _, app as a, resolveDynamicComponent as b, createBlock as c, createElementBlock as d, useHead as e, onErrorCaptured as f, computed as g, routing as h, createSSRApp as i, createHead as j, createRouter as k, components as l, createWebHistory as m, ref as n, openBlock as o, createBaseVNode as p, renderList as q, resolveComponent as r, createTextVNode as s, toDisplayString as t, unref as u, normalizeClass as v, withCtx as w, createVNode as x, pushScopeId as y, popScopeId as z };

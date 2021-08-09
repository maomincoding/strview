
'use strict';

// global object
const globalObj = {
    _nHtml: [],
    _oHtml: [],
    _el: null,
    _data: null,
    _template: null,
    _sourceTemplate: null,
    onceSetTemplate: null
};

// initialization
function createView(v) {
    globalObj._data = v.data;
    globalObj._template = v.template;
    globalObj._sourceTemplate = v.template;
    globalObj._el = v.el;
    document.querySelector(v.el).insertAdjacentHTML("beforeEnd", render(globalObj._template));
}

// event listeners
function eventListener(el, event, cb) {
    document.querySelector(el).addEventListener(event, cb);
}

// processing simple values
function ref() {
    return new Proxy(globalObj._data, {
        get: (target, key) => {
            return target[key]
        },
        set: (target, key, newValue) => {
            target[key] = newValue;
            setTemplate();
            return true;
        }
    })
}
// make it execute only once
globalObj.onceSetTemplate = once(setTemplate);

// reactiveHandlers
const reactiveHandlers = {
    get: (target, key) => {
        if (typeof target[key] === 'object' && target[key] !== null) {
            return new Proxy(target[key], reactiveHandlers);
        }
        return Reflect.get(target, key);
    },
    set: (target, key, value) => {
        Reflect.set(target, key, value);
        globalObj.onceSetTemplate();
        return true
    }
};

// respond to complex objects
function reactive() {
    return new Proxy(globalObj._data, reactiveHandlers)
}

// update the view
function setTemplate() {
    const oNode = document.querySelector(globalObj._el);
    const nNode = toHtml(render(globalObj._sourceTemplate, true));
    compile(oNode, 'o');
    compile(nNode, 'n');
    if (globalObj._oHtml.length === globalObj._nHtml.length) {
        for (let index = 0; index < globalObj._oHtml.length; index++) {
            const element = globalObj._oHtml[index];
            element.textContent !== globalObj._nHtml[index].textContent && (element.textContent = globalObj._nHtml[index].textContent);
        }
    }
}

// judge text node
function isTextNode(node) {
    return node.nodeType === 3;
}

// compile DOM
function compile(node, type) {
    const childNodesArr = node.childNodes;
    for (let index = 0; index < Array.from(childNodesArr).length; index++) {
        const item = Array.from(childNodesArr)[index];
        if (item.childNodes && item.childNodes.length) {
            compile(item, type);
        } else if (isTextNode(item) && item.textContent.trim().length !== 0) {
            type === 'o' ? globalObj._oHtml.push(item) : globalObj._nHtml.push(item);
        }
    }
}

// string to DOM
function toHtml(domStr) {
    const parser = new DOMParser();
    return parser.parseFromString(domStr, "text/html");
}

// type detection
function getType(v) {
    return Object.prototype.toString.call(v).match(/\[object (.+?)\]/)[1].toLowerCase();
}

// the function executes once
function once(fn) {
    let called = false;
    return function () {
        if (!called) {
            called = true;
            fn.apply(this, arguments)
        }
    }
}

// template engine
function render(template, type) {
    const reg = /\{(.+?)\}/;;
    if (reg.test(template)) {
        const key = reg.exec(template)[1];

        if (globalObj._data.hasOwnProperty(key)) {
            template = template.replace(reg, globalObj._data[key]);
        } else {
            template = template.replace(reg, eval(`globalObj._data.${key}`));
        }

        if (type) {
            return render(template, true)
        } else {
            return render(template)
        }
    }

    return template;
}

// export
export {
    createView,
    eventListener,
    getType,
    reactive,
    ref
}

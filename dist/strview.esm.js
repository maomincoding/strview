
'use strict';

const _nHtml = [];
const _oHtml = [];
let _el = null;
let _data = null;
let _template = null;
let _sourceTemplate = null;

// initialization
function createView(v) {
    _data = v.data;
    _template = v.template;
    _sourceTemplate = v.template;
    _el = v.el;
    document.querySelector(v.el).insertAdjacentHTML("beforeEnd", render());
}

// event listeners
function eventListener(el, event, cb) {
    document.querySelector(el).addEventListener(event, cb);
}

// Change state
function useState() {
    return new Proxy(_data, {
        get: (target, key) => {
            return target[key]
        },
        set: (target, key, newValue) => {
            if (newValue === target[key]) {
                return
            }
            target[key] = newValue;
            setTemplate(key);
            return true;
        }
    })
}

// update the view
function setTemplate() {
    const oNode = document.querySelector(_el);
    const nNode = toHtml(render(_sourceTemplate));
    compile(oNode, 'o');
    compile(nNode, 'n');
    if (_oHtml.length === _nHtml.length) {
        for (let index = 0; index < _oHtml.length; index++) {
            const element = _oHtml[index];
            element.textContent !== _nHtml[index].textContent && (element.textContent = _nHtml[index].textContent);
        }
    }
}

// Judge text node
function isTextNode(node) {
    return node.nodeType === 3;
}

// Compile DOM
function compile(node, type) {
    if (type === 'o') {
        let ochildNodes = node.childNodes;
        Array.from(ochildNodes).forEach((item) => {
            if (item.childNodes && item.childNodes.length) {
                compile(item, 'o');
            } else if (isTextNode(item) && item.textContent.trim().length !== 0) {
                _oHtml.push(item);
            }
        })
    } else if (type === 'n') {
        let nchildNodes = node.childNodes;
        Array.from(nchildNodes).forEach(item => {
            if (item.childNodes && item.childNodes.length) {
                compile(item, 'n');
            } else if (isTextNode(item) && item.textContent.trim().length !== 0) {
                _nHtml.push(item);
            }
        })
    }
}

// String to DOM
function toHtml(domStr) {
    const parser = new DOMParser();
    return parser.parseFromString(domStr, "text/html");
}

// template engine
function render(template) {
    const reg = /\{(\w+)\}/;
    if (template) {
        if (reg.test(template)) {
            const name = reg.exec(template)[1];
            template = template.replace(reg, _data[name]);
            return render(template);
        }
        return template;
    } else {
        if (reg.test(_template)) {
            const name = reg.exec(_template)[1];
            _template = _template.replace(reg, _data[name]);
            return render();
        }
        return _template;
    }

}

// export
export {
    createView,
    eventListener,
    useState,
    setTemplate,
    isTextNode,
    compile,
    toHtml,
    render
}

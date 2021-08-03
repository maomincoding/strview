'use strict';
class Strview {
    // 初始化
    constructor(v) {
        this._nHtml = [];
        this._oHtml = [];
        this._el = v.el;
        this._data = v.data;
        this._template = v.template;
        this._sourceTemplate = v.template;
        document.querySelector(v.el).insertAdjacentHTML("beforeEnd", this.render());
    }
    // 改变状态
    useState() {
        return new Proxy(this._data, {
            get: (target, key) => {
                return target[key]
            },
            set: (target, key, newValue) => {
                if (newValue === target[key]) {
                    return
                }
                target[key] = newValue;
                this.setTemplate(key);
                return true;
            }
        })
    }
    // 更新视图
    setTemplate() {
        const oNode = document.querySelector(this._el);
        const nNode = this.toHtml(this.render(this._sourceTemplate));
        this.compile(oNode, 'o'); // 编译旧Node
        this.compile(nNode, 'n'); // 编译新Node
        if (this._oHtml.length === this._nHtml.length) {
            for (let index = 0; index < this._oHtml.length; index++) {
                const element = this._oHtml[index];
                element.textContent !== this._nHtml[index].textContent && (element.textContent = this._nHtml[index].textContent);
            }
        }
    }
    // 判断文本节点
    isTextNode(node) {
        return node.nodeType === 3;
    }
    // 编译DOM
    compile(node, type) {
        if (type === 'o') {
            let ochildNodes = node.childNodes;
            Array.from(ochildNodes).forEach((item) => {
                if (item.childNodes && item.childNodes.length) {
                    this.compile(item, 'o');
                } else if (this.isTextNode(item) && item.textContent.trim().length !== 0) {
                    this._oHtml.push(item);
                }
            })
        } else if (type === 'n') {
            let nchildNodes = node.childNodes;
            Array.from(nchildNodes).forEach(item => {
                if (item.childNodes && item.childNodes.length) {
                    this.compile(item, 'n');
                } else if (this.isTextNode(item) && item.textContent.trim().length !== 0) {
                    this._nHtml.push(item);
                }
            })
        }
    }
    // 字符串转DOM
    toHtml(domStr) {
        const parser = new DOMParser();
        return parser.parseFromString(domStr, "text/html");
    }
    // 模板引擎
    render(template) {
        const reg = /\{(\w+)\}/;
        if (template) {
            if (reg.test(template)) {
                const name = reg.exec(template)[1];
                template = template.replace(reg, this._data[name]);
                return this.render(template);
            }
            return template;
        } else {
            if (reg.test(this._template)) {
                const name = reg.exec(this._template)[1];
                this._template = this._template.replace(reg, this._data[name]);
                return this.render();
            }
            return this._template;
        }

    }
}

export default Strview
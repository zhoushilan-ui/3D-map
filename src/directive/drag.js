import $ from 'jquery'

let elNames = [];                                                   // 绑定v-drag指令的元素传递过来的name值
let posi = { el: null,x: null,y: null,l: null,t: null };            // 记录dom元素、鼠标位置和元素位置的object

// 挂载鼠标划过事件到全局
window.onmousemove = function (e) {
    if (!posi.el) return;

    posi.el.style.left = posi.l + (e.clientX - posi.x) + 'px';
    posi.el.style.top = posi.t + (e.clientY - posi.y) + 'px';
}

// 指令体
let drag = {};
// bind: 指令绑定到元素时调用
drag['bind'] = function (el,binding) {
    let dragName ,elInfo;    // DOM相关信息
    setTimeout(() => {
        el = el.parentNode;
        dragName = binding.expression;
        elInfo = el.getBoundingClientRect();
    })
    $(el).on('mousedown',function (e) {
        posi = {
            el,
            x: e.clientX,
            y: e.clientY,
            l: el.getBoundingClientRect().x,
            t: el.getBoundingClientRect().y
        }
        // 设置被拖拽元素的位置为绝对定位相关元素
        posi.el.style.cursor = 'grabbing';
        if (posi.el.style.left == '') {
            posi.el.style['width'] = el.getBoundingClientRect().width + 'px';
            posi.el.style['height'] = el.getBoundingClientRect().height + 'px';
            posi.el.style.left = posi.l + 'px';
            posi.el.style.top = posi.t + 'px';
            posi.el.style.position = 'fixed';
            posi.el.style['z-index'] = 1000;
        }
    });
    $(el).on('mouseup',function (e) {
        posi.el.style.cursor = 'auto';

        let tmpInfo = {
            top: posi.el.getBoundingClientRect().top,
            left: posi.el.getBoundingClientRect().left,
        };
        localStorage.setItem('drag-' + dragName,JSON.stringify(tmpInfo))

        // 释放posi
        posi = { el: null,x: null,y: null,l: null,t: null };
    });
}

export default drag;
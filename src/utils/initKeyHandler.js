let keyDown = {
    graph: null,        // mxgraph实例
    keyHandler: null,   // 键盘事件监听
    undoMng: null,      // 状态管理器
}
// init回调函数：初始化状态管理器
function _initUndoManger() {
    // 创建了一个撤销管理器，可以实现操作的撤销
    keyDown.undoMng = new mxUndoManager();

    // 这个函数是给下面的监听用的
    let listen = (sender,evt) => {
        keyDown.undoMng.undoableEditHappened(evt.getProperty('edit'))
    }
    // 对graph面板添加监听
    // getModel: 返回包含单元格的mxGraphModel。
    // addListener: 将指定的函数绑定到给定的事件名。如果没有提供事件名称，则为所有事件注册侦听器。
    // 侦听器的参数是发送器和mxEventObject
    keyDown.graph.getModel().addListener(mxEvent.UNDO,listen)
    keyDown.graph.getView().addListener(mxEvent.UNDO,listen)
}
function init(graph) {
    keyDown.graph = graph;
    keyDown.keyHandler = new mxKeyHandler(graph);
    _delete();
    _initUndoManger();
    _ctrlZ();
    _ctrlY();
    _ctrlV();
    _ctrlC();
    _ctrlX();
    _Arrows();
    _ShiftArrows();
    _CtrlArrows();
    _CtrlShiftArrows();
    _SelectAll();
    _ArrowRotate();
    _ArrowShiftRotate();
    return keyDown;
}
function _ctrlZ() {
    keyDown.keyHandler.bindControlKey(90,() => {
        keyDown.undoMng.undo();
    })
}
function _SelectAll() {
    keyDown.keyHandler.bindControlKey(65,() => {
        keyDown.graph.selectAll();
    })
}
function _ctrlY() {
    keyDown.keyHandler.bindControlKey(89,() => {
        keyDown.undoMng.redo();
    })
}
function _ctrlC() {
    keyDown.keyHandler.bindControlKey(67,() => {
        mxClipboard.copy(keyDown.graph,keyDown.graph.getSelectionCells());
    })
}
function _ctrlV() {
    keyDown.keyHandler.bindControlKey(86,() => {
        mxClipboard.paste(keyDown.graph);
    })
}
function _ctrlX() {
    keyDown.keyHandler.bindControlKey(88,() => {
        mxClipboard.copy(keyDown.graph,keyDown.graph.getSelectionCells());
        keyDown.graph.removeCells(keyDown.graph.getSelectionCells(),false)
    })
}
function _delete() {
    keyDown.keyHandler.bindKey(46,() => {
        keyDown.graph.removeCells(keyDown.graph.getSelectionCells(),true)
    })
    keyDown.keyHandler.bindKey(8,() => {
        keyDown.graph.removeCells(keyDown.graph.getSelectionCells(),false)
    })
}
function _Arrows() {
    keyDown.keyHandler.bindKey(37,() => {
        keyDown.graph.getSelectionCells().forEach(item => {
            if (!item.vertex) return;
            item.geometry.x -= 1;
            keyDown.graph.refresh();
        })
    })
    keyDown.keyHandler.bindKey(38,() => {
        keyDown.graph.getSelectionCells().forEach(item => {
            if (!item.vertex) return;
            item.geometry.y -= 1;
            keyDown.graph.refresh();
        })
    })
    keyDown.keyHandler.bindKey(39,() => {
        keyDown.graph.getSelectionCells().forEach(item => {
            if (!item.vertex) return;
            item.geometry.x += 1;
            keyDown.graph.refresh();
        })
    })
    keyDown.keyHandler.bindKey(40,() => {
        keyDown.graph.getSelectionCells().forEach(item => {
            if (!item.vertex) return;
            item.geometry.y += 1;
            keyDown.graph.refresh();
        })
    })
}
function _ShiftArrows() {
    keyDown.keyHandler.bindShiftKey(37,() => {
        keyDown.graph.getSelectionCells().forEach(item => {
            if (!item.vertex) return;
            item.geometry.x -= 10;
            keyDown.graph.refresh();
        })
    })
    keyDown.keyHandler.bindShiftKey(38,() => {
        keyDown.graph.getSelectionCells().forEach(item => {
            if (!item.vertex) return;
            item.geometry.y -= 10;
            keyDown.graph.refresh();
        })
    })
    keyDown.keyHandler.bindShiftKey(39,() => {
        keyDown.graph.getSelectionCells().forEach(item => {
            if (!item.vertex) return;
            item.geometry.x += 10;
            keyDown.graph.refresh();
        })
    })
    keyDown.keyHandler.bindShiftKey(40,() => {
        keyDown.graph.getSelectionCells().forEach(item => {
            if (!item.vertex) return;
            item.geometry.y += 10;
            keyDown.graph.refresh();
        })
    })
}
function _CtrlArrows() {
    // ctrl + 左上右下
    keyDown.keyHandler.bindControlKey(37,() => {
        keyDown.graph.getSelectionCells().forEach(item => {
            if (!item.vertex || item.geometry.width < 1) return;
            item.geometry.width -= 1;
            keyDown.graph.refresh();
        })
    })
    keyDown.keyHandler.bindControlKey(38,() => {
        keyDown.graph.getSelectionCells().forEach(item => {
            if (!item.vertex) return;
            item.geometry.height += 1;
            // item.geometry.y -= 1;
            keyDown.graph.refresh();
        })
    })
    keyDown.keyHandler.bindControlKey(39,() => {
        keyDown.graph.getSelectionCells().forEach(item => {
            if (!item.vertex) return;
            item.geometry.width += 1;
            keyDown.graph.refresh();
        })
    })
    keyDown.keyHandler.bindControlKey(40,() => {
        keyDown.graph.getSelectionCells().forEach(item => {
            if (!item.vertex || item.geometry.height < 1) return;
            item.geometry.height -= 1;
            // item.geometry.y += 1;
            keyDown.graph.refresh();
        })
    })
}
function _CtrlShiftArrows() {
    // ctrl + 左上右下
    keyDown.keyHandler.bindControlShiftKey(37,() => {
        keyDown.graph.getSelectionCells().forEach(item => {
            if (!item.vertex || item.geometry.width < 1) return;
            item.geometry.width -= 10;
            keyDown.graph.refresh();
        })
    })
    keyDown.keyHandler.bindControlShiftKey(38,() => {
        keyDown.graph.getSelectionCells().forEach(item => {
            if (!item.vertex) return;
            item.geometry.height += 10;
            // item.geometry.y -= 10;
            keyDown.graph.refresh();
        })
    })
    keyDown.keyHandler.bindControlShiftKey(39,() => {
        keyDown.graph.getSelectionCells().forEach(item => {
            if (!item.vertex) return;
            item.geometry.width += 10;
            keyDown.graph.refresh();
        })
    })
    keyDown.keyHandler.bindControlShiftKey(40,() => {
        keyDown.graph.getSelectionCells().forEach(item => {
            if (!item.vertex || item.geometry.height < 1) return;
            item.geometry.height -= 10;
            // item.geometry.y += 10;
            keyDown.graph.refresh();
        })
    })
}
function _ArrowRotate() {
    keyDown.keyHandler.bindKey(192,() => {
        if (keyDown.graph.getSelectionCells().length != 1 || !keyDown.graph.getSelectionCells()[0].vertex) return;
        if (!keyDown.graph.getSelectionCells()[0].style || keyDown.graph.getSelectionCells()[0].style.indexOf('rotation') == -1) {
            // 无相关样式
            keyDown.graph.getSelectionCells()[0].style += ';rotation=-1';
        } else {
            // 存在旋转样式
            let arr = keyDown.graph.getSelectionCells()[0].style.split(';');
            let arrIndex = arr.findIndex(item => item.indexOf('rotation') != -1);
            let num = parseInt(arr[arrIndex].substring(9)) - 1;
            arr[arrIndex] = arr[arrIndex].slice(0,9) + num;
            keyDown.graph.getSelectionCells()[0].style = arr.join(';');
        }
        keyDown.graph.refresh();
    })
    keyDown.keyHandler.bindKey(187,() => {
        if (keyDown.graph.getSelectionCells().length != 1 || !keyDown.graph.getSelectionCells()[0].vertex) return;
        if (!keyDown.graph.getSelectionCells()[0].style || keyDown.graph.getSelectionCells()[0].style.indexOf('rotation') == -1) {
            // 无相关样式
            keyDown.graph.getSelectionCells()[0].style += ';rotation=-1';
        } else {
            // 存在旋转样式
            let arr = keyDown.graph.getSelectionCells()[0].style.split(';');
            let arrIndex = arr.findIndex(item => item.indexOf('rotation') != -1);
            let num = parseInt(arr[arrIndex].substring(9)) + 1;
            arr[arrIndex] = arr[arrIndex].slice(0,9) + num;
            keyDown.graph.getSelectionCells()[0].style = arr.join(';');
        }
        keyDown.graph.refresh();
    })
}
function _ArrowShiftRotate() {
    keyDown.keyHandler.bindShiftKey(192,() => {
        if (keyDown.graph.getSelectionCells().length != 1 || !keyDown.graph.getSelectionCells()[0].vertex) return;
        if (!keyDown.graph.getSelectionCells()[0].style || keyDown.graph.getSelectionCells()[0].style.indexOf('rotation') == -1) {
            // 无相关样式
            keyDown.graph.getSelectionCells()[0].style += ';rotation=-10';
        } else {
            // 存在旋转样式
            let arr = keyDown.graph.getSelectionCells()[0].style.split(';');
            let arrIndex = arr.findIndex(item => item.indexOf('rotation') != -1);
            let num = parseInt(arr[arrIndex].substring(9)) - 10;
            arr[arrIndex] = arr[arrIndex].slice(0,9) + num;
            keyDown.graph.getSelectionCells()[0].style = arr.join(';');
        }
        keyDown.graph.refresh();
    })
    keyDown.keyHandler.bindShiftKey(187,() => {
        if (keyDown.graph.getSelectionCells().length != 1 || !keyDown.graph.getSelectionCells()[0].vertex) return;
        if (!keyDown.graph.getSelectionCells()[0].style || keyDown.graph.getSelectionCells()[0].style.indexOf('rotation') == -1) {
            // 无相关样式
            keyDown.graph.getSelectionCells()[0].style += ';rotation=-10';
        } else {
            // 存在旋转样式
            let arr = keyDown.graph.getSelectionCells()[0].style.split(';');
            let arrIndex = arr.findIndex(item => item.indexOf('rotation') != -1);
            let num = parseInt(arr[arrIndex].substring(9)) + 10;
            arr[arrIndex] = arr[arrIndex].slice(0,9) + num;
            keyDown.graph.getSelectionCells()[0].style = arr.join(';');
        }
        keyDown.graph.refresh();
    })
}
export default init;
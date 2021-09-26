<template>
  <div class='app-container'>
    <div class="func-wra">
      <div @click="open" class="func-item type1">
        <img :src="svgBtn.find(item => item.indexOf('open') != -1)" alt="" />
        <br />
        <span>打开</span>
      </div>
      <div @click="create" class="func-item type1">
        <img :src="svgBtn.find(item => item.indexOf('save') != -1)" alt="" />
        <br />
        <span>创建</span>
      </div>
      <div @click="save()" class="func-item type1">
        <img :src="svgBtn.find(item => item.indexOf('save') != -1)" alt="" />
        <br />
        <span>保存</span>
      </div>
    </div>
    <div class="func-wra">
      <div @click="ctrlC" class="func-item type2">
        <img :src="svgBtn.find(item => item.indexOf('copy') != -1)" alt="" />
        <span>复制</span>
      </div>
      <br />
      <div @click="ctrlX" class="func-item type2">
        <img :src="svgBtn.find(item => item.indexOf('cut') != -1)" alt="" />
        <span>剪切</span>
      </div>
    </div>
    <div class="func-wra">
      <div @click="ctrlV" class="func-item type2">
        <img :src="svgBtn.find(item => item.indexOf('ctrlV') != -1)" alt="" />
        <span>粘贴</span>
      </div>
      <br />
      <div @click="ctrlCV" class="func-item type2">
        <img :src="svgBtn.find(item => item.indexOf('copy') != -1)" alt="" />
        <span>重复</span>
      </div>
    </div>
    <div class="func-wra">
      <div @click="ctrlZ" class="func-item type2">
        <img :src="svgBtn.find(item => item.indexOf('ctrlZY') != -1)" alt="" />
        <span>撤销</span>
      </div>
      <br />
      <div @click="ctrlY" class="func-item type2">
        <img :src="svgBtn.find(item => item.indexOf('ctrlZY') != -1)" alt="" style="transform:rotateY(180deg)" />
        <span>重做</span>
      </div>
    </div>
    <div class="func-wra">
      <div @click="del" class="func-item type1">
        <img :src="svgBtn.find(item => item.indexOf('delete') != -1)" alt="" />
        <br />
        <span>删除</span>
      </div>
    </div>
    <div class="func-wra">
      <div class="func-item type3">
        <div @click="alignLeft" class="type3-item-wra">
          <img :src="svgBtn.find(item => item.indexOf('align-left') != -1)" alt="" />
        </div>
        <i></i>
        <div @click="alignCenter" class="type3-item-wra">
          <img :src="svgBtn.find(item => item.indexOf('align-center') != -1)" alt="" />
        </div>
        <i></i>
        <div @click="alignRight" class="type3-item-wra">
          <img :src="svgBtn.find(item => item.indexOf('align-right') != -1)" alt="" />
        </div>
      </div>
      <br />
      <div class="func-item type3">
        <div @click="alignTop" class="type3-item-wra">
          <img :src="svgBtn.find(item => item.indexOf('align-top') != -1)" alt="" />
        </div>
        <i></i>
        <div @click="alignMiddle" class="type3-item-wra">
          <img :src="svgBtn.find(item => item.indexOf('align-middle') != -1)" alt="" />
        </div>
        <i></i>
        <div @click="alignBottom" class="type3-item-wra">
          <img :src="svgBtn.find(item => item.indexOf('align-bottom') != -1)" alt="" />
        </div>
      </div>
    </div>

    <div class="func-wra">
      <div @click="zTop" class="func-item type2">
        <img :src="svgBtn.find(item => item.indexOf('indextop') != -1)" alt="" />
        <span>置于顶层</span>
      </div>
      <br />
      <div @click="zBot" class="func-item type2">
        <img :src="svgBtn.find(item => item.indexOf('indexbot') != -1)" alt="" style="transform:rotateY(180deg)" />
        <span>置于底层</span>
      </div>
    </div>
    <div class="func-wra">
      <div @click="group" class="func-item type2">
        <img :src="svgBtn.find(item => item.indexOf('group') != -1)" alt="" />
        <span>组合</span>
      </div>
      <br />
      <div @click="ungroup" class="func-item type2">
        <img :src="svgBtn.find(item => item.indexOf('groupno') != -1)" alt="" style="transform:rotateY(180deg)" />
        <span>取消组合</span>
      </div>
    </div>
    <div class="func-wra">
      <div @click="exportImage" class="func-item type1">
        <img :src="svgBtn.find(item => item.indexOf('weitu') != -1)" alt="" />
        <br />
        <span>预览</span>
      </div>
    </div>
    <div class="func-wra">
      <div @click="zoomIn" class="func-item type2">
        <img :src="svgBtn.find(item => item.indexOf('zoom-in') != -1)" alt="" />
        <span>放大</span>
      </div>
      <br />
      <div @click="zoomOut" class="func-item type2">
        <img :src="svgBtn.find(item => item.indexOf('zoom-out') != -1)" alt="" style="transform:rotateY(180deg)" />
        <span>缩小</span>
      </div>
    </div>
    <div class="func-wra">
      <div @click="collapse" class="func-item type2">
        <img :src="svgBtn.find(item => item.indexOf('zhedie') != -1)" alt="" style="transform:rotateY(180deg)" />
        <span>折叠</span>
      </div>
      <br />
      <div @click="expand" class="func-item type2">
        <img :src="svgBtn.find(item => item.indexOf('zhankai') != -1)" alt="" />
        <span>展开</span>
      </div>
    </div>
    <div class="func-wra">
      <div @click="editcoverage" class="func-item type1">
        <img :src="svgBtn.find(item => item.indexOf('img-index') != -1)" alt="" />
        <br />
        <span>图层</span>
      </div>
    </div>
    <div class="func-wra">
      <div @click="thatKeys" class="func-item type1">
        <img :src="svgBtn.find(item => item.indexOf('key') != -1)" alt="" />
        <br />
        <span>键位</span>
      </div>
    </div>
  </div>
</template>

<script>
import svgBtn from '@/assets/iconBtn'
import $ from 'jquery'

export default {
  name: 'topfunc',
  props: ["editor","graph","detailParent","parent","undoMng"],
  data() {
    return {
      svgBtn,
      num: 0,
      dialogVisible: false,
      allNames: [],
      keyInfo: [
        { key: ['delete'],info: '连体删除(删除关联的箭头)' },
        { key: ['Backspace'],info: '单体删除(保留关联的箭头)' },
        { key: ['Ctrl','A'],info: '全选' },
        { key: ['Ctrl','C'],info: '复制当前选中的单元格' },
        { key: ['Ctrl','X'],info: '剪切当前选中的单元格' },
        { key: ['Ctrl','V'],info: '粘贴单元格' },
        { key: ['Ctrl','Z'],info: '撤回' },
        { key: ['Ctrl','Y'],info: '撤销撤回' },
        { key: ['←'],info: '当前选中的单元格左移' },
        { key: ['↑'],info: '当前选中的单元格上移' },
        { key: ['→'],info: '当前选中的单元格右移' },
        { key: ['↓'],info: '当前选中的单元格下移' },
        { key: ['Shift','←'],info: '当前选中的单元格<b><i>迅速</i></b>左移' },
        { key: ['Shift','→'],info: '当前选中的单元格<b><i>迅速</i></b>右移' },
        { key: ['Shift','↑'],info: '当前选中的单元格<b><i>迅速</i></b>上移' },
        { key: ['Shift','↓'],info: '当前选中的单元格<b><i>迅速</i></b>下移' },
        { key: ['Ctrl','←'],info: '当前选中单元格的宽度减少' },
        { key: ['Ctrl','→'],info: '当前选中单元格的宽度增加' },
        { key: ['Ctrl','↑'],info: '当前选中单元格的高度增加' },
        { key: ['Ctrl','↓'],info: '当前选中单元格的高度减少' },
        { key: ['Shift','Ctrl','←'],info: '当前选中单元格的宽度<b><i>迅速</i></b>减少' },
        { key: ['Shift','Ctrl','→'],info: '当前选中单元格的宽度<b><i>迅速</i></b>增加' },
        { key: ['Shift','Ctrl','↑'],info: '当前选中单元格的高度<b><i>迅速</i></b>增加' },
        { key: ['Shift','Ctrl','↓'],info: '当前选中单元格的高度<b><i>迅速</i></b>减少' },
        { key: ['Shift','Ctrl','↓'],info: '当前选中单元格的高度<b><i>迅速</i></b>减少' },
        { key: ['~'],info: '当前选中的单元格逆时针进行旋转' },
        { key: ['='],info: '当前选中单元格顺时针进行旋转' },
        { key: ['Shift','~'],info: '当前选中的单元格逆时针<b><i>迅速</i></b>进行旋转' },
        { key: ['Shift','='],info: '当前选中单元格顺时针<b><i>迅速</i></b>进行旋转' },
      ],
    };
  },
  created() { },
  mounted() {
    mxEditor.prototype.dblClickAction = 'save';
    mxEdgeHandler.prototype.addEnabled = true;
    mxEdgeHandler.prototype.removeEnabled = true;
    setTimeout(() => {
      this.graph.setDropEnabled(false);
    })
  },
  methods: {
    open() {
      if (!localStorage.getItem('allMxNamesList')) {
        // 没有存储任何内容
        this.$message({
          message: '您还没有存储过任何文件',
          type: 'warning'
        });
        return;
      }
      let name = '';  // 即将被打开的文件的文件名
      // 清空选中的span样式
      $('span.mx-name-list-item').removeClass('active');
      let tmpname = localStorage.getItem('allMxNamesList').split(';');
      this.allNames = [];
      tmpname.forEach((item,i) => {
        let index = item.indexOf('=')
        this.allNames.push({ lab: item.substring(0,index),val: item.substring(index + 1) })
      })
      //   this.dialogVisible = true;
      let msg = '';
      this.allNames.forEach(item => {
        msg += `
          <b>
            <span class="mx-name-list-item">${item.val}</span>
          </b>
          `
      })
      this.alertName = this.$alert(msg,'现有文件',{
        dangerouslyUseHTMLString: true
      }).then(res => {
        if (!name) {
          this.$message.error('未选择任何内容');
          return;
        }
        this.$confirm('是否存储当前内容','询问',{
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          return this.save();
        },() => {
          this.loadXMLbyLocalStorage(name);
        }).then(() => {
          this.graph.selectAll();
          this.graph.removeCells(this.graph.getSelectionCells());
          this.loadXMLbyLocalStorage(name);
        })
      },() => { });
      this.$nextTick(() => {
        document.querySelectorAll('.mx-name-list-item').forEach(item => {
          let that = this;
          item.onclick = function () {
            $(this).addClass('active').parent().siblings().find('span').removeClass('active');
            name = that.allNames.find(item => item.val == $(this).text()).lab;
          }
        })
      })
    },
    // 读取LocalStorage中的文件并写入
    loadXMLbyLocalStorage(name) {
      let Xml = localStorage.getItem(name);

      const xmlDocument = mxUtils.parseXml(Xml);
      const decoder = new mxCodec(xmlDocument);
      const node = xmlDocument.documentElement;
      decoder.decode(node,this.graph.getModel());
    },
    save(is = false) {
      const encoder = new mxCodec();
      const result = encoder.encode(this.graph.getModel());

      // 返回一个相当漂亮的打印字符串，该字符串表示给定节点的XML树。此方法应该只用于打印XML以供读取，而使用getXml来获取用于处理的字符串。
      let mxstr = mxUtils.getPrettyXml(result);
      return this.$prompt((is ? '名称重复，' : '') + '请输入新的名称','提示',{
        confirmButtonText: '确定',
        cancelButtonText: '取消',
      }).then(({ value }) => {
        if (localStorage.getItem('allMxNamesList') && localStorage.getItem('allMxNamesList').indexOf(value) != -1) {
          this.save(true);
          return;
        }
        if (value.indexOf(';') != -1) {
          alert('严重违规字符，请重新输入');
          this.save();
          return;
        }
        let strName = 'mx' + localStorage.length;
        localStorage.setItem('allMxNamesList',(localStorage.getItem('allMxNamesList') ? (localStorage.getItem('allMxNamesList') + ';') : '') + strName + '=' + value);
        localStorage.setItem(strName,mxstr);
        this.$message({
          message: '文件保存成功',
          type: 'success'
        });
      }).catch(() => { });

    },
    create() {
      ++this.num;
      var v1 = this.graph.insertVertex(this.parent,'','Hello',Number(((this.num) + ((Math.random() * 1080))).toFixed(2)),Number(((this.num) + ((Math.random() * 570))).toFixed(2)),80,30,'rotation=' + Number((Math.random() * 360).toFixed(2)) + ';');
      ++this.num;
      var v2 = this.graph.insertVertex(this.parent,'','World',Number(((this.num) + ((Math.random() * 1080))).toFixed(2)),Number(((this.num) + ((Math.random() * 570))).toFixed(2)),80,30,'fontFamily=Times New Roman;edgeStyle=isometricEdgeStyle;elbow=vertical;');
      ++this.num;
      var v3 = this.graph.insertVertex(this.parent,'','everyBody!',Number(((this.num) + ((Math.random() * 1080))).toFixed(2)),Number(((this.num) + ((Math.random() * 570))).toFixed(2)),60,60,'sketch=1;opacity=' + Number((Math.random() * 100).toFixed(2)));
      this.graph.insertEdge(v1,'','',v1,v2,'dashed=1;dashPattern=11 11 11 11 11 1 1 25;');
      this.graph.insertEdge(v2,'','',v2,v3,'edgeStyle=segmentEdgeStyle;edgeStyle=isometricEdgeStyle;elbow=vertical;');
      this.graph.insertEdge(v3,'','',v3,v1,'bendable=1;');
    },
    ctrlC() {
      mxClipboard.copy(this.graph,this.graph.getSelectionCells());
    },
    ctrlX() {
      mxClipboard.copy(this.graph,this.graph.getSelectionCells());
      this.graph.removeCells(this.graph.getSelectionCells(),false)
    },
    ctrlV() {
      mxClipboard.paste(this.graph);
    },
    ctrlCV() {
      this.ctrlC();
      this.ctrlV();
    },
    ctrlZ() {
      this.undoMng.undo();
    },
    ctrlY() {
      this.undoMng.redo();
    },
    del() {
      this.graph.removeCells(this.graph.getSelectionCells(),false);
    },
    alignLeft() {
      this.editor.actions.alignCellsLeft(this.editor);
    },
    alignCenter() {
      this.editor.actions.alignCellsCenter(this.editor);
    },
    alignRight() {
      this.editor.actions.alignCellsRight(this.editor);
    },
    alignTop() {
      this.editor.actions.alignCellsTop(this.editor);
    },
    alignMiddle() {
      this.editor.actions.alignCellsMiddle(this.editor);
    },
    alignBottom() {
      this.editor.actions.alignCellsBottom(this.editor);
    },
    zTop() {
      this.editor.actions.toFront(this.editor)
    },
    zBot() {
      this.editor.actions.toBack(this.editor)
    },
    // 分组
    group() {
      this.editor.actions.group(this.editor)
    },
    // 取消分组
    ungroup() {
      this.editor.actions.ungroup(this.editor)
    },
    exportImage() {
      this.editor.actions.exportImage(this.editor)
    },
    zoomIn() {
      this.graph.zoomIn()
    },
    zoomOut() {
      this.graph.zoomOut()
    },
    collapse() {
      this.editor.actions.collapse(this.editor)
    },
    expand() {
      this.editor.actions.expand(this.editor)
    },
    editcoverage() {
      this.$emit('changeCoverage', true);
    },
    // 按键说明
    thatKeys() {
      let msg = `
      <ul class="key-info-wra" style="border-right: 1px solid #333;">
      ${(() => {
          let sre = '';
          this.keyInfo.slice(0,Math.ceil(this.keyInfo.length / 2)).forEach((item,i) => {
            sre += `
                <li>
                <div class="keys-wra">
                    ${((keys) => {
                let keyst = `<span class="key">${keys[0]}</span>`;
                for (var i = 1; i < keys.length; i++) {
                  keyst += ` + <span class="key">${keys[i]}</span>`
                }
                return keyst
              })(item.key)}
                </div>
                    <span class="info">${item.info}</span>
                </li>
            `
          })
          return sre
        })()}
      </ul>
      <ul class="key-info-wra" style="padding-left: 30px;">
      ${(() => {
          let sre = '';
          this.keyInfo.slice(Math.ceil(this.keyInfo.length / 2)).forEach((item,i) => {
            sre += `
                <li>
                <div class="keys-wra">
                    ${((keys) => {
                let keyst = `<span class="key">${keys[0]}</span>`;
                for (var i = 1; i < keys.length; i++) {
                  keyst += ` + <span class="key">${keys[i]}</span>`
                }
                return keyst
              })(item.key)}
                </div>
                    <span class="info">${item.info}</span>
                </li>
            `
          })
          return sre
        })()}
      </ul>
      `;
      this.alertName = this.$alert(msg,'快捷键说明',{
        dangerouslyUseHTMLString: true
      }).catch(() => { })
    },
  }
};
</script>

<style scoped lang="scss">
.app-container {
  background: #3d3f47;
  color: #fff;
  padding-left: 10px;
  padding-top: 3px;
  text-align: left;
  box-sizing: border-box;

  .func-wra {
    display: inline-block;
    height: calc(100% - 3px);
    vertical-align: middle;
    margin-right: 5px;
  }

  .func-item {
    height: 100%;
    box-sizing: border-box;
    font-size: 0;
    display: inline-block;
    padding: 0 10px;
    border-radius: 5px;
    cursor: pointer;

    &:hover {
      background: #000;
    }
    &:active {
      background: #ccc;
    }
    &.type1 {
      padding-top: 9px;

      img {
        height: 50%;
      }
      span {
        white-space: nowrap;
        font-size: 15px;
      }
    }
    &.type2 {
      height: 47%;

      img {
        height: 80%;
        vertical-align: middle;
        margin-right: 3px;
      }
      span {
        vertical-align: middle;
        white-space: nowrap;
        font-size: 15px;
      }
      &::before {
        content: "";
        display: inline-block;
        width: 0;
        height: 100%;
        vertical-align: middle;
      }
    }
    &.type3 {
      cursor: default;
      height: 45%;
      border: 1px solid #fff;
      padding: 0;
      margin-top: 2px;

      &:active,
      &:hover {
        background: #3d3f47;
      }

      .type3-item-wra {
        display: inline-block;
        height: 100%;
        box-sizing: border-box;
        padding: 0 3px;

        &:hover {
          background: #000;
        }
        &:active {
          background: #ccc;
        }
        &:first-child {
          border-top-left-radius: 4px;
          border-bottom-left-radius: 4px;
        }
        &:last-child {
          border-top-right-radius: 4px;
          border-bottom-right-radius: 4px;
        }
      }
      img {
        height: 100%;
        cursor: pointer;
        vertical-align: middle;
      }
      i {
        display: inline-block;
        width: 1px;
        height: 100%;
        background: #fff;
        vertical-align: middle;
      }
    }
  }
}
</style>
<style lang="scss">
.key-info-wra {
  list-style: none;

  li {
    padding-top: 10px;

    .keys-wra {
      display: inline-block;
      width: 36%;

      span.key {
        padding: 2px 5px;
        border-radius: 5px;
        border: 1px solid #666;
        background: #ccc;
        color: #000;
      }
    }
    span.info {
      margin-left: 20px;
    }
  }
}
.mx-name-list-item {
  display: inline-block;
  color: rgb(64, 158, 255);
  cursor: pointer;
  padding: 3px 5px;
  background: rgb(240, 249, 235);
  border: 1px solid rgb(103, 194, 58);
  border-radius: 5px;
  margin-bottom: 10px;
}
.mx-name-list-item.active {
  background: #bbf799;
  border: 1px solid #d6d28a;
  color: rgb(64, 158, 255);
}

.el-message-box__wrapper[aria-label="快捷键说明"] {
  .el-message-box {
    width: 900px;

    .key-info-wra {
      width: 410px;
      display: inline-block;
      vertical-align: top;
    }
  }
}
</style>
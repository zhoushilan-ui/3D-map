<template>
  <div class='app-container' :class="{'show' : isOpenInfo}" ref="drap-container">
    <div class="top" v-drag="'status'">
      <span class="tip" v-text="getStateInfoPanelName"></span>
      <span class="switch" @click="switchInfo" v-text="isOpenInfo ? '-' : '+'"></span>
    </div>
    <div class="info" v-show="isOpenInfo && graph.getSelectionCells().length == 1">
      <el-tabs>
        <el-tab-pane label="基本样式">
          <div class="basic-style" v-show="isMode == 2">
            <el-form label-width="85px">
              <!-- <el-form-item v-for="item in cellNumStyle" :key="item.val" :label="item.name + '：'">
                <el-input size="mini" v-model="infoPanel[item.val]" style="width: 100px" @change="changeStyleColor(item.val)" placeholder="" />
              </el-form-item> -->
              <el-form-item label="不透明度">
                <el-input size="mini" v-model="infoPanel['opacity']" @change="changeStyleColor('opacity')" placeholder="" style="width: 100px;" />
              </el-form-item>
              <el-form-item label="边框宽度">
                <el-input size="mini" v-model="infoPanel['strokeWidth']" style="width: 100px" @change="changeStyleColor('strokeWidth')" placeholder="" />
              </el-form-item>
              <!-- <el-form-item v-for="item in cellColorInfo" :key="item.val" :label="item.name + '：'">
                <el-input size="mini" v-model="infoPanel[item.val]" style="width: 100px" type="color" @blur="changeStyleColor(item.val)" placeholder="" />
              </el-form-item> -->
              <el-form-item label="边框">
                <el-input size="mini" v-model="infoPanel['strokeColor']" style="width: 100px" type="color" @blur="changeStyleColor('strokeColor')" placeholder="" />
              </el-form-item>
              <el-form-item label="填充">
                <el-input size="mini" v-model="infoPanel['fillColor']" style="width: 100px" type="color" @blur="changeStyleColor('fillColor')" placeholder="" />
              </el-form-item>
            </el-form>
            <el-form :model="infoPanel" label-width="85px">
              <el-form-item label="宽度：">
                <el-input v-model="infoPanel.width" size="mini" @change="ChangeData('width')" style="width: 150px;"></el-input>
              </el-form-item>
              <el-form-item label="高度：">
                <el-input v-model="infoPanel.height" size="mini" @change="ChangeData('height')" style="width: 150px;"></el-input>
              </el-form-item>
              <el-form-item label="x：">
                <el-input v-model="infoPanel.x" size="mini" @change="ChangeData('x')" style="width: 150px;"></el-input>
              </el-form-item>
              <el-form-item label="y：">
                <el-input v-model="infoPanel.y" size="mini" @change="ChangeData('y')" style="width: 150px;"></el-input>
              </el-form-item>
            </el-form>
            <el-form :model="infoPanel" label-width="85px">
              <el-form-item label="内容：">
                <el-input v-model="infoPanel.value" size="mini" @change="Changeval"></el-input>
              </el-form-item>
              <el-form-item label="字体：">
                <el-select v-model="infoPanel.fontFamily" placeholder="请选择" size="mini" @change="changeFontFamly">
                  <el-option label="Arial" value="Arial" />
                  <el-option label="Dialog" value="Dialog" />
                  <el-option label="Verdana" value="Verdana" />
                  <el-option label="Times New Roman" value="Times New Roman" />
                </el-select>
              </el-form-item>
              <el-form-item class="no-label" label="">
                <el-input size="mini" style="width: 100px;margin-right: 10px;vertical-align: middle;" v-model="infoPanel['fontSize']" @change="changeStyleColor('fontSize')" placeholder="" />
                <el-input size="mini" style="width: 100px;vertical-align: middle;height: auto;line-height: 0;" v-model="infoPanel['fontColor']" type="color" @blur="changeStyleColor('fontColor')" placeholder="" />
              </el-form-item>
              <el-form-item class="no-label" label="" size="mini">
                <span class="font-style" :class="{'show': tmpFontStyleArr.length && tmpFontStyleArr.includes('1')}" @click="changeFontStyle(1)"><b>B</b></span>
                <span class="font-style" :class="{'show': tmpFontStyleArr.length && tmpFontStyleArr.includes('2')}" @click="changeFontStyle(2)"><i>I</i></span>
                <span class="font-style" :class="{'show': tmpFontStyleArr.length && tmpFontStyleArr.includes('4')}" @click="changeFontStyle(4)"><u>U</u></span>
                <span class="font-style" :class="{'show': tmpFontStyleArr.length && tmpFontStyleArr.includes('8')}" @click="changeFontStyle(8)"><s>S</s></span>
              </el-form-item>
              <el-form-item class="no-label" size="mini">
                <svg @click="ChangeCellStyleItem('verticalAlign', 'top');graph.refresh();" :class="{'show' : theCellIsType('verticalAlign', 'top')}" t="1610946467370" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5542" width="200" height="200">
                  <path d="M909.6 118.857143H114.4c-5.142857 0-9.257143 4.114286-9.257143 9.142857v68.571429c0 5.028571 4.114286 9.142857 9.257143 9.142857h795.2c5.142857 
                  0 9.257143-4.114286 9.257143-9.142857v-68.571429c0-5.028571-4.114286-9.142857-9.257143-9.142857zM519.2 332.571429a9.142857 9.142857 0 0 0-14.4 0l-128 
                  161.942857a9.12 9.12 0 0 0 7.2 14.742857h84.457143V896c0 5.028571 4.114286 9.142857 9.142857 9.142857h68.571429c5.028571 0 9.142857-4.114286 
                  9.142857-9.142857V509.371429H640c7.657143 0 11.885714-8.8 7.2-14.742858L519.2 332.571429z" p-id="5543"></path>
                </svg>
                <svg @click="ChangeCellStyleItem('verticalAlign', 'middle');graph.refresh();" :class="{'show' : theCellIsType('verticalAlign', 'middle', true)}" t="1610947859442" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="5977" width="200" height="200">
                  <path d="M909.6 468.571429H114.4c-5.142857 0-9.257143 4.114286-9.257143 9.142857v68.571428c0 5.028571 4.114286 9.142857 9.257143 9.142857h795.2c5.142857 0 
                  9.257143-4.114286 9.257143-9.142857v-68.571428c0-5.028571-4.114286-9.142857-9.257143-9.142857z m-404.114286-85.371429c3.314286 4.228571 9.714286 4.228571 
                  12.914286 0l115.2-145.714286c4.228571-5.371429 0.457143-13.371429-6.514286-13.371428H555.428571V45.714286c0-5.028571-4.114286-9.142857-9.142857-9.142857h-68.571428c-5.028571 
                  0-9.142857 4.114286-9.142857 9.142857v178.285714h-71.771429c-6.857143 0-10.742857 8-6.514286 13.371429l115.2 145.828571z m13.028572 257.6a8.16 8.16 0 0 0-12.914286 0L390.4 
                  786.628571a8.262857 8.262857 0 0 0 6.514286 13.371429H468.571429v178.285714c0 5.028571 4.114286 9.142857 9.142857 9.142857h68.571428c5.028571 0 9.142857-4.114286 
                  9.142857-9.142857V800h71.771429c6.857143 0 10.742857-8 6.514286-13.371429L518.514286 640.8z" p-id="5978"></path>
                </svg>
                <svg @click="ChangeCellStyleItem('verticalAlign', 'bottom');graph.refresh();" :class="{'show' : theCellIsType('verticalAlign', 'bottom')}" t="1610947886580" class="icon" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6122" width="200" height="200">
                  <path d="M682.666667 554.666667h-128V128h-85.333334v426.666667h-128l170.666667 170.666666 170.666667-170.666666zM170.666667 
                  810.666667v85.333333h682.666666v-85.333333H170.666667z" p-id="6123"></path>
                </svg>
                <div class="limit"></div>
                <svg @click="ChangeCellStyleItem('align', 'left');graph.refresh();" :class="{'show' : theCellIsType('align', 'left')}" t="1610947922195" class="icon ali" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="6869" width="200" height="200">
                  <path d="M627.712 788.48c11.30496 0 20.48-9.15456 20.48-20.48s-9.17504-20.48-20.48-20.48L218.46016 747.52c-11.30496 0-20.48 9.15456-20.48 20.48s9.17504 20.48 20.48 20.48L627.712 788.48z" p-id="6870"></path>
                  <path d="M832.86016 583.68l-614.4 0c-11.30496 0-20.48 9.15456-20.48 20.48s9.17504 20.48 20.48 20.48l614.4 0c11.30496 0 20.48-9.15456 20.48-20.48S844.16512 583.68 832.86016 583.68z" p-id="6871"></path>
                  <path d="M832.86016 256l-614.4 0c-11.30496 0-20.48 9.15456-20.48 20.48s9.17504 20.48 20.48 20.48l614.4 0c11.30496 0 20.48-9.15456 20.48-20.48S844.16512 256 832.86016 256z" p-id="6872"></path>
                  <path d="M218.46016 460.8 627.712 460.8c11.30496 0 20.48-9.15456 20.48-20.48s-9.17504-20.48-20.48-20.48L218.46016 419.84c-11.30496 0-20.48 9.15456-20.48 20.48S207.13472 460.8 218.46016 460.8z" p-id="6873"></path>
                </svg>
                <svg @click="ChangeCellStyleItem('align', 'center');graph.refresh();" :class="{'show' : theCellIsType('align', 'center', true)}" t="1610948799221" class="icon ali" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7609" width="200" height="200">
                  <path d="M740.43392 788.48a20.48 20.48 0 1 0 0-40.96H331.18208a20.48 20.48 0 1 0 0 40.96h409.25184zM863.49824 604.16a20.48 20.48 0 0 0-20.48-20.48h-614.4a20.48 20.48 0 1 0 0 40.96h614.4a20.48 20.48 0 0 0 
                  20.48-20.48zM208.13824 276.48a20.48 20.48 0 0 0 20.48 20.48h614.4a20.48 20.48 0 1 0 0-40.96h-614.4a20.48 20.48 0 0 0-20.48 20.48zM740.43392 460.8a20.48 20.48 0 1 0 0-40.96H331.18208a20.48 20.48 0 1 0 0 
                  40.96h409.25184z" fill="" p-id="7610"></path>
                </svg>
                <svg @click="ChangeCellStyleItem('align', 'right');graph.refresh();" :class="{'show' : theCellIsType('align', 'right')}" t="1610948101847" class="icon ali" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="7316" width="200" height="200">
                  <path d="M832.86016 747.52H423.58784a20.48 20.48 0 1 0 0 40.96h409.25184a20.48 20.48 0 0 0 0.02048-40.96zM853.34016 604.16a20.48 20.48 0 0 0-20.48-20.48h-614.4a20.48 20.48 0 1 0 0 40.96h614.4a20.48 20.48 0 0 0 
                  20.48-20.48zM832.86016 256h-614.4a20.48 20.48 0 1 0 0 40.96h614.4a20.48 20.48 0 1 0 0-40.96zM832.86016 419.84H423.58784a20.48 20.48 0 1 0 0 40.96h409.25184a20.48 20.48 0 0 0 0.02048-40.96z" fill="" p-id="7317"></path>
                </svg>
              </el-form-item>
            </el-form>
          </div>
          <div class="basic-style" v-show="isMode == 3">
            <lineStyle :line="line" :editor="editor" :graph="graph" :parent="parent"></lineStyle>
            <el-form>
              <el-form-item label="线型：">
                <el-select v-model="lineType" placeholder="请选择" size="mini" @change="changeLineType">
                  <el-option v-for="item in allLineType" :key="item.lab + '10'" :label="item.lab" :value="item.val" />
                </el-select>
              </el-form-item>
            </el-form>
            <el-form>
              <el-form-item label="线型：">
                <el-select v-model="lineType" placeholder="请选择" size="mini" @change="changeLineType">
                  <el-option v-for="item in allLineType" :key="item.lab + '100'" :label="item.lab" :value="item.val" />
                </el-select>
              </el-form-item>
            </el-form>
            <el-form>
              <el-form-item label="线型：">
                <el-select v-model="lineType" placeholder="请选择" size="mini" @change="changeLineType">
                  <el-option v-for="item in allLineType" :key="item.lab + '1000'" :label="item.lab" :value="item.val" />
                </el-select>
              </el-form-item>
            </el-form>
          </div>
        </el-tab-pane>
        <el-tab-pane label="动态信息">
          <h1>依据相关*此信息不予显示</h1>
        </el-tab-pane>
      </el-tabs>
    </div>
    <div class="panelInfo" v-show="isOpenInfo && isMode == 1">
      <el-form label-width="85px">
        <el-form-item label="背景色">
          <el-color-picker v-model="mxgraphInfo.backColor" style="width: 150px;" popper-class="panel-color" size="mini" @change="ChangeBackColor"></el-color-picker>
          <!-- <el-input v-model="mxgraphInfo.backColor" @blur="ChangeBackColor" type="color" style="width: 150px;padding-top: 5px;" color="#ff0" size="mini"></el-input> -->
        </el-form-item>
        <el-form-item label="背景网格">
          <el-checkbox v-model="mxgraphInfo.backGrid" @change="ChangeBackGrid" />
        </el-form-item>
      </el-form>
    </div>
  </div>
</template>

<script>
import lineStyle from '@/components/components/lineStyle.vue'
import grid from '@/assets/images/grid.gif'

export default {
  name: 'status',
  props: ["editor","graph","parent","sign"],
  components: { lineStyle },
  data() {
    return {
      grid,
      // 传递给子组件-线型样式的变量
      line: null,
      // 和拖拽信息面板相关的参数
      isopenDrap: false,
      posi: {
        el: null,
        x: null,
        y: null,
        l: null,
        t: null
      },
      // 全局画布属性
      mxgraphInfo: {
        backColor: '#f3f3f3',
        backGrid: false,
      },

      // 和展示cell相关的参数

      isOpenInfo: false,        // 是否打开了信息窗口
      isMode: 1,                // 当前选中的状态，1是父级mxgraph，2是Vertex节点，3是线条,还有4是未知（理论上不太可能）
      cell: undefined,          // 当前展示的信息指向哪个cell，为undefined时表示指向mxgraph
      // 和面板绑定的信息
      infoPanel: { value: '',width: '',height: '',x: '',y: '',strokeColor: '',fontColor: '',fillColor: '',opacity: '',strokeWidth: '',fontSize: '',fontArr: '',fontFamily: '',align: '',verticalAlign: '' },
      //   infoPanel: {},
      // 要展示的cell信息
      cellColorInfo: [
        { val: 'strokeColor',name: '边框',default: '#6482b9' },
        { val: 'fontColor',name: '字体',default: '#774400' },
        { val: 'fillColor',name: '填充',default: '#c3d9ff' },
      ],
      // cell.style中的num类型数据
      cellNumStyle: [
        { val: 'opacity',name: '不透明度',default: 100,max: 100,min: 0,},
        { val: 'strokeWidth',name: '边框宽度',default: 1,max: 100,min: 1,},
        { val: 'fontSize',name: '字体大小',default: 11,min: 1,},
      ],
      // cell.style中的Strings类型数据
      cellStringStyle: [
        { val: 'fontFamily',name: '字体样式',default: 'Arial' },
        { val: 'verticalAlign',name: '字体垂直位置',default: 'middle' },
        { val: 'align',name: '字体水平位置',default: 'center' },
      ],
      lineType: '',
      allLineType: [
        { lab: '直线',val: '1' },
        { lab: '密集点线',val: '1 1 1 1' },
        { lab: '直点线',val: '1 10 10 1' },
        { lab: '稀疏点线',val: '1 11' },
        { lab: '稀疏点线2',val: '1 11 5 15 3 17 2 2' },
      ],
      /**
       *   fontArr这个属性的暂存区，这是一个我自己使用并不会被mxgraph解析的属性
       *   mxgraph的字体属性(粗体、斜体、下划线、删除线)是以加和的形式存放在cell.style
       *  中的，仅仅是一个加和之后的数值，对于显示当前已经添加了哪些属性很不友好，因此
       * 自定义此属性，且同样寄存在cell.style中，用于显示当前已添加哪些属性（就是哪些按钮需要高亮显示）
      */
      tmpFontStyleArr: [],
    };
  },
  computed: {
    // 判断信息面板的name
    getStateInfoPanelName() {
      switch (this.isMode) {
        case 1: return '画布';
        case 2: return '节点';
        case 3: return '线条';
      }
      return '5'
    },
    // 当前选中的cell
    getSelectCell() {
      return this.graph && this.graph.getSelectionCells()
    },
    // 判断当前选中的cell的style是否具有某一个属性
    theCellIsType() {
      return (val,val2,defaults = false) => {
        if (!this.graph || !this.graph.getSelectionCells().length || !this.graph.getSelectionCells()[0].style) return;
        let tmp = this.graph.getSelectionCells()[0].style.split(';');
        // 是不是默认值
        if (defaults && this.graph.getSelectionCells()[0].style.indexOf(val) == -1) return true;
        let is = false;
        tmp.forEach((item,i) => {
          if (item.indexOf(val) != -1 && (val2 && item.indexOf(val2) != -1)) is = true;
        })
        return is;
      }
    },
  },
  watch: {
    // 有处于选中状态的单个的cell发生了变化
    sign(n,o) {
      // 如果此时的状态栏是关闭状态，则无需进行任何操作
      if (!this.isOpenInfo) return;
      // 如果的状态栏已经打开，并且有处于选中状态的单个的cell发生变化
      let info = this.graph.getSelectionCells()[0].geometry;
      console.log(info);
      this.infoPanel.width = info.width;
      this.infoPanel.height = info.height;
      this.infoPanel.x = info.x;
      this.infoPanel.y = info.y;
    },
    // 选中的cell发生了变化
    getSelectCell(n,o) {
      // 判断当前选中的cell的类型
      this.isClickType();
      if (!n.length) return;
      // 展示cell信息
      let tmpCell = this.graph && this.graph.getSelectionCells()[0];
      console.log(tmpCell)
      if (tmpCell.edge) {
        this.line = tmpCell;
        return;
      }
      if (!tmpCell.geometry && !tmpCell.id) {
        // 这是一个空cell，在没有选中任何cell的情况下选择了组合功能就会创建出一个这样的没有geometry也没有id的空空荡荡的奇怪的cell，这时无需进行任何操作
        return;
      }
      if (!tmpCell) return;
      // 展示信息到form中
      // cell.geometry
      let tmpData = tmpCell.geometry;
      this.infoPanel.width = tmpData.width;
      this.infoPanel.height = tmpData.height;
      this.infoPanel.x = tmpData.x;
      this.infoPanel.y = tmpData.y;
      this.infoPanel.value = tmpCell.value;

      // cell.style中的字体部分
      this.infoPanel.fontArr = '';
      this.infoPanel.fontStyle = 0;
      this.infoPanel.fontFamily = '';

      // 赋予默认值，默认值一定是合法的，不需要进行合法性的验证
      [...this.cellColorInfo,...this.cellNumStyle,...this.cellStringStyle].forEach(item => {
        this.infoPanel[item.val] = item.default;
      })

      // 如果有相应的样式，则赋值
      let tmpStyle = tmpCell.style && tmpCell.style.split(';');
      if (tmpStyle) {
        // 如果有非默认属性的style
        [...this.cellColorInfo,...this.cellNumStyle,...this.cellStringStyle].forEach(item => {
          if (tmpStyle.find(item2 => item2.indexOf([item.val]) != -1)) {
            let index = tmpStyle.findIndex(item2 => item2.indexOf([item.val]) != -1);
            let i = tmpStyle[index].indexOf('=');
            this.infoPanel[item.val] = tmpStyle[index].substring(i + 1);
          }
        })
      }

      this.tmpFontStyleArr = [];
      // 字体样式信息展示，仅包括粗体、斜体、下划线、删除线这四个奇葩的用加和的形式表示的样式
      if (tmpStyle && tmpStyle.find(item => item.indexOf('fontArr') != -1)) {
        this.infoPanel.fontArr = tmpStyle.find(item => item.indexOf('fontArr') != -1).substring(8);
        this.tmpFontStyleArr = this.infoPanel.fontArr.split(',');
        this.tmpFontStyleArr.forEach(item => this.infoPanel.fontStyle += Number(item));
      }
    }
  },
  created() { },
  mounted() {
    // 将鼠标的滑动事件挂载的window上，这样可以防止因鼠标滑动太快超出元素边界而导致的时间中断
    // window.onmousemove = this.loaddrap;
    this.switchInfo();
    setTimeout(() => {
      this.initDbclick();
    })
  },
  methods: {
    // 拖拽相关函数
    opendrap(e) {
      this.isopenDrap = true;
      this.posi.el = this.$refs['drap-container'];
      this.posi.l = this.posi.el.getBoundingClientRect().x;
      this.posi.t = this.posi.el.getBoundingClientRect().y;
      this.posi.x = e.clientX;
      this.posi.y = e.clientY;
      if (this.posi.el.style.left == '') {
        this.posi.el.style.left = this.posi.el.getBoundingClientRect().x + 'px';
        this.posi.el.style.top = this.posi.el.getBoundingClientRect().y + 'px';
      }
    },
    loaddrap(e) {
      if (!this.isopenDrap) return;

      this.posi.el.style.left = this.posi.l + (e.clientX - this.posi.x) + 'px';
      this.posi.el.style.top = this.posi.t + (e.clientY - this.posi.y) + 'px';
    },
    overdrap() {
      this.isopenDrap = false;
      this.posi = { x: null,y: null,l: null,t: null };
    },
    // 开关info
    switchInfo() {
      this.isOpenInfo = !this.isOpenInfo;
      let el = this.$refs['drap-container'];
      if (this.isOpenInfo) {
        el.style.left = '40%';
        el.style.top = 'calc(45%)';
      } else {
        el.style.left = 0;
        el.style.top = 'calc(100% - 30px)';
      }
    },
    initDbclick() {
      this.graph.addListener(mxEvent.DOUBLE_CLICK,(sender,{ properties }) => {
        let event = properties['event'];        // 双击事件的事件对象
        let cell = properties['cell'];          // 被点击的vertex，点空时是undefined
        this.isClickType();
        !this.isOpenInfo && this.switchInfo();
      });
    },
    isClickType() {
      let cell = this.graph.getSelectionCells()[0];
      switch (cell && cell.isVertex()) {
        case undefined:   // 点击了画布
          this.isMode = 1;
          break;
        case true:       // 点击了edge线条
          this.isMode = 2;
          break;
        case false:        // 点击了vertex节点
          this.isMode = 3;
          break;
        default:          // 点击了莫名其妙的东西还被捕捉了
          this.isMode = 4;
          this.$message('点击了奇奇怪怪的东西被捕捉到了！')
          break;
      }
    },
    Changeval() {
      if (this.graph.getSelectionCells().length != 1) return;
      this.graph.getSelectionCells()[0].value = this.infoPanel.value;
      this.graph.refresh();
    },


    // 改变cell.geometry的属性内容
    ChangeData(name) {
      if (this.graph.getSelectionCells().length != 1) return;
      this.infoPanel[name] = parseInt(this.infoPanel[name]);
      if (this.infoPanel['width'] < 0) this.infoPanel['width'] = 0;
      if (this.infoPanel['height'] < 0) this.infoPanel['height'] = 0;
      this.graph.getSelectionCells()[0].geometry[name] = this.infoPanel[name];
      this.graph.refresh();
    },
    // 改变STYLE中的color类型属性
    changeStyleColor(type) {
      if (this.graph.getSelectionCells().length != 1) return;
      this.ChangeCellStyleItem(type,this.infoPanel[type]);
      this.graph.refresh();
    },
    // 改变cell.style中的某个值
    ChangeCellStyleItem(type,value) {
      let tmpCell = this.graph.getSelectionCells()[0];
      // 如果输入的值溢出合理范围（当前仅数值类型的需要进行判定）
      if (this.cellNumStyle.find(item => item.val == type)) {
        value = parseInt(value);
        this.infoPanel[type] = parseInt(value);
        let tmp = this.cellNumStyle.find(item => item.val == type);
        if (value < tmp.min || value > tmp.max) {
          this.infoPanel[type] = value < tmp.min ? tmp.min : tmp.max;
          value = value < tmp.min ? tmp.min : tmp.max;
        }
      }
      if (tmpCell.style && tmpCell.style.indexOf(type) != -1) {
        // 已有当前要改变样式相关样式
        let styleArr = tmpCell.style.split(';')
        let index = styleArr.findIndex(item => item.indexOf(type) != -1);  // 相关样式在样式数组中的位置
        styleArr[index] = styleArr[index].substring(0,type.length + 1) + value;   // 删除原有数值并拼接新数值
        this.graph.getModel().setStyle(tmpCell,styleArr.join(';'))
      } else {
        // 无样式或者无type相关样式
        this.graph.getModel().setStyle(tmpCell,tmpCell.style += ';' + type + '=' + value);
      }
    },

    // 改变字体相关的值
    changeFontStyle(num) {
      //   if (this.graph.getSelectionCells().length != 1) return;
      let tmpCell = this.graph.getSelectionCells()[0];
      let arr = [];     // 当前cell所拥有的字体相关样式，而不是加和之后的数值
      if (tmpCell.style && tmpCell.style.indexOf('fontArr') != -1) {
        let tmp = tmpCell.style.split(';').find(item => item.indexOf('fontArr') != -1);
        arr = tmp.substring(8).split(',')
        if (arr.indexOf(num + '') != -1) {
          arr.splice(arr.indexOf(num + ''),1);
        } else {
          arr.push(num + '');
        }
      } else {
        // 如果这个cell之前从没有过这样的样式
        arr.push(num + '')
      }


      let sum = 0;
      arr.forEach(item => sum += Number(item))
      this.tmpFontStyleArr = JSON.parse(JSON.stringify(arr));


      this.ChangeCellStyleItem('fontArr',arr.join(','));
      this.ChangeCellStyleItem('fontStyle',sum);

      this.graph.refresh();
    },
    // 改变字体FontFamly
    changeFontFamly(val) {
      this.ChangeCellStyleItem('fontFamily',val)
      this.graph.refresh();
    },
    // 切换线型(vertex)
    toggleLineType(val) {
    },
    // 切换线型(edge)
    changeLineType(val) {
      this.ChangeCellStyleItem('dashed','1')
      this.ChangeCellStyleItem('dashPattern',val)
      this.graph.refresh();
    },
    // 修改背景色
    ChangeBackColor() {
      document.querySelector('.app-container.drawing-board').style.backgroundColor = this.mxgraphInfo.backColor
    },
    // 修改背景网格
    ChangeBackGrid(is) {
      // this.$emit('changeBackGrid', is)
      console.log(grid);
      document.querySelector('.app-container.drawing-board').style.backgroundImage = is ? `url(${grid})` : '';
    }


  },
};
</script>

<style scoped lang="scss">
.app-container {
  width: 150px;
  background: #fff;
  z-index: 10;
  position: fixed;
  top: calc(100% - 30px);
  left: 0;

  &.show {
    width: 780px;

    .info {
      padding: 0 15px 20px 15px;
    }
  }

  .top {
    height: 35px;
    line-height: 35px;
    background: #3d3f47;
    color: #fff;
    cursor: all-scroll;

    .switch {
      position: absolute;
      right: 15px;
      cursor: pointer;
    }
  }
  .el-form-item {
    margin: 0;
  }
}
.basic-style {
  .el-form {
    display: inline-block;
    width: 250px;
    vertical-align: top;

    .font-style {
      display: inline-block;
      margin-right: 5px;
      border-radius: 5px;
      border: 1px solid #555;
      width: 25px;
      font-size: 10px;
      cursor: pointer;

      &.show {
        border-color: turquoise;
        color: turquoise;
      }
    }

    .no-label {
      /deep/ .el-form-item__content {
        padding-left: 30px;
        margin-left: 0 !important;
      }
    }
  }

  .limit {
    display: inline-block;
    width: 10px;

    & ~ svg {
      transform: translateX(-5px);
    }
  }
}
svg.icon {
  fill: #555;
  width: 15px;
  height: 15px;
  border: 1px solid #555;
  padding: 5px;
  border-radius: 5px;
  vertical-align: middle;
  cursor: pointer;

  &.ali {
    width: 21px;
    height: 21px;
    padding: 2px;
  }

  &.show {
    border-color: turquoise;
    fill: turquoise;
  }
}
.panelInfo {
  text-align: left;
  padding: 10px 15px;
}
.popper-class {
  width: 300px;
}
</style>
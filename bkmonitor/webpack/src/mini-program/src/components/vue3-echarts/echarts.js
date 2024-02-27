// myEhcarts.js
// 引入 echarts 核心模块，核心模块提供了 echarts 使用必须要的接口。
// 引入图表类型，图表后缀都为 Chart
import { BarChart, LineChart, PieChart, ScatterChart } from 'echarts/charts';
// 引入提示框，标题，直角坐标系等组件，组件后缀都为 Component
import {
  DatasetComponent,
  GridComponent,
  LegendComponent,
  TitleComponent,
  TooltipComponent,
  TransformComponent,
} from 'echarts/components';
import * as echarts from 'echarts/core';
// 标签自动布局，全局过渡动画等特性
import { LabelLayout, UniversalTransition } from 'echarts/features';
// 引入 Canvas 渲染器，注意引入 CanvasRenderer 或者 SVGRenderer 是必须的一步
import { CanvasRenderer } from 'echarts/renderers';

// 将以上引入的组件使用use()方法注册
echarts.use([
  TitleComponent,
  TooltipComponent,
  GridComponent,
  LegendComponent,
  DatasetComponent,
  TransformComponent,
  LabelLayout,
  UniversalTransition,
  BarChart,
  LineChart,
  PieChart,
  ScatterChart,
  CanvasRenderer,
]);

// 导出
export default echarts;

/*
 * Tencent is pleased to support the open source community by making
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) available.
 *
 * Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
 *
 * 蓝鲸智云PaaS平台 (BlueKing PaaS) is licensed under the MIT License.
 *
 * License for 蓝鲸智云PaaS平台 (BlueKing PaaS):
 *
 * ---------------------------------------------------
 * Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
 * documentation files (the "Software"), to deal in the Software without restriction, including without limitation
 * the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software, and
 * to permit persons to whom the Software is furnished to do so, subject to the following conditions:
 *
 * The above copyright notice and this permission notice shall be included in all copies or substantial portions of
 * the Software.
 *
 * THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT LIMITED TO
 * THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
 * AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF
 * CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS
 * IN THE SOFTWARE.
 */
import { Component, Prop, Ref, Watch } from 'vue-property-decorator';
import { Component as tsc } from 'vue-tsx-support';

import { activated, deactivated } from '@blueking/bk-weweb';

// ECharts 动态加载后的类型声明
type EChartsInstance = {
  dispose: () => void;
  resize: () => void;
  setOption: (option: IChartOption) => void;
};
type EChartsLib = {
  init: (container: HTMLDivElement) => EChartsInstance;
};

interface IChartOption {
  [key: string]: unknown;
  series?: object[];
  title?: { text: string };
  xAxis?: { data: string[] };
  yAxis?: object;
}

interface IProps {
  /** 图表高度 */
  height?: string;
  /** 图表配置项 */
  option?: IChartOption;
  /** 图表宽度 */
  width?: string;
}

/**
 * @description 使用 BK-WeWeb 微模块理念封装的 ECharts 组件
 * 注意：由于 ECharts CDN 不符合微模块导出规范，这里使用动态加载 + 封装的方式实现
 */
@Component
export default class EchartsModule extends tsc<IProps> {
  @Prop({ default: '400px', type: String }) height: string;
  @Prop({ default: () => ({}), type: Object }) option: IChartOption;
  @Prop({ default: '100%', type: String }) width: string;

  @Ref('chartContainer') readonly chartContainerRef: HTMLDivElement;

  private chartInstance: EChartsInstance | null = null;
  private isLoaded = false;
  private moduleId = 'echarts-module';

  @Watch('option', { deep: true })
  onOptionChange() {
    this.updateChart();
  }

  async mounted() {
    await this.loadEchartsModule();
  }

  beforeDestroy() {
    this.destroyChart();
  }

  /**
   * 加载 ECharts 模块
   * 使用 BK-WeWeb 的微应用理念进行资源管理
   */
  async loadEchartsModule() {
    try {
      const container = this.$refs.chartContainer as HTMLDivElement;
      if (!container) return;

      // 检查 ECharts 是否已加载
      if ((window as Window & { echarts?: EChartsLib }).echarts) {
        this.initChart(container);
        return;
      }

      // 动态加载 ECharts
      await this.loadScript('https://cdn.jsdelivr.net/npm/echarts@5/dist/echarts.min.js');

      // 使用 BK-WeWeb 的 activated 机制管理模块生命周期
      activated(this.moduleId, container, () => {
        this.initChart(container);
      });
    } catch (error) {
      console.error('加载 ECharts 模块失败:', error);
    }
  }

  /**
   * 动态加载脚本
   */
  loadScript(src: string): Promise<void> {
    return new Promise((resolve, reject) => {
      const script = document.createElement('script');
      script.src = src;
      script.onload = () => resolve();
      script.onerror = () => reject(new Error(`Failed to load script: ${src}`));
      document.head.appendChild(script);
    });
  }

  /**
   * 初始化图表
   */
  initChart(container: HTMLDivElement) {
    const echartsLib = (window as Window & { echarts?: EChartsLib }).echarts;
    if (!echartsLib) return;

    this.chartInstance = echartsLib.init(container);
    this.isLoaded = true;
    this.updateChart();

    // 监听容器大小变化
    window.addEventListener('resize', this.handleResize);
  }

  /**
   * 更新图表配置
   */
  updateChart() {
    if (!this.chartInstance || !this.isLoaded) return;

    const defaultOption: IChartOption = {
      series: [
        {
          data: [120, 200, 150, 80, 70, 110, 130],
          name: '数据',
          type: 'bar',
        },
      ],
      title: { text: 'ECharts 微模块示例' },
      xAxis: {
        data: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      },
      yAxis: {},
    };

    const mergedOption = { ...defaultOption, ...this.option };
    this.chartInstance.setOption(mergedOption);
  }

  /**
   * 处理窗口大小变化
   */
  handleResize = () => {
    this.chartInstance?.resize();
  };

  /**
   * 销毁图表
   */
  destroyChart() {
    window.removeEventListener('resize', this.handleResize);
    if (this.chartInstance) {
      this.chartInstance.dispose();
      this.chartInstance = null;
    }
    // 停用微模块
    deactivated(this.moduleId);
  }

  render() {
    return (
      <div class='echarts-module-wrapper'>
        <div
          ref='chartContainer'
          style={{
            height: this.height,
            width: this.width,
          }}
          class='echarts-container'
        />
      </div>
    );
  }
}

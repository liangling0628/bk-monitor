import { Component, Ref } from 'vue-property-decorator';
import { Component as tsc } from 'vue-tsx-support';

import { loadApp, mount, unmount } from '@blueking/bk-weweb';

import aiWhaleStore from '@/store/modules/ai-whale';
import '@blueking/bk-weweb';

import type { AIBluekingShortcut } from '@/components/ai-whale/types';
import type { Vue3WewebData } from '@/types/weweb/weweb';

import './profiling-explore.scss';

/** 与旧 Profiling 的 profiling-explore 实例隔离，避免互相卸载 */
const profilingExploreAppId = 'profiling-explore-app';
/** 不能与本组件类名 ProfilingExplore 的 kebab-case 同名 */
const profilingExploreTagName = 'profiling-explore-app';

@Component
export default class ProfilingExplore extends tsc<object> {
  @Ref('profilingExploreApp') profilingExploreApp: HTMLElement;
  unmountCallback: () => void;
  get profilingExploreHost() {
    return process.env.NODE_ENV === 'development' ? `http://${process.env.devHost}:7002` : location.origin;
  }
  get profilingExploreUrl() {
    return process.env.NODE_ENV === 'development'
      ? `${this.profilingExploreHost}/?bizId=${this.$store.getters.bizId}/#/trace/profiling-explore`
      : `${location.origin}${window.site_url}trace/?bizId=${this.$store.getters.bizId}/#/trace/profiling-explore`;
  }
  get profilingExploreData(): Vue3WewebData {
    return {
      host: this.profilingExploreHost,
      parentRoute: '/trace/',
      get enableAiAssistant() {
        return aiWhaleStore.enableAiAssistant;
      },
      setUnmountCallback: (callback: () => void) => {
        this.unmountCallback = callback;
      },
      handleAIBluekingShortcut: (shortcut: AIBluekingShortcut) => {
        aiWhaleStore.setCustomFallbackShortcut(shortcut);
      },
    };
  }
  created() {
    if (!window.customElements.get(profilingExploreTagName)) {
      class ProfilingExploreAppElement extends HTMLElement {
        async connectedCallback() {
          if (!this.shadowRoot) {
            this.attachShadow({ delegatesFocus: false, mode: 'open' });
          }
        }
      }
      window.customElements.define(profilingExploreTagName, ProfilingExploreAppElement);
    }
  }
  async mounted() {
    await loadApp({
      url: this.profilingExploreUrl,
      id: profilingExploreAppId,
      setShadowDom: true,
      container: this.profilingExploreApp.shadowRoot,
      data: this.profilingExploreData,
      showSourceCode: false,
      scopeCss: true,
      scopeJs: true,
      scopeLocation: false,
    });
    mount(profilingExploreAppId, this.profilingExploreApp.shadowRoot as ShadowRoot);
    setTimeout(() => {
      this.$store.commit('app/SET_ROUTE_CHANGE_LOADING', false);
    }, 300);
  }
  beforeDestroy() {
    this.unmountCallback?.();
    unmount(profilingExploreAppId);
    this.unmountCallback = undefined;
  }
  render() {
    return (
      <div class='profiling-explore-wrap'>
        <div class='profiling-explore-wrap-iframe'>
          <profiling-explore-app ref='profilingExploreApp' />
        </div>
      </div>
    );
  }
}

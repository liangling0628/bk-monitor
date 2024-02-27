<script setup lang="ts">
  import { onHide, onLaunch, onShow } from '@dcloudio/uni-app';
  import { useAppStore } from './store/app';
  const {  getSystemInfo, getMenuButtonBoundingClientRect } = useAppStore();
  getSystemInfo();
  // #ifdef MP-WEIXIN
  getMenuButtonBoundingClientRect();
  // #endif
  onLaunch(() => {
    console.log('App Launch');
  });
  onShow(() => {
    console.log('App Show');
  });
  onHide(() => {
    console.log('App Hide');
  });
</script>
<style>

/* #ifdef MP-WEIXIN */
@import './styles/variables/weapp-var.scss';

/* #endif */

/* #ifndef MP-WEIXIN */

@import './styles/variables/h5-var.scss';

/* #endif */
</style>

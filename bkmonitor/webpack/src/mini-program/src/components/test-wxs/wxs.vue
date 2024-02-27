<template>
  <view>
    <view class="area">
      <view
        class="movable"
        @touchstart="test.touchstart"
        @touchmove="test.touchmove"
      >
        {{ test.msg }}
      </view>
    </view>
  </view>
</template>
<script module="test" lang="wxs">
  // eslint-disable no-var
  // eslint-disable-next-line no-var
  var startX = 0;
  // eslint-disable-next-line no-var
  var startY = 0;
  // eslint-disable-next-line no-var
  var lastLeft = 50;
  // eslint-disable-next-line no-var
  var lastTop = 50;
  function touchstart(event, ins) {
    console.log('touchstart');
    // eslint-disable-next-line no-var
    var touch = event.touches[0] || event.changedTouches[0];
    startX = touch.pageX;
    startY = touch.pageY;
  }
  function touchmove(event, ins) {
    // eslint-disable-next-line no-var
    var touch = event.touches[0] || event.changedTouches[0];
    // eslint-disable-next-line no-var, prefer-destructuring
    var pageX = touch.pageX;
    // eslint-disable-next-line no-var, prefer-destructuring
    var pageY = touch.pageY;
    // eslint-disable-next-line no-var
    var left = pageX - startX + lastLeft;
    // eslint-disable-next-line no-var
    var top = pageY - startY + lastTop;
    startX = pageX;
    startY = pageY;
    lastLeft = left;
    lastTop = top;
    ins.selectComponent('.movable').setStyle({
      // eslint-disable-next-line prefer-template
      left: left + 'px',
      // eslint-disable-next-line prefer-template
      top: top + 'px',
    });
    return false;
  }
  module.exports = {
    msg: 'Hello',
    // eslint-disable-next-line object-shorthand
    touchstart: touchstart,
    // eslint-disable-next-line object-shorthand
    touchmove: touchmove,
  };
</script>

<script>
	export default {
		data() {
			return {
			}
		},
		methods: {
		}
	}
</script>

<style>
.area {
  position: absolute;
  width: 100%;
  height: 100%;
}

.movable {
  position: absolute;
  top: 50px;
  left: 50px;
  width: 100px;
  height: 100px;
  line-height: 100px;
  color: white;
  text-align: center;
  background-color: red;
}
</style>

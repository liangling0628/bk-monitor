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
import { getModule, Module, Mutation, VuexModule } from 'vuex-module-decorators';

import store from '../store';

export type RoutePenddingStatus = 'pendding' | 'success' | 'discard' | 'cancel';
@Module({ name: 'router', dynamic: true, namespaced: true, store })
class RouteStore extends VuexModule {
  routeChangeSuccessCallBack: Function = null;
  routeChangeDismissCallBack: Function = null;
  routeChangePeddingCallBack: Function = null;
  routePenddingStatus: RoutePenddingStatus = 'success';
  get sucessCallBack() {
    return this.routeChangeSuccessCallBack;
  }
  get dissmissCallBack() {
    return this.routeChangeDismissCallBack;
  }
  get penddingCallBack() {
    return this.routeChangePeddingCallBack;
  }
  @Mutation
  setSuccessRouteChangeCallBack(cb: Function) {
    this.routeChangeSuccessCallBack = cb;
  }
  @Mutation
  setDismissRouteChangeCallBack(cb: Function) {
    this.routeChangeDismissCallBack = cb;
  }
  @Mutation
  setPenddingRouteChangeCallBack(cb: Function) {
    this.routeChangePeddingCallBack = cb;
  }
  @Mutation
  setRoutePenddingStatus(status: RoutePenddingStatus) {
    this.routePenddingStatus = status;
    if (status === 'success' || status === 'discard') {
      this.routeChangeSuccessCallBack?.();
      this.routeChangeDismissCallBack = null;
    } else {
      this.routeChangeDismissCallBack?.();
      this.routeChangeSuccessCallBack = null;
    }
  }
}
export default getModule(RouteStore);

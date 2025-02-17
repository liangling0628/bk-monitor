# -*- coding: utf-8 -*-
"""
Tencent is pleased to support the open source community by making 蓝鲸智云 - 监控平台 (BlueKing - Monitor) available.
Copyright (C) 2017-2021 THL A29 Limited, a Tencent company. All rights reserved.
Licensed under the MIT License (the "License"); you may not use this file except in compliance with the License.
You may obtain a copy of the License at http://opensource.org/licenses/MIT
Unless required by applicable law or agreed to in writing, software distributed under the License is distributed on
an "AS IS" BASIS, WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied. See the License for the
specific language governing permissions and limitations under the License.
"""
"""
i18n 国际化相关。该文件不要写任何业务代码，也不允许引入除系统外的模块
"""


class TranslateDict(dict):
    def __getitem__(self, item):
        value = super(TranslateDict, self).__getitem__(item)
        from django.utils.translation import gettext

        return gettext(value)

    def get(self, k, d=None):
        return self.__getitem__(k) if k in list(self.keys()) else d

    def copy(self):
        return TranslateDict(super(TranslateDict, self).copy())

    def items(self):
        return [(key, self.__getitem__(key)) for key in list(self.keys())]

    def values(self):
        return [self.__getitem__(key) for key in list(self.keys())]

    def iteritems(self):
        for k, v in super(TranslateDict, self).items():
            yield (k, self.__getitem__(k))

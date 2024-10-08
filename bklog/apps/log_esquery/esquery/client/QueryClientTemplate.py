# -*- coding: utf-8 -*-
# pylint: disable=invalid-name
"""
Tencent is pleased to support the open source community by making BK-LOG 蓝鲸日志平台 available.
Copyright (C) 2021 THL A29 Limited, a Tencent company.  All rights reserved.
BK-LOG 蓝鲸日志平台 is licensed under the MIT License.
License for BK-LOG 蓝鲸日志平台:
--------------------------------------------------------------------
Permission is hereby granted, free of charge, to any person obtaining a copy of this software and associated
documentation files (the "Software"), to deal in the Software without restriction, including without limitation
the rights to use, copy, modify, merge, publish, distribute, sublicense, and/or sell copies of the Software,
and to permit persons to whom the Software is furnished to do so, subject to the following conditions:
The above copyright notice and this permission notice shall be included in all copies or substantial
portions of the Software.
THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR IMPLIED, INCLUDING BUT NOT
LIMITED TO THE WARRANTIES OF MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER LIABILITY,
WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE
SOFTWARE OR THE USE OR OTHER DEALINGS IN THE SOFTWARE.
We undertake not to change the open source license (MIT license) applicable to the current version of
the project delivered to anyone in the future.
"""
from typing import Any, Dict

import requests
from elasticsearch import exceptions as EsExceptions
from elasticsearch5 import exceptions as EsExceptions5
from elasticsearch6 import exceptions as EsExceptions6

from apps.log_esquery.exceptions import EsTimeoutException


class QueryClientTemplate(object):  # pylint: disable=invalid-name
    def __init__(self):
        self.host: str = ""
        self.port: int = -1
        self.username: str = ""
        self.password: str = ""
        self._active: bool = False

    def query(self, index: str, body: Dict[str, Any], scroll=None, track_total_hits=False):
        raise NotImplementedError()

    def mapping(self, index: str, add_settings_details: bool = False) -> Dict:
        raise NotImplementedError()

    def es_route(self, url: str, index=None):
        raise NotImplementedError()

    @classmethod
    def catch_timeout_raise(cls, e):
        if isinstance(
            e,
            (
                EsExceptions.ConnectionTimeout,
                EsExceptions5.ConnectionTimeout,
                EsExceptions6.ConnectionTimeout,
                requests.exceptions.Timeout,
            ),
        ):
            raise EsTimeoutException

    @staticmethod
    def add_analyzer_details(_mappings: Dict[str, Any], _settings: Dict[str, Any]):
        index_list = list(_mappings.keys())
        for index_name in index_list:
            # 获取索引的分析器设置
            index_settings = _settings[index_name]["settings"]["index"]
            analyzers = index_settings.get("analysis", {}).get("analyzer", {})
            tokenizers = index_settings.get("analysis", {}).get("tokenizer", {})
            if "properties" in _mappings[index_name]["mappings"]:
                # properties存在时,遍历映射中的字段
                for field, properties in _mappings[index_name]["mappings"]["properties"].items():
                    analyzer_name = properties.get("analyzer")
                    if not analyzer_name:
                        continue
                    # 从索引设置中获取分析器详细信息
                    analyzer_details = analyzers.get(analyzer_name)
                    if not analyzer_details:
                        continue
                    # 将分析器详细信息添加到字段配置中
                    properties["analyzer_details"] = analyzer_details
                    if properties["analyzer_details"].get("tokenizer"):
                        properties["analyzer_details"]["tokenizer_details"] = tokenizers.get(
                            properties["analyzer_details"]["tokenizer"]
                        )
            else:
                # properties不在mappings下时,寻找下一级
                for index_type in _mappings[index_name]["mappings"].values():
                    for field, properties in index_type["properties"].items():
                        analyzer_name = properties.get("analyzer")
                        if not analyzer_name:
                            continue
                        # 从索引设置中获取分析器详细信息
                        analyzer_details = analyzers.get(analyzer_name)
                        if not analyzer_details:
                            continue
                        # 将分析器详细信息添加到字段配置中
                        properties["analyzer_details"] = analyzer_details
                        if properties["analyzer_details"].get("tokenizer"):
                            properties["analyzer_details"]["tokenizer_details"] = tokenizers.get(
                                properties["analyzer_details"]["tokenizer"]
                            )
        return _mappings

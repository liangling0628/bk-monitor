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
from rest_framework import serializers

from core.drf_resource import APIResource


class SdkResource(APIResource):
    # 模块名
    module_name = "aiops_sdk"


class SdkPredictResource(APIResource):
    """
    SDK执行预测逻辑
    """

    class RequestSerializer(serializers.Serializer):
        data = serializers.ListField(required=True, child=serializers.DictField())
        dimensions = serializers.DictField(required=False, default=dict())
        predict_args = serializers.DictField(required=False, default=dict())
        interval = serializers.IntegerField(default=60)
        extra_data = serializers.DictField(default=dict())
        backfill_fields = serializers.ListField(required=False, default=list(), child=serializers.CharField())

    action = "/api/aiops/default/"
    method = "POST"


class DependencyDataSerializer(serializers.Serializer):
    data = serializers.ListField(child=serializers.DictField())
    dimensions = serializers.DictField(default=dict())


class SdkInitDependResource(APIResource):
    """
    SDK初始化历史依赖
    """

    class RequestSerializer(serializers.Serializer):
        dependency_data = serializers.ListField(child=DependencyDataSerializer())
        replace = serializers.BooleanField(default=True)

    action = "/api/aiops/init_depend/"
    method = "POST"


class TfSdkResource(SdkResource):
    # 远程访问地址
    base_url = "http://bk-aiops-serving-tf:8000"


class TfPredictResource(TfSdkResource, SdkPredictResource):
    """SDK执行时序预测逻辑."""

    pass


class TfInitDependResource(TfSdkResource, SdkInitDependResource):
    """SDK初始化历史依赖."""

    pass


class KpiSdkResource(SdkResource):
    # 远程访问地址
    base_url = "http://bk-aiops-serving-kpi:8000"


class KpiPredictResource(KpiSdkResource, SdkPredictResource):
    """SDK执行时序预测逻辑."""

    pass


class KpiInitDependResource(KpiSdkResource, SdkInitDependResource):
    """SDK初始化历史依赖."""

    pass
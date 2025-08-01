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

from django.utils.translation import gettext_lazy as _
from pipeline.builder import ServiceActivity, Var
from pipeline.component_framework.component import Component
from pipeline.core.flow.activity import Service

from apps.api import BkDataAuthApi
from apps.log_clustering.handlers.data_access.data_access import DataAccessHandler
from apps.log_clustering.models import ClusteringConfig
from apps.log_databus.models import CollectorConfig
from apps.log_databus.tasks.bkdata import create_bkdata_data_id
from apps.utils.pipline import BaseService


class SyncBkdataEtlService(BaseService):
    name = _("同步清洗配置到数据平台")

    def _execute(self, data, parent_data):
        collector_config_id = data.get_one_of_inputs("collector_config_id")
        DataAccessHandler().sync_bkdata_etl(collector_config_id=collector_config_id)
        return True


class SyncBkdataEtlComponent(Component):
    name = "SyncBkdataEtl"
    code = "sync_bkdata_etl"
    bound_service = SyncBkdataEtlService


class SyncBkdataEtl:
    def __init__(self, index_set_id: int, collector_config_id: int = None):
        self.sync_bkdata_etl = ServiceActivity(
            component_code="sync_bkdata_etl", name=f"sync_bkdata_etl:{index_set_id}_{collector_config_id}"
        )
        self.sync_bkdata_etl.component.inputs.collector_config_id = Var(type=Var.SPLICE, value="${collector_config_id}")
        self.sync_bkdata_etl.component.inputs.index_set_id = Var(type=Var.SPLICE, value="${index_set_id}")


class AddProjectDataService(BaseService):
    name = _("项目添加rt权限")

    def _execute(self, data, parent_data):
        index_set_id = data.get_one_of_inputs("index_set_id")
        project_id = data.get_one_of_inputs("project_id")
        clustering_config = ClusteringConfig.get_by_index_set_id(index_set_id=index_set_id)
        # 当计算平台rt场景时需要将对应rt设置为相应字段
        if not clustering_config.bkdata_etl_result_table_id:
            clustering_config.bkdata_etl_result_table_id = clustering_config.source_rt_name
            clustering_config.save()
        BkDataAuthApi.add_project_data(
            params={
                "bk_biz_id": clustering_config.bk_biz_id,
                "object_id": clustering_config.bkdata_etl_result_table_id,
                "project_id": project_id,
            }
        )
        return True


class AddProjectDataComponent(Component):
    name = "AddProjectData"
    code = "add_project_data"
    bound_service = AddProjectDataService


class AddProjectData:
    def __init__(self, index_set_id: int, collector_config_id: int = None):
        self.add_project_data = ServiceActivity(
            component_code="add_project_data", name=f"add_project_data:{index_set_id}_{collector_config_id}"
        )
        self.add_project_data.component.inputs.bk_biz_id = Var(type=Var.SPLICE, value="${bk_biz_id}")
        self.add_project_data.component.inputs.collector_config_id = Var(
            type=Var.SPLICE, value="${collector_config_id}"
        )
        self.add_project_data.component.inputs.index_set_id = Var(type=Var.SPLICE, value="${index_set_id}")
        self.add_project_data.component.inputs.project_id = Var(type=Var.SPLICE, value="${project_id}")


class AddResourceGroupService(BaseService):
    name = _("项目添加资源组权限")

    def inputs_format(self):
        return [
            Service.InputItem(name="collector config id", key="collector_config_id", type="int", required=True),
        ]

    def _execute(self, data, parent_data):
        index_set_id = data.get_one_of_inputs("index_set_id")
        clustering_config = ClusteringConfig.get_by_index_set_id(index_set_id=index_set_id)
        if clustering_config.es_storage:
            return True
        es_storage_name = DataAccessHandler().add_cluster_group(
            clustering_config.source_rt_name, clustering_config.bk_biz_id
        )
        clustering_config.es_storage = es_storage_name
        clustering_config.save()
        return True


class AddResourceGroupComponent(Component):
    name = "AddResourceGroup"
    code = "add_resource_group"
    bound_service = AddResourceGroupService


class AddResourceGroupSet:
    def __init__(self, index_set_id: int, collector_config_id: int = None):
        self.add_resource_group = ServiceActivity(
            component_code="add_resource_group", name=f"create_new_index_set:{index_set_id}_{collector_config_id}"
        )
        self.add_resource_group.component.inputs.collector_config_id = Var(
            type=Var.SPLICE, value="${collector_config_id}"
        )
        self.add_resource_group.component.inputs.index_set_id = Var(type=Var.SPLICE, value="${index_set_id}")


class CreateBkdataDataIdService(BaseService):
    name = _("创建bkdata_data_id")

    def _execute(self, data, parent_data):
        collector_config_id = data.get_one_of_inputs("collector_config_id")
        collector_config = CollectorConfig.objects.filter(
            collector_config_id=collector_config_id,
        ).first()
        create_bkdata_data_id(collector_config, raise_exception=True)

        # 更新聚类配置表中的bkdata_data_id
        clustering_config = ClusteringConfig.objects.get(collector_config_id=collector_config.collector_config_id)
        if not clustering_config.bkdata_data_id:
            clustering_config.bkdata_data_id = collector_config.bkdata_data_id
            clustering_config.save()
        return True


class CreateBkdataDataIdComponent(Component):
    name = "CreateBkdataDataId"
    code = "create_bkdata_data_id"
    bound_service = CreateBkdataDataIdService


class CreateBkdataDataId:
    def __init__(self, index_set_id: int, collector_config_id: int = None):
        self.create_bkdata_data_id = ServiceActivity(
            component_code="create_bkdata_data_id", name=f"create_bkdata_data_id:{index_set_id}-{collector_config_id}"
        )
        self.create_bkdata_data_id.component.inputs.collector_config_id = Var(
            type=Var.SPLICE, value="${collector_config_id}"
        )
        self.create_bkdata_data_id.component.inputs.index_set_id = Var(type=Var.SPLICE, value="${index_set_id}")

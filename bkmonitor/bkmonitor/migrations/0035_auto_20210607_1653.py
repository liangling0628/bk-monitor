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
# Generated by Django 1.11.23 on 2021-06-07 08:53
from __future__ import unicode_literals

from django.db import migrations, models

import bkmonitor.utils.db.fields


class Migration(migrations.Migration):
    dependencies = [
        ("bkmonitor", "0034_auto_20210419_1732"),
    ]

    operations = [
        migrations.CreateModel(
            name="ActionConfig",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("is_enabled", models.BooleanField(default=True, verbose_name="是否启用")),
                ("is_deleted", models.BooleanField(default=False, verbose_name="是否删除")),
                ("create_user", models.CharField(blank=True, default="", max_length=32, verbose_name="创建人")),
                ("create_time", models.DateTimeField(auto_now_add=True, verbose_name="创建时间")),
                ("update_user", models.CharField(blank=True, default="", max_length=32, verbose_name="最后修改人")),
                ("update_time", models.DateTimeField(auto_now=True, verbose_name="最后修改时间")),
                ("name", models.CharField(max_length=64, verbose_name="套餐名称")),
                ("desc", models.TextField(default="", verbose_name="套餐描述")),
                ("bk_biz_id", models.CharField(max_length=64, verbose_name="业务ID")),
                ("plugin_id", models.CharField(max_length=64, verbose_name="插件ID")),
                ("converge_config", bkmonitor.utils.db.fields.JsonField(verbose_name="收敛配置")),
                ("execute_config", bkmonitor.utils.db.fields.JsonField(verbose_name="执行任务参数配置")),
            ],
            options={
                "verbose_name": "自愈套餐",
                "verbose_name_plural": "自愈套餐",
                "db_table": "action_config",
                "ordering": ("-update_time", "-id"),
            },
        ),
        migrations.CreateModel(
            name="ActionInstance",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("is_enabled", models.BooleanField(default=True, verbose_name="是否启用")),
                ("is_deleted", models.BooleanField(default=False, verbose_name="是否删除")),
                ("create_user", models.CharField(blank=True, default="", max_length=32, verbose_name="创建人")),
                ("create_time", models.DateTimeField(auto_now_add=True, verbose_name="创建时间")),
                ("update_user", models.CharField(blank=True, default="", max_length=32, verbose_name="最后修改人")),
                ("update_time", models.DateTimeField(auto_now=True, verbose_name="最后修改时间")),
                (
                    "signal",
                    models.CharField(
                        choices=[("manual", "手动"), ("abnormal", "告警产生时"), ("recovered", "告警恢复时"), ("closed", "告警关闭时")],
                        help_text="触发该事件的告警信号，如生成告警，告警恢复，告警关闭",
                        max_length=64,
                        verbose_name="触发信号",
                    ),
                ),
                ("strategy_id", models.IntegerField(verbose_name="策略ID")),
                ("alerts", bkmonitor.utils.db.fields.JsonField(default=[], verbose_name="关联的告警")),
                (
                    "alert_level",
                    models.CharField(
                        choices=[(3, "一般"), (2, "严重"), (1, "致命")], default=3, max_length=64, verbose_name="告警级别"
                    ),
                ),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("received", "收到"),
                            ("waiting", "审批中"),
                            ("converging", "收敛中"),
                            ("sleep", "收敛处理等待"),
                            ("converged", "收敛结束"),
                            ("running", "处理中"),
                            ("success", "成功"),
                            ("partial_success", "基本成功"),
                            ("failure", "失败"),
                            ("skipped", "跳过"),
                            ("shield", "被屏蔽"),
                        ],
                        default="received",
                        max_length=64,
                        verbose_name="执行状态",
                    ),
                ),
                (
                    "failure_type",
                    models.CharField(
                        choices=[
                            ("unknown", "处理出错（未分类）"),
                            ("framework_code_failure", "自愈系统异常"),
                            ("timeout", "超时"),
                            ("execute_failure", "事件执行出错"),
                            ("execute_failure", "任务创建失败"),
                            ("callback_failure", "任务回调失败"),
                            ("user_abort", "用户终止流程"),
                        ],
                        help_text="失败的时候标志失败类型",
                        max_length=64,
                        null=True,
                        verbose_name="失败类型",
                    ),
                ),
                ("ex_data", bkmonitor.utils.db.fields.JsonField(default={}, verbose_name="执行异常信息")),
                ("end_time", models.DateTimeField(blank=True, null=True, verbose_name="结束时间")),
                ("action_plugin", bkmonitor.utils.db.fields.JsonField(verbose_name="事件对应的插件信息")),
                ("action_config", bkmonitor.utils.db.fields.JsonField(verbose_name="关联配置信息的快照")),
                ("bk_biz_id", models.CharField(max_length=64, verbose_name="业务ID")),
                ("is_parent_action", models.BooleanField(db_index=True, default=False, verbose_name="是否为主任务")),
                ("parent_action_id", models.BigIntegerField(default=0, verbose_name="父任务ID")),
                ("sub_actions", bkmonitor.utils.db.fields.JsonField(default=[], verbose_name="子任务ID")),
                ("responsible", models.CharField(max_length=128, null=True, verbose_name="负责人")),
                (
                    "inputs",
                    bkmonitor.utils.db.fields.JsonField(default={}, help_text="譬如发送人，执行人等", verbose_name="任务的输入参数"),
                ),
                ("outputs", bkmonitor.utils.db.fields.JsonField(default={}, verbose_name="任务的输出参数")),
                ("execute_times", models.IntegerField(default=0, verbose_name="执行次数")),
                ("generate_uuid", models.CharField(max_length=32, null=True, verbose_name="创建批次")),
            ],
            options={
                "verbose_name": "自愈执行动作",
                "verbose_name_plural": "自愈执行动作",
                "db_table": "action_instance",
                "ordering": ("-id",),
            },
        ),
        migrations.CreateModel(
            name="ActionInstanceLog",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("action_instance_id", models.IntegerField(db_index=True)),
                ("content", models.TextField(verbose_name="步骤记录")),
                ("time", models.DateTimeField(auto_now=True, verbose_name="备注时间")),
                ("step_name", models.CharField(default=None, max_length=32, null=True, verbose_name="步骤名")),
                (
                    "level",
                    models.SmallIntegerField(
                        choices=[
                            (0, "NOT_SET"),
                            (10, "DEBUG"),
                            (20, "INFO"),
                            (30, "WARNING"),
                            (40, "ERROR"),
                            (50, "CRITICAL"),
                        ],
                        default=None,
                        help_text="同python logging level定义",
                        null=True,
                        verbose_name="信息等级",
                    ),
                ),
            ],
            options={
                "verbose_name": "自愈执行动作日志",
                "verbose_name_plural": "自愈执行动作日志",
                "db_table": "action_instance_log",
            },
        ),
        migrations.CreateModel(
            name="ActionPlugin",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("is_enabled", models.BooleanField(default=True, verbose_name="是否启用")),
                ("is_deleted", models.BooleanField(default=False, verbose_name="是否删除")),
                ("create_user", models.CharField(blank=True, default="", max_length=32, verbose_name="创建人")),
                ("create_time", models.DateTimeField(auto_now_add=True, verbose_name="创建时间")),
                ("update_user", models.CharField(blank=True, default="", max_length=32, verbose_name="最后修改人")),
                ("update_time", models.DateTimeField(auto_now=True, verbose_name="最后修改时间")),
                (
                    "plugin_type",
                    models.CharField(
                        choices=[
                            ("notice", "通知"),
                            ("webhook", "HTTP回调"),
                            ("job", "作业平台"),
                            ("sops", "标准运维"),
                            ("itsm", "流程服务"),
                            ("common", "通用插件"),
                        ],
                        max_length=64,
                        verbose_name="插件类型",
                    ),
                ),
                ("name", models.CharField(max_length=64, verbose_name="插件名称")),
                ("is_builtin", models.BooleanField(default=False, verbose_name="是否内置")),
                ("is_peripheral", models.BooleanField(default=False, verbose_name="是否周边系统")),
                ("has_child", models.BooleanField(default=False, verbose_name="是否有子级联")),
                ("category", models.CharField(max_length=64, verbose_name="插件分类")),
                ("config_schema", bkmonitor.utils.db.fields.JsonField(verbose_name="参数配置格式")),
                ("backend_config", bkmonitor.utils.db.fields.JsonField(verbose_name="后台执行格式")),
            ],
            options={
                "verbose_name": "响应动作插件",
                "verbose_name_plural": "响应动作插件",
                "db_table": "action_plugin",
            },
        ),
        migrations.CreateModel(
            name="AlertConfig",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("is_enabled", models.BooleanField(default=True, verbose_name="是否启用")),
                ("is_deleted", models.BooleanField(default=False, verbose_name="是否删除")),
                ("create_user", models.CharField(blank=True, default="", max_length=32, verbose_name="创建人")),
                ("create_time", models.DateTimeField(auto_now_add=True, verbose_name="创建时间")),
                ("update_user", models.CharField(blank=True, default="", max_length=32, verbose_name="最后修改人")),
                ("update_time", models.DateTimeField(auto_now=True, verbose_name="最后修改时间")),
                ("plugin_id", models.CharField(max_length=64, verbose_name="插件ID")),
                ("name", models.CharField(max_length=64, verbose_name="告警名称")),
                ("rules", bkmonitor.utils.db.fields.JsonField(default=[], verbose_name="名称匹配规则")),
                ("is_manual", models.BooleanField(default=False, verbose_name="是否手动添加")),
                ("order", models.IntegerField(default=0, verbose_name="解析排序")),
            ],
            options={
                "verbose_name": "告警名称配置管理",
                "verbose_name_plural": "告警名称配置管理",
            },
        ),
        migrations.CreateModel(
            name="ConvergeInstance",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("is_enabled", models.BooleanField(default=True, verbose_name="是否启用")),
                ("is_deleted", models.BooleanField(default=False, verbose_name="是否删除")),
                ("create_user", models.CharField(blank=True, default="", max_length=32, verbose_name="创建人")),
                ("create_time", models.DateTimeField(auto_now_add=True, verbose_name="创建时间")),
                ("update_user", models.CharField(blank=True, default="", max_length=32, verbose_name="最后修改人")),
                ("update_time", models.DateTimeField(auto_now=True, verbose_name="最后修改时间")),
                ("is_visible", models.BooleanField(default=True, verbose_name="是否可见")),
                ("converge_config", bkmonitor.utils.db.fields.JsonField()),
                (
                    "converge_func",
                    models.CharField(
                        blank=True,
                        choices=[
                            ("skip_when_success", "成功中跳过"),
                            ("skip_when_proceed", "执行中跳过"),
                            ("wait_when_proceed", "执行中等待"),
                            ("defense", "异常防御审批"),
                            ("trigger", "收敛后处理"),
                            ("collect_alarm", "汇总通知"),
                            ("collect", "超出后汇总"),
                        ],
                        db_index=True,
                        max_length=128,
                        null=True,
                        verbose_name="事件类型",
                    ),
                ),
                (
                    "converge_type",
                    models.CharField(choices=[("converge", "收敛事件"), ("action", "处理事件")], db_index=True, max_length=64),
                ),
                ("bk_biz_id", models.IntegerField(db_index=True, verbose_name="业务编码")),
                ("dimension", models.CharField(db_index=True, max_length=128, unique=True, verbose_name="收敛维度")),
                ("description", models.TextField(verbose_name="描述")),
                ("content", models.TextField(verbose_name="内容")),
                ("detail", models.TextField(blank=True, null=True, verbose_name="详情")),
                ("end_time", models.DateTimeField(blank=True, null=True, verbose_name="事件结束时间")),
                (
                    "notify_status",
                    models.CharField(
                        blank=True,
                        choices=[("sent", "已发送"), ("new", "尚未发送"), ("", "无内容")],
                        max_length=4,
                        null=True,
                        verbose_name="消息提醒状态",
                    ),
                ),
            ],
            options={
                "verbose_name": "自愈收敛动作",
                "verbose_name_plural": "自愈收敛动作",
                "db_table": "converge_instance",
                "ordering": ("-id",),
            },
        ),
        migrations.CreateModel(
            name="ConvergeRelation",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("converge_id", models.BigIntegerField(db_index=True)),
                ("related_id", models.BigIntegerField(db_index=True)),
                (
                    "related_type",
                    models.CharField(choices=[("converge", "收敛事件"), ("action", "处理事件")], db_index=True, max_length=64),
                ),
                ("is_primary", models.BooleanField(default=False, verbose_name="主要告警")),
            ],
            options={
                "verbose_name": "自愈收敛关联表",
                "verbose_name_plural": "自愈收敛关联表",
                "db_table": "converge_relation",
            },
        ),
        migrations.CreateModel(
            name="EventPlugin",
            fields=[
                ("is_enabled", models.BooleanField(default=True, verbose_name="是否启用")),
                ("is_deleted", models.BooleanField(default=False, verbose_name="是否删除")),
                ("create_user", models.CharField(blank=True, default="", max_length=32, verbose_name="创建人")),
                ("create_time", models.DateTimeField(auto_now_add=True, verbose_name="创建时间")),
                ("update_user", models.CharField(blank=True, default="", max_length=32, verbose_name="最后修改人")),
                ("update_time", models.DateTimeField(auto_now=True, verbose_name="最后修改时间")),
                ("plugin_id", models.CharField(max_length=64, primary_key=True, serialize=False, verbose_name="插件ID")),
                ("plugin_display_name", models.CharField(blank=True, default="", max_length=64, verbose_name="插件别名")),
                (
                    "plugin_type",
                    models.CharField(
                        choices=[("http_push", "HTTP 推送"), ("http_pull", "HTTP 拉取"), ("email_pull", "Email 拉取")],
                        db_index=True,
                        max_length=32,
                        verbose_name="插件类型",
                    ),
                ),
                ("summary", models.TextField(blank=True, default="", verbose_name="概述")),
                ("author", models.CharField(blank=True, default="", max_length=64, verbose_name="作者")),
                ("description", models.TextField(blank=True, default="", verbose_name="详细描述，markdown文本")),
                ("tutorial", models.TextField(blank=True, default="", verbose_name="配置向导，markdown文本")),
                ("logo", models.ImageField(null=True, upload_to="", verbose_name="logo文件")),
                ("data_id", models.IntegerField(default=0, verbose_name="数据ID")),
                ("package_dir", models.TextField(blank=True, default="", verbose_name="包路径")),
                ("bk_biz_id", models.IntegerField(blank=True, db_index=True, default=0, verbose_name="业务ID")),
                ("tags", bkmonitor.utils.db.fields.JsonField(default=[], verbose_name="插件标签")),
                (
                    "scenario",
                    models.CharField(
                        choices=[("MONITOR", "监控工具"), ("REST_API", "Rest API"), ("EMAIL", "电子邮件")],
                        default="MONITOR",
                        max_length=64,
                        verbose_name="场景",
                    ),
                ),
                ("popularity", models.IntegerField(default=0, verbose_name="热度")),
                (
                    "status",
                    models.CharField(
                        choices=[
                            ("ENABLED", "已启用"),
                            ("UPDATABLE", "有更新"),
                            ("NO_DATA", "无数据"),
                            ("REMOVE_SOON", "将下架"),
                            ("REMOVED", "已下架"),
                            ("DISABLED", "已停用"),
                            ("AVAILABLE", "可用"),
                        ],
                        default="ENABLED",
                        max_length=32,
                        verbose_name="状态",
                    ),
                ),
                ("ingest_config", bkmonitor.utils.db.fields.JsonField(default=None, verbose_name="接入配置")),
                ("normalization_config", bkmonitor.utils.db.fields.JsonField(default=[], verbose_name="字段清洗规则")),
            ],
            options={
                "verbose_name": "插件信息",
                "verbose_name_plural": "插件信息",
            },
        ),
        migrations.CreateModel(
            name="StrategyActionConfigRelation",
            fields=[
                ("id", models.AutoField(auto_created=True, primary_key=True, serialize=False, verbose_name="ID")),
                ("is_enabled", models.BooleanField(default=True, verbose_name="是否启用")),
                ("is_deleted", models.BooleanField(default=False, verbose_name="是否删除")),
                ("create_user", models.CharField(blank=True, default="", max_length=32, verbose_name="创建人")),
                ("create_time", models.DateTimeField(auto_now_add=True, verbose_name="创建时间")),
                ("update_user", models.CharField(blank=True, default="", max_length=32, verbose_name="最后修改人")),
                ("update_time", models.DateTimeField(auto_now=True, verbose_name="最后修改时间")),
                ("strategy_id", models.IntegerField(verbose_name="故障自愈的策略ID")),
                ("config_id", models.IntegerField(verbose_name="响应动作配置ID")),
                ("batch_operate", models.BooleanField(verbose_name="是否合并处理")),
                (
                    "signal",
                    models.CharField(
                        choices=[("manual", "手动"), ("abnormal", "告警产生时"), ("recovered", "告警恢复时"), ("closed", "告警关闭时")],
                        max_length=64,
                    ),
                ),
            ],
            options={
                "verbose_name": "策略响应动作配置关联表",
                "verbose_name_plural": "策略响应动作配置关联表",
                "db_table": "strategy_action_relation",
            },
        ),
        migrations.AlterField(
            model_name="shield",
            name="category",
            field=models.CharField(
                choices=[("scope", "范围屏蔽"), ("strategy", "策略屏蔽"), ("event", "事件屏蔽"), ("alert", "告警屏蔽")],
                max_length=32,
                verbose_name="屏蔽类型",
            ),
        ),
        migrations.AlterUniqueTogether(
            name="convergerelation",
            unique_together={("converge_id", "related_id", "related_type")},
        ),
    ]

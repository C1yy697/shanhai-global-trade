# 山海鲜途·全球通农产品出海智能赋能平台 V1.4

浏览器端单机演示版。使用原生 HTML、CSS 和 JavaScript，无需安装依赖，已移除外部字体请求，可直接离线打开。

## V1.4 交易前台与协同服务

- 首页按“山海鲜途”产品展示与海外采购对接定位设计，包含首页、产品大厅、采购需求和询价中心。
- 产品大厅支持中英文字段、产品分类/产地筛选、搜索、收藏和询价。
- 采购需求支持发布演示需求，询价中心保留双方询价状态和本地询价记录。
- 增加山海 AI 助手：支持产品推荐、采购流程问答和出海资料提示。当前为浏览器端演示逻辑，正式上线可接入企业模型或 OpenAI 兼容接口。
- AI 助手增加在线状态、匹配进度、推荐产品卡和目标市场指标，打开后可直接查看推荐产品详情。
- 登录和注册进入独立身份页面；产品详情中的“向供应方询价”进入独立询价页面，提交后回到询价中心。
- 首页特色选品扩展为 8 个品类，产品大厅继续支持搜索、分类和产地筛选。
- 原有批次管理、合规校验和追溯工作台保留在 `workspace.html`。
- 增加采购方工作台：多款产品加入选品清单、统一询价、报价口径比较和试单反馈记录。
- 增加供应商工作台：合作社登记授权农户资料、可供数量和供货期，并用供货日历区分预计可供、上市期和已确认供货。
- 增加出海准备与服务中心：展示官方信息指引、双语资料整理、专业机构转介和试单跟进，并记录服务需求及平台服务边界。

## 启动

在文件管理器中打开 `index.html`，或将整个目录放到任意静态 Web 服务器目录。支持当前版本的 Chrome、Edge、Firefox 和 Safari。

使用 Python 启动本地平台：

```powershell
python -m http.server 8765 --directory outputs
```

启动后复制到浏览器：`http://127.0.0.1:8765/shanhai-platform/index.html`

当前临时公网演示地址（依赖本机服务器和隧道保持运行）：
`https://23c2297db584e7.lhr.life/shanhai-platform/index.html`

该地址适合跨计算机演示，不是永久部署域名。永久使用应部署到正式静态托管服务。

已部署的 GitHub Pages 地址：
`https://c1yy697.github.io/shanhai-global-trade/`

## GitHub Pages 发布

项目已包含 `.github/workflows/pages.yml` 和 `publish-github-pages.ps1`。完成 GitHub CLI 登录后，在 PowerShell 中执行：

```powershell
cd C:\Users\HP\Documents\Codex\2026-10-17\new-chat\outputs\shanhai-platform
.\publish-github-pages.ps1 -Repository 你的GitHub用户名/shanhai-global-trade
```

工作流完成后，平台地址为 `https://你的GitHub用户名.github.io/shanhai-global-trade/`。如需自定义域名，必须先拥有该域名并将 DNS 指向 GitHub Pages，再执行：

```powershell
.\publish-github-pages.ps1 -Repository 你的GitHub用户名/shanhai-global-trade -CustomDomain example.com
```

## 功能

- 工作台：批次概览、资料归集率、待关注事项和近期记录。
- 产品批次：新建、维护、搜索、筛选及 CSV 导出。
- 合规校验：按目标市场和产品类别运行演示规则的资料完整性检查。
- 追溯查询：查看并添加生产、加工、检测、仓储和物流事件。
- 市场规则：查看规则并启用或停用演示检查项。
- 数据与设置：导出/导入 JSON 备份、恢复演示数据。

## V1.1 优化

- 自动兼容旧版 V1.0 本地数据，并对导入批次做结构化清洗。
- 新建批次时校验重复编号，避免误覆盖已有记录。
- 支持通过地址栏 `#dashboard`、`#batches` 等路由恢复当前页面。
- 增加本地存储异常提示、导入数量上限和打印样式。

## 数据与限制

数据保存在浏览器 `localStorage`，不上传服务器。清理浏览器站点数据会删除本地记录，建议先导出 JSON 备份。默认市场规则和业务记录均为示例数据。软件不连接海关、检测机构、跨境电商或物流服务，不作实际贸易合规判断，也不实现区块链存证。

## 软著登记准备

登记申请中的软件名称、版本、权利人、开发者、开发完成日期和权属方式应由实际开发者核实。登记时提供的源程序和说明文档应来自最终固定的软件版本；不得把示例数据或规划功能表述成已对接的外部系统或已验证的法规结论。

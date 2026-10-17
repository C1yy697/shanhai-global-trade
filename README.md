# 山海鲜途·全球通农产品出海智能赋能平台 V1.0

浏览器端单机演示版。使用原生 HTML、CSS 和 JavaScript，无需安装依赖。

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

## 数据与限制

数据保存在浏览器 `localStorage`，不上传服务器。清理浏览器站点数据会删除本地记录，建议先导出 JSON 备份。默认市场规则和业务记录均为示例数据。软件不连接海关、检测机构、跨境电商或物流服务，不作实际贸易合规判断，也不实现区块链存证。

## 软著登记准备

登记申请中的软件名称、版本、权利人、开发者、开发完成日期和权属方式应由实际开发者核实。登记时提供的源程序和说明文档应来自最终固定的软件版本；不得把示例数据或规划功能表述成已对接的外部系统或已验证的法规结论。

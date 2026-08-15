# 边界之外

一个整理中国大陆访问海外主流网站时常见情况的中文信息站。网站按学习与研究、大模型与 AI、代码与社区、云平台、软件与镜像库、社交与协作分类，提供：

- 网站功能简介
- 常见访问状态及影响
- 官方网站链接
- 境内可用的替代网站
- 软件仓库、模型和下载资源的镜像链接
- 镜像使用与软件供应链安全提示

> 本项目只提供一般性信息，不构成法律意见，也不提供规避网络监管的操作指导。

## 欢迎提供最新数据

网站可用性会随地区、运营商、时间和服务商政策变化，我们非常欢迎大家帮助更新数据。

可以提交 Issue 或 Pull Request 来：

- 修正已经失效或跳转错误的链接
- 更新网站访问状态
- 增加新的替代服务或可信镜像
- 补充遗漏的网站和分类
- 修正不准确、过时或表述不清的说明

提交访问状态更新时，建议同时说明测试日期、所在地区、运营商和现象。请勿在 Issue 中公开账号、Token、IP 地址等敏感信息。

## 修改网站数据

全部网站数据集中在：

```text
src/data/sites.json
```

这是普通 JSON 文件，不需要修改 HTML 或 JavaScript。每个网站的数据格式如下：

```json
{
  "id": "maven-central",
  "category": "registry",
  "name": "Maven Central",
  "initials": "MV",
  "intro": "Java 与 JVM 生态最常用的公共依赖中央仓库。",
  "status": "partial",
  "accessSummary": "Java 依赖量大且请求频繁，直接连接中央仓库容易超时。",
  "official": {
    "name": "中央仓库",
    "url": "https://central.sonatype.com/"
  },
  "alternatives": [
    {
      "type": "mirror",
      "name": "阿里云 Maven",
      "url": "https://maven.aliyun.com/repository/public"
    }
  ]
}
```

字段说明：

- `id`：稳定且唯一的英文标识，发布后尽量不要修改
- `category`：所属分类，必须对应 `categories` 中的键
- `name`：网站显示名称
- `initials`：卡片上的两位左右缩写
- `intro`：网站本身的功能简介
- `status`：`blocked`、`partial` 或 `region`
- `accessSummary`：常见访问现象，不要写无法验证的绝对结论
- `official`：官方入口
- `alternatives`：替代或镜像列表；`type` 使用 `alternative` 或 `mirror`

修改完成后，也请更新文件顶部的 `updatedAt` 日期。

## 本地开发

需要 Node.js 20 或更高版本。

```bash
npm install
npm run dev
```

生产构建：

```bash
npm run build
```

构建产物位于 `dist/`，包括首页和网站详情页。

## GitHub Pages

项目已经包含 `.github/workflows/deploy-pages.yml`。仓库启用 GitHub Pages 并将发布来源设为 **GitHub Actions** 后，推送到 `main` 或 `master` 分支会自动构建和发布。

工作流会根据仓库名称设置 Vite 的 `BASE_PATH`，因此可以发布为：

```text
https://<GitHub用户名>.github.io/<仓库名>/
```

如果仓库暂时为私有，请先确认当前 GitHub 套餐是否支持该仓库的 Pages 发布与所需访问范围。计划开放社区贡献时，可将仓库改为公开，并在仓库中启用 Issues 和 Pull Requests。

## 内容与安全说明

- 访问状态是常见情况概览，不代表实时测量结果。
- 第三方镜像不等于官方来源，使用前请检查维护方、同步时间、签名和哈希值。
- 不要向非官方镜像提交密码、Cookie、访问令牌或其他凭据。
- 企业跨境联网与数据传输应由组织的 IT、信息安全和法务团队评估。

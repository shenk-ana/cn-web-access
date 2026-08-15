import directoryData from "./data/sites.json";

const root = document.querySelector("#detail-root");
const params = new URLSearchParams(window.location.search);
const siteId = params.get("site");
const { categories, sites } = directoryData;
const site = sites.find((item) => item.id === siteId);

const statusContent = {
  blocked: {
    label: "通常受限",
    title: "直接访问通常不可用",
    reason:
      "该服务或其关键基础设施在中国大陆通常无法直接连接。页面、登录、媒体资源和第三方嵌入内容均可能受到影响。",
  },
  partial: {
    label: "速度不稳",
    title: "可访问不等于稳定可用",
    reason:
      "该服务通常并非完全不可达，但国际出口拥塞、CDN 节点、DNS 与第三方资源会造成加载缓慢、下载中断或功能缺失。",
  },
  region: {
    label: "区域限制",
    title: "受服务商地区政策影响",
    reason:
      "服务商可能依据可用地区、账号归属、手机号或付款方式限制注册和使用。网络能够连接时，也不代表账号具备使用资格。",
  },
};

const categoryGuidance = {
  study: [
    "优先使用学校或研究机构正式订阅的数据库入口。",
    "下载论文时核对 DOI、作者与版本，避免引用未经确认的转载内容。",
    "需要长期协作时，选择数据存储位置和隐私条款明确的平台。",
  ],
  ai: [
    "不要向公共模型提交公司机密、个人信息或未公开代码。",
    "使用境内服务前确认模型能力、数据留存与内容使用条款。",
    "模型文件优先从官方仓库或可验证哈希值的可信镜像下载。",
  ],
  code: [
    "重要仓库应设置多个远端或定期备份，避免依赖单一托管平台。",
    "迁移镜像后核对提交记录、标签、Release 与 Git LFS 文件是否完整。",
    "企业代码应使用组织批准的托管与身份认证方式。",
  ],
  cloud: [
    "中国区与全球区通常账号、合同和网络相互独立，迁移前确认架构差异。",
    "涉及跨境数据时，先完成数据分类和合规评估。",
    "部署网站时检查字体、脚本、对象存储和 API 是否仍依赖境外资源。",
  ],
  registry: [
    "镜像用于加速下载，不代表软件来源自动可信。",
    "生产环境应锁定依赖版本，并使用校验和、签名或软件物料清单。",
    "企业可搭建内部代理仓库，统一缓存、审计和漏洞扫描。",
  ],
  social: [
    "替代平台的用户群和内容规则不同，迁移前导出重要资料。",
    "注册账号时启用多因素认证并保存恢复代码。",
    "企业沟通应使用组织批准的协作平台，避免敏感信息外泄。",
  ],
  agent: [
    "不要让 AI 智能体访问包含密钥、凭据或客户数据的仓库与文件。",
    "使用前确认代码与提示词是否会被上传、留存或用于训练。",
    "对智能体自动生成或修改的代码务必人工审查后再提交和上线。",
  ],
  media: [
    "生成内容可能涉及版权、肖像权和商标，商业使用前先核对该平台授权条款。",
    "不要上传含有他人隐私、证件或未授权肖像的素材。",
    "公开传播前检查画面中的文字、品牌标识和敏感内容是否合规。",
  ],
};

function linkCard(link, type) {
  const host = new URL(link.url).hostname;
  const typeLabels = {
    original: "OFFICIAL",
    alternative: "ALT",
    mirror: "MIRROR",
  };
  const title =
    type === "original" && /^(原网站|全球官网|中央仓库|官网)$/u.test(link.name)
      ? host
      : link.name;

  return `
    <a class="detail-link-card ${type}" href="${link.url}" target="_blank" rel="noopener noreferrer">
      <span class="detail-link-type">${typeLabels[type]}</span>
      <strong>${title}</strong>
      <small>${host}</small>
      <span class="detail-link-arrow" aria-hidden="true">↗</span>
    </a>
  `;
}

function renderNotFound() {
  document.title = "未找到网站｜边界之外";
  root.innerHTML = `
    <section class="detail-loading">
      <p class="eyebrow">NOT FOUND</p>
      <h1>没有找到该网站</h1>
      <p>链接可能不完整，请返回目录重新选择。</p>
      <a class="primary-link" href="./index.html#status">返回网站目录 <span>→</span></a>
    </section>
  `;
}

function renderDetail() {
  if (!site) {
    renderNotFound();
    return;
  }

  const category = categories[site.category];
  const status = statusContent[site.status];
  const related = sites
    .filter((item) => item.category === site.category && item.name !== site.name)
    .slice(0, 3);
  const mirrorLinks = site.alternatives.filter(
    (link) => link.type === "mirror",
  );
  const alternativeLinks = site.alternatives.filter(
    (link) => link.type === "alternative",
  );

  document.title = `${site.name}｜边界之外`;
  root.innerHTML = `
    <section class="detail-hero">
      <div class="detail-breadcrumb">
        <a href="./index.html#status">网站目录</a>
        <span>/</span>
        <span>${category.title}</span>
      </div>
      <div class="detail-title-row">
        <span class="detail-monogram">${site.initials}</span>
        <div>
          <p class="eyebrow">CATEGORY ${category.code} / ${category.title}</p>
          <h1>${site.name}</h1>
        </div>
        <span class="badge badge-${site.status}">${status.label}</span>
      </div>
      <p class="detail-intro">${site.intro}</p>
    </section>

    <section class="detail-body">
      <article class="detail-main">
        <div class="detail-section-heading">
          <span>01</span>
          <div>
            <p class="eyebrow">ACCESS CONDITION</p>
            <h2>访问情况</h2>
          </div>
        </div>
        <div class="condition-card">
          <div class="condition-status badge-${site.status}">
            <span class="pulse"></span>
            ${status.title}
          </div>
          <p>${site.accessSummary}</p>
          <p>${status.reason}</p>
        </div>

        <div class="detail-section-heading">
          <span>02</span>
          <div>
            <p class="eyebrow">LINKS & OPTIONS</p>
            <h2>原站与可用路径</h2>
          </div>
        </div>
        <div class="detail-link-section">
          <div class="link-section-title">
            <h3>原网站</h3>
            <p>服务官方入口</p>
          </div>
          <div class="detail-links">
            ${linkCard(site.official, "original")}
          </div>
        </div>
        <div class="detail-link-section">
          <div class="link-section-title">
            <h3>替代网站</h3>
            <p>功能相近的境内可用服务</p>
          </div>
          <div class="detail-links">
            ${
              alternativeLinks.length
                ? alternativeLinks
                    .map((link) => linkCard(link, "alternative"))
                    .join("")
                : '<p class="no-link-option">暂无收录的替代网站。</p>'
            }
          </div>
        </div>
        <div class="detail-link-section mirror-section">
          <div class="link-section-title">
            <h3>镜像网站</h3>
            <p>用于资源同步或下载加速</p>
          </div>
          <div class="detail-links">
            ${
              mirrorLinks.length
                ? mirrorLinks.map((link) => linkCard(link, "mirror")).join("")
                : '<p class="no-link-option">该服务暂无推荐镜像，请优先使用替代网站。</p>'
            }
          </div>
        </div>
        ${
          mirrorLinks.length
            ? `<p class="mirror-warning">
                <strong>镜像安全提示</strong>
                第三方镜像的同步时间、完整性和可用性可能变化。下载依赖、容器或模型时，请校验版本、签名或哈希值，不要向非官方镜像提交账号密码和访问令牌。
              </p>`
            : ""
        }

        <div class="detail-section-heading">
          <span>03</span>
          <div>
            <p class="eyebrow">PRACTICAL GUIDE</p>
            <h2>使用建议</h2>
          </div>
        </div>
        <ol class="guidance-list">
          ${categoryGuidance[site.category]
            .map((item, index) => `<li><span>0${index + 1}</span><p>${item}</p></li>`)
            .join("")}
        </ol>
      </article>

      <aside class="detail-aside">
        <div class="fact-panel">
          <p class="panel-label">QUICK FACTS</p>
          <dl>
            <div><dt>所属分类</dt><dd>${category.title}</dd></div>
            <div><dt>访问判断</dt><dd>${status.label}</dd></div>
            <div><dt>替代网站</dt><dd>${alternativeLinks.length} 个</dd></div>
            <div><dt>镜像网站</dt><dd>${mirrorLinks.length} 个</dd></div>
            <div><dt>更新时间</dt><dd>2026.08</dd></div>
          </dl>
        </div>
        <div class="related-panel">
          <p class="panel-label">RELATED / 同类网站</p>
          ${related
            .map(
              (item) => `
                <a href="./detail.html?site=${item.id}">
                  <span class="related-monogram">${item.initials}</span>
                  <span><strong>${item.name}</strong><small>${statusContent[item.status].label}</small></span>
                  <b aria-hidden="true">→</b>
                </a>
              `,
            )
            .join("")}
        </div>
      </aside>
    </section>
  `;
}

renderDetail();

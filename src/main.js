import directoryData from "./data/sites.json";

export const { categories, sites } = directoryData;
export const siteIntros = Object.fromEntries(
  sites.map((site) => [site.name, site.intro]),
);

const filters = document.querySelectorAll(".filter");
const searchInput = document.querySelector("#site-search");
const emptyState = document.querySelector("#empty-state");
const siteGrid = document.querySelector("#site-grid");

let activeFilter = "all";
let openCategory = "study";

const statusLabels = {
  blocked: "通常受限",
  partial: "速度不稳",
  region: "区域限制",
};

function createLink(link, kind) {
  return `
    <a class="site-link ${kind}" href="${link.url}" target="_blank" rel="noopener noreferrer">
      <span>${link.name}</span>
      <span aria-hidden="true">↗</span>
    </a>
  `;
}

function createCard(site) {
  const alternatives = site.alternatives
    .map((link) => createLink(link, "alternative-link"))
    .join("");
  const detailUrl = `./detail.html?site=${site.id}`;

  return `
    <article class="site-card directory-card" data-detail="${detailUrl}" tabindex="0" aria-label="查看 ${site.name} 详情">
      <div class="card-topline">
        <span class="site-monogram">${site.initials}</span>
        <span class="badge badge-${site.status}">${statusLabels[site.status]}</span>
      </div>
      <div class="card-content">
        <h4>${site.name}</h4>
        <p class="site-intro">${siteIntros[site.name]}</p>
        <small class="access-label">访问情况</small>
        <p>${site.accessSummary}</p>
      </div>
      <div class="link-groups">
        <div class="link-group">
          <small>ORIGINAL / 原站</small>
          ${createLink(site.official, "original-link")}
        </div>
        <div class="link-group">
          <small>ALTERNATIVE / 替代或镜像</small>
          ${alternatives}
        </div>
      </div>
      <a class="detail-entry" href="${detailUrl}">查看完整资料 <span aria-hidden="true">→</span></a>
    </article>
  `;
}

function renderDirectory() {
  const keyword = searchInput.value.trim().toLocaleLowerCase("zh-CN");
  let totalVisible = 0;

  siteGrid.innerHTML = Object.entries(categories)
    .map(([key, category]) => {
      const categorySites = sites.filter((site) => {
        const searchableText = [
          site.name,
          siteIntros[site.name],
          site.accessSummary,
          ...site.alternatives.flatMap((link) => [link.name, link.url]),
        ]
          .join(" ")
          .toLocaleLowerCase("zh-CN");
        const matchesStatus =
          activeFilter === "all" || site.status === activeFilter;
        return (
          site.category === key &&
          matchesStatus &&
          searchableText.includes(keyword)
        );
      });

      totalVisible += categorySites.length;
      if (categorySites.length === 0) return "";

      const isOpen = key === openCategory || keyword.length > 0;
      return `
        <section class="accordion-item ${isOpen ? "open" : ""}">
          <button class="accordion-trigger" type="button" data-category="${key}" aria-expanded="${isOpen}">
            <span class="accordion-code">${category.code}</span>
            <span class="accordion-copy">
              <strong>${category.title}</strong>
              <small>${category.description}</small>
            </span>
            <span class="accordion-count">${categorySites.length} 个网站</span>
            <span class="accordion-icon" aria-hidden="true">＋</span>
          </button>
          <div class="accordion-panel" ${isOpen ? "" : "hidden"}>
            <div class="site-grid directory-grid">
              ${categorySites.map(createCard).join("")}
            </div>
          </div>
        </section>
      `;
    })
    .join("");

  emptyState.hidden = totalVisible > 0;
}

siteGrid?.addEventListener("click", (event) => {
  const trigger = event.target.closest(".accordion-trigger");
  if (trigger) {
    openCategory =
      openCategory === trigger.dataset.category ? "" : trigger.dataset.category;
    renderDirectory();
    return;
  }

  const card = event.target.closest(".directory-card");
  if (card && !event.target.closest("a")) {
    window.location.href = card.dataset.detail;
  }
});

siteGrid?.addEventListener("keydown", (event) => {
  const card = event.target.closest(".directory-card");
  if (card && (event.key === "Enter" || event.key === " ")) {
    event.preventDefault();
    window.location.href = card.dataset.detail;
  }
});

filters.forEach((button) => {
  button.addEventListener("click", () => {
    filters.forEach((item) => item.classList.remove("active"));
    button.classList.add("active");
    activeFilter = button.dataset.filter;
    renderDirectory();
  });
});

if (searchInput && siteGrid) {
  searchInput.addEventListener("input", renderDirectory);
  renderDirectory();
}

const scenarioContent = {
  daily: {
    label: "推荐路径 / 01",
    title: "使用国内可用的同类服务",
    copy: "对搜索、地图、影音和社交等日常需求，优先采用已在境内合规运营的平台，通常具有更好的速度和本地内容支持。",
    rows: [
      ["搜索与知识", "必应、百度、知乎"],
      ["视频与社区", "哔哩哔哩、微博、小红书"],
      ["地图与出行", "高德地图、百度地图"],
    ],
  },
  work: {
    label: "推荐路径 / 02",
    title: "使用企业批准的跨境连接",
    copy: "跨国企业应通过具备资质的运营商或云服务商采购跨境专线、SD-WAN 等服务，由 IT 部门统一配置访问控制、审计与数据保护。",
    rows: [
      ["连接方式", "合规跨境专线、企业 SD-WAN"],
      ["管理责任", "企业 IT 与信息安全团队"],
      ["关键要求", "最小权限、日志审计、数据分类"],
    ],
  },
  research: {
    label: "推荐路径 / 03",
    title: "通过机构授权获取学术资源",
    copy: "高校与研究机构通常提供数据库订阅、图书馆代理或校外访问入口。优先联系图书馆，使用机构正式提供的账号与认证系统。",
    rows: [
      ["论文数据库", "机构订阅与图书馆入口"],
      ["开放资源", "开放获取期刊、预印本平台"],
      ["协作需求", "学校批准的科研网络服务"],
    ],
  },
  travel: {
    label: "推荐路径 / 04",
    title: "提前准备漫游与离线资料",
    copy: "短期到访时可向移动运营商确认国际漫游或境外 SIM 的适用范围，同时提前下载地图、票据、联系人与工作文件，降低临时网络依赖。",
    rows: [
      ["通信准备", "咨询运营商漫游政策"],
      ["离线准备", "地图、票据、翻译与重要文件"],
      ["账户安全", "启用多因素认证与恢复代码"],
    ],
  },
};

const tabs = document.querySelectorAll(".scenario-tab");
const panel = document.querySelector("#solution-panel");

function renderScenario(key) {
  const content = scenarioContent[key];
  const rows = content.rows
    .map(([label, value]) => `<li><span>${label}</span><b>${value}</b></li>`)
    .join("");

  panel.innerHTML = `
    <p class="panel-label">${content.label}</p>
    <h3>${content.title}</h3>
    <p class="panel-copy">${content.copy}</p>
    <ul>${rows}</ul>
    <p class="legal-note">
      <strong>合规提示</strong>
      网络访问政策和技术状态会变化。涉及跨境联网、数据传输或企业业务时，请咨询所在组织的 IT 与法务人员，并遵守当地法律法规。
    </p>
  `;
}

tabs.forEach((tab) => {
  tab.addEventListener("click", () => {
    tabs.forEach((item) => {
      item.classList.remove("active");
      item.setAttribute("aria-selected", "false");
    });
    tab.classList.add("active");
    tab.setAttribute("aria-selected", "true");
    renderScenario(tab.dataset.scenario);
  });
});

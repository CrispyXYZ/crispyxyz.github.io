const tools = [
  {
    icon: "🎲",
    title: "随机选择器",
    description: "随机选择、随机数生成、UUID",
    link: "random-tool",
    enabled: true,
  },
  {
    icon: "📝",
    title: "文本工具",
    description: "字数统计、格式清理",
    link: "text-tool",
    enabled: true,
  },
  {
    "icon": "📄",
    "title": "LaTeX/Markdown渲染器",
    "description": "实时渲染LaTeX数学公式和Markdown文本",
    "link": "latex-markdown-renderer",
    "enabled": true
  },
  {
    icon: "🔢",
    title: "计算工具",
    description: "单位换算、货币转换、科学计算器",
    link: "#",
    enabled: false,
  },
  {
    icon: "🖼️",
    title: "图片工具",
    description: "图片压缩、格式转换、尺寸调整",
    link: "#",
    enabled: false,
  },
  {
    icon: "🔒",
    title: "加密工具",
    description: "MD5生成、Base64编码、AES加密",
    link: "#",
    enabled: false,
  },
  {
    icon: "🌐",
    title: "网络工具",
    description: "IP查询、Ping测试、DNS查询",
    link: "#",
    enabled: false,
  },
  {
    icon: "📊",
    title: "数据工具",
    description: "JSON格式化、XML转换、CSV处理",
    link: "#",
    enabled: false,
  },
  {
    icon: "🎨",
    title: "设计工具",
    description: "颜色选择器、CSS生成器、图标库",
    link: "#",
    enabled: false,
  },
  {
    icon: "📅",
    title: "时间工具",
    description: "时间戳转换、日期计算、世界时间",
    link: "#",
    enabled: false,
  },
];

function generateToolCard(tool) {
  return `
    <div class="tool-card ${
      tool.enabled ? "enabled" : "disabled"
    }" data-enabled="${tool.enabled}">
      <div class="tool-icon">${tool.icon}</div>
      <h3 class="tool-title">${tool.title}</h3>
      <p class="tool-description">${tool.description}</p>
      ${
        tool.enabled
          ? `<a href="${tool.link}" class="tool-link">使用工具 →</a>`
          : `<span class="tool-link">开发中</span>`
      }
    </div>
  `;
}

function renderTools() {
  const container = document.getElementById("tools-container");
  container.innerHTML = "";

  tools.forEach((tool) => {
    container.innerHTML += generateToolCard(tool);
  });

  document.querySelectorAll(".tool-card.enabled").forEach((card) => {
    card.addEventListener("click", function (e) {
      if (!e.target.closest("a")) {
        const link = this.querySelector("a");
        if (link) {
          window.location.href = link.href;
        }
      }
    });
  });
}

function setupSearch() {
  const searchBox = document.querySelector(".search-box");

  searchBox.addEventListener("input", function (e) {
    const searchTerm = e.target.value.toLowerCase();
    const toolCards = document.querySelectorAll(".tool-card");

    toolCards.forEach((card) => {
      const title = card.querySelector(".tool-title").textContent.toLowerCase();
      const description = card
        .querySelector(".tool-description")
        .textContent.toLowerCase();

      if (title.includes(searchTerm) || description.includes(searchTerm)) {
        card.style.display = "flex";
      } else {
        card.style.display = "none";
      }
    });
  });
}

document.addEventListener("DOMContentLoaded", function () {
  renderTools();
  setupSearch();
});

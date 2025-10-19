document.addEventListener("DOMContentLoaded", function () {
  // 标签页切换功能
  const tabButtons = document.querySelectorAll(".tab-button");
  const tabContents = document.querySelectorAll(".tab-content");

  tabButtons.forEach((button) => {
    button.addEventListener("click", () => {
      const tabId = button.getAttribute("data-tab");

      // 移除所有活动状态
      tabButtons.forEach((btn) => btn.classList.remove("active"));
      tabContents.forEach((content) => content.classList.remove("active"));

      // 添加当前活动状态
      button.classList.add("active");
      document.getElementById(tabId).classList.add("active");
    });
  });

  // 初始化各个标签页的功能
  initRandomPicker();
  initRandomNumber();
  initUUIDGenerator();
});

// 随机选择器功能
function initRandomPicker() {
  const itemList = document.getElementById("itemList");
  const selectCount = document.getElementById("selectCount");
  const selectionType = document.getElementById("selectionType");
  const weightsContainer = document.getElementById("weightsContainer");
  const weightsList = document.getElementById("weightsList");
  const randomizeBtn = document.getElementById("randomizeBtn");
  const resetBtn = document.getElementById("resetBtn");
  const resultContainer = document.getElementById("resultContainer");
  const historyContainer = document.getElementById("historyContainer");

  let selectionHistory = [];

  // 更新权重输入框
  function updateWeightInputs() {
    const items = getItemsFromTextarea();
    weightsList.innerHTML = "";

    items.forEach((item, index) => {
      const weightItem = document.createElement("div");
      weightItem.className = "form-group";
      weightItem.style.marginBottom = "10px";

      weightItem.innerHTML = `
                <div style="display: flex; align-items: center; gap: 10px;">
                    <span style="flex: 1;">${item}</span>
                    <input type="number" min="1" max="10" value="5" class="weight-input" data-index="${index}" style="width: 70px;">
                </div>
            `;

      weightsList.appendChild(weightItem);
    });

    // 显示或隐藏权重容器
    weightsContainer.style.display =
      selectionType.value === "weighted" ? "block" : "none";
  }

  // 从文本区域获取项目列表
  function getItemsFromTextarea() {
    return itemList.value
      .split("\n")
      .map((item) => item.trim())
      .filter((item) => item.length > 0);
  }

  // 获取权重值
  function getWeights() {
    const weightInputs = document.querySelectorAll(".weight-input");
    const weights = [];

    weightInputs.forEach((input) => {
      weights.push(parseInt(input.value) || 5);
    });

    return weights;
  }

  // 随机选择项目
  function selectRandomItems() {
    const items = getItemsFromTextarea();
    const count = parseInt(selectCount.value) || 1;
    const type = selectionType.value;

    if (items.length === 0) {
      alert("请至少输入一个项目！");
      return;
    }

    if (count > items.length && type === "unique") {
      alert(`不重复选择模式下，选择数量不能超过项目总数（${items.length}）！`);
      return;
    }

    let selectedItems = [];

    if (type === "random") {
      // 完全随机选择（可能重复）
      for (let i = 0; i < count; i++) {
        const randomIndex = Math.floor(Math.random() * items.length);
        selectedItems.push(items[randomIndex]);
      }
    } else if (type === "unique") {
      // 不重复选择
      const shuffled = [...items].sort(() => 0.5 - Math.random());
      selectedItems = shuffled.slice(0, count);
    } else if (type === "weighted") {
      // 加权随机选择
      const weights = getWeights();
      const totalWeight = weights.reduce((sum, weight) => sum + weight, 0);

      for (let i = 0; i < count; i++) {
        let random = Math.random() * totalWeight;
        let weightSum = 0;

        for (let j = 0; j < items.length; j++) {
          weightSum += weights[j];
          if (random <= weightSum) {
            selectedItems.push(items[j]);
            break;
          }
        }
      }
    }

    displayResults(selectedItems);
    addToHistory(selectedItems);
  }

  // 显示选择结果
  function displayResults(selectedItems) {
    resultContainer.innerHTML = "";

    if (selectedItems.length === 0) {
      resultContainer.innerHTML =
        '<div class="empty-state">没有选择任何项目</div>';
      return;
    }

    selectedItems.forEach((item, index) => {
      const resultItem = document.createElement("div");
      resultItem.className = "result-item";
      if (selectedItems.length === 1) {
        resultItem.classList.add("highlight");
      }
      resultItem.textContent = `${index + 1}. ${item}`;
      resultContainer.appendChild(resultItem);
    });
  }

  // 添加到历史记录
  function addToHistory(selectedItems) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();

    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    historyItem.innerHTML = `
            <span>${selectedItems.join(", ")}</span>
            <span class="history-time">${timeString}</span>
        `;

    // 添加到历史记录顶部
    if (historyContainer.querySelector(".empty-state")) {
      historyContainer.innerHTML = "";
    }

    historyContainer.prepend(historyItem);

    // 限制历史记录数量
    const historyItems = historyContainer.querySelectorAll(".history-item");
    if (historyItems.length > 10) {
      historyContainer.removeChild(historyItems[historyItems.length - 1]);
    }
  }

  // 重置表单
  function resetForm() {
    itemList.value = "";
    selectCount.value = "1";
    selectionType.value = "random";
    resultContainer.innerHTML =
      '<div class="empty-state">点击"随机选择"按钮查看结果</div>';
    historyContainer.innerHTML = '<div class="empty-state">暂无历史记录</div>';
    updateWeightInputs();
  }

  // 事件监听
  itemList.addEventListener("input", updateWeightInputs);
  selectionType.addEventListener("change", updateWeightInputs);
  randomizeBtn.addEventListener("click", selectRandomItems);
  resetBtn.addEventListener("click", resetForm);

  // 初始化
  updateWeightInputs();
}

// 随机数生成功能
function initRandomNumber() {
  const minValue = document.getElementById("minValue");
  const maxValue = document.getElementById("maxValue");
  const numberCount = document.getElementById("numberCount");
  const numberType = document.getElementById("numberType");
  const decimalPlacesContainer = document.getElementById(
    "decimalPlacesContainer"
  );
  const decimalPlaces = document.getElementById("decimalPlaces");
  const generateNumberBtn = document.getElementById("generateNumberBtn");
  const resetNumberBtn = document.getElementById("resetNumberBtn");
  const numberResultContainer = document.getElementById(
    "numberResultContainer"
  );
  const numberHistoryContainer = document.getElementById(
    "numberHistoryContainer"
  );

  let numberHistory = [];

  // 显示/隐藏小数位数设置
  function toggleDecimalPlaces() {
    decimalPlacesContainer.style.display =
      numberType.value === "decimal" ? "block" : "none";
  }

  // 生成随机数
  function generateRandomNumbers() {
    const min = parseFloat(minValue.value) || 0;
    const max = parseFloat(maxValue.value) || 100;
    const count = parseInt(numberCount.value) || 1;
    const type = numberType.value;
    const decimals = parseInt(decimalPlaces.value) || 2;

    if (min > max) {
      alert("最小值不能大于最大值！");
      return;
    }

    let numbers = [];

    for (let i = 0; i < count; i++) {
      let randomNum = Math.random() * (max - min) + min;

      if (type === "integer") {
        randomNum = Math.floor(randomNum);
      } else {
        randomNum = parseFloat(randomNum.toFixed(decimals));
      }

      numbers.push(randomNum);
    }

    displayNumberResults(numbers);
    addToNumberHistory(numbers);
  }

  // 显示随机数结果
  function displayNumberResults(numbers) {
    numberResultContainer.innerHTML = "";

    numbers.forEach((num, index) => {
      const resultItem = document.createElement("div");
      resultItem.className = "result-item";
      if (numbers.length === 1) {
        resultItem.classList.add("highlight");
      }
      resultItem.textContent = `${index + 1}. ${num}`;
      numberResultContainer.appendChild(resultItem);
    });
  }

  // 添加到随机数历史记录
  function addToNumberHistory(numbers) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();

    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    historyItem.innerHTML = `
            <span>${numbers.join(", ")}</span>
            <span class="history-time">${timeString}</span>
        `;

    // 添加到历史记录顶部
    if (numberHistoryContainer.querySelector(".empty-state")) {
      numberHistoryContainer.innerHTML = "";
    }

    numberHistoryContainer.prepend(historyItem);

    // 限制历史记录数量
    const historyItems =
      numberHistoryContainer.querySelectorAll(".history-item");
    if (historyItems.length > 10) {
      numberHistoryContainer.removeChild(historyItems[historyItems.length - 1]);
    }
  }

  // 重置随机数表单
  function resetNumberForm() {
    minValue.value = "1";
    maxValue.value = "100";
    numberCount.value = "1";
    numberType.value = "integer";
    decimalPlaces.value = "2";
    numberResultContainer.innerHTML =
      '<div class="empty-state">点击"生成随机数"按钮查看结果</div>';
    numberHistoryContainer.innerHTML =
      '<div class="empty-state">暂无历史记录</div>';
    toggleDecimalPlaces();
  }

  // 事件监听
  numberType.addEventListener("change", toggleDecimalPlaces);
  generateNumberBtn.addEventListener("click", generateRandomNumbers);
  resetNumberBtn.addEventListener("click", resetNumberForm);

  // 初始化
  toggleDecimalPlaces();
}

// UUID生成功能
function initUUIDGenerator() {
  const uuidCount = document.getElementById("uuidCount");
  const uuidVersion = document.getElementById("uuidVersion");
  const uuidFormat = document.getElementById("uuidFormat");
  const generateUuidBtn = document.getElementById("generateUuidBtn");
  const resetUuidBtn = document.getElementById("resetUuidBtn");
  const uuidResultContainer = document.getElementById("uuidResultContainer");
  const uuidHistoryContainer = document.getElementById("uuidHistoryContainer");

  let uuidHistory = [];

  // 生成UUID
  function generateUUIDs() {
    const count = parseInt(uuidCount.value) || 1;
    const version = uuidVersion.value;
    const format = uuidFormat.value;

    let uuids = [];

    for (let i = 0; i < count; i++) {
      let uuid;

      if (version === "v4") {
        uuid = generateUUIDv4();
      } else {
        uuid = generateUUIDv1();
      }

      // 应用格式
      if (format === "no-dashes") {
        uuid = uuid.replace(/-/g, "");
      } else if (format === "uppercase") {
        uuid = uuid.toUpperCase();
      }

      uuids.push(uuid);
    }

    displayUUIDResults(uuids);
    addToUUIDHistory(uuids);
  }

  // 生成UUID v4 (随机)
  function generateUUIDv4() {
    return "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(
      /[xy]/g,
      function (c) {
        const r = (Math.random() * 16) | 0;
        const v = c === "x" ? r : (r & 0x3) | 0x8;
        return v.toString(16);
      }
    );
  }

  // 生成UUID v1 (基于时间戳)
  function generateUUIDv1() {
    const now = new Date().getTime();
    const timeLow = (now & 0xffffffff).toString(16).padStart(8, "0");
    const timeMid = ((now >> 32) & 0xffff).toString(16).padStart(4, "0");
    const timeHigh = ((now >> 48) & 0x0fff).toString(16).padStart(4, "0") + "1"; // 版本1

    const clockSeq = Math.floor(Math.random() * 0x3fff)
      .toString(16)
      .padStart(4, "0");
    const node = Array.from({ length: 6 }, () =>
      Math.floor(Math.random() * 256)
        .toString(16)
        .padStart(2, "0")
    ).join("");

    return `${timeLow}-${timeMid}-${timeHigh}-${clockSeq}-${node}`;
  }

  // 显示UUID结果
  function displayUUIDResults(uuids) {
    uuidResultContainer.innerHTML = "";

    uuids.forEach((uuid, index) => {
      const resultItem = document.createElement("div");
      resultItem.className = "result-item uuid-item";

      resultItem.innerHTML = `
                <div class="uuid-value">${index + 1}. ${uuid}</div>
                <button class="btn copy-btn" data-uuid="${uuid}">复制</button>
            `;

      uuidResultContainer.appendChild(resultItem);
    });

    // 添加复制按钮事件
    document.querySelectorAll(".copy-btn").forEach((button) => {
      button.addEventListener("click", function () {
        const uuid = this.getAttribute("data-uuid");
        copyToClipboard(uuid);

        // 临时改变按钮文本
        const originalText = this.textContent;
        this.textContent = "已复制!";
        setTimeout(() => {
          this.textContent = originalText;
        }, 1500);
      });
    });
  }

  // 添加到UUID历史记录
  function addToUUIDHistory(uuids) {
    const now = new Date();
    const timeString = now.toLocaleTimeString();

    const historyItem = document.createElement("div");
    historyItem.className = "history-item";
    historyItem.innerHTML = `
            <span>${uuids.join(", ")}</span>
            <span class="history-time">${timeString}</span>
        `;

    // 添加到历史记录顶部
    if (uuidHistoryContainer.querySelector(".empty-state")) {
      uuidHistoryContainer.innerHTML = "";
    }

    uuidHistoryContainer.prepend(historyItem);

    // 限制历史记录数量
    const historyItems = uuidHistoryContainer.querySelectorAll(".history-item");
    if (historyItems.length > 10) {
      uuidHistoryContainer.removeChild(historyItems[historyItems.length - 1]);
    }
  }

  // 复制到剪贴板
  function copyToClipboard(text) {
    const textarea = document.createElement("textarea");
    textarea.value = text;
    document.body.appendChild(textarea);
    textarea.select();
    document.execCommand("copy");
    document.body.removeChild(textarea);
  }

  // 重置UUID表单
  function resetUUIDForm() {
    uuidCount.value = "1";
    uuidVersion.value = "v4";
    uuidFormat.value = "standard";
    uuidResultContainer.innerHTML =
      '<div class="empty-state">点击"生成UUID"按钮查看结果</div>';
    uuidHistoryContainer.innerHTML =
      '<div class="empty-state">暂无历史记录</div>';
  }

  // 事件监听
  generateUuidBtn.addEventListener("click", generateUUIDs);
  resetUuidBtn.addEventListener("click", resetUUIDForm);
}

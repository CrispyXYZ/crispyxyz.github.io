document.addEventListener("DOMContentLoaded", function () {
  const textInput = document.getElementById("textInput");
  const textOutput = document.getElementById("textOutput");
  const cleanTextBtn = document.getElementById("cleanTextBtn");
  const resetBtn = document.getElementById("resetBtn");
  const copyBtn = document.getElementById("copyBtn");

  // 统计元素
  const charCountWithSpaces = document.getElementById("charCountWithSpaces");
  const charCountNoSpaces = document.getElementById("charCountNoSpaces");
  const wordCount = document.getElementById("wordCount");
  const lineCount = document.getElementById("lineCount");

  // 清理选项
  const removeExtraSpaces = document.getElementById("removeExtraSpaces");
  const removeEmptyLines = document.getElementById("removeEmptyLines");
  const trimLines = document.getElementById("trimLines");
  const removeSpecialChars = document.getElementById("removeSpecialChars");

  // 变更信息容器
  const changesInfo = document.getElementById("changesInfo");

  // 初始化
  updateStats();

  // 事件监听
  textInput.addEventListener("input", updateStats);
  cleanTextBtn.addEventListener("click", cleanText);
  resetBtn.addEventListener("click", resetForm);
  copyBtn.addEventListener("click", copyResult);

  // 更新统计信息
  function updateStats() {
    const text = textInput.value;

    // 字符数（含空格）
    const charsWithSpaces = text.length;
    charCountWithSpaces.textContent = charsWithSpaces;

    // 字符数（无空格）
    const charsNoSpaces = text.replace(/\s/g, "").length;
    charCountNoSpaces.textContent = charsNoSpaces;

    // 单词数（简单统计，以空格分隔）
    const words = text.trim() ? text.trim().split(/\s+/).length : 0;
    wordCount.textContent = words;

    // 行数
    const lines = text ? text.split("\n").length : 0;
    lineCount.textContent = lines;
  }

  // 清理文本
  function cleanText() {
    let text = textInput.value;
    const originalText = text;

    // 记录原始统计
    const originalStats = {
      charsWithSpaces: originalText.length,
      charsNoSpaces: originalText.replace(/\s/g, "").length,
      words: originalText.trim() ? originalText.trim().split(/\s+/).length : 0,
      lines: originalText ? originalText.split("\n").length : 0,
    };

    // 应用清理选项
    if (removeExtraSpaces.checked) {
      text = text.replace(/\s+/g, " ");
    }

    if (removeEmptyLines.checked) {
      text = text
        .split("\n")
        .filter((line) => line.trim() !== "")
        .join("\n");
    }

    if (trimLines.checked) {
      text = text
        .split("\n")
        .map((line) => line.trim())
        .join("\n");
    }

    if (removeSpecialChars.checked) {
      // 保留字母、数字、中文、常见标点和空格
      text = text.replace(/[^\w\u4e00-\u9fa5\s.,!?;:，。！？；：'"-]/g, "");
    }

    // 更新输出
    textOutput.value = text;

    // 更新变更信息
    updateChangesInfo(originalStats, text);
  }

  // 更新变更信息
  function updateChangesInfo(originalStats, cleanedText) {
    const newStats = {
      charsWithSpaces: cleanedText.length,
      charsNoSpaces: cleanedText.replace(/\s/g, "").length,
      words: cleanedText.trim() ? cleanedText.trim().split(/\s+/).length : 0,
      lines: cleanedText ? cleanedText.split("\n").length : 0,
    };

    changesInfo.innerHTML = "";

    if (
      originalStats.charsWithSpaces === newStats.charsWithSpaces &&
      originalStats.charsNoSpaces === newStats.charsNoSpaces &&
      originalStats.words === newStats.words &&
      originalStats.lines === newStats.lines
    ) {
      changesInfo.innerHTML = '<div class="empty-state">文本没有发生变化</div>';
      return;
    }

    // 字符数（含空格）变化
    const charsWithSpacesChange =
      newStats.charsWithSpaces - originalStats.charsWithSpaces;
    const charsWithSpacesItem = document.createElement("div");
    charsWithSpacesItem.className = "change-item";
    charsWithSpacesItem.innerHTML = `
            <span class="change-label">字符数（含空格）</span>
            <span class="change-value ${
              charsWithSpacesChange < 0
                ? "negative-change"
                : charsWithSpacesChange > 0
                ? "positive-change"
                : ""
            }">
                ${originalStats.charsWithSpaces} → ${newStats.charsWithSpaces} 
                ${
                  charsWithSpacesChange !== 0
                    ? `(${
                        charsWithSpacesChange > 0 ? "+" : ""
                      }${charsWithSpacesChange})`
                    : ""
                }
            </span>
        `;
    changesInfo.appendChild(charsWithSpacesItem);

    // 字符数（无空格）变化
    const charsNoSpacesChange =
      newStats.charsNoSpaces - originalStats.charsNoSpaces;
    const charsNoSpacesItem = document.createElement("div");
    charsNoSpacesItem.className = "change-item";
    charsNoSpacesItem.innerHTML = `
            <span class="change-label">字符数（无空格）</span>
            <span class="change-value ${
              charsNoSpacesChange < 0
                ? "negative-change"
                : charsNoSpacesChange > 0
                ? "positive-change"
                : ""
            }">
                ${originalStats.charsNoSpaces} → ${newStats.charsNoSpaces} 
                ${
                  charsNoSpacesChange !== 0
                    ? `(${
                        charsNoSpacesChange > 0 ? "+" : ""
                      }${charsNoSpacesChange})`
                    : ""
                }
            </span>
        `;
    changesInfo.appendChild(charsNoSpacesItem);

    // 单词数变化
    const wordsChange = newStats.words - originalStats.words;
    const wordsItem = document.createElement("div");
    wordsItem.className = "change-item";
    wordsItem.innerHTML = `
            <span class="change-label">单词数</span>
            <span class="change-value ${
              wordsChange < 0
                ? "negative-change"
                : wordsChange > 0
                ? "positive-change"
                : ""
            }">
                ${originalStats.words} → ${newStats.words} 
                ${
                  wordsChange !== 0
                    ? `(${wordsChange > 0 ? "+" : ""}${wordsChange})`
                    : ""
                }
            </span>
        `;
    changesInfo.appendChild(wordsItem);

    // 行数变化
    const linesChange = newStats.lines - originalStats.lines;
    const linesItem = document.createElement("div");
    linesItem.className = "change-item";
    linesItem.innerHTML = `
            <span class="change-label">行数</span>
            <span class="change-value ${
              linesChange < 0
                ? "negative-change"
                : linesChange > 0
                ? "positive-change"
                : ""
            }">
                ${originalStats.lines} → ${newStats.lines} 
                ${
                  linesChange !== 0
                    ? `(${linesChange > 0 ? "+" : ""}${linesChange})`
                    : ""
                }
            </span>
        `;
    changesInfo.appendChild(linesItem);
  }

  // 重置表单
  function resetForm() {
    textInput.value = "";
    textOutput.value = "";
    changesInfo.innerHTML =
      '<div class="empty-state">文本清理后，变更信息将显示在这里</div>';
    updateStats();
  }

  // 复制结果
  function copyResult() {
    if (!textOutput.value) {
      showNotification("没有内容可复制", "error");
      return;
    }

    textOutput.select();
    document.execCommand("copy");

    showNotification("结果已复制到剪贴板");
  }

  // 显示通知
  function showNotification(message, type = "success") {
    // 移除现有通知
    const existingNotification = document.querySelector(".notification");
    if (existingNotification) {
      existingNotification.remove();
    }

    // 创建新通知
    const notification = document.createElement("div");
    notification.className = `notification ${type === "error" ? "error" : ""}`;
    notification.textContent = message;
    notification.style.backgroundColor =
      type === "error" ? "#e74c3c" : "#2ecc71";

    document.body.appendChild(notification);

    // 显示通知
    setTimeout(() => {
      notification.classList.add("show");
    }, 10);

    // 隐藏通知
    setTimeout(() => {
      notification.classList.remove("show");
      setTimeout(() => {
        notification.remove();
      }, 300);
    }, 3000);
  }
});

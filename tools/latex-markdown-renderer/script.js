document.addEventListener('DOMContentLoaded', function() {
    const textInput = document.getElementById('textInput');
    const previewContainer = document.getElementById('previewContainer');
    const insertLatexBtn = document.getElementById('insertLatexBtn');
    const insertCodeBtn = document.getElementById('insertCodeBtn');
    const clearBtn = document.getElementById('clearBtn');
    const autoRender = document.getElementById('autoRender');
    const renderBtn = document.getElementById('renderBtn');
    
    // 配置 marked
    marked.setOptions({
        highlight: function(code, lang) {
            if (lang && hljs.getLanguage(lang)) {
                try {
                    return hljs.highlight(code, { language: lang }).value;
                } catch (err) {
                    console.error('代码高亮错误:', err);
                }
            }
            
            // 如果没有指定语言，尝试自动检测
            try {
                return hljs.highlightAuto(code).value;
            } catch (err) {
                console.error('自动代码高亮错误:', err);
                return code;
            }
        },
        breaks: true,
        gfm: true
    });
    
    // 配置 KaTeX
    const renderMathInElement = window.renderMathInElement;
    
    // 初始化
    renderContent();
    
    // 事件监听
    textInput.addEventListener('input', function() {
        if (autoRender.checked) {
            renderContent();
        }
    });
    
    renderBtn.addEventListener('click', renderContent);
    
    insertLatexBtn.addEventListener('click', function() {
        insertTextAtCursor('$$ E = mc^2 $$');
    });
    
    insertCodeBtn.addEventListener('click', function() {
        insertTextAtCursor('```javascript\n// 你的代码在这里\nconsole.log("Hello, World!");\n```');
    });
    
    clearBtn.addEventListener('click', function() {
        textInput.value = '';
        renderContent();
    });
    
    // 渲染内容
    function renderContent() {
        const content = textInput.value.trim();
        
        if (!content) {
            previewContainer.innerHTML = `
                <div class="empty-state">
                    <p>预览将显示在这里</p>
                    <p class="hint">在左侧输入LaTeX或Markdown内容</p>
                </div>
            `;
            return;
        }
        
        try {
            // 使用 marked 渲染 Markdown
            let htmlContent = marked.parse(content);
            
            // 更新预览
            previewContainer.innerHTML = htmlContent;
            
            // 使用 KaTeX 渲染数学公式
            if (renderMathInElement) {
                renderMathInElement(previewContainer, {
                    delimiters: [
                        {left: '$$', right: '$$', display: true},
                        {left: '$', right: '$', display: false},
                        {left: '\\(', right: '\\)', display: false},
                        {left: '\\[', right: '\\]', display: true}
                    ],
                    throwOnError: false
                });
            }
            
            // 高亮代码块
            document.querySelectorAll('pre code').forEach((block) => {
                hljs.highlightElement(block);
            });
            
        } catch (error) {
            console.error('渲染错误:', error);
            previewContainer.innerHTML = `
                <div class="empty-state">
                    <p>渲染出错</p>
                    <p class="hint">${error.message}</p>
                </div>
            `;
        }
    }
    
    // 在光标位置插入文本
    function insertTextAtCursor(text) {
        const textarea = textInput;
        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const before = textarea.value.substring(0, start);
        const after = textarea.value.substring(end);
        
        textarea.value = before + text + after;
        textarea.selectionStart = textarea.selectionEnd = start + text.length;
        textarea.focus();
        
        if (autoRender.checked) {
            renderContent();
        }
    }
});
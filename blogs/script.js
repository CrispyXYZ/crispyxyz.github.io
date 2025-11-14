// 加载并显示文章列表
async function loadArticles() {
    const articlesContainer = document.getElementById('articles');
    const loadingElement = document.getElementById('loading');
    const errorElement = document.getElementById('error');
    const lastUpdateElement = document.getElementById('last-update');
    
    try {
        // 显示加载状态
        loadingElement.classList.remove('hidden');
        articlesContainer.classList.add('hidden');
        errorElement.classList.add('hidden');
        
        // 获取索引数据
        const response = await fetch('index.json');
        if (!response.ok) {
            throw new Error(`HTTP error! status: ${response.status}`);
        }
        
        const articles = await response.json();
        
        // 隐藏加载状态
        loadingElement.classList.add('hidden');
        
        if (articles.length === 0) {
            articlesContainer.innerHTML = '<p>暂无文章</p>';
            articlesContainer.classList.remove('hidden');
            return;
        }
        
        // 生成文章列表
        let articlesHTML = '';
        articles.forEach(article => {
            const date = new Date(article.modTime * 1000);
            const formattedDate = date.toLocaleDateString('zh-CN', {
                year: 'numeric',
                month: 'long',
                day: 'numeric'
            });
            
            articlesHTML += `
                <div class="article-item">
                    <a href="contents/${article.name}" class="article-link">
                        <div class="article-title">${article.name}</div>
                        <div class="article-date">${formattedDate}</div>
                    </a>
                </div>
            `;
        });
        
        articlesContainer.innerHTML = articlesHTML;
        articlesContainer.classList.remove('hidden');
        
        // 更新最后更新时间
        const now = new Date();
        lastUpdateElement.textContent = now.toLocaleDateString('zh-CN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        
    } catch (error) {
        console.error('加载文章列表失败:', error);
        loadingElement.classList.add('hidden');
        errorElement.classList.remove('hidden');
    }
}

// 页面加载完成后执行
document.addEventListener('DOMContentLoaded', function() {
    loadArticles();
    
    // 重试按钮事件
    document.getElementById('retry-btn').addEventListener('click', loadArticles);
});
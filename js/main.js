// 目录高亮竖线效果
function updateTocActiveLine() {
    const tocLinks = document.querySelectorAll('.toc-list a');
    tocLinks.forEach(link => {
        link.classList.remove('active');
        if (link._activeDot) {
            link._activeDot.remove();
            link._activeDot = null;
        }
    });
    // 找到当前激活的目录项
    let activeLink = null;
    let minDistance = Infinity;
    const headerOffset = 100;
    document.querySelectorAll('.post-md h1, .post-md h2, .post-md h3, .post-md h4, .post-md h5, .post-md h6').forEach((heading, idx) => {
        const rect = heading.getBoundingClientRect();
        const distance = Math.abs(rect.top - headerOffset);
        if (distance < minDistance) {
            minDistance = distance;
            activeLink = tocLinks[idx];
        }
    });
    if (activeLink) {
        activeLink.classList.add('active');
        // 创建激活点
        if (!activeLink._activeDot) {
            const dot = document.createElement('div');
            dot.className = 'toc-active-dot';
            dot.style.cssText = `
                position: absolute;
                left: -20px;
                top: 50%;
                transform: translateY(-50%);
                width: 4px;
                height: 4px;
                background: var(--font-color-0);
                border-radius: 50%;
                opacity: 0;
                transition: opacity 0.3s ease;
            `;
            activeLink.style.position = 'relative';
            activeLink.appendChild(dot);
            activeLink._activeDot = dot;
            // 显示激活点
            setTimeout(() => {
                dot.style.opacity = '1';
            }, 10);
        }
    }
}
window.addEventListener('scroll', updateTocActiveLine);
document.addEventListener('DOMContentLoaded', updateTocActiveLine);

// 目录按钮功能已移至layout.ejs统一管理

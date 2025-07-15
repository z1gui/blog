// 访问量统计脚本
(function() {
    'use strict';
    
    // 获取当前页面路径作为唯一标识
    const currentPath = window.location.pathname;
    const visitKey = 'visitCount_' + currentPath.replace(/[^a-zA-Z0-9]/g, '_');
    const sessionKey = 'session_' + Date.now();
    
    // 获取总访问量
    function getTotalVisits() {
        const totalVisits = localStorage.getItem('totalVisits') || 0;
        return parseInt(totalVisits);
    }
    
    // 检查是否是新的会话
    function isNewSession() {
        const lastSession = localStorage.getItem('lastSession');
        const currentTime = Date.now();
        const sessionTimeout = 30 * 60 * 1000; // 30分钟超时
        
        if (!lastSession || (currentTime - parseInt(lastSession)) > sessionTimeout) {
            localStorage.setItem('lastSession', currentTime);
            return true;
        }
        return false;
    }
    
    // 更新访问量
    function updateVisitCount() {
        // 只有在新的会话中才增加访问量
        if (isNewSession()) {
            // 获取当前页面访问量
            let pageVisits = localStorage.getItem(visitKey) || 0;
            pageVisits = parseInt(pageVisits) + 1;
            localStorage.setItem(visitKey, pageVisits);
            
            // 更新总访问量
            let totalVisits = getTotalVisits();
            totalVisits += 1;
            localStorage.setItem('totalVisits', totalVisits);
            
            return totalVisits;
        }
        
        return getTotalVisits();
    }
    
    // 格式化数字显示
    function formatNumber(num) {
        if (num >= 1000000) {
            return (num / 1000000).toFixed(1) + 'M';
        } else if (num >= 1000) {
            return (num / 1000).toFixed(1) + 'k';
        } else {
            return num.toString();
        }
    }
    
    // 更新显示
    function updateDisplay() {
        const visitCountElement = document.getElementById('visitCount');
        if (visitCountElement) {
            const totalVisits = getTotalVisits();
            visitCountElement.textContent = formatNumber(totalVisits);
            
            // 添加访问量增加的动画效果
            if (isNewSession()) {
                visitCountElement.style.animation = 'pulse 0.6s ease';
                setTimeout(() => {
                    visitCountElement.style.animation = '';
                }, 600);
            }
        }
    }
    
    // 添加脉冲动画的CSS
    const style = document.createElement('style');
    style.textContent = `
        @keyframes pulse {
            0% { transform: scale(1); }
            50% { transform: scale(1.2); }
            100% { transform: scale(1); }
        }
    `;
    document.head.appendChild(style);
    
    // 页面加载时执行
    document.addEventListener('DOMContentLoaded', function() {
        // 更新访问量
        updateVisitCount();
        
        // 更新显示
        updateDisplay();
        
        // 添加动画效果
        const visitCountElement = document.getElementById('visitCount');
        if (visitCountElement) {
            visitCountElement.style.transition = 'transform 0.3s ease';
            visitCountElement.addEventListener('mouseenter', function() {
                this.style.transform = 'scale(1.1)';
            });
            visitCountElement.addEventListener('mouseleave', function() {
                this.style.transform = 'scale(1)';
            });
            
            // 添加点击效果，显示详细信息
            visitCountElement.addEventListener('click', function() {
                const totalVisits = getTotalVisits();
                const pageVisits = localStorage.getItem(visitKey) || 0;
                
                // 创建提示框
                const tooltip = document.createElement('div');
                tooltip.style.cssText = `
                    position: fixed;
                    top: 50%;
                    left: 50%;
                    transform: translate(-50%, -50%);
                    background: var(--bg-color-main);
                    border: 1px solid var(--border-color);
                    border-radius: 8px;
                    padding: 16px;
                    box-shadow: 0 4px 12px var(--shadow-color);
                    z-index: 10000;
                    font-size: 14px;
                    color: var(--font-color-2);
                    max-width: 300px;
                    text-align: center;
                `;
                tooltip.innerHTML = `
                    <div style="margin-bottom: 8px; font-weight: 600; color: var(--font-color-1);">访问统计</div>
                    <div>总访问量: ${formatNumber(totalVisits)}</div>
                    <div>本页访问: ${pageVisits}</div>
                    <div style="margin-top: 8px; font-size: 12px; color: var(--font-color-3);">点击任意位置关闭</div>
                `;
                
                document.body.appendChild(tooltip);
                
                // 点击关闭提示框
                const closeTooltip = () => {
                    document.body.removeChild(tooltip);
                    document.removeEventListener('click', closeTooltip);
                };
                
                setTimeout(() => {
                    document.addEventListener('click', closeTooltip);
                }, 100);
            });
        }
    });
})(); 
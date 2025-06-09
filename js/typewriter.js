class Typewriter {
    constructor(element, text, speed = 100) {
        this.element = element;
        this.text = text;
        this.speed = speed;
        this.currentIndex = 0;
        this.isDeleting = false;
        this.deleteSpeed = speed / 2;
        this.targetIndex = 0; // 回退的目标位置
        this.isComplete = false; // 是否已经完成一次完整循环
    }

    type() {
        const currentText = this.text.substring(0, this.currentIndex);
        this.element.textContent = currentText;

        // 如果已经完成完整循环，停止执行
        if (this.isComplete) {
            return;
        }

        if (!this.isDeleting && this.currentIndex < this.text.length) {
            // 随机决定是否回退（只在未完成完整循环时）
            if (Math.random() < 0.1 && this.currentIndex > 0) { // 10%的概率回退
                this.isDeleting = true;
                // 随机决定回退到哪个位置
                this.targetIndex = Math.floor(Math.random() * this.currentIndex);
                setTimeout(() => this.type(), this.deleteSpeed);
            } else {
                this.currentIndex++;
                setTimeout(() => this.type(), this.speed);
            }
        } else if (this.isDeleting && this.currentIndex > this.targetIndex) {
            this.currentIndex--;
            setTimeout(() => this.type(), this.deleteSpeed);
        } else {
            // 随机决定下一步行为
            const random = Math.random();
            if (this.isDeleting) {
                // 删除完成后，随机决定是否重新开始或继续打字
                if (random < 0.3) { // 30%概率重新开始
                    this.currentIndex = 0;
                    this.isDeleting = false;
                    setTimeout(() => this.type(), 1000);
                } else { // 70%概率继续打字
                    this.isDeleting = false;
                    setTimeout(() => this.type(), 1000);
                }
            } else {
                // 打字完成后，标记为完成，停止循环
                this.isComplete = true;
            }
        }
    }

    start() {
        this.type();
    }
}

// 页面加载完成后启动打字机效果
document.addEventListener('DOMContentLoaded', function() {
    const typewriterElement = document.getElementById('typewriter');
    if (typewriterElement) {
        const typewriter = new Typewriter(typewriterElement, '不忘初心，不断充电', 250);
        typewriter.start();
    }
}); 
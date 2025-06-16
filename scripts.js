// -----------------------------
// 1. Photo Upload Functionality
// -----------------------------

function uploadHeroPhoto() {
    createFileInput('hero-photo', (imageUrl) => {
        const heroPhoto = document.querySelector('.hero-photo');
        heroPhoto.innerHTML = `<img src="${imageUrl}" alt="Berend Buyle Professional Photo">`;
    });
}

function uploadAboutPhoto() {
    createFileInput('about-photo', (imageUrl) => {
        const aboutPhoto = document.querySelector('.about-photo');
        aboutPhoto.innerHTML = `
            <img src="${imageUrl}" alt="Berend Buyle - Life and Work">
            <div class="photo-caption">
                📍 Add location • 📅 Add year • 🎓 Add context
            </div>
        `;
    });
}

function uploadProjectPhoto(projectId) {
    createFileInput(`project-${projectId}`, (imageUrl) => {
        const projectPhoto = document.querySelector(`[onclick="uploadProjectPhoto('${projectId}')"]`);
        if (projectPhoto) {
            projectPhoto.innerHTML = `<img src="${imageUrl}" alt="Project Photo">`;
            projectPhoto.onclick = null; // Remove click handler after upload
        }
    });
}

function createFileInput(id, callback) {
    const input = document.createElement('input');
    input.type = 'file';
    input.accept = 'image/*';
    input.style.display = 'none';

    input.onchange = function (e) {
        const file = e.target.files[0];
        if (file && file.type.startsWith('image/')) {
            const reader = new FileReader();
            reader.onload = function (e) {
                callback(e.target.result);
            };
            reader.readAsDataURL(file);
        } else {
            alert('Please select a valid image file (JPG, PNG, etc.)');
        }
    };

    document.body.appendChild(input);
    input.click();
    document.body.removeChild(input);
}

// -----------------------------
// 2. Sidebar Toggle (for mobile)
// -----------------------------

function toggleSidebar() {
    const sidebar = document.getElementById('sidebar');
    sidebar.classList.toggle('open');
}

// -----------------------------
// 3. Navigation System
// -----------------------------

document.addEventListener('DOMContentLoaded', function () {
    const navLinks = document.querySelectorAll('.nav-link');
    const sections = document.querySelectorAll('.section');

    function handleNavigation(targetSection) {
        navLinks.forEach(link => link.classList.remove('active'));
        sections.forEach(section => section.classList.remove('active'));

        const targetElement = document.getElementById(targetSection);
        const targetLink = document.querySelector(`[data-section="${targetSection}"]`);

        if (targetElement && targetLink) {
            targetElement.classList.add('active');
            targetLink.classList.add('active');

            if (window.innerWidth <= 768) {
                document.getElementById('sidebar').classList.remove('open');
            }
        }
    }

    navLinks.forEach(link => {
        link.addEventListener('click', function (e) {
            e.preventDefault();
            const targetSection = this.getAttribute('data-section');
            if (targetSection) {
                handleNavigation(targetSection);
            }
        });
    });

    setTimeout(() => {
        handleNavigation('home');
    }, 100);
});

// -----------------------------
// 4. Scroll Progress & Floating Buttons
// -----------------------------

function updateScrollProgress() {
    const scrollTop = window.pageYOffset;
    const docHeight = document.documentElement.scrollHeight - window.innerHeight;
    const scrollPercent = (scrollTop / docHeight) * 100;

    const progressBar = document.getElementById('scrollProgress');
    if (progressBar) {
        progressBar.style.width = scrollPercent + '%';
    }

    // 更新浮动Journey按钮显示 - 替换原来的floatingCta逻辑
    const floatingJourney = document.getElementById('floatingJourney');
    if (floatingJourney) {
        floatingJourney.classList.toggle('visible', scrollPercent > 20);
    }

    const backToTop = document.querySelector('.back-to-top');
    if (backToTop) {
        if (scrollPercent > 30) {
            backToTop.style.display = 'block';
            backToTop.style.opacity = '1';
        } else {
            backToTop.style.opacity = '0';
            setTimeout(() => {
                if (scrollPercent < 30) backToTop.style.display = 'none';
            }, 300);
        }
    }
}

window.addEventListener('scroll', updateScrollProgress);

document.getElementById('floatingJourney')?.addEventListener('click', function () {
    // 打开3D Journey页面
    window.open('global-journey.html', '_blank');
});

// -----------------------------
// 5. Intersection Animations
// -----------------------------

const enhancedAnimationObserver = new IntersectionObserver((entries) => {
    entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
            setTimeout(() => {
                entry.target.classList.add('visible');
            }, index * 100);
        }
    });
}, {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
});

document.querySelectorAll('.fade-in, .slide-in-left, .scale-in').forEach(item => {
    enhancedAnimationObserver.observe(item);
});

// -----------------------------
// 6. Parallax Effect
// -----------------------------

function updateParallax() {
    const scrolled = window.pageYOffset;
    const hero = document.querySelector('.hero');
    if (hero && scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * -0.5}px)`;
    }
}

window.addEventListener('scroll', updateParallax);

// -----------------------------
// 7. Stats Counter
// -----------------------------

function animateValue(element, start, end, duration, suffix = '') {
    const startTimestamp = performance.now();

    function step(timestamp) {
        const elapsed = timestamp - startTimestamp;
        const progress = Math.min(elapsed / duration, 1);
        const easedProgress = 1 - Math.pow(1 - progress, 3);
        const current = start + (end - start) * easedProgress;

        element.textContent = suffix === '.5' && progress >= 1
            ? end + suffix
            : Math.floor(current) + suffix;

        if (progress < 1) {
            requestAnimationFrame(step);
        }
    }

    requestAnimationFrame(step);
}

const enhancedStatsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const statNumbers = entry.target.querySelectorAll('.stat-number');
            statNumbers.forEach((stat, index) => {
                const finalValue = stat.textContent;
                let numericValue = parseInt(finalValue);
                let suffix = '';

                if (finalValue.includes('.5')) {
                    numericValue = 2;
                    suffix = '.5';
                }

                setTimeout(() => {
                    animateValue(stat, 0, numericValue, 2000, suffix);
                }, index * 200);
            });
            enhancedStatsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.5 });

const heroStats = document.querySelector('.hero-stats');
if (heroStats) enhancedStatsObserver.observe(heroStats);

// -----------------------------
// 8. PDF Generation
// -----------------------------

async function generatePDF() {
    const button = document.querySelector('.pdf-download');
    const downloadText = button.querySelector('.download-text');

    button.disabled = true;
    downloadText.textContent = 'Generating...';

    try {
        const pdfContent = `...`; // 你的 HTML 字符串保留不变

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = pdfContent;
        tempDiv.style.display = 'block';
        tempDiv.style.background = 'white';
        document.body.appendChild(tempDiv);

        const opt = {
            margin: 0.5,
            filename: 'Berend_Buyle_CV.pdf',
            image: { type: 'jpeg', quality: 0.98 },
            html2canvas: { scale: 2, useCORS: true },
            jsPDF: { unit: 'in', format: 'letter', orientation: 'portrait' }
        };

        await html2pdf().set(opt).from(tempDiv).save();
        document.body.removeChild(tempDiv);

        downloadText.textContent = 'Downloaded!';
        setTimeout(() => {
            downloadText.textContent = 'Download CV';
        }, 2000);
    } catch (error) {
        console.error('PDF generation failed:', error);
        downloadText.textContent = 'Try Again';
        setTimeout(() => {
            downloadText.textContent = 'Download CV';
        }, 2000);
    } finally {
        button.disabled = false;
    }
}

// -----------------------------
// 9. Sidebar Close on Outside Click (Mobile)
// -----------------------------

document.addEventListener('click', function (e) {
    const sidebar = document.getElementById('sidebar');
    const menuBtn = document.querySelector('.mobile-menu-btn');

    if (window.innerWidth <= 768 &&
        !sidebar.contains(e.target) &&
        !menuBtn.contains(e.target)) {
        sidebar.classList.remove('open');
    }
});

// =====================================
// 💫 创意增强功能 - 添加到你的JS文件末尾
// =====================================

// -----------------------------
// 10. 自定义鼠标光标系统
// -----------------------------

function initCustomCursor() {
    // 创建光标元素
    const cursor = document.createElement('div');
    cursor.className = 'custom-cursor';
    document.body.appendChild(cursor);

    // 启用自定义光标
    document.body.classList.add('custom-cursor-enabled');

    // 鼠标移动事件
    document.addEventListener('mousemove', (e) => {
        cursor.style.left = e.clientX + 'px';
        cursor.style.top = e.clientY + 'px';
    });

    // 鼠标点击效果
    document.addEventListener('mousedown', () => cursor.classList.add('active'));
    document.addEventListener('mouseup', () => cursor.classList.remove('active'));

    // 悬停特殊元素时的效果
    const hoverElements = document.querySelectorAll('.story-card, .skill-bubble, .language-item, .hero-cta');
    hoverElements.forEach(element => {
        element.addEventListener('mouseenter', () => cursor.classList.add('hover'));
        element.addEventListener('mouseleave', () => cursor.classList.remove('hover'));
    });
}

// -----------------------------
// 11. 3D故事卡片增强效果
// -----------------------------

function enhance3DStoryCards() {
    const storyCards = document.querySelectorAll('.story-card');

    storyCards.forEach(card => {
        // 3D倾斜效果
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'rotateY(5deg) translateZ(20px) scale(1.02)';
            card.style.transition = 'all 0.4s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
        });

        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateY(0deg) translateZ(0px) scale(1)';
        });

        // 鼠标移动跟踪效果
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;

            const centerX = rect.width / 2;
            const centerY = rect.height / 2;

            const rotateX = (y - centerY) / 10;
            const rotateY = (centerX - x) / 10;

            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) translateZ(20px) scale(1.02)`;
        });
    });
}

// -----------------------------
// 12. 技能气泡互动效果
// -----------------------------

function enhanceSkillBubbles() {
    const skillBubbles = document.querySelectorAll('.skill-bubble');

    skillBubbles.forEach(bubble => {
        bubble.addEventListener('click', () => {
            // 防止重复动画
            bubble.style.animation = 'none';
            setTimeout(() => {
                bubble.style.animation = '';
            }, 10);

            // 创建粒子爆炸效果
            createParticleExplosion(bubble);

            // 添加成功反馈
            const originalContent = bubble.innerHTML;
            bubble.innerHTML = bubble.innerHTML.replace('🎯', '✨');

            setTimeout(() => {
                bubble.innerHTML = originalContent;
            }, 1000);
        });

        // 悬停波纹效果
        bubble.addEventListener('mouseenter', () => {
            bubble.style.boxShadow = `
                0 8px 32px rgba(72, 100, 170, 0.15),
                0 0 0 0 rgba(72, 100, 170, 0.5)
            `;
            bubble.style.animation = 'ripple 0.6s linear';
        });
    });
}

// 粒子爆炸效果函数
function createParticleExplosion(element) {
    const rect = element.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    for (let i = 0; i < 8; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: fixed;
            width: 6px;
            height: 6px;
            background: var(--accent-blue);
            border-radius: 50%;
            left: ${centerX}px;
            top: ${centerY}px;
            pointer-events: none;
            z-index: 9999;
        `;
        document.body.appendChild(particle);

        const angle = (i * 45) * Math.PI / 180;
        const distance = 60;

        particle.animate([
            { transform: 'translate(0, 0) scale(1)', opacity: 1 },
            {
                transform: `translate(${Math.cos(angle) * distance}px, ${Math.sin(angle) * distance}px) scale(0)`,
                opacity: 0
            }
        ], {
            duration: 600,
            easing: 'cubic-bezier(0.25, 0.46, 0.45, 0.94)'
        }).onfinish = () => particle.remove();
    }
}

// -----------------------------
// 13. 语言标签互动效果
// -----------------------------

function enhanceLanguageItems() {
    const languageItems = document.querySelectorAll('.language-item');

    languageItems.forEach(item => {
        item.addEventListener('click', () => {
            // 添加选中效果
            item.style.background = 'linear-gradient(135deg, rgba(72, 100, 170, 0.1), rgba(72, 100, 170, 0.05))';
            item.style.transform = 'scale(1.05)';
            item.style.borderColor = 'var(--accent-blue)';

            setTimeout(() => {
                item.style.background = '';
                item.style.transform = '';
                item.style.borderColor = '';
            }, 1000);
        });

        // 悬停国旗动画
        const flag = item.querySelector('.language-flag');
        if (flag) {
            item.addEventListener('mouseenter', () => {
                flag.style.animation = 'bounce 0.6s ease-in-out';
            });
        }
    });
}

// -----------------------------
// 14. 标题渐变动画
// -----------------------------

function enhanceHeroTitle() {
    const heroTitle = document.querySelector('.about-hero h2');
    if (heroTitle) {
        // 添加渐变动画类
        heroTitle.style.background = 'linear-gradient(45deg, var(--text-primary), var(--accent-blue), var(--accent-blue-light))';
        heroTitle.style.backgroundSize = '300% 300%';
        heroTitle.style.webkitBackgroundClip = 'text';
        heroTitle.style.webkitTextFillColor = 'transparent';
        heroTitle.style.backgroundClip = 'text';
        heroTitle.style.animation = 'gradientShift 4s ease-in-out infinite';
    }
}

// -----------------------------
// 15. 滚动触发的高级动画
// -----------------------------

function initAdvancedScrollAnimations() {
    const scrollElements = document.querySelectorAll('.story-card, .skill-bubble, .language-item');

    const scrollObserver = new IntersectionObserver((entries) => {
        entries.forEach((entry, index) => {
            if (entry.isIntersecting) {
                setTimeout(() => {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0) scale(1)';
                    entry.target.style.transition = 'all 0.6s cubic-bezier(0.175, 0.885, 0.32, 1.275)';
                }, index * 100);
            }
        });
    }, {
        threshold: 0.1,
        rootMargin: '0px 0px -50px 0px'
    });

    scrollElements.forEach(element => {
        element.style.opacity = '0';
        element.style.transform = 'translateY(30px) scale(0.95)';
        scrollObserver.observe(element);
    });
}

// -----------------------------
// 16. 背景粒子系统（轻量级）
// -----------------------------

function createBackgroundParticles() {
    const aboutSection = document.querySelector('.about');
    if (!aboutSection) return;

    // 创建粒子容器
    const particleContainer = document.createElement('div');
    particleContainer.style.cssText = `
        position: absolute;
        top: 0;
        left: 0;
        width: 100%;
        height: 100%;
        pointer-events: none;
        overflow: hidden;
        z-index: 1;
    `;
    aboutSection.appendChild(particleContainer);

    // 创建粒子
    for (let i = 0; i < 5; i++) {
        const particle = document.createElement('div');
        particle.style.cssText = `
            position: absolute;
            width: 4px;
            height: 4px;
            background: var(--accent-blue);
            border-radius: 50%;
            opacity: 0.3;
            animation: float ${5 + Math.random() * 10}s ease-in-out infinite;
            left: ${Math.random() * 100}%;
            top: ${Math.random() * 100}%;
        `;
        particleContainer.appendChild(particle);
    }
}

// -----------------------------
// 17. 初始化所有增强功能
// -----------------------------

function initEnhancedFeatures() {
    // 延迟初始化，确保DOM完全加载
    setTimeout(() => {
        initCustomCursor();
        enhance3DStoryCards();
        enhanceSkillBubbles();
        enhanceLanguageItems();
        enhanceHeroTitle();
        initAdvancedScrollAnimations();
        createBackgroundParticles();

        console.log('🚀 所有增强功能已启动！');
    }, 500);
}

// 在现有的DOMContentLoaded事件中添加初始化
document.addEventListener('DOMContentLoaded', function() {
    // 你的现有代码...

    // 添加增强功能初始化
    initEnhancedFeatures();
});


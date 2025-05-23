// macOS Style Blog System
class MacInterface {
    constructor() {
        this.blogPosts = {
            daily: [],
            tech: []
        };
        this.isPlaying = false;
        this.volume = 50;
        this.brightness = 80;
        this.pinnedPosts = new Set();
        this.viewMode = 'view';
        this.audio = null;
        
        this.init();
    }

    init() {
        this.setupBootSequence();
        this.setupDockMagnification();
        this.startClock();
        this.setupAudio();
        this.setupEventListeners();
    }

    setupEventListeners() {
        // Control Center Toggle
        const controlCenterBtn = document.getElementById('controlCenter');
        if (controlCenterBtn) {
            controlCenterBtn.addEventListener('click', () => this.toggleControlCenter());
        }

        // Play/Pause Button
        const playPauseBtn = document.getElementById('playPauseBtn');
        if (playPauseBtn) {
            playPauseBtn.addEventListener('click', () => this.toggleAudio());
        }

        // Volume Slider
        const volumeSlider = document.getElementById('volumeSlider');
        if (volumeSlider) {
            volumeSlider.addEventListener('input', (e) => this.setVolume(e.target.value));
        }

        // Brightness Slider
        const brightnessSlider = document.getElementById('brightnessSlider');
        if (brightnessSlider) {
            brightnessSlider.addEventListener('input', (e) => this.setBrightness(e.target.value));
        }

        // Close control center when clicking outside
        document.addEventListener('click', (e) => {
            const controlCenter = document.getElementById('controlCenterPanel');
            const controlCenterBtn = document.getElementById('controlCenter');
            
            if (controlCenter && controlCenter.classList.contains('active')) {
                if (!controlCenter.contains(e.target) && !controlCenterBtn.contains(e.target)) {
                    this.closeControlCenter();
                }
            }
        });
    }

    setupAudio() {
        this.audio = document.getElementById('backgroundMusic');
        if (this.audio) {
            this.audio.volume = this.volume / 100;
        }
    }

    toggleControlCenter() {
        const controlCenterPanel = document.getElementById('controlCenterPanel');
        const controlCenterBtn = document.getElementById('controlCenter');
        
        if (controlCenterPanel && controlCenterBtn) {
            if (controlCenterPanel.classList.contains('active')) {
                controlCenterPanel.classList.remove('active');
                controlCenterBtn.classList.remove('active');
            } else {
                controlCenterPanel.classList.add('active');
                controlCenterBtn.classList.add('active');
            }
        }
    }

    closeControlCenter() {
        const controlCenterPanel = document.getElementById('controlCenterPanel');
        const controlCenterBtn = document.getElementById('controlCenter');
        
        if (controlCenterPanel && controlCenterBtn) {
            controlCenterPanel.classList.remove('active');
            controlCenterBtn.classList.remove('active');
        }
    }

    toggleAudio() {
        if (!this.audio) return;

        const playIcon = document.querySelector('.play-icon');
        const pauseIcon = document.querySelector('.pause-icon');

        if (this.isPlaying) {
            this.audio.pause();
            this.isPlaying = false;
            if (playIcon && pauseIcon) {
                playIcon.style.display = 'block';
                pauseIcon.style.display = 'none';
            }
        } else {
            this.audio.play().then(() => {
                this.isPlaying = true;
                if (playIcon && pauseIcon) {
                    playIcon.style.display = 'none';
                    pauseIcon.style.display = 'block';
                }
            }).catch(error => {
                console.log('Audio play requires user interaction');
            });
        }
    }

    setVolume(value) {
        this.volume = value;
        if (this.audio) {
            this.audio.volume = value / 100;
        }
    }

    setBrightness(value) {
        this.brightness = value;
        const desktop = document.querySelector('.desktop');
        if (desktop) {
            desktop.style.filter = `brightness(${value}%)`;
        }
    }

    startClock() {
        // Update current time and date
        const updateDateTime = () => {
            const now = new Date();
            const days = ['일', '월', '화', '수', '목', '금', '토'];
            const month = now.getMonth() + 1;
            const date = now.getDate();
            const day = days[now.getDay()];
            const hours = String(now.getHours()).padStart(2, '0');
            const minutes = String(now.getMinutes()).padStart(2, '0');

            // 원하는 형식: 5월 23일 (금) 11:49
            const dateTimeString = `${month}월 ${date}일 (${day}) ${hours}:${minutes}`;
            document.getElementById('currentTime').textContent = dateTimeString;
        };

        // Update time immediately and then every second
        updateDateTime();
        setInterval(updateDateTime, 1000);
    }

    setupDockMagnification() {
        const dockItems = document.querySelectorAll('.dock-item');

        const resetIcons = () => {
            dockItems.forEach((item) => {
                item.style.transform = "scale(1)";
                item.style.margin = "0 3px";
            });
        };

        dockItems.forEach((item, index) => {
            item.addEventListener("mouseenter", () => {
                resetIcons();
                
                const centerIndex = index;
                const maxScale = 1.4;
                const maxMargin = 18;
                
                for (let i = -2; i <= 2; i++) {
                    const targetIndex = centerIndex + i;
                    if (dockItems[targetIndex]) {
                        const distance = Math.abs(i);
                        const scale = maxScale - (distance * 0.15);
                        const margin = maxMargin - (distance * 4);
                        const translateY = i === 0 ? -6 : -2;
                        
                        dockItems[targetIndex].style.transform = `scale(${scale}) translateY(${translateY}px)`;
                        dockItems[targetIndex].style.margin = `0 ${margin}px`;
                    }
                }
            });
            
            item.addEventListener("mouseleave", () => {
                setTimeout(resetIcons, 100);
            });
        });

        const dockContainer = document.querySelector('.dock-container');
        if (dockContainer) {
            dockContainer.addEventListener('mouseleave', resetIcons);
        }
    }

    setupBootSequence() {
        const bootScreen = document.getElementById('bootScreen');
        const desktop = document.getElementById('desktop');
        const progressBar = document.querySelector('.progress-bar');

        if (progressBar) {
            progressBar.addEventListener('animationend', () => {
                if (bootScreen) {
                    bootScreen.style.opacity = '0';
                    
                    setTimeout(() => {
                        bootScreen.style.display = 'none';
                        
                        if (desktop) {
                            desktop.classList.add('visible');
                        }
                    }, 300);
                }
            });
        }
    }

    // Velog Style Post Loading
    async loadVelogPosts(folderType) {
        const gridId = `${folderType}BlogGrid`;
        const grid = document.getElementById(gridId);
        
        if (!grid) return;
        
        try {
            // 실제 포스트 데이터를 로드
            const posts = await this.fetchPostsFromFolder(folderType);
            
            // Clear existing content
            grid.innerHTML = '';
            
            if (posts.length === 0) {
                grid.innerHTML = `
                    <div class="velog-empty">
                        <div class="velog-empty-icon">${folderType === 'daily' ? '📝' : '💻'}</div>
                        <div class="velog-empty-title">${folderType === 'daily' ? '일상' : '기술'} 블로그 준비 중</div>
                        <div class="velog-empty-subtitle">곧 흥미로운 ${folderType === 'daily' ? '일상 이야기' : '기술 내용'}들을 공유할 예정입니다!</div>
                    </div>
                `;
                return;
            }

            // Sort posts by date (newest first)
            posts.sort((a, b) => new Date(b.dateRaw) - new Date(a.dateRaw));

            // Create velog style post cards
            posts.forEach(post => {
                const postCard = this.createVelogPostCard(post, folderType);
                grid.appendChild(postCard);
            });

        } catch (error) {
            console.error('Failed to load posts:', error);
            grid.innerHTML = `
                <div class="velog-empty">
                    <div class="velog-empty-icon">❌</div>
                    <div class="velog-empty-title">포스트 로딩 실패</div>
                    <div class="velog-empty-subtitle">포스트를 불러오는 중 오류가 발생했습니다.</div>
                </div>
            `;
        }
    }

    async fetchPostsFromFolder(folderType) {
        const posts = [];
        
        // 실제 파일 목록 (나중에 동적으로 가져올 수 있도록 확장 가능)
        const fileList = {
            daily: [
                '2024-05-23-first-post-with-new-system.md',
                '2025-05-19-async-await-programming.md',
                '2025-05-20-event-loop-optimization.md',
                '2025-05-21-web-worker-multithreading.md'
            ],
            tech: ['2024-05-23-github-blog-system.md']
        };
        
        const files = fileList[folderType] || [];
        
        for (const filename of files) {
            try {
                const response = await fetch(`posts/${folderType}/${filename}`);
                if (response.ok) {
                    const content = await response.text();
                    const post = this.parseMarkdownPost(content, filename);
                    posts.push(post);
                }
            } catch (error) {
                console.warn(`Failed to load ${filename}:`, error);
            }
        }
        
        return posts;
    }

    parseMarkdownPost(content, filename) {
        const lines = content.split('\n');
        let frontMatterEnd = -1;
        let frontMatter = {};
        
        // Parse front matter
        if (lines[0] === '---') {
            for (let i = 1; i < lines.length; i++) {
                if (lines[i] === '---') {
                    frontMatterEnd = i;
                    break;
                }
                const [key, ...valueParts] = lines[i].split(':');
                if (key && valueParts.length > 0) {
                    frontMatter[key.trim()] = valueParts.join(':').trim();
                }
            }
        }
        
        // Extract content
        const contentLines = frontMatterEnd > -1 ? lines.slice(frontMatterEnd + 1) : lines;
        const bodyContent = contentLines.join('\n');
        
        // Create excerpt (first paragraph or first 150 characters)
        const firstParagraph = contentLines.find(line => line.trim() && !line.startsWith('#'));
        const excerpt = firstParagraph ? 
            (firstParagraph.length > 150 ? firstParagraph.substring(0, 150) + '...' : firstParagraph) :
            '내용을 읽어보세요...';
        
        return {
            title: frontMatter.title || 'Untitled',
            date: this.formatDate(frontMatter.date || new Date().toISOString().split('T')[0]),
            dateRaw: frontMatter.date || new Date().toISOString().split('T')[0],
            category: frontMatter.category || 'general',
            description: frontMatter.description || excerpt,
            excerpt: excerpt,
            content: bodyContent,
            filename: filename
        };
    }

    createVelogPostCard(post, folderType) {
        const postCard = document.createElement('div');
        postCard.className = 'velog-post-card';
        postCard.onclick = () => this.openPostModal(post);
        
        postCard.innerHTML = `
            <div class="velog-post-image ${folderType}">
                ${this.getPostThumbnailIcon(folderType)}
            </div>
            <div class="velog-post-content">
                <div class="velog-post-title">${post.title}</div>
                <div class="velog-post-date">${post.date}</div>
                <div class="velog-post-excerpt">${post.description || post.excerpt}</div>
            </div>
        `;
        
        return postCard;
    }

    getPostThumbnailIcon(folderType) {
        if (folderType === 'tech') {
            return `
                <svg width="60" height="60" fill="rgba(255,255,255,0.8)" viewBox="0 0 24 24">
                    <path d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0L19.2 12l-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"/>
                </svg>
            `;
        } else {
            return `
                <svg width="60" height="60" fill="rgba(255,255,255,0.8)" viewBox="0 0 24 24">
                    <path d="M14,2H6A2,2 0 0,0 4,4V20A2,2 0 0,0 6,22H18A2,2 0 0,0 20,20V8L14,2M18,20H6V4H13V9H18V20Z"/>
                </svg>
            `;
        }
    }

    formatDate(dateString) {
        const date = new Date(dateString);
        const year = date.getFullYear();
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const day = String(date.getDate()).padStart(2, '0');
        return `${year}년 ${month}월 ${day}일`;
    }

    openPostModal(post) {
        // Create post modal
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.id = 'postModal';
        
        modal.innerHTML = `
            <div class="modal-window post-view-window">
                <div class="modal-header">
                    <div class="window-controls">
                        <button class="window-control close" onclick="window.macInterface.closePostModal()"></button>
                        <button class="window-control minimize"></button>
                        <button class="window-control maximize"></button>
                    </div>
                    <div class="modal-title">${post.title}</div>
                </div>
                <div class="modal-content">
                    <div class="post-content">
                        <div class="post-meta">
                            <div class="post-date">${post.date}</div>
                            <div class="post-category">${post.category}</div>
                        </div>
                        <div class="post-body">
                            ${this.markdownToHtml(post.content)}
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Close modal when clicking outside
        modal.addEventListener('click', (e) => {
            if (e.target === modal) {
                this.closePostModal();
            }
        });
    }

    closePostModal() {
        const modal = document.getElementById('postModal');
        if (modal) {
            modal.remove();
        }
    }

    markdownToHtml(markdown) {
        // Simple markdown to HTML conversion
        let html = markdown
            // Headers
            .replace(/^### (.*$)/gim, '<h3>$1</h3>')
            .replace(/^## (.*$)/gim, '<h2>$1</h2>')
            .replace(/^# (.*$)/gim, '<h1>$1</h1>')
            // Bold
            .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
            // Italic
            .replace(/\*(.*)\*/gim, '<em>$1</em>')
            // Code blocks
            .replace(/```([\s\S]*?)```/gim, '<pre><code>$1</code></pre>')
            // Inline code
            .replace(/`([^`]*)`/gim, '<code>$1</code>')
            // Links
            .replace(/\[([^\]]*)\]\(([^\)]*)\)/gim, '<a href="$2">$1</a>')
            // Line breaks
            .replace(/\n\n/gim, '</p><p>')
            .replace(/\n/gim, '<br>');
        
        return `<p>${html}</p>`;
    }

    populateBlogContent(folderType) {
        this.loadVelogPosts(folderType);
    }
}

// Global functions for HTML onclick events
function openFolder(folderType) {
    const modalId = `${folderType}Modal`;
    const modal = document.getElementById(modalId);
    
    if (modal) {
        modal.classList.add('active');
        // Load blog content when modal opens
        window.macInterface.populateBlogContent(folderType);
    }
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.classList.remove('active');
    }
}

function openGitHub() {
    window.open('https://github.com/stylechoi', '_blank');
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.macInterface = new MacInterface();
    
    // Initialize Lucide icons
    if (typeof lucide !== 'undefined') {
        lucide.createIcons();
    }
});
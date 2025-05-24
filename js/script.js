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
                    window.macInterface.closeControlCenter();
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
        const dockContainer = document.querySelector('.dock-container');

        const resetIcons = () => {
            dockItems.forEach((item) => {
                item.style.transform = "scale(1)";
                item.style.margin = "0 4px";
            });
        };

        if (dockContainer) {
            dockContainer.addEventListener('mousemove', (e) => {
                const dockRect = dockContainer.getBoundingClientRect();
                const mouseX = e.clientX;
                
                dockItems.forEach((item, index) => {
                    const itemRect = item.getBoundingClientRect();
                    const itemCenterX = itemRect.left + itemRect.width / 2;
                    const distance = Math.abs(mouseX - itemCenterX);
                    
                    // 거리에 따른 크기 계산 (거리가 가까울수록 크게)
                    const maxDistance = 100; // 영향을 받는 최대 거리
                    const maxScale = 1.4;
                    const minScale = 1.0;
                    
                    let scale = minScale;
                    let margin = 4;
                    let translateY = 0;
                    
                    if (distance < maxDistance) {
                        const influence = 1 - (distance / maxDistance);
                        scale = minScale + (maxScale - minScale) * influence;
                        margin = 4 + (16 * influence);
                        translateY = -8 * influence;
                    }
                    
                    item.style.transform = `scale(${scale}) translateY(${translateY}px)`;
                    item.style.margin = `0 ${margin}px`;
                });
            });
            
            dockContainer.addEventListener('mouseleave', () => {
                setTimeout(resetIcons, 200);
            });
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
            posts.sort((a, b) => new Date(b.date) - new Date(a.date));

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
        try {
            // JSON 파일에서 포스트 데이터 읽어오기
            const response = await fetch('posts/posts-data.json');
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            const data = await response.json();
            return data[folderType] || [];
        } catch (error) {
            console.warn(`Failed to load posts data:`, error);
            return [];
        }
    }

    createVelogPostCard(post, folderType) {
        const postCard = document.createElement('div');
        postCard.className = 'velog-post-card';
        postCard.onclick = () => this.openPostModal(post);
        
        // 간단한 날짜 형식 (예: 2024.05.23)
        const simpleDate = post.date.replace(/-/g, '.');
        
        // 실제 태그들을 해시태그로 변환
        const hashtags = post.tags ? post.tags.map(tag => `#${tag}`).join(' ') : `#${folderType}`;
        
        // 이미지 처리 - 실제 이미지가 있으면 사용, 없으면 기본 아이콘
        const imageContent = post.image ? 
            `<img src="${post.image}" alt="${post.title}" style="width: 100%; height: 100%; object-fit: cover;">` :
            this.getPostThumbnailIcon(folderType);
        
        postCard.innerHTML = `
            <div class="velog-post-image ${folderType}">
                ${imageContent}
            </div>
            <div class="velog-post-info">
                <div class="velog-post-date">${simpleDate}</div>
                <div class="velog-post-title">${post.title}</div>
                <div class="velog-post-hashtag">${hashtags}</div>
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
        // 포스트 모달 카운터 사용
        postModalCounter++;
        const modalId = `postModal_${postModalCounter}`;
        
        // 모든 활성 모달들의 최고 z-index 찾기
        let maxZIndex = 9000;
        
        // 앱 모달들 확인
        activeAppModals.forEach((id) => {
            const modal = document.getElementById(id);
            if (modal) {
                const zIndex = parseInt(window.getComputedStyle(modal).zIndex) || 9000;
                if (zIndex > maxZIndex) maxZIndex = zIndex;
            }
        });
        
        // 폴더 모달들 확인
        activeFolderModals.forEach((id) => {
            const modal = document.getElementById(id);
            if (modal) {
                const zIndex = parseInt(window.getComputedStyle(modal).zIndex) || 9000;
                if (zIndex > maxZIndex) maxZIndex = zIndex;
            }
        });
        
        // 포스트 모달들 확인
        activePostModals.forEach((title, id) => {
            const modal = document.getElementById(id);
            if (modal) {
                const zIndex = parseInt(window.getComputedStyle(modal).zIndex) || 9000;
                if (zIndex > maxZIndex) maxZIndex = zIndex;
            }
        });
        
        // app-modal 스타일로 생성 (배경 블러 없음)
        const modal = document.createElement('div');
        modal.className = 'app-modal';
        modal.id = modalId;
        modal.style.position = 'fixed';
        
        // 중앙 기준으로 % 단위 사용 (cascade 효과)
        const offsetPercent = (postModalCounter % 5) * 2; // 2%씩 오프셋
        modal.style.top = `${50 + offsetPercent}%`;
        modal.style.left = `${50 + offsetPercent}%`;
        modal.style.transform = 'translate(-50%, -50%)';
        
        // 새 포스트 모달을 최상위로 설정
        modal.style.zIndex = maxZIndex + 1;
        
        modal.innerHTML = `
            <div class="modal-window post-view-window" style="width: 900px; height: 700px; max-width: 95vw; max-height: 95vh;">
                <div class="modal-header">
                    <div class="window-controls">
                        <button class="window-control close" onclick="closePostModal('${modalId}')"></button>
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
        activePostModals.set(modalId, post.title);
        
        // 모달이 즉시 포커스를 받도록 설정
        setTimeout(() => {
            bringAnyModalToFront(modalId);
            modal.focus();
        }, 50);
        
        // 모달 드래그 가능하게 만들기
        makeModalDraggable(modal);
        
        // 클릭시 앞으로 가져오기 (모달 전체와 헤더 모두)
        modal.addEventListener('click', (e) => {
            bringAnyModalToFront(modalId);
        });
        
        const header = modal.querySelector('.modal-header');
        if (header) {
            header.addEventListener('click', (e) => {
                // 버튼 클릭이 아닌 경우에만 앞으로 가져오기
                if (!e.target.classList.contains('window-control')) {
                    bringAnyModalToFront(modalId);
                }
            });
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

// Post modal management functions
function closePostModal(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
        activePostModals.delete(modalId);
        modalResetFunctions.delete(modalId); // 리셋 함수도 정리
    }
}

function bringPostModalToFront(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // 가장 높은 z-index 찾기
        let maxZIndex = 2000;
        activePostModals.forEach((title, id) => {
            const otherModal = document.getElementById(id);
            if (otherModal && otherModal !== modal) {
                const zIndex = parseInt(window.getComputedStyle(otherModal).zIndex) || 2000;
                if (zIndex > maxZIndex) maxZIndex = zIndex;
            }
        });
        
        modal.style.zIndex = maxZIndex + 1;
    }
}

function openFolder(folderType) {
    // 이미 열린 창이 있는지 확인
    if (activeFolderModals.has(folderType)) {
        const existingModalId = activeFolderModals.get(folderType);
        const existingModal = document.getElementById(existingModalId);
        if (existingModal) {
            // 기존 창을 앞으로 가져오기
            bringAnyModalToFront(existingModalId);
            return;
        } else {
            // 창이 삭제되었으면 맵에서 제거
            activeFolderModals.delete(folderType);
        }
    }
    
    folderModalCounter++;
    const modalId = `folderModal_${folderType}_${folderModalCounter}`;
    
    // 모든 활성 모달들의 최고 z-index 찾기
    let maxZIndex = 9000;
    
    // 앱 모달들 확인
    activeAppModals.forEach((id) => {
        const modal = document.getElementById(id);
        if (modal) {
            const zIndex = parseInt(window.getComputedStyle(modal).zIndex) || 9000;
            if (zIndex > maxZIndex) maxZIndex = zIndex;
        }
    });
    
    // 폴더 모달들 확인
    activeFolderModals.forEach((id) => {
        const modal = document.getElementById(id);
        if (modal) {
            const zIndex = parseInt(window.getComputedStyle(modal).zIndex) || 9000;
            if (zIndex > maxZIndex) maxZIndex = zIndex;
        }
    });
    
    // 포스트 모달들 확인
    activePostModals.forEach((title, id) => {
        const modal = document.getElementById(id);
        if (modal) {
            const zIndex = parseInt(window.getComputedStyle(modal).zIndex) || 9000;
            if (zIndex > maxZIndex) maxZIndex = zIndex;
        }
    });
    
    const modal = document.createElement('div');
    modal.className = 'app-modal';
    modal.id = modalId;
    modal.style.position = 'fixed';
    
    // 폴더 타입에 따라 다른 위치에 열기
    if (folderType === 'daily') {
        // 일상vlog: 중앙
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
    } else if (folderType === 'tech') {
        // 기술vlog: 중앙 오른쪽
        modal.style.top = '50%';
        modal.style.left = '60%';
        modal.style.transform = 'translate(-50%, -50%)';
    }
    
    // 새 모달을 최상위로 설정
    modal.style.zIndex = maxZIndex + 1;
    
    const folderTitle = folderType === 'daily' ? '일상vlog' : '기술vlog';
    
    modal.innerHTML = `
        <div class="modal-window" style="width: 900px; height: 700px; max-width: 95vw; max-height: 95vh;">
            <div class="modal-header">
                <div class="window-controls">
                    <button class="window-control close" onclick="closeFolderModal('${modalId}', '${folderType}')"></button>
                    <button class="window-control minimize"></button>
                    <button class="window-control maximize" onclick="toggleMaximizeFolder('${modalId}')"></button>
                </div>
                <div class="modal-title">${folderTitle}</div>
            </div>
            <div class="modal-content">
                <div class="velog-posts" id="${modalId}_content">
                    <!-- velog 스타일 포스트들이 여기에 로드됩니다 -->
                </div>
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    activeFolderModals.set(folderType, modalId);
    
    // 모달이 즉시 포커스를 받도록 설정
    setTimeout(() => {
        bringAnyModalToFront(modalId);
        modal.focus();
    }, 50);
    
    // 초기 상태 저장
    modal.dataset.isMaximized = 'false';
    modal.dataset.originalWidth = '900px';
    modal.dataset.originalHeight = '700px';
    modal.dataset.folderType = folderType;
    
    if (folderType === 'daily') {
        modal.dataset.originalTransform = 'translate(-50%, -50%)';
        modal.dataset.originalTop = '50%';
        modal.dataset.originalLeft = '50%';
    } else {
        modal.dataset.originalTransform = 'translate(-50%, -50%)';
        modal.dataset.originalTop = '50%';
        modal.dataset.originalLeft = '60%';
    }
    
    // 모달 드래그 가능하게 만들기
    makeModalDraggable(modal);
    
    // 클릭시 앞으로 가져오기 (모달 전체와 헤더 모두)
    modal.addEventListener('click', (e) => {
        bringAnyModalToFront(modalId);
    });
    
    const header = modal.querySelector('.modal-header');
    if (header) {
        header.addEventListener('click', (e) => {
            // 버튼 클릭이 아닌 경우에만 앞으로 가져오기
            if (!e.target.classList.contains('window-control')) {
                bringAnyModalToFront(modalId);
            }
        });
    }
    
    // 블로그 콘텐츠 로드
    loadVelogPostsForModal(folderType, `${modalId}_content`);
}

function closeFolderModal(modalId, folderType) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
        activeFolderModals.delete(folderType);
        modalResetFunctions.delete(modalId); // 리셋 함수도 정리
    }
}

function bringFolderModalToFront(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // 가장 높은 z-index 찾기
        let maxZIndex = 2000;
        activeFolderModals.forEach((id) => {
            const otherModal = document.getElementById(id);
            if (otherModal && otherModal !== modal) {
                const zIndex = parseInt(window.getComputedStyle(otherModal).zIndex) || 2000;
                if (zIndex > maxZIndex) maxZIndex = zIndex;
            }
        });
        
        modal.style.zIndex = maxZIndex + 1;
    }
}

function toggleMaximizeFolder(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    const modalWindow = modal.querySelector('.modal-window');
    const isMaximized = modal.dataset.isMaximized === 'true';
    
    if (isMaximized) {
        // 원래 크기로 복원
        modalWindow.style.width = modal.dataset.originalWidth;
        modalWindow.style.height = modal.dataset.originalHeight;
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = modal.dataset.originalTransform;
        modal.dataset.isMaximized = 'false';
    } else {
        // 최대화
        modalWindow.style.width = '95vw';
        modalWindow.style.height = '90vh';
        modal.style.top = '5vh';
        modal.style.left = '2.5vw';
        modal.style.transform = 'none';
        modal.dataset.isMaximized = 'true';
    }
}

// 특정 모달용 블로그 포스트 로드 함수
async function loadVelogPostsForModal(folderType, gridId) {
    const grid = document.getElementById(gridId);
    
    if (!grid) return;
    
    try {
        // 실제 포스트 데이터를 로드
        const posts = await window.macInterface.fetchPostsFromFolder(folderType);
        
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
        posts.sort((a, b) => new Date(b.date) - new Date(a.date));

        // Create velog style post cards
        posts.forEach(post => {
            const postCard = window.macInterface.createVelogPostCard(post, folderType);
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

function closeModal(modalId) {
    // Legacy function - now handled by specific modal close functions
    if (modalId.includes('Modal')) {
        // 기존 HTML에 있는 모달들 처리
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
        }
    }
}

// 새창을 열고 항상 포커스를 맞추는 범용 함수
function openNewWindow(url, target = '_blank') {
    const newWindow = window.open(url, target);
    // 새창이 항상 위로 오도록 포커스 설정
    if (newWindow) {
        // 약간의 지연을 두어 확실히 포커스가 맞춰지도록 함
        setTimeout(() => {
            newWindow.focus();
        }, 100);
    }
    return newWindow;
}

function openGitHub() {
    openNewWindow('https://github.com/stylechoi');
}

// Search functionality
function openSearch() {
    const spotlightContainer = document.querySelector('.spotlight-search-container');
    const spotlightInput = document.getElementById('spotlightInput');
    
    if (spotlightContainer) {
        spotlightContainer.classList.add('active');
        if (spotlightInput) {
            setTimeout(() => {
                spotlightInput.focus();
            }, 100);
        }
    }
}

function closeSearch() {
    const spotlightContainer = document.querySelector('.spotlight-search-container');
    const spotlightInput = document.getElementById('spotlightInput');
    
    if (spotlightContainer) {
        spotlightContainer.classList.remove('active');
        if (spotlightInput) {
            spotlightInput.value = '';
            spotlightInput.blur();
        }
    }
}

function performSearch(query) {
    const searchResults = document.getElementById('searchResults');
    
    if (!query.trim()) {
        searchResults.innerHTML = `
            <div class="search-empty">
                <div class="search-empty-icon">🔍</div>
                <div class="search-empty-text">Start typing to search...</div>
            </div>
        `;
        return;
    }
    
    // 검색 대상 데이터
    const searchData = [
        // 블로그 포스트들
        { type: 'blog', title: '첫 번째 포스트 with new system', category: 'daily', icon: '📝' },
        { type: 'blog', title: 'Async/Await Programming', category: 'tech', icon: '💻' },
        { type: 'blog', title: 'Event Loop Optimization', category: 'tech', icon: '💻' },
        { type: 'blog', title: 'Web Worker Multithreading', category: 'tech', icon: '💻' },
        { type: 'blog', title: 'GitHub Blog System', category: 'tech', icon: '💻' },
        
        // 앱들
        { type: 'app', title: 'About me', category: 'finder', icon: '🗂️' },
        { type: 'app', title: 'My project', category: 'launchpad', icon: '🚀' },
        { type: 'app', title: 'My portfolio', category: 'safari', icon: '🌐' },
        { type: 'app', title: 'Read me', category: 'notes', icon: '📝' },
        { type: 'app', title: 'My GitHub', category: 'github', icon: '🐙' },
        
        // 폴더들
        { type: 'folder', title: '일상vlog', category: 'daily', icon: '📁' },
        { type: 'folder', title: '기술vlog', category: 'tech', icon: '📁' },
        
        // 시스템 기능들
        { type: 'system', title: 'Control Center', category: 'system', icon: '⚙️' },
        { type: 'system', title: 'Wi-Fi Settings', category: 'network', icon: '📶' },
        { type: 'system', title: 'Dark Mode', category: 'display', icon: '🌙' },
        { type: 'system', title: 'Brightness Control', category: 'display', icon: '☀️' },
        { type: 'system', title: 'Volume Control', category: 'audio', icon: '🔊' },
        { type: 'system', title: 'Music Player', category: 'audio', icon: '🎵' }
    ];
    
    // 검색 수행
    const results = searchData.filter(item => 
        item.title.toLowerCase().includes(query.toLowerCase()) ||
        item.category.toLowerCase().includes(query.toLowerCase())
    );
    
    if (results.length === 0) {
        searchResults.innerHTML = `
            <div class="search-empty">
                <div class="search-empty-icon">😔</div>
                <div class="search-empty-text">No results found for "${query}"</div>
            </div>
        `;
        return;
    }
    
    // 결과 표시
    const resultHTML = results.map(item => {
        const highlightedTitle = item.title.replace(
            new RegExp(query, 'gi'),
            match => `<span class="search-result-highlight">${match}</span>`
        );
        
        return `
            <div class="search-result-item" onclick="handleSearchResult('${item.type}', '${item.category}', '${item.title}')">
                <div class="search-result-icon">${item.icon}</div>
                <div class="search-result-content">
                    <div class="search-result-title">${highlightedTitle}</div>
                    <div class="search-result-type">${item.type.charAt(0).toUpperCase() + item.type.slice(1)} • ${item.category}</div>
                </div>
            </div>
        `;
    }).join('');
    
    searchResults.innerHTML = resultHTML;
}

function handleSearchResult(type, category, title) {
    closeSearch();
    
    switch (type) {
        case 'blog':
            openFolder(category);
            break;
        case 'folder':
            openFolder(category);
            break;
        case 'app':
            if (category === 'github') {
                openGitHub();
            } else {
                alert(`Opening ${title}...`);
            }
            break;
        case 'system':
            if (category === 'system') {
                window.macInterface.toggleControlCenter();
            } else {
                alert(`Opening ${title}...`);
            }
            break;
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    window.macInterface = new MacInterface();
    
    // 검색 이벤트 리스너 추가
    const spotlightIcon = document.getElementById('spotlightIcon');
    const spotlightInput = document.getElementById('spotlightInput');
    const spotlightContainer = document.querySelector('.spotlight-search-container');
    
    if (spotlightIcon) {
        spotlightIcon.addEventListener('click', openSearch);
    }
    
    if (spotlightInput) {
        spotlightInput.addEventListener('input', (e) => {
            performSearch(e.target.value);
        });
        
        spotlightInput.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') {
                closeSearch();
            }
        });
    }
    
    // 다른 곳 클릭 시 spotlight 닫기
    document.addEventListener('click', (e) => {
        if (spotlightContainer && spotlightContainer.classList.contains('active')) {
            if (!spotlightContainer.contains(e.target) && e.target !== spotlightIcon) {
                closeSearch();
            }
        }
    });
    
    // 키보드 단축키 (Cmd+Space)
    document.addEventListener('keydown', (e) => {
        if ((e.metaKey || e.ctrlKey) && e.code === 'Space') {
            e.preventDefault();
            openSearch();
        }
        
        // ESC 키로 모든 창 원래 위치로 되돌리기
        if (e.key === 'Escape') {
            resetAllModalsPosition();
        }
    });

    const darkModeToggle = document.getElementById('darkModeToggle');
    const darkModeCard = document.getElementById('darkModeCard');
    const darkModeIcon = document.getElementById('darkModeIcon');
    const darkModeTitle = document.getElementById('darkModeTitle');
    
    // Wi-Fi, Bluetooth, AirDrop 토글
    const wifiToggle = document.getElementById('wifiToggle');
    const bluetoothToggle = document.getElementById('bluetoothToggle');
    const airdropToggle = document.getElementById('airdropToggle');
    
    // 메뉴바 Wi-Fi 아이콘
    const wifiContainer = document.getElementById('wifiIcon');
    const wifiMenuPanel = document.getElementById('wifiMenuPanel');
    const wifiToggleSwitch = document.getElementById('wifiToggleSwitch');
    
    // 상태 변수들 (참고 프로젝트처럼)
    let wifiState = true;  // true = on, false = off
    let bluetoothState = false;
    let airdropState = true;
    let showWifiMenu = false;  // Wi-Fi 패널 표시 상태
    
    // AirDrop 상태 업데이트 함수
    function updateAirdropState(isOn) {
        airdropState = isOn;
        
        // 컨트롤센터 AirDrop 업데이트
        if (airdropToggle) {
            const subtitle = airdropToggle.closest('.cc-item').querySelector('.cc-subtitle');
            
            if (isOn) {
                airdropToggle.classList.add('active');
                subtitle.textContent = 'Contacts Only';
            } else {
                airdropToggle.classList.remove('active');
                subtitle.textContent = 'Off';
            }
        }
    }
    
    // Wi-Fi 상태 업데이트 함수 (메뉴바와 컨트롤센터 동기화)
    function updateWifiState(isOn) {
        wifiState = isOn;
        console.log('WiFi state changed to:', isOn);
        
        // 컨트롤센터 Wi-Fi 업데이트
        if (wifiToggle) {
            const subtitle = wifiToggle.closest('.cc-item').querySelector('.cc-subtitle');
            const svgIcon = wifiToggle.querySelector('.cc-icon');
            
            if (isOn) {
                wifiToggle.classList.add('active');
                if (svgIcon) {
                    // 사선 제거
                    const existingLine = svgIcon.querySelector('.wifi-off-line');
                    if (existingLine) {
                        existingLine.remove();
                    }
                    console.log('Removed wifi-off line from control center');
                }
                if (subtitle) subtitle.textContent = 'Home';
            } else {
                wifiToggle.classList.remove('active');
                if (svgIcon) {
                    // 사선 추가
                    const existingLine = svgIcon.querySelector('.wifi-off-line');
                    if (!existingLine) {
                        const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                        line.setAttribute('x1', '2');
                        line.setAttribute('y1', '18');
                        line.setAttribute('x2', '18');
                        line.setAttribute('y2', '2');
                        line.setAttribute('stroke', '#FF3B30');
                        line.setAttribute('stroke-width', '3');
                        line.setAttribute('stroke-linecap', 'round');
                        line.classList.add('wifi-off-line');
                        svgIcon.appendChild(line);
                        console.log('Added wifi-off line to control center');
                    }
                }
                if (subtitle) subtitle.textContent = 'Off';
            }
        }
        
        // 메뉴바 Wi-Fi 아이콘 업데이트
        const menubarSvgIcon = document.querySelector('#wifiIcon .wifi-icon');
        if (menubarSvgIcon) {
            if (isOn) {
                // 사선 제거
                const existingLine = menubarSvgIcon.querySelector('.wifi-off-line');
                if (existingLine) {
                    existingLine.remove();
                }
                console.log('Removed wifi-off line from menubar');
            } else {
                // 사선 추가
                const existingLine = menubarSvgIcon.querySelector('.wifi-off-line');
                if (!existingLine) {
                    const line = document.createElementNS('http://www.w3.org/2000/svg', 'line');
                    line.setAttribute('x1', '2');
                    line.setAttribute('y1', '18');
                    line.setAttribute('x2', '18');
                    line.setAttribute('y2', '2');
                    line.setAttribute('stroke', '#FF3B30');
                    line.setAttribute('stroke-width', '2.5');
                    line.setAttribute('stroke-linecap', 'round');
                    line.classList.add('wifi-off-line');
                    menubarSvgIcon.appendChild(line);
                    console.log('Added wifi-off line to menubar');
                }
            }
        }
        
        // Wi-Fi 패널 토글 스위치 업데이트
        if (wifiToggleSwitch) {
            wifiToggleSwitch.checked = isOn;
        }
    }
    
    // Wi-Fi 패널 열기/닫기
    function toggleWifiMenu() {
        showWifiMenu = !showWifiMenu;
        if (wifiMenuPanel) {
            if (showWifiMenu) {
                wifiMenuPanel.classList.add('active');
                wifiContainer.classList.add('active');
            } else {
                wifiMenuPanel.classList.remove('active');
                wifiContainer.classList.remove('active');
            }
        }
    }
    
    // Wi-Fi 패널 닫기
    function closeWifiMenu() {
        showWifiMenu = false;
        if (wifiMenuPanel) {
            wifiMenuPanel.classList.remove('active');
            wifiContainer.classList.remove('active');
        }
    }
    
    // 풀스크린 토글
    const fullscreenCard = document.getElementById('fullscreenCard');
    const fullscreenIcon = document.getElementById('fullscreenIcon');
    const fullscreenText = document.getElementById('fullscreenText');
    
    let isFullscreen = false;
    
    // 테마 토글 상태 변수
    let themeToggleActive = true; // 기본적으로 활성화 상태
    
    // 다크모드 토글 기능 (실제 테마 변경 없이 토글 상태만 변경)
    function updateThemeToggle(isActive) {
        if (isActive) {
            darkModeCard.classList.add('active');
            darkModeIcon.innerHTML = '<circle cx="12" cy="12" r="5"/><path d="M12 1v2m0 18v2M4.22 4.22l1.42 1.42m12.72 12.72l1.42 1.42M1 12h2m18 0h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42"/>';
            darkModeTitle.textContent = 'Light Mode';
        } else {
            darkModeCard.classList.remove('active');
            darkModeIcon.innerHTML = '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/>';
            darkModeTitle.textContent = 'Dark Mode';
        }
    }
    
    if (darkModeToggle) {
        darkModeToggle.addEventListener('click', function(event) {
            event.stopPropagation(); // 이벤트 버블링 방지
            themeToggleActive = !themeToggleActive;
            updateThemeToggle(themeToggleActive);
        });
    }
    
    // 컨트롤센터 Wi-Fi 토글
    if (wifiToggle) {
        wifiToggle.addEventListener('click', function(event) {
            event.stopPropagation();
            updateWifiState(!wifiState);
        });
    }
    
    // 메뉴바 Wi-Fi 클릭 이벤트 (패널 열기/닫기)
    if (wifiContainer) {
        wifiContainer.addEventListener('click', function(event) {
            event.stopPropagation();
            toggleWifiMenu();
        });
    }
    
    // Wi-Fi 패널 토글 스위치 이벤트
    if (wifiToggleSwitch) {
        wifiToggleSwitch.addEventListener('change', function(event) {
            event.stopPropagation();
            updateWifiState(this.checked);
        });
    }
    
    // Wi-Fi 패널 외부 클릭시 닫기
    document.addEventListener('click', function(event) {
        if (wifiMenuPanel && wifiMenuPanel.classList.contains('active')) {
            if (!wifiMenuPanel.contains(event.target) && !wifiContainer.contains(event.target)) {
                closeWifiMenu();
            }
        }
    });
    
    // Bluetooth 토글
    if (bluetoothToggle) {
        bluetoothToggle.addEventListener('click', function(event) {
            event.stopPropagation(); // 이벤트 버블링 방지
            bluetoothState = !bluetoothState;
            const subtitle = bluetoothToggle.closest('.cc-item').querySelector('.cc-subtitle');
            
            if (bluetoothState) {
                bluetoothToggle.classList.add('active');
                subtitle.textContent = 'On';
            } else {
                bluetoothToggle.classList.remove('active');
                subtitle.textContent = 'Off';
            }
        });
    }
    
    // AirDrop 토글  
    if (airdropToggle) {
        airdropToggle.addEventListener('click', function(event) {
            event.stopPropagation(); // 이벤트 버블링 방지
            updateAirdropState(!airdropState);
        });
    }
    
    // 풀스크린 토글
    if (fullscreenCard) {
        fullscreenCard.addEventListener('click', function(event) {
            event.stopPropagation(); // 이벤트 버블링 방지
            isFullscreen = !isFullscreen;
            if (isFullscreen) {
                fullscreenCard.classList.add('fullscreen');
                fullscreenIcon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>';
                fullscreenText.innerHTML = 'Exit<br>Fullscreen';
                // 실제 풀스크린 요청
                if (document.documentElement.requestFullscreen) {
                    document.documentElement.requestFullscreen();
                }
            } else {
                fullscreenCard.classList.remove('fullscreen');
                fullscreenIcon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>';
                fullscreenText.innerHTML = 'Enter<br>Fullscreen';
                // 풀스크린 종료
                if (document.exitFullscreen) {
                    document.exitFullscreen();
                }
            }
        });
    }
    
    // 풀스크린 상태 변경 감지
    document.addEventListener('fullscreenchange', function() {
        if (!document.fullscreenElement && isFullscreen) {
            isFullscreen = false;
            fullscreenCard.classList.remove('fullscreen');
            fullscreenIcon.innerHTML = '<path d="M8 3H5a2 2 0 0 0-2 2v3m18 0V5a2 2 0 0 0-2-2h-3m0 18h3a2 2 0 0 0 2-2v-3M3 16v3a2 2 0 0 0 2 2h3"/>';
            fullscreenText.innerHTML = 'Enter<br>Fullscreen';
        }
    });
    
    // 초기 상태 설정
    updateThemeToggle(true);
    updateAirdropState(true); // AirDrop 초기 활성화
});

// 홈으로 돌아가는 함수
function goHome() {
    // 모든 모달 닫기 (기존 HTML 모달들)
    closeModal('dailyModal');
    closeModal('techModal');
    closeSearch();
    
    // 모든 앱 모달 닫기
    activeAppModals.forEach((modalId, appType) => {
        closeAppModal(modalId, appType);
    });
    
    // 모든 폴더 모달 닫기
    activeFolderModals.forEach((modalId, folderType) => {
        closeFolderModal(modalId, folderType);
    });
    
    // 모든 포스트 모달 닫기
    activePostModals.forEach((title, modalId) => {
        closePostModal(modalId);
    });
    
    // 컨트롤 센터 닫기
    const controlCenterPanel = document.getElementById('controlCenterPanel');
    if (controlCenterPanel) {
        controlCenterPanel.classList.remove('active');
    }
    
    // Wi-Fi 메뉴 패널 닫기
    const wifiMenuPanel = document.getElementById('wifiMenuPanel');
    if (wifiMenuPanel) {
        wifiMenuPanel.classList.remove('active');
    }
}

// 앱 모달 관리
let appModalCounter = 0;
const activeAppModals = new Map(); // appType -> modalId 매핑
const modalResetFunctions = new Map(); // modalId -> resetFunction 매핑

// 폴더 모달 관리
let folderModalCounter = 0;
const activeFolderModals = new Map(); // folderType -> modalId 매핑

// 포스트 모달 관리
let postModalCounter = 0;
const activePostModals = new Map(); // modalId -> postTitle 매핑

function openAppModal(appType) {
    // 이미 열린 창이 있는지 확인
    if (activeAppModals.has(appType)) {
        const existingModalId = activeAppModals.get(appType);
        const existingModal = document.getElementById(existingModalId);
        if (existingModal) {
            // 기존 창을 앞으로 가져오기
            bringAnyModalToFront(existingModalId);
            return;
        } else {
            // 창이 삭제되었으면 맵에서 제거
            activeAppModals.delete(appType);
        }
    }
    
    appModalCounter++;
    const modalId = `appModal_${appType}_${appModalCounter}`;
    
    // 모든 활성 모달들의 최고 z-index 찾기
    let maxZIndex = 9000;
    
    // 앱 모달들 확인
    activeAppModals.forEach((id) => {
        const modal = document.getElementById(id);
        if (modal) {
            const zIndex = parseInt(window.getComputedStyle(modal).zIndex) || 9000;
            if (zIndex > maxZIndex) maxZIndex = zIndex;
        }
    });
    
    // 폴더 모달들 확인
    activeFolderModals.forEach((id) => {
        const modal = document.getElementById(id);
        if (modal) {
            const zIndex = parseInt(window.getComputedStyle(modal).zIndex) || 9000;
            if (zIndex > maxZIndex) maxZIndex = zIndex;
        }
    });
    
    // 포스트 모달들 확인
    activePostModals.forEach((title, id) => {
        const modal = document.getElementById(id);
        if (modal) {
            const zIndex = parseInt(window.getComputedStyle(modal).zIndex) || 9000;
            if (zIndex > maxZIndex) maxZIndex = zIndex;
        }
    });
    
    const modal = document.createElement('div');
    modal.className = 'app-modal';
    modal.id = modalId;
    modal.style.position = 'fixed';
    
    // 중앙 기준으로 % 단위 사용 (cascade 효과를 위해 약간씩 오프셋)
    const offsetPercent = (appModalCounter % 5) * 2; // 2%씩 오프셋
    modal.style.top = `${50 + offsetPercent}%`;
    modal.style.left = `${50 + offsetPercent}%`;
    modal.style.transform = 'translate(-50%, -50%)';
    
    // 새 앱 모달을 최상위로 설정
    modal.style.zIndex = maxZIndex + 1;
    
    const appContent = getAppContent(appType);
    
    modal.innerHTML = `
        <div class="modal-window" style="width: 800px; height: 600px; max-width: 90vw; max-height: 90vh;">
            <div class="modal-header">
                <div class="window-controls">
                    <button class="window-control close" onclick="closeAppModal('${modalId}', '${appType}')"></button>
                    <button class="window-control minimize"></button>
                    <button class="window-control maximize"></button>
                </div>
                <div class="modal-title">${appContent.title}</div>
            </div>
            <div class="modal-content">
                ${appContent.content}
            </div>
        </div>
    `;
    
    document.body.appendChild(modal);
    activeAppModals.set(appType, modalId);
    
    // 모달이 즉시 포커스를 받도록 설정
    setTimeout(() => {
        bringAnyModalToFront(modalId);
        modal.focus();
    }, 50);
    
    // 모달 드래그 가능하게 만들기
    makeModalDraggable(modal);
    
    // 클릭시 앞으로 가져오기 (모달 전체와 헤더 모두)
    modal.addEventListener('click', (e) => {
        bringAnyModalToFront(modalId);
    });
    
    const header = modal.querySelector('.modal-header');
    if (header) {
        header.addEventListener('click', (e) => {
            // 버튼 클릭이 아닌 경우에만 앞으로 가져오기
            if (!e.target.classList.contains('window-control')) {
                bringAnyModalToFront(modalId);
            }
        });
    }
}

function closeAppModal(modalId, appType) {
    const modal = document.getElementById(modalId);
    if (modal) {
        modal.remove();
        activeAppModals.delete(appType);
        modalResetFunctions.delete(modalId); // 리셋 함수도 정리
    }
}

function getAppContent(appType) {
    const contents = {
        aboutme: {
            title: 'About Me',
            content: `
                <div style="padding: 40px; text-align: center;">
                    <div style="margin-bottom: 30px;">
                        <div style="width: 120px; height: 120px; border-radius: 50%; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); margin: 0 auto 20px; display: flex; align-items: center; justify-content: center; color: white; font-size: 48px;">
                            👨‍💻
                        </div>
                        <h2 style="margin-bottom: 10px; color: #333;">최도형 (Choi Do Hyeong)</h2>
                        <p style="color: #666; font-size: 16px;">Full Stack Developer</p>
                    </div>
                    
                    <div style="text-align: left; max-width: 600px; margin: 0 auto;">
                        <h3 style="margin-bottom: 15px; color: #333;">🚀 Skills</h3>
                        <p style="margin-bottom: 20px; line-height: 1.6; color: #555;">
                            Frontend: React, Vue.js, JavaScript, TypeScript, HTML5, CSS3<br>
                            Backend: Node.js, Python, Java, Spring Boot<br>
                            Database: MySQL, MongoDB, PostgreSQL<br>
                            Tools: Git, Docker, AWS, Firebase
                        </p>
                        
                        <h3 style="margin-bottom: 15px; color: #333;">💡 About</h3>
                        <p style="line-height: 1.6; color: #555;">
                            안녕하세요! 끊임없이 배우고 성장하는 개발자 최도형입니다. 
                            사용자 경험을 중시하며, 깔끔하고 효율적인 코드를 작성하는 것을 좋아합니다.
                            새로운 기술에 대한 호기심이 많고, 팀워크를 통해 더 나은 결과를 만들어내는 것을 즐깁니다.
                        </p>
                    </div>
                </div>
            `
        },
        project: {
            title: 'My Projects',
            content: `
                <div style="padding: 30px;">
                    <h2 style="margin-bottom: 30px; color: #333; text-align: center;">🚀 프로젝트 포트폴리오</h2>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 24px;">
                        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); border: 1px solid #eee;">
                            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 10px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">🌐</div>
                            <h3 style="margin-bottom: 12px; color: #333;">macOS Style Blog</h3>
                            <p style="color: #666; line-height: 1.5; margin-bottom: 16px;">
                                macOS Monterey 스타일의 인터랙티브 블로그 시스템. Vanilla JavaScript로 구현한 네이티브 macOS UI/UX.
                            </p>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                <span style="background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 12px; font-size: 12px;">JavaScript</span>
                                <span style="background: #f3e5f5; color: #7b1fa2; padding: 4px 8px; border-radius: 12px; font-size: 12px;">CSS3</span>
                                <span style="background: #e8f5e8; color: #388e3c; padding: 4px 8px; border-radius: 12px; font-size: 12px;">HTML5</span>
                            </div>
                        </div>
                        
                        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); border: 1px solid #eee;">
                            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #ffa726 0%, #ff7043 100%); border-radius: 10px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">📱</div>
                            <h3 style="margin-bottom: 12px; color: #333;">React Native App</h3>
                            <p style="color: #666; line-height: 1.5; margin-bottom: 16px;">
                                크로스 플랫폼 모바일 앱 개발. Redux를 활용한 상태 관리와 네이티브 모듈 연동.
                            </p>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                <span style="background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 12px; font-size: 12px;">React Native</span>
                                <span style="background: #f3e5f5; color: #7b1fa2; padding: 4px 8px; border-radius: 12px; font-size: 12px;">Redux</span>
                                <span style="background: #fff3e0; color: #f57c00; padding: 4px 8px; border-radius: 12px; font-size: 12px;">Firebase</span>
                            </div>
                        </div>
                        
                        <div style="background: white; border-radius: 12px; padding: 24px; box-shadow: 0 4px 16px rgba(0,0,0,0.1); border: 1px solid #eee;">
                            <div style="width: 50px; height: 50px; background: linear-gradient(135deg, #42a5f5 0%, #478ed1 100%); border-radius: 10px; margin-bottom: 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 24px;">⚙️</div>
                            <h3 style="margin-bottom: 12px; color: #333;">Node.js API Server</h3>
                            <p style="color: #666; line-height: 1.5; margin-bottom: 16px;">
                                Express.js 기반 RESTful API 서버. JWT 인증과 MongoDB 연동으로 확장 가능한 백엔드 구축.
                            </p>
                            <div style="display: flex; gap: 8px; flex-wrap: wrap;">
                                <span style="background: #e8f5e8; color: #388e3c; padding: 4px 8px; border-radius: 12px; font-size: 12px;">Node.js</span>
                                <span style="background: #f3e5f5; color: #7b1fa2; padding: 4px 8px; border-radius: 12px; font-size: 12px;">Express</span>
                                <span style="background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 12px; font-size: 12px;">MongoDB</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
        },
        portfolio: {
            title: 'My Portfolio',
            content: `
                <div style="padding: 30px;">
                    <div style="text-align: center; margin-bottom: 40px;">
                        <h1 style="margin-bottom: 16px; color: #333;">✨ 포트폴리오</h1>
                        <p style="color: #666; font-size: 18px;">창의적이고 혁신적인 웹 개발자의 여정</p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(280px, 1fr)); gap: 24px; margin-bottom: 40px;">
                        <div style="text-align: center;">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px;">🎨</div>
                            <h3 style="margin-bottom: 8px; color: #333;">UI/UX Design</h3>
                            <p style="color: #666; line-height: 1.5;">사용자 중심의 직관적인 인터페이스 디자인</p>
                        </div>
                        
                        <div style="text-align: center;">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #ffa726 0%, #ff7043 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px;">⚡</div>
                            <h3 style="margin-bottom: 8px; color: #333;">Performance</h3>
                            <p style="color: #666; line-height: 1.5;">빠르고 효율적인 웹 애플리케이션 최적화</p>
                        </div>
                        
                        <div style="text-align: center;">
                            <div style="width: 80px; height: 80px; background: linear-gradient(135deg, #42a5f5 0%, #478ed1 100%); border-radius: 50%; margin: 0 auto 16px; display: flex; align-items: center; justify-content: center; color: white; font-size: 32px;">📱</div>
                            <h3 style="margin-bottom: 8px; color: #333;">Responsive</h3>
                            <p style="color: #666; line-height: 1.5;">모든 디바이스에서 완벽한 반응형 웹</p>
                        </div>
                    </div>
                    
                    <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); border-radius: 16px; padding: 32px; color: white; text-align: center;">
                        <h2 style="margin-bottom: 16px;">🚀 Let's Create Something Amazing</h2>
                        <p style="margin-bottom: 24px; opacity: 0.9;">함께 혁신적인 프로젝트를 만들어보세요!</p>
                        <div style="display: flex; justify-content: center; gap: 16px; flex-wrap: wrap;">
                            <button style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px;">📧 Contact</button>
                            <button style="background: rgba(255,255,255,0.2); border: 1px solid rgba(255,255,255,0.3); color: white; padding: 12px 24px; border-radius: 8px; cursor: pointer; font-size: 14px;">📄 Resume</button>
                        </div>
                    </div>
                </div>
            `
        },
        memo: {
            title: 'Read Me',
            content: `
                <div style="padding: 30px; font-family: -apple-system, BlinkMacSystemFont, 'SF Pro Text', system-ui, sans-serif;">
                    <div style="margin-bottom: 30px; text-align: center;">
                        <div style="font-size: 48px; margin-bottom: 16px;">📝</div>
                        <h1 style="color: #333; margin-bottom: 8px;">개발자 노트</h1>
                        <p style="color: #666;">일상과 개발 이야기</p>
                    </div>
                    
                    <div style="background: #f8f9fa; border-radius: 12px; padding: 24px; margin-bottom: 24px;">
                        <h3 style="color: #333; margin-bottom: 16px;">💡 오늘의 생각</h3>
                        <p style="color: #555; line-height: 1.6;">
                            "좋은 코드는 시를 읽는 것과 같다. 간결하면서도 의미가 명확하고, 
                            읽는 이로 하여금 감동을 주는 것이다."
                        </p>
                    </div>
                    
                    <div style="display: grid; grid-template-columns: repeat(auto-fit, minmax(250px, 1fr)); gap: 16px;">
                        <div style="background: white; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
                            <h4 style="color: #007AFF; margin-bottom: 12px;">📚 학습 목표</h4>
                            <ul style="color: #555; line-height: 1.6; padding-left: 16px;">
                                <li>React 18 새로운 기능 익히기</li>
                                <li>TypeScript 고급 타입 시스템</li>
                                <li>Node.js 성능 최적화</li>
                                <li>Docker & Kubernetes</li>
                            </ul>
                        </div>
                        
                        <div style="background: white; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
                            <h4 style="color: #FF9500; margin-bottom: 12px;">🎯 진행 중인 프로젝트</h4>
                            <ul style="color: #555; line-height: 1.6; padding-left: 16px;">
                                <li>macOS Style Blog System</li>
                                <li>React Native Shopping App</li>
                                <li>AI 챗봇 프로젝트</li>
                                <li>개인 포트폴리오 사이트</li>
                            </ul>
                        </div>
                        
                        <div style="background: white; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
                            <h4 style="color: #34C759; margin-bottom: 12px;">✅ 완료한 일들</h4>
                            <ul style="color: #555; line-height: 1.6; padding-left: 16px;">
                                <li>블로그 시스템 구축</li>
                                <li>반응형 디자인 적용</li>
                                <li>검색 기능 구현</li>
                                <li>다크모드 토글</li>
                            </ul>
                        </div>
                        
                        <div style="background: white; border: 1px solid #eee; border-radius: 8px; padding: 20px;">
                            <h4 style="color: #FF3B30; margin-bottom: 12px;">🔧 기술 스택</h4>
                            <div style="display: flex; flex-wrap: wrap; gap: 8px;">
                                <span style="background: #e3f2fd; color: #1976d2; padding: 4px 8px; border-radius: 12px; font-size: 12px;">JavaScript</span>
                                <span style="background: #f3e5f5; color: #7b1fa2; padding: 4px 8px; border-radius: 12px; font-size: 12px;">React</span>
                                <span style="background: #e8f5e8; color: #388e3c; padding: 4px 8px; border-radius: 12px; font-size: 12px;">Node.js</span>
                                <span style="background: #fff3e0; color: #f57c00; padding: 4px 8px; border-radius: 12px; font-size: 12px;">MongoDB</span>
                            </div>
                        </div>
                    </div>
                </div>
            `
        }
    };
    
    return contents[appType] || { title: 'Unknown App', content: '<p>Content not found</p>' };
}

function makeModalDraggable(modal) {
    const header = modal.querySelector('.modal-header');
    let isDragging = false;
    let currentX;
    let currentY;
    let initialX;
    let initialY;
    let xOffset = 0;
    let yOffset = 0;
    let clickCount = 0;
    let clickTimer = null;

    // 더블클릭 시 중앙으로 이동
    header.addEventListener('dblclick', (e) => {
        e.preventDefault();
        e.stopPropagation();
        e.stopImmediatePropagation();
        
        // 더블클릭 시 중앙으로 이동
        resetModalPosition();
        return false;
    });
    
    header.addEventListener('selectstart', (e) => {
        e.preventDefault();
        return false;
    });

    header.addEventListener('mousedown', dragStart);
    document.addEventListener('mousemove', drag);
    document.addEventListener('mouseup', dragEnd);

    function dragStart(e) {
        // 최대화된 상태에서는 드래그 불가
        if (modal.dataset.isMaximized === 'true') {
            return;
        }
        
        // 기본 동작 방지
        e.preventDefault();
        e.stopPropagation();
        
        initialX = e.clientX - xOffset;
        initialY = e.clientY - yOffset;

        if (e.target === header || header.contains(e.target)) {
            // 버튼 클릭시에는 드래그 시작하지 않음
            if (e.target.classList.contains('window-control')) {
                return;
            }
            isDragging = true;
            // 드래그 시작할 때만 move 커서로 변경
            header.style.cursor = 'move';
            document.body.style.cursor = 'move';
        }
    }

    function drag(e) {
        if (isDragging) {
            e.preventDefault();
            currentX = e.clientX - initialX;
            currentY = e.clientY - initialY;

            xOffset = currentX;
            yOffset = currentY;

            const modalWindow = modal.querySelector('.modal-window');
            // transform을 기존 중앙 정렬에서 translate로 변경
            modal.style.transform = `translate(calc(-50% + ${currentX}px), calc(-50% + ${currentY}px))`;
        }
    }

    function dragEnd(e) {
        initialX = currentX;
        initialY = currentY;
        isDragging = false;
        
        // 커서를 다시 기본값으로 되돌리기
        header.style.cursor = 'default';
        document.body.style.cursor = 'default';
        
        // 창이 화면 밖으로 나갔는지 체크
        checkAndFixModalPosition();
    }
    
    function checkAndFixModalPosition() {
        const modalRect = modal.getBoundingClientRect();
        const screenWidth = window.innerWidth;
        const screenHeight = window.innerHeight;
        
        // 창이 완전히 화면 밖으로 나갔거나 너무 많이 나간 경우
        const isOutOfBounds = (
            modalRect.right < 100 || // 왼쪽으로 너무 많이 나감
            modalRect.left > screenWidth - 100 || // 오른쪽으로 너무 많이 나감
            modalRect.bottom < 100 || // 위로 너무 많이 나감
            modalRect.top > screenHeight - 100 // 아래로 너무 많이 나감
        );
        
        if (isOutOfBounds) {
            // 창을 안전한 위치(중앙)으로 되돌리기
            resetModalPosition();
        }
    }
    
    function resetModalPosition() {
        // 위치 초기화
        xOffset = 0;
        yOffset = 0;
        currentX = 0;
        currentY = 0;
        initialX = 0;
        initialY = 0;
        
        // 모든 위치 스타일 완전 초기화
        modal.style.top = '50%';
        modal.style.left = '50%';
        modal.style.transform = 'translate(-50%, -50%)';
        
        // 부드러운 애니메이션 효과
        modal.style.transition = 'all 0.3s ease';
        setTimeout(() => {
            modal.style.transition = '';
        }, 300);
    }
    
    // 이 모달의 리셋 함수를 전역에서 사용할 수 있도록 등록
    modalResetFunctions.set(modal.id, resetModalPosition);
}

function bringModalToFront(modalId) {
    const modal = document.getElementById(modalId);
    if (modal) {
        // 가장 높은 z-index 찾기
        let maxZIndex = 2000;
        activeAppModals.forEach((id) => {
            const otherModal = document.getElementById(id);
            if (otherModal && otherModal !== modal) {
                const zIndex = parseInt(window.getComputedStyle(otherModal).zIndex) || 2000;
                if (zIndex > maxZIndex) maxZIndex = zIndex;
            }
        });
        
        modal.style.zIndex = maxZIndex + 1;
    }
}

// 모든 모달을 원래 위치로 되돌리는 함수
function resetAllModalsPosition() {
    // 앱 모달들 되돌리기
    activeAppModals.forEach((modalId) => {
        const resetFunc = modalResetFunctions.get(modalId);
        if (resetFunc) {
            resetFunc();
        }
    });
    
    // 폴더 모달들 되돌리기
    activeFolderModals.forEach((modalId) => {
        const resetFunc = modalResetFunctions.get(modalId);
        if (resetFunc) {
            resetFunc();
        }
    });
    
    // 포스트 모달들 되돌리기
    activePostModals.forEach((title, modalId) => {
        const resetFunc = modalResetFunctions.get(modalId);
        if (resetFunc) {
            resetFunc();
        }
    });
    
    // 검색창도 닫기
    closeSearch();
}

// 통합 모달 최상위 가져오기 함수
function bringAnyModalToFront(modalId) {
    const modal = document.getElementById(modalId);
    if (!modal) return;
    
    // 모든 활성 모달들의 z-index 찾기
    let maxZIndex = 9000; // 기본 최소값을 높게 설정
    
    // 앱 모달들 확인
    activeAppModals.forEach((id) => {
        const otherModal = document.getElementById(id);
        if (otherModal && otherModal !== modal) {
            const zIndex = parseInt(window.getComputedStyle(otherModal).zIndex) || 9000;
            if (zIndex > maxZIndex) maxZIndex = zIndex;
        }
    });
    
    // 폴더 모달들 확인
    activeFolderModals.forEach((id) => {
        const otherModal = document.getElementById(id);
        if (otherModal && otherModal !== modal) {
            const zIndex = parseInt(window.getComputedStyle(otherModal).zIndex) || 9000;
            if (zIndex > maxZIndex) maxZIndex = zIndex;
        }
    });
    
    // 포스트 모달들 확인
    activePostModals.forEach((title, id) => {
        const otherModal = document.getElementById(id);
        if (otherModal && otherModal !== modal) {
            const zIndex = parseInt(window.getComputedStyle(otherModal).zIndex) || 9000;
            if (zIndex > maxZIndex) maxZIndex = zIndex;
        }
    });
    
    // 현재 모달을 최상위로 설정
    modal.style.zIndex = maxZIndex + 1;
}

function bringPostModalToFront(modalId) {
    bringAnyModalToFront(modalId);
}

function bringFolderModalToFront(modalId) {
    bringAnyModalToFront(modalId);
}

function bringModalToFront(modalId) {
    bringAnyModalToFront(modalId);
}
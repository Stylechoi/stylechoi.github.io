// Dock magnification effect (macOS style)
const dockIcons = document.querySelectorAll('.dock-item .icon img');
const dockItems = document.querySelectorAll('.dock-item');

const resetIcons = () => {
    dockItems.forEach((item) => {
        item.style.transform = "scale(1)";
        item.style.margin = "0 2px";
    });
};

dockItems.forEach((item, index) => {
    item.addEventListener("mouseover", () => {
        resetIcons();
        
        // Calculate magnification based on position
        const centerIndex = index;
        const maxScale = 1.5;
        const maxMargin = 15;
        
        // Apply magnification to surrounding items
        for (let i = -2; i <= 2; i++) {
            const targetIndex = centerIndex + i;
            if (dockItems[targetIndex]) {
                const distance = Math.abs(i);
                const scale = maxScale - (distance * 0.2);
                const margin = maxMargin - (distance * 3);
                
                dockItems[targetIndex].style.transform = `scale(${scale})`;
                dockItems[targetIndex].style.margin = `0 ${margin}px`;
            }
        }
    });
    
    item.addEventListener("mouseleave", resetIcons);
});

// Boot screen and desktop transition
document.addEventListener('DOMContentLoaded', () => {
    const bootScreen = document.getElementById('bootScreen');
    const desktop = document.getElementById('desktop');
    const progressBar = document.querySelector('.progress-bar');

    // Show desktop when progress bar animation completes
    progressBar.addEventListener('animationend', () => {
        // Hide boot screen
        bootScreen.classList.add('hidden');
        
        // Show desktop after a short delay
        setTimeout(() => {
            desktop.classList.add('visible');
        }, 100);
    });

    // Update current time and date
    const updateDateTime = () => {
        const now = new Date();
        const days = ['일', '월', '화', '수', '목', '금', '토'];
        const month = now.getMonth() + 1;
        const date = now.getDate();
        const day = days[now.getDay()];
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        
        const dateTimeString = `${month}월 ${date}일 (${day}) ${hours}:${minutes}`;
        document.getElementById('currentTime').textContent = dateTimeString;
    };

    // Update time immediately and then every second
    updateDateTime();
    setInterval(updateDateTime, 1000);
});

// Modal functions
function openFolder(folderType) {
    const modal = document.getElementById(`${folderType}Modal`);
    modal.classList.add('active');
}

function closeModal(modalId) {
    const modal = document.getElementById(modalId);
    modal.classList.remove('active');
}

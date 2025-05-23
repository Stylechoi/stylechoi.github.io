

// Dock magnification effect (like Renovamen's)
const dockIcons = document.querySelectorAll('.dock-item .icon img');

const resetIcons = () => {
    dockIcons.forEach((item) => {
        item.style.transform = "scale(1) translateY(0px)";
    });
};

dockIcons.forEach((item, index) => {
    const dockItem = item.closest('.dock-item');
    
    dockItem.addEventListener("mouseover", () => focus(index));
    dockItem.addEventListener("mouseleave", resetIcons);
});

const focus = (index) => {
    resetIcons();
    
    const transformations = [
        { idx: index - 2, scale: 1.1, translateY: 0 },
        { idx: index - 1, scale: 1.2, translateY: -6 },
        { idx: index, scale: 1.5, translateY: -10 },
        { idx: index + 1, scale: 1.2, translateY: -6 },
        { idx: index + 2, scale: 1.1, translateY: 0 }
    ];
    
    transformations.forEach(({ idx, scale, translateY }) => {
        if (dockIcons[idx]) {
            dockIcons[idx].style.transform = `scale(${scale}) translateY(${translateY}px)`;
        }
    });
};

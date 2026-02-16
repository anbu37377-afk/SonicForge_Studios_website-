/* Dashboard Scripts */

document.addEventListener("DOMContentLoaded", () => {

    // Sidebar Toggle
    const sidebarToggle = document.getElementById("sidebar-toggle");
    const layout = document.querySelector(".dashboard-layout");

    if (sidebarToggle && layout) {
        sidebarToggle.addEventListener("click", (e) => {
            e.preventDefault();
            layout.classList.toggle("toggled");
        });
    }

    // Close sidebar when clicking outside on mobile
    document.addEventListener("click", (e) => {
        if (window.innerWidth < 992) {
            if (!layout.contains(e.target) && !sidebarToggle.contains(e.target) && layout.classList.contains("toggled")) {
                // This logic is tricky because layout wraps everything. 
                // Better: check if click is on the overlay (if we had one) or just close button.
                // For now, let's just rely on the toggle button.
            }
        }
    });

    // Simulate Chart Data (Simple CSS height manipulation)
    const bars = document.querySelectorAll(".chart-bar");
    if (bars.length > 0) {
        bars.forEach(bar => {
            const height = Math.floor(Math.random() * 80) + 20; // 20% to 100%
            setTimeout(() => {
                bar.style.height = `${height}%`;
            }, 500);
        });
    }

    // Notification simulation
    const bell = document.querySelector(".bi-bell");
    if (bell) {
        bell.parentElement.addEventListener("click", () => {
            alert("No new notifications");
        });
    }
});

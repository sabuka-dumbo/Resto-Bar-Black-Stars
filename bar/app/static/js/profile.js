/*
document.addEventListener('DOMContentLoaded', () => {
    const navButtons = document.querySelectorAll('.nav-btn');
    const tabs = document.querySelectorAll('.portal-tab');

    navButtons.forEach(btn => {
        btn.addEventListener('click', () => {
            navButtons.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');

            const targetId = btn.getAttribute('data-tab');

            tabs.forEach(tab => {
                tab.classList.remove('active');
            });

            const targetTab = document.getElementById(targetId);
            if (targetTab) {
                targetTab.classList.add('active');
            }
        });
    });

    const dietPills = document.querySelectorAll('.diet-pill');
    dietPills.forEach(pill => {
        pill.addEventListener('click', () => {
            pill.classList.toggle('active');
        });
    });
});
*/


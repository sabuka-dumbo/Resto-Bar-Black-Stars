document.addEventListener('DOMContentLoaded', () => {
    const navTabs = document.querySelectorAll('.nav-tab:not(.signout-div)');
    const contentSections = document.querySelectorAll('.settings-content');
    const addCardBtn = document.querySelector('.add-card-btn');
    const reviewBtns = document.querySelectorAll('.btn-review, .btn-primary-small');

    navTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            navTabs.forEach(t => t.classList.remove('active'));
            
            tab.classList.add('active');

            contentSections.forEach(section => {
                section.style.display = 'none';
            });

            if (contentSections[index]) {
                contentSections[index].style.display = 'block';
            }
        });
    });

    const addCardModal = document.getElementById('addCardModal');
    if (addCardBtn && addCardModal) {
        addCardBtn.addEventListener('click', () => {
            addCardModal.style.display = 'flex';
        });
    }

    const reviewModal = document.getElementById('reviewModal');
    reviewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (reviewModal) {
                reviewModal.style.display = 'flex';
            }
        });
    });

    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal-overlay')) {
            event.target.style.display = 'none';
        }
    });
});
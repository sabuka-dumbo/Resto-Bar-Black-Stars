document.addEventListener('DOMContentLoaded', () => {
    const navTabs = document.querySelectorAll('.nav-tab:not(.signout-div)');
    const contentSections = document.querySelectorAll('.settings-content');
    const addCardBtn = document.querySelector('.add-card-btn');
    const reviewBtns = document.querySelectorAll('.btn-review, .btn-primary-small');

    /**
     * Tab Switching Logic
     */
    navTabs.forEach((tab, index) => {
        tab.addEventListener('click', () => {
            // 1. Remove active class from all tabs
            navTabs.forEach(t => t.classList.remove('active'));
            
            // 2. Add active class to clicked tab
            tab.classList.add('active');

            // 3. Hide all content sections
            contentSections.forEach(section => {
                section.style.display = 'none';
            });

            // 4. Show the section corresponding to the tab index
            if (contentSections[index]) {
                contentSections[index].style.display = 'block';
            }
        });
    });

    /**
     * Modal Logic: Add Payment Method
     */
    const addCardModal = document.getElementById('addCardModal');
    if (addCardBtn && addCardModal) {
        addCardBtn.addEventListener('click', () => {
            addCardModal.style.display = 'flex'; // Using flex to center modal
        });
    }

    /**
     * Modal Logic: Review Agreements
     */
    const reviewModal = document.getElementById('reviewModal');
    reviewBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            if (reviewModal) {
                reviewModal.style.display = 'flex';
            }
        });
    });

    /**
     * Close Modals on Outside Click
     */
    window.addEventListener('click', (event) => {
        if (event.target.classList.contains('modal-overlay')) {
            event.target.style.display = 'none';
        }
    });
});
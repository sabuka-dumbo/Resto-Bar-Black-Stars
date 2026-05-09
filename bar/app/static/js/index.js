document.addEventListener('DOMContentLoaded', () => {
            let total = 0;
            let selectedItems = new Set();
            
            const selectButtons = document.querySelectorAll('.btn-select');
            const cartTotalEl = document.getElementById('cartTotal');
            const cartCountEl = document.getElementById('cartCount');
            const stickyCart = document.getElementById('stickyCart');
            const btnClear = document.getElementById('btnClear');
            const btnAddToCart = document.getElementById('btnAddToCart');
            const dateCards = document.querySelectorAll('.date-card');

            // Handle Date Selection
            dateCards.forEach(card => {
                card.addEventListener('click', () => {
                    document.querySelector('.date-card.active').classList.remove('active');
                    card.classList.add('active');
                });
            });

            // Handle Item Selection
            selectButtons.forEach(button => {
                button.addEventListener('click', function() {
                    const card = this.closest('.card');
                    const price = parseInt(card.dataset.price);
                    const itemId = card.dataset.id;
                    const isSelected = this.classList.contains('selected');

                    if (!isSelected) {
                        // Add item
                        this.classList.add('selected');
                        this.textContent = 'Selected ✓';
                        total += price;
                        selectedItems.add(itemId);
                    } else {
                        // Remove item
                        this.classList.remove('selected');
                        this.textContent = 'Select';
                        total -= price;
                        selectedItems.delete(itemId);
                    }
                    
                    updateCartUI();
                });
            });

            // Update Cart Display
            function updateCartUI() {
                cartTotalEl.textContent = `${total} MDL`;
                cartCountEl.textContent = `/ ${selectedItems.size} Item${selectedItems.size !== 1 ? 's' : ''} Selected`;
                
                // Show/hide sticky cart based on items selected
                if (selectedItems.size > 0) {
                    stickyCart.classList.add('visible');
                } else {
                    stickyCart.classList.remove('visible');
                }
            }

            // Clear Choices Button
            btnClear.addEventListener('click', () => {
                // Reset all buttons
                selectButtons.forEach(btn => {
                    btn.classList.remove('selected');
                    btn.textContent = 'Select';
                });
                
                // Reset State
                total = 0;
                selectedItems.clear();
                updateCartUI();
            });

            // Add to Cart Button (Demo Alert)
            btnAddToCart.addEventListener('click', () => {
                if(selectedItems.size > 0) {
                    alert(`Successfully added ${selectedItems.size} item(s) to your cart!\nTotal: ${total} MDL`);
                }
            });
        });
document.addEventListener('DOMContentLoaded', () => {
    // State management
    const state = {
        protein: null, // Holds one object
        garnishes: [], // Holds up to two objects
        drinks: [],     // Holds drink objects (optional)
        totalPrice: 0,
        totalKcal: 0,
        totalWeight: 0
    };

    // DOM Elements
    const cards = document.querySelectorAll('.food-card');
    const slotProtein = document.getElementById('slot-protein');
    const slotGarnish1 = document.getElementById('slot-garnish-1');
    const slotGarnish2 = document.getElementById('slot-garnish-2');
    const slotDrink = document.getElementById('slot-drink');
    const floatingTotal = document.getElementById('floatingTotal');
    const receiptList = document.getElementById('receiptList');
    const elTotalKcal = document.getElementById('totalKcal');
    const elTotalWeight = document.getElementById('totalWeight');
    const btnCheckout = document.getElementById('btnCheckout');

    // Attach click listeners
    cards.forEach(card => {
        card.addEventListener('click', () => handleCardClick(card));
    });

    function handleCardClick(card) {
        const category = card.dataset.category;
        const itemData = {
            id: card.dataset.id,
            name: card.dataset.name,
            price: parseFloat(card.dataset.price),
            kcal: parseInt(card.dataset.kcal),
            weight: parseInt(card.dataset.weight),
            img: card.dataset.img
        };

        const isSelected = card.classList.contains('selected');

        if (category === 'protein') {
            // Deselect other proteins
            document.querySelectorAll('.food-card[data-category="protein"]').forEach(c => c.classList.remove('selected'));
            
            if (isSelected) {
                state.protein = null; // Toggle off
            } else {
                card.classList.add('selected');
                state.protein = itemData;
            }
        } 
        else if (category === 'garnish') {
            if (isSelected) {
                card.classList.remove('selected');
                state.garnishes = state.garnishes.filter(g => g.id !== itemData.id);
            } else {
                if (state.garnishes.length < 2) {
                    card.classList.add('selected');
                    state.garnishes.push(itemData);
                } else {
                    // Visual feedback for limit reached (shake effect)
                    card.style.transform = 'translateX(5px)';
                    setTimeout(() => card.style.transform = 'translateX(-5px)', 100);
                    setTimeout(() => card.style.transform = 'translateX(0)', 200);
                    return; // Do nothing else
                }
            }
        }
        else if (category === 'drink') {
            if (isSelected) {
                card.classList.remove('selected');
                state.drinks = state.drinks.filter(d => d.id !== itemData.id);
            } else {
                card.classList.add('selected');
                state.drinks.push(itemData);
            }
        }

        updateUI();
    }

    function updateUI() {
        // 1. Recalculate Totals
        state.totalPrice = 0;
        state.totalKcal = 0;
        state.totalWeight = 0;
        
        const allItems = [];
        if(state.protein) allItems.push(state.protein);
        state.garnishes.forEach(g => allItems.push(g));
        state.drinks.forEach(d => allItems.push(d));

        allItems.forEach(item => {
            state.totalPrice += item.price;
            state.totalKcal += item.kcal;
            state.totalWeight += item.weight;
        });

        // 2. Update Summary Metrics & Total
        floatingTotal.textContent = `$${state.totalPrice.toFixed(2)}`;
        elTotalKcal.textContent = `${state.totalKcal} kcal`;
        elTotalWeight.textContent = `${state.totalWeight}g`;

        // 3. Update Visual Slots
        updateSlot(slotProtein, state.protein);
        updateSlot(slotGarnish1, state.garnishes[0]);
        updateSlot(slotGarnish2, state.garnishes[1]);
        updateSlot(slotDrink, state.drinks[0]); // Just showing first drink visually in slot

        // 4. Update Receipt List
        receiptList.innerHTML = '';
        if (allItems.length === 0) {
            receiptList.innerHTML = '<div class="empty-receipt">Your box is empty. Select components to begin.</div>';
            btnCheckout.disabled = true;
        } else {
            allItems.forEach(item => {
                const row = document.createElement('div');
                row.className = 'receipt-item';
                const priceStr = item.price > 0 ? `$${item.price.toFixed(2)}` : 'Included';
                row.innerHTML = `<span>${item.name}</span><span class="item-price">${priceStr}</span>`;
                receiptList.appendChild(row);
            });
            // Enable button only if at least a protein is selected (business logic assumption)
            btnCheckout.disabled = !state.protein; 
        }
    }

    function updateSlot(slotElement, itemData) {
        if (!itemData) {
            slotElement.innerHTML = '+';
            slotElement.classList.add('empty-slot');
        } else {
            slotElement.innerHTML = `<img src="${itemData.img}" alt="${itemData.name}">`;
            slotElement.classList.remove('empty-slot');
        }
    }

    // Checkout Event
    btnCheckout.addEventListener('click', () => {
        alert(`Box Confirmed!\nTotal: $${state.totalPrice.toFixed(2)}\nCalories: ${state.totalKcal}kcal`);
    });

    // Initialize UI empty state
    updateUI();
});
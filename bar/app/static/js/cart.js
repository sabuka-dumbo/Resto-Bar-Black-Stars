function changeQty(btn, delta) {
    const display = btn.parentElement.querySelector('.qty-display');
    const card = btn.closest('.cart-item-card');
    const priceEl = card.querySelector('.item-total-price');
    const basePrice = parseFloat(card.dataset.basePrice);

    let currentQty = parseInt(display.innerText);
    let newQty = currentQty + delta;

    if (newQty >= 1) {
        display.innerText = newQty;
        priceEl.innerText = `$${(newQty * basePrice).toFixed(2)}`;
        calculateGrandTotal();
    }
}

function removeItem(btn) {
    const card = btn.closest('.cart-item-card');
    card.style.opacity = '0';
    card.style.transform = 'scale(0.95)';
    setTimeout(() => {
        card.remove();
        calculateGrandTotal();
    }, 300);
}

function calculateGrandTotal() {
    let subtotal = 0;
    document.querySelectorAll('.cart-item-card').forEach(card => {
        const qty = parseInt(card.querySelector('.qty-display').innerText);
        subtotal += qty * parseFloat(card.dataset.basePrice);
    });

    const tax = subtotal * 0.08;
    const total = subtotal + 15.00 + tax;

    document.getElementById('sub-val').innerText = `$${subtotal.toFixed(2)}`;
    document.getElementById('tax-val').innerText = `$${tax.toFixed(2)}`;
    document.getElementById('grand-val').innerText = `$${total.toFixed(2)}`;
}
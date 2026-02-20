
// Mock Services Data (Restored since original was missing)
const servicesData = [
    {
        id: 's1',
        name: 'Classic Haircut',
        category: 'Hair cutting',
        price: 499,
        originalPrice: 700,
        image: 'assets/featured_services/haircut.webp',
        rating: 4.8,
        reviews: 124,
        description: 'Professional haircut with styling and wash.'
    },
    {
        id: 's2',
        name: 'Diamond Facial',
        category: 'Facial',
        price: 1499,
        originalPrice: 2500,
        image: 'assets/featured_services/facial.webp',
        rating: 4.9,
        reviews: 89,
        description: 'Luxury diamond facial for glowing skin.'
    },
    {
        id: 's3',
        name: 'Party Makeup',
        category: 'Makeup & Styling',
        price: 2999,
        originalPrice: 4000,
        image: 'assets/featured_services/makeup.webp',
        rating: 4.9,
        reviews: 210,
        description: 'Glamorous makeup look for special occasions.'
    },
    {
        id: 's4',
        name: 'Gel Nail Extension',
        category: 'Nails & Beauty',
        price: 1299,
        originalPrice: 1800,
        image: 'assets/featured_services/nails.webp',
        rating: 4.7,
        reviews: 56,
        description: 'Long-lasting gel nail extensions with art.'
    },
    {
        id: 's5',
        name: 'Keratin Treatment',
        category: 'Hairs & Treatment',
        price: 3999,
        originalPrice: 6000,
        image: 'assets/featured_services/treatment.webp',
        rating: 4.8,
        reviews: 145,
        description: 'Smooth and shine hair treatment.'
    },
    {
        id: 's6',
        name: 'Fruit Clean Up',
        category: 'Clean up',
        price: 599,
        originalPrice: 999,
        image: 'assets/featured_services/cleanup.webp',
        rating: 4.6,
        reviews: 42,
        description: 'Refreshing fruit cleanup for all skin types.'
    }
];

function renderServices() {
    const grid = document.getElementById('servicesPageGrid');
    if (!grid) return;

    grid.innerHTML = servicesData.map(service => {
        const avifInfo = service.image.replace(/\.(png|jpg|jpeg|webp)$/i, '.avif');
        const webpInfo = service.image.replace(/\.(png|jpg|jpeg|webp)$/i, '.webp');

        return `
        <div class="service-page-card" data-category="${service.category}">
            <div class="service-page-card-image">
                <picture>
                    <source srcset="${avifInfo}" type="image/avif">
                    <source srcset="${webpInfo}" type="image/webp">
                    <img src="${service.image}" alt="${service.name}" loading="lazy" onerror="this.src='assets/logo.png'">
                </picture>
                <div class="service-page-card-overlay">
                    <span class="service-category-tag">${service.category}</span>
                </div>
            </div>
            <div class="service-page-card-content">
                <div class="service-header">
                    <h3 class="service-page-card-name">${service.name}</h3>
                    <div class="service-rating">
                        <span class="star">★</span>
                        <span>${service.rating}</span>
                        <span class="service-reviews">(${service.reviews})</span>
                    </div>
                </div>
                <p class="service-description">${service.description}</p>
                <div class="service-footer">
                    <div class="service-price-wrapper">
                        <span class="current-price">₹${service.price}</span>
                        <span class="original-price">₹${service.originalPrice}</span>
                    </div>
                    <button class="service-btn" onclick="openBookingModal('${service.name}')">Book Now</button>
                </div>
            </div>
        </div>
    `}).join('');

    // Update count
    const countEl = document.getElementById('servicesPageCount');
    if (countEl) countEl.textContent = `Showing ${servicesData.length} services`;
}

// Make globally available if needed
window.renderServices = renderServices;
window.servicesData = servicesData;

// Auto-initialize
document.addEventListener('DOMContentLoaded', () => {
    renderServices();
});

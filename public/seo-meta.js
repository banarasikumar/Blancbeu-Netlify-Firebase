// SEO & Meta Optimization
const SEOMeta = {
    init() {
        this.setupStructuredData();
        this.optimizeMetaTags();
        this.setupSocialMeta();
    },
    
    setupStructuredData() {
        const schema = {
            "@context": "https://schema.org",
            "@type": "BeautySalon",
            "name": "Beauty Family Salon",
            "image": "/luxury_salon_interior_design.png",
            "description": "Premium beauty salon with 50+ services: hair styling, facial treatments, makeup, nails, spa, and more",
            "url": window.location.href,
            "telephone": "+91-XXX-XXX-XXXX",
            "priceRange": "₹200-₹5999",
            "aggregateRating": {
                "@type": "AggregateRating",
                "ratingValue": "4.8",
                "reviewCount": "2500"
            }
        };
        const script = document.createElement('script');
        script.type = 'application/ld+json';
        script.textContent = JSON.stringify(schema);
        document.head.appendChild(script);
    },
    
    optimizeMetaTags() {
        const metas = {
            'theme-color': '#d4af37',
            'apple-mobile-web-app-capable': 'yes',
            'apple-mobile-web-app-status-bar-style': 'black-translucent',
            'format-detection': 'telephone=no'
        };
        
        Object.entries(metas).forEach(([name, content]) => {
            const meta = document.createElement('meta');
            meta.name = name;
            meta.content = content;
            document.head.appendChild(meta);
        });
    },
    
    setupSocialMeta() {
        const socialMetas = {
            'twitter:card': 'summary_large_image',
            'twitter:title': 'Beauty Family Salon - Premium Services',
            'twitter:description': 'Experience luxury beauty services worldwide. Hair, facial, makeup, nails, spa & more.',
            'twitter:image': '/luxury_salon_interior_design.png'
        };
        
        Object.entries(socialMetas).forEach(([property, content]) => {
            const meta = document.createElement('meta');
            meta.name = property;
            meta.content = content;
            document.head.appendChild(meta);
        });
        
        console.log('✨ SEO & Social Meta: OPTIMIZED');
    }
};

SEOMeta.init();

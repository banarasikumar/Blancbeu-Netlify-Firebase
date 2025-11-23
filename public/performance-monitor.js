// Real-time performance monitoring
const PerfMonitor = {
    metrics: {
        pageLoadTime: 0,
        renderTime: 0,
        interactionDelay: 0
    },
    
    start() {
        const start = performance.now();
        
        window.addEventListener('load', () => {
            this.metrics.pageLoadTime = performance.now() - start;
            console.log(`📊 Page Load: ${Math.round(this.metrics.pageLoadTime)}ms`);
        });
        
        // Monitor First Contentful Paint
        if ('PerformanceObserver' in window) {
            try {
                const observer = new PerformanceObserver((list) => {
                    for (const entry of list.getEntries()) {
                        if (entry.name === 'first-contentful-paint') {
                            console.log(`🎨 FCP: ${Math.round(entry.startTime)}ms`);
                        }
                    }
                });
                observer.observe({ entryTypes: ['paint', 'measure'] });
            } catch (e) {}
        }
    }
};

PerfMonitor.start();

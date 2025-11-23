// SMART NETWORK & DEVICE DETECTION

const SmartNetwork = {
    init() {
        this.detectConnection();
        this.detectDevice();
        this.setupNetworkListeners();
    },
    
    detectConnection() {
        if ('connection' in navigator) {
            const conn = navigator.connection;
            const type = conn.effectiveType || 'unknown';
            console.log(`📡 Network: ${type}`);
            
            if (type === '4g') {
                document.documentElement.setAttribute('data-network', 'fast');
                console.log('🚀 Fast network detected - loading optimized assets');
            } else if (type === '3g') {
                document.documentElement.setAttribute('data-network', 'medium');
                console.log('📊 Medium network detected - optimizing images');
            } else {
                document.documentElement.setAttribute('data-network', 'slow');
                console.log('🐢 Slow network detected - using lightweight assets');
            }
        }
    },
    
    detectDevice() {
        const ua = navigator.userAgent;
        const isMobile = /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(ua);
        const isTablet = /iPad|Android/.test(ua);
        
        if (isMobile) {
            document.documentElement.setAttribute('data-device', 'mobile');
            console.log('📱 Mobile device detected');
        } else if (isTablet) {
            document.documentElement.setAttribute('data-device', 'tablet');
            console.log('📋 Tablet device detected');
        } else {
            document.documentElement.setAttribute('data-device', 'desktop');
            console.log('💻 Desktop device detected');
        }
    },
    
    setupNetworkListeners() {
        if ('connection' in navigator) {
            navigator.connection.addEventListener('change', () => {
                this.detectConnection();
                console.log('🔄 Network changed - re-optimizing');
            });
        }
    }
};

SmartNetwork.init();

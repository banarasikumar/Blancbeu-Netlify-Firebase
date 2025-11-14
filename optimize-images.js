const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

const optimizationConfig = {
  banner: {
    maxWidth: 1080,
    maxHeight: 2400,
    quality: 85
  },
  service: {
    maxWidth: 800,
    maxHeight: 600,
    quality: 80
  },
  icon: {
    quality: 90
  },
  splash: {
    quality: 85
  }
};

async function optimizeImage(inputPath, outputPath, config) {
  try {
    const image = sharp(inputPath);
    const metadata = await image.metadata();
    
    let pipeline = image;
    
    if (config.maxWidth || config.maxHeight) {
      pipeline = pipeline.resize(config.maxWidth, config.maxHeight, {
        fit: 'inside',
        withoutEnlargement: true
      });
    }
    
    await pipeline
      .webp({ quality: config.quality })
      .toFile(outputPath);
    
    const originalSize = fs.statSync(inputPath).size;
    const newSize = fs.statSync(outputPath).size;
    const savings = ((originalSize - newSize) / originalSize * 100).toFixed(2);
    
    console.log(`✓ ${path.basename(inputPath)} -> ${path.basename(outputPath)}`);
    console.log(`  Original: ${(originalSize / 1024).toFixed(2)}KB -> New: ${(newSize / 1024).toFixed(2)}KB (${savings}% smaller)`);
    
    return { originalSize, newSize, savings };
  } catch (error) {
    console.error(`✗ Error optimizing ${inputPath}:`, error.message);
    return null;
  }
}

async function optimizeBannerImages() {
  console.log('\n📸 Optimizing banner carousel images...');
  const bannerDir = 'assets/banner_carousel_images';
  
  if (!fs.existsSync(bannerDir)) {
    console.log('Banner directory not found, skipping...');
    return;
  }
  
  const files = fs.readdirSync(bannerDir);
  for (const file of files) {
    if (file.match(/\.(webp|png|jpg|jpeg)$/i)) {
      const inputPath = path.join(bannerDir, file);
      const outputPath = path.join(bannerDir, file.replace(/\.(webp|png|jpg|jpeg)$/i, '.webp'));
      await optimizeImage(inputPath, outputPath, optimizationConfig.banner);
    }
  }
}

async function optimizeServiceImages() {
  console.log('\n🖼️  Optimizing service images...');
  const serviceDir = 'attached_assets/stock_images';
  const outputDir = 'assets/service_images';
  
  if (!fs.existsSync(serviceDir)) {
    console.log('Service images directory not found, skipping...');
    return;
  }
  
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const files = fs.readdirSync(serviceDir);
  for (const file of files) {
    if (file.match(/\.(jpg|jpeg|png|webp)$/i)) {
      const inputPath = path.join(serviceDir, file);
      const outputPath = path.join(outputDir, file.replace(/\.(jpg|jpeg|png)$/i, '.webp'));
      await optimizeImage(inputPath, outputPath, optimizationConfig.service);
    }
  }
}

async function optimizeIcons() {
  console.log('\n🎯 Optimizing app icons...');
  const icons = [
    { input: 'icon-72x72.png', output: 'icon-72x72.webp', size: 72 },
    { input: 'icon-96x96.png', output: 'icon-96x96.webp', size: 96 },
    { input: 'icon-144x144.png', output: 'icon-144x144.webp', size: 144 },
    { input: 'icon-192x192.png', output: 'icon-192x192.webp', size: 192 },
    { input: 'icon-512x512.png', output: 'icon-512x512.webp', size: 512 }
  ];
  
  for (const icon of icons) {
    if (fs.existsSync(icon.input)) {
      await optimizeImage(icon.input, icon.output, {
        ...optimizationConfig.icon,
        maxWidth: icon.size,
        maxHeight: icon.size
      });
    }
  }
}

async function optimizeBrandLogo() {
  console.log('\n🏷️  Optimizing brand logo...');
  const logoPath = 'assets/homepage_brand_logo.png';
  
  if (fs.existsSync(logoPath)) {
    await optimizeImage(logoPath, 'assets/homepage_brand_logo.webp', {
      maxWidth: 500,
      maxHeight: 500,
      quality: 90
    });
  }
  
  const brandIconPath = 'assets/brand_icon_optimized.png';
  if (fs.existsSync(brandIconPath)) {
    await optimizeImage(brandIconPath, 'assets/brand_icon_optimized.webp', {
      maxWidth: 500,
      maxHeight: 500,
      quality: 90
    });
  }
}

async function optimizeSplashScreens() {
  console.log('\n🌟 Optimizing splash screens...');
  const splashScreens = [
    { input: 'splash-750x1334.png', output: 'splash-750x1334.webp', width: 750, height: 1334 },
    { input: 'splash-1170x2532.png', output: 'splash-1170x2532.webp', width: 1170, height: 2532 }
  ];
  
  for (const splash of splashScreens) {
    if (fs.existsSync(splash.input)) {
      await optimizeImage(splash.input, splash.output, {
        maxWidth: splash.width,
        maxHeight: splash.height,
        quality: optimizationConfig.splash.quality
      });
    }
  }
  
  const appSplash = 'attached_assets/assets/app_splash_screen.png';
  if (fs.existsSync(appSplash)) {
    await optimizeImage(appSplash, 'assets/app_splash_screen.webp', {
      maxWidth: 1080,
      maxHeight: 2400,
      quality: optimizationConfig.splash.quality
    });
  }
}

async function optimizeOriginalBannerAssets() {
  console.log('\n📦 Optimizing original banner assets...');
  const bannerAssetsDir = 'attached_assets/assets/banner assets';
  
  if (!fs.existsSync(bannerAssetsDir)) {
    console.log('Original banner assets directory not found, skipping...');
    return;
  }
  
  const outputDir = 'assets/banner_carousel_images';
  if (!fs.existsSync(outputDir)) {
    fs.mkdirSync(outputDir, { recursive: true });
  }
  
  const files = fs.readdirSync(bannerAssetsDir);
  for (const file of files) {
    if (file.match(/\.(png|jpg|jpeg)$/i)) {
      const inputPath = path.join(bannerAssetsDir, file);
      const outputPath = path.join(outputDir, file.replace(/\.(png|jpg|jpeg)$/i, '.webp'));
      await optimizeImage(inputPath, outputPath, optimizationConfig.banner);
    }
  }
}

async function main() {
  console.log('🚀 Starting image optimization for 1080x2400px screens...\n');
  console.log('This will convert all images to WebP format and optimize their size.\n');
  
  const startTime = Date.now();
  
  await optimizeBannerImages();
  await optimizeServiceImages();
  await optimizeIcons();
  await optimizeBrandLogo();
  await optimizeSplashScreens();
  await optimizeOriginalBannerAssets();
  
  const endTime = Date.now();
  const duration = ((endTime - startTime) / 1000).toFixed(2);
  
  console.log(`\n✅ Optimization complete in ${duration} seconds!`);
  console.log('\n📝 Next steps:');
  console.log('   1. Update script.js to use optimized service images');
  console.log('   2. Update manifest.json to use optimized icons');
  console.log('   3. Update sw.js to cache optimized images');
  console.log('   4. Add lazy loading to improve performance\n');
}

main().catch(console.error);

const sharp = require('sharp');
const fs = require('fs');
const path = require('path');

// Configuration
const CONFIG = {
    inputDirs: ['public/assets', 'public/attached_assets'],
    extensions: ['.png', '.jpg', '.jpeg', '.webp'],
    avif: { quality: 50, effort: 6 },
    webp: { quality: 60 },
    mobileWidth: 600,
    backupDir: 'backup_assets',
    // Files to scan for asset usage
    scanFiles: [
        'index.html',
        'services-mock.js',
        'script.js',
        'styles.css',
        'theme-variables.css',
        'auth.js',
        'notifications.js',
        'parallax.js'
    ]
};

// Helper: Recursively get all files in a directory
async function getFiles(dir) {
    const subdirs = fs.readdirSync(dir);
    const files = await Promise.all(subdirs.map(async (subdir) => {
        const res = path.resolve(dir, subdir);
        return (fs.statSync(res).isDirectory()) ? getFiles(res) : res;
    }));
    return files.reduce((a, f) => a.concat(f), []);
}

// Helper: Scan codebase for used assets
function getUsedAssets() {
    console.log('🔍 Scanning specific files for image usage...');
    const usedAssets = new Set();

    // Add known static assets that might not be explicitly referenced but needed
    usedAssets.add('assets/brand_icon_optimized.png');
    usedAssets.add('assets/brand_icon_optimized.webp');
    usedAssets.add('assets/brand_icon_optimized.avif');

    CONFIG.scanFiles.forEach(file => {
        const filePath = path.resolve(__dirname, file);
        if (fs.existsSync(filePath)) {
            const content = fs.readFileSync(filePath, 'utf-8');
            // Regex to find paths like "assets/...", "attached_assets/...", 'assets/...', etc.
            // Matches: assets/filename.ext or attached_assets/filename.ext
            // We only care about the filename stem really, but let's try to match full relative path
            const simplePattern = /(?:assets|attached_assets)\/[a-zA-Z0-9_\-\.\/ %]+/g;
            const matches = content.match(simplePattern);

            if (matches) {
                matches.forEach(match => {
                    // Clean up potential trailing quotes or parens if regex was too greedy (simple scan)
                    const cleanMatch = match.split(/['"()]/)[0];
                    if (cleanMatch) usedAssets.add(cleanMatch);
                });
            }
        } else {
            console.warn(`⚠️ Scan file not found: ${file}`);
        }
    });

    console.log(`📝 Found ${usedAssets.size} potentially used asset references.`);
    return usedAssets;
}

async function optimizeImages() {
    console.log('🚀 Starting image optimization & backup...');

    // Create backup directory if it doesn't exist
    const backupRoot = path.resolve(__dirname, CONFIG.backupDir);
    if (!fs.existsSync(backupRoot)) {
        fs.mkdirSync(backupRoot, { recursive: true });
    }

    // Get active assets
    const usedAssets = getUsedAssets();

    let fileCount = 0;
    let skippedCount = 0;

    for (const dir of CONFIG.inputDirs) {
        const fullDirPath = path.resolve(__dirname, dir);
        if (!fs.existsSync(fullDirPath)) {
            console.warn(`⚠️ Directory not found: ${dir}`);
            continue;
        }

        const allFiles = await getFiles(fullDirPath);

        for (const file of allFiles) {
            try {
                const ext = path.extname(file).toLowerCase();
                if (!CONFIG.extensions.includes(ext)) continue;

                const dirName = path.dirname(file);
                // Relative path from 'public', e.g., 'assets/foo.png'
                // __dirname is root. file is root/public/assets/foo.png
                // relative from root/public -> assets/foo.png
                const relativeFromPublic = path.relative(path.join(__dirname, 'public'), file).replace(/\\/g, '/');

                // Check if this file (or its base name) is in usedAssets
                // We typically reference 'assets/foo.png' or 'assets/foo.webp'
                // If we found 'assets/foo.png' in usage, we optimize 'assets/foo.png'.
                // If we found 'assets/foo.webp' in usage (from our migration!), we trace back to source?
                // Migration changed strict refs to webp. So usedAssets will contain 'assets/foo.webp'.
                // We have 'assets/foo.png' on disk. 
                // We need to check if 'assets/foo' matches any used asset base.

                const baseName = path.basename(file, ext); // foo
                // Construct potential match keys
                const webpRef = relativeFromPublic.replace(ext, '.webp');
                const avifRef = relativeFromPublic.replace(ext, '.avif');
                const originalRef = relativeFromPublic; // assets/foo.png

                const isUsed = usedAssets.has(originalRef) || usedAssets.has(webpRef) || usedAssets.has(avifRef);

                if (!isUsed) {
                    // console.log(`⏭️ Skipping unused: ${relativeFromPublic}`);
                    skippedCount++;
                    continue;
                }

                // Optimization Logic
                const avifPath = path.join(dirName, `${baseName}.avif`);
                const webpPath = path.join(dirName, `${baseName}.webp`);
                const mobileAvifPath = path.join(dirName, `${baseName}-mobile.avif`);

                let generated = false;

                // 1. Generate AVIF if missing
                if (!fs.existsSync(avifPath)) {
                    await sharp(file).avif(CONFIG.avif).toFile(avifPath);
                    console.log(`✅ Generated AVIF: ${path.relative(__dirname, avifPath)}`);
                    generated = true;
                }

                // 2. Generate WebP if missing (Fallback)
                if (!fs.existsSync(webpPath)) {
                    await sharp(file).webp(CONFIG.webp).toFile(webpPath);
                    console.log(`✅ Generated WebP: ${path.relative(__dirname, webpPath)}`);
                    generated = true;
                }

                // 3. Generate Mobile Variant if needed (and used?)
                // If base is used, mobile variant might be implicitly used by picture tags we create?
                // Our picture tag logic adds -mobile.avif if it exists? 
                // Actually our plan said "Create Mobile version".
                // If the main image is used, we assume mobile variant is desirable.
                const metadata = await sharp(file).metadata();
                if (metadata.width > CONFIG.mobileWidth) {
                    if (!fs.existsSync(mobileAvifPath)) {
                        await sharp(file)
                            .resize(CONFIG.mobileWidth)
                            .avif(CONFIG.avif)
                            .toFile(mobileAvifPath);
                        console.log(`📱 Generated Mobile AVIF: ${path.relative(__dirname, mobileAvifPath)}`);
                        generated = true;
                    }
                }

                // 4. Move Original to Backup
                const relativeDir = path.relative(__dirname, dirName);
                const targetBackupDir = path.join(backupRoot, relativeDir);
                if (!fs.existsSync(targetBackupDir)) fs.mkdirSync(targetBackupDir, { recursive: true });
                const targetBackupFile = path.join(targetBackupDir, path.basename(file));

                fs.renameSync(file, targetBackupFile);
                console.log(`📦 Moved to Backup: ${path.relative(__dirname, targetBackupFile)}`);

                fileCount++;

            } catch (err) {
                console.error(`❌ Error processing ${path.relative(__dirname, file)}:`, err);
            }
        }
    }

    console.log(`✨ Optimization & Backup complete! Processed ${fileCount} active images. Skipped ${skippedCount} unused.`);
}

optimizeImages();

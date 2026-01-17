const fs = require('fs');
const path = require('path');

const mappings = [
    { src: 'uploaded_image_0_1768667435235.png', dest: 'day01-digital-sunset.png' },
    { src: 'uploaded_image_1_1768667435235.png', dest: 'day02-mindful-tea.png' },
    { src: 'uploaded_image_2_1768667435235.png', dest: 'day03-phone-free-morning.png' },
    { src: 'uploaded_image_3_1768667435235.png', dest: 'day04-stretch-break.png' },
    { src: 'uploaded_image_4_1768667435235.png', dest: 'day05-mindful-walking.png' },
    { src: 'uploaded_image_0_1768667688146.png', dest: 'day06-quiet-moment.png' },
    { src: 'uploaded_image_1_1768667688146.png', dest: 'day07-nature-pause.png' },
    { src: 'uploaded_image_2_1768667688146.png', dest: 'day08-slow-task.png' },
    { src: 'uploaded_image_3_1768667688146.png', dest: 'day09-gratitude-list.png' },
    { src: 'uploaded_image_4_1768667688146.png', dest: 'day10-weekly-review.png' }
];

const sourceDir = 'C:/Users/rishi/.gemini/antigravity/brain/982ad70a-8bf6-472e-9fbd-b6906e71c38f';
const destDir = 'c:/Users/rishi/Desktop/mindful-architecture/public/assets/images/tasks';

// Ensure dest dir exists (redundant but safe)
if (!fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true });
}

mappings.forEach(file => {
    const sourcePath = path.join(sourceDir, file.src);
    const destPath = path.join(destDir, file.dest);

    try {
        fs.copyFileSync(sourcePath, destPath);
        console.log(`✅ Copied ${file.dest}`);
    } catch (err) {
        console.error(`❌ Failed to copy ${file.dest}:`, err.message);
    }
});

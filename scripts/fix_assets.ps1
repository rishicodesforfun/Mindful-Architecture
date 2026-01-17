$source = "C:\Users\rishi\.gemini\antigravity\brain\982ad70a-8bf6-472e-9fbd-b6906e71c38f"
$dest = "c:\Users\rishi\Desktop\mindful-architecture\public\assets\images\tasks"

New-Item -ItemType Directory -Force -Path $dest | Out-Null

Copy-Item -Path "$source\uploaded_image_0_1768667435235.png" -Destination "$dest\day01-digital-sunset.png" -Force
Copy-Item -Path "$source\uploaded_image_1_1768667435235.png" -Destination "$dest\day02-mindful-tea.png" -Force
Copy-Item -Path "$source\uploaded_image_2_1768667435235.png" -Destination "$dest\day03-phone-free-morning.png" -Force
Copy-Item -Path "$source\uploaded_image_3_1768667435235.png" -Destination "$dest\day04-stretch-break.png" -Force
Copy-Item -Path "$source\uploaded_image_4_1768667435235.png" -Destination "$dest\day05-mindful-walking.png" -Force
Copy-Item -Path "$source\uploaded_image_0_1768667688146.png" -Destination "$dest\day06-quiet-moment.png" -Force
Copy-Item -Path "$source\uploaded_image_1_1768667688146.png" -Destination "$dest\day07-nature-pause.png" -Force
Copy-Item -Path "$source\uploaded_image_2_1768667688146.png" -Destination "$dest\day08-slow-task.png" -Force
Copy-Item -Path "$source\uploaded_image_3_1768667688146.png" -Destination "$dest\day09-gratitude-list.png" -Force
Copy-Item -Path "$source\uploaded_image_4_1768667688146.png" -Destination "$dest\day10-weekly-review.png" -Force

Write-Host "✅ All 10 images moved successfully!"

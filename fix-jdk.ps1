# Reemplaza JavaVersion.VERSION_21 por JavaVersion.VERSION_17 en los archivos necesarios

(Get-Content -Path "android/app/capacitor.build.gradle") -replace "JavaVersion.VERSION_21", "JavaVersion.VERSION_17" | Set-Content -Path "android/app/capacitor.build.gradle"

(Get-Content -Path "android/capacitor-cordova-android-plugins/build.gradle") -replace "JavaVersion.VERSION_21", "JavaVersion.VERSION_17" | Set-Content -Path "android/capacitor-cordova-android-plugins/build.gradle"

Write-Output "✅ Archivos actualizados a Java 17."

Add-Type -AssemblyName System.Drawing

$root = $PSScriptRoot
if (-not $root) { $root = Get-Location }
$projectDir = Resolve-Path (Join-Path $root "..")

$logoFile = Join-Path $projectDir "assests/main logo.png"
$logoNoBgFile = Join-Path $projectDir "assests/main logo no bg.png"
$resDir = Join-Path $projectDir "android/app/src/main/res"

if (-not (Test-Path $logoFile) -or -not (Test-Path $logoNoBgFile)) {
    Write-Error "Logo files not found in assests directory."
    exit 1
}

$imgFull = [System.Drawing.Bitmap]::FromFile($logoFile)
$imgNoBg = [System.Drawing.Bitmap]::FromFile($logoNoBgFile)

function Create-Resized-Bitmap {
    param(
        [System.Drawing.Bitmap]$sourceImg,
        [int]$width,
        [int]$height,
        [double]$scaleFactor = 1.0,
        [bool]$makeCircular = $false,
        [System.Drawing.Color]$bgColor = [System.Drawing.Color]::Transparent
    )

    $bmp = New-Object System.Drawing.Bitmap($width, $height, [System.Drawing.Imaging.PixelFormat]::Format32bppArgb)
    $g = [System.Drawing.Graphics]::FromImage($bmp)
    
    $g.InterpolationMode = [System.Drawing.Drawing2D.InterpolationMode]::HighQualityBicubic
    $g.SmoothingMode = [System.Drawing.Drawing2D.SmoothingMode]::HighQuality
    $g.PixelOffsetMode = [System.Drawing.Drawing2D.PixelOffsetMode]::HighQuality
    $g.CompositingQuality = [System.Drawing.Drawing2D.CompositingQuality]::HighQuality

    if ($bgColor.A -gt 0) {
        $g.Clear($bgColor)
    } else {
        $g.Clear([System.Drawing.Color]::Transparent)
    }

    if ($makeCircular) {
        $path = New-Object System.Drawing.Drawing2D.GraphicsPath
        $path.AddEllipse(0, 0, $width, $height)
        $g.SetClip($path)
    }

    $targetW = [int]($width * $scaleFactor)
    $targetH = [int]($height * $scaleFactor)
    $offsetX = [int](($width - $targetW) / 2)
    $offsetY = [int](($height - $targetH) / 2)

    $g.DrawImage($sourceImg, $offsetX, $offsetY, $targetW, $targetH)
    $g.Dispose()

    return $bmp
}

$densities = @(
    @{ Name = "mipmap-mdpi";    LauncherSize = 48;  ForegroundSize = 108 },
    @{ Name = "mipmap-hdpi";    LauncherSize = 72;  ForegroundSize = 162 },
    @{ Name = "mipmap-xhdpi";   LauncherSize = 96;  ForegroundSize = 216 },
    @{ Name = "mipmap-xxhdpi";  LauncherSize = 144; ForegroundSize = 324 },
    @{ Name = "mipmap-xxxhdpi"; LauncherSize = 192; ForegroundSize = 432 }
)

foreach ($d in $densities) {
    $targetFolder = Join-Path $resDir $d.Name
    if (-not (Test-Path $targetFolder)) {
        New-Item -ItemType Directory -Path $targetFolder -Force | Out-Null
    }

    # 1. Legacy Launcher Icon (ic_launcher.png)
    $icLauncher = Create-Resized-Bitmap -sourceImg $imgFull -width $d.LauncherSize -height $d.LauncherSize -scaleFactor 1.0
    $icLauncherPath = Join-Path $targetFolder "ic_launcher.png"
    $icLauncher.Save($icLauncherPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $icLauncher.Dispose()

    # 2. Legacy Round Launcher Icon (ic_launcher_round.png)
    $icRound = Create-Resized-Bitmap -sourceImg $imgFull -width $d.LauncherSize -height $d.LauncherSize -scaleFactor 1.0 -makeCircular $true
    $icRoundPath = Join-Path $targetFolder "ic_launcher_round.png"
    $icRound.Save($icRoundPath, [System.Drawing.Imaging.ImageFormat]::Png)
    $icRound.Dispose()

    # 3. Adaptive Foreground Icon (ic_launcher_foreground.png) - 66.6% safe zone scale
    $icFore = Create-Resized-Bitmap -sourceImg $imgNoBg -width $d.ForegroundSize -height $d.ForegroundSize -scaleFactor 0.666
    $icForePath = Join-Path $targetFolder "ic_launcher_foreground.png"
    $icFore.Save($icForePath, [System.Drawing.Imaging.ImageFormat]::Png)
    $icFore.Dispose()

    Write-Host "Generated icons for $($d.Name)"
}

$imgFull.Dispose()
$imgNoBg.Dispose()

Write-Host "All Android icons generated successfully!"

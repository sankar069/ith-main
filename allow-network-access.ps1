# PowerShell script to allow network access for Node.js/Vercel Dev
# Run this as Administrator

Write-Host "🔥 Adding Windows Firewall Rules for InnoTech Hub..." -ForegroundColor Cyan
Write-Host ""

# Add rule for port 3000 (Vercel Dev)
try {
    New-NetFirewallRule -DisplayName "InnoTech Hub - Vercel Dev" `
        -Direction Inbound `
        -Action Allow `
        -Protocol TCP `
        -LocalPort 3000 `
        -Program "C:\Program Files\nodejs\node.exe" `
        -Enabled True `
        -Profile Private,Domain `
        -Description "Allow InnoTech Hub access on local network"
    
    Write-Host "✅ Firewall rule added successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Port 3000 is now accessible from other devices." -ForegroundColor Green
    Write-Host ""
    Write-Host "📱 Try accessing from your device again:" -ForegroundColor Yellow
    Write-Host "   http://10.24.10.99:3000" -ForegroundColor Cyan
    Write-Host ""
}
catch {
    Write-Host "❌ Error: $($_.Exception.Message)" -ForegroundColor Red
    Write-Host ""
    Write-Host "💡 Make sure you're running PowerShell as Administrator" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Alternative: Disable Windows Firewall temporarily:" -ForegroundColor Yellow
    Write-Host "   1. Open Windows Security" -ForegroundColor White
    Write-Host "   2. Go to Firewall & Network Protection" -ForegroundColor White
    Write-Host "   3. Turn off firewall for Private network" -ForegroundColor White
    Write-Host ""
}

Write-Host "Press any key to continue..."
$null = $Host.UI.RawUI.ReadKey("NoEcho,IncludeKeyDown")

param (
  [Parameter(Position = 0)]
  [ValidateSet('run', 'api-run', 'fe-run', 'build', 'lint', 'clean', 'stop')]
  [string]$Command = 'run'
)

$api = 'src/Bootstrapper/OC.Bootstrapper.API'
$fe = 'src-fe/oc-react'

switch ($Command) {
  'api-run' {
    Push-Location $api
    dotnet run --launch-profile https
    Pop-Location
  }
  'fe-run' {
    Push-Location $fe
    pnpm run dev
    Pop-Location
  }
  'run' {
    $job = Start-Process -NoNewWindow -PassThru -FilePath dotnet -ArgumentList 'run', '--launch-profile', 'https', '--project', $api
    try {
      Push-Location $fe
      pnpm run dev
    } finally {
      Pop-Location
      Stop-Process -Id $job.Id -Force -ErrorAction SilentlyContinue
    }
  }
  'build' {
    Push-Location $api
    dotnet build
    Pop-Location
    Push-Location $fe
    pnpm run build
    Pop-Location
  }
  'lint' {
    Push-Location $fe
    pnpm run lint
    Pop-Location
  }
  'clean' {
    Push-Location $api
    dotnet clean
    Pop-Location
    if (Test-Path "$fe/dist") { Remove-Item -Recurse -Force "$fe/dist" }
  }
  'stop' {
    Get-Process -Name dotnet -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*OC.Bootstrapper.API*' } | Stop-Process -Force
    Get-Process -Name node -ErrorAction SilentlyContinue | Where-Object { $_.CommandLine -like '*rsbuild*' } | Stop-Process -Force
  }
}

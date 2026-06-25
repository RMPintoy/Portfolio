$ErrorActionPreference = "Stop"

$projectRoot = Split-Path -Parent $MyInvocation.MyCommand.Path
$port = 4173
$prefix = "http://127.0.0.1:$port/"

$listener = [System.Net.HttpListener]::new()
$listener.Prefixes.Add($prefix)

try {
  $listener.Start()
} catch {
  Write-Host "Couldn't start the local server on $prefix"
  Write-Host "Another app may already be using port $port."
  exit 1
}

Start-Process $prefix | Out-Null
Write-Host "Portfolio running at $prefix"
Write-Host "Press Ctrl+C to stop the server."

try {
  while ($listener.IsListening) {
    $context = $listener.GetContext()
    $requestPath = $context.Request.Url.AbsolutePath.TrimStart("/")

    if ([string]::IsNullOrWhiteSpace($requestPath)) {
      $requestPath = "index.html"
    }

    $filePath = Join-Path $projectRoot $requestPath
    if (-not (Test-Path $filePath) -or (Get-Item $filePath).PSIsContainer) {
      $filePath = Join-Path $projectRoot "index.html"
    }

    $extension = [IO.Path]::GetExtension($filePath).ToLowerInvariant()
    $contentType = switch ($extension) {
      ".html" { "text/html; charset=utf-8" }
      ".js" { "application/javascript; charset=utf-8" }
      ".css" { "text/css; charset=utf-8" }
      ".json" { "application/json; charset=utf-8" }
      ".pdf" { "application/pdf" }
      ".png" { "image/png" }
      ".jpg" { "image/jpeg" }
      ".jpeg" { "image/jpeg" }
      ".svg" { "image/svg+xml" }
      default { "application/octet-stream" }
    }

    $bytes = [IO.File]::ReadAllBytes($filePath)
    $context.Response.StatusCode = 200
    $context.Response.ContentType = $contentType
    $context.Response.ContentLength64 = $bytes.Length
    $context.Response.OutputStream.Write($bytes, 0, $bytes.Length)
    $context.Response.OutputStream.Close()
  }
} finally {
  $listener.Stop()
  $listener.Close()
}

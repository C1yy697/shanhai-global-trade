param(
  [Parameter(Mandatory = $true)]
  [string]$Repository,
  [string]$CustomDomain = ''
)

$ErrorActionPreference = 'Stop'
$project = Split-Path -Parent $MyInvocation.MyCommand.Path
$git = (Get-Command git -ErrorAction Stop).Source
$gh = Join-Path $project '..\..\work\gh-portable\bin\gh.exe'
if (-not (Test-Path $gh)) { $gh = (Get-Command gh -ErrorAction Stop).Source }

Push-Location $project
try {
  if (-not (Test-Path '.git')) {
    & $git init -b main
    & $git config user.name 'Shanhai Platform Publisher'
    & $git config user.email 'publisher@localhost.invalid'
  }
  & $git add .
  & $git commit -m 'Publish Shanhai Global Trade Platform v1.0' 2>$null
  & $gh auth status
  & $gh repo create $Repository --public --source . --remote origin --push
  & $gh api --method POST "repos/$Repository/pages" -f 'build_type=workflow' 2>$null
  if ($CustomDomain) {
    Set-Content -LiteralPath 'CNAME' -Value $CustomDomain -Encoding ascii
    & $git add CNAME
    & $git commit -m "Configure custom domain $CustomDomain"
    & $git push origin main
  }
  $account = (& $gh api user --jq .login).Trim()
  $repoName = ($Repository -split '/')[-1]
  Write-Output "GitHub Pages URL: https://$account.github.io/$repoName/"
  if ($CustomDomain) { Write-Output "Custom domain: https://$CustomDomain/" }
} finally {
  Pop-Location
}

New-Item -ItemType Directory -Force -Path './src/nexus-api/'
try {
    Write-Host "Generating GraphQL.ts"
    npx typed-graphql-builder --schema https://api.nexusmods.com/v2/graphql --output './src/nexus-api/GraphQL.ts'
} catch {
    Write-Host "Failed to generate GraphQL.ts" $_
}

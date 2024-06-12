# Path to your JSON file
$jsonFilePath = "C:\Users\Moyon\Desktop\TakeAByte\api\data\products.json"

# Read the JSON content
$jsonContent = Get-Content $jsonFilePath | ConvertFrom-Json

# Check if the JSON content was read correctly
Write-Host "Number of products: $($jsonContent.Count)"

# Initialize a HashSet to store unique keys
$uniqueKeys = New-Object System.Collections.Generic.HashSet[string]

# Loop through each product and extract unique keys
foreach ($product in $jsonContent) {
    foreach ($property in $product.PSObject.Properties) {
        # Add the key to the HashSet if it's not already present
        if (-not $uniqueKeys.Contains($property.Name)) {
            $uniqueKeys.Add($property.Name)
        }
    }
}

# Display the unique keys in alphabetical order without additional "True" output
$sortedKeys = $uniqueKeys | Sort-Object
foreach ($key in $sortedKeys) {
    Write-Host $key
}

# Display the total number of unique keys
Write-Host "Total unique keys: $($uniqueKeys.Count)"

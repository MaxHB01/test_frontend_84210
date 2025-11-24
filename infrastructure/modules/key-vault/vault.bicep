@description('Azure region where the Key Vault will be deployed.')
param location string

@description('Name of the Key Vault instance.')
@minLength(3)
@maxLength(24)
param vaultName string

resource keyVault 'Microsoft.KeyVault/vaults@2025-05-01' = {
  name: vaultName
  location: location
  properties: {
    sku: {
      name: 'standard'
      family: 'A'
    }
    tenantId: subscription().tenantId
    accessPolicies: []     // App identity policies added later in main.bicep
    softDeleteRetentionInDays: 7
    enablePurgeProtection: true
  }
}

output vaultName string = keyVault.name
output vaultId string = keyVault.id

@description('Name of the Key Vault instance.')
@minLength(3)
@maxLength(24)
param vaultName string

resource keyVaultReference 'Microsoft.KeyVault/vaults@2025-05-01' existing = {
  name: vaultName
}

resource authSecret 'Microsoft.KeyVault/vaults/secrets@2025-05-01' = {
  parent: keyVaultReference
  name: 'AUTH-SECRET'
  properties: {
    value: 'REPLACE_ME'
  }
}

resource apiUrlSecret 'Microsoft.KeyVault/vaults/secrets@2025-05-01' = {
  parent: keyVaultReference
  name: 'API-URL'
  properties: {
    value: 'REPLACE_ME'
  }
}

output authSecretUri string = authSecret.properties.secretUriWithVersion
output apiUrlSecretUri string = apiUrlSecret.properties.secretUriWithVersion

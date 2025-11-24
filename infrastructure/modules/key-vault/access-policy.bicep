@description('Name of the Key Vault instance.')
@minLength(3)
@maxLength(24)
param vaultName string

@description('Name of the Key Vault instance.')
@minLength(3)
param objectId string

resource keyVault 'Microsoft.KeyVault/vaults@2025-05-01' existing = {
    name: vaultName
}

resource accessPolicies 'Microsoft.KeyVault/vaults/accessPolicies@2025-05-01' = {
    parent: keyVault
    name: 'add'
    properties: {
        accessPolicies: [
        {
            tenantId: subscription().tenantId
            objectId: objectId
            permissions: {
            secrets: [
                'get'
                'list'
            ]
            }
        }
        ]
    }
}

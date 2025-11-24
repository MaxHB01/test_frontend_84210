@description('Name of the Key Vault instance.')
param vaultName string

@description('Azure AD object ID of the user or group to grant RBAC access.')
param principalObjectId string

@description('RBAC role to assign. Default = Secrets Officer.')
param roleDefinitionId string = 'b86a8fe4-44ce-4948-aee5-eccb2c155cd7' 
// Key Vault Secrets Officer

resource keyVault 'Microsoft.KeyVault/vaults@2025-05-01' existing = {
  name: vaultName
}

resource rbac 'Microsoft.Authorization/roleAssignments@2022-04-01' = {
  name: guid(keyVault.id, roleDefinitionId, principalObjectId)
  scope: keyVault
  properties: {
    principalId: principalObjectId
    principalType: 'User'
    roleDefinitionId: subscriptionResourceId(
      'Microsoft.Authorization/roleDefinitions',
      roleDefinitionId
    )
  }
}

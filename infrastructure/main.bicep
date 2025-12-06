@description('Azure region')
param location string = 'westeurope'

@description('Base name for the app.')
param appName string = 'growpath'

@description('Tier of stock keeping units')
@allowed(['Free', 'Basic'])
param tier string = 'Basic'

@description('Linux App Service, Stock Keeping Units')
@allowed(['F1', 'B1', 'B2'])
param stockKeepingUnitPlan string = 'B1'

@description('Node version')
@allowed(['18', '20', '22'])
param nodeVersion string = '20'

@description('Whether to deploy Key Vault resources')
param deployKeyVaults bool = false

// ----------------------------------------------------------------------
// 1. APP SERVICE PLAN MODULE
// ----------------------------------------------------------------------
module serverPlan './modules/server-plan.bicep' = {
    name: '${appName}-plan-module'
    params: {
        location: location
        planName: '${appName}-plan'
        tier: tier
        stockKeepingUnitPlan: stockKeepingUnitPlan
    }
}

// ----------------------------------------------------------------------
// 2. KEY VAULT MODULE
// ----------------------------------------------------------------------


var keyVaultProductionName = '${appName}-kv-prod-v2'
module keyVaultProduction './modules/key-vault/vault.bicep' = if (deployKeyVaults) {
    name: '${keyVaultProductionName}-module'
    params: {
        location: location
        vaultName: keyVaultProductionName
    }
}

module secretsProduction './modules/key-vault/secrets.bicep' = if (deployKeyVaults) {
    name: '${keyVaultProductionName}-secrets-module'
    dependsOn: [
        keyVaultProduction
    ]
    params: {
        vaultName: keyVaultProductionName
    }
}

var keyVaultDevelopmentName = '${appName}-kv-dev-v2'
module keyVaultDevelopment './modules/key-vault/vault.bicep' = if (deployKeyVaults) {
    name: '${keyVaultDevelopmentName}-module'
    params: {
        location: location
        vaultName: keyVaultDevelopmentName
    }
}

module secretsDevelopment './modules/key-vault/secrets.bicep' = if (deployKeyVaults) {
    name: '${keyVaultDevelopmentName}-secrets-module'
    dependsOn: [
        keyVaultDevelopment
    ]
    params: {
        vaultName: keyVaultDevelopmentName
    }
}

//
//development existing vaults
//
resource keyVaultDevelopmentExisting 'Microsoft.KeyVault/vaults@2025-05-01' existing = if (!deployKeyVaults) {
  name: keyVaultDevelopmentName
}

resource authSecretDev 'Microsoft.KeyVault/vaults/secrets@2025-05-01' existing = if (!deployKeyVaults) {
  parent: keyVaultDevelopmentExisting
  name: 'AUTH-SECRET'
}

resource apiUrlSecretDev 'Microsoft.KeyVault/vaults/secrets@2025-05-01' existing = if (!deployKeyVaults) {
  parent: keyVaultDevelopmentExisting
  name: 'API-URL'
}

// Get secret URI for output
var authSecretUriDev = deployKeyVaults
  ? secretsDevelopment.outputs.authSecretUri   // From module output if deployed
  : authSecretDev.properties.secretUriWithVersion // From existing reference
  
var apiUrlSecretUriDev = deployKeyVaults
  ? secretsDevelopment.outputs.apiUrlSecretUri   // From module output if deployed
  : apiUrlSecretDev.properties.secretUriWithVersion // From existing reference
  
//
//production existing vaults
//
resource keyVaultProductionExisting 'Microsoft.KeyVault/vaults@2025-05-01' existing = if (!deployKeyVaults) {
  name: keyVaultProductionName
}

resource authSecretProd 'Microsoft.KeyVault/vaults/secrets@2025-05-01' existing = if (!deployKeyVaults) {
  parent: keyVaultProductionExisting
  name: 'AUTH-SECRET'
}

resource apiUrlSecretProd 'Microsoft.KeyVault/vaults/secrets@2025-05-01' existing = if (!deployKeyVaults) {
  parent: keyVaultProductionExisting
  name: 'API-URL'
}

// Get secret URI for output
var authSecretUriProd = deployKeyVaults
  ? secretsProduction.outputs.authSecretUri   // From module output if deployed
  : authSecretProd.properties.secretUriWithVersion // From existing reference
  
var apiUrlSecretUriProd = deployKeyVaults
  ? secretsProduction.outputs.apiUrlSecretUri   // From module output if deployed
  : apiUrlSecretProd.properties.secretUriWithVersion // From existing reference

// ----------------------------------------------------------------------
// 4. NEXT.JS WEB APPS
// ----------------------------------------------------------------------
module production './modules/next-app.bicep' = {
    name: '${appName}-production-module'
    dependsOn: [
        keyVaultProduction
    ]
    params: {
        location: location
        appName: appName
        serverFarmId: serverPlan.outputs.planId
        nodeVersion: nodeVersion
        port: 8080

        authSecretUri: authSecretUriProd
        apiUrlSecretUri: apiUrlSecretUriProd
    }
}

module productionAccessPolicy './modules/key-vault/access-policy.bicep' = {
    name: '${keyVaultProductionName}-access-policy-module'
    dependsOn: [
        keyVaultProduction
    ]
    params: {
        vaultName: keyVaultProductionName
        objectId:  production.outputs.identityPrincipalId
    }
}

module development './modules/next-app.bicep' = {
    name: '${appName}-development-module'
    dependsOn: [
        keyVaultDevelopmentExisting
    ]
    params: {
        location: location
        appName: '${appName}-dev'
        serverFarmId: serverPlan.outputs.planId
        nodeVersion: nodeVersion
        port: 8080

        authSecretUri: authSecretUriDev
        apiUrlSecretUri: apiUrlSecretUriDev
    }
}

module developmentAccessPolicy './modules/key-vault/access-policy.bicep' = {
    name: '${keyVaultDevelopmentName}-access-policy-module'
    dependsOn: [
        keyVaultDevelopmentExisting
    ]
    params: {
        vaultName: keyVaultDevelopmentName
        objectId:  development.outputs.identityPrincipalId
    }
}

// ----------------------------------------------------------------------
// OUTPUTS
// ----------------------------------------------------------------------
output productionAppName string = production.outputs.webAppName
output developmentAppName string = development.outputs.webAppName
output planName string = serverPlan.outputs.planResourceName

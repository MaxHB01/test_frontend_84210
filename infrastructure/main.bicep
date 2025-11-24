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


var keyVaultProductionName = '${appName}-kv-prod'
module keyVaultProduction './modules/key-vault/vault.bicep' = {
    name: '${keyVaultProductionName}-module'
    params: {
        location: location
        vaultName: keyVaultProductionName
    }
}

module secretsProduction './modules/key-vault/secrets.bicep' = {
    name: '${keyVaultProductionName}-secrets-module'
    dependsOn: [
        keyVaultProduction
    ]
    params: {
        vaultName: keyVaultProductionName
    }
}

var keyVaultDevelopmentName = '${appName}-kv-dev'
module keyVaultDevelopment './modules/key-vault/vault.bicep' = {
    name: '${keyVaultDevelopmentName}-module'
    params: {
        location: location
        vaultName: keyVaultDevelopmentName
    }
}

module secretsDevelopment './modules/key-vault/secrets.bicep' = {
    name: '${keyVaultDevelopmentName}-secrets-module'
    dependsOn: [
        keyVaultDevelopment
    ]
    params: {
        vaultName: keyVaultDevelopmentName
    }
}

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

        authSecretUri: secretsProduction.outputs.authSecretUri
        apiUrlSecretUri: secretsProduction.outputs.apiUrlSecretUri
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
        keyVaultDevelopment
    ]
    params: {
        location: location
        appName: '${appName}-dev'
        serverFarmId: serverPlan.outputs.planId
        nodeVersion: nodeVersion
        port: 8080

        authSecretUri: secretsDevelopment.outputs.authSecretUri
        apiUrlSecretUri: secretsDevelopment.outputs.apiUrlSecretUri
    }
}

module developmentAccessPolicy './modules/key-vault/access-policy.bicep' = {
    name: '${keyVaultDevelopmentName}-access-policy-module'
    dependsOn: [
        keyVaultDevelopment
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

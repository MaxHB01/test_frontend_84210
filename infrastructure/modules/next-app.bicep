@description('Azure region where the Web App will be deployed.')
param location string

@description('Name of the Web App instance.')
@minLength(2)
@maxLength(60)
param appName string

@description('Resource ID of the App Service Plan that will host this Web App.')
param serverFarmId string

@description('Major Node.js version to run. Must be a valid LTS major version.')
@allowed(['18', '20', '22'])
param nodeVersion string = '20'

@description('Internal application port. Azure App Service will route traffic to this port.')
@minValue(1024)
@maxValue(65535)
param port int = 8080

var nodeVersionLts = '${nodeVersion}-lts'

param authSecretUri string
param apiUrlSecretUri string


resource webapp 'Microsoft.Web/sites@2024-11-01' = {
  name: appName
  location: location
  kind: 'app,linux'
  identity: {
    type: 'SystemAssigned'
  }
  properties: {
    serverFarmId: serverFarmId
    httpsOnly: true
    siteConfig: {
      linuxFxVersion: 'NODE|${nodeVersionLts}'
      alwaysOn: true
      appSettings: [
        {
          name: 'WEBSITE_NODE_DEFAULT_VERSION'
          value: '~${nodeVersion}'
        }
        {
          name: 'WEBSITE_RUN_FROM_PACKAGE'
          value: '1'
        }
        {
          name: 'PORT'
          value: string(port)
        }
        {
          name: 'WEBSITES_PORT'
          value: string(port)
        }
        {
          name: 'AUTH_SECRET'
          value: '@Microsoft.KeyVault(SecretUri=${authSecretUri})'
        }
        {
          name: 'API_URL'
          value: '@Microsoft.KeyVault(SecretUri=${apiUrlSecretUri})'
        }
      ]
    }
  }
}

output webAppName string = webapp.name
output identityPrincipalId string = webapp.identity.principalId

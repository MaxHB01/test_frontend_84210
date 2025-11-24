@description('Azure region where the Web App will be deployed.')
param location string

@description('Name of the App Service Plan.')
@minLength(2)
@maxLength(60)
param planName string

@description('Tier of stock keeping units')
@allowed(['Free', 'Basic'])
param tier string = 'Basic'

@description('Linux App Service, Stock Keeping Units')
@allowed(['F1', 'B1', 'B2'])
param stockKeepingUnitPlan string = 'B1'

// App Service Plan (Linux)
resource plan 'Microsoft.Web/serverfarms@2024-11-01' = {
  name: planName
  location: location
  sku: {
    name: stockKeepingUnitPlan
    tier: tier
    size: stockKeepingUnitPlan
    capacity: 1
  }
  properties: {
    reserved: true
  }
}

output planId string = plan.id
output planResourceName string = plan.name
output planSku string = plan.sku.name
output planTier string = plan.sku.tier
output planResource object = plan

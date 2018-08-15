const campaignDB = require('./json/campaign_info.json')

const campaignKeys = Object.keys(campaignDB)
const campaign_info = []
for(let i = 0; i < campaignKeys.length; i += 1) {
  campaign_info[i] = campaignDB[campaignKeys[i]]
}

export {
  campaign_info,
}
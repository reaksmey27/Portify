export function canCreatePortfolio(portfolioCount, plan) {
  return portfolioCount < plan.limits.portfolios
}

export function getPortfolioLimitMessage(plan) {
  return `Your ${plan.name} plan allows ${plan.limits.portfolios} portfolio${plan.limits.portfolios === 1 ? '' : 's'}. Upgrade to Pro for more.`
}

export function canUseTemplate(templateId, plan) {
  if (plan.id === 'pro') return true
  return ['minimal', 'dark'].includes(templateId)
}

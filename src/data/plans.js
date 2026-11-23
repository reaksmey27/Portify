export const plans = [
  {
    id: 'free',
    name: 'Free',
    description: 'Everything you need to create your first portfolio.',
    price: 0,
    interval: 'forever',
    limits: { portfolios: 1, templates: 2 },
    features: [
      '1 published portfolio',
      '2 basic templates',
      'Portfolio editor',
      'Public portfolio URL',
      'Basic customization',
    ],
  },
  {
    id: 'pro',
    name: 'Pro',
    description: 'More flexibility for developers and creatives.',
    price: 8,
    interval: 'month',
    limits: { portfolios: 10, templates: 3 },
    features: [
      'Up to 10 portfolios',
      'All portfolio templates',
      'Advanced customization',
      'Portfolio analytics',
      'Profile and project images',
      'Priority support',
    ],
  },
]

export function getPlan(planId) {
  return plans.find(plan => plan.id === planId) || plans[0]
}

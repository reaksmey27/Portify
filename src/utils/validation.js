export function validatePortfolio(form) {
  const errors = {}

  if (!form.title?.trim()) errors.title = 'Portfolio title is required.'
  if (!form.name?.trim()) errors.name = 'Your name is required.'
  if (!form.role?.trim()) errors.role = 'Your professional role is required.'
  if (form.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(form.email)) {
    errors.email = 'Please enter a valid email.'
  }

  return errors
}

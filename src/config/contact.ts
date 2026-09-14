export const contact = {
  primaryPhone: '+919548148852',
  whatsapp: '+919548148852',
  email: 'Customercare@joyofhearing.net',
  hours: 'Mon-Sat (10 AM to 7PM)',
} as const;

export const telHref = `tel:${contact.primaryPhone}`;
export const waHref = (msg = 'Hello, I would like to book an appointment.') =>
  `https://wa.me/${contact.whatsapp.replace(/[^\d]/g, '')}?text=${encodeURIComponent(msg)}`;

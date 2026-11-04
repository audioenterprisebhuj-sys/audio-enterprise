/**
 * Central site configuration.
 * Change the WhatsApp number, contact details and brand info here only.
 */

export const WHATSAPP_NUMBER = '919876543210'; // country code + number, digits only

export const SITE = {
  brand: 'Audio Enterprise',
  brandShort: 'AE',
  tagline: 'The Sound of Professional Audio',
  phone: '+91 98765 43210',
  phoneHref: 'tel:+919876543210',
  email: 'sales@audioenterprise.in',
  address: 'Sound City Complex, Station Road, Bhuj, Kutch, Gujarat 370001',
  branches: [
    {
      name: 'Bhuj Main Experience Center',
      city: 'Bhuj, Gujarat',
      address: 'Near Jubilee Ground, Station Road, Bhuj, Kutch 370001',
      phone: '+91 98765 43210',
      type: 'Showroom & Live Demo Rig'
    },
    {
      name: 'Mumbai Distribution Hub',
      city: 'Mumbai, Maharashtra',
      address: '214, Sound City Complex, Lamington Road, Mumbai 400007',
      phone: '+91 98765 43211',
      type: 'Logistics & Trade Dispatch'
    }
  ],
  hours: [
    { day: 'Monday – Saturday', time: '10:00 AM – 8:30 PM' },
    { day: 'Sunday', time: '11:00 AM – 5:00 PM' }
  ],
  mapEmbed:
    'https://www.openstreetmap.org/export/embed.html?bbox=69.64%2C23.23%2C69.70%2C23.27&layer=mapnik',
  social: {
    instagram: 'https://instagram.com',
    facebook: 'https://www.facebook.com/share/1KMSsqGtK6/',
    youtube: 'https://youtube.com'
  }
} as const;

export const ANNOUNCEMENTS = [
  'Authorised Professional Audio Dealer',
  'Pan-India Safe Dispatch',
  'Live Demo & Systems Engineering Support'
];

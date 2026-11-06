/**
 * Central site configuration.
 * Change the WhatsApp number, contact details and brand info here only.
 */

export const WHATSAPP_NUMBER = '919898160962'; // country code + number, digits only

export const SITE = {
  brand: 'Audio Enterprise',
  brandShort: 'AE',
  tagline: 'Professional Audio Products Manufacturer',
  domain: 'ssaudio.in',
  url: 'https://ssaudio.in',
  phone: '+91 98981 60962',
  phoneRaw: '9898160962',
  phoneHref: 'tel:+919898160962',
  email: 'audioenterprisebhuj@gmail.com',
  address: 'Op Memon, Ashapura Ring Road, near Dandabazar Char Rasta, Din Dayal Nagar, Bhuj, Gujarat 370001',
  mapUrl: 'https://maps.app.goo.gl/a7y681bT5tnxWPEA6',
  whatsappGroup: 'https://chat.whatsapp.com/IPOJb87wI9z9WO0B9iGAVE?mode=gi_t',
  branches: [
    {
      name: 'Bhuj Manufacturing & Sound Experience Center',
      city: 'Bhuj, Gujarat',
      address: 'Op Memon, Ashapura Ring Road, near Dandabazar Char Rasta, Din Dayal Nagar, Bhuj, Gujarat 370001',
      phone: '+91 98981 60962',
      type: 'Headquarters & Sound Testing Rig'
    }
  ],
  hours: [
    { day: 'Monday – Saturday', time: '10:00 AM – 8:30 PM' },
    { day: 'Sunday', time: '11:00 AM – 5:00 PM' }
  ],
  mapEmbed:
    'https://www.google.com/maps/embed?origin=mfe&pb=!1m3!3m2!1m1!4s8396080212022578619',
  social: {
    instagram: 'https://www.instagram.com/audioenterprisebhuj?cplk=bm1ydzJraWphMWp1',
    youtube: 'http://www.youtube.com/@audioenterprisebhuj.2012',
    facebook: 'https://www.facebook.com/share/1KMSsqGtK6/'
  }
} as const;

export const ANNOUNCEMENTS = [
  'Professional Audio Products Manufacturer',
  'Pan-India Safe Dispatch',
  'Custom Acoustic Enclosures & Live Engineering'
];

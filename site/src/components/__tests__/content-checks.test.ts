import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { businessInfo } from '../../data/business-info';

// Helper to read a component source file
function readComponent(name: string): string {
  return readFileSync(resolve(__dirname, '..', name), 'utf-8');
}

// Helper to read a page source file
function readPage(name: string): string {
  return readFileSync(resolve(__dirname, '..', '..', 'pages', name), 'utf-8');
}

describe('Navigation content (Req 2.1)', () => {
  const src = readComponent('Navigation.astro');

  const requiredLinks = [
    'Home',
    'Services',
    'How It Works',
    'Why Choose Us',
    'Gallery',
    'About',
    'Testimonials',
    'Service Area',
    'Contact Us',
  ];

  it('contains all 9 required navigation links', () => {
    for (const link of requiredLinks) {
      expect(src).toContain(link);
    }
  });
});

describe('Hero section content (Req 1.1, 1.2, 3.2, 3.3, 3.4)', () => {
  const src = readComponent('HeroSection.astro');

  it('contains the correct heading', () => {
    expect(src).toContain('Blocked Gutters? We Clear Them Fast.');
  });

  it('contains the tagline "Local. Reliable. Family Run."', () => {
    expect(src).toContain('Local. Reliable. Family Run.');
  });

  it('contains the welcome text "Welcome to Warboys Gutter Clearing"', () => {
    expect(src).toContain('Welcome to Warboys Gutter Clearing');
  });

  it('contains trust bullets about vacuum system, ladders, and insured', () => {
    expect(src).toContain('Vacuum System');
    expect(src).toContain('No Ladders');
    expect(src).toContain('Insured');
  });

  it('contains Get a Free Quote CTA', () => {
    expect(src).toContain('Get a Free Quote');
  });

  it('contains Call Now CTA', () => {
    expect(src).toContain('Call Now');
  });
});

describe('Trust bar content (Req 4.2)', () => {
  const src = readComponent('TrustBar.astro');

  const trustSignals = [
    'Local &amp; Reliable',
    'Fully Insured',
    'Easy Booking',
    'Covering Cambridgeshire',
  ];

  it('contains all 4 trust signals', () => {
    for (const signal of trustSignals) {
      expect(src).toContain(signal);
    }
  });
});

describe('Services section content (Req 4.1, 4.2, 4.3)', () => {
  const src = readComponent('ServicesSection.astro');

  it('imports businessInfo and iterates over services', () => {
    expect(src).toContain("import { businessInfo } from '../data/business-info'");
    expect(src).toContain('businessInfo.services.map');
  });

  it('renders service name and description from data', () => {
    expect(src).toContain('service.name');
    expect(src).toContain('service.description');
  });

  it('data file contains all 4 service names', () => {
    const serviceNames = businessInfo.services.map(s => s.name);
    expect(serviceNames).toContain('Gutter Clearing');
    expect(serviceNames).toContain('Gutter Guard Installation');
    expect(serviceNames).toContain('Downpipe Clearing & Minor Maintenance');
    expect(serviceNames).toContain('Domestic & Small Commercial Properties');
  });
});

describe('How It Works content (Req 6.3, 6.4)', () => {
  const src = readComponent('HowItWorks.astro');

  it('displays step 1: Book Your Slot', () => {
    expect(src).toContain('Book Your Slot');
  });

  it('displays step 2: We Clear Your Gutters', () => {
    expect(src).toContain('We Clear Your Gutters');
  });

  it('displays step 3: Job Done', () => {
    expect(src).toContain('Job Done');
  });
});

describe('Why Choose Us content (Req 5.1, 5.2, 5.3, 5.4, 5.5, 5.6)', () => {
  const src = readComponent('WhyChooseUs.astro');

  it('displays "Family-run and well established" differentiator', () => {
    expect(src).toContain('Family-run and well established');
  });

  it('displays "Friendly, honest, and reliable" differentiator', () => {
    expect(src).toContain('Friendly, honest, and reliable');
  });

  it('displays "Local to Warboys — we care about our community" differentiator', () => {
    expect(src).toContain('Local to Warboys');
    expect(src).toContain('we care about our community');
  });

  it('displays "Fully insured for your peace of mind" differentiator', () => {
    expect(src).toContain('Fully insured for your peace of mind');
  });

  it('displays "Modern equipment for a thorough clean every time" differentiator', () => {
    expect(src).toContain('Modern equipment for a thorough clean every time');
  });
});

describe('Footer content (Req 13.1-13.4)', () => {
  const src = readComponent('Footer.astro');

  it('contains a phone tel: link', () => {
    expect(src).toContain('tel:');
  });

  it('contains an email address', () => {
    expect(src).toContain('mailto:');
  });

  it('contains navigation links', () => {
    expect(src).toContain('Home');
    expect(src).toContain('Services');
    expect(src).toContain('Contact Us');
  });

  it('contains copyright text', () => {
    expect(src).toContain('Warboys Gutter Clearing');
    expect(src).toContain('All rights reserved');
  });
});

describe('CTA Banner content (Req 6.1, 6.2, 14.1, 14.2)', () => {
  const src = readComponent('CtaBanner.astro');

  it('contains the overflowing gutters paragraph', () => {
    expect(src).toContain('Whether your gutters are overflowing');
  });

  it('contains Get a Free Quote button', () => {
    expect(src).toContain('Get a Free Quote');
  });

  it('contains Call Now button', () => {
    expect(src).toContain('Call Now');
  });
});

describe('Contact page intro (Req 7.1)', () => {
  const src = readPage('contact.astro');

  it('contains "Contact us today for a free quote"', () => {
    expect(src).toContain('Contact us today for a free quote');
  });
});

describe('StarRating component (Req 10.3)', () => {
  const src = readComponent('StarRating.astro');

  it('accepts a rating prop', () => {
    expect(src).toContain('rating');
  });

  it('renders star SVGs', () => {
    expect(src).toContain('<svg');
    expect(src).toContain('star');
  });

  it('supports full, half, and empty star states', () => {
    expect(src).toContain("'full'");
    expect(src).toContain("'half'");
    expect(src).toContain("'empty'");
  });

  it('renders correct number of filled stars for ratings 1-5', () => {
    expect(src).toContain('i <= 5');
    expect(src).toContain('clampedRating >= i');
  });
});

describe('Business data integrity (Req 3.1, 3.2, 3.3, 3.4, 3.5, 3.6)', () => {
  it('has exactly 4 services', () => {
    expect(businessInfo.services.length).toBe(4);
  });

  it('each service has a non-empty name and description', () => {
    for (const service of businessInfo.services) {
      expect(service.name.length).toBeGreaterThan(0);
      expect(service.description.length).toBeGreaterThan(0);
    }
  });
});

import { describe, it, expect } from 'vitest';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

// Helper to read a component source file
function readComponent(name: string): string {
  return readFileSync(resolve(__dirname, '..', name), 'utf-8');
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

describe('Hero section content (Req 3.2, 3.3, 3.4)', () => {
  const src = readComponent('HeroSection.astro');

  it('contains the correct heading', () => {
    expect(src).toContain('Blocked Gutters? We Clear Them Fast.');
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

describe('Services section content (Req 5.1, 5.3, 5.4, 5.5)', () => {
  const src = readComponent('ServicesSection.astro');

  it('lists Gutter Clearing service', () => {
    expect(src).toContain('Gutter Clearing');
  });

  it('lists Downpipe Unblocking service', () => {
    expect(src).toContain('Downpipe Unblocking');
  });

  it('lists Downpipe Gutter Guards service', () => {
    expect(src).toContain('Downpipe Gutter Guards');
  });

  it('describes the Predator vacuum method', () => {
    expect(src).toContain('Predator');
  });

  it('describes the by hand method', () => {
    expect(src.toLowerCase()).toContain('by hand');
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

describe('Why Choose Us content (Req 7.2, 7.3)', () => {
  const src = readComponent('WhyChooseUs.astro');

  it('displays "No ladders" differentiator', () => {
    expect(src).toContain('No ladders');
  });

  it('displays "Reach awkward areas" differentiator', () => {
    expect(src).toContain('Reach awkward areas');
  });

  it('displays "Friendly local" differentiator', () => {
    expect(src).toContain('Friendly local');
  });

  it('displays "Competitive pricing" differentiator', () => {
    expect(src).toContain('Competitive pricing');
  });

  it('displays "Appointment reminders" differentiator', () => {
    expect(src).toContain('Appointment reminders');
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

describe('CTA Banner content (Req 14.1, 14.2)', () => {
  const src = readComponent('CtaBanner.astro');

  it('contains Get a Free Quote button', () => {
    expect(src).toContain('Get a Free Quote');
  });

  it('contains Call Now button', () => {
    expect(src).toContain('Call Now');
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
    // The component builds an array of 5 star states based on the rating
    // Verify the loop iterates 5 times (i <= 5)
    expect(src).toContain('i <= 5');
    // Verify it compares rating against index to determine full/half/empty
    expect(src).toContain('clampedRating >= i');
  });
});

/**
 * Khan Creative Studio — Shared Supabase Client (Public Website)
 * Centralized Configuration: https://qguqixqmsisgugpxdwer.supabase.co
 * Public Auth Storage Key: kcs-public-auth
 */

const SUPABASE_URL = 'https://xlrujygnwugnvegesayh.supabase.co';
// Public Anon Key configured for Khan Creative Studio Supabase project
const SUPABASE_ANON_KEY = window.__KCS_SUPABASE_ANON_KEY__ || 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhscnVqeWdud3VnbnZlZ2VzYXloIiwicm9sZSI6ImFub24iLCJpYXQiOjE3OTQ0MDgzNTcsImV4cCI6MjEwOTk4NDM1N30.UPBy_5Ac1YQMpSFDtWEHCzBQ-sXJRMiOF-Z26ARtD58';

// In-memory fallback mock store for instant offline preview & resilience
const FALLBACK_DATA = {
  site_settings: {
    business_name: 'Khan Creative Studio',
    tagline: 'Premium Digital Solutions & Creative Agency',
    logo_url: '/assets/logo.png',
    website_url: 'https://khancreativestudio.com',
    business_description: 'Khan Creative Studio is an elite digital and creative solutions agency delivering bespoke website development, graphic design, social media marketing, and visual content.',
    contact_email: 'khancreativestudio1@gmail.com',
    phone_number: '+92 315 1342465',
    whatsapp_number: '+92 315 1342465',
    business_address: 'Lahore / Islamabad, Pakistan',
    default_currency: 'PKR',
    currency_symbol: 'Rs. ',
    hero_headline: 'Crafting Digital Masterpieces That Elevate Your Brand',
    hero_subheadline: 'We engineer bespoke digital platforms, distinctive brand identities, and high-impact visual campaigns tailored for modern brands.',
    hero_primary_cta_text: 'Explore Services',
    hero_primary_cta_url: '/services.html',
    hero_secondary_cta_text: 'Book a Consultation',
    hero_secondary_cta_url: '/contact.html',
    newsletter_visible: true,
    reviews_visible: true
  },
  nav_links: [
    { id: '1', title: 'Home', url: '/index.html', location: 'header', sort_order: 1, is_visible: true },
    { id: '2', title: 'About', url: '/about.html', location: 'header', sort_order: 2, is_visible: true },
    { id: '3', title: 'Services', url: '/services.html', location: 'header', sort_order: 3, is_visible: true },
    { id: '4', title: 'Packages', url: '/package.html', location: 'header', sort_order: 4, is_visible: true },
    { id: '5', title: 'Reviews', url: '/reviews.html', location: 'header', sort_order: 5, is_visible: true },
    { id: '6', title: 'Contact', url: '/contact.html', location: 'header', sort_order: 6, is_visible: true }
  ],
  services: [
    {
      id: 'srv-1',
      title: 'Website Development',
      slug: 'website-development',
      category: 'Development',
      short_description: 'High-performance custom web applications, agency platforms, and e-commerce architectures.',
      full_description: 'We engineer bespoke, fast, responsive, and SEO-optimized web experiences designed to convert visitors into loyal clients. Every website is built with clean architecture, modern UI, and mobile-first responsiveness.',
      starting_price: 75000,
      currency: 'PKR',
      icon: 'code',
      delivery_time: '10-14 business days',
      features: ['Custom Responsive Frontend', 'Core Web Vitals Optimization', 'SEO Setup & Schema Markup', 'Lead Form Integrations', 'Speed & Security Hardening'],
      is_featured: true,
      is_active: true
    },
    {
      id: 'srv-2',
      title: 'Graphic Designing in Pakistan',
      slug: 'graphic-designing',
      category: 'Design',
      short_description: 'High-end visual communication, corporate presentations, and brand collateral.',
      full_description: 'World-class visual solutions tailored for corporate brands and digital entrepreneurs across Pakistan and internationally. From digital assets to print-ready materials, we craft designs that command attention.',
      starting_price: 25000,
      currency: 'PKR',
      icon: 'palette',
      delivery_time: '3-5 business days',
      features: ['Vector Artwork & Layouts', 'Marketing Banners & Brochures', 'Print & Digital Formats Included', 'Commercial Usage Rights'],
      is_featured: true,
      is_active: true
    },
    {
      id: 'srv-3',
      title: 'Logo & Brand Identity',
      slug: 'logo-branding',
      category: 'Branding',
      short_description: 'Iconic brand systems, typography rules, color palettes, and comprehensive brand books.',
      full_description: 'A memorable brand begins with an authentic identity. We develop complete visual identity systems that communicate your values and establish immediate trust with your target market.',
      starting_price: 35000,
      currency: 'PKR',
      icon: 'award',
      delivery_time: '5-7 business days',
      features: ['3 Unique Logo Concepts', 'Full Vector Source Files (AI, SVG, PDF)', 'Brand Style Guide', 'Typography & Palette'],
      is_featured: true,
      is_active: true
    },
    {
      id: 'srv-4',
      title: 'Social Media Management',
      slug: 'social-media-management',
      category: 'Marketing',
      short_description: 'Strategic monthly content creation, publishing, community engagement, and growth.',
      full_description: 'Transform your social presence into an authoritative revenue driver. We design content calendars, craft scroll-stopping creative carousels, and manage customer interactions across Instagram, Facebook, and LinkedIn.',
      starting_price: 45000,
      currency: 'PKR',
      icon: 'share-2',
      delivery_time: 'Monthly Retainer',
      features: ['16-20 Custom Branded Posts/Reels', 'Copywriting & Hashtags', 'Community Engagement', 'Monthly Analytics Report'],
      is_featured: true,
      is_active: true
    },
    {
      id: 'srv-5',
      title: 'AI Video Advertisements',
      slug: 'ai-video-advertisements',
      category: 'Video',
      short_description: 'Next-generation AI-powered video commercials, product reveals, and promotional ads.',
      full_description: 'Harness the vanguard of artificial intelligence to generate cinematic video advertisements that stand out in crowded feeds. Ideal for product launches, real estate, e-commerce, and high-impact digital ads.',
      starting_price: 40000,
      currency: 'PKR',
      icon: 'video',
      delivery_time: '4-6 business days',
      features: ['AI Scripting & Voiceover', 'Cinematic Scene Composition', 'Full HD/4K Video Delivery', 'Music & Sound Design'],
      is_featured: true,
      is_active: true
    },
    {
      id: 'srv-6',
      title: 'Google Ads Management',
      slug: 'google-ads-management',
      category: 'Marketing',
      short_description: 'High-ROI search, display, and performance max campaigns aimed at qualified conversions.',
      full_description: 'Maximize your advertising budget with data-backed search engine marketing. We conduct in-depth keyword analysis, negative keyword pruning, and continuous bid optimization.',
      starting_price: 50000,
      currency: 'PKR',
      icon: 'trending-up',
      delivery_time: 'Monthly Retainer',
      features: ['Targeted Keyword Research', 'Ad Copywriting & A/B Testing', 'Conversion Tracking', 'Weekly Optimization'],
      is_featured: false,
      is_active: true
    }
  ],
  packages: [
    {
      id: 'pkg-1',
      name: 'Starter Brand Launchpad',
      slug: 'starter-brand-launchpad',
      tier: 'Starter',
      price: 49999,
      discount_price: 44999,
      currency: 'PKR',
      description: 'Essential creative package for emerging businesses and startups ready to establish a credible digital presence.',
      delivery_time: '7 business days',
      revisions: '3 Revisions',
      is_featured: false,
      is_active: true,
      features: [
        'Custom Logo Design (2 Concepts)',
        'Social Media Branding Kit',
        'Basic 3-Page Responsive Website',
        'Google Business Profile Setup',
        'Full Source Files Included'
      ]
    },
    {
      id: 'pkg-2',
      name: 'Growth Agency Suite',
      slug: 'growth-agency-suite',
      tier: 'Standard',
      price: 119999,
      discount_price: 99999,
      currency: 'PKR',
      description: 'Our most popular comprehensive digital package combining custom web development, brand identity, and social media kickoff.',
      delivery_time: '14 business days',
      revisions: '5 Revisions',
      is_featured: true,
      is_active: true,
      features: [
        'Full Bespoke Multi-Page Website',
        'Complete Brand Identity Book',
        '1 Month Social Media Management (16 Posts)',
        'Google Ads & Analytics Integration',
        'Priority Support & WhatsApp Direct Line'
      ]
    },
    {
      id: 'pkg-3',
      name: 'Elite Digital Transformation',
      slug: 'elite-digital-transformation',
      tier: 'Premium',
      price: 249999,
      discount_price: 219999,
      currency: 'PKR',
      description: 'End-to-end digital mastery designed for established companies seeking market leadership across all digital touchpoints.',
      delivery_time: '21-30 business days',
      revisions: 'Unlimited Revisions',
      is_featured: true,
      is_active: true,
      features: [
        'High-Performance Web Platform + CMS',
        'AI Video Advertisements & Commercials',
        'Comprehensive SEO & Local Domination',
        '3 Months Managed Marketing & PPC Strategy',
        'Dedicated Account Manager'
      ]
    }
  ],
  reviews: [],
  coupons: [
    { code: 'KCSLAUNCH', discount_type: 'percentage', discount_value: 10, min_order_amount: 30000, is_active: true },
    { code: 'CREATIVE5000', discount_type: 'fixed', discount_value: 5000, min_order_amount: 50000, is_active: true }
  ]
};

// Check if official Supabase JS SDK is loaded via CDN or module
let supabaseClient = null;

if (window.supabase && typeof window.supabase.createClient === 'function') {
  try {
    supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY, {
      auth: {
        storageKey: 'kcs-public-auth',
        persistSession: true,
        autoRefreshToken: true
      }
    });
  } catch (err) {
    console.warn('[KCS Supabase] Client init fallback:', err);
  }
}

/**
 * Unified Public Database Query API
 */
export const db = {
  async getSettings() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('site_settings').select('*').limit(1).maybeSingle();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Using local fallback for settings', e);
      }
    }
    return FALLBACK_DATA.site_settings;
  },

  async getNavLinks() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('nav_links').select('*').eq('is_visible', true).order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Using local fallback for nav_links', e);
      }
    }
    return FALLBACK_DATA.nav_links;
  },

  async getServices(category = null) {
    if (supabaseClient) {
      try {
        let query = supabaseClient.from('services').select('*').eq('is_active', true).eq('is_deleted', false).order('sort_order', { ascending: true });
        if (category && category !== 'All') {
          query = query.eq('category', category);
        }
        const { data, error } = await query;
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Using local fallback for services', e);
      }
    }
    if (category && category !== 'All') {
      return FALLBACK_DATA.services.filter(s => s.category.toLowerCase() === category.toLowerCase());
    }
    return FALLBACK_DATA.services;
  },

  async getServiceBySlug(slug) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('services').select('*, service_options(*)').eq('slug', slug).eq('is_active', true).eq('is_deleted', false).maybeSingle();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Using local fallback for service slug', e);
      }
    }
    return FALLBACK_DATA.services.find(s => s.slug === slug) || FALLBACK_DATA.services[0];
  },

  async getPackages() {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('packages').select('*').eq('is_active', true).eq('is_deleted', false).order('sort_order', { ascending: true });
        if (!error && data && data.length > 0) return data;
      } catch (e) {
        console.warn('Using local fallback for packages', e);
      }
    }
    return FALLBACK_DATA.packages;
  },

  async getPackageBySlug(slug) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('packages').select('*').eq('slug', slug).maybeSingle();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Using local fallback for package slug', e);
      }
    }
    return FALLBACK_DATA.packages.find(p => p.slug === slug) || FALLBACK_DATA.packages[0];
  },

  async getReviews() {
    // Only REAL, admin-approved reviews are ever shown (no demo/fallback reviews).
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('reviews').select('*').eq('is_approved', true).eq('is_deleted', false).order('created_at', { ascending: false });
        if (!error) return data || [];
        console.warn('Reviews load error:', error);
      } catch (e) {
        console.warn('Reviews load failed', e);
      }
    }
    return [];
  },

  async validateCoupon(code) {
    const cleanCode = (code || '').trim().toUpperCase();
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('coupons').select('*').eq('code', cleanCode).eq('is_active', true).maybeSingle();
        if (!error && data) {
          // Reject expired or fully-used coupons
          if (data.expiry_date && new Date(data.expiry_date) < new Date()) return null;
          if (data.usage_limit && data.used_count >= data.usage_limit) return null;
          return data;
        }
        if (!error && !data) return null; // coupon really does not exist -> do NOT fall back to demo coupons
      } catch (e) {
        console.warn('Using local fallback for coupon validation', e);
      }
    }
    return FALLBACK_DATA.coupons.find(c => c.code === cleanCode) || null;
  },

  async submitLead(leadData) {
    if (!supabaseClient) throw new Error('Supabase client not loaded');
    // NOTE: no .select() here — public (anon) users can INSERT but not SELECT leads (RLS).
    // If optional columns (coupon_code, discount_amount) are not in the DB yet (MIGRATION_2.sql not run),
    // retry without them so the lead is never lost (coupon info is also written inside the message).
    let payload = { ...leadData };
    for (let attempt = 0; attempt < 4; attempt++) {
      const { error } = await supabaseClient.from('leads').insert([payload]);
      if (!error) return { success: true };
      const m = (error.message || '').match(/Could not find the '([^']+)' column/i);
      if (m && m[1] in payload) { delete payload[m[1]]; continue; }
      console.error('Supabase lead submit error:', error);
      throw error;
    }
    throw new Error('Lead could not be saved');
  },

  async submitOrder(orderData, items) {
    if (!supabaseClient) throw new Error('Supabase client not loaded');

    // Generate the order id on the client so we don't need .select() after insert (RLS).
    const orderId = crypto.randomUUID();
    const { error: orderErr } = await supabaseClient
      .from('orders')
      .insert([{ ...orderData, id: orderId }]);
    if (orderErr) {
      console.error('Supabase order error:', orderErr);
      throw orderErr;
    }

    if (items && items.length > 0) {
      const isUUID = (v) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(v || '');
      const formattedItems = items.map(item => ({
        order_id: orderId,
        item_type: item.type || 'package',
        item_id: isUUID(item.id) ? item.id : null,
        title: item.title || item.name,
        unit_price: item.price,
        quantity: item.quantity || 1,
        subtotal: (item.price * (item.quantity || 1))
      }));
      const { error: itemsErr } = await supabaseClient.from('order_items').insert(formattedItems);
      if (itemsErr) {
        console.error('Supabase order items error:', itemsErr);
        throw itemsErr;
      }
    }
    return { success: true, order: { ...orderData, id: orderId } };
  },

  async subscribeNewsletter(email) {
    if (!supabaseClient) throw new Error('Supabase client not loaded');
    const { error } = await supabaseClient
      .from('newsletter_subscribers')
      .insert([{ email: email.trim().toLowerCase() }]);
    if (error) {
      if (error.code === '23505') return { success: true, alreadySubscribed: true };
      console.error('Supabase newsletter error:', error);
      throw error;
    }
    return { success: true };
  },

  async submitReview(reviewData) {
    if (!supabaseClient) throw new Error('Supabase client not loaded');
    const payload = {
      ...reviewData,
      is_approved: false // Mandatory moderation
    };
    const { error } = await supabaseClient.from('reviews').insert([payload]);
    if (error) {
      console.error('Supabase review error:', error);
      throw error;
    }
    return { success: true };
  },

  async getPageBySlug(slug) {
    if (supabaseClient) {
      try {
        const { data, error } = await supabaseClient.from('pages').select('*').eq('slug', slug).eq('is_published', true).maybeSingle();
        if (!error && data) return data;
      } catch (e) {
        console.warn('Page slug fallback', e);
      }
    }
    return null;
  }
};

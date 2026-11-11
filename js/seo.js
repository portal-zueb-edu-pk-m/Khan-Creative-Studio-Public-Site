/**
 * Khan Creative Studio — Dynamic SEO & Structured Data Injection
 */

export function setupSEO({ title, description, canonicalUrl, ogType = 'website', schema = null }) {
  if (title) {
    document.title = title.includes('Khan Creative Studio') ? title : `${title} | Khan Creative Studio`;
  }

  // Update meta description
  if (description) {
    let metaDesc = document.querySelector('meta[name="description"]');
    if (!metaDesc) {
      metaDesc = document.createElement('meta');
      metaDesc.name = 'description';
      document.head.appendChild(metaDesc);
    }
    metaDesc.content = description;

    let ogDesc = document.querySelector('meta[property="og:description"]');
    if (ogDesc) ogDesc.content = description;
  }

  // Update canonical
  if (canonicalUrl) {
    let linkCanonical = document.querySelector('link[rel="canonical"]');
    if (!linkCanonical) {
      linkCanonical = document.createElement('link');
      linkCanonical.rel = 'canonical';
      document.head.appendChild(linkCanonical);
    }
    linkCanonical.href = canonicalUrl;
  }

  // Inject or update Schema.org JSON-LD
  const baseSchema = schema || {
    '@context': 'https://schema.org',
    '@type': 'ProfessionalService',
    'name': 'Khan Creative Studio',
    'url': 'https://khancreativestudio.com',
    'logo': 'https://khancreativestudio.com/assets/logo.png',
    'image': 'https://khancreativestudio.com/assets/logo.png',
    'description': 'Elite creative and digital solutions agency in Pakistan specializing in website development, graphic design, social media marketing, and AI video advertisements.',
    'priceRange': '$$',
    'address': {
      '@type': 'PostalAddress',
      'addressCountry': 'PK',
      'addressLocality': 'Lahore'
    }
  };

  let schemaScript = document.getElementById('kcs-schema-jsonld');
  if (!schemaScript) {
    schemaScript = document.createElement('script');
    schemaScript.id = 'kcs-schema-jsonld';
    schemaScript.type = 'application/ld+json';
    document.head.appendChild(schemaScript);
  }
  schemaScript.textContent = JSON.stringify(baseSchema);
}

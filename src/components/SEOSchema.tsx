import React from 'react';
import { Helmet } from 'react-helmet-async';
import { useTranslation } from 'react-i18next';
import { SEO_DATA } from '../seo';

export function SEOSchema() {
  const { t, i18n } = useTranslation();
  const currentLang = i18n.language as keyof typeof SEO_DATA | string;
  const langData = (SEO_DATA as any)[currentLang] || SEO_DATA.pt;

  const websiteSchema = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    "name": "VELKS Group",
    "url": SEO_DATA.url,
    "potentialAction": {
      "@type": "SearchAction",
      "target": `${SEO_DATA.url}/?s={search_term_string}`,
      "query-input": "required name=search_term_string"
    }
  };

  const organizationSchema = {
    "@context": "https://schema.org",
    "@type": "Organization",
    "name": "VELKS Group",
    "url": SEO_DATA.url,
    "logo": `${SEO_DATA.url}/favicon-32x32.png`,
    "contactPoint": {
      "@type": "ContactPoint",
      "telephone": SEO_DATA.phone,
      "contactType": "customer service",
      "email": SEO_DATA.email,
      "availableLanguage": ["Portuguese", "English", "Spanish", "French", "German"]
    },
    "founder": SEO_DATA.founders.map(f => ({ "@type": "Person", "name": f }))
  };

  const localBusinessSchema = {
    "@context": "https://schema.org",
    "@type": "LocalBusiness",
    "name": "VELKS Group",
    "image": `${SEO_DATA.url}/og-image.jpg`,
    "url": SEO_DATA.url,
    "telephone": SEO_DATA.phone,
    "address": {
      "@type": "PostalAddress",
      "addressLocality": "Luxembourg",
      "addressCountry": "LU"
    },
    "priceRange": "$$",
    "areaServed": SEO_DATA.locations.map(loc => ({ "@type": "Place", "name": loc }))
  };

  const faqSchema = {
    "@context": "https://schema.org",
    "@type": "FAQPage",
    "mainEntity": [
      {
        "@type": "Question",
        "name": t('faq_question_1'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq_answer_1')
        }
      },
      {
        "@type": "Question",
        "name": t('faq_question_2'),
        "acceptedAnswer": {
          "@type": "Answer",
          "text": t('faq_answer_2')
        }
      }
    ]
  };

  return (
    <Helmet>
      <title>{langData.title}</title>
      <meta name="description" content={langData.description} />
      <meta property="og:title" content={langData.title} />
      <meta property="og:description" content={langData.description} />
      <meta property="twitter:title" content={langData.title} />
      <meta property="twitter:description" content={langData.description} />
      <script type="application/ld+json">{JSON.stringify(websiteSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(organizationSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(localBusinessSchema)}</script>
      <script type="application/ld+json">{JSON.stringify(faqSchema)}</script>
    </Helmet>
  );
}

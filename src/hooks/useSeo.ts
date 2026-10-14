import { useEffect } from 'react';
import { SITE_CONFIG } from '../config/site';

interface SeoProps {
  title?: string;
  description?: string;
  canonicalUrl?: string;
  ogImage?: string;
  ogType?: 'website' | 'article';
  publishedTime?: string;
  modifiedTime?: string;
  tags?: string[];
  jsonLd?: Record<string, any>;
}

export const useSeo = ({
  title,
  description,
  canonicalUrl,
  ogImage,
  ogType = 'website',
  publishedTime,
  modifiedTime,
  tags,
  jsonLd,
}: SeoProps) => {
  useEffect(() => {
    const siteTitle = SITE_CONFIG.defaultTitle;
    const finalTitle = title ? `${title} | Class S` : siteTitle;
    const finalDescription = description || SITE_CONFIG.defaultDescription;
    const currentUrl = canonicalUrl || window.location.href;
    const finalImage = ogImage || SITE_CONFIG.logoUrl;

    // 1. Update Title
    document.title = finalTitle;

    // Helper to update or create meta tags
    const setMetaTag = (attr: 'name' | 'property', key: string, content: string) => {
      let tag = document.querySelector(`meta[${attr}="${key}"]`);
      if (!tag) {
        tag = document.createElement('meta');
        tag.setAttribute(attr, key);
        document.head.appendChild(tag);
      }
      tag.setAttribute('content', content);
    };

    // 2. Standard Meta
    setMetaTag('name', 'description', finalDescription);

    // 3. Open Graph
    setMetaTag('property', 'og:title', finalTitle);
    setMetaTag('property', 'og:description', finalDescription);
    setMetaTag('property', 'og:url', currentUrl);
    setMetaTag('property', 'og:type', ogType);
    setMetaTag('property', 'og:image', finalImage);
    setMetaTag('property', 'og:site_name', 'Class S — Scott Nana');

    if (ogType === 'article') {
      if (publishedTime) {
        setMetaTag('property', 'article:published_time', publishedTime);
      }
      if (modifiedTime) {
        setMetaTag('property', 'article:modified_time', modifiedTime);
      }
      if (tags && tags.length > 0) {
        tags.forEach((tag) => setMetaTag('property', 'article:tag', tag));
      }
      setMetaTag('property', 'article:author', 'Scott Nana');
    }

    // 4. Twitter Card
    setMetaTag('name', 'twitter:card', 'summary_large_image');
    setMetaTag('name', 'twitter:title', finalTitle);
    setMetaTag('name', 'twitter:description', finalDescription);
    setMetaTag('name', 'twitter:image', finalImage);

    // 5. Canonical Link
    let canonicalTag = document.querySelector('link[rel="canonical"]');
    if (!canonicalTag) {
      canonicalTag = document.createElement('link');
      canonicalTag.setAttribute('rel', 'canonical');
      document.head.appendChild(canonicalTag);
    }
    canonicalTag.setAttribute('href', currentUrl);

    // 6. JSON-LD Structured Data
    const scriptId = 'class-s-jsonld';
    let scriptTag = document.getElementById(scriptId) as HTMLScriptElement | null;
    if (jsonLd) {
      if (!scriptTag) {
        scriptTag = document.createElement('script');
        scriptTag.id = scriptId;
        scriptTag.type = 'application/ld+json';
        document.head.appendChild(scriptTag);
      }
      scriptTag.textContent = JSON.stringify(jsonLd);
    } else if (scriptTag) {
      scriptTag.remove();
    }
  }, [
    title,
    description,
    canonicalUrl,
    ogImage,
    ogType,
    publishedTime,
    modifiedTime,
    tags,
    jsonLd,
  ]);
};

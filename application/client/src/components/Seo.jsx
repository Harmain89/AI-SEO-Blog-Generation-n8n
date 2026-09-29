import { Helmet } from 'react-helmet-async';

const SITE = 'Trendwire';

export default function Seo({ title, description, image, type = 'website', keywords }) {
  const fullTitle = title ? `${title} — ${SITE}` : `${SITE} — Automated Insights`;
  return (
    <Helmet>
      <title>{fullTitle}</title>
      {description && <meta name="description" content={description} />}
      {keywords && <meta name="keywords" content={keywords} />}
      <meta property="og:title" content={fullTitle} />
      {description && <meta property="og:description" content={description} />}
      <meta property="og:type" content={type} />
      {image && <meta property="og:image" content={image} />}
      <meta name="twitter:card" content={image ? 'summary_large_image' : 'summary'} />
    </Helmet>
  );
}

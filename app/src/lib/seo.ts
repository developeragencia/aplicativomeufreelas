export function setSEO(opts: { title?: string; description?: string; canonicalPath?: string }) {
  const { title, description, canonicalPath } = opts;
  if (typeof document !== 'undefined') {
    if (title) document.title = title;
    if (description) {
      let meta = document.querySelector('meta[name="description"]') as HTMLMetaElement | null;
      if (!meta) {
        meta = document.createElement('meta');
        meta.setAttribute('name', 'description');
        document.head.appendChild(meta);
      }
      meta.setAttribute('content', description);
    }
    if (canonicalPath) {
      let link = document.querySelector('link[rel="canonical"]') as HTMLLinkElement | null;
      if (!link) {
        link = document.createElement('link');
        link.setAttribute('rel', 'canonical');
        document.head.appendChild(link);
      }
      const origin = window.location.origin;
      link.setAttribute('href', origin + canonicalPath);
    }
  }
}

// src/utils/stylesManager.ts
export function addStyle(href?: string): void {
  if (href && href.trim() !== '') {
    try {
      const link = document.createElement('link');
      link.rel = 'stylesheet';
      link.type = 'text/css';
      link.href = href;
      link.classList.add('dynamic-style');
      document.head.appendChild(link);
    } catch (error) {
      console.error('Error adding style:', error);
    }
  }
}

export function removeStyle(href?: string): void {
  if (href && href.trim() !== '') {
    try {
      const links = document.querySelectorAll(`link[href="${href}"]`);
      links.forEach(link => link.remove());
    } catch (error) {
      console.error('Error removing style:', error);
    }
  }
}

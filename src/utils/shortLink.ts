// Short link generation and sharing utilities using TinyURL API

export interface ShareData {
  exampleId: string;
  exampleTitle: string;
  exampleDescription: string;
  code: string;
}

// Create shareable URL
export function createShareableUrl(exampleId: string, baseUrl: string = window.location.origin): string {
  const url = new URL(baseUrl);
  url.searchParams.set('example', exampleId);
  return url.toString();
}

// Create short link using TinyURL API
export async function createShortLink(exampleId: string, baseUrl: string = window.location.origin): Promise<string> {
  const fullUrl = createShareableUrl(exampleId, baseUrl);
  
  try {
    // Use TinyURL API to create short link
    const response = await fetch(`https://tinyurl.com/api-create.php?url=${encodeURIComponent(fullUrl)}`);
    
    if (response.ok) {
      const shortUrl = await response.text();
      // Validate that we got a proper TinyURL response
      if (shortUrl.startsWith('http') && shortUrl.includes('tinyurl.com')) {
        return shortUrl;
      }
    }
    
    // Fallback to full URL if TinyURL fails
    return fullUrl;
  } catch (error) {
    console.warn('Failed to create short link via TinyURL:', error);
    // Fallback to full URL if TinyURL fails
    return fullUrl;
  }
}

// Alternative short link service using is.gd API
export async function createShortLinkIsGd(exampleId: string, baseUrl: string = window.location.origin): Promise<string> {
  const fullUrl = createShareableUrl(exampleId, baseUrl);
  
  try {
    const response = await fetch(`https://is.gd/create.php?format=simple&url=${encodeURIComponent(fullUrl)}`);
    
    if (response.ok) {
      const shortUrl = await response.text();
      if (shortUrl.startsWith('http') && shortUrl.includes('is.gd')) {
        return shortUrl;
      }
    }
    
    return fullUrl;
  } catch (error) {
    console.warn('Failed to create short link via is.gd:', error);
    return fullUrl;
  }
}

// Create short link with fallback chain (TinyURL → is.gd → full URL)
export async function createShortLinkWithFallback(exampleId: string, baseUrl: string = window.location.origin): Promise<string> {
  try {
    // Try TinyURL first
    const tinyUrl = await createShortLink(exampleId, baseUrl);
    if (tinyUrl !== createShareableUrl(exampleId, baseUrl)) {
      return tinyUrl;
    }
    
    // Fallback to is.gd
    const isGdUrl = await createShortLinkIsGd(exampleId, baseUrl);
    if (isGdUrl !== createShareableUrl(exampleId, baseUrl)) {
      return isGdUrl;
    }
    
    // Final fallback to full URL
    return createShareableUrl(exampleId, baseUrl);
  } catch (error) {
    console.warn('All short link services failed:', error);
    return createShareableUrl(exampleId, baseUrl);
  }
}

// Share via Web Share API or fallback to clipboard
export async function shareExample(data: ShareData): Promise<boolean> {
  const shareableUrl = createShareableUrl(data.exampleId);
  const shortLink = await createShortLinkWithFallback(data.exampleId);
  
  const shareData = {
    title: `Canvas Academy - ${data.exampleTitle}`,
    text: `Check out this Canvas example: ${data.exampleDescription}`,
    url: shortLink
  };

  // Try Web Share API first (mobile)
  if (navigator.share && navigator.canShare && navigator.canShare(shareData)) {
    try {
      await navigator.share(shareData);
      return true;
    } catch (error) {
      // User cancelled or error occurred, fallback to clipboard
    }
  }

  // Fallback to clipboard
  try {
    await navigator.clipboard.writeText(shortLink);
    return true;
  } catch (error) {
    // Fallback to manual copy
    const textArea = document.createElement('textarea');
    textArea.value = shortLink;
    document.body.appendChild(textArea);
    textArea.select();
    document.execCommand('copy');
    document.body.removeChild(textArea);
    return true;
  }
}

// Copy to clipboard with feedback
export async function copyToClipboard(text: string): Promise<boolean> {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch (error) {
    // Fallback for older browsers
    const textArea = document.createElement('textarea');
    textArea.value = text;
    textArea.style.position = 'fixed';
    textArea.style.opacity = '0';
    document.body.appendChild(textArea);
    textArea.select();
    const success = document.execCommand('copy');
    document.body.removeChild(textArea);
    return success;
  }
}

// Generate shareable code snippet
export function generateCodeSnippet(data: ShareData): string {
  return `// ${data.exampleTitle}
// ${data.exampleDescription}
// Try this at: ${createShortLink(data.exampleId)}

${data.code}`;
}
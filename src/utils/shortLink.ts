// Short link generation and sharing utilities

export interface ShareData {
  exampleId: string;
  exampleTitle: string;
  exampleDescription: string;
  code: string;
}

// Generate a short hash for the example
export function generateShortHash(exampleId: string): string {
  // Simple hash function for demo purposes
  // In production, you might want to use a proper URL shortening service
  const hash = exampleId.split('').reduce((acc, char) => {
    const charCode = char.charCodeAt(0);
    return ((acc << 5) - acc) + charCode;
  }, 0);
  
  return Math.abs(hash).toString(36).substring(0, 6);
}

// Create shareable URL
export function createShareableUrl(exampleId: string, baseUrl: string = window.location.origin): string {
  const url = new URL(baseUrl);
  url.searchParams.set('example', exampleId);
  return url.toString();
}

// Create short link (for demo purposes, using fragment)
export function createShortLink(exampleId: string, baseUrl: string = window.location.origin): string {
  const shortHash = generateShortHash(exampleId);
  const url = new URL(baseUrl);
  url.searchParams.set('s', shortHash);
  return url.toString();
}

// Reverse lookup for short hash (in real app, this would be a database lookup)
export function resolveShortHash(shortHash: string): string | null {
  // This is a simple demo implementation
  // In production, you'd store hash->exampleId mappings in a database
  
  // Generate hash for all possible example IDs and create reverse mapping
  const exampleIds = [
    'basic-rectangle',
    'basic-circle', 
    'text-drawing',
    'custom-path',
    'gradient-background',
    'bouncing-ball',
    'mouse-trail',
    'particle-explosion',
    'simple-pong'
  ];
  
  // Create reverse mapping
  const exampleMap: Record<string, string> = {};
  exampleIds.forEach(id => {
    const hash = generateShortHash(id);
    exampleMap[hash] = id;
  });
  
  return exampleMap[shortHash] || null;
}

// Share via Web Share API or fallback to clipboard
export async function shareExample(data: ShareData): Promise<boolean> {
  const shareableUrl = createShareableUrl(data.exampleId);
  const shortLink = createShortLink(data.exampleId);
  
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
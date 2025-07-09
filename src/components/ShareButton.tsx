import React, { useState, useEffect } from 'react';
import { Share2, Copy, Check, ExternalLink, Loader } from 'lucide-react';
import { Example } from '../types';
import { shareExample, copyToClipboard, createShortLinkWithFallback, createShareableUrl } from '../utils/shortLink';

interface ShareButtonProps {
  example: Example;
  currentCode?: string;
  className?: string;
}

const ShareButton: React.FC<ShareButtonProps> = ({ example, currentCode, className = '' }) => {
  const [showShareMenu, setShowShareMenu] = useState(false);
  const [copyStatus, setCopyStatus] = useState<'idle' | 'copied' | 'error'>('idle');
  const [shareStatus, setShareStatus] = useState<'idle' | 'sharing' | 'shared' | 'error'>('idle');
  const [shortLink, setShortLink] = useState<string>('');
  const [isLoadingShortLink, setIsLoadingShortLink] = useState(false);

  const handleShare = async () => {
    setShareStatus('sharing');
    
    try {
      const success = await shareExample({
        exampleId: example.id,
        exampleTitle: example.title,
        exampleDescription: example.description,
        code: currentCode || example.code
      });
      
      if (success) {
        setShareStatus('shared');
        setTimeout(() => setShareStatus('idle'), 2000);
      } else {
        setShareStatus('error');
        setTimeout(() => setShareStatus('idle'), 2000);
      }
    } catch (error) {
      setShareStatus('error');
      setTimeout(() => setShareStatus('idle'), 2000);
    }
  };

  const handleCopyLink = async () => {
    if (!shortLink) {
      await generateShortLink();
    }
    
    try {
      const success = await copyToClipboard(shortLink);
      if (success) {
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
      } else {
        setCopyStatus('error');
        setTimeout(() => setCopyStatus('idle'), 2000);
      }
    } catch (error) {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const handleCopyFullUrl = async () => {
    const fullUrl = createShareableUrl(example.id);
    
    try {
      const success = await copyToClipboard(fullUrl);
      if (success) {
        setCopyStatus('copied');
        setTimeout(() => setCopyStatus('idle'), 2000);
      } else {
        setCopyStatus('error');
        setTimeout(() => setCopyStatus('idle'), 2000);
      }
    } catch (error) {
      setCopyStatus('error');
      setTimeout(() => setCopyStatus('idle'), 2000);
    }
  };

  const fullUrl = createShareableUrl(example.id);
  
  // Generate short link when component mounts or example changes
  const generateShortLink = async () => {
    setIsLoadingShortLink(true);
    try {
      const link = await createShortLinkWithFallback(example.id);
      setShortLink(link);
    } catch (error) {
      console.error('Failed to generate short link:', error);
      setShortLink(fullUrl); // Fallback to full URL
    } finally {
      setIsLoadingShortLink(false);
    }
  };
  
  useEffect(() => {
    if (showShareMenu && !shortLink) {
      generateShortLink();
    }
  }, [showShareMenu, example.id]);

  return (
    <div className={`relative ${className}`}>
      <button
        onClick={() => setShowShareMenu(!showShareMenu)}
        className="flex items-center space-x-2 px-3 py-1.5 text-sm font-medium text-gray-700 bg-white rounded-lg border border-gray-300 hover:bg-gray-50 transition-colors"
        title="Share this example"
      >
        <Share2 className="w-4 h-4" />
        <span>Share</span>
      </button>

      {showShareMenu && (
        <div className="absolute top-full mt-2 right-0 w-80 bg-white rounded-lg shadow-lg border border-gray-200 z-50">
          <div className="p-4">
            <h3 className="font-semibold text-gray-900 mb-3">Share "{example.title}"</h3>
            
            {/* Quick Share Button */}
            <button
              onClick={handleShare}
              disabled={shareStatus === 'sharing'}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 mb-3 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:bg-blue-400 transition-colors"
            >
              <Share2 className="w-4 h-4" />
              <span>
                {shareStatus === 'sharing' ? 'Sharing...' :
                 shareStatus === 'shared' ? 'Shared!' :
                 shareStatus === 'error' ? 'Error' :
                 'Quick Share'}
              </span>
            </button>

            {/* Short Link */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Short Link (TinyURL)
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={isLoadingShortLink ? 'Generating short link...' : shortLink || fullUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600"
                />
                <button
                  onClick={handleCopyLink}
                  disabled={isLoadingShortLink}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 disabled:bg-gray-100 transition-colors"
                >
                  {isLoadingShortLink ? (
                    <Loader className="w-4 h-4 animate-spin" />
                  ) : copyStatus === 'copied' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
              {shortLink && shortLink !== fullUrl && (
                <p className="text-xs text-green-600 mt-1">✓ TinyURL generated successfully</p>
              )}
            </div>

            {/* Full URL */}
            <div className="mb-3">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Full URL
              </label>
              <div className="flex items-center space-x-2">
                <input
                  type="text"
                  value={fullUrl}
                  readOnly
                  className="flex-1 px-3 py-2 text-sm border border-gray-300 rounded-md bg-gray-50 text-gray-600 text-xs"
                />
                <button
                  onClick={handleCopyFullUrl}
                  className="flex items-center space-x-1 px-3 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md hover:bg-gray-50 transition-colors"
                >
                  {copyStatus === 'copied' ? (
                    <Check className="w-4 h-4 text-green-600" />
                  ) : (
                    <Copy className="w-4 h-4" />
                  )}
                </button>
              </div>
            </div>

            {/* Copy Status */}
            {copyStatus === 'copied' && (
              <p className="text-sm text-green-600 mb-2">✓ Copied to clipboard!</p>
            )}
            {copyStatus === 'error' && (
              <p className="text-sm text-red-600 mb-2">✗ Failed to copy</p>
            )}

            {/* Open in new tab */}
            <button
              onClick={() => window.open(fullUrl, '_blank')}
              className="w-full flex items-center justify-center space-x-2 px-4 py-2 text-sm font-medium text-gray-700 bg-gray-100 rounded-lg hover:bg-gray-200 transition-colors"
            >
              <ExternalLink className="w-4 h-4" />
              <span>Open in new tab</span>
            </button>
          </div>
        </div>
      )}

      {/* Close menu when clicking outside */}
      {showShareMenu && (
        <div
          className="fixed inset-0 z-40"
          onClick={() => setShowShareMenu(false)}
        />
      )}
    </div>
  );
};

export default ShareButton;
// Security headers configuration for different deployment platforms
// This file provides CSP and other security headers for Canvas Academy

export const securityHeaders = {
  // Content Security Policy
  'Content-Security-Policy': [
    "default-src 'self'",
    "script-src 'self' 'unsafe-eval' blob:", // 'unsafe-eval' needed for Monaco editor and code execution
    "style-src 'self' 'unsafe-inline'", // 'unsafe-inline' needed for styled components
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "connect-src 'self'",
    "worker-src 'self' blob:", // blob: needed for web workers
    "object-src 'none'",
    "base-uri 'self'",
    "form-action 'self'",
    "frame-ancestors 'none'"
  ].join('; '),
  
  // Other security headers
  'X-Frame-Options': 'DENY',
  'X-Content-Type-Options': 'nosniff',
  'X-XSS-Protection': '1; mode=block',
  'Referrer-Policy': 'strict-origin-when-cross-origin',
  'Permissions-Policy': [
    'camera=()',
    'microphone=()',
    'geolocation=()',
    'payment=()',
    'usb=()',
    'magnetometer=()',
    'gyroscope=()',
    'accelerometer=()'
  ].join(', '),
  'Strict-Transport-Security': 'max-age=31536000; includeSubDomains; preload'
};

// For Express.js server
export const expressSecurityConfig = {
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-eval'", "blob:"],
      styleSrc: ["'self'", "'unsafe-inline'"],
      imgSrc: ["'self'", "data:", "blob:"],
      fontSrc: ["'self'", "data:"],
      connectSrc: ["'self'"],
      workerSrc: ["'self'", "blob:"],
      objectSrc: ["'none'"],
      baseUri: ["'self'"],
      formAction: ["'self'"],
      frameAncestors: ["'none'"]
    }
  },
  crossOriginEmbedderPolicy: false, // Disabled for compatibility
  crossOriginOpenerPolicy: false,
  crossOriginResourcePolicy: false,
  dnsPrefetchControl: true,
  frameguard: { action: 'deny' },
  hidePoweredBy: true,
  hsts: {
    maxAge: 31536000,
    includeSubDomains: true,
    preload: true
  },
  ieNoOpen: true,
  noSniff: true,
  originAgentCluster: true,
  permittedCrossDomainPolicies: false,
  referrerPolicy: 'strict-origin-when-cross-origin',
  xssFilter: true
};

// For Vercel vercel.json
export const vercelSecurityConfig = {
  "headers": [
    {
      "source": "/(.*)",
      "headers": Object.entries(securityHeaders).map(([key, value]) => ({
        key,
        value
      }))
    }
  ]
};

// For Apache .htaccess
export const apacheSecurityConfig = `
# Security Headers for Canvas Academy
<IfModule mod_headers.c>
    Header always set Content-Security-Policy "${securityHeaders['Content-Security-Policy']}"
    Header always set X-Frame-Options "${securityHeaders['X-Frame-Options']}"
    Header always set X-Content-Type-Options "${securityHeaders['X-Content-Type-Options']}"
    Header always set X-XSS-Protection "${securityHeaders['X-XSS-Protection']}"
    Header always set Referrer-Policy "${securityHeaders['Referrer-Policy']}"
    Header always set Permissions-Policy "${securityHeaders['Permissions-Policy']}"
    Header always set Strict-Transport-Security "${securityHeaders['Strict-Transport-Security']}"
</IfModule>
`;

// For Nginx
export const nginxSecurityConfig = `
# Security Headers for Canvas Academy
add_header Content-Security-Policy "${securityHeaders['Content-Security-Policy']}" always;
add_header X-Frame-Options "${securityHeaders['X-Frame-Options']}" always;
add_header X-Content-Type-Options "${securityHeaders['X-Content-Type-Options']}" always;
add_header X-XSS-Protection "${securityHeaders['X-XSS-Protection']}" always;
add_header Referrer-Policy "${securityHeaders['Referrer-Policy']}" always;
add_header Permissions-Policy "${securityHeaders['Permissions-Policy']}" always;
add_header Strict-Transport-Security "${securityHeaders['Strict-Transport-Security']}" always;
`;

// Security validation helper
export function validateSecurityHeaders(headers: Record<string, string>): boolean {
  const requiredHeaders = [
    'Content-Security-Policy',
    'X-Frame-Options',
    'X-Content-Type-Options',
    'X-XSS-Protection'
  ];
  
  return requiredHeaders.every(header => headers[header]);
}

// CSP violation reporting (for development)
export function handleCSPViolation(violationReport: any) {
  console.warn('CSP Violation:', violationReport);
  
  // In production, you might want to send this to a monitoring service
  if (process.env.NODE_ENV === 'production') {
    // Example: Send to monitoring service
    // fetch('/api/csp-violation', {
    //   method: 'POST',
    //   body: JSON.stringify(violationReport)
    // });
  }
}

// Add CSP violation event listener
if (typeof window !== 'undefined') {
  document.addEventListener('securitypolicyviolation', (e) => {
    handleCSPViolation({
      blockedURI: e.blockedURI,
      columnNumber: e.columnNumber,
      disposition: e.disposition,
      documentURI: e.documentURI,
      effectiveDirective: e.effectiveDirective,
      lineNumber: e.lineNumber,
      originalPolicy: e.originalPolicy,
      referrer: e.referrer,
      sample: e.sample,
      sourceFile: e.sourceFile,
      statusCode: e.statusCode,
      violatedDirective: e.violatedDirective
    });
  });
}
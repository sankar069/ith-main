/**
 * XSS Protection Tests
 * Validates DOMPurify sanitization prevents script injection
 */

import { describe, it, expect } from 'vitest';
import { sanitizeHTML, sanitizePlainText, sanitizeURL, createSafeHTML } from '../../src/lib/sanitize.js';

describe('XSS Protection', () => {
  describe('HTML Sanitization', () => {
    it('should allow safe HTML tags', () => {
      const clean = sanitizeHTML('<p>Hello <strong>World</strong></p>', 'richText');
      expect(clean).toContain('<p>');
      expect(clean).toContain('<strong>');
      expect(clean).toContain('Hello');
      expect(clean).toContain('World');
    });

    it('should remove script tags', () => {
      const dirty = '<p>Hello</p><script>alert("XSS")</script>';
      const clean = sanitizeHTML(dirty, 'richText');
      
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('alert');
      expect(clean).toContain('Hello');
    });

    it('should remove event handlers', () => {
      const dirty = '<p onclick="alert(\'XSS\')">Click me</p>';
      const clean = sanitizeHTML(dirty, 'richText');
      
      expect(clean).not.toContain('onclick');
      expect(clean).not.toContain('alert');
      expect(clean).toContain('Click me');
    });

    it('should remove javascript: URLs', () => {
      const dirty = '<a href="javascript:alert(\'XSS\')">Link</a>';
      const clean = sanitizeHTML(dirty, 'richText');
      
      expect(clean).not.toContain('javascript:');
      expect(clean).not.toContain('alert');
    });

    it('should remove onerror handlers', () => {
      const dirty = '<img src="x" onerror="alert(\'XSS\')">';
      const clean = sanitizeHTML(dirty, 'richText');
      
      expect(clean).not.toContain('onerror');
      expect(clean).not.toContain('alert');
    });

    it('should remove iframe tags', () => {
      const dirty = '<p>Safe</p><iframe src="https://evil.com"></iframe>';
      const clean = sanitizeHTML(dirty, 'richText');
      
      expect(clean).not.toContain('<iframe');
      expect(clean).not.toContain('evil.com');
      expect(clean).toContain('Safe');
    });

    it('should remove object and embed tags', () => {
      const dirty = '<object data="evil.swf"></object><embed src="evil.swf">';
      const clean = sanitizeHTML(dirty, 'richText');
      
      expect(clean).not.toContain('<object');
      expect(clean).not.toContain('<embed');
    });

    it('should remove style tags', () => {
      const dirty = '<style>body { display: none; }</style><p>Text</p>';
      const clean = sanitizeHTML(dirty, 'richText');
      
      expect(clean).not.toContain('<style>');
      expect(clean).toContain('Text');
    });

    it('should handle basic profile content', () => {
      const dirty = '<p>Hello</p><strong>Bold</strong>';
      const clean = sanitizeHTML(dirty, 'basic');
      
      expect(clean).toContain('<p>');
      expect(clean).toContain('<strong>');
    });

    it('should be more restrictive for userContent', () => {
      const dirty = '<p>Text</p><a href="http://example.com">Link</a>';
      const clean = sanitizeHTML(dirty, 'userContent');
      
      expect(clean).toContain('Text');
      // Links might be stripped in userContent profile
      expect(clean).not.toContain('href'); // userContent doesn't allow links
    });
  });

  describe('Plain Text Sanitization', () => {
    it('should strip all HTML', () => {
      const dirty = '<p>Hello <strong>World</strong></p>';
      const clean = sanitizePlainText(dirty);
      
      expect(clean).not.toContain('<p>');
      expect(clean).not.toContain('<strong>');
      expect(clean).toContain('Hello');
      expect(clean).toContain('World');
    });

    it('should remove script tags and content', () => {
      const dirty = 'Safe text<script>alert("XSS")</script>More text';
      const clean = sanitizePlainText(dirty);
      
      expect(clean).not.toContain('<script>');
      expect(clean).not.toContain('alert');
      expect(clean).toContain('Safe text');
      expect(clean).toContain('More text');
    });

    it('should handle empty input', () => {
      expect(sanitizePlainText('')).toBe('');
      expect(sanitizePlainText(null)).toBe('');
      expect(sanitizePlainText(undefined)).toBe('');
    });
  });

  describe('URL Sanitization', () => {
    it('should allow HTTPS URLs', () => {
      const url = 'https://example.com';
      const clean = sanitizeURL(url);
      
      expect(clean).toBe('https://example.com');
    });

    it('should allow HTTP URLs', () => {
      const url = 'http://example.com';
      const clean = sanitizeURL(url);
      
      expect(clean).toBe('http://example.com');
    });

    it('should block javascript: URLs', () => {
      const url = "javascript:alert('XSS')";
      const clean = sanitizeURL(url);
      
      expect(clean).toBe('');
    });

    it('should block data: URLs', () => {
      const url = 'data:text/html,<script>alert("XSS")</script>';
      const clean = sanitizeURL(url);
      
      expect(clean).toBe('');
    });

    it('should block vbscript: URLs', () => {
      const url = 'vbscript:alert("XSS")';
      const clean = sanitizeURL(url);
      
      expect(clean).toBe('');
    });

    it('should allow relative URLs', () => {
      const url = '/path/to/page';
      const clean = sanitizeURL(url);
      
      expect(clean).toBe('/path/to/page');
    });

    it('should allow mailto links', () => {
      const url = 'mailto:user@example.com';
      const clean = sanitizeURL(url);
      
      expect(clean).toBe('mailto:user@example.com');
    });

    it('should handle empty input', () => {
      expect(sanitizeURL('')).toBe('');
      expect(sanitizeURL(null)).toBe('');
    });
  });

  describe('React Safe HTML', () => {
    it('should create dangerouslySetInnerHTML prop', () => {
      const html = '<p>Safe content</p>';
      const prop = createSafeHTML(html, 'richText');
      
      expect(prop).toHaveProperty('__html');
      expect(prop.__html).toContain('<p>');
      expect(prop.__html).toContain('Safe content');
    });

    it('should sanitize malicious content', () => {
      const html = '<p>Text</p><script>alert("XSS")</script>';
      const prop = createSafeHTML(html, 'richText');
      
      expect(prop.__html).not.toContain('<script>');
      expect(prop.__html).not.toContain('alert');
      expect(prop.__html).toContain('Text');
    });
  });

  describe('Common XSS Payloads', () => {
    const xssPayloads = [
      '<img src=x onerror=alert(1)>',
      '<svg onload=alert(1)>',
      '<iframe src="javascript:alert(1)">',
      '<body onload=alert(1)>',
      '<input onfocus=alert(1) autofocus>',
      '<select onfocus=alert(1) autofocus>',
      '<textarea onfocus=alert(1) autofocus>',
      '<marquee onstart=alert(1)>',
      '<details open ontoggle=alert(1)>',
      '<img src="x" onerror="javascript:alert(1)">',
      '<script>alert(String.fromCharCode(88,83,83))</script>',
      '<img src="javascript:alert(1)">',
      '<object data="javascript:alert(1)">',
      '<embed src="javascript:alert(1)">',
    ];

    xssPayloads.forEach((payload, index) => {
      it(`should block XSS payload #${index + 1}`, () => {
        const clean = sanitizeHTML(payload, 'richText');
        
        expect(clean).not.toContain('alert');
        expect(clean).not.toContain('onerror');
        expect(clean).not.toContain('onload');
        expect(clean).not.toContain('onfocus');
        expect(clean).not.toContain('javascript:');
        expect(clean).not.toContain('<script');
      });
    });
  });
});

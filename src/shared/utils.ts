/**
 * Shared utilities for PowerApps Helper
 * Common functions used across content scripts, background, and UI components
 */

import { PowerAppsPageType, PageContext } from './types'

export class SharedUtils {
  /**
   * Detect PowerApps page type from URL
   */
  public static getPageType(url: string): PowerAppsPageType {
    if (url.includes('apps.powerapps.com/play/')) {
      return 'play'
    } else if (url.includes('make.powerapps.com/e/') && url.includes('/canvas/')) {
      return 'edit'
    } else if (url.includes('make.powerapps.com/environments/') && url.includes('/apps')) {
      return 'home'
    }
    return 'other'
  }

  /**
   * Extract page context from URL
   */
  public static getPageContext(url: string): PageContext {
    const type = this.getPageType(url)
    const context: PageContext = { type, url }

    // Extract app ID if present
    const appIdMatch = url.match(/\/apps\/([^/?]+)/) || url.match(/app-id=([^&]+)/)
    if (appIdMatch) {
      context.appId = appIdMatch[1]
    }

    // Extract environment ID if present
    const envIdMatch = url.match(/environments\/([^/?]+)/) || url.match(/\/e\/([^/?]+)/)
    if (envIdMatch) {
      context.environmentId = envIdMatch[1]
    }

    return context
  }

  /**
   * Generate unique message ID for tracking
   */
  public static generateMessageId(): string {
    return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
  }

  /**
   * Safe JSON parse with fallback
   */
  public static safeJsonParse<T>(json: string, fallback: T): T {
    try {
      return JSON.parse(json)
    } catch {
      return fallback
    }
  }
}

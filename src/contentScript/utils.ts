/**
 * Content Script specific utility functions for PowerApps Helper
 * DOM manipulation and browser-specific utilities
 */

export class ContentScriptUtils {
  /**
   * Wait for DOM to be ready
   */
  public static waitForDOMReady(): Promise<void> {
    return new Promise((resolve) => {
      if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => resolve())
      } else {
        resolve()
      }
    })
  }

  /**
   * Wait for specific element to exist in DOM
   */
  public static waitForElement(selector: string, timeout: number = 10000): Promise<Element | null> {
    return new Promise((resolve) => {
      const element = document.querySelector(selector)
      if (element) {
        resolve(element)
        return
      }

      const observer = new MutationObserver(() => {
        const element = document.querySelector(selector)
        if (element) {
          observer.disconnect()
          resolve(element)
        }
      })

      observer.observe(document.body, {
        childList: true,
        subtree: true,
      })

      // Timeout fallback
      setTimeout(() => {
        observer.disconnect()
        resolve(null)
      }, timeout)
    })
  }

  /**
   * Debounce function calls
   */
  public static debounce<T extends (...args: any[]) => any>(
    func: T,
    wait: number,
  ): (...args: Parameters<T>) => void {
    let timeout: NodeJS.Timeout | null = null

    return (...args: Parameters<T>) => {
      if (timeout) {
        clearTimeout(timeout)
      }
      timeout = setTimeout(() => func(...args), wait)
    }
  }

  /**
   * Inject CSS into the page
   */
  public static injectCSS(css: string, id?: string): void {
    const style = document.createElement('style')
    style.textContent = css
    if (id) {
      style.id = id
    }
    document.head.appendChild(style)
  }

  /**
   * Remove injected CSS
   */
  public static removeCSS(id: string): void {
    const style = document.getElementById(id)
    if (style) {
      style.remove()
    }
  }

  /**
   * Check if element is visible in viewport
   */
  public static isElementInViewport(element: Element): boolean {
    const rect = element.getBoundingClientRect()
    return (
      rect.top >= 0 &&
      rect.left >= 0 &&
      rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
      rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    )
  }

  /**
   * Scroll element into view smoothly
   */
  public static scrollToElement(element: Element): void {
    element.scrollIntoView({ behavior: 'smooth', block: 'center' })
  }
}

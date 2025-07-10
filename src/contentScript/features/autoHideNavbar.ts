/**
 * Auto-hide navigation bar feature for PowerApps play screen
 * Adds &hidenavbar=true to the URL if not already present
 */

export class AutoHideNavbar {
  private static readonly PLAY_SCREEN_IDENTIFIER = 'apps.powerapps.com/play/'
  private static readonly HIDE_NAVBAR_PARAM = 'hidenavbar'

  /**
   * Check if current URL is PowerApps play screen
   */
  private static isPlayScreen(): boolean {
    return window.location.href.includes(this.PLAY_SCREEN_IDENTIFIER)
  }

  /**
   * Check if hidenavbar parameter is already present in URL
   */
  private static hasHideNavbarParam(): boolean {
    const urlParams = new URLSearchParams(window.location.search)
    return urlParams.has(this.HIDE_NAVBAR_PARAM)
  }

  /**
   * Add hidenavbar=true parameter to URL and reload
   */
  private static addHideNavbarParam(): void {
    const currentUrl = window.location.href
    const separator = currentUrl.includes('?') ? '&' : '?'
    const newUrl = `${currentUrl}${separator}${this.HIDE_NAVBAR_PARAM}=true`

    console.info('PowerApps Helper - Auto-hiding navbar, redirecting to:', newUrl)
    window.location.href = newUrl
  }

  /**
   * Execute auto-hide navbar functionality
   */
  public static execute(): void {
    if (!this.isPlayScreen()) {
      return
    }

    if (!this.hasHideNavbarParam()) {
      this.addHideNavbarParam()
    } else {
      console.info('PowerApps Helper - Navbar already hidden')
    }
  }
}

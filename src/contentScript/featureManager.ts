/**
 * Feature manager for PowerApps Helper
 * Manages and executes all features based on current page context
 */

import { AutoHideNavbar } from './features/autoHideNavbar'
import { SharedUtils } from '../shared/utils'
import { MessageService } from '../shared/messageService'
import { StorageService } from '../shared/storageService'
import { ExtensionMessage, FeatureConfig } from '../shared/types'

export class FeatureManager {
  private static features = {
    autoHideNavbar: AutoHideNavbar,
  }

  private static featureConfig: FeatureConfig | null = null

  /**
   * Initialize and execute all applicable features
   */
  public static async initialize(): Promise<void> {
    console.info('PowerApps Helper - Feature Manager initializing')

    // Load feature configuration
    await this.loadFeatureConfig()

    // Listen for feature updates from background
    MessageService.onMessage(this.handleMessage.bind(this))

    // Execute features based on current page
    await this.executeFeatures()
  }

  /**
   * Load feature configuration from storage
   */
  private static async loadFeatureConfig(): Promise<void> {
    try {
      this.featureConfig = await StorageService.getFeatureConfig()
      console.info('Feature configuration loaded:', this.featureConfig)
    } catch (error) {
      console.error('Failed to load feature configuration:', error)
      // Use default configuration
      this.featureConfig = {
        autoHideNavbar: true,
      }
    }
  }

  /**
   * Handle messages from background script
   */
  private static handleMessage(message: ExtensionMessage): void {
    if (message.type === 'FEATURE_UPDATED') {
      const { featureName, enabled } = message.payload

      if (this.featureConfig) {
        this.featureConfig[featureName as keyof FeatureConfig] = enabled
        console.info(`Feature ${featureName} ${enabled ? 'enabled' : 'disabled'}`)

        // Re-execute features with new configuration
        this.executeFeatures()
      }
    }
  }

  /**
   * Execute all features that apply to current page
   */
  private static async executeFeatures(): Promise<void> {
    if (!this.featureConfig) {
      console.warn('Feature configuration not loaded')
      return
    }

    const pageContext = SharedUtils.getPageContext(window.location.href)
    console.info('Page context:', pageContext)

    // Execute auto-hide navbar feature
    if (this.featureConfig.autoHideNavbar && pageContext.type === 'play') {
      this.features.autoHideNavbar.execute()
    }
  }
}

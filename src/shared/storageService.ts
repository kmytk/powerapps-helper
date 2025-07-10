/**
 * Storage service for extension settings and data
 */

import { ExtensionConfig, FeatureConfig } from './types'

export class StorageService {
  private static readonly STORAGE_KEYS = {
    CONFIG: 'powerapps_helper_config',
    FEATURES: 'powerapps_helper_features',
    LOGS: 'powerapps_helper_logs',
  }

  private static readonly DEFAULT_CONFIG: ExtensionConfig = {
    features: {
      autoHideNavbar: true,
    },
    version: '1.0.0',
  }

  /**
   * Get extension configuration
   */
  public static async getConfig(): Promise<ExtensionConfig> {
    return new Promise((resolve) => {
      chrome.storage.sync.get([this.STORAGE_KEYS.CONFIG], (result) => {
        const config = result[this.STORAGE_KEYS.CONFIG] || this.DEFAULT_CONFIG
        resolve(config)
      })
    })
  }

  /**
   * Save extension configuration
   */
  public static async saveConfig(config: ExtensionConfig): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.set(
        {
          [this.STORAGE_KEYS.CONFIG]: config,
        },
        resolve,
      )
    })
  }

  /**
   * Get feature configuration
   */
  public static async getFeatureConfig(): Promise<FeatureConfig> {
    const config = await this.getConfig()
    return config.features
  }

  /**
   * Update feature configuration
   */
  public static async updateFeatureConfig(features: Partial<FeatureConfig>): Promise<void> {
    const config = await this.getConfig()
    config.features = { ...config.features, ...features }
    await this.saveConfig(config)
  }

  /**
   * Toggle specific feature
   */
  public static async toggleFeature(
    featureName: keyof FeatureConfig,
    enabled: boolean,
  ): Promise<void> {
    const config = await this.getConfig()
    config.features[featureName] = enabled
    await this.saveConfig(config)
  }

  /**
   * Clear all stored data
   */
  public static async clearAll(): Promise<void> {
    return new Promise((resolve) => {
      chrome.storage.sync.clear(resolve)
    })
  }
}

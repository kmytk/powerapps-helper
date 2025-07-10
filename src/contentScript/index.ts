/**
 * PowerApps Helper - Content Script Entry Point
 * Manages and initializes all PowerApps enhancement features
 */

import { FeatureManager } from './featureManager'
import { ContentScriptUtils } from './utils'

console.info('PowerApps Helper - Content Script initializing')

/**
 * Initialize PowerApps Helper features
 */
async function initialize(): Promise<void> {
  try {
    // Wait for DOM to be ready
    await ContentScriptUtils.waitForDOMReady()

    // Initialize feature manager
    await FeatureManager.initialize()

    console.info('PowerApps Helper - All features initialized successfully')
  } catch (error) {
    console.error('PowerApps Helper - Error during initialization:', error)
  }
}

// Start initialization
initialize()

/**
 * PowerApps Helper - Background Script
 * Handles extension lifecycle, storage, and communication between components
 */

import { MessageService } from '../shared/messageService'
import { StorageService } from '../shared/storageService'
import { ExtensionMessage, FeatureToggleMessage, LogMessage } from '../shared/types'

console.log('PowerApps Helper - Background script is running')

/**
 * Handle messages from content scripts and UI components
 */
MessageService.onMessage(async (message: ExtensionMessage, sender) => {
  console.log('Background received message:', message.type, message.payload)

  switch (message.type) {
    case 'FEATURE_TOGGLE':
      await handleFeatureToggle(message as FeatureToggleMessage)
      break

    case 'LOG':
      handleLog(message as LogMessage)
      break

    case 'GET_CONFIG':
      return await StorageService.getConfig()

    case 'GET_FEATURES':
      return await StorageService.getFeatureConfig()

    default:
      console.warn('Unknown message type:', message.type)
  }
})

/**
 * Handle feature toggle requests
 */
async function handleFeatureToggle(message: FeatureToggleMessage): Promise<void> {
  const { featureName, enabled } = message.payload

  try {
    await StorageService.toggleFeature(featureName as any, enabled)
    console.log(`Feature ${featureName} ${enabled ? 'enabled' : 'disabled'}`)

    // Notify all tabs about the feature change
    const tabs = await chrome.tabs.query({
      url: ['https://apps.powerapps.com/*', 'https://make.powerapps.com/*'],
    })

    for (const tab of tabs) {
      if (tab.id) {
        try {
          await MessageService.sendToContentScript(tab.id, {
            type: 'FEATURE_UPDATED',
            payload: { featureName, enabled },
          })
        } catch (error) {
          console.warn('Failed to notify tab:', tab.id, error)
        }
      }
    }
  } catch (error) {
    console.error('Failed to toggle feature:', error)
  }
}

/**
 * Handle log messages
 */
function handleLog(message: LogMessage): void {
  const { level, message: logMessage, data } = message.payload

  switch (level) {
    case 'info':
      console.info('Content Script:', logMessage, data)
      break
    case 'warn':
      console.warn('Content Script:', logMessage, data)
      break
    case 'error':
      console.error('Content Script:', logMessage, data)
      break
  }
}

/**
 * Initialize extension on install
 */
chrome.runtime.onInstalled.addListener(async (details) => {
  console.log('PowerApps Helper installed:', details.reason)

  // Initialize default configuration
  const config = await StorageService.getConfig()
  console.log('Current configuration:', config)
})

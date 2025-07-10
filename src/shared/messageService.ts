/**
 * Message service for communication between extension components
 */

import { ExtensionMessage, FeatureToggleMessage, FeatureStatusMessage, LogMessage } from './types'

export class MessageService {
  /**
   * Send message to background script
   */
  public static sendToBackground(message: ExtensionMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.runtime.sendMessage(message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(response)
        }
      })
    })
  }

  /**
   * Send message to content script
   */
  public static sendToContentScript(tabId: number, message: ExtensionMessage): Promise<any> {
    return new Promise((resolve, reject) => {
      chrome.tabs.sendMessage(tabId, message, (response) => {
        if (chrome.runtime.lastError) {
          reject(chrome.runtime.lastError)
        } else {
          resolve(response)
        }
      })
    })
  }

  /**
   * Send feature toggle message
   */
  public static sendFeatureToggle(featureName: string, enabled: boolean): Promise<any> {
    const message: FeatureToggleMessage = {
      type: 'FEATURE_TOGGLE',
      payload: { featureName, enabled },
      timestamp: Date.now(),
    }
    return this.sendToBackground(message)
  }

  /**
   * Send log message
   */
  public static sendLog(
    level: 'info' | 'warn' | 'error',
    message: string,
    data?: any,
  ): Promise<any> {
    const logMessage: LogMessage = {
      type: 'LOG',
      payload: { level, message, data },
      timestamp: Date.now(),
    }
    return this.sendToBackground(logMessage)
  }

  /**
   * Listen for messages
   */
  public static onMessage(
    callback: (message: ExtensionMessage, sender: chrome.runtime.MessageSender) => void,
  ): void {
    chrome.runtime.onMessage.addListener(callback)
  }
}

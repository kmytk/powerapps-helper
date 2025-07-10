/**
 * Shared types and interfaces for PowerApps Helper
 */

// Message types for communication between different parts of the extension
export interface ExtensionMessage {
  type: string
  payload?: any
  timestamp?: number
}

// Feature-specific message types
export interface FeatureToggleMessage extends ExtensionMessage {
  type: 'FEATURE_TOGGLE'
  payload: {
    featureName: string
    enabled: boolean
  }
}

export interface FeatureStatusMessage extends ExtensionMessage {
  type: 'FEATURE_STATUS'
  payload: {
    features: Record<string, boolean>
  }
}

export interface LogMessage extends ExtensionMessage {
  type: 'LOG'
  payload: {
    level: 'info' | 'warn' | 'error'
    message: string
    data?: any
  }
}

// Configuration types
export interface FeatureConfig {
  autoHideNavbar: boolean
  // Future features will be added here
}

export interface ExtensionConfig {
  features: FeatureConfig
  version: string
}

// Page context types
export type PowerAppsPageType = 'play' | 'edit' | 'home' | 'other'

export interface PageContext {
  type: PowerAppsPageType
  url: string
  appId?: string
  environmentId?: string
}

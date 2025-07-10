# PowerApps Helper - Content Script Architecture

## Directory Structure

```text
src/contentScript/
├── index.ts              # Entry point - initializes all features
├── featureManager.ts     # Manages feature execution based on page context
├── utils.ts              # DOM-specific utility functions
└── features/
    ├── autoHideNavbar.ts # Auto-hide navbar feature
    └── [future features] # Additional features will be added here
```

## Architecture Overview

### 1. Entry Point (`index.ts`)

- Initializes the content script
- Manages feature initialization timing
- Handles global error handling

### 2. Feature Manager (`featureManager.ts`)

- Integrates with shared services (MessageService, StorageService)
- Determines current page type using SharedUtils
- Executes appropriate features based on context and configuration
- Listens for real-time feature toggle messages

### 3. Features Directory (`features/`)

- Each feature is implemented as a separate class
- Features are self-contained and independent
- Easy to add/remove/modify individual features

### 4. Content Script Utilities (`utils.ts`)

- DOM manipulation helpers (waitForElement, injectCSS, etc.)
- Browser-specific utilities (viewport detection, scrolling)
- Content script specific functions (different from shared/utils.ts)

## Integration with Shared Services

### Message Communication

```typescript
// Listen for feature toggles from background/popup
MessageService.onMessage(this.handleMessage.bind(this))

// Send logs to background for debugging
MessageService.sendLog('info', 'Feature executed')
```

### Storage Integration

```typescript
// Load user preferences
this.featureConfig = await StorageService.getFeatureConfig()

// Features respect user settings
if (this.featureConfig.autoHideNavbar) {
  this.features.autoHideNavbar.execute()
}
```

## Adding New Features

### Step 1: Create Feature Implementation

```typescript
// src/contentScript/features/newFeature.ts
export class NewFeature {
  public static execute(): void {
    // Feature implementation
  }
}
```

### Step 2: Update Feature Manager

```typescript
// src/contentScript/featureManager.ts
import { NewFeature } from './features/newFeature'

private static features = {
  autoHideNavbar: AutoHideNavbar,
  newFeature: NewFeature  // Add here
}
```

### Step 3: Add to executeFeatures()

```typescript
// Execute based on page context and user settings
if (this.featureConfig.newFeature && pageContext.type === 'edit') {
  this.features.newFeature.execute()
}
```

## Benefits

- **Integration**: Seamless integration with shared services
- **Real-time Updates**: Features can be toggled from popup/options
- **Type Safety**: Full TypeScript support across all modules
- **Modularity**: Each feature is independent and testable
- **Configuration**: User preferences are respected and persistent

# PowerApps Helper - Extension Architecture

## 🏗️ **Complete Project Structure**

```text
src/
├── 📁 shared/                    # Shared utilities and types
│   ├── types.ts                  # TypeScript interfaces and types
│   ├── utils.ts                  # Common utility functions
│   ├── messageService.ts         # Inter-component communication
│   └── storageService.ts         # Chrome storage management
│
├── 📁 background/                # Background script (Service Worker)
│   └── index.ts                  # Background script entry point
│
├── 📁 contentScript/             # Content scripts for web pages
│   ├── index.ts                  # Content script entry point
│   ├── featureManager.ts         # Feature execution management
│   ├── utils.ts                  # Content script specific utilities
│   ├── features/                 # Individual feature implementations
│   │   └── autoHideNavbar.ts     # Auto-hide navbar feature
│   └── README.md                 # Content script documentation
│
├── 📁 popup/                     # Extension popup UI
│   ├── index.tsx                 # Popup entry point
│   ├── Popup.tsx                 # Main popup component
│   └── Popup.css                 # Popup styles
│
├── 📁 options/                   # Extension options page
│   ├── index.tsx                 # Options entry point
│   ├── Options.tsx               # Main options component
│   └── Options.css               # Options styles
│
├── 📁 sidepanel/                 # Extension side panel
│   ├── index.tsx                 # Side panel entry point
│   ├── SidePanel.tsx             # Main side panel component
│   └── SidePanel.css             # Side panel styles
│
├── 📁 devtools/                  # Chrome DevTools extension
│   ├── index.tsx                 # DevTools entry point
│   ├── DevTools.tsx              # Main DevTools component
│   └── DevTools.css              # DevTools styles
│
└── 📁 newtab/                    # New tab page (optional)
    ├── index.tsx                 # New tab entry point
    ├── NewTab.tsx                # Main new tab component
    └── NewTab.css                # New tab styles
```

## 🔄 **Component Communication Flow**

```text
┌─────────────────┐    ┌─────────────────┐    ┌─────────────────┐
│   UI Components │    │  Background     │    │  Content Script │
│  (Popup/Options)│    │    Script       │    │    (Features)   │
└─────────────────┘    └─────────────────┘    └─────────────────┘
         │                       │                       │
         │   Send Settings       │                       │
         ├──────────────────────►│                       │
         │                       │   Feature Toggle      │
         │                       ├──────────────────────►│
         │                       │                       │
         │   Get Status          │                       │
         ├──────────────────────►│                       │
         │                       │   Send Status         │
         │                       ├──────────────────────►│
         │                       │                       │
         │                       │   Log Messages        │
         │                       │◄──────────────────────┤
```

## 🎯 **Key Architecture Benefits**

### **1. Separation of Concerns**

- **Background**: Handles storage, communication, and lifecycle
- **Content Script**: Manages page-specific features
- **UI Components**: Provide user interface and settings
- **Shared**: Common utilities and types

### **2. Type Safety**

- Shared TypeScript interfaces ensure consistency
- Type-safe communication between components
- Compile-time error detection

### **3. Scalability**

- Easy to add new features in `contentScript/features/`
- Modular UI components for different use cases
- Centralized configuration management

### **4. Maintainability**

- Clear separation of responsibilities
- Consistent code organization
- Comprehensive documentation

## 🛠️ **Adding New Features**

### **Step 1: Create Feature Implementation**

```typescript
// src/contentScript/features/newFeature.ts
export class NewFeature {
  public static execute(): void {
    // Feature implementation
  }
}
```

### **Step 2: Update Types**

```typescript
// src/shared/types.ts
export interface FeatureConfig {
  autoHideNavbar: boolean
  newFeature: boolean  // Add new feature
}
```

### **Step 3: Register Feature**

```typescript
// src/contentScript/featureManager.ts
import { NewFeature } from './features/newFeature'

private static features = {
  autoHideNavbar: AutoHideNavbar,
  newFeature: NewFeature  // Add to features
}
```

### **Step 4: Update UI (Optional)**

```typescript
// src/popup/Popup.tsx or src/options/Options.tsx
// Add toggle controls for the new feature
```

## 🔧 **Development Workflow**

1. **Add Feature**: Create in `contentScript/features/`
2. **Update Types**: Add to `shared/types.ts`
3. **Register**: Add to `featureManager.ts`
4. **Test**: Build and load extension
5. **UI**: Add controls in popup/options
6. **Document**: Update README files

This architecture ensures PowerApps Helper is maintainable, scalable, and follows Chrome extension best practices.

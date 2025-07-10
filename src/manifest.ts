import { defineManifest } from '@crxjs/vite-plugin'
import packageData from '../package.json'

//@ts-ignore
const isDev = process.env.NODE_ENV == 'development'

export default defineManifest({
  name: `${packageData.displayName || packageData.name}${isDev ? ` ➡️ Dev` : ''}`,
  description: packageData.description,
  version: packageData.version,
  manifest_version: 3,
  icons: {
    16: 'img/logo-16.png' as const,
    32: 'img/logo-32.png' as const,
    48: 'img/logo-48.png' as const,
    128: 'img/logo-128.png' as const,
  },
  action: {
    default_popup: 'popup.html' as const,
    default_icon: {
      48: 'img/logo-48.png' as const,
    },
  },
  options_page: 'options.html' as const,
  devtools_page: 'devtools.html' as const,
  background: {
    service_worker: 'src/background/index.ts' as const,
    type: 'module',
  },
  content_scripts: [
    {
      matches: [
        'https://apps.powerapps.com/play/*',
        'https://make.powerapps.com/environments/*/apps*',
        'https://make.powerapps.com/e/*/canvas/*',
      ] as const,
      js: ['src/contentScript/index.ts' as const],
    },
  ],
  side_panel: {
    default_path: 'sidepanel.html' as const,
  },
  web_accessible_resources: [
    {
      resources: [
        'img/logo-16.png' as const,
        'img/logo-32.png' as const,
        'img/logo-48.png' as const,
        'img/logo-128.png' as const,
      ],
      matches: [] as const,
    },
  ],
  permissions: ['sidePanel', 'storage'] as const,
  chrome_url_overrides: {
    newtab: 'newtab.html' as const,
  },
} as any)

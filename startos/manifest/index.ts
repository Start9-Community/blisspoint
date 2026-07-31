import { setupManifest } from '@start9labs/start-sdk'
import { long, short } from './i18n'

export const manifest = setupManifest({
  id: 'blisspoint',
  title: 'Blisspoint',
  license: 'MIT',
  packageRepo: 'https://github.com/Start9-Community/blisspoint',
  upstreamRepo: 'https://github.com/heatpunk/blisspoint',
  marketingUrl: 'https://github.com/heatpunk/blisspoint',
  donationUrl: null,
  description: { short, long },
  volumes: ['main'],
  images: {
    blisspoint: {
      source: { dockerTag: 'ghcr.io/heatpunk/blisspoint:0.5.4' },
      arch: ['x86_64', 'aarch64'],
    },
  },
  dependencies: {},
})

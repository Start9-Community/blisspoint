import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.5.3:1',
  releaseNotes: {
    en_US:
      'Blisspoint now installs on ARM (aarch64) servers as well as x86_64. The app itself is unchanged; this release is packaging work only.',
    es_ES:
      'Blisspoint ahora se instala en servidores ARM (aarch64) además de x86_64. La aplicación no ha cambiado; esta versión solo contiene trabajo de empaquetado.',
    de_DE:
      'Blisspoint lässt sich jetzt auch auf ARM-Servern (aarch64) installieren, nicht nur auf x86_64. Die App selbst ist unverändert; diese Version enthält ausschließlich Paketierungsarbeit.',
    pl_PL:
      'Blisspoint instaluje się teraz również na serwerach ARM (aarch64), nie tylko x86_64. Sama aplikacja jest bez zmian; to wydanie zawiera wyłącznie prace nad pakietem.',
    fr_FR:
      "Blisspoint s'installe désormais sur les serveurs ARM (aarch64) en plus des x86_64. L'application elle-même est inchangée ; cette version ne contient que du travail d'empaquetage.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})

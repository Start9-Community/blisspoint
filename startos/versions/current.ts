import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.5.4:0',
  releaseNotes: {
    en_US:
      'Your miners are now saved on the server instead of only in the browser, so your setup is included in backups and appears on every device you open Blisspoint from. Blisspoint also installs on ARM servers now, not just x86_64.',
    es_ES:
      'Tus mineros ahora se guardan en el servidor y no solo en el navegador, así tu configuración se incluye en las copias de seguridad y aparece en todos los dispositivos desde los que abras Blisspoint. Blisspoint también se instala en servidores ARM, no solo x86_64.',
    de_DE:
      'Deine Miner werden jetzt auf dem Server gespeichert statt nur im Browser. Deine Einrichtung ist damit in Backups enthalten und erscheint auf jedem Gerät, von dem aus du Blisspoint öffnest. Blisspoint lässt sich außerdem auf ARM-Servern installieren, nicht nur auf x86_64.',
    pl_PL:
      'Twoje koparki są teraz zapisywane na serwerze, a nie tylko w przeglądarce, więc konfiguracja trafia do kopii zapasowych i pojawia się na każdym urządzeniu, z którego otworzysz Blisspoint. Blisspoint instaluje się też na serwerach ARM, nie tylko x86_64.',
    fr_FR:
      "Vos mineurs sont désormais enregistrés sur le serveur et non plus seulement dans le navigateur : votre configuration est incluse dans les sauvegardes et apparaît sur tous les appareils depuis lesquels vous ouvrez Blisspoint. Blisspoint s'installe également sur les serveurs ARM, et plus seulement x86_64.",
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})

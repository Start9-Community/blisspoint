import { IMPOSSIBLE, VersionInfo } from '@start9labs/start-sdk'

export const current = VersionInfo.of({
  version: '0.6.0:1',
  releaseNotes: {
    en_US: `Ships the package's own README instead of the upstream application's, which the build was picking up by mistake. Nothing about the service itself changes.

Everything below shipped in 0.6.0:0, the first release of Blisspoint on StartOS, built on upstream 0.6.0.

**Scan LAN finds miners on more networks.** It used to sweep only \`192.168.1.x\` until you had added a miner by hand. It now also sweeps the network your server is actually on, plus \`192.168.0.x\` and \`10.0.0.x\`.

**Saved miner passwords are encrypted on disk.** They are stored under AES-256-GCM rather than as plain text. Note the key lives in the same volume, so a backup still contains everything needed to read them — keep backups somewhere you trust.

Full notes: https://github.com/heatpunk/blisspoint/releases/tag/v0.6.0`,
    es_ES: `Incluye el README del propio paquete en lugar del de la aplicación original, que la compilación tomaba por error. El servicio en sí no cambia.

Todo lo siguiente se publicó en 0.6.0:0, la primera versión de Blisspoint en StartOS, basada en la 0.6.0 original.

**Escanear la red local encuentra mineros en más redes.** Antes solo recorría \`192.168.1.x\` hasta que añadías un minero a mano. Ahora recorre también la red en la que está tu servidor, además de \`192.168.0.x\` y \`10.0.0.x\`.

**Las contraseñas guardadas de los mineros se cifran en disco.** Se almacenan con AES-256-GCM en lugar de como texto plano. Ten en cuenta que la clave está en el mismo volumen, así que una copia de seguridad sigue conteniendo todo lo necesario para leerlas: guarda las copias en un sitio de confianza.

Notas completas: https://github.com/heatpunk/blisspoint/releases/tag/v0.6.0`,
    de_DE: `Liefert die README des Pakets selbst statt der der Upstream-Anwendung, die der Build versehentlich übernommen hat. Am Dienst selbst ändert sich nichts.

Alles Folgende erschien in 0.6.0:0, der ersten Veröffentlichung von Blisspoint auf StartOS, basierend auf Upstream 0.6.0.

**Die LAN-Suche findet Miner in mehr Netzwerken.** Bisher wurde nur \`192.168.1.x\` durchsucht, bis du einen Miner von Hand hinzugefügt hast. Jetzt wird zusätzlich das Netzwerk durchsucht, in dem dein Server tatsächlich steht, sowie \`192.168.0.x\` und \`10.0.0.x\`.

**Gespeicherte Miner-Passwörter werden auf der Festplatte verschlüsselt.** Sie liegen als AES-256-GCM statt im Klartext vor. Beachte, dass der Schlüssel im selben Volume liegt — ein Backup enthält also weiterhin alles, was zum Lesen nötig ist. Bewahre Backups an einem sicheren Ort auf.

Vollständige Hinweise: https://github.com/heatpunk/blisspoint/releases/tag/v0.6.0`,
    pl_PL: `Dołącza README samego pakietu zamiast README aplikacji źródłowej, które build pobierał przez pomyłkę. Sama usługa się nie zmienia.

Wszystko poniżej ukazało się w 0.6.0:0, pierwszym wydaniu Blisspoint na StartOS, opartym na wersji 0.6.0 projektu źródłowego.

**Skanowanie sieci lokalnej znajduje koparki w większej liczbie sieci.** Wcześniej przeszukiwana była tylko sieć \`192.168.1.x\`, dopóki nie dodałeś koparki ręcznie. Teraz przeszukiwana jest także sieć, w której faktycznie znajduje się twój serwer, oraz \`192.168.0.x\` i \`10.0.0.x\`.

**Zapisane hasła koparek są szyfrowane na dysku.** Przechowywane są w AES-256-GCM zamiast jako zwykły tekst. Pamiętaj, że klucz leży w tym samym wolumenie, więc kopia zapasowa nadal zawiera wszystko, co potrzebne do ich odczytania — trzymaj kopie w zaufanym miejscu.

Pełne informacje: https://github.com/heatpunk/blisspoint/releases/tag/v0.6.0`,
    fr_FR: `Embarque le README du paquet lui-même plutôt que celui de l'application d'origine, que la compilation récupérait par erreur. Le service lui-même ne change pas.

Tout ce qui suit est paru dans 0.6.0:0, la première version de Blisspoint sur StartOS, basée sur la version 0.6.0 du projet d'origine.

**L'analyse du réseau local trouve des mineurs sur davantage de réseaux.** Elle ne balayait que \`192.168.1.x\` tant que vous n'aviez pas ajouté un mineur à la main. Elle balaie désormais aussi le réseau sur lequel se trouve réellement votre serveur, ainsi que \`192.168.0.x\` et \`10.0.0.x\`.

**Les mots de passe de mineur enregistrés sont chiffrés sur le disque.** Ils sont stockés en AES-256-GCM plutôt qu'en clair. Notez que la clé se trouve dans le même volume : une sauvegarde contient donc toujours de quoi les lire — conservez vos sauvegardes dans un endroit de confiance.

Notes complètes : https://github.com/heatpunk/blisspoint/releases/tag/v0.6.0`,
  },
  migrations: {
    up: async ({ effects }) => {},
    down: IMPOSSIBLE,
  },
})

# Auditoría y Mejoras - appTarot PWA

**Fecha:** 2026-03-12
**Repo:** https://github.com/Vegabytes/apptarot
**Deploy:** apptarot-bbn.pages.dev (Cloudflare Pages)

---

## Resumen

App de tarot (Ionic/Angular/Capacitor) convertida de app nativa a PWA.
Las stores rechazaban la app por múltiples problemas. Se optó por PWA desplegada en Cloudflare Pages.

**13 commits | ~80 archivos modificados**

---

## Problemas encontrados y corregidos

### Seguridad

| Problema | Severidad | Archivo | Estado |
|----------|-----------|---------|--------|
| XSS via `[innerHTML]` sin sanitizar | CRÍTICA | tarot-horoscopo.page.ts | Corregido — DomSanitizer |
| `usesCleartextTraffic="true"` en Android | ALTA | AndroidManifest.xml | Eliminado |
| Política de privacidad "Lorem ipsum" | CRÍTICA | politicas.page.html | Reescrita completa |
| Sin Content Security Policy | ALTA | index.html | CSP meta tag añadido (con unsafe-inline para Ionic) |
| Teléfono/WhatsApp hardcodeados | MEDIA | múltiples | Extraídos a constants.ts |
| API sin autenticación visible | MEDIA | services | No corregible (backend externo) |
| Backend con DEBUG=True | ALTA | externo | No corregible (avisar al dueño) |

### Bugs de lógica (16 corregidos)

| Bug | Archivo |
|-----|---------|
| Loading spinner nunca desaparece si no hay datos de navegación | resultados.page.ts, resultados-chatgpt.page.ts |
| Race condition: loading.dismiss() antes de que lleguen datos | list-horoscopo.page.ts, tarot-horoscopo.page.ts |
| Crash por null en `horoscopeActive.description.replace()` | tarot-horoscopo.page.ts |
| Crash en arrays vacíos `carta_1[0].toLocaleLowerCase()` | resultados.page.ts |
| `irDetalle()` navega a sí misma | tarot-diario-detalle.page.ts |
| `irDetalle()` navega a página equivocada | tarot-preguntas.page.ts |
| `formatDate()` crashea si inputDate es undefined | list-horoscopo.page.ts |
| `Browser.open()` sin try/catch | resultados.page.ts, resultados-chatgpt.page.ts |
| Catch blocks vacíos en Share.share() | múltiples |
| Variable `cardsShow` declarada pero nunca usada | resultados.page.ts |
| Método `irDetalleHoroscopo()` vacío | list-horoscopo.page.ts |
| Enlace `<a href="">` roto | trabajos-personalizados.page.html |
| Páginas vacías (horoscopo, horoscopo-details) | eliminadas |
| Sin ruta 404 wildcard | app-routing.module.ts |
| Título "Ionic App" en lugar del nombre real | index.html |
| Meta tag apple-mobile-web-app-capable deprecado | index.html |

### PWA (conversión completa)

| Mejora | Detalle |
|--------|---------|
| Service Worker | Angular SW registrado con ngsw-config.json |
| Manifest | manifest.webmanifest con nombre, colores, iconos |
| Iconos PWA | 8 tamaños generados (72-512px) desde icono existente |
| Banner instalar Chrome | Toast mejorado con estilo personalizado via beforeinstallprompt |
| Banner instalar iOS | Instrucciones específicas para Safari ("Añadir a pantalla de inicio") |
| Página offline | Pantalla con icono wifi y botón reintentar |
| _redirects | SPA routing para Cloudflare Pages |
| Browser/Share guards | Detección de plataforma nativa vs PWA |

### Rendimiento

| Mejora | Detalle |
|--------|---------|
| Videos deduplicados | Array de 56 vídeos extraído a videos.data.ts |
| trackBy en *ngFor | 17 instancias corregidas |
| Memory leaks | takeUntil pattern en 6 páginas |
| isLoading flag | Previene llamadas API duplicadas en 4 páginas |
| Caché API | shareReplay(1) para zodiac signs, TTL 1h para horóscopo |
| Lazy loading imágenes | loading="lazy" en below-fold, "eager" en above-fold |
| Preconnect API | dns-prefetch y preconnect a mariafernandeztarot.app |
| Preload fondo | Imagen de fondo precargada |
| font-display: swap | Evita texto invisible mientras carga Ubuntu |
| HTTP interceptor | Timeout 30s y errores centralizados |

### Accesibilidad

| Mejora | Detalle |
|--------|---------|
| ARIA labels | Todos los botones de icono con aria-label descriptivo |
| Alt text | Todas las imágenes con alt text significativo |
| Roles | role=list, listitem, main, navigation, heading en todas las páginas |
| Keyboard nav | tabindex + keydown.enter en todos los elementos clickables |
| Focus visible | Estilos :focus-visible con outline púrpura |
| Skip link | "Saltar al contenido" para screen readers |
| aria-live | Contenedores de error y resultados anuncian cambios |
| Títulos dinámicos | Título de página cambia según la ruta activa |
| Route announcer | aria-live region anuncia cambios de página a screen readers |
| Reduced motion | @media prefers-reduced-motion desactiva animaciones |
| High contrast | @media forced-colors añade bordes a botones gradient |
| Error containers | Clase .error-container con soporte high-contrast |
| Lang | html lang="es" (estaba en "en") |

### SEO

| Mejora | Detalle |
|--------|---------|
| Meta description | Descripción única por página via route data |
| Open Graph | og:title, og:description, og:image, og:url, og:locale |
| Twitter Cards | summary_large_image con título, descripción e imagen |
| JSON-LD | Structured data WebApplication schema |
| Canonical URL | Link rel="canonical" a apptarot-bbn.pages.dev |
| robots.txt | Permite todos los crawlers, referencia a sitemap |
| sitemap.xml | 7 URLs públicas con prioridades |
| Favicon | Reemplazado favicon de Ionic por icono de la app |

### Limpieza de código

| Mejora | Detalle |
|--------|---------|
| 28 console.log eliminados | "ZODIACSSSSSS", "acacakk", etc. |
| Código comentado eliminado | ~100 líneas en 5 archivos |
| Páginas muertas eliminadas | horoscopo/, horoscopo-details/ (12 archivos) |
| Imports no usados | HTTP_INTERCEPTORS, withInterceptorsFromDi, ViewChild, ElementRef |
| Tipos any → proper types | BeforeInstallPromptEvent, Sign, unknown |
| Constantes extraídas | PHONE_NUMBER, WHATSAPP_ID, YOUTUBE_CHANNEL, WEBSITE_URL, PRIVACY_POLICY_URL, PHONE_REGEX |
| CSS vacío eliminado | .box-color selector vacío |
| SafeArea fallback | CSS variables por defecto cuando plugin no disponible |
| Validación teléfono | Regex antes de crear tel: URI |
| CSS duplicado extraído | Estilos compartidos movidos a global.scss (card flip, .title, .transparent-*, etc.) |
| Navegación tipada | Interfaces NavigationState reemplazan `as unknown as` casts |
| ngOnInit vacíos | Eliminados de 11 páginas junto con imports OnInit |
| Imports muertos | CardService, ICard eliminados de tarot-diario |
| Error params | Renombrados a _error (convención no-unused-vars) |
| !important reducidos | 1 eliminado via mayor especificidad de selector (5 restantes son necesarios por Ionic) |

---

## Pendiente (no corregido)

| Tarea | Motivo |
|-------|--------|
| Responsive para tablets | Solo hay media query para iPhone SE |
| Tipografía responsiva | Font-sizes hardcodeados (25px, 35px, etc.) |
| Tests unitarios | Spec files vacíos (auto-generados) |
| !important en CSS (5 instancias) | Necesarios por Ionic Shadow DOM y core.css overrides |
| Backend DEBUG=True | No tenemos acceso al backend |
| Backend sin rate limiting | No tenemos acceso al backend |

---

## Arquitectura

```
src/
├── app/
│   ├── api/                    # Servicios HTTP y interceptor
│   │   ├── card.service.ts
│   │   ├── zodiac.service.ts
│   │   └── http-error.interceptor.ts
│   ├── data/                   # Datos compartidos
│   │   ├── constants.ts        # URLs, teléfono, WhatsApp, YouTube, regex
│   │   └── videos.data.ts      # Array de vídeos (deduplicado)
│   ├── interfaces/             # Tipos TypeScript
│   │   ├── card.interface.ts
│   │   ├── horoscope.interface.ts
│   │   ├── responsegpt.interface.ts
│   │   ├── zodiac.interface.ts
│   │   └── navigation-state.interface.ts
│   └── pages/                  # Páginas de la app
│       ├── inicio/             # Splash con logo y botón entrar
│       ├── menu/               # Menú principal (5 opciones)
│       ├── tarot-diario/       # Selección de tema (amor/dinero/salud/trabajo)
│       ├── tarot-diario-detalle/ # Selección de 3 cartas
│       ├── tarot-preguntas/    # Tarot Sí o No
│       ├── resultados/         # Resultados con ChatGPT (3 cartas)
│       ├── resultados-chatgpt/ # Resultados Sí o No
│       ├── list-horoscopo/     # Lista de signos zodiacales
│       ├── tarot-horoscopo/    # Detalle del horóscopo del día
│       ├── trabajos-personalizados/ # Servicios de pago (WhatsApp)
│       ├── politicas/          # Política de privacidad
│       └── offline/            # Página sin conexión (PWA)
├── assets/
│   ├── icons/                  # Iconos PWA (72-512px)
│   ├── img/                    # Imágenes de la app
│   └── fonts/                  # Ubuntu font
├── manifest.webmanifest        # Manifest PWA
├── _redirects                  # SPA routing Cloudflare
└── index.html                  # Con CSP, SEO, preload

Backend externo: https://mariafernandeztarot.app/api (Django)
├── POST /api/cards/response-cards      # Interpretación 3 cartas (ChatGPT)
├── POST /api/cards/response-yes-or-no  # Respuesta Sí/No (ChatGPT)
├── GET  /api/zodiac/signs              # 12 signos del zodiaco
└── GET  /api/zodiac/horoscope          # Horóscopo del día
```

---

## Commits

```
eccf661 refactor: deduplicate CSS, type navigation, extract constants, cleanup dead code
02c0bde fix: replace Ionic default favicon with app icon
f13afb7 fix: allow unsafe-inline in CSP script-src for Ionic/Swiper compatibility
afeb867 feat: SEO, accessibility, install banners, and audit document
683604a fix: PWA compatibility, SPA routing, and robustness
b37c86c feat: HTTP interceptor, CSP, accessibility, and robustness improvements
d9585f1 refactor: cleanup dead code, type safety, and extract constants
bf6df6e feat: comprehensive accessibility and performance improvements
fce9312 fix: logic bugs, console warnings, and html improvements
14ada62 perf: fix memory leaks, deduplicate code, add error handling
5bf86aa fix: security, bugs, and code cleanup
74c21ed fix: pin @angular/service-worker to 18.2.3 to match Angular version
20f9a10 Initial commit: Tarot app as PWA
```

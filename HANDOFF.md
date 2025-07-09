# 📝 Handoff & Progreso del Proyecto – MarketInsight Pro

> Documento vivo que resume el estado actual, los hitos completados y los próximos pasos del proyecto.

---

## 1. Información General

| Ítem                    | Detalle |
|-------------------------|---------|
| **Nombre del Proyecto** | MarketInsight Pro – Affiliate Edition |
| **Versión Actual**      | 5.0 Beta (2024-Q3) |
| **Repositorio**         | _pendiente_ (local) |
| **Contacto Admin**      | `ADMIN_CONFIG.adminEmail` en `firebase-setup.js` |

---

## 2. Hitos Completados

| # | Fecha | Hito | Archivos Clave |
|---|-------|------|---------------|
| 1 | 2024-Q1 | Core v4.0 (Detectores, Generadores, UI) | `index.html`, `script.js`, `styles.css` |
| 2 | 2024-05 | **Funnel Architect** standalone | `funnel-architect-standalone.html` |
| 3 | 2024-06 | Manejo de errores Gemini + Retry | `script.js`, `config.js`, `API_TROUBLESHOOTING.md` |
| 4 | 2024-07 | **Autenticación Firebase** + Planes | `firebase-setup.js`, `script.js` |
| 5 | 2024-07 | **Panel Admin** + Estadísticas | `firebase-setup.js`, `script.js`, `styles.css` |
| 6 | 2024-07 | **Límites de uso** + Modal Upgrade | `script.js`, `styles.css` |
| 7 | 2024-07 | **Integración Stripe (Front)** | `payment-system.js` |
| 8 | 2024-07 | Documentación de instalación | `SETUP_INSTRUCTIONS.md`, `MONETIZATION_ROADMAP.md` |

---

## 3. Arquitectura Técnica (Resumida)

```
📂 root
├─ index.html              # SPA principal
├─ script.js               # Lógica, UIManager, API, UsageLimiter
├─ styles.css              # Estilos globales + Admin Panel
├─ firebase-setup.js       # Auth + Firestore + AdminPanel
├─ payment-system.js       # Integración Stripe (front-end)
├─ funnel-architect-standalone.html
├─ trend-predictor.html    # Módulo predictor
└─ docs / *.md             # Documentación (README, SETUP, ROADMAP, etc.)
```

### Flujo de Datos (Simplificado)
```
[Usuario] ⇆ UIManager ⇆ AuthManager (Firebase) ⇆ Firestore
                                    ⇆ PaymentManager (Stripe) ⇆ Webhooks* (pend.)
                                    ⇆ APIManager (Google Gemini)
```

---

## 4. Próximos Pasos (Roadmap Corto)

| Prioridad | Tarea | Responsable | ETA |
|-----------|-------|-------------|-----|
| 🟢 Alta | Backend Node/Cloud Functions para webhooks Stripe | — | 1 sem |
| 🟡 Media | Migrar API Keys a Firestore (encriptadas) | — | 1-2 sem |
| 🟡 Media | Sistema de facturación/recibos PDF | — | 2 sem |
| 🟠 Baja  | Modo equipo y sharing de proyectos | — | 1 mes |
| 🟠 Baja  | Integración con redes de afiliados (API) | — | 1-2 meses |

---

## 5. Checklist de Entorno

- [x] Firebase Project creado
- [x] Authentication (Email/Password) activo
- [x] Firestore en modo producción
- [ ] Reglas de seguridad actualizadas (ver README)
- [ ] Stripe API Keys (test) insertadas en `payment-system.js`
- [ ] Webhook endpoint configurado

---

## 6. Documentos Relevantes

| Documento | Propósito |
|-----------|-----------|
| `README.md` | Guía de usuario + características |
| `SETUP_INSTRUCTIONS.md` | Cómo configurar Firebase y admin |
| `MONETIZATION_ROADMAP.md` | Estrategia de monetización a 6-12 meses |
| `API_TROUBLESHOOTING.md` | Solución de problemas de Google Gemini |

---

## 7. Notas de Seguridad

1. Contraseñas almacenadas de forma segura en Firebase Auth (hashed).  
2. Reglas Firestore limitan lectura/escritura a `request.auth.uid`.  
3. Clave admin dura en código **solo para bootstrapping**; se usa verificación por email.  
4. API Keys de Stripe y Gemini se mantienen fuera del repositorio (usar `.env`).

---

## 8. Contacto & Soporte

Para dudas técnicas o roadmap, contactar al admin (`ADMIN_CONFIG.adminEmail`).  
Para bugs o sugerencias, abrir issue en el repositorio cuando esté público.

---

> _Este handoff se actualiza en cada sprint. Última edición: **2024-07-XX**_
# Registro de Errores y Soluciones – MarketInsight Pro

## Contexto
Durante la integración con la API de Google Gemini (v1beta) se presentaron errores de disponibilidad y compatibilidad de modelos. A continuación se documentan los problemas detectados y las acciones realizadas para mitigarlos.

---

### 1. 503 Service Unavailable (Model Overloaded)
| Fecha | Endpoint | Descripción | Acción |
|-------|----------|-------------|--------|
| 2024-XX-XX | gemini-1.5-flash-latest | El modelo devuelve 503 debido a saturación. | • Se redujo `temperature`, `topK`, `topP`.<br>• Se acortó el prompt (-75 % tokens).<br>• Se añadió reintento exponencial (maxRetries 5).<br>• Se dividió la petición en 3 llamadas cortas.

### 2. 404 Not Found (Modelo no disponible en v1beta)
| Fecha | Endpoint | Descripción | Acción |
|-------|----------|-------------|--------|
| 2024-XX-XX | gemini-1.0-pro | Google devuelve 404 *“model is not found for API version v1beta”*. | • Se cambió a `gemini-pro` (último modelo compatible con v1beta).

### 3. Lógica de prompt y parser
| Mejora | Detalle |
|--------|---------|
| Prompt ultracorto | 9 campos clave, sin emojis, sin ejemplos largos. |
| Anti-placeholder | Regla en prompt + filtro en `ResponseProcessor` para nombres que contengan “Ejemplo/Placeholder…”. |
| Tres peticiones | `generateSingleProductPrompt` → loop de 3 API calls. |

---

## Archivos Modificados / Creados
1. **config.js** – Ajustes de endpoint y parámetros.
2. **script.js**
   * `PromptGenerator` – prompt corto + `generateSingleProductPrompt`.
   * `UIManager.handleAnalysis` – tres llamadas secuenciales.
   * `APIManager.makeRequest` – lee endpoint dinámico + reintentos 503/429.
3. **ERRORS_AND_FIXES.md** – este registro.

## Próximos Pasos
1. Confirmar que el endpoint `gemini-pro` responde (debe aparecer 200 en Network).
2. Si Google cambia de nombre nuevamente, ejecutar `curl https://generativelanguage.googleapis.com/v1beta/models?key=YOUR_KEY` para listar modelos válidos.
3. Considerar fallback a proveedor alternativo (OpenAI GPT-4) si la saturación persiste.

---

> Última actualización: 2024-XX-XX
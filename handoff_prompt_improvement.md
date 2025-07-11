# Handoff – Prompt Optimization: Detector de Productos Ganadores

## Objetivo
Reducir la generación de resultados genéricos en el módulo **Detector de Productos Ganadores** y asegurar que los 3 productos devueltos cumplan criterios de validación más estrictos y accionables.

## Cambios Principales
1. **Prompt refinado (script.js → `PromptGenerator.generateProductDetectionPrompt`)
   • Mayor énfasis en fuentes (ClickBank, JVZoo, Amazon Best Sellers, Google Trends).
   • Criterios de selección estrictos (gravity > 50, ⭐4.5+, growth > 20 %, refund < 10 %, EPC/CVR mínimos…).
   • Se exige URL oficial y mantiene formato parseable por el `ResponseProcessor`.
   • Incluye bloque opcional de análisis extra si el usuario marcó más casillas.

2. **Parámetros de IA** (`config.js`)
   • `temperature` reducido a **0.4** para respuestas más deterministas.

## Compatibilidad 
Se conservan los encabezados que el `ResponseProcessor` utiliza para el parsing (SCORE, EPC_NICHO_ESPECIFICO, etc.). Los campos adicionales (URL_OFICIAL, criterios y veredicto) no afectan el parser y se pueden ignorar o incorporarse en futuras mejoras.

## Próximos Pasos
1. **UI**: mostrar la URL oficial y veredicto global en la card de producto.
2. **Parser**: ampliar `ResponseProcessor` para capturar los nuevos campos (URL_OFICIAL, VEREDICTO_GLOBAL).
3. **Tests**: validar que la salida cumple con reglas en 10 nichos distintos.

---
> Rama: `feature/prompt-product-detector`
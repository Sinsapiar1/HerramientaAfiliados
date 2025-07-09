# 🔧 Solución de Problemas de API - MarketInsight Pro

## 🚨 Errores Comunes y Soluciones

### 1. Error 503 - "El modelo está sobrecargado"
**Síntomas:** Aparece el mensaje "El modelo está sobrecargado. Reintentando automáticamente..."

**Causas:**
- La API gratuita de Google Gemini tiene uso limitado
- Muchos usuarios están usando el servicio simultáneamente
- Picos de tráfico en los servidores de Google

**Soluciones:**
1. **Esperar y reintentar:** La aplicación reintenta automáticamente 5 veces
2. **Usar el botón "Reintentar"** cuando aparezca el error
3. **Usar datos de ejemplo:** Botón "📊 Usar Datos de Ejemplo" para continuar trabajando
4. **Intentar en horarios de menor tráfico:** Madrugada o mediodía suelen tener menos carga

### 2. Error 429 - "Límite de solicitudes excedido"
**Síntomas:** Mensaje sobre límite de solicitudes

**Causas:**
- Has enviado demasiadas solicitudes en poco tiempo
- Límite de la API gratuita alcanzado

**Soluciones:**
1. **Esperar 5-10 minutos** antes de intentar de nuevo
2. **Usar menos análisis simultáneos:** Desmarca algunos checkboxes en "Opciones de Análisis"
3. **Activar modo debug** para ver exactamente qué está pasando

### 3. Error 401 - "API Key inválida"
**Síntomas:** Mensaje sobre API Key inválida o expirada

**Soluciones:**
1. **Verificar la API Key:**
   - Ve a [Google AI Studio](https://aistudio.google.com/app/apikey)
   - Crea una nueva API Key si es necesario
   - Copia y pega la key completa (sin espacios)

2. **Probar la conexión:**
   - Pega la nueva API Key
   - Haz clic en "🧪 Probar"
   - Debe aparecer "✅ Conexión exitosa"

### 4. Error 400 - "Solicitud inválida"
**Síntomas:** Error de solicitud mal formada

**Soluciones:**
1. **Revisar los datos del formulario:**
   - Completa todos los campos obligatorios
   - Usa datos específicos, no genéricos
   - Ejemplo: "Pérdida de peso para mujeres +40" en lugar de "fitness"

2. **Verificar API Key:**
   - Asegúrate de que la API Key esté activa
   - Revisa que tenga permisos para Gemini API

## 🛠️ Herramientas de Diagnóstico

### Modo Debug
1. Haz clic en "🔧 Debug" en la configuración de API
2. Abre las herramientas de desarrollador (F12)
3. Ve a la pestaña "Console"
4. Ejecuta tu análisis y revisa los logs detallados

### Datos de Ejemplo
Si la API falla constantemente:
1. Usa el botón "📊 Usar Datos de Ejemplo"
2. Esto te permite seguir trabajando con datos realistas
3. Prueba las demás herramientas (Funnel Architect, etc.)

## 💡 Consejos para Evitar Errores

### 1. Optimizar el Uso de la API
- **Sé específico:** Nichos específicos generan mejores resultados
- **Usa menos análisis:** Desmarca análisis que no necesites
- **Evita horarios pico:** 9am-5pm suelen tener más tráfico

### 2. Configuración Recomendada
```
✅ Análisis de Competencia
✅ Tendencias  
✅ Programas de Afiliados
✅ Keywords Rentables
❌ Análisis Financiero (si tienes problemas)
❌ Inteligencia Competitiva (si tienes problemas)
```

### 3. Datos de Entrada Óptimos
- **Nicho:** "Pérdida de peso para mujeres profesionales 35-50"
- **Público:** "Mujeres profesionales, ingresos medios-altos, poco tiempo"
- **Canal:** Específico (Facebook Ads, no solo "Facebook")

## 🔄 Flujo de Trabajo Alternativo

Si la API falla frecuentemente:

1. **Llena el formulario** con datos específicos
2. **Usa datos de ejemplo** para generar productos
3. **Crea funnels** con el Funnel Architect
4. **Genera contenido** para productos específicos
5. **Calcula profit** con la calculadora
6. **Intenta la API** más tarde cuando esté menos cargada

## 📞 Soporte Adicional

### Recursos Útiles
- [Google AI Studio](https://aistudio.google.com/) - Gestión de API Keys
- [Estado de Google Cloud](https://status.cloud.google.com/) - Verificar si hay interrupciones
- [Documentación Gemini](https://ai.google.dev/docs) - Información oficial

### Reportar Problemas
Si los errores persisten:
1. Activa el modo debug
2. Captura los logs de la consola
3. Anota el mensaje de error exacto
4. Incluye tu configuración (sin la API Key)

## 🎯 Alternativas Temporales

Mientras se resuelven los problemas de API:

1. **Funnel Architect** - Funciona independientemente
2. **Trend Predictor** - Herramienta separada
3. **Datos de ejemplo** - Para probar funcionalidades
4. **Calculadora de Profit** - No requiere API
5. **Herramientas manuales** - Validación manual de ofertas

---

*Última actualización: Diciembre 2024*
*Versión: MarketInsight Pro 4.0*
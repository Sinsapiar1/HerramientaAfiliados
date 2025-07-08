# 🚀 Guía de Instalación - MarketInsight Pro v4.0

## 📋 Requisitos Previos

### Requisitos del Sistema
- **Navegador Web Moderno**: Chrome 90+, Firefox 88+, Safari 14+, Edge 90+
- **Resolución Mínima**: 1024x768 (Recomendado: 1920x1080)
- **Conexión a Internet**: Estable para llamadas API
- **JavaScript**: Habilitado (requerido)

### Cuentas Necesarias
- **Google AI Studio**: Para obtener API Key de Gemini
  - URL: https://makersuite.google.com/app/apikey
  - Crear cuenta gratuita
  - Generar API Key

## 📁 Estructura del Proyecto

Después de la instalación, tendrás la siguiente estructura:

```
MarketInsight-Pro/
├── 📄 index.html                           # Aplicación principal (50KB+)
├── 📄 script.js                           # Lógica JavaScript (250KB+)
├── 📄 styles.css                          # Estilos CSS (80KB+)
├── 📄 config.js                           # Configuración global
├── 📄 trend-predictor.html                # Módulo Trend Predictor (35KB+)
├── 📄 funnel-architect-standalone.html    # Constructor de Funnels (55KB+)
├── 📄 README.md                           # Documentación principal
├── 📄 INSTALL.md                          # Esta guía de instalación
└── 📄 favicon.ico                         # Icono de la aplicación
```

## 🛠️ Instalación Paso a Paso

### Opción 1: Instalación Local Simple

1. **Descargar Archivos**
   ```bash
   # Crear directorio del proyecto
   mkdir MarketInsight-Pro
   cd MarketInsight-Pro
   
   # Descargar todos los archivos del proyecto
   # (Copiar y pegar cada archivo en su respectivo nombre)
   ```

2. **Verificar Archivos**
   - Asegúrate de que todos los archivos estén en el directorio raíz
   - No cambies los nombres de los archivos
   - Mantén la estructura original

3. **Abrir la Aplicación**
   - Doble clic en `index.html`
   - O arrastra el archivo al navegador
   - O usa un servidor local (recomendado)

### Opción 2: Instalación con Servidor Local (Recomendado)

#### Con Python
```bash
# Navegar al directorio del proyecto
cd MarketInsight-Pro

# Python 3
python -m http.server 8000

# Python 2
python -m SimpleHTTPServer 8000

# Abrir navegador en: http://localhost:8000
```

#### Con Node.js
```bash
# Instalar servidor estático
npm install -g serve

# Navegar al directorio
cd MarketInsight-Pro

# Iniciar servidor
serve -l 8000

# Abrir navegador en: http://localhost:8000
```

#### Con PHP
```bash
# Navegar al directorio
cd MarketInsight-Pro

# Iniciar servidor PHP
php -S localhost:8000

# Abrir navegador en: http://localhost:8000
```

### Opción 3: Instalación en Servidor Web

1. **Subir Archivos**
   - Sube todos los archivos al directorio raíz de tu servidor web
   - Mantén la estructura de archivos intacta

2. **Configurar Permisos**
   ```bash
   # En servidores Linux/Unix
   chmod 644 *.html *.css *.js *.md
   chmod 755 .
   ```

3. **Configurar HTTPS** (Recomendado)
   - La aplicación funciona mejor con HTTPS
   - Configura certificado SSL si es posible

## ⚙️ Configuración Inicial

### 1. Obtener API Key de Google Gemini

1. **Visitar Google AI Studio**
   - URL: https://makersuite.google.com/app/apikey
   - Iniciar sesión con cuenta Google

2. **Crear API Key**
   - Hacer clic en "Create API Key"
   - Seleccionar proyecto o crear uno nuevo
   - Copiar la API Key generada

3. **Configurar Límites** (Opcional)
   - Establecer límites de uso diario/mensual
   - Configurar alertas de consumo

### 2. Configurar la Aplicación

1. **Abrir MarketInsight Pro**
   - Navegar a la URL donde instalaste la aplicación

2. **Ingresar API Key**
   - En la sección "🔑 Configuración API"
   - Pegar tu API Key de Google Gemini
   - Hacer clic en "💾 Guardar"
   - Hacer clic en "🧪 Probar" para verificar

3. **Verificar Conexión**
   - Debe aparecer "✅ Conexión exitosa"
   - Si hay error, verificar la API Key

### 3. Configuración Opcional

#### Personalizar Configuración
```javascript
// Editar config.js para personalizar:

// Cambiar tema por defecto
window.MarketInsightConfig.UI.themes.default = 'light';

// Habilitar modo debug
window.MarketInsightConfig.DEBUG.enabled = true;

// Cambiar idioma
window.MarketInsightConfig.LOCALIZATION.defaultLanguage = 'en';
```

#### Configurar Preferencias
- **Tema**: Claro/Oscuro/Automático
- **Idioma**: Español/Inglés/Portugués
- **Notificaciones**: Habilitar/Deshabilitar
- **Analytics**: Tracking opcional

## 🧪 Verificación de Instalación

### Lista de Verificación

- [ ] ✅ Todos los archivos están presentes
- [ ] ✅ La aplicación se abre sin errores
- [ ] ✅ API Key configurada y probada
- [ ] ✅ Conexión a internet estable
- [ ] ✅ JavaScript habilitado en el navegador

### Prueba Rápida

1. **Abrir la aplicación principal**
   - Verificar que la interfaz carga correctamente

2. **Realizar análisis de prueba**
   - Completar configuración básica:
     - Nicho: "Fitness para mujeres"
     - Público: "Mujeres 25-40 años"
     - Canal: "Facebook Ads"
   - Hacer clic en "🚀 Analizar y Detectar Productos Ganadores"
   - Verificar que se generan 3 productos

3. **Probar herramientas adicionales**
   - Validador de ofertas
   - Generador de contenido viral
   - Calculadora de profit

## 🚨 Solución de Problemas

### Problemas Comunes

#### Error: "No se puede cargar la aplicación"
**Síntomas**: Página en blanco o errores de carga
**Soluciones**:
- Verificar que todos los archivos estén presentes
- Usar servidor local en lugar de abrir archivo directamente
- Limpiar caché del navegador (Ctrl+F5)
- Verificar que JavaScript esté habilitado

#### Error: "API Key inválida"
**Síntomas**: Error al probar conexión
**Soluciones**:
- Verificar que la API Key esté copiada completamente
- Asegurarse de que la API de Gemini esté habilitada en Google Cloud
- Verificar límites de la cuenta
- Generar nueva API Key si es necesario

#### Error: "No se generan productos"
**Síntomas**: Análisis no retorna resultados
**Soluciones**:
- Ser más específico en la configuración del nicho
- Reducir el número de análisis seleccionados
- Verificar conexión a internet
- Revisar consola del navegador (F12) para errores

#### Problemas de Rendimiento
**Síntomas**: Aplicación lenta o que no responde
**Soluciones**:
- Cerrar otras pestañas del navegador
- Verificar disponibilidad de RAM
- Usar navegador actualizado
- Deshabilitar extensiones innecesarias

### Debug y Diagnóstico

#### Habilitar Modo Debug
```javascript
// En la consola del navegador (F12):
localStorage.setItem('marketinsight_debug', 'true');
location.reload();
```

#### Exportar Logs
```javascript
// En la consola del navegador:
console.save = function(data, filename) {
    const blob = new Blob([data], {type: 'text/plain'});
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    a.click();
};

// Exportar logs
console.save(JSON.stringify(console.history), 'marketinsight-logs.txt');
```

## 🔧 Configuración Avanzada

### Personalización de Temas

#### Crear Tema Personalizado
```css
/* Agregar al final de styles.css */
[data-theme="custom"] {
    --primary-gradient: linear-gradient(135deg, #your-color1 0%, #your-color2 100%);
    --secondary-color: #your-secondary;
    --accent-color: #your-accent;
    /* ... más variables */
}
```

### Integración con Herramientas Externas

#### Webhook Configuration
```javascript
// En config.js, habilitar webhooks:
window.MarketInsightConfig.INTEGRATIONS.webhook.enabled = true;
window.MarketInsightConfig.INTEGRATIONS.webhook.url = 'https://your-webhook-url.com';
```

#### Google Analytics Integration
```javascript
// En config.js:
window.MarketInsightConfig.INTEGRATIONS.analytics.googleAnalytics.enabled = true;
window.MarketInsightConfig.INTEGRATIONS.analytics.googleAnalytics.trackingId = 'GA_TRACKING_ID';
```

## 📊 Monitoreo y Mantenimiento

### Backup de Datos

#### Exportar Configuración
```javascript
// En la consola del navegador:
const config = localStorage.getItem('marketinsight_api_key');
const userData = localStorage.getItem('marketinsight_user_data');
const backup = { config, userData, timestamp: new Date().toISOString() };
console.save(JSON.stringify(backup), 'marketinsight-backup.json');
```

#### Restaurar Configuración
```javascript
// Cargar backup:
const backupData = /* tu datos de backup */;
localStorage.setItem('marketinsight_api_key', backupData.config);
localStorage.setItem('marketinsight_user_data', backupData.userData);
location.reload();
```

### Actualizaciones

#### Verificar Versión
```javascript
// En la consola:
console.log('Versión actual:', window.MarketInsightConfig.APP.version);
```

#### Actualizar Aplicación
1. Hacer backup de configuración actual
2. Descargar nueva versión
3. Reemplazar archivos (excepto datos de usuario)
4. Verificar que todo funcione correctamente

## 🔒 Seguridad y Privacidad

### Mejores Prácticas

1. **API Keys**
   - No compartir tu API Key
   - Configurar límites de uso
   - Rotar keys periódicamente

2. **Datos**
   - Los datos se almacenan localmente
   - No se envían a servidores externos
   - Hacer backups regulares

3. **Navegador**
   - Mantener navegador actualizado
   - Usar HTTPS cuando sea posible
   - Limpiar datos si usas computadora compartida

### Configuración de Privacidad

```javascript
// Deshabilitar analytics (si está habilitado):
window.MarketInsightConfig.PERFORMANCE.analytics.trackUserActions = false;
window.MarketInsightConfig.PERFORMANCE.analytics.trackPerformance = false;
```

## 📞 Soporte y Ayuda

### Recursos Disponibles

- **Documentación**: README.md
- **Configuración**: config.js (comentado)
- **Código fuente**: Completamente comentado
- **Debug tools**: Modo debug integrado

### Solución de Problemas

1. **Revisar esta guía** de instalación
2. **Consultar README.md** para uso general
3. **Habilitar modo debug** para diagnóstico
4. **Verificar consola del navegador** (F12) para errores
5. **Probar en navegador diferente** para descartar problemas específicos

### Información del Sistema

Para reportar problemas, incluye:

```javascript
// Ejecutar en consola para obtener info del sistema:
console.log({
    appVersion: window.MarketInsightConfig.APP.version,
    browser: navigator.userAgent,
    screenResolution: `${screen.width}x${screen.height}`,
    language: navigator.language,
    cookiesEnabled: navigator.cookieEnabled,
    localStorage: typeof(Storage) !== "undefined"
});
```

## ✅ Instalación Completada

Si has llegado hasta aquí y todo funciona correctamente:

🎉 **¡Felicitaciones! MarketInsight Pro está correctamente instalado y configurado.**

### Próximos Pasos

1. **Explorar las herramientas** disponibles
2. **Realizar tu primer análisis** completo
3. **Probar los módulos** Trend Predictor y Funnel Architect
4. **Personalizar la configuración** según tus necesidades
5. **Hacer backup** de tu configuración

### Recordatorios Importantes

- 🔑 **Guarda tu API Key** de forma segura
- 💾 **Haz backups** regulares de tu configuración
- 🔄 **Mantén actualizado** el navegador
- 📚 **Consulta la documentación** para aprovechar todas las funciones

---

**¡Que disfrutes usando MarketInsight Pro v4.0!** 🚀

Para obtener el máximo provecho de la herramienta, lee el README.md completo y experimenta con todas las funcionalidades disponibles.
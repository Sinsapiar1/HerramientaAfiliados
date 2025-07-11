// ====================
// CONFIGURACIÓN ACTUALIZADA (config.js)
// ====================

const CONFIG = {
    API: {
        gemini: {
            // Endpoints ordenados por prioridad (más recientes primero)
            endpoints: [
                'gemini-1.5-flash',
                'gemini-1.5-pro', 
                'gemini-1.5-flash-latest',
                'gemini-1.5-pro-latest',
                'gemini-pro-vision', // Backup
                'text-bison-001' // Fallback PaLM2
            ],
            baseUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
            listModelsUrl: 'https://generativelanguage.googleapis.com/v1beta/models',
            maxRetries: 3,
            retryDelay: 1000,
            timeout: 30000
        }
    },
    GENERATION: {
        temperature: 0.3,
        topK: 20,
        topP: 0.8,
        maxOutputTokens: 3000,
        candidateCount: 1
    },
    DEBUG: localStorage.getItem('marketinsight_debug') === 'true'
};

// ====================
// DETECTOR DE MODELOS DISPONIBLES
// ====================

class ModelDetector {
    constructor() {
        this.availableModels = [];
        this.workingModel = null;
        this.cache = new Map();
        this.cacheKey = 'gemini_available_models';
        this.cacheExpiry = 1000 * 60 * 60; // 1 hora
    }

    // Lista todos los modelos disponibles con la API key del usuario
    async listAvailableModels(apiKey) {
        try {
            // Verificar cache primero
            const cached = this.getCachedModels();
            if (cached && cached.length > 0) {
                this.log('✅ Usando modelos desde cache:', cached);
                return cached;
            }

            const response = await fetch(`${CONFIG.API.gemini.listModelsUrl}?key=${apiKey}`, {
                method: 'GET',
                headers: {
                    'Content-Type': 'application/json'
                },
                signal: AbortSignal.timeout(CONFIG.API.gemini.timeout)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            // Filtrar modelos que soporten generateContent
            const models = data.models
                ?.filter(model => 
                    model.supportedGenerationMethods?.includes('generateContent') ||
                    model.supportedGenerationMethods?.includes('generate')
                )
                .map(model => ({
                    name: model.name.replace('models/', ''),
                    displayName: model.displayName,
                    methods: model.supportedGenerationMethods
                })) || [];

            this.log('📋 Modelos detectados:', models);
            
            // Guardar en cache
            this.setCachedModels(models);
            this.availableModels = models;
            
            return models;
        } catch (error) {
            this.log('❌ Error detectando modelos:', error.message);
            throw error;
        }
    }

    // Encuentra el mejor modelo disponible basado en prioridades
    async findBestModel(apiKey) {
        try {
            const availableModels = await this.listAvailableModels(apiKey);
            
            if (!availableModels || availableModels.length === 0) {
                throw new Error('No se encontraron modelos disponibles con esta API key');
            }

            // Buscar por orden de prioridad
            for (const preferredModel of CONFIG.API.gemini.endpoints) {
                const foundModel = availableModels.find(model => 
                    model.name === preferredModel || 
                    model.name.includes(preferredModel)
                );
                
                if (foundModel) {
                    this.workingModel = foundModel.name;
                    this.log('🎯 Modelo seleccionado:', this.workingModel);
                    return this.workingModel;
                }
            }

            // Si no encontramos ninguno de los preferidos, usar el primero disponible
            const fallbackModel = availableModels[0].name;
            this.workingModel = fallbackModel;
            this.log('🔄 Usando modelo fallback:', fallbackModel);
            return fallbackModel;

        } catch (error) {
            this.log('❌ Error encontrando modelo:', error.message);
            throw error;
        }
    }

    // Valida que un modelo específico funcione
    async validateModel(modelName, apiKey) {
        try {
            const testPrompt = "Responde solo: OK";
            const response = await this.makeTestRequest(modelName, testPrompt, apiKey);
            
            if (response && response.ok) {
                this.log(`✅ Modelo ${modelName} validado correctamente`);
                return true;
            }
            return false;
        } catch (error) {
            this.log(`❌ Modelo ${modelName} falló validación:`, error.message);
            return false;
        }
    }

    async makeTestRequest(modelName, prompt, apiKey) {
        const url = `${CONFIG.API.gemini.baseUrl}/${modelName}:generateContent`;
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                maxOutputTokens: 10,
                temperature: 0.1
            }
        };

        return await fetch(`${url}?key=${apiKey}`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(requestBody),
            signal: AbortSignal.timeout(10000) // 10 segundos para test
        });
    }

    // Gestión de cache
    setCachedModels(models) {
        const cacheData = {
            models,
            timestamp: Date.now()
        };
        localStorage.setItem(this.cacheKey, JSON.stringify(cacheData));
    }

    getCachedModels() {
        try {
            const cached = localStorage.getItem(this.cacheKey);
            if (!cached) return null;

            const data = JSON.parse(cached);
            const isExpired = (Date.now() - data.timestamp) > this.cacheExpiry;
            
            if (isExpired) {
                localStorage.removeItem(this.cacheKey);
                return null;
            }

            return data.models;
        } catch {
            return null;
        }
    }

    clearCache() {
        localStorage.removeItem(this.cacheKey);
        this.log('🗑️ Cache de modelos limpiado');
    }

    log(message, ...args) {
        if (CONFIG.DEBUG) {
            console.log(`[ModelDetector] ${message}`, ...args);
        }
    }
}

// ====================
// API MANAGER MEJORADO
// ====================

class ImprovedAPIManager {
    constructor() {
        this.modelDetector = new ModelDetector();
        this.currentModel = null;
        this.apiKey = null;
        this.retryCount = 0;
    }

    async initialize(apiKey) {
        this.apiKey = apiKey;
        
        try {
            // Detectar y seleccionar el mejor modelo disponible
            this.currentModel = await this.modelDetector.findBestModel(apiKey);
            
            // Validar que el modelo funcione
            const isValid = await this.modelDetector.validateModel(this.currentModel, apiKey);
            
            if (!isValid) {
                throw new Error(`El modelo ${this.currentModel} no responde correctamente`);
            }

            this.log(`🚀 API Manager inicializado con modelo: ${this.currentModel}`);
            return true;

        } catch (error) {
            this.log('❌ Error inicializando API Manager:', error.message);
            throw error;
        }
    }

    async generateContent(prompt, retryAttempt = 0) {
        if (!this.currentModel || !this.apiKey) {
            throw new Error('API Manager no inicializado. Llama a initialize() primero.');
        }

        try {
            const url = `${CONFIG.API.gemini.baseUrl}/${this.currentModel}:generateContent`;
            
            const requestBody = {
                contents: [{
                    parts: [{
                        text: prompt
                    }]
                }],
                generationConfig: CONFIG.GENERATION
            };

            const response = await fetch(`${url}?key=${this.apiKey}`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(requestBody),
                signal: AbortSignal.timeout(CONFIG.API.gemini.timeout)
            });

            if (!response.ok) {
                throw new Error(`HTTP ${response.status}: ${response.statusText}`);
            }

            const data = await response.json();
            
            if (!data.candidates || data.candidates.length === 0) {
                throw new Error('No se recibieron respuestas del modelo');
            }

            return data.candidates[0].content.parts[0].text;

        } catch (error) {
            this.log(`❌ Error en intento ${retryAttempt + 1}:`, error.message);
            
            // Lógica de reintentos con fallback de modelos
            if (retryAttempt < CONFIG.API.gemini.maxRetries) {
                // Si es error 404, intentar con siguiente modelo
                if (error.message.includes('404') || error.message.includes('not found')) {
                    await this.tryNextModel();
                }
                
                // Espera exponencial
                await this.delay(CONFIG.API.gemini.retryDelay * Math.pow(2, retryAttempt));
                return this.generateContent(prompt, retryAttempt + 1);
            }

            throw error;
        }
    }

    async tryNextModel() {
        try {
            const availableModels = await this.modelDetector.listAvailableModels(this.apiKey);
            const currentIndex = availableModels.findIndex(m => m.name === this.currentModel);
            
            if (currentIndex < availableModels.length - 1) {
                this.currentModel = availableModels[currentIndex + 1].name;
                this.log(`🔄 Cambiando a modelo: ${this.currentModel}`);
            }
        } catch (error) {
            this.log('❌ No se pudo cambiar de modelo:', error.message);
        }
    }

    // Método para generar múltiples productos (tu caso de uso específico)
    async generateProducts(basePrompt, productCount = 3) {
        const products = [];
        
        for (let i = 0; i < productCount; i++) {
            try {
                const prompt = `${basePrompt}\n\nGenera SOLO el producto #${i + 1}. NO uses placeholders como [PRODUCTO] o [PRECIO]. Sé específico y real.`;
                
                const response = await this.generateContent(prompt);
                
                // Verificar que no tenga placeholders
                if (this.hasPlaceholders(response)) {
                    this.log(`⚠️ Producto ${i + 1} tiene placeholders, regenerando...`);
                    i--; // Reintentar este producto
                    continue;
                }
                
                products.push({
                    id: i + 1,
                    content: response,
                    timestamp: new Date().toISOString()
                });
                
                this.log(`✅ Producto ${i + 1} generado exitosamente`);
                
                // Pequeña pausa entre requests para evitar rate limiting
                await this.delay(500);
                
            } catch (error) {
                this.log(`❌ Error generando producto ${i + 1}:`, error.message);
                throw error;
            }
        }
        
        return products;
    }

    hasPlaceholders(text) {
        const placeholderPatterns = [
            /\[.*?\]/g,  // [PRODUCTO], [PRECIO], etc.
            /\{.*?\}/g,  // {producto}, {precio}, etc.
            /XXX/gi,     // XXX, xxx
            /PLACEHOLDER/gi,
            /EJEMPLO/gi,
            /SAMPLE/gi
        ];
        
        return placeholderPatterns.some(pattern => pattern.test(text));
    }

    async delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    // Información de diagnóstico
    getStatus() {
        return {
            currentModel: this.currentModel,
            isInitialized: !!(this.currentModel && this.apiKey),
            availableModels: this.modelDetector.availableModels,
            workingModel: this.modelDetector.workingModel
        };
    }

    // Limpiar cache y reinicializar
    async reset() {
        this.modelDetector.clearCache();
        this.currentModel = null;
        this.apiKey = null;
        this.log('🔄 API Manager reseteado');
    }

    log(message, ...args) {
        if (CONFIG.DEBUG) {
            console.log(`[APIManager] ${message}`, ...args);
        }
    }
}

// ====================
// INTEGRACIÓN CON TU CÓDIGO EXISTENTE
// ====================

// Reemplaza tu APIManager actual con esta instancia
const apiManager = new ImprovedAPIManager();

// Función para integrar con tu detector de productos
async function detectProductsWithImprovedAPI(promptData) {
    try {
        // Mostrar loading
        showLoadingMessage('🔍 Inicializando conexión con IA...');
        
        // Obtener API key
        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            throw new Error('API Key no encontrada. Por favor configura tu API key primero.');
        }

        // Inicializar API Manager
        await apiManager.initialize(apiKey);
        
        showLoadingMessage('🎯 Detectando productos ganadores...');
        
        // Generar el prompt base con tus datos
        const basePrompt = generateProductDetectionPrompt(promptData);
        
        // Generar 3 productos
        const products = await apiManager.generateProducts(basePrompt, 3);
        
        showLoadingMessage('🎉 ¡Productos detectados exitosamente!');
        
        return products;

    } catch (error) {
        console.error('❌ Error detectando productos:', error);
        throw error;
    }
}

// Función de utilidad para mostrar status de modelos
async function showModelStatus() {
    try {
        const apiKey = localStorage.getItem('gemini_api_key');
        if (!apiKey) {
            console.log('❌ No hay API key configurada');
            return;
        }

        const detector = new ModelDetector();
        const models = await detector.listAvailableModels(apiKey);
        
        console.log('📋 Modelos disponibles:');
        models.forEach(model => {
            console.log(`  ✅ ${model.name} - ${model.displayName}`);
        });

        const bestModel = await detector.findBestModel(apiKey);
        console.log(`🎯 Modelo recomendado: ${bestModel}`);

    } catch (error) {
        console.error('❌ Error obteniendo status:', error);
    }
}

// Función para resetear y redetectar modelos
async function resetAndRedetectModels() {
    await apiManager.reset();
    const apiKey = localStorage.getItem('gemini_api_key');
    if (apiKey) {
        await apiManager.initialize(apiKey);
    }
    console.log('🔄 Modelos redetectados');
}

// ====================
// FUNCIONES DE DEBUG
// ====================

// Activar modo debug
function enableDebugMode() {
    localStorage.setItem('marketinsight_debug', 'true');
    console.log('🐛 Modo debug activado');
}

// Desactivar modo debug
function disableDebugMode() {
    localStorage.setItem('marketinsight_debug', 'false');
    console.log('🔕 Modo debug desactivado');
}

// Exportar para uso global
window.marketInsightAPI = {
    apiManager,
    detectProducts: detectProductsWithImprovedAPI,
    showModelStatus,
    resetAndRedetectModels,
    enableDebugMode,
    disableDebugMode
};

console.log('🚀 Sistema de API mejorado cargado. Usa window.marketInsightAPI para acceder a las funciones.');

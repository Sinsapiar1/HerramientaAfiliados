/**
 * ===== CONFIGURACIÓN GLOBAL - MARKETINSIGHT PRO =====
 * Archivo de configuración centralizada para toda la aplicación
 * Version: 4.0
 */

window.MarketInsightConfig = {
    // ===== INFORMACIÓN DE LA APLICACIÓN =====
    APP: {
        name: 'MarketInsight Pro',
        version: '4.0',
        description: 'Suite completa de marketing automation para afiliados potenciada por IA',
        author: 'MarketInsight Team',
        license: 'MIT',
        buildDate: '2024-12-08',
        homepage: 'https://marketinsight-pro.com',
        documentation: 'https://docs.marketinsight-pro.com'
    },

    // ===== CONFIGURACIÓN DE API =====
    API: {
        gemini: {
            endpoint: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-pro:generateContent',
            maxRetries: 3,
            retryDelay: 1000,
            timeout: 30000,
            maxTokens: 3000,
            temperature: 0.3,
            topK: 20,
            topP: 0.8
        },
        rateLimiting: {
            enabled: true,
            requestsPerMinute: 60,
            requestsPerHour: 1000
        }
    },

    // ===== CONFIGURACIÓN DE INTERFAZ =====
    UI: {
        themes: {
            default: 'dark',
            available: ['dark', 'light', 'auto'],
            autoSwitchTime: {
                darkStart: '19:00',
                lightStart: '07:00'
            }
        },
        animations: {
            enabled: true,
            duration: {
                fast: 150,
                normal: 300,
                slow: 500
            },
            easing: 'ease'
        },
        responsive: {
            breakpoints: {
                mobile: 480,
                tablet: 768,
                desktop: 1024,
                wide: 1200
            }
        },
        toast: {
            duration: 5000,
            maxVisible: 5,
            position: 'top-right'
        }
    },

    // ===== CONFIGURACIÓN DE ALMACENAMIENTO =====
    STORAGE: {
        prefix: 'marketinsight_',
        keys: {
            apiKey: 'api_key',
            theme: 'theme',
            debug: 'debug',
            userData: 'user_data',
            analysisHistory: 'analysis_history',
            preferences: 'preferences',
            funnelData: 'funnel_data',
            trendData: 'trend_data'
        },
        autoSave: true,
        compression: false
    },

    // ===== CONFIGURACIÓN DE ANÁLISIS =====
    ANALYSIS: {
        basic: {
            competencia: {
                name: 'Análisis de Competencia',
                description: 'Análisis profundo de competidores directos e indirectos',
                icon: '🏆',
                complexity: 'basic',
                estimatedTime: 30
            },
            tendencias: {
                name: 'Análisis de Tendencias',
                description: 'Identificación de tendencias emergentes y oportunidades',
                icon: '📈',
                complexity: 'basic',
                estimatedTime: 25
            },
            programas: {
                name: 'Programas de Afiliados',
                description: 'Evaluación de programas de afiliados más rentables',
                icon: '🤝',
                complexity: 'basic',
                estimatedTime: 20
            },
            keywords: {
                name: 'Keywords Rentables',
                description: 'Research de keywords de alto valor comercial',
                icon: '🔍',
                complexity: 'basic',
                estimatedTime: 35
            },
            estacionalidad: {
                name: 'Estacionalidad',
                description: 'Análisis de estacionalidad y timing óptimo',
                icon: '📅',
                complexity: 'basic',
                estimatedTime: 15
            },
            rentabilidad: {
                name: 'Rentabilidad',
                description: 'Cálculo detallado de rentabilidad y márgenes',
                icon: '💰',
                complexity: 'basic',
                estimatedTime: 20
            }
        },
        expert: {
            metricas: {
                name: 'Métricas de Conversión',
                description: 'CVR, EPC, AOV específicos del nicho',
                icon: '📊',
                complexity: 'expert',
                estimatedTime: 45
            },
            financiero: {
                name: 'Análisis Financiero',
                description: 'ROI, CPA, Profit Margin contextualizados',
                icon: '💹',
                complexity: 'expert',
                estimatedTime: 40
            },
            inteligencia: {
                name: 'Inteligencia Competitiva',
                description: 'Ad Spend, saturación del mercado',
                icon: '🕵️',
                complexity: 'expert',
                estimatedTime: 50
            },
            journey: {
                name: 'Customer Journey',
                description: 'Mapeo del Customer Journey y puntos de fricción',
                icon: '🛤️',
                complexity: 'expert',
                estimatedTime: 55
            },
            canales: {
                name: 'Canales de Tráfico',
                description: 'CPC, volúmenes, filtros por plataforma',
                icon: '📺',
                complexity: 'expert',
                estimatedTime: 35
            },
            funnels: {
                name: 'Funnels y Upsells',
                description: 'LTV, upsells, cross-selling',
                icon: '🎯',
                complexity: 'expert',
                estimatedTime: 60
            }
        }
    },

    // ===== CONFIGURACIÓN DE HERRAMIENTAS =====
    TOOLS: {
        productDetector: {
            name: 'Detector de Productos Ganadores',
            minProducts: 3,
            maxProducts: 3,
            fallbackEnabled: true,
            scoreRange: { min: 0, max: 100 }
        },
        offerValidator: {
            name: 'Validador de Ofertas',
            supportedDomains: ['clickbank.com', 'jvzoo.com', 'warriorplus.com', 'amazon.com'],
            extractionPatterns: 10,
            analysisDepth: 'comprehensive'
        },
        contentGenerator: {
            name: 'Generador de Contenido Viral',
            platforms: ['TikTok', 'Facebook', 'Instagram', 'Email', 'Blog', 'YouTube'],
            maxVariations: 3,
            metricsEstimation: true
        },
        avatarGenerator: {
            name: 'Generador de Avatares',
            modes: ['automatic', 'custom'],
            detailLevel: 'comprehensive',
            psychographicsEnabled: true
        },
        profitCalculator: {
            name: 'Calculadora de Profit',
            scenarios: ['conservative', 'realistic', 'optimistic'],
            projectionPeriods: [30, 90, 365],
            metricsTracking: true
        },
        copyTemplates: {
            name: 'Copy Templates System',
            version: '4.0',
            types: ['facebook-ads', 'google-ads', 'email-sequence'],
            abTestingEnabled: true,
            variationsPerTemplate: 3
        },
        creativeSpy: {
            name: 'Creative Spy System',
            platforms: ['Facebook', 'Instagram', 'TikTok', 'YouTube', 'Google'],
            analysisDepth: 'detailed',
            competitorTracking: true
        },
        trendPredictor: {
            name: 'Trend Predictor',
            timeframes: ['30 días', '3 meses', '6 meses', '1 año', '2 años'],
            analysisTypes: 8,
            confidenceScoring: true
        },
        funnelArchitect: {
            name: 'Funnel Architect',
            stepTypes: ['landing', 'optin', 'vsl', 'sales', 'upsell', 'downsell', 'thankyou', 'email'],
            dragDropEnabled: true,
            analyticsIntegration: true,
            exportFormats: ['pdf', 'json', 'image', 'copy']
        }
    },

    // ===== CONFIGURACIÓN DE MERCADOS =====
    MARKETS: {
        tiers: {
            tier1: {
                name: 'Tier 1',
                countries: ['US', 'CA', 'UK', 'AU', 'DE', 'FR'],
                avgCPC: { min: 0.50, max: 3.00 },
                avgCVR: { min: 1.5, max: 8.0 },
                competitionLevel: 'high'
            },
            tier2: {
                name: 'Tier 2',
                countries: ['ES', 'IT', 'NL', 'SE', 'NO', 'DK'],
                avgCPC: { min: 0.30, max: 1.50 },
                avgCVR: { min: 2.0, max: 10.0 },
                competitionLevel: 'medium'
            },
            tier3: {
                name: 'Tier 3',
                countries: ['MX', 'AR', 'CL', 'CO', 'BR', 'PE'],
                avgCPC: { min: 0.10, max: 0.80 },
                avgCVR: { min: 2.5, max: 12.0 },
                competitionLevel: 'low'
            }
        },
        currencies: {
            default: 'USD',
            supported: ['USD', 'EUR', 'GBP', 'CAD', 'AUD', 'MXN', 'BRL']
        }
    },

    // ===== CONFIGURACIÓN DE CANALES =====
    CHANNELS: {
        'facebook-ads': {
            name: 'Facebook Ads',
            avgCPC: { min: 0.30, max: 2.50 },
            avgCVR: { min: 1.2, max: 6.0 },
            bestAudiences: ['lookalike', 'interest', 'behavioral'],
            adFormats: ['image', 'video', 'carousel', 'collection']
        },
        'google-ads': {
            name: 'Google Ads',
            avgCPC: { min: 0.50, max: 4.00 },
            avgCVR: { min: 2.0, max: 8.0 },
            bestKeywordTypes: ['commercial', 'transactional', 'branded'],
            adFormats: ['search', 'display', 'shopping', 'video']
        },
        'tiktok-ads': {
            name: 'TikTok Ads',
            avgCPC: { min: 0.20, max: 1.80 },
            avgCVR: { min: 0.8, max: 4.5 },
            bestContent: ['ugc', 'trending', 'educational'],
            adFormats: ['in-feed', 'spark', 'branded-hashtag']
        },
        'seo-organic': {
            name: 'SEO Orgánico',
            avgCPC: 0,
            avgCVR: { min: 3.0, max: 15.0 },
            timeToResults: '3-6 months',
            bestContent: ['blog', 'guides', 'reviews']
        },
        'email-marketing': {
            name: 'Email Marketing',
            avgCPC: { min: 0.05, max: 0.30 },
            avgOpenRate: { min: 15, max: 35 },
            avgCTR: { min: 2, max: 8 },
            avgCVR: { min: 1.0, max: 12.0 }
        }
    },

    // ===== CONFIGURACIÓN DE PRODUCTOS =====
    PRODUCTS: {
        types: {
            digital: {
                name: 'Digital',
                avgPrice: { min: 27, max: 497 },
                avgCommission: { min: 30, max: 70 },
                deliveryTime: 'instant',
                refundRate: { min: 3, max: 15 }
            },
            physical: {
                name: 'Físico',
                avgPrice: { min: 19, max: 299 },
                avgCommission: { min: 4, max: 15 },
                deliveryTime: '3-7 days',
                refundRate: { min: 5, max: 20 }
            },
            software: {
                name: 'Software',
                avgPrice: { min: 97, max: 997 },
                avgCommission: { min: 20, max: 50 },
                deliveryTime: 'instant',
                refundRate: { min: 5, max: 25 }
            },
            course: {
                name: 'Curso Online',
                avgPrice: { min: 197, max: 2997 },
                avgCommission: { min: 40, max: 70 },
                deliveryTime: 'instant',
                refundRate: { min: 10, max: 30 }
            }
        },
        priceRanges: {
            '<$50': { min: 1, max: 49 },
            '$50-$100': { min: 50, max: 100 },
            '$100-$200': { min: 100, max: 200 },
            '$200-$300': { min: 200, max: 300 },
            '$300-$400': { min: 300, max: 400 },
            '$400-$500': { min: 400, max: 500 },
            '$500+': { min: 500, max: 10000 }
        }
    },

    // ===== CONFIGURACIÓN DE DEBUG =====
    DEBUG: {
        enabled: false,
        logLevel: 'info', // 'error', 'warn', 'info', 'debug'
        showPrompts: false,
        showApiResponses: false,
        performanceTracking: true,
        errorReporting: true,
        consoleGroups: true
    },

    // ===== CONFIGURACIÓN DE RENDIMIENTO =====
    PERFORMANCE: {
        lazyLoading: true,
        caching: {
            enabled: true,
            duration: 24 * 60 * 60 * 1000, // 24 hours
            maxSize: 50 * 1024 * 1024 // 50MB
        },
        compression: {
            enabled: false,
            algorithm: 'gzip'
        },
        analytics: {
            trackUserActions: false,
            trackPerformance: true,
            trackErrors: true
        }
    },

    // ===== CONFIGURACIÓN DE SEGURIDAD =====
    SECURITY: {
        apiKeyEncryption: false,
        sanitizeInputs: true,
        validateResponses: true,
        rateLimitingClient: true,
        corsEnabled: true,
        httpsOnly: true
    },

    // ===== CONFIGURACIÓN DE IDIOMAS =====
    LOCALIZATION: {
        defaultLanguage: 'es',
        supportedLanguages: ['es', 'en', 'pt', 'fr'],
        dateFormat: 'DD/MM/YYYY',
        currencyFormat: 'es-ES',
        numberFormat: 'es-ES'
    },

    // ===== MENSAJES DEL SISTEMA =====
    MESSAGES: {
        loading: [
            'Analizando productos ganadores...',
            'Procesando datos de mercado...',
            'Calculando métricas de conversión...',
            'Identificando oportunidades...',
            'Generando recomendaciones...',
            'Optimizando estrategias...',
            'Validando resultados...',
            'Finalizando análisis...'
        ],
        errors: {
            noApiKey: 'Por favor configura tu API Key de Google Gemini',
            invalidApiKey: 'La API Key proporcionada no es válida',
            networkError: 'Error de conexión. Verifica tu internet',
            rateLimitExceeded: 'Has excedido el límite de solicitudes. Espera un momento',
            invalidInput: 'Los datos ingresados no son válidos',
            analysisError: 'Error durante el análisis. Inténtalo de nuevo',
            exportError: 'Error al exportar los datos',
            importError: 'Error al importar los datos. Verifica el formato'
        },
        success: {
            apiKeySaved: 'API Key guardada correctamente',
            analysisComplete: 'Análisis completado exitosamente',
            dataExported: 'Datos exportados correctamente',
            dataImported: 'Datos importados correctamente',
            settingsSaved: 'Configuración guardada'
        }
    },

    // ===== CONFIGURACIÓN DE INTEGRACIONES =====
    INTEGRATIONS: {
        enabled: false,
        webhook: {
            enabled: false,
            url: '',
            events: ['analysis_complete', 'export_generated']
        },
        analytics: {
            googleAnalytics: {
                enabled: false,
                trackingId: ''
            },
            facebookPixel: {
                enabled: false,
                pixelId: ''
            }
        },
        affiliateNetworks: {
            clickbank: {
                enabled: true,
                apiKey: '',
                baseUrl: 'https://api.clickbank.com'
            },
            jvzoo: {
                enabled: true,
                apiKey: '',
                baseUrl: 'https://api.jvzoo.com'
            }
        }
    },

    // ===== CONFIGURACIÓN DE EXPERIMENTACIÓN =====
    EXPERIMENTS: {
        enabled: false,
        abTesting: {
            enabled: false,
            variants: ['A', 'B'],
            trafficSplit: 50
        },
        betaFeatures: {
            enabled: false,
            features: [
                'advanced_analytics',
                'ai_optimization',
                'real_time_data'
            ]
        }
    },

    // ===== UTILIDADES =====
    UTILS: {
        // Obtener configuración específica
        get: function(path) {
            const keys = path.split('.');
            let current = this;
            
            for (const key of keys) {
                if (current[key] === undefined) {
                    return null;
                }
                current = current[key];
            }
            
            return current;
        },

        // Establecer configuración específica
        set: function(path, value) {
            const keys = path.split('.');
            let current = this;
            
            for (let i = 0; i < keys.length - 1; i++) {
                const key = keys[i];
                if (current[key] === undefined) {
                    current[key] = {};
                }
                current = current[key];
            }
            
            current[keys[keys.length - 1]] = value;
        },

        // Validar configuración
        validate: function() {
            const required = [
                'API.gemini.endpoint',
                'STORAGE.prefix',
                'UI.themes.default'
            ];

            for (const path of required) {
                if (!this.get(path)) {
                    console.error(`Configuración requerida faltante: ${path}`);
                    return false;
                }
            }

            return true;
        },

        // Resetear a valores por defecto
        reset: function() {
            // Recargar configuración desde el archivo original
            location.reload();
        },

        // Exportar configuración actual
        export: function() {
            const config = { ...this };
            delete config.UTILS; // No exportar las utilidades
            
            return JSON.stringify(config, null, 2);
        },

        // Importar configuración
        import: function(configString) {
            try {
                const newConfig = JSON.parse(configString);
                Object.assign(this, newConfig);
                return true;
            } catch (error) {
                console.error('Error al importar configuración:', error);
                return false;
            }
        }
    }
};

// ===== INICIALIZACIÓN =====
(function() {
    // Validar configuración al cargar
    if (!window.MarketInsightConfig.UTILS.validate()) {
        console.warn('Algunas configuraciones pueden estar incompletas');
    }

    // Aplicar configuración de debug si está habilitada
    if (window.MarketInsightConfig.DEBUG.enabled) {
        console.log('🚀 MarketInsight Pro Config Loaded', {
            version: window.MarketInsightConfig.APP.version,
            buildDate: window.MarketInsightConfig.APP.buildDate,
            debugMode: true
        });
    }

    // Configurar tema automático si está habilitado
    if (window.MarketInsightConfig.UI.themes.default === 'auto') {
        const now = new Date();
        const hour = now.getHours();
        const darkStart = parseInt(window.MarketInsightConfig.UI.themes.autoSwitchTime.darkStart.split(':')[0]);
        const lightStart = parseInt(window.MarketInsightConfig.UI.themes.autoSwitchTime.lightStart.split(':')[0]);
        
        const isDarkTime = hour >= darkStart || hour < lightStart;
        document.documentElement.setAttribute('data-theme', isDarkTime ? 'dark' : 'light');
    }

    // Exposer configuración globalmente para fácil acceso
    window.Config = window.MarketInsightConfig;
    
    console.log('✅ MarketInsight Pro Configuration Initialized');
})();

// ===== EXPORT PARA MÓDULOS =====
if (typeof module !== 'undefined' && module.exports) {
    module.exports = window.MarketInsightConfig;
}
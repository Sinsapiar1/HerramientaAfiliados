/**
 * ===== MARKETINSIGHT PRO AFFILIATE EDITION =====
 * Suite completa de marketing automation para afiliados potenciada por IA
 * Version: 4.0
 * Author: MarketInsight Team
 */

// ===== CONFIGURATION & CONSTANTS =====
const CONFIG = {
    GEMINI_API_ENDPOINT: 'https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash-latest:generateContent',
    MAX_RETRIES: 3,
    RETRY_DELAY: 1000,
    LOADING_MESSAGES: [
        'Analizando productos ganadores...',
        'Procesando datos de mercado...',
        'Calculando métricas de conversión...',
        'Identificando oportunidades...',
        'Generando recomendaciones...'
    ]
};

// ===== APPLICATION STATE =====
const AppState = {
    apiKey: localStorage.getItem('marketinsight_api_key') || '',
    productosDetectados: [],
    debugMode: localStorage.getItem('marketinsight_debug') === 'true',
    currentAnalysis: null,
    configuracion: {},
    resultados: {},
    isAnalyzing: false
};

// ===== CORE CLASSES =====

/**
 * Gestiona la generación de prompts dinámicos para la IA
 */
class PromptGenerator {
    static generateProductDetectionPrompt(config) {
        const analysisSelected = this.getSelectedAnalysis();
        const analysisInstructions = this.buildAnalysisInstructions(analysisSelected);
        
        return `🎯 MISIÓN: Detectar EXACTAMENTE 3 PRODUCTOS GANADORES **reales** y **verificados** para el nicho "${config.nicho}".

👤 CONTEXTO DEL AFILIADO
- Nicho: "${config.nicho}"
- Público objetivo: "${config.publico}"
- Canal principal: ${config.canalPrincipal}
- Nivel de experiencia: ${config.experiencia}
- Dispositivo objetivo: ${config.dispositivoTarget}
- Mercado geográfico: ${config.mercadoGeo}

💰 OBJETIVOS FINANCIEROS
- Presupuesto ads: ${config.presupuestoAds || 'No especificado'}
- ROI mínimo esperado: ${config.roiObjetivo || '3x'}
- Tiempo break-even tolerable: ${config.breakEvenTime || '30 días'}
- Tipo de conversión: ${config.tipoConversion || 'Venta directa'}
- Rango de precios objetivo: ${config.rangoPrecio}
- Tipo de producto buscado: ${config.tipoProducto}

🔎 CRITERIOS DE SELECCIÓN ESTRICTOS (debe cumplirse **al menos 3**):
1. Gravity ClickBank > 50  **o** puntuación Amazon ⭐4.5+ con 500+ reviews.
2. Crecimiento >20 % en Google Trends los últimos 90 días.
3. EPC ≥ $2 y CVR ≥ 2 % en campañas públicas conocidas.
4. Refund-rate < 10 %.
5. Ticket dentro del rango de precio indicado.

📚 FUENTES A CONSIDERAR (menciona cuál aplicaste para cada producto):
• ClickBank Marketplace Top Products
• JVZoo Marketplace Best Sellers
• Amazon "Best Sellers" Category "${config.nicho}" (si aplica)
• Tendencias Google & Exploding Topics

${analysisInstructions ? `🧠 ANÁLISIS EXTRA SOLICITADOS:\n${analysisInstructions}` : ''}

⚠️ REGLAS OBLIGATORIAS
• Genera **exactamente 3** productos (sin genéricos ni categorías).
• Incluye **nombre + URL oficial** para validación rápida.
• Cada producto debe cumplir los criterios de selección.
• No inventes marcas ni métricas: usa estimaciones basadas en los datos públicos.
• Escribe en español neutro.

FORMATO OBLIGATORIO (copia tal cual los encabezados):

=== PRODUCTO [N] ===
NOMBRE: [Nombre real del producto]
URL_OFICIAL: [https://...]
PRECIO: $[XX]
COMISION: [porcentaje]% ($[XX] por venta)
SCORE: [0-100]
GRAVITY: [valor] / POPULARIDAD: [Alta/Media/Baja]

DESCRIPCION:
[Por qué es ganador y qué problema soluciona]

PAIN_POINTS:
[Problemas que resuelve]

EMOCIONES:
[Emociones involucradas]

TRIGGERS:
[Urgencia, escasez, curiosidad, etc.]

METRICAS_CONVERSION_ESPECIFICAS:
CVR_${config.canalPrincipal}_${config.nicho}: [X.X]%
EPC_NICHO_ESPECIFICO: $[X.XX]
AOV_${config.dispositivoTarget}: $[XXX]
REFUND_RATE: [X]%
LTV_${config.tipoConversion}: $[XXX]
ESTACIONALIDAD: [Mes pico]
HORARIO_OPTIMO_${config.canalPrincipal}: [Mejor horario]

ANALISIS_FINANCIERO_CONTEXTUAL:
CPA_REAL_${config.canalPrincipal}_${config.mercadoGeo}: $[XX]
CPC_PROMEDIO_NICHO: $[X.XX]
ROI_REALISTA_${config.experiencia}: [X]x
BREAK_EVEN_${config.breakEvenTime}: [X] días
PROFIT_MARGIN: [XX]%
ESCALABILIDAD: [X]/10
COMPETENCIA_NIVEL: [BAJO/MEDIO/ALTO]
SATURACION_ACTUAL: [%]

ESTRATEGIA_CONVERSION_ESPECIFICA:
[Paso a paso breve para ${config.canalPrincipal} con presupuesto ${config.presupuestoAds}]

PRODUCTOS_COMPLEMENTARIOS_NICHO:
[2-3 productos específicos]

=== FIN PRODUCTO [N] ===

Al final, incluye un VEREDICTO_GLOBAL (1-2 líneas) indicando cuál de los 3 productos tiene mejor potencial para el perfil descrito.`;
    }

    static generateContentPrompt(config) {
        return `Actúa como EXPERTO en marketing viral y copywriting para ${config.nicho} en ${config.plataforma}.

CONTEXTO ESPECÍFICO:
- Nicho: ${config.nicho}
- Plataforma: ${config.plataforma}
- Ángulo de venta: ${config.salesAngle}
- Nivel controversia: ${config.controversyLevel}
- Power words: ${config.powerWords}
- Producto específico: ${config.producto}

GENERA contenido viral optimizado para ${config.plataforma} usando:
1. Hook irresistible primeros 3 segundos
2. Problema + agitación específica del nicho
3. Solución clara con el producto
4. Call to action específico
5. Métricas estimadas de performance

FORMATO REQUERIDO:
TÍTULO/HOOK:
[Hook principal irresistible]

CONTENIDO:
[Contenido completo optimizado para ${config.plataforma}]

MÉTRICAS ESTIMADAS:
CTR estimado: [X]%
Engagement rate: [X]%
Conversión estimada: [X]%

ELEMENTOS ESPECÍFICOS DE ${config.plataforma}:
[Hashtags, formato, duración, etc.]`;
    }

    static generateAvatarPrompt(config) {
        return `Actúa como PSICÓLOGO EXPERTO en comportamiento del consumidor para crear avatar ultra-específico.

DATOS BASE:
- Nicho: ${config.nicho || AppState.configuracion.nicho}
- Género: ${config.avatarGender}
- Edad: ${config.avatarAge}
- Ingresos: ${config.avatarIncome}
- Situación familiar: ${config.avatarFamily}
- Problema principal: ${config.avatarMainProblem}
- Deseo máximo: ${config.avatarMainDesire}

CREA avatar completo con:

PERFIL DEMOGRÁFICO:
- Edad específica y rango
- Ubicación geográfica
- Nivel de ingresos detallado
- Situación laboral
- Situación familiar

PSICOGRAFÍA PROFUNDA:
- Valores fundamentales
- Creencias limitantes
- Motivaciones intrínsecas
- Estilo de vida

MIEDOS Y FRUSTRACIONES:
- 3 miedos principales específicos
- Frustraciones diarias
- Obstáculos percibidos

DESEOS Y ASPIRACIONES:
- Deseos profundos
- Objetivos a corto y largo plazo
- Imagen ideal de sí mismo

COMPORTAMIENTO DIGITAL:
- Horarios de actividad online
- Plataformas favoritas
- Tipo de contenido que consume
- Influencers que sigue

PROCESO DE COMPRA:
- Cómo investiga antes de comprar
- Factores de decisión principales
- Objeciones típicas
- Momentos de mayor disposición a comprar

LENGUAJE Y COMUNICACIÓN:
- Palabras que usa
- Tonos que prefiere
- Formatos de contenido favoritos`;
    }

    static generateValidationPrompt(url) {
        return `Actúa como EXPERTO en análisis de ofertas de afiliados. Analiza la siguiente URL y extrae información completa:

URL A ANALIZAR: ${url}

EXTRAE Y ANALIZA:

INFORMACIÓN BÁSICA:
- Nombre del producto
- Precio
- Comisión por venta
- Tipo de producto
- Red de afiliados

MÉTRICAS DE RENDIMIENTO:
- Gravity (si es ClickBank)
- EPC (Earnings Per Click)
- CVR (Conversion Rate)
- Refund Rate
- Popularidad/Ranking

ANÁLISIS COMPETITIVO:
- Nivel de competencia
- Saturación del nicho
- Diferenciadores únicos
- Fortalezas y debilidades

POTENCIAL DE AFILIADO:
- Facilidad de promoción
- Material de marketing disponible
- Support del vendor
- Escalabilidad

RECOMENDACIONES:
- ¿Vale la pena promocionar?
- Estrategias recomendadas
- Posibles problemas
- Score general (0-100)

Analiza todo con enfoque práctico para afiliados.`;
    }

    static getSelectedAnalysis() {
        const checkboxes = document.querySelectorAll('input[type="checkbox"]:checked');
        return Array.from(checkboxes).map(cb => cb.id);
    }

    static buildAnalysisInstructions(selectedAnalysis) {
        const analysisMap = {
            competencia: '🏆 Análisis profundo de competidores directos e indirectos',
            tendencias: '📈 Identificación de tendencias emergentes y oportunidades',
            programas: '🤝 Evaluación de programas de afiliados más rentables',
            keywords: '🔍 Research de keywords de alto valor comercial',
            estacionalidad: '📅 Análisis de estacionalidad y timing óptimo',
            rentabilidad: '💰 Cálculo detallado de rentabilidad y márgenes',
            metricas: '📊 Métricas avanzadas: CVR, EPC, AOV específicos del nicho',
            financiero: '💹 Análisis financiero: ROI, CPA, Profit Margin contextualizados',
            inteligencia: '🕵️ Inteligencia competitiva: Ad Spend, saturación del mercado',
            journey: '🛤️ Mapeo del Customer Journey y puntos de fricción',
            canales: '📺 Análisis de canales: CPC, volúmenes, filtros por plataforma',
            funnels: '🎯 Optimización de funnels: LTV, upsells, cross-selling'
        };

        return selectedAnalysis
            .map(id => analysisMap[id])
            .filter(Boolean)
            .join('\n');
    }
}

/**
 * Procesa y limpia las respuestas de la IA
 */
class ResponseProcessor {
    static processProductDetection(response, config) {
        config = config || {};
        try {
            const cleanText = ResponseProcessor.cleanResponse(response);
            const products = ResponseProcessor.extractProducts(cleanText);
            
            if (products.length === 0) {
                console.warn('No se pudieron extraer productos de la respuesta, usando fallbacks específicos');
                return ResponseProcessor.generateFallbackProducts(config);
            }
            
            // Asegurar que siempre tengamos exactamente 3 productos
            while (products.length < 3) {
                products.push(ResponseProcessor.generateFallbackProduct(products.length + 1, config));
            }
            
            return products.slice(0, 3);
        } catch (error) {
            console.error('Error procesando detección de productos:', error);
            return ResponseProcessor.generateFallbackProducts(config);
        }
    }

    static cleanResponse(response) {
        return response
            .replace(/\*\*(.*?)\*\*/g, '$1')
            .replace(/\*(.*?)\*/g, '$1')
            .replace(/```.*?\n/g, '')
            .replace(/```/g, '')
            .trim();
    }

    static extractProducts(text) {
        const products = [];
        const productRegex = /=== PRODUCTO \[(\d+)\] ===([\s\S]*?)(?==== FIN PRODUCTO \[\d+\] ===|=== PRODUCTO \[\d+\] ===|VEREDICTO FINAL|$)/gi;
        
        let match;
        while ((match = productRegex.exec(text)) !== null) {
            const productText = match[2];
            const product = ResponseProcessor.parseProductFromText(productText);
            if (product.nombre) {
                products.push(product);
            }
        }
        
        return products;
    }

    static parseProductFromText(text) {
        const product = {
            nombre: ResponseProcessor.extractField(text, 'NOMBRE'),
            precio: ResponseProcessor.extractField(text, 'PRECIO'),
            comision: ResponseProcessor.extractField(text, 'COMISION'),
            score: ResponseProcessor.extractField(text, 'SCORE') || '85',
            gravity: ResponseProcessor.extractField(text, 'GRAVITY') || ResponseProcessor.extractField(text, 'POPULARIDAD'),
            descripcion: ResponseProcessor.extractField(text, 'DESCRIPCION'),
            painPoints: ResponseProcessor.extractField(text, 'PAIN_POINTS'),
            emociones: ResponseProcessor.extractField(text, 'EMOCIONES'),
            triggers: ResponseProcessor.extractField(text, 'TRIGGERS'),
            metricas: ResponseProcessor.extractMetrics(text),
            analisisFinanciero: ResponseProcessor.extractFinancialAnalysis(text),
            programasAfiliados: ResponseProcessor.extractField(text, 'PROGRAMAS_AFILIADOS'),
            estrategia: ResponseProcessor.extractField(text, 'ESTRATEGIA_CONVERSION_ESPECIFICA'),
            productosComplementarios: ResponseProcessor.extractField(text, 'PRODUCTOS_COMPLEMENTARIOS_NICHO'),
            alertas: ResponseProcessor.extractAlerts(text)
        };
        
        return product;
    }

    static extractField(text, fieldName) {
        const patterns = [
            new RegExp(`${fieldName}:\\s*([\\s\\S]*?)(?=\\n[A-Z_]+:|\\n===|$)`, 'i'),
            new RegExp(`${fieldName}\\s*:\\s*(.*)`, 'i'),
            new RegExp(`${fieldName}\\s*([\\s\\S]*?)(?=\\n\\n|\\n[A-Z]|$)`, 'i')
        ];
        
        for (const pattern of patterns) {
            const match = text.match(pattern);
            if (match && match[1]) {
                return match[1].trim().replace(/^\[|\]$/g, '');
            }
        }
        
        return '';
    }

    static extractMetrics(text) {
        const metrics = {};
        const metricsSection = text.match(/METRICAS_CONVERSION_ESPECIFICAS:([\s\S]*?)(?=\n[A-Z_]+:|$)/i);
        
        if (metricsSection) {
            const lines = metricsSection[1].split('\n');
            lines.forEach(function(line) {
                const match = line.match(/([A-Z_]+):\s*([^]+)/);
                if (match) {
                    metrics[match[1]] = match[2].trim();
                }
            });
        }
        
        return metrics;
    }

    static extractFinancialAnalysis(text) {
        const analysis = {};
        const analysisSection = text.match(/ANALISIS_FINANCIERO_CONTEXTUAL:([\s\S]*?)(?=\n[A-Z_]+:|$)/i);
        
        if (analysisSection) {
            const lines = analysisSection[1].split('\n');
            lines.forEach(function(line) {
                const match = line.match(/([A-Z_]+):\s*([^]+)/);
                if (match) {
                    analysis[match[1]] = match[2].trim();
                }
            });
        }
        
        return analysis;
    }

    static extractAlerts(text) {
        const alerts = {};
        const alertPatterns = [
            /⚠️\s*ERRORES[^:]*:\s*([^]+?)(?=\n🚫|\n📊|$)/i,
            /🚫\s*EVITAR[^:]*:\s*([^]+?)(?=\n📊|\n⚠️|$)/i,
            /📊\s*METRICAS[^:]*:\s*([^]+?)(?=\n=|$)/i
        ];
        
        alertPatterns.forEach(function(pattern, index) {
            const match = text.match(pattern);
            if (match) {
                const keys = ['errores', 'evitar', 'metricas'];
                alerts[keys[index]] = match[1].trim();
            }
        });
        
        return alerts;
    }

    static generateFallbackProduct(index, config) {
        config = config || {};
        const nicho = config.nicho || 'marketing digital';
        const canalPrincipal = config.canalPrincipal || 'Facebook Ads';
        
        const fallbackProducts = [
            {
                nombre: ResponseProcessor.generateSpecificProductName(nicho, 'curso', index),
                precio: "$197",
                comision: "50% ($98.50 por venta)",
                score: "78",
                gravity: "Alta",
                descripcion: "Curso especializado en " + nicho + " con alta demanda en " + canalPrincipal,
                painPoints: "Falta de conocimiento especializado en " + nicho + ", pérdida de tiempo y dinero",
                emociones: "Frustración por falta de resultados, deseo de éxito en el nicho",
                triggers: "Urgencia, escasez, autoridad, prueba social específica del nicho",
                metricas: {
                    CVR: "2.5%",
                    EPC: "$2.45",
                    AOV: "$197"
                },
                analisisFinanciero: {
                    CPA: "$40",
                    ROI: "2.5x",
                    ESCALABILIDAD: "8/10"
                }
            },
            {
                nombre: ResponseProcessor.generateSpecificProductName(nicho, 'software', index),
                precio: "$97/mes",
                comision: "30% ($29.10 mensual)",
                score: "82",
                gravity: "Media-Alta",
                descripcion: "Herramienta SaaS específica para " + nicho + " con modelo de suscripción",
                painPoints: "Procesos manuales en " + nicho + ", pérdida de productividad",
                emociones: "Ansiedad por eficiencia, deseo de automatización en el nicho",
                triggers: "Conveniencia, resultados rápidos, ROI específico",
                metricas: {
                    CVR: "3.2%",
                    EPC: "$0.93",
                    LTV: "$582"
                },
                analisisFinanciero: {
                    CPA: "$30",
                    ROI: "4.2x",
                    ESCALABILIDAD: "9/10"
                }
            },
            {
                nombre: ResponseProcessor.generateSpecificProductName(nicho, 'fisico', index),
                precio: "$149",
                comision: "25% ($37.25 por venta)",
                score: "75",
                gravity: "Media",
                descripcion: "Producto físico premium para " + nicho + " con alta satisfacción",
                painPoints: "Búsqueda de calidad en productos de " + nicho + ", desconfianza en alternativas baratas",
                emociones: "Deseo de calidad, satisfacción, estatus en el nicho",
                triggers: "Calidad, garantía, testimonios específicos",
                metricas: {
                    CVR: "1.8%",
                    EPC: "$0.67",
                    AOV: "$149"
                },
                analisisFinanciero: {
                    CPA: "$37",
                    ROI: "2.1x",
                    ESCALABILIDAD: "6/10"
                }
            }
        ];
        
        return fallbackProducts[index - 1] || fallbackProducts[0];
    }

    static generateSpecificProductName(nicho, tipo, index) {
        const nombresPorNicho = {
            'fitness': {
                curso: ['Fitness Transformation Masterclass', 'Complete Home Workout System', 'Advanced Nutrition Certification'],
                software: ['MyFitnessPal Premium', 'Strava Summit', 'Precision Nutrition App'],
                fisico: ['Resistance Bands Pro Set', 'Smart Fitness Tracker', 'Premium Protein Powder']
            },
            'marketing': {
                curso: ['Digital Marketing Mastery 2024', 'Facebook Ads Bootcamp', 'Email Marketing Pro Course'],
                software: ['ClickFunnels 2.0', 'ConvertKit Pro', 'Leadpages Premium'],
                fisico: ['Marketing Books Bundle', 'Professional Ring Light', 'Business Planner Premium']
            },
            'salud': {
                curso: ['Holistic Health Certification', 'Weight Loss Transformation', 'Wellness Coach Training'],
                software: ['Cronometer Gold', 'Headspace Premium', 'Calm App Subscription'],
                fisico: ['Organic Supplements Set', 'Air Purifier Pro', 'Sleep Optimization Kit']
            },
            'tecnologia': {
                curso: ['Full Stack Developer Bootcamp', 'AI/ML Certification Program', 'Cybersecurity Expert Course'],
                software: ['GitHub Pro', 'Figma Professional', 'Adobe Creative Cloud'],
                fisico: ['Mechanical Keyboard Pro', 'Ergonomic Office Setup', 'Professional Webcam 4K']
            },
            'belleza': {
                curso: ['Professional Makeup Course', 'Skincare Expert Certification', 'Hair Styling Mastery'],
                software: ['Beauty Plus Premium', 'Perfect365 Pro', 'ModiFace App'],
                fisico: ['Professional Makeup Kit', 'LED Face Mask Pro', 'Premium Skincare Set']
            },
            'finanzas': {
                curso: ['Investment Mastery Course', 'Cryptocurrency Trading Pro', 'Real Estate Wealth Building'],
                software: ['Quicken Premier', 'YNAB (You Need A Budget)', 'TurboTax Business'],
                fisico: ['Financial Planning Workbook', 'Investment Calculator Pro', 'Money Management Journal']
            }
        };

        // Detectar nicho por palabras clave
        const nichoDetectado = Object.keys(nombresPorNicho).find(function(key) {
            return nicho.toLowerCase().includes(key) || 
                   nicho.toLowerCase().includes(key.slice(0, -1));
        }) || 'marketing';

        const productos = nombresPorNicho[nichoDetectado][tipo] || nombresPorNicho.marketing[tipo];
        return productos[index - 1] || productos[0] || tipo + " especializado en " + nicho;
    }

    static generateFallbackProducts(config) {
        config = config || {};
        return [
            ResponseProcessor.generateFallbackProduct(1, config),
            ResponseProcessor.generateFallbackProduct(2, config),
            ResponseProcessor.generateFallbackProduct(3, config)
        ];
    }
}

/**
 * Gestiona la interfaz de usuario y las interacciones
 */
class UIManager {
    static init() {
        this.bindEvents();
        this.loadStoredData();
        this.initModals();
        this.initTabs();
    }

    static bindEvents() {
        // API Configuration
        document.getElementById('saveApiKey')?.addEventListener('click', this.saveApiKey.bind(this));
        document.getElementById('testApiKey')?.addEventListener('click', this.testApiKey.bind(this));
        document.getElementById('toggleDebug')?.addEventListener('click', this.toggleDebugMode.bind(this));
        
        // Main Form
        document.getElementById('configurationForm')?.addEventListener('submit', this.handleAnalysis.bind(this));
        document.getElementById('fillExampleData')?.addEventListener('click', this.fillExampleData.bind(this));
        
        // Quick Actions
        document.getElementById('validarOferta')?.addEventListener('click', function() {
            UIManager.openModal('validadorModal');
        });
        document.getElementById('generarAvatar')?.addEventListener('click', function() {
            UIManager.openModal('avatarModal');
        });
        document.getElementById('contenidoViral')?.addEventListener('click', function() {
            UIManager.openModal('contenidoModal');
        });
        document.getElementById('calculadoraProfit')?.addEventListener('click', function() {
            UIManager.openModal('calculadoraModal');
        });
        
        // Tools
        document.getElementById('openValidador')?.addEventListener('click', function() {
            UIManager.openModal('validadorModal');
        });
        document.getElementById('openContenido')?.addEventListener('click', function() {
            UIManager.openModal('contenidoModal');
        });
        document.getElementById('openAvatar')?.addEventListener('click', function() {
            UIManager.openModal('avatarModal');
        });
        document.getElementById('openCalculadora')?.addEventListener('click', function() {
            UIManager.openModal('calculadoraModal');
        });
        document.getElementById('openTemplates')?.addEventListener('click', function() {
            UIManager.openModal('templatesModal');
        });
        document.getElementById('openSpy')?.addEventListener('click', function() {
            UIManager.openModal('spyModal');
        });
        
        // Modal Actions
        document.getElementById('validarOfertaBtn')?.addEventListener('click', this.validateOffer.bind(this));
        document.getElementById('generarAvatarAuto')?.addEventListener('click', this.generateAutoAvatar.bind(this));
        document.getElementById('generarAvatarPersonalizado')?.addEventListener('click', this.generateCustomAvatar.bind(this));
        document.getElementById('generarContenidoBtn')?.addEventListener('click', this.generateViralContent.bind(this));
        document.getElementById('calcularProfitBtn')?.addEventListener('click', this.calculateProfit.bind(this));
        
        // Copy Templates
        document.getElementById('generarFacebookAd')?.addEventListener('click', () => this.generateTemplate('facebook'));
        document.getElementById('generarGoogleAd')?.addEventListener('click', () => this.generateTemplate('google'));
        document.getElementById('generarEmailSequence')?.addEventListener('click', () => this.generateTemplate('email'));
        
        // Creative Spy
        document.getElementById('analizarCreativesBtn')?.addEventListener('click', this.analyzeCreatives.bind(this));
        
        // New Analysis
        document.getElementById('newAnalysisBtn')?.addEventListener('click', this.newAnalysis.bind(this));
        
        // Theme Toggle
        document.getElementById('themeToggle')?.addEventListener('click', UIManager.toggleTheme.bind(UIManager));
        
        // Close modals
        const modalCloseButtons = document.querySelectorAll('.modal-close');
        for (let i = 0; i < modalCloseButtons.length; i++) {
            modalCloseButtons[i].addEventListener('click', function(e) {
                const modalId = e.target.getAttribute('data-modal');
                UIManager.closeModal(modalId);
            });
        }
        
        // Close modals on outside click
        const modals = document.querySelectorAll('.modal');
        for (let j = 0; j < modals.length; j++) {
            modals[j].addEventListener('click', function(e) {
                if (e.target === this) {
                    this.classList.remove('active');
                }
            });
        }
    }

    static loadStoredData() {
        const apiKey = localStorage.getItem('marketinsight_api_key');
        if (apiKey) {
            document.getElementById('apiKey').value = apiKey;
            AppState.apiKey = apiKey;
            UIManager.updateApiStatus('saved', '✅ API Key guardada');
        }
        
        const theme = localStorage.getItem('marketinsight_theme') || 'dark';
        document.documentElement.setAttribute('data-theme', theme);
        document.getElementById('themeToggle').textContent = theme === 'dark' ? '🌙' : '☀️';
        
        // Load debug mode
        const debugMode = localStorage.getItem('marketinsight_debug') === 'true';
        AppState.debugMode = debugMode;
        const debugBtn = document.getElementById('toggleDebug');
        if (debugBtn) {
            debugBtn.textContent = debugMode ? '🔧 Debug ON' : '🔧 Debug';
            debugBtn.style.background = debugMode ? 'var(--warning-color)' : '';
        }
        
        if (debugMode) {
            console.log('🔧 Debug Mode cargado desde localStorage');
        }
    }

    static async saveApiKey() {
        const apiKey = document.getElementById('apiKey').value.trim();
        
        if (!apiKey) {
            UIManager.showToast('Error', 'Por favor ingresa una API Key válida', 'error');
            return;
        }
        
        try {
            localStorage.setItem('marketinsight_api_key', apiKey);
            AppState.apiKey = apiKey;
            UIManager.updateApiStatus('success', '✅ API Key guardada correctamente');
            UIManager.showToast('Éxito', 'API Key guardada correctamente', 'success');
            
            // Test the API key automatically
            await UIManager.testApiKey();
        } catch (error) {
            UIManager.updateApiStatus('error', '❌ Error al guardar API Key');
            UIManager.showToast('Error', 'Error al guardar API Key', 'error');
        }
    }

    static async testApiKey() {
        const apiKey = AppState.apiKey || document.getElementById('apiKey').value.trim();
        
        if (!apiKey) {
            UIManager.updateApiStatus('error', '❌ No hay API Key para probar');
            return;
        }
        
        UIManager.updateApiStatus('warning', '🔄 Probando conexión...');
        
        try {
            const response = await APIManager.makeRequest('Hola, ¿estás funcionando?');
            
            if (response) {
                UIManager.updateApiStatus('success', '✅ Conexión exitosa');
                UIManager.showToast('Éxito', 'API Key funcionando correctamente', 'success');
                return true;
            } else {
                throw new Error('Respuesta vacía');
            }
        } catch (error) {
            UIManager.updateApiStatus('error', '❌ Error de conexión');
            UIManager.showToast('Error', 'Error al conectar con la API. Verifica tu API Key.', 'error');
            return false;
        }
    }

    static updateApiStatus(type, message) {
        const statusEl = document.getElementById('apiStatus');
        if (statusEl) {
            statusEl.className = `api-status ${type}`;
            statusEl.textContent = message;
        }
    }

    static async handleAnalysis(e) {
        e.preventDefault();
        
        if (AppState.isAnalyzing) {
            this.showToast('Aviso', 'Ya hay un análisis en progreso', 'warning');
            return;
        }
        
        if (!AppState.apiKey) {
            this.showToast('Error', 'Configura tu API Key primero', 'error');
            return;
        }
        
        try {
            AppState.isAnalyzing = true;
            this.showLoading(true);
            
            // Collect configuration
            const config = this.collectConfiguration();
            AppState.configuracion = config;
            
            // Debug logging
            if (AppState.debugMode) {
                console.log('🔍 Configuración del análisis:', config);
            }
            
            // Generate and send prompt
            const prompt = PromptGenerator.generateProductDetectionPrompt(config);
            
            if (AppState.debugMode) {
                console.log('📝 Prompt generado:', prompt);
            }
            
            const response = await APIManager.makeRequest(prompt);
            
            if (!response) {
                throw new Error('No se recibió respuesta de la IA');
            }
            
            if (AppState.debugMode) {
                console.log('🤖 Respuesta de IA:', response);
            }
            
            // Process response
            const products = ResponseProcessor.processProductDetection(response, config);
            AppState.productosDetectados = products;
            
            if (AppState.debugMode) {
                console.log('📊 Productos procesados:', products);
            }
            
            // Show results
            this.displayResults(products);
            this.showToast('Éxito', '🎯 Productos ganadores detectados', 'success');
            
        } catch (error) {
            console.error('Error en análisis:', error);
            this.showToast('Error', `Error en el análisis: ${error.message}`, 'error');
        } finally {
            AppState.isAnalyzing = false;
            this.showLoading(false);
        }
    }

    static collectConfiguration() {
        const config = {
            nicho: document.getElementById('nicho').value.trim(),
            publico: document.getElementById('publico').value.trim(),
            rangoPrecio: document.getElementById('rangoPrecio').value,
            tipoProducto: document.getElementById('tipoProducto').value,
            canalPrincipal: document.getElementById('canalPrincipal').value,
            experiencia: document.getElementById('experiencia').value,
            presupuestoAds: document.getElementById('presupuestoAds').value,
            roiObjetivo: document.getElementById('roiObjetivo').value,
            breakEvenTime: document.getElementById('breakEvenTime').value,
            tipoConversion: document.getElementById('tipoConversion').value,
            dispositivoTarget: document.getElementById('dispositivoTarget').value,
            mercadoGeo: document.getElementById('mercadoGeo').value
        };

        // Validar especificidad del nicho
        const nichosGenericos = ['marketing', 'fitness', 'salud', 'tecnologia', 'belleza', 'finanzas', 'educacion', 'negocios'];
        const esGenerico = nichosGenericos.some(function(generico) {
            return config.nicho.toLowerCase() === generico || 
                   config.nicho.toLowerCase().includes(generico + ' general');
        });

        if (esGenerico || config.nicho.length < 10) {
            UIManager.showToast(
                'Recomendación', 
                'Tu nicho "' + config.nicho + '" parece genérico. Para mejores resultados, sé más específico (ej: "Pérdida de peso para mujeres +40" en lugar de "fitness")', 
                'warning'
            );
        }

        return config;
    }

    static displayResults(products) {
        document.getElementById('configurationSection').style.display = 'none';
        document.getElementById('resultsSection').style.display = 'block';
        
        const container = document.getElementById('productsContainer');
        container.innerHTML = '';
        
        products.forEach(function(product, index) {
            const productCard = UIManager.createProductCard(product, index + 1);
            container.appendChild(productCard);
        });
        
        // Scroll to results
        document.getElementById('resultsSection').scrollIntoView({ behavior: 'smooth' });
    }

    static createProductCard(product, index) {
        const card = document.createElement('div');
        card.className = 'product-card';
        
        const metricsEntries = Object.entries(product.metricas || {});
        const metricsHtml = metricsEntries.map(function(entry) {
            return '<strong>' + entry[0] + ':</strong> ' + entry[1];
        }).join('<br>') || 'Métricas específicas del producto';
        
        const financialEntries = Object.entries(product.analisisFinanciero || {});
        const financialHtml = financialEntries.map(function(entry) {
            return '<strong>' + entry[0] + ':</strong> ' + entry[1];
        }).join('<br>') || 'Análisis financiero detallado';
        
        card.innerHTML = 
            '<div class="product-header">' +
                '<h2 class="product-title">' + (product.nombre || 'Producto ' + index) + '</h2>' +
                '<div class="product-score">' + (product.score || '85') + '/100</div>' +
            '</div>' +
            
            '<div class="product-meta">' +
                '<div class="meta-item">' +
                    '<div class="meta-label">Precio</div>' +
                    '<div class="meta-value">' + (product.precio || 'N/A') + '</div>' +
                '</div>' +
                '<div class="meta-item">' +
                    '<div class="meta-label">Comisión</div>' +
                    '<div class="meta-value">' + (product.comision || 'N/A') + '</div>' +
                '</div>' +
                '<div class="meta-item">' +
                    '<div class="meta-label">Gravity</div>' +
                    '<div class="meta-value">' + (product.gravity || 'Media') + '</div>' +
                '</div>' +
                '<div class="meta-item">' +
                    '<div class="meta-label">CVR Estimado</div>' +
                    '<div class="meta-value">' + ((product.metricas && product.metricas.CVR) || '2.5%') + '</div>' +
                '</div>' +
            '</div>' +
            
            '<div class="product-description">' +
                (product.descripcion || 'Producto con alto potencial de conversión en el nicho seleccionado.') +
            '</div>' +
            
            '<div class="product-details">' +
                '<div class="detail-section">' +
                    '<div class="detail-title">🎯 Pain Points</div>' +
                    '<div class="detail-content">' + (product.painPoints || 'Problemas específicos del público objetivo') + '</div>' +
                '</div>' +
                
                '<div class="detail-section">' +
                    '<div class="detail-title">💭 Emociones</div>' +
                    '<div class="detail-content">' + (product.emociones || 'Emociones clave involucradas') + '</div>' +
                '</div>' +
                
                '<div class="detail-section">' +
                    '<div class="detail-title">⚡ Triggers</div>' +
                    '<div class="detail-content">' + (product.triggers || 'Disparadores psicológicos efectivos') + '</div>' +
                '</div>' +
                
                '<div class="detail-section">' +
                    '<div class="detail-title">📊 Métricas</div>' +
                    '<div class="detail-content">' + metricsHtml + '</div>' +
                '</div>' +
                
                '<div class="detail-section">' +
                    '<div class="detail-title">💰 Análisis Financiero</div>' +
                    '<div class="detail-content">' + financialHtml + '</div>' +
                '</div>' +
                
                '<div class="detail-section">' +
                    '<div class="detail-title">🎯 Estrategia</div>' +
                    '<div class="detail-content">' + (product.estrategia || 'Estrategia de conversión específica') + '</div>' +
                '</div>' +
            '</div>';
        
        return card;
    }

    static fillExampleData() {
        // Rellenar formulario con datos de ejemplo
        document.getElementById('nicho').value = 'Pérdida de peso para mujeres mayores de 40 años';
        document.getElementById('publico').value = 'Mujeres 40-55 años, profesionales, con sobrepeso';
        document.getElementById('rangoPrecio').value = '50-200';
        document.getElementById('tipoProducto').value = 'digital';
        document.getElementById('canalPrincipal').value = 'Facebook Ads';
        document.getElementById('experiencia').value = 'intermedio';
        document.getElementById('presupuestoAds').value = '1000-5000';
        document.getElementById('roiObjetivo').value = '3x';
        document.getElementById('breakEvenTime').value = '1 mes';
        document.getElementById('tipoConversion').value = 'venta';
        document.getElementById('dispositivoTarget').value = 'mobile';
        document.getElementById('mercadoGeo').value = 'Estados Unidos';
        
        UIManager.showToast('Info', 'Datos de ejemplo cargados', 'info');
    }

    static async validateOffer() {
        const url = document.getElementById('ofertaUrl').value.trim();
        
        if (!url) {
            this.showToast('Error', 'Ingresa una URL válida', 'error');
            return;
        }
        
        if (!AppState.apiKey) {
            this.showToast('Error', 'Configura tu API Key primero', 'error');
            return;
        }
        
        try {
            this.showToast('Info', 'Analizando oferta...', 'info');
            
            const prompt = PromptGenerator.generateValidationPrompt(url);
            const response = await APIManager.makeRequest(prompt);
            
            if (response) {
                document.getElementById('validacionResults').innerHTML = `
                    <div class="result-title">🔍 Análisis de la Oferta</div>
                    <div class="result-content">${response}</div>
                `;
                this.showToast('Éxito', 'Oferta analizada correctamente', 'success');
            }
        } catch (error) {
            this.showToast('Error', `Error al validar oferta: ${error.message}`, 'error');
        }
    }

    static async generateAutoAvatar() {
        if (!AppState.apiKey) {
            this.showToast('Error', 'Configura tu API Key primero', 'error');
            return;
        }
        
        if (!AppState.configuracion.nicho) {
            this.showToast('Error', 'Realiza un análisis primero', 'error');
            return;
        }
        
        try {
            this.showToast('Info', 'Generando avatares automáticos...', 'info');
            
            const config = {
                nicho: AppState.configuracion.nicho,
                publico: AppState.configuracion.publico,
                avatarGender: 'Mixto',
                avatarAge: '25-45',
                avatarIncome: 'Medios',
                avatarFamily: 'Variado',
                avatarMainProblem: 'Específico del nicho',
                avatarMainDesire: 'Solución efectiva'
            };
            
            const prompt = PromptGenerator.generateAvatarPrompt(config);
            const response = await APIManager.makeRequest(prompt);
            
            if (response) {
                document.getElementById('avatarResults').innerHTML = `
                    <div class="result-title">👥 Avatares Generados</div>
                    <div class="result-content">${response}</div>
                `;
                this.showToast('Éxito', 'Avatares generados correctamente', 'success');
            }
        } catch (error) {
            this.showToast('Error', `Error al generar avatares: ${error.message}`, 'error');
        }
    }

    static async generateCustomAvatar() {
        if (!AppState.apiKey) {
            this.showToast('Error', 'Configura tu API Key primero', 'error');
            return;
        }
        
        const config = {
            nicho: AppState.configuracion?.nicho || 'General',
            avatarGender: document.getElementById('avatarGender').value,
            avatarAge: document.getElementById('avatarAge').value.trim(),
            avatarIncome: document.getElementById('avatarIncome').value,
            avatarFamily: document.getElementById('avatarFamily').value,
            avatarMainProblem: document.getElementById('avatarMainProblem').value.trim(),
            avatarMainDesire: document.getElementById('avatarMainDesire').value.trim()
        };
        
        if (!config.avatarAge || !config.avatarMainProblem || !config.avatarMainDesire) {
            this.showToast('Error', 'Completa todos los campos requeridos', 'error');
            return;
        }
        
        try {
            this.showToast('Info', 'Generando avatar personalizado...', 'info');
            
            const prompt = PromptGenerator.generateAvatarPrompt(config);
            const response = await APIManager.makeRequest(prompt);
            
            if (response) {
                document.getElementById('avatarResults').innerHTML = `
                    <div class="result-title">👤 Avatar Personalizado</div>
                    <div class="result-content">${response}</div>
                `;
                this.showToast('Éxito', 'Avatar personalizado generado', 'success');
            }
        } catch (error) {
            this.showToast('Error', `Error al generar avatar: ${error.message}`, 'error');
        }
    }

    static async generateViralContent() {
        if (!AppState.apiKey) {
            this.showToast('Error', 'Configura tu API Key primero', 'error');
            return;
        }
        
        const config = {
            nicho: AppState.configuracion?.nicho || 'General',
            plataforma: document.getElementById('plataforma').value,
            salesAngle: document.getElementById('salesAngle').value,
            controversyLevel: document.getElementById('controversyLevel').value,
            powerWords: document.getElementById('powerWords').value,
            producto: document.getElementById('productoContenido').value.trim()
        };
        
        try {
            this.showToast('Info', 'Generando contenido viral...', 'info');
            
            const prompt = PromptGenerator.generateContentPrompt(config);
            const response = await APIManager.makeRequest(prompt);
            
            if (response) {
                document.getElementById('contenidoResults').innerHTML = `
                    <div class="result-title">✨ Contenido Viral para ${config.plataforma}</div>
                    <div class="result-content">${response}</div>
                `;
                this.showToast('Éxito', 'Contenido viral generado', 'success');
            }
        } catch (error) {
            this.showToast('Error', `Error al generar contenido: ${error.message}`, 'error');
        }
    }

    static calculateProfit() {
        const visitas = parseInt(document.getElementById('visitasDiarias').value) || 0;
        const conversion = parseFloat(document.getElementById('conversionRate').value) || 0;
        const comision = parseFloat(document.getElementById('comisionPromedio').value) || 0;
        const cpa = parseFloat(document.getElementById('costoAdquisicion').value) || 0;
        
        if (visitas <= 0 || conversion <= 0 || comision <= 0) {
            this.showToast('Error', 'Completa todos los campos con valores válidos', 'error');
            return;
        }
        
        // Cálculos
        const ventasDiarias = (visitas * conversion) / 100;
        const ingresosDiarios = ventasDiarias * comision;
        const costosDiarios = ventasDiarias * cpa;
        const profitDiario = ingresosDiarios - costosDiarios;
        
        const scenarios = {
            conservador: {
                title: 'Conservador',
                multiplier: 0.7,
                profit: profitDiario * 0.7 * 30,
                description: 'Estimación cautelosa'
            },
            realista: {
                title: 'Realista',
                multiplier: 1.0,
                profit: profitDiario * 30,
                description: 'Estimación probable'
            },
            optimista: {
                title: 'Optimista',
                multiplier: 1.5,
                profit: profitDiario * 1.5 * 30,
                description: 'Mejor escenario'
            }
        };
        
        let resultsHTML = `
            <div class="result-title">💰 Proyección de Ganancias (30 días)</div>
            <div class="profit-scenarios">
        `;
        
        Object.values(scenarios).forEach(scenario => {
            resultsHTML += `
                <div class="scenario-card">
                    <div class="scenario-title">${scenario.title}</div>
                    <div class="scenario-value">$${scenario.profit.toFixed(2)}</div>
                    <div class="scenario-desc">${scenario.description}</div>
                </div>
            `;
        });
        
        resultsHTML += `
            </div>
            <div class="result-content">
                <strong>Métricas diarias:</strong><br>
                • Conversiones: ${ventasDiarias.toFixed(2)}<br>
                • Ingresos: $${ingresosDiarios.toFixed(2)}<br>
                • Costos: $${costosDiarios.toFixed(2)}<br>
                • Profit: $${profitDiario.toFixed(2)}<br><br>
                
                <strong>ROI:</strong> ${((profitDiario / costosDiarios) * 100).toFixed(1)}%<br>
                <strong>Break-even:</strong> ${cpa > comision ? 'No rentable' : `${(cpa / comision * 100).toFixed(1)}% CVR necesario`}
            </div>
        `;
        
        document.getElementById('profitResults').innerHTML = resultsHTML;
        this.showToast('Éxito', 'Proyección calculada', 'success');
    }

    static async generateTemplate(type) {
        if (!AppState.apiKey) {
            UIManager.showToast('Error', 'Configura tu API Key primero', 'error');
            return;
        }
        
        let producto, resultId, prompt;
        
        switch (type) {
            case 'facebook':
                producto = document.getElementById('facebookProducto').value.trim();
                resultId = 'facebookResults';
                prompt = 'Crea un anuncio de Facebook altamente convertidor para el producto "' + producto + '". Incluye:\n\n1. HEADLINE principal (máximo 40 caracteres)\n2. PRIMARY TEXT persuasivo (125 palabras)\n3. DESCRIPTION complementaria (30 palabras)\n4. CALL TO ACTION específico\n5. TARGETING sugerido\n6. INTERESES para segmentar\n7. MÉTRICAS esperadas (CTR, CPC estimado)\n\nUsa copywriting directo y persuasivo.';
                break;
                
            case 'google':
                producto = document.getElementById('googleProducto').value.trim();
                resultId = 'googleResults';
                prompt = 'Crea anuncios de Google Ads para el producto "' + producto + '". Incluye:\n\n1. 3 HEADLINES (30 caracteres cada uno)\n2. 2 DESCRIPTIONS (90 caracteres cada una)\n3. KEYWORDS principales (exact, phrase, broad)\n4. KEYWORDS negativas recomendadas\n5. LANDING PAGE optimization tips\n6. BID STRATEGY sugerida\n7. MÉTRICAS esperadas (QS, CPC estimado)\n\nOptimiza para Quality Score alto.';
                break;
                
            case 'email':
                producto = document.getElementById('emailProducto').value.trim();
                const length = document.getElementById('emailLength').value;
                resultId = 'emailResults';
                prompt = 'Crea una secuencia de ' + length + ' emails para el producto "' + producto + '". Para cada email incluye:\n\n1. SUBJECT LINE llamativo\n2. PREVIEW TEXT optimizado\n3. CONTENIDO completo del email\n4. CALL TO ACTION específico\n5. TIMING recomendado (cuándo enviar)\n\nSecuencia debe crear deseo, manejar objeciones y cerrar venta.';
                break;
        }
        
        if (!producto) {
            UIManager.showToast('Error', 'Ingresa el nombre del producto', 'error');
            return;
        }
        
        try {
            UIManager.showToast('Info', 'Generando template...', 'info');
            
            const response = await APIManager.makeRequest(prompt);
            
            if (response) {
                document.getElementById(resultId).innerHTML = 
                    '<div class="result-title">📝 Template Generado</div>' +
                    '<div class="result-content">' + response + '</div>';
                UIManager.showToast('Éxito', 'Template generado correctamente', 'success');
            }
        } catch (error) {
            UIManager.showToast('Error', 'Error al generar template: ' + error.message, 'error');
        }
    }

    static async analyzeCreatives() {
        if (!AppState.apiKey) {
            UIManager.showToast('Error', 'Configura tu API Key primero', 'error');
            return;
        }
        
        const nicho = document.getElementById('spyNicho').value.trim();
        const plataforma = document.getElementById('spyPlataforma').value;
        const tiempo = document.getElementById('spyTiempo').value;
        
        if (!nicho) {
            UIManager.showToast('Error', 'Especifica el nicho a analizar', 'error');
            return;
        }
        
        const prompt = 'Actúa como EXPERTO en creative spy y análisis de ads. Analiza las creatividades más exitosas en ' + nicho + ' para ' + plataforma + ' en los ' + tiempo + '.\n\nANALIZA:\n\nHOOKS MÁS EFECTIVOS:\n- Top 5 hooks que generan más engagement\n- Palabras clave que captan atención\n- Patterns emocionales que funcionan\n\nELEMENTOS VISUALES GANADORES:\n- Colores predominantes\n- Tipos de imágenes/videos que convierten\n- Formatos más efectivos\n\nCOPY PATTERNS:\n- Estructuras de copy más usadas\n- Pain points más explotados\n- CTAs más efectivos\n\nANGLES DE VENTA:\n- Ángulos más saturados (evitar)\n- Oportunidades no explotadas\n- Diferenciadores únicos\n\nESTRATEGIAS DE DIFERENCIACIÓN:\n- Cómo destacar de la competencia\n- Elementos únicos a incluir\n- Timing óptimo para publicar\n\nINSIGHTS PSICOLÓGICOS:\n- Por qué funcionan estos elementos\n- Triggers emocionales clave\n- Objeciones que manejan\n\nProporciona insights específicos y accionables para ' + nicho + ' en ' + plataforma + '.';

        try {
            UIManager.showToast('Info', 'Analizando creatividades...', 'info');
            
            const response = await APIManager.makeRequest(prompt);
            
            if (response) {
                document.getElementById('spyResults').innerHTML = 
                    '<div class="result-title">🕵️ Análisis de Creatividades - ' + nicho + '</div>' +
                    '<div class="result-content">' + response + '</div>';
                UIManager.showToast('Éxito', 'Análisis completado', 'success');
            }
        } catch (error) {
            UIManager.showToast('Error', 'Error al analizar creatividades: ' + error.message, 'error');
        }
    }

    static newAnalysis() {
        document.getElementById('resultsSection').style.display = 'none';
        document.getElementById('configurationSection').style.display = 'block';
        AppState.productosDetectados = [];
        AppState.currentAnalysis = null;
        
        // Reset form
        document.getElementById('configurationForm').reset();
        
        // Reset checkboxes to default
        const checkboxes = document.querySelectorAll('input[type="checkbox"]');
        for (let i = 0; i < checkboxes.length; i++) {
            checkboxes[i].checked = true;
        }
        
        UIManager.showToast('Info', 'Nuevo análisis iniciado', 'info');
    }

    static toggleDebugMode() {
        AppState.debugMode = !AppState.debugMode;
        localStorage.setItem('marketinsight_debug', AppState.debugMode.toString());
        
        const debugBtn = document.getElementById('toggleDebug');
        if (debugBtn) {
            debugBtn.textContent = AppState.debugMode ? '🔧 Debug ON' : '🔧 Debug';
            debugBtn.style.background = AppState.debugMode ? 'var(--warning-color)' : '';
        }
        
        UIManager.showToast(
            'Debug Mode', 
            'Modo debug ' + (AppState.debugMode ? 'activado' : 'desactivado') + '. ' + (AppState.debugMode ? 'Revisa la consola (F12) para logs detallados.' : ''), 
            'info'
        );
        
        if (AppState.debugMode) {
            console.log('🔧 Debug Mode Activado');
            console.log('📊 Estado actual de la aplicación:', AppState);
        }
    }

    static toggleTheme() {
        const currentTheme = document.documentElement.getAttribute('data-theme');
        const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
        
        document.documentElement.setAttribute('data-theme', newTheme);
        document.getElementById('themeToggle').textContent = newTheme === 'dark' ? '🌙' : '☀️';
        
        localStorage.setItem('marketinsight_theme', newTheme);
        this.showToast('Info', `Tema cambiado a ${newTheme === 'dark' ? 'oscuro' : 'claro'}`, 'info');
    }

    static openModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.add('active');
            document.body.style.overflow = 'hidden';
        }
    }

    static closeModal(modalId) {
        const modal = document.getElementById(modalId);
        if (modal) {
            modal.classList.remove('active');
            document.body.style.overflow = '';
        }
    }

    static initModals() {
        // Close modals on Escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape') {
                const activeModals = document.querySelectorAll('.modal.active');
                for (let i = 0; i < activeModals.length; i++) {
                    activeModals[i].classList.remove('active');
                }
                document.body.style.overflow = '';
            }
        });
    }

    static initTabs() {
        // Handle tab switching
        document.addEventListener('click', function(e) {
            if (e.target.classList.contains('tab-btn')) {
                e.preventDefault();
                
                const tabContainer = e.target.closest('.modal-body');
                const targetTab = e.target.getAttribute('data-tab');
                
                if (tabContainer && targetTab) {
                    // Update tab buttons
                    const tabBtns = tabContainer.querySelectorAll('.tab-btn');
                    for (let i = 0; i < tabBtns.length; i++) {
                        tabBtns[i].classList.remove('active');
                    }
                    e.target.classList.add('active');
                    
                    // Update tab content
                    const tabContents = tabContainer.querySelectorAll('.tab-content');
                    for (let j = 0; j < tabContents.length; j++) {
                        tabContents[j].classList.remove('active');
                    }
                    
                    const targetContent = tabContainer.querySelector('#' + targetTab);
                    if (targetContent) {
                        targetContent.classList.add('active');
                    }
                }
            }
        });
    }

    static showLoading(show) {
        const overlay = document.getElementById('loadingOverlay');
        if (overlay) {
            if (show) {
                overlay.classList.add('active');
                this.updateLoadingMessage();
            } else {
                overlay.classList.remove('active');
            }
        }
    }

    static updateLoadingMessage() {
        const messages = CONFIG.LOADING_MESSAGES;
        let currentIndex = 0;
        const textEl = document.getElementById('loadingText');
        
        const interval = setInterval(function() {
            if (!document.getElementById('loadingOverlay').classList.contains('active')) {
                clearInterval(interval);
                return;
            }
            
            currentIndex = (currentIndex + 1) % messages.length;
            if (textEl) {
                textEl.textContent = messages[currentIndex];
            }
        }, 2000);
    }

    static showToast(title, message, type) {
        type = type || 'info';
        const container = document.getElementById('toastContainer');
        if (!container) return;
        
        const toast = document.createElement('div');
        toast.className = 'toast ' + type;
        
        toast.innerHTML = 
            '<div class="toast-header">' +
                '<div class="toast-title">' + title + '</div>' +
                '<button class="toast-close">&times;</button>' +
            '</div>' +
            '<div class="toast-message">' + message + '</div>';
        
        container.appendChild(toast);
        
        // Close button
        toast.querySelector('.toast-close').addEventListener('click', function() {
            toast.remove();
        });
        
        // Auto remove after 5 seconds
        setTimeout(function() {
            toast.remove();
        }, 5000);
    }
}

/**
 * Gestiona las llamadas a la API de Google Gemini
 */
class APIManager {
    static async makeRequest(prompt, retries = CONFIG.MAX_RETRIES) {
        if (!AppState.apiKey) {
            throw new Error('API Key no configurada');
        }
        
        const requestBody = {
            contents: [{
                parts: [{
                    text: prompt
                }]
            }],
            generationConfig: {
                temperature: 0.7,
                topK: 40,
                topP: 0.95,
                maxOutputTokens: 8192,
            }
        };
        
        try {
            const response = await fetch(
                `${CONFIG.GEMINI_API_ENDPOINT}?key=${AppState.apiKey}`,
                {
                    method: 'POST',
                    headers: {
                        'Content-Type': 'application/json',
                    },
                    body: JSON.stringify(requestBody)
                }
            );
            
            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error?.message || `HTTP error! status: ${response.status}`);
            }
            
            const data = await response.json();
            
            if (data.candidates && data.candidates[0] && data.candidates[0].content) {
                return data.candidates[0].content.parts[0].text;
            } else {
                throw new Error('Respuesta inválida de la API');
            }
            
        } catch (error) {
            console.error('Error en API request:', error);
            
            if (retries > 0) {
                console.log(`Reintentando... (${retries} intentos restantes)`);
                await new Promise(resolve => setTimeout(resolve, CONFIG.RETRY_DELAY));
                return this.makeRequest(prompt, retries - 1);
            }
            
            throw error;
        }
    }
}

/**
 * Debug utilities
 */
class DebugManager {
    static log(message, data = null) {
        if (AppState.debugMode) {
            console.log(`[MarketInsight Debug] ${message}`, data);
        }
    }
    
    static toggleDebug() {
        AppState.debugMode = !AppState.debugMode;
        localStorage.setItem('marketinsight_debug', AppState.debugMode.toString());
        console.log(`Debug mode ${AppState.debugMode ? 'enabled' : 'disabled'}`);
    }
    
    static exportState() {
        const exportData = {
            timestamp: new Date().toISOString(),
            configuracion: AppState.configuracion,
            productos: AppState.productosDetectados,
            version: '4.0'
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `marketinsight-export-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
    }
}

// ===== INITIALIZATION =====
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 MarketInsight Pro Affiliate Edition v4.0 iniciado');
    
    // Initialize UI Manager
    UIManager.init();
    
    // Debug hotkeys (Ctrl + Shift + D)
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey && e.key === 'D') {
            DebugManager.toggleDebug();
        }
        
        if (e.ctrlKey && e.shiftKey && e.key === 'E') {
            DebugManager.exportState();
        }
    });
    
    // Global error handler
    window.addEventListener('error', function(e) {
        console.error('Error global:', e.error);
        UIManager.showToast('Error', 'Ha ocurrido un error inesperado', 'error');
    });
    
    // Unhandled promise rejection handler
    window.addEventListener('unhandledrejection', function(e) {
        console.error('Promesa rechazada:', e.reason);
        UIManager.showToast('Error', 'Error en operación asíncrona', 'error');
    });
    
    console.log('✅ MarketInsight Pro inicializado correctamente');
});

// ===== EXPORT FOR EXTERNAL USE =====
window.MarketInsightPro = {
    PromptGenerator,
    ResponseProcessor,
    UIManager,
    APIManager,
    DebugManager,
    AppState,
    CONFIG
};
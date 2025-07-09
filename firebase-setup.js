// Firebase Configuration - MarketInsight Pro
// Using Firebase v9 compat for easier integration

// Firebase config - REEMPLAZA CON TUS CREDENCIALES REALES
const firebaseConfig = {
  apiKey: "AIzaSyC...", // ← CAMBIAR: Tu API Key real
  authDomain: "marketinsight-pro.firebaseapp.com", // ← CAMBIAR: Tu dominio
  projectId: "marketinsight-pro", // ← CAMBIAR: Tu project ID
  storageBucket: "marketinsight-pro.appspot.com", // ← CAMBIAR: Tu storage bucket
  messagingSenderId: "123456789", // ← CAMBIAR: Tu sender ID
  appId: "1:123456789:web:abcdef123456" // ← CAMBIAR: Tu app ID
};

// Initialize Firebase (usando compat para simplicidad)
firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();
const db = firebase.firestore();

// ADMIN CONFIGURATION - TU COMO ADMINISTRADOR
const ADMIN_CONFIG = {
  adminEmail: "tu-email@gmail.com", // ← CAMBIAR: Tu email de admin
  adminUID: null, // Se configurará automáticamente
  permissions: {
    viewAllUsers: true,
    manageSubscriptions: true,
    viewAnalytics: true,
    moderateContent: true,
    accessDebugMode: true
  }
};

// User Plans Configuration
const PLANS = {
    free: {
        name: 'Free',
        price: 0,
        analysisLimit: 5,
        features: ['Análisis básico', 'Herramientas básicas', 'Community support']
    },
    pro: {
        name: 'Pro',
        price: 79,
        analysisLimit: -1, // Unlimited
        features: ['Análisis ilimitados', 'Todas las herramientas', 'Priority support', 'PDF exports']
    },
    agency: {
        name: 'Agency',
        price: 199,
        analysisLimit: -1,
        features: ['Todo lo de Pro', 'White-label', 'Team management', 'API access']
    },
    admin: {
        name: 'Admin',
        price: 0,
        analysisLimit: -1,
        features: ['Acceso total', 'Panel de administración', 'Gestión de usuarios', 'Analytics completo']
    }
};

// Authentication Manager
class AuthManager {
    static async register(email, password, plan = 'free') {
        try {
            const userCredential = await auth.createUserWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Verificar si es el admin
            const isAdmin = email === ADMIN_CONFIG.adminEmail;
            if (isAdmin) {
                ADMIN_CONFIG.adminUID = user.uid;
                plan = 'admin'; // Plan especial para admin
            }
            
            // Create user document in Firestore
            await UserManager.createUser(user.uid, {
                email: user.email,
                plan: plan,
                analysisCount: 0,
                createdAt: new Date(),
                subscriptionId: null,
                isActive: true,
                isAdmin: isAdmin,
                permissions: isAdmin ? ADMIN_CONFIG.permissions : {}
            });
            
            return { success: true, user, isAdmin };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    static async login(email, password) {
        try {
            const userCredential = await auth.signInWithEmailAndPassword(email, password);
            const user = userCredential.user;
            
            // Verificar si es admin
            const isAdmin = email === ADMIN_CONFIG.adminEmail;
            if (isAdmin) {
                ADMIN_CONFIG.adminUID = user.uid;
            }
            
            return { success: true, user, isAdmin };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    static async logout() {
        try {
            await auth.signOut();
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    static onAuthStateChanged(callback) {
        return auth.onAuthStateChanged(callback);
    }
    
    static getCurrentUser() {
        return auth.currentUser;
    }
    
    static async isAdmin(userId = null) {
        const user = userId ? { uid: userId } : auth.currentUser;
        if (!user) return false;
        
        const userData = await UserManager.getUser(user.uid);
        return userData?.isAdmin || false;
    }
}

// User Management
class UserManager {
    static async createUser(userId, userData) {
        await db.collection('users').doc(userId).set(userData);
    }
    
    static async getUser(userId) {
        const doc = await db.collection('users').doc(userId).get();
        return doc.exists ? doc.data() : null;
    }
    
    static async updateUserPlan(userId, newPlan, subscriptionId = null) {
        await db.collection('users').doc(userId).update({
            plan: newPlan,
            subscriptionId: subscriptionId,
            updatedAt: new Date()
        });
    }
    
    static async incrementAnalysisCount(userId) {
        await db.collection('users').doc(userId).update({
            analysisCount: firebase.firestore.FieldValue.increment(1)
        });
    }
    
    static async canPerformAnalysis(userId) {
        const userData = await this.getUser(userId);
        if (!userData) return false;
        
        // Admin tiene acceso ilimitado
        if (userData.isAdmin) return true;
        
        const userPlan = PLANS[userData.plan];
        if (!userPlan) return false;
        
        if (userPlan.analysisLimit === -1) return true; // Unlimited
        
        return userData.analysisCount < userPlan.analysisLimit;
    }
    
    static async getRemainingAnalyses(userId) {
        const userData = await this.getUser(userId);
        if (!userData) return 0;
        
        // Admin tiene acceso ilimitado
        if (userData.isAdmin) return 'Unlimited';
        
        const userPlan = PLANS[userData.plan];
        if (!userPlan) return 0;
        
        if (userPlan.analysisLimit === -1) return 'Unlimited';
        
        return Math.max(0, userPlan.analysisLimit - userData.analysisCount);
    }
    
    // ADMIN FUNCTIONS
    static async getAllUsers() {
        const snapshot = await db.collection('users').get();
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
    }
    
    static async getUserStats() {
        const users = await this.getAllUsers();
        const stats = {
            total: users.length,
            free: users.filter(u => u.plan === 'free').length,
            pro: users.filter(u => u.plan === 'pro').length,
            agency: users.filter(u => u.plan === 'agency').length,
            totalAnalyses: users.reduce((sum, u) => sum + (u.analysisCount || 0), 0),
            activeUsers: users.filter(u => u.isActive).length
        };
        return stats;
    }
    
    static async resetUserAnalyses(userId) {
        await db.collection('users').doc(userId).update({
            analysisCount: 0,
            lastReset: new Date()
        });
    }
}

// Usage Tracking
class UsageTracker {
    static async trackAnalysis(userId) {
        const canAnalyze = await UserManager.canPerformAnalysis(userId);
        
        if (!canAnalyze) {
            return {
                success: false,
                error: 'Analysis limit reached',
                needsUpgrade: true
            };
        }
        
        await UserManager.incrementAnalysisCount(userId);
        return { success: true };
    }
    
    static async getUsageStats(userId) {
        const userData = await UserManager.getUser(userId);
        const remaining = await UserManager.getRemainingAnalyses(userId);
        
        return {
            plan: userData.plan,
            analysisCount: userData.analysisCount,
            remaining: remaining,
            features: PLANS[userData.plan].features
        };
    }
}

// Admin Panel Manager
class AdminPanel {
    static async showAdminPanel() {
        const isAdmin = await AuthManager.isAdmin();
        if (!isAdmin) {
            UIManager.showToast('Error', 'Acceso denegado - Solo administradores', 'error');
            return;
        }
        
        const stats = await UserManager.getUserStats();
        const users = await UserManager.getAllUsers();
        
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content modal-large">
                <div class="modal-header">
                    <h2>🛠️ Panel de Administración</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="admin-tabs">
                        <button class="tab-btn active" data-tab="stats">📊 Estadísticas</button>
                        <button class="tab-btn" data-tab="users">👥 Usuarios</button>
                        <button class="tab-btn" data-tab="system">⚙️ Sistema</button>
                    </div>
                    
                    <div class="tab-content active" id="stats">
                        <div class="stats-grid">
                            <div class="stat-card">
                                <h3>Total Usuarios</h3>
                                <div class="stat-value">${stats.total}</div>
                            </div>
                            <div class="stat-card">
                                <h3>Usuarios Free</h3>
                                <div class="stat-value">${stats.free}</div>
                            </div>
                            <div class="stat-card">
                                <h3>Usuarios Pro</h3>
                                <div class="stat-value">${stats.pro}</div>
                            </div>
                            <div class="stat-card">
                                <h3>Total Análisis</h3>
                                <div class="stat-value">${stats.totalAnalyses}</div>
                            </div>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="users">
                        <div class="users-table">
                            <table>
                                <thead>
                                    <tr>
                                        <th>Email</th>
                                        <th>Plan</th>
                                        <th>Análisis</th>
                                        <th>Creado</th>
                                        <th>Acciones</th>
                                    </tr>
                                </thead>
                                <tbody>
                                    ${users.map(user => `
                                        <tr>
                                            <td>${user.email}</td>
                                            <td>${user.plan}</td>
                                            <td>${user.analysisCount || 0}</td>
                                            <td>${new Date(user.createdAt.seconds * 1000).toLocaleDateString()}</td>
                                            <td>
                                                <button class="btn btn-sm btn-outline" onclick="AdminPanel.resetUser('${user.id}')">
                                                    🔄 Reset
                                                </button>
                                            </td>
                                        </tr>
                                    `).join('')}
                                </tbody>
                            </table>
                        </div>
                    </div>
                    
                    <div class="tab-content" id="system">
                        <div class="system-actions">
                            <button class="btn btn-primary" onclick="AdminPanel.exportData()">
                                📥 Exportar Datos
                            </button>
                            <button class="btn btn-secondary" onclick="AdminPanel.clearCache()">
                                🗑️ Limpiar Cache
                            </button>
                            <button class="btn btn-outline" onclick="AdminPanel.testSystem()">
                                🧪 Test Sistema
                            </button>
                        </div>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Bind events
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        // Tab switching
        modal.querySelectorAll('.tab-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                modal.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
                modal.querySelectorAll('.tab-content').forEach(c => c.classList.remove('active'));
                
                e.target.classList.add('active');
                modal.querySelector(`#${e.target.dataset.tab}`).classList.add('active');
            });
        });
    }
    
    static async resetUser(userId) {
        const isAdmin = await AuthManager.isAdmin();
        if (!isAdmin) return;
        
        await UserManager.resetUserAnalyses(userId);
        UIManager.showToast('Éxito', 'Usuario reiniciado correctamente', 'success');
        
        // Refresh panel
        document.querySelector('.modal').remove();
        this.showAdminPanel();
    }
    
    static async exportData() {
        const isAdmin = await AuthManager.isAdmin();
        if (!isAdmin) return;
        
        const users = await UserManager.getAllUsers();
        const stats = await UserManager.getUserStats();
        
        const exportData = {
            timestamp: new Date().toISOString(),
            stats: stats,
            users: users.map(u => ({
                email: u.email,
                plan: u.plan,
                analysisCount: u.analysisCount,
                createdAt: u.createdAt,
                isActive: u.isActive
            }))
        };
        
        const blob = new Blob([JSON.stringify(exportData, null, 2)], {
            type: 'application/json'
        });
        
        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `marketinsight-data-${Date.now()}.json`;
        a.click();
        
        URL.revokeObjectURL(url);
        UIManager.showToast('Éxito', 'Datos exportados correctamente', 'success');
    }
    
    static clearCache() {
        localStorage.clear();
        UIManager.showToast('Éxito', 'Cache limpiado', 'success');
    }
    
    static async testSystem() {
        const isAdmin = await AuthManager.isAdmin();
        if (!isAdmin) return;
        
        const tests = [
            { name: 'Firebase Auth', status: auth.currentUser ? 'OK' : 'FAIL' },
            { name: 'Firestore', status: 'OK' },
            { name: 'Admin Access', status: isAdmin ? 'OK' : 'FAIL' }
        ];
        
        const results = tests.map(test => 
            `${test.name}: ${test.status}`
        ).join('\n');
        
        UIManager.showToast('Test Results', results, 'info');
    }
}

// Export for use in main app
window.FirebaseAuth = {
    AuthManager,
    UserManager,
    UsageTracker,
    AdminPanel,
    PLANS,
    ADMIN_CONFIG,
    auth,
    db
};
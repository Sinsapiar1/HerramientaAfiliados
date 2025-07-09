// Firebase Configuration - MarketInsight Pro
import { initializeApp } from 'firebase/app';
import { getAuth, signInWithEmailAndPassword, createUserWithEmailAndPassword, signOut, onAuthStateChanged } from 'firebase/auth';
import { getFirestore, doc, setDoc, getDoc, updateDoc, increment } from 'firebase/firestore';

// Firebase config (reemplaza con tus credenciales)
const firebaseConfig = {
  apiKey: "AIzaSyC...", // Tu API Key
  authDomain: "marketinsight-pro.firebaseapp.com",
  projectId: "marketinsight-pro",
  storageBucket: "marketinsight-pro.appspot.com",
  messagingSenderId: "123456789",
  appId: "1:123456789:web:abcdef123456"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

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
    }
};

// Authentication Manager
class AuthManager {
    static async register(email, password, plan = 'free') {
        try {
            const userCredential = await createUserWithEmailAndPassword(auth, email, password);
            const user = userCredential.user;
            
            // Create user document in Firestore
            await UserManager.createUser(user.uid, {
                email: user.email,
                plan: plan,
                analysisCount: 0,
                createdAt: new Date(),
                subscriptionId: null,
                isActive: true
            });
            
            return { success: true, user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    static async login(email, password) {
        try {
            const userCredential = await signInWithEmailAndPassword(auth, email, password);
            return { success: true, user: userCredential.user };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    static async logout() {
        try {
            await signOut(auth);
            return { success: true };
        } catch (error) {
            return { success: false, error: error.message };
        }
    }
    
    static onAuthStateChanged(callback) {
        return onAuthStateChanged(auth, callback);
    }
}

// User Management
class UserManager {
    static async createUser(userId, userData) {
        await setDoc(doc(db, 'users', userId), userData);
    }
    
    static async getUser(userId) {
        const docRef = doc(db, 'users', userId);
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? docSnap.data() : null;
    }
    
    static async updateUserPlan(userId, newPlan, subscriptionId = null) {
        await updateDoc(doc(db, 'users', userId), {
            plan: newPlan,
            subscriptionId: subscriptionId,
            updatedAt: new Date()
        });
    }
    
    static async incrementAnalysisCount(userId) {
        await updateDoc(doc(db, 'users', userId), {
            analysisCount: increment(1)
        });
    }
    
    static async canPerformAnalysis(userId) {
        const userData = await this.getUser(userId);
        if (!userData) return false;
        
        const userPlan = PLANS[userData.plan];
        if (userPlan.analysisLimit === -1) return true; // Unlimited
        
        return userData.analysisCount < userPlan.analysisLimit;
    }
    
    static async getRemainingAnalyses(userId) {
        const userData = await this.getUser(userId);
        if (!userData) return 0;
        
        const userPlan = PLANS[userData.plan];
        if (userPlan.analysisLimit === -1) return 'Unlimited';
        
        return Math.max(0, userPlan.analysisLimit - userData.analysisCount);
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

// Export for use in main app
window.FirebaseAuth = {
    AuthManager,
    UserManager,
    UsageTracker,
    PLANS,
    auth,
    db
};

export { AuthManager, UserManager, UsageTracker, PLANS, auth, db };
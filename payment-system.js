// Payment System with Stripe - MarketInsight Pro
// Stripe solo cobra 2.9% + 30¢ por transacción - NO fees mensuales

class PaymentManager {
    static stripe = null;
    static initialized = false;
    
    // Initialize Stripe (call once)
    static async init() {
        if (this.initialized) return;
        
        // Load Stripe.js
        const script = document.createElement('script');
        script.src = 'https://js.stripe.com/v3/';
        document.head.appendChild(script);
        
        await new Promise(resolve => {
            script.onload = resolve;
        });
        
        this.stripe = Stripe('pk_test_51...'); // Tu public key de Stripe
        this.initialized = true;
    }
    
    // Create checkout session
    static async createCheckoutSession(planId, userId) {
        try {
            const response = await fetch('/api/create-checkout-session', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    planId: planId,
                    userId: userId,
                    successUrl: window.location.origin + '/success',
                    cancelUrl: window.location.origin + '/pricing'
                })
            });
            
            const session = await response.json();
            
            if (session.error) {
                throw new Error(session.error);
            }
            
            // Redirect to Stripe Checkout
            const result = await this.stripe.redirectToCheckout({
                sessionId: session.id
            });
            
            if (result.error) {
                throw new Error(result.error.message);
            }
            
        } catch (error) {
            console.error('Error creating checkout session:', error);
            throw error;
        }
    }
    
    // Handle successful payment
    static async handleSuccessfulPayment(sessionId) {
        try {
            const response = await fetch('/api/handle-success', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ sessionId })
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error handling successful payment:', error);
            throw error;
        }
    }
    
    // Cancel subscription
    static async cancelSubscription(subscriptionId) {
        try {
            const response = await fetch('/api/cancel-subscription', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({ subscriptionId })
            });
            
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error canceling subscription:', error);
            throw error;
        }
    }
    
    // Get subscription status
    static async getSubscriptionStatus(subscriptionId) {
        try {
            const response = await fetch(`/api/subscription-status/${subscriptionId}`);
            const result = await response.json();
            return result;
        } catch (error) {
            console.error('Error getting subscription status:', error);
            throw error;
        }
    }
}

// Plan configurations for Stripe
const STRIPE_PLANS = {
    pro: {
        priceId: 'price_1234567890', // Tu price ID de Stripe para plan Pro
        name: 'Pro Plan',
        price: 79,
        currency: 'usd',
        interval: 'month'
    },
    agency: {
        priceId: 'price_0987654321', // Tu price ID de Stripe para plan Agency
        name: 'Agency Plan',
        price: 199,
        currency: 'usd',
        interval: 'month'
    }
};

// UI Integration
class PaymentUI {
    static showUpgradeModal(currentPlan) {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>💎 Upgrade Your Plan</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <div class="pricing-cards">
                        ${this.generatePricingCards(currentPlan)}
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Bind events
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelectorAll('.upgrade-btn').forEach(btn => {
            btn.addEventListener('click', async (e) => {
                const planId = e.target.dataset.plan;
                await this.handleUpgrade(planId);
                modal.remove();
            });
        });
    }
    
    static generatePricingCards(currentPlan) {
        return `
            <div class="pricing-card ${currentPlan === 'pro' ? 'current' : ''}">
                <h3>Pro Plan</h3>
                <div class="price">$79<span>/month</span></div>
                <ul class="features">
                    <li>✅ Análisis ilimitados</li>
                    <li>✅ Todas las herramientas</li>
                    <li>✅ Priority support</li>
                    <li>✅ PDF exports</li>
                </ul>
                ${currentPlan === 'pro' ? 
                    '<button class="btn btn-secondary">Current Plan</button>' :
                    '<button class="btn btn-primary upgrade-btn" data-plan="pro">Upgrade to Pro</button>'
                }
            </div>
            
            <div class="pricing-card ${currentPlan === 'agency' ? 'current' : ''}">
                <h3>Agency Plan</h3>
                <div class="price">$199<span>/month</span></div>
                <ul class="features">
                    <li>✅ Todo lo de Pro</li>
                    <li>✅ White-label</li>
                    <li>✅ Team management</li>
                    <li>✅ API access</li>
                </ul>
                ${currentPlan === 'agency' ? 
                    '<button class="btn btn-secondary">Current Plan</button>' :
                    '<button class="btn btn-primary upgrade-btn" data-plan="agency">Upgrade to Agency</button>'
                }
            </div>
        `;
    }
    
    static async handleUpgrade(planId) {
        try {
            const user = firebase.auth().currentUser;
            if (!user) {
                throw new Error('User not authenticated');
            }
            
            UIManager.showToast('Info', 'Redirecting to payment...', 'info');
            
            await PaymentManager.createCheckoutSession(planId, user.uid);
            
        } catch (error) {
            console.error('Upgrade error:', error);
            UIManager.showToast('Error', 'Error processing upgrade: ' + error.message, 'error');
        }
    }
    
    static showLimitReachedModal() {
        const modal = document.createElement('div');
        modal.className = 'modal active';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h2>🔒 Analysis Limit Reached</h2>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <p>You've reached your monthly analysis limit of 5 analyses.</p>
                    <p>Upgrade to Pro for unlimited analyses and advanced features!</p>
                    
                    <div class="limit-actions">
                        <button class="btn btn-primary" id="upgradeNow">
                            💎 Upgrade to Pro - $79/month
                        </button>
                        <button class="btn btn-outline" id="waitReset">
                            ⏳ Wait for Monthly Reset
                        </button>
                    </div>
                </div>
            </div>
        `;
        
        document.body.appendChild(modal);
        
        // Bind events
        modal.querySelector('.modal-close').addEventListener('click', () => {
            modal.remove();
        });
        
        modal.querySelector('#upgradeNow').addEventListener('click', () => {
            modal.remove();
            this.showUpgradeModal('free');
        });
        
        modal.querySelector('#waitReset').addEventListener('click', () => {
            modal.remove();
        });
    }
}

// Integration with main app
class UsageLimiter {
    static async checkAndTrackUsage(userId) {
        try {
            const result = await UsageTracker.trackAnalysis(userId);
            
            if (!result.success) {
                if (result.needsUpgrade) {
                    PaymentUI.showLimitReachedModal();
                }
                return false;
            }
            
            return true;
        } catch (error) {
            console.error('Error checking usage:', error);
            return false;
        }
    }
    
    static async showUsageStats(userId) {
        try {
            const stats = await UsageTracker.getUsageStats(userId);
            
            const statsHTML = `
                <div class="usage-stats">
                    <div class="plan-info">
                        <h3>Current Plan: ${stats.plan.toUpperCase()}</h3>
                        <p>Analyses used: ${stats.analysisCount}</p>
                        <p>Remaining: ${stats.remaining}</p>
                    </div>
                    <div class="features">
                        <h4>Your Features:</h4>
                        <ul>
                            ${stats.features.map(feature => `<li>${feature}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            `;
            
            return statsHTML;
        } catch (error) {
            console.error('Error getting usage stats:', error);
            return '<p>Error loading usage statistics</p>';
        }
    }
}

// Export for use in main app
window.PaymentSystem = {
    PaymentManager,
    PaymentUI,
    UsageLimiter,
    STRIPE_PLANS
};
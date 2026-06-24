export class HealthComponent {
    private max: number;
    private current: number;

    constructor(maxHealth: number) {
        this.max = maxHealth;
        this.current = maxHealth
    }

    public getCurrentHealth() {
        console.log()
        return this.current;
    }
    
    public reduceHealth(amount: number): boolean {
        if (this.current <= 0) return true;
        
        this.current = Math.max(0, this.current -= amount);
        console.log(`[COMBAT] Victim took damage! Remaining health: ${this.current}`);
        return this.current === 0;
    }
}
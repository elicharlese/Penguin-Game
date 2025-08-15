import { Vector3 } from 'three';
import { Wave } from '../../../types/src';

interface Trick {
  id: string;
  name: string;
  multiplier: number;
  timestamp: number;
  position: Vector3;
}

export class WavePhysics {
  private waves: Wave[] = [];
  private waveSpawnTimer = 0;
  private readonly WAVE_SPAWN_INTERVAL = 5000; // 5 seconds
  private tricks: Trick[] = [];
  private lastTrickTime = 0;
  private comboCount = 0;

  constructor() {
    this.spawnInitialWaves();
  }

  private spawnInitialWaves(): void {
    // Create some initial waves
    for (let i = 0; i < 3; i++) {
      this.waves.push(this.generateWave());
    }
  }

  private generateWave(): Wave {
    return {
      id: `wave_${Date.now()}_${Math.random()}`,
      height: Math.random() * 4 + 1, // 1-5 meters
      speed: Math.random() * 15 + 10, // 10-25 km/h
      direction: Math.random() * 60 + 60, // 60-120 degrees (roughly toward shore)
      quality: this.calculateWaveQuality(),
    };
  }

  private calculateWaveQuality(): Wave['quality'] {
    const rand = Math.random();
    if (rand < 0.1) return 'perfect';
    if (rand < 0.25) return 'excellent';
    if (rand < 0.5) return 'good';
    if (rand < 0.8) return 'fair';
    return 'poor';
  }

  public update(deltaTime: number): void {
    this.waveSpawnTimer += deltaTime;

    // Spawn new waves periodically
    if (this.waveSpawnTimer >= this.WAVE_SPAWN_INTERVAL) {
      this.waves.push(this.generateWave());
      this.waveSpawnTimer = 0;

      // Remove old waves (keep only last 5)
      if (this.waves.length > 5) {
        this.waves = this.waves.slice(-5);
      }
    }

    // Clean up old tricks (older than 5 seconds)
    const now = Date.now();
    this.tricks = this.tricks.filter(trick => now - trick.timestamp < 5000);
  }

  public getCurrentWave(): Wave | null {
    // Return the best quality wave available
    return this.waves.reduce((best, current) => {
      const qualityOrder = { poor: 1, fair: 2, good: 3, excellent: 4, perfect: 5 };
      return qualityOrder[current.quality] > qualityOrder[best.quality] ? current : best;
    }, this.waves[0]) || null;
  }

  public getWaveHeight(position: Vector3, time: number): number {
    let totalHeight = 0;
    
    this.waves.forEach(wave => {
      // Calculate wave influence based on distance and direction
      const waveAngle = (wave.direction * Math.PI) / 180;
      const waveDirection = new Vector3(Math.cos(waveAngle), 0, Math.sin(waveAngle));
      
      // Wave propagation
      const waveSpeed = wave.speed / 3.6; // Convert km/h to m/s
      const frequency = 0.5; // Wave frequency
      const wavelength = waveSpeed / frequency;
      
      // Calculate wave phase
      const dotProduct = position.dot(waveDirection);
      const phase = (dotProduct / wavelength) - (time * frequency);
      
      // Calculate wave height at this position
      const amplitude = wave.height * 0.5;
      const waveContribution = amplitude * Math.sin(phase * 2 * Math.PI);
      
      totalHeight += waveContribution;
    });

    return totalHeight;
  }

  public getWaveForce(position: Vector3, time: number): Vector3 {
    const force = new Vector3(0, 0, 0);
    
    this.waves.forEach(wave => {
      const waveAngle = (wave.direction * Math.PI) / 180;
      const waveDirection = new Vector3(Math.cos(waveAngle), 0, Math.sin(waveAngle));
      
      // Calculate force magnitude based on wave properties
      const forceMagnitude = wave.height * wave.speed * 0.01;
      
      // Apply force in wave direction
      const waveForce = waveDirection.clone().multiplyScalar(forceMagnitude);
      force.add(waveForce);
    });

    return force;
  }

  public isInSurfableZone(position: Vector3): boolean {
    // Check if position is in a good surfing zone
    const currentWave = this.getCurrentWave();
    if (!currentWave) return false;

    // Simple zone check - can be made more sophisticated
    const distanceFromShore = Math.abs(position.z);
    return distanceFromShore > 5 && distanceFromShore < 50 && currentWave.quality !== 'poor';
  }

  public detectTrick(velocity: Vector3, deltaTime: number): Trick | null {
    const now = Date.now();
    
    // Check for air time (y velocity > 5 for a sustained period)
    if (velocity.y > 5) {
      // Check if enough time has passed since last trick (0.5 seconds)
      if (now - this.lastTrickTime > 500) {
        const trick: Trick = {
          id: `trick_${now}`,
          name: 'Air Time',
          multiplier: 1.5,
          timestamp: now,
          position: new Vector3(0, 0, 0) // Placeholder
        };
        
        this.tricks.push(trick);
        this.lastTrickTime = now;
        this.comboCount++;
        
        // Apply combo bonus
        if (this.comboCount > 1) {
          trick.multiplier += this.comboCount * 0.1;
        }
        
        return trick;
      }
    }
    
    // Check for speed burst (x or z velocity > 10)
    if (Math.abs(velocity.x) > 10 || Math.abs(velocity.z) > 10) {
      if (now - this.lastTrickTime > 500) {
        const trick: Trick = {
          id: `trick_${now}`,
          name: 'Speed Burst',
          multiplier: 1.3,
          timestamp: now,
          position: new Vector3(0, 0, 0) // Placeholder
        };
        
        this.tricks.push(trick);
        this.lastTrickTime = now;
        this.comboCount++;
        
        // Apply combo bonus
        if (this.comboCount > 1) {
          trick.multiplier += this.comboCount * 0.1;
        }
        
        return trick;
      }
    }
    
    // Check for rotation (based on angular velocity, simplified)
    const speed = velocity.length();
    if (speed > 3 && deltaTime > 0.1) {
      if (now - this.lastTrickTime > 500) {
        const trick: Trick = {
          id: `trick_${now}`,
          name: 'Rotation',
          multiplier: 1.4,
          timestamp: now,
          position: new Vector3(0, 0, 0) // Placeholder
        };
        
        this.tricks.push(trick);
        this.lastTrickTime = now;
        this.comboCount++;
        
        // Apply combo bonus
        if (this.comboCount > 1) {
          trick.multiplier += this.comboCount * 0.1;
        }
        
        return trick;
      }
    }
    
    // Reset combo if no trick detected for a while
    if (now - this.lastTrickTime > 2000) {
      this.comboCount = 0;
    }
    
    return null;
  }

  public calculateSurfScore(
    position: Vector3, 
    velocity: Vector3, 
    time: number,
    deltaTime: number
  ): number {
    const currentWave = this.getCurrentWave();
    if (!currentWave || !this.isInSurfableZone(position)) return 0;

    let score = 0;

    // Base score from wave quality
    const qualityMultiplier = { 
      poor: 1, 
      fair: 1.2, 
      good: 1.5, 
      excellent: 2, 
      perfect: 3 
    };
    score += 10 * qualityMultiplier[currentWave.quality];

    // Speed bonus
    const speed = velocity.length();
    if (speed > 5) score += (speed - 5) * 2;

    // Height bonus (riding higher on the wave)
    const waveHeight = this.getWaveHeight(position, time);
    if (waveHeight > 0.5) score += waveHeight * 5;

    // Trick multiplier
    let trickMultiplier = 1;
    const trick = this.detectTrick(velocity, deltaTime);
    if (trick) {
      trickMultiplier = trick.multiplier;
    }
    
    score *= trickMultiplier;

    return Math.round(score);
  }

  public getTricks(): Trick[] {
    return [...this.tricks];
  }

  public getWaves(): Wave[] {
    return [...this.waves];
  }
}

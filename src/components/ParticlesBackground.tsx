import { useEffect, useState } from 'react';

interface Particle {
  id: number;
  x: number;
  y: number;
  size: number;
  delay: number;
  duration: number;
  color: 'gold' | 'turquoise' | 'purple';
}

const ParticlesBackground = () => {
  const [particles, setParticles] = useState<Particle[]>([]);

  useEffect(() => {
    const generateParticles = () => {
      const newParticles: Particle[] = [];
      for (let i = 0; i < 50; i++) {
        newParticles.push({
          id: i,
          x: Math.random() * 100,
          y: Math.random() * 100,
          size: Math.random() * 4 + 1,
          delay: Math.random() * 5,
          duration: Math.random() * 4 + 4,
          color: ['gold', 'turquoise', 'purple'][Math.floor(Math.random() * 3)] as 'gold' | 'turquoise' | 'purple',
        });
      }
      setParticles(newParticles);
    };

    generateParticles();
  }, []);

  const getColorClass = (color: 'gold' | 'turquoise' | 'purple') => {
    switch (color) {
      case 'gold':
        return 'bg-gold';
      case 'turquoise':
        return 'bg-turquoise';
      case 'purple':
        return 'bg-purple-light';
    }
  };

  return (
    <div className="fixed inset-0 pointer-events-none overflow-hidden z-0">
      {particles.map((particle) => (
        <div
          key={particle.id}
          className={`absolute rounded-full ${getColorClass(particle.color)} opacity-40 animate-float`}
          style={{
            left: `${particle.x}%`,
            top: `${particle.y}%`,
            width: `${particle.size}px`,
            height: `${particle.size}px`,
            animationDelay: `${particle.delay}s`,
            animationDuration: `${particle.duration}s`,
            boxShadow: `0 0 ${particle.size * 3}px currentColor`,
          }}
        />
      ))}
      
      {/* Large ambient glow orbs */}
      <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-purple-deep/20 rounded-full blur-3xl" />
      <div className="absolute bottom-1/4 right-1/4 w-80 h-80 bg-turquoise/10 rounded-full blur-3xl" />
      <div className="absolute top-1/2 right-1/3 w-64 h-64 bg-gold/10 rounded-full blur-3xl" />
    </div>
  );
};

export default ParticlesBackground;

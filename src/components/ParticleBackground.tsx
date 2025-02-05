
import { useCallback } from 'react';
import Particles from 'react-tsparticles';
import { loadFull } from 'tsparticles';
import type { Engine } from 'tsparticles-engine';

export const ParticleBackground = () => {
  const particlesInit = useCallback(async (engine: Engine) => {
    await loadFull(engine);
  }, []);

  return (
    <Particles
      className="absolute inset-0 -z-10"
      init={particlesInit}
      options={{
        particles: {
          number: { value: 50 },
          color: { value: ['#FF4B91', '#7C3AED', '#3DC9B0'] }, // Using our app's color palette
          opacity: { value: 0.3 },
          size: { value: 2 },
          move: {
            enable: true,
            speed: 0.8,
            direction: 'none',
            outModes: 'out',
            attract: {
              enable: true,
              rotateX: 600,
              rotateY: 1200
            }
          }
        },
        interactivity: {
          events: {
            onHover: {
              enable: true,
              mode: 'repulse'
            }
          },
          modes: {
            repulse: {
              distance: 100,
              duration: 0.4
            }
          }
        },
        background: {
          color: "transparent"
        },
        detectRetina: true,
        fullScreen: false
      }}
    />
  );
};

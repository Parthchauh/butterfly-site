import React, { useEffect, useRef } from 'react';

interface Point {
  x: number;
  y: number;
}

const Butterfly: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationFrameRef = useRef<number>();
  const hueRef = useRef(0);

  const drawButterfly = (ctx: CanvasRenderingContext2D, time: number) => {
    const width = ctx.canvas.width;
    const height = ctx.canvas.height;
    const scale = Math.min(width, height) * 0.4;
    
    ctx.clearRect(0, 0, width, height);
    ctx.save();
    ctx.translate(width / 2, height / 2);

    // Update hue for color animation
    hueRef.current = (hueRef.current + 0.5) % 360;

    const points: Point[] = [];
    const steps = 200;
    
    // Generate butterfly curve points using parametric equations
    for (let i = 0; i < steps; i++) {
      const t = (i / steps) * 2 * Math.PI;
      const r = Math.exp(Math.cos(t)) - 2 * Math.cos(4 * t) + Math.pow(Math.sin(t / 12), 5);
      const x = Math.sin(t) * r * scale * 0.25;
      const y = Math.cos(t) * r * scale * 0.25;
      points.push({ x, y });
    }

    // Draw the butterfly with gradient colors
    ctx.lineWidth = 2;
    ctx.beginPath();
    let lastWave = 0;
    points.forEach((point, index) => {
      const progress = index / points.length;
      const hue = (hueRef.current + progress * 60) % 360;
      ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
      
      const wave = Math.sin(time * 0.001 + progress * 10) * 5;
      lastWave = wave;
      
      if (index === 0) {
        ctx.moveTo(point.x + wave, point.y);
      } else {
        ctx.lineTo(point.x + wave, point.y);
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(point.x + wave, point.y);
    });

    // Mirror effect
    ctx.scale(-1, 1);
    points.forEach((point, index) => {
      const progress = index / points.length;
      const hue = (hueRef.current + progress * 60) % 360;
      ctx.strokeStyle = `hsl(${hue}, 70%, 60%)`;
      
      const wave = Math.sin(time * 0.001 + progress * 10) * 5;
      
      if (index === 0) {
        ctx.moveTo(point.x + wave, point.y);
      } else {
        ctx.lineTo(point.x + wave, point.y);
      }
      ctx.stroke();
      ctx.beginPath();
      ctx.moveTo(point.x + wave, point.y);
    });

    ctx.restore();
  };

  const animate = (time: number) => {
    const canvas = canvasRef.current;
    const ctx = canvas?.getContext('2d');
    
    if (ctx) {
      drawButterfly(ctx, time);
    }
    
    animationFrameRef.current = requestAnimationFrame(animate);
  };

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const handleResize = () => {
      const dpr = window.devicePixelRatio || 1;
      const rect = canvas.getBoundingClientRect();
      
      canvas.width = rect.width * dpr;
      canvas.height = rect.height * dpr;
      
      const ctx = canvas.getContext('2d');
      if (ctx) {
        ctx.scale(dpr, dpr);
      }
    };

    window.addEventListener('resize', handleResize);
    handleResize();

    animationFrameRef.current = requestAnimationFrame(animate);

    return () => {
      window.removeEventListener('resize', handleResize);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full"
      style={{ background: 'linear-gradient(to bottom right, #1a1a2e, #16213e)' }}
    />
  );
};

export default Butterfly;
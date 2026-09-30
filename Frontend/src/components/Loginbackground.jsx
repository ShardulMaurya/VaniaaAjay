import React, { useEffect, useRef } from "react";

export default function LoginBackground({ children, darkMode }) {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    let animationFrameId;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", handleResize);

    // Trade icons representing PM-AJAY GIA livelihood sectors
    const tradeSymbols = ["⚡", "🌾", "🥛", "🧵", "🔧", "🚜", "☀️"];

    // Floating livelihood nodes
    const nodes = Array.from({ length: 22 }, (_, i) => ({
      x: Math.random() * width,
      y: Math.random() * (height * 0.75),
      vx: (Math.random() - 0.5) * 0.35,
      vy: (Math.random() - 0.5) * 0.35,
      symbol: tradeSymbols[i % tradeSymbols.length],
      size: Math.random() * 4 + 14,
      alpha: Math.random() * 0.35 + 0.15
    }));

    let wavePhase = 0;

    const render = () => {
      ctx.clearRect(0, 0, width, height);

      // --- 1. DYNAMIC VOICE ACOUSTIC SINE WAVES ("Vani") ---
      wavePhase += 0.02;
      const waveBaseY = height * 0.88;

      const drawAudioRibbon = (amplitude, frequency, offset, color) => {
        ctx.beginPath();
        ctx.moveTo(0, waveBaseY);
        for (let x = 0; x < width; x += 5) {
          const y =
            waveBaseY +
            Math.sin(x * frequency + wavePhase + offset) * amplitude *
            Math.cos(x * 0.0015 + wavePhase * 0.5);
          ctx.lineTo(x, y);
        }
        ctx.strokeStyle = color;
        ctx.lineWidth = 2;
        ctx.stroke();
      };

      if (darkMode) {
        drawAudioRibbon(24, 0.008, 0, "rgba(59, 130, 246, 0.2)");
        drawAudioRibbon(34, 0.005, 2, "rgba(245, 158, 11, 0.2)");
        drawAudioRibbon(18, 0.012, 4, "rgba(16, 185, 129, 0.2)");
      } else {
        drawAudioRibbon(26, 0.008, 0, "rgba(37, 99, 235, 0.12)");
        drawAudioRibbon(38, 0.005, 2, "rgba(249, 115, 22, 0.14)");
        drawAudioRibbon(20, 0.012, 4, "rgba(5, 150, 105, 0.12)");
      }

      // --- 2. CONNECTING INFRASTRUCTURE GRID LINES ---
      const lineColor = darkMode ? "rgba(59, 130, 246, 0.06)" : "rgba(12, 35, 64, 0.04)";
      for (let i = 0; i < nodes.length; i++) {
        for (let j = i + 1; j < nodes.length; j++) {
          const dx = nodes[i].x - nodes[j].x;
          const dy = nodes[i].y - nodes[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);

          if (dist < 140) {
            ctx.beginPath();
            ctx.moveTo(nodes[i].x, nodes[i].y);
            ctx.lineTo(nodes[j].x, nodes[j].y);
            ctx.strokeStyle = lineColor;
            ctx.lineWidth = 1;
            ctx.stroke();
          }
        }
      }

      // --- 3. FLOATING LIVELIHOOD SECTOR NODES ---
      nodes.forEach((n) => {
        ctx.font = `${n.size}px sans-serif`;
        ctx.fillStyle = darkMode
          ? `rgba(226, 232, 240, ${n.alpha * 0.7})`
          : `rgba(15, 23, 42, ${n.alpha * 0.6})`;
        ctx.textAlign = "center";
        ctx.textBaseline = "middle";
        ctx.fillText(n.symbol, n.x, n.y);

        n.x += n.vx;
        n.y += n.vy;

        if (n.x < 20 || n.x > width - 20) n.vx *= -1;
        if (n.y < 20 || n.y > height * 0.8) n.vy *= -1;
      });

      animationFrameId = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener("resize", handleResize);
      cancelAnimationFrame(animationFrameId);
    };
  }, [darkMode]);

  return (
    <div
      style={{
        position: "relative",
        width: "100%",
        height: "100%",
        overflow: "hidden",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: darkMode
          ? "radial-gradient(circle at 12% 15%, rgba(245, 158, 11, 0.08) 0%, transparent 45%), radial-gradient(circle at 88% 85%, rgba(16, 185, 129, 0.08) 0%, transparent 45%), #060c18"
          : "radial-gradient(circle at 10% 12%, rgba(254, 215, 170, 0.55) 0%, transparent 45%), radial-gradient(circle at 90% 88%, rgba(187, 247, 208, 0.55) 0%, transparent 45%), #f6f8fc",
        transition: "background 0.3s ease"
      }}
    >
      {/* HTML5 Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          pointerEvents: "none",
          zIndex: 1
        }}
      />

      {/* Pulsing Acoustic Center Ring */}
      <div
        style={{
          position: "absolute",
          width: 480,
          height: 480,
          borderRadius: "50%",
          border: darkMode ? "1.5px dashed rgba(245, 158, 11, 0.18)" : "1.5px dashed rgba(245, 158, 11, 0.22)",
          animation: "vaniRing 18s linear infinite",
          pointerEvents: "none",
          zIndex: 1
        }}
      />
      <div
        style={{
          position: "absolute",
          width: 360,
          height: 360,
          borderRadius: "50%",
          border: darkMode ? "1px solid rgba(59, 130, 246, 0.15)" : "1px solid rgba(12, 35, 64, 0.08)",
          animation: "vaniPulse 4s ease-in-out infinite",
          pointerEvents: "none",
          zIndex: 1
        }}
      />

      <style>{`
        @keyframes vaniRing {
          0% { transform: rotate(0deg); }
          100% { transform: rotate(360deg); }
        }
        @keyframes vaniPulse {
          0% { transform: scale(0.92); opacity: 0.8; }
          50% { transform: scale(1.06); opacity: 0.3; }
          100% { transform: scale(0.92); opacity: 0.8; }
        }
      `}</style>

      {/* Foreground Form Container */}
      <div style={{ position: "relative", zIndex: 2, width: "100%", display: "flex", justifyContent: "center" }}>
        {children}
      </div>
    </div>
  );
}
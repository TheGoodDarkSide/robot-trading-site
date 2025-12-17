import { useState, useEffect, useRef } from 'react';
import { LineChart, Line, CartesianGrid, XAxis, YAxis, Tooltip } from 'recharts';

export default function Home() {
  const [account, setAccount] = useState(null);
  const [data, setData] = useState([]);
  const canvasRef = useRef(null);
  const particles = useRef([]);

  // Générer des données mock pour le graphique
  useEffect(() => {
    const mockData = [];
    for (let i = 0; i < 20; i++) {
      mockData.push({ date: `J-${20 - i}`, gain: Math.random() * 100, perte: Math.random() * 50 });
    }
    setData(mockData);
  }, []);

  // Animation canvas
  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    // Créer des particules
    particles.current = Array.from({ length: 50 }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      vx: Math.random() * 0.5 - 0.25,
      vy: Math.random() * 0.5 - 0.25,
      radius: Math.random() * 3 + 2
    }));

    const animate = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      particles.current.forEach(p => {
        p.x += p.vx;
        p.y += p.vy;

        if (p.x < 0 || p.x > canvas.width) p.vx *= -1;
        if (p.y < 0 || p.y > canvas.height) p.vy *= -1;

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,68,204,0.7)';
        ctx.fill();
      });
      requestAnimationFrame(animate);
    };
    animate();

    const handleResize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const connectWallet = async () => {
    if (typeof window.ethereum !== 'undefined') {
      try {
        const accounts = await window.ethereum.request({ method: 'eth_requestAccounts' });
        setAccount(accounts[0]);
      } catch (err) {
        if (err.code === 4001) alert('Connexion annulée par l’utilisateur.');
        else console.error(err);
      }
    } else {
      alert('Wallet non détecté. Installez MetaMask ou un wallet compatible.');
    }
  };

  return (
    <div style={{ position: 'relative', minHeight: '100vh', fontFamily: 'Arial, sans-serif', overflow: 'hidden' }}>
      <canvas ref={canvasRef} style={{ position: 'absolute', top: 0, left: 0, zIndex: 0 }} />

      <div style={{ position: 'relative', zIndex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '50px', color: '#002244' }}>
        <h1 style={{ fontSize: '48px', marginBottom: '30px', color: '#0044cc' }}>🤖 Robot Trading</h1>

        <div style={{ marginBottom: '40px' }}>
          {account ? (
            <p>Wallet connecté : {account}</p>
          ) : (
            <button
              onClick={connectWallet}
              style={{
                padding: '12px 25px',
                fontSize: '16px',
                color: '#fff',
                backgroundColor: '#0044cc',
                border: 'none',
                borderRadius: '8px',
                cursor: 'pointer',
                boxShadow: '0 4px 15px rgba(0,68,204,0.5)',
                transition: 'all 0.2s'
              }}
              onMouseEnter={e => e.currentTarget.style.boxShadow = '0 6px 25px rgba(0,68,204,0.7)'}
              onMouseLeave={e => e.currentTarget.style.boxShadow = '0 4px 15px rgba(0,68,204,0.5)'}
            >
              Connect Wallet
            </button>
          )}
        </div>

        <div style={{ backgroundColor: '#ffffffcc', padding: '20px', borderRadius: '15px', boxShadow: '0 4px 20px rgba(0,68,204,0.2)' }}>
          <LineChart width={800} height={400} data={data} margin={{ top: 5, right: 20, bottom: 5, left: 0 }}>
            <Line type="monotone" dataKey="gain" stroke="#0044cc" strokeWidth={3} dot={{ r: 4, stroke: '#0044cc', strokeWidth: 2, fill: '#fff' }} />
            <Line type="monotone" dataKey="perte" stroke="#00aaff" strokeWidth={3} dot={{ r: 4, stroke: '#00aaff', strokeWidth: 2, fill: '#fff' }} />
            <CartesianGrid stroke="#e6f0ff" strokeDasharray="3 3" />
            <XAxis dataKey="date" stroke="#002244" />
            <YAxis stroke="#002244" />
            <Tooltip contentStyle={{ backgroundColor: '#f5f8ff', border: '1px solid #0044cc', color: '#002244' }} />
          </LineChart>
        </div>
      </div>
    </div>
  );
}

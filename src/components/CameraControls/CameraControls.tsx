import React from 'react';

export const CameraControls: React.FC = () => {
  const [isOn, setIsOn] = React.useState(false);
  const [vtton, setVtton] = React.useState(true);
  const [streamOn, setStreamOn] = React.useState(false);

  return (
    <div style={{ position:'absolute', bottom:'5rem', right:'1rem', zIndex:20, background:'rgba(0,0,0,0.85)', backdropFilter:'blur(10px)', borderRadius:'1rem', padding:'1rem', color:'white', fontFamily:'system-ui', minWidth:'15rem' }}>
      <h3 style={{ fontSize:'0.95rem', fontWeight:'bold', marginBottom:'0.75rem', borderBottom:'1px solid rgba(255,255,255,0.15)', paddingBottom:'0.5rem' }}>ðŸ“¹ Virtual Camera</h3>
      <button onClick={() => setIsOn(!isOn)} style={{ width:'100%', padding:'0.7rem', background: isOn ? 'linear-gradient(135deg,#ef4444,#dc2626)' : 'linear-gradient(135deg,#10b981,#059669)', border:'none', borderRadius:'0.5rem', color:'white', fontSize:'0.875rem', fontWeight:'bold', cursor:'pointer', marginBottom:'0.75rem' }}>
        {isOn ? 'â¹ Stop Transmission' : 'â–¶ Start Transmission'}
      </button>
      <div style={{ fontSize:'0.8rem', opacity:0.7, marginBottom:'0.5rem' }}>Outputs:</div>
      <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', marginBottom:'0.4rem', fontSize:'0.85rem' }}>
        <input type="checkbox" checked={vtton} onChange={() => setVtton(!vtton)} />
        VTT (DiceCam 1)
      </label>
      <label style={{ display:'flex', alignItems:'center', gap:'0.5rem', cursor:'pointer', fontSize:'0.85rem' }}>
        <input type="checkbox" checked={streamOn} onChange={() => setStreamOn(!streamOn)} />
        Stream / OBS (DiceCam 2)
      </label>
      <div style={{ marginTop:'0.75rem', fontSize:'0.7rem', opacity:0.5, textAlign:'center' }}>
        Use OBS Browser Source: localhost:3000
      </div>
    </div>
  );
};

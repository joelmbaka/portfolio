import { ImageResponse } from 'next/og';
import { BrandSymbol } from './BrandLogo';

export function createSocialBrandImage() {
  return new ImageResponse(
    (
      <div style={{
        width: '100%', height: '100%', display: 'flex', flexDirection: 'column',
        justifyContent: 'space-between', background: '#07111F', color: '#F8FAFC',
        padding: '62px 80px', fontFamily: 'sans-serif',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 24 }}>
          <BrandSymbol onDark size={92} />
          <div style={{ display: 'flex', flexDirection: 'column' }}>
            <div style={{ fontWeight: 800, fontSize: 38, letterSpacing: '-0.025em' }}>JOELTECH</div>
            <div style={{ fontWeight: 700, fontSize: 21, color: '#10B981', letterSpacing: '0.15em', marginTop: 6 }}>GEEK SYSTEMS</div>
          </div>
        </div>
        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1020 }}>
          <div style={{ fontSize: 68, fontWeight: 800, lineHeight: 1.06, letterSpacing: '-0.035em' }}>Software that moves</div>
          <div style={{ marginTop: 12, fontSize: 57, fontWeight: 800, color: '#F4B843' }}>businesses forward.</div>
          <div style={{ marginTop: 26, fontSize: 25, color: '#C6D3DE' }}>Mobile apps · Web platforms · SaaS · APIs · Integrations</div>
        </div>
        <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', fontSize: 20, color: '#94A3B8' }}>
          <span>Built in Kenya. Engineered for the world.</span>
          <span>joeltechgeek.vercel.app</span>
        </div>
      </div>
    ),
    { width: 1200, height: 630 }
  );
}

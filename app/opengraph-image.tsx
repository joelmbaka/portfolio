import { ImageResponse } from 'next/og';

export const alt = 'Joel Mbaka — Senior Full-Stack Engineer, Web & Mobile';
export const size = {
  width: 1200,
  height: 630,
};
export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          justifyContent: 'space-between',
          background: '#07111f',
          color: '#f8fafc',
          padding: '72px 84px',
          fontFamily: 'sans-serif',
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', fontSize: 28, fontWeight: 700, color: '#34d399' }}>
          JOEL MBAKA
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', maxWidth: 1000 }}>
          <div style={{ fontSize: 68, lineHeight: 1.05, fontWeight: 800, letterSpacing: '-0.04em' }}>
            Senior Full-Stack Engineer
          </div>
          <div style={{ marginTop: 16, fontSize: 42, lineHeight: 1.1, fontWeight: 600, color: '#cbd5e1' }}>
            Web &amp; Mobile
          </div>
          <div style={{ marginTop: 30, fontSize: 25, lineHeight: 1.45, color: '#94a3b8' }}>
            React Native · Next.js · TypeScript · Python · FastAPI · PostgreSQL
          </div>
        </div>

        <div style={{ display: 'flex', fontSize: 22, color: '#64748b' }}>
          joelmbaka.com · Production products from interface to backend and data
        </div>
      </div>
    ),
    size,
  );
}

import React from 'react';

export const Footer = () => {
  return (
    <footer style={{ background: '#0f172a', color: '#94a3b8', padding: '4rem 1.5rem 2.5rem', marginTop: 'auto', borderTop: '1px solid rgba(255, 255, 255, 0.08)' }}>
      <div style={{ maxWidth: '1320px', margin: '0 auto', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '2.5rem' }}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.65rem', color: '#ffffff', fontWeight: '800', fontSize: '1.35rem', marginBottom: '0.85rem' }}>
            <div style={{ width: '36px', height: '36px', borderRadius: '10px', background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#fff', fontSize: '1.1rem' }}>
              🍲
            </div>
            Food<span style={{ color: '#10b981' }}>Rescue</span>
          </div>
          <p style={{ fontSize: '0.885rem', lineHeight: 1.65, color: '#94a3b8' }}>
            A high-reliability redistribution coordination platform connecting commercial donors, verified non-profits, and volunteer dispatchers to eliminate hunger and divert surplus from landfills.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Platform Network</h4>
          <ul style={{ listStyle: 'none', fontSize: '0.885rem', display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <li>🏢 Commercial Donors & Banquet Facilities</li>
            <li>🤝 Certified Feeding Shelters & Non-Profits</li>
            <li>🚴 Trained Dispatch & Logistics Volunteers</li>
            <li>🛡️ System Compliance & Quality Administrators</li>
          </ul>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Food Safety Standards</h4>
          <p style={{ fontSize: '0.885rem', lineHeight: 1.65, color: '#94a3b8' }}>
            Strict cold-chain (&lt;5°C) and hot-holding (&gt;65°C) adherence, allergen declaration integrity, and tamper-evident chain of custody from commercial kitchen to community dining table.
          </p>
        </div>

        <div>
          <h4 style={{ color: '#ffffff', marginBottom: '1rem', fontSize: '0.95rem', textTransform: 'uppercase', letterSpacing: '0.06em' }}>Compliance & Auditing</h4>
          <p style={{ fontSize: '0.885rem', lineHeight: 1.65, color: '#94a3b8' }}>
            All surplus transfers generate verifiable digital audit trails, Good Samaritan Act compliance documentation, and ESG waste-diversion metrics.
          </p>
        </div>
      </div>

      <div style={{ maxWidth: '1320px', margin: '3rem auto 0', paddingTop: '1.75rem', borderTop: '1px solid rgba(255, 255, 255, 0.08)', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem', fontSize: '0.825rem', color: '#64748b' }}>
        <div>
          © {new Date().getFullYear()} FoodRescue Redistribution Platform. All rights reserved.
        </div>
        <div>
          Engineered with Java 17, Spring Boot, MySQL 8 & React 18
        </div>
      </div>
    </footer>
  );
};

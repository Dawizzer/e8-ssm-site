import { useState, useEffect, useRef } from "react";
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend,
  LineChart, Line, ResponsiveContainer, Cell, ReferenceLine
} from "recharts";

const C = {
  bg: "#06090f",
  bg2: "#0a0e17",
  card: "#111827",
  border: "#1e293b",
  e8: "#06d6a0",
  e8glow: "#06d6a033",
  scalar: "#ef4444",
  baseline: "#3b82f6",
  text: "#e2e8f0",
  dim: "#94a3b8",
  dimmer: "#64748b",
  gold: "#f59e0b",
  grid: "#1e293b",
  white: "#ffffff",
};

const mono = "'JetBrains Mono', 'SF Mono', 'Fira Code', monospace";
const sans = "'Inter', -apple-system, BlinkMacSystemFont, sans-serif";

// Data
const layerData = [
  { name: "fp16 baseline", accuracy: 30.18, fill: C.baseline },
  { name: "E8 4-bit", accuracy: 29.89, fill: C.e8 },
  { name: "Scalar 4-bit", accuracy: 0.0, fill: C.scalar },
  { name: "E8 2-bit", accuracy: 26.24, fill: C.gold },
  { name: "Scalar 2-bit", accuracy: 0.0, fill: C.scalar },
];

const compoundData = [
  { name: "Layer Boundary", e8: 29.89, scalar: 0.0 },
  { name: "Every 16 Steps", e8: 3.65, scalar: 0.47 },
  { name: "Every Step", e8: 0.37, scalar: 0.0 },
];

const snrData = [
  { bits: 2, e8: 14.04, scalar: 0.0 },
  { bits: 3, e8: 17.31, scalar: 1.5 },
  { bits: 4, e8: 21.26, scalar: 9.66 },
  { bits: 5, e8: 26.77, scalar: 16.23 },
  { bits: 6, e8: 32.57, scalar: 22.59 },
  { bits: 8, e8: 34.01, scalar: 34.43 },
];

const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div style={{ background: C.card, border: `1px solid ${C.border}`, padding: "10px 14px", borderRadius: 8, fontSize: 12, color: C.text }}>
      <div style={{ fontWeight: 700, marginBottom: 4 }}>{label}</div>
      {payload.map((p, i) => (
        <div key={i} style={{ color: p.color || p.fill, marginTop: 2 }}>
          {p.name}: <strong>{typeof p.value === 'number' ? p.value.toFixed(2) : p.value}%</strong>
        </div>
      ))}
    </div>
  );
};

function AnimatedNumber({ value, suffix = "", decimals = 2, color = C.e8 }) {
  const [display, setDisplay] = useState(0);
  const ref = useRef(null);
  const started = useRef(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && !started.current) {
          started.current = true;
          // let start = 0;
          const duration = 1200;
          const startTime = Date.now();
          const animate = () => {
            const elapsed = Date.now() - startTime;
            const progress = Math.min(elapsed / duration, 1);
            const eased = 1 - Math.pow(1 - progress, 3);
            setDisplay(eased * value);
            if (progress < 1) requestAnimationFrame(animate);
          };
          animate();
        }
      },
      { threshold: 0.5 }
    );
    if (ref.current) observer.observe(ref.current);
    return () => observer.disconnect();
  }, [value]);

  return (
    <span ref={ref} style={{ color, fontFamily: mono, fontWeight: 800, fontSize: "inherit" }}>
      {display.toFixed(decimals)}{suffix}
    </span>
  );
}

function Section({ children, id }) {
  return (
    <section id={id} style={{ padding: "80px 0", position: "relative" }}>
      {children}
    </section>
  );
}

function SectionLabel({ children }) {
  return (
    <div style={{
      fontSize: 11, fontWeight: 700, color: C.e8, letterSpacing: 4,
      textTransform: "uppercase", fontFamily: mono, marginBottom: 8,
    }}>{children}</div>
  );
}

function SectionTitle({ children }) {
  return (
    <h2 style={{
      fontSize: 28, fontWeight: 800, color: C.text, lineHeight: 1.3,
      margin: "0 0 16px", fontFamily: sans,
    }}>{children}</h2>
  );
}

function SectionDesc({ children }) {
  return (
    <p style={{
      fontSize: 15, color: C.dim, lineHeight: 1.8, maxWidth: 680,
      margin: "0 0 40px",
    }}>{children}</p>
  );
}

function Card({ children, style = {}, glow = false }) {
  return (
    <div style={{
      background: C.card,
      border: `1px solid ${glow ? C.e8 + "44" : C.border}`,
      borderRadius: 12,
      padding: 24,
      boxShadow: glow ? `0 0 40px ${C.e8glow}` : "none",
      ...style,
    }}>{children}</div>
  );
}

export default function E8Site() {
  const [nav, setNav] = useState("hero");

  const sections = [
    { id: "hero", label: "Home" },
    { id: "results", label: "Results" },
    { id: "compounding", label: "Compounding" },
    { id: "snr", label: "SNR" },
    { id: "comparison", label: "Comparison" },
    { id: "method", label: "Method" },
  ];

  return (
    <div style={{ background: C.bg, minHeight: "100vh", color: C.text, fontFamily: sans }}>

      {/* ══ NAV ══ */}
      <nav style={{
        position: "sticky", top: 0, zIndex: 100,
        background: C.bg + "ee", backdropFilter: "blur(12px)",
        borderBottom: `1px solid ${C.border}`,
        padding: "0 24px",
      }}>
        <div style={{
          maxWidth: 960, margin: "0 auto",
          display: "flex", alignItems: "center", justifyContent: "space-between",
          height: 56,
        }}>
          <div style={{ fontFamily: mono, fontWeight: 800, fontSize: 14, color: C.e8 }}>
            E8 ◆ SSM
          </div>
          <div style={{ display: "flex", gap: 4 }}>
            {sections.map(s => (
              <a key={s.id} href={`#${s.id}`}
                onClick={() => setNav(s.id)}
                style={{
                  color: nav === s.id ? C.e8 : C.dimmer,
                  fontSize: 12, fontWeight: 600, padding: "8px 12px",
                  textDecoration: "none", borderRadius: 6,
                  background: nav === s.id ? C.e8 + "11" : "transparent",
                  transition: "all 0.2s",
                }}
              >{s.label}</a>
            ))}
          </div>
          <a href="https://github.com/Dawizzer/e8-ssm-quantization" target="_blank" rel="noreferrer"
            style={{
              color: C.dim, fontSize: 12, fontWeight: 600, textDecoration: "none",
              padding: "6px 14px", border: `1px solid ${C.border}`, borderRadius: 6,
            }}
          >GitHub →</a>
        </div>
      </nav>

      <div style={{ maxWidth: 960, margin: "0 auto", padding: "0 24px" }}>

        {/* ══ HERO ══ */}
        <Section id="hero">
          <div style={{ paddingTop: 40 }}>
            <SectionLabel>arXiv Preprint — March 2026</SectionLabel>
            <h1 style={{
              fontSize: 44, fontWeight: 900, lineHeight: 1.15, margin: "12px 0 20px",
              maxWidth: 700,
            }}>
              <span style={{
                background: `linear-gradient(135deg, ${C.e8}, #3b82f6, ${C.gold})`,
                WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent",
              }}>
                E8 Lattice Quantization
              </span>
              <br />
              <span style={{ color: C.text }}>for State Space Model Hidden States</span>
            </h1>
            <div style={{ fontSize: 16, color: C.dim, marginBottom: 48, lineHeight: 1.6 }}>
              Dwayne Foulstone — Independent Researcher, Melbourne, Australia
            </div>

            {/* Hero stats */}
            <div style={{ display: "flex", gap: 20, flexWrap: "wrap", marginBottom: 48 }}>
              {[
                { value: 29.89, label: "E8 4-bit Accuracy", sub: "Only 0.29% below fp16 baseline", color: C.e8 },
                { value: 0.00, label: "Scalar 4-bit Accuracy", sub: "Complete signal destruction", color: C.scalar },
                { value: 26.24, label: "E8 2-bit Accuracy", sub: "Functional at half the bit budget", color: C.gold },
              ].map((s, i) => (
                <Card key={i} style={{ flex: 1, minWidth: 220, textAlign: "center", padding: "32px 20px" }} glow={i === 0}>
                  <div style={{ fontSize: 48, lineHeight: 1 }}>
                    <AnimatedNumber value={s.value} suffix="%" color={s.color} />
                  </div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: C.text, marginTop: 12 }}>{s.label}</div>
                  <div style={{ fontSize: 12, color: C.dim, marginTop: 4 }}>{s.sub}</div>
                </Card>
              ))}
            </div>

            {/* Abstract box */}
            <Card style={{
              background: `linear-gradient(135deg, ${C.e8}08, ${C.bg2})`,
              borderColor: C.e8 + "22",
              padding: "32px 36px",
            }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: C.e8, marginBottom: 12, fontFamily: mono, letterSpacing: 2 }}>
                THE RESULT
              </div>
              <div style={{ fontSize: 16, lineHeight: 1.8, color: C.text }}>
                E8 lattice quantization at <strong style={{ color: C.gold }}>2 bits per dimension</strong> achieves
                26.24% accuracy on LAMBADA — where standard scalar quantization at <strong style={{ color: C.scalar }}>4 bits</strong> (double
                the bit budget) produces <strong style={{ color: C.scalar }}>0.00%</strong>. No model retraining.
                No architectural modifications. No Hadamard transforms, rotation matrices, or
                adaptive scales. Just the provably optimal geometry of the E8 lattice applied
                as a drop-in replacement for scalar quantization.
              </div>
            </Card>
          </div>
        </Section>

        {/* Divider */}
        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.e8}44, transparent)` }} />

        {/* ══ RESULTS ══ */}
        <Section id="results">
          <SectionLabel>Layer-Boundary Quantization</SectionLabel>
          <SectionTitle>Downstream Task Accuracy</SectionTitle>
          <SectionDesc>
            Quantize/dequantize applied once per Mamba block output (24 cycles per sequence).
            This is the deployment-relevant configuration — compress the hidden state between
            layers, not mid-computation. Evaluated on LAMBADA last-word prediction (5,153 samples).
          </SectionDesc>

          <Card style={{ marginBottom: 32, padding: "24px 16px" }}>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={layerData} margin={{ top: 20, right: 20, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
                <XAxis dataKey="name" tick={{ fill: C.dim, fontSize: 11 }} axisLine={{ stroke: C.grid }} tickLine={false} />
                <YAxis tick={{ fill: C.dim, fontSize: 11 }} axisLine={{ stroke: C.grid }} tickLine={false} domain={[0, 35]} tickFormatter={v => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <ReferenceLine y={30.18} stroke={C.baseline} strokeDasharray="6 4" strokeWidth={1.5} />
                <Bar dataKey="accuracy" name="Accuracy" radius={[6, 6, 0, 0]} maxBarSize={70}>
                  {layerData.map((e, i) => <Cell key={i} fill={e.fill} fillOpacity={0.85} />)}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
            <div style={{ display: "flex", justifyContent: "center", gap: 20, fontSize: 11, color: C.dim, marginTop: 4 }}>
              <span><span style={{ color: C.baseline }}>■</span> Baseline</span>
              <span><span style={{ color: C.e8 }}>■</span> E8 Lattice</span>
              <span><span style={{ color: C.scalar }}>■</span> Scalar</span>
              <span style={{ color: C.baseline }}>--- fp16 (30.18%)</span>
            </div>
          </Card>

          {/* Results table */}
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 14 }}>
              <thead>
                <tr style={{ background: C.bg2 }}>
                  {["Config", "Accuracy", "Δ vs fp16", "Status"].map(h => (
                    <th key={h} style={{
                      padding: "14px 20px", textAlign: "left", fontWeight: 700,
                      color: C.dimmer, fontSize: 10, letterSpacing: 1.5,
                      textTransform: "uppercase", borderBottom: `1px solid ${C.border}`,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { c: "fp16 baseline", a: "30.18%", d: "—", s: "Reference", col: C.baseline },
                  { c: "E8 4-bit", a: "29.89%", d: "-0.29%", s: "✦ NEAR-LOSSLESS", col: C.e8 },
                  { c: "Scalar 4-bit", a: "0.00%", d: "-30.18%", s: "✗ COLLAPSED", col: C.scalar },
                  { c: "E8 2-bit", a: "26.24%", d: "-3.94%", s: "✦ FUNCTIONAL", col: C.gold },
                  { c: "Scalar 2-bit", a: "0.00%", d: "-30.18%", s: "✗ COLLAPSED", col: C.scalar },
                ].map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "14px 20px", fontWeight: 600, color: r.col }}>{r.c}</td>
                    <td style={{ padding: "14px 20px", fontFamily: mono, fontWeight: 700, fontSize: 18, color: r.col }}>{r.a}</td>
                    <td style={{ padding: "14px 20px", fontFamily: mono, color: C.dim }}>{r.d}</td>
                    <td style={{ padding: "14px 20px", fontWeight: 700, fontSize: 11, letterSpacing: 0.5, color: r.col }}>{r.s}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </Section>

        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />

        {/* ══ COMPOUNDING ══ */}
        <Section id="compounding">
          <SectionLabel>Error Compounding Analysis</SectionLabel>
          <SectionTitle>Quantization Frequency vs Accuracy</SectionTitle>
          <SectionDesc>
            As quantization frequency increases, accumulated rounding error compounds through
            the recurrence. E8's geometric advantage produces graceful degradation where scalar
            quantization collapses immediately at any frequency.
          </SectionDesc>

          <Card style={{ marginBottom: 32, padding: "24px 16px" }}>
            <ResponsiveContainer width="100%" height={360}>
              <BarChart data={compoundData} margin={{ top: 20, right: 30, bottom: 20, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
                <XAxis dataKey="name" tick={{ fill: C.dim, fontSize: 11 }} axisLine={{ stroke: C.grid }} tickLine={false} />
                <YAxis tick={{ fill: C.dim, fontSize: 11 }} axisLine={{ stroke: C.grid }} tickLine={false} domain={[0, 35]} tickFormatter={v => `${v}%`} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: C.dim }} iconType="square" />
                <ReferenceLine y={30.18} stroke={C.baseline} strokeDasharray="6 4" strokeWidth={1.5} />
                <Bar dataKey="e8" name="E8 4-bit" fill={C.e8} fillOpacity={0.85} radius={[6, 6, 0, 0]} maxBarSize={55} />
                <Bar dataKey="scalar" name="Scalar 4-bit" fill={C.scalar} fillOpacity={0.85} radius={[6, 6, 0, 0]} maxBarSize={55} />
              </BarChart>
            </ResponsiveContainer>
          </Card>

          <div style={{ display: "flex", gap: 14, flexWrap: "wrap" }}>
            {[
              { label: "Layer Boundary", cycles: "~24 cycles", e8: "29.89%", sc: "0.00%", note: "E8 preserves 99% accuracy" },
              { label: "Every 16 Steps", cycles: "~hundreds", e8: "3.65%", sc: "0.47%", note: "E8 retains 8x more signal" },
              { label: "Every Step", cycles: "~thousands", e8: "0.37%", sc: "0.00%", note: "E8 still nonzero; scalar dead" },
            ].map((item, i) => (
              <Card key={i} style={{ flex: 1, minWidth: 240, padding: "20px 22px" }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: C.text }}>{item.label}</div>
                <div style={{ fontSize: 11, color: C.dimmer, marginBottom: 14, fontFamily: mono }}>{item.cycles}</div>
                <div style={{ display: "flex", gap: 16, marginBottom: 10 }}>
                  <div>
                    <div style={{ fontSize: 10, color: C.dimmer, textTransform: "uppercase", letterSpacing: 1 }}>E8</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: C.e8, fontFamily: mono }}>{item.e8}</div>
                  </div>
                  <div>
                    <div style={{ fontSize: 10, color: C.dimmer, textTransform: "uppercase", letterSpacing: 1 }}>Scalar</div>
                    <div style={{ fontSize: 22, fontWeight: 800, color: C.scalar, fontFamily: mono }}>{item.sc}</div>
                  </div>
                </div>
                <div style={{ fontSize: 12, color: C.dim }}>{item.note}</div>
              </Card>
            ))}
          </div>
        </Section>

        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />

        {/* ══ SNR ══ */}
        <Section id="snr">
          <SectionLabel>Phase 1 — Static Benchmark</SectionLabel>
          <SectionTitle>Signal-to-Noise Ratio Across Bit Rates</SectionTitle>
          <SectionDesc>
            SNR measured on real Mamba-130M hidden states. E8 dominates across 2-6 bits/dim
            with crossover at 6-8 bits, consistent with information-theoretic predictions. The
            real-model advantage is approximately 3x stronger than synthetic Gaussian baselines.
          </SectionDesc>

          <Card style={{ marginBottom: 32, padding: "24px 16px" }}>
            <ResponsiveContainer width="100%" height={360}>
              <LineChart data={snrData} margin={{ top: 20, right: 30, bottom: 30, left: 20 }}>
                <CartesianGrid strokeDasharray="3 3" stroke={C.grid} />
                <XAxis dataKey="bits" tick={{ fill: C.dim, fontSize: 11 }} axisLine={{ stroke: C.grid }} tickLine={false}
                  label={{ value: "Bits per Dimension", fill: C.dim, fontSize: 12, position: "insideBottom", offset: -15 }} />
                <YAxis tick={{ fill: C.dim, fontSize: 11 }} axisLine={{ stroke: C.grid }} tickLine={false}
                  label={{ value: "SNR (dB)", fill: C.dim, fontSize: 12, angle: -90, position: "insideLeft", offset: 10 }} domain={[0, 40]} />
                <Tooltip content={<CustomTooltip />} />
                <Legend wrapperStyle={{ fontSize: 12, color: C.dim }} />
                <Line type="monotone" dataKey="e8" name="E8 Lattice" stroke={C.e8} strokeWidth={3} dot={{ r: 5, fill: C.e8 }} />
                <Line type="monotone" dataKey="scalar" name="Scalar" stroke={C.scalar} strokeWidth={3} dot={{ r: 5, fill: C.scalar }} />
              </LineChart>
            </ResponsiveContainer>
          </Card>

          {/* SNR table */}
          <Card style={{ padding: 0, overflow: "hidden" }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: C.bg2 }}>
                  {["Bits/dim", "E8 SNR (dB)", "Scalar SNR (dB)", "E8 Advantage", "Verdict"].map(h => (
                    <th key={h} style={{
                      padding: "12px 18px", textAlign: "left", fontWeight: 700,
                      color: C.dimmer, fontSize: 10, letterSpacing: 1.5,
                      textTransform: "uppercase", borderBottom: `1px solid ${C.border}`,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { b: 2, e: "14.04", s: "0.00", a: "+14.03", v: "E8 wins" },
                  { b: 3, e: "17.31", s: "1.50", a: "+15.81", v: "E8 wins" },
                  { b: 4, e: "21.26", s: "9.66", a: "+11.60", v: "E8 wins" },
                  { b: 5, e: "26.77", s: "16.23", a: "+10.54", v: "E8 wins" },
                  { b: 6, e: "32.57", s: "22.59", a: "+9.98", v: "E8 wins" },
                  { b: 8, e: "34.01", s: "34.43", a: "-0.42", v: "Crossover" },
                ].map((r, i) => (
                  <tr key={i} style={{ borderBottom: `1px solid ${C.border}` }}>
                    <td style={{ padding: "12px 18px", fontFamily: mono, fontWeight: 700 }}>{r.b}</td>
                    <td style={{ padding: "12px 18px", fontFamily: mono, color: C.e8 }}>{r.e}</td>
                    <td style={{ padding: "12px 18px", fontFamily: mono, color: C.scalar }}>{r.s}</td>
                    <td style={{ padding: "12px 18px", fontFamily: mono, fontWeight: 700, color: r.a.startsWith("+") ? C.e8 : C.dim }}>{r.a} dB</td>
                    <td style={{ padding: "12px 18px", fontWeight: 600, color: r.v === "Crossover" ? C.dim : C.e8 }}>{r.v}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>
        </Section>

        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />

        {/* ══ COMPARISON ══ */}
        <Section id="comparison">
          <SectionLabel>Literature Comparison</SectionLabel>
          <SectionTitle>E8 vs Existing SSM Quantization Methods</SectionTitle>
          <SectionDesc>
            All existing Mamba quantization methods employ scalar quantization with various
            mitigation strategies. None achieve functional sub-8-bit hidden state quantization
            without significant accuracy loss or auxiliary techniques.
          </SectionDesc>

          <Card style={{ padding: 0, overflow: "hidden", marginBottom: 32 }}>
            <table style={{ width: "100%", borderCollapse: "collapse", fontSize: 13 }}>
              <thead>
                <tr style={{ background: C.bg2 }}>
                  {["Method", "Year", "Bits", "Approach", "Acc. Drop", "Aux. Techniques"].map(h => (
                    <th key={h} style={{
                      padding: "12px 16px", textAlign: "left", fontWeight: 700,
                      color: C.dimmer, fontSize: 10, letterSpacing: 1.5,
                      textTransform: "uppercase", borderBottom: `1px solid ${C.border}`,
                    }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {[
                  { m: "Quamba", y: "2024", b: "8", a: "Scalar + Hadamard", d: "~0.9%", t: "Hadamard transform", ours: false },
                  { m: "Q-Mamba", y: "2025", b: "4†", a: "Decoupled scale", d: "~2%", t: "DSQ, W8A8H4 config", ours: false },
                  { m: "QMamba", y: "2025", b: "4", a: "Temporal grouping", d: "62-66%", t: "TGQ, outlier handling", ours: false },
                  { m: "LightMamba", y: "2025", b: "8", a: "Rotation + FPGA", d: "~1%", t: "FPGA co-design", ours: false },
                  { m: "Quamba-SE", y: "2026", b: "8", a: "Soft-edge adaptive", d: "+0.83% vs Q", t: "Adaptive scales", ours: false },
                  { m: "E8 (ours)", y: "2026", b: "4", a: "E8 lattice", d: "0.29%", t: "None", ours: true },
                  { m: "E8 (ours)", y: "2026", b: "2", a: "E8 lattice", d: "3.94%", t: "None", ours: true },
                ].map((r, i) => (
                  <tr key={i} style={{
                    borderBottom: `1px solid ${C.border}`,
                    background: r.ours ? `${C.e8}08` : "transparent",
                  }}>
                    <td style={{ padding: "12px 16px", fontWeight: r.ours ? 700 : 500, color: r.ours ? C.e8 : C.text }}>{r.m}</td>
                    <td style={{ padding: "12px 16px", fontFamily: mono, color: C.dim }}>{r.y}</td>
                    <td style={{ padding: "12px 16px", fontFamily: mono, fontWeight: 700 }}>{r.b}</td>
                    <td style={{ padding: "12px 16px", color: C.dim }}>{r.a}</td>
                    <td style={{
                      padding: "12px 16px", fontFamily: mono, fontWeight: 700,
                      color: parseFloat(r.d) < 1 ? C.e8 : parseFloat(r.d) < 5 ? C.gold : C.scalar,
                    }}>{r.d}</td>
                    <td style={{ padding: "12px 16px", color: r.t === "None" ? C.e8 : C.dim, fontWeight: r.t === "None" ? 700 : 400 }}>{r.t}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </Card>

          <div style={{ fontSize: 11, color: C.dimmer, marginBottom: 32 }}>
            † Q-Mamba uses 4-bit for hidden states but requires 8-bit weights and activations (W8A8H4 configuration)
          </div>
        </Section>

        <div style={{ height: 1, background: `linear-gradient(90deg, transparent, ${C.border}, transparent)` }} />

        {/* ══ METHOD ══ */}
        <Section id="method">
          <SectionLabel>How It Works</SectionLabel>
          <SectionTitle>E8 Lattice Quantization in 60 Seconds</SectionTitle>

          <div style={{ display: "flex", flexDirection: "column", gap: 20, maxWidth: 720 }}>
            {[
              {
                num: "01",
                title: "The Problem",
                body: "SSM hidden states are fixed-size compressed representations of all prior context. Quantizing them for efficient inference is a lossy compression problem in multi-dimensional space. Existing methods treat each dimension independently (scalar quantization), which means a single outlier coordinate wastes the entire dynamic range."
              },
              {
                num: "02",
                title: "The Insight",
                body: "SSM hidden state quantization is fundamentally a geometry problem, not an arithmetic problem. The E8 lattice is the densest sphere packing in 8 dimensions (240 minimal vectors) and the provably optimal vector quantizer for Gaussian sources in that dimensionality."
              },
              {
                num: "03",
                title: "The Method",
                body: "Tile the hidden state into 8-dimensional chunks. For each chunk, find the nearest E8 lattice point using the Conway-Sloane decoder (O(d) per chunk). Rescale back. No training. No architectural changes. No auxiliary transforms. Just better geometry."
              },
              {
                num: "04",
                title: "The Result",
                body: "At 4-bit: 0.29% accuracy drop (near-lossless). At 2-bit: 3.94% drop (functional). Scalar quantization at 4-bit: 0.00% (complete collapse). E8 at half the bit budget outperforms scalar at full budget by 26 percentage points."
              },
            ].map((step, i) => (
              <div key={i} style={{ display: "flex", gap: 20 }}>
                <div style={{
                  fontFamily: mono, fontSize: 32, fontWeight: 800,
                  color: C.e8 + "33", lineHeight: 1, flexShrink: 0, width: 50,
                }}>{step.num}</div>
                <div>
                  <div style={{ fontSize: 16, fontWeight: 700, color: C.text, marginBottom: 6 }}>{step.title}</div>
                  <div style={{ fontSize: 14, color: C.dim, lineHeight: 1.8 }}>{step.body}</div>
                </div>
              </div>
            ))}
          </div>

          {/* CTA */}
          <div style={{
            marginTop: 64, padding: "40px 36px", textAlign: "center",
            background: `linear-gradient(135deg, ${C.e8}11, ${C.bg2})`,
            border: `1px solid ${C.e8}22`, borderRadius: 16,
          }}>
            <div style={{ fontSize: 24, fontWeight: 800, color: C.text, marginBottom: 8 }}>
              Reproduce It Yourself
            </div>
            <div style={{ fontSize: 14, color: C.dim, marginBottom: 24, lineHeight: 1.7 }}>
              All code, data, and evaluation scripts are open source.
            </div>
            <div style={{ display: "flex", gap: 12, justifyContent: "center", flexWrap: "wrap" }}>
              <a href="https://github.com/Dawizzer/e8-ssm-quantization" target="_blank" rel="noreferrer"
                style={{
                  display: "inline-block", padding: "12px 28px", background: C.e8,
                  color: C.bg, fontWeight: 700, fontSize: 14, borderRadius: 8,
                  textDecoration: "none",
                }}>
                View on GitHub
              </a>
              
            </div>
          </div>
        </Section>

        {/* ══ FOOTER ══ */}
        <div style={{
          padding: "40px 0", marginTop: 40,
          borderTop: `1px solid ${C.border}`,
          textAlign: "center", fontSize: 12, color: C.dimmer, lineHeight: 2,
        }}>
          <div>Mamba-130M · LAMBADA (5,153 samples) · NVIDIA RTX 5090 · Seed 42</div>
          <div>Dwayne Foulstone · Melbourne, Australia · March 2026</div>
          <div style={{ marginTop: 8, fontFamily: mono, color: C.e8 + "66" }}>
            github.com/Dawizzer/e8-ssm-quantization
          </div>
          <div style={{ marginTop: 4, fontSize: 11, color: "#64748b" }}>Non-commercial license. Attribution required.</div>
        </div>
      </div>
    </div>
  );
}

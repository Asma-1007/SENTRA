import { useMemo, useState } from "react";

type Section = "Overview" | "Assistant" | "Agents" | "Memory" | "Settings";
type Message = { role: "user" | "assistant"; text: string };

const navItems: { label: Section; glyph: string }[] = [
  { label: "Overview", glyph: "◫" },
  { label: "Assistant", glyph: "↗" },
  { label: "Agents", glyph: "◎" },
  { label: "Memory", glyph: "▤" },
  { label: "Settings", glyph: "⌘" },
];

const agents = [
  { name: "Planner", desc: "Breaks requests into clear steps", status: "Ready", color: "blue", code: "PL" },
  { name: "Executor", desc: "Carries out the planned tasks", status: "Ready", color: "red", code: "EX" },
  { name: "Critic", desc: "Reviews answers for consistency", status: "Standby", color: "violet", code: "CR" },
  { name: "Memory", desc: "Keeps useful context on-device", status: "Ready", color: "green", code: "ME" },
];

function App() {
  const [section, setSection] = useState<Section>("Overview");
  const [mobileNav, setMobileNav] = useState(false);
  const [online, setOnline] = useState(false);
  const [privateMode, setPrivateMode] = useState(true);
  const [voiceEnabled, setVoiceEnabled] = useState(false);
  const [input, setInput] = useState("");
  const [messages, setMessages] = useState<Message[]>([]);
  const [toast, setToast] = useState("");

  const pageCopy = useMemo(() => {
    const copy: Record<Section, { eyebrow: string; title: string; subtitle: string }> = {
      Overview: { eyebrow: "YOUR PRIVATE WORKSPACE", title: "Think clearly.\nStay in control.", subtitle: "A calmer way to work with AI — built around your device, your data, and your decisions." },
      Assistant: { eyebrow: "SENTRA ASSISTANT", title: "What’s on your mind?", subtitle: "Start with a thought, a question, or a task. This preview uses demo responses only." },
      Agents: { eyebrow: "SYSTEM WORKSPACE", title: "A team behind every task.", subtitle: "A coordinated set of specialist agents, designed to plan, execute, review, and remember." },
      Memory: { eyebrow: "ON-DEVICE CONTEXT", title: "Your memory, your rules.", subtitle: "A preview of how saved context could be reviewed and managed locally." },
      Settings: { eyebrow: "PREFERENCES", title: "Make SENTRA yours.", subtitle: "Choose how this interface represents privacy, connectivity, and input preferences." },
    };
    return copy[section];
  }, [section]);

  const getDemoReply = (prompt: string): string => {
  const text = prompt.toLowerCase();

  if (text.includes("plan my day") || text.includes("productivity")) {
    return `Let's make today manageable.

1. Pick your three most important tasks.
2. Start with the most urgent one.
3. Focus for 25 minutes, then take a 5-minute break.
4. Review your progress before wrapping up.

My suggestion: start small and build momentum.`;
  }

  if (text.includes("summar") || text.includes("notes")) {
    return `Absolutely! Send me your notes, and I'll organise them into:

* Key points
* Important details
* Action items
* A concise summary

I'll keep the main ideas clear and easy to revise.`;
  }

  if (
    text.includes("explain") ||
    text.includes("what is") ||
    text.includes("how does")
  ) {
    return `Let's break that down simply.

First, identify the main idea. Then look at how its parts connect, and use an example to make it easier to understand.

Tell me the specific concept you're exploring, and I'll walk you through it step by step.`;
  }

  if (
    text.includes("hello") ||
    text.includes("hey") ||
    text.includes("hi")
  ) {
    return `Hey! I'm SENTRA. ✨

I'm ready to help you think through ideas, organise tasks, explain concepts, or plan your next steps.

What shall we work on?`;
  }

  if (
    text.includes("write") ||
    text.includes("email") ||
    text.includes("draft")
  ) {
    return `Of course. I can help you put that together.

I'll aim for clear wording, a natural tone, and a structure that gets your point across.

Tell me the purpose and tone you want, and we'll shape the draft.`;
  }

  return `Let's work through that together.

Here's how I'd approach it:

1. Identify the main goal.
2. Break it into smaller, manageable steps.
3. Compare the options and choose a practical next step.

To get started, I'll focus on the most important part of your request: "${prompt}".`;
};

const sendMessage = () => {
  const clean = input.trim();
  if (!clean) return;

  setMessages((current) => [
    ...current,
    { role: "user", text: clean },
    { role: "assistant", text: getDemoReply(clean) },
  ]);

  setInput("");
};

  function notify(message: string) {
    setToast(message);
    window.setTimeout(() => setToast(""), 2400);
  }

  return (
    <div className="app-shell">
      {mobileNav && <button className="mobile-scrim" aria-label="Close navigation" onClick={() => setMobileNav(false)} />}
      <aside className={`sidebar ${mobileNav ? "sidebar-open" : ""}`}>
        <div className="brand">
          <div className="brand-mark"><span /></div>
          <div><div className="brand-name">SENTRA<span className="brand-period">.</span></div><div className="brand-sub">PRIVATE INTELLIGENCE</div></div>
          <button className="close-nav" onClick={() => setMobileNav(false)} aria-label="Close navigation">×</button>
        </div>

        <div className="workspace-label">WORKSPACE</div>
        <nav className="nav-list" aria-label="Main navigation">
          {navItems.map((item) => (
            <button key={item.label} className={`nav-item ${section === item.label ? "active" : ""}`} onClick={() => { setSection(item.label); setMobileNav(false); }}>
              <span className="nav-glyph" aria-hidden="true">{item.glyph}</span>
              <span>{item.label}</span>
              {item.label === "Assistant" && <span className="nav-new">NEW</span>}
            </button>
          ))}
        </nav>

        <div className="sidebar-bottom">
          <div className="privacy-card">
            <div className="privacy-top"><span className="privacy-dot" /> PRIVACY STATUS</div>
            <div className="privacy-title">Your data stays here.</div>
            <p>Local-first by design. Online tools stay optional.</p>
            <button className="text-action" onClick={() => setSection("Settings")}>Privacy settings <span>↗</span></button>
          </div>
          <div className="profile">
            <div className="profile-avatar">S</div>
            <div className="profile-info"><strong>Local workspace</strong><span>Personal device</span></div>
            <span className="profile-menu">•••</span>
          </div>
        </div>
      </aside>

      <main className="main-content">
        <header className="topbar">
          <button className="mobile-menu" onClick={() => setMobileNav(true)} aria-label="Open navigation"><span /><span /><span /></button>
          <div className="breadcrumb"><span>Workspace</span><b>/</b><strong>{section}</strong></div>
          <div className="topbar-right">
            <div className="connection"><span className={`status-dot ${online ? "online" : ""}`} /><span>{online ? "Online tools enabled" : "Offline-ready"}</span></div>
            <button className="top-avatar" title="Local workspace">S</button>
          </div>
        </header>

        <div className="page-wrap">
          <section className="welcome-row">
            <div>
              <div className="eyebrow"><span className="eyebrow-line" />{pageCopy.eyebrow}</div>
              <h1>{pageCopy.title.split("\n").map((line, index) => <span key={line}>{line}{index === 0 && pageCopy.title.includes("\n") ? <br /> : null}</span>)}</h1>
              <p className="page-subtitle">{pageCopy.subtitle}</p>
            </div>
            <div className="date-chip"><span className="date-icon">◷</span><span>LOCAL SESSION</span><b>ACTIVE</b></div>
          </section>

          {section === "Overview" && <Overview online={online} setOnline={setOnline} privateMode={privateMode} setPrivateMode={setPrivateMode} setSection={setSection} notify={notify} />}
          {section === "Assistant" && <Assistant messages={messages} input={input} setInput={setInput} sendMessage={sendMessage} voiceEnabled={voiceEnabled} setVoiceEnabled={setVoiceEnabled} />}
          {section === "Agents" && <Agents />}
          {section === "Memory" && <Memory notify={notify} />}
          {section === "Settings" && <Settings online={online} setOnline={setOnline} privateMode={privateMode} setPrivateMode={setPrivateMode} voiceEnabled={voiceEnabled} setVoiceEnabled={setVoiceEnabled} />}
          <footer className="footer"><span>SENTRA <b>PREVIEW 0.1</b></span><span><i /> FRONTEND DEMO · NO BACKEND CONNECTED</span></footer>
        </div>
      </main>
      {toast && <div className="toast"><span className="toast-check">✓</span>{toast}</div>}
    </div>
  );
}

function Overview({ online, setOnline, privateMode, setPrivateMode, setSection, notify }: any) {
  return <>
    <section className="hero-panel">
      <div className="hero-copy">
        <div className="hero-kicker"><span className="hero-kicker-dot" /> LOCAL-FIRST AI</div>
        <h2>Intelligence that<br /><em>stays yours.</em></h2>
        <p>Your private assistant, designed to think on your device. Connect to the wider web only when you choose.</p>
        <div className="hero-actions">
          <button className="button-primary" onClick={() => setSection("Assistant")}>Open assistant <span>↗</span></button>
          <button className="button-secondary" onClick={() => setSection("Agents")}>Explore agents</button>
        </div>
        <div className="hero-footnote"><span className="mini-shield">◇</span> Your prompts are not sent to a cloud AI in this demo.</div>
      </div>
      <div className="orbit-art" aria-label="Abstract SENTRA system visualization">
        <div className="orbit orbit-one" /><div className="orbit orbit-two" /><div className="orbit orbit-three" />
        <div className="orbit-core"><div className="core-inner">S<span>.</span></div><div className="core-ring" /></div>
        <div className="orbit-label label-top"><span className="label-dot blue-dot" /> LOCAL MODEL <b>READY</b></div>
        <div className="orbit-label label-side"><span className="label-dot red-dot" /> MEMORY <b>ON DEVICE</b></div>
        <div className="orbit-label label-bottom"><span className="label-dot green-dot" /> PRIVACY <b>ACTIVE</b></div>
      </div>
      <div className="hero-index">01 <span>/ 04</span></div>
    </section>

    <div className="section-heading"><div><span className="eyebrow small">SYSTEM SNAPSHOT</span><h3>Your workspace at a glance</h3></div><span className="updated"><i /> DEMO ENVIRONMENT</span></div>

    <section className="overview-grid">
      <div className="metric-panel">
        <div className="panel-top"><span>AGENT NETWORK</span><span className="panel-mark">↗</span></div>
        <div className="metric-number">04<span className="metric-unit"> agents</span></div>
        <p>Specialists ready to collaborate on a task.</p>
        <div className="agent-stack">{agents.map((a) => <span key={a.code} className={`agent-mini ${a.color}`}>{a.code}</span>)}<span className="stack-label">Planner · Executor · Critic · Memory</span></div>
        <button className="panel-link" onClick={() => setSection("Agents")}>View agent network <span>→</span></button>
      </div>
      <div className="metric-panel">
        <div className="panel-top"><span>PRIVACY MODE</span><span className="panel-mark">◇</span></div>
        <div className="metric-number">{privateMode ? "On" : "Off"}<span className="metric-unit"> by default</span></div>
        <p>Keep this preview in local-first mode.</p>
        <div className="setting-line"><span className="setting-icon privacy-icon">⌑</span><span><strong>Private workspace</strong><small>{privateMode ? "Local-first mode enabled" : "Local-first mode paused"}</small></span><Toggle checked={privateMode} onChange={setPrivateMode} label="Toggle private mode" /></div>
      </div>
      <div className="metric-panel">
        <div className="panel-top"><span>CONNECTIVITY</span><span className="panel-mark">⌁</span></div>
        <div className="metric-number">{online ? "Online" : "Offline"}<span className="metric-unit"> tools</span></div>
        <p>Web access is optional and user-controlled.</p>
        <div className="setting-line"><span className="setting-icon network-icon">↗</span><span><strong>Online search</strong><small>{online ? "Permission enabled in demo" : "Not currently permitted"}</small></span><Toggle checked={online} onChange={setOnline} label="Toggle online tools" /></div>
      </div>
    </section>

    <section className="bottom-grid">
      <div className="recent-panel">
        <div className="panel-heading"><div><span className="eyebrow small">GET STARTED</span><h3>Pick up where you are</h3></div><span className="heading-number">01—03</span></div>
        <button className="start-row" onClick={() => setSection("Assistant")}><span className="start-number">01</span><span className="start-copy"><strong>Ask SENTRA something</strong><small>Explore the assistant interface</small></span><span className="row-arrow">↗</span></button>
        <button className="start-row" onClick={() => setSection("Agents")}><span className="start-number">02</span><span className="start-copy"><strong>Meet your agents</strong><small>See how each specialist contributes</small></span><span className="row-arrow">↗</span></button>
        <button className="start-row" onClick={() => setSection("Memory")}><span className="start-number">03</span><span className="start-copy"><strong>Review local memory</strong><small>Preview your personal knowledge space</small></span><span className="row-arrow">↗</span></button>
      </div>
      <div className="principle-panel">
        <span className="eyebrow small">THE SENTRA PRINCIPLE</span>
        <div className="quote-mark">“</div>
        <blockquote>Powerful assistance.<br /><em>Personal by design.</em></blockquote>
        <p>Your device is home base. The internet is a tool, not a requirement.</p>
        <div className="principle-line"><span /><span /><span /></div>
        <div className="principle-caption">PRIVACY ISN’T A SETTING. IT’S THE FOUNDATION.</div>
      </div>
    </section>
  </>;
}

function Assistant({ messages, input, setInput, sendMessage, voiceEnabled, setVoiceEnabled }: any) {
  return <section className="assistant-layout">
    <div className="chat-panel">
      <div className="chat-header"><div className="assistant-symbol">S<span>.</span></div><div><strong>SENTRA Assistant</strong><small><i /> Frontend preview</small></div><span className="chat-model">LOCAL-FIRST</span></div>
      <div className="chat-body">
        {messages.length === 0 ? <div className="empty-chat"><div className="empty-orbit"><span>S</span></div><h3>Start with a question.</h3><p>Your thoughts stay in this interface. No model is connected in this frontend preview.</p><div className="prompt-suggestions"><button onClick={() => setInput("Help me plan my day")}>Help me plan my day <span>↗</span></button><button onClick={() => setInput("Summarise these notes")}>Summarise some notes <span>↗</span></button><button onClick={() => setInput("Explain a complex idea simply")}>Explain a complex idea <span>↗</span></button></div></div> :
          <div className="message-list">{messages.map((m: Message, i: number) => <div key={i} className={`message ${m.role}`}><div className="message-label">{m.role === "user" ? "YOU" : "SENTRA"}</div><div className="message-bubble">{m.text}</div></div>)}</div>}
      </div>
      <div className="composer"><textarea value={input} onChange={(e) => setInput(e.target.value)} onKeyDown={(e) => { if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); } }} placeholder="Ask anything… (demo only)" rows={2} /><div className="composer-bottom"><span><span className="composer-lock">◇</span> Private preview · No backend connected</span><div className="composer-actions"><button className={`voice-button ${voiceEnabled ? "voice-active" : ""}`} onClick={() => setVoiceEnabled(!voiceEnabled)} title="Toggle voice input preview">◖ <span>{voiceEnabled ? "Voice on" : "Voice"}</span></button><button className="send-button" onClick={sendMessage} aria-label="Send message">↑</button></div></div></div>
    </div>
    <aside className="assistant-aside">
      <div className="aside-block"><span className="eyebrow small">SESSION DETAILS</span><h4>Current session</h4><div className="detail-row"><span>Processing</span><b><i className="detail-dot blue-dot" /> Demo UI</b></div><div className="detail-row"><span>Data location</span><b><i className="detail-dot green-dot" /> This interface</b></div><div className="detail-row"><span>Model status</span><b><i className="detail-dot red-dot" /> Not connected</b></div></div>
      <div className="aside-note"><span className="note-symbol">◇</span><strong>Privacy by design</strong><p>This is a UI prototype. Messages are held in page state and are not sent to an AI service.</p></div>
      <div className="aside-block"><span className="eyebrow small">INPUT MODES</span><div className="input-mode"><span className="mode-symbol">T</span><span><b>Text</b><small>Available in preview</small></span><span className="mode-status">READY</span></div><div className="input-mode"><span className="mode-symbol red">V</span><span><b>Voice</b><small>Visual toggle only</small></span><span className="mode-status muted">DEMO</span></div><div className="input-mode"><span className="mode-symbol violet">G</span><span><b>Gesture</b><small>Planned capability</small></span><span className="mode-status muted">LATER</span></div></div>
    </aside>
  </section>;
}

function Agents() {
  const [selected, setSelected] = useState("Planner");
  return <section className="agents-page"><div className="agents-intro"><div><span className="eyebrow small">COORDINATED INTELLIGENCE</span><h3>Different strengths. One system.</h3><p>Explore the role each agent is designed to play in SENTRA.</p></div><span className="agents-count">04 <small>AGENTS</small></span></div><div className="agent-cards">{agents.map((agent, i) => <button key={agent.name} className={`agent-card ${selected === agent.name ? "selected" : ""}`} onClick={() => setSelected(agent.name)}><div className="agent-card-top"><span className={`agent-code ${agent.color}`}>{agent.code}</span><span className={`agent-status ${agent.status === "Ready" ? "ready" : ""}`}><i />{agent.status}</span></div><span className="agent-order">AGENT / 0{i + 1}</span><h3>{agent.name}</h3><p>{agent.desc}.</p><div className="agent-card-bottom"><span>{selected === agent.name ? "SELECTED" : "VIEW ROLE"}</span><span>↗</span></div></button>)}</div><div className="agent-detail"><div className={`agent-code large ${agents.find(a => a.name === selected)?.color}`}>{agents.find(a => a.name === selected)?.code}</div><div><span className="eyebrow small">SELECTED AGENT</span><h3>{selected}</h3><p>{selected === "Planner" ? "Turns a broad request into a sequence of smaller, understandable tasks before work begins." : selected === "Executor" ? "Carries out the steps prepared by the Planner. In the finished product, this will coordinate with the local model and available tools." : selected === "Critic" ? "Reviews draft outputs for gaps, contradictions, and unsupported claims before the assistant responds." : "Stores useful context in a local knowledge space, with controls for reviewing and clearing saved information."}</p></div><span className="detail-tag">CONCEPT PREVIEW</span></div></section>;
}

function Memory({ notify }: { notify: (message: string) => void }) {
  const [items, setItems] = useState([
    { title: "Response preferences", detail: "Keep answers clear and structured", type: "PREFERENCE" },
    { title: "Current workspace", detail: "SENTRA frontend prototype", type: "PROJECT" },
    { title: "Privacy default", detail: "Prefer local-first processing", type: "PREFERENCE" },
  ]);
  return <section className="memory-page"><div className="memory-banner"><div className="memory-emblem">M<span>.</span></div><div><span className="eyebrow small">LOCAL KNOWLEDGE SPACE</span><h3>Context that works for you.</h3><p>This is sample content to demonstrate the memory management experience. Nothing here is persisted.</p></div><div className="memory-count"><b>{items.length.toString().padStart(2, "0")}</b><span>SAMPLE ITEMS</span></div></div><div className="memory-toolbar"><div><h3>Saved context</h3><p>Review what the assistant could remember.</p></div><button className="button-secondary" onClick={() => { setItems([]); notify("Sample memory cleared"); }}>Clear sample memory</button></div>{items.length ? <div className="memory-list">{items.map((item, i) => <div className="memory-row" key={item.title}><span className="memory-row-number">0{i + 1}</span><div className="memory-row-copy"><strong>{item.title}</strong><span>{item.detail}</span></div><span className="memory-type">{item.type}</span><button className="remove-memory" aria-label={`Remove ${item.title}`} onClick={() => setItems(items.filter((x) => x.title !== item.title))}>×</button></div>)}</div> : <div className="memory-empty"><h3>No sample memories</h3><p>The demo list is empty. Refresh the page to restore it.</p></div>}<div className="memory-disclaimer"><span>◇</span><p><strong>Designed for transparency.</strong> A production version should show where each memory came from and provide clear controls to inspect, edit, and delete it.</p></div></section>;
}

function Settings({ online, setOnline, privateMode, setPrivateMode, voiceEnabled, setVoiceEnabled }: any) {
  return <section className="settings-page"><div className="settings-group"><div className="settings-group-heading"><span className="eyebrow small">PRIVACY & NETWORK</span><h3>Your boundaries come first.</h3><p>These controls update the frontend preview only.</p></div><div className="settings-item"><div className="settings-item-icon">◇</div><div className="settings-item-copy"><strong>Local-first mode</strong><p>Represent a preference to keep processing on your device.</p></div><Toggle checked={privateMode} onChange={setPrivateMode} label="Toggle local-first mode" /></div><div className="settings-item"><div className="settings-item-icon red-icon">↗</div><div className="settings-item-copy"><strong>Allow online tools</strong><p>Enable the online status indicator. No network calls are made.</p></div><Toggle checked={online} onChange={setOnline} label="Toggle online tools" /></div></div><div className="settings-group"><div className="settings-group-heading"><span className="eyebrow small">INPUT PREFERENCES</span><h3>Choose how you interact.</h3><p>Voice and gesture are shown as future capabilities in this prototype.</p></div><div className="settings-item"><div className="settings-item-icon violet-icon">◖</div><div className="settings-item-copy"><strong>Voice input</strong><p>Turn on the voice indicator in the assistant composer.</p></div><Toggle checked={voiceEnabled} onChange={setVoiceEnabled} label="Toggle voice input preview" /></div><div className="settings-item"><div className="settings-item-icon">G</div><div className="settings-item-copy"><strong>Gesture input</strong><p>Gesture controls are not implemented in this frontend.</p></div><span className="coming-soon">COMING LATER</span></div></div><div className="settings-footnote"><span>i</span> Changes are temporary and reset when the page is refreshed.</div></section>;
}

function Toggle({ checked, onChange, label }: { checked: boolean; onChange: (value: boolean) => void; label: string }) {
  return <button role="switch" aria-checked={checked} aria-label={label} className={`toggle ${checked ? "toggle-on" : ""}`} onClick={() => onChange(!checked)}><span /></button>;
}

export default App;
import { ArrowLeft, Camera, Home, Mic, Search, Send, User } from 'lucide-react';
import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import LightRays from '../components/effects/LightRays';
import Navbar from '../components/store/Navbar';
import Footer from '../components/store/Footer';
import { useTheme } from '../context/ThemeContext';
import { mockConversations, type Conversation } from '../lib/mockMessages';

const PANEL =
  'rounded-3xl border border-white/8 bg-white/[0.03] backdrop-blur-xl light:border-black/10 light:bg-white/80 light:shadow-sm';
const ICON_BTN =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-neutral-400 transition-colors hover:border-white/25 light:border-black/10 light:hover:border-black/25';

const Avatar = ({ size = 32 }: { size?: number }) => (
  <span
    style={{ width: size, height: size }}
    className="flex shrink-0 items-center justify-center rounded-full border border-white/10 bg-white/5 text-neutral-400 light:border-black/10 light:bg-black/5"
  >
    <User size={size * 0.45} />
  </span>
);

const lastMessage = (c: Conversation) => c.messages[c.messages.length - 1];

const MessagesPage = () => {
  const { theme } = useTheme();
  const [conversations, setConversations] = useState(mockConversations);
  const [activeId, setActiveId] = useState(mockConversations[0].id);
  const [query, setQuery] = useState('');
  const [draft, setDraft] = useState('');
  const [mobileChat, setMobileChat] = useState(false);
  const endRef = useRef<HTMLDivElement>(null);

  const active = conversations.find((c) => c.id === activeId) ?? conversations[0];

  const visible = useMemo(
    () => conversations.filter((c) => c.name.toLowerCase().includes(query.toLowerCase())),
    [conversations, query],
  );

  useEffect(() => {
    endRef.current?.scrollIntoView({ block: 'end' });
  }, [active.messages.length, activeId]);

  const select = (id: string) => {
    setActiveId(id);
    setMobileChat(true);
    setConversations((list) => list.map((c) => (c.id === id ? { ...c, unread: false } : c)));
  };

  const send = (e: FormEvent) => {
    e.preventDefault();
    const text = draft.trim();
    if (!text) return;
    const time = new Date().toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit' });
    setConversations((list) =>
      list.map((c) =>
        c.id === active.id
          ? { ...c, lastSeen: 'now', messages: [...c.messages, { id: crypto.randomUUID(), fromMe: true, text, time }] }
          : c,
      ),
    );
    setDraft('');
  };

  return (
    <div className="relative min-h-screen bg-black transition-colors light:bg-[#f7f5f0]">
      <div className="pointer-events-none fixed inset-0 h-screen">
        <LightRays raysOrigin="top-center" raysColor="#fff3c4" raysSpeed={0.6} lightSpread={0.7} rayLength={1.8} followMouse mouseInfluence={0.08} fadeDistance={1.1} saturation={0.9} lightMode={theme === 'light'} />
      </div>

      <div className="relative z-10 flex min-h-screen flex-col">
        <Navbar />

        <main className="mx-auto flex w-full max-w-[1700px] flex-1 flex-col gap-6 px-4 py-8 sm:px-6 lg:flex-row lg:px-10">
          <aside className={`${PANEL} ${mobileChat ? 'hidden lg:flex' : 'flex'} h-[75vh] w-full flex-col p-5 lg:h-[70vh] lg:w-80 lg:shrink-0`}>
            <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-neutral-200 light:text-neutral-900">
              Messages
            </h2>
            <label className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 focus-within:border-amber-200/40 light:border-black/10">
              <Search size={14} className="text-neutral-500" />
              <input
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                placeholder="Search contacts"
                className="w-full bg-transparent text-sm text-white placeholder:text-neutral-600 focus:outline-none light:text-neutral-900"
              />
            </label>

            <ul className="mt-3 flex-1 overflow-y-auto">
              {visible.map((c) => {
                const isActive = c.id === active.id;
                return (
                  <li key={c.id} className="border-b border-white/8 last:border-b-0 light:border-black/10">
                    <button
                      type="button"
                      onClick={() => select(c.id)}
                      className={`flex w-full items-start gap-3 rounded-lg px-2 py-3 text-left transition-colors ${
                        isActive ? 'bg-white/5 light:bg-black/5' : 'hover:bg-white/[0.03] light:hover:bg-black/[0.03]'
                      }`}
                    >
                      <span className="relative">
                        <Avatar />
                        {c.unread && <span className="absolute -left-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-300" />}
                      </span>
                      <span className="min-w-0 flex-1">
                        <span className="flex items-center justify-between gap-2">
                          <span className="truncate font-display text-sm text-white light:text-neutral-900">{c.name}</span>
                          <span className="shrink-0 text-xs text-amber-300 light:text-amber-600">{c.lastSeen}</span>
                        </span>
                        <span className="line-clamp-2 text-xs text-neutral-500">{lastMessage(c).text}</span>
                      </span>
                    </button>
                  </li>
                );
              })}
              {visible.length === 0 && <li className="py-6 text-center text-sm text-neutral-500">No contacts found.</li>}
            </ul>
          </aside>

          <section className={`${PANEL} ${mobileChat ? 'flex' : 'hidden lg:flex'} h-[75vh] flex-1 flex-col lg:h-[70vh]`}>
            <header className="flex items-center justify-between border-b border-white/8 px-4 py-4 sm:px-6 light:border-black/10">
              <div className="flex items-center gap-3">
                <button
                  type="button"
                  aria-label="Back to conversations"
                  onClick={() => setMobileChat(false)}
                  className="text-neutral-400 lg:hidden"
                >
                  <ArrowLeft size={18} />
                </button>
                <Avatar size={36} />
                <div>
                  <p className="font-display text-sm font-semibold text-white light:text-neutral-900">{active.name}</p>
                  <p className="text-xs text-neutral-500">{active.subject}</p>
                </div>
              </div>
              {active.garageId && (
                <Link to={`/garage/${active.garageId}`} aria-label="View garage" className="text-neutral-500 transition-colors hover:text-neutral-200 light:hover:text-neutral-900">
                  <Home size={16} />
                </Link>
              )}
            </header>

            <div className="flex flex-1 flex-col gap-4 overflow-y-auto px-4 py-5 sm:px-6">
              {active.messages.map((m) => (
                <div key={m.id} className={`flex flex-col gap-1 ${m.fromMe ? 'items-end' : 'items-start'}`}>
                  <p
                    className={`max-w-[85%] rounded-2xl px-4 py-2.5 text-sm sm:max-w-[75%] ${
                      m.fromMe
                        ? 'bg-white text-black light:bg-neutral-900 light:text-white'
                        : 'bg-white/8 text-neutral-100 light:bg-black/5 light:text-neutral-900'
                    }`}
                  >
                    {m.text}
                  </p>
                  <span className="text-[11px] text-neutral-500">{m.time}</span>
                </div>
              ))}
              <div ref={endRef} />
            </div>

            <form onSubmit={send} className="flex items-center gap-2 border-t border-white/8 px-3 py-3 sm:px-5 sm:py-4 light:border-black/10">
              <button type="button" aria-label="Attach photo" className={ICON_BTN}>
                <Camera size={15} />
              </button>
              <button type="button" aria-label="Voice message" className={ICON_BTN}>
                <Mic size={15} />
              </button>
              <input
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                placeholder="Type a message..."
                className="min-w-0 flex-1 rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-amber-200/40 focus:outline-none light:border-black/10 light:text-neutral-900"
              />
              <button
                type="submit"
                aria-label="Send"
                disabled={!draft.trim()}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-black transition-opacity disabled:opacity-40 light:bg-neutral-900 light:text-white"
              >
                <Send size={15} />
              </button>
            </form>
          </section>
        </main>

        <Footer />
      </div>
    </div>
  );
};

export default MessagesPage;

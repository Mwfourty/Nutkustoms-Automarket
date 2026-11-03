import { ArrowLeft, Camera, Home, Mic, Send } from 'lucide-react';
import { useEffect, useRef, useState, type FormEvent } from 'react';
import { Link } from 'react-router-dom';
import type { Conversation } from '../../lib/mockMessages';
import { Avatar, PANEL } from './shared';

interface ChatThreadProps {
  conversation: Conversation;
  onBack: () => void;
  /** Returns true when the message was sent, so the draft can be cleared. */
  onSend: (text: string) => Promise<boolean>;
  /** Display utilities from the page, e.g. 'flex' or 'hidden lg:flex'. */
  className?: string;
}

const ICON_BTN =
  'flex h-9 w-9 shrink-0 items-center justify-center rounded-lg border border-white/10 text-neutral-400 transition-colors hover:border-white/25 light:border-black/10 light:hover:border-black/25';

const ChatThread = ({ conversation, onBack, onSend, className = 'flex' }: ChatThreadProps) => {
  const [draft, setDraft] = useState('');
  const listRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  
  const [sending, setSending] = useState(false);
  const [sendError, setSendError] = useState<string | null>(null);
  // Scroll the message list itself. scrollIntoView can also scroll the page.
  useEffect(() => {
    const el = listRef.current;
    if (el) el.scrollTop = el.scrollHeight;
  }, [conversation.messages.length]);

  const submit = async (e: FormEvent) => {
  e.preventDefault();

  if (!draft.trim() || sending) return;

  setSending(true);
  setSendError(null);

  try {
    const sent = await onSend(draft);

    if (sent) {
      setDraft('');
      inputRef.current?.focus();
    }
  } catch (err) {
    setSendError(
      err instanceof Error
        ? err.message
        : 'Failed to send message. Please try again.'
    );
  } finally {
    setSending(false);
  }
};

  return (
    <section
      aria-label={`Conversation with ${conversation.name}`}
      className={`${PANEL} ${className} min-h-0 flex-1 flex-col lg:h-[70vh]`}
    >
      <header className="flex shrink-0 items-center justify-between border-b border-white/8 px-4 py-4 sm:px-6 light:border-black/10">
        <div className="flex min-w-0 items-center gap-3">
          <button
            type="button"
            aria-label="Back to conversations"
            onClick={onBack}
            className="text-neutral-400 lg:hidden"
          >
            <ArrowLeft size={18} />
          </button>
          <Avatar size={36} />
          <div className="min-w-0">
            <p className="truncate font-display text-sm font-semibold text-white light:text-neutral-900">
              {conversation.name}
            </p>
            <p className="truncate text-xs text-neutral-500">{conversation.subject}</p>
          </div>
        </div>

        {conversation.garageId && (
          <Link
            to={`/garage/${conversation.garageId}`}
            aria-label="View garage"
            className="text-neutral-500 transition-colors hover:text-neutral-200 light:hover:text-neutral-900"
          >
            <Home size={16} />
          </Link>
        )}
      </header>

      <div
        ref={listRef}
        role="log"
        aria-live="polite"
        className="flex min-h-0 flex-1 flex-col gap-4 overflow-y-auto overscroll-contain px-4 py-5 sm:px-6"
      >
        {conversation.messages.map((m) => (
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
      </div>

      <form
        onSubmit={submit}
        className="flex shrink-0 items-center gap-2 border-t border-white/8 px-3 py-3 sm:px-5 sm:py-4 light:border-black/10"
      >
        <button type="button" aria-label="Attach photo" className={ICON_BTN}>
          <Camera size={15} />
        </button>
        <button type="button" aria-label="Voice message" className={ICON_BTN}>
          <Mic size={15} />
        </button>
        <input
          ref={inputRef}
          value={draft}
          disabled={sending}
          onChange={(e) => setDraft(e.target.value)}
          placeholder="Type a message..."
          aria-label="Message"
          className="min-w-0 flex-1 rounded-xl border border-white/10 bg-transparent px-4 py-2.5 text-sm text-white placeholder:text-neutral-600 focus:border-amber-200/40 focus:outline-none light:border-black/10 light:text-neutral-900"
        />
        <button
          type="submit"
          aria-label="Send"
          disabled={!draft.trim() || sending}
          // Keeps focus in the input so the mobile keyboard stays open after sending.
          onPointerDown={(e) => e.preventDefault()}
          className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-white text-black transition-opacity disabled:opacity-40 light:bg-neutral-900 light:text-white"
        >
          <Send size={15} />
        </button>
      </form>
      {sendError && (
      <p role="alert" className="px-4 pb-3 text-xs text-red-400">
        {sendError}
      </p>
      )}
    </section>
  );
};

export default ChatThread;
import { Search } from 'lucide-react';
import type { Conversation } from '../../lib/mockMessages';
import { Avatar, PANEL } from './shared';

interface ConversationListProps {
  conversations: Conversation[];
  activeId: string;
  query: string;
  onQueryChange: (query: string) => void;
  onSelect: (id: string) => void;
  /** Display utilities from the page, e.g. 'flex' or 'hidden lg:flex'. */
  className?: string;
}

const lastMessage = (c: Conversation) =>
  c.messages[c.messages.length - 1]?.text ??
  c.preview ??
  'No messages yet';

const ConversationList = ({
  conversations,
  activeId,
  query,
  onQueryChange,
  onSelect,
  className = 'flex',
}: ConversationListProps) => (
  <aside
    aria-label="Conversations"
    className={`${PANEL} ${className} min-h-0 w-full flex-1 flex-col p-5 lg:h-[70vh] lg:w-80 lg:flex-none lg:shrink-0`}
  >
    <h2 className="font-display text-xs font-semibold uppercase tracking-widest text-neutral-200 light:text-neutral-900">
      Messages
    </h2>

    <label className="mt-4 flex items-center gap-2 rounded-xl border border-white/10 px-3 py-2 focus-within:border-amber-200/40 light:border-black/10">
      <Search size={14} className="text-neutral-500" />
      <input
        value={query}
        onChange={(e) => onQueryChange(e.target.value)}
        placeholder="Search contacts"
        aria-label="Search contacts"
        className="w-full bg-transparent text-sm text-white placeholder:text-neutral-600 focus:outline-none light:text-neutral-900"
      />
    </label>

    <ul className="mt-3 min-h-0 flex-1 overflow-y-auto">
      {conversations.map((c) => {
        const isActive = c.id === activeId;
        return (
          <li key={c.id} className="border-b border-white/8 last:border-b-0 light:border-black/10">
            <button
              type="button"
              onClick={() => onSelect(c.id)}
              aria-current={isActive ? 'true' : undefined}
              className={`flex w-full items-start gap-3 rounded-lg px-2 py-3 text-left transition-colors ${
                isActive ? 'bg-white/5 light:bg-black/5' : 'hover:bg-white/[0.03] light:hover:bg-black/[0.03]'
              }`}
            >
              <span className="relative">
                <Avatar />
                {c.unread && (
                  <span
                    aria-label="Unread"
                    className="absolute -left-0.5 -top-0.5 h-2 w-2 rounded-full bg-amber-300"
                  />
                )}
              </span>
              <span className="min-w-0 flex-1">
                <span className="flex items-center justify-between gap-2">
                  <span className="truncate font-display text-sm text-white light:text-neutral-900">{c.name}</span>
                  <span className="shrink-0 text-xs text-amber-300 light:text-amber-600">{c.lastSeen}</span>
                </span>
                <span className="line-clamp-2 text-xs text-neutral-500">{lastMessage(c)}</span>
              </span>
            </button>
          </li>
        );
      })}

      {conversations.length === 0 && (
        <li className="py-6 text-center text-sm text-neutral-500">No contacts found.</li>
      )}
    </ul>
  </aside>
);

export default ConversationList;
import { useState } from 'react';
import ChatThread from '../components/messages/ChatThread';
import ConversationList from '../components/messages/ConversationList';
import { useHideTabBar } from '../context/TabBarContext';
import { useConversations } from '../hooks/useConversations';

const MessagesPage = () => {
  const { visible, active, query, setQuery, select, send } = useConversations();

  // Below lg only one pane shows at a time: the list, or the open thread.
  const [threadOpen, setThreadOpen] = useState(false);

  // A thread needs the full screen on mobile, so the bottom tab bar steps aside.
  useHideTabBar(threadOpen);

  const openThread = (id: string) => {
    select(id);
    setThreadOpen(true);
  };

  return (
    <>
        <main
          className={`mx-auto flex min-h-0 w-full max-w-[1700px] flex-1 flex-col gap-6 px-4 pt-2 sm:px-6 md:pb-6 lg:flex-row lg:px-10 lg:py-8 ${
            // Tab bar visible: clear it. Thread open: just respect the home indicator.
            threadOpen ? 'pb-[max(1rem,env(safe-area-inset-bottom))]' : 'pb-28'
          }`}
        >
          <ConversationList
            conversations={visible}
            activeId={active.id}
            query={query}
            onQueryChange={setQuery}
            onSelect={openThread}
            className={threadOpen ? 'hidden lg:flex' : 'flex'}
          />

          <ChatThread
            key={active.id}
            conversation={active}
            onBack={() => setThreadOpen(false)}
            onSend={send}
            className={threadOpen ? 'flex' : 'hidden lg:flex'}
          />
        </main>
    </>
  );
};

export default MessagesPage;
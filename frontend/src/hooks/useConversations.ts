import { useCallback, useEffect, useMemo, useState } from 'react';
import type { ChatMessage, Conversation } from '../lib/mockMessages';

import { getCurrentUser } from '../services/authApi';
import {
  getConversations,
  getConversationMessages,
  sendConversationMessage,
  markConversationAsRead,
} from '../services/messagingApi';

// Temporary empty conversation to keep the UI safe while data loads.
const EMPTY_CONVERSATION: Conversation = {
  id: '',
  name: '',
  subject: '',
  lastSeen: '',
  unread: false,
  messages: [],
};

const formatMessageTime = (date: string) =>
  new Date(date).toLocaleTimeString('en-US', {
    hour: 'numeric',
    minute: '2-digit',
  });

const formatRelativeTime = (date: string) => {
  const timestamp = new Date(date).getTime();

  if (!Number.isFinite(timestamp)) return '';

  const difference = Date.now() - timestamp;
  const minutes = Math.floor(difference / 60000);
  const hours = Math.floor(difference / 3600000);
  const days = Math.floor(difference / 86400000);

  if (minutes < 1) return 'now';
  if (minutes < 60) return `${minutes}m`;
  if (hours < 24) return `${hours}h`;
  if (days === 1) return 'Yesterday';

  return new Date(date).toLocaleDateString('en-ZA', {
    day: 'numeric',
    month: 'short',
  });
};

export const useConversations = () => {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [query, setQuery] = useState('');

  const [currentUserId, setCurrentUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(true);
  const [messagesLoading, setMessagesLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // 1. Load the logged-in user and inbox.
  useEffect(() => {
    let cancelled = false;

    const loadInbox = async () => {
      setLoading(true);
      setError(null);

      try {
        const [user, response] = await Promise.all([
          getCurrentUser(),
          getConversations(1, 20),
        ]);

        if (cancelled) return;

        setCurrentUserId(user.userId);

        const mappedConversations: Conversation[] =
        response.conversations.map((conversation) => ({
          id: conversation.conversationId,
          name: conversation.otherParticipant.username,
          subject: conversation.listing.title,
          lastSeen: formatRelativeTime(conversation.lastMessageAt),
          unread: conversation.unreadCount > 0,
          preview: conversation.latestMessage?.body ?? 'No messages yet',
          messages: [],
        }));

        setConversations(mappedConversations);

        setActiveId((current) =>
          mappedConversations.some((c) => c.id === current)
            ? current
            : mappedConversations[0]?.id ?? null,
        );
      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load conversations.',
          );
        }
      } finally {
        if (!cancelled) setLoading(false);
      }
    };

    void loadInbox();

    return () => {
      cancelled = true;
    };
  }, []);

  // 2. Load messages whenever the active conversation changes.
  useEffect(() => {
    if (!activeId || !currentUserId) return;

    let cancelled = false;

    const loadMessages = async () => {
      setMessagesLoading(true);
      setError(null);

      try {
        const response = await getConversationMessages(
          activeId,
          1,
          50,
        );

        const mappedMessages: ChatMessage[] = response.messages.map(
          (message) => ({
            id: message.id,
            fromMe: message.senderId === currentUserId,
            text: message.body,
            time: formatMessageTime(message.createdAt),
          }),
        );

        if (cancelled) return;

        setConversations((list) =>
          list.map((conversation) =>
            conversation.id === activeId
              ? { ...conversation, messages: mappedMessages }
              : conversation,
          ),
        );

        // Mark incoming messages as read on the backend.
        try {
          await markConversationAsRead(activeId);

          if (!cancelled) {
            setConversations((list) =>
              list.map((conversation) =>
                conversation.id === activeId
                  ? { ...conversation, unread: false }
                  : conversation
              )
            );
          }
        } catch (err) {
          console.error('Failed to mark conversation as read:', err);
        }

      } catch (err) {
        if (!cancelled) {
          setError(
            err instanceof Error
              ? err.message
              : 'Failed to load messages.',
          );
        }
      } finally {
        if (!cancelled) setMessagesLoading(false);
      }
    };

    void loadMessages();

    return () => {
      cancelled = true;
    };
  }, [activeId, currentUserId]);

  // 3. Get the currently selected conversation.
  const active =
    conversations.find((c) => c.id === activeId) ??
    conversations[0] ??
    EMPTY_CONVERSATION;

  // 4. Filter conversations using the search input.
  const visible = useMemo(() => {
    const q = query.trim().toLowerCase();

    return conversations.filter((conversation) =>
      conversation.name.toLowerCase().includes(q),
    );
  }, [conversations, query]);

  // 5. Select a conversation.
  const select = useCallback((id: string) => {
    setActiveId(id);

  }, []);
  
  const send = useCallback(
    async (text: string): Promise<boolean> => {
      const trimmed = text.trim();

      if (!trimmed || !active.id || !currentUserId) {
        return false;
      }

      try {
        // Send the message to the backend.
        const savedMessage = await sendConversationMessage(
          active.id,
          trimmed
        );

        // Map the backend response into our frontend model.
        const message: ChatMessage = {
          id: savedMessage.id,
          fromMe: savedMessage.senderId === currentUserId,
          text: savedMessage.body,
          time: formatMessageTime(savedMessage.createdAt),
        };

        // Update the conversation using the saved message.
        setConversations((list) =>
          list.map((conversation) =>
            conversation.id === active.id
              ? {
                  ...conversation,
                  lastSeen: formatRelativeTime(savedMessage.createdAt),
                  preview: savedMessage.body,
                  messages: [...conversation.messages, message],
                }
              : conversation
          )
        );

        return true;
      } catch (err) {
        console.error('Failed to send message:', err);
        throw err;
      }
    },
    [active.id, currentUserId]
  );

  return {
    visible,
    active,
    query,
    setQuery,
    select,
    send,
    loading,
    messagesLoading,
    error,
  };  
};
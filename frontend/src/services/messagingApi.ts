import { apiRequest } from './apiClient';

// Shared pagination metadata
export interface PaginationMetadata {
  page: number;
  pageSize: number;
  totalCount: number;
  totalPages: number;
  hasNextPage: boolean;
  hasPreviousPage: boolean;
}

// Participant information
export interface ConversationParticipant {
  id: string;
  username: string;
  profileImageUrl: string | null;
}

// Listing information attached to a conversation
export interface ConversationListing {
  id: string;
  title: string;
  price: number;
  status: number;
  primaryImageUrl: string | null;
}

// Message information
export interface Message {
  id: string;
  senderId: string;
  body: string;
  createdAt: string;
  readAt: string | null;
}

// Conversation summary for the inbox
export interface Conversation {
  conversationId: string;
  lastMessageAt: string;
  otherParticipant: ConversationParticipant;
  listing: ConversationListing;
  latestMessage: Message | null;
  unreadCount: number;
}

// API responses
export interface ConversationsPageResponse extends PaginationMetadata {
  conversations: Conversation[];
}

export interface MessagesPageResponse extends PaginationMetadata {
  messages: Message[];
}

// Fetch inbox conversations
export const getConversations = (
  page = 1,
  pageSize = 20
): Promise<ConversationsPageResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  return apiRequest<ConversationsPageResponse>(
    `/Conversations?${params.toString()}`
  );
};

// Fetch messages belonging to a conversation
export const getConversationMessages = (
  conversationId: string,
  page = 1,
  pageSize = 50
): Promise<MessagesPageResponse> => {
  const params = new URLSearchParams({
    page: String(page),
    pageSize: String(pageSize),
  });

  return apiRequest<MessagesPageResponse>(
    `/Conversations/${conversationId}/Messages?${params.toString()}`
  );
};

// Send a message in a conversation
export const sendConversationMessage = (
  conversationId: string,
  body: string
): Promise<Message> => {
  return apiRequest<Message>(
    `/Conversations/${conversationId}/Messages`,
    {
      method: 'POST',
      body: JSON.stringify({ body }),
    }
  );
};

// Mark a conversation as read
export const markConversationAsRead = (
  conversationId: string
): Promise<void> => {
  return apiRequest<void>(
    `/Conversations/${conversationId}/read`,
    {
      method: 'PUT',
    }
  );
};
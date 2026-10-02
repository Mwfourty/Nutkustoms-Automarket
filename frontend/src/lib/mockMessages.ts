export interface ChatMessage {
  id: string;
  fromMe: boolean;
  text: string;
  time: string;
}

export interface Conversation {
  id: string;
  name: string;
  subject: string;
  lastSeen: string;
  unread: boolean;
  garageId?: string;
  messages: ChatMessage[];
}

export const mockConversations: Conversation[] = [
  {
    id: 'alex',
    name: 'Alex Mechanic',
    subject: 'Re: BMW E36 328i',
    lastSeen: '2m',
    unread: true,
    garageId: 'alex-mechanic',
    messages: [
      { id: '1', fromMe: false, text: 'Hi! Is the E36 still available? Would love to see the service records.', time: '9:14 AM' },
      { id: '2', fromMe: true, text: "Yep, still have it. I'll send the full history now.", time: '9:16 AM' },
      { id: '3', fromMe: false, text: 'Sure, still available!', time: '9:21 AM' },
    ],
  },
  {
    id: 'priya',
    name: 'Priya N.',
    subject: 'Re: VW Polo TSI',
    lastSeen: '1h',
    unread: false,
    messages: [
      { id: '1', fromMe: true, text: 'Service book is attached on the listing.', time: '8:02 AM' },
      { id: '2', fromMe: false, text: 'Thanks for the service history', time: '8:40 AM' },
    ],
  },
  {
    id: 'thabo',
    name: 'Thabo M.',
    subject: 'Re: Nissan NP200',
    lastSeen: 'Yesterday',
    unread: false,
    messages: [{ id: '1', fromMe: false, text: 'Can we meet Saturday?', time: 'Yesterday' }],
  },
];

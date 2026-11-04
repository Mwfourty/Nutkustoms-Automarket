import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { startDirectConversation } from '../services/messagingApi';
import { isLoggedIn } from '../services/session';

export function useMessageUser() {
  const navigate = useNavigate();
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState('');

  const message = useCallback(
    async (userId: string) => {
      if (!isLoggedIn()) {
        navigate('/login');
        return;
      }
      setBusy(true);
      setError('');
      try {
        const { conversationId } = await startDirectConversation(userId);
        navigate(`/messages?conversation=${conversationId}`);
      } catch {
        setError('Could not start the conversation.');
      } finally {
        setBusy(false);
      }
    },
    [navigate]
  );

  return { message, busy, error };
}

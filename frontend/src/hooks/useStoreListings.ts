import { useCallback, useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { getAllListings } from '../services/listingsApi';
import {
  getSavedListingIds,
  saveListing,
  toStoreListing,
  unsaveListing,
} from '../services/usersApi';
import { getCurrentUser } from '../services/authApi';
import { isLoggedIn } from '../services/session';
import type { StoreListing } from '../types/listing';

const hasToken = () => isLoggedIn();

export function useStoreListings() {
  const navigate = useNavigate();
  const [listings, setListings] = useState<StoreListing[]>([]);
  const [savedIds, setSavedIds] = useState<Set<string>>(new Set());
  const [userId, setUserId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [notice, setNotice] = useState('');

  useEffect(() => {
    let cancelled = false;

    const load = async () => {
      try {
        const items = await getAllListings();
        if (!cancelled) setListings(items.map(toStoreListing));
      } catch {
        if (!cancelled) setError('Could not load listings. Please try again.');
      } finally {
        if (!cancelled) setLoading(false);
      }

      if (!hasToken()) return;
      try {
        const [ids, me] = await Promise.all([getSavedListingIds(), getCurrentUser()]);
        if (cancelled) return;
        setSavedIds(new Set(ids));
        setUserId(me.userId);
      } catch {
        // Saved state is optional; the browse list still works without it.
      }
    };

    void load();
    return () => {
      cancelled = true;
    };
  }, []);

  const adjustLikes = useCallback((id: string, delta: number) => {
    setListings((current) =>
      current.map((l) =>
        l.id === id ? { ...l, likes: Math.max(0, (l.likes ?? 0) + delta) } : l
      )
    );
  }, []);

  const toggleSave = useCallback(
    async (listing: StoreListing, next: boolean) => {
      if (!hasToken()) {
        navigate('/login');
        return;
      }
      if (userId && listing.sellerId === userId) {
        setNotice("You can't save your own listing.");
        return;
      }

      setNotice('');
      const delta = next ? 1 : -1;
      setSavedIds((current) => {
        const copy = new Set(current);
        if (next) copy.add(listing.id);
        else copy.delete(listing.id);
        return copy;
      });
      adjustLikes(listing.id, delta);

      try {
        if (next) await saveListing(listing.id);
        else await unsaveListing(listing.id);
      } catch {
        setSavedIds((current) => {
          const copy = new Set(current);
          if (next) copy.delete(listing.id);
          else copy.add(listing.id);
          return copy;
        });
        adjustLikes(listing.id, -delta);
        setNotice('Could not update your saved listings.');
      }
    },
    [adjustLikes, navigate, userId]
  );

  return { listings, savedIds, loading, error, notice, toggleSave };
}

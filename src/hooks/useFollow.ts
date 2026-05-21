import { useState, useEffect, useCallback } from 'react';

export interface FollowedChef {
  userId: string;
  username: string;
  followedAt: number;
}

const STORAGE_KEY = 'spoonify_following';

const loadFollowing = (): FollowedChef[] => {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    return saved ? JSON.parse(saved) : [];
  } catch {
    return [];
  }
};

export const useFollow = () => {
  const [following, setFollowing] = useState<FollowedChef[]>(loadFollowing);

  useEffect(() => {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(following));
  }, [following]);

  const follow = useCallback((userId: string, username: string) => {
    setFollowing(prev => {
      if (prev.find(f => f.userId === userId)) return prev;
      return [...prev, { userId, username, followedAt: Date.now() }];
    });
  }, []);

  const unfollow = useCallback((userId: string) => {
    setFollowing(prev => prev.filter(f => f.userId !== userId));
  }, []);

  const isFollowing = useCallback((userId: string) => {
    return following.some(f => f.userId === userId);
  }, [following]);

  return { following, follow, unfollow, isFollowing };
};

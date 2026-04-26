export const getAnonymousUserId = () => {
  let userId = localStorage.getItem('anonymousUserId');
  if (!userId) {
    userId = `anon_${Math.random().toString(36).substr(2, 9)}`;
    localStorage.setItem('anonymousUserId', userId);
  }
  return userId;
};

export const trackUserInteraction = (bookId, interactionType) => {
  const userId = localStorage.getItem('uid') || getAnonymousUserId();
  const interactions = JSON.parse(localStorage.getItem('userInteractions') || '{}');
  
  if (!interactions[userId]) {
    interactions[userId] = {};
  }
  
  if (!interactions[userId][bookId]) {
    interactions[userId][bookId] = { views: 0, likes: 0 };
  }
  
  if (interactionType === 'view') {
    interactions[userId][bookId].views += 1;
  } else if (interactionType === 'like') {
    interactions[userId][bookId].likes += 1;
  }
  
  localStorage.setItem('userInteractions', JSON.stringify(interactions));
};

export const getUserPreferences = () => {
  const userId = localStorage.getItem('uid') || getAnonymousUserId();
  const interactions = JSON.parse(localStorage.getItem('userInteractions') || '{}');
  
  if (!interactions[userId]) {
    return { preferredCategories: [], likedBooks: [] };
  }
  
  const userInteractions = interactions[userId];
  const likedBooks = Object.entries(userInteractions)
    .filter(([_, data]) => data.likes > 0)
    .map(([bookId, _]) => bookId);
    
  return { likedBooks };
};
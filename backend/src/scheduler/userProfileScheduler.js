const User = require('../users/user.model');
const Order = require('../orders/order.model');
const Book = require('../books/book.model');

const DEFAULT_INTERVAL_MINUTES = 60;

const dedupeIds = (ids = []) => {
  const set = new Set(ids.map((id) => String(id)));
  return Array.from(set);
};

const buildCategoryPreferences = async (bookIds = []) => {
  const categories = new Map();
  if (!bookIds.length) return categories;

  const books = await Book.find({ _id: { $in: bookIds } }).select('category').lean();
  books.forEach((book) => {
    const cat = book.category || 'Unknown';
    categories.set(cat, (categories.get(cat) || 0) + 1);
  });
  return categories;
};

const resolveRecommendations = async (user, purchasedIds, likedIds) => {
  const excluded = new Set([
    ...purchasedIds.map(String),
    ...likedIds.map(String),
  ]);

  const categories = user.preferences?.categories || new Map();
  const categoryEntries = Array.from(
    categories.entries ? categories.entries() : Object.entries(categories)
  );
  categoryEntries.sort((a, b) => b[1] - a[1]);
  const topCategories = categoryEntries.slice(0, 3).map(([category]) => category);

  const query = {
    _id: { $nin: Array.from(excluded) },
  };
  if (topCategories.length) {
    query.category = { $in: topCategories };
  }

  const books = await Book.find(query).limit(12).lean();
  return books.map((book) => book._id);
};

const recomputeAllUserProfiles = async () => {
  console.log('[Scheduler] Starting user profile recomputation');
  try {
    const users = await User.find({ role: { $ne: 'admin' } });
    for (const user of users) {
      if (!user.email) {
        console.warn('[Scheduler] Skipping user with missing email:', user._id);
        continue;
      }

      try {
        const orders = await Order.find({ email: user.email, paymentStatus: 'COMPLETE' })
          .select('productIds')
          .lean();
        const purchasedIds = dedupeIds(orders.flatMap((order) => order.productIds || []));
        const likedIds = dedupeIds(user.likedBooks || []);

        const preferenceIds = dedupeIds([...purchasedIds, ...likedIds]);
        const categoryPreferences = await buildCategoryPreferences(preferenceIds);
        const recommendations = await resolveRecommendations(user, purchasedIds, likedIds);

        await User.updateOne(
          { _id: user._id },
          {
            purchasedBooks: purchasedIds,
            preferences: { categories: categoryPreferences },
            recommendations,
          },
          { runValidators: true }
        );
      } catch (userError) {
        console.error('[Scheduler] Failed to update profile for user:', user._id, userError);
      }
    }
    console.log('[Scheduler] User profile recomputation complete');
  } catch (error) {
    console.error('[Scheduler] Failed to recompute user profiles:', error);
  }
};

const startUserProfileScheduler = () => {
  if (process.env.DISABLE_USER_PROFILE_SCHEDULER === 'true') {
    console.log('[Scheduler] User profile scheduler is disabled');
    return;
  }

  const intervalMinutes = Number(process.env.USER_PROFILE_SCHEDULE_MINUTES) || DEFAULT_INTERVAL_MINUTES;
  recomputeAllUserProfiles();
  setInterval(recomputeAllUserProfiles, intervalMinutes * 60 * 1000);
  console.log(`[Scheduler] User profile scheduler started: every ${intervalMinutes} minute(s)`);
};

module.exports = {
  startUserProfileScheduler,
  recomputeAllUserProfiles,
};

import auth from '@react-native-firebase/auth';
import firestore from '@react-native-firebase/firestore';

export const PREMIUM_FEATURES = {
  UNLIMITED_ITEMS: 'unlimited_items',
  SMART_SUGGESTIONS: 'smart_suggestions',
  PRIORITY_SUPPORT: 'priority_support',
  AD_FREE: 'ad_free',
  STYLE_ANALYTICS: 'style_analytics',
  LOOKBOOK_TEMPLATES: 'lookbook_templates',
  EARLY_ACCESS: 'early_access',
  MULTIPLE_PHOTOS: 'multiple_photos',
};

// Free tier limits
export const FREE_TIER_LIMITS = {
  MAX_ITEMS: 20,
  MAX_OUTFITS: 10,
  MAX_LOOKBOOKS: 3,
  MAX_PHOTOS_PER_ITEM: 1,
  SMART_SUGGESTIONS: false,
};

export const checkPremiumStatus = async () => {
  try {
    const user = auth().currentUser;
    if (!user) return false;

    const userDoc = await firestore().collection('users').doc(user.uid).get();
    const userData = userDoc.data();

    if (!userData) return false;

    // Check if user is premium and subscription hasn't expired
    if (userData.isPremium && userData.premiumExpiryDate) {
      const expiryDate = userData.premiumExpiryDate.toDate();
      return expiryDate > new Date();
    }

    return false;
  } catch (error) {
    console.error('Error checking premium status:', error);
    return false;
  }
};

export const isPremiumFeature = featureKey => {
  return Object.values(PREMIUM_FEATURES).includes(featureKey);
};

export const showPremiumModal = navigation => {
  navigation.navigate('SubscriptionIntro');
};

export const checkItemLimit = async () => {
  try {
    const isPremium = await checkPremiumStatus();
    if (isPremium) return true;

    const user = auth().currentUser;
    if (!user) return false;

    const itemsSnapshot = await firestore()
      .collection('users')
      .doc(user.uid)
      .collection('items')
      .get();

    return itemsSnapshot.size < FREE_TIER_LIMITS.MAX_ITEMS;
  } catch (error) {
    console.error('Error checking item limit:', error);
    return false;
  }
};

export const checkOutfitLimit = async () => {
  try {
    const isPremium = await checkPremiumStatus();
    if (isPremium) return true;

    const user = auth().currentUser;
    if (!user) return false;

    const outfitsSnapshot = await firestore()
      .collection('outfits')
      .where('userId', '==', user.uid)
      .get();

    return outfitsSnapshot.size < FREE_TIER_LIMITS.MAX_OUTFITS;
  } catch (error) {
    console.error('Error checking outfit limit:', error);
    return false;
  }
};

export const checkLookbookLimit = async () => {
  try {
    const isPremium = await checkPremiumStatus();
    if (isPremium) return true;

    const user = auth().currentUser;
    if (!user) return false;

    const lookbooksSnapshot = await firestore()
      .collection('lookbooks')
      .where('userId', '==', user.uid)
      .get();

    return lookbooksSnapshot.size < FREE_TIER_LIMITS.MAX_LOOKBOOKS;
  } catch (error) {
    console.error('Error checking lookbook limit:', error);
    return false;
  }
};

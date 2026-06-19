import {Linking, Platform} from 'react-native';

export function buildMailtoUrl({email, subject, body}) {
  const queryParts = [];

  if (subject) {
    queryParts.push(`subject=${encodeURIComponent(subject)}`);
  }
  if (body) {
    queryParts.push(`body=${encodeURIComponent(body)}`);
  }

  const query = queryParts.length > 0 ? `?${queryParts.join('&')}` : '';
  return `mailto:${email}${query}`;
}

export async function openEmail({email, subject, body}) {
  const url = buildMailtoUrl({email, subject, body});

  try {
    await Linking.openURL(url);
    return true;
  } catch (error) {
    if (Platform.OS === 'ios' && (subject || body)) {
      try {
        await Linking.openURL(buildMailtoUrl({email}));
        return true;
      } catch (fallbackError) {
        throw fallbackError;
      }
    }
    throw error;
  }
}

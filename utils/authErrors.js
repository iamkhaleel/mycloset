// Maps Firebase Authentication error codes to plain, actionable messages.
// `auth/invalid-credential` is the code Firebase returns for a wrong email or
// password when email enumeration protection is on, which is the default.
const AUTH_ERROR_MESSAGES = {
  'auth/invalid-credential': 'The email or password is not correct. Please try again.',
  'auth/wrong-password': 'The email or password is not correct. Please try again.',
  'auth/user-not-found': 'The email or password is not correct. Please try again.',
  'auth/invalid-email': 'Please enter a valid email address.',
  'auth/user-disabled': 'This account is disabled. Please contact support.',
  'auth/too-many-requests': 'Too many attempts. Please wait a moment and try again.',
  'auth/network-request-failed':
    'Network error. Please check your connection and try again.',
  'auth/email-already-in-use': 'This email already has an account. Please log in.',
  'auth/weak-password': 'Please use a password with at least 6 characters.',
};

const DEFAULT_AUTH_ERROR_MESSAGE = 'Something went wrong. Please try again.';

// Returns a friendly message for an auth error. Firebase errors carry a `code`,
// so their raw provider text never reaches the user. Errors we throw ourselves
// carry a readable `message` and no `code`, so that message is kept.
export function getAuthErrorMessage(error, fallback = DEFAULT_AUTH_ERROR_MESSAGE) {
  if (error?.code) {
    return AUTH_ERROR_MESSAGES[error.code] || fallback;
  }
  return error?.message || fallback;
}

// True when the error is a known auth failure, such as a wrong password. These
// are expected user mistakes, not crashes, so callers should not log them.
export function isExpectedAuthError(error) {
  return Boolean(error?.code && AUTH_ERROR_MESSAGES[error.code]);
}

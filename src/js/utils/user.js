const USER_EMAIL_KEY = 'user_email';

export const getUserEmail = () => localStorage.getItem(USER_EMAIL_KEY);
export const setUserEmail = (email) => localStorage.setItem(USER_EMAIL_KEY, email);

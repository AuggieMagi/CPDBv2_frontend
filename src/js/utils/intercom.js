import { setUserEmail, getUserEmail } from './user';


export const showIntercomLauncher = show => {
  window.Intercom('update', { 'hide_default_launcher': !show });
};

export const showIntercomMessages = show => {
  window.Intercom(show ? 'show' : 'hide');
};

export const updateIntercomEmail = email => {
  if (getUserEmail() !== email) {
    setUserEmail(email);
    window.Intercom('update', { email });
  }
};

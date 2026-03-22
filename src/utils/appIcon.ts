import elmPhoneIcon from '../assets/ElmPhone.jpeg';
export const APP_ICON = elmPhoneIcon;
export const setAppIcon = () => {
  // Update standard favicon
  let link = document.querySelector("link[rel~='icon']") as HTMLLinkElement;
  if (!link) {
    link = document.createElement('link');
    link.rel = 'icon';
    document.head.appendChild(link);
  }
  link.type = 'image/jpeg';
  link.href = elmPhoneIcon;

  // Update Apple Touch Icon
  let appleLink = document.querySelector("link[rel='apple-touch-icon']") as HTMLLinkElement;
  if (!appleLink) {
    appleLink = document.createElement('link');
    appleLink.rel = 'apple-touch-icon';
    document.head.appendChild(appleLink);
  }
  appleLink.href = elmPhoneIcon;
};

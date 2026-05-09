const butInstall = document.getElementById('buttonInstall');

if (!butInstall) {
  throw new Error('Install button not found in DOM.');
}

butInstall.classList.add('hidden');

window.addEventListener('beforeinstallprompt', (event) => {
  event.preventDefault();
  window.deferredPrompt = event;
  butInstall.classList.remove('hidden');
});

butInstall.addEventListener('click', async () => {
  const promptEvent = window.deferredPrompt;

  if (!promptEvent) {
    return;
  }

  promptEvent.prompt();

  window.deferredPrompt = null;

  butInstall.classList.toggle('hidden', true);
});

window.addEventListener('appinstalled', () => {
  window.deferredPrompt = null;
  butInstall.classList.add('hidden');
});

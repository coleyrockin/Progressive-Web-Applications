import { Workbox } from 'workbox-window';
import Editor from './editor';
import './database';
import '../css/style.css';

const main = document.querySelector('#main');

if (!main) {
  throw new Error('Editor mount point not found');
}

main.innerHTML = '';

const showEditorFallback = (message) => {
  main.innerHTML = `
    <section class="editor-error" role="status" aria-live="polite">
      <p>Unable to load the editor.</p>
      <p>${message}</p>
    </section>
  `;
};

const initEditor = () => {
  try {
    new Editor();
  } catch (error) {
    console.error('Failed to initialize editor', error);
    showEditorFallback(
      'Please check your network connection and refresh, or disable strict browser extensions.'
    );
  }
};

initEditor();

// Check if service workers are supported
if ('serviceWorker' in navigator) {
  // register workbox service worker
  const workboxSW = new Workbox('/src-sw.js');
  workboxSW
    .register()
    .catch((error) => {
      console.error('Service worker registration failed', error);
    });
} else {
  console.warn('Service workers are not supported in this browser.');
}

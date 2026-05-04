import { getDb, putDb } from './database';
import { header } from './header';

export default class {
  constructor() {
    const localData = localStorage.getItem('content');
    const fallbackContent = header.trim();

    // check if CodeMirror is loaded
    if (typeof CodeMirror === 'undefined') {
      throw new Error('CodeMirror is not loaded');
    }

    this.editor = CodeMirror(document.querySelector('#main'), {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    // When the editor is ready, set the value to whatever is store in indexeddb
    getDb()
      .then((data) => {
        this.editor.setValue(data || localData || fallbackContent);
      })
      .catch(() => {
        this.editor.setValue(localData || fallbackContent);
      });

    this.editor.on('change', () => {
      try {
        localStorage.setItem('content', this.editor.getValue());
      } catch (error) {
        console.warn('Unable to persist editor content in localStorage', error);
      }
    });

    // Save the content of the editor when the editor itself is loses focus
    this.editor.on('blur', () => {
      const latestContent = localStorage.getItem('content') || '';
      putDb(latestContent).catch((error) => {
        console.error('Unable to persist editor content in IndexedDB', error);
      });
    });
  }
}

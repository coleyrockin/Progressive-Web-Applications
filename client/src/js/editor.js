import CodeMirror from 'codemirror';
import 'codemirror/lib/codemirror.css';
import 'codemirror/mode/javascript/javascript';
import 'codemirror/theme/monokai.css';
import { getDb, putDb } from './database';
import { header } from './header';

export default class Editor {
  constructor() {
    const localData = localStorage.getItem('content');
    const fallbackContent = header.trim();
    const editorRoot = document.querySelector('#main');

    if (!editorRoot) {
      throw new Error('Editor mount point not found');
    }

    this.editor = CodeMirror(editorRoot, {
      value: '',
      mode: 'javascript',
      theme: 'monokai',
      lineNumbers: true,
      lineWrapping: true,
      autofocus: true,
      indentUnit: 2,
      tabSize: 2,
    });

    this.editor.setSize('100%', '100%');

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

    this.editor.on('blur', () => {
      const latestContent = localStorage.getItem('content') || '';
      putDb(latestContent).catch((error) => {
        console.error('Unable to persist editor content in IndexedDB', error);
      });
    });
  }
}

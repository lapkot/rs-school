let language = localStorage.getItem('language') || 'en';
let isCapsLock = false;
let isShift = false;

const container = document.createElement('container');
container.classList.add('container');
const textareaEl = document.createElement('textarea');
textareaEl.classList.add('text-area');
textareaEl.rows = 7;
textareaEl.autofocus = true;
container.append(textareaEl);
const keyboardContainer = document.createElement('div');
keyboardContainer.classList.add('keyboard');
container.append(keyboardContainer);
const message = document.createElement('p');
message.innerText = 'This keyboard was implemented for Mac OS';
message.innerText += '\nPlease use CTRL (left) + OPTION / ALT (left) combination for changing language';
container.append(message);
// ES6
Object.entries(keyboard).forEach(([key, { title, size, ...rest }]) => {
  const button = document.createElement('button');
  button.innerText = title || rest[language];
  button.style.width = `${60 * size}px`;
  button.style['flex-grow'] = 1;
  button.dataset.key = key;
  keyboardContainer.append(button);
});
document.body.append(container);

const keyboardEl = document.querySelector('.keyboard');

const changeKeyboardView = (lang, caps, shift) => {
  // ES6
  Object.entries(keyboard).forEach(([key, value]) => {
    if (value[lang]) {
      const button = document.querySelector(`[data-key="${key}"]`);
      const buttonText = shift && value.shift && value.shift[lang]
        ? value.shift[lang] : value[lang];
      button.innerText = caps ? buttonText.toUpperCase() : buttonText;
    }
  });
};

const handleServiceButtons = (key) => {
  const textarea = document.querySelector('textarea');
  switch (key) {
    case 'Enter': {
      const cursorStart = textarea.selectionStart;
      const cursorEnd = textarea.selectionEnd;
      const left = textarea.value.slice(0, cursorStart);
      const right = textarea.value.slice(cursorEnd, textarea.value.length);
      textarea.value = `${left}\n${right}`;
      textarea.selectionStart = cursorStart + 1;
      textarea.selectionEnd = cursorStart + 1;
      break;
    }

    case 'Tab': {
      const cursorStart = textarea.selectionStart;
      const cursorEnd = textarea.selectionEnd;
      const left = textarea.value.slice(0, cursorStart);
      const right = textarea.value.slice(cursorEnd, textarea.value.length);
      textarea.value = `${left}    ${right}`;
      textarea.selectionStart = cursorStart + 4;
      textarea.selectionEnd = cursorStart + 4;
      break;
    }

    case 'Backspace': {
      let cursorStart = textarea.selectionStart;
      const cursorEnd = textarea.selectionEnd;
      if (cursorStart === cursorEnd) {
        cursorStart -= 1;
      }
      if (cursorStart < 0) {
        cursorStart = 0;
      }
      const left = textarea.value.slice(0, cursorStart);
      const right = textarea.value.slice(cursorEnd, textarea.value.length);
      textarea.value = left + right;
      textarea.selectionStart = cursorStart;
      textarea.selectionEnd = cursorStart;
      break;
    }

    case 'CapsLock':
      isCapsLock = !isCapsLock;
      if (isCapsLock) {
        changeKeyboardView(language, isCapsLock, isShift);
      } else {
        changeKeyboardView(language, isCapsLock, isShift);
      }
      break;

    default:
      break;
  }
};

const type = (key) => {
  const textarea = document.querySelector('textarea');
  textarea.focus();
  const clickedButton = keyboard[key];
  if (!clickedButton[language]) {
    handleServiceButtons(key);
    return;
  }
  const cursorStart = textarea.selectionStart;
  const cursorEnd = textarea.selectionEnd;
  let left = textarea.value.slice(0, cursorStart);
  const right = textarea.value.slice(cursorEnd, textarea.value.length);
  const isUpperCase = (isShift && !isCapsLock) || (isCapsLock && !isShift);
  const value = isShift && clickedButton.shift && clickedButton.shift[language]
    ? clickedButton.shift[language]
    : clickedButton[language];
  left += isUpperCase ? value.toUpperCase() : value;
  textarea.value = left + right;
  textarea.selectionStart = cursorStart + 1;
  textarea.selectionEnd = cursorStart + 1;
};

const onDown = (key, ctrl, option, meta) => {
  if ((key === 'AltLeft' && ctrl === true)) {
    language = language === 'ru' ? 'en' : 'ru';
    changeKeyboardView(language, isCapsLock, isShift);
    localStorage.setItem('language', language);
  }

  if ((key === 'ControlLeft' && option === true)) {
    language = language === 'ru' ? 'en' : 'ru';
    changeKeyboardView(language, isCapsLock, isShift);
    localStorage.setItem('language', language);
  }

  if (key === 'CapsLock') {
    isCapsLock = !isCapsLock;
    changeKeyboardView(language, isCapsLock, isShift);
  }

  if (key === 'ShiftLeft' || key === 'ShiftRight') {
    isShift = !isShift;
    changeKeyboardView(language, !isCapsLock, isShift);
  }

  const button = document.querySelector(`[data-key="${key}"]`);
  button.classList.add('click-effect-btn');
  button.classList.add('button:active');

  if (!ctrl && !option && !meta) {
    type(key);
  }
};

const onUp = (key) => {
  if (key === 'CapsLock') {
    isCapsLock = !isCapsLock;
    changeKeyboardView(language, isCapsLock, isShift);
    if (isCapsLock === true) {
      return;
    }
  }

  if (key === 'ShiftLeft' || key === 'ShiftRight') {
    isShift = !isShift;
    changeKeyboardView(language, isCapsLock, isShift);
  }

  const button = document.querySelector(`[data-key="${key}"]`);
  button.classList.remove('click-effect-btn');
};

document.addEventListener('mouseup', (event) => {
  const btn = event.target.closest('button');
  if (btn?.dataset?.key) {
    onUp(btn.dataset.key);
  }
});

document.addEventListener('keyup', (event) => {
  const key = event.code;
  onUp(key);
});

keyboardEl.addEventListener('mousedown', (event) => {
  event.preventDefault();
  const btn = event.target.closest('button');
  if (btn?.dataset?.key) {
    onDown(btn.dataset.key, event.ctrlKey, event.altKey, event.metaKey);
  }
});

document.addEventListener('keydown', (event) => {
  event.preventDefault();
  onDown(event.code, event.ctrlKey, event.altKey, event.metaKey);
});

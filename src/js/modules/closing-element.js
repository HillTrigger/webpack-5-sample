const closingElements = document.querySelectorAll('[data-closing-element]');
closingElements.forEach((element) => {
  const btn = element.querySelector('[data-closing-btn]');
  if (btn) {
    btn.addEventListener('click', () => element.classList.add('_hidden'));
  }
});

export const initResetButtons = (mark, callback) => {
  const resetButtons = document.querySelectorAll('[data-reset-btn]');
  resetButtons.forEach((btn) => {
    const input = btn.parentElement.querySelector('input');
    if (input) {
      btn.addEventListener('click', () => {
        input.value = '';
        if (mark) {
          mark.unmark();
        }
        if (callback) {
          callback();
        }
      });
    }
  });
};

initResetButtons();

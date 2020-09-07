/* eslint-disable no-undef */
const checkboxes = document.querySelectorAll('#options .checkbox');

function fillOptions() {
  const options = {};
  checkboxes.forEach((checkbox) => {
    const filter = checkbox.getAttribute('data-filter');
    options[filter] = checkbox.classList.contains('checked');
  });
  return options;
}

function sendMessagesToTabs() {
  chrome.tabs.query({ url: 'https://*.vk.com/*' }, (tabs) => {
    tabs.forEach((tab) => {
      chrome.tabs.sendMessage(tab.id, { action: 'update' });
    });
  });
}

// TODO Перепиши для одного чекбокса, зачем он всех их прогоняет? Если это возможно
function setFilter() {
  const options = fillOptions();
  chrome.storage.sync.set({ options }, sendMessagesToTabs);
}

function getFilter() {
  chrome.storage.sync.get('options', (data) => {
    if (data && data.options) {
      Object.entries(data.options).forEach(([filter, isChosen]) => {
        const checkbox = document.querySelector(`[data-filter=${filter}]`);
        checkbox.classList.toggle('checked', isChosen);
      });
    }
  });
}

function toggleAndSave(event) {
  event.target.classList.toggle('checked');
  setFilter();
}

function initExtension() {
  checkboxes.forEach((checkbox) => checkbox.addEventListener('click', toggleAndSave));
  getFilter();
}

initExtension();

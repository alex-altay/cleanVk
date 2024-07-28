/* eslint-disable no-undef */
const options = {
  feedAds: false,
  groupsAds: false,
  feedReposts: false,
  sidebarAds: false,
  histories: false,
  popularClips: false,
  recommendedFriends: false,
  recommendedGroups: false,
  recommendedNarratives: false,
  recommendedVideos: false,
  groupsReposts: false,
  likesCounter: false,
};

chrome.storage.sync.get('hasBeenBefore', (data) => {
  if (!data || !data.hasBeenBefore) {
    chrome.storage.sync.set({
      hasBeenBefore: true,
      options,
    });
  }
});

function updateTabs(details) {
  if (details.tabId >= 0) {
    chrome.tabs.sendMessage(details.tabId, { action: 'update' }, () => {
      // Simply void Unchecked LastError bug in FF
      // eslint-disable-next-line no-void
      void chrome.runtime.lastError;
    });
  }
}

const filter = { urls: ['https://*.vk.com/*'] };

// Listener for page updating
chrome.webRequest.onCompleted.addListener(updateTabs, filter);

// Listener for opening a new tab or windows
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
  if (tab.url.includes('vk.com') && changeInfo.status === 'complete') {
    chrome.tabs.sendMessage(tabId, { action: 'update' });
  }
});

// Page reloading for first plugin's start
chrome.tabs.query({ url: 'https://*.vk.com/*' }, (tabs) => {
  tabs.forEach((tab) => {
    chrome.tabs.reload(tab.id);
  });
});

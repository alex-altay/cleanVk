/* eslint-disable no-undef */
const singleSelectors = {
  feedAds: '._ads_block_data_w',
  groupsAds: '.ads_ads_news_wrap, ._ads_promoted_post',
  sidebarAds: '#side_bar #ads_left, .apps_feedRightAppsBlock',
  histories: '#stories_feed_wrap',
  popularClips: '.ShortVideoFeedBlock',
  recommendedFriends: '.feed_friends_recomm',
  groupsReposts: '#public_wall .post_copy, #group_wall .post_copy',
  likesCounter: '.like_button_count, ._like_button_count',
};

const wrappedSelectors = {
  feedAds: { selector: '._ads_block_data_w', wrapper: '.feed_row' },
  groupsAds: { selector: '.wall_marked_as_ads, ._ads_promoted_post_data_w', wrapper: '.post' },
  recommendedGroups: { selector: '.feed_groups_recomm', wrapper: '.feed_row' },
  recommendedNarratives: { selector: '.RecommendedNarrativesBlock', wrapper: '.feed_row' },
  feedReposts: { selector: '.post_copy', wrapper: '.feed_row' },
};

function getNodes(filter) {
  let single = [];
  const wrapped = [];
  const singleSelector = singleSelectors[filter];
  const wrappedSelector = wrappedSelectors[filter];
  if (singleSelector) {
    single = document.querySelectorAll(singleSelector);
  }
  if (wrappedSelector) {
    const unwrapped = document.querySelectorAll(wrappedSelector.selector);
    unwrapped.forEach((element) => {
      const garbage = element.closest(wrappedSelector.wrapper);
      if (garbage) {
        wrapped.push(garbage);
      }
    });
  }
  return [...single, ...wrapped];
}

function clean() {
  chrome.storage.sync.get('options', (result) => {
    if (result) {
      Object.entries(result.options).forEach(([filter, isChosen]) => {
        const nodes = getNodes(filter);
        nodes.forEach((node) => node.classList.toggle('hide-garbage', isChosen));
      });
    }
  });
}

chrome.runtime.onMessage.addListener((request) => {
  if (request.action === 'update') {
    clean();
  }
});

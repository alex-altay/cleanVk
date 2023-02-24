/* eslint-disable no-undef */
const singleSelectors = {
  feedAds: '._ads_block_data_w',
  groupsAds: '.ads_ads_news_wrap, ._ads_promoted_post',
  sidebarAds: '#side_bar #ads_left, .apps_feedRightAppsBlock',
  histories: '#stories_feed_wrap',
  popularClips: '.ShortVideoFeedBlock',
  recommendedFriends: '.feed_friends_recomm, .FriendsSuggestionsBlock',
  groupsReposts: '#public_wall .post_copy, #group_wall .post_copy',
  likesCounter: '.like_button_count, ._like_button_count',
};

const wrappedSelectors = {
  feedAds: { selector: '._ads_block_data_w', wrapper: '.feed_row' },
  groupsAds: { selector: '.wall_marked_as_ads, ._ads_promoted_post_data_w, a.PostHeaderSubtitle__item', wrapper: '.post' },
  recommendedGroups: { selector: '.feed_groups_recomm', wrapper: '.feed_row' },
  recommendedNarratives: { selector: '.RecommendedNarrativesBlock', wrapper: '.feed_row' },
  recommendedVideos: { selector: '.FeedVideosForYou', wrapper: '.feed_row' },
  feedReposts: { selector: '.post_copy', wrapper: '.feed_row' },
};

const conditionSelectors = {
  groupsAds: { selector: 'span.PostHeaderSubtitle__item', wrapper: '.post', text: 'Реклама в сообществе' },
};

function getSingleSelectorNodes(filter) {
  const singleSelector = singleSelectors[filter];
  return singleSelector ? document.querySelectorAll(singleSelector) : [];
}

function getWrappedSelectorNodes(filter) {
  const wrapped = [];
  const wrappedSelector = wrappedSelectors[filter];
  if (wrappedSelector) {
    const unwrapped = document.querySelectorAll(wrappedSelector.selector);
    unwrapped.forEach((element) => {
      const garbage = element.closest(wrappedSelector.wrapper);
      if (garbage) {
        wrapped.push(garbage);
      }
    });
  }
  return wrapped;
}

function getConditionSelectorNodes(filter) {
  const condition = [];
  const conditionSelector = conditionSelectors[filter];
  if (conditionSelector) {
    const unwrapped = document.querySelectorAll(conditionSelector.selector);
    unwrapped.forEach((element) => {
      if (element.innerText === conditionSelector.text) {
        const garbage = element.closest(conditionSelector.wrapper);
        if (garbage) {
          condition.push(garbage);
        }
      }
    });
  }
  return condition;
}

function getNodes(filter) {
  const single = getSingleSelectorNodes(filter);
  const wrapped = getWrappedSelectorNodes(filter);
  const condition = getConditionSelectorNodes(filter);
  return [...single, ...wrapped, ...condition];
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

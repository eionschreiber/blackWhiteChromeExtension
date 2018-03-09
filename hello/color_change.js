
function getCurrentTabUrl(callback) {
  var queryInfo = {
    active: true,
    currentWindow: true
  };

  chrome.tabs.query(queryInfo, (tabs) => {
    var tab = tabs[0];
    var url = tab.url;
    console.assert(typeof url == 'string', 'tab.url should be a string');
    callback(url);
  });

}


function changeFilterStyle(filterEffect) {
  var svgURL = chrome.extension.getURL("filters.svg");
  var urlFilter = 'url("' + svgURL + filterEffect + '");';
  var script = "document.body.style.filter='"+ urlFilter +"'";
  console.log(script);
  chrome.tabs.executeScript({
    code: script
  });
}



function getSavedFilterStyle(url, callback) {

  chrome.storage.sync.get(url, (items) => {
    callback(chrome.runtime.lastError ? null : items[url]);
  });
}

function saveFilterStyle(url, filterEffect) {
  var items = {};
  items[url] = filterEffect;
  chrome.storage.sync.set(items);
}

// This extension loads the saved filter effect for the current tab if one
// exists. The user can select a new filter effect from the dropdown for the
// current page, and it will be saved as part of the extension's isolated
// storage.


document.addEventListener('DOMContentLoaded', () => {
  getCurrentTabUrl((url) => {
    var dropdown = document.getElementById('color-blindness');

    // Load the saved filter effect for this page and modify the dropdown
    // value, if needed.
    getSavedFilterStyle(url, (savedEffect) => {
      if (savedEffect) {
        changeFilterStyle(savedEffect);
        dropdown.value = savedEffect;
      }
    });

    // Ensure the filter effect is changed and saved when the dropdown
    // selection changes.
    dropdown.addEventListener('change', () => {
      changeFilterStyle(dropdown.value);
      saveFilterStyle(url, dropdown.value);
    });
  });
});


const searchForm = document.forms[0];

searchForm.onsubmit = sendRequest;

const searchInput = document.querySelector('.search-field input[type="text"]');
searchInput.onfocus = (e) => {
  e.target.value = '';
}

async function sendRequest(e) {
  e.preventDefault();

  clearList();

  const url = new URL(e.target.action);
  const userSearchParams = e.target[0].value;
  url.searchParams.set('q', `${userSearchParams}`);
  url.searchParams.set('per_page', `10`);

  const response = await fetch(url);
  if (!response.ok) showSearchFail();

  const result = await response.json();
  const reposList = result.items;

  if (reposList.length === 0) {
    showSearchFail();
    return;
  };

  renderList(reposList);
}

function renderList(repos) {
  const listNode = document.querySelector('.found-items-list');

  repos.forEach(repo => {
    const itemNode = makeItemNode(repo);
    listNode.append(itemNode);
  });
}

function makeItemNode(repoData) {
  const listItemFragment = document.getElementById('list-item-template').content.cloneNode(true);

  const repoNameNode = listItemFragment.querySelector('.found-item_repoName');
  repoNameNode.textContent = repoData.name;
  repoNameNode.href = repoData.html_url;
  repoNameNode.textContent = repoData.name;

  const field1Node = listItemFragment.querySelector('.field-1');
  field1Node.textContent = repoData.owner.login;

  const field2Node = listItemFragment.querySelector('.field-2');
  field2Node.textContent = repoData.owner.id;

  return listItemFragment;
}

function showSearchFail() {
  const itemsList = document.querySelector('.found-items-list');
  itemsList.classList.add('nothing-found');

  itemsList.textContent = 'Ничего не найдено';
}

function clearList() {
  const itemsList = document.querySelector('.found-items-list');
  itemsList.innerHTML = '';
  itemsList.classList.remove('nothing-found');
}
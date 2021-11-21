import SimpleLightbox from 'simplelightbox';
import 'simplelightbox/dist/simple-lightbox.min.css';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import 'notiflix/dist/notiflix-3.2.2.min.css';
import ApiService from './js/apiService';
import { renderImgCards } from './js/imgCardMurcup';
let lightbox = null;
const searchServise = new ApiService();

const refs = {
  searchForm: document.querySelector('.search-form'),
  searchQuery: document.querySelector('.search-form__input'),
  gallery: document.querySelector('.gallery'),
  loadMore: document.querySelector('.load-more'),
};

refs.searchForm.addEventListener('submit', onSearchInput);
refs.loadMore.addEventListener('click', onLoadContent);
async function onSearchInput(e) {
  e.preventDefault();
  searchServise.resetPage();
  resetMurcup();
  const newQuery = e.target.elements.searchQuery.value.trim();
  searchServise.query = newQuery;
  if (newQuery === '') {
    return;
  }
  onLoadModeBtn();
  const cards = await parceImgCard();
  refs.gallery.insertAdjacentHTML('beforeend', renderImgCards(cards));
  if (!lightbox) {
    lightbox = new SimpleLightbox('.gallery a');
  }
  onMainModeBtn();
}
function parceImgCard() {
  return searchServise
    .getImgCard()
    .then(checkHits)
    .catch(({ message }) => {
      refs.loadMore.classList.add('is-hidden');
      return Notify.failure(message);
    });
}
function checkHits(res) {
  const { data, hasNextPage } = res;
  if (data.hits.length !== 0) {
    return data.hits;
  }
  if (!hasNextPage && data.totalHits > 0) {
    throw Error("We're sorry, but you've reached the end of search results.");
  }
  throw Error('Sorry, there are no images matching your search query. Please try again.');
}
function resetMurcup() {
  refs.gallery.innerHTML = '';
}
async function onLoadContent() {
  const cards = await parceImgCard();
  refs.gallery.insertAdjacentHTML('beforeend', renderImgCards(cards));
  lightbox = new SimpleLightbox('.gallery a');
}
function onLoadModeBtn() {
  refs.loadMore.textContent = 'loading...';
  refs.loadMore.setAttribute('disabled', true);
  refs.loadMore.classList.remove('is-hidden');
}
function onMainModeBtn() {
  refs.loadMore.textContent = 'Load more';
  refs.loadMore.removeAttribute('disabled');
}

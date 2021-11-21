import axios from 'axios';
const BASE_URL = 'https://pixabay.com/api/';
const KEY_API = 'key=24406479-58af1b59940bc123ae2a55678';
const PER_PAGE = 40;
const searchOption = new URLSearchParams({
  image_type: 'photo',
  orientation: 'horizontal',
  safesearch: true,
});

export default class ApiService {
  constructor() {
    this.searchQuery = '';
    this.page = 1;
    this.pageSize = PER_PAGE;
  }

  async getImgCard() {
    const url = `${BASE_URL}?${KEY_API}&q=${this.searchQuery}&per_page=${this.pageSize}&page=${this.page}&${searchOption}`;
    const { data } = await axios.get(url);
    this.incrementPage();

    return {
      data,
      hasNextPage: this.page <= data.totalHits / this.pageSize,
    };
  }

  incrementPage() {
    this.page += 1;
  }

  resetPage() {
    this.page = 1;
  }

  get query() {
    return this.searchQuery;
  }

  set query(newQuery) {
    this.searchQuery = newQuery;
  }
}

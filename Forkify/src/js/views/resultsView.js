import icons from 'url:../../img/icons.svg';

import View from './view';

class ResultsView extends View {
  _parentElement = document.querySelector('.results');
  _errorMessage = 'No recipes found for your query! Please try again';
  _message = '';

  _generateMarkup() {
    return this._data.map(this.#generateMarkupPreview).join('');
  }

  #generateMarkupPreview(data) {
    const id = window.location.hash.slice(1);
    return `
    <li class="preview">
      <a class="preview__link ${
        id === data.id ? 'preview__link--active' : ''
      }" href="#${data.id}">
        <figure class="preview__fig">
          <img src="${data.image}" alt="Test" />
        </figure>
        <div class="preview__data">
          <h4 class="preview__title">${data.title}</h4>
          <p class="preview__publisher">${data.publisher}</p>
          <div class="preview__user-generated">
            <svg>
              <use href="${icons}#icon-user"></use>
            </svg>
          </div>
        </div>
      </a>
    </li>
  `;
  }
}

export default new ResultsView();

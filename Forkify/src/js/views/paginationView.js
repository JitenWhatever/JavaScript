import icons from 'url:../../img/icons.svg';

import View from './view';

class PaginationView extends View {
  _parentElement = document.querySelector('.pagination');

  addHandlerClick(handler) {
    this._parentElement.addEventListener('click', function (event) {
      const btn = event.target.closest('.btn--inline');
      if (!btn) return;
      const goToPage = +btn.dataset.goto;
      handler(goToPage);
    });
  }

  _generateMarkup() {
    const currentPage = this._data.page;
    const totalPages = Math.ceil(
      this._data.results.length / this._data.resultsPerPage
    );

    if (currentPage === 1 && totalPages > 1) {
      return this.#generateNextButton(currentPage);
    }

    if (currentPage === totalPages && totalPages > 1) {
      return this.#generatePreviousButton(currentPage);
    }

    if (currentPage < totalPages) {
      return `${
        this.#generatePreviousButton(currentPage) +
        this.#generateNextButton(currentPage)
      }`;
    }

    return '';
  }

  #generatePreviousButton(currentPage) {
    return `
    <button data-goto="${
      currentPage - 1
    }" class="btn--inline pagination__btn--prev">
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-left"></use>
      </svg>
      <span>Page ${currentPage - 1}</span>
    </button>
  `;
  }

  #generateNextButton(currentPage) {
    return `
    <button data-goto="${
      currentPage + 1
    }" class="btn--inline pagination__btn--next">
      <span>Page ${currentPage + 1}</span>
      <svg class="search__icon">
        <use href="${icons}#icon-arrow-right"></use>
      </svg>
    </button>
  `;
  }
}

export default new PaginationView();

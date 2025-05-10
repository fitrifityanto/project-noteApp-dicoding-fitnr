import {
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
  generateLoaderAbsoluteTemplate,
  generateStoriesListErrorTemplate,
} from "../../templates";
import BookmarkPresenter from "./bookmark-presenter";
import Database from "../../data/database";

export default class BookmarkPage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1 class="section-title">Cerita Tersimpan</h1>

        <div class="stories-bookmark-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new BookmarkPresenter({
      view: this,
      model: Database,
    });
    await this.#presenter.initialBookmark();
  }

  bookmarkedStories(message, stories) {
    if (stories.length <= 0) {
      this.bookmarkedStoriesListEmpty();
      return;
    }

    const html = stories.reduce((acc, story) => {
      return acc.concat(generateStoryItemTemplate(story));
    }, "");

    document.getElementById("stories-list").innerHTML = `
    <div class="stories-bookmark-list">${html}</div>`;
  }

  bookmarkedStoriesListEmpty() {
    document.getElementById("stories-list").innerHTML =
      generateStoriesListEmptyTemplate();
  }

  bookmarkedStoriesError(message) {
    document.getElementById("stories-list").innerHTML =
      generateStoriesListErrorTemplate(message);
  }

  showStoriesListLoading() {
    document.getElementById("stories-list-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideStoriesListLoading() {
    document.getElementById("stories-list-loading-container").innerHTML = "";
  }
}

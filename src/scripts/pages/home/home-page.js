import {
  generateLoaderAbsoluteTemplate,
  generateStoryItemTemplate,
  generateStoriesListEmptyTemplate,
} from "../../templates";
import HomePresenter from "./home-presenter";
import * as StoryAPI from "../../data/api";

export default class HomePage {
  #presenter = null;

  async render() {
    return `
      <section class="container">
        <h1>Home Page</h1>

        <div class="stories-list__container">
          <div id="stories-list"></div>
          <div id="stories-list-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new HomePresenter({
      view: this,
      model: StoryAPI,
    });

    await this.#presenter.initialStory();
  }

  showStoryList(message, stories) {
    if (stories.length <= 0) {
      console.log("stories empty");
      this.storiesListEmpty();
      return;
    }

    const html = stories.reduce((accumulator, story) => {
      return accumulator.concat(generateStoryItemTemplate(story));
    }, "");

    document.getElementById("stories-list").innerHTML = `
    <div class="stories-list">${html}</div>`;
  }

  storiesListEmpty() {
    document.getElementById("stories-list").innerHTML =
      generateStoriesListEmptyTemplate();
  }

  showLoading() {
    document.getElementById("stories-list-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideLoading() {
    document.getElementById("stories-list-loading-container").innerHTML = "";
  }
}

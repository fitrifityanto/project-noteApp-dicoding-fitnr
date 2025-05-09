import { mapStory } from "../../data/api-mapper";

export default class BookmarkPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async initialBookmark() {
    this.#view.showStoriesListLoading();

    try {
      const listOfStories = await this.#model.getAllStories();
      console.log("listOfStories", listOfStories);

      const mappedStories = await Promise.all(listOfStories.map(mapStory));

      const message = "Berhasil mendapatkan cerita tersimpan";
      this.#view.bookmarkedStories(message, mappedStories);
    } catch (error) {
      console.error("initialBookmark: error", error);
      this.#view.bookmarkedStoriesError(error.message);
    } finally {
      this.#view.hideStoriesListLoading();
    }
  }
}

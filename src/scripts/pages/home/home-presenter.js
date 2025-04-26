import { mapStory } from "../../data/api-mapper";

export default class HomePresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async initialStory() {
    this.#view.showLoading();
    try {
      const response = await this.#model.getAllStories();

      if (!response.ok) {
        console.error("initialStory: response:", response);
        return;
      }
      // console.log(response);
      const mappedStories = await Promise.all(response.listStory.map(mapStory));

      console.log(mappedStories);
      this.#view.showStoryList(response.message, mappedStories);
    } catch (error) {
      console.error("initialStory: error:", error);
    } finally {
      this.#view.hideLoading();
    }
  }
}

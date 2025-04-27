import { mapStory } from "../../data/api-mapper";

export default class StoryDetailPresenter {
  #storyId;
  #view;
  #model;

  constructor(storyId, { view, model }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#model = model;
  }

  async showStoryDetail() {
    this.#view.showStoryDetailLoading();
    try {
      const response = await this.#model.getStoryById(this.#storyId);

      if (!response.ok) {
        console.error("showStoryDetail: response:", response);
        this.#view.storyDetailError(response.message);
        return;
      }
      // console.log("getStorybyId", response);
      const story = await mapStory(response.story);
      console.log("story detail result", story);
      this.#view.storyDetailAndInitialMap(response.message, story);
    } catch (error) {
      console.error("showStoryDetail: error:", error);
      this.#view.storyDetailError(error.message);
    }
  }

  async showStoryDetailMap() {
    this.#view.showMapLoading();
    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error("showStoryDetailMap: error", error);
    } finally {
      this.#view.hideMapLoading();
    }
  }
}

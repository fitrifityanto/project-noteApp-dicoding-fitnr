import { mapStory } from "../../data/api-mapper";

export default class StoryDetailPresenter {
  #storyId;
  #view;
  #model;
  #dbmodel;

  constructor(storyId, { view, model, dbmodel }) {
    this.#storyId = storyId;
    this.#view = view;
    this.#model = model;
    this.#dbmodel = dbmodel;
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

  async saveStory() {
    try {
      const storyResponse = await this.#model.getStoryById(this.#storyId);
      console.log("storyResponse", storyResponse);

      if (!storyResponse.ok) {
        throw new Error("gagal mengambil data cerita");
      }

      const story = storyResponse.story;
      if (!story || typeof story !== "object" || !("id" in story)) {
        throw new Error("data cerita tidak valid");
      }
      await this.#dbmodel.putStory(story);

      this.#view.saveToBookmarkSuccessfully("Berhasil menyimpan cerita");
    } catch (error) {
      console.error("saveStory: error", error);
      this.#view.saveToBookmarkFailed(error.message);
    }
  }

  async removeStory() {
    try {
      await this.#dbmodel.removeStory(this.#storyId);

      this.#view.removeFromBookmarkSuccessfully("berhasil menghapus cerita");
    } catch (error) {
      console.error("removeStory: error", error);
      this.#view.removeFromBookmarkFailed(error.message);
    }
  }

  async showSaveButton() {
    if (await this.#isStorySaved()) {
      this.#view.renderRemoveButton();
      return;
    }
    this.#view.renderSaveButton();
  }

  async #isStorySaved() {
    return !!(await this.#dbmodel.getStoryById(this.#storyId));
  }
}

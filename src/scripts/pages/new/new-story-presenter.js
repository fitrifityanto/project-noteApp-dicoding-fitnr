export default class NewStoryPresenter {
  #view;
  #model;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async showNewFormMap() {
    this.#view.showMapLoading();

    try {
      await this.#view.initialMap();
    } catch (error) {
      console.error("showNewFormMap error: ", error);
    } finally {
      this.#view.hideMapLoading();
    }
  }

  async postNewStory({ description, takenPhotos, lat, lon }) {
    this.#view.showSubmitLoadingButton();
    try {
      const data = {
        description: description,
        takenPhotos: takenPhotos,
        lat: lat,
        lon: lon,
      };
      const response = await this.#model.storeNewStory(data);
      // console.log("response", response);
      if (!response.ok) {
        console.error("postNewStory: response:", response);
        this.#view.storeFailed(response.message);
        return;
      }

      this.#view.storeSuccessfully(response.message, response.story);
    } catch (error) {
      console.error("postNewStory: error", error);
      this.#view.storeFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}

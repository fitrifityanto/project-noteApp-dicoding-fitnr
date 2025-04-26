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
      this.#view.showStoryList(response.message, response.listStory);
    } catch (error) {
      console.error("initialStory: error:", error);
    } finally {
      this.#view.hideLoading();
    }
  }
}

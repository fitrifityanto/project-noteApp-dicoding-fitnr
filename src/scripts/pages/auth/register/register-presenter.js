export default class RegisterPresenter {
  #view = null;
  #model = null;

  constructor({ view, model }) {
    this.#view = view;
    this.#model = model;
  }

  async getRegister({ name, email, password }) {
    this.#view.showSubmitLoadingButton();
    try {
      const response = await this.#model.getRegister({
        name,
        email,
        password,
      });
      if (!response.ok) {
        console.error("getRegister: response", response);
        this.#view.registerFailed(response.message);
        return;
      }
      this.#view.registerSuccessfully(response.message);
    } catch (error) {
      console.error("getRegister: error", error);
      this.#view.registerFailed(error.message);
    } finally {
      this.#view.hideSubmitLoadingButton();
    }
  }
}

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
  }
}

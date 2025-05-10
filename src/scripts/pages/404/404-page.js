export default class NotFoundPage {
  async render() {
    return `
      <section class="not-found">
        <h2>404</h2>
        <p>Halaman tidak ditemukan</p>
      </section>
    `;
  }

  async afterRender() {}
}

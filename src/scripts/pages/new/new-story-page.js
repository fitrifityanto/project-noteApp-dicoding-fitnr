import NewStoryPresenter from "./new-story-presenter";
import { convertBase64ToBlob } from "../../utils";
import { generateLoaderAbsoluteTemplate } from "../../templates";
import * as storyAPI from "../../data/api";
import Map from "../../utils/map";
import Camera from "../../utils/camera";

export default class NewStoryPage {
  #presenter;
  #form;
  #camera;
  #isCameraOpen = false;
  #takenPhotos = [];
  #map = null;

  async render() {
    return `
    <section>
      <div class="new-story__header">
        <div class="container">
          <h1 class="new-story__header__title">Buat Cerita Baru</h1>
          <p class="new-story__header__description">
            Silakan lengkapi formulir di bawah untuk membuat cerita baru.
          </p>
        </div>
      </div>
    </section>

    <section class="container">
      <div class="new-form__container">
        <form id="new-form" class="new-form">
          <div class="form-control">
            <label for="description-input" class="new-form__description__title"
              >Deskripsi Cerita</label
            >

            <div class="new-form__description__container">
              <textarea
                id="description-input"
                name="description"
                placeholder="tulis deskripsi cerita disini"
              ></textarea>
            </div>
          </div>
          <div class="form-control">
            <label for="photos-input" class="new-form__photos__title">Foto</label>
            <div id="photos-more-info">
              Foto yang diunggah akan digunakan sebagai gambar cerita.
            </div>

            <div class="new-form__photos__container">
              <div class="new-form__photos__buttons">
                <button
                  id="photos-input-button"
                  class="btn btn-outline"
                  type="button"
                >
                  Ambil Gambar
                </button>
                <input
                  id="photos-input"
                  name="photos"
                  type="file"
                  accept="image/*"
                  multiple
                  hidden="hidden"
                  aria-multiline="true"
                  aria-describedby="photos-more-info"
                />
                <button
                  id="open-photos-camera-button"
                  class="btn btn-outline"
                  type="button"
                >
                  Buka Kamera
                </button>
              </div>
              <div id="camera-container" class="new-form__camera__container">
                <video id="camera-video" class="new-form__camera__video">
                  Video stream not available.
                </video>
                <canvas
                  id="camera-canvas"
                  class="new-form__camera__canvas"
                ></canvas>

                <div class="new-form__camera__tools">
                  <select id="camera-select"></select>
                  <div class="new-form__camera__tools_buttons">
                    <button id="camera-take-button" class="btn" type="button">
                      Ambil Gambar
                    </button>
                  </div>
                </div>
              </div>
              <ul id="photos-taken-list" class="new-form__photos__outputs"></ul>
            </div>
          </div>
          <div class="form-control">
            <div class="new-form__location__title">Lokasi</div>

            <div class="new-form__location__container">
              <div class="new-form__location__map__container">
                <div id="map" class="new-form__location__map"></div>
                <div id="map-loading-container"></div>
              </div>
              <div class="new-form__location__lat-lng">
                <input
                  type="number"
                  name="latitude"
                  value="-6.175389"
                  disabled
                />
                <input
                  type="number"
                  name="longitude"
                  value="106.827139"
                  disabled
                />
              </div>
            </div>
          </div>
          <div class="form-buttons">
            <span id="submit-button-container">
              <button class="button" type="submit">Buat cerita</button>
            </span>
            <a class="button" href="#/">Batal</a>
          </div>
        </form>
      </div>
    </section>
    `;
  }

  async afterRender() {
    this.#presenter = new NewStoryPresenter({
      view: this,
      model: storyAPI,
    });

    this.#takenPhotos = [];
    this.#presenter.showNewFormMap();
    this.#setupForm();
  }

  #setupForm() {
    this.#form = document.getElementById("new-form");
    this.#form.addEventListener("submit", async (event) => {
      event.preventDefault();

      const data = {
        description: this.#form.elements.namedItem("description").value,
        lat: this.#form.elements.namedItem("latitude").value,
        lon: this.#form.elements.namedItem("longitude").value,

        takenPhotos: this.#takenPhotos.map((picture) => picture.blob),
      };
      await this.#presenter.postNewStory(data);
    });

    document
      .getElementById("photos-input")
      .addEventListener("change", async (event) => {
        const insertingPicturesPromises = Object.values(event.target.files).map(
          async (file) => {
            return await this.#addTakenPicture(file);
          },
        );
        await Promise.all(insertingPicturesPromises);

        await this.#takenPictures();
      });

    document
      .getElementById("photos-input-button")
      .addEventListener("click", () => {
        this.#form.elements.namedItem("photos-input").click();
      });

    const cameraContainer = document.getElementById("camera-container");
    document
      .getElementById("open-photos-camera-button")
      .addEventListener("click", async (event) => {
        cameraContainer.classList.toggle("open");
        this.#isCameraOpen = cameraContainer.classList.contains("open");

        if (this.#isCameraOpen) {
          event.currentTarget.textContent = "Tutup kamera";
          this.#setupCamera();
          await this.#camera.launch();

          return;
        }

        event.currentTarget.textContent = "Buka kamera";
        this.#camera.stop();
      });
  }

  async initialMap() {
    this.#map = await Map.build("#map", {
      locate: true,
      zoom: 15,
    });

    const centerCoordinate = this.#map.getCenter();

    this.#updateLatLngInput(
      centerCoordinate.latitude,
      centerCoordinate.longitude,
    );
    const draggableMarker = this.#map.addMarker(
      [centerCoordinate.latitude, centerCoordinate.longitude],
      { draggable: "true" },
    );
    draggableMarker.addEventListener("move", (event) => {
      const coordinate = event.target.getLatLng();
      this.#updateLatLngInput(coordinate.lat, coordinate.lng);
    });

    this.#map.addMapEventListener("click", (event) => {
      draggableMarker.setLatLng(event.latlng);

      // Keep center with user view
      event.sourceTarget.flyTo(event.latlng);
    });
  }

  #updateLatLngInput(latitude, longitude) {
    this.#form.elements.namedItem("latitude").value = latitude;
    this.#form.elements.namedItem("longitude").value = longitude;
  }

  async #addTakenPicture(image) {
    let blob = image;
    if (image instanceof String) {
      blob = await convertBase64ToBlob(image, "image/png");
    }

    const newPhoto = {
      id: `${Date.now()}-${Math.random().toString(36).substring(2, 9)}`,
      blob: blob,
    };
    this.#takenPhotos = [...this.#takenPhotos, newPhoto];
  }

  async #takenPictures() {
    const html = this.#takenPhotos.reduce(
      (accumulator, picture, currentIndex) => {
        const imageUrl = URL.createObjectURL(picture.blob);
        console.log(imageUrl);
        return accumulator.concat(`
        <li class="new-form__photos__outputs-item">
          <button type="button" data-deletepictureid="${picture.id}" class="new-form__photos__outputs-item__delete-btn">
            <img src="${imageUrl}" alt="foto ke-${currentIndex + 1}">
          </button>
        </li>
`);
      },
      "",
    );

    document.getElementById("photos-taken-list").innerHTML = html;

    document
      .querySelectorAll("button[data-deletepictureid]")
      .forEach((button) =>
        button.addEventListener("click", (event) => {
          const pictureId = event.currentTarget.dataset.deletepictureid;
          // console.log("pictureId", pictureId);
          const deleted = this.#removePicture(pictureId);
          if (!deleted) {
            console.log(`picture with id ${pictureId} not found`);
          }

          //updating taken pictures
          this.#takenPictures();
        }),
      );
    console.log("imageUrl", this.#takenPhotos);
  }

  #setupCamera() {
    if (!this.#camera) {
      this.#camera = new Camera({
        video: document.getElementById("camera-video"),
        cameraSelect: document.getElementById("camera-select"),
        canvas: document.getElementById("camera-canvas"),
      });
    }

    this.#camera.addCheeseButtonListener("#camera-take-button", async () => {
      const image = await this.#camera.takePicture();
      await this.#addTakenPicture(image);
      await this.#takenPictures();
    });
  }

  #removePicture(id) {
    const selectedPicture = this.#takenPhotos.find((picture) => {
      return picture.id == id;
    });

    if (!selectedPicture) {
      return null;
    }

    this.#takenPhotos = this.#takenPhotos.filter((picture) => {
      return picture.id != selectedPicture.id;
    });

    return selectedPicture;
  }

  storeSuccessfully(message) {
    console.log(message);
    this.clearForm();

    location.hash = "/";
  }

  storeFailed(message) {
    console.log(message);
  }

  clearForm() {
    this.#form.reset();
  }

  showMapLoading() {
    document.getElementById("map-loading-container").innerHTML =
      generateLoaderAbsoluteTemplate();
  }

  hideMapLoading() {
    document.getElementById("map-loading-container").innerHTML = "";
  }

  showSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
  <button class="btn" type="submit" disabled>
    <i class="fas fa-spinner loader-button"></i> Buat Cerita
  </button>
`;
  }

  hideSubmitLoadingButton() {
    document.getElementById("submit-button-container").innerHTML = `
  <button class="btn" type="submit">Buat Cerita</button>
    `;
  }
}

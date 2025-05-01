import { showFormattedDate, showImageAlt } from "./utils";

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="login-button" href="#/login">Login</a></li>
    <!-- <li><a id="register-button" href="#/register">Register</a></li> -->
  `;
}

export function generateAuthenticatedNavigationListTemplate() {
  return `
  <li><a id="new-story-button" class="btn new-story-button" href="#/new">Buat Cerita <i class="fas fa-plus"></i></a></li>
  <li><a id="logout-button" class="logout-button" href="#/logout"><i class="fas fa-sign-out-alt"></i> Logout</a></li>
  `;
}

export function generateLoaderAbsoluteTemplate() {
  return `
    <div class="loader loader-absolute"></div>
  `;
}

export function generateStoriesListEmptyTemplate() {
  return `
    <div id="stories-list-empty" class="stories-list__empty">
      <h2>Tidak ada story yang tersedia</h2>
      <p>Saat ini, tidak ada story yang dapat ditampilkan.</p>
    </div>
  `;
}

export function generateStoryItemTemplate({
  id,
  name,
  description,
  photoUrl,
  createdAt,
  placeName,
}) {
  return `
        <div tabindex="0" class="story-item" data-storyid="${id}">
      <div class="story-item__body">
        <div class="story-item__main">
          <h2 id="story-name" class="story-name">${name}</h2>
          <div class="story-item__more-info">
            <div class="story-item__location">
              <i class="fas fa-map"></i> ${placeName}
            </div>
          </div>
        </div>
      </div>
      <img class="story-item__image" src="${photoUrl}" alt="${showImageAlt(description)}" />
      <div class="story-item__body">
        <div id="story-description" class="story-item__description">
          ${description}
        </div>
        <div class="story-item__main">
          <div class="story-item__more-info">
            <div class="story-item__createdat">
              <i class="fas fa-calendar-alt"></i>
              ${showFormattedDate(createdAt, "id-ID")}
            </div>
          </div>
        </div>
        <a class="btn story-item__read-more" href="#/story/${id}">
          Selengkapnya <i class="fas fa-arrow-right"></i>
        </a>
      </div>
    </div>
   `;
}

export function generateStoryDetailErrorTemplate(message) {
  return `
  <div id="stories-detail-error" class="stories-detail__error">
      <h2>Terjadi kesalahan pengambilan detail story</h2>
      <p>${message ? message : "periksa jaringan internet Anda"}</p>
    </div>
  `;
}

export function generateStoryDetailTemplate({
  name,
  description,
  photoUrl,
  createdAt,
  lat,
  lon,
  placeName,
}) {
  const createdAtFormatted = showFormattedDate(createdAt, "id-ID");
  // console.log(name, description, photoUrl, createdAt, lat, lon, placeName);
  return `
    <div class="story-detail__header">
      <h2 id="name" class="story-name">${name}</h2>

      <div class="story-detail__more-info">
        <div class="story-detail__more-info__inline">
                <div
            id="location-place-name"
            class="story-detail__location__place-name"
            data-value="${placeName}"
          >
            <i class="fas fa-map"></i> ${placeName}
          </div>
     <div
            id="createdat"
            class="story-detail__createdat"
            data-value="${createdAtFormatted}"
          > ${createdAtFormatted}
</div>
        </div>
      </div>
      <div id="images" class="story-detail__images__container">
        <img class="story-detail__image" src="${photoUrl}" alt="StoryPhoto-${createdAt}" />
      </div>
    </div>
    <div class="story-detail__body__container">
      <div class="story-detail__body">
        <div class="story-detail__body__description__container">
          <h2 class="story-detail__description__title">Deskripsi</h2>
          <div id="description" class="story-detail__description__body">
            ${description}
          </div>
        </div>
        <div class="story-detail__body__map__container">
          <h2 class="story-detail__map__title">Peta Lokasi</h2>
          <div class="story-detail__map__container">
            <div id="map" class="story-detail__map"></div>
            <div id="map-loading-container"></div>
          </div>
          <div class="story-detail__more-info__inline">
            <div
              id="location-latitude"
              class="story-detail__location__latitude"
              data-value="${lat}"
            >
              Latitude: ${lat}
            </div>
            <div
              id="location-longitude"
              class="story-detail__location__longitude"
              data-value="${lon}"
            >
              Longitude: ${lon}
            </div>
          </div>
        </div>
      </div>
    </div> 
  `;
}

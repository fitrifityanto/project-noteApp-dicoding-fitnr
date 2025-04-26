import { showFormattedDate } from "./utils";

export function generateUnauthenticatedNavigationListTemplate() {
  return `
    <li id="push-notification-tools" class="push-notification-tools"></li>
    <li><a id="login-button" href="#/login">Login</a></li>
    <!-- <li><a id="register-button" href="#/register">Register</a></li> -->
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
}) {
  return `

      <div tabindex="0" class="story-item" data-storyid="${id}">
        <img
          class="story-item__image"
          src="${photoUrl}"
          alt=""
        />
        <div class="story-item__body">
          <div class="story-item__main">
            <h2 id="story-name" class="story-name">${name}</h2>
            <div class="story-item__more-info">
              <div class="story-item__createdat">
                <i class="fas fa-calendar-alt"></i>
                ${showFormattedDate(createdAt, "id-ID")}
              </div>
              <div class="story-item__location">
                <i class="fas fa-map"></i> koordinat
              </div>
            </div>
          </div>
          <div id="story-description" class="story-item__description">
            ${description}
          </div>
          <a class="btn story-item__read-more" href="#/story/${id}">
            Selengkapnya <i class="fas fa-arrow-right"></i>
          </a>
        </div>
      </div>
    `;
}

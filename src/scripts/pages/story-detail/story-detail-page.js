import {
  generateStoryDetailErrorTemplate,
  generateStoryDetailTemplate,
} from "../../templates";
import StoryDetailPresenter from "./story-detail-presenter";
import { parseActivePathname } from "../../routes/url-parser";
import * as storyAPI from "../../data/api";

export default class StoryDetailPage {
  #presenter = null;

  async render() {
    return `
      <section>
        <div class="story-detail__container">
          <div id="story-detail" class="story-detail"></div>
          <div id="story-detail-loading-container"></div>
        </div>
      </section>
    `;
  }

  async afterRender() {
    this.#presenter = new StoryDetailPresenter(parseActivePathname().id, {
      view: this,
      model: storyAPI,
    });

    this.#presenter.showStoryDetail();
  }

  async storyDetailAndInitialMap(message, story) {
    document.getElementById("story-detail").innerHTML =
      generateStoryDetailTemplate({
        name: story.name,
        description: story.description,
        photoUrl: story.photoUrl,
        createdAt: story.createdAt,
        lat: story.lat,
        lon: story.lon,
        placeName: story.placeName,
      });
    console.log(story.placeName);
  }

  showStoryDetailLoading() {
    document.getElementById("story-detail-loading-container").innerHTML = "";
  }

  storyDetailError(message) {
    document.getElementById("story-detail").innerHTML =
      generateStoryDetailErrorTemplate(message);
  }
}

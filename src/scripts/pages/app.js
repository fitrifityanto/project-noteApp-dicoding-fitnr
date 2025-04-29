import routes from "../routes/routes";
import {
  getActivePathname,
  getActiveRoute,
  getRoute,
  parseActivePathname,
} from "../routes/url-parser";
import {
  generateUnauthenticatedNavigationListTemplate,
  generateAuthenticatedNavigationListTemplate,
} from "../templates";
import { getAccessToken } from "../utils/auth";
import { setupSkipToContent, transitionHelper } from "../utils";

class App {
  #content = null;
  #currentPath = null;
  #drawerButton = null;

  #navigationDrawer = null;
  #skipToContentButton = null;

  constructor({
    navigationDrawer,
    drawerButton,
    content,
    skipToContentButton,
  }) {
    this.#content = content;
    this.#currentPath = getActivePathname();
    this.#drawerButton = drawerButton;

    this.#navigationDrawer = navigationDrawer;
    this.#skipToContentButton = skipToContentButton;

    this.#init();
  }

  #init() {
    setupSkipToContent(this.#skipToContentButton, this.#content);
    this.#setupDrawer();
  }

  #setupDrawer() {
    this.#drawerButton.addEventListener("click", () => {
      this.#navigationDrawer.classList.toggle("open");
    });

    document.body.addEventListener("click", (event) => {
      if (
        !this.#navigationDrawer.contains(event.target) &&
        !this.#drawerButton.contains(event.target)
      ) {
        this.#navigationDrawer.classList.remove("open");
      }

      this.#navigationDrawer.querySelectorAll("a").forEach((link) => {
        if (link.contains(event.target)) {
          this.#navigationDrawer.classList.remove("open");
        }
      });
    });
  }

  #setupNavigationList() {
    const isLogin = !!getAccessToken();

    const navListMain =
      this.#navigationDrawer.children.namedItem("navlist-main");
    const navList = this.#navigationDrawer.children.namedItem("navlist");

    // User not log in
    if (!isLogin) {
      navListMain.innerHTML = "";
      navList.innerHTML = generateUnauthenticatedNavigationListTemplate();
      return;
    }

    navList.innerHTML = generateAuthenticatedNavigationListTemplate();
  }

  async renderPage() {
    const url = getActiveRoute();
    const route = routes[url];
    // this.#setupNavigationList();

    // get page instance
    const page = route();

    if (!document.startViewTransition) {
      this.#content.innerHTML = await page.render();
      await page.afterRender();
      return;
    }

    const navigationType = this.#getNavigationType();
    let targetThumbnail = null;

    if (navigationType === "list-to-detail") {
      const parsedPathname = parseActivePathname();
      targetThumbnail = document.querySelector(
        `.story-item[data-storyid="${parsedPathname.id}"] .story-item__image`,
      );
      console.log("targetThumbnail", targetThumbnail);
      if (targetThumbnail) {
        targetThumbnail.style.viewTransitionName = "cerita-image";
      }
      console.log("pengguna melakukan navigasi list ke detail");
    }

    const transition = transitionHelper({
      params: {
        navigationType: this.#getNavigationType(),
        currentPath: this.#currentPath,
      },
      updateDOM: async ({ navigationType, currentPath }) => {
        this.#content.innerHTML = await page.render();
        await page.afterRender();

        if (navigationType === "detail-to-list") {
          const parsedPathname = parseActivePathname(currentPath);
          const targetThumbnail = document.querySelector(
            `.story-item[data-storyid="${parsedPathname.id}"] .story-item__image`,
          );
          if (targetThumbnail) {
            targetThumbnail.style.viewTransitionName = "cerita-image";
          }
          console.log("pengguna melakukan navigasi detail ke list");
        }
      },
    });

    // const transition = transitionHelper({
    //   updateDOM: async () => {
    //     this.#content.innerHTML = await page.render();
    //     await page.afterRender();
    //
    //
    //   },
    // });
    //     const transition = document.startViewTransition(async () => {
    //   this.#content.innerHTML = await page.render();
    //   await page.afterRender();
    // });

    //     transition.updateCallbackDone.then(() => {
    //   scrollTo({ top: 0, behavior: 'instant' });
    //   this.#setupNavigationList();
    // });

    transition.ready.catch(console.error);
    transition.updateCallbackDone.then(() => {
      scrollTo({ top: 0, behavior: "instant" });
      this.#setupNavigationList();
    });

    transition.finished.then(() => {
      // this.#setupNavigationList();
      console.log("transition finished");

      this.#currentPath = getActivePathname();

      if (targetThumbnail) {
        targetThumbnail.style.viewTransitionName = "";
      }
    });
  }

  #getNavigationType() {
    const fromRoute = getRoute(this.#currentPath);
    const toRoute = getActiveRoute();

    const storyListPath = ["/"];
    const storyDetailPath = ["/story/:id"];

    if (
      storyListPath.includes(fromRoute) &&
      storyDetailPath.includes(toRoute)
    ) {
      return "list-to-detail";
    }

    if (
      storyDetailPath.includes(fromRoute) &&
      storyListPath.includes(toRoute)
    ) {
      return "detail-to-list";
    }

    return null;
  }
}

export default App;

import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import LoginPage from "../pages/auth/login/login-page";
import {
  checkAuthenticatedRoute,
  checkUnauthenticatedRouteOnly,
} from "../utils/auth";

const routes = {
  "/login": () => checkUnauthenticatedRouteOnly(new LoginPage()),
  "/": () => checkAuthenticatedRoute(new HomePage()),
  "/about": () => checkUnauthenticatedRouteOnly(new AboutPage()),
  // "/stories/:id": () => checkAuthenticatedRoute(new StoryDetailPage()),
};

export default routes;

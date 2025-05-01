import HomePage from "../pages/home/home-page";
import AboutPage from "../pages/about/about-page";
import LoginPage from "../pages/auth/login/login-page";
import RegisterPage from "../pages/auth/register/register-page";
import StoryDetailPage from "../pages/story-detail/story-detail-page";
import NewStoryPage from "../pages/new/new-story-page";
import {
  checkAuthenticatedRoute,
  checkUnauthenticatedRouteOnly,
} from "../utils/auth";

const routes = {
  "/login": () => checkUnauthenticatedRouteOnly(new LoginPage()),
  "/register": () => checkUnauthenticatedRouteOnly(new RegisterPage()),
  "/": () => checkAuthenticatedRoute(new HomePage()),
  "/about": () => checkUnauthenticatedRouteOnly(new AboutPage()),
  "/story/:id": () => checkAuthenticatedRoute(new StoryDetailPage()),
  "/new": () => checkAuthenticatedRoute(new NewStoryPage()),
};

export default routes;

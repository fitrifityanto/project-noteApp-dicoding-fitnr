import CONFIG from "../config";

const { MAP_SERVICE_API_KEY } = CONFIG;

export default class Map {
  #map = null;

  static async getPlaceNameByCoordinate(lat, lng) {
    try {
      const url = new URL(
        `https://api.maptiler.com/geocoding/${lng},${lat}.json`,
      );
      url.searchParams.set("key", MAP_SERVICE_API_KEY);
      url.searchParams.set("language", "id");
      url.searchParams.set("limit", "1");
      const response = await fetch(url);

      if (!response.ok) {
        throw new Error("Unable to fetch place name");
      }

      const data = await response.json();
      console.log("data getPlaceNameByCoordinate", data);
      const rawPlaceName = data.features?.[0]?.place_name ?? `${lat}, ${lng}`;

      // hapus string undefined jika ditemukan pada rawPlaceName
      const placeName = rawPlaceName.replace(/\bundefined\b,?\s*/gi, "").trim();

      // console.log("placeName", placeName);
      return placeName;
    } catch (error) {
      console.error(error);
      return `${lat}, ${lng}`;
    }
  }
}

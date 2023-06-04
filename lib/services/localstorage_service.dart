import 'package:city_break/utils/url_constants.dart';
import 'package:shared_preferences/shared_preferences.dart';

abstract class LocalStorage {
  static SharedPreferences? prefs;

  static Future<void> init() async {
    if (prefs != null) {
      return;
    }

    prefs = await SharedPreferences.getInstance();

    if (prefs!.containsKey("cityId") == false) {
      prefs!.setString("cityId", defaultCityId);
    }
  }

  static void saveWishlist(String wishlist) {
    prefs!.setString("wishlist", wishlist);
  }

  static String? getWishlist() {
    return prefs!.getString("wishlist");
  }

  static void saveCityId(String cityId) {
    prefs!.setString("cityId", cityId);
  }

  static String? getCityId() {
    return prefs!.getString("cityId");
  }
}

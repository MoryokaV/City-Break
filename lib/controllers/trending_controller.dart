import 'dart:convert';
import 'dart:io';
import 'package:city_break/controllers/hotel_controller.dart';
import 'package:city_break/controllers/restaurant_controller.dart';
import 'package:city_break/controllers/sight_controller.dart';
import 'package:http/http.dart' as http;
import 'package:city_break/utils/url_constants.dart';

class TrendingController {
  final SightController sightController = SightController();
  final RestaurantController restaurantController = RestaurantController();
  final HotelController hotelController = HotelController();

  Future<List<Object?>> fetchTrending() async {
    try {
      final response = await http.get(Uri.parse("$apiUrl/fetchTrendingItems"));

      if (response.statusCode == 200) {
        List trending = jsonDecode(response.body);

        List<Object?> data = await Future.wait(
          trending.map((item) {
            switch (item['type']) {
              case "sight":
                return sightController.findSight(item['item_id']);
              case "restaurant":
                return restaurantController.findRestaurant(item['item_id']);
              case "hotel":
                return hotelController.findHotel(item['item_id']);
              default:
                return Future.value(null);
            }
          }),
        );

        return data;
      } else {
        throw HttpException("INTERNAL SERVER ERROR: ${response.statusCode}");
      }
    } on HttpException {
      rethrow;
    }
  }
}

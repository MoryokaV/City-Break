import 'dart:convert';
import 'dart:io';
import 'package:city_break/models/city_model.dart';
import 'package:city_break/services/localstorage_service.dart';
import 'package:city_break/utils/url_constants.dart';
import 'package:http/http.dart' as http;

class CityController {
  Future<List<City>> fetchCities() async {
    try {
      final response = await http.get(Uri.parse("$apiUrl/fetchCities"));

      if (response.statusCode == 200) {
        List data = jsonDecode(response.body);

        return data.map((cityJSON) => City.fromJSON(cityJSON)).toList();
      } else {
        throw HttpException("INTERNAL SERVER ERROR: ${response.statusCode}");
      }
    } on HttpException {
      rethrow;
    }
  }

  Future<String> getCurrentCityName() async {
    try {
      final response = await http.get(Uri.parse("$apiUrl/findCity/${LocalStorage.getCityId()}"));

      if(response.statusCode == 200){
        return City.fromJSON(jsonDecode(response.body)).name;
      } else {
        throw HttpException("INTERNAL SERVER ERROR: ${response.statusCode}");
      }
    } on HttpException {
      return "";
    }
  }
}

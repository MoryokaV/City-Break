import 'dart:convert';
import 'dart:io';
import 'package:http/http.dart' as http;
import 'package:city_break/utils/url_constants.dart';

class AboutController {
  Future<Map<String, dynamic>> fetchAboutData() async {
    try {
      final response = await http.get(Uri.parse("$apiUrl/fetchAboutData$cityIdQuery"));

      if (response.statusCode == 200) {
        Map<String, dynamic> data = jsonDecode(response.body);

        return data;
      } else {
        throw HttpException("INTERNAL SERVER ERROR: ${response.statusCode}");
      }
    } on HttpException {
      rethrow;
    }
  }
}

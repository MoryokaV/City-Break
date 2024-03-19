import 'package:city_break/utils/url_constants.dart';

class Restaurant {
  final String id;
  final String name;
  final List<String> tags;
  final String description;
  final List<String> images;
  final int primaryImage;
  final String primaryImageBlurhash;
  final double latitude;
  final double longitude;
  final String externalLink;

  Restaurant({
    required this.id,
    required this.name,
    required this.tags,
    required this.description,
    required this.images,
    required this.primaryImage,
    required this.primaryImageBlurhash,
    required this.latitude,
    required this.longitude,
    required this.externalLink,
  });

  factory Restaurant.fromJSON(Map<String, dynamic> json) {
    return Restaurant(
      id: json['_id'],
      name: json['name'],
      tags: List<String>.from(json['tags'].map((tag) => tag)),
      description: json['description'],
      images: List<String>.from(json['images'].map((image) => "$baseUrl$image")),
      primaryImage: json['primary_image'],
      primaryImageBlurhash: json['primary_image_blurhash'],
      latitude: json['latitude'].toDouble(),
      longitude: json['longitude'].toDouble(),
      externalLink: json['external_link'],
    );
  }
}

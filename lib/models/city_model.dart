class City {
  final String name;
  final String state;
  final String id;

  City({
    required this.name,
    required this.state,
    required this.id,
  });

  factory City.fromJSON(Map<String, dynamic> json) {
    return City(
      name: json['name'],
      state: json['state'],
      id: json['city_id'],
    );
  }
}

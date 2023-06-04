import 'dart:io';

import 'package:city_break/controllers/city_controller.dart';
import 'package:city_break/models/city_model.dart';
import 'package:city_break/utils/search_all.dart';
import 'package:city_break/utils/style.dart';
import 'package:city_break/widgets/error_dialog.dart';
import 'package:city_break/widgets/search_list_field.dart';
import 'package:flutter/material.dart';

class CitiesView extends StatefulWidget {
  const CitiesView({super.key});

  @override
  State<CitiesView> createState() => _CitiesViewState();
}

class _CitiesViewState extends State<CitiesView> {
  final CityController cityController = CityController();
  bool isLoading = true;
  List<City> cities = [];
  List<City> filteredData = [];

  @override
  void initState() {
    super.initState();

    fetchData();
  }

  void fetchData() async {
    try {
      cities = await cityController.fetchCities();
      filteredData = cities;
    } on HttpException {
      showErrorDialog(context);
    }

    if (mounted) {
      setState(() => isLoading = false);
    }
  }

  void updateList(String query) {
    filteredData = [];

    query.trim().toLowerCase().split(" ").forEach((word) {
      if (word == "") {
        return;
      }

      if (prepositions.contains(word)) {
        return;
      }

      filteredData.addAll(
        cities.where(
          (city) =>
              (city.name
                      .toString()
                      .toLowerCase()
                      .replaceAllMapped(RegExp('[ĂăÂâÎîȘșȚț]'), (m) => diacriticsMapping[m.group(0)] ?? '')
                      .split(" ")
                      .any((entryWord) => entryWord.startsWith(word)) ||
                  city.name.toString().toLowerCase().split(" ").any((entryWord) => entryWord.startsWith(word))) &&
              !filteredData.contains(city),
        ),
      );
    });

    if (query.trim().isEmpty) {
      filteredData.addAll(cities);
    }

    setState(() {});
  }

  @override
  Widget build(BuildContext context) {
    return Scaffold(
      appBar: AppBar(
        automaticallyImplyLeading: false,
        backgroundColor: kBackgroundColor,
        elevation: 0,
        titleSpacing: 0,
        title: Text(
          "Selectează orașul",
          style: Theme.of(context).textTheme.headlineMedium!.copyWith(
                fontWeight: FontWeight.w600,
                fontSize: 20,
              ),
        ),
        leading: IconButton(
          onPressed: () => Navigator.pop(context),
          icon: Icon(
            Icons.adaptive.arrow_back,
            color: kForegroundColor,
          ),
        ),
      ),
      body: SafeArea(
        child: Padding(
          padding: const EdgeInsets.only(
            left: 14,
            right: 14,
            top: 10,
          ),
          child: Column(
            children: [
              SearchListField(
                onChanged: updateList,
              ),
              const SizedBox(
                height: 20,
              ),
            ],
          ),
        ),
      ),
    );
  }
}

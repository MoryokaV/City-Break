import 'package:city_break/services/localstorage_service.dart';
import 'package:firebase_messaging/firebase_messaging.dart';
import 'package:flutter/material.dart';
import 'package:city_break/controllers/event_controller.dart';
import 'package:city_break/models/event_model.dart';
import 'package:city_break/utils/navigation_util.dart';

@pragma('vm:entry-point')
Future<void> _firebaseMessagingBackgroundHandler(RemoteMessage message) async {}

final FirebaseMessaging _firebaseMessaging = FirebaseMessaging.instance;

class MessagingService {
  static init() async {
    RemoteMessage? initialMessage = await _firebaseMessaging.getInitialMessage();

    if (initialMessage != null) {
      WidgetsBinding.instance.addPostFrameCallback((_) {
        handleNotificationData(initialMessage);
      });
    }

    await _firebaseMessaging.requestPermission(
      alert: true,
      announcement: false,
      badge: false,
      carPlay: false,
      criticalAlert: false,
      provisional: false,
      sound: true,
    );

    if (!(await checkNotificationPermission())) {
      return;
    }

    await _firebaseMessaging
        .subscribeToTopic(LocalStorage.getCityId()!)
        .timeout(const Duration(seconds: 3))
        .onError((error, stackTrace) => null);

    FirebaseMessaging.onBackgroundMessage(_firebaseMessagingBackgroundHandler);

    FirebaseMessaging.onMessageOpenedApp.listen((RemoteMessage message) {
      handleNotificationData(message);
    });
  }

  static void handleError() {
    NavigationUtil.navigateTo('/error');
  }

  static void redirect(String route, arguments) {
    NavigationUtil.navigateToWithArguments(route, arguments);
  }

  static void handleNotificationData(RemoteMessage message) async {
    switch (message.data['type']) {
      case 'event':
        String? id = message.data['id'];

        if (id == null) {
          handleError();
          return;
        }

        Event? event = await EventController().findEvent(id);

        if (event == null) {
          handleError();
          return;
        }

        redirect('/event', event);
        break;
      case 'tomorrow_events':
        Navigator.popUntil(NavigationUtil.navigatorKey.currentContext!, (route) => route.isFirst);

        break;
      default:
        return;
    }
  }

  static Future<bool> checkNotificationPermission() async {
    NotificationSettings settings = await _firebaseMessaging.getNotificationSettings();

    if (settings.authorizationStatus == AuthorizationStatus.authorized) {
      return true;
    } else if (settings.authorizationStatus == AuthorizationStatus.provisional) {
      return true;
    } else {
      return false;
    }
  }

  static Future<void> unsubscribeFromCurrentCityTopic() async {
    await _firebaseMessaging.unsubscribeFromTopic(LocalStorage.getCityId()!);
  }

  static Future<void> subscribeToCurrentCityTopic() async {
    await _firebaseMessaging
        .subscribeToTopic(LocalStorage.getCityId()!)
        .timeout(const Duration(seconds: 3))
        .onError((error, stackTrace) => null);
  }
}

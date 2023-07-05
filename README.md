# City Break

<img alt="Social icon" src="https://github.com/MoryokaV/City-Break/assets/55505135/209140b2-4c62-4b49-8cc2-9da71b7e03b83" width="260" height="260">

*Your personal guide for discovering the small communities of Romania* 📍  

This is a fork of the [Visit Brăila](https://github.com/MoryokaV/Visit-Braila) project.

## Mobile App
***City Break*** connects all of the cities of Romania into a single mobile app. The documentation process before any city break trip is drastically simplified by the digitization and centralization of information. Sights, tours, restaurants, hotels and events have a common place to be promoted in. Beside tourists, this app is a great informational channel for history enthusiasts as our country is not valuing the fabulous architecture and historiography. Citizens stay in touch with the latest events running in their city by viewing them in app and getting a daily newsletter. With the contribution of the local authorities we can improve cities around the country with the use of modern technology. 

### Screenshots
![app](https://github.com/MoryokaV/City-Break/assets/55505135/779801a2-328f-4899-bc07-9cae7f8ab06a)
![app 2](https://github.com/MoryokaV/City-Break/assets/55505135/a8462a09-ef18-429f-becd-c11f96712973)


### [Demo video](https://www.youtube.com/watch?v=Uy1fnQCWw5E)

### Features
📲 Cross-platform compatibility: Android & iOS  
✏️ Responsive & Adaptive UI  
🔎 Search system  
💦 Native iOS & Android splash screen  
🌆 Network images caching  
💬 Firebase Cloud Messaging implementation  
🧲 Dynamic Links  
⚠️ Proper error & connectivity handling  
🧭 Real-time gps service  
✨ Blurhash image placeholder  

### Dependencies
- [firebase_core](https://pub.dev/packages/firebase_core), [firebase_dynamic_links](https://pub.dev/packages/firebase_dynamic_links), [firebase_messaging](https://pub.dev/packages/firebase_messaging): link between Firebase services and Flutter app
- [share_plus](https://pub.dev/packages/share_plus): native share popup
- [geolocator](https://pub.dev/packages/geolocator): geolocation api
- [flutter_html](https://pub.dev/packages/flutter_html): html content render
- [provider](https://pub.dev/packages/provider): state management
- [map_launcher](https://pub.dev/packages/map_launcher): maps app launcher at given coordinates
- [photo_view](https://pub.dev/packages/photo_view): gallery helper widget

### Cool stuff
- Adaptive Android app icon
- Rich text descriptions in HTML format
- MVC design pattern 
- Preferred maps app navigation
- Daily events newsletter
- Persistent wishlist items
- Smoothly animated widgets

### Requirements
```
- Android 5.1 or above (API level 22)
- iOS 12.0 or above
- 65Mb free storage space
- Internet connection
- Google Play Services installed (Android users only)
```

## CMS
Admin panel used by app owners to manage database entries. This custom tool is a GUI which helps you update content safely with validation, encryption and no technical skills. The CMS allows managers to keep their apps up-to-date in realtime with no need for consultation.

### Screenshots
![cms](https://github.com/MoryokaV/City-Break/assets/55505135/96b10b3b-e07a-411d-b6b6-91040f23fd43)

### Features
📝 Form validation using regexp  
💾 Real-time optimized server storage information  
🌆 Image file compression on upload  
✨ Pure CSS styles from scratch  
🔒 Encrypted login system with built-in “remember me” option  
⚡️  Blazing fast loading times  
♻️  Cross-browser support  
🖥 Fully responsive desktop-first UI  
🐧 Deployed on Ubuntu 22.04 server

### Dependencies
- [Quill.js](https://github.com/quilljs/quill) - editor for rich text in HTML format
- [Sortable.js](https://github.com/SortableJS/Sortable) - animated draggable list items

### Cool stuff
- Images get deleted automatically when not attached to a db document
- SHA-256 login encryption
- Multi-user support
- Tags get removed from sights automatically when deleted
- Trending - admin’s recommendations
- UI is inspired from [Admin LTE template](https://adminlte.io/)  
- Linux Cron Job for daily notifications
- MongoDB TTL events index for automatically deletion
- SSL certificate
  
## Tech Stack
- Backend:
  - MongoDB
  - Python3 + Flask
  - HTTP server: uWSGI & NGINX
  
- CMS Frontend:
  - HTML & CSS
  - Bootstrap 5
  - JavaScript + jQuery 3.6.0 (AJAX calls, manipulate DOM)
  
- Mobile App
  - Dart
  - Flutter Framework v3.7.12 stable
  - Local Storage API
  - Provider state management
  - Firebase
  - Geolocation API

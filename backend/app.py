#!/usr/bin/env python3

from flask import Flask, render_template, request, redirect, session, make_response, send_from_directory
from flask_session import Session
from functools import wraps
from pymongo import MongoClient
from bson.objectid import ObjectId
import shutil
from PIL import Image
import os
import json
import hashlib
from dateutil import parser
from dateutil.relativedelta import relativedelta
from fcm import sendNewEventNotification
import blurhash
import uuid

app = Flask(__name__)
app.config["MEDIA_FOLDER"] = os.path.join(app.root_path, "static/media")

app.config["SESSION_PERMANENT"] = False
app.config["SESSION_TYPE"] = "filesystem"
app.config["SESSION_COOKIE_SECURE"] = True 
app.config["SESSION_COOKIE_HTTPONLY"] = True 
Session(app)

client = MongoClient(os.getenv("MONGO_URL"))
db = client.citybreak

# --- ICONS --- 

@app.route("/favicon.ico")
def favicon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'favicon.ico')

@app.route("/apple-touch-icon.png")
def apple_touch_icon():
    return send_from_directory(os.path.join(app.root_path, 'static'), 'apple-touch-icon.png')

# --- LOGIN --- 
    
@app.route("/")
def root():
    return redirect("/admin")

def master_login_required(f):
    @wraps(f)
    def checkForMasterUser(*args, **kwargs):
        if session['username'] == "master":
            return f(*args, **kwargs) 
        else:
            return redirect("/login")

    return checkForMasterUser

def admin_login_required(f):
    @wraps(f)
    def checkForAdminUser(*args, **kwargs):
        if session['admin'] == True:
            return f(*args, **kwargs) 
        else:
            return redirect("/login")

    return checkForAdminUser

def admin_or_master_login_required(f):
    @wraps(f)
    def checkForAdminOrMasterUser(*args, **kwargs):
        if session['admin'] == True or session['username'] == "master": 
            return f(*args, **kwargs) 
        else:
            return redirect("/login")

    return checkForAdminOrMasterUser

def login_required(f):
    @wraps(f)
    def checkLoginStatus(*args, **kwargs):
        if session.get("logged_in"):
            return f(*args, **kwargs)
        else:
            return redirect("/login")

    return checkLoginStatus 

@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "GET":
        return render_template("login.html")

    username = request.json['user']
    password = hashlib.sha256(request.json["pass"].encode('utf-8')).hexdigest()

    user = db.login.find_one({"username": username, "password": password}) 

    if user is not None:
        session['logged_in'] = True 
        session['username'] = username
        session['fullname'] = user['fullname']
        session['admin'] = user['admin']

        if username == "master":
            return make_response(json.dumps({"url": "/master"}), 200)

        session['city_id'] = user['city_id']
        session['city_name'] = db.cities.find_one({"city_id": user['city_id']})['name']

        res = make_response(json.dumps({"url": "/admin"}), 200)
        res.set_cookie("cityId", user['city_id'])

        return res
    else:
        return make_response("Wrong user or password!", 401)

@app.route("/logout")
def logout():
    session.clear()
        
    return redirect("/login")

@app.route("/api/currentUser")
def getCurrentUserFullname():
    return make_response(json.dumps({"fullname": session['fullname'], "is_admin": session['admin']}), 200)    

# --- CMS ROUTES --- 

@app.route("/master")
@login_required
@master_login_required
def master():
    return render_template("master.html")

@app.route("/users")
@login_required
@admin_login_required
def users():
    return render_template("users.html")

@app.route("/admin")
@login_required
def index():
    return render_template("index.html") 

@app.route("/admin/tags")
@login_required
def tags():
    return render_template("tags.html")

@app.route("/admin/sights")
@login_required
def sights():
    return render_template("sights.html")

@app.route("/admin/tours")
@login_required
def tours():
    return render_template("tours.html")

@app.route("/admin/restaurants")
@login_required
def restarants():
    return render_template("restaurants.html")

@app.route("/admin/hotels")
@login_required
def hotels():
    return render_template("hotels.html")

@app.route("/admin/events")
@login_required
def events():
    return render_template("events.html")

@app.route("/admin/trending")
@login_required
def trending():
    return render_template("trending.html")

@app.route("/admin/about")
@login_required
def about():
    return render_template("about.html")

# --- CITES ---

@app.route("/api/currentCityName")
@login_required
def currentCityName():
    return json.dumps({"name": session['city_name']}, default=str)

@app.route("/api/fetchAdminUsers")
@login_required
@master_login_required
def fetchAdminUsers():
    return json.dumps(list(db.login.find({"admin": True})), default=str)

@app.route("/api/fetchCities")
def fetchCities():
    return json.dumps(list(db.cities.find()), default=str)

@app.route("/api/insertCity", methods=["POST"])
@login_required
@master_login_required
def insertCity():
    city = request.get_json()
    city_id = uuid.uuid4().hex
    
    db.cities.insert_one({"name": city['name'], "state": city['state'], "city_id": city_id}) 
    db.login.insert_one({"fullname": city['fullname'], "username": city['username'], "password": hashlib.sha256(city['password'].encode("utf-8")).hexdigest(), "city_id": city_id, "admin": True})
    db.about.insert_one({"paragraph1": "", "phone": "", "email": "", "cover_image": "", "organization": "", "website": "", "facebook": "", "cover_image_blurhash": "", "heading1": "", "header_image": "", "header_title": "", "city_id": city_id})
   
    createMediaDirectories(city_id)
    
    return make_response("New entry has been inserted", 200)

@app.route("/api/findCity/<id>")
def findCity(id):
    return json.dumps(db.cities.find_one({"city_id": id}), default=str) 

@app.route("/api/deleteCity/<id>", methods=["DELETE"])
@login_required
@master_login_required
def deleteCity(id):
    db.sights.delete_many({"city_id": id})
    db.tours.delete_many({"city_id": id})
    db.restaurants.delete_many({"city_id": id})
    db.hotels.delete_many({"city_id": id})
    db.events.delete_many({"city_id": id})
    db.tags.delete_many({"city_id": id})
    db.trending.delete_many({"city_id": id})
    db.about.delete_one({"city_id": id})
    db.login.delete_many({"city_id": id})
    db.cities.delete_one({"city_id": id})

    deleteMediaDirectories(id)

    return make_response("Successfully deleted document", 200)

# --- USERS --- 

@app.route("/api/insertUser", methods=["POST"])
@login_required
@admin_login_required
def insertUser():
    user = request.get_json()
    user['password'] = hashlib.sha256(user['password'].encode("utf-8")).hexdigest()
    user['admin'] = False
    user['city_id'] = session['city_id']

    db.login.insert_one(user)
    
    return make_response("New entry has been inserted", 200)

@app.route("/api/fetchUsers")
@login_required
def fetchUsers():
    return json.dumps(list(db.login.find({"city_id": session['city_id']})), default=str)

@app.route("/api/deleteUser/<_id>", methods=["DELETE"])
@login_required
def deleteUser(_id):
    db.login.delete_one({"_id": ObjectId(_id)})

    return make_response("Successfully deleted document", 200)

@app.route("/api/editUserPassword/<_id>", methods=["PUT"])
@login_required
@admin_or_master_login_required
def editUserPassword(_id):
    data = request.get_json()

    db.login.update_one({"_id": ObjectId(_id)}, {"$set": {"password": hashlib.sha256(data['new_password'].encode('utf-8')).hexdigest()}})

    return make_response("Entry has been updated", 200)

# --- SIGHTS ---  

@app.route("/api/insertSight", methods=["POST"])
@login_required
def insertSight():
    sight = request.get_json()

    sight['latitude'] = float(sight['latitude'])
    sight['longitude'] = float(sight['longitude'])
    sight['primary_image_blurhash'] = getBlurhash(sight['images'][sight['primary_image'] - 1])
    sight['city_id'] = session['city_id']

    db.sights.insert_one(sight)
    
    return make_response("New entry has been inserted", 200)

@app.route("/api/fetchSights")
def fetchSights():
    city_id = request.args.get("city_id", default="",  type=str)

    return json.dumps(list(db.sights.find({"city_id": city_id})), default=str)

@app.route("/api/deleteSight/<_id>", methods=["DELETE"])
@login_required
def deleteSight(_id):
    # delete local sight images first
    images = json.loads(findSight(_id))['images']
    deleteImages(images, 'sights')

    filterTrendingByItemId(_id)

    # delete sight
    db.sights.delete_one({"_id": ObjectId(_id)})

    return make_response("Successfully deleted document", 200)

@app.route("/api/findSight/<_id>")
def findSight(_id):
    sight = db.sights.find_one({"_id": ObjectId(_id)})

    if sight is None:
        return make_response("Invalid sight id", 404)

    return json.dumps(sight, default=str)

@app.route("/api/editSight", methods=["PUT"])
@login_required
def editSight():
    data = request.get_json()

    deleteImages(data['images_to_delete'], 'sights')

    sight = data['sight']
    sight['latitude'] = float(sight['latitude'])
    sight['longitude'] = float(sight['longitude'])
    sight['primary_image_blurhash'] = getBlurhash(sight['images'][sight['primary_image'] - 1])

    db.sights.update_one({"_id": ObjectId(data['_id'])}, {"$set": sight})

    return make_response("Entry has been updated", 200)

# --- TOURS ---  

@app.route("/api/insertTour", methods=["POST"])
@login_required
def insertTour():
    tour = request.get_json()

    tour['length'] = float(tour['length'])
    tour['city_id'] = session['city_id']
    
    db.tours.insert_one(tour)

    return make_response("New entry has been inserted", 200) 

@app.route("/api/fetchTours")
def fetchTours():
    city_id = request.args.get("city_id", default="",  type=str)

    return json.dumps(list(db.tours.find({"city_id": city_id})), default=str)

@app.route("/api/deleteTour/<_id>", methods=["DELETE"])
@login_required
def deleteTour(_id):
    # delete local tour images first
    images = json.loads(findTour(_id))['images']
    deleteImages(images, 'tours')

    db.tours.delete_one({"_id": ObjectId(_id)})

    return make_response("Successfully deleted document", 200)

@app.route("/api/findTour/<_id>")
def findTour(_id):
    tour = db.tours.find_one({"_id": ObjectId(_id)})

    if tour is None:
        return make_response("Invalid tour id", 404)

    return json.dumps(tour, default=str)

@app.route("/api/editTour", methods=["PUT"])
@login_required
def editTour():
    data = request.get_json()

    deleteImages(data['images_to_delete'], 'tours')

    tour = data['tour'] 
    tour['length'] = float(tour['length'])

    db.tours.update_one({"_id": ObjectId(data['_id'])}, {"$set": tour})

    return make_response("Entry has been updated", 200)

# --- RESTAURANTS ---  

@app.route("/api/insertRestaurant", methods=["POST"])
@login_required
def insertRestaurant():
    restaurant = request.get_json()

    restaurant['latitude'] = float(restaurant['latitude'])
    restaurant['longitude'] = float(restaurant['longitude'])
    restaurant['primary_image_blurhash'] = getBlurhash(restaurant['images'][restaurant['primary_image'] - 1])
    restaurant['city_id'] = session['city_id']

    db.restaurants.insert_one(restaurant)
    
    return make_response("New entry has been inserted", 200)

@app.route("/api/fetchRestaurants")
def fetchRestaurants():
    city_id = request.args.get("city_id", default="",  type=str)

    return json.dumps(list(db.restaurants.find({"city_id": city_id})), default=str)

@app.route("/api/deleteRestaurant/<_id>", methods=["DELETE"])
@login_required
def deleteRestaurant(_id):
    # delete local restaurant images first
    images = json.loads(findRestaurant(_id))['images']
    deleteImages(images, 'restaurants')

    filterTrendingByItemId(_id)

    # delete restaurant
    db.restaurants.delete_one({"_id": ObjectId(_id)})

    return make_response("Successfully deleted document", 200)

@app.route("/api/findRestaurant/<_id>")
def findRestaurant(_id):
    restaurant = db.restaurants.find_one({"_id": ObjectId(_id)})

    if restaurant is None:
        return make_response("Invalid restaurant id", 404)

    return json.dumps(restaurant, default=str)

@app.route("/api/editRestaurant", methods=["PUT"])
@login_required
def editRestaurant():
    data = request.get_json()

    deleteImages(data['images_to_delete'], 'restaurants')

    restaurant = data['restaurant']
    restaurant['latitude'] = float(restaurant['latitude'])
    restaurant['longitude'] = float(restaurant['longitude'])
    restaurant['primary_image_blurhash'] = getBlurhash(restaurant['images'][restaurant['primary_image'] - 1])

    db.restaurants.update_one({"_id": ObjectId(data['_id'])}, {"$set": restaurant})

    return make_response("Entry has been updated", 200)

# --- HOTELS ---  

@app.route("/api/insertHotel", methods=["POST"])
@login_required
def insertHotel():
    hotel = request.get_json()

    hotel['latitude'] = float(hotel['latitude'])
    hotel['longitude'] = float(hotel['longitude'])
    hotel['city_id'] = session['city_id']

    db.hotels.insert_one(hotel)
    
    return make_response("New entry has been inserted", 200)

@app.route("/api/fetchHotels")
def fetchHotels():
    city_id = request.args.get("city_id", default="", type=str)

    return json.dumps(list(db.hotels.find({"city_id": city_id})), default=str)

@app.route("/api/deleteHotel/<_id>", methods=["DELETE"])
@login_required
def deleteHotel(_id):
    # delete local hotel images first
    images = json.loads(findHotel(_id))['images']
    deleteImages(images, 'hotels')

    filterTrendingByItemId(_id)

    # delete hotel
    db.hotels.delete_one({"_id": ObjectId(_id)})

    return make_response("Successfully deleted document", 200)

@app.route("/api/findHotel/<_id>")
def findHotel(_id):
    hotel = db.hotels.find_one({"_id": ObjectId(_id)})

    if hotel is None:
        return make_response("Invalid hotel id", 404)

    return json.dumps(hotel, default=str)

@app.route("/api/editHotel", methods=["PUT"])
@login_required
def editHotel():
    data = request.get_json()

    deleteImages(data['images_to_delete'], 'hotels')

    hotel = data['hotel']
    hotel['latitude'] = float(hotel['latitude'])
    hotel['longitude'] = float(hotel['longitude'])

    db.hotels.update_one({"_id": ObjectId(data['_id'])}, {"$set": hotel})

    return make_response("Entry has been updated", 200)

# --- EVENTS ---  

@app.route("/api/insertEvent", methods=["POST"])
@login_required
def insertEvent():
    data = request.get_json()

    event = data['event']

    date_time = parser.isoparse(event['date_time'])
    end_date_time = None
    expire_at = date_time + relativedelta(days=+1)

    try:
        end_date_time = parser.isoparse(event['end_date_time'])
        expire_at = end_date_time + relativedelta(days =+ 1) 
    except KeyError:
        pass

    event['date_time'] = date_time
    event['end_date_time'] = end_date_time
    event['expire_at'] = expire_at
    event['primary_image_blurhash'] = getBlurhash(event['images'][event['primary_image'] - 1])
    event['city_id'] = session['city_id']
        
    record = db.events.insert_one(event)
    
    cleanUpEventsImages()
    
    if data['notify'] == True:
        sendNewEventNotification(event['name'], record.inserted_id)

    return make_response("New entry has been inserted", 200) 

@app.route("/api/fetchEvents")
def fetchEvents():
    city_id = request.args.get("city_id", default="", type=str)

    return json.dumps(list(db.events.find({"city_id": city_id}).sort("date_time", 1)), default=str)

@app.route("/api/deleteEvent/<_id>", methods=["DELETE"])
@login_required
def deleteEvent(_id):
    # delete local event images first
    images = json.loads(findEvent(_id))['images']
    deleteImages(images, 'events')

    db.events.delete_one({"_id": ObjectId(_id)})

    return make_response("Successfully deleted document", 200)

@app.route("/api/findEvent/<_id>")
def findEvent(_id):
    event = db.events.find_one({"_id": ObjectId(_id)})

    if event is None:
        return make_response("Invalid tour id", 404)

    return json.dumps(event, default=str)

@app.route("/api/editEvent", methods=["PUT"])
@login_required
def editEvent():
    data = request.get_json()
    
    deleteImages(data['images_to_delete'], 'events')

    event = data['event'] 

    date_time = parser.isoparse(event['date_time'])
    end_date_time = None
    expire_at = date_time + relativedelta(days=+1)

    try:
        end_date_time = parser.isoparse(event['end_date_time'])
        expire_at = end_date_time + relativedelta(days =+ 1) 
    except KeyError:
        pass

    event['date_time'] = date_time
    event['end_date_time'] = end_date_time
    event['expire_at'] = expire_at
    event['primary_image_blurhash'] = getBlurhash(event['images'][event['primary_image'] - 1])

    db.events.update_one({"_id": ObjectId(data['_id'])}, {"$set": event})

    return make_response("Entry has been updated", 200)

# --- TAGS ---

@app.route("/api/fetchTags/<used_for>")
def fetchTags(used_for):
    city_id = request.args.get("city_id", default="",  type=str)

    if used_for == "all":
        return json.dumps(list(db.tags.find({"city_id": city_id})), default=str)

    return json.dumps(list(db.tags.find({"used_for": used_for, "city_id": city_id})), default=str)

@app.route("/api/insertTag", methods=["POST"])
@login_required
def insertTag():
    tag = request.get_json()
    tag['city_id'] = session['city_id']

    db.tags.insert_one(tag) 

    return make_response("New entry inserted", 200)

@app.route("/api/deleteTag/<_id>", methods=["DELETE"])
@login_required
def deleteTag(_id):
    tag = db.tags.find_one({"_id": ObjectId(_id)})

    # Remove this tag from all occurrences 
    if tag['used_for'] == "sights":
        sights = list(db.sights.find({"city_id": session['city_id']}))
         
        for sight in sights:
            if tag['name'] in sight['tags']:
                sight['tags'].remove(tag['name'])
                db.sights.update_one({"_id": ObjectId(sight['_id'])}, {"$set": {"tags": sight['tags']}})
    elif tag['used_for'] == "restaurants":
        restaurants = list(db.restaurants.find({"city_id": session['city_id']}))
         
        for restaurant in restaurants:
            if tag['name'] in restaurant['tags']:
                restaurant['tags'].remove(tag['name'])
                db.restaurants.update_one({"_id": ObjectId(restaurant['_id'])}, {"$set": {"tags": restaurant['tags']}})
    else:
        hotels = list(db.hotels.find({"city_id": session['city_id']}))
         
        for hotel in hotels:
            if tag['name'] in hotel['tags']:
                hotel['tags'].remove(tag['name'])
                db.hotels.update_one({"_id": ObjectId(hotel['_id'])}, {"$set": {"tags": hotel['tags']}})
         
    db.tags.delete_one({"_id": ObjectId(_id)})

    return make_response("Successfully deleted document", 200)

# --- TRENDING --- 

@app.route("/api/insertTrendingItem", methods=["POST"])
@login_required
def insertTrendingItem():
    item = request.get_json()
    item['city_id'] = session['city_id']

    db.trending.insert_one(item) 

    return make_response("New entry has been inserted", 200)

@app.route("/api/fetchTrendingItems")
def fetchTrendingItems():
    city_id = request.args.get("city_id", default="", type=str)

    return json.dumps(list(db.trending.find({"city_id": city_id}).sort("index", 1)), default=str)

@app.route("/api/deleteTrendingItem", methods=["DELETE"])
@login_required
def deleteTrendingItem():
    _id = request.args.get("_id")
    index = int(request.args.get("index"))

    items = list(db.trending.find({"city_id": session['city_id']}))
    
    # Decrease indexes when deleting
    for item in items:
        if item['index'] > index:
            db.trending.update_one({"_id": ObjectId(item['_id'])}, {"$set": {"index": item['index'] - 1}})

    db.trending.delete_one({"_id": ObjectId(_id)})

    return make_response("Successfully deleted document", 200)

@app.route("/api/updateTrendingItemIndex", methods=["PUT"])
@login_required
def updateTrendingItemIndex():
    item = request.get_json()

    db.trending.update_one({"_id": ObjectId(item['_id'])}, {"$set": {"index": item['newIndex']}})

    return make_response("Entry has been updated", 200)

def filterTrendingByItemId(_id):
    # delete corresponding trending item
    trending = db.trending.find({"city_id": session['city_id']})
    item = db.trending.find_one({"item_id": _id})

    if item is not None:
        for trending_item in trending:
            if trending_item['index'] > item['index']:
                db.trending.update_one({"_id": ObjectId(trending_item['_id'])}, {"$set": {"index": trending_item['index'] - 1}})
              
        db.trending.delete_one({"_id": ObjectId(item['_id'])})

# --- ABOUT DATA ---

@app.route("/api/fetchAboutData")
def fetchAboutData():
    city_id = request.args.get("city_id", default="", type=str)

    return json.dumps(db.about.find_one({"city_id": city_id}), default=str);

@app.route("/api/updateAboutParagraph", methods=["PUT"])
@login_required
def updateAboutParagraph():
    updatedContent = request.get_json()

    db.about.update_one({"city_id": session['city_id']}, {"$set": updatedContent})

    return make_response("Entry has been updated", 200)

@app.route("/api/updateContactDetails", methods=["PUT"])
@login_required
def updateContactDetails():
    details = request.get_json()

    db.about.update_one({"city_id": session['city_id']}, {"$set": details})

    return make_response("Entry has been updated", 200)

@app.route("/api/updateCoverImage", methods=["PUT"])
@login_required
def updateCoverImage():
    new_img = request.get_json()
    about = db.about.find_one({"city_id": session['city_id']})

    deleteImages([about['cover_image']], "about")

    db.about.update_one({"city_id": session['city_id']}, {"$set": {"cover_image": new_img['path'], "cover_image_blurhash": getBlurhash(new_img['path'])}})

    return make_response("Entry has been updated", 200)

@app.route("/api/updateHeader", methods=["PUT"])
@login_required
def updateHeader():
    data = request.get_json();
    about = db.about.find_one({"city_id": session['city_id']})

    deleteImages([about['header_image']], "about")

    db.about.update_one({"city_id": session['city_id']}, {"$set": data})

    return make_response("Entry has been updated", 200)

# --- IMAGES ---

def resizeImage(image):
    MEDIUM = 1500
    LARGE = 2100

    w, h = image.size

    if w >= h:
        coef = 0
        breakpoint = MEDIUM;

        if w > LARGE:
            coef = w / LARGE
            breakpoint = LARGE
        elif w > MEDIUM:
            coef = w / MEDIUM
            breakpoint = MEDIUM

        if coef != 0:
            return image.resize((breakpoint, int(h / coef)), Image.Resampling.LANCZOS)
    elif w < h:
        coef = 0
        breakpoint = MEDIUM;

        if h > LARGE:
            coef = h / LARGE
            breakpoint = LARGE;
        elif h > MEDIUM:
            coef = h / MEDIUM
            breakpoint = MEDIUM;

        if coef != 0:
            return image.resize((int(w / coef), breakpoint), Image.Resampling.LANCZOS)

    return image

@app.route("/api/uploadImages/<folder>", methods=["POST"])
@login_required
def uploadImages(folder):
    for image in request.files.getlist('files[]'):
        path = folder + "/" + session['city_id'] + "/" + image.filename 

        compressed = Image.open(image)        
        
        compressed = compressed.convert("RGB")
        compressed = resizeImage(compressed)
        compressed.save(os.path.join(app.config["MEDIA_FOLDER"], path), format="JPEG", optimize=True, quality=60)

    return make_response("Images have been uploaded", 200)

def deleteImages(images, collection):
    for image in images:
        occurrences = 1
        
        if collection == 'sights':
            occurrences = len(list(db.sights.find({"images": image})))
        elif collection == 'tours':
            occurrences = len(list(db.tours.find({"images": image})))
        elif collection == 'restaurants':
            occurrences = len(list(db.restaurants.find({"images": image})))
        elif collection == 'hotels':
            occurrences = len(list(db.hotels.find({"images": image})))
        elif collection == 'events':
            occurrences = len(list(db.events.find({"images": image})))

        if occurrences == 1:
            try:
                os.remove(app.root_path + image)
            except:
                pass

def cleanUpEventsImages():
    # Because of MongoDB TTL index images don't get deleted automatically
    # so i will delete them on the next insert

    folder = "/static/media/events/"
    path = os.path.join(app.config["MEDIA_FOLDER"], "events")
    images = os.listdir(path)

    for image in images:
        occurrences = len(list(db.events.find({"images": folder + image})))

        if occurrences == 0:
            try:
                os.remove(os.path.join(path, image))
            except:
                pass

def getBlurhash(image):
    path = app.root_path + image 
    blur = blurhash.encode(path, x_components=4, y_components=3)
    
    return blur

def createMediaDirectories(city_id):
    os.mkdir(app.config["MEDIA_FOLDER"] + "/sights/" + city_id)
    os.mkdir(app.config["MEDIA_FOLDER"] + "/tours/" + city_id)
    os.mkdir(app.config["MEDIA_FOLDER"] + "/restaurants/" + city_id)
    os.mkdir(app.config["MEDIA_FOLDER"] + "/hotels/" + city_id)
    os.mkdir(app.config["MEDIA_FOLDER"] + "/events/" + city_id)
    os.mkdir(app.config["MEDIA_FOLDER"] + "/about/" + city_id)

def deleteMediaDirectories(city_id):
    try:
        shutil.rmtree(app.config["MEDIA_FOLDER"] + "/sights/" + city_id + "/")
        shutil.rmtree(app.config["MEDIA_FOLDER"] + "/tours/" + city_id + "/")
        shutil.rmtree(app.config["MEDIA_FOLDER"] + "/restaurants/" + city_id + "/")
        shutil.rmtree(app.config["MEDIA_FOLDER"] + "/hotels/" + city_id + "/")
        shutil.rmtree(app.config["MEDIA_FOLDER"] + "/events/" + city_id + "/")
        shutil.rmtree(app.config["MEDIA_FOLDER"] + "/about/" + city_id + "/")
    except:
        pass

def init_dir():
    if not os.path.exists(app.config["MEDIA_FOLDER"] + "/sights"):
        os.makedirs(app.config["MEDIA_FOLDER"] + "/sights")
    if not os.path.exists(app.config["MEDIA_FOLDER"] + "/tours"):
        os.makedirs(app.config["MEDIA_FOLDER"] + "/tours")
    if not os.path.exists(app.config["MEDIA_FOLDER"] + "/restaurants"):
        os.makedirs(app.config["MEDIA_FOLDER"] + "/restaurants")
    if not os.path.exists(app.config["MEDIA_FOLDER"] + "/hotels"):
        os.makedirs(app.config["MEDIA_FOLDER"] + "/hotels")
    if not os.path.exists(app.config["MEDIA_FOLDER"] + "/events"):
        os.makedirs(app.config["MEDIA_FOLDER"] + "/events")
    if not os.path.exists(app.config["MEDIA_FOLDER"] + "/about"):
        os.makedirs(app.config["MEDIA_FOLDER"] + "/about")

@app.route("/api/serverStorage")
def serverStorage():
    ssd = shutil.disk_usage("/")

    return json.dumps({
        "total": round(ssd.total / (2**30), 1), 
        "used": round(ssd.used / (2**30), 1)
    })

if __name__ == '__main__':
    init_dir()
    app.run(debug=True)

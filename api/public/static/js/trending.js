import { appendImageElement, endLoadingAnimation, idRegExp, idRegExpTitle, startLoadingAnimation } from "./utils.js";

let items = [];

let formData = new FormData();
let current_image = undefined;

const appendElements = async () => {
  items = await $.getJSON("/api/fetchTrendingItems?city_id=" + Cookies.get("cityId"));

  if (items.length === 0) {
    $(".trending-container").empty().addClass("empty").append(`<p>No items in list</p>`);

    return;
  }

  $(".trending-container").removeClass("empty").empty();

  const refItems = await Promise.all(items.map((item) => getNameImageItem(item)));

  items.map((item, index) => {
    const { name, image } = refItems[index];

    $(".trending-container").append(
      `<article class="trending-item" id="${item._id}">
        <img src="${image}" alt="${name}">
        <footer>
          <p>${name}</p>
          <div class="loading-spinner"></div>
          <ion-icon name="heart-outline"></ion-icon>
          <button class="btn btn-icon remove-item">
            <ion-icon name="close-outline"></ion-icon>
          </button>
        </footer>
      </article> `
    );
  });

  const list = document.querySelector(".trending-container");

  new Sortable(list, {
    animation: 150,
    easing: "cubic-bezier(0.65, 0, 0.35, 1)",
    delay: 200,
    delayOnTouchOnly: true,
    onEnd: async function (e) {
      for (let i = Math.min(e.oldIndex, e.newIndex); i <= Math.max(e.oldIndex, e.newIndex); i++) {
        $(".trending-container article").eq(i).find("footer").addClass("loading");
      }

      for (let i = Math.min(e.oldIndex, e.newIndex); i <= Math.max(e.oldIndex, e.newIndex); i++) {
        await $.ajax({
          type: "PUT",
          url: "/api/updateTrendingItemIndex",
          data: JSON.stringify({ _id: $(".trending-container article").eq(i).attr("id"), newIndex: i }),
          processData: false,
          contentType: "application/json; charset=UTF-8",
        });

        await new Promise((resolve) => {
          setTimeout(() => {
            $(".trending-container article").eq(i).find("footer").removeClass("loading");
            resolve();
          }, 250);
        });
      }
    },
  });
};

const getNameImageItem = async (item) => {
  if (item.type === "sight") {
    const { name, images, primary_image } = await $.getJSON("/api/findSight/" + item.item_id);
    return { name: name, image: images[primary_image - 1] };
  } else if (item.type === "restaurant") {
    const { name, images, primary_image } = await $.getJSON("/api/findRestaurant/" + item.item_id);
    return { name: name, image: images[primary_image - 1] };
  } else if (item.type === "hotel") {
    const { name, images, primary_image } = await $.getJSON("/api/findHotel/" + item.item_id);
    return { name: name, image: images[primary_image - 1] };
  }
};

$(document).ready(async function () {
  // Initialize
  appendElements();

  // Insert item
  $("#item-id").attr("pattern", idRegExp).attr("title", idRegExpTitle);

  $("#add-item").click(function () {
    $(this).addClass("d-none");
    $("#trending-form").removeClass("d-none");
  });

  // Remove item
  $(".trending-container").on("click", ".remove-item", async function () {
    const article = $(this).parent().parent();

    await $.ajax({
      type: "DELETE",
      url: "/api/deleteTrendingItem?" + $.param({ _id: article.attr("id"), index: article.index() }),
    });

    appendElements();
  });

  // SUBMIT
  $("#trending-form").submit(async function (e) {
    e.preventDefault();

    const item = {
      item_id: $("#item-id").val(),
      type: "",
      index: items.length,
    };

    if (items.filter((i) => i.item_id === item.item_id).length > 0) {
      alert("Item already present in list");
      $("#item-id").val("");

      return;
    }

    const sight = await $.getJSON("/api/findSight/" + item.item_id).catch(() => {});
    const restaurant = await $.getJSON("/api/findRestaurant/" + item.item_id).catch(() => {});
    const hotel = await $.getJSON("/api/findHotel/" + item.item_id).catch(() => {});

    if (sight !== undefined) {
      item.type = "sight";
    } else if (restaurant !== undefined) {
      item.type = "restaurant";
    } else if (hotel !== undefined) {
      item.type = "hotel";
    } else {
      alert("ERROR: Not a valid sight/restaurant/hotel id!");
    }

    if (sight !== undefined || restaurant !== undefined || hotel !== undefined) {
      await $.ajax({
        type: "POST",
        url: "/api/insertTrendingItem",
        contentType: "application/json; charset=UTF-8",
        processData: false,
        data: JSON.stringify(item),
      });

      appendElements();
    }

    $("#add-item").removeClass("d-none");
    $("#item-id").val("");
    $(this).addClass("d-none");
  });

  // HOME SCREEN HEADER
  const data = await $.getJSON("/api/fetchAboutData?city_id=" + Cookies.get("cityId"));
  const cityName = (await $.getJSON("/api/currentCityName")).name;

  if (data.header_title !== "") {
    $("#title-preview").text("Preview: " + cityName + " - " + data.header_title);
  }

  $("#header-title").val(data.header_title);
  $("#header-title").on("input", function () {
    $("#title-preview").text("Preview: " + cityName + " - " + $(this).val());
  });

  current_image = data.header_image;
  if (current_image !== "") {
    appendImageElement(current_image, true);
    $("#header-image").prop("required", false);
  }

  $("#header-image").change(function () {
    $(this).prop("required", false);

    if ($(".img-container").children().length > 0) {
      alert("You must have only one header image!");
      $(this).val(null);
      return;
    }

    const file = $(this).prop("files")[0];

    formData.append("files[]", file);
    current_image = "/static/media/about/" + Cookies.get("cityId") + "/" + file.name;

    appendImageElement(file.name);

    $(this).val(null);
  });

  $(".img-container").on("click", ".remove-img-btn", function () {
    $("#header-image").prop("required", true);

    formData.delete("files[]");
    current_image = undefined;

    $(this).parent().remove();
  });

  $("#header-form").submit(async function (e) {
    e.preventDefault();

    startLoadingAnimation($(this));

    try {
      await $.ajax({
        type: "POST",
        url: "/api/uploadImages/about",
        contentType: false,
        data: formData,
        cache: false,
        processData: false,
        statusCode: {
          413: function () {
            alert("Files size should be less than 15MB");
          },
        },
      });

      await $.ajax({
        type: "PUT",
        url: "/api/updateHeader",
        contentType: "application/json; charset=UTF-8",
        processData: false,
        data: JSON.stringify({ header_title: $("#header-title").val(), header_image: current_image }),
      });

      endLoadingAnimation($(this));
    } catch {
      endLoadingAnimation($(this));
    }
  });

  $("body").click(function (e) {
    if (
      !document.querySelector("#trending-form").contains(e.target) &&
      !document.querySelector("#add-item").contains(e.target)
    ) {
      $("#add-item").removeClass("d-none");
      $("#trending-form").addClass("d-none");
    }
  });
});

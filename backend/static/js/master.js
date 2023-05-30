import { endLoadingAnimation, startLoadingAnimation } from "./utils.js";

let users = [];
let cities = [];
let city = {
  name: "",
  state: "",
  fullname: "",
  username: "",
  password: "",
};

const getRecords = (data) => {
  if (data.length === 0) return "No records";
  else if (data.length === 1) return "1 record";
  else return `${data.length} records`;
};

const fetchCities = async () => {
  users = await $.getJSON("/api/fetchAdminUsers");
  cities = await Promise.all(users.map((user) => $.getJSON(`/api/findCity/${user.city_id}`)));

  $("#cities-records").text(getRecords(users));
  $("#cities-table tbody").empty();

  users.map((user, index) => {
    $("#cities-table").append(
      `<tr>
        <td class="small-cell">${index + 1}</td>
        <td>${user.fullname}</td>
        <td>${user.username}</td>
        <td>${cities[index].name}</td>
        <td>${cities[index].state}</td>
        <td class="small-cell text-center" id=${user.city_id}>
          <button class="btn-icon action-delete-city"><ion-icon class="edit-icon" name="remove-circle-outline"></ion-icon></button>
          <button class="btn-icon action-edit-user" data-bs-toggle="modal" data-bs-target="#edit-user-modal"><ion-icon class="edit-icon" name="create-outline"></ion-icon></button>
        </td>
      </tr>`
    );
  });
};

$(document).ready(async function () {
  await fetchCities();

  $("#cities-table").on("click", ".action-delete-city", async function () {
    if (confirm("Are you sure you want to delete the entry?")) {
      await $.ajax({
        type: "DELETE",
        url: "/api/deleteCity/" + $(this).parent().attr("id"),
      });

      await fetchCities();
    }
  });

  $(".eye-icon").on("click", function () {
    const passwordField = $(this).siblings();

    if (passwordField.attr("type") === "password") {
      $(this).attr("name", "eye-outline");
      passwordField.attr("type", "text");
    } else {
      $(this).attr("name", "eye-off-outline");
      passwordField.attr("type", "password");
    }
  });

  $("#edit-user-modal").on("hidden.bs.modal", function () {
    $("#edit-user-form")[0].reset();
  });

  $("#edit-user-form").submit(async function (e) {
    e.preventDefault();

    startLoadingAnimation($(this));
    await new Promise((resolve) => setTimeout(resolve, 300));

    await $.ajax({
      type: "PUT",
      url: "/api/editUserPassword/" + $("#edit-user-modal").attr("data-id"),
      contentType: "application/json; charset=UTF-8",
      processData: false,
      data: JSON.stringify({ new_password: $("#new-password").val() }),
    });

    endLoadingAnimation($(this));
    $(this)[0].reset();
    $("#edit-user-modal").modal("hide");
  });

  $("#insert-city-form").submit(async function (e) {
    e.preventDefault();

    startLoadingAnimation($(this));

    city.name = $("#city-name").val();
    city.state = $("#city-state").val();
    city.fullname = $("#fullname").val();
    city.username = $("#username").val();
    city.password = $("#password").val();

    if (cities.filter((c) => c.name == city.name && c.state == city.state).length > 0) {
      alert("City already exists");
      endLoadingAnimation($(this));
      return;
    }

    await $.ajax({
      type: "POST",
      url: "/api/insertCity",
      contentType: "application/json; charset=UTF-8",
      processData: false,
      data: JSON.stringify(city),
    });

    location.reload();
  });
});

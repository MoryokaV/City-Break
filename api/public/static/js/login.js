$(document).ready(function () {
  $("form").submit(function (e) {
    e.preventDefault();

    $.ajax({
      url: "/login",
      type: "POST",
      data: JSON.stringify({
        username: $("#user").val(),
        password: $("#pass").val(),
      }),
      processData: false,
      contentType: "application/json; charset=UTF-8",
      success: function (data) {
        window.location.replace(data.url);
      },
      error: function (data) {
        alert(data.responseText);
      },
    });
  });

  $(".eye-icon").on("click", function () {
    const passwordField = $("#pass");

    if (passwordField.attr("type") === "password") {
      $(this).attr("name", "eye-outline");
      passwordField.attr("type", "text");
    } else {
      $(this).attr("name", "eye-off-outline");
      passwordField.attr("type", "password");
    }
  });
});

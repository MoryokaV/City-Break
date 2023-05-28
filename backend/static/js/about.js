import {
  startLoadingAnimation,
  endLoadingAnimation,
  phoneRegExp,
  phoneRegExpTitle,
  appendImageElement
} from './utils.js';

let paragraph1 = undefined;

const LIMIT = 500;

let formData = new FormData();
let current_image = undefined;

$(document).ready(async function() {
  const data = await $.getJSON("/api/fetchAboutData?city_id=" + Cookies.get("cityId"))

  // PARAGRAPH

  $("#paragraph-1-heading").val(data.heading1);

  paragraph1 = new Quill("#paragraph-1-content", {
    theme: "snow",
    placeholder: "Type something here...",
  });
  $("#paragraph-1-content .ql-editor").html(data.paragraph1);

  paragraph1.on('text-change', function() {
    if (paragraph1.getLength() > LIMIT) {
      paragraph1.deleteText(LIMIT, paragraph1.getLength());
    }
  });

  $("#paragraphs-form").submit(async function(e) {
    e.preventDefault();

    startLoadingAnimation($(this));

    await $.ajax({
      type: "PUT",
      url: "/api/updateAboutParagraph?city_id=" + Cookies.get("cityId"),
      data: JSON.stringify({ "paragraph1": paragraph1.root.innerHTML, "heading1": $("#paragraph-1-heading").val() }),
      processData: false,
      contentType: "application/json; charset=UTF-8",
    });

    setTimeout(() => endLoadingAnimation($(this)), 400);
  });

  // CONTACT
  $("#organization").val(data.organization);

  $("#phone").attr("pattern", phoneRegExp).attr("title", phoneRegExpTitle);
  $("#phone").val(data.phone);

  $("#email").val(data.email);

  $("#website").val(data.website);
  $("#facebook").val(data.facebook);

  $("#contact-form").submit(async function(e) {
    e.preventDefault();

    startLoadingAnimation($(this));

    const organization = $("#organization").val();
    const phone = $("#phone").val();
    const email = $("#email").val();
    const website = $("#website").val();
    const facebook = $("#facebook").val();

    await $.ajax({
      type: "PUT",
      url: "/api/updateContactDetails?city_id=" + Cookies.get("cityId"),
      data: JSON.stringify({ "organization": organization, "phone": phone, "email": email, "website": website, "facebook": facebook }),
      processData: false,
      contentType: "application/json; charset=UTF-8",
    });

    setTimeout(() => endLoadingAnimation($(this)), 400);
  });

  // COVER IMAGE
  current_image = data.cover_image;
  if (current_image !== "") {
    appendImageElement(current_image, true);
  }

  $("#cover-image").change(function() {
    $(this).prop("required", false);

    if ($(".img-container").children().length > 0) {
      alert("You must have only one cover image!")
      return;
    }

    const file = $(this).prop("files")[0];

    formData.append("files[]", file);
    current_image = "/static/media/about/" + file.name;

    appendImageElement(file.name);

    $(this).val(null);
  });

  $(".img-container").on("click", ".remove-img-btn", function() {
    $("#cover-image").prop("required", true);

    formData.delete("files[]");
    current_image = undefined

    $(this).parent().remove();
  });

  $("#cover-form").submit(async function(e) {
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
          413: function() {
            alert("Files size should be less than 15MB")
          }
        },
      });

      await $.ajax({
        type: "PUT",
        url: "/api/updateCoverImage?city_id=" + Cookies.get("cityId"),
        data: JSON.stringify({ "path": current_image }),
        processData: false,
        contentType: "application/json; charset=UTF-8",
      });

      location.reload();
    } catch {
      endLoadingAnimation($(this));
    }
  });
});

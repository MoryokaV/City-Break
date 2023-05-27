import { tagRegExp, tagRegExpTitle } from './utils.js';

let tags = [];

const getDotColor = (used_for) => {
  if (used_for === "sights") {
    return "dot-green";
  } else if (used_for === "restaurants") {
    return "dot-purple";
  } else {
    return "dot-yellow";
  }
}

const fetchTags = async () => {
  $("#tags-table tbody").empty();

  tags = await $.getJSON("/api/fetchTags/all?city_id=" + Cookies.get("cityId"));

  tags.map((tag, index) => {
    $("#tags-table tbody").append(
      `<tr>
        <td class="small-cell">${index + 1}</td> 
        <td>
          <div class="highlight-onhover" id="${tag._id}">
            <p class="dot ${getDotColor(tag.used_for)}">${tag.name}</p>
            <button type="button" class="btn btn-icon remove-tag-btn">
              <ion-icon name="close-outline"></ion-icon>
            </button>
          </div>
        </td>
      </tr>`
    );
  });
}

$(document).ready(async function() {
  $("#tag").attr("pattern", tagRegExp).attr("title", tagRegExpTitle);
  await fetchTags();

  $("#tags-table").on('click', ".remove-tag-btn", async function() {
    await $.ajax({
      type: "DELETE",
      url: "/api/deleteTag/" + $(this).parent().attr("id") + "?city_id=" + Cookies.get("cityId"),
    });

    await fetchTags();
  });


  $("#insert-tag-form").submit(async function(e) {
    e.preventDefault();

    const name = $("#tag").val();
    const used_for = $('#insert-tag-form input[type=radio]:checked').val()

    if (tags.filter((tag) => tag.name === name && tag.used_for == used_for).length > 0) {
      alert("Tag already exists");
      return;
    }

    await $.ajax({
      type: "POST",
      url: "/api/insertTag",
      contentType: "application/json; charset=UTF-8",
      processData: false,
      data: JSON.stringify({ "name": name, "used_for": used_for }),
    });

    $(this).trigger("reset");

    await fetchTags();
  });
});

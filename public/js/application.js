document.addEventListener("DOMContentLoaded", function(){
  /* @TODO Add cookie w/ token; check for token to lookup favorites */

  var search_uri = "/search.json";

  /* DOM Elements */
  var movie_search_form = document.getElementById("movie-search-form");
  var query = document.getElementById("movie-search-query");
  var search_results = document.getElementById("search-results-list");
  var expandable = document.getElementsByClassName("expandable");

  /* Display Data */
  var error_no_results = "<p class=\"error\">No results found.</p>";

  /* Events */
  movie_search_form.addEventListener("submit", function(e){
    search_by_keyword(query.value);
    e.preventDefault();
  });

  function search_by_keyword(keyword){
    var xhr = new XMLHttpRequest();
    var keyword = encodeURI(keyword);

    xhr.open("GET", search_uri + "?keyword=" + keyword, true);
    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          data = JSON.parse(xhr.responseText);
          populate_results(data);
        }
      }
    };
    xhr.send();
  }

  function populate_results(data){
    search_results.innerHTML = ""; //clear old results

    data_collection = data.Search;

    if(data_collection === undefined){
      search_results.innerHTML = error_no_results;
    } else {
      for(var i = 0; i < data_collection.length - 1; i++){
        var el = document.createElement("li");
        var title = data_collection[i].Title;

        el.className = "expandable closed";
        el.innerHTML = "<div class=\"star\"></div>";
        el.innerHTML += "<h2>" + title + "</h2>";

        /* The API doesn't return the same data for search queries and
         * title searches, so we have to make a title search for each
         * result */
        populate_details(title, el);

        search_results.appendChild(el);

        el.onclick = function(e){
          if(e.target.className.indexOf("star") != -1){
            toggle_favorite(e.target);
          } else {
            toggle(this);
          }

          e.preventDefault();
        }
      }
    }
  }

  function populate_details(title, el){
    var xhr = new XMLHttpRequest();
    var title = encodeURI(title);

    xhr.open("GET", search_uri + "?title=" + title, true);
    xhr.onreadystatechange = function(){
      if (xhr.readyState == 4) {
        if (xhr.status == 200) {
          data = JSON.parse(xhr.responseText);

          el.innerHTML += "<div class=\"data\">";
          data_container = el.getElementsByClassName("data")[0];
          data_container.innerHTML += "<p><strong>Released:</strong> " + data.Released + "</p>";
          data_container.innerHTML += "<p><strong>Genre:</strong> " + data.Genre + "</p>";
          data_container.innerHTML += "<p><strong>Actors:</strong> " + data.Actors + "</p>";
          data_container.innerHTML += "<p><strong>Plot:</strong> " + data.Plot + "</p>";
        }
      }
    };
    xhr.send();
  }

  function toggle(el){
    if(el.classList.contains("open")){
      el.className = "expandable closed";
    } else {
      el.className = "expandable open";
    }
  }

  function toggle_favorite(el){
    /* @TODO Add API Calls to add/remove favorite */
    if(el.classList.contains("checked")){
      el.className = "star";
    } else {
      el.className = "star checked";
    }
  }
});

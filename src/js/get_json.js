var getJSON = function(url, callback) {
  xhr = new XMLHttpRequest;
  xhr.onreadystatechange = function() {
      if (xhr.readyState == 4 && xhr.status == 200) {
          callback(JSON.parse(xhr.responseText));
      }
  }
  xhr.open("GET", url)
  xhr.send();
}

module.exports = getJSON;

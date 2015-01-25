function searchImages(site, search, opts) {
	var queryURL = (opts.ssl ? "https" : "http") + "://" + site;
	queryURL += "/w/api.php";
	queryURL += "?action=query";
	queryURL += "&format=json";
	queryURL += "&generator=search";
	queryURL += "&gsrnamespace=6";
	queryURL += "&gsrsearch=" + encodeURIComponent(search);
	queryURL += "&gsrlimit=" + (opts.limit || 10);
	queryURL += "&gsroffset=" + (opts.offset || 0);
	queryURL += "&prop=imageinfo";
	queryURL += "&iiprop=url";
	queryURL += "&iiurlwidth=200";
	
	var searchImageScript = document.createElement("script");
	searchImageScript.setAttribute("type", "text/javascript");
	searchImageScript.setAttribute("src", queryURL + "&callback=" + opts.callback);
	document.head.appendChild(searchImageScript);
}

function cbSearchImages(data) {
	document.getElementById("search-results").innerHTML = "";
	for(var page in data.query.pages) {
		if(data.query.pages.hasOwnProperty(page)) {
			renderImage(
				data.query.pages[page].imageinfo[0].thumburl, 
				data.query.pages[page].imageinfo[0].descriptionurl,
				data.query.pages[page].title
			);
		}
	}		
}

function renderImage(thumburl, descriptionurl, title) {
	var result = "<tr>";
	result +=    "	<td><img src='"+thumburl+"' alt='"+thumburl+"'></td>";
	result +=    "	<td><a href='"+descriptionurl+"'>"+title+"</a></td>";
	result +=    "</tr>";
	
	document.getElementById("search-results").innerHTML += result;
}

document.getElementById("search-form").onsubmit = function() {
	searchImages("en.wikipedia.org", this["search-field"].value, {
		ssl: true,
		limit: 10,
		callback: "cbSearchImages"
	});
	return false;
}